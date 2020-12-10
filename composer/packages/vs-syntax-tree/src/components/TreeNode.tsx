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
                backgroundColor: props.node.ifParent ? "#16B16F" : "#6640D1",
                borderRadius: 10,
                color: "white",
                fontSize: 14,
                height: props.node.height,
                left: props.node.x,
                lineHeight: "50px",
                position: "absolute",
                textAlign: "center",
                top: props.node.y,
                width: props.node.width
            }}
            onClick = {props.node.ifParent ? props.onCollapseTree : () => {}}
        >
            {props.node.label}
        </div>
    );
}

export default TreeNode;
