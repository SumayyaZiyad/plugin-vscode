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
                    display: "flex",
                    cursor: "default",
                    backgroundColor: props.node.nodeColor,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    margin: "auto",
                    top: props.node.y,
                    width: props.node.width,
                    height: props.node.height,
                    left: props.node.x,
                    borderRadius: 10,
                    position: "absolute",
                    lineHeight: "50px",
                }}
            >
                <div
                    style = {{
                        color: "white",
                        fontSize: 14,
                        textAlign: "center"
                    }}
                    onMouseOver = {onHoverNode}
                    onMouseLeave = {undoHoverNode}
                    onClick = {props.node.ifParent ? onClickNode : () => {}}
                >
                    {props.node.label}
                </div>
            </div>

            {didHoverNode && <NodeDetails node={props.node} />}
        </div>
    );
}

export default TreeNode;
