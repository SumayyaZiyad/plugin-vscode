import { toInteger } from "lodash";
import { nodeArray } from "./graphGenerator";
import { TreeNode } from "./resources";

let rootLevel = 0, childNode: any, nodeCount = -1;

export function treeMapper(obj: JSON, parentObj: TreeNode | any) {
    for (var props in obj) {
        if (props === "leadingMinutiae"){
            return obj[props];
        }

        else if (props !== "relativeResourcePath" && typeof obj[props] === "object") {
            if (obj[props].hasOwnProperty("kind" && "value" && "isToken")) {
                if(obj[props].invalidNodes.length){
                    for (var element in obj[props].invalidNodes){
                        parentObj.children.push({
                            nodeID: `t${++nodeCount}`,
                            value: obj[props].invalidNodes[element].value,
                            kind: "Invalid Node",
                            parentID: parentObj.nodeID,
                            children: [],
                            errorNode: true
                        });
                    }
                }

                childNode = {
                    nodeID: `c${++nodeCount}`,
                    value: obj[props].isMissing ? obj[props].kind : obj[props].value,
                    parentID: parentObj.nodeID,
                    children: [],
                    kind: obj[props].isMissing ? "Missing "+obj[props].kind : obj[props].kind,
                    leadingMinutiae: obj[props].leadingMinutiae,
                    trailingMinutiae: obj[props].trailingMinutiae,
                    errorNode: obj[props].isMissing
                };
                parentObj.children.push(childNode);
            }

            else if (props.match(/^[0-9]+$/) === null) {
                childNode = {
                    nodeID: `p${++nodeCount}`,
                    value: obj[props].isMissing ? obj[props].kind : props,
                    kind: props,
                    leadingMinutiae: obj[props].leadingMinutiae,
                    trailingMinutiae: obj[props].trailingMinutiae,
                    parentID: parentObj.nodeID,
                    didCollapse: false,
                    children: []
                };
                nodeArray.length ? parentObj.children.push(childNode) : nodeArray.push(childNode);
                treeMapper(obj[props], childNode);
            }

            else if(obj[props].kind){
                childNode = {
                    nodeID: `p${++nodeCount}`,
                    value: obj[props].kind,
                    kind: obj[props].kind,
                    leadingMinutiae: obj[props].leadingMinutiae,
                    trailingMinutiae: obj[props].trailingMinutiae,
                    parentID: parentObj.nodeID,
                    didCollapse: false,
                    children: []
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
            width: Math.max((array[i].value.length*9), 150),
            height: 50,
            label: graphNodes.length ? array[i].value : "Syntax Tree",
            kind: array[i].kind,
            leadingMinutiae: array[i].leadingMinutiae,
            trailingMinutiae: array[i].trailingMinutiae,
            layoutOptions: { 
                'elk.position': '('+(toInteger(position))+', 0)'
            },
            ifParent: array[i].children.length ? true : false,
            nodeColor: array[i].errorNode ? "#DB3247" : (array[i].nodeID.charAt(0) === "p" ? "#16B16F" : "#6640D1")
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
