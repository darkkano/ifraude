import { FraudScore } from '../entities/fraud-score.js';
import { Transaction } from '../entities/transaction.js';

/**
 * PUERTO driven — "modelo de IA" de anomalías.
 * IMPLEMENTA: heuristic (práctica). Mañana: ONNX / servicio Python.
 *
 * FLUJO: AnalyzeUseCase → score(tx) → FraudScore
 */
export interface AnomalyDetectorPort {
  score(tx: Transaction): Promise<FraudScore>;
}
