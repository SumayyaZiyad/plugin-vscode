export interface ResponseData {
    treeGraph: TreeGraph,
    nodeArray: []
}

export interface TreeGraph {
    id: string;
    layoutOptions: {};
    children: [];
    edges: [];
}
