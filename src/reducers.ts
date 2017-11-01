import { combineReducers } from "redux";

// TODO: Types for state and action
// TODO: Initial state handling
const incr = (state: any, action: any) => {
    switch (action.type) {
        case "INCREMENT_COUNTER":
            return { counter: (state ? state.counter : 0)  + action.amount };
        default:
            return state || { counter: 0 };
    }
};

export const reducers = combineReducers({
    incr
});
