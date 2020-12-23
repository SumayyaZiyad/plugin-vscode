import { toInteger } from "lodash";
import { TreeNode } from "./resources";
import { nodeMembers, nodeEdges } from "./graphGenerator";

export function updateTreeGraph(targetArray: TreeNode[], nodeID: string) {
    for (let i = 0; i < targetArray.length; i++) {
        let position = toInteger(targetArray[i].nodeID.replace(/\D/g, ''));

        if (targetArray[i].nodeID === nodeID) {
            let status = targetArray[i].didCollapse;
            targetArray[i] = {
                ...targetArray[i],
                didCollapse: !status
            };
        }

        nodeMembers.push({
            id: targetArray[i].nodeID,
            width: Math.max((targetArray[i].value.length*9), 90),
            height: 50,
            label: nodeMembers.length ? targetArray[i].value : "Syntax Tree",
            kind: targetArray[i].kind,
            leadingMinutiae: targetArray[i].leadingMinutiae,
            trailingMinutiae: targetArray[i].trailingMinutiae,
            layoutOptions: { 
                'elk.position': '('+position+', 0)'
            },
            ifParent: targetArray[i].children.length ? true : false,
            nodeColor: targetArray[i].errorNode ? "#DB3247" : (targetArray[i].nodeID.charAt(0) === "p" ? "#16B16F" : "#6640D1")
        });

        if(nodeMembers.length > 1){
            nodeEdges.push({
                id: `e${targetArray[i].nodeID}`,
                sources: [targetArray[i].parentID],
                targets: [targetArray[i].nodeID]
            });
        }

        if (targetArray[i].didCollapse === true) {
            updateTreeGraph(targetArray[i].children, nodeID);
        }
    }
}
