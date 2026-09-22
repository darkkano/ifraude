import { DomainError } from './domain.error.js';
export class FreezeFailedError extends DomainError {
    constructor(reason) {
        super(`No se pudieron congelar los fondos: ${reason}`);
    }
}
//# sourceMappingURL=freeze-failed.error.js.map