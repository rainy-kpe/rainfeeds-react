import * as React from "react";
import { connect } from "react-redux";
import * as UI from "semantic-ui-react";
import { Dispatch } from "redux";

import * as style from "./header.styl";
import * as actions from "../../actions";
import * as store from "../../store";
import * as feedcard from "../../containers/feed-card/feed-card";
import { ICardState } from "../../containers/rainfeeds/rainfeeds";

export interface IHeaderProps {
    application: string;
}

class HeaderComponent extends React.Component<IHeaderProps & ICardState & feedcard.ICardDispatch> {
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

const mapStateToProps = (state: store.IStoreState): ICardState => ({
    cards: state.cardState.cards,
    showAskDialog: state.cardState.showAskDialog
});

export const Header = connect(mapStateToProps, feedcard.mapDispatchToProps)(HeaderComponent);
