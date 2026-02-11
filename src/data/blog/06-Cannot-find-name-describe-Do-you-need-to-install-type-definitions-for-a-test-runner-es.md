---
title: "Error con Jest y TypeScript: Cannot find name 'describe'"
author: "Francisco Gonzalez"
description: "Guia practica para corregir el error de tipos en pruebas con Jest y TypeScript."
pubDate: 2024-02-05
image:
  url: "https://docs.astro.build/assets/full-logo-light.png"
  alt: "The full Astro logo."
tags: ["typescript", "nodejs", "troubleshooting"]
category: web-development
translationKey: post-06
lang: es
---

El objetivo de este articulo es tener un `tsconfig.json` que no transpile los tests al generar `dist` con el build, pero que al mismo tiempo reconozca `@types/jest` para trabajar bien en desarrollo.

### ERROR

```
Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha`.ts
```

## Solucion

1. Crea o modifica tu archivo `tsconfig.json`:

```
{
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"],
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "src",
    "outDir": "dist/",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

2. Crea un nuevo archivo llamado `tsconfig.build.json`:

```
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "**/*.spec.ts", "**/*.test.ts", "dist"]
}
```

Este archivo evita transpilar los tests de TypeScript a JavaScript dentro de `dist`.

3. Modifica los scripts de tu `package.json`:

```
"scripts": {
    "dev": "ts-node src/app.ts",
    "dev:nodemon": "nodemon",
    "build": "rimraf ./dist && tsc -p tsconfig.build.json",
    "start": "npm run build && node dist/app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
```
