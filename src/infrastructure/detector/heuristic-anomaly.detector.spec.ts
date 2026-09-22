import { HeuristicAnomalyDetector } from './heuristic-anomaly.detector.js';
import { Transaction } from '../../domain/entities/transaction.js';

function make(partial: Partial<Transaction> = {}): Transaction {
  return new Transaction(
    'id',
    partial.amount ?? 20,
    partial.merchant ?? 'tienda',
    partial.country ?? 'VE',
    partial.cardLast4 ?? '1234',
    new Date().toISOString(),
  );
}

describe('HeuristicAnomalyDetector', () => {
  const detector = new HeuristicAnomalyDetector();

  it('compra normal → low', async () => {
    const score = await detector.score(make());
    expect(score.level).toBe('low');
    expect(score.value).toBe(0);
  });

  it('monto 5000 → medium', async () => {
    const score = await detector.score(make({ amount: 5000 }));
    expect(score.level).toBe('medium');
  });

  it('crypto + lista negra + monto alto → high', async () => {
    const score = await detector.score(
      make({ amount: 8000, merchant: 'crypto-shop', cardLast4: '0000', country: 'RU' }),
    );
    expect(score.level).toBe('high');
    expect(score.value).toBeGreaterThanOrEqual(70);
  });
});
