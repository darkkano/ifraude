var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { BankFreezeAdapter } from './bank-freeze.adapter.js';
import { CircuitBreakerEngine } from './circuit-breaker.engine.js';
let CircuitBreakerFreezeAdapter = class CircuitBreakerFreezeAdapter {
    bank;
    engine = new CircuitBreakerEngine();
    constructor(bank) {
        this.bank = bank;
    }
    freeze(tx) {
        return this.engine.execute(() => this.bank.freeze(tx));
    }
    getStatus() {
        return this.engine.status();
    }
    setBankFail(fail) {
        this.bank.forceFail = fail;
    }
    isBankFailEnabled() {
        return this.bank.forceFail;
    }
};
CircuitBreakerFreezeAdapter = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [BankFreezeAdapter])
], CircuitBreakerFreezeAdapter);
export { CircuitBreakerFreezeAdapter };
//# sourceMappingURL=circuit-breaker-freeze.adapter.js.map