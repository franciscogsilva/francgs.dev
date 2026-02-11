---
title: "Acceder al directorio raiz del proyecto desde TypeScript y JavaScript"
author: "Francisco Gonzalez"
description: "Patron confiable para ubicar la raiz del proyecto desde cualquier archivo."
pubDate: 2024-02-05
image:
  url: "https://docs.astro.build/assets/full-logo-light.png"
  alt: "The full Astro logo."
tags: ["typescript", "javascript", "nodejs"]
category: web-development
translationKey: post-08
lang: es
---

<!-- # Acceder facilmente al directorio raiz del proyecto desde TypeScript y JavaScript -->

## Problema

En proyectos TypeScript, acceder siempre a la raiz del proyecto desde subdirectorios puede ser complicado. Las rutas relativas cambian segun la ubicacion del archivo y eso genera errores en la gestion de paths.

## Solucion

Vamos a modificar `app.ts` (en la raiz del proyecto) para exportar una constante `basePath` con la ruta absoluta a la raiz. Luego podras importarla desde cualquier parte de la app.

## Paso a paso

### 1. Modificar `app.ts`

Abre tu archivo `app.ts` y agrega esta linea al final:

```typescript
import path from 'path';
// Here you can play with '..' depends where you locate the following line
export const basePath: string = path.join(path.resolve(__dirname), "..");
```

Esta linea exporta `basePath`, que calcula la ruta absoluta de la raiz del proyecto.

### 2. Usar `basePath` en tu aplicacion

Ahora puedes importar `basePath` en cualquier archivo TypeScript:

```typescript
import { basePath } from './app';

// Use basePath to reference any file or directory from the project root
const someFilePath = path.join(basePath, 'path/to/your/file');
```

## Conclusion

Con una sola linea en `app.ts` tienes una forma simple y consistente de acceder a la raiz del proyecto desde cualquier archivo. Esto mejora la legibilidad y facilita el mantenimiento de rutas.
