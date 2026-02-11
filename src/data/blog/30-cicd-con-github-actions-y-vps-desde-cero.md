---
title: "CI/CD con GitHub Actions y VPS: pipeline real desde cero"
author: "Francisco Gonzalez"
description: "Guia practica para montar un pipeline CI/CD con GitHub Actions, despliegue a VPS y rollback operativo sin sobreingenieria."
pubDate: 2026-03-17
tags: ["devops", "github-actions", "linux", "security"]
category: devops
translationKey: post-30
lang: es
---

Un pipeline no es solo "hacer deploy automatico". Es reducir riesgo por release y mejorar tiempo de recuperacion cuando algo sale mal.

## Objetivo del pipeline

- build reproducible,
- validacion automatica,
- despliegue predecible,
- rollback claro.

## Flujo recomendado

1. Push a `main`.
2. Build + checks.
3. Deploy por SSH a VPS.
4. Restart controlado con PM2.
5. Health checks y monitoreo basico.

## Workflow base en GitHub Actions

Ejemplo minimo para build + deploy por SSH cuando hay push a `main`:

```yaml
name: ci-cd-vps

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.2.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            /var/www/app/scripts/deploy.sh
```

## Script de deploy en VPS

Separar el deploy en script evita comandos largos y reduce errores de shell dentro del workflow:

```bash
#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/app"
RELEASES_DIR="$APP_DIR/releases"
CURRENT_LINK="$APP_DIR/current"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"
NEW_RELEASE="$RELEASES_DIR/$TIMESTAMP"

mkdir -p "$NEW_RELEASE"
git -C "$APP_DIR" fetch origin main
git -C "$APP_DIR" archive origin/main | tar -x -C "$NEW_RELEASE"

cp "$APP_DIR/shared/.env" "$NEW_RELEASE/.env"
npm --prefix "$NEW_RELEASE" ci --omit=dev
npm --prefix "$NEW_RELEASE" run build

ln -sfn "$NEW_RELEASE" "$CURRENT_LINK"
pm2 startOrReload "$APP_DIR/shared/ecosystem.config.js" --update-env
```

## Smoke test post deploy

Un check simple evita dejar release rota como "exito":

```bash
#!/usr/bin/env bash
set -euo pipefail

URL="https://tu-dominio.com/health"

for i in {1..10}; do
  if curl -fsS "$URL" >/dev/null; then
    echo "health ok"
    exit 0
  fi
  sleep 3
done

echo "health failed"
exit 1
```

## Puntos de seguridad no negociables

- secrets solo en GitHub Secrets,
- claves SSH con permisos minimos,
- rotacion periodica de keys,
- headers de seguridad activos en app y nginx.

## Errores tipicos en VPS CI/CD

- `.env` mal generado por indentacion heredoc,
- dependencia instalada en runner pero no en servidor,
- restart sin verificar health,
- deploy que pisa artefactos sin versionado.

## Checklist de deploy seguro

- [ ] build limpio
- [ ] backup rapido de release anterior
- [ ] migraciones compatibles
- [ ] restart controlado
- [ ] smoke test de rutas criticas
