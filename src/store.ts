import { applyMiddleware, createStore } from "redux";
import { logger } from "redux-logger";
import { default as thunk } from "redux-thunk";

import { reducers } from "./actions/actions";
import { ICounterState } from "./actions/counterActions";
import { ICardState } from "./actions/cardActions";
import { IFeedState } from "./actions/feedActions";

export const store = createStore(
    reducers,
    applyMiddleware(thunk, logger)
);

export interface IStoreState {
    counterState: ICounterState;
    cardState: ICardState;
    feedState: IFeedState;
}
