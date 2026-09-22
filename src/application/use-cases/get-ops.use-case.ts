import { Inject, Injectable } from '@nestjs/common';
import { CircuitBreakerStatus } from '../../domain/entities/circuit-breaker-status.js';
import { DomainEvent } from '../../domain/entities/domain-event.js';
import type { CircuitBreakerPort } from '../../domain/ports/circuit-breaker.port.js';
import type { EventBusPort } from '../../domain/ports/event-bus.port.js';
import type { QueuePort } from '../../domain/ports/queue.port.js';
import { CIRCUIT_BREAKER, EVENT_BUS, QUEUE } from '../../domain/ports/tokens.js';

/** CAPA: Application — consultas de práctica (eventos, cola, breaker). */
@Injectable()
export class GetOpsUseCase {
  constructor(
    @Inject(EVENT_BUS) private readonly events: EventBusPort,
    @Inject(QUEUE) private readonly queue: QueuePort,
    @Inject(CIRCUIT_BREAKER) private readonly breaker: CircuitBreakerPort,
  ) {}

  listEvents(): Promise<DomainEvent[]> {
    return this.events.list();
  }

  queuePending(): { pending: number } {
    return { pending: this.queue.pendingCount() };
  }

  circuit(): CircuitBreakerStatus {
    return this.breaker.getStatus();
  }

  setBankFail(fail: boolean): { bankFail: boolean; circuit: CircuitBreakerStatus } {
    this.breaker.setBankFail(fail);
    return { bankFail: fail, circuit: this.breaker.getStatus() };
  }
}
