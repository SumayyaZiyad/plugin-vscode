import React from "react";
import { ResponseData, Node } from "./tree-interfaces";
import { TreeNode } from "./TreeNode";

interface SyntaxTreeProps {
    responseData: ResponseData
}

export class SyntaxTree extends React.Component <SyntaxTreeProps> {
    constructor(props: SyntaxTreeProps) {
        super(props);
    }

    public render() {
        const nodeArray = this.props.responseData.treeGraph.children;

        return (
            <div>
                {
                    nodeArray.map((item, id) => {
                        const node: Node = item;
                        return <TreeNode node={node} key={id} />;
                    })
                }
            </div>
        );
    }
}
