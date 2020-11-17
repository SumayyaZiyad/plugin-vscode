import { ExtendedLangClient } from '../core/extended-language-client';
import { ExtensionContext } from 'vscode';
import { getLibraryWebViewContent, WebViewOptions, getComposerWebViewOptions } from '../utils';

export function render(context: ExtensionContext, langClient: ExtendedLangClient)
    : string {

    const body = `
        <div id="syntaxTree" />
    `;
    const bodyCss = ``;
    const styles = ``;
    const scripts = `
            function loadedScript(){
                function renderTree(){
                    console.log("Test run");
                    ballerinaComposer.renderSyntaxTree(document.getElementById("syntaxTree"));
                }

                renderTree();
            }
    `;

    const check = getComposerWebViewOptions();
    console.log(check);

    const webViewOptions: WebViewOptions = {
        ...getComposerWebViewOptions(),
        body, scripts, styles, bodyCss
    };
    
    return getLibraryWebViewContent(webViewOptions);
}