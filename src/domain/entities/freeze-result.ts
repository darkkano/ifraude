/**
 * CAPA: Domain / Value object
 * Resultado de FreezeFundsPort (el banco).
 */
export class FreezeResult {
  constructor(
    public readonly frozen: boolean,
    public readonly reference: string,
    public readonly note: string,
  ) {}
}
