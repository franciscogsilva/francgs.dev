---
title: "De Senior Dev a Tech Lead: que cambia de verdad"
author: "Francisco Gonzalez"
description: "Transicion practica de senior developer a tech lead con foco en decisiones, alineacion de equipo y entrega sostenible."
pubDate: 2026-05-02
tags: ["engineering-culture", "leadership", "delivery", "team-management"]
category: engineering-culture
translationKey: post-46
lang: es
---

El salto a Tech Lead no es "programar menos". Es asumir que tu output principal deja de ser codigo individual y pasa a ser claridad de direccion, decisiones y desbloqueo del equipo.

## Caso practico guiado

Equipo: 6 devs, 1 QA, 1 PM. Problemas en el ultimo trimestre:

- PRs grandes y lentos,
- arquitectura inconsistente,
- deadlines incumplidos por cambios tardios de alcance.

Objetivo de 90 dias para el nuevo Tech Lead:

1. reducir tiempo de ciclo en 25%,
2. subir predictibilidad de sprint,
3. bajar retrabajo tecnico en features clave.

## Cambios reales de rol

- Pasas de "resolver tickets" a "resolver sistemas de trabajo".
- Tomas decisiones con tradeoffs explicitos (costo, riesgo, tiempo).
- Proteges foco del equipo: menos interrupciones, mejor priorizacion.
- Inviertes en multiplicadores: mentoring, standards, playbooks.

## Cadencia operativa recomendada

- Weekly architecture sync (30 min): decisiones abiertas y riesgo tecnico.
- Refinamiento con criterio de "Definition of Ready" real.
- Postmortem ligero por cada incidente relevante.
- 1:1 quincenal orientado a crecimiento y bloqueos.

Template corto para el architecture sync semanal:

```markdown
## Architecture Sync (30 min)

### 1) Decisiones pendientes
- [ ] Migrar cache local a Redis
- [ ] Definir estrategia de versionado API

### 2) Riesgos tecnicos
- Riesgo: latencia en endpoint de reportes
- Mitigacion: indice DB + paginacion por cursor

### 3) Acciones con owner
- Ana: ADR de versionado (viernes)
- Luis: benchmark de query pesada (miercoles)
```

## Checklist accionable

- [ ] Definir 3 metricas de salud del flujo (cycle time, WIP, defectos)
- [ ] Documentar decisiones importantes en ADRs cortos
- [ ] Establecer convenciones tecnicas no negociables por dominio
- [ ] Reservar bloques semanales para mentoring y pairing
- [ ] Revisar roadmap con PM segun capacidad real del equipo
