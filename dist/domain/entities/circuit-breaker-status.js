export class CircuitBreakerStatus {
    state;
    failures;
    threshold;
    cooldownMs;
    openedAt;
    constructor(state, failures, threshold, cooldownMs, openedAt) {
        this.state = state;
        this.failures = failures;
        this.threshold = threshold;
        this.cooldownMs = cooldownMs;
        this.openedAt = openedAt;
    }
}
//# sourceMappingURL=circuit-breaker-status.js.map