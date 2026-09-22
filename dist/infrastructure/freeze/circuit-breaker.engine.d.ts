import { CircuitBreakerStatus } from '../../domain/entities/circuit-breaker-status.js';
export declare class CircuitBreakerEngine {
    static readonly THRESHOLD = 3;
    static readonly COOLDOWN_MS = 8000;
    state: 'closed' | 'open' | 'half_open';
    failures: number;
    openedAt: number | null;
    private halfOpenInFlight;
    execute<T>(fn: () => Promise<T>): Promise<T>;
    status(): CircuitBreakerStatus;
    private maybeHalfOpen;
    private onSuccess;
    private onFailure;
}
