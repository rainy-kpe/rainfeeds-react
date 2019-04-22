import { Dispatch, combineReducers } from "redux";

import { feedReducer } from "./feedActions";
import { cardReducer } from "./cardActions";
import { authReducer } from "./authActions";

export const reducers = combineReducers({
    cardState: cardReducer,
    feedState: feedReducer,
    authState: authReducer
});
