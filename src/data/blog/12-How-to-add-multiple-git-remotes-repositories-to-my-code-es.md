---
title: "Como agregar multiples remotos Git en un repositorio"
author: "Francisco Gonzalez"
description: "Guia para conectar un mismo proyecto a varios remotos y sincronizar codigo sin friccion."
pubDate: 2024-02-05
image:
  url: "https://docs.astro.build/assets/full-logo-light.png"
  alt: "The full Astro logo."
tags: ["git", "devops"]
category: git
translationKey: post-12
lang: es
---

<!-- # Como agregar MULTIPLES repositorios remotos GIT a mi codigo -->

## Introduccion

Esta guia muestra como agregar y gestionar dos remotos diferentes dentro de un mismo proyecto Git local. Es util cuando quieres sincronizar codigo entre plataformas como GitHub y Bitbucket.

## Pasos

### 1. Abre tu terminal

Ubicate en el directorio de tu proyecto local.

### 2. Revisa los remotos existentes

```bash
git remote -v
```

### 3. Agrega el primer remoto

```bash
git remote add origin YOUR_GITHUB_REMOTE_URL
```

Reemplaza `YOUR_GITHUB_REMOTE_URL` por la URL real.

### 4. Agrega el segundo remoto

```bash
git remote add bitbucket YOUR_BITBUCKET_REMOTE_URL
```

Reemplaza `YOUR_BITBUCKET_REMOTE_URL` por la URL real.

### 5. Verifica que ambos remotos existan

Ejecuta de nuevo `git remote -v`.

### 6. Trabaja con cada remoto

Para hacer push a GitHub:

```bash
git push origin your-branch-name
```

Para Bitbucket:

```bash
git push bitbucket your-branch-name
```

### 7. Sincronizacion y conflictos

Cuando uses varios remotos, manten tus ramas sincronizadas haciendo `fetch` y `merge` con frecuencia para evitar conflictos.
