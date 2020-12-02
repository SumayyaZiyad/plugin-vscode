import React from "react";
import { ResponseData } from "./tree-interfaces";
import { TreeNode } from "./components/TreeNode";
import { TreeNodeEdge } from "./components/TreeEdge";

interface SyntaxTreeProps {
    responseData: ResponseData,
    onCollapseTree: (nodeID: string) => void
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
                        return <TreeNode node={item} key={id} onCollapseTree={() => this.props.onCollapseTree(item.id)} />;
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
