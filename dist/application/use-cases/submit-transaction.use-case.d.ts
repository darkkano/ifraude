import { Transaction } from '../../domain/entities/transaction.js';
import type { EventBusPort } from '../../domain/ports/event-bus.port.js';
import type { QueuePort } from '../../domain/ports/queue.port.js';
import type { TransactionRepositoryPort } from '../../domain/ports/transaction-repository.port.js';
import { SubmitTransactionInput } from '../dto/submit-transaction.input.js';
export declare class SubmitTransactionUseCase {
    private readonly repo;
    private readonly queue;
    private readonly events;
    private readonly logger;
    constructor(repo: TransactionRepositoryPort, queue: QueuePort, events: EventBusPort);
    execute(input: SubmitTransactionInput): Promise<Transaction>;
}
