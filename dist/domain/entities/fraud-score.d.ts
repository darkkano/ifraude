export type RiskLevel = 'low' | 'medium' | 'high';
export declare class FraudScore {
    readonly value: number;
    readonly level: RiskLevel;
    readonly reasons: string[];
    constructor(value: number, level: RiskLevel, reasons: string[]);
}
