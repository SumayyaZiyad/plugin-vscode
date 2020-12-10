import { toInteger } from "lodash";
import { nodeArray } from "./graphGenerator";
import { TreeNode } from "./resources";

let nodeCount = 0, rootLevel = 0, childNode: any;

export function treeMapper(obj: JSON, parentObj: TreeNode | any, nodeKind: string) {
    for (var props in obj) {
        if (typeof obj[props] === "object") {
            if (obj[props].hasOwnProperty("kind" && "value" && "isToken")) {
                parentObj.children.push({
                    nodeID: `c${nodeCount}`,
                    value: obj[props].value,
                    kind: obj[props].kind,
                    type: props,
                    parentID: parentObj.nodeID,
                    children: []
                });
                ++nodeCount;
            }

            else if (props.match(/^[0-9]+$/) === null && typeof obj[props] === "object") {
                childNode = parentObj;

                if (!obj[props].nodeID) {
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
                        didCollapse: false,
                        children: []
                    };

                    nodeArray.length ? parentObj.children.push(childNode) : nodeArray.push(childNode);
                    ++nodeCount;
                }
                treeMapper(obj[props], childNode, nodeKind);
            }

            else if(obj[props].kind){
                childNode = {
                    nodeID: `p${nodeCount}`,
                    value: obj[props].kind,
                    kind: obj[props].kind,
                    type: obj[props].kind,
                    parentID: parentObj.nodeID,
                    didCollapse: false,
                    children: []
                };
    
                parentObj.children.push(childNode);
                ++nodeCount;
                treeMapper(obj[props], childNode, obj[props]);
            }

            else{
                treeMapper(obj[props], parentObj, nodeKind);
            }
        }
    }

    return graphMapper(nodeArray, [], [], rootLevel);
}

function graphMapper (array: TreeNode[], graphNodes: any[], graphEdges: any[], level: number) {
    for (let i=0; i < array.length && level <3 ; i++){
        let node : any = array[i].nodeID;
        let position : any = (node.match(/\d/g)).join("");
        array[i] = {
            ...array[i],
            didCollapse: level === 2 ? false : true
        };

        graphNodes.push({
            id: array[i].nodeID,
            width: Math.max((array[i].value.length*9), 90),
            height: 50,
            label: position > 0 ? array[i].value : "Syntax Tree",
            layoutOptions: { 
                'elk.position': '('+(toInteger(position))+', 0)'
            },
            type: array[i].type,
            kind: array[i].kind,
            ifParent: array[i].children.length ? true : false
        });

        if(array[i].value !== "syntaxTree"){
            graphEdges.push({
                id: `e${array[i].nodeID}`,
                sources: [array[i].parentID],
                targets: [array[i].nodeID]
            });
        }
        
        if(array[i].children.length){
            graphMapper(array[i].children, graphNodes, graphEdges, ++level);
            --level;
        }
    }

    return [graphNodes, graphEdges];
}
