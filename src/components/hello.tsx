import * as React from "react";
import * as css from "./hello.styl";

export interface HelloProps { compiler: string; framework: string; }

export class Hello extends React.Component<HelloProps, {}> {
    render() {
        console.log(css.hello);
        return (
            <div className={css.hello}>
                <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>
            </div>
        );
    }
}