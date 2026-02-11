---
title: "Resilient Email Delivery: Backoff, Jitter, and Observability"
author: "Francisco Gonzalez"
description: "Build a robust email delivery pipeline with safe retries, idempotency, and practical observability to prevent silent failures and duplicates."
pubDate: 2026-05-01
tags: ["web-development", "email", "resilience", "typescript", "observability"]
category: web-development
translationKey: post-45
lang: en
---

Sending email in production is not just calling an SDK. The real problem appears with timeouts, 429/5xx responses and workers that retry uncontrollably until they duplicate notifications.

## Guided practical case

Scenario: pipeline of transactional emails (`receipt`, `password-reset`). Requirement:

- eventual delivery with a maximum of 5 attempts,
- zero duplicates for `messageId`,
- alerts if it fails more than 2% for 10 minutes.

## TypeScript implementation

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

## Mandatory minimum observability

- Delivery rate per staff and per supplier.
- Mail API p95 latency.
- Retry count and retry exhaustion.
- Accumulated queue and average time in queue.

## Actionable checklist

- [ ] Idempotency by `messageId` in app and provider
- [ ] Retries with exponential backoff + jitter
- [ ] Dead-letter queue for terminal failures
- [ ] Dashboard with `sent`, `retry`, `failed`, `queue_lag`
- [ ] Alerts about error rate and queue growth
