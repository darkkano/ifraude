import { Injectable, Logger } from '@nestjs/common';
import { FraudScore } from '../../domain/entities/fraud-score.js';
import { Transaction } from '../../domain/entities/transaction.js';
import type { AnomalyDetectorPort } from '../../domain/ports/anomaly-detector.port.js';
import { levelFromValue } from '../../domain/risk-policy.js';

const USUAL_COUNTRIES = new Set(['VE', 'US', 'ES', 'CO', 'MX', 'AR', 'CL', 'PE']);

/**
 * ADAPTER driven — "IA" de anomalías (heurística, práctica).
 *
 * FLUJO: AnalyzeUseCase.detector.score(tx) → este archivo → FraudScore
 *
 * Cómo forzar niveles:
 *   low:    amount 20, country VE, merchant tienda, card 1234
 *   medium: amount 5000  (o casino + país raro)
 *   high:   amount 8000 + crypto + card 0000  → freeze
 */
@Injectable()
export class HeuristicAnomalyDetector implements AnomalyDetectorPort {
  private readonly logger = new Logger(HeuristicAnomalyDetector.name);

  async score(tx: Transaction): Promise<FraudScore> {
    let value = 0;
    const reasons: string[] = [];

    if (tx.amount >= 10000) {
      value += 50;
      reasons.push('monto muy alto (>=10000)');
    } else if (tx.amount >= 5000) {
      value += 40;
      reasons.push('monto alto (>=5000)');
    }

    if (!USUAL_COUNTRIES.has(tx.country)) {
      value += 30;
      reasons.push(`país inusual (${tx.country})`);
    }

    if (/crypto|casino|offshore/i.test(tx.merchant)) {
      value += 25;
      reasons.push('comercio de alto riesgo');
    }

    if (tx.cardLast4 === '0000') {
      value += 40;
      reasons.push('tarjeta en lista negra');
    }

    if (tx.amount % 1000 === 999) {
      value += 15;
      reasons.push('monto estructurado');
    }

    value = Math.min(100, value);
    const score = new FraudScore(value, levelFromValue(value), reasons);
    this.logger.log(`tx=${tx.id} score=${score.value} ${score.level}`);
    return score;
  }
}
