export interface ResponseData {
    treeGraph: TreeGraph,
    nodeArray: []
}

export interface TreeGraph {
    id: string;
    layoutOptions: {};
    children: Node[];
    edges: [];
}

export interface Node {
    id: string,
    x: number,
    y: number,
    label: string
}
