import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetOpsUseCase } from '../../application/use-cases/get-ops.use-case.js';

/**
 * ADAPTER driving — cola, eventos, circuit breaker (práctica).
 */
@Controller('v1')
export class OpsController {
  constructor(private readonly ops: GetOpsUseCase) {}

  @Get('events')
  events() {
    return this.ops.listEvents();
  }

  @Get('queue')
  queue() {
    return this.ops.queuePending();
  }

  @Get('circuit-breaker')
  circuit() {
    const status = this.ops.circuit();
    return {
      state: status.state,
      failures: status.failures,
      threshold: status.threshold,
      cooldownMs: status.cooldownMs,
      openedAt: status.openedAt,
    };
  }

  /**
   * Práctica: tumba el banco simulado para ver el breaker pasar a OPEN.
   * POST { "fail": true }  →  los próximos freeze fallan
   * POST { "fail": false } →  el banco vuelve
   */
  @Post('debug/bank-fail')
  bankFail(@Body() body: { fail?: boolean }) {
    return this.ops.setBankFail(Boolean(body?.fail));
  }
}

@Controller()
export class HealthController {
  @Get()
  info() {
    return {
      name: 'Motor asíncrono de detección de fraude (práctica hexagonal)',
      idea: 'El pago responde 202; un worker en cola analiza y congela con Circuit Breaker.',
      endpoints: {
        'POST /v1/transactions': 'Acepta el pago (202) y encola el análisis',
        'GET /v1/transactions': 'Lista',
        'GET /v1/transactions/:id': 'Estado / score / freeze',
        'GET /v1/events': 'Eventos de dominio',
        'GET /v1/queue': 'Jobs pendientes',
        'GET /v1/circuit-breaker': 'closed | open | half_open',
        'POST /v1/debug/bank-fail': 'Simular banco caído',
      },
      lee: 'README.md',
    };
  }
}
