import * as React from "react";
import { connect } from "react-redux";
import { Modal, Input, Button, Dropdown} from "semantic-ui-react";
import { Dispatch } from "redux";

import * as style from "./header.styl";
import * as feedcard from "../../containers/feedCard/feedCard";
import { IStoreState } from "../../store";
import * as actions from "../../actions/cardActions";

export interface IHeaderProps {
    application: string;
}

class HeaderComponent extends React.Component<IHeaderProps & actions.ICardState & actions.ICardDispatch> {
    private text: string = "";

    public render() {
        return (<div className={style.header}>
            <div id={style.top}>
                <Dropdown icon="ellipsis vertical">
                    <Dropdown.Menu>
                        <Dropdown.Item text="Login" icon="user" />
                        <Dropdown.Item text="Add card" icon="plus" onClick={() => this.props.toggleAskCardName(true)}/>
                    </Dropdown.Menu>
                </Dropdown>
                <span className={style.title}>{ this.props.application }</span>
            </div>
            <div id={style.bottom} />

            <Modal dimmer="blurring"
                size="mini"
                open={this.props.showAskDialog}
                onClose={() => this.props.toggleAskCardName(false) }>

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
        this.props.toggleAskCardName(false);
        this.props.addCard(this.text);
    }

    private onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.text = (e.target as any).value;
    }
}

export const Header = connect(actions.mapStateToProps, actions.mapDispatchToProps)(HeaderComponent);
