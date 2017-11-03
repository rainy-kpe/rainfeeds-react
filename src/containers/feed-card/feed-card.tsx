import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Modal, Button, Header, Card, Item } from "semantic-ui-react";

import * as style from "./feed-card.styl";
import * as image from "./image.png";
import * as actions from "../../actions";
import * as store from "../../store";

export interface IFeedCardProps {
    title: string;
}

interface IFeedCardDispatch {
    removeCard: (title: string) => actions.ICardAction;
}

class FeedCardComponent extends React.Component<IFeedCardProps & IFeedCardDispatch> {
    private items: any[] = [];

    constructor() {
        super();

        this.items = [...Array(7)];
    }

    public render() {
        console.log("this", this);
        const { title } = this.props;
        return (
            <Card className={ style.card } raised>
                <Card.Content>
                    <Card.Header className={style.header}>
                        { title }
                        <Modal
                            dimmer="blurring"
                            size="mini"
                            trigger={<Button icon="remove" size="mini" />}
                            header="Delete card?"
                            content={`Are you sure you want to delete the card: '${title}'?`}
                            actions={[
                              "Cancel",
                              { key: "done", content: "Delete", positive: true, onClick: this.onRemove },
                            ]} />
                    </Card.Header>
                </Card.Content>
                <Card.Content className={ style.content }>
                    <Item.Group>
                        {
                            this.items.map((item: any, i: number) => (
                                <Item key={i}>
                                    <Item.Image size="tiny" src={image} />
                                    <Item.Content>
                                        <Item.Header as="a">Cute Dog</Item.Header>
                                        <Item.Meta>4 months ago</Item.Meta>
                                        <Item.Description>
                                            <p>
                                                Many people also have their own barometers for what makes a cute dog.
                                            </p>
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            ))
                        }
                    </Item.Group>
                </Card.Content>
            </Card>
        );
    }

    private onRemove = (e: React.SyntheticEvent<HTMLElement>) => {
        console.log(this.props);
        this.props.removeCard(this.props.title);
    }
}

const mapStateToProps = (state: store.IStoreState): {} => {
    return {
    };
};

const mapDispatchToProps = (dispatch: Dispatch<actions.ICardAction>): IFeedCardDispatch => ({
    removeCard: (title: string) => dispatch(actions.removeCard(title))
});

export const FeedCard = connect(mapStateToProps, mapDispatchToProps)(FeedCardComponent);
