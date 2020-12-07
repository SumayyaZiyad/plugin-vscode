import { treeMapper } from "./treeMapper";
import { TreeNode, layoutOptions } from "./resources";
import { findChildren } from "./updateGraph";

export let nodeMembers: any[], nodeEdges: any[], nodeArray: TreeNode[];

export function retrieveGraph (responseTree: JSON){
    nodeArray = [];
    const retrievedMap = treeMapper(responseTree, {}, 'root');
    nodeMembers = retrievedMap[0]; nodeEdges = retrievedMap[1];
    return setGraph();
}

export function updateGraph (nodeID: string){
    nodeEdges = []; nodeMembers = [];
    findChildren(nodeArray, nodeID);
    return setGraph();
}

function setGraph(){
    const graph = {
        id: "root",
        layoutOptions: layoutOptions,
        children: nodeMembers,
        edges: nodeEdges
    };

    return graph;
}
