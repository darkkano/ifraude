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
var FraudWorker_1;
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AnalyzeTransactionUseCase } from '../../application/use-cases/analyze-transaction.use-case.js';
import { QUEUE } from '../../domain/ports/tokens.js';
let FraudWorker = FraudWorker_1 = class FraudWorker {
    queue;
    analyze;
    logger = new Logger(FraudWorker_1.name);
    constructor(queue, analyze) {
        this.queue = queue;
        this.analyze = analyze;
    }
    onModuleInit() {
        this.logger.log('Worker suscrito a la cola');
        this.queue.consume(async (id) => {
            this.logger.log(`procesando job tx=${id}`);
            await this.analyze.execute(id);
        });
    }
};
FraudWorker = FraudWorker_1 = __decorate([
    Injectable(),
    __param(0, Inject(QUEUE)),
    __metadata("design:paramtypes", [Object, AnalyzeTransactionUseCase])
], FraudWorker);
export { FraudWorker };
//# sourceMappingURL=fraud.worker.js.map