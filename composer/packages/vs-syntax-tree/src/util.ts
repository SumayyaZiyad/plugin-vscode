import { createElement } from "react";
import { render } from "react-dom";
import { SyntaxTree } from "./SyntaxTree";
import { SyntaxTreeGraph } from "./tree-interfaces";

export function renderSyntaxTree (target: HTMLElement, responseGraph: SyntaxTreeGraph){
    const responseGraphProps = {
        responseGraph
    }

    const SyntaxTreeElement = createElement(SyntaxTree, responseGraphProps);
    render(SyntaxTreeElement, target);
}