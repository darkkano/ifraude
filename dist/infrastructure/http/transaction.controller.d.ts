import { GetTransactionUseCase, ListTransactionsUseCase } from '../../application/use-cases/get-transaction.use-case.js';
import { SubmitTransactionUseCase } from '../../application/use-cases/submit-transaction.use-case.js';
export declare class TransactionController {
    private readonly submit;
    private readonly getOne;
    private readonly list;
    constructor(submit: SubmitTransactionUseCase, getOne: GetTransactionUseCase, list: ListTransactionsUseCase);
    create(body: {
        amount?: number;
        merchant?: string;
        country?: string;
        cardLast4?: string;
    }): Promise<{
        id: string;
        status: import("../../domain/entities/transaction.js").TransactionStatus;
        message: string;
    }>;
    findAll(): Promise<{
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
    }[]>;
    findOne(id: string): Promise<{
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
    }>;
}
