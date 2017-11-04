import * as React from "react";
import { connect } from "react-redux";
import * as UI from "semantic-ui-react";
import { Dispatch } from "redux";

import * as style from "./header.styl";
import * as feedcard from "../../containers/feed-card/feed-card";
import { IStoreState } from "../../store";
import * as actions from "../../actions/cardActions";

export interface IHeaderProps {
    application: string;
}

class HeaderComponent extends React.Component<IHeaderProps & actions.ICardState & actions.ICardDispatch> {
    public render() {
        return (<div className={style.header}>
            <div id={style.top}>
                <UI.Dropdown icon="ellipsis vertical">
                    <UI.Dropdown.Menu>
                        <UI.Dropdown.Item text="Login" icon="user" />
                        <UI.Dropdown.Item text="Add card" icon="plus" onClick={this.props.askCardName}/>
                    </UI.Dropdown.Menu>
                </UI.Dropdown>
                <span className={style.title}>{ this.props.application }</span>
            </div>
            <div id={style.bottom} />
        </div>);
    }
}

const mapStateToProps = (state: IStoreState): actions.ICardState => ({
    cards: state.cardState.cards,
    showAskDialog: state.cardState.showAskDialog
});

export const Header = connect(mapStateToProps, actions.mapDispatchToProps)(HeaderComponent);
