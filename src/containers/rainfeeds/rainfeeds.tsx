import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Button, Modal, Input } from "semantic-ui-react";

import { Header } from "../../containers/header/header";
import { FeedCard } from "../../containers/feed-card/feed-card";
import { Counter } from "../../containers/counter/counter";
import * as style from "./rainfeeds.styl";
import * as actions from "../../actions/cardActions";
import * as store from "../../store";

class RainfeedsComponent extends React.Component<actions.ICardState & actions.ICardDispatch> {
    private text: string = "";

    public render() {
        return (
            <div>
                <Header application="Rainfeeds 2.0" />

                <div className={ style.items }>
                    {
                        this.props.cards.map((title: string, i: number) => (
                            <div className={style.item} key={i}>
                                <FeedCard title={title} />
                            </div>)
                        )
                    }
                </div>

                <Modal dimmer="blurring"
                    size="mini"
                    open={this.props.showAskDialog}
                    onClose={this.props.hideAskCardName}>

                    <Modal.Header>Give name for the card</Modal.Header>
                    <Modal.Content>
                        <Input onChange={this.onChange} fluid placeholder="Card name" />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button positive icon="checkmark" labelPosition="right" content="Add card"
                            onClick={this.onClose} />
                    </Modal.Actions>
                </Modal>

                <Counter />
            </div>
        );
    }

    private onClose = (e: React.SyntheticEvent<HTMLElement>) => {
        this.props.hideAskCardName();
        this.props.addCard(this.text);
    }

    private onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
        this.text = (e.target as any).value;
    }
}

const mapStateToProps = (state: store.IStoreState): actions.ICardState => ({
    cards: state.cardState.cards,
    showAskDialog: state.cardState.showAskDialog
});

export const Rainfeeds = connect(mapStateToProps, actions.mapDispatchToProps)(RainfeedsComponent);
