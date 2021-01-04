import React, {useState} from "react";
import { TreeNodeProps } from "../tree-interfaces";
import NodeDetails from "./NodeDetails";

function TreeNode(props: TreeNodeProps) {
    const [didHoverNode, setDidHoverNode] = useState(false);

    function onHoverNode() {
        setDidHoverNode(true);
    }

    function undoHoverNode() {
        setDidHoverNode(false);
    }

    function onClickNode() {
        undoHoverNode();
        props.onCollapseTree();
    }

    return (
        <div>
            <div
                style = {{
                    backgroundColor: props.node.nodeColor,
                    borderRadius: 10,
                    cursor: "default",
                    display: "flex",
                    flexDirection: "row",
                    height: props.node.height,
                    justifyContent: "space-around",
                    left: props.node.x,
                    lineHeight: "50px",
                    margin: "auto",
                    position: "absolute",
                    top: props.node.y,
                    width: props.node.width
                }}
            >
                <div
                    style = {{
                        color: "white",
                        fontSize: 14,
                        textAlign: "center",
                        width: "auto"
                    }}
                    onClick = {props.node.ifParent ? onClickNode : () => {}}
                    onMouseLeave = {undoHoverNode}
                    onMouseOver = {onHoverNode}
                >
                    {props.node.label}
                </div>
            </div>

            {didHoverNode && <NodeDetails node={props.node} />}
        </div>
    );
}

export default TreeNode;
