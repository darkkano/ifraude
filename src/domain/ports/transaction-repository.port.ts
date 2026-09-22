import { Transaction } from '../entities/transaction.js';

/**
 * PUERTO driven (como IProductRepository).
 * IMPLEMENTA: infrastructure/persistence/*
 */
export interface TransactionRepositoryPort {
  save(tx: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  list(): Promise<Transaction[]>;
}
