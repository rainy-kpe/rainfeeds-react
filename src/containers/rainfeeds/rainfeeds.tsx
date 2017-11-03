import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Button, Modal, Input } from "semantic-ui-react";

import { Header } from "../../components/header/header";
import { FeedCard } from "../../containers/feed-card/feed-card";
import { Counter } from "../../containers/counter/counter";
import * as style from "./rainfeeds.styl";
import * as actions from "../../actions";
import * as store from "../../store";

export interface ICardState {
    cards: string[];
    showAskDialog: boolean;
}

interface IRainfeedsDispatch {
    hideAskCardName: () => actions.ICardAction;
    addCard: (title: string) => actions.ICardAction;
}

class RainfeedsComponent extends React.Component<ICardState & IRainfeedsDispatch> {
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

const mapStateToProps = (state: store.IStoreState): ICardState => {
    console.log("state", state);
    return {
        cards: state.cardState.cards,
        showAskDialog: state.cardState.showAskDialog
    };
};

const mapDispatchToProps = (dispatch: Dispatch<actions.IIncrementAction>): IRainfeedsDispatch => ({
    hideAskCardName: () => dispatch(actions.hideAskCardName()),
    addCard: (title: string) => dispatch(actions.addCard(title))
});

export const Rainfeeds = connect(mapStateToProps, mapDispatchToProps)(RainfeedsComponent);
