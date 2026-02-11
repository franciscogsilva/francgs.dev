# Crosspost Migration Guide (Dummies Edition)

Esta guia explica, paso a paso y sin vueltas, como funciona la migracion automatica de posts a Dev.to y Medium.

Objetivo actual:

- publicar solo posts en ingles,
- publicar 1 post por ejecucion,
- correr cada 5 minutos en modo migracion,
- no romper el deploy si una plataforma falla.

## 1) Que problema resuelve

Antes intentabamos publicar muchos posts en una sola corrida y Dev.to devolvia `429` (rate limit). El resultado: fallos masivos.

Ahora se hace en cola lenta y estable.

## 2) Como quedo la arquitectura

Hay 2 workflows:

1. `deploy.yml`
   - despliega la app,
   - luego intenta sincronizar solo faltantes,
   - publica 1 post por corrida.

2. `crosspost-migration.yml`
   - corre cada 5 minutos (cron),
   - publica 1 post por corrida,
   - alterna plataforma por minuto.

## 3) Requisitos en GitHub Secrets

En el repo, en `Settings > Secrets and variables > Actions`:

- `DEVTO_API_KEY`
- `MEDIUM_TOKEN` (si no tenes API estable, podes dejarlo y usar RSS como fallback)

## 4) Variables clave (ya configuradas)

Estas variables se usan en workflows:

- `CROSSPOST_LANGS=en` -> solo ingles
- `CROSSPOST_MAX_POSTS=1` -> 1 post por run
- `CROSSPOST_DEVTO_MAX_RETRIES=6` -> retries ante 429
- `CROSSPOST_DEVTO_MIN_INTERVAL_MS=5000` -> espera minima entre publicaciones
- `CROSSPOST_FAIL_ON_ERROR=false` -> no rompe pipeline

## 5) Como decide que publicar

El script lee `src/data/blog/*.md`, ignora drafts y revisa estado cacheado:

- si ya esta sincronizado -> skip
- si falta -> publica

Estado por plataforma:

- `.crosspost/state-devto.json`
- `.crosspost/state-medium.json`

Esos archivos se persisten en CI por cache (`actions/cache`).

## 6) Modo migracion (cron cada 5 minutos)

Workflow: `.github/workflows/crosspost-migration.yml`

Regla de plataforma:

- minuto `00/10/20/30/40/50` -> `devto`
- otros slots -> `medium`

Cada ejecucion:

1. restaura estado,
2. busca faltantes,
3. publica 1,
4. guarda estado.

## 7) Que pasa cuando termina la migracion

Cuando ya no queden pendientes:

- el cron seguira corriendo,
- el script dira `No posts matched for cross-posting` o hara solo skips.

En ese punto podes:

1. desactivar el workflow `crosspost-migration.yml`, o
2. dejarlo activo como red de seguridad (impacto bajo).

## 8) Comandos manuales utiles

Simular local sin publicar:

```bash
CROSSPOST_LANGS=en CROSSPOST_MAX_POSTS=1 pnpm run crosspost -- --all --platform=devto --dry-run
```

Forzar corrida real local (con keys):

```bash
CROSSPOST_LANGS=en CROSSPOST_MAX_POSTS=1 pnpm run crosspost -- --all --platform=devto
```

## 9) Troubleshooting rapido

### Error 429 en Dev.to

- Esperado bajo carga.
- Ya hay retry/backoff.
- Si persiste, subir intervalo:
  - `CROSSPOST_DEVTO_MIN_INTERVAL_MS=8000` o `10000`.

### Publica demasiado

- Verifica `CROSSPOST_MAX_POSTS=1` en workflow.

### Publica en idioma incorrecto

- Verifica `CROSSPOST_LANGS=en`.

### Duplicados

- Revisar cache de estado por plataforma.
- No borrar cache sin plan.

## 10) Relacion con RSS para Medium

Si Medium API falla o no esta disponible:

- usar feed: `/rss-medium.xml`
- documentacion: `docs/engineering/medium-rss-syndication.md`

## 11) Archivos importantes

- `.github/workflows/deploy.yml`
- `.github/workflows/crosspost-migration.yml`
- `scripts/crosspost/index.mjs`
- `scripts/crosspost/application/usecases/CrossPostArticlesUseCase.mjs`
- `scripts/crosspost/infrastructure/publishers/DevToPublisher.mjs`
- `scripts/crosspost/infrastructure/repositories/AstroMarkdownPostRepository.mjs`

---

Si tocas algo de esta implementacion, primero corre en dry-run. Te ahorra dolores.
