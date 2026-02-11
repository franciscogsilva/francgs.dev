# SEO + SILO Architecture Playbook

> Guía técnica y estratégica para mantener indexación sana, señales canónicas fuertes y crecimiento orgánico con arquitectura SILO.

## Objetivo

Este documento define cómo está construida la arquitectura SEO del sitio y qué reglas seguir para futuras implementaciones sin romper indexación.

## Estado actual (implementado)

## 1) Arquitectura de contenidos (SILO)

Categorías soportadas por el schema (`src/content.config.ts`):

- `ai`
- `devops`
- `engineering-culture`
- `git`
- `linux`
- `tools`
- `web-development`

Cada post del blog debe tener `category` para entrar en el clúster SILO.

## 2) Hub pages por categoría

Ruta dinámica: `src/pages/blog/category/[category].astro`

Funciones clave:

- URL canónica del clúster (`/blog/category/<category>/`)
- listado de posts del clúster
- navegación lateral por categorías
- JSON-LD tipo `CollectionPage`

Beneficio SEO:

- Google entiende jerarquía temática y relación semántica entre artículos.

## 3) Breadcrumb semántico y visible

Implementación:

- UI: `src/components/Breadcrumb.astro`
- SEO estructurado: `src/components/SEO.astro` (BreadcrumbList)
- Integración en post page: `src/pages/blog/[...slug].astro`

Estructura usada en posts:

- `Home -> Category -> Post`

Beneficio SEO:

- refuerza arquitectura interna
- mejora signals de navegación para crawlers y usuarios

## 4) Canonical sólido

Canonical centralizado en `src/components/SEO.astro`:

- `<link rel="canonical" href="https://francgs.dev/...">`
- OG/Twitter URL alineados con canonical
- JSON-LD alineado con canonical

## 4.1) SEO bilingue (ES/EN) con hreflang

Implementado en metadata global (`SEO.astro` + `BaseLayout.astro`):

- soporte de alternates `hreflang` por pagina
- `x-default` automatico
- `lang` real en `<html lang="...">`

En posts, los alternates se calculan por `translationKey` (o prefijo numerico del slug como fallback).

Comandos operativos:

- `pnpm run seo:report-translations`
  - genera `docs/seo/translation-coverage.md`
  - muestra cobertura ES/EN por `translationKey`

## 5) Sitemap con prioridades SEO

Configuración en `astro.config.mjs` con `@astrojs/sitemap` y `serialize` custom:

- Home: `priority=1.0`, `weekly`
- Blog index: `0.9`, `weekly`
- Category hubs: `0.8`, `weekly`
- Blog posts: `0.7`, `monthly`
- Snippets y páginas generales: `0.5`, `monthly`
- Tags: `0.3`, `monthly`

## 6) Redirects 301 para legacy URLs

Implementación en middleware: `src/middleware.ts`

Se corrigen URLs antiguas que cambiaron por migración a content collections:

- cambios de mayúsculas/minúsculas
- `20.04 -> 2004`, `22.04 -> 2204`, `24.04 -> 2404`
- casos como `Node.js -> nodejs`

Resultado:

- conserva equity de backlinks viejos
- reduce 404 y conflictos de canonical en GSC

Soporte operativo:

- Script: `scripts/seo/export-legacy-redirects.mjs`
- Comando: `pnpm run seo:export-redirects`
- Salida: `docs/seo/gsc-legacy-redirects.csv`

Ese CSV sirve para validar en bloque en Search Console las URLs legacy mas criticas.

## 7) Related posts por score

Componente: `src/components/RelatedPosts.astro`

Algoritmo:

- misma categoría = +3
- tags compartidos = +1 por tag

Beneficio:

- interlinking contextual intra-SILO
- aumenta profundidad de sesión y crawlability

## Modelo mental SEO del proyecto

1. **Source of truth:** `francgs.dev`
2. **Distribution channels:** Dev.to y Medium con canonical hacia el blog
3. **SILO = topic clusters**
4. **Hub pages = entry points por intención temática**
5. **Posts = subtemas profundos enlazados al hub**

## Reglas para futuras implementaciones

## A) Reglas de URL

- No cambiar slugs de posts publicados sin plan de redirects.
- Si cambia slug: agregar 301 explícito en `src/middleware.ts`.
- Mantener formato estable y predecible (`lowercase-kebab-case`).

## B) Reglas de frontmatter (blog)

Cada post nuevo debe incluir como mínimo:

- `title`
- `description` (>= 10 chars)
- `pubDate`
- `tags` (>=1)
- `category` (enum SILO)
- `lang`

Sin `category`, el post no fortalece el clúster.

## C) Reglas de linking interno

Un post debe tener:

- breadcrumb visible con enlace al hub de categoría
- related posts activos
- categoría clickeable en header

Opcional recomendado:

- 1-2 enlaces contextuales manuales dentro del contenido a otros posts del mismo SILO

## D) Reglas de metadata

- Canonical siempre absoluto y correcto.
- OG/Twitter URL = canonical.
- JSON-LD consistente con la URL final.
- Evitar descripciones vacías o genéricas.

## E) Reglas de indexación

- `robots.txt` debe seguir bloqueando `/api/`.
- sitemap index actualizado en cada deploy.
- URLs importantes con status `200` (no soft-404).

## F) Reglas de syndication (cross-post)

- Siempre enviar `canonical_url` / `canonicalUrl` al publicar en Dev.to y Medium.
- No publicar sin canonical en plataformas externas.
- Evitar editar títulos/slugs externos de forma que parezcan contenido distinto.

## Content strategy por SILO

## Estructura recomendada por categoría

Cada categoría debería tener:

1. 1 artículo pillar (2000-3000 palabras)
2. 4-8 artículos cluster (guías específicas)
3. enlaces bidireccionales pillar <-> cluster

## Prioridad sugerida de expansión

1. `ai` (nuevo clúster)
2. `engineering-culture`
3. `git`
4. `web-development`

## Recomendaciones específicas para `ai`

- Crear primer post con `category: ai` para activar hub page `/blog/category/ai/`.
- Definir un pillar orientado a developers (no generalista):
  - prompt engineering para ingeniería
  - integración de LLM APIs
  - RAG y embeddings en producto real
  - guardrails, costos y observabilidad

## Playbook Google Search Console (operativo)

Cuando se haga un cambio estructural:

1. Deploy a producción.
2. Enviar sitemap:
   - `https://francgs.dev/sitemap-index.xml`
3. Revisar en GSC:
   - "Página con redirección"
   - "Canónica diferente elegida por Google"
   - "Rastreada, actualmente sin indexar"
4. Inspeccionar URLs críticas y solicitar indexación.
5. Ejecutar "Validar corrección" por issue type.

## Cómo interpretar problemas comunes

### "Página con redirección"

- Normal si es URL legacy y redirige 301 a la nueva.

### "Alternativa con etiqueta canónica adecuada"

- Normal en syndication o variantes esperadas.

### "Google eligió canónica diferente"

Acciones:

- verificar consistencia canonical + og:url + sitemap
- revisar enlaces internos apuntando a la URL correcta
- evitar duplicados con contenido casi idéntico y sin diferenciación

### "Rastreada, actualmente sin indexar"

Acciones:

- mejorar calidad/valor único del contenido
- reforzar enlaces internos desde hubs y posts relevantes
- revisar EEAT (autoría clara, fechas, fuentes)

## Checklist técnico antes de publicar un post nuevo

- [ ] frontmatter completo con `category`
- [ ] slug final estable (sin cambios posteriores)
- [ ] title/description orientados a intención de búsqueda
- [ ] links internos a 1-2 posts del mismo SILO
- [ ] imagen válida y accesible
- [ ] build local sin errores
- [ ] canonical correcto en preview
- [ ] aparece en sitemap tras build

## Checklist técnico post-deploy

- [ ] URL responde `200`
- [ ] canonical apunta a `https://francgs.dev/...`
- [ ] hub de categoría lista el post
- [ ] breadcrumb muestra categoría correcta
- [ ] GSC URL inspection "Se permite la indexación: Sí"

## Anti-clone y defensa de originalidad

No se puede impedir que alguien clonee código público, pero sí reforzar señales de autoría:

1. canonical consistente y absoluta
2. sitemap correcto y actualizado
3. publicación temprana en canales con canonical a tu dominio
4. timestamps públicos (git history + article published time)
5. reportes DMCA cuando haya copia abusiva

## Referencias internas

- `src/content.config.ts`
- `src/pages/blog/category/[category].astro`
- `src/pages/blog/[...slug].astro`
- `src/components/SEO.astro`
- `src/components/Breadcrumb.astro`
- `src/components/RelatedPosts.astro`
- `src/middleware.ts`
- `astro.config.mjs`
- `.github/workflows/deploy.yml`
- `docs/engineering/crosspost-clean-architecture.md`

---

**Decisión clave:**

Si una mejora SEO rompe estabilidad de URL, se prioriza estabilidad + redirect plan. En SEO técnico, consistencia gana.
