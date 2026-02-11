---
title: "Story points sin humo: como estimar mejor en equipos senior"
author: "Francisco Gonzalez"
description: "Como usar story points con criterio en equipos senior: enfoque por riesgo, complejidad y aprendizaje para estimaciones mas utiles."
pubDate: 2026-04-25
tags: ["engineering-culture", "agile", "software-engineering"]
category: engineering-culture
translationKey: post-39
lang: es
---

Story points no miden tiempo. Miden incertidumbre, complejidad y riesgo relativo. Si el equipo los usa como "horas disfrazadas", se pierde el objetivo.

## Caso practico guiado

Historia: "Agregar retry policy al servicio de notificaciones".

Evaluacion por ejes:

- Complejidad tecnica: media
- Incertidumbre de dominio: baja
- Riesgo de integracion: alto

Comparada con historias referencia del equipo, termina en 8 puntos (no por horas, por riesgo relativo).

## Framework simple

Evalua cada historia en 3 ejes:

1. complejidad tecnica,
2. incertidumbre de dominio,
3. riesgo de integracion.

Luego asigna punto relativo comparando con historias referencia.

## Anti-patron

"Esta tarea es 3 puntos porque son 6 horas".

Eso destruye aprendizaje de velocidad real y termina sesgando planning.

## Practica recomendada

- revisar estimaciones al cierre de sprint,
- capturar causas de desvio,
- ajustar referencias base.

## Helper simple en TypeScript para workshops

```ts
type StoryScore = {
  complexity: 1 | 2 | 3;
  uncertainty: 1 | 2 | 3;
  integrationRisk: 1 | 2 | 3;
};

function suggestPoints(score: StoryScore): number {
  const total = score.complexity + score.uncertainty + score.integrationRisk;
  if (total <= 3) return 1;
  if (total <= 5) return 3;
  if (total <= 7) return 5;
  if (total <= 8) return 8;
  return 13;
}
```

No reemplaza criterio del equipo, pero ayuda a alinear discusiones.

Relacionado:

- [`/blog/20-understanding-story-points-agile-estimation/`](/blog/20-understanding-story-points-agile-estimation/)
- [`/blog/32-como-hacer-code-reviews-efectivos-sin-bloquear/`](/blog/32-como-hacer-code-reviews-efectivos-sin-bloquear/)
- [`/blog/category/engineering-culture/`](/blog/category/engineering-culture/)
