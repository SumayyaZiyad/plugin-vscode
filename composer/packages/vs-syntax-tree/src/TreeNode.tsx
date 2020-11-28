import React from "react";

interface TreeNodeProps {
    node: {
        id: string,
        x: number,
        y: number
    };
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
                    position: "absolute",
                    textAlign: "center",
                    top: this.props.node.y,
                    width: 120
                }}
            >
                {this.props.node.id}
            </div>
        );
    }
}
