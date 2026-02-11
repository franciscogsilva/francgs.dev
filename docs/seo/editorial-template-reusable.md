# Editorial Template Reusable (SILO SEO + Sustancia)

> Plantilla para crear articulos que posicionen en Google y aporten valor real (con caso guiado y ejemplos practicos, idealmente en TypeScript cuando aplica).

## Objetivo editorial

Cada articulo debe cumplir 3 cosas al mismo tiempo:

1. Responder una intencion de busqueda real.
2. Resolver un problema practico con pasos aplicables.
3. Fortalecer la arquitectura SILO con interlinking claro.

## Frontmatter base

```yaml
---
title: "<keyword principal + beneficio claro>"
author: "Francisco Gonzalez"
description: "<140-160 chars con problema + resultado>"
pubDate: YYYY-MM-DD
tags: ["tag-1", "tag-2", "tag-3"]
category: <ai|devops|engineering-culture|git|linux|tools|web-development>
lang: <es|en>
translationKey: <opcional, recomendado para pares ES/EN>
---
```

## Estructura obligatoria (human-first)

## 1) Intro orientada a problema (3-6 parrafos)

Debe incluir:

- dolor real (situacion concreta),
- por que duele (impacto tecnico/negocio),
- promesa de resultado (que se lleva el lector).

Evitar:

- intros genericas,
- historia larga sin accion.

## 2) Marco mental

Explicar:

- que es,
- cuando usar,
- cuando no usar,
- tradeoff principal.

## 3) Caso practico guiado (obligatorio)

Esta es la parte que da sustancia. Debe traer:

- contexto del caso,
- decision tecnica,
- implementacion paso a paso,
- resultado esperado,
- errores frecuentes.

Si aplica a codigo, incluir **TypeScript**.

## 4) Implementacion tecnica con snippets

Checklist:

- snippets legibles,
- comentario de por que se toma cada decision,
- no solo "codigo final", tambien razonamiento.

## 5) Errores comunes y como evitarlo

Minimo 3 anti-patrones con correccion concreta.

## 6) Integracion en equipo/producto

Conectar con flujo real:

- CI/CD,
- code review,
- observabilidad,
- mantenimiento.

## 7) Cierre + CTA util

- resumen corto,
- siguiente accion (checklist o experimento),
- lecturas relacionadas del mismo SILO.

## Interlinking SILO obligatorio

En cada articulo:

1. Link al hub de categoria (`/blog/category/<category>/`)
2. Link al pillar del SILO
3. 1-2 links a clusters del mismo SILO
4. (Opcional) 1 cross-SILO justificado

## SEO checklist

- [ ] title con keyword principal y beneficio
- [ ] description concreta (sin frases vacias)
- [ ] H1 unico
- [ ] 3 o mas H2 utiles
- [ ] URL estable y clara
- [ ] contenido escaneable (listas/tablas/checklists)
- [ ] canonical correcto
- [ ] enlazado interno SILO

## Quality checklist (sustancia)

- [ ] Hay al menos 1 caso guiado completo
- [ ] Hay al menos 1 snippet aplicable
- [ ] Si aplica, hay ejemplo en TypeScript
- [ ] Se explican tradeoffs (no solo receta)
- [ ] Se aclara cuando NO usar el enfoque

## Plantilla larga (copiar/pegar)

```md
## Introduccion
<problema real>
<impacto>
<que vas a resolver en este post>

## Marco mental: <concepto>
<definicion>
<cuando si>
<cuando no>
<tradeoff principal>

## Caso practico guiado: <escenario>
### Contexto
### Objetivo
### Restricciones
### Implementacion paso a paso
### Resultado esperado

## Implementacion tecnica
```ts
// snippet principal en TypeScript (si aplica)
```

## Errores comunes
- Error 1 + correccion
- Error 2 + correccion
- Error 3 + correccion

## Integracion en equipos
<como aterrizar en PR/CI/operacion>

## Cierre
<resumen>
<proxima accion>

Relacionado:
- <hub SILO>
- <pillar>
- <cluster 1>
- <cluster 2>
```

## Mini template para temas no-code (cuando no aplica TS)

Si el tema es cultura/proceso/herramientas y no aplica TypeScript, reemplazar el snippet por:

- checklist operativo,
- tabla de decision,
- playbook paso a paso.

La regla es la misma: que el lector pueda aplicar hoy, no "inspirarse" nomas.
