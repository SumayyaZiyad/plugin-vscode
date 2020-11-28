import { createElement } from "react";
import { render } from "react-dom";
import { SyntaxTree } from "./SyntaxTree";
import { ResponseData } from "./tree-interfaces";

export function renderSyntaxTree(target: HTMLElement, responseData: ResponseData) {
    console.log(responseData);

    const responseDataProps = {
        responseData
    };

    const SyntaxTreeElement = createElement(SyntaxTree, responseDataProps);
    render(SyntaxTreeElement, target);
}
