import { CircuitBreakerStatus } from '../../domain/entities/circuit-breaker-status.js';
import { CircuitOpenError } from '../../domain/errors/circuit-open.error.js';

/**
 * Motor del Circuit Breaker (infra, testeable sin Nest).
 *
 * ESTADOS:
 *   closed    → llama al banco
 *   open      → NO llama; throw CircuitOpenError (fail-fast)
 *   half_open → deja PASAR UNA llamada de prueba
 *
 * closed --(N fallos)--> open --(cooldown)--> half_open
 *   éxito en half_open → closed
 *   fallo  en half_open → open de nuevo
 */
export class CircuitBreakerEngine {
  static readonly THRESHOLD = 3;
  static readonly COOLDOWN_MS = 8000;

  state: 'closed' | 'open' | 'half_open' = 'closed';
  failures = 0;
  openedAt: number | null = null;
  private halfOpenInFlight = false;

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.maybeHalfOpen();

    if (this.state === 'open') {
      throw new CircuitOpenError();
    }

    if (this.state === 'half_open') {
      if (this.halfOpenInFlight) throw new CircuitOpenError();
      this.halfOpenInFlight = true;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    } finally {
      this.halfOpenInFlight = false;
    }
  }

  status(): CircuitBreakerStatus {
    this.maybeHalfOpen();
    return new CircuitBreakerStatus(
      this.state,
      this.failures,
      CircuitBreakerEngine.THRESHOLD,
      CircuitBreakerEngine.COOLDOWN_MS,
      this.openedAt ? new Date(this.openedAt).toISOString() : null,
    );
  }

  private maybeHalfOpen(): void {
    if (this.state !== 'open' || this.openedAt === null) return;
    if (Date.now() - this.openedAt >= CircuitBreakerEngine.COOLDOWN_MS) {
      this.state = 'half_open';
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
    this.openedAt = null;
  }

  private onFailure(): void {
    this.failures += 1;
    if (this.state === 'half_open' || this.failures >= CircuitBreakerEngine.THRESHOLD) {
      this.state = 'open';
      this.openedAt = Date.now();
    }
  }
}
