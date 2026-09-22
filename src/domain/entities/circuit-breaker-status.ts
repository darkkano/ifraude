/**
 * CAPA: Domain
 * Estado del Circuit Breaker (el GET de infra lo proyecta; las reglas viven en el adapter).
 */
export type CircuitState = 'closed' | 'open' | 'half_open';

export class CircuitBreakerStatus {
  constructor(
    public readonly state: CircuitState,
    public readonly failures: number,
    public readonly threshold: number,
    public readonly cooldownMs: number,
    public readonly openedAt: string | null,
  ) {}
}
