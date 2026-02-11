---
title: "Como construimos un sistema de sincronizacion automatizada para Dev.to y Medium"
author: "Francisco Gonzalez"
description: "Guia paso a paso para implementar un motor de sincronizacion de posts con arquitectura limpia, control de rate limits, estado persistente y ejecucion por lotes en GitHub Actions."
pubDate: 2026-02-11
tags: ["devops", "github-actions", "automation", "api"]
category: devops
translationKey: post-49
lang: es
---

Automatizar la publicacion en plataformas externas suena facil hasta que chocas con los problemas reales: limites de API, duplicados, reintentos, estado inconsistente y pipelines que se rompen por errores ajenos.

En este post te cuento, paso a paso y con codigo, como armamos un sistema de sincronizacion para publicar articulos del blog en Dev.to y Medium sin exponer secretos y sin romper el flujo normal de deploy.

## Objetivo real del sistema

Queríamos resolver cuatro cosas:

1. Publicar solo articulos pendientes (no repetir).
2. Evitar rate limits de Dev.to (`429`).
3. Separar deploy de producto y crosspost (si falla uno, no cae todo).
4. Mantener arquitectura extensible (agregar plataformas sin reescribir todo).

## Arquitectura elegida (simple y mantenible)

Usamos un enfoque de puertos/adaptadores:

- **Domain**: entidad `BlogPost`.
- **Application**: caso de uso `CrossPostArticlesUseCase`.
- **Infrastructure**:
  - repositorio de posts (`AstroMarkdownPostRepository`),
  - repositorio de estado (`FilePublicationStateRepository`),
  - publishers por plataforma (`DevToPublisher`, `MediumPublisher`).

Esto evita acoplar lógica de negocio a detalles HTTP de cada API.

## Paso 1: modelar el post como entidad

```js
export class BlogPost {
  constructor({ slug, title, description, tags, pubDate, canonicalUrl, body, lang }) {
    this.slug = slug;
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.pubDate = pubDate;
    this.canonicalUrl = canonicalUrl;
    this.body = body;
    this.lang = lang;
  }
}
```

Detalle importante: incluimos `lang` para poder filtrar publicaciones por idioma (`en` o `es`).

## Paso 2: leer markdown y construir canonical correcto

El repositorio parsea frontmatter, ignora drafts y construye canonical por idioma:

```js
const canonicalUrl = `${this.siteUrl}/${lang}/blog/${slug}/`;
```

Con eso evitamos publicar en plataformas externas una canonical vieja como `/blog/<slug>/` cuando el sitio ya está en `/{lang}/blog/<slug>/`.

## Paso 3: controlar duplicados con estado persistente

Guardamos estado por plataforma:

- `.crosspost/state-devto.json`
- `.crosspost/state-medium.json`

Ejemplo:

```json
{
  "posts": {
    "49-como-construimos-un-sistema-de-sincronizacion-automatizada-devto-medium": {
      "platforms": {
        "devto": {
          "id": "123456",
          "url": "https://dev.to/...",
          "canonicalUrl": "https://francgs.dev/es/blog/49-como-construimos.../",
          "syncedAt": "2026-05-05T10:00:00.000Z"
        }
      }
    }
  }
}
```

Si un post ya está sincronizado, se hace `skip`.

## Paso 4: manejar rate limit de Dev.to

El error fuerte que vimos fue `429 Retry later` cuando intentábamos publicar demasiados posts en una corrida.

Solución aplicada:

- delay mínimo entre publicaciones (`minIntervalMs`),
- retries con backoff leyendo `Retry-After` o mensaje del body,
- límite de posts por corrida (`CROSSPOST_MAX_POSTS=1`).

Snippet clave:

```js
if (response.status === 429) {
  const retrySeconds = parseRetrySeconds(response, errorBody);
  await sleep(retrySeconds * 1000);
  attempt += 1;
  continue;
}
```

## Paso 5: ejecutar en modo migracion por cola

Creamos workflow dedicado con cron cada 5 minutos:

```yaml
on:
  schedule:
    - cron: "*/5 * * * *"
```

Y publicamos 1 artículo por ejecución:

```yaml
env:
  CROSSPOST_LANGS: en
  CROSSPOST_MAX_POSTS: "1"
  CROSSPOST_DEVTO_MAX_RETRIES: "6"
  CROSSPOST_DEVTO_MIN_INTERVAL_MS: "5000"
```

Esto convierte la migración en una cola estable en lugar de un "todo junto" que rompe por rate limit.

## Paso 6: no romper deploy principal

El crosspost es importante, pero no debe tumbar producción.

Por eso usamos:

```yaml
continue-on-error: true
```

y además agregamos `CROSSPOST_FAIL_ON_ERROR=false`.

Resultado: si falla una plataforma, el deploy del sitio igual termina bien.

## Paso 7: filtrar idioma y plataforma por entorno

En el entrypoint de crosspost soportamos configuración por variables:

- `CROSSPOST_LANGS=en`
- `CROSSPOST_MAX_POSTS=1`
- `CROSSPOST_STATE_PATH=.crosspost/state-devto.json`
- `--platform=devto` o `--platform=medium`

Esto nos permite correr estrategias distintas según etapa.

## Flujo operativo recomendado

1. **Migración inicial**: cron cada 5 minutos, 1 post por run, solo inglés.
2. **Transición**: cuando backlog baja, mantener sync en deploy con límite bajo.
3. **Mantenimiento**: publicar solo faltantes y monitorear 429.

## Checklist de implementación (sin secretos)

- [ ] Definir entidad de contenido (`BlogPost`)
- [ ] Implementar repositorio markdown + canonical por idioma
- [ ] Guardar estado de sincronización por plataforma
- [ ] Implementar deduplicación por estado + canonical
- [ ] Implementar retries/backoff para 429
- [ ] Limitar cantidad por run (`MAX_POSTS`)
- [ ] Ejecutar en cron de migración
- [ ] Separar crosspost del deploy principal

## Errores que ya evitamos con este diseño

- Publicación masiva que dispara rate limits.
- Duplicados por no tener estado persistente.
- Canonicals mal construidas al migrar a rutas por idioma.
- Deploy caído por error de una API externa.

## Cierre

La clave no fue "hacer más script", fue diseñar un flujo operativo: idempotente, lento cuando conviene, y desacoplado del deploy.

Si querés replicarlo, empezá simple: 1 post por corrida, estado persistente, retries explícitos y métricas de avance. Con eso ya estás en producción seria.

Relacionado:

- [`/es/blog/30-cicd-con-github-actions-y-vps-desde-cero/`](/es/blog/30-cicd-con-github-actions-y-vps-desde-cero/)
- [`/es/blog/42-integracion-llm-apis-retries-costos-observabilidad/`](/es/blog/42-integracion-llm-apis-retries-costos-observabilidad/)
- [`/es/blog/category/devops/`](/es/blog/category/devops/)
