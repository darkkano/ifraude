import { FreezeResult } from './freeze-result.js';
export class Transaction {
    id;
    amount;
    merchant;
    country;
    cardLast4;
    createdAt;
    status;
    score;
    freeze;
    constructor(id, amount, merchant, country, cardLast4, createdAt, status = 'pending_analysis', score = null, freeze = null) {
        this.id = id;
        this.amount = amount;
        this.merchant = merchant;
        this.country = country;
        this.cardLast4 = cardLast4;
        this.createdAt = createdAt;
        this.status = status;
        this.score = score;
        this.freeze = freeze;
    }
    markClear(score) {
        this.score = score;
        this.status = 'clear';
    }
    markFlagged(score) {
        this.score = score;
        this.status = 'flagged';
    }
    markFrozen(score, freeze) {
        this.score = score;
        this.freeze = freeze;
        this.status = 'frozen';
    }
    markFreezeFailed(score, note) {
        this.score = score;
        this.freeze = new FreezeResult(false, '', note);
        this.status = 'freeze_failed';
    }
}
//# sourceMappingURL=transaction.js.map