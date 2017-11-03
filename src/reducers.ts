import { combineReducers } from "redux";
import * as _ from "lodash";

import * as store from "./store";
import * as actions from "./actions";
import { ICounterState } from "./containers/counter/counter";
import { ICardState } from "./containers/rainfeeds/rainfeeds";

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
    cards: ["Hello", "World"],
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

// TODO: Match this type with the store
export const reducers = combineReducers({
    counterState: counterReducer,
    cardState: cardReducer
});
