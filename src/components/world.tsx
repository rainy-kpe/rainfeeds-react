import * as React from "react";

export interface WorldProps { }

export class World extends React.Component<WorldProps, {}> {
    render() {
        return <h1>Hello World!</h1>;
    }
}