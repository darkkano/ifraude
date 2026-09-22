/**
 * CAPA: Application
 * Entrada del caso Submit (ya no es HTTP).
 */
export class SubmitTransactionInput {
  constructor(
    public readonly amount: number,
    public readonly merchant: string,
    public readonly country: string,
    public readonly cardLast4: string,
  ) {}
}
