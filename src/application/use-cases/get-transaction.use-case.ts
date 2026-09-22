import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.js';
import { TransactionNotFoundError } from '../../domain/errors/transaction-not-found.error.js';
import type { TransactionRepositoryPort } from '../../domain/ports/transaction-repository.port.js';
import { TRANSACTION_REPO } from '../../domain/ports/tokens.js';

/** CAPA: Application — GET /v1/transactions/:id */
@Injectable()
export class GetTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPO) private readonly repo: TransactionRepositoryPort,
  ) {}

  async execute(id: string): Promise<Transaction> {
    const tx = await this.repo.findById(id);
    if (!tx) throw new TransactionNotFoundError(id);
    return tx;
  }
}

/** CAPA: Application — GET /v1/transactions */
@Injectable()
export class ListTransactionsUseCase {
  constructor(
    @Inject(TRANSACTION_REPO) private readonly repo: TransactionRepositoryPort,
  ) {}

  execute(): Promise<Transaction[]> {
    return this.repo.list();
  }
}
