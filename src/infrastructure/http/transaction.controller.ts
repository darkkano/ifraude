import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { SubmitTransactionInput } from '../../application/dto/submit-transaction.input.js';
import {
  GetTransactionUseCase,
  ListTransactionsUseCase,
} from '../../application/use-cases/get-transaction.use-case.js';
import { SubmitTransactionUseCase } from '../../application/use-cases/submit-transaction.use-case.js';
import { transactionJson } from './transaction.json.js';

/**
 * ADAPTER driving — HTTP de transacciones.
 *
 * FLUJO DEL PAGO:
 *   POST /v1/transactions  →  SubmitUseCase  →  202 YA (pending_analysis)
 *   el worker analiza en la cola, sin bloquear esta respuesta
 */
@Controller('v1/transactions')
export class TransactionController {
  constructor(
    private readonly submit: SubmitTransactionUseCase,
    private readonly getOne: GetTransactionUseCase,
    private readonly list: ListTransactionsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async create(
    @Body()
    body: {
      amount?: number;
      merchant?: string;
      country?: string;
      cardLast4?: string;
    },
  ) {
    if (typeof body?.amount !== 'number' || !(body.amount > 0)) {
      throw new BadRequestException('amount (number > 0) es obligatorio.');
    }
    if (!body.merchant || typeof body.merchant !== 'string') {
      throw new BadRequestException('merchant (string) es obligatorio.');
    }
    if (!body.country || typeof body.country !== 'string') {
      throw new BadRequestException('country (string, ISO-2) es obligatorio.');
    }
    if (!/^\d{4}$/.test(body.cardLast4 ?? '')) {
      throw new BadRequestException('cardLast4 debe ser 4 dígitos.');
    }

    const tx = await this.submit.execute(
      new SubmitTransactionInput(
        body.amount,
        body.merchant.trim(),
        body.country.trim(),
        body.cardLast4 as string,
      ),
    );

    return {
      id: tx.id,
      status: tx.status,
      message: 'Pago aceptado. El fraude se analiza en cola (no bloquea el checkout).',
    };
  }

  @Get()
  async findAll() {
    const items = await this.list.execute();
    return items.map(transactionJson);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const tx = await this.getOne.execute(id);
    return transactionJson(tx);
  }
}
