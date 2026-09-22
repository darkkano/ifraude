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
import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetOpsUseCase } from '../../application/use-cases/get-ops.use-case.js';
let OpsController = class OpsController {
    ops;
    constructor(ops) {
        this.ops = ops;
    }
    events() {
        return this.ops.listEvents();
    }
    queue() {
        return this.ops.queuePending();
    }
    circuit() {
        const status = this.ops.circuit();
        return {
            state: status.state,
            failures: status.failures,
            threshold: status.threshold,
            cooldownMs: status.cooldownMs,
            openedAt: status.openedAt,
        };
    }
    bankFail(body) {
        return this.ops.setBankFail(Boolean(body?.fail));
    }
};
__decorate([
    Get('events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OpsController.prototype, "events", null);
__decorate([
    Get('queue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OpsController.prototype, "queue", null);
__decorate([
    Get('circuit-breaker'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OpsController.prototype, "circuit", null);
__decorate([
    Post('debug/bank-fail'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OpsController.prototype, "bankFail", null);
OpsController = __decorate([
    Controller('v1'),
    __metadata("design:paramtypes", [GetOpsUseCase])
], OpsController);
export { OpsController };
let HealthController = class HealthController {
    info() {
        return {
            name: 'Motor asíncrono de detección de fraude (práctica hexagonal)',
            idea: 'El pago responde 202; un worker en cola analiza y congela con Circuit Breaker.',
            endpoints: {
                'POST /v1/transactions': 'Acepta el pago (202) y encola el análisis',
                'GET /v1/transactions': 'Lista',
                'GET /v1/transactions/:id': 'Estado / score / freeze',
                'GET /v1/events': 'Eventos de dominio',
                'GET /v1/queue': 'Jobs pendientes',
                'GET /v1/circuit-breaker': 'closed | open | half_open',
                'POST /v1/debug/bank-fail': 'Simular banco caído',
            },
            lee: 'README.md',
        };
    }
};
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "info", null);
HealthController = __decorate([
    Controller()
], HealthController);
export { HealthController };
//# sourceMappingURL=ops.controller.js.map