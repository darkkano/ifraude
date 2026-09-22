import { CircuitBreakerStatus } from '../../domain/entities/circuit-breaker-status.js';
import { FreezeResult } from '../../domain/entities/freeze-result.js';
import { Transaction } from '../../domain/entities/transaction.js';
import type { CircuitBreakerPort } from '../../domain/ports/circuit-breaker.port.js';
import type { FreezeFundsPort } from '../../domain/ports/freeze-funds.port.js';
import { BankFreezeAdapter } from './bank-freeze.adapter.js';
export declare class CircuitBreakerFreezeAdapter implements FreezeFundsPort, CircuitBreakerPort {
    private readonly bank;
    private readonly engine;
    constructor(bank: BankFreezeAdapter);
    freeze(tx: Transaction): Promise<FreezeResult>;
    getStatus(): CircuitBreakerStatus;
    setBankFail(fail: boolean): void;
    isBankFailEnabled(): boolean;
}
