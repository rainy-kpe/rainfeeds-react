import { applyMiddleware, createStore } from "redux";
import { logger } from "redux-logger";

import { reducers } from "./reducers";
import { ICounterState } from "./containers/counter/counter";
import { ICardState } from "./containers/rainfeeds/rainfeeds";

export const store = createStore(
    reducers,
    applyMiddleware(logger)
);

export interface IStoreState {
    counterState: ICounterState;
    cardState: ICardState;
}
