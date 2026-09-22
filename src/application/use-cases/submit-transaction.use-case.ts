import { randomUUID } from 'node:crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DomainEvent } from '../../domain/entities/domain-event.js';
import { Transaction } from '../../domain/entities/transaction.js';
import type { EventBusPort } from '../../domain/ports/event-bus.port.js';
import type { QueuePort } from '../../domain/ports/queue.port.js';
import type { TransactionRepositoryPort } from '../../domain/ports/transaction-repository.port.js';
import {
  EVENT_BUS,
  QUEUE,
  TRANSACTION_REPO,
} from '../../domain/ports/tokens.js';
import { SubmitTransactionInput } from '../dto/submit-transaction.input.js';

/**
 * CAPA: Application (verde)
 *
 * FINALIDAD: el pago NO espera al modelo de fraude.
 *            Guarda + encola y listo. El HTTP puede devolver 202.
 *
 * ALGORITMO:
 *   1. Crear Transaction pending_analysis
 *   2. Repo.save
 *   3. Event TransactionSubmitted
 *   4. Queue.enqueue(id)   ← el worker lo tomará DESPUÉS
 */
@Injectable()
export class SubmitTransactionUseCase {
  private readonly logger = new Logger(SubmitTransactionUseCase.name);

  constructor(
    @Inject(TRANSACTION_REPO) private readonly repo: TransactionRepositoryPort,
    @Inject(QUEUE) private readonly queue: QueuePort,
    @Inject(EVENT_BUS) private readonly events: EventBusPort,
  ) {}

  async execute(input: SubmitTransactionInput): Promise<Transaction> {
    const tx = new Transaction(
      randomUUID(),
      input.amount,
      input.merchant,
      input.country.toUpperCase(),
      input.cardLast4,
      new Date().toISOString(),
    );

    this.logger.log(`[1] Guardar tx=${tx.id} amount=${tx.amount} (pending_analysis)`);
    await this.repo.save(tx);

    await this.events.publish(
      new DomainEvent('TransactionSubmitted', new Date().toISOString(), {
        id: tx.id,
        amount: tx.amount,
        merchant: tx.merchant,
      }),
    );

    this.logger.log(`[2] Encolar tx=${tx.id} (el HTTP ya puede responder 202)`);
    await this.queue.enqueue(tx.id);

    return tx;
  }
}
