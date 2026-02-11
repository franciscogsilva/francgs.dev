---
title: "APIs idempotentes y retries sin duplicar operaciones"
author: "Francisco Gonzalez"
description: "Guia practica para disenar APIs resilientes con idempotencia, retries y control de duplicados en escenarios reales de produccion."
pubDate: 2026-04-24
tags: ["web-development", "system-design", "typescript"]
category: web-development
translationKey: post-38
lang: es
---

Cuando un cliente reintenta una solicitud por timeout, tu API debe responder sin crear efectos secundarios duplicados. Esa es la diferencia entre sistema robusto y caos transaccional.

## Patron base

Usa una `idempotency-key` por operacion y guarda estado del primer procesamiento:

- request hash,
- status,
- respuesta final.

Si llega la misma key, responde lo ya procesado.

## Caso practico guiado (TypeScript)

Escenario: endpoint de pagos. Cliente hace retry por timeout y termina cobrando 2 veces.

Implementacion minima:

```ts
type IdempotencyRecord = {
  key: string;
  requestHash: string;
  status: "processing" | "done" | "failed";
  response?: unknown;
};

const store = new Map<string, IdempotencyRecord>();

export async function chargePayment(input: { key: string; payload: unknown }) {
  const existing = store.get(input.key);

  if (existing?.status === "done") {
    return existing.response;
  }

  if (existing?.status === "processing") {
    throw new Error("Request still processing, retry later");
  }

  store.set(input.key, {
    key: input.key,
    requestHash: JSON.stringify(input.payload),
    status: "processing",
  });

  try {
    const result = await gatewayCharge(input.payload);
    store.set(input.key, {
      key: input.key,
      requestHash: JSON.stringify(input.payload),
      status: "done",
      response: result,
    });
    return result;
  } catch (error) {
    store.set(input.key, {
      key: input.key,
      requestHash: JSON.stringify(input.payload),
      status: "failed",
    });
    throw error;
  }
}
```

En produccion ese store debe ir a Redis/DB con TTL.

## Errores frecuentes

- no persistir key por tiempo suficiente,
- tratar idempotencia solo en frontend,
- no contemplar fallos parciales.
- no validar que la misma key venga con el mismo payload.

## Checklist

- [ ] idempotency-key obligatoria en endpoints criticos
- [ ] storage de idempotencia con TTL claro
- [ ] retries con backoff + jitter
- [ ] observabilidad por key

Relacionado:

- [`/blog/24-mastering-email-retry-strategies-resilience-with-exponential-backoff-and-jitter/`](/blog/24-mastering-email-retry-strategies-resilience-with-exponential-backoff-and-jitter/)
- [`/blog/31-typescript-avanzado-patrones-reales-y-tradeoffs/`](/blog/31-typescript-avanzado-patrones-reales-y-tradeoffs/)
- [`/blog/category/web-development/`](/blog/category/web-development/)
