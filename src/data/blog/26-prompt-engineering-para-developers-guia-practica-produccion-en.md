---
title: "Prompt Engineering for Developers: Practical Production Guide"
author: "Francisco Gonzalez"
description: "A practical prompt engineering framework for software teams: context, constraints, evaluation, and versioning."
pubDate: 2026-02-17
tags: ["ai", "web-development", "developer-tools"]
category: ai
translationKey: post-26
lang: en
---
If you use AI every day to program, you've already seen the pattern: one day it responds perfectly and the next it returns something mediocre with the same prompt. It's not magic, it's engineering. The problem is almost never the model; The problem is that we treat prompts as loose text instead of treating them as part of the system.

This article is the pillar of the AI ​​SILO. The idea is simple: go from "pretty prompt" to **operable prompt**, measurable and versionable.

I also recommend checking the category hub to follow the complete route: [`/blog/category/ai/`](/blog/category/ai/).

## 1) System thinking: prompt = contract

A production prompt is not a casual conversation. It is a contract between:

- your product,
- your model,
- and your quality criteria.

That contract should answer 4 questions:

1. What exact task do I want to solve.
2. With what minimum context.
3. With what non-negotiable restrictions.
4. How do I validate that the output is useful?

If one of those pieces is missing, the result becomes unstable.

## 2) CARS Framework (Context, Action, Constraints, Output)

I use this scheme in teams because it is easy to review in PR:

### Context

I included relevant information on the domain, stack and objective. Not everything, just what is necessary.

Example:

```text
Estas trabajando en un backend Node.js con TypeScript y arquitectura hexagonal.
Necesitamos una estrategia de retry para llamadas a proveedor externo.
```

### Action

Define specific work as an action verb.

```text
Propone una implementacion con pseudocodigo y explica tradeoffs.
```

### Restrictions

Delimit the solution space.

```text
No usar dependencias nuevas. Respetar idempotencia. Maximo 5 reintentos.
```

### Exit

Specifies expected format to be able to test and automate.

```text
Devuelve: 1) resumen, 2) algoritmo, 3) ejemplo TypeScript, 4) checklist de riesgos.
```

## 3) Patterns that do work in real software

## Pattern A: Few-shot with edge cases

Don't just include happy examples. If you want robustness, include edge cases.

- incomplete entry
- supplier timeout
- invalid payload

This forces the model to cover scenarios that then go into production.

## Pattern B: Mandatory self-check

I asked for a short verification phase before the final answer:

```text
Antes de responder, valida si tu propuesta viola alguna restriccion.
Si viola algo, corrige y luego responde.
```

It does not eliminate errors 100%, but it significantly reduces "pretty" and dangerous outputs.

## Pattern C: Structured Output

For product flows, avoid free text when you can. Use JSON or sticky sections. It is easier to parse, compare and validate.

## 4) Classical anti-patterns

### "Do better"

Too ambiguous. Best: defines "best" criteria (latency, cost, readability, test coverage).

### Giant prompt without hierarchy

A lot of context doesn't always help. If there is no priority, the model mixes everything.

### Do not version prompts

If the prompt lives in Notion or in someone's head, there is no traceability. Prompt without versioning = bug difficult to investigate.

## 5) Versioning and governance

Treat it as code:

- save prompts in repo (`/prompts` or `/ai/contracts`),
- name per use case,
- version changes with rationale,
- adds regression tests.

Simple structure example:

```text
prompts/
  support/
    classify-ticket.v1.txt
    classify-ticket.v2.txt
  coding/
    review-pr.v1.txt
```

And in PR, always ask:

- What business problem does this version solve?
- What new risk does it introduce?
- How improvement is measured.

## 6) Evaluation: without evaluation, there is no improvement

"I liked it" is not enough. Defines a mini-battery:

- 10-20 representative real cases,
- minimum expected output,
- score by criteria (accuracy, completeness, security, format).

With that you compare v1 vs v2 of the prompt like you compare a code implementation.

## 7) Relationship with product architecture

Prompt engineering does not live in isolation. Connects with:

- retry strategies and resilience in APIs (`/blog/24-mastering-email-retry-strategies-resilience-with-exponential-backoff-and-jitter/`),
- assisted code review (`/en/blog/28-code-review-asistido-por-ia-que-si-y-que-no/`),
- tool workflows (`/en/blog/34-cursor-ai-reglas-contexto-y-workflow-productivo/`).

## Closing

The difference between “using AI” and “operating AI” is discipline. When you define contract, restrictions and evaluation, the AI ​​stops being a lottery and begins to behave as part of your architecture.

If you want to follow the technical tour of the SILO:

1. [`/en/blog/27-rag-con-typescript-desde-cero-arquitectura-minima/`](/en/blog/27-rag-con-typescript-desde-cero-arquitectura-minima/)
2. [`/en/blog/28-code-review-asistido-por-ia-que-si-y-que-no/`](/en/blog/28-code-review-asistido-por-ia-que-si-y-que-no/)
