---
title: "Email resiliente: backoff, jitter y observabilidad en pipelines reales"
author: "Francisco Gonzalez"
description: "Disena un sistema de envio de correo robusto con retries inteligentes, idempotencia y metricas accionables para evitar duplicados y caidas silenciosas."
pubDate: 2026-05-01
tags: ["web-development", "email", "resilience", "typescript", "observability"]
category: web-development
translationKey: post-45
lang: es
---

Enviar email en produccion no es solo llamar un SDK. El problema real aparece con timeouts, respuestas 429/5xx y workers que reintentan sin control hasta duplicar notificaciones.

## Caso practico guiado

Escenario: pipeline de emails transaccionales (`receipt`, `password-reset`). Requisito:

- entrega eventual con maximo 5 intentos,
- cero duplicados por `messageId`,
- alertas si falla mas de 2% por 10 minutos.

## Implementacion TypeScript

```ts
type Job = {
  messageId: string;
  to: string;
  template: "receipt" | "password-reset";
  payload: Record<string, string>;
  attempt: number;
};

const MAX_ATTEMPTS = 5;

function retryDelayMs(attempt: number): number {
  const base = Math.min(500 * 2 ** attempt, 30_000);
  const jitter = Math.floor(Math.random() * 600);
  return base + jitter;
}

export async function processEmail(job: Job) {
  if (await sentStore.exists(job.messageId)) {
    metrics.count("email_duplicate_prevented_total", 1);
    return;
  }

  try {
    await provider.send(job.to, job.template, job.payload, {
      idempotencyKey: job.messageId,
    });
    await sentStore.mark(job.messageId);
    metrics.count("email_sent_total", 1, { template: job.template });
  } catch (error) {
    const status = extractHttpStatus(error);
    const retryable = status !== null && [408, 429, 500, 502, 503, 504].includes(status);

    if (retryable && job.attempt < MAX_ATTEMPTS) {
      await queue.enqueue(job, { delayMs: retryDelayMs(job.attempt + 1), attempt: job.attempt + 1 });
      metrics.count("email_retry_total", 1, { status: String(status) });
      return;
    }

    metrics.count("email_failed_total", 1, { status: String(status ?? "unknown") });
    throw error;
  }
}
```

## Observabilidad minima obligatoria

- Tasa de entrega por plantilla y por proveedor.
- Latencia p95 de API de correo.
- Conteo de retries y agotamiento de reintentos.
- Cola acumulada y tiempo promedio en cola.

## Checklist accionable

- [ ] Idempotencia por `messageId` en app y proveedor
- [ ] Retries con exponential backoff + jitter
- [ ] Dead-letter queue para fallos terminales
- [ ] Dashboard con `sent`, `retry`, `failed`, `queue_lag`
- [ ] Alertas sobre error rate y crecimiento de cola
