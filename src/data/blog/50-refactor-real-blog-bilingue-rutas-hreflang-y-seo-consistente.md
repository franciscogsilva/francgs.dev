---
title: "Refactor real de un blog bilingue: rutas, hreflang y SEO consistente"
author: "Francisco Gonzalez"
description: "Post tecnico sobre el refactor de un blog bilingue con Astro: rutas por idioma, redirecciones, hreflang, canonicals y navegacion consistente sin duplicados."
pubDate: 2026-05-06
tags: ["web-development", "seo", "astro", "typescript"]
category: web-development
translationKey: post-50
lang: es
---

Hacer un blog bilingue no es solo traducir texto. Si no diseñas bien rutas, canonical y navegación, terminas con contenido duplicado, indexación confusa y usuarios viendo mezcla de idiomas.

En este refactor resolvimos ese problema de punta a punta, y en este post te dejo el paso a paso con decisiones técnicas reales.

## Problema inicial

Teníamos síntomas claros:

- `/blog` mostraba mezcla ES/EN,
- algunas rutas viejas seguían vivas,
- usuarios entraban por URL directa y no tenían experiencia consistente por idioma,
- Search Console mostraba canónicas alternativas y rutas duplicadas.

Objetivo: que cualquier URL genérica redirija a idioma correcto y que cada artículo tenga su par ES/EN bien declarado para Google.

## Decisión de arquitectura

Tomamos estas decisiones:

1. Rutas por idioma como primera clase: `/{lang}/...`
2. Redirección inteligente para rutas genéricas (`/`, `/blog`, `/tags`)
3. `hreflang` + `x-default` por artículo
4. Estado de idioma con cookie (`site_lang`)
5. Páginas localizadas para home, tags y categorías

## Paso 1: rutas localizadas

Creamos páginas localizadas:

- `src/pages/[lang]/index.astro`
- `src/pages/[lang]/blog/[...slug].astro`
- `src/pages/[lang]/blog/index.astro`
- `src/pages/[lang]/blog/category/index.astro`
- `src/pages/[lang]/tags/index.astro`
- `src/pages/[lang]/tags/[tag].astro`

Resultado: cada contexto ahora vive en su idioma.

## Paso 2: middleware para consistencia de idioma

El middleware resuelve idioma preferido con cookie + `Accept-Language`, y redirige rutas genéricas.

Ejemplo (simplificado):

```ts
const preferredLang = cookieLang ?? detectLangFromHeader(acceptLanguageHeader);

if (normalizedPath === "/") {
  return Response.redirect(new URL(`/${preferredLang}/`, url.origin), 302);
}

if (normalizedPath === "/blog") {
  return Response.redirect(new URL(`/${preferredLang}/blog/`, url.origin), 302);
}
```

Con eso dejamos de mostrar listados mezclados.

## Paso 3: canonical y hreflang por artículo

Extendimos SEO para soportar alternates:

```ts
export interface LanguageAlternateEntry {
  lang: string;
  url: string;
}
```

En cada post calculamos alternates por `translationKey`.

```ts
const alternates = translations.map((translation) => ({
  lang: translation.data.lang,
  url: `${siteUrl}${translation.data.lang}/blog/${translation.id}/`,
}));
alternates.push({ lang: "x-default", url: `${siteUrl}en/blog/${defaultId}/` });
```

Google entiende mejor qué versión indexar por idioma.

## Paso 4: navegación coherente

Ajustamos header para que conserve idioma al navegar:

- Home -> `/${lang}`
- Tags -> `/${lang}/tags`
- Categories -> `/${lang}/blog/category`

También agregamos switcher `ES | EN` y mantenemos cookie de preferencia.

## Paso 5: cleanup de contenido duplicado visual

Detectamos que algunos posts nuevos tenían bloque markdown de "Related" + componente visual de related cards (duplicado visual).

Se limpió el bloque markdown para dejar una sola experiencia de recomendados, consistente con el diseño.

## Paso 6: reporte de cobertura de traducciones

Para no romper la paridad ES/EN agregamos script de auditoría:

```bash
pnpm run seo:report-translations
```

Genera:

- `docs/seo/translation-coverage.md`

Esto ayuda a detectar translation keys incompletas antes de deploy.

## Paso 7: QA técnico post-refactor

Checklist mínimo que usamos:

- [ ] `/blog` redirige a `/{lang}/blog/`
- [ ] `/tags` redirige a `/{lang}/tags/`
- [ ] cada post muestra canonical correcta
- [ ] `hreflang` incluye ES/EN + x-default
- [ ] no hay mezcla de idiomas en listados
- [ ] build pasa sin errores

## Errores comunes en este tipo de refactor

1. Traducir contenido pero no rutas (SEO roto).
2. Rutas localizadas sin canonical consistente.
3. Menú que rompe el contexto de idioma.
4. Redirecciones 302/301 mal encadenadas.
5. No auditar cobertura de traducciones.

## Qué publicaría como serie técnica

De este refactor salen al menos 3 posts fuertes:

1. Arquitectura de rutas bilingues en Astro.
2. SEO internacional práctico: canonical + hreflang sin humo.
3. Estrategia de migración sin perder indexación.

## Cierre

El valor de este refactor no fue "soportar dos idiomas". Fue recuperar consistencia: para usuarios, para crawlers y para el mantenimiento técnico del proyecto.

Si estás por hacer algo parecido, no empieces por traducciones. Empezá por arquitectura de rutas, metadata y redirecciones.

Relacionado:

- [`/es/blog/49-como-construimos-un-sistema-de-sincronizacion-automatizada-devto-medium/`](/es/blog/49-como-construimos-un-sistema-de-sincronizacion-automatizada-devto-medium/)
- [`/es/blog/31-typescript-avanzado-patrones-reales-y-tradeoffs/`](/es/blog/31-typescript-avanzado-patrones-reales-y-tradeoffs/)
- [`/es/blog/category/web-development/`](/es/blog/category/web-development/)
