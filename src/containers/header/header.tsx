import * as React from "react";
import { connect } from "react-redux";
import { Modal, Input, Button, Dropdown} from "semantic-ui-react";
import { Dispatch } from "redux";

import * as style from "./header.styl";
import * as feedcard from "../../containers/feedCard/feedCard";
import { IStoreState } from "../../store";
import * as actions from "../../actions/cardActions";

interface IHeaderProps {
    application: string;
}

interface IHeaderComponentState {
    showAskName: boolean;
}

type IHeaderComponentProps = IHeaderProps & actions.ICardState & actions.ICardDispatch;

class HeaderComponent extends React.Component<IHeaderComponentProps, IHeaderComponentState> {
    private newCardName: string = "";

    constructor(props: IHeaderComponentProps, context: any) {
        super(props, context);

        this.state = {
            showAskName: false
        };
    }

    public render() {
        return (<div className={style.header}>
            <div id={style.top}>
                <Dropdown icon="ellipsis vertical">
                    <Dropdown.Menu>
                        <Dropdown.Item text="Login" icon="user" />
                        <Dropdown.Item text="Add card" icon="plus"
                            onClick={() => this.setState({ showAskName: true })}/>
                    </Dropdown.Menu>
                </Dropdown>
                <span className={style.title}>{this.props.application}</span>
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

    private onClose = () => {
        this.setState({ showAskName: false });
        this.props.addCard(this.newCardName);
    }

    private onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.newCardName = (e.target as any).value;
    }
}

export const Header = connect(actions.mapStateToProps, actions.mapDispatchToProps)(HeaderComponent);
