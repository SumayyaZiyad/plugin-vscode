import React from "react";
import { ResponseData } from "./tree-interfaces";
import { TreeNode } from "./TreeNode";
import { TreeNodeEdge } from "./TreeEdge";

interface SyntaxTreeProps {
    responseData: ResponseData
}

export class SyntaxTree extends React.Component <SyntaxTreeProps> {
    constructor(props: SyntaxTreeProps) {
        super(props);
    }

    public render() {
        const nodeArray = this.props.responseData.treeGraph.children;
        const edgeArray = this.props.responseData.treeGraph.edges;

        return (
            <div>
                {
                    nodeArray.map((item, id) => {
                        return <TreeNode node={item} key={id} />;
                    })
                }

                    <svg width={this.props.responseData.treeGraph.width} height={this.props.responseData.treeGraph.height}>
                        {
                            edgeArray.map((item, id) => {
                                return <TreeNodeEdge edge={item} key={id} />
                            })
                        }
                    </svg>
            </div>
        );
    }
}
