import { GetOpsUseCase } from '../../application/use-cases/get-ops.use-case.js';
export declare class OpsController {
    private readonly ops;
    constructor(ops: GetOpsUseCase);
    events(): Promise<import("../../domain/entities/domain-event.js").DomainEvent[]>;
    queue(): {
        pending: number;
    };
    circuit(): {
        state: import("../../domain/entities/circuit-breaker-status.js").CircuitState;
        failures: number;
        threshold: number;
        cooldownMs: number;
        openedAt: string | null;
    };
    bankFail(body: {
        fail?: boolean;
    }): {
        bankFail: boolean;
        circuit: import("../../domain/entities/circuit-breaker-status.js").CircuitBreakerStatus;
    };
}
export declare class HealthController {
    info(): {
        name: string;
        idea: string;
        endpoints: {
            'POST /v1/transactions': string;
            'GET /v1/transactions': string;
            'GET /v1/transactions/:id': string;
            'GET /v1/events': string;
            'GET /v1/queue': string;
            'GET /v1/circuit-breaker': string;
            'POST /v1/debug/bank-fail': string;
        };
        lee: string;
    };
}
