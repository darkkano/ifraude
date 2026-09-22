var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AnalyzeTransactionUseCase_1;
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DomainEvent } from '../../domain/entities/domain-event.js';
import { CircuitOpenError } from '../../domain/errors/circuit-open.error.js';
import { FreezeFailedError } from '../../domain/errors/freeze-failed.error.js';
import { TransactionNotFoundError } from '../../domain/errors/transaction-not-found.error.js';
import { ANOMALY_DETECTOR, EVENT_BUS, FREEZE_FUNDS, TRANSACTION_REPO, } from '../../domain/ports/tokens.js';
import { decideAction } from '../../domain/risk-policy.js';
let AnalyzeTransactionUseCase = AnalyzeTransactionUseCase_1 = class AnalyzeTransactionUseCase {
    repo;
    detector;
    freezeFunds;
    events;
    logger = new Logger(AnalyzeTransactionUseCase_1.name);
    constructor(repo, detector, freezeFunds, events) {
        this.repo = repo;
        this.detector = detector;
        this.freezeFunds = freezeFunds;
        this.events = events;
    }
    async execute(transactionId) {
        const tx = await this.repo.findById(transactionId);
        if (!tx)
            throw new TransactionNotFoundError(transactionId);
        this.logger.log(`[1] Analizar tx=${tx.id}`);
        const score = await this.detector.score(tx);
        this.logger.log(`[2] Score=${score.value} level=${score.level} reasons=${score.reasons.join('|') || 'ninguna'}`);
        const action = decideAction(score);
        this.logger.log(`[3] Acción de dominio=${action}`);
        if (action === 'clear') {
            tx.markClear(score);
            await this.persist(tx, 'TransactionCleared');
            return tx;
        }
        if (action === 'flag') {
            tx.markFlagged(score);
            await this.persist(tx, 'TransactionFlagged');
            return tx;
        }
        this.logger.log(`[4] Riesgo alto → congelar fondos`);
        try {
            const freeze = await this.freezeFunds.freeze(tx);
            tx.markFrozen(score, freeze);
            await this.persist(tx, 'FundsFrozen');
        }
        catch (err) {
            const note = err instanceof CircuitOpenError || err instanceof FreezeFailedError
                ? err.message
                : String(err);
            this.logger.warn(`[4] Freeze falló: ${note}`);
            tx.markFreezeFailed(score, note);
            await this.persist(tx, 'FreezeFailed');
        }
        return tx;
    }
    async persist(tx, type) {
        await this.repo.save(tx);
        await this.events.publish(new DomainEvent(type, new Date().toISOString(), {
            id: tx.id,
            status: tx.status,
            score: tx.score?.value ?? null,
            level: tx.score?.level ?? null,
        }));
        this.logger.log(`[5] Persistido status=${tx.status}`);
    }
};
AnalyzeTransactionUseCase = AnalyzeTransactionUseCase_1 = __decorate([
    Injectable(),
    __param(0, Inject(TRANSACTION_REPO)),
    __param(1, Inject(ANOMALY_DETECTOR)),
    __param(2, Inject(FREEZE_FUNDS)),
    __param(3, Inject(EVENT_BUS)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AnalyzeTransactionUseCase);
export { AnalyzeTransactionUseCase };
//# sourceMappingURL=analyze-transaction.use-case.js.map