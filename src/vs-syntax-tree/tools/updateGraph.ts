import { toInteger } from "lodash";
import { TreeNode } from "./resources";
import { nodeMembers, nodeEdges } from "./graphGenerator";

export function findChildren(targetArray: TreeNode[], nodeID: number) {
    for (let i = 0; i < targetArray.length; i++) {
        let currentNodeID = toInteger(targetArray[i].nodeID.replace(/\D/g, ''));

        if (currentNodeID === nodeID) {
            return expandNode(targetArray[i].children);
        }

        else if (targetArray.length === 1 || !targetArray[i + 1]) {
            return findChildren(targetArray[i].children, nodeID);
        }

        else if (targetArray[i + 1] && nodeID < toInteger(targetArray[i + 1].nodeID.replace(/\D/g, ''))) {
            return findChildren(targetArray[i].children, nodeID);
        }
    }
}

function expandNode(children: TreeNode[]){
    for (let i = 0; i < children.length; i++){
        nodeMembers.push({
            id: children[i].nodeID,
            width: 150,
            height: 50,
            label: children[i].value,
            layoutOptions: { 
                'elk.position': `(${toInteger(children[i].nodeID.replace(/\D/g, ''))}, 0)`
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
