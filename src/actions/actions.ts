import { Dispatch, combineReducers } from "redux";

import { feedReducer } from "./feedActions";
import { cardReducer } from "./cardActions";
import { counterReducer } from "./counterActions";

export const reducers = combineReducers({
    counterState: counterReducer,
    cardState: cardReducer,
    feedState: feedReducer
});
