import { Transaction } from '../../domain/entities/transaction.js';
import type { TransactionRepositoryPort } from '../../domain/ports/transaction-repository.port.js';
export declare class InMemoryTransactionRepository implements TransactionRepositoryPort {
    private readonly store;
    save(tx: Transaction): Promise<void>;
    findById(id: string): Promise<Transaction | null>;
    list(): Promise<Transaction[]>;
}
