---
title: "LLM API Integration: Retries, Cost Controls, and Observability"
author: "Francisco Gonzalez"
description: "A production guide to integrate LLM providers with retry safety, per-request budget guards, and end-to-end observability."
pubDate: 2026-04-28
tags: ["ai", "llm", "typescript", "observability", "cost-control"]
category: ai
translationKey: post-42
lang: en
---

Integrating an LLM into staging is easy. Integrating it into production, with cost limits and controlled degradation, is where an experiment is separated from a reliable platform.

## Guided practical case

Scenario: endpoint `POST /api/assistant/reply` for internal support. SLO Objective:

- p95 less than 2.5s,
- error rate less than 1%,
- average cost per response less than 0.01 USD.

Minimum architecture:

1. `LLMClient` layer with timeout + retries for transient errors,
2. budget guard per request (maximum tokens + maximum cost),
3. metrics by supplier/model (`latency`, `tokens`, `usd`, `retry_count`),
4. fallback from premium model to economical model.

## Base implementation in TypeScript

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

## Decisions that avoid incidents

- Normalize responses in an internal contract (`text`, `usage`, `requestId`) to change provider without breaking upper layers.
- Measure cost per request in the backend, not in a weekly manual dashboard.
- Limit `max_tokens` and use truncation by context priority before asking the model to "sum up everything".
- If there is `429` sustained, apply circuit breaker of 60s and use degraded response with template.

## Actionable checklist

- [ ] Define latency/error/cost SLO per endpoint with LLM
- [ ] Implement retries only for transient errors (not for logical 4xx)
- [ ] Register `requestId`, model, tokens and cost per call
- [ ] Configure alerts for daily cost and abnormal jump of p95
- [ ] Have model fallback + controlled degradation message
