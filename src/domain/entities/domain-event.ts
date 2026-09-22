/**
 * CAPA: Domain / evento
 *
 * FLUJO:
 *   UseCase  →  EventBusPort.publish(event)
 *   GET /v1/events  →  list()
 *
 * No lleva PII de más: cardLast4 como mucho, nunca PAN completo.
 */
export class DomainEvent {
  constructor(
    public readonly type: string,
    public readonly at: string,
    public readonly payload: Record<string, unknown>,
  ) {}
}
