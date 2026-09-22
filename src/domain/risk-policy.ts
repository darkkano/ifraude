import { FraudScore, RiskLevel } from './entities/fraud-score.js';

/**
 * CAPA: Domain / política PURA (cero I/O)
 *
 * FLUJO:
 *   detector.score → FraudScore
 *   decideAction(score) → 'clear' | 'flag' | 'freeze'
 *
 *   low    < 40   → el pago sigue, no se toca
 *   medium 40–69  → se marca sospechosa, NO se congelan fondos
 *   high   ≥ 70   → se dispara FreezeFundsPort (con Circuit Breaker)
 */
export type RiskAction = 'clear' | 'flag' | 'freeze';

export function levelFromValue(value: number): RiskLevel {
  if (value >= 70) return 'high';
  if (value >= 40) return 'medium';
  return 'low';
}

export function decideAction(score: FraudScore): RiskAction {
  if (score.level === 'high') return 'freeze';
  if (score.level === 'medium') return 'flag';
  return 'clear';
}
