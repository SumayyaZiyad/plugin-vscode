import React, {useState} from "react";
import { Node } from "../tree-interfaces";

interface TreeNodeProps {
    node: Node;
    onCollapseTree: any;
}

function TreeNode(props: TreeNodeProps) {
    const [didHover, setDidHover] = useState(false);

    const onHover = () => {
        setDidHover(true);
    }

    const undoHover = () => {
        console.log(props.node);
        setDidHover(false);
    }

    const onClickNode = () => {
        undoHover();
        props.onCollapseTree();
    }

    return (
        <div>
            <div
                style={{
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
                    style={{
                        backgroundColor: "#faf3c0",
                        borderRadius: 5,
                        left: props.node.x + (props.node.width/1.5),
                        padding: 10,
                        position: "absolute",
                        top: props.node.y + (props.node.height/1.25),
                        zIndex: 1
                    }}
                >
                    <p> Value: {props.node.label}</p>

                    <p>Leading Minutiae: </p>
                    {props.node.leadingMinutiae && props.node.leadingMinutiae.length > 0 && props.node.leadingMinutiae.map((item, id) => {
                        return <p key={id}>
                            {item.kind}
                        </p>
                    })}
                    {(!props.node.leadingMinutiae || props.node.leadingMinutiae.length < 1) && <p>Unavailable</p>}

                    <p>Trailing Minutiae: </p>
                    {props.node.trailingMinutiae && props.node.trailingMinutiae.length > 0 && props.node.trailingMinutiae.map((item, id) => {
                        return <p key={id}>
                            {item.kind}
                        </p>
                    })}

                    {(!props.node.trailingMinutiae || props.node.trailingMinutiae.length < 1) && <p>Unavailable</p>}
                </div>
            }
        </div>
    );
}

export default TreeNode;
