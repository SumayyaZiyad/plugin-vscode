interface TreeNode {
    nodeID: string;
    value: string;
    kind: string;
    type: string;
    parentNode: string;
}

export function retrieveGraph (responseTree: JSON){
    let res = nodeMapper(responseTree, "", "", []);
    console.log(JSON.stringify(res, null, 2));

    const graph = {
        id: "root",
        layoutOptions: { 'elk.algorithm': 'layered' },
        children: [
            { id: "n1", width: 30, height: 30 },
            { id: "n2", width: 30, height: 30 },
            { id: "n3", width: 30, height: 30 }
        ],
        edges: [
            { id: "e1", sources: [ "n1" ], targets: [ "n2" ] },
            { id: "e2", sources: [ "n1" ], targets: [ "n3" ] }
        ]
    };

    return graph;
}

function nodeMapper (obj: JSON, parentID: string, nodeKind: string, nodeArray: TreeNode[]) { 
    for (var props in obj) {
        if (typeof obj[props] === "object" || typeof obj[props] === "undefined") {
            if (obj[props].hasOwnProperty("kind" && "value" && "isToken")){
                nodeArray.push({
                    nodeID: "c"+nodeArray.length, 
                    value: obj[props].value, 
                    kind:obj[props].kind, 
                    type: props,
                    parentNode: parentID
                });
            }

            else if(props.match(/^[0-9]+$/) === null && typeof obj[props] === "object"){
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
