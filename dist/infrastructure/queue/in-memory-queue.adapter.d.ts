import type { QueuePort } from '../../domain/ports/queue.port.js';
export declare class InMemoryQueueAdapter implements QueuePort {
    private readonly logger;
    private readonly waiting;
    private handler;
    private pumping;
    static readonly DELAY_MS = 150;
    enqueue(transactionId: string): Promise<void>;
    consume(handler: (transactionId: string) => Promise<void>): void;
    pendingCount(): number;
    private kick;
    private pump;
}
