import { DomainError } from './domain.error.js';
export class CircuitOpenError extends DomainError {
    constructor() {
        super('Circuit breaker OPEN: no se llama al banco para congelar. Reintenta cuando pase a half-open.');
    }
}
//# sourceMappingURL=circuit-open.error.js.map