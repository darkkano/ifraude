import { DomainEvent } from '../entities/domain-event.js';
export interface EventBusPort {
    publish(event: DomainEvent): Promise<void>;
    list(): Promise<DomainEvent[]>;
}
