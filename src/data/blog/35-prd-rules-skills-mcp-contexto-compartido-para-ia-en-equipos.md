---
title: "PRD + RULES + SKILLS + MCP: contexto compartido para que la IA sirva de verdad"
author: "Francisco Gonzalez"
description: "Estrategia practica para equipos que usan LLMs con sesiones que se reinician: PRD compartido, RULES versionables, SKILLS por rol y MCP para un flujo robusto."
pubDate: 2026-02-02
tags: ["ai", "developer-tools", "software-engineering"]
category: ai
translationKey: post-35
lang: es
---

Los LLMs son buenos, pero tienen una limitacion estructural: el contexto local se pierde entre sesiones y las ventanas de tokens pueden cambiar. Resultado: respuestas inconsistentes, decisiones repetidas y mucho "volver a explicarle todo".

Si queres que la IA sea util en equipo (no solo para demos), necesitás una estrategia unificada de contexto compartido.

## TL;DR

Para que la IA sea consistente aunque se reinicie la sesion:

1. **PRD**: fuente unica del negocio (que y por que).
2. **RULES**: estandares operativos (como).
3. **SKILLS**: plantillas por rol versionadas.
4. **MCP**: capa de contexto/herramientas para evitar prompts improvisados.

## El problema real: memoria fragil de sesion

En el dia a dia pasa esto:

- una sesion nueva no recuerda acuerdos previos,
- un reset elimina contexto clave,
- distintos miembros del equipo obtienen respuestas distintas para la misma tarea.

No es un problema de prompts aislados. Es un problema de arquitectura de contexto.

## Caso real: el mismo bug, tres respuestas distintas

Situacion comun en equipo:

- Dev A pregunta por retry policy -> recibe 5 intentos y backoff lineal.
- Dev B pregunta lo mismo otro dia -> recibe 3 intentos y backoff exponencial.
- Dev C abre PR con mezcla de ambos.

Resultado: inconsistencias en produccion y review eterno.

La causa no es "modelo malo"; es contexto no compartido.

## La estrategia: PRD + RULES + SKILLS

## 1) PRD: la logica de negocio compartida

Un solo documento vivo para responder siempre:

- que estamos construyendo,
- por que importa,
- que restricciones de negocio no se negocian.

El PRD es la fuente del "que" y del "por que" cuando la sesion se resetea.

Estructura minima del PRD (versionable):

```md
# Product PRD

## Problema
## Objetivo
## Flujos criticos
## Restricciones de negocio
## Criterios de aceptacion
## No objetivos
```

## 2) RULES: los estandares operativos

Las RULES definen el "como". Aca bajas a tierra lo que el agente debe respetar:

- estilo de comentarios (por ejemplo Docfav),
- formato de commits (Conventional Commits),
- flujo de git y politicas de PR,
- guardrails de seguridad y testing.

Sin RULES explicitas, cada salida del modelo puede sonar "bien" pero desviarse del estandar del equipo.

Ejemplo de RULES util para backend TS:

```md
- Siempre usar Result<T> en casos de uso.
- Nunca usar any en codigo de dominio.
- Commits en formato Conventional Commits.
- Los retries deben usar backoff exponencial + jitter.
- Todo cambio debe incluir al menos un test de camino feliz y uno de error.
```

## 3) SKILLS: plantillas versionables por rol

Este punto es de lo mas potente hoy. Las SKILLS son plantillas predefinidas que configuran al LLM con una estructura de trabajo clara por rol.

Ejemplos:

- `ai-engineer.skill`
- `backend-reviewer.skill`
- `incident-responder.skill`

Cada skill define:

- objetivo,
- input esperado,
- pasos logicos,
- formato de salida,
- checklist de validacion.

Es como pasar de "prompt suelto" a "protocolo reusable".

Ejemplo de SKILL (fragmento):

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

## Donde entra MCP (Model Context Protocol)

MCP te ayuda a estandarizar como el modelo consume contexto y herramientas. En lugar de inyectar todo manualmente en cada sesion, expones fuentes y operaciones de forma mas consistente.

Combinado con PRD + RULES + SKILLS, logra tres cosas:

1. Menos friccion al iniciar tareas.
2. Menos variabilidad entre miembros del equipo.
3. Mejor trazabilidad de decisiones del agente.

## Implementacion practica en TypeScript

La idea es construir un "context bundle" unico por tarea.

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

Con MCP, en vez de cargar todo manual, el agente consulta esas fuentes como contexto estructurado.

## Arquitectura minima recomendada

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

Y en cada skill, versionado en git igual que código.

## Impacto en equipo (development + uso cotidiano)

## Para development

- PRs mas consistentes,
- menos retrabajo por respuestas ambiguas,
- onboarding mas rapido para nuevos devs.

## Para uso cotidiano (mortales)

La misma idea aplica en trabajo diario fuera de código:

- plantillas para redactar correos profesionales,
- skills para planificar semana y prioridades,
- rules para tono de comunicación y estructura de respuestas.

No necesitás ser "AI Engineer" para beneficiarte. Necesitás estructura.

Ejemplos para uso cotidiano:

- `skill-email-pro.md`: redactar correos claros con tono definido.
- `skill-plan-semanal.md`: priorizar tareas por impacto y urgencia.
- `skill-resumen-reunion.md`: transformar notas largas en decisiones accionables.

## Implementacion en 7 dias (sin sobreingenieria)

1. Dia 1-2: consolidar PRD unico.
2. Dia 3: definir RULES minimas del equipo.
3. Dia 4-5: crear 2 SKILLS (dev + review).
4. Dia 6: conectar fuentes de contexto (MCP o equivalente).
5. Dia 7: retro y ajuste con casos reales.

KPI para saber si mejoraste:

- tiempo medio de resolucion por tarea,
- retrabajo por PR,
- desviaciones de estandar detectadas en review,
- consistencia de respuestas entre miembros del equipo.

## Cierre

El truco no es pedirle "mas inteligencia" al modelo. El truco es darle un sistema estable de contexto compartido.

Si queres, en próximos posts te puedo mostrar:

- como versionar SKILLS por entorno,
- como medir calidad de salida por skill,
- y como integrar esto con CI/CD para evitar regresiones en prompts.

Relacionado:

- [`/blog/26-prompt-engineering-para-developers-guia-practica-produccion/`](/blog/26-prompt-engineering-para-developers-guia-practica-produccion/)
- [`/blog/27-rag-con-typescript-desde-cero-arquitectura-minima/`](/blog/27-rag-con-typescript-desde-cero-arquitectura-minima/)
- [`/blog/category/ai/`](/blog/category/ai/)
