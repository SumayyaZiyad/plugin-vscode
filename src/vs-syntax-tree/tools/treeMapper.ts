import { nodeArray } from "./graphGenerator";
import { TreeNode } from "./resources";

let childNode: any, nodeCount = -1;

export function treeMapper(obj: JSON, parentObj: TreeNode | any, treeLevel: number) {
    for (var props in obj) {
        if (props === "leadingMinutiae"){
            return obj[props];
        }

        else if (props !== "relativeResourcePath" && typeof obj[props] === "object") {
            if (obj[props].hasOwnProperty("kind" && "value" && "isToken")) {
                if(obj[props].invalidNodes.length){
                    for (var element in obj[props].invalidNodes){
                        parentObj.children.push({
                            nodeID: `c${++nodeCount}`,
                            value: obj[props].invalidNodes[element].value,
                            kind: "Invalid Node",
                            parentID: parentObj.nodeID,
                            children: [],
                            errorNode: true
                        });
                    }
                }

                parentObj.children.push({
                    nodeID: `c${++nodeCount}`,
                    value: obj[props].isMissing ? obj[props].kind : obj[props].value,
                    parentID: parentObj.nodeID,
                    children: [],
                    kind: obj[props].isMissing ? "Missing "+obj[props].kind : obj[props].kind,
                    leadingMinutiae: obj[props].leadingMinutiae,
                    trailingMinutiae: obj[props].trailingMinutiae,
                    errorNode: obj[props].isMissing
                });
            }

            else if (props.match(/^[0-9]+$/) === null) {
                childNode = {
                    nodeID: `p${++nodeCount}`,
                    value: obj[props].isMissing ? obj[props].kind : props,
                    kind: props,
                    leadingMinutiae: obj[props].leadingMinutiae,
                    trailingMinutiae: obj[props].trailingMinutiae,
                    parentID: parentObj.nodeID,
                    didCollapse: treeLevel < 2 ? true : false,
                    children: []
                };

                nodeArray.length ? parentObj.children.push(childNode) : nodeArray.push(childNode);
                treeMapper(obj[props], childNode, treeLevel+1);
            }

            else if(obj[props].kind){
                childNode = {
                    nodeID: `p${++nodeCount}`,
                    value: obj[props].kind,
                    kind: obj[props].kind,
                    leadingMinutiae: obj[props].leadingMinutiae,
                    trailingMinutiae: obj[props].trailingMinutiae,
                    parentID: parentObj.nodeID,
                    didCollapse: treeLevel < 2 ? true : false,
                    children: []
                };

                parentObj.children.push(childNode);
                treeMapper(obj[props], childNode, treeLevel+1);
            }

            else {
                treeMapper(obj[props], parentObj, treeLevel+1);
            }
        }
    }
}
