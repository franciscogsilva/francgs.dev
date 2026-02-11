---
title: "Integracion de APIs LLM: retries, costos y observabilidad sin sorpresas"
author: "Francisco Gonzalez"
description: "Guia practica para integrar proveedores LLM en produccion con control de reintentos, presupuesto por request y trazabilidad de extremo a extremo."
pubDate: 2026-04-28
tags: ["ai", "llm", "typescript", "observability", "cost-control"]
category: ai
translationKey: post-42
lang: es
---

Integrar un LLM en staging es facil. Integrarlo en produccion, con limites de costo y degradacion controlada, es donde se separa un experimento de una plataforma confiable.

## Caso practico guiado

Escenario: endpoint `POST /api/assistant/reply` para soporte interno. Objetivo de SLO:

- p95 menor a 2.5s,
- error rate menor a 1%,
- costo promedio por respuesta menor a 0.01 USD.

Arquitectura minima:

1. capa `LLMClient` con timeout + retries para errores transitorios,
2. budget guard por request (tokens maximos + costo maximo),
3. metricas por proveedor/modelo (`latency`, `tokens`, `usd`, `retry_count`),
4. fallback de modelo premium a modelo economico.

## Implementacion base en TypeScript

```ts
type LlmUsage = { promptTokens: number; completionTokens: number; costUsd: number };

type LlmResult = {
  text: string;
  usage: LlmUsage;
  model: string;
  requestId: string;
};

const RETRYABLE = new Set([408, 429, 500, 502, 503, 504]);

export async function callLlmWithGuard(input: {
  provider: "openai" | "anthropic";
  model: string;
  prompt: string;
  maxRetries: number;
  maxCostUsd: number;
}): Promise<LlmResult> {
  let attempt = 0;
  let lastError: unknown;

  while (attempt <= input.maxRetries) {
    try {
      const startedAt = Date.now();
      const response = await invokeProvider(input); // wrapper HTTP cliente oficial
      const latencyMs = Date.now() - startedAt;

      if (response.usage.costUsd > input.maxCostUsd) {
        throw new Error(`Budget exceeded: ${response.usage.costUsd.toFixed(4)} USD`);
      }

      metrics.observe("llm_latency_ms", latencyMs, { model: response.model });
      metrics.observe("llm_cost_usd", response.usage.costUsd, { model: response.model });
      metrics.count("llm_tokens_total", response.usage.promptTokens + response.usage.completionTokens, {
        model: response.model,
      });

      return response;
    } catch (error) {
      lastError = error;
      const status = extractHttpStatus(error);
      if (!status || !RETRYABLE.has(status) || attempt === input.maxRetries) break;

      attempt += 1;
      const backoffMs = Math.min(250 * 2 ** attempt, 2500) + Math.floor(Math.random() * 120);
      metrics.count("llm_retry_total", 1, { status: String(status), attempt: String(attempt) });
      await sleep(backoffMs);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Unknown LLM failure");
}
```

## Decisiones que evitan incidentes

- Normaliza respuestas en un contrato interno (`text`, `usage`, `requestId`) para cambiar proveedor sin romper capas superiores.
- Mide costo por request en el backend, no en dashboard manual semanal.
- Limita `max_tokens` y usa truncado por prioridad del contexto antes de pedirle al modelo que "resuma todo".
- Si hay `429` sostenido, aplica circuit breaker de 60s y usa respuesta degradada con template.

## Checklist accionable

- [ ] Definir SLO de latencia/error/costo por endpoint con LLM
- [ ] Implementar retries solo para errores transitorios (no para 4xx logicos)
- [ ] Registrar `requestId`, modelo, tokens y costo por llamada
- [ ] Configurar alertas por costo diario y por salto anomalo de p95
- [ ] Tener fallback de modelo + mensaje de degradacion controlada
