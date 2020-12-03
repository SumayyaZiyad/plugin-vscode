import React from "react";
import { TreeNode } from "./components/TreeNode";
import { TreeGraph } from "./tree-interfaces";
import { TreeNodeEdge } from "./components/TreeEdge";

interface SyntaxTreeProps {
    onCollapseTree: (nodeID: string) => void;
    renderTree: () => Promise<TreeGraph>;
}

interface SyntaxTreeGraph {
    treeGraph: TreeGraph
}

export class SyntaxTree extends React.Component <SyntaxTreeProps, SyntaxTreeGraph> {

    constructor(props: SyntaxTreeProps) {
        super(props);
    }

    componentDidMount(){
        this.props.renderTree().then((treeGraph)=>{
            this.setState({
                treeGraph
            })
        })
    }

    public render() {
        let nodeArray, edgeArray;

        if(this.state && this.state.treeGraph){
            nodeArray = this.state.treeGraph.children;
            edgeArray = this.state.treeGraph.edges;
        }

        return (
            <div>
                {this.state && this.state.treeGraph && nodeArray && edgeArray &&
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
                            width={this.state.treeGraph.width}
                            height={this.state.treeGraph.height}
                        >
                            {
                                edgeArray.map((item, id) => {
                                    return <TreeNodeEdge 
                                                edge={item} 
                                                key={id} 
                                            />;
                                })
                            }
                        </svg>
                    </div>
                }
            </div>
        );
    }
}