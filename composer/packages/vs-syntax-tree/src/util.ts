import { createElement } from "react";
import { render } from "react-dom";
import { SyntaxTree } from "./SyntaxTree";
import { TreeGraph } from "./tree-interfaces";

export function renderSyntaxTree(
                                 onCollapseTree: (nodeID: string) => void,
                                 renderTree: () => Promise<TreeGraph>,
                                 target: HTMLElement
                                ) {
    const responseDataProps = {
        onCollapseTree,
        renderTree
    };

    const SyntaxTreeElement = createElement(SyntaxTree, responseDataProps);
    render(SyntaxTreeElement, target);
}
