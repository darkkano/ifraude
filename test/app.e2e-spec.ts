import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';

async function waitUntil(
  app: INestApplication<App>,
  id: string,
  predicate: (body: { status: string }) => boolean,
): Promise<{ status: string; score: { level: string } | null; freeze: unknown }> {
  const deadline = Date.now() + 3000;
  let last: { status: string; score: { level: string } | null; freeze: unknown } =
    { status: 'pending_analysis', score: null, freeze: null };
  while (Date.now() < deadline) {
    const res = await request(app.getHttpServer()).get(`/v1/transactions/${id}`);
    last = res.body;
    if (predicate(last)) return last;
    await new Promise((r) => setTimeout(r, 50));
  }
  return last;
}

describe('Motor de fraude (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET / lista endpoints', async () => {
    const res = await request(app.getHttpServer()).get('/').expect(200);
    expect(res.body.name).toContain('fraude');
  });

  it('POST 202 pending y luego el worker deja clear', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/transactions')
      .send({ amount: 20, merchant: 'tienda', country: 'VE', cardLast4: '1234' })
      .expect(202);

    expect(res.body.status).toBe('pending_analysis');
    expect(res.body.id).toBeTruthy();

    const done = await waitUntil(app, res.body.id, (b) => b.status === 'clear');
    expect(done.status).toBe('clear');
  });

  it('compra de alto riesgo → frozen con reference', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/transactions')
      .send({
        amount: 8000,
        merchant: 'crypto-shop',
        country: 'RU',
        cardLast4: '0000',
      })
      .expect(202);

    const done = await waitUntil(app, res.body.id, (b) => b.status !== 'pending_analysis');
    expect(done.status).toBe('frozen');
    expect(done.score?.level).toBe('high');
  });

  it('GET desconocido → 404', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/transactions/no-existe')
      .expect(404);
    expect(res.body.error).toBe('TransactionNotFoundError');
  });
});
