import { Transaction } from '../../domain/entities/transaction.js';
import type { TransactionRepositoryPort } from '../../domain/ports/transaction-repository.port.js';
export declare class GetTransactionUseCase {
    private readonly repo;
    constructor(repo: TransactionRepositoryPort);
    execute(id: string): Promise<Transaction>;
}
export declare class ListTransactionsUseCase {
    private readonly repo;
    constructor(repo: TransactionRepositoryPort);
    execute(): Promise<Transaction[]>;
}
