/* Type definitions */

export interface ICounterState {
    counter: number;
}

export interface IIncrementAction {
    type: "INCREMENT_COUNTER";
    amount: number;
}

/* Action creators */

export const incrementCounter = (amount: number): IIncrementAction => ({
    type: "INCREMENT_COUNTER",
    amount
});

/* Reducer */

const initialState: ICounterState = {
    counter: 0
};

export const counterReducer = (state: ICounterState = initialState, action: IIncrementAction) => {
    switch (action.type) {
        case "INCREMENT_COUNTER":
            return { counter: state.counter  + action.amount };
        default:
            return state;
    }
};
