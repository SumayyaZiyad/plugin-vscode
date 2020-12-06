import { ExtendedLangClient } from '../core/extended-language-client';
import { ExtensionContext } from 'vscode';
import { getLibraryWebViewContent, WebViewOptions, getComposerWebViewOptions } from '../utils';

export function render(context: ExtensionContext, langClient: ExtendedLangClient, sourceRoot: string)
    : string {

    const body = `
            <div id="treeBody" />
    `;
    const bodyCss = ``;
    const styles = ``;
    const scripts = `
        function loadedScript() {
            let docUri = ${JSON.stringify(sourceRoot)};

            window.addEventListener('message', event => {
                let msg = event.data;
                switch(msg.command){
                    case 'update':
                        docUri: msg.docUri;
                        initiateRendering();
                }
            });

            function renderTree(){
                return new Promise((resolve, reject) => {
                    webViewRPCHandler.invokeRemoteMethod('fetchSyntaxTree', [docUri], (response) => {
                        webViewRPCHandler.invokeRemoteMethod('fetchTreeGraph', [response], (result) => {
                            resolve(result);
                        });
                    });
                })
            }

            function expandNodes(){
                return new Promise((resolve, reject) => {
                    webViewRPCHandler.invokeRemoteMethod('onCollapseTree', [], (response) => {
                        resolve(response);
                    });
                })
            }

            function collapseTree(nodeID){
                console.log("From renderer: collapse tree has been invoked for id ", nodeID);
                ballerinaComposer.renderSyntaxTree(collapseTree, expandNodes, document.getElementById("treeBody"));
            }

            function initiateRendering(){
                console.log("The initiator is being called");
                ballerinaComposer.renderSyntaxTree(collapseTree, renderTree, document.getElementById("treeBody"));
            }

            initiateRendering();
        }
    `;

    const webViewOptions: WebViewOptions = {
        ...getComposerWebViewOptions(),
        body, scripts, styles, bodyCss
    };
    
    return getLibraryWebViewContent(webViewOptions);
}