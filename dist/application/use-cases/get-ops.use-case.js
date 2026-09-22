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
import { CIRCUIT_BREAKER, EVENT_BUS, QUEUE } from '../../domain/ports/tokens.js';
let GetOpsUseCase = class GetOpsUseCase {
    events;
    queue;
    breaker;
    constructor(events, queue, breaker) {
        this.events = events;
        this.queue = queue;
        this.breaker = breaker;
    }
    listEvents() {
        return this.events.list();
    }
    queuePending() {
        return { pending: this.queue.pendingCount() };
    }
    circuit() {
        return this.breaker.getStatus();
    }
    setBankFail(fail) {
        this.breaker.setBankFail(fail);
        return { bankFail: fail, circuit: this.breaker.getStatus() };
    }
};
GetOpsUseCase = __decorate([
    Injectable(),
    __param(0, Inject(EVENT_BUS)),
    __param(1, Inject(QUEUE)),
    __param(2, Inject(CIRCUIT_BREAKER)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetOpsUseCase);
export { GetOpsUseCase };
//# sourceMappingURL=get-ops.use-case.js.map