/**
 * CAPA: Domain / Value object
 *
 * FLUJO:
 *   AnomalyDetectorPort.score(tx)  →  FraudScore
 *   decideRisk(score)              →  clear | flag | freeze
 */
export type RiskLevel = 'low' | 'medium' | 'high';

export class FraudScore {
  constructor(
    public readonly value: number,
    public readonly level: RiskLevel,
    public readonly reasons: string[],
  ) {}
}
