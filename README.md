# Motor asíncrono de detección de fraude — práctica hexagonal (NestJS)

```
HTTP 202  →  Cola  →  Worker  →  “IA” anomalías  →  (si hay riesgo) congelar fondos
                                              Circuit Breaker envuelve al banco
```

Puerto: **3001** (el gateway de IA usa 3000).

---

## 1. Finalidad

Si el checkout llama a un modelo de fraude **antes** de confirmar el pago, el usuario espera. En Black Friday eso mata conversión.

**Este proyecto desacopla el pago del análisis.**

1. El front/pasarela pega `POST /v1/transactions`.
2. El API responde **202** al toque: `pending_analysis`. El dinero “entró”.
3. Un **worker** toma el job de una cola (hoy RAM; mañana BullMQ/RabbitMQ).
4. Pasa la transacción por un detector de anomalías (IA simulada).
5. Si el riesgo es **alto**, dispara congelar fondos. Esa llamada al banco va envuelta en **Circuit Breaker**: si el banco está caído, no se insiste y se falla rápido.

| Sin esto | Con esto |
|----------|----------|
| Pago espera 800ms al modelo | Pago responde en milisegundos |
| Banco caído = timeout en el checkout | Breaker OPEN, el worker anota `freeze_failed` |
| Todo síncrono en un controller | Event-driven: cola + eventos de dominio |

**Qué no es:** un motor antifraude de producción ni ML real. Es práctica hexagonal de un sistema **asíncrono**.

---

## 2. Cómo se usa — endpoints

```bash
cd ifraude
npm install
npm run start:dev
```

Base: `http://localhost:3001`

| Método | Ruta | Qué hace |
|--------|------|----------|
| `GET` | `/` | Mapa del proyecto |
| `POST` | `/v1/transactions` | Acepta el pago (**202**) y encola el análisis |
| `GET` | `/v1/transactions` | Lista |
| `GET` | `/v1/transactions/:id` | Estado, score, freeze |
| `GET` | `/v1/events` | Eventos (`TransactionSubmitted`, `FundsFrozen`, …) |
| `GET` | `/v1/queue` | Jobs aún en cola |
| `GET` | `/v1/circuit-breaker` | `closed` / `open` / `half_open` |
| `POST` | `/v1/debug/bank-fail` | Simula banco caído para ver el breaker |

---

### `GET /`

```bash
curl -s http://localhost:3001/
```

---

### `POST /v1/transactions`

El checkout. **No espera** al modelo.

**Body**

| Campo | Tipo | Obligatorio | Ejemplo |
|-------|------|-------------|---------|
| `amount` | number > 0 | sí | `20` |
| `merchant` | string | sí | `tienda` |
| `country` | string ISO-2 | sí | `VE` |
| `cardLast4` | 4 dígitos | sí | `1234` |

**202**

```json
{
  "id": "uuid",
  "status": "pending_analysis",
  "message": "Pago aceptado. El fraude se analiza en cola (no bloquea el checkout)."
}
```

**400** si falta un campo.

**Cómo forzar el score** (heurística de práctica):

| Prompt de datos | Score | Resultado del worker |
|-----------------|-------|----------------------|
| `amount: 20`, `country: VE`, `merchant: tienda`, `cardLast4: 1234` | low (0) | `clear` |
| `amount: 5000` | medium (~40) | `flagged` (no congela) |
| `amount: 8000`, `merchant: crypto-shop`, `country: RU`, `cardLast4: 0000` | high | `frozen` |

Compra normal:

```bash
curl -s http://localhost:3001/v1/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount":20,"merchant":"tienda","country":"VE","cardLast4":"1234"}'
```

Alto riesgo (debe terminar `frozen`):

```bash
curl -s http://localhost:3001/v1/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount":8000,"merchant":"crypto-shop","country":"RU","cardLast4":"0000"}'
```

Copia el `id` y espera ~200ms (cola). Luego GET.

---

### `GET /v1/transactions/:id`

```bash
curl -s http://localhost:3001/v1/transactions/EL-UUID
```

**200** (después del worker, alto riesgo):

```json
{
  "id": "…",
  "amount": 8000,
  "merchant": "crypto-shop",
  "country": "RU",
  "cardLast4": "0000",
  "status": "frozen",
  "score": {
    "value": 100,
    "level": "high",
    "reasons": ["monto alto (>=5000)", "país inusual (RU)", "comercio de alto riesgo", "tarjeta en lista negra"]
  },
  "freeze": {
    "frozen": true,
    "reference": "FRZ-ABCD1234",
    "note": "Fondos congelados (banco simulado)."
  }
}
```

**Statuses:** `pending_analysis` · `clear` · `flagged` · `frozen` · `freeze_failed`

**404** si el id no existe.

```bash
curl -s http://localhost:3001/v1/transactions
```

---

### `GET /v1/events`

Bitácora de dominio (lo que un front de riesgo o un SIEM leería).

```bash
curl -s http://localhost:3001/v1/events
```

Tipos: `TransactionSubmitted` → `TransactionCleared` | `TransactionFlagged` | `FundsFrozen` | `FreezeFailed`.

---

### `GET /v1/queue`

```bash
curl -s http://localhost:3001/v1/queue
```

```json
{ "pending": 0 }
```

Si pegas muchos POST seguidos, verás `pending > 0` un instante.

---

### `GET /v1/circuit-breaker`

```bash
curl -s http://localhost:3001/v1/circuit-breaker
```

```json
{
  "state": "closed",
  "failures": 0,
  "threshold": 3,
  "cooldownMs": 8000,
  "openedAt": null
}
```

| Estado | Qué hace al congelar |
|--------|----------------------|
| `closed` | llama al banco |
| `open` | **no** llama; `CircuitOpenError` → tx `freeze_failed` |
| `half_open` | deja pasar 1 prueba; éxito → `closed`, fallo → `open` |

---

### `POST /v1/debug/bank-fail`

Para ver el breaker sin un banco real.

```bash
# tumba el banco
curl -s http://localhost:3001/v1/debug/bank-fail \
  -H "Content-Type: application/json" \
  -d '{"fail":true}'

# 3 (o más) compras HIGH → el 3er freeze abre el circuito
curl -s http://localhost:3001/v1/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount":8000,"merchant":"crypto-shop","country":"RU","cardLast4":"0000"}'

# mira el estado
curl -s http://localhost:3001/v1/circuit-breaker

# banco de vuelta
curl -s http://localhost:3001/v1/debug/bank-fail \
  -H "Content-Type: application/json" \
  -d '{"fail":false}'
```

Tras 8s en `open` pasa a `half_open`.

RAM: al reiniciar `start:dev` se vacían txs, cola, eventos y el breaker.

---

## 3. Algoritmo

### A. Checkout (`SubmitTransactionUseCase`) — sincrónico y corto

1. Crear `Transaction` `pending_analysis`
2. Guardar en repo
3. Evento `TransactionSubmitted`
4. `queue.enqueue(id)`
5. HTTP **202** (aquí termina el pago)

### B. Worker (`AnalyzeTransactionUseCase`) — asíncrono

1. Cargar tx
2. `AnomalyDetectorPort.score` (heurística)
3. `decideAction(score)` en dominio: low→clear, medium→flag, high→freeze
4. Si freeze: `FreezeFundsPort` (Circuit Breaker → banco)
5. Persistir + evento

El POST **nunca** llama al paso B.

---

## 4. Hexágono

```
DRIVING                         DOMAIN + APPLICATION                    DRIVEN
POST /v1/transactions  →  SubmitTransactionUseCase  →  Repo, Queue, EventBus
FraudWorker (cola)     →  AnalyzeTransactionUseCase →  Detector, Freeze(+CB), Repo, Events
GET /v1/transactions   →  Get/List use cases        →  Repo
```

Cola RAM → BullMQ: una línea en `app.module.ts` (`useClass`).

---

## 5. Tests

```bash
npm test
npm run test:e2e
npm run build
```

---

## 6. Relación con `iaseguro`

| `iaseguro` (:3000) | `ifraude` (:3001) |
|--------------------|-------------------|
| Front → gateway → LLM | Checkout → cola → detector → banco |
| Sanitiza PII y enruta costo | No retrasa el pago; congela si hay fraude |
| Síncrono request/response | Event-driven + Circuit Breaker |
