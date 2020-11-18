import * as vscode from 'vscode';
import { ExtendedLangClient } from '../core/extended-language-client';
import { BallerinaExtension } from '../core';
import { getCommonWebViewOptions, WebViewMethod, WebViewRPCHandler } from '../utils';
import { render } from './renderer';

let syntaxTreePanel: vscode.WebviewPanel | undefined;

function visualizeSyntaxTree(context: vscode.ExtensionContext, langClient: ExtendedLangClient, ballerinaExtInstance: BallerinaExtension) :void {
    if (syntaxTreePanel){
        syntaxTreePanel.dispose();
    }

    if (vscode.window.activeTextEditor){
        let sourceRoot = vscode.window.activeTextEditor.document.uri.path;

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
    
    else {
        console.log("Unsuccessful! No file is detected for tree visualization");
        vscode.window.showWarningMessage("There is no active file in your workspace.");
    }
   
}

export function activate(ballerinaExtInstance: BallerinaExtension) {
    const context = <vscode.ExtensionContext> ballerinaExtInstance.context;
    const langClient = <ExtendedLangClient> ballerinaExtInstance.langClient;
    const syntaxTreeCommand = vscode.commands.registerCommand('ballerina.visualizeSyntaxTree', () => {
        visualizeSyntaxTree(context, langClient, ballerinaExtInstance);
    });
    
    context.subscriptions.push(syntaxTreeCommand);
}