'use strict';
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

import assert = require('assert');
import { expect } from 'chai';
import * as path from 'path';
import { BallerinaModule, ExtendedLangClient } from "../../src/core/extended-language-client";
import { getServerOptions } from "../../src/server/server";
import { getBallerinaCmd, getBBEPath } from "../test-util";
import { commands, Uri } from "vscode";

const PROJECT_ROOT = path.join(__dirname, '..', '..', '..', 'test', 'data');

suite("Language Server Tests", function () {
    this.timeout(10000);
    let langClient: ExtendedLangClient;

    suiteSetup((done: MochaDone): any => {
        langClient = new ExtendedLangClient(
            'ballerina-vscode',
            'Ballerina LS Client',
            getServerOptions(getBallerinaCmd()),
            { documentSelector: [{ scheme: 'file', language: 'ballerina' }] },
            false
        );
        langClient.start();
        done();
    });


    test("Test Language Server Start", function (done): void {
        langClient.onReady().then(() => {
            done();
        }, () => {
            done(new Error("Language Server start failed"));
        }).catch((err) => {
            done(new Error("Language Server start failed"));
        });
    });

    test("Test getSyntaxTree", function (done): void {
        const filePath = path.join(getBBEPath(), 'hello_world.bal');
        let uri = Uri.file(filePath.toString());
        commands.executeCommand('vscode.open', uri).then(() => {
            langClient.onReady().then(() => {
                langClient.getSyntaxTree(uri).then((response) => {
                    expect(response).to.contain.keys('syntaxTree', 'parseSuccess');
                    done();
                }, (reason) => {
                    done(reason);
                });
            });
        });
    });

    test("Test getPackages - Ballerina project", (done) => {
        langClient.onReady().then(() => {
            langClient.getPackages(Uri.file(path.join(PROJECT_ROOT, 'helloPackage')).toString()).then((response) => {
                assert.equal(response.packages![0].name, 'helloproject', 'Invalid package name.');
                assert.equal(response.packages![0].modules.length, 2, "Invalid module information.");
                let helloModule: BallerinaModule;
                let defaultModule: BallerinaModule;
                if (response.packages![0].modules[0].default) {
                    defaultModule = response.packages![0].modules[0];
                    helloModule = response.packages![0].modules[1];
                } else {
                    defaultModule = response.packages![0].modules[1];
                    helloModule = response.packages![0].modules[0];
                }
                assert.equal(helloModule.name, 'hello', 'Invalid module name.');
                assert.equal(defaultModule.name, undefined, 'Default module has a name.');
                assert.equal(defaultModule.functions![0].name, 'main', 'Invalid function name.');
                assert.equal(defaultModule.services!.length, 0, 'Invalid services count.');
                assert.equal(helloModule.functions![0].name, 'getMessage', 'Invalid function name.');
                assert.equal(helloModule.services![0].resources[0].name, 'get', 'Invalid resource name.');
                done();
            }, (reason) => {
                done(reason);
            });
        });
    });

    test("Test getPackages - Single file", (done) => {
        langClient.onReady().then(() => {
            langClient.getPackages(Uri.file(path.join(PROJECT_ROOT, 'hello_world.bal')).toString()).then((response) => {
                assert.equal(response.packages![0].name, '.', "Invalid package name.");
                done();
            }, (reason) => {
                done(reason);
            });
        });
    });

    test("Test getBallerinaProject - Ballerina project", (done) => {
        langClient.onReady().then(() => {
            const projectPath = path.join(PROJECT_ROOT, 'helloPackage');
            const documentIdentifier = {
                documentIdentifier: {
                    uri: Uri.file(projectPath).toString()
                }
            };
            langClient.getBallerinaProject(documentIdentifier).then((response) => {
                assert.equal(response.packageName, 'helloproject', "Invalid package name.");
                assert.equal(response.path, projectPath, 'Invalid project path');
                done();
            }, (reason) => {
                done(reason);
            });
        });
    });

    test("Test getBallerinaProject - Single file", (done) => {
        langClient.onReady().then(() => {
            const documentIdentifier = {
                documentIdentifier: {
                    uri: Uri.file(path.join(PROJECT_ROOT, 'hello_world.bal')).toString()
                }
            };
            langClient.getBallerinaProject(documentIdentifier).then((response) => {
                assert.equal(response.packageName, '.', "Invalid package name.");
                done();
            }, (reason) => {
                done(reason);
            });
        });
    });

    test("Test fetchExamples", (done) => {
        langClient.onReady().then(() => {
            langClient.fetchExamples().then((response) => {
                assert.notEqual(response.samples.length, 0, 'No samples listed');
                done();
            }, (reason) => {
                done(reason);
            });
        });
    });


    test("Test Folding Range - Single file", (done) => {
        const filePath = path.join(PROJECT_ROOT, 'hello_world.bal');
        let uri = Uri.file(filePath.toString());
        commands.executeCommand('vscode.open', uri).then(() => {
            langClient.onReady().then(() => {
                const foldingRangeParam = {
                    textDocument: {
                        uri: uri.toString()
                    }
                };
                langClient.sendRequest('textDocument/foldingRange', foldingRangeParam).then((response: any) => {
                    assert.equal(response[0].startLine, 3, 'Invalid folding start position.');
                    assert.equal(response[0].endLine, 4, 'Invalid folding end position.');
                    assert.equal(response[0].kind, 'region', 'Invalid folding kind.');
                    done();
                });
            });
        });
    });

    test("Test Folding Range - Ballerina project", (done) => {
        const filePath = path.join(PROJECT_ROOT, 'helloPackage', 'modules', 'hello', 'hello_service.bal');
        let uri = Uri.file(filePath.toString());
        commands.executeCommand('vscode.open', uri).then(() => {
            langClient.onReady().then(() => {
                const foldingRangeParam = {
                    textDocument: {
                        uri: uri.toString()
                    }
                };
                langClient.sendRequest('textDocument/foldingRange', foldingRangeParam).then((response: any) => {
                    assert.equal(response.length, 4, 'Invalid folding start position.');
                    assert.equal(response[0].startLine, 4, 'Invalid folding start position - 4.');
                    assert.equal(response[0].endLine, 12, 'Invalid folding end position - 12.');
                    assert.equal(response[1].startLine, 8, 'Invalid folding start position - 8.');
                    assert.equal(response[1].endLine, 11, 'Invalid folding end position - 11.');
                    assert.equal(response[2].startLine, 15, 'Invalid folding start position - 15.');
                    assert.equal(response[2].endLine, 17, 'Invalid folding end position - 17.');
                    assert.equal(response[3].startLine, 0, 'Invalid folding start position - 0.');
                    assert.equal(response[3].endLine, 1, 'Invalid folding end position - 1.');
                    done();
                });
            });
        });
    });

    test("Test Language Server Stop", (done) => {
        langClient.stop().then(() => {
            done();
        }, () => {
            done(new Error("Language Server stop failed"));
        });
    });
});

