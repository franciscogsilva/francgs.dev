---
title: "Git with Multiple SSH Accounts Without Conflicts"
author: "Francisco Gonzalez"
description: "Clean setup for personal and work Git identities using multiple SSH keys without authentication mistakes."
pubDate: 2026-04-23
tags: ["git", "security", "productivity"]
category: git
translationKey: post-37
lang: en
---
Working with a personal and corporate account on the same machine should not be a lottery. With a simple SSH hosting strategy, it becomes predictable.

## Guided practical case

Problem: accidental push to corporate repo with personal identity (or vice versa), poorly signed commits and PR blocked by policy.

Objective: separate identity, key and remote by context.

## Base configuration

At `~/.ssh/config`:

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

And on remotes:

```bash
git remote set-url origin git@github-work:org/repo.git
```

## Rules per repository

In each repo it defines explicit identity:

```bash
git config user.name "Francisco Gonzalez"
git config user.email "francisco@company.com"
```

Don't rely on `--global` for mixed environments.

## Verification in TypeScript (pre-push)

You can use a hook script to validate email domain before push:

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

## Good practices

- use commit signing by context,
- validate identity before push,
- document flow for the team.
- automate identity checks in hooks.

Related:

- [`/blog/11-how-to-setup-multiple-git-accounts-with-ssh/`](/blog/11-how-to-setup-multiple-git-accounts-with-ssh/)
- [`/blog/13-syncing-and-signing-commits-for-different-remotes-and-different-git-accounts-using-hooks-from-a-single-local-repository/`](/blog/13-syncing-and-signing-commits-for-different-remotes-and-different-git-accounts-using-hooks-from-a-single-local-repository/)
- [`/blog/category/git/`](/blog/category/git/)
