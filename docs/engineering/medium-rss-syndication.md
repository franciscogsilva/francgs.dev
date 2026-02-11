# Medium Syndication via RSS (sin API)

> Alternativa oficial cuando no hay acceso al API de Medium: usar feed RSS como fuente de import/syndication.

## Contexto

El API de Medium no siempre esta disponible para cuentas nuevas y tiene limitaciones operativas. Para mantener automatizacion parcial sin depender de API, usamos RSS dedicado para syndication.

## Feed implementado

- Ruta: `/rss-medium.xml`
- Archivo: `src/pages/rss-medium.xml.js`
- Contenido: posts no draft del blog con body completo en feed

URL final en produccion:

- `https://francgs.dev/rss-medium.xml`

## Flujo recomendado

1. Publicar primero en blog personal (`francgs.dev`).
2. Verificar que el post aparezca en `/rss-medium.xml`.
3. Importar/sindicar en Medium usando ese feed.
4. En Medium, confirmar que el canonical apunte a `francgs.dev`.

## Ventajas

- no depende de tokens API
- mantiene fuente canonica en tu dominio
- reduce esfuerzo manual por articulo

## Limitaciones

- Medium puede demorar en refrescar feed
- control de estado no tan fino como en API
- algunas plataformas importan excerpt en lugar de full body

## Checklist operativo

- [ ] post publicado en blog
- [ ] aparece en `/rss-medium.xml`
- [ ] Medium importado correctamente
- [ ] canonical revisado en Medium

## Nota SEO

Siempre priorizar indexacion en dominio propio. Medium es canal de distribucion, no fuente primaria.
