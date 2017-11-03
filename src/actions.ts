export type ActionTypes = ICardAction | IIncrementAction | IOtherAction;

export interface ICardAction {
    type: "ADD_CARD" | "REMOVE_CARD" | "ASK_CARD_NAME" | "HIDE_ASK_CARD_NAME";
    title?: string;
}

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

export const addCard = (title: string): ICardAction => ({
    type: "ADD_CARD",
    title
});

export const removeCard = (title: string): ICardAction => ({
    type: "REMOVE_CARD",
    title
});

export const askCardName = (): ICardAction => ({
    type: "ASK_CARD_NAME"
});

export const hideAskCardName = (): ICardAction => ({
    type: "HIDE_ASK_CARD_NAME"
});
