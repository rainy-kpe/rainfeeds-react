export interface IAction {
    type: string;
    amount: number;
}

export const incrementCounter = (amount: number): IAction => ({
    type: "INCREMENT_COUNTER",
    amount
});
