import { FreezeResult } from '../entities/freeze-result.js';
import { Transaction } from '../entities/transaction.js';

/**
 * PUERTO driven — congelar fondos en el banco.
 *
 * FLUJO:
 *   AnalyzeUseCase (si risk = high)
 *     → FreezeFundsPort.freeze(tx)
 *       → CircuitBreakerFreezeAdapter (infra)
 *         → BankFreezeAdapter (simulado)
 *
 * El use case habla con UN puerto. El circuit breaker es un wrapper de infra.
 */
export interface FreezeFundsPort {
  freeze(tx: Transaction): Promise<FreezeResult>;
}
