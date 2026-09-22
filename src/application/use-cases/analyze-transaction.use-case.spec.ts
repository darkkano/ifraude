import { AnalyzeTransactionUseCase } from './analyze-transaction.use-case.js';
import { Transaction } from '../../domain/entities/transaction.js';
import { FraudScore } from '../../domain/entities/fraud-score.js';
import { FreezeResult } from '../../domain/entities/freeze-result.js';
import { FreezeFailedError } from '../../domain/errors/freeze-failed.error.js';
import { CircuitOpenError } from '../../domain/errors/circuit-open.error.js';
import type { TransactionRepositoryPort } from '../../domain/ports/transaction-repository.port.js';
import type { AnomalyDetectorPort } from '../../domain/ports/anomaly-detector.port.js';
import type { FreezeFundsPort } from '../../domain/ports/freeze-funds.port.js';
import type { EventBusPort } from '../../domain/ports/event-bus.port.js';

function tx(amount = 20): Transaction {
  return new Transaction(
    'tx-1',
    amount,
    'tienda',
    'VE',
    '1234',
    new Date().toISOString(),
  );
}

function build(opts: {
  score: FraudScore;
  freeze?: FreezeFundsPort['freeze'];
}) {
  const stored = tx();
  const repo: TransactionRepositoryPort = {
    save: async (t) => {
      stored.status = t.status;
      stored.score = t.score;
      stored.freeze = t.freeze;
    },
    findById: async () => stored,
    list: async () => [stored],
  };
  const detector: AnomalyDetectorPort = {
    score: async () => opts.score,
  };
  const freezeFn = opts.freeze ?? (async () => new FreezeResult(true, 'FRZ', 'ok'));
  const freezeFunds: FreezeFundsPort = { freeze: freezeFn };
  const events: EventBusPort = {
    publish: async () => undefined,
    list: async () => [],
  };
  return {
    stored,
    freezeFn,
    useCase: new AnalyzeTransactionUseCase(repo, detector, freezeFunds, events),
  };
}

describe('AnalyzeTransactionUseCase', () => {
  it('low → clear y NO llama al banco', async () => {
    const freeze = vi.fn(async () => new FreezeResult(true, 'x', 'ok'));
    const { useCase, stored } = build({
      score: new FraudScore(0, 'low', []),
      freeze,
    });

    await useCase.execute('tx-1');

    expect(stored.status).toBe('clear');
    expect(freeze).not.toHaveBeenCalled();
  });

  it('medium → flagged y NO congela', async () => {
    const freeze = vi.fn(async () => new FreezeResult(true, 'x', 'ok'));
    const { useCase, stored } = build({
      score: new FraudScore(45, 'medium', ['monto alto']),
      freeze,
    });

    await useCase.execute('tx-1');

    expect(stored.status).toBe('flagged');
    expect(freeze).not.toHaveBeenCalled();
  });

  it('high → freezeFunds y status frozen', async () => {
    const freeze = vi.fn(async () => new FreezeResult(true, 'FRZ1', 'ok'));
    const { useCase, stored } = build({
      score: new FraudScore(90, 'high', ['lista negra']),
      freeze,
    });

    await useCase.execute('tx-1');

    expect(freeze).toHaveBeenCalled();
    expect(stored.status).toBe('frozen');
    expect(stored.freeze?.reference).toBe('FRZ1');
  });

  it('high + CircuitOpen → freeze_failed (el worker no explota)', async () => {
    const { useCase, stored } = build({
      score: new FraudScore(90, 'high', []),
      freeze: async () => {
        throw new CircuitOpenError();
      },
    });

    await useCase.execute('tx-1');
    expect(stored.status).toBe('freeze_failed');
  });

  it('high + banco caído → freeze_failed', async () => {
    const { useCase, stored } = build({
      score: new FraudScore(90, 'high', []),
      freeze: async () => {
        throw new FreezeFailedError('caído');
      },
    });

    await useCase.execute('tx-1');
    expect(stored.status).toBe('freeze_failed');
  });
});
