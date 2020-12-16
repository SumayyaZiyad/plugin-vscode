import * as vscode from 'vscode';
import ELK from 'elkjs/lib/elk.bundled';

import * as _ from 'lodash';
import { ExtendedLangClient } from '../core/extended-language-client';
import { BallerinaExtension } from '../core';
import { getCommonWebViewOptions, WebViewMethod, WebViewRPCHandler } from '../utils';
import { render } from './renderer';
import { retrieveGraph, updateSyntaxTree } from './tools/graphGenerator';

let syntaxTreePanel: vscode.WebviewPanel | undefined;
let activeEditor: vscode.TextEditor;

function validateForVisualization(context: vscode.ExtensionContext, langClient: ExtendedLangClient) :void {    
    if (vscode.window.activeTextEditor){
        activeEditor = vscode.window.activeTextEditor;

        if (!activeEditor.document.fileName.endsWith('.bal')){
            vscode.window.showErrorMessage("Syntax Tree Extension: Please open a Ballerina source file.");
        }
        else {
            let sourceRoot = activeEditor.document.uri.path;
            visualizeSyntaxTree(context, langClient, sourceRoot);
        }
    }    
    else {
        vscode.window.showWarningMessage("Syntax Tree Extension: Source file has not been detected.");
    }
   
}

function visualizeSyntaxTree(context: vscode.ExtensionContext, langClient: ExtendedLangClient, sourceRoot: string){    
    vscode.workspace.onDidChangeTextDocument(_.debounce(() => {
        if (syntaxTreePanel){
            syntaxTreePanel.webview.postMessage({
                command: 'update',
                docUri: sourceRoot
            });
        }
    }, 500));

    createSyntaxTreePanel(context, langClient, sourceRoot);
}

function createSyntaxTreePanel(context: vscode.ExtensionContext, langClient: ExtendedLangClient, sourceRoot: string){
    if (syntaxTreePanel){
        syntaxTreePanel.dispose();
    }

    syntaxTreePanel = vscode.window.createWebviewPanel(
        'visualizeSyntaxTree',
        'Syntax Tree Visualizer',
        { 
            viewColumn: vscode.ViewColumn.One
        },
        getCommonWebViewOptions()
    );

    const elk = new ELK();

    const remoteMethods: WebViewMethod[] = [
        {
            methodName: "fetchTreeGraph",
            handler: (args: any[]): Thenable<any> => {
                const response = retrieveGraph(args[0]); 
                return elk.layout(response);
            }
        },
        {
            methodName: "fetchSyntaxTree",
            handler: (args: any[]): Thenable<any> => {
                return langClient.getSyntaxTree(vscode.Uri.file(args[0]));
            }
        },
        {
            methodName: "onCollapseTree",
            handler: (args: any[]): Thenable<any> => {
                const response = updateSyntaxTree(args[0]);
                return elk.layout(response);
            }
        }
    ];

    WebViewRPCHandler.create(syntaxTreePanel, langClient, remoteMethods);
    const displayHtml = render(context, langClient, sourceRoot);
    syntaxTreePanel.webview.html = displayHtml;
}

export function activate(ballerinaExtInstance: BallerinaExtension) {
    const context = <vscode.ExtensionContext> ballerinaExtInstance.context;
    const langClient = <ExtendedLangClient> ballerinaExtInstance.langClient;
    const syntaxTreeCommand = vscode.commands.registerCommand('ballerina.visualizeSyntaxTree', () => {
        validateForVisualization(context, langClient);
    });
    
    context.subscriptions.push(syntaxTreeCommand);
}
