import { FreezeResult } from './freeze-result.js';
import { FraudScore } from './fraud-score.js';
export type TransactionStatus = 'pending_analysis' | 'clear' | 'flagged' | 'frozen' | 'freeze_failed';
export declare class Transaction {
    readonly id: string;
    readonly amount: number;
    readonly merchant: string;
    readonly country: string;
    readonly cardLast4: string;
    readonly createdAt: string;
    status: TransactionStatus;
    score: FraudScore | null;
    freeze: FreezeResult | null;
    constructor(id: string, amount: number, merchant: string, country: string, cardLast4: string, createdAt: string, status?: TransactionStatus, score?: FraudScore | null, freeze?: FreezeResult | null);
    markClear(score: FraudScore): void;
    markFlagged(score: FraudScore): void;
    markFrozen(score: FraudScore, freeze: FreezeResult): void;
    markFreezeFailed(score: FraudScore, note: string): void;
}
