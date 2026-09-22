export class SubmitTransactionInput {
    amount;
    merchant;
    country;
    cardLast4;
    constructor(amount, merchant, country, cardLast4) {
        this.amount = amount;
        this.merchant = merchant;
        this.country = country;
        this.cardLast4 = cardLast4;
    }
}
//# sourceMappingURL=submit-transaction.input.js.map