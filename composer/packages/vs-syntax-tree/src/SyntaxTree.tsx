import React, {useEffect, useState} from "react";
import { TreeNode } from "./components/TreeNode";
import { TreeGraph } from "./tree-interfaces";
import { TreeNodeEdge } from "./components/TreeEdge";

interface SyntaxTreeProps {
    onCollapseTree: (nodeID: string) => void;
    renderTree: () => Promise<TreeGraph>;
}

function SyntaxTree (props: SyntaxTreeProps){
    const [treeGraph, setTreeGraph] = useState<TreeGraph | undefined>(undefined);

    useEffect(() => {
        props.renderTree().then((treeGraph)=>{
            setTreeGraph(treeGraph);
        })
    }, [props])
   
    return (
        <div>
            {treeGraph &&
                <div>
                {
                    treeGraph.children.map((item, id) => {
                        return <TreeNode
                                    node={item}
                                    key={id}
                                    onCollapseTree={() => props.onCollapseTree(item.id)}
                                />;
                    })
                }

                    <svg
                        width={treeGraph.width}
                        height={treeGraph.height}
                    >
                        {
                            treeGraph.edges.map((item, id) => {
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

export default SyntaxTree;