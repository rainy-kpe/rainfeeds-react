import { Dispatch } from "redux";
import * as _ from "lodash";

import { IStoreState } from "../store";

/* Type definitions */
export interface IFeedEntry {
    title: string;
    summary: string;
    link: string;
    time?: string;
    image?: string;
    imageLink?: string;
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

export const feedRequest = (title: string, url: string): IFeedAction => ({
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

export const fetchFeed = (feedTitle: string, url: string) => {
    return async (dispatch: Dispatch<IFeedAction>) => {
        dispatch(feedRequest(feedTitle, url));

        try {
            const response = await fetch(url);
            const json = await response.json();
            const feed = json.query.results.feed;

            console.log(feedTitle, feed);

            dispatch(feedSuccess(feedTitle, {
                    title: _.isString(feed.title) ? feed.title : feed.title.content,
                    date: feed.date,
                    entries: feed.entry.map((entry: any) => {
                        let image;
                        let imageLink;
                        if (entry.content) {
                            let re = entry.content.content.match(/img src=\"(.*?)\"/i);
                            image = re && re.length > 1 ? re[1] : undefined;

                            re = entry.content.content.match(/.*href=\"(.*?)\">\[link/i);
                            imageLink = re && re.length > 1 ? re[1] : undefined;
                        }

                        let title = _.isObject(entry.title) ? entry.title.content : entry.title || "";
                        let summary = _.isObject(entry.summary) ? entry.summary.content : entry.summary || "";

                        title = title.replace(/<(?:.|\n)*?>/gm, "");
                        summary = summary.replace(/<(?:.|\n)*?>/gm, "");

                        return {
                            title,
                            summary,
                            time: entry.updated,
                            image,
                            imageLink,
                            link: entry.link.href
                        };
                    })
                }
            ));
        } catch (error) {
            dispatch(feedFailure(feedTitle, error));
        }
    };
};

/* Reducer */

const initialState: IFeedState = {
};

const mergeFeeds = (current: IFeed, newFeed: IFeed) => {
    const entries = (current && current.entries || []).concat(newFeed.entries);
    const all: IFeedEntry[] = _.uniqBy(entries, (entry: IFeedEntry) => entry.title)
        .sort((a: IFeedEntry, b: IFeedEntry) => {
            const dtA: Date = new Date(a.time);
            const dtB: Date = new Date(b.time);
            return dtB.getTime() - dtA.getTime();
        });

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
            failure: false
        };
    }

    switch (action.type) {
        case "FEED_REQUEST":
            newState[action.title].fetching = true;
            newState[action.title].failure = false;
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
