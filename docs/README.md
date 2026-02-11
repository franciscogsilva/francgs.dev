# Documentation Hub

Documentación técnica del proyecto organizada por dominios.

## Índice

## Engineering

- `docs/engineering/crosspost-clean-architecture.md`
  - Arquitectura Clean/SOLID del motor de cross-post
  - adapters para Dev.to y Medium
  - contratos, flujos, CI/CD y troubleshooting
- `docs/engineering/medium-rss-syndication.md`
  - estrategia de publicacion en Medium usando RSS (sin API)
- `docs/engineering/crosspost-migration-dummies.md`
  - guia paso a paso (simple) para migracion automatica en cola
  - incluye workflow dedicado de dry-run para validar sin publicar

## SEO

- `docs/seo/silo-seo-architecture.md`
  - arquitectura SILO completa
  - reglas para futuras implementaciones
  - playbook de indexación en Google Search Console
- `docs/seo/editorial-calendar-6-months.md`
  - calendario de 6 meses con 7 articulos por semana (1 por SILO)
- `docs/seo/editorial-template-reusable.md`
  - plantilla reutilizable para redaccion SEO human-first
- `docs/seo/translation-coverage.md`
  - estado de cobertura ES/EN por translation key (generado por script)

## Design

- `docs/design/design-system.md`
  - design system visual del sitio

## Nota

Para cambios estructurales del blog (slugs, rutas, metadata, cross-post), revisar siempre primero:

1. `docs/seo/silo-seo-architecture.md`
2. `docs/engineering/crosspost-clean-architecture.md`
