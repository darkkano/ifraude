var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HeuristicAnomalyDetector_1;
import { Injectable, Logger } from '@nestjs/common';
import { FraudScore } from '../../domain/entities/fraud-score.js';
import { levelFromValue } from '../../domain/risk-policy.js';
const USUAL_COUNTRIES = new Set(['VE', 'US', 'ES', 'CO', 'MX', 'AR', 'CL', 'PE']);
let HeuristicAnomalyDetector = HeuristicAnomalyDetector_1 = class HeuristicAnomalyDetector {
    logger = new Logger(HeuristicAnomalyDetector_1.name);
    async score(tx) {
        let value = 0;
        const reasons = [];
        if (tx.amount >= 10000) {
            value += 50;
            reasons.push('monto muy alto (>=10000)');
        }
        else if (tx.amount >= 5000) {
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
};
HeuristicAnomalyDetector = HeuristicAnomalyDetector_1 = __decorate([
    Injectable()
], HeuristicAnomalyDetector);
export { HeuristicAnomalyDetector };
//# sourceMappingURL=heuristic-anomaly.detector.js.map