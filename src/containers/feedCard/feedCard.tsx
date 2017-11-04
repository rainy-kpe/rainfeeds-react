import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Dropdown, Modal, Button, Header, Card, Item } from "semantic-ui-react";

import * as style from "./feedCard.styl";
import * as image from "./image.png";
import * as actions from "../../actions/cardActions";
import * as feedActions from "../../actions/feedActions";
import * as store from "../../store";
import {Settings} from "../settings/settings";

export interface IFeedCardProps {
    title: string;
}

class FeedCardComponent extends React.Component<IFeedCardProps & actions.ICardDispatch & actions.ICardState> {
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
                        <Dropdown icon="ellipsis vertical">
                            <Dropdown.Menu>
                                <Dropdown.Item text="Configure" icon="setting" onClick={this.onConfig}/>
                                <Dropdown.Divider />
                                <Dropdown.Item text="Delete card" icon="remove" onClick={this.onConfirmDelete}/>
                            </Dropdown.Menu>
                        </Dropdown>
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

                <Modal
                    onClose={() => this.props.toggleDeleteConfirmation(false)}
                    dimmer="blurring"
                    size="mini"
                    open={this.props.showDeleteConfirmationDialog}
                    header="Delete card?"
                    content={`Are you sure you want to delete the card: '${title}'?`}
                    actions={[
                        "Cancel",
                        { key: "done", content: "Delete", positive: true, onClick: this.onRemove }
                    ]} />

                <Settings open={this.props.showSettings} cardName={title} />
            </Card>
        );
    }

    private onConfirmDelete = (e: React.SyntheticEvent<HTMLElement>) => {
        this.props.toggleDeleteConfirmation(true);
    }

    private onRemove = (e: React.SyntheticEvent<HTMLElement>) => {
        this.props.toggleDeleteConfirmation(false);
        this.props.removeCard(this.props.title);
    }

    private onConfig = (e: React.SyntheticEvent<HTMLElement>) => {
        this.props.toggleSettings(true);
    }
}

export const FeedCard = connect(actions.mapStateToProps, actions.mapDispatchToProps)(FeedCardComponent);
