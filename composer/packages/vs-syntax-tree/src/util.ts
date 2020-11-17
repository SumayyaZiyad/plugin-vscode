import { createElement } from "react";
import { render } from "react-dom";
import { SyntaxTree } from "./SyntaxTree";

export function renderSyntaxTree (target: HTMLElement){
    const SyntaxTreeElement = createElement(SyntaxTree);
    render(SyntaxTreeElement, target);
}