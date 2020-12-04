import React, {useEffect, useState} from "react";
import TreeNodeEdge from "./components/TreeEdge";
import TreeNode from "./components/TreeNode";
import { TreeGraph } from "./tree-interfaces";

interface SyntaxTreeProps {
    onCollapseTree: (nodeID: string) => void;
    renderTree: () => Promise<TreeGraph>;
}

function SyntaxTree(props: SyntaxTreeProps) {
    const [treeGraph, setTreeGraph] = useState<TreeGraph | undefined>(undefined);

    useEffect(() => {
        props.renderTree().then((result) => {
            setTreeGraph(result);
        });

        console.log("Use effect has been invoked");
    }, [props]);

    return (
        <div>
            {treeGraph &&
                <div>
                {
                    treeGraph.children.map((item, id) => {
                        return <TreeNode
                                    node={item}
                                    onCollapseTree={() => props.onCollapseTree(item.id)}
                                    key={id}
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
