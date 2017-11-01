
import * as React from "react";
import { Card, Item } from "semantic-ui-react";

import * as style from "./feed-card.styl";
import * as image from "./image.png";

export interface IFeedCardProps {
    title: string;
}

export class FeedCard extends React.Component<IFeedCardProps, {}> {
    private items: any[] = [];

    constructor() {
        super();

        this.items = [...Array(7)];
    }

    public render() {
        const { title } = this.props;
        return (
            <Card className={ style.card } raised>
                <Card.Content header={ title } />
                <Card.Content description className={ style.content }>
                    <Item.Group>
                        {
                            this.items.map((item: any) => (
                                <Item>
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
}
