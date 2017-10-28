import * as React from "react";
import * as css from "./hello.styl";

import { World } from "./World";

export interface IHelloProps { compiler: string; framework: string; }

export class Hello extends React.Component<IHelloProps, {}> {
    public render() {
        return (
            <div className={css.hello}>
                <h1>Hello2 from {this.props.compiler} and {this.props.framework}!</h1>
                <World />
            </div>
        );
    }
}
