import { FreezeResult } from './freeze-result.js';
import { FraudScore } from './fraud-score.js';

/**
 * CAPA: Domain / Entidad
 *
 * FLUJO:
 *   POST HTTP           →  new Transaction (pending_analysis)
 *   Worker + detector   →  markClear / markFlagged
 *   FreezeFundsPort     →  markFrozen / markFreezeFailed
 */
export type TransactionStatus =
  | 'pending_analysis'
  | 'clear'
  | 'flagged'
  | 'frozen'
  | 'freeze_failed';

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly amount: number,
    public readonly merchant: string,
    public readonly country: string,
    public readonly cardLast4: string,
    public readonly createdAt: string,
    public status: TransactionStatus = 'pending_analysis',
    public score: FraudScore | null = null,
    public freeze: FreezeResult | null = null,
  ) {}

  markClear(score: FraudScore): void {
    this.score = score;
    this.status = 'clear';
  }

  markFlagged(score: FraudScore): void {
    this.score = score;
    this.status = 'flagged';
  }

  markFrozen(score: FraudScore, freeze: FreezeResult): void {
    this.score = score;
    this.freeze = freeze;
    this.status = 'frozen';
  }

  markFreezeFailed(score: FraudScore, note: string): void {
    this.score = score;
    this.freeze = new FreezeResult(false, '', note);
    this.status = 'freeze_failed';
  }
}
