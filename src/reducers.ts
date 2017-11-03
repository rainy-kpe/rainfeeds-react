import { combineReducers } from "redux";
import * as _ from "lodash";

import * as store from "./store";
import * as actions from "./actions";
import { ICounterState } from "./containers/counter/counter";
import { ICardState } from "./containers/rainfeeds/rainfeeds";
import { IFeedState } from "./containers/feed-card/feed-card";

const initialState: ICounterState = {
    counter: 0
};

const counterReducer = (state: ICounterState = initialState, action: actions.IIncrementAction) => {
    switch (action.type) {
        case "INCREMENT_COUNTER":
            return { counter: state.counter  + action.amount };
        default:
            return state;
    }
};

const initialCardState: ICardState = {
    cards: ["Hello"],
    showAskDialog: false
};

const cardReducer = (state: ICardState = initialCardState, action: actions.ICardAction) => {
    switch (action.type) {
        case "ADD_CARD":
            return { ...state, cards: state.cards.concat(action.title) };
        case "REMOVE_CARD":
            return { ...state, cards: _.filter(state.cards, (title) => title !== action.title) };
        case "ASK_CARD_NAME":
            return { ...state, showAskDialog: true };
        case "HIDE_ASK_CARD_NAME":
            return { ...state, showAskDialog: false };
        default:
            return state;
    }
};

const initialFeedState: IFeedState = {
    feed: {},
    fetching: false
};

const feedReducer = (state: IFeedState = initialFeedState, action: actions.IFeedAction) => {
    switch (action.type) {
        case "FEED_REQUEST":
            return { ...state, fetching: true };
        case "FEED_FAILURE":
            return { ...state, fetching: false };
        case "FEED_SUCCESS":
            return { ...state, fetching: false, feed: action.response };
        default:
            return state;
    }
};

// TODO: Match this type with the store
export const reducers = combineReducers({
    counterState: counterReducer,
    cardState: cardReducer,
    feedState: feedReducer
});
