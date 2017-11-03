import { Dispatch } from "redux";

export type ActionTypes = IFeedAction | ICardAction | IIncrementAction | IOtherAction;

export interface IFeedAction {
    type: "FEED_REQUEST" | "FEED_FAILURE" | "FEED_SUCCESS";
    url?: string;
    response?: any;
    error?: any;
}

export interface ICardAction {
    type: "ADD_CARD" | "REMOVE_CARD" | "ASK_CARD_NAME" | "HIDE_ASK_CARD_NAME";
    title?: string;
}

export interface IIncrementAction {
    type: "INCREMENT_COUNTER";
    amount: number;
}

export interface IOtherAction {
    type: "OTHER_ACTION";
}

/* Actions */

export const incrementCounter = (amount: number): IIncrementAction => ({
    type: "INCREMENT_COUNTER",
    amount
});

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

export const feedRequest = (url: string): IFeedAction => ({
    type: "FEED_REQUEST",
    url
});

export const feedFailure = (error: string): IFeedAction => ({
    type: "FEED_FAILURE",
    error
});

export const feedSuccess = (response: any): IFeedAction => ({
    type: "FEED_SUCCESS",
    response
});

export function fetchFeed(url: string) {
    return async (dispatch: Dispatch<IFeedAction>) => {
        dispatch(feedRequest(url));

        try {
            const response = await fetch(url);
            const json = await response.json();
            dispatch(feedSuccess(json));
        } catch (error) {
            dispatch(feedFailure(error));
        }
    };
}
