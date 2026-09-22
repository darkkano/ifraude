export declare class SubmitTransactionInput {
    readonly amount: number;
    readonly merchant: string;
    readonly country: string;
    readonly cardLast4: string;
    constructor(amount: number, merchant: string, country: string, cardLast4: string);
}
