import React from 'react';
import ELK from 'elkjs/lib/elk-api';

export interface SyntaxTreeProps {
    respTree?: JSON
}

export interface WriteableProps {
    respGraph: any
}

export class SyntaxTree extends React.Component <SyntaxTreeProps, WriteableProps> {
    constructor(props: SyntaxTreeProps){
        super(props);

        this.state = {
            respGraph: null
        };

        this.updateValues = this.updateValues.bind(this);
    }

    updateValues(resp: string){
        this.setState((state)=>{
            return {
                respGraph: resp
            }
        })
    }

    public componentDidMount(){
        const elk = new ELK({
            workerUrl: "./elk-worker.min.js"
        });

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

        elk.layout(graph)
            .then((result)=>{
                this.updateValues(JSON.stringify(result, null, 2));
            })
            .catch((e)=>{
                console.log(e);
            })
    }

    public render (){
        if (this.state.respGraph){
            return(
                <text>
                    {this.state.respGraph}
                </text>
            );
        }

        return (
            <div>
                <pre>
                    {JSON.stringify(this.props.respTree, null, 2)}
                </pre>
            </div>
        );
    }
}