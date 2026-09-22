import { DomainEvent } from '../../domain/entities/domain-event.js';
import type { EventBusPort } from '../../domain/ports/event-bus.port.js';
export declare class InMemoryEventBus implements EventBusPort {
    private readonly events;
    publish(event: DomainEvent): Promise<void>;
    list(): Promise<DomainEvent[]>;
}
