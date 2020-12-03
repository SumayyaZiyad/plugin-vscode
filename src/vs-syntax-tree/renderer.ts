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
            window.addEventListener('message', event => {
                let msg = event.data;
                switch(msg.command){
                    case 'update':
                        docUri: msg.docUri;
                        renderTree();
                }
            });

            let docUri = ${JSON.stringify(sourceRoot)};

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
                webViewRPCHandler.invokeRemoteMethod('onCollapseTree', [nodeID]);
            }

            function initiateRendering(){
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