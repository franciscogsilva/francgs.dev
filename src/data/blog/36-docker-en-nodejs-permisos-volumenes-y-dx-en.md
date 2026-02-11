---
title: "Docker in Node.js: Permissions, Volumes, and Better DX"
author: "Francisco Gonzalez"
description: "Avoid Docker permission issues in Node.js projects and improve local developer experience across environments."
pubDate: 2026-04-22
tags: ["devops", "docker", "nodejs"]
category: devops
translationKey: post-36
lang: en
---
If you work with Node.js in Docker, you've probably seen `EACCES` errors when mounting volumes. The problem is not "bad" Docker, it is misalignment of permissions between host and container.

## Root cause

- UID/GID of the local user does not match the container user.
- Files created by root within the volume.

## Guided practical case

Scenario: team of 4 devs, Node.js + pnpm project, all with different Linux/macOS. On every `pnpm install` inside the container, some ended up with `node_modules` owned by root and the next local command failed.

Objective: unify permissions so that host and container write with the same identity.

## Pragmatic solution

1. Run container with host UID/GID.
2. Avoid running everything as root.
3. Define ownership consisting of `Dockerfile`.

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

## Quick example

```yaml
services:
  app:
    user: "${UID}:${GID}"
    volumes:
      - ./:/app
```

## Automatic verification in TypeScript

You can add a local health script to validate expected permissions:

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

- [ ] consistent permissions
- [ ] npm/pnpm cache outside of root
- [ ] bootstrap scripts for new devs
- [ ] automatic verification of ownership in local CI/devcontainer

Related:

- [`/blog/07-solving-docker-permission-issues-in-nodejs-projects-a-guide-to-overcoming-eacces-errors-in-volumes/`](/blog/07-solving-docker-permission-issues-in-nodejs-projects-a-guide-to-overcoming-eacces-errors-in-volumes/)
- [`/en/blog/30-cicd-con-github-actions-y-vps-desde-cero/`](/en/blog/30-cicd-con-github-actions-y-vps-desde-cero/)
- [`/blog/category/devops/`](/blog/category/devops/)
