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

type IFeedCardComponentProps = IFeedCardProps & actions.ICardDispatch & actions.ICardState &
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

    public componentDidUpdate(prevProps: IFeedCardComponentProps, prevState: IFeedCardComponentState) {
        const oldCard = _.find(prevProps.cards, (c) => c.title === prevProps.title);
        const newCard = _.find(this.props.cards, (c) => c.title === this.props.title);

        if (oldCard && newCard && !_.isEqual(oldCard, newCard)) {
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
        const card = _.find(this.props.cards, (c) => c.title === this.props.title);
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
                        const yahooUrl = "https://query.yahooapis.com/v1/public/yql" +
                        "?format=json&q=select%20*%20from%20feednormalizer%20where%20" +
                        "url=%22" + encodeURIComponent(url) + "%22%20and%20output=%22atom_1.0%22";

                        if (this.timeouts[yahooUrl]) {
                            clearTimeout(this.timeouts[yahooUrl]);
                        }
                        fetchFeedLoop(yahooUrl, () => fetchFeed(this.props.title, yahooUrl)(store.dispatch));
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
        const card = _.find(this.props.cards, (c) => c.title === this.props.title);
        if (card && this.props.lastUpdate && (document as any).visibilityState === "visible") {
            if (moment().diff(moment(this.props.lastUpdate), "minutes") > card.updateRate) {
                this.refreshFeeds();
            }
        }
    }
}

export const mapStateToProps = (state: IStoreState, ownProps: IFeedCardProps):
    actions.ICardState & feedActions.ISingleFeedState => {

    return _.merge({}, state.cardState, state.feedState[ownProps.title]);
};

export const FeedCard = connect(mapStateToProps, actions.mapDispatchToProps)(FeedCardComponent);
