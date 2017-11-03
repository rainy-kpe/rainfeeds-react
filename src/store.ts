import { applyMiddleware, createStore } from "redux";
import { logger } from "redux-logger";
import { default as thunk } from "redux-thunk";

import { reducers } from "./reducers";
import { ICounterState } from "./containers/counter/counter";
import { ICardState } from "./containers/rainfeeds/rainfeeds";
import { IFeedState } from "./containers/feed-card/feed-card";

export const store = createStore(
    reducers,
    applyMiddleware(thunk, logger)
);

export interface IStoreState {
    counterState: ICounterState;
    cardState: ICardState;
    feedState: IFeedState;
}
