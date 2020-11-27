import React from "react";

interface TreeNodeProps {
    node: {
        id: string,
        x: number,
        y: number
    }
}

export class TreeNode extends React.Component<TreeNodeProps>{
    constructor(props: TreeNodeProps){
        super(props);
    }

    public render () {
        return (            
            <div
                style={{
                    top: this.props.node.y + 10,
                    left: this.props.node.x + 10,
                    backgroundColor: this.props.node.id.includes("c") ? "blue" : "green",
                    width: 120,
                    height: 50,
                    borderRadius: 10,
                    position: "absolute",
                    color: "white",
                    textAlign: "center"
                }} 
            >
                {this.props.node.id}
            </div>
        );
    }
}