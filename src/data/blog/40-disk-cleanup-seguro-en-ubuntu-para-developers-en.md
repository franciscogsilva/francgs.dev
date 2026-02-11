---
title: "Safe Disk Cleanup on Ubuntu for Developers"
author: "Francisco Gonzalez"
description: "Quick checklist to free up disk space on Ubuntu without breaking your development environment."
pubDate: 2026-04-26
tags: ["linux", "troubleshooting", "productivity"]
category: linux
translationKey: post-40
lang: en
---
Running out of disk space always happens at the worst time. The solution is not to delete blindly; It is cleaning with visibility.

## Guided practical case

Real environment: dev laptop with 256GB, Docker, local builds and screen recordings. In two weeks, 90GB were consumed without anyone noticing exactly why.

Objective: recover space without breaking the environment.

## Step 1: diagnosis

```bash
df -h
du -sh ~/* 2>/dev/null | sort -h
```

## Step 2: Common sources of consumption

- package manager caches,
- old Docker images/volumes,
- giant temporary files,
- local logs.

Useful command for Docker:

```bash
docker system df
docker system prune -af --volumes
```

## Step 3: controlled cleaning

Do gradual and valid cleaning after each block.

## Report in TypeScript (optional)

If you want to automate weekly visibility:

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

## Prevention

- monthly maintenance,
- space alerts,
- retention policy for artifacts.

Related:

- [`/blog/16-optimizing-disk-space-on-linux-and-program-to-run-one-time-a-month/`](/blog/16-optimizing-disk-space-on-linux-and-program-to-run-one-time-a-month/)
- [`/en/blog/33-linux-para-developers-checklist-mensual-mantenimiento/`](/en/blog/33-linux-para-developers-checklist-mensual-mantenimiento/)
- [`/blog/category/linux/`](/blog/category/linux/)
