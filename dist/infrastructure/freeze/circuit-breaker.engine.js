import { CircuitBreakerStatus } from '../../domain/entities/circuit-breaker-status.js';
import { CircuitOpenError } from '../../domain/errors/circuit-open.error.js';
export class CircuitBreakerEngine {
    static THRESHOLD = 3;
    static COOLDOWN_MS = 8000;
    state = 'closed';
    failures = 0;
    openedAt = null;
    halfOpenInFlight = false;
    async execute(fn) {
        this.maybeHalfOpen();
        if (this.state === 'open') {
            throw new CircuitOpenError();
        }
        if (this.state === 'half_open') {
            if (this.halfOpenInFlight)
                throw new CircuitOpenError();
            this.halfOpenInFlight = true;
        }
        try {
            const result = await fn();
            this.onSuccess();
            return result;
        }
        catch (err) {
            this.onFailure();
            throw err;
        }
        finally {
            this.halfOpenInFlight = false;
        }
    }
    status() {
        this.maybeHalfOpen();
        return new CircuitBreakerStatus(this.state, this.failures, CircuitBreakerEngine.THRESHOLD, CircuitBreakerEngine.COOLDOWN_MS, this.openedAt ? new Date(this.openedAt).toISOString() : null);
    }
    maybeHalfOpen() {
        if (this.state !== 'open' || this.openedAt === null)
            return;
        if (Date.now() - this.openedAt >= CircuitBreakerEngine.COOLDOWN_MS) {
            this.state = 'half_open';
        }
    }
    onSuccess() {
        this.failures = 0;
        this.state = 'closed';
        this.openedAt = null;
    }
    onFailure() {
        this.failures += 1;
        if (this.state === 'half_open' || this.failures >= CircuitBreakerEngine.THRESHOLD) {
            this.state = 'open';
            this.openedAt = Date.now();
        }
    }
}
//# sourceMappingURL=circuit-breaker.engine.js.map