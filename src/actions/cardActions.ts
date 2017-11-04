import { Dispatch } from "redux";
import * as _ from "lodash";

import { IStoreState } from "../store";

/* Type definitions */
export interface ICard {
    title: string;
    urls: string[];
}

export interface ICardState {
    cards: ICard[];
    showAskDialog: boolean;
    showDeleteConfirmationDialog: boolean;
    showSettings: boolean;
}

export interface ICardAction {
    type: "ADD_CARD" | "REMOVE_CARD" | "TOGGLE_ASK_CARD_NAME" | "TOGGLE_DELETE_CONFIRMATION" | "TOGGLE_SETTINGS";
    title?: string;
    show?: boolean;
}

export interface ICardDispatch {
    addCard: (title: string) => ICardAction;
    removeCard: (title: string) => ICardAction;
    toggleAskCardName: (show: boolean) => ICardAction;
    toggleDeleteConfirmation: (show: boolean) => ICardAction;
    toggleSettings: (show: boolean) => ICardAction;
}

/* Property mappers */

export const mapDispatchToProps = (dispatch: Dispatch<ICardAction>): ICardDispatch => ({
    addCard: (title: string) => dispatch(addCard(title)),
    removeCard: (title: string) => dispatch(removeCard(title)),
    toggleAskCardName: (show: boolean) => dispatch(toggleAskCardName(show)),
    toggleDeleteConfirmation: (show: boolean) => dispatch(toggleDeleteConfirmation(show)),
    toggleSettings: (show: boolean) => dispatch(toggleSettings(show))
});

export const mapStateToProps = (state: IStoreState): ICardState => ({
    cards: state.cardState.cards,
    showAskDialog: state.cardState.showAskDialog,
    showDeleteConfirmationDialog: state.cardState.showDeleteConfirmationDialog,
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

export const toggleAskCardName = (show: boolean): ICardAction => ({
    type: "TOGGLE_ASK_CARD_NAME",
    show
});

export const toggleDeleteConfirmation = (show: boolean): ICardAction => ({
    type: "TOGGLE_DELETE_CONFIRMATION",
    show
});

export const toggleSettings = (show: boolean): ICardAction => ({
    type: "TOGGLE_SETTINGS",
    show
});

/* Reducer */

const initialState: ICardState = {
    cards: [{ title: "Test Feed", urls: []}],
    showAskDialog: false,
    showDeleteConfirmationDialog: false,
    showSettings: false
};

export const cardReducer = (state: ICardState = initialState, action: ICardAction) => {
    switch (action.type) {
        case "ADD_CARD":
            return { ...state, cards: state.cards.concat({title: action.title, urls: []}) };
        case "REMOVE_CARD":
            return { ...state, cards: _.filter(state.cards, (card) => card.title !== action.title) };
        case "TOGGLE_ASK_CARD_NAME":
            return { ...state, showAskDialog: action.show };
        case "TOGGLE_DELETE_CONFIRMATION":
            return { ...state, showDeleteConfirmationDialog: action.show };
        case "TOGGLE_SETTINGS":
            return { ...state, showSettings: action.show };
        default:
            return state;
    }
};
