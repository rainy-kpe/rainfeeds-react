import { Dispatch, combineReducers } from "redux";

import { feedReducer } from "./feedActions";
import { cardReducer } from "./cardActions";

export const reducers = combineReducers({
    cardState: cardReducer,
    feedState: feedReducer
});
