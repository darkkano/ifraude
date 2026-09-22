import { CircuitBreakerEngine } from './circuit-breaker.engine.js';
import { CircuitOpenError } from '../../domain/errors/circuit-open.error.js';

describe('CircuitBreakerEngine', () => {
  it('CLOSED deja pasar y un éxito resetea fallos', async () => {
    const cb = new CircuitBreakerEngine();
    const out = await cb.execute(async () => 42);
    expect(out).toBe(42);
    expect(cb.state).toBe('closed');
    expect(cb.failures).toBe(0);
  });

  it('3 fallos → OPEN y la siguiente llamada es CircuitOpenError', async () => {
    const cb = new CircuitBreakerEngine();
    const boom = async () => {
      throw new Error('banco');
    };

    await expect(cb.execute(boom)).rejects.toThrow('banco');
    await expect(cb.execute(boom)).rejects.toThrow('banco');
    await expect(cb.execute(boom)).rejects.toThrow('banco');
    expect(cb.state).toBe('open');

    await expect(cb.execute(async () => 1)).rejects.toBeInstanceOf(CircuitOpenError);
  });
});
