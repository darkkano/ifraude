import { Injectable } from '@nestjs/common';
import { CircuitBreakerStatus } from '../../domain/entities/circuit-breaker-status.js';
import { FreezeResult } from '../../domain/entities/freeze-result.js';
import { Transaction } from '../../domain/entities/transaction.js';
import type { CircuitBreakerPort } from '../../domain/ports/circuit-breaker.port.js';
import type { FreezeFundsPort } from '../../domain/ports/freeze-funds.port.js';
import { BankFreezeAdapter } from './bank-freeze.adapter.js';
import { CircuitBreakerEngine } from './circuit-breaker.engine.js';

/**
 * ADAPTER driven que SÍ ve el use case (FREEZE_FUNDS + CIRCUIT_BREAKER).
 *
 * FLUJO:
 *   AnalyzeUseCase.freezeFunds.freeze(tx)
 *     → este wrapper
 *       → si OPEN: CircuitOpenError (no toca el banco)
 *       → si CLOSED: BankFreezeAdapter.freeze(tx)
 */
@Injectable()
export class CircuitBreakerFreezeAdapter implements FreezeFundsPort, CircuitBreakerPort {
  private readonly engine = new CircuitBreakerEngine();

  constructor(private readonly bank: BankFreezeAdapter) {}

  freeze(tx: Transaction): Promise<FreezeResult> {
    return this.engine.execute(() => this.bank.freeze(tx));
  }

  getStatus(): CircuitBreakerStatus {
    return this.engine.status();
  }

  setBankFail(fail: boolean): void {
    this.bank.forceFail = fail;
  }

  isBankFailEnabled(): boolean {
    return this.bank.forceFail;
  }
}
