import * as React from "react";
import { connect } from "react-redux";
import { Modal, Input, Button, Dropdown} from "semantic-ui-react";
import { Dispatch } from "redux";

import * as feedcard from "../../containers/feedCard/feedCard";
import { IStoreState } from "../../store";
import * as actions from "../../actions/cardActions";

interface ISettingsProps {
    open: boolean;
    cardName: string;
}

class SettingsComponent extends React.Component<ISettingsProps & actions.ICardState & actions.ICardDispatch> {

    public render() {
        return (<Modal dimmer="blurring"
            size="mini"
            open={this.props.open}
            onClose={() => this.props.toggleSettings(false)} >

            <Modal.Header>Settings: {this.props.cardName}</Modal.Header>
            <Modal.Content>
                <Button icon="plus" content="Add feed" />
            </Modal.Content>
            <Modal.Actions>
                <Button positive icon="checkmark" labelPosition="right" content="Save" onClick={this.onSave}/>
            </Modal.Actions>
        </Modal>);
    }

    private onSave = () => {
        this.props.toggleSettings(false);
    }
}

export const Settings = connect(actions.mapStateToProps, actions.mapDispatchToProps)(SettingsComponent);
