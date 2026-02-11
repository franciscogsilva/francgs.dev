---
title: "AI-Assisted Code Reviews: What to Use and What to Avoid"
author: "Francisco Gonzalez"
description: "How to use AI during code reviews without lowering technical quality: workflow, guardrails, and limits."
pubDate: 2026-03-03
tags: ["ai", "engineering-culture", "software-engineering"]
category: ai
translationKey: post-28
lang: en
---
AI in PRs can save you time or destroy your technical judgment. It depends on the process, not the hype.

The most common mistake is to use it as the "main reviewer." No: AI is an **inspection co-pilot**, not a replacement for business context.

If you haven't read the AI ​​pillar, you should start here: [`/en/blog/26-prompt-engineering-para-developers-guia-practica-produccion/`](/en/blog/26-prompt-engineering-para-developers-guia-practica-produccion/).

## 1) Where AI brings real value in review

- detect repetitive smells,
- find naming inconsistencies,
- warn of risks of null/edge cases,
- propose missing tests,
- summarize long PRs to speed up reviewer onboarding.

## 2) Where you should NOT delegate

- architectural decisions,
- domain tradeoffs,
- impact on costs or safety,
- business rules not explicit in code.

If you delegate it there, you get false confidence.

## 3) Recommended flow (4 stages)

## Stage A: author does pre-review with AI

Before opening PR, the author runs an assisted review and fixes the basics.

## Stage B: PR with clear human context

Includes objective, scope, risks and rollback plan.

## Stage C: human reviewer evaluates with criteria

The reviewer uses AI to explore alternatives or edge cases, not to "automatically approve."

## Stage D: final checklist

Validate that the changes do not break:

- observability,
- error handling,
- resilience,
- security,
- maintainability.

## 4) Base prompt for author pre-review

```text
Actua como senior reviewer de backend.
Analiza este diff y responde en este formato:
1) Riesgos funcionales
2) Riesgos de rendimiento
3) Riesgos de seguridad
4) Test faltantes
5) Cambios concretos recomendados

No inventes contexto que no esta en el diff.
Si falta informacion, dilo explicitamente.
```

## 5) Equipment Guardrails

Define explicit rules to avoid degrading quality:

1. No PR is approved only by AI output.
2. All critical AI comments must be validated by humans.
3. If there is a conflict of AI vs architecture criteria, documented architecture wins.
4. Every review prompt is versioned in repo.

## 6) Metrics to know if it works

Don't stop at "it feels faster." Measures:

- average review time,
- number of re-works per PR,
- post-release bugs,
- Test coverage in critical changes.

If time goes down but bugs increase, the adoption is poorly done.

## 7) Integration with technical culture

AI improves equipment that already has standards. If there are no review criteria, it only accelerates chaos.

That's why this topic links directly to:

- [`/en/blog/32-como-hacer-code-reviews-efectivos-sin-bloquear/`](/en/blog/32-como-hacer-code-reviews-efectivos-sin-bloquear/)
- [`/blog/category/engineering-culture/`](/blog/category/engineering-culture/)

## Closing

Use AI to increase clarity and coverage, not to delegate technical thinking. In senior teams, the right speed is the one that maintains quality, not the one that only closes tickets.

Next step of SILO AI:

- Hub: [`/blog/category/ai/`](/blog/category/ai/)
- Workflow with tools: [`/en/blog/34-cursor-ai-reglas-contexto-y-workflow-productivo/`](/en/blog/34-cursor-ai-reglas-contexto-y-workflow-productivo/)
