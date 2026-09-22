import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction.js';
import type { TransactionRepositoryPort } from '../../domain/ports/transaction-repository.port.js';

/**
 * ADAPTER driven — persistencia en RAM.
 * Mañana: Drizzle + SQLite, igual que el repo de Products.
 */
@Injectable()
export class InMemoryTransactionRepository implements TransactionRepositoryPort {
  private readonly store = new Map<string, Transaction>();

  async save(tx: Transaction): Promise<void> {
    this.store.set(tx.id, tx);
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.store.get(id) ?? null;
  }

  async list(): Promise<Transaction[]> {
    return [...this.store.values()].reverse();
  }
}
