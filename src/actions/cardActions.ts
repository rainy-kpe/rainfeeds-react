import * as firebase from "firebase";
import { Dispatch } from "redux";
import * as _ from "lodash";

import { IStoreState } from "../store";

/* Type definitions */
export interface ICard {
    type: "rss" | "hackernews";
    order: number;
    title: string;
    urls?: string[];
    updateRate: number;
}

export interface ICardState {
    cards: ICard[];
    showSettings: string;
}

export interface ICardAction {
    type: "ADD_CARD" | "REMOVE_CARD" | "UPDATE_CARD" |  "CLEAR_CARDS" | "TOGGLE_SETTINGS";
    title?: string;
    card?: ICard;
}

export interface ICardDispatch {
    addCard: (title: string) => ICardAction;
    removeCard: (title: string) => ICardAction;
    updateCard: (card: ICard) => ICardAction;
    clearCards: () => ICardAction;
    toggleSettings: (title: string) => ICardAction;
}

/* Property mappers */

export const mapDispatchToProps = (dispatch: Dispatch<ICardAction>): ICardDispatch => ({
    addCard: (title: string) => dispatch(addCard(title)),
    removeCard: (title: string) => dispatch(removeCard(title)),
    updateCard: (card: ICard) => dispatch(updateCard(card)),
    clearCards: () => dispatch(clearCards()),
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

export const clearCards = (): ICardAction => ({
    type: "CLEAR_CARDS",
});

export const toggleSettings = (title: string): ICardAction => ({
    type: "TOGGLE_SETTINGS",
    title
});

/* Reducer */

const initialState: ICardState = {
    cards: [
        { type: "rss", order: 1, title: "Reddit", updateRate: 15, urls: [
            "http://www.reddit.com/.rss"
        ]},
        { type: "hackernews", order: 2, title: "Hacker News", updateRate: 30, urls: [] },
/*        { type: "rss", order: 3, title: "Rainlendar", updateRate: 60, urls: [
            "http://www.rainlendar.net/cms/index.php?option=com_kunena&Itemid=42&func=fb_rss&no_html=1"]
        },
        { type: "rss", order: 4, title: "Tivi", updateRate: 60, urls: [
            "http://www.tivi.fi/rss.xml"
        ]},
        { type: "rss", order: 5, title: "Afterdawn", updateRate: 30, urls: [
            "http://feeds.afterdawn.com/afterdawn_uutiset"
        ]},
        { type: "rss", order: 6, title: "Aamulehti", updateRate: 60, urls: [
            "http://www.aamulehti.fi/?feed=uutiset&o=RSS%20-%20Ihmiset&k=0&ma=0&c=6",
            "http://www.aamulehti.fi/?feed=uutiset&o=RSS%20-%20Kotimaa&k=0&ma=0&c=2",
            "http://www.aamulehti.fi/?feed=uutiset&o=RSS%20-%20Kulttuuri&k=0&ma=0&c=8",
            "http://www.aamulehti.fi/?feed=uutiset&o=RSS%20-%20Maailma&k=0&ma=0&c=4",
            "http://www.aamulehti.fi/?feed=uutiset&o=RSS%20-%20Raha&k=0&ma=0&c=3"
        ]},
        { type: "rss", order: 7, title: "Iltalehti", updateRate: 30, urls: [
            "http://www.iltalehti.fi/osastot/rss2-osastot-short20_os.xml"
        ]},
        { type: "rss", order: 8, title: "Blogs", updateRate: 60, urls: [
            "http://blog.polymer-project.org/feed.xml",
            "https://blogs.msdn.microsoft.com/typescript/feed/",
            "https://javascriptweblog.wordpress.com/feed/",
            "http://feeds.feedburner.com/2ality"
        ]},
        { type: "rss", order: 9, title: "JS Newsletter", updateRate: 60, urls: [
            "http://javascriptweekly.com/rss/1gh1ef0b"
        ]} */
    ],
    showSettings: null
};

export const cardReducer = (state: ICardState = initialState, action: ICardAction) => {
    switch (action.type) {
        case "ADD_CARD":
            return { ...state, cards: state.cards.concat({
                type: "rss",
                order: state.cards.length > 0 ? state.cards[state.cards.length - 1].order + 1 : 1,
                title: action.title,
                urls: [],
                updateRate: 60
            }) };
        case "REMOVE_CARD":
            return { ...state, cards: _.filter(state.cards, (card) => card.title !== action.title) };
        case "UPDATE_CARD":
            return { ...state, cards: state.cards.map(
                (card) => card.title === action.card.title ? action.card : card) };
        case "CLEAR_CARDS":
            return { ...state, cards: [] };
        case "TOGGLE_SETTINGS":
            return { ...state, showSettings: action.title };
        default:
            return state;
    }
};

/* Helpers */

export const getCardsFromDatabase = () => {
    return async (dispatch: Dispatch<ICardAction>) => {
        dispatch(clearCards());
        const userId = firebase.auth().currentUser.uid;
        const data = await firebase.database().ref(`cards/${userId}`).once("value");
        if (data) {
            const cards = data.val() as {[title: string]: ICard};
            const cardArray = _.sortBy(_.map(cards, (card) => card), "order");
            cardArray.forEach((card) => {
                dispatch(addCard(card.title));
                dispatch(updateCard(card));
            });
        }
    };
};

export const addCardToDatabase = (title: string) => {
    return async (dispatch: Dispatch<ICardAction>) => {
        try {
            const userId = firebase.auth().currentUser.uid;
            await firebase.database().ref(`cards/${userId}/${title}`).set({
                title
            });
            dispatch(addCard(title));
        } catch (error) {
            console.log(error);
        }
    };
};

export const updateCardToDatabase = (card: ICard) => {
    return async (dispatch: Dispatch<ICardAction>) => {
        try {
            const userId = firebase.auth().currentUser.uid;
            await firebase.database().ref(`cards/${userId}/${card.title}`).set(card);
            dispatch(updateCard(card));
        } catch (error) {
            console.log(error);
        }
    };
};

export const removeCardFromDatabase = (title: string) => {
    return async (dispatch: Dispatch<ICardAction>) => {
        try {
            const userId = firebase.auth().currentUser.uid;
            await firebase.database().ref(`cards/${userId}/${title}`).remove();
            dispatch(removeCard(title));
        } catch (error) {
            console.log(error);
        }
    };
};
