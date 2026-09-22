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
import { Inject, Injectable } from '@nestjs/common';
import { TransactionNotFoundError } from '../../domain/errors/transaction-not-found.error.js';
import { TRANSACTION_REPO } from '../../domain/ports/tokens.js';
let GetTransactionUseCase = class GetTransactionUseCase {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async execute(id) {
        const tx = await this.repo.findById(id);
        if (!tx)
            throw new TransactionNotFoundError(id);
        return tx;
    }
};
GetTransactionUseCase = __decorate([
    Injectable(),
    __param(0, Inject(TRANSACTION_REPO)),
    __metadata("design:paramtypes", [Object])
], GetTransactionUseCase);
export { GetTransactionUseCase };
let ListTransactionsUseCase = class ListTransactionsUseCase {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    execute() {
        return this.repo.list();
    }
};
ListTransactionsUseCase = __decorate([
    Injectable(),
    __param(0, Inject(TRANSACTION_REPO)),
    __metadata("design:paramtypes", [Object])
], ListTransactionsUseCase);
export { ListTransactionsUseCase };
//# sourceMappingURL=get-transaction.use-case.js.map