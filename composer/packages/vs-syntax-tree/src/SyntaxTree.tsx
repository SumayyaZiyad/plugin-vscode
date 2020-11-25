import React from 'react';

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
                    {JSON.stringify(this.props.respTree, null, 2)}
                </pre>
            </div>
        );
    }
}