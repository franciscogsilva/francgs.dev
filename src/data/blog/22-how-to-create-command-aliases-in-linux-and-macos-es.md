---
title: "Como crear aliases de comandos en Linux y macOS"
author: "Francisco Gonzalez"
description: "Aprende a crear atajos de terminal para ejecutar comandos compuestos de forma rapida."
pubDate: 2025-03-11
image:
  url: "https://assets.francgs.dev/22-how-to-create-command-aliases-in-linux-and-macos.jpg"
  alt: "Linux and macOS terminal alias creation"
tags: ["linux", "terminal", "productivity"]
category: linux
translationKey: post-22
lang: es
---

Los aliases en Linux y macOS te permiten crear atajos para comandos frecuentes o largos. En esta guia veras como crear aliases temporales y permanentes.

## Introduccion

Si sueles ejecutar:

```bash
clear
ls -la
```

puedes combinarlos con un alias:

```bash
alias ll='clear && ls -la'
```

## Que es un alias en Unix

Un alias asigna un atajo personalizado a un comando o secuencia de comandos, mejorando fluidez en terminal.

## Alias temporal

Valido solo para la sesion actual:

```bash
alias alias_name='command1 && command2 && command3'
```

Ejemplo:

```bash
alias cls='clear && ls -la'
```

Ahora `cls` ejecuta ambos comandos.

## Alias permanente

Para mantener aliases entre sesiones, agregalos al archivo de configuracion de tu shell.

### Bash (Linux y macOS)

1. Edita `.bashrc` (Linux) o `.bash_profile` (macOS):

```bash
nano ~/.bashrc   # For Linux
nano ~/.bash_profile   # For macOS
```

2. Agrega:

```bash
alias cls='clear && ls -la'
```

3. Aplica cambios:

```bash
source ~/.bashrc   # For Linux
source ~/.bash_profile   # For macOS
```

### Zsh (macOS y algunas distros Linux)

1. Edita `.zshrc`:

```bash
nano ~/.zshrc
```

2. Agrega:

```bash
alias cls='clear && ls -la'
```

3. Aplica cambios:

```bash
source ~/.zshrc
```

## Consideraciones

- Usa comillas simples para evitar expansiones prematuras.
- Los aliases no aceptan parametros; para eso usa funciones de shell.

## Conclusion

Crear aliases mejora productividad y simplifica comandos repetitivos en Linux y macOS.
