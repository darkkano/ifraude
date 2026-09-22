import { FreezeResult } from '../../domain/entities/freeze-result.js';
import { Transaction } from '../../domain/entities/transaction.js';
import type { FreezeFundsPort } from '../../domain/ports/freeze-funds.port.js';
export declare class BankFreezeAdapter implements FreezeFundsPort {
    private readonly logger;
    forceFail: boolean;
    freeze(tx: Transaction): Promise<FreezeResult>;
}
