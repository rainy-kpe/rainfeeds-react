import { applyMiddleware, createStore } from "redux";
import { logger } from "redux-logger";
import { default as thunk } from "redux-thunk";

import { reducers } from "./actions/actions";
import { ICardState } from "./actions/cardActions";
import { IFeedState } from "./actions/feedActions";
import { IAuthState } from "./actions/authActions";

let middleWare;
if (BUILD === "production") {
    middleWare = applyMiddleware(thunk);
} else {
    middleWare = applyMiddleware(thunk, logger);
}

export const store = createStore(
    reducers,
    middleWare
);

export interface IStoreState {
    cardState: ICardState;
    feedState: IFeedState;
    authState: IAuthState;
}
