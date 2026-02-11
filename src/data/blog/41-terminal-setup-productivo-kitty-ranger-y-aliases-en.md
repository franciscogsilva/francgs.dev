---
title: "Productive Terminal Setup: Kitty, Ranger, and Aliases that Actually Help"
author: "Francisco Gonzalez"
description: "Set up a practical terminal stack for daily development with Kitty, Ranger, and useful aliases."
pubDate: 2026-04-27
tags: ["tools", "terminal", "productivity"]
category: tools
translationKey: post-41
lang: en
---

A well-configured terminal saves you hundreds of micro-frictions per week. But be careful: productivity is not filling with plugins, it is reducing repetitive steps.

## Guided practical case

Goal: lower the average time of repetitive tasks (git + docker + file browsing) by one week.

Plan:

1. measure more repeated commands,
2. create 8-10 high impact aliases,
3. validate actual use for 7 days,
4. remove dead aliases.

## Recommended minimum stack

- **Kitty** for performance and visual clarity.
- **Ranger** for quick file navigation.
- **Aliases** for frequent commands.

## Aliases with real impact

```bash
alias gs='git status -sb'
alias gp='git pull --rebase'
alias dc='docker compose'
alias ll='ls -lah'
```

## Bootstrap script in TypeScript (optional)

If you want to keep versioned aliases in repo:

```ts
import { appendFileSync } from "node:fs";

const aliases = [
  "alias gs='git status -sb'",
  "alias gp='git pull --rebase'",
  "alias dc='docker compose'",
  "alias ll='ls -lah'",
];

appendFileSync(process.env.HOME + "/.bash_aliases", `\n# team aliases\n${aliases.join("\n")}\n`);
console.log("Aliases updated");
```

Start with 5-10 aliases maximum. If you don't memorize them in 2 weeks, they are left over.

## Practical rule

Each tooling setting must respond:

1. What friction does it eliminate?
2. How much time does it save?
3. What complexity does it add?

If you can't answer those 3, don't add new tooling.
