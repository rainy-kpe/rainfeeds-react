import { combineReducers } from "redux";

import * as store from "./store";
import * as actions from "./actions";
import * as rainfeeds from "./containers/rainfeeds/rainfeeds";

// TODO: Types for state and action
// TODO: Initial state handling
export const incrReducer = (state: rainfeeds.IRainfeedsState, action: actions.ActionTypes) => {
    console.log("state:", state);
    switch (action.type) {
        case "INCREMENT_COUNTER":
            return { counter: (state ? state.counter : 0)  + action.amount };
        default:
            return state || { counter: 0 };
    }
};

export const reducers = combineReducers({
    rainfeeds: incrReducer
});
