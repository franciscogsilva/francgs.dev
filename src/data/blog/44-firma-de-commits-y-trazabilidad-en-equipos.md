---
title: "Firma de commits y trazabilidad en equipos sin friccion"
author: "Francisco Gonzalez"
description: "Como implementar firma de commits y politicas de trazabilidad que mejoran auditoria y confianza sin frenar al equipo."
pubDate: 2026-04-30
tags: ["git", "security", "team-workflow", "compliance"]
category: git
translationKey: post-44
lang: es
---

La firma de commits no es burocracia: es integridad de autor y de historia. Cuando llega un incidente, saber quien aprobó y quién integró un cambio deja de ser opcional.

## Caso practico guiado

Equipo de 8 personas, dos repos criticos y requirement de auditoria trimestral. Problema actual:

- commits sin autor verificable,
- squash merges sin referencia clara de PR,
- dificultad para reconstruir decisiones en incidentes.

Plan en 3 fases:

1. firma obligatoria en ramas protegidas,
2. convencion de mensajes + referencia a issue/PR,
3. reglas de CI para rechazar commits no verificados.

## Configuracion base

Firma con SSH (simple y portable):

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
```

Verificacion rapida:

```bash
git log --show-signature -1
```

## Politica de trazabilidad que si funciona

- Todo commit en `main` entra via PR.
- Cada PR referencia issue (`Closes #123`) y contexto de riesgo.
- Los merges conservan relacion con PR y autor (evitar flujos opacos).
- Hook/CI valida convencion de commit + firma verificada.

## Checklist accionable

- [ ] Activar firma de commits para todo el equipo
- [ ] Bloquear merge de commits no verificados en ramas protegidas
- [ ] Definir convencion de commit y referencia obligatoria a issue/PR
- [ ] Entrenar al equipo en `git log --show-signature`
- [ ] Auditar cada sprint un muestreo de trazabilidad end-to-end
