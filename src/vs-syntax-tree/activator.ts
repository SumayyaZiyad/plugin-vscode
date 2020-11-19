import * as vscode from 'vscode';
import { ExtendedLangClient } from '../core/extended-language-client';
import { BallerinaExtension } from '../core';
import { getCommonWebViewOptions, WebViewMethod, WebViewRPCHandler } from '../utils';
import { render } from './renderer';

let syntaxTreePanel: vscode.WebviewPanel | undefined;

function validateForVisualization(context: vscode.ExtensionContext, langClient: ExtendedLangClient) :void {
    if (syntaxTreePanel){
        syntaxTreePanel.dispose();
    }

    if (vscode.window.activeTextEditor){
        if (!vscode.window.activeTextEditor.document.fileName.endsWith('.bal')){
            vscode.window.showErrorMessage("Syntax Tree Extension: Please open a Ballerina source file");
        }

        else {
            visualizeSyntaxTree(context, langClient, vscode.window.activeTextEditor);
        }
    }
    
    else {
        vscode.window.showWarningMessage("There is no active file in your workspace.");
    }
   
}

function visualizeSyntaxTree(context: vscode.ExtensionContext, langClient: ExtendedLangClient, activeEditor: vscode.TextEditor){
    let sourceRoot = activeEditor.document.uri.path;

    syntaxTreePanel = vscode.window.createWebviewPanel(
        'visualizeSyntaxTree',
        'Syntax Tree Visualizer',
        { 
            viewColumn: vscode.ViewColumn.One, 
        },
        getCommonWebViewOptions()
    );

    const remoteMethods: WebViewMethod[] = [
        {
            methodName: "fetchSyntaxTree",
            handler: (args: any): Thenable<any> => {
                return langClient.getSyntaxTree(vscode.Uri.file(args[0]));
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