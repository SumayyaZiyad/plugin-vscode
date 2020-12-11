import { BallerinaProject, ballerinaExtInstance } from "../core";
import { window } from "vscode";
import * as path from 'path';

function getCurrentBallerinaProject(): Promise<BallerinaProject> {
    return new Promise((resolve, reject) => {
        const activeEditor = window.activeTextEditor;
        // if currently opened file is a bal file
        if (activeEditor && activeEditor.document.fileName.endsWith('.bal')) {
            // get path of the current bal file
            const uri = activeEditor.document.uri.toString();
            if (ballerinaExtInstance.langClient) {
                // get Ballerina Project path for current Ballerina file
                ballerinaExtInstance.langClient.getBallerinaProject({
                    documentIdentifier: {
                        uri,
                    }
                }).then(resolve, reject);
            } else {
                reject("Language Client is not available.");
            }
        } else {
            reject("Current file is not a Ballerina file");
        }
    });
}

function getCurrentBallerinaFile(): string {
    const activeEditor = window.activeTextEditor;
    if (activeEditor && activeEditor.document.fileName.endsWith('.bal')) {
        return activeEditor.document.fileName.toString();
    }
    throw new Error("Current file is not a Ballerina file");
}

function getCurrenDirectoryPath(): string {
    const activeEditor = window.activeTextEditor;
    if (activeEditor) {
        return path.dirname(activeEditor.document.fileName);
    }
    throw new Error("There is no active editor");
}

export { getCurrentBallerinaProject, getCurrentBallerinaFile, getCurrenDirectoryPath };
