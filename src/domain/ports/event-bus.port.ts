import { DomainEvent } from '../entities/domain-event.js';

/**
 * PUERTO driven — bus de eventos in-process.
 * GET /v1/events lista lo publicado (práctica).
 */
export interface EventBusPort {
  publish(event: DomainEvent): Promise<void>;
  list(): Promise<DomainEvent[]>;
}
