import * as _ from "lodash";

/* Type definitions */
export interface IFeedEntry {
    title: string;
    summary: string;
    summaryLink?: string;
    link: string;
    time?: string;
    image?: string;
    imageLink?: string;
    id?: any;
}

export interface IFeed {
    title: string;
    date: string;
    entries: IFeedEntry[];
}

export interface ISingleFeedState {
    feed: IFeed;
    fetching: boolean;
    failure: boolean;
    lastUpdate: number;
}

export interface IFeedState {
    [title: string]: ISingleFeedState;
}

export interface IFeedAction {
    type: "FEED_REQUEST" | "FEED_FAILURE" | "FEED_SUCCESS";
    title: string;
    url?: string;
    response?: any;
    error?: any;
}

/* Action creators */

export const feedRequest = (title: string, url?: string): IFeedAction => ({
    type: "FEED_REQUEST",
    title,
    url
});

export const feedFailure = (title: string, error: string): IFeedAction => ({
    type: "FEED_FAILURE",
    title,
    error
});

export const feedSuccess = (title: string, response: IFeed): IFeedAction => ({
    type: "FEED_SUCCESS",
    title,
    response
});

/* Reducer */

const initialState: IFeedState = {
};

const mergeFeeds = (current: IFeed, newFeed: IFeed) => {
    const entries = (current && current.entries || []).concat(newFeed.entries);
    let all: IFeedEntry[] = _.uniqBy(entries, (entry: IFeedEntry) => entry.title);
    if (entries.length > 0 && entries[0].time) {
        all.sort((a: IFeedEntry, b: IFeedEntry) => {
            const dtA: Date = new Date(a.time);
            const dtB: Date = new Date(b.time);
            return dtB.getTime() - dtA.getTime();
        });
    }

    return {
        ...newFeed,
        entries: all
    };
};

export const feedReducer = (state: IFeedState = initialState, action: IFeedAction) => {
    const newState = _.cloneDeep(state);
    if (action.title && !newState[action.title]) {
        newState[action.title] = {
            feed: null,
            fetching: false,
            failure: false,
            lastUpdate: 0
        };
    }

    switch (action.type) {
        case "FEED_REQUEST":
            newState[action.title].fetching = true;
            newState[action.title].failure = false;
            newState[action.title].lastUpdate = new Date().valueOf();
            break;
        case "FEED_FAILURE":
            newState[action.title].fetching = false;
            newState[action.title].failure = true;
            break;
        case "FEED_SUCCESS":
            newState[action.title].fetching = false;
            newState[action.title].failure = false;
            newState[action.title].feed = mergeFeeds(newState[action.title].feed, action.response);
        }
    return newState;
};
