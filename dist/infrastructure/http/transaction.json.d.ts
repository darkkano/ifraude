import { Transaction } from '../../domain/entities/transaction.js';
export declare function transactionJson(tx: Transaction): {
    id: string;
    amount: number;
    merchant: string;
    country: string;
    cardLast4: string;
    createdAt: string;
    status: import("../../domain/entities/transaction.js").TransactionStatus;
    score: {
        value: number;
        level: import("../../domain/entities/fraud-score.js").RiskLevel;
        reasons: string[];
    } | null;
    freeze: {
        frozen: boolean;
        reference: string;
        note: string;
    } | null;
};
