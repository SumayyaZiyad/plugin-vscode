export function retrieveGraph (responseTree: JSON){
    const syntaxTree = JSON.stringify(responseTree, null, 2);
    console.log(syntaxTree);

    nodeMapper(responseTree, "root", "");

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
    }

    return graph;
}

function nodeMapper (obj: JSON, parent: any, kind: string) {    
    for (var props in obj) {
        console.log("Incoming prop is: ", props);
        if (typeof obj[props] == "object" || typeof obj[props] == "undefined") {
            if (obj[props].hasOwnProperty("kind" && "value" && "isToken")){
                console.log("Leaf Node", props, "parent is", parent, " of kind ", obj[props].kind);
            }

            else if(props.match(/^[0-9]+$/) == null && typeof obj[props] == "object"){
                console.log("From INTERNAL loop ", props, "is a subnode of ", parent, " of kind ", kind);
                nodeMapper(obj[props], props, kind);
            }

            else {
                nodeMapper(obj[props], parent, kind);
            }
        }

        else {
            kind = obj[props];
        }
    }
}