import { DomainError } from './domain.error.js';

/**
 * CAPA: Domain
 * CUÁNDO: GET/ANALYZE de un id que no existe.
 * FLUJO: UseCase → throw → Filter → HTTP 404
 */
export class TransactionNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Transacción no encontrada: ${id}`);
  }
}
