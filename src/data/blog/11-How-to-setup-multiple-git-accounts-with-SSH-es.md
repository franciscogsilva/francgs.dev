---
title: "Configurar multiples cuentas Git con SSH"
author: "Francisco Gonzalez"
description: "Guia completa para manejar varias cuentas Git con llaves SSH en una sola maquina."
pubDate: 2024-02-05
image:
  url: "https://docs.astro.build/assets/full-logo-light.png"
  alt: "The full Astro logo."
tags: ["git", "security", "devops"]
category: git
translationKey: post-11
lang: es
---

<!-- # Como configurar multiples cuentas GIT con SSH -->

Cuando trabajas con varias cuentas Git (por ejemplo, personal y trabajo en GitHub/GitLab), gestionar llaves SSH diferentes puede ser confuso. Esta guia te muestra como configurarlo correctamente.

## Explicacion del problema

Necesitas usar distintas llaves SSH segun el repositorio o proveedor. Sin configuracion, Git no sabe cual llave usar para cada cuenta.

## Resumen de la solucion

La solucion es crear una llave por cuenta y configurar aliases en `~/.ssh/config` para que cada host use su llave correspondiente.

## Paso a paso

### Paso 1: Genera llaves SSH diferentes

1. **Cuenta personal GitHub**:

   ```bash
   ssh-keygen -t ed25519 -C "your_personal_email@example.com" -f ~/.ssh/id_ed25519_github_personal
   ```

   Reemplaza `your_personal_email@example.com` por tu email real.

2. **Cuenta trabajo GitHub**:

   ```bash
   ssh-keygen -t ed25519 -C "your_work_email@example.com" -f ~/.ssh/id_ed25519_github_work
   ```

3. **Cuenta trabajo GitLab**:

   ```bash
   ssh-keygen -t ed25519 -C "your_work_email_gitlab@example.com" -f ~/.ssh/id_ed25519_gitlab_work
   ```

### Paso 2: Agrega las llaves a cada cuenta

Sube cada llave publica (`.pub`) al proveedor correcto (GitHub o GitLab).

### Paso 3: Configura `~/.ssh/config`

Edita o crea `~/.ssh/config` con este contenido:

```bash
# Personal GitHub Account
Host github.com-personal
   HostName github.com
   User git
   IdentityFile ~/.ssh/id_ed25519_github_personal
   IdentitiesOnly yes

# Work GitHub Account
Host github.com-work
   HostName github.com
   User git
   IdentityFile ~/.ssh/id_ed25519_github_work
   IdentitiesOnly yes

# Work GitLab Account
Host gitlab.com-work
   HostName gitlab.com
   User git
   IdentityFile ~/.ssh/id_ed25519_gitlab_work
   IdentitiesOnly yes
```

### Paso 4: Clona usando aliases

- **Repo personal GitHub**:

  ```bash
  git clone git@github.com-personal:username/repository.git
  ```

- **Repo trabajo GitHub**:

  ```bash
  git clone git@github.com-work:username/repository.git
  ```

- **Repo trabajo GitLab**:

  ```bash
  git clone git@gitlab.com-work:username/repository.git
  ```

Reemplaza `username/repository.git` por el repositorio real.

### Paso 5: Verifica la configuracion

```bash
ssh -T git@github.com-personal
ssh -T git@github.com-work
ssh -T git@gitlab.com-work
```

Si todo esta bien, podras autenticarte con la llave correcta en cada alias.
