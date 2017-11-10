import { Dispatch } from "redux";
import * as _ from "lodash";

import * as store from "../store";

/* Type definitions */
export interface IFeedEntry {
    title: string;
    summary: string;
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

export const fetchHackerNews = (feedTitle: string) => {
    return async (dispatch: Dispatch<IFeedAction>) => {
        dispatch(feedRequest(feedTitle));

        try {
            const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
            const json = await response.json();

            // Only download items which are new
            const state = (store.store.getState() as store.IStoreState).feedState["Hacker News"];
            const oldItems = state.feed ? state.feed.entries.map((entry) => entry.id) : [];

            console.log("State", oldItems);

            const fetches = _.range(0, 20).map(async (index) => {
                if (!_.includes(oldItems, json[index])) {
                    const item = await fetch(`https://hacker-news.firebaseio.com/v0/item/${json[index]}.json`);
                    return item.json();
                } else {
                    return null;
                }
            });

            const result = await Promise.all(fetches);
            console.log(feedTitle, result);

            const entries = result.filter((entry) => !!entry)
                .map((entry: any) => {
                    return {
                        title: entry.title,
                        summary: `Score: ${entry.score} by ${entry.by} | Comments: ${entry.descendants}`,
                        time: new Date(entry.time * 1000).toISOString(),
                        link: entry.url,
                        id: entry.id
                    } as IFeedEntry;
                }).concat(state.feed ? state.feed.entries : []);

            dispatch(feedSuccess(feedTitle, {
                title: feedTitle,
                date: new Date().toISOString(),
                entries: result.map((entry: any) => {
                    return {
                        title: entry.title,
                        entry: _.take(entries, 20),
                        summary: `Score: ${entry.score} by ${entry.by} | Comments: ${entry.descendants}`,
                        time: new Date(entry.time * 1000).toISOString(),
                        link: entry.url,
                        id: entry.id
                    };
                })
            }));
        } catch (error) {
            dispatch(feedFailure(feedTitle, error));
        }
    };
};

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
                            if (entry.content.content) {
                                let re = entry.content.content.match(/img src=\"(.*?)\"/i);
                                image = re && re.length > 1 ? re[1] : undefined;

                                re = entry.content.content.match(/.*href=\"(.*?)\">\[link/i);
                                imageLink = re && re.length > 1 ? re[1] : undefined;
                            } else {
                                image = entry.content.url;
                            }
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
                            link: _.isArray(entry.link) ? entry.link[0].href : entry.link.href
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
