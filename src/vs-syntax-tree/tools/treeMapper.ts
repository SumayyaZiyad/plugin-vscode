import { toInteger } from "lodash";
import { nodeArray } from "./graphGenerator";
import { TreeNode } from "./resources";

let rootLevel = 0, childNode: any, nodeCount = -1;

export function treeMapper(obj: JSON, parentObj: TreeNode | any) {
    for (var props in obj) {
        if (props === "position"){
            return obj[props];
        }

        else if (props !== "relativeResourcePath" && typeof obj[props] === "object") {
            if (obj[props].hasOwnProperty("kind" && "value" && "isToken")) {
                if(obj[props].invalidNodes.length){
                    for (var element in obj[props].invalidNodes){
                        parentObj.children.push({
                            nodeID: `t${++nodeCount}`,
                            value: obj[props].invalidNodes[element].value,
                            parentID: parentObj.nodeID,
                            children: [],
                            diagnostics: true
                        });
                    }
                }

                childNode = {
                    nodeID: `c${++nodeCount}`,
                    value: obj[props].value,
                    parentID: parentObj.nodeID,
                    children: [],
                    diagnostics: obj[props].isMissing
                };
                parentObj.children.push(childNode);
            }

            else if (props.match(/^[0-9]+$/) === null) {
                childNode = {
                    nodeID: `p${++nodeCount}`,
                    value: props,
                    parentID: parentObj.nodeID,
                    didCollapse: false,
                    children: [],
                    diagnostics: obj[props].isMissing
                };
                nodeArray.length ? parentObj.children.push(childNode) : nodeArray.push(childNode);
                treeMapper(obj[props], childNode);
            }

            else if(obj[props].kind){
                childNode = {
                    nodeID: `p${++nodeCount}`,
                    value: obj[props].kind,
                    parentID: parentObj.nodeID,
                    didCollapse: false,
                    children: [],
                    diagnostics: obj[props].isMissing
                };
                parentObj.children.push(childNode);
                treeMapper(obj[props], childNode);
            }

            else{
                treeMapper(obj[props], parentObj);
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
            label: graphNodes.length ? array[i].value : "Syntax Tree",
            layoutOptions: { 
                'elk.position': '('+(toInteger(position))+', 0)'
            },
            ifParent: array[i].children.length ? true : false,
            nodeColor: array[i].diagnostics ? "#DB3247" : (array[i].nodeID.charAt(0) === "t" ? "#C0C0C0" : ( array[i].nodeID.charAt(0) === "p" ? "#16B16F" : "#6640D1"))
        });

        if(graphNodes.length > 1){
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
