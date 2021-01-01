import { treeMapper } from "./treeMapper";
import { TreeNode, layoutOptions } from "./resources";
import { updateTreeGraph } from "./updateGraph";

export let nodeMembers: any[], nodeEdges: any[], nodeArray: TreeNode[];

export function retrieveGraph (responseTree: JSON){
    console.log(responseTree);
    nodeArray = [];
    treeMapper(responseTree, {}, 0);
    return updateSyntaxTree("xxx");
}

export function updateSyntaxTree (nodeID: string){
    nodeEdges = []; nodeMembers = [];
    updateTreeGraph(nodeArray, nodeID);
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
