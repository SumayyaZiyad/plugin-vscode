/**
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */
import { commands, window, ViewColumn, ExtensionContext, WebviewPanel } from 'vscode';
import * as _ from 'lodash';
import { render } from './renderer';
import { ExtendedLangClient } from '../core/extended-language-client';
import { BallerinaExtension } from '../core';
import { getCommonWebViewOptions } from '../utils';
import { TM_EVENT_OPEN_DOC_PREVIEW, CMP_DOCS_PREVIEW } from '../telemetry';
import * as path from 'path';
import { getCurrentBallerinaProject } from "../utils/project-utils";
import { runCommandOnBackground, BALLERINA_COMMANDS } from '../project/cli-cmds/cmd-runner';
// import DOMParser = require('dom-parser');
import * as fs from "fs";

let previewPanel: WebviewPanel | undefined;

// function updateWebView(docHtml: string, nodeType: string): void {
// 	if (previewPanel) {
// 		previewPanel.webview.postMessage({
// 			command: 'update',
// 			docHtml: docHtml,
// 			nodeType: nodeType
// 		});
// 	}
// }

function showDocs(context: ExtensionContext, langClient: ExtendedLangClient, args: any): void {
	if (previewPanel) {
		previewPanel.dispose();
	}

	previewPanel = window.createWebviewPanel(
		'ballerinaDocs',
		"Documentation Preview",
		{ viewColumn: ViewColumn.Two, preserveFocus: true },
		getCommonWebViewOptions()
	);
	const editor = window.activeTextEditor;
	if (!editor) {
		return;
	}

	const html = render(context, langClient);
	if (previewPanel && html) {
		previewPanel.webview.html = html;
	}

	const disposeLoaded = previewPanel.webview.onDidReceiveMessage(async (e) => {
		if (e.message !== "loaded-doc-preview") {
			return;
		}
		disposeLoaded.dispose();

		const currentProject = await getCurrentBallerinaProject();
		if (!currentProject) {
			window.showErrorMessage(`Open editor ${editor.document.uri} does not reside inside a Ballerina project.`);
			return;
		}

		let htmlFilePath;
		if (args.nodeType === 'functions') {
			htmlFilePath = path.join(currentProject.path!, 'target', 'apidocs', args.moduleName,
				`${args.nodeType}.html`);
		} else {
			htmlFilePath = path.join(currentProject.path!, 'target', 'apidocs', args.moduleName,
				args.nodeType, `${args.nodeName}.html`);
		}

		fs.watchFile(htmlFilePath, () => {
			extractHTMLToRender(htmlFilePath, args);
			fs.unwatchFile(htmlFilePath);
		});

		const result = runCommandOnBackground(currentProject, BALLERINA_COMMANDS.DOC, args.moduleName);
		if (!result) {
			window.showErrorMessage(`Error while generating docs for ${args.moduleName} module.`);
			return;
		}
	});

	previewPanel.onDidDispose(() => {
		previewPanel = undefined;
	});
}

async function extractHTMLToRender(htmlFilePath: string, args: any) {
	// const docsPathOnWorkspace = Uri.file(htmlFilePath);
	// let doc = await workspace.openTextDocument(docsPathOnWorkspace);
	// const parser = new DOMParser();
	// const dom = parser.parseFromString(doc.getText());
	// let elementToRender;
	// if (args.nodeType === 'functions') {
	// 	const elements: DOMParser.Node[] | null = dom.getElementsByClassName('method-content');
	// 	if (elements) {
	// 		for (let index = 0; index < elements.length; index++) {
	// 			const urlLinks: DOMParser.Node[] | null = elements[index].getElementsByClassName('url-link');
	// 			if (urlLinks && urlLinks[0].getAttribute('href') === `#${args.nodeName}`) {
	// 				elementToRender = elements[index];
	// 				break;
	// 			}
	// 		}
	// 	}
	// } else {
	// 	elementToRender = dom.getElementById('main');
	// }

	// // update doc preview web view
	// updateWebView(elementToRender.innerHTML, args.nodeType);
}

export function activate(ballerinaExtInstance: BallerinaExtension) {
	const reporter = ballerinaExtInstance.telemetryReporter;
	const context = <ExtensionContext>ballerinaExtInstance.context;
	const langClient = <ExtendedLangClient>ballerinaExtInstance.langClient;
	const docsRenderDisposable = commands.registerCommand('ballerina.showDocs', (args: any) => {
		reporter.sendTelemetryEvent(TM_EVENT_OPEN_DOC_PREVIEW, { component: CMP_DOCS_PREVIEW });
		return ballerinaExtInstance.onReady()
			.then(() => {
				showDocs(context, langClient, args);
			})
			.catch((e) => {
				if (!ballerinaExtInstance.isValidBallerinaHome()) {
					ballerinaExtInstance.showMessageInvalidBallerinaHome();
				} else {
					ballerinaExtInstance.showPluginActivationError();
				}
				reporter.sendTelemetryException(e, { component: CMP_DOCS_PREVIEW });
			});
	});

	context.subscriptions.push(docsRenderDisposable);
}
