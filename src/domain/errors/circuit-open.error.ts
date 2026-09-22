import { DomainError } from './domain.error.js';

/**
 * CAPA: Domain
 * CUÁNDO: el Circuit Breaker está OPEN y se intenta congelar fondos.
 *         No se llama al banco: fail-fast.
 * FLUJO: CircuitBreakerFreezeAdapter → throw → AnalyzeUseCase marca freeze_failed
 */
export class CircuitOpenError extends DomainError {
  constructor() {
    super(
      'Circuit breaker OPEN: no se llama al banco para congelar. Reintenta cuando pase a half-open.',
    );
  }
}
