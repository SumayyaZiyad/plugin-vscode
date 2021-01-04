import React from "react";
import { TreeNodeDetailsProps } from "../tree-interfaces";

function NodeDetails (props: TreeNodeDetailsProps){
    return (
        <div
            style = {{
                backgroundColor: "#faf3c0",
                borderRadius: 5,
                left: props.node.x > window.outerWidth - 100 ? props.node.x - 130 : props.node.x + (props.node.width/1.25), 
                minWidth: 150,
                minHeight: 190,
                padding: 10,
                position: "absolute",
                top: props.node.y > window.innerHeight - 250 ? props.node.y - 180 : props.node.y + (props.node.height/1.25),
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
    );
}

export default NodeDetails;