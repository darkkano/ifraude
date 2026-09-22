import { Injectable, Logger } from '@nestjs/common';
import type { QueuePort } from '../../domain/ports/queue.port.js';

/**
 * ADAPTER driven — cola en RAM (BullMQ/RabbitMQ de práctica).
 *
 * FLUJO:
 *   SubmitUseCase.enqueue(id)
 *     → este array + setTimeout
 *     → FraudWorker.handler(id)
 *       → AnalyzeUseCase
 *
 * El delay (150ms) es a propósito: el POST 202 sale ANTES de que corra el análisis.
 * Mañana: { provide: QUEUE, useClass: BullMqQueueAdapter }
 */
@Injectable()
export class InMemoryQueueAdapter implements QueuePort {
  private readonly logger = new Logger(InMemoryQueueAdapter.name);
  private readonly waiting: string[] = [];
  private handler: ((id: string) => Promise<void>) | null = null;
  private pumping = false;

  /** Tiempo que espera el job en cola antes del worker (simula async real). */
  static readonly DELAY_MS = 150;

  async enqueue(transactionId: string): Promise<void> {
    this.waiting.push(transactionId);
    this.logger.log(`enqueue id=${transactionId} pending=${this.waiting.length}`);
    this.kick();
  }

  consume(handler: (transactionId: string) => Promise<void>): void {
    this.handler = handler;
    this.kick();
  }

  pendingCount(): number {
    return this.waiting.length;
  }

  private kick(): void {
    if (this.pumping || !this.handler || this.waiting.length === 0) return;
    this.pumping = true;
    setTimeout(() => {
      void this.pump();
    }, InMemoryQueueAdapter.DELAY_MS);
  }

  private async pump(): Promise<void> {
    try {
      while (this.handler && this.waiting.length > 0) {
        const id = this.waiting.shift();
        if (!id) break;
        this.logger.log(`worker toma id=${id}`);
        await this.handler(id);
      }
    } finally {
      this.pumping = false;
      if (this.waiting.length > 0) this.kick();
    }
  }
}
