import { toInteger } from "lodash";
import { TreeNode } from "./resources";
import { nodeMembers, nodeEdges } from "./graphGenerator";

export function findChildren(targetArray: TreeNode[], nodeID: string) {
    for (let i = 0; i < targetArray.length; i++) {
        if (targetArray[i].nodeID === nodeID) {
            let status = targetArray[i].didCollapse;

            targetArray[i] = {
                ...targetArray[i],
                didCollapse: !status
            };
        }

        if (targetArray[i].didCollapse === true) {
            findChildren(targetArray[i].children, nodeID);
        }

        nodeMembers.push({
            id: targetArray[i].nodeID,
            width: 150,
            height: 50,
            label: targetArray[i].value,
            layoutOptions: { 
                'elk.position': `(${toInteger(targetArray[i].nodeID.replace(/\D/g, ''))}, 0)`
            },
            parentID: targetArray[i].parentID
        });

        if(targetArray[i].value !== "syntaxTree"){
            nodeEdges.push({
                id: `e${targetArray[i].nodeID}`,
                sources: [targetArray[i].parentID],
                targets: [targetArray[i].nodeID]
            });
        }
    }
}
