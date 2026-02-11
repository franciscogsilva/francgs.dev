---
title: "PRD + RULES + SKILLS + MCP: Shared Context that Makes AI Actually Useful"
author: "Francisco Gonzalez"
description: "Practical strategy for LLM-enabled teams: shared PRDs, versioned rules, role-based skills, and MCP integration."
pubDate: 2026-02-01
tags: ["ai", "developer-tools", "software-engineering"]
category: ai
translationKey: post-35
lang: en
---
LLMs are good, but they have a structural limitation: local context is lost between sessions and token windows can change. Result: inconsistent responses, repeated decisions, and a lot of "re-explaining."

If you want AI to be useful in a team (not just for demos), you need a unified shared context strategy.

## TL;DR

To make the AI ​​consistent even if the session is restarted:

1. **PRD**: single source of the business (what and why).
2. **RULES**: operating standards (like).
3. **SKILLS**: versioned role templates.
4. **MCP**: context/tools layer to avoid improvised prompts.

## The real problem: fragile session memory

On a day to day basis this happens:

- a new session does not remember previous agreements,
- a reset removes key context,
- different team members get different answers for the same task.

It is not a problem of isolated prompts. It is a context architecture problem.

## Real case: the same bug, three different answers

Common team situation:

- Dev A asks for retry policy -> receives 5 attempts and linear backoff.
- Dev B asks the same thing another day -> receives 3 attempts and exponential backoff.
- Dev C opens PR with a mix of both.

Result: inconsistencies in production and eternal review.

The cause is not "bad model"; It is unshared context.

## The strategy: PRD + RULES + SKILLS

## 1) PRD: the shared business logic

A single living document to always respond:

- that we are building,
- why does it matter,
- that business restrictions are not negotiated.

The PRD is the source of the "what" and "why" when the session is reset.

Minimum structure of the PRD (versionable):

```md
# Product PRD

## Problema
## Objetivo
## Flujos criticos
## Restricciones de negocio
## Criterios de aceptacion
## No objetivos
```

## 2) RULES: the operating standards

The RULES define the "how". Here you go down to earth what the agent must respect:

- comment style (e.g. Docfav),
- commit format (Conventional Commits),
- git flow and PR policies,
- safety and testing guardrails.

Without explicit RULES, each output of the model can sound "good" but deviate from the team's standard.

Example of useful RULES for TS backend:

```md
- Siempre usar Result<T> en casos de uso.
- Nunca usar any en codigo de dominio.
- Commits en formato Conventional Commits.
- Los retries deben usar backoff exponencial + jitter.
- Todo cambio debe incluir al menos un test de camino feliz y uno de error.
```

## 3) SKILLS: versionable templates by role

This point is the most powerful today. SKILLS are predefined templates that configure the LLM with a clear work structure by role.

Examples:

- `ai-engineer.skill`
- `backend-reviewer.skill`
- `incident-responder.skill`

Each skill defines:

- target,
- expected input,
- logical steps,
- output format,
- validation checklist.

It's like going from "loose prompt" to "reusable protocol".

SKILL example (fragment):

```md
# skill: backend-reviewer

## Rol
Senior reviewer de backend TypeScript.

## Proceso
1. Detectar riesgos funcionales.
2. Detectar riesgos de concurrencia/idempotencia.
3. Verificar seguridad y observabilidad.
4. Proponer cambios concretos por prioridad.

## Salida
- Riesgos criticos
- Riesgos medios
- Cambios sugeridos
- Test faltantes
```

## Where MCP (Model Context Protocol) comes in

MCP helps you standardize how the model consumes context and tools. Instead of manually injecting everything into each session, you expose sources and operations more consistently.

Combined with PRD + RULES + SKILLS, it accomplishes three things:

1. Less friction when starting tasks.
2. Less variability between team members.
3. Better traceability of agent decisions.

## Practical implementation in TypeScript

The idea is to build a unique "context bundle" per task.

```ts
type ContextBundle = {
  prd: string;
  rules: string[];
  skill: string;
  task: string;
};

async function buildContextBundle(task: string, skillName: string): Promise<ContextBundle> {
  const prd = await loadFile("ai-context/prd/product-prd.md");
  const rulesText = await loadFile("ai-context/rules/coding-rules.md");
  const skill = await loadFile(`ai-context/skills/${skillName}.skill.md`);

  return {
    prd,
    rules: rulesText.split("\n").filter((line) => line.trim().startsWith("-")),
    skill,
    task,
  };
}

function buildPrompt(bundle: ContextBundle): string {
  return [
    "# PRD",
    bundle.prd,
    "# RULES",
    bundle.rules.join("\n"),
    "# SKILL",
    bundle.skill,
    "# TASK",
    bundle.task,
  ].join("\n\n");
}
```

With MCP, instead of loading everything manually, the agent consults those sources as structured context.

## Minimum recommended architecture

```text
/ai-context
  /prd
    product-prd.md
  /rules
    coding-rules.md
    git-rules.md
    review-rules.md
  /skills
    ai-engineer.skill.md
    reviewer.skill.md
    bugfix.skill.md
```

And in each skill, versioned in git just like code.

## Team impact (development + everyday use)

## For development

- More consistent PRs,
- less rework for ambiguous answers,
- faster onboarding for new devs.

## For everyday use (mortals)

The same idea applies in daily work outside of code:

- templates for writing professional emails,
- skills to plan week and priorities,
- rules for communication tone and response structure.

You don't need to be an "AI Engineer" to benefit. You need structure.

Examples for everyday use:

- `skill-email-pro.md`: write clear emails with a defined tone.
- `skill-plan-semanal.md`: prioritize tasks by impact and urgency.
- `skill-resumen-reunion.md`: transform long notes into actionable decisions.

## Implementation in 7 days (without over-engineering)

1. Day 1-2: consolidate single PRD.
2. Day 3: define minimum team RULES.
3. Day 4-5: create 2 SKILLS (dev + review).
4. Day 6: connect context sources (MCP or equivalent).
5. Day 7: retro and adjustment with real cases.

KPI to know if you improved:

- average resolution time per task,
- rework by PR,
- standard deviations detected in review,
- consistency of responses between team members.

## Closing

The trick is not to ask for "more intelligence" from the model. The trick is to give it a stable shared context system.

If you want, in future posts I can show you:

- how to version SKILLS by environment,
- how to measure output quality by skill,
- and how to integrate this with CI/CD to avoid regressions in prompts.

Related:

- [`/en/blog/26-prompt-engineering-para-developers-guia-practica-produccion/`](/en/blog/26-prompt-engineering-para-developers-guia-practica-produccion/)
- [`/en/blog/27-rag-con-typescript-desde-cero-arquitectura-minima/`](/en/blog/27-rag-con-typescript-desde-cero-arquitectura-minima/)
- [`/blog/category/ai/`](/blog/category/ai/)
