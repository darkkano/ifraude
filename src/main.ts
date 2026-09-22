import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

/**
 * Arranque HTTP. Puerto 3001 para no chocar con iaseguro (:3000).
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Motor de fraude (práctica) → http://localhost:${port}`);
  logger.log('POST /v1/transactions | GET /v1/transactions/:id | GET /v1/circuit-breaker');
  logger.log('Lee README.md — finalidad y catálogo de endpoints.');
}

await bootstrap();
