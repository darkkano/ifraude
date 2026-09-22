import { FreezeResult } from '../entities/freeze-result.js';
import { Transaction } from '../entities/transaction.js';
export interface FreezeFundsPort {
    freeze(tx: Transaction): Promise<FreezeResult>;
}
