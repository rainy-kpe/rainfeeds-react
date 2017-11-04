import { Dispatch } from "redux";
import * as _ from "lodash";

/* Type definitions */

export interface ICardState {
    cards: string[];
    showAskDialog: boolean;
}

export interface ICardAction {
    type: "ADD_CARD" | "REMOVE_CARD" | "ASK_CARD_NAME" | "HIDE_ASK_CARD_NAME";
    title?: string;
}

export interface ICardDispatch {
    askCardName: () => ICardAction;
    hideAskCardName: () => ICardAction;
    addCard: (title: string) => ICardAction;
    removeCard: (title: string) => ICardAction;
}

/* Property mapper */

export const mapDispatchToProps = (dispatch: Dispatch<ICardAction>): ICardDispatch => ({
    askCardName: () => dispatch(askCardName()),
    hideAskCardName: () => dispatch(hideAskCardName()),
    addCard: (title: string) => dispatch(addCard(title)),
    removeCard: (title: string) => dispatch(removeCard(title))
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

export const askCardName = (): ICardAction => ({
    type: "ASK_CARD_NAME"
});

export const hideAskCardName = (): ICardAction => ({
    type: "HIDE_ASK_CARD_NAME"
});

/* Reducer */

const initialState: ICardState = {
    cards: ["Hello"],
    showAskDialog: false
};

export const cardReducer = (state: ICardState = initialState, action: ICardAction) => {
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
