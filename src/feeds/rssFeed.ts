import { Dispatch } from "redux";

import * as actions from "../actions/feedActions";
import * as _ from "lodash";

export const fetchFeed = (feedTitle: string, url: string) => {
    return async (dispatch: Dispatch<actions.IFeedAction>) => {
        dispatch(actions.feedRequest(feedTitle, url));

        try {
            const response = await fetch(url);
            const json = await response.json();
            const feed = json.query.results.feed;

            if (BUILD === "development") {
                console.log(feedTitle, feed);
            }

            dispatch(actions.feedSuccess(feedTitle, {
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
            dispatch(actions.feedFailure(feedTitle, error));
        }
    };
};
