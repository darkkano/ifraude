import { CircuitBreakerStatus } from '../entities/circuit-breaker-status.js';
export interface CircuitBreakerPort {
    getStatus(): CircuitBreakerStatus;
    setBankFail(fail: boolean): void;
    isBankFailEnabled(): boolean;
}
