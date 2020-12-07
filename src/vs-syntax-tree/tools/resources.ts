export interface TreeNode {
    nodeID: string;
    value: string;
    kind: string;
    type: string;
    parentID: string;
    didCollapse: boolean;
    children: TreeNode[];
}

export const layoutOptions = {
    'elk.algorithm': 'layered',
    'elk.direction': 'DOWN',
    'elk.layered.crossingMinimization.semiInteractive': 'true',
    'elk.edgeRouting': 'POLYLINE',
    'elk.layered.mergeEdges': 'true'
};
