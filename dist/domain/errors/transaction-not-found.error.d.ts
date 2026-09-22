import { DomainError } from './domain.error.js';
export declare class TransactionNotFoundError extends DomainError {
    constructor(id: string);
}
