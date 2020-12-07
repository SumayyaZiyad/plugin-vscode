import { toInteger } from "lodash";
import { treeMapper } from "./treeMapper";
import { TreeNode, layoutOptions } from "./resources";
import { findChildren } from "./updateGraph";

export let nodeMembers: any[], nodeEdges: any[], nodeArray: TreeNode[];

export function retrieveGraph (responseTree: JSON){
    nodeArray = [];
    const retrievedMap = treeMapper(responseTree, {}, 'root');
    nodeMembers = retrievedMap[0]; nodeEdges = retrievedMap[1];

    console.log("%%%%%%%%%%%%%", nodeArray);
    return setGraph();
}

export function updateGraph (nodeID: string){
    let intID : number = toInteger(nodeID.replace(/\D/g, ''));
    findChildren(nodeArray, intID);
    console.log(nodeArray);
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
