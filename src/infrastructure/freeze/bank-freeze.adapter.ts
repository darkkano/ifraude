import { Injectable, Logger } from '@nestjs/common';
import { FreezeResult } from '../../domain/entities/freeze-result.js';
import { Transaction } from '../../domain/entities/transaction.js';
import { FreezeFailedError } from '../../domain/errors/freeze-failed.error.js';
import type { FreezeFundsPort } from '../../domain/ports/freeze-funds.port.js';

/**
 * ADAPTER driven — banco simulado.
 * El use case NO lo ve: lo envuelve CircuitBreakerFreezeAdapter.
 *
 * POST /v1/debug/bank-fail { "fail": true }  →  cada freeze tira FreezeFailedError
 * (así practicas el Circuit Breaker sin un banco real).
 */
@Injectable()
export class BankFreezeAdapter implements FreezeFundsPort {
  private readonly logger = new Logger(BankFreezeAdapter.name);
  forceFail = false;

  async freeze(tx: Transaction): Promise<FreezeResult> {
    if (this.forceFail) {
      this.logger.warn(`banco CAÍDO tx=${tx.id}`);
      throw new FreezeFailedError('banco simulado caído (bank-fail=true)');
    }
    const reference = `FRZ-${tx.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;
    this.logger.log(`congelado tx=${tx.id} ref=${reference}`);
    return new FreezeResult(true, reference, 'Fondos congelados (banco simulado).');
  }
}
