import * as React from "react";
import { connect } from "react-redux";
import { Modal, Input, Button, Dropdown} from "semantic-ui-react";
import { Dispatch } from "redux";
import * as _ from "lodash";

import * as feedcard from "../../containers/feedCard/feedCard";
import { store, IStoreState } from "../../store";
import * as actions from "../../actions/cardActions";
import * as style from "./settings.styl";

interface ISettingsComponentState {
    card: actions.ICard;
}

type ISettingsComponentProps = actions.ICardState & actions.ICardDispatch;

class SettingsComponent extends React.Component<ISettingsComponentProps, ISettingsComponentState> {

    constructor(props: ISettingsComponentProps, context: any) {
        super(props, context);

        this.state = { card: null };
    }

    // Populate items from the state
    public componentWillReceiveProps(nextProps: ISettingsComponentProps) {
        this.setState({ card: _.find(nextProps.cards, (c) => c.title === nextProps.showSettings) });
    }

    public render() {
        const typeOptions = [
            { key: "rss", value: "rss", text: "RSS Feed" },
            { key: "hackernews", value: "hackernews", text: "Hacker News" }
        ];
        const rateOptions = [
            { key: 15, value: 15, text: "15 mins" },
            { key: 30, value: 30, text: "30 mins" },
            { key: 60, value: 60, text: "1 hour" }
        ];
        return (<Modal dimmer="blurring"
            size="mini"
            open={ this.props.showSettings !== null }
            onClose={() => this.props.toggleSettings(null)} >

            <Modal.Header>Settings: {this.props.showSettings}</Modal.Header>
            <Modal.Content>
                <div className={style.content}>Type:
                    <Dropdown selection compact defaultValue={this.state.card ? this.state.card.type : "rss"}
                        options={typeOptions} onChange={this.onTypeChange} />
                </div>
                <div className={style.content}>Update rate:
                    <Dropdown selection compact defaultValue={this.state.card ? this.state.card.updateRate : 60}
                        options={rateOptions} onChange={this.onRateChange} />
                </div>
                {
                    this.state.card && this.state.card.type === "rss" &&
                        this.state.card.urls.map((url: string, index: number) => (
                            <div className={style.items} key={index}>
                                <Input defaultValue={url} fluid placeholder="Enter feed address"
                                    onChange={this.onUrlChange.bind(this, index)} />
                                <Button icon="remove" onClick={() => this.onRemoveFeed(index) } />
                            </div>
                        ))
                }
                {
                    this.state.card && this.state.card.type === "rss" &&
                        <Button icon="plus" content="Add feed" onClick={this.onAddFeed}/>
                }
            </Modal.Content>
            <Modal.Actions>
                <Button positive icon="checkmark" labelPosition="right" content="Save" onClick={this.onSave}/>
            </Modal.Actions>
        </Modal>);
    }

    private onSave = () => {
        this.props.toggleSettings(null);
        actions.updateCardToDatabase(this.state.card)(store.dispatch);
    }

    private onRateChange = (e: React.SyntheticEvent<HTMLInputElement>, data: any) => {
        this.state.card.updateRate = data.value;
    }

    private onTypeChange = (e: React.SyntheticEvent<HTMLInputElement>, data: any) => {
        const newState = _.cloneDeep(this.state);
        newState.card.type = data.value;
        this.setState(newState);
    }

    private onUrlChange = (index: number, e: React.SyntheticEvent<HTMLInputElement>) => {
        this.state.card.urls[index] = (e.target as any).value;
    }

    private onAddFeed = () => {
        const card = this.state.card;
        card.urls.push("");
        this.setState({ card });
    }

    private onRemoveFeed = (index: number) => {
        const card = this.state.card;
        card.urls.splice(index, 1);
        this.setState({ card });
    }
}

export const Settings = connect(actions.mapStateToProps, actions.mapDispatchToProps)(SettingsComponent);
