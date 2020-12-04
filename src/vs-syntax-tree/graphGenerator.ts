import { toInteger } from "lodash";

interface TreeNode {
    nodeID: string;
    value: string;
    kind: string;
    type: string;
    parentID: string;
    children: TreeNode[];
}

let nodeCount : number, rootLevel: number = 0;

export function retrieveGraph (responseTree: JSON){
    nodeCount = 0;
    const retrievedMap = treeMapper(responseTree, {}, 'root', []);

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

    return graph;
}

function treeMapper (obj: JSON, parentObj: TreeNode | any, nodeKind: string, nodeArray: TreeNode[]){
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
                treeMapper(obj[props], childNode, nodeKind, nodeArray);
            }

            else {
                treeMapper(obj[props], parentObj, nodeKind, nodeArray);
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
