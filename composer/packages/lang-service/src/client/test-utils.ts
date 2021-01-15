import {
    InitializeParams, InitializeResult,
    Location, TextDocumentPositionParams
} from "vscode-languageserver-protocol";
import { BallerinaEndpoint } from "./ast-models";
import {
    BallerinaExampleListParams, BallerinaExampleListResponse, BallerinaProject, GetBallerinaProjectParams,
    GetProjectASTParams, GetProjectASTResponse, GetSyntaxTreeParams, GetSyntaxTreeResponse, GoToSourceParams,
    IBallerinaLangClient, RevealRangeParams
} from "./model";

// tslint:disable:no-object-literal-type-assertion
export class EmptyLanguageClient implements IBallerinaLangClient {

    public isInitialized: boolean = false;

    public init(params?: InitializeParams): Thenable<InitializeResult> {
        return Promise.reject();
    }

    public getProjectAST(params: GetProjectASTParams): Thenable<GetProjectASTResponse> {
        return Promise.reject();
    }

    public getSyntaxTree(params: GetSyntaxTreeParams): Thenable<GetSyntaxTreeResponse> {
        return Promise.reject();
    }

    public fetchExamples(params: BallerinaExampleListParams = {}): Thenable<BallerinaExampleListResponse> {
        return Promise.reject();
    }

    public getEndpoints(): Thenable<BallerinaEndpoint[]> {
        return Promise.reject();
    }

    public getBallerinaProject(params: GetBallerinaProjectParams): Thenable<BallerinaProject> {
        return Promise.reject();
    }

    public getDefinitionPosition(params: TextDocumentPositionParams): Thenable<Location> {
        return Promise.reject();
    }

    public goToSource(params: GoToSourceParams): void {
        // EMPTY
    }

    public revealRange(params: RevealRangeParams): void {
        // EMPTY
    }

    public close(): void {
        // EMPTY
    }
}
