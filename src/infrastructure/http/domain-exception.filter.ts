import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { DomainError } from '../../domain/errors/domain.error.js';
import { TransactionNotFoundError } from '../../domain/errors/transaction-not-found.error.js';

/**
 * ADAPTER driving — DomainError → HTTP.
 */
@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<{
      status: (code: number) => { json: (body: unknown) => void };
    }>();

    const status =
      exception instanceof TransactionNotFoundError
        ? HttpStatus.NOT_FOUND
        : HttpStatus.BAD_REQUEST;

    res.status(status).json({
      error: exception.name,
      message: exception.message,
    });
  }
}
