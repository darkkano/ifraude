import { Transaction } from '../../domain/entities/transaction.js';
import type { AnomalyDetectorPort } from '../../domain/ports/anomaly-detector.port.js';
import type { EventBusPort } from '../../domain/ports/event-bus.port.js';
import type { FreezeFundsPort } from '../../domain/ports/freeze-funds.port.js';
import type { TransactionRepositoryPort } from '../../domain/ports/transaction-repository.port.js';
export declare class AnalyzeTransactionUseCase {
    private readonly repo;
    private readonly detector;
    private readonly freezeFunds;
    private readonly events;
    private readonly logger;
    constructor(repo: TransactionRepositoryPort, detector: AnomalyDetectorPort, freezeFunds: FreezeFundsPort, events: EventBusPort);
    execute(transactionId: string): Promise<Transaction>;
    private persist;
}
