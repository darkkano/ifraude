import { OnModuleInit } from '@nestjs/common';
import { AnalyzeTransactionUseCase } from '../../application/use-cases/analyze-transaction.use-case.js';
import type { QueuePort } from '../../domain/ports/queue.port.js';
export declare class FraudWorker implements OnModuleInit {
    private readonly queue;
    private readonly analyze;
    private readonly logger;
    constructor(queue: QueuePort, analyze: AnalyzeTransactionUseCase);
    onModuleInit(): void;
}
