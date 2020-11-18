import * as React from 'react';

export interface SyntaxTreeProps {
    respTree?: JSON
}

export class SyntaxTree extends React.Component <SyntaxTreeProps> {
    constructor(props: SyntaxTreeProps){
        super(props);
    }

    public render (){
        return (
            <div>
                <pre>
                    <text>{JSON.stringify(this.props.respTree, null, 2)}</text>
                </pre>
            </div>
        );
    }
}