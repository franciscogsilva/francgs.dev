---
title: "Idempotent APIs and Retries Without Duplicate Operations"
author: "Francisco Gonzalez"
description: "Practical guide to design resilient APIs with idempotency keys, retries, and duplicate protection."
pubDate: 2026-04-24
tags: ["web-development", "system-design", "typescript"]
category: web-development
translationKey: post-38
lang: en
---
When a client retries a timeout request, your API should respond without creating duplicate side effects. That is the difference between a robust system and transactional chaos.

## Base pattern

Use one `idempotency-key` per operation and save state of the first processing:

- request hash,
- status,
- final answer.

If the same key arrives, it responds to what has already been processed.

## Guided practical case (TypeScript)

Scenario: payments endpoint. Client makes a retry due to timeout and ends up charging twice.

Minimum implementation:

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

In production, that store must go to Redis/DB with TTL.

## Common errors

- not persisting key long enough,
- treat idempotence only in frontend,
- do not contemplate partial failures.
- do not validate that the same key comes with the same payload.

## Checklist

- [ ] mandatory idempotency-key on critical endpoints
- [ ] idempotency storage with clear TTL
- [ ] retries with backoff + jitter
- [ ] observability by key

Related:

- [`/blog/24-mastering-email-retry-strategies-resilience-with-exponential-backoff-and-jitter/`](/blog/24-mastering-email-retry-strategies-resilience-with-exponential-backoff-and-jitter/)
- [`/en/blog/31-typescript-avanzado-patrones-reales-y-tradeoffs/`](/en/blog/31-typescript-avanzado-patrones-reales-y-tradeoffs/)
- [`/blog/category/web-development/`](/blog/category/web-development/)
