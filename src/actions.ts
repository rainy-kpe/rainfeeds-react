export type ActionTypes = IIncrementAction | IOtherAction;

export interface IIncrementAction {
    type: "INCREMENT_COUNTER";
    amount: number;
}

export interface IOtherAction {
    type: "OTHER_ACTION";
}

export const incrementCounter = (amount: number): IIncrementAction => ({
    type: "INCREMENT_COUNTER",
    amount
});
