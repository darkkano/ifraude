import { FraudScore, RiskLevel } from './entities/fraud-score.js';
export type RiskAction = 'clear' | 'flag' | 'freeze';
export declare function levelFromValue(value: number): RiskLevel;
export declare function decideAction(score: FraudScore): RiskAction;
