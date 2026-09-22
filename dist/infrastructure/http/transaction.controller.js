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
import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, } from '@nestjs/common';
import { SubmitTransactionInput } from '../../application/dto/submit-transaction.input.js';
import { GetTransactionUseCase, ListTransactionsUseCase, } from '../../application/use-cases/get-transaction.use-case.js';
import { SubmitTransactionUseCase } from '../../application/use-cases/submit-transaction.use-case.js';
import { transactionJson } from './transaction.json.js';
let TransactionController = class TransactionController {
    submit;
    getOne;
    list;
    constructor(submit, getOne, list) {
        this.submit = submit;
        this.getOne = getOne;
        this.list = list;
    }
    async create(body) {
        if (typeof body?.amount !== 'number' || !(body.amount > 0)) {
            throw new BadRequestException('amount (number > 0) es obligatorio.');
        }
        if (!body.merchant || typeof body.merchant !== 'string') {
            throw new BadRequestException('merchant (string) es obligatorio.');
        }
        if (!body.country || typeof body.country !== 'string') {
            throw new BadRequestException('country (string, ISO-2) es obligatorio.');
        }
        if (!/^\d{4}$/.test(body.cardLast4 ?? '')) {
            throw new BadRequestException('cardLast4 debe ser 4 dígitos.');
        }
        const tx = await this.submit.execute(new SubmitTransactionInput(body.amount, body.merchant.trim(), body.country.trim(), body.cardLast4));
        return {
            id: tx.id,
            status: tx.status,
            message: 'Pago aceptado. El fraude se analiza en cola (no bloquea el checkout).',
        };
    }
    async findAll() {
        const items = await this.list.execute();
        return items.map(transactionJson);
    }
    async findOne(id) {
        const tx = await this.getOne.execute(id);
        return transactionJson(tx);
    }
};
__decorate([
    Post(),
    HttpCode(HttpStatus.ACCEPTED),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "create", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "findOne", null);
TransactionController = __decorate([
    Controller('v1/transactions'),
    __metadata("design:paramtypes", [SubmitTransactionUseCase,
        GetTransactionUseCase,
        ListTransactionsUseCase])
], TransactionController);
export { TransactionController };
//# sourceMappingURL=transaction.controller.js.map