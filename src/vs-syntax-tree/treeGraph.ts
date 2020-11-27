import { toString } from "lodash";

interface TreeNode {
    nodeID: string;
    value: string;
    kind: string;
    type: string;
    parentNode: string;
}

export function retrieveGraph (responseTree: JSON){
    let retrievedNodes = nodeMapper(responseTree, "", "", []);
    let retrievedMap = graphMapper(retrievedNodes);

    const graph = {
        id: "root",
        layoutOptions: { 'elk.algorithm': 'layered' },
        children: retrievedMap[0],
        edges: retrievedMap[1]
    };

    return graph;
}

function nodeMapper (obj: JSON, parentID: string, nodeKind: string, nodeArray: TreeNode[]) { 
    for (var props in obj) {
        if (typeof obj[props] === "object") {
            if (obj[props].hasOwnProperty("kind" && "value" && "isToken")){
                nodeArray.push({
                    nodeID: "c"+nodeArray.length, 
                    value: obj[props].value, 
                    kind:obj[props].kind, 
                    type: props,
                    parentNode: parentID
                });
            }

            else if (props.match(/^[0-9]+$/) === null && typeof obj[props] === "object"){
                if (!obj[props].nodeID){
                    obj[props] = {
                        ...obj[props],
                        nodeID: "p"+nodeArray.length
                    };

                    nodeArray.push({
                        nodeID: obj[props].nodeID, 
                        value: props, 
                        kind: nodeKind, 
                        type: props,
                        parentNode: parentID
                    });
                }

                nodeMapper(obj[props], obj[props].nodeID, nodeKind, nodeArray);
            }

            else {
                nodeMapper(obj[props], parentID, nodeKind, nodeArray);
            }
        }

        else {
            if (props === "kind"){
                nodeArray.push({
                    nodeID: "p"+nodeArray.length, 
                    value: obj[props], 
                    kind: obj[props], 
                    type: obj[props],
                    parentNode: parentID
                });
            }
            nodeKind = obj[props];
            parentID = "p"+(nodeArray.length-1);
        }
    }

    return nodeArray;
}

function graphMapper (nodesArray: TreeNode[]){
    let i: number, treeNodes: any[] = [], treeEdges: any[] = [];

    for (i=0; i<nodesArray.length; i++){
        treeNodes.push({
            id: nodesArray[i].nodeID,
            width: 120,
            height: 50
        });

        if (i!==0){
            treeEdges.push({
                id: "e"+i,
                sources: [toString(nodesArray[i].parentNode)],
                targets: [toString(nodesArray[i].nodeID)]
            });
        }
    }

    return [treeNodes, treeEdges];
}
