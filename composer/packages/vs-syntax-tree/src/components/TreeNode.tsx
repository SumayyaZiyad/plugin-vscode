import React, {useState} from "react";
import { TreeNodeProps } from "../tree-interfaces";

function TreeNode(props: TreeNodeProps) {
    const [didHover, setDidHover] = useState(false);

    function onHover() {
        setDidHover(true);
    }

    function undoHover() {
        setDidHover(false);
    }

    function onClickNode() {
        undoHover();
        props.onCollapseTree();
    }

    return (
        <div>
            <div
                style = {{
                    backgroundColor: props.node.nodeColor,
                    borderRadius: 10,
                    color: "white",
                    cursor: "default",
                    fontSize: 14,
                    height: props.node.height,
                    left: props.node.x,
                    lineHeight: "50px",
                    position: "absolute",
                    textAlign: "center",
                    top: props.node.y,
                    width: props.node.width
                }}
                onMouseOver = {onHover}
                onMouseLeave = {undoHover}
                onClick = {props.node.ifParent ? onClickNode : () => {}}
            >
                {props.node.label}
            </div>

            {!props.node.ifParent && didHover && 
                <div
                    style = {{
                        backgroundColor: "#faf3c0",
                        borderRadius: 5,
                        left: props.node.x + (props.node.width/1.5),
                        padding: 10,
                        position: "absolute",
                        top: props.node.y + (props.node.height/1.25),
                        zIndex: 1
                    }}
                >
                    <p> <b>Kind :</b> {props.node.kind}</p> <hr/>

                    <p style = {{fontWeight: "bold"}}>
                        Leading Minutiae
                    </p>
                    {props.node.leadingMinutiae && props.node.leadingMinutiae.length > 0 && 
                        props.node.leadingMinutiae.map((item, id) => {
                            return <p key = {id}>
                                {item.kind}
                            </p>
                        })
                    }
                    {(!props.node.leadingMinutiae || props.node.leadingMinutiae.length < 1) && <p>None</p>} <hr/>

                    <p style = {{fontWeight: "bold"}}>
                        Trailing Minutiae
                    </p>
                    {props.node.trailingMinutiae && props.node.trailingMinutiae.length > 0 && 
                        props.node.trailingMinutiae.map((item, id) => {
                            return <p key = {id}>
                                {item.kind}
                            </p>
                        })
                    }
                    {(!props.node.trailingMinutiae || props.node.trailingMinutiae.length < 1) && <p>None</p>}
                </div>
            }
        </div>
    );
}

export default TreeNode;
