export interface ResponseData {
    treeGraph: TreeGraph;
    nodeArray: [];
}

export interface TreeGraph {
    id: string;
    layoutOptions: {};
    children: Node[];
    edges: TreeEdge[];
    width: number;
    height: number;
}

export interface Node {
    id: string;
    x: number;
    y: number;
    label: string;
    type: string;
    kind: string;
}

export interface TreeEdge {
    id: string;
    sources: [];
    targets: [];
    sections: EdgeSections[];
}

export interface EdgeSections {
    id: string;
    startPoint: Coords;
    endPoint: Coords;
}

export interface Coords {
    x: number;
    y: number;
}
