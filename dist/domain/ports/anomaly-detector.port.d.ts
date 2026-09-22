import { FraudScore } from '../entities/fraud-score.js';
import { Transaction } from '../entities/transaction.js';
export interface AnomalyDetectorPort {
    score(tx: Transaction): Promise<FraudScore>;
}
