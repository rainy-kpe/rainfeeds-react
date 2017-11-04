import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Modal, Button, Header, Card, Item } from "semantic-ui-react";

import * as style from "./feed-card.styl";
import * as image from "./image.png";
import * as actions from "../../actions/cardActions";
import * as feedActions from "../../actions/feedActions";
import * as store from "../../store";

export interface IFeedCardProps {
    title: string;
}

class FeedCardComponent extends React.Component<IFeedCardProps & actions.ICardDispatch> {
    private items: any[] = [];

    constructor() {
        super();

        this.items = [...Array(7)];
    }

    public componentDidMount() {
        // const url = "http://www.rainlendar.net/cms/index.php?option=com_kunena&Itemid=42&func=fb_rss&no_html=1";
        // const url = "http://www.reddit.com/.rss";
        const url = "https://query.yahooapis.com/v1/public/yql" +
            "?format=json&q=select%20*%20from%20feednormalizer%20where%20" +
            "url=%22http%3A%2F%2Fwww.rainlendar.net%2Fcms%2Findex.php%3Foption%3Dcom_kunena%26Itemid" +
            "%3D42%26func%3Dfb_rss%26no_html%3D1%22%20and%20output=%22atom_1.0%22";

        store.store.dispatch(feedActions.fetchFeed(url));
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
                                { key: "done", content: "Delete", positive: true, onClick: this.onRemove }
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
        this.props.removeCard(this.props.title);
    }
}

export const FeedCard = connect(undefined, actions.mapDispatchToProps)(FeedCardComponent);
