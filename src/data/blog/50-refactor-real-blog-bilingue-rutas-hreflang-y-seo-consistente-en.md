---
title: "Real Bilingual Blog Refactor: Routes, hreflang, and Consistent SEO"
author: "Francisco Gonzalez"
description: "Technical walkthrough of a bilingual Astro blog refactor: language routes, redirects, hreflang, canonicals, and navigation consistency without duplicate content."
pubDate: 2026-05-06
tags: ["web-development", "seo", "astro", "typescript"]
category: web-development
translationKey: post-50
lang: en
---

Building a bilingual blog is not just translation work. If route architecture, canonical strategy, and navigation are not aligned, you get duplicate content, indexing confusion, and users landing in mixed-language sections.

This refactor solved that from end to end. Here is the practical walkthrough.

## Initial Problem

We had clear symptoms:

- `/blog` was mixing Spanish and English posts,
- old non-localized URLs were still active,
- direct URL visitors did not get consistent language behavior,
- Search Console showed canonical conflicts and duplicates.

Goal: language-consistent UX and crawl-friendly SEO.

## Architecture Decisions

We standardized around five rules:

1. Language-first routes: `/{lang}/...`
2. Smart redirects for generic routes (`/`, `/blog`, `/tags`)
3. Per-post `hreflang` + `x-default`
4. Language preference cookie (`site_lang`)
5. Localized pages for home, tags, and category hubs

## Step 1: Localized Pages

We implemented language-aware pages:

- `src/pages/[lang]/index.astro`
- `src/pages/[lang]/blog/[...slug].astro`
- `src/pages/[lang]/blog/index.astro`
- `src/pages/[lang]/blog/category/index.astro`
- `src/pages/[lang]/tags/index.astro`
- `src/pages/[lang]/tags/[tag].astro`

This removes ambiguity and makes language explicit in every route.

## Step 2: Middleware Redirect Strategy

Middleware now resolves language from cookie + `Accept-Language`, then redirects generic routes.

Simplified logic:

```ts
const preferredLang = cookieLang ?? detectLangFromHeader(acceptLanguageHeader);

if (normalizedPath === "/") {
  return Response.redirect(new URL(`/${preferredLang}/`, url.origin), 302);
}

if (normalizedPath === "/blog") {
  return Response.redirect(new URL(`/${preferredLang}/blog/`, url.origin), 302);
}
```

Result: no more mixed-language listing pages.

## Step 3: Canonical and hreflang

We extended SEO metadata to include language alternates:

```ts
export interface LanguageAlternateEntry {
  lang: string;
  url: string;
}
```

Per post, alternates are computed by `translationKey` and include `x-default`.

```ts
const alternates = translations.map((translation) => ({
  lang: translation.data.lang,
  url: `${siteUrl}${translation.data.lang}/blog/${translation.id}/`,
}));
alternates.push({ lang: "x-default", url: `${siteUrl}en/blog/${defaultId}/` });
```

This gives search engines explicit language mapping and reduces canonical ambiguity.

## Step 4: Navigation Consistency

The header was updated to preserve language context:

- Home -> `/${lang}`
- Tags -> `/${lang}/tags`
- Categories -> `/${lang}/blog/category`

We also added an explicit `ES | EN` switcher and persist user choice via cookie.

## Step 5: Remove Duplicate "Related" UX

Some migrated posts had both:

- markdown “Related” link list,
- visual related-posts component.

That created duplicated sections and visual noise. We removed markdown duplicates and kept the component-based related cards.

## Step 6: Translation Coverage Report

To prevent ES/EN drift, we added a coverage report:

```bash
pnpm run seo:report-translations
```

Output:

- `docs/seo/translation-coverage.md`

This catches incomplete translation keys before release.

## Step 7: QA Checklist After Refactor

- [ ] `/blog` redirects to `/{lang}/blog/`
- [ ] `/tags` redirects to `/{lang}/tags/`
- [ ] post canonical matches localized URL
- [ ] `hreflang` includes ES/EN + `x-default`
- [ ] no mixed-language listing pages
- [ ] build passes cleanly

## Common Mistakes in Bilingual Refactors

1. Translating content but keeping non-localized URLs.
2. Localized routes without metadata parity.
3. Navigation that breaks language context.
4. Redirect chains without a clear policy.
5. No automated translation coverage audit.

## Publishing Opportunities From This Refactor

This refactor itself can become a technical series:

1. Language route architecture in Astro.
2. Practical international SEO: canonical + hreflang.
3. Migration strategy that preserves indexing stability.

## Close

The biggest win was not “having two languages.” The real win was consistency across user navigation, metadata, and crawl behavior.

If you are planning a similar migration, do not start with translation copywriting. Start with route architecture, canonical strategy, and redirect behavior.

Related:

- [`/en/blog/49-como-construimos-un-sistema-de-sincronizacion-automatizada-devto-medium-en/`](/en/blog/49-como-construimos-un-sistema-de-sincronizacion-automatizada-devto-medium-en/)
- [`/en/blog/31-typescript-avanzado-patrones-reales-y-tradeoffs-en/`](/en/blog/31-typescript-avanzado-patrones-reales-y-tradeoffs-en/)
- [`/en/blog/category/web-development/`](/en/blog/category/web-development/)
