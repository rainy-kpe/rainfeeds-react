import { Dispatch } from "redux";
import * as _ from "lodash";

import { IStoreState } from "../store";

/* Type definitions */
export interface ICard {
    type: "rss" | "hackernews";
    title: string;
    urls?: string[];
    updateRate: number;
}

export interface ICardState {
    cards: ICard[];
    showSettings: string;
}

export interface ICardAction {
    type: "ADD_CARD" | "REMOVE_CARD" | "UPDATE_CARD" | "TOGGLE_SETTINGS";
    title?: string;
    card?: ICard;
}

export interface ICardDispatch {
    addCard: (title: string) => ICardAction;
    removeCard: (title: string) => ICardAction;
    updateCard: (card: ICard) => ICardAction;
    toggleSettings: (title: string) => ICardAction;
}

/* Property mappers */

export const mapDispatchToProps = (dispatch: Dispatch<ICardAction>): ICardDispatch => ({
    addCard: (title: string) => dispatch(addCard(title)),
    removeCard: (title: string) => dispatch(removeCard(title)),
    updateCard: (card: ICard) => dispatch(updateCard(card)),
    toggleSettings: (title: string) => dispatch(toggleSettings(title))
});

export const mapStateToProps = (state: IStoreState): ICardState => ({
    cards: state.cardState.cards,
    showSettings: state.cardState.showSettings
});

/* Action creators */

export const addCard = (title: string): ICardAction => ({
    type: "ADD_CARD",
    title
});

export const removeCard = (title: string): ICardAction => ({
    type: "REMOVE_CARD",
    title
});

export const updateCard = (card: ICard): ICardAction => ({
    type: "UPDATE_CARD",
    card
});

export const toggleSettings = (title: string): ICardAction => ({
    type: "TOGGLE_SETTINGS",
    title
});

/* Reducer */

const initialState: ICardState = {
    cards: [
        { type: "rss", title: "Reddit", updateRate: 15, urls: [
            "http://www.reddit.com/.rss"
        ]},
        { type: "hackernews", title: "Hacker News", updateRate: 30 },
        { type: "rss", title: "Rainlendar", updateRate: 60, urls: [
            "http://www.rainlendar.net/cms/index.php?option=com_kunena&Itemid=42&func=fb_rss&no_html=1"]
        },
        { type: "rss", title: "Tivi", updateRate: 60, urls: [
            "http://www.tivi.fi/rss.xml"
        ]},
        { type: "rss", title: "Afterdawn", updateRate: 30, urls: [
            "http://feeds.afterdawn.com/afterdawn_uutiset"
        ]},
        { type: "rss", title: "Aamulehti", updateRate: 60, urls: [
            "http://www.aamulehti.fi/?feed=uutiset&o=RSS%20-%20Ihmiset&k=0&ma=0&c=6",
            "http://www.aamulehti.fi/?feed=uutiset&o=RSS%20-%20Kotimaa&k=0&ma=0&c=2",
            "http://www.aamulehti.fi/?feed=uutiset&o=RSS%20-%20Kulttuuri&k=0&ma=0&c=8",
            "http://www.aamulehti.fi/?feed=uutiset&o=RSS%20-%20Maailma&k=0&ma=0&c=4",
            "http://www.aamulehti.fi/?feed=uutiset&o=RSS%20-%20Raha&k=0&ma=0&c=3"
        ]},
        { type: "rss", title: "Iltalehti", updateRate: 30, urls: [
            "http://www.iltalehti.fi/osastot/rss2-osastot-short20_os.xml"
        ]},
        { type: "rss", title: "Blogs", updateRate: 60, urls: [
            "http://blog.polymer-project.org/feed.xml",
            "https://blogs.msdn.microsoft.com/typescript/feed/",
            "https://javascriptweblog.wordpress.com/feed/",
            "http://feeds.feedburner.com/2ality"
        ]},
        { type: "rss", title: "JS Newsletter", updateRate: 60, urls: [
            "http://javascriptweekly.com/rss/1gh1ef0b"
        ]}
    ],
    showSettings: null
};

export const cardReducer = (state: ICardState = initialState, action: ICardAction) => {
    switch (action.type) {
        case "ADD_CARD":
            return { ...state, cards: state.cards.concat({
                type: "rss",
                title: action.title,
                urls: [],
                updateRate: 60
            }) };
        case "REMOVE_CARD":
            return { ...state, cards: _.filter(state.cards, (card) => card.title !== action.title) };
        case "UPDATE_CARD":
            return { ...state, cards: state.cards.map(
                (card) => card.title === action.card.title ? action.card : card) };
        case "TOGGLE_SETTINGS":
            return { ...state, showSettings: action.title };
        default:
            return state;
    }
};
