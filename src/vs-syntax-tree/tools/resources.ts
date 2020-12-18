export interface TreeNode {
    nodeID: string;
    value: string;
    parentID: string;
    didCollapse: boolean;
    ifParent: boolean;
    children: TreeNode[];
    diagnostics: any;
}

export const layoutOptions = {
    'elk.algorithm': 'layered',
    'elk.direction': 'DOWN',
    'elk.layered.crossingMinimization.semiInteractive': 'true',
    'elk.edgeRouting': 'POLYLINE',
    'elk.layered.mergeEdges': 'true'
};
