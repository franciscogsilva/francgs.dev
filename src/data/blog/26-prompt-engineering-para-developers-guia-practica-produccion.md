---
title: "Prompt Engineering para Developers: guia practica de produccion"
author: "Francisco Gonzalez"
description: "Aprende un framework practico de prompt engineering para equipos de software: contexto, restricciones, evaluacion y versionado para resultados consistentes en produccion."
pubDate: 2026-02-17
tags: ["ai", "web-development", "developer-tools"]
category: ai
translationKey: post-26
lang: es
---

Si usas IA todos los dias para programar, ya viste el patron: un dia responde perfecto y al siguiente devuelve algo mediocre con el mismo prompt. No es magia, es ingenieria. El problema casi nunca es el modelo; el problema es que tratamos prompts como texto suelto en vez de tratarlos como parte del sistema.

Este articulo es el pilar del SILO de AI. La idea es simple: pasar de "prompt bonito" a **prompt operable**, medible y versionable.

Tambien te recomiendo revisar el hub de categoria para seguir la ruta completa: [`/blog/category/ai/`](/blog/category/ai/).

## 1) Pensamiento de sistema: prompt = contrato

Un prompt en produccion no es una conversacion casual. Es un contrato entre:

- tu producto,
- tu modelo,
- y tu criterio de calidad.

Ese contrato deberia responder 4 preguntas:

1. Que tarea exacta quiero resolver.
2. Con que contexto minimo.
3. Con que restricciones no negociables.
4. Como valido que la salida es util.

Si una de esas piezas falta, el resultado se vuelve inestable.

## 2) Framework CARS (Contexto, Accion, Restricciones, Salida)

Uso este esquema en equipos porque es facil de revisar en PR:

### Contexto

Inclui informacion relevante del dominio, stack y objetivo. No todo, solo lo necesario.

Ejemplo:

```text
Estas trabajando en un backend Node.js con TypeScript y arquitectura hexagonal.
Necesitamos una estrategia de retry para llamadas a proveedor externo.
```

### Accion

Defini el trabajo puntual en verbo de accion.

```text
Propone una implementacion con pseudocodigo y explica tradeoffs.
```

### Restricciones

Acota el espacio de soluciones.

```text
No usar dependencias nuevas. Respetar idempotencia. Maximo 5 reintentos.
```

### Salida

Especifica formato esperado para poder testear y automatizar.

```text
Devuelve: 1) resumen, 2) algoritmo, 3) ejemplo TypeScript, 4) checklist de riesgos.
```

## 3) Patrones que si funcionan en software real

## Pattern A: Few-shot con casos borde

No metas solo ejemplos felices. Si queres robustez, incluye edge cases.

- entrada incompleta
- timeout de proveedor
- payload invalido

Eso obliga al modelo a cubrir escenarios que luego pegan en produccion.

## Pattern B: Self-check obligatorio

Pedi una fase corta de verificacion antes de la respuesta final:

```text
Antes de responder, valida si tu propuesta viola alguna restriccion.
Si viola algo, corrige y luego responde.
```

No elimina errores al 100%, pero reduce bastante salidas "lindas" y peligrosas.

## Pattern C: Output estructurado

Para flujos de producto, evita texto libre cuando puedas. Usa JSON o secciones fijas. Es mas facil de parsear, comparar y validar.

## 4) Anti-patrones clasicos

### "Hazlo mejor"

Demasiado ambiguo. Mejor: define criterio de "mejor" (latencia, costo, legibilidad, cobertura de test).

### Prompt gigante sin jerarquia

Mucho contexto no siempre ayuda. Si no hay prioridad, el modelo mezcla todo.

### No versionar prompts

Si el prompt vive en Notion o en la cabeza de alguien, no hay trazabilidad. Prompt sin versionado = bug dificil de investigar.

## 5) Versionado y gobernanza

Tratalo como codigo:

- guarda prompts en repo (`/prompts` o `/ai/contracts`),
- nombra por caso de uso,
- versiona cambios con rationale,
- agrega tests de regresion.

Ejemplo simple de estructura:

```text
prompts/
  support/
    classify-ticket.v1.txt
    classify-ticket.v2.txt
  coding/
    review-pr.v1.txt
```

Y en PR, pregunta siempre:

- Que problema de negocio resuelve esta version.
- Que riesgo nuevo introduce.
- Como se mide mejora.

## 6) Evaluacion: sin evaluacion, no hay mejora

No alcanza con "a mi me gusto". Define una mini-bateria:

- 10-20 casos reales representativos,
- expected output minimo,
- score por criterio (exactitud, completitud, seguridad, formato).

Con eso comparas v1 vs v2 del prompt como comparas una implementacion de codigo.

## 7) Relacion con arquitectura de producto

Prompt engineering no vive aislado. Se conecta con:

- retry strategies y resiliencia en APIs (`/blog/24-mastering-email-retry-strategies-resilience-with-exponential-backoff-and-jitter/`),
- code review asistido (`/blog/28-code-review-asistido-por-ia-que-si-y-que-no/`),
- workflows de herramientas (`/blog/34-cursor-ai-reglas-contexto-y-workflow-productivo/`).

## Cierre

La diferencia entre "usar IA" y "operar IA" es disciplina. Cuando defines contrato, restricciones y evaluacion, la IA deja de ser loteria y empieza a comportarse como parte de tu arquitectura.

Si queres seguir el recorrido tecnico del SILO:

1. [`/blog/27-rag-con-typescript-desde-cero-arquitectura-minima/`](/blog/27-rag-con-typescript-desde-cero-arquitectura-minima/)
2. [`/blog/28-code-review-asistido-por-ia-que-si-y-que-no/`](/blog/28-code-review-asistido-por-ia-que-si-y-que-no/)
