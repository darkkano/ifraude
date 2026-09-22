import { Transaction } from '../entities/transaction.js';
export interface TransactionRepositoryPort {
    save(tx: Transaction): Promise<void>;
    findById(id: string): Promise<Transaction | null>;
    list(): Promise<Transaction[]>;
}
