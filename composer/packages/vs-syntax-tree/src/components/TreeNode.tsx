import React from "react";
import { Node } from "../tree-interfaces";

interface TreeNodeProps {
    node: Node,
    onCollapseTree: any
}

export class TreeNode extends React.Component<TreeNodeProps> {
    constructor(props: TreeNodeProps) {
        super(props);
    }

    public render() {
        return (
            <div
                style={{
                    backgroundColor: this.props.node.id.includes("c") ? "blue" : "green",
                    borderRadius: 10,
                    color: "white",
                    height: 50,
                    left: this.props.node.x,
                    lineHeight: "50px",
                    position: "absolute",
                    textAlign: "center",
                    top: this.props.node.y,
                    width: 150
                }}

                onClick={this.props.onCollapseTree}
            >
                {this.props.node.label}
            </div>
        );
    }
}
