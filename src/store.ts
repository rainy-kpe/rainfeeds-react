import { createStore } from "redux";

import * as reducers from "./reducers";
import * as rainfeeds from "./containers/rainfeeds/rainfeeds";

export const store = createStore(reducers.reducers, {});

export interface IStoreState {
    rainfeeds: rainfeeds.IRainfeedsState;
}
