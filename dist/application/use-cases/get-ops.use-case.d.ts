import { CircuitBreakerStatus } from '../../domain/entities/circuit-breaker-status.js';
import { DomainEvent } from '../../domain/entities/domain-event.js';
import type { CircuitBreakerPort } from '../../domain/ports/circuit-breaker.port.js';
import type { EventBusPort } from '../../domain/ports/event-bus.port.js';
import type { QueuePort } from '../../domain/ports/queue.port.js';
export declare class GetOpsUseCase {
    private readonly events;
    private readonly queue;
    private readonly breaker;
    constructor(events: EventBusPort, queue: QueuePort, breaker: CircuitBreakerPort);
    listEvents(): Promise<DomainEvent[]>;
    queuePending(): {
        pending: number;
    };
    circuit(): CircuitBreakerStatus;
    setBankFail(fail: boolean): {
        bankFail: boolean;
        circuit: CircuitBreakerStatus;
    };
}
