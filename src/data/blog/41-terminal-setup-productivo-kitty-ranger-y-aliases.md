---
title: "Terminal setup productivo: Kitty, Ranger y aliases que si ayudan"
author: "Francisco Gonzalez"
description: "Configura una terminal productiva para desarrollo diario con Kitty, Ranger y aliases utiles sin caer en sobreconfiguracion."
pubDate: 2026-04-27
tags: ["tools", "terminal", "productivity"]
category: tools
translationKey: post-41
lang: es
---

Una terminal bien configurada te ahorra cientos de micro-fricciones por semana. Pero ojo: productividad no es llenar de plugins, es reducir pasos repetitivos.

## Caso practico guiado

Meta: bajar el tiempo promedio de tareas repetitivas (git + docker + navegación de archivos) en una semana.

Plan:

1. medir comandos mas repetidos,
2. crear 8-10 aliases de alto impacto,
3. validar uso real por 7 dias,
4. eliminar aliases muertos.

## Stack minimo recomendado

- **Kitty** para rendimiento y claridad visual.
- **Ranger** para navegacion rapida de archivos.
- **Aliases** para comandos frecuentes.

## Aliases con impacto real

```bash
alias gs='git status -sb'
alias gp='git pull --rebase'
alias dc='docker compose'
alias ll='ls -lah'
```

## Bootstrap script en TypeScript (opcional)

Si quieres mantener aliases versionados en repo:

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

Empieza con 5-10 aliases maximo. Si no los memorizas en 2 semanas, sobran.

## Regla practica

Cada ajuste de tooling debe responder:

1. Que friccion elimina?
2. Cuanto tiempo ahorra?
3. Que complejidad agrega?

Si no puedes responder esas 3, no agregues tooling nuevo.
