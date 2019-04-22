import { Dispatch } from "redux";

import * as actions from "../actions/feedActions";
import * as _ from "lodash";
const Parser = require("rss-parser");

export const fetchFeed = (feedTitle: string, url: string) => {
    return async (dispatch: Dispatch<actions.IFeedAction>) => {
        dispatch(actions.feedRequest(feedTitle, url));

        try {
            const parser = new Parser();
            const feed = await parser.parseURL(url);

            if (BUILD === "development") {
                console.log(feedTitle, feed);
            }

            dispatch(actions.feedSuccess(feedTitle, {
                    title: feed.title,
                    date: feed.lastBuildDate,
                    entries: feed.items.map((entry: any) => {
                        let image;
                        let imageLink;
                        let content = entry["content:encoded"] || entry["content"];

                        if (content) {
                            let re = content.match(/img src=\"(.*?)\"/i);
                            image = re && re.length > 1 ? re[1] : undefined;

                            re = content.match(/.*href=\"(.*?)\">\[link/i);
                            imageLink = re && re.length > 1 ? re[1] : undefined;

                            const elem = document.createElement('textarea');
                            elem.innerHTML = content;
                            content = elem.value;
                        }

                        let title = entry.title || "";
                        let summary = content || "";

                        title = title.replace(/<(?:.|\n)*?>/gm, "");
                        summary = summary.replace(/<(?:.|\n)*?>/gm, "");

                        return {
                            title,
                            summary,
                            time: entry.updated,
                            image,
                            imageLink,
                            link: _.isArray(entry.link) ? entry.link[0].href : (entry.link.href || entry.link)
                        };
                    })
                }
            ));
        } catch (error) {
            console.error(error);
            dispatch(actions.feedFailure(feedTitle, error));
        }
    };
};
