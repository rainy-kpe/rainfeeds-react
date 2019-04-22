import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Icon, Loader, Dropdown, Modal, Button, Header, Card, Item } from "semantic-ui-react";
import * as _ from "lodash";
import * as moment from "moment";

import * as style from "./feedCard.styl";
import * as actions from "../../actions/cardActions";
import * as feedActions from "../../actions/feedActions";
import { store, IStoreState } from "../../store";
import { Feed } from "../feed/feed";
import { fetchFeed } from "../../feeds/rssFeed";
import { fetchHackerNews } from "../../feeds/hnFeed";

interface IFeedCardProps {
    title: string;
}

interface IFeedCardComponentState {
    showConfirmation: boolean;
}

type IFeedCardComponentProps = IFeedCardProps & actions.ICardDispatch & { card: actions.ICard } &
    feedActions.ISingleFeedState;

class FeedCardComponent extends React.Component<IFeedCardComponentProps, IFeedCardComponentState> {
    private timeouts: {[url: string]: any} = {};

    constructor(props: IFeedCardComponentProps, context: any) {
        super(props, context);

        this.state = { showConfirmation: false };
    }

    public componentDidMount() {
        this.refreshFeeds();

        document.addEventListener("visibilitychange", this.onVisibilityChange, false);
    }

    public componentWillUnmount() {
        document.removeEventListener("visibilitychange", this.onVisibilityChange);
    }

    public shouldComponentUpdate(nextProps: IFeedCardComponentProps) {
        const notEqualFeed = !_.isEqual(this.props.feed, nextProps.feed);
        const notEqualCard = !_.isEqual(this.props.card, nextProps.card);
        return notEqualFeed || notEqualCard;
    }

    public componentDidUpdate(prevProps: IFeedCardComponentProps, prevState: IFeedCardComponentState) {
        const oldCard = prevProps.card;
        const newCard = this.props.card;

        if (oldCard && newCard && !_.isEqual(oldCard, newCard)) {
            console.log("componentDidUpdate: " + oldCard.title);

            // Cancel all timeouts
            _.values(this.timeouts).forEach((value) => clearTimeout(value));

            // Refresh feeds
            this.refreshFeeds();
        }
    }

    public render() {
        const { title, feed, fetching } = this.props;
        return (
            <Card className={ style.card } raised>
                <Card.Content>
                    <Card.Header className={style.header}>
                        { title }
                        { this.props.fetching && <Loader size="tiny" inline active /> }
                        { this.props.failure && <Icon name="warning sign" /> }
                        <span className={style.subtitle}>
                            {feed && !fetching ? moment(feed.date).fromNow() : ""}
                        </span>
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
                    <Feed feed={feed} />
                </Card.Content>

                <Modal
                    onClose={() => this.setState({ showConfirmation: false})}
                    dimmer="blurring"
                    size="mini"
                    open={this.state.showConfirmation}
                    header="Delete card?"
                    content={`Are you sure you want to delete the card: '${title}'?`}
                    actions={[
                        "Cancel",
                        { key: "done", content: "Delete", positive: true, onClick: this.onRemove }
                    ]} />
            </Card>
        );
    }

    private refreshFeeds() {
        const card = this.props.card;
        if (card) {
            const fetchFeedLoop = (name: string, callback: () => void) => {
                if (this.props.feed) {
                    setTimeout(() => callback(), Math.random() * 10000);
                } else {
                    callback();
                }
                const id = setTimeout(() => fetchFeedLoop(name, callback), card.updateRate * 60 * 1000);
                this.timeouts[name] = id;
            };

            if (card.type === "hackernews") {
                if (this.timeouts[card.title]) {
                    clearTimeout(this.timeouts[card.title]);
                }
                fetchFeedLoop(card.title, () => fetchHackerNews(this.props.title)(store.dispatch));
            } else {
                if (card.urls) {
                    card.urls.forEach((url) => {
                        const feedUrl = "feed?url=" + encodeURIComponent(url);

                        if (this.timeouts[feedUrl]) {
                            clearTimeout(this.timeouts[feedUrl]);
                        }
                        fetchFeedLoop(feedUrl, () => fetchFeed(this.props.title, feedUrl)(store.dispatch));
                    });
                }
            }
        }
    }

    private onConfirmDelete = (e: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ showConfirmation: true });
    }

    private onRemove = (e: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ showConfirmation: false });

        actions.removeCardFromDatabase(this.props.title)(store.dispatch);
    }

    private onConfig = (e: React.SyntheticEvent<HTMLElement>) => {
        this.props.toggleSettings(this.props.title);
    }

    private onVisibilityChange = () => {
        const card = this.props.card;
        if (card && this.props.lastUpdate && (document as any).visibilityState === "visible") {
            if (moment().diff(moment(this.props.lastUpdate), "minutes") > card.updateRate) {
                this.refreshFeeds();
            }
        }
    }
}

export const mapStateToProps = (state: IStoreState, ownProps: IFeedCardProps):
    { card: actions.ICard } & feedActions.ISingleFeedState => {

    const card = _.find(state.cardState.cards, (c) => c.title === ownProps.title);
    const props = _.merge({}, { card }, state.feedState[card.title]);

    return props;
};

export const FeedCard = connect(mapStateToProps, actions.mapDispatchToProps)(FeedCardComponent);
