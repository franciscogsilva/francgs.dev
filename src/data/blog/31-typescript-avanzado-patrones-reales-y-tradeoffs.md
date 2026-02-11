---
title: "TypeScript avanzado en proyectos reales: patrones y tradeoffs"
author: "Francisco Gonzalez"
description: "Patrones avanzados de TypeScript aplicados a proyectos reales: tipos utilitarios, contratos, errores comunes y decisiones con criterio."
pubDate: 2026-03-24
tags: ["typescript", "web-development", "system-design"]
category: web-development
translationKey: post-31
lang: es
---

TypeScript no se trata de "tipar todo"; se trata de modelar mejor el dominio sin volver el código inmantenible.

## 1) Diseña tipos desde casos de uso, no desde archivos

Cuando el tipo nace desde infraestructura, termina contaminando todo el dominio. Mejor:

- define contratos en la capa de aplicacion,
- adapta a frameworks en bordes.

## 2) Patrones que valen la pena

## Discriminated unions para flujos de estado

```ts
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
```

## Branded types para IDs criticos

```ts
type UserId = string & { readonly brand: "UserId" };
```

Evitas mezclar IDs semanticamente distintos por accidente.

## Utility types con criterio

`Pick`, `Omit`, `Partial` ayudan, pero no reemplazan modelado explicito cuando el caso es complejo.

## 3) Errores comunes

- usar `any` para "salir rapido",
- sobre-ingenieria de genéricos,
- tipos gigantes dificiles de leer,
- no tipar errores ni boundaries de IO.

## 4) Decision practica

Preguntate siempre:

1. Este tipo mejora decisiones en runtime?
2. Reduce bugs de negocio o solo "se ve elegante"?
3. Lo entiende otro developer en 2 minutos?
