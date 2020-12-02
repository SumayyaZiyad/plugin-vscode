import React from "react";
import { TreeEdge } from "../tree-interfaces";

interface TreeEdgeProps {
    edge: TreeEdge
}

export class TreeNodeEdge extends React.Component<TreeEdgeProps> {
    constructor(props: TreeEdgeProps) {
        super(props);
    }

    public render() {
        const edgeCoords = this.props.edge.sections;
        
        return (
            <line 
                x1= {edgeCoords[0].startPoint.x}
                y1= {edgeCoords[0].startPoint.y}
                x2= {edgeCoords[0].endPoint.x}
                y2= {edgeCoords[0].endPoint.y}

                style={{
                    stroke: "black",
                    strokeWidth: 1
                }}
            />
        );
    }
}
