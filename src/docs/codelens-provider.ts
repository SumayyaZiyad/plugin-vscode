import * as vscode from 'vscode';
import { ExtendedLangClient } from '../core/extended-language-client';

enum NODE_TYPES { FUNCTION = "Function", CLASS = "ClassDefn", TYPE = "TypeDefinition", RECORD = "RecordType" }
enum API_DOC_DIR { FUNCTION = "functions", CLASS = "classes", RECORD = "records", OBJECT = "abstractobjects" }

/**
 * CodelensProvider for API document generation.
 */
export class CodelensProvider implements vscode.CodeLensProvider {

    private client: ExtendedLangClient;
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    constructor(client: ExtendedLangClient) {
        this.client = client;
        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }

    public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
        let codeLenses: vscode.CodeLens[] = [];
        if (vscode.workspace.getConfiguration("codelens-docs").get("enableCodeLens", true)) {
            return this.getCodeLensList(document);
        }
        return codeLenses;
    }

    public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
        if (vscode.workspace.getConfiguration("codelens-docs").get("enableCodeLens", true)) {
            return codeLens;
        }
        return null;
    }

    private getCodeLensList(document: vscode.TextDocument): Thenable<vscode.CodeLens[]> {
        return this.client.getAST(document.uri).then((response) => this.loadCodeLensList(response));
    }

    private loadCodeLensList(response) {
        let codeLenses: vscode.CodeLens[] = [];
        if (!response.ast || !response.ast.topLevelNodes) {
            return codeLenses;
        }

        const documentables = [NODE_TYPES.FUNCTION, NODE_TYPES.TYPE, NODE_TYPES.CLASS];
        const topNodes = response.ast.topLevelNodes;
        for (let nodeIndex = 0; nodeIndex < topNodes.length; nodeIndex++) {
            const node = topNodes[nodeIndex];
            if (documentables.indexOf(node.kind) !== -1) {
                if (node.markdownDocumentationAttachment && node.public) {
                    codeLenses.push(this.createCodeLens(node));
                    continue;
                }

                if (node.kind === NODE_TYPES.CLASS && node.public && node.functions) {
                    const classChildrenArray = node.functions;
                    let isAdded = false;
                    for (let index = 0; index < classChildrenArray.length; index++) {
                        const childFunction = classChildrenArray[index];
                        if (!isAdded && childFunction.markdownDocumentationAttachment && childFunction.public) {
                            codeLenses.push(this.createCodeLens(node));
                            isAdded = true;
                            break;
                        }
                    }

                    if (!isAdded && node.initFunction && node.initFunction.markdownDocumentationAttachment
                        && node.initFunction.public) {
                        codeLenses.push(this.createCodeLens(node));
                    }

                } else if (node.kind === NODE_TYPES.TYPE && node.public && node.typeNode && node.typeNode.functions) {
                    const typeChildrenArray = node.typeNode.functions;
                    for (let index = 0; index < typeChildrenArray.length; index++) {
                        const childFunction = typeChildrenArray[index];
                        if (childFunction.markdownDocumentationAttachment && childFunction.public) {
                            codeLenses.push(this.createCodeLens(node));
                            break;
                        }
                    }
                }
            }
        }
        return codeLenses;
    }

    private createCodeLens(node): vscode.CodeLens {
        const { position } = node.markdownDocumentationAttachment ? node.markdownDocumentationAttachment : node;
        const startLine = position.startLine;
        const startColumn = position.startColumn;
        const endLine = position.endLine;
        const endColumn = position.endColumn;
        const codeLens = new vscode.CodeLens(new vscode.Range(startLine, startColumn, endLine, endColumn));
        codeLens.command = {
            title: "Preview Docs",
            tooltip: "Click to preview documentation",
            command: "ballerina.showDocs",
            arguments: [
                {
                    moduleName: this.getModuleName(node),
                    nodeType: this.getNodeType(node),
                    nodeName: this.getNodeName(node)
                }
            ]
        };
        return codeLens;
    }

    private getNodeType(node): string {
        if (node.kind === NODE_TYPES.FUNCTION) {
            return API_DOC_DIR.FUNCTION;
        }
        if (node.kind === NODE_TYPES.CLASS) {
            return API_DOC_DIR.CLASS;
        }
        if (node.kind === NODE_TYPES.TYPE) {
            if (node.typeNode.kind === NODE_TYPES.RECORD) {
                return API_DOC_DIR.RECORD;
            }
            return API_DOC_DIR.OBJECT;
        }
        return '';
    }

    private getModuleName(node): string {
        if (node.typeInfo) {
            return node.typeInfo.modName;
        }
        if (node.kind === NODE_TYPES.TYPE && node.typeNode) {
            return node.typeNode.typeInfo.modName;
        }
        return '';
    }

    private getNodeName(node): string {
        return node.name.value;
    }
}

