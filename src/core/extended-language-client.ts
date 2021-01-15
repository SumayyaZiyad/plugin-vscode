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

import { LanguageClient, TextDocumentPositionParams } from "vscode-languageclient";
import { Uri, Location } from "vscode";

export const BALLERINA_LANG_ID = "ballerina";

export interface BallerinaSyntaxTree {
    kind: string;
    topLevelNodes: any[];
}

export interface BallerinaSyntaxTreeResponse {
    syntaxTree?: BallerinaSyntaxTree;
}

export interface BallerinaPackage {
    name: string;
    kind: string;
    topLevelNodes: any[];
    modules: BallerinaModule[];
}

export interface BallerinaModule {
    name?: string;
    default?: boolean;
    functions?: any[];
    services?: any[];
}

export interface BallerinaPackagesResponse {
    packages?: BallerinaPackage[];
}

export interface GetSyntaxTreeRequest {
    documentIdentifier: {
        uri: string;
    };
}

export interface BallerinaExample {
    title: string;
    url: string;
}

export interface BallerinaExampleCategory {
    title: string;
    column: number;
    samples: Array<BallerinaExample>;
}

export interface BallerinaExampleListRequest {
    filter?: string;
}

export interface BallerinaExampleListResponse {
    samples: Array<BallerinaExampleCategory>;
}

export interface BallerinaOASResponse {
    ballerinaOASJson?: string;
}

export interface BallerinaOASRequest {
    ballerinaDocument: {
        uri: string;
    };
    ballerinaService?: string;
}

export interface BallerinaAstOasChangeRequest {
    oasDefinition?: string;
    documentIdentifier: {
        uri: string;
    };
}

export interface BallerinaProject {
    path?: string;
    version?: string;
    author?: string;
    packageName?: string;
}

export interface GetBallerinaProjectParams {
    documentIdentifier: {
        uri: string;
    };
}

export interface BallerinaAstOasChangeResponse {
    oasAST?: string;
}

export interface BallerinaServiceListRequest {
    documentIdentifier: {
        uri: string;
    };
}

export interface BallerinaServiceListResponse {
    services: string[];
}

export interface BallerinaSynResponse {
    syn?: String;
}

export interface GetSynRequest {
    Params: string;
}

export interface BallerinaSyntaxTree {
    kind: String;
    topLevelNodes: any[];
}

export interface BallerinaSyntaxTreeResponse {
    syntaxTree?: BallerinaSyntaxTree;
}

export interface GetSyntaxTreeRequest {
    documentIdentifier: {
        uri: string;
    };
}

export class ExtendedLangClient extends LanguageClient {

    getPackages(sourceRoot: string): Thenable<BallerinaPackagesResponse> {
        const req = { sourceRoot };
        return this.sendRequest("ballerinaProject/packages", req);
    }

    getSyntaxHighlighter(params: string): Thenable<BallerinaSynResponse> {
        const req: GetSynRequest = {
            Params: params
        };
        return this.sendRequest("ballerinaSyntaxHighlighter/list", req);
    }

    getSyntaxTree(uri: Uri): Thenable<BallerinaSyntaxTreeResponse> {
        const req: GetSyntaxTreeRequest = {
            documentIdentifier: {
                uri: uri.toString()
            }
        };
        return this.sendRequest("ballerinaDocument/syntaxTree", req);
    }

    fetchExamples(args: BallerinaExampleListRequest = {}): Thenable<BallerinaExampleListResponse> {
        return this.sendRequest("ballerinaExample/list", args);
    }

    getEndpoints(): Thenable<Array<any>> {
        return this.sendRequest("ballerinaSymbol/endpoints", {})
            .then((resp: any) => resp.endpoints);
    }

    getBallerinaOASDef(uri: Uri, oasService: string): Thenable<BallerinaOASResponse> {
        const req: BallerinaOASRequest = {
            ballerinaDocument: {
                uri: uri.toString()
            },
            ballerinaService: oasService
        };
        return this.sendRequest("ballerinaDocument/openApiDefinition", req);
    }

    triggerOpenApiDefChange(oasJson: string, uri: Uri): void {
        const req: BallerinaAstOasChangeRequest = {
            oasDefinition: oasJson,
            documentIdentifier: {
                uri: uri.toString()
            },
        };
        return this.sendNotification("ballerinaDocument/apiDesignDidChange", req);
    }

    getServiceListForActiveFile(uri: Uri): Thenable<BallerinaServiceListResponse> {
        const req: BallerinaServiceListRequest = {
            documentIdentifier: {
                uri: uri.toString()
            },
        };
        return this.sendRequest("ballerinaDocument/serviceList", req);
    }

    getBallerinaProject(params: GetBallerinaProjectParams): Thenable<BallerinaProject> {
        return this.sendRequest("ballerinaDocument/project", params);
    }

    getDefinitionPosition(params: TextDocumentPositionParams): Thenable<Location> {
        return this.sendRequest("textDocument/definition", params)
            .then((res) => {
                const definitions = res as any;
                if (!(definitions.length > 0)) {
                    return Promise.reject();
                }
                return definitions[0];
            });
    }

    getSyntaxTree(uri: Uri): Thenable<BallerinaSyntaxTreeResponse> {
        const req: GetSyntaxTreeRequest = {
            documentIdentifier: {
                uri: uri.toString()
            }
        };
        
        return this.sendRequest("ballerinaDocument/syntaxTree", req);
    }
}
