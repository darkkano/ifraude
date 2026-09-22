/**
 * PUERTO driven — cola de jobs (hoy RAM, mañana BullMQ / RabbitMQ).
 *
 * FLUJO:
 *   SubmitUseCase.enqueue(id)     →  el HTTP ya puede responder 202
 *   Worker (driving) consume(id)  →  AnalyzeUseCase.execute(id)
 *
 * El dominio no sabe si detrás hay Redis, Rabbit o un Array.
 */
export interface QueuePort {
  enqueue(transactionId: string): Promise<void>;
  consume(handler: (transactionId: string) => Promise<void>): void;
  pendingCount(): number;
}
