var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AnalyzeTransactionUseCase } from './application/use-cases/analyze-transaction.use-case.js';
import { GetOpsUseCase } from './application/use-cases/get-ops.use-case.js';
import { GetTransactionUseCase, ListTransactionsUseCase, } from './application/use-cases/get-transaction.use-case.js';
import { SubmitTransactionUseCase } from './application/use-cases/submit-transaction.use-case.js';
import { ANOMALY_DETECTOR, CIRCUIT_BREAKER, EVENT_BUS, FREEZE_FUNDS, QUEUE, TRANSACTION_REPO, } from './domain/ports/tokens.js';
import { HeuristicAnomalyDetector } from './infrastructure/detector/heuristic-anomaly.detector.js';
import { InMemoryEventBus } from './infrastructure/events/in-memory-event-bus.js';
import { BankFreezeAdapter } from './infrastructure/freeze/bank-freeze.adapter.js';
import { CircuitBreakerFreezeAdapter } from './infrastructure/freeze/circuit-breaker-freeze.adapter.js';
import { DomainExceptionFilter } from './infrastructure/http/domain-exception.filter.js';
import { HealthController, OpsController, } from './infrastructure/http/ops.controller.js';
import { TransactionController } from './infrastructure/http/transaction.controller.js';
import { InMemoryTransactionRepository } from './infrastructure/persistence/in-memory-transaction.repository.js';
import { FraudWorker } from './infrastructure/queue/fraud.worker.js';
import { InMemoryQueueAdapter } from './infrastructure/queue/in-memory-queue.adapter.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        controllers: [HealthController, TransactionController, OpsController],
        providers: [
            SubmitTransactionUseCase,
            AnalyzeTransactionUseCase,
            GetTransactionUseCase,
            ListTransactionsUseCase,
            GetOpsUseCase,
            FraudWorker,
            BankFreezeAdapter,
            CircuitBreakerFreezeAdapter,
            { provide: APP_FILTER, useClass: DomainExceptionFilter },
            { provide: TRANSACTION_REPO, useClass: InMemoryTransactionRepository },
            { provide: QUEUE, useClass: InMemoryQueueAdapter },
            { provide: ANOMALY_DETECTOR, useClass: HeuristicAnomalyDetector },
            { provide: EVENT_BUS, useClass: InMemoryEventBus },
            { provide: FREEZE_FUNDS, useExisting: CircuitBreakerFreezeAdapter },
            { provide: CIRCUIT_BREAKER, useExisting: CircuitBreakerFreezeAdapter },
        ],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map