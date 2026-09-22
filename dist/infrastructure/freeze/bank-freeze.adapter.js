var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BankFreezeAdapter_1;
import { Injectable, Logger } from '@nestjs/common';
import { FreezeResult } from '../../domain/entities/freeze-result.js';
import { FreezeFailedError } from '../../domain/errors/freeze-failed.error.js';
let BankFreezeAdapter = BankFreezeAdapter_1 = class BankFreezeAdapter {
    logger = new Logger(BankFreezeAdapter_1.name);
    forceFail = false;
    async freeze(tx) {
        if (this.forceFail) {
            this.logger.warn(`banco CAÍDO tx=${tx.id}`);
            throw new FreezeFailedError('banco simulado caído (bank-fail=true)');
        }
        const reference = `FRZ-${tx.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;
        this.logger.log(`congelado tx=${tx.id} ref=${reference}`);
        return new FreezeResult(true, reference, 'Fondos congelados (banco simulado).');
    }
};
BankFreezeAdapter = BankFreezeAdapter_1 = __decorate([
    Injectable()
], BankFreezeAdapter);
export { BankFreezeAdapter };
//# sourceMappingURL=bank-freeze.adapter.js.map