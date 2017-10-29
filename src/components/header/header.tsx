import * as React from "react";
import * as UI from "semantic-ui-react";

import * as style from "./header.styl";
export interface IHeaderProps { application: string; }

export class Header extends React.Component<IHeaderProps, {}> {
    public render() {
        return (<div className={style.header}>
            <div id={style.top}>
                <span>{this.props.application}</span>
                <UI.Button>Login</UI.Button>
            </div>
            <div id={style.bottom} />
        </div>);
    }
}
