import { Injectable } from '@nestjs/common';
import { DomainEvent } from '../../domain/entities/domain-event.js';
import type { EventBusPort } from '../../domain/ports/event-bus.port.js';

/**
 * ADAPTER driven — eventos en RAM.
 * Mañana: RabbitMQ publish. El use case no cambia.
 */
@Injectable()
export class InMemoryEventBus implements EventBusPort {
  private readonly events: DomainEvent[] = [];

  async publish(event: DomainEvent): Promise<void> {
    this.events.push(event);
  }

  async list(): Promise<DomainEvent[]> {
    return [...this.events].reverse();
  }
}
