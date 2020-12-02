import { createElement } from "react";
import { render } from "react-dom";
import { SyntaxTree } from "./SyntaxTree";
import { ResponseData } from "./tree-interfaces";

export function renderSyntaxTree(
                                 onCollapseTree: (nodeID: string) => void,
                                 responseData: ResponseData,
                                 target: HTMLElement
                                ) {
    const responseDataProps = {
        onCollapseTree,
        responseData
    };

    const SyntaxTreeElement = createElement(SyntaxTree, responseDataProps);
    render(SyntaxTreeElement, target);
}
