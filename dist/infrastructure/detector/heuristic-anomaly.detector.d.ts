import { FraudScore } from '../../domain/entities/fraud-score.js';
import { Transaction } from '../../domain/entities/transaction.js';
import type { AnomalyDetectorPort } from '../../domain/ports/anomaly-detector.port.js';
export declare class HeuristicAnomalyDetector implements AnomalyDetectorPort {
    private readonly logger;
    score(tx: Transaction): Promise<FraudScore>;
}
