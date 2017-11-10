import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { Icon, Loader, Dropdown, Modal, Button, Header, Card, Item } from "semantic-ui-react";
import * as _ from "lodash";
import * as moment from "moment";

import * as style from "./feedCard.styl";
import * as actions from "../../actions/cardActions";
import * as feedActions from "../../actions/feedActions";
import * as store from "../../store";
import { Feed } from "../feed/feed";

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
        const { title } = this.props;
        return (
            <Card className={ style.card } raised>
                <Card.Content>
                    <Card.Header className={style.header}>
                        { title }
                        { this.props.fetching && <Loader size="tiny" inline active /> }
                        { this.props.failure && <Icon name="warning sign" /> }
                        <span className={style.subtitle}>{
                            this.props.feed && !this.props.fetching ? moment(this.props.feed.date).fromNow() : ""
                        }</span>
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
                    <Feed title={title} />
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
            const fetchFeed = (url: string) => {
                store.store.dispatch(feedActions.fetchFeed(this.props.title, url));
                const id = setTimeout(() => fetchFeed(url), card.updateRate * 60 * 1000);
                this.timeouts[url] = id;
            };

            card.urls.forEach((url) => {
                const yahooUrl = "https://query.yahooapis.com/v1/public/yql" +
                "?format=json&q=select%20*%20from%20feednormalizer%20where%20" +
                "url=%22" + encodeURIComponent(url) + "%22%20and%20output=%22atom_1.0%22";

                fetchFeed(yahooUrl);
            });
        }
    }

    private onConfirmDelete = (e: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ showConfirmation: true });
    }

    private onRemove = (e: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ showConfirmation: false });
        this.props.removeCard(this.props.title);
    }

    private onConfig = (e: React.SyntheticEvent<HTMLElement>) => {
        this.props.toggleSettings(this.props.title);
    }
}

export const mapStateToProps = (state: store.IStoreState, ownProps: IFeedCardProps):
    actions.ICardState & feedActions.ISingleFeedState => {

    return _.merge({}, state.cardState, state.feedState[ownProps.title]);
};

export const FeedCard = connect(mapStateToProps, actions.mapDispatchToProps)(FeedCardComponent);
