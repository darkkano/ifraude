export type CircuitState = 'closed' | 'open' | 'half_open';
export declare class CircuitBreakerStatus {
    readonly state: CircuitState;
    readonly failures: number;
    readonly threshold: number;
    readonly cooldownMs: number;
    readonly openedAt: string | null;
    constructor(state: CircuitState, failures: number, threshold: number, cooldownMs: number, openedAt: string | null);
}
