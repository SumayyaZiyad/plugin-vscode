import React from "react";
import { TreeNodeEdge } from "./components/TreeEdge";
import { TreeNode } from "./components/TreeNode";
import { ResponseData } from "./tree-interfaces";

interface SyntaxTreeProps {
    onCollapseTree: (nodeID: string) => void;
    responseData: ResponseData;
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
                        return <TreeNode
                                    node={item}
                                    key={id}
                                    onCollapseTree={() => this.props.onCollapseTree(item.id)}
                                />;
                    })
                }

                <svg
                    width={this.props.responseData.treeGraph.width}
                    height={this.props.responseData.treeGraph.height}
                >
                    {
                        edgeArray.map((item, id) => {
                            return <TreeNodeEdge edge={item} key={id} />;
                        })
                    }
                </svg>
            </div>
        );
    }
}
