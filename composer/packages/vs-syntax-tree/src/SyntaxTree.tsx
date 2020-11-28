import React from "react";
import { SyntaxTreeGraph } from "./tree-interfaces";
import { TreeNode } from "./TreeNode";

interface SyntaxTreeProps {
    responseGraph: SyntaxTreeGraph;
}

export class SyntaxTree extends React.Component <SyntaxTreeProps> {
    constructor(props: SyntaxTreeProps) {
        super(props);
    }

    public render() {
        const nodeArray = this.props.responseGraph.children;

        return (
            <div>
                {
                    nodeArray.map((item, id) => {
                        const node: {id: string, x: number, y: number} = item;
                        return <TreeNode node={node} key={id} />;
                    })
                }
            </div>
        );
    }
}
