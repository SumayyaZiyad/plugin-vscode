import { toInteger } from "lodash";

interface TreeNode {
    nodeID: string;
    value: string;
    kind: string;
    type: string;
    parentID: string;
    children: TreeNode[];
}

let nodeCount : number, rootLevel: number = 0, nodeMembers: any[], nodeEdges: any[], nodeArray: TreeNode[];

export function retrieveGraph (responseTree: JSON){
    nodeCount = 0; nodeMembers = []; nodeEdges = []; nodeArray = [];
    const retrievedMap = treeMapper(responseTree, {}, 'root');

    const graph = {
        id: "root",
        layoutOptions: { 
            'elk.algorithm': 'layered',
            'elk.direction': 'DOWN',
            'elk.layered.crossingMinimization.semiInteractive': 'true',
            'elk.edgeRouting': 'POLYLINE',
            'elk.layered.mergeEdges': 'true'
        },
        children: retrievedMap[0],
        edges: retrievedMap[1]
    };

    nodeMembers = retrievedMap[0]; nodeEdges = retrievedMap[1];
    return graph;
}

function treeMapper (obj: JSON, parentObj: TreeNode | any, nodeKind: string){
    for (var props in obj) {
        if (typeof obj[props] === "object") {
            if (obj[props].hasOwnProperty("kind" && "value" && "isToken")){
                parentObj.children.push({
                    nodeID: `c${nodeCount}`, 
                    value: obj[props].value, 
                    kind:obj[props].kind, 
                    type: props,
                    parentID: parentObj.nodeID,
                    children: []
                });
                ++nodeCount;
            }

            else if (props.match(/^[0-9]+$/) === null && typeof obj[props] === "object"){
                let childNode = parentObj;

                if (!obj[props].nodeID){
                    obj[props] = {
                        ...obj[props],
                        nodeID: `p${nodeCount}`
                    };

                    childNode = {
                        nodeID: obj[props].nodeID, 
                        value: props, 
                        kind: nodeKind, 
                        type: props,
                        parentID: parentObj.nodeID,
                        children: []
                    };

                    nodeArray.length < 1 ? nodeArray.push(childNode) : parentObj.children.push(childNode);  
                    ++nodeCount;
                }
                treeMapper(obj[props], childNode, nodeKind);
            }

            else {
                treeMapper(obj[props], parentObj, nodeKind);
            }
        }

        else if (props === "kind"){
            let childNode = {
                nodeID: `p${nodeCount}`, 
                value: obj[props], 
                kind: obj[props], 
                type: obj[props],
                parentID: parentObj.nodeID,
                children: []
            };

            parentObj.children.push(childNode);
            ++nodeCount;
            parentObj = childNode;
            nodeKind = obj[props];
        }
    }

    return graphMapper(nodeArray, [], [], rootLevel);
}

function graphMapper (array: TreeNode[], graphNodes: any[], graphEdges: any[], level: number) {
    for (let i=0; i < array.length && level <3 ; i++){
        let node : any = array[i].nodeID;
        let position : any = (node.match(/\d/g)).join("");

        graphNodes.push({
            id: array[i].nodeID,
            width: 150,
            height: 50,
            label: array[i].value,
            layoutOptions: { 
                'elk.position': '('+(toInteger(position))+', 0)'
            },
            parentID: array[i].parentID
        });

        if(array[i].value !== "syntaxTree"){
            graphEdges.push({
                id: `e${array[i].nodeID}`,
                sources: [array[i].parentID],
                targets: [array[i].nodeID]
            });
        }
        
        if(array[i].children.length > 0){
            graphMapper(array[i].children, graphNodes, graphEdges, ++level);
            --level;
        }
    }

    return [graphNodes, graphEdges];
}

export function updateGraph (nodeID: string){
    let intID : number = toInteger(nodeID.replace(/\D/g, ''));
    findChildren(nodeArray, intID);

    const graph = {
        id: "root",
        layoutOptions: { 
            'elk.algorithm': 'layered',
            'elk.direction': 'DOWN',
            'elk.layered.crossingMinimization.semiInteractive': 'true',
            'elk.edgeRouting': 'POLYLINE',
            'elk.layered.mergeEdges': 'true'
        },
        children: nodeMembers,
        edges: nodeEdges
    };

    return graph;
}

function findChildren(targetArray: TreeNode[], nodeID: number){
    for (let i = 0; i < targetArray.length; i++ ){
        let currentNodeID = toInteger(targetArray[i].nodeID.replace(/\D/g, ''));

        if (currentNodeID === nodeID){
            return printChildren(targetArray[i].children);
        }

        else if (targetArray.length === 1 || !targetArray[i+1]) {
            return findChildren(targetArray[i].children, nodeID);
        }

        else if (targetArray[i+1] && nodeID < toInteger(targetArray[i+1].nodeID.replace(/\D/g, ''))) {
            return findChildren(targetArray[i].children, nodeID);
        }
    }
}

function printChildren(children: TreeNode[]){
    for (let i = 0; i < children.length; i++){
        console.log("push ", i+1);
        nodeMembers.push({
            id: children[i].nodeID,
            width: 150,
            height: 50,
            label: children[i].value,
            layoutOptions: { 
                'elk.position': '('+(toInteger(children[i].nodeID))+', 0)'
            },
            parentID: children[i].parentID
        });

        nodeEdges.push({
            id: `e${children[i].nodeID}`,
            sources: [children[i].parentID],
            targets: [children[i].nodeID]
        });
    }
}
