import { CircuitBreakerStatus } from '../entities/circuit-breaker-status.js';

/**
 * PUERTO driven — consultar el estado del breaker (GET /v1/circuit-breaker).
 * El use case de análisis NO lo usa: el wrapper ya falla con CircuitOpenError.
 */
export interface CircuitBreakerPort {
  getStatus(): CircuitBreakerStatus;
  /** Práctica: forzar fallos del banco para ver OPEN. */
  setBankFail(fail: boolean): void;
  isBankFailEnabled(): boolean;
}
