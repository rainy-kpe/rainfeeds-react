import { Dispatch } from "redux";
import * as _ from "lodash";

/* Type definitions */

export interface IFeedState {
    feed: any;
    fetching: boolean;
}

export interface IFeedAction {
    type: "FEED_REQUEST" | "FEED_FAILURE" | "FEED_SUCCESS";
    url?: string;
    response?: any;
    error?: any;
}

/* Action creators */

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

export const fetchFeed = (url: string) => {
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
};

/* Reducer */

const initialState: IFeedState = {
    feed: {},
    fetching: false
};

export const feedReducer = (state: IFeedState = initialState, action: IFeedAction) => {
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
