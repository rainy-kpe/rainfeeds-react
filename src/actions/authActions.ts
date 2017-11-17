import * as firebase from "firebase";
import { Dispatch } from "redux";

import { IStoreState } from "../store";
import * as cardActions from "./cardActions";

/* Type definitions */
export interface IAuthState {
    authenticated: boolean;
    username?: string;
}

export interface IAuthAction {
    type: "AUTH_FAILURE" | "AUTH_SUCCESS";
    username?: string;
    authenticated?: boolean;
}

/* Action creators */

export const authSuccess = (authenticated: boolean, username?: string): IAuthAction => ({
    type: "AUTH_SUCCESS",
    authenticated,
    username
});

export const authFailure = (): IAuthAction => ({
    type: "AUTH_FAILURE",
});

/* Reducer */

const initialState: IAuthState = {
    authenticated: false
};

export const authReducer = (state: IAuthState = initialState, action: IAuthAction) => {
    switch (action.type) {
        case "AUTH_SUCCESS":
            return {...state, authenticated: action.authenticated, username: action.username};
        case "AUTH_FAILURE":
            return {...state};
        default:
            return state;
    }
};

/* Property mappers */

export const mapStateToProps = (state: IStoreState): IAuthState => ({
    authenticated: state.authState.authenticated,
    username: state.authState.username
});

/* Helpers */

export const initFirebase = () => {
    return (dispatch: Dispatch<IAuthAction>) => {
        // Initialize Firebase
        const config = {
            apiKey: "AIzaSyCdcwfxWwwISxmHKEN3bmipmZ9J_HahWkA",
            authDomain: "rainfeeds2.firebaseapp.com",
            databaseURL: "https://rainfeeds2.firebaseio.com",
            projectId: "rainfeeds2",
            storageBucket: "rainfeeds2.appspot.com",
            messagingSenderId: "295429656586"
        };
        firebase.initializeApp(config);

        console.log("Firebase initialized");

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("User authenticated");
                dispatch(authSuccess(true, user.displayName));
                dispatch(cardActions.getCardsFromDatabase());
            } else {
                console.log("User not authenticated");
                dispatch(authSuccess(false));
            }
        });
    };
};

export const login = () => {
    return async (dispatch: Dispatch<IAuthAction>) => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await firebase.auth().signInWithPopup(provider);
            dispatch(authSuccess(true, result.user.displayName));
        } catch (error) {
            dispatch(authFailure());
        }
    };
};

export const logout = () => {
    return async (dispatch: Dispatch<IAuthAction>) => {
        try {
            const result = await firebase.auth().signOut();
            dispatch(authSuccess(false));
            dispatch(cardActions.clearCards());
        } catch (error) {
            dispatch(authFailure());
        }
    };
};
