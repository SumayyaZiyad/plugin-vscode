import { toInteger, uniqueId } from "lodash";

interface TreeNode {
    nodeID: string;
    value: string;
    kind: string;
    type: string;
    parentID: string;
    children: TreeNode[];
}

export function retrieveGraph (responseTree: JSON){
    let nodes : TreeNode[] = [];

    let childNode : TreeNode = {
        nodeID: uniqueId(), 
        value: "root", 
        kind: "root", 
        type: "root",
        parentID: '',
        children: []
    };

    nodes.push(childNode);
    const retrievedMap = nodeMapper(responseTree, childNode, 'root', nodes);

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

    return [graph, retrievedMap[2]];
}

function nodeMapper (obj: JSON, parentObj: TreeNode, nodeKind: string, nodeArray: TreeNode[]){
    for (var props in obj) {
        if (typeof obj[props] === "object") {
            if (obj[props].hasOwnProperty("kind" && "value" && "isToken")){
                let childNode = {
                    nodeID: "c"+uniqueId(), 
                    value: obj[props].value, 
                    kind:obj[props].kind, 
                    type: props,
                    parentID: parentObj.nodeID,
                    children: []
                };

                parentObj.children.push(childNode);
            }

            else if (props.match(/^[0-9]+$/) === null && typeof obj[props] === "object" && !obj[props].nodeID){
                obj[props] = {
                    ...obj[props],
                    nodeID: uniqueId()
                };

                let childNode = {
                    nodeID: "p"+obj[props].nodeID, 
                    value: props, 
                    kind: nodeKind, 
                    type: props,
                    parentID: parentObj.nodeID,
                    children: []
                };

                parentObj.children.push(childNode);
                nodeMapper(obj[props], childNode, nodeKind, nodeArray);
            }

            else {
                nodeMapper(obj[props], parentObj, nodeKind, nodeArray);
            }
        }

        else if (props === "kind"){
            let childNode = {
                nodeID: "p"+uniqueId(), 
                value: obj[props], 
                kind: obj[props], 
                type: obj[props],
                parentID: parentObj.nodeID,
                children: []
            };

            parentObj.children.push(childNode);
            parentObj = childNode;
            nodeKind = obj[props];
        }
    }

    return graphMapper(nodeArray, nodeArray, [], []);
}

function graphMapper ( nodeArray: TreeNode[], array: TreeNode[], finalNodeArray: any[], finalEdgesArray: any[] ) {
    let i : number;
    for (i=0; i<array.length; i++){ 
        if(array[i].value !== "root"){
            finalNodeArray.push({
                id: array[i].nodeID,
                width: 150,
                height: 50,
                label: array[i].value,
                layoutOptions: { 
                    'elk.position': '('+(toInteger(array[i].parentID))+', 0)'
                }
            });
    
            if(array[i].value !== "syntaxTree"){
                finalEdgesArray.push({
                    id: "e"+array[i].nodeID,
                    sources: [array[i].parentID],
                    targets: [array[i].nodeID]
                })
            }
        }

        if(array[i].children.length>0){
            graphMapper(nodeArray, array[i].children, finalNodeArray, finalEdgesArray);
        }
    }

    return [finalNodeArray, finalEdgesArray, nodeArray];
}