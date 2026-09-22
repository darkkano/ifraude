export interface QueuePort {
    enqueue(transactionId: string): Promise<void>;
    consume(handler: (transactionId: string) => Promise<void>): void;
    pendingCount(): number;
}
