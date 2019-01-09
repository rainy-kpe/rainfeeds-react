import * as React from "react";
import { Popup, Item } from "semantic-ui-react";
import * as _ from "lodash";
import * as moment from "moment";

import * as style from "./feed.styl";
import * as actions from "../../actions/feedActions";

interface IFeedProps {
    feed: actions.IFeed;
}

export class Feed extends React.Component<IFeedProps> {

    public render() {
        const { feed } = this.props;

        return (
            <Item.Group>
                {
                    feed &&
                        feed.entries.map((item, i: number) => (
                            <Item key={i}>
                                {
                                    item.image && <Item.Image as="a" target="_blank" href={item.imageLink} size="tiny"
                                        src={item.image} />
                                }
                                <Item.Content className={style.title}>
                                    {this.renderHeading(item)}
                                    {item.time ? <Item.Meta>{moment(item.time).fromNow()}</Item.Meta> : <br />}
                                    <Item.Description as="a" target="_blank" href={item.summaryLink}
                                        content={item.summary} />
                                </Item.Content>
                            </Item>
                        ))
                }
            </Item.Group>
        );
    }

    private renderHeading(item: actions.IFeedEntry) {
        return <Popup wide trigger={
                <Item.Header as="a" target="_blank" href={item.link} content={item.title} />
            }>
            <div>{item.title}</div>
            <div className={style.summary}>{item.summary}</div>
        </Popup>;
    }
}
