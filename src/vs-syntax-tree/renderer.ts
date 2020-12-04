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

            function fetchTree(){
                return new Promise((resolve, reject) => {
                    webViewRPCHandler.invokeRemoteMethod('fetchSyntaxTree', [docUri], (response) => {
                        resolve(response);
                    });
                })
            }

            function fetchGraph(syntaxTree){
                return new Promise((resolve, reject) => {
                    webViewRPCHandler.invokeRemoteMethod('fetchTreeGraph', [syntaxTree], (response) => {
                        resolve(response);
                    });
                })
            }

            function renderTree(){
                return fetchTree().then((response)=>{
                    return fetchGraph(response);
                })
            }

            function onCollapseTree(nodeID){
                console.log("From renderer: collapse tree has been invoked for id ", nodeID);
                webViewRPCHandler.invokeRemoteMethod('onCollapseTree', [nodeID]);
            }

            function initiateRendering(){
                console.log("The initiator is being called");
                ballerinaComposer.renderSyntaxTree(onCollapseTree, renderTree, document.getElementById("treeBody"));
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