---
title: "Docker en Node.js: permisos, volumenes y DX sin dolor"
author: "Francisco Gonzalez"
description: "Aprende a evitar errores de permisos en Docker para proyectos Node.js, mejorando experiencia local y estabilidad entre entornos."
pubDate: 2026-04-22
tags: ["devops", "docker", "nodejs"]
category: devops
translationKey: post-36
lang: es
---

Si trabajas con Node.js en Docker, seguro viste errores tipo `EACCES` al montar volumenes. El problema no es Docker "malo", es desalineacion de permisos entre host y contenedor.

## Causa raiz

- UID/GID del usuario local no coincide con el usuario del contenedor.
- Archivos creados por root dentro del volumen.

## Caso practico guiado

Escenario: equipo de 4 devs, proyecto Node.js + pnpm, todos con Linux/macOS distintos. En cada `pnpm install` dentro del contenedor, algunos terminaban con `node_modules` propiedad de root y el siguiente comando local fallaba.

Objetivo: unificar permisos para que host y contenedor escriban con la misma identidad.

## Solucion pragmatica

1. Ejecutar contenedor con UID/GID del host.
2. Evitar correr todo como root.
3. Definir ownership consistente en `Dockerfile`.

`Dockerfile` base:

```dockerfile
FROM node:22-bookworm-slim

ARG UID=1000
ARG GID=1000

RUN groupadd -g ${GID} appgroup \
  && useradd -u ${UID} -g appgroup -m appuser

WORKDIR /app
USER appuser
```

## Ejemplo rapido

```yaml
services:
  app:
    user: "${UID}:${GID}"
    volumes:
      - ./:/app
```

## Verificacion automatica en TypeScript

Puedes agregar un script de health local para validar permisos esperados:

```ts
import { stat } from "node:fs/promises";

async function verifyOwnership(path: string, expectedUid: number) {
  const file = await stat(path);
  if (file.uid !== expectedUid) {
    throw new Error(`Ownership invalido en ${path}. uid=${file.uid}, esperado=${expectedUid}`);
  }
}

verifyOwnership("./node_modules", Number(process.env.UID ?? 1000))
  .then(() => console.log("Permisos OK"))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
```

## Checklist

- [ ] permisos consistentes
- [ ] npm/pnpm cache fuera de root
- [ ] scripts de bootstrap para nuevos devs
- [ ] verificacion automatica de ownership en CI local/devcontainer

Relacionado:

- [`/blog/07-solving-docker-permission-issues-in-nodejs-projects-a-guide-to-overcoming-eacces-errors-in-volumes/`](/blog/07-solving-docker-permission-issues-in-nodejs-projects-a-guide-to-overcoming-eacces-errors-in-volumes/)
- [`/blog/30-cicd-con-github-actions-y-vps-desde-cero/`](/blog/30-cicd-con-github-actions-y-vps-desde-cero/)
- [`/blog/category/devops/`](/blog/category/devops/)
