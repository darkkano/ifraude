import { Inject, Injectable, Logger } from '@nestjs/common';
import { DomainEvent } from '../../domain/entities/domain-event.js';
import { Transaction } from '../../domain/entities/transaction.js';
import { CircuitOpenError } from '../../domain/errors/circuit-open.error.js';
import { FreezeFailedError } from '../../domain/errors/freeze-failed.error.js';
import { TransactionNotFoundError } from '../../domain/errors/transaction-not-found.error.js';
import type { AnomalyDetectorPort } from '../../domain/ports/anomaly-detector.port.js';
import type { EventBusPort } from '../../domain/ports/event-bus.port.js';
import type { FreezeFundsPort } from '../../domain/ports/freeze-funds.port.js';
import type { TransactionRepositoryPort } from '../../domain/ports/transaction-repository.port.js';
import {
  ANOMALY_DETECTOR,
  EVENT_BUS,
  FREEZE_FUNDS,
  TRANSACTION_REPO,
} from '../../domain/ports/tokens.js';
import { decideAction } from '../../domain/risk-policy.js';

/**
 * CAPA: Application
 * LO EJECUTA el worker (driving adapter de la cola), NO el POST HTTP.
 *
 * ALGORITMO:
 *   1. Cargar tx
 *   2. Detector de anomalías (IA simulada)
 *   3. decideAction() en dominio
 *   4. Si freeze → FreezeFundsPort (circuit breaker por debajo)
 *   5. Guardar estado + publicar evento
 */
@Injectable()
export class AnalyzeTransactionUseCase {
  private readonly logger = new Logger(AnalyzeTransactionUseCase.name);

  constructor(
    @Inject(TRANSACTION_REPO) private readonly repo: TransactionRepositoryPort,
    @Inject(ANOMALY_DETECTOR) private readonly detector: AnomalyDetectorPort,
    @Inject(FREEZE_FUNDS) private readonly freezeFunds: FreezeFundsPort,
    @Inject(EVENT_BUS) private readonly events: EventBusPort,
  ) {}

  async execute(transactionId: string): Promise<Transaction> {
    const tx = await this.repo.findById(transactionId);
    if (!tx) throw new TransactionNotFoundError(transactionId);

    this.logger.log(`[1] Analizar tx=${tx.id}`);
    const score = await this.detector.score(tx);
    this.logger.log(
      `[2] Score=${score.value} level=${score.level} reasons=${score.reasons.join('|') || 'ninguna'}`,
    );

    const action = decideAction(score);
    this.logger.log(`[3] Acción de dominio=${action}`);

    if (action === 'clear') {
      tx.markClear(score);
      await this.persist(tx, 'TransactionCleared');
      return tx;
    }

    if (action === 'flag') {
      tx.markFlagged(score);
      await this.persist(tx, 'TransactionFlagged');
      return tx;
    }

    this.logger.log(`[4] Riesgo alto → congelar fondos`);
    try {
      const freeze = await this.freezeFunds.freeze(tx);
      tx.markFrozen(score, freeze);
      await this.persist(tx, 'FundsFrozen');
    } catch (err) {
      const note =
        err instanceof CircuitOpenError || err instanceof FreezeFailedError
          ? err.message
          : String(err);
      this.logger.warn(`[4] Freeze falló: ${note}`);
      tx.markFreezeFailed(score, note);
      await this.persist(tx, 'FreezeFailed');
    }

    return tx;
  }

  private async persist(tx: Transaction, type: string): Promise<void> {
    await this.repo.save(tx);
    await this.events.publish(
      new DomainEvent(type, new Date().toISOString(), {
        id: tx.id,
        status: tx.status,
        score: tx.score?.value ?? null,
        level: tx.score?.level ?? null,
      }),
    );
    this.logger.log(`[5] Persistido status=${tx.status}`);
  }
}
