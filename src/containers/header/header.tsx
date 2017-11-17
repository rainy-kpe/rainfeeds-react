import * as React from "react";
import { connect } from "react-redux";
import { Modal, Input, Button, Icon} from "semantic-ui-react";
import { Dispatch } from "redux";
import * as _ from "lodash";

import * as style from "./header.styl";
import * as feedcard from "../../containers/feedCard/feedCard";
import * as store from "../../store";
import * as actions from "../../actions/cardActions";
import * as authActions from "../../actions/authActions";

interface IHeaderProps {
    application: string;
}

interface IHeaderComponentState {
    showAskName: boolean;
}

type IHeaderComponentProps = IHeaderProps & actions.ICardState & authActions.IAuthState;

class HeaderComponent extends React.Component<IHeaderComponentProps, IHeaderComponentState> {
    private newCardName: string = "";

    constructor(props: IHeaderComponentProps, context: any) {
        super(props, context);

        store.store.dispatch(authActions.initFirebase());

        this.state = {
            showAskName: false
        };
    }

    public render() {
        return (<div className={style.header}>
            <div id={style.top}>
                <Button icon="plus" size="mini" onClick={() => this.setState({ showAskName: true })}/>
                <span className={style.title}>{this.props.application}</span>
                { this.renderAuth() }
            </div>
            <div id={style.bottom} />

            <Modal dimmer="blurring"
                size="mini"
                open={this.state.showAskName}
                onClose={() => this.setState({showAskName: false })}>

                <Modal.Header>Give name for the card</Modal.Header>
                <Modal.Content>
                    <Input onChange={this.onChange} fluid placeholder="Card name" />
                </Modal.Content>
                <Modal.Actions>
                    <Button positive icon="checkmark" labelPosition="right" content="Add card"
                        onClick={this.onClose} />
                </Modal.Actions>
            </Modal>

        </div>);
    }

    public renderAuth() {
        if (this.props.authenticated) {
            return (
                <div>
                    <span className={style.username}>{this.props.username}</span>
                    <Icon id={style.user} name="user circle outline"
                        onClick={() => store.store.dispatch(authActions.logout())} />
                </div>
            );
        } else {
            return <Icon id={style.user} name="user circle"
                onClick={() => store.store.dispatch(authActions.login())} />;
        }
    }

    private onClose = () => {
        this.setState({ showAskName: false });
        store.store.dispatch(actions.addCardToDatabase(this.newCardName));
    }

    private onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.newCardName = (e.target as any).value;
    }
}

const mapStateToProps = (state: store.IStoreState, ownProps: IHeaderProps):
    actions.ICardState & authActions.IAuthState => {

    return _.merge({}, state.cardState, state.authState);
};

export const Header = connect(mapStateToProps)(HeaderComponent);
