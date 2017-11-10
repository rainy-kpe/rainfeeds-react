import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Popup, Item } from "semantic-ui-react";
import * as _ from "lodash";
import * as moment from "moment";

import * as style from "./feed.styl";
import * as actions from "../../actions/feedActions";
import * as store from "../../store";

interface IFeedProps {
    title: string;
}

interface IFeedState {
    feed: actions.IFeed;
    fetching: boolean;
}

class FeedComponent extends React.Component<IFeedProps & IFeedState> {

    public render() {
        const { title, feed } = this.props;

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
                                    {item.time && <Item.Meta>{moment(item.time).fromNow()}</Item.Meta>}
                                    <Item.Description>
                                        {item.summary}
                                    </Item.Description>
                                </Item.Content>
                            </Item>
                        ))
                }
            </Item.Group>
        );
    }

    private renderHeading(item: actions.IFeedEntry) {
        return<Popup size="large" trigger={
                <Item.Header as="a" target="_blank" href={item.link} content={item.title} />
            }>
            <div>{item.title}</div>
            <div className={style.summary}>{item.summary}</div>
        </Popup>;
    }

}

export const mapStateToProps = (state: store.IStoreState, ownProps: IFeedProps): IFeedState => {
    if (state.feedState[ownProps.title]) {
        return state.feedState[ownProps.title];
    }
    return { feed: null, fetching: false };
};

export const Feed = connect(mapStateToProps)(FeedComponent);
