import { store, IStoreState } from "../store";
import { Dispatch } from "redux";

import * as actions from "../actions/feedActions";
import * as _ from "lodash";

export const fetchHackerNews = (feedTitle: string) => {
    return async (dispatch: Dispatch<actions.IFeedAction>) => {
        dispatch(actions.feedRequest(feedTitle));

        try {
            const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
            const json = await response.json();

            // Only download items which are new
            const state = (store.getState() as IStoreState).feedState["Hacker News"];
            const oldItems = state.feed ? state.feed.entries.map((entry) => entry.id) : [];

            const fetches = _.range(0, 30).map(async (index) => {
                if (!_.includes(oldItems, json[index])) {
                    const item = await fetch(`https://hacker-news.firebaseio.com/v0/item/${json[index]}.json`);
                    return item.json();
                } else {
                    return null;
                }
            });

            const result = await Promise.all(fetches);

            if (BUILD === "development") {
                console.log(feedTitle, result);
            }

            const entries = result
                .filter((entry) => !!entry)
                .filter((entry) => entry.score > 50)
                .map((entry: any) => {
                    return {
                        title: entry.title,
                        summary: `Score: ${entry.score} by ${entry.by} | Comments: ${entry.descendants}`,
                        time: new Date(entry.time * 1000).toISOString(),
                        link: entry.url,
                        summaryLink: `https://news.ycombinator.com/item?id=${entry.id}`,
                        id: entry.id
                    } as actions.IFeedEntry;
                }).concat(state.feed ? state.feed.entries : []);

            dispatch(actions.feedSuccess(feedTitle, {
                title: feedTitle,
                date: new Date().toISOString(),
                entries: _.take(entries, 20)
            }));
        } catch (error) {
            dispatch(actions.feedFailure(feedTitle, error));
        }
    };
};
