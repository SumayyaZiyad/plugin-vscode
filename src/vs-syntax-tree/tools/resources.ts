export interface TreeNode {
    nodeID: string;
    value: string;
    kind: string;
    parentID: string;
    didCollapse: boolean;
    ifParent: boolean;
    children: TreeNode[];
    leadingMinutiae: any[];
    trailingMinutiae: any[];
    diagnostics: any;
}

export const layoutOptions = {
    'elk.algorithm': 'layered',
    'elk.direction': 'DOWN',
    'elk.layered.crossingMinimization.semiInteractive': 'true',
    'elk.edgeRouting': 'POLYLINE',
    'elk.layered.mergeEdges': 'true'
};
