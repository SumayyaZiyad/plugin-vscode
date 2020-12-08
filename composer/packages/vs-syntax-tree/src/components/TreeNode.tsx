import React from "react";
import { Node } from "../tree-interfaces";

interface TreeNodeProps {
    node: Node;
    onCollapseTree: any;
}

function TreeNode(props: TreeNodeProps) {
    return (
        <div
            style={{
                backgroundColor: props.node.ifParent ? "green" : "blue",
                borderRadius: 10,
                color: "white",
                height: 50,
                left: props.node.x,
                lineHeight: "50px",
                position: "absolute",
                textAlign: "center",
                top: props.node.y,
                width: 150
            }}
            onClick = {props.node.ifParent ? props.onCollapseTree : () => {}}
        >
            {props.node.label}
        </div>
    );
}

export default TreeNode;
