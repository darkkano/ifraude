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
var SubmitTransactionUseCase_1;
import { randomUUID } from 'node:crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DomainEvent } from '../../domain/entities/domain-event.js';
import { Transaction } from '../../domain/entities/transaction.js';
import { EVENT_BUS, QUEUE, TRANSACTION_REPO, } from '../../domain/ports/tokens.js';
let SubmitTransactionUseCase = SubmitTransactionUseCase_1 = class SubmitTransactionUseCase {
    repo;
    queue;
    events;
    logger = new Logger(SubmitTransactionUseCase_1.name);
    constructor(repo, queue, events) {
        this.repo = repo;
        this.queue = queue;
        this.events = events;
    }
    async execute(input) {
        const tx = new Transaction(randomUUID(), input.amount, input.merchant, input.country.toUpperCase(), input.cardLast4, new Date().toISOString());
        this.logger.log(`[1] Guardar tx=${tx.id} amount=${tx.amount} (pending_analysis)`);
        await this.repo.save(tx);
        await this.events.publish(new DomainEvent('TransactionSubmitted', new Date().toISOString(), {
            id: tx.id,
            amount: tx.amount,
            merchant: tx.merchant,
        }));
        this.logger.log(`[2] Encolar tx=${tx.id} (el HTTP ya puede responder 202)`);
        await this.queue.enqueue(tx.id);
        return tx;
    }
};
SubmitTransactionUseCase = SubmitTransactionUseCase_1 = __decorate([
    Injectable(),
    __param(0, Inject(TRANSACTION_REPO)),
    __param(1, Inject(QUEUE)),
    __param(2, Inject(EVENT_BUS)),
    __metadata("design:paramtypes", [Object, Object, Object])
], SubmitTransactionUseCase);
export { SubmitTransactionUseCase };
//# sourceMappingURL=submit-transaction.use-case.js.map