---
title: "Disk cleanup seguro en Ubuntu para developers"
author: "Francisco Gonzalez"
description: "Checklist rapido para liberar espacio en Ubuntu sin romper tu entorno de desarrollo: diagnostico, limpieza y prevencion."
pubDate: 2026-04-26
tags: ["linux", "troubleshooting", "productivity"]
category: linux
translationKey: post-40
lang: es
---

Quedarte sin espacio en disco siempre pasa en el peor momento. La solucion no es borrar a ciegas; es limpiar con visibilidad.

## Caso practico guiado

Entorno real: laptop dev con 256GB, Docker, builds locales y grabaciones de pantalla. En dos semanas se consumieron 90GB sin que nadie notara exactamente por que.

Objetivo: recuperar espacio sin romper entorno.

## Paso 1: diagnostico

```bash
df -h
du -sh ~/* 2>/dev/null | sort -h
```

## Paso 2: fuentes comunes de consumo

- caches de package managers,
- imagenes/volumenes Docker viejos,
- archivos temporales gigantes,
- logs locales.

Comando util para Docker:

```bash
docker system df
docker system prune -af --volumes
```

## Paso 3: limpieza controlada

Haz limpieza gradual y valida despues de cada bloque.

## Reporte en TypeScript (opcional)

Si quieres automatizar visibilidad semanal:

```ts
import { execSync } from "node:child_process";

function run(cmd: string): string {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

const report = {
  disk: run("df -h /"),
  homeTop: run("du -sh ~/* 2>/dev/null | sort -h | tail -n 10"),
  docker: run("docker system df || true"),
};

console.log(JSON.stringify(report, null, 2));
```

## Prevencion

- mantenimiento mensual,
- alertas de espacio,
- politica de retencion para artefactos.

Relacionado:

- [`/blog/16-optimizing-disk-space-on-linux-and-program-to-run-one-time-a-month/`](/blog/16-optimizing-disk-space-on-linux-and-program-to-run-one-time-a-month/)
- [`/blog/33-linux-para-developers-checklist-mensual-mantenimiento/`](/blog/33-linux-para-developers-checklist-mensual-mantenimiento/)
- [`/blog/category/linux/`](/blog/category/linux/)
