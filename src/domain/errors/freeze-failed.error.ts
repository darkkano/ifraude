import { DomainError } from './domain.error.js';

/**
 * CAPA: Domain
 * CUÁNDO: el adapter del banco falla (timeout, 500, simulación).
 * FLUJO: BankFreezeAdapter → throw → Circuit Breaker cuenta un fallo
 */
export class FreezeFailedError extends DomainError {
  constructor(reason: string) {
    super(`No se pudieron congelar los fondos: ${reason}`);
  }
}
