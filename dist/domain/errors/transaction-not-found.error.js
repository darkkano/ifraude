import { DomainError } from './domain.error.js';
export class TransactionNotFoundError extends DomainError {
    constructor(id) {
        super(`Transacción no encontrada: ${id}`);
    }
}
//# sourceMappingURL=transaction-not-found.error.js.map