import { createElement } from "react";
import { render } from "react-dom";
import { SyntaxTree } from "./SyntaxTree";

export function renderSyntaxTree (target: HTMLElement, respTree: JSON){
    const respTreeProps = {
        respTree
    }

    const SyntaxTreeElement = createElement(SyntaxTree, respTreeProps);
    render(SyntaxTreeElement, target);
}