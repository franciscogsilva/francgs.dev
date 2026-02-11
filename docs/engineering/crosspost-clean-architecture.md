# Cross-post Engine (Clean Architecture)

> Publica artículos del blog en Dev.to y Medium con `canonical` hacia `francgs.dev`, usando principios SOLID + adapters.

## Objetivo

Esta implementación resuelve tres necesidades a la vez:

1. Distribuir contenido automáticamente a plataformas externas.
2. Mantener como fuente de verdad al blog personal (`canonical_url`).
3. Diseñar una base extensible (nuevos publishers sin tocar casos de uso).

## Principios de diseño aplicados

### SOLID

- **S (Single Responsibility):**
  - `BlogPost` modela el contenido.
  - `CrossPostArticlesUseCase` orquesta la lógica.
  - Cada publisher (`DevToPublisher`, `MediumPublisher`) encapsula su API.
  - Repositorios (`AstroMarkdownPostRepository`, `FilePublicationStateRepository`) manejan lectura/estado.
- **O (Open/Closed):**
  - Para agregar `HashnodePublisher` o `LinkedInPublisher`, se implementa el adapter y se inyecta.
- **L (Liskov):**
  - Cualquier publisher con `isConfigured`, `findByCanonicalUrl`, `publish` puede reemplazar a otro.
- **I (Interface Segregation):**
  - El caso de uso solo depende de contratos mínimos, no de detalles HTTP.
- **D (Dependency Inversion):**
  - El caso de uso depende de abstracciones (repositorios/publishers), no de fetch directo.

### Patrón arquitectónico

- **Use Case + Ports/Adapters (estilo Clean Architecture)**
- Capas:
  - `domain`: entidades y reglas básicas
  - `application`: casos de uso
  - `infrastructure`: IO, APIs externas, persistencia

## Estructura

```text
scripts/crosspost/
  domain/
    BlogPost.mjs
  application/usecases/
    CrossPostArticlesUseCase.mjs
  infrastructure/
    repositories/
      AstroMarkdownPostRepository.mjs
      FilePublicationStateRepository.mjs
    publishers/
      DevToPublisher.mjs
      MediumPublisher.mjs
  index.mjs
```

## Flujo completo

1. Se ejecuta `scripts/crosspost/index.mjs`.
2. Se resuelven flags/env (`--all`, `--dry-run`, `CROSSPOST_CHANGED_FILES`, etc).
3. `AstroMarkdownPostRepository` carga posts desde `src/data/blog/*.md` y excluye drafts.
4. `CrossPostArticlesUseCase` decide por cada post/plataforma:
   - sin credenciales -> skip
  - ya sincronizado en state file -> skip
   - ya existe por canonical (si la API lo soporta) -> skip y sincroniza estado
   - si no existe -> publica
5. Se guarda estado en `.crosspost/state-<platform>.json` (en CI) o `.crosspost/state.json` (local).

## Contratos implícitos (ports)

### Publisher Port

Cada publisher implementa:

- `name: string`
- `isConfigured(): boolean`
- `findByCanonicalUrl(canonicalUrl): Promise<{id,url} | null>`
- `publish(post, { dryRun }): Promise<{id,url}>`

### Post Repository Port

- `listPublishedPosts({ all, changedFiles }): Promise<BlogPost[]>`

### State Repository Port

- `getPostPlatformState(slug, platform)`
- `setPostPlatformState(slug, platform, value)`
- `save()`

## Integración con plataformas

## Dev.to

- Endpoint create: `POST https://dev.to/api/articles`
- Detección de existentes: `GET https://dev.to/api/articles/me/all`
- Campo canonical: `canonical_url`
- Soporta markdown nativo (`body_markdown`)

Implementación actual:

- Adapter: `scripts/crosspost/infrastructure/publishers/DevToPublisher.mjs`
- Sanitiza tags, limita a 4
- Publica con `published` configurable (`CROSSPOST_DEVTO_PUBLISHED`)

## Medium

- Endpoint create: `POST https://api.medium.com/v1/users/{authorId}/posts`
- Canonical: `canonicalUrl`
- Markdown vía `contentFormat: "markdown"`

Importante:

- API de Medium está deprecada oficialmente.
- No ofrece endpoint robusto para listar artículos propios para deduplicar.
- Por eso `findByCanonicalUrl` devuelve `null` y la deduplicación fuerte depende del state local.

## Estado local de sincronización

- Archivo local default: `.crosspost/state.json`
- En CI se usa estado por plataforma: `.crosspost/state-devto.json` y `.crosspost/state-medium.json`
- Ignorado por git en `.gitignore`

Ejemplo:

```json
{
  "posts": {
    "10-integrate-chat-gpt-api-with-laravel": {
      "platforms": {
        "devto": {
          "id": "123456",
          "url": "https://dev.to/...",
          "canonicalUrl": "https://francgs.dev/blog/10-integrate-chat-gpt-api-with-laravel/",
          "syncedAt": "2026-02-10T14:00:00.000Z"
        }
      }
    }
  }
}
```

## Comandos disponibles

En `package.json`:

- `pnpm run crosspost`
  - Publica solo archivos cambiados (si `CROSSPOST_CHANGED_FILES` está seteado)
- `pnpm run crosspost:all`
  - Evalua todos los posts no draft (pero publica solo faltantes/no sincronizados)
- `pnpm run crosspost:dry`
  - Simulación total sin publicar

Flags manuales:

- `--all`
- `--dry-run`
- `--platform=devto,medium`

## Variables de entorno

### Requeridas por plataforma

- `DEVTO_API_KEY`
- `MEDIUM_TOKEN`

### Configuración de comportamiento

- `SITE_URL` (default: `https://francgs.dev`)
- `CROSSPOST_CONTENT_DIR` (default: `src/data/blog`)
- `CROSSPOST_STATE_PATH` (default: `.crosspost/state.json`)
- `CROSSPOST_CHANGED_FILES` (lista newline-separated)
- `CROSSPOST_DEVTO_PUBLISHED` (`true`/`false`)
- `CROSSPOST_MEDIUM_STATUS` (`public`/`draft`/`unlisted`)

## CI/CD (GitHub Actions)

Archivo: `.github/workflows/deploy.yml`

Pasos relevantes:

1. Job `deploy` publica el sitio normalmente.
2. Job `crosspost-missing-only` corre en paralelo por plataforma (`devto`, `medium`) con matrix.
3. Restaura cache de estado por plataforma (`actions/cache@v4`).
4. Ejecuta `pnpm run crosspost -- --all --platform=<platform>`.
5. Solo publica lo no migrado (segun state + dedupe por canonical cuando aplica).
6. `continue-on-error: true` para no tumbar deploy por fallo de API externa.

## Seguridad y resiliencia

- Secrets se consumen desde GitHub Secrets (no hardcode).
- Sin credenciales -> plataforma se marca como skip, no falla todo.
- Fallo de una plataforma no bloquea publicación en otra.
- `process.exitCode = 1` solo si hay errores en ejecución manual (útil para monitoreo).

## Estrategia de migración inicial (posts viejos + nuevos)

1. Cargar secrets.
2. Ejecutar primero:

```bash
pnpm run crosspost:dry
```

3. Ejecutar migración masiva real:

```bash
pnpm run crosspost:all
```

4. Desde ahi, CI/CD se encarga de migrar solo lo pendiente en cada run.

## Extender a nueva plataforma

Checklist para agregar `XPublisher`:

1. Crear adapter en `infrastructure/publishers/XPublisher.mjs`
2. Implementar contrato (`isConfigured`, `findByCanonicalUrl`, `publish`)
3. Registrar en `scripts/crosspost/index.mjs`
4. Agregar secret/env vars necesarias
5. Probar con `--dry-run`

## Troubleshooting

### No publica nada

- Puede ser correcto: no hay pendientes por migrar.
- Revisar estado cacheado por plataforma (`.crosspost/state-*.json`).
- Ejecutar `pnpm run crosspost:all` local para validar comportamiento.

### Medium duplica posts

- Riesgo principal cuando se pierde el state cacheado (Medium no deduplica tan bien via API).
- Mitigacion actual: cache persistente por plataforma en CI.
- Mitigacion robusta: storage remoto compartido (S3/DB).

### Dev.to responde 429

- Aplicar backoff/retry en publisher (siguiente mejora recomendada).

## Próximas mejoras recomendadas

1. Persistencia de estado en storage remoto compartido (S3/Supabase KV).
2. Retry policy con exponential backoff por plataforma.
3. Observabilidad: métricas por publisher y alertas.
4. Normalización markdown más robusta (frontmatter parser dedicado).
5. Modo `update` para plataformas que soporten edición (Dev.to `PUT /api/articles/{id}`).

---

**Archivos clave de esta implementación:**

- `scripts/crosspost/index.mjs`
- `scripts/crosspost/application/usecases/CrossPostArticlesUseCase.mjs`
- `scripts/crosspost/infrastructure/publishers/DevToPublisher.mjs`
- `scripts/crosspost/infrastructure/publishers/MediumPublisher.mjs`
- `scripts/crosspost/infrastructure/repositories/AstroMarkdownPostRepository.mjs`
- `scripts/crosspost/infrastructure/repositories/FilePublicationStateRepository.mjs`
- `.github/workflows/deploy.yml`
- `package.json`
