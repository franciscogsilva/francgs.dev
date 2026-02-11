---
title: "Git con multiples cuentas SSH sin conflictos"
author: "Francisco Gonzalez"
description: "Configura varias cuentas Git con SSH de forma limpia y mantenible para trabajar personal y corporativo sin errores de identidad."
pubDate: 2026-04-23
tags: ["git", "security", "productivity"]
category: git
translationKey: post-37
lang: es
---

Trabajar con cuenta personal y corporativa en la misma maquina no deberia ser una loteria. Con una estrategia simple de hosts SSH, se vuelve predecible.

## Caso practico guiado

Problema: push accidental al repo corporativo con identidad personal (o viceversa), commits mal firmados y PR bloqueado por policy.

Objetivo: separar identidad, clave y remote por contexto.

## Configuracion base

En `~/.ssh/config`:

```sshconfig
Host github-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal

Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
```

Y en remotes:

```bash
git remote set-url origin git@github-work:org/repo.git
```

## Reglas por repositorio

En cada repo define identidad explicita:

```bash
git config user.name "Francisco Gonzalez"
git config user.email "francisco@company.com"
```

No dependas del `--global` para entornos mixtos.

## Verificacion en TypeScript (pre-push)

Puedes usar un script en hook para validar dominio de email antes de push:

```ts
import { execSync } from "node:child_process";

const email = execSync("git config user.email").toString().trim();
const remote = execSync("git remote get-url origin").toString().trim();

const isWorkRepo = remote.includes("org/");
if (isWorkRepo && !email.endsWith("@company.com")) {
  throw new Error(`Email ${email} no permitido para remote ${remote}`);
}

console.log("Identity check OK");
```

## Buenas practicas

- usar commit signing por contexto,
- validar identidad antes de push,
- documentar flujo para el equipo.
- automatizar chequeos de identidad en hooks.

Relacionado:

- [`/blog/11-how-to-setup-multiple-git-accounts-with-ssh/`](/blog/11-how-to-setup-multiple-git-accounts-with-ssh/)
- [`/blog/13-syncing-and-signing-commits-for-different-remotes-and-different-git-accounts-using-hooks-from-a-single-local-repository/`](/blog/13-syncing-and-signing-commits-for-different-remotes-and-different-git-accounts-using-hooks-from-a-single-local-repository/)
- [`/blog/category/git/`](/blog/category/git/)
