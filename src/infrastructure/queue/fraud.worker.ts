import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AnalyzeTransactionUseCase } from '../../application/use-cases/analyze-transaction.use-case.js';
import type { QueuePort } from '../../domain/ports/queue.port.js';
import { QUEUE } from '../../domain/ports/tokens.js';

/**
 * ADAPTER driving (como el Controller, pero la "entrada" es la COLA).
 *
 * FLUJO:
 *   OnModuleInit → queue.consume(handler)
 *   job id       → AnalyzeTransactionUseCase.execute(id)
 *
 * Equivale al worker de BullMQ. El POST HTTP nunca llama al análisis.
 */
@Injectable()
export class FraudWorker implements OnModuleInit {
  private readonly logger = new Logger(FraudWorker.name);

  constructor(
    @Inject(QUEUE) private readonly queue: QueuePort,
    private readonly analyze: AnalyzeTransactionUseCase,
  ) {}

  onModuleInit(): void {
    this.logger.log('Worker suscrito a la cola');
    this.queue.consume(async (id) => {
      this.logger.log(`procesando job tx=${id}`);
      await this.analyze.execute(id);
    });
  }
}
