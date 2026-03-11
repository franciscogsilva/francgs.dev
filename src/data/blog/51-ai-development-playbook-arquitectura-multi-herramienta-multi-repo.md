---
title: "AI Development Playbook: Arquitectura Multi-Herramienta y Multi-Repo para Agentes de IA"
author: "Francisco Gonzalez"
description: "Guia completa y replicable para configurar desarrollo asistido por IA con AGENTS.md, rules, skills, progressive disclosure y el estandar Agent Skills. Compatible con Claude Code, Cursor, Copilot, OpenCode, Gemini CLI y 30+ herramientas. Validado con investigacion academica."
pubDate: 2026-03-10
tags: ["ai", "developer-tools", "productivity", "software-engineering", "typescript", "llm", "tools"]
category: ai
translationKey: post-51
lang: es
---

Los agentes de IA para programar (Claude Code, Cursor, Codex, Gemini CLI) son potentes por defecto, pero no saben NADA de tu proyecto. Sin contexto, un agente sugiere `axios` cuando tu proyecto usa `ky`, ejecuta `npm` cuando tu equipo usa `pnpm`, y genera estructuras planas cuando sigues Clean Architecture.

La solucion ingenua es meter un README enorme en el prompt. Pero la investigacion academica demuestra que **archivos de contexto inflados reducen el rendimiento del agente** (Gloaguen et al., ETH Zurich, 2026). El agente gasta mas tiempo procesando instrucciones que resolviendo el problema.

Este playbook resuelve ambos extremos: **muy poco contexto** (el agente adivina mal) y **demasiado contexto** (el agente se vuelve mas lento y caro). Es una guia replicable, agnostica al proyecto, validada contra investigacion academica y compatible con 30+ herramientas de IA.

## Tabla de Contenidos

0. [Fundamentos Teoricos — Por Que Existe Esta Arquitectura](#fundamentos-teoricos--por-que-existe-esta-arquitectura)
1. [Filosofia y Principios](#filosofia-y-principios)
2. [Vista General de la Arquitectura](#vista-general-de-la-arquitectura)
3. [Arquitectura de Persona en Dos Capas](#arquitectura-de-persona-en-dos-capas)
4. [Desglose Archivo por Archivo](#desglose-archivo-por-archivo)
5. [Guia de Setup Paso a Paso](#guia-de-setup-paso-a-paso)
6. [Creando Rules](#creando-rules)
7. [Creando Skills](#creando-skills)
8. [Configuracion Especifica por Herramienta](#configuracion-especifica-por-herramienta)
9. [Agregando Nuevos Repos y Tecnologias](#agregando-nuevos-repos-y-tecnologias)
10. [MCP Servers](#mcp-servers)
11. [Patrones de Prompt Engineering](#patrones-de-prompt-engineering)
12. [Token Economics y Efectividad de la IA](#token-economics-y-efectividad-de-la-ia)
13. [Consideraciones de Seguridad](#consideraciones-de-seguridad)
14. [Mejores Practicas LLM para 2026](#mejores-practicas-llm-para-2026)
15. [Investigacion: Realmente Ayudan los Archivos de Contexto?](#investigacion-realmente-ayudan-los-archivos-de-contexto)
16. [Script de Setup](#script-de-setup)
17. [Troubleshooting](#troubleshooting)
18. [Cheatsheet de Referencia Rapida](#cheatsheet-de-referencia-rapida)

---

## Fundamentos Teoricos — Por Que Existe Esta Arquitectura

> Lee esta seccion PRIMERO. Explica los problemas que esta arquitectura resuelve, los conceptos detras de cada decision de diseno, y la evidencia que los respalda.

### El Problema Central

Los agentes de IA para codificar (Claude Code, Codex, Cursor, Gemini, etc.) son potentes de fabrica, pero no saben NADA de TU proyecto. Sin guia, un agente va a:

- Sugerir `axios` cuando tu proyecto usa `ky`
- Usar `npm` cuando tu equipo impone `pnpm`
- Crear estructuras de archivos planas cuando sigues Clean Architecture
- Ignorar tus convenciones de nombres, patrones de testing y requisitos de seguridad
- Producir codigo que "funciona" pero no encaja en tu codebase

La solucion ingenua es meter un README masivo en el prompt. Pero la investigacion muestra que **archivos de contexto inflados REDUCEN el rendimiento del agente** (Gloaguen et al., 2026 — ver Seccion 15). El agente pasa mas tiempo procesando instrucciones que resolviendo el problema.

Esta arquitectura resuelve ambos extremos: **muy poco contexto** (el agente adivina mal) y **demasiado contexto** (el agente se vuelve mas lento y caro).

### Progressive Disclosure — El Patron de Diseno Central

El concepto mas importante en esta arquitectura. Tomado del diseno UX:

> **Progressive disclosure**: Muestra solo la informacion necesaria para la tarea actual. Revela detalles mas profundos bajo demanda.

Aplicado al contexto de IA, esto significa TRES niveles de informacion:

```
┌─────────────────────────────────────────────────────┐
│  TIER 1: Always-On (Hub)                            │
│  AGENTS.md — QUIEN soy? QUE stack? COMO codear?     │
│  ~1,000 tokens — carga en CADA interaccion          │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  TIER 2: Condicional (Rules)                  │  │
│  │  .claude/rules/*.md — patrones de codigo      │  │
│  │  ~500 tokens cada uno — carga por TIPO DE     │  │
│  │  ARCHIVO. TypeScript para .ts, React para .tsx│  │
│  │                                                │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  TIER 3: Bajo Demanda (Skills)          │  │  │
│  │  │  .claude/skills/*/SKILL.md              │  │  │
│  │  │  ~2,000-3,000 tokens cada uno           │  │  │
│  │  │  Carga SOLO cuando se solicita          │  │  │
│  │  │  "Carga el skill database-migration"    │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Por que importa**: Un request "arregla este typo" carga ~1,500 tokens de contexto. Un request "crea un nuevo modulo NestJS" carga ~4,500 tokens. Sin progressive disclosure, AMBOS requests cargarian ~15,000+ tokens — el set completo de rules y skills. Eso es 10x mas tokens para tareas simples, lo cual significa: mayor costo, respuestas mas lentas, y (segun la investigacion) PEOR precision.

### Prompt Caching — Por Que los Archivos Estables Ahorran Dinero

Los proveedores modernos de LLM cachean el inicio de tu prompt entre llamadas API:

| Proveedor | Mecanismo de Cache | Reduccion de Costo | Invalidacion |
|---|---|---|---|
| Anthropic | Caching automatico de prefijo | Hasta 90% en la porcion cacheada | Cualquier cambio al contenido |
| OpenAI | Automatico para prefijos identicos | 50% en tokens cacheados | Cualquier cambio al prefijo |
| Google | Automatico en serie Gemini 2.5 | Variable | Cualquier cambio al prefijo |

**Impacto en la arquitectura**: Tu persona, AGENTS.md, y rules se ubican al INICIO de cada prompt. Son estables — no cambian entre interacciones. Esto significa que se CACHEAN despues de la primera llamada, y las llamadas siguientes solo pagan por la parte volatil (tu pregunta actual + contexto de codigo).

**Regla practica**: Nunca modifiques archivos hub frivolamente. Cada edicion invalida el cache para cada interaccion subsiguiente. Haz cambios en lotes, no uno por uno.

### El Estandar Abierto Agent Skills

Desde 2025, **Agent Skills** (agentskills.io) es un estandar abierto adoptado por 30+ herramientas de codificacion con IA. El path canonico para skills es:

```
.claude/skills/skill-name/SKILL.md
```

A pesar del prefijo `.claude/`, este path NO es especifico de Claude. Se eligio porque Claude Code fue la primera herramienta grande en implementar skills, y el estandar adopto su path por compatibilidad. Las siguientes herramientas leen `.claude/skills/` nativamente:

| Lee `.claude/skills/` | Herramienta |
|---|---|
| ✅ | Claude Code, OpenCode, Cursor, GitHub Copilot |
| ✅ | JetBrains Junie, Gemini CLI, OpenAI Codex |
| ✅ | Roo Code, Amp, Goose, Mistral Vibe |
| ✅ | Factory, Databricks, Spring AI, Snowflake |
| ✅ | 15+ herramientas mas |

**Por que importa**: Escribe skills UNA VEZ, obten compatibilidad con 30+ herramientas. No necesitas directorios de skills especificos por herramienta.

### Skills 2.0 — Skills como Programas, No Instrucciones

Claude Code introdujo Skills 2.0 que trata los skills como unidades programables, no solo texto de instrucciones.

**Control de invocacion:**

| Configuracion | Tu puedes invocar | Claude puede invocar | Cuando se carga |
|---|---|---|---|
| (default) | ✅ Si | ✅ Si | Description siempre en contexto; skill completo al invocar |
| `disable-model-invocation: true` | ✅ Si | ❌ No | Description **NI** en contexto; skill solo al invocar tu |
| `user-invocable: false` | ❌ No | ✅ Si | Description siempre en contexto; skill cuando Claude decide |

**⚠️ Distincion importante**: `user-invocable: false` solo oculta el skill del menu `/` — NO bloquea la invocacion programatica via el Skill tool. Para prevenir completamente que Claude lo auto-invoque, usa `disable-model-invocation: true`.

**Todas las features de Skills 2.0:**

| Feature | YAML Frontmatter | Que Hace | Cuando Usarlo |
|---|---|---|---|
| **Solo usuario** | `disable-model-invocation: true` | Solo el usuario puede disparar via `/skill-name`. Description removida del contexto completamente. | Ops peligrosas: deploy, migracion, borrado de datos |
| **Conocimiento de fondo** | `user-invocable: false` | Claude auto-carga cuando es relevante. Oculto del menu `/` pero description en contexto. | Material de referencia: guias de estilo, contratos de API, contexto legacy |
| **Restriccion de tools** | `allowed-tools: Read, Grep, Glob` | El skill solo puede usar las herramientas listadas. Soporta `Bash(pattern *)` para shell restringido. | Skills de solo lectura: auditorias, analisis, revisiones |
| **Contexto forkeado** | `context: fork` | Corre en contexto SEPARADO — sin acceso al historial, no lo contamina. Solo un resumen retorna. | Workflows pesados: auditorias completas, scaffolding multi-archivo |
| **Tipo de subagente** | `agent: Explore` | Que subagente ejecuta un skill forkeado. Opciones: `Explore`, `Plan`, `general-purpose`, o custom. | Exploracion (Explore), diseno de arquitectura (Plan) |
| **Argumentos** | `$ARGUMENTS`, `$0`, `$1` | Acepta input: `/deploy staging` → `$1` = "staging". Se auto-agrega si no esta en el contenido. | Skills que necesitan parametros |
| **Hint de argumento** | `argument-hint: "[target]"` | Hint mostrado en autocompletado para UX. | Skills con argumentos, para descubrimiento |
| **Shell injection** | `` !`git diff` `` | Ejecuta comandos ANTES de que Claude vea el skill. Output reemplaza el placeholder (preprocesamiento). | Contexto dinamico: branch actual, PR diff, cambios recientes |
| **Directorio del skill** | `${CLAUDE_SKILL_DIR}` | Se resuelve al directorio del SKILL.md. Referencia scripts/archivos empaquetados. | Skills con scripts, templates, docs de referencia |
| **ID de sesion** | `${CLAUDE_SESSION_ID}` | ID de la sesion actual para logging o archivos por sesion. | Debugging, audit trails |
| **Override de modelo** | `model: claude-opus-4-6` | Fuerza un modelo especifico para este skill. | Skills complejos para el modelo mas fuerte, o simples para modelo rapido/barato |
| **Hooks de ciclo de vida** | `hooks: pre/post` | Ejecuta comandos antes/despues del skill. Automatico, sin aprobacion. | Pre: validacion. Post: notificaciones, cleanup |

**Ejemplo — un skill de deploy con Skills 2.0:**

```yaml
---
name: deploy
description: Deploy a staging o produccion
disable-model-invocation: true
context: fork
allowed-tools: Bash, Read
---

# Deploy Skill

Branch actual: !`git branch --show-current`
Ultimo commit: !`git log -1 --oneline`

Destino del deploy: $1 (staging o production)

## Steps
1. Verifica que todos los tests pasen
2. Build del proyecto
3. Deploy al entorno $1 usando el script en $CLAUDE_SKILL_DIR/scripts/deploy.sh
```

### MCP Servers — Extendiendo las Capacidades del Agente

Los servidores Model Context Protocol (MCP) dan a los agentes de IA acceso a servicios externos: documentacion, bases de datos, APIs, browsers, etc.

**Impacto en tokens**: Cada declaracion de herramienta MCP consume tokens (~50-200 por herramienta). Con muchos servidores MCP, la lista de herramientas sola puede consumir 2,000-5,000 tokens. Este es un costo OCULTO que la mayoria de developers ignora.

**Recomendacion**: Solo habilita MCPs que realmente uses. Un MCP de Context7 (busqueda de documentacion) casi siempre vale el costo. Un MCP de PostgreSQL solo vale si consultas la base de datos regularmente durante el desarrollo.

### Como se Conectan Estos Conceptos

```
                    ┌──────────────────┐
                    │  Prompt Caching   │
                    │  (ahorra dinero   │
                    │  en contexto      │
                    │  estable)         │
                    └────────┬─────────┘
                             │ prefijo cacheado
                             ▼
┌────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Capa Personal  │──│  Progressive     │──│  Agent Skills    │
│ (persona.md)   │  │  Disclosure      │  │  Standard        │
│ ~500 tokens    │  │  (3 tiers)       │  │  (30+ tools)     │
└────────────────┘  └────────┬─────────┘  └────────┬─────────┘
                             │                      │
                    ┌────────┴─────────┐   ┌───────┴──────────┐
                    │ Tier 1: Hub      │   │ Skills 2.0       │
                    │ Tier 2: Rules    │   │ (skills           │
                    │ Tier 3: Skills   │   │  programables     │
                    │                  │   │  para flujos      │
                    │                  │   │  avanzados)       │
                    └──────────────────┘   └──────────────────┘
```

**El flujo**: Tu persona (Capa 1) + hub del proyecto (Capa 2, Tier 1) se cachean por el proveedor LLM. Las rules (Tier 2) cargan condicionalmente por tipo de archivo. Los skills (Tier 3) cargan bajo demanda. Todos los skills usan el path del estandar Agent Skills asi que CUALQUIER herramienta puede descubrirlos. Skills 2.0 agrega programabilidad para workflows complejos.

**El resultado**: Costo minimo de tokens por interaccion, maxima relevancia de contexto, compatibilidad universal con herramientas, y (segun la investigacion) MEJOR rendimiento del agente que las alternativas infladas.

---

## Filosofia y Principios

### Diseno Agnostico a la Herramienta

La arquitectura se basa en un insight: **cada herramienta de codificacion con IA importante lee `AGENTS.md`**. Al hacer este el documento hub, obtienes compatibilidad entre herramientas sin mantener configs separadas para cada una.

| Herramienta | Lee AGENTS.md? | Config Primaria |
|---|---|---|
| OpenCode | ✅ Si | `AGENTS.md` + `opencode.json` |
| Claude Code | ❌ No (lee `CLAUDE.md`) | `CLAUDE.md` → referencia `AGENTS.md` |
| Cursor | ✅ Si | `AGENTS.md` + `.claude/rules/` (estandar Agent Skills) |
| GitHub Copilot | ✅ Si | `AGENTS.md` + `.github/instructions/` |
| JetBrains Junie | ✅ Si | `AGENTS.md` + `.claude/skills/` (estandar Agent Skills) |
| Gemini CLI | ✅ Si | `AGENTS.md` + `GEMINI.md` |
| Agent Skills (30+ tools) | Varia | `.claude/skills/*/SKILL.md` (estandar agentskills.io) |

**Estrategia**: Escribe contexto UNA VEZ en `AGENTS.md`, crea bridges delgados para herramientas que necesiten su propio archivo.

### Progressive Disclosure

No cada interaccion necesita cada pieza de contexto. La arquitectura usa tres niveles:

1. **Always-on (Hub)**: `AGENTS.md` — identidad del proyecto, stack, convenciones, estructura. Cada llamada LLM obtiene esto. Mantenlo CORTO (<150 lineas).
2. **Condicional (Rules)**: `.claude/rules/` — se carga segun los archivos editados via frontmatter `paths:`. Las rules de TypeScript cargan al editar `.ts`, las de React para `.tsx`, etc.
3. **Bajo demanda (Skills)**: `.claude/skills/` — guia detallada que se carga SOLO cuando se solicita explicitamente. 100-500 lineas de conocimiento profundo por skill. Compatible con el estandar abierto Agent Skills (agentskills.io, 30+ herramientas).

Este diseno minimiza el uso de tokens. Un simple "arregla este typo" no carga toda tu documentacion de design system.

### Repos Independientes, No Monorepo

Cada repositorio es autocontenido. Cuando alguien clona un repo individual, obtiene TODO el contexto de IA que necesita. Sin dependencia de un folder padre, configs compartidas, ni symlinks.

El `AGENTS.md` orquestador root es una conveniencia para desarrolladores que trabajan entre repos — proporciona el mapa del sistema y workflows cross-repo.

---

## Vista General de la Arquitectura

### Arbol de Archivos

```
~/.config/
├── opencode/
│   ├── AGENTS.md              # Persona global (todos los proyectos)
│   └── opencode.json          # Config global OpenCode (agent, MCP, plugins)
├── Claude/
│   └── AGENTS.md              # Persona global para Claude Code
│
workspace-root/                 # (opcional) Workspace multi-repo
├── AGENTS.md                   # Orquestador root — mapa de repos + workflows cross-repo
│
repo/
├── AGENTS.md                   # Hub — identidad del proyecto, stack, convenciones, indice de skills
├── CLAUDE.md                   # Bridge para Claude Code → referencia AGENTS.md
├── opencode.json               # Config de proyecto OpenCode → carga rules
├── .claude/
│   ├── rules/                  # Rules condicionales con scope por path
│   │   ├── typescript.md       # Patrones TS (carga para .ts/.tsx via frontmatter paths:)
│   │   ├── react-patterns.md   # Patrones React (carga para archivos .tsx)
│   │   ├── testing.md          # Rules de testing (carga para .spec.ts/.test.ts)
│   │   └── ...
│   └── skills/                 # Skills bajo demanda (estandar abierto Agent Skills — agentskills.io)
│       ├── skill-name/
│       │   ├── SKILL.md        # Frontmatter YAML + contenido detallado (requerido)
│       │   ├── scripts/        # Scripts de soporte (opcional)
│       │   ├── references/     # Docs de referencia (opcional)
│       │   └── assets/         # Templates, configs (opcional)
│       └── ...
```

### Flujo de Informacion

```
Persona Global (~/.config/*/AGENTS.md)
         │
         ▼
Orquestador Root (workspace/AGENTS.md)    ← solo para contexto multi-repo
         │
         ▼
Hub del Repo (repo/AGENTS.md)             ← siempre cargado
         │
         ├──▶ Rules (.claude/rules/*.md)  ← cargado por tipo de archivo (frontmatter paths:)
         │
         └──▶ Skills (.claude/skills/)    ← cargado por solicitud explicita (estandar Agent Skills)
```

### Config Merging (OpenCode)

OpenCode fusiona configuracion en este orden (el posterior sobreescribe al anterior):

```
Defaults remotos → Global (~/.config/opencode/) → Proyecto (repo/opencode.json)
```

Esto significa que la configuracion a nivel de proyecto sobreescribe la global. La global provee defaults.

---

## Arquitectura de Persona en Dos Capas

### El Problema

Cada herramienta de codificacion con IA lee archivos de persona/identidad desde una ubicacion DIFERENTE:

| Herramienta | Archivo de persona global |
|---|---|
| OpenCode | `~/.config/opencode/AGENTS.md` |
| Claude Code | `~/.config/Claude/AGENTS.md` |
| Gemini CLI / Antigravity | `~/.gemini/GEMINI.md` |
| Cursor | UI de Settings (sin mecanismo de archivo) |
| VS Code / Copilot | Referencia en `settings.json` |
| JetBrains | Solo a nivel de proyecto |

Mantener contenido identico en 3+ archivos es insostenible. Cada edicion requiere actualizar en todos lados.

### La Solucion: Una Fuente de Verdad + Symlinks

Crea UN archivo de persona y enlazalo simbolicamente a la ubicacion esperada de cada herramienta:

```
~/.config/ai/persona.md              ← LA fuente de verdad (edita solo aqui)
    ├── symlink → ~/.config/opencode/AGENTS.md
    ├── symlink → ~/.config/Claude/AGENTS.md
    └── symlink → ~/.gemini/GEMINI.md
```

**Comandos de setup:**

```bash
# Crea la fuente de verdad
mkdir -p ~/.config/ai
# Crea/edita ~/.config/ai/persona.md con tu persona

# Crea symlinks
mkdir -p ~/.config/opencode ~/.config/Claude ~/.gemini
ln -sf ~/.config/ai/persona.md ~/.config/opencode/AGENTS.md
ln -sf ~/.config/ai/persona.md ~/.config/Claude/AGENTS.md
ln -sf ~/.config/ai/persona.md ~/.gemini/GEMINI.md
```

Ahora editar `~/.config/ai/persona.md` actualiza TODAS las herramientas instantaneamente. Para Cursor y VS Code, pega o referencia el archivo manualmente (setup unico).

### Dos Capas: Personal vs. Proyecto

La arquitectura separa responsabilidades en dos capas:

```
CAPA 1: PERSONAL (tu maquina — te sigue en TODOS los proyectos)
─────────────────────────────────────────────────────────────────
~/.config/ai/persona.md
  ↳ QUIEN eres: identidad, personalidad, tono, filosofia
  ↳ COMO trabajas: preferencias CLI, comportamiento de herramientas, estilo de colaboracion
  ↳ ~500 tokens — carga en CADA llamada en CADA proyecto

CAPA 2: PROYECTO (cada repo — para cualquier developer o herramienta de IA)
─────────────────────────────────────────────────────────────────────────────
repo/AGENTS.md + .claude/rules/ + .claude/skills/
  ↳ QUE es el proyecto: stack, estructura, comandos
  ↳ COMO codear AQUI: patrones, convenciones, anti-patrones
  ↳ El costo de tokens escala por interaccion via progressive disclosure
```

**Por que dos capas?**

1. **Portabilidad**: Tu personalidad y estandares te siguen a CUALQUIER proyecto — contribuciones open source, repos nuevos, proyectos de clientes
2. **Consistencia**: La IA se comporta IGUAL en todos tus proyectos (mismo tono, mismo rigor, misma mentalidad de seguridad)
3. **Separacion de responsabilidades**: Preferencias personales (tono, filosofia) no contaminan los docs del proyecto. Las convenciones del proyecto no se repiten en cada archivo de persona
4. **Amigable con equipos**: La capa de proyecto se commitea a git — cada miembro del equipo y herramienta de IA obtiene el mismo contexto del proyecto. La capa personal se queda en TU maquina

### Que Va en Cada Capa

| Contenido | Capa Personal | Capa Proyecto |
|---|---|---|
| Personalidad/tono de la IA | ✅ | ❌ |
| Estilo de colaboracion | ✅ | ❌ |
| Preferencias de herramientas CLI | ✅ | ❌ |
| Mentalidad de seguridad (global) | ✅ | ❌ |
| Filosofia (KISS, 5 Whys) | ✅ | ❌ |
| Tech stack | ❌ | ✅ |
| Comandos del proyecto | ❌ | ✅ |
| Patrones de arquitectura | ❌ | ✅ |
| Convenciones de codigo | ❌ | ✅ |
| Rules OWASP (especificas del proyecto) | ❌ | ✅ |
| Skills (workflows) | ❌ | ✅ |

**Regla general**: Si seria igual en TODOS tus proyectos, es personal. Si cambia por repo, es de proyecto.

### Guias de Diseno para el Archivo de Persona

Basado en investigacion (ver Seccion 15), manten los archivos de persona **lean y conductuales**:

1. **Identidad + rol** (2-3 oraciones): Que sombrero de experto usar
2. **Principio central** (1 parrafo): La regla de comportamiento #1
3. **Tono/personalidad** (lista de puntos): Como comunicarse
4. **Filosofia** (lista de puntos): Framework de toma de decisiones
5. **Preferencias de herramientas** (tabla o lista): Herramientas CLI, uso de MCP

**Anti-patrones a evitar:**

- No incluyas informacion especifica del proyecto (stacks, comandos)
- No incluyas patrones de codificacion (esos van en rules)
- No incluyas parrafos largos de prosa (tablas y puntos son mas eficientes en tokens)
- No excedas ~500 tokens — esto carga en CADA interaccion

---

## Desglose Archivo por Archivo

### `AGENTS.md` (El Hub)

**Proposito**: Fuente unica de verdad para la identidad del proyecto. Cada herramienta de IA lo lee.

**Tamano objetivo**: 50-150 lineas. Esto carga en CADA interaccion — mantenlo lean.

**Secciones requeridas:**

```markdown
# nombre-del-proyecto — Descripcion en Una Linea

## Que Es Esto?
<!-- 2-3 oraciones: que hace, quien lo usa, donde corre -->

## Tech Stack
<!-- Formato tabla: capa, tecnologia, version -->

## Comandos
<!-- Tabla: comando → que hace -->

## Estructura del Proyecto
<!-- Arbol ASCII de src/ — solo los directorios clave -->

## Convenciones Clave
<!-- Lista de puntos: naming, patrones, anti-patrones -->

## Skills Disponibles
<!-- Lista de skills con descripciones de una linea -->
```

**Que NO poner aqui**: Detalles de implementacion, ejemplos de codigo, docs completos de API, specs de design system. Esos van en skills.

### `CLAUDE.md` (Bridge de Claude Code)

**Proposito**: Claude Code no lee `AGENTS.md` — lee `CLAUDE.md`. Este archivo es un bridge delgado.

**Template:**

```markdown
# nombre-del-proyecto — Titulo Breve

Lee AGENTS.md en este directorio para contexto completo del proyecto, convenciones y skills disponibles.

## Referencia Rapida
- **Stack**: [tecnologias clave]
- **Dev**: `pnpm dev` (puerto XXXX) | **Build**: `pnpm build`
- **Patron clave**: [decision arquitectonica mas importante]

## Rules Criticas
- [3-5 reglas mas importantes que DEBEN seguirse]
```

**Por que no simplemente duplicar AGENTS.md?** Porque entonces mantienes dos copias. El patron bridge significa que actualizas UNA VEZ en `AGENTS.md` y ambas herramientas lo ven.

### `opencode.json` (Config de Proyecto OpenCode)

**Proposito**: Decirle a OpenCode donde encontrar archivos de rules.

**Template:**

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    ".claude/rules/*.md"
  ]
}
```

OpenCode carga `AGENTS.md` automaticamente (recorriendo directorios hacia arriba). El array `instructions` agrega rules condicionales. Usar `.claude/rules/` significa que las mismas rules son leidas nativamente por Claude Code Y cargadas por OpenCode.

### `.claude/rules/*.md` (Rules Condicionales)

**Proposito**: Estandares de codificacion que aplican a tipos de archivo especificos. Se cargan automaticamente al editar archivos que coincidan.

**Convencion de nombres**: `tecnologia-o-concern.md` — ej., `typescript.md`, `react-patterns.md`, `testing.md`, `database.md`

**Tamano objetivo**: 30-80 lineas por archivo de rule. Estos cargan automaticamente — no los infles.

**Frontmatter YAML con scope `paths:`** (feature nativa de Claude Code):

```yaml
---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---
```

Rules con `paths:` solo cargan cuando Claude Code (u OpenCode via instructions) trabaja en archivos que coinciden. Esto reduce desperdicio de tokens.

**Template:**

```markdown
---
paths:
  - "{glob-pattern}"
---

# Nombre de la Rule

## Patrones a Seguir
<!-- Lista numerada de patrones concretos con snippets breves de codigo -->

## Anti-Patrones
<!-- Que NO hacer, con explicacion breve del POR QUE -->
```

### `.claude/skills/*/SKILL.md` (Skills Bajo Demanda)

**Proposito**: Guia detallada y profunda para workflows complejos. Se carga SOLO cuando se solicita explicitamente.

**Tamano**: 100-500 lineas. Los skills pueden ser exhaustivos porque se cargan bajo demanda.

**Path**: `.claude/skills/` — este es el path canonico para el **estandar abierto Agent Skills** (agentskills.io), soportado nativamente por 30+ herramientas incluyendo Claude Code, OpenCode, Cursor, GitHub Copilot, JetBrains Junie, Gemini CLI, y mas.

**El frontmatter YAML es REQUERIDO** (entre marcadores `---`). Todos los campos son tecnicamente opcionales, pero `name` y `description` son **fuertemente recomendados** por la guia oficial de Anthropic:

| Campo | Requerido? | Notas |
|---|---|---|
| `name` | Fuertemente recomendado | Kebab-case, max 64 chars. Si se omite, usa el nombre del directorio. La guia oficial lo trata como requerido para skills de calidad. |
| `description` | Fuertemente recomendado | Max 1024 chars, no XML (`< >`). Si se omite, usa el primer parrafo del contenido. **Debe incluir QUE hace + CUANDO usarlo (trigger phrases).** |
| `argument-hint` | Opcional | Mostrado en autocompletado: `[numero-de-issue]`, `[archivo] [formato]` |

```markdown
---
name: nombre-del-skill
description: Que hace este skill. Usar cuando el usuario pide [frases de trigger especificas].
---

# Titulo del Skill

## Rol y Proposito
<!-- Que rol toma la IA cuando este skill se carga -->

## Workflow Paso a Paso
<!-- Instrucciones detalladas, templates, checklists -->

## Ejemplos
<!-- Ejemplos concretos de codigo, patrones -->

## Errores Comunes
<!-- Que vigilar -->
```

**Guia de tamano**: Manten SKILL.md bajo 500 lineas. Mueve material de referencia detallado a archivos separados en `references/`.

**Reglas criticas** (de la guia oficial de Anthropic):
- SKILL.md debe ser **exactamente** `SKILL.md` (case-sensitive)
- Carpeta en **kebab-case**: `mi-skill` ✅, `Mi Skill` ❌, `mi_skill` ❌
- No `README.md` dentro de la carpeta del skill
- No `claude` o `anthropic` en el nombre del skill (reservados)
- El campo `description` es el **mecanismo de triggering** — Claude lee TODAS las descriptions al inicio de cada sesion para decidir que skills cargar

#### Features de Skills 2.0 (Claude Code)

Claude Code Skills 2.0 agrega capacidades poderosas. La tabla de control de invocacion es CLAVE:

| Configuracion | Tu invocas | Claude invoca | Carga de contexto |
|---|---|---|---|
| (default) | ✅ Si | ✅ Si | Description siempre en contexto; skill completo al invocar |
| `disable-model-invocation: true` | ✅ Si | ❌ No | Description **NI** en contexto; skill solo al invocar tu |
| `user-invocable: false` | ❌ No | ✅ Si | Description siempre en contexto; skill cuando Claude decide |

**⚠️ Distincion importante**: `user-invocable: false` solo oculta del menu `/` — NO bloquea invocacion programatica. Para prevenir completamente la auto-invocacion, usa `disable-model-invocation: true`.

**Todas las features:**

| Feature | Sintaxis | Que Hace | Cuando Usarlo |
|---|---|---|---|
| **Solo usuario** | `disable-model-invocation: true` | Solo tu puedes disparar via `/skill-name`. Description removida del contexto. | Ops peligrosas: deploy, migracion, borrado |
| **Conocimiento de fondo** | `user-invocable: false` | Claude auto-carga cuando relevante. Oculto del menu `/`. | Guias de estilo, contratos de API, contexto legacy |
| **Restriccion de tools** | `allowed-tools: Read, Grep, Glob` | Solo puede usar herramientas listadas. Soporta `Bash(pattern *)`. | Skills de solo lectura: auditorias, analisis |
| **Contexto forkeado** | `context: fork` | Contexto SEPARADO — sin historial, no contamina. Resumen retorna. | Auditorias completas, scaffolding multi-archivo |
| **Tipo de subagente** | `agent: Explore` | Que subagente ejecuta el fork. Opciones: `Explore`, `Plan`, `general-purpose`, custom. | Exploracion, diseno de arquitectura |
| **Argumentos** | `$ARGUMENTS`, `$0`, `$1` | Acepta input: `/deploy staging` → `$1` = "staging". Auto-agrega si no esta en contenido. | Skills con parametros |
| **Hint de argumento** | `argument-hint: "[target]"` | Hint en autocompletado. Puramente UX. | Skills con argumentos |
| **Shell injection** | `` !`git diff` `` | Ejecuta ANTES de que Claude vea el skill. Output reemplaza placeholder. | Branch actual, PR diff, cambios recientes |
| **Directorio del skill** | `${CLAUDE_SKILL_DIR}` | Resuelve al directorio del SKILL.md. | Scripts, templates, docs empaquetados |
| **ID de sesion** | `${CLAUDE_SESSION_ID}` | ID de sesion actual para logging. | Debugging, audit trails |
| **Override de modelo** | `model: claude-opus-4-6` | Fuerza modelo especifico. | Skills complejos o simples segun necesidad |
| **Hooks de ciclo** | `hooks: pre/post` | Comandos antes/despues. Automatico. | Pre: validacion. Post: notificaciones |

**Skill con archivos de soporte:**

```
skill-name/
├── SKILL.md           # Instrucciones principales (requerido)
├── references/
│   └── REFERENCE.md   # Docs detallados cargados bajo demanda
├── scripts/
│   └── validate.sh    # Script que la IA puede ejecutar
└── assets/
    └── template.md    # Templates para llenar
```

---

## Guia de Setup Paso a Paso

### Prerequisitos

- Uno o mas repositorios git
- Herramientas de codificacion con IA instaladas (OpenCode, Claude Code, Cursor, etc.)
- Acceso a terminal

### Setup Global (Una Vez)

> **Recomendado**: Usa `setup-ai-tools.sh --global` (ver Seccion 16) para automatizar todo este proceso. Pasos manuales abajo como referencia.

**Paso 1: Crea la persona global (una fuente de verdad)**

```bash
mkdir -p ~/.config/ai
# Crea tu archivo de persona — ver Seccion 3.5 para guias de diseno
nano ~/.config/ai/persona.md
```

**Paso 2: Crea symlinks a todas las herramientas**

```bash
# OpenCode
mkdir -p ~/.config/opencode
ln -sf ~/.config/ai/persona.md ~/.config/opencode/AGENTS.md

# Claude Code
mkdir -p ~/.config/Claude
ln -sf ~/.config/ai/persona.md ~/.config/Claude/AGENTS.md

# Gemini CLI
mkdir -p ~/.gemini
ln -sf ~/.config/ai/persona.md ~/.gemini/GEMINI.md
```

Ahora TODAS las herramientas leen la misma persona. Edita una vez en `~/.config/ai/persona.md`, cada herramienta ve la actualizacion al instante.

**Paso 3: Configura OpenCode globalmente** (si usas OpenCode)

```bash
cat > ~/.config/opencode/opencode.json << 'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "enabled": true
    }
  }
}
EOF
```

### Setup Por Repositorio

**Paso 1: Crea el hub**

```bash
# En el root de tu repo
touch AGENTS.md
# Escribe el documento hub siguiendo el template de la seccion anterior
```

**Paso 2: Crea el bridge de Claude Code**

```bash
touch CLAUDE.md
# Escribe el bridge siguiendo el template
```

**Paso 3: Crea la config de proyecto OpenCode**

```bash
cat > opencode.json << 'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    ".claude/rules/*.md"
  ]
}
EOF
```

**Paso 4: Crea el directorio de rules y archivos de rules**

```bash
mkdir -p .claude/rules
# Crea archivos de rules con frontmatter paths: segun tu tech stack:
# - typescript.md (si usas TypeScript)
# - react-patterns.md (si usas React)
# - testing.md (si tienes tests)
# - database.md (si tienes base de datos)
```

**Paso 5: Crea el directorio de skills y skills**

```bash
mkdir -p .claude/skills/skill-name
# Crea SKILL.md con frontmatter YAML (name + description requeridos)
```

**Paso 6: (Opcional) Crea el orquestador root para workspaces multi-repo**

```bash
# En el root de tu workspace (padre de todos los repos)
touch AGENTS.md
# Escribe el orquestador con el mapa de repos y workflows cross-repo
```

### Checklist de Verificacion

Despues del setup, verifica:

- [ ] `AGENTS.md` en el root del repo — bajo 150 lineas, tiene todas las secciones requeridas
- [ ] `CLAUDE.md` en el root del repo — referencia AGENTS.md, tiene rules criticas
- [ ] `opencode.json` en el root del repo — JSON valido, apunta a `.claude/rules/*.md`
- [ ] `.claude/rules/*.md` — cada uno bajo 80 lineas, tiene frontmatter `paths:` para scope por tipo de archivo
- [ ] `.claude/skills/*/SKILL.md` — cada uno tiene frontmatter YAML con `name` y `description`
- [ ] Sin contenido duplicado entre AGENTS.md y rules/skills
- [ ] Sin secretos ni credenciales en ningun archivo de contexto

---

## Creando Rules

### Cuando Crear una Rule vs. un Skill

| Usa una RULE cuando... | Usa un SKILL cuando... |
|---|---|
| La guia siempre es relevante para un tipo de archivo | La guia es para un workflow especifico |
| Es menor a 80 lineas | Es mayor a 80 lineas |
| Es sobre estandares/patrones de codigo | Es sobre un proceso complejo (migracion, auditoria, scaffold) |
| Ejemplo: "siempre usa return types explicitos" | Ejemplo: "como crear un nuevo modulo NestJS end-to-end" |

### Principios de Diseno de Rules

1. **Se concreto**: "Usa `readonly` en todos los parametros de funcion" es mejor que "prefiere inmutabilidad"
2. **Muestra el patron**: Incluye un snippet de codigo de 3-5 lineas para cada patron
3. **Explica el POR QUE**: "Por que? Porque las relaciones lazy de TypeORM fallan silenciosamente sin tipado explicito"
4. **Incluye anti-patrones**: Muestra que NO hacer — los LLMs aprenden de contra-ejemplos
5. **Mantenlo DRY**: Si una rule aplica a todos los repos, ponla en el AGENTS.md global, no en las rules de cada repo

### Ejemplo: Rule de TypeScript

```markdown
# Patrones TypeScript

## Cuando Aplica
Todos los archivos `.ts` y `.tsx` en este proyecto.

## Patrones

1. **Return types explicitos en funciones exportadas**
   ```typescript
   // ✅ Bien
   export function calculateScore(answers: Answer[]): number { ... }

   // ❌ Mal — los return types inferidos filtran detalles de implementacion
   export function calculateScore(answers: Answer[]) { ... }
   ```

2. **Usa `readonly` para parametros de funcion**
   ```typescript
   // ✅ Bien
   function processItems(readonly items: Item[]): Result { ... }
   ```

3. **Uniones discriminadas sobre flags booleanos**
   ```typescript
   // ✅ Bien
   type LoadState = { status: 'idle' } | { status: 'loading' } | { status: 'error'; error: Error }

   // ❌ Mal
   type LoadState = { isLoading: boolean; error?: Error }
   ```

## Anti-Patrones
- NUNCA uses `any` — usa `unknown` y estrecha con type guards
- NUNCA uses aserciones de tipo `as` — usa predicados de tipo o checks en runtime
- NUNCA uses `@ts-ignore` — usa `@ts-expect-error` con explicacion
```

---

## Creando Skills

### Donde Viven los Skills

Los skills pueden existir en cuatro niveles. Los de mayor prioridad ganan cuando comparten nombre:

| Nivel | Path | Aplica a | Prioridad |
|---|---|---|---|
| Enterprise | Managed settings (deploy por admin) | Todos los usuarios de la org | Mas alta |
| Personal | `~/.claude/skills/<nombre>/SKILL.md` | Todos tus proyectos en esta maquina | Alta |
| Proyecto | `.claude/skills/<nombre>/SKILL.md` | Solo este proyecto | Normal |
| Plugin | `<plugin>/skills/<nombre>/SKILL.md` | Donde el plugin este habilitado | Namespaced |

**Precedencia**: Enterprise > Personal > Proyecto. Los skills de plugins usan namespace `plugin-name:skill-name`, asi que nunca entran en conflicto.

### Estructura del Skill

Cada skill sigue este patron:

```
.claude/skills/
└── skill-name/
    ├── SKILL.md              # Requerido — instrucciones principales (max 500 lineas)
    ├── scripts/              # Opcional — codigo ejecutable (Python, Bash, etc.)
    ├── references/           # Opcional — docs detallados (cargados bajo demanda)
    └── assets/               # Opcional — templates, fonts, iconos, configs
```

El archivo SKILL.md DEBE tener frontmatter YAML entre marcadores `---`. Todos los campos son tecnicamente opcionales, pero `name` y `description` son **fuertemente recomendados** (la guia oficial de Anthropic los trata como requeridos para skills de calidad):

```yaml
---
name: nombre-del-skill
description: Que hace este skill. Usar cuando el usuario pide [frases de trigger].
---
```

**Reglas criticas** (de la guia oficial de Anthropic):
- SKILL.md debe ser **exactamente** `SKILL.md` (case-sensitive)
- Carpeta en **kebab-case**: `mi-skill` ✅, `Mi Skill` ❌, `mi_skill` ❌
- `name`: kebab-case, sin espacios/mayusculas, max 64 chars, debe coincidir con nombre de carpeta
- `description`: max 1024 chars, NO XML (`< >`), debe incluir QUE + CUANDO
- No `README.md` dentro de la carpeta del skill
- No `claude` o `anthropic` en el nombre del skill (reservados)

### Principios de Diseno de Skills

1. **Un skill = un workflow**: No combines "migracion de DB" y "auditoria de seguridad API" en un skill
2. **Empieza con rol/proposito**: Dile al LLM que sombrero de experto usar
3. **Paso a paso > parrafos**: Los LLMs siguen pasos numerados mejor que prosa
4. **Incluye templates**: Provee templates copy-paste para archivos, bloques de codigo, configs
5. **Incluye checklists**: Termina con un checklist de validacion contra el cual el LLM pueda auto-auditarse
6. **Referencia cruzada, no dupliques**: Si dos skills comparten contenido, referencia el otro skill en vez de copiar-pegar
7. **Se especifico y accionable**: "Ejecuta `python scripts/validate.py`" es mejor que "valida los datos"
8. **Incluye manejo de errores**: Documenta fallas comunes y que hacer al respecto
9. **Progressive disclosure dentro del skill**: Manten SKILL.md enfocado, mueve docs detallados a `references/`

### Template de Skill

```markdown
---
name: mi-skill
description: Que hace este skill. Usar cuando el usuario pide [trigger 1], [trigger 2], o [trigger 3].
argument-hint: "[argumento-opcional]"
---

# Titulo del Skill

## Rol y Proposito
Eres un experto [rol]. Tu trabajo es [proposito].

## Prerequisitos
- [Que debe existir antes de usar este skill]

## Workflow Paso a Paso

### Paso 1: [Primera cosa]
[Instrucciones con ejemplos de codigo]

### Paso 2: [Segunda cosa]
[Instrucciones con ejemplos de codigo]

## Templates

### [Nombre del Template]
```typescript
// Codigo del template aqui
```

## Checklist de Validacion
- [ ] [Check 1]
- [ ] [Check 2]
- [ ] [Check 3]

## Errores Comunes
- [Error 1]: [Por que esta mal y que hacer en su lugar]

## Troubleshooting
Error: [Mensaje de error comun]
Causa: [Por que pasa]
Solucion: [Como arreglarlo]

## Recursos Adicionales
- Para referencia detallada, ver [reference.md](reference.md)
```

### Referenciando Skills

Los skills se cargan explicitamente por el usuario o la herramienta de IA. Patrones comunes de invocacion:

| Herramienta | Como Cargar un Skill |
|---|---|
| OpenCode | `/skill skill-name` |
| Claude Code | `/skill-name` o "Carga el skill clean-architecture" |
| Cursor | Auto-descubierto de `.claude/skills/` (estandar Agent Skills) |
| GitHub Copilot | Auto-descubierto de `.claude/skills/` (estandar Agent Skills) |
| JetBrains Junie | Auto-descubierto de `.claude/skills/` (estandar Agent Skills) |
| Gemini CLI | Referencia en conversacion |

---

## Configuracion Especifica por Herramienta

### OpenCode

**Config global**: `~/.config/opencode/opencode.json`

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-anthropic-auth"],
  "autoupdate": true,
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "enabled": true
    }
  },
  "agent": {
    "mi-agente": {
      "mode": "primary",
      "description": "Descripcion del agente",
      "prompt": "Tu system prompt del agente aqui",
      "tools": {
        "write": true,
        "edit": true
      }
    }
  }
}
```

**Config de proyecto**: `repo/opencode.json`

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    ".claude/rules/*.md"
  ]
}
```

**Puntos clave:**

- OpenCode recorre directorios hacia arriba para encontrar `AGENTS.md` — lee TODOS (proyecto + global)
- Config se fusiona: remoto → global → proyecto
- Agentes custom definidos en bloque `agent` con `mode`, `description`, `prompt`, `tools`
- Los agentes custom tambien pueden ser archivos `.md` en `.opencode/agents/` (mas limpio que JSON inline)
- El array `instructions` acepta patrones glob y URLs
- OpenCode tambien lee `.claude/skills/` como fallback para el estandar Agent Skills

### Claude Code

**Config global**: `~/.config/Claude/AGENTS.md`

- Mismo contenido que la persona global de OpenCode
- Claude Code lee `CLAUDE.md` en el root del proyecto, NO `AGENTS.md`
- El patron bridge de `CLAUDE.md` resuelve esto referenciando `AGENTS.md`
- **Carga nativa de rules**: `.claude/rules/*.md` con frontmatter `paths:` para scope por tipo de archivo
- **Carga nativa de skills**: `.claude/skills/*/SKILL.md` — descubiertos automaticamente
- **Skills 2.0**: Soporta `context: fork`, `disable-model-invocation`, `allowed-tools`, `$ARGUMENTS`, shell injection, y mas

### Cursor

Cursor lee `AGENTS.md` nativamente y soporta el estandar Agent Skills:

- Rules: lee `.claude/rules/` via el estandar Agent Skills
- Skills: lee `.claude/skills/` via el estandar Agent Skills

**Recomendacion**: No mantengas `.cursor/rules/` separados — deja que Cursor lea `AGENTS.md` y `.claude/`. Solo crea rules especificas de Cursor si es absolutamente necesario.

### GitHub Copilot

Copilot lee `AGENTS.md` nativamente y soporta el estandar Agent Skills:

- Rules/skills: lee `.claude/skills/` via el estandar Agent Skills

**Recomendacion**: Confia en `AGENTS.md` + `.claude/` como fuente primaria. Solo crea `.github/instructions/` para comportamiento especifico de Copilot.

### Otras Herramientas (Estandar Agent Skills)

Las siguientes herramientas soportan el estandar abierto Agent Skills (agentskills.io) y leen `.claude/skills/`:

- JetBrains Junie
- Gemini CLI
- OpenAI Codex
- Roo Code, Amp, Goose
- Mistral Vibe, Factory, Databricks
- Spring AI, Snowflake
- Y 15+ mas

**Es por esto que `.claude/skills/` es el path canonico** — un set de skills funciona en 30+ herramientas.

---

## Agregando Nuevos Repos y Tecnologias

### Agregando un Nuevo Repositorio

1. **Crea la estructura de archivos:**

   ```bash
   cd nuevo-repo
   touch AGENTS.md CLAUDE.md opencode.json
   mkdir -p .claude/rules .claude/skills
   ```

2. **Escribe AGENTS.md** usando el template de la seccion anterior. Analiza tu repo:
   - Que framework/lenguaje?
   - Que patron de arquitectura?
   - Que comandos ejecutar?
   - Que convenciones seguir?

3. **Escribe CLAUDE.md** usando el template bridge

4. **Crea opencode.json** apuntando a `.claude/rules/*.md`

5. **Crea rules** en `.claude/rules/` segun tu tech stack:
   - Cada repo obtiene un `typescript.md` (si TypeScript) con frontmatter `paths:`
   - Agrega rules especificas de framework (`react-patterns.md`, `nestjs-patterns.md`, etc.)
   - Agrega rules de concerns (`testing.md`, `database.md`, etc.)

6. **Crea skills** en `.claude/skills/` para workflows complejos especificos de este repo

7. **Actualiza el orquestador root** `AGENTS.md` (si usas workspace multi-repo):
   - Agrega el repo a la tabla de mapa de repos
   - Agregalo al diagrama de arquitectura del sistema
   - Documenta cualquier relacion cross-repo
   - Agrega sus skills a la tabla de skills por repo

### Agregando una Nueva Tecnologia a un Repo Existente

1. **Actualiza AGENTS.md**: Agrega la tecnologia a la tabla de tech stack
2. **Crea una rule** en `.claude/rules/` si la tecnologia tiene patrones de codigo que valgan la pena imponer (ej., `redis-patterns.md`)
3. **Crea un skill** en `.claude/skills/` si la tecnologia tiene setup/workflow complejo (ej., skill `redis-caching`)
4. **Actualiza rules existentes** si la tecnologia las afecta (ej., agregar Redis puede afectar `testing.md`)

### Removiendo una Tecnologia

1. **Remueve de AGENTS.md** tech stack
2. **Elimina rules asociadas** de `.claude/rules/`
3. **Elimina skills asociados** de `.claude/skills/`
4. **Actualiza el orquestador root** si es relevante

---

## MCP Servers

### Que Son los MCPs?

Los servidores Model Context Protocol (MCP) extienden tu herramienta de IA con capacidades externas — busqueda de documentacion, busqueda web, acceso a APIs, consultas a bases de datos, y mas.

### Agregando un MCP a OpenCode

En `~/.config/opencode/opencode.json` (global) o `repo/opencode.json` (proyecto):

```json
{
  "mcp": {
    "nombre-del-server": {
      "type": "remote",
      "url": "https://mcp-server-url.com/mcp",
      "enabled": true
    }
  }
}
```

Para servidores MCP locales (basados en stdio):

```json
{
  "mcp": {
    "nombre-del-server": {
      "type": "local",
      "command": ["npx", "-y", "@mcp-package/server"],
      "enabled": true
    }
  }
}
```

### MCPs Recomendados

| MCP | Proposito | URL |
|---|---|---|
| **Context7** | Busqueda de documentacion de librerias | `https://mcp.context7.com/mcp` |
| **Playwright** | Automatizacion/testing de browser | Local: `npx @anthropic/mcp-playwright` |
| **PostgreSQL** | Consultas a base de datos | Local: `npx @anthropic/mcp-postgres` |

### Agregando un MCP a Claude Code

Claude Code usa una configuracion de MCP diferente. Revisa `.claude/settings.json` o la documentacion de Claude Code para la sintaxis actual.

---

## Patrones de Prompt Engineering

### Diseno de System Prompt (Persona Global)

**Estructura tu prompt de persona como:**

1. **Identidad**: Quien es la IA? (ej., "tech lead experto")
2. **Mentalidad**: Como debe pensar? (ej., "criticamente, evitando sobre-ingenieria")
3. **Estandares**: Que barra de calidad mantener? (ej., "TypeScript strict, no any")
4. **Anti-patrones**: Que NUNCA hacer? (ej., "nunca usar console.log")

**Insight clave**: Los LLMs siguen instrucciones negativas ("nunca hagas X") mas confiablemente que positivas ("siempre haz Y"). Incluye AMBAS, pero prioriza anti-patrones para rules criticas.

### Diseno de Documentos de Contexto (AGENTS.md)

**Lo que funciona bien:**

- Tablas sobre parrafos para datos estructurados
- Arte ASCII para diagramas de arquitectura (los LLMs los parsean bien)
- Listas de puntos para convenciones
- Snippets de codigo para patrones (3-5 lineas maximo)
- Arboles de archivos para estructura del proyecto

**Lo que no funciona:**

- Parrafos largos de prosa (los LLMs pierden los puntos clave)
- Instrucciones vagas ("escribe buen codigo")
- Demasiados ejemplos (elige el UNICO mejor ejemplo)
- Headers anidados mas profundos que H3 (la estructura se pierde)

### Invocacion de Skills

Cuando le pides a una IA que use un skill, se explicito:

```
# ✅ Bien
Carga el skill database-migration y crea una migracion para agregar una columna "last_login" a la tabla users.

# ❌ Mal
Crea una migracion para last_login.
```

La version explicita asegura que el contexto del skill se cargue y aplique.

### Tareas Multi-Paso

Para tareas complejas, usa un prompt estructurado:

```
## Objetivo
[Lo que quieres lograr]

## Contexto
[Que existe ahora, que se ha hecho antes]

## Restricciones
[Que reglas seguir, que NO hacer]

## Pasos
1. [Primer paso]
2. [Segundo paso]
3. [Paso de verificacion]
```

---

## Token Economics y Efectividad de la IA

Esta seccion responde: **Esta arquitectura REALMENTE hace a los agentes de IA mas efectivos? Cual es el impacto medible?**

### El Costo del Contexto

Cada token en tus archivos de contexto consume parte de la ventana de contexto del LLM. Contexto inflado = menos espacio para codigo real, respuestas de menor calidad, y mayores costos de API. Pero SIN contexto = el agente adivina tus convenciones, usa paquetes equivocados, y produce codigo que "funciona" pero no encaja en tu proyecto.

El objetivo no es CERO contexto — es el contexto CORRECTO en el momento CORRECTO.

### Presupuestos de Tokens por Tipo de Archivo

| Archivo | Presupuesto de Tokens | Cuando Carga | Impacto en Costo |
|---|---|---|---|
| Persona global | ~500 tokens | CADA llamada, cada proyecto | Alta frecuencia × bajo costo = moderado |
| AGENTS.md (hub) | ~1,000 tokens | Cada llamada en este proyecto | Alta frecuencia × costo moderado = significativo |
| Rules (cada una) | ~500 tokens | Solo al editar archivos que coincidan | Frecuencia baja-media × bajo costo = bajo |
| Skills (cada uno) | ~2,000-3,000 tokens | SOLO por solicitud explicita | Frecuencia rara × costo moderado = despreciable |
| Bridge CLAUDE.md | ~300 tokens | Cada llamada (solo Claude Code) | Alta frecuencia × costo trivial = trivial |

**Progressive disclosure ahorra 60-80% de tokens por interaccion** comparado con cargar todo por adelantado. Una interaccion tipica "arregla este bug" carga: persona (500) + hub (1,000) + 1 rule que coincida (500) = **~2,000 tokens**. Sin progressive disclosure, cargarias TODAS las rules + TODOS los skills = **~8,000-15,000 tokens**.

### Impacto Medido en la Precision de la IA

Basado en investigacion academica (Gloaguen et al., 2026 — ver Seccion 15) y experiencia en produccion:

| Metrica | Sin Contexto | Contexto Inflado (auto-generado) | Contexto Lean (esta arquitectura) |
|---|---|---|---|
| Resolucion de tareas | Baseline | -2% a -3% (peor) | +4% (mejor, escrito por humanos) |
| Costo de inferencia | Baseline | +20-23% | +5-10% (estimado, progressive disclosure) |
| Cumplimiento de convenciones | ❌ El agente adivina | ✅ Sigue instrucciones | ✅ Sigue instrucciones |
| Conformidad arquitectonica | ❌ El agente usa defaults | ⚠️ Puede sobre-explorar | ✅ Guia dirigida |
| Postura de seguridad | ❌ Sin awareness OWASP | ⚠️ Awareness generico | ✅ Rules especificas del proyecto |
| Consistencia de paquetes | ❌ Puede sugerir paquetes incorrectos | ⚠️ Depende del contenido | ✅ "Usa Ky, no axios" |

**Insight clave de la investigacion**: Los archivos de contexto NO ayudan a los agentes a encontrar archivos mas rapido (ya son buenos en eso). Lo que SI ayudan:

1. **Imposicion de convenciones** — los agentes siguen instrucciones cuando las reciben
2. **Guia de tooling** — "usa pnpm", "usa uv" reduce comandos fallidos
3. **Prevencion de errores** — "TypeORM 0.3.x lazy relations necesitan tipado explicito" previene bugs
4. **Brechas de conocimiento** — mas valioso para proyectos con poca documentacion o frameworks nicho

### Cuando los Archivos de Contexto Perjudican (y Como Evitarlo)

La investigacion es clara: los archivos de contexto perjudican cuando:

| Anti-Patron | Por Que Perjudica | Nuestra Mitigacion |
|---|---|---|
| Overview del repo con listado de directorios | El agente ya descubre la estructura; agrega ruido | El hub NO tiene listados de directorios |
| Duplicado del contenido del README | Redundante = tokens desperdiciados + info conflictiva | El hub es PRESCRIPTIVO, no descriptivo |
| Auto-generado via `/init` | -2 a -3% degradacion de rendimiento | Siempre escrito por humanos |
| Archivo monolitico con todas las rules | 20%+ aumento de costo por interaccion | Progressive disclosure via rules/skills |
| Instrucciones vagas ("escribe buen codigo") | Sin senal accionable para el agente | Patrones concretos + anti-patrones |

### Estrategia de Deduplicacion

**Problema**: El mismo contenido (colores del design system, rules de TypeScript) copiado en N repos = Nx desperdicio de tokens.

**Solucion:**

- **Persona global** captura estandares cross-proyecto (calidad, mentalidad de seguridad)
- **Rules por repo** capturan SOLO lo especifico del tech stack de ese repo
- **Skills** manejan contenido detallado — cargado bajo demanda, no siempre

**Ejemplo**: En vez de poner la paleta de colores completa en las rules de cada repo, crea un SKILL `design-system` que se carga solo cuando se trabaja en UI.

### Escribiendo Contexto Conciso

```markdown
# ❌ Demasiado verboso (desperdicia tokens, diluye la senal)
Cuando trabajes con TypeScript en este proyecto, es muy importante que siempre
te asegures de usar return types explicitos en todas las funciones que se exportan
de los modulos. Esto es porque la inferencia de tipos de TypeScript, aunque poderosa,
a veces puede llevar a ensanchamientos o estrechamientos de tipo inesperados que causan
problemas downstream.

# ✅ Conciso (misma informacion, mayor relacion senal-ruido)
**Return types explicitos en todas las funciones exportadas** — previene fugas de inferencia de tipos.
```

### Sinergia con Prompt Caching

La mayoria de proveedores de LLM cachean prefijos de contexto estables:

- **Anthropic**: Hasta 90% de reduccion de costo en prefijos cacheados
- **OpenAI**: 50% de descuento en tokens cacheados
- **Google**: Automatico en modelos de la serie 2.5

Tu arquitectura maximiza el caching manteniendo las partes estables (persona + hub + rules) constantes entre interacciones. Solo la parte volatil (prompt del usuario + contexto de codigo) cambia. **Nunca modifiques archivos hub frivolamente** — cada edicion invalida el cache para cada interaccion subsiguiente.

---

## Consideraciones de Seguridad

### Que NO Poner en Archivos de Contexto

Los archivos de contexto (AGENTS.md, rules, skills) se commitean a git. NUNCA incluyas:

- API keys, tokens, o passwords
- Strings de conexion a bases de datos
- URLs internas o direcciones IP
- Datos de clientes o PII
- Secretos de produccion de cualquier tipo

### Integracion OWASP

Esta arquitectura incluye estandares de seguridad OWASP en multiples niveles:

1. **Persona global**: Referencia OWASP Top 10 2025 (Web) y OWASP API Security Top 10 2023 — para que la IA siempre considere implicaciones de seguridad
2. **Skill de backend** (`security-audit-api`): Checklist completo de auditoria de seguridad API basado en OWASP API Security Top 10
3. **Skills de frontend** (`owasp-client-security`): Patrones de seguridad del lado del cliente — prevencion de XSS, CSP, manejo de tokens, seguridad DOM
4. **Rules por repo**: Incrustan patrones de seguridad directamente en las rules de codificacion (ej., "siempre sanitiza input del usuario" en la rule de base de datos)

### Seguridad de Supply Chain (OWASP A03 2025)

Nuevo en OWASP 2025 — y especialmente relevante para desarrollo asistido por IA:

- **Slopsquatting**: Los LLMs a veces alucinan nombres de paquetes. Los atacantes registran esos nombres con codigo malicioso. SIEMPRE verifica que los paquetes sugeridos por la IA realmente existan y sean legitimos antes de instalarlos.
- **Lock files**: Siempre commitea `pnpm-lock.yaml` / `package-lock.json`. Revisa cambios en lock files en los PRs.
- **Auditoria regular**: Ejecuta `pnpm audit` / `npm audit` como parte del CI.

---

## Mejores Practicas LLM para 2026

### Seleccion de Modelo

A marzo de 2026:

- **Arquitectura/diseno complejo**: Claude Opus 4, GPT-4.5, Gemini 2.5 Pro
- **Codificacion dia a dia**: Claude Sonnet 4, GPT-4.1, Gemini 2.5 Flash
- **Ediciones rapidas/tareas simples**: Claude Haiku 3.5, GPT-4.1 mini, Gemini 2.5 Flash-Lite

Asocia el modelo a la tarea. No uses Opus para renombrar una variable.

### Gestion de Ventana de Contexto

| Modelo | Ventana de Contexto | Limite Efectivo |
|---|---|---|
| Claude Opus 4 | 200K tokens | ~150K usables (deja espacio para output) |
| Claude Sonnet 4 | 200K tokens | ~150K usables |
| GPT-4.1 | 1M tokens | ~800K usables |
| Gemini 2.5 Pro | 1M tokens | ~800K usables |

**Regla general**: Manten tu contexto total (persona + AGENTS.md + rules + conversacion) bajo el 50% de la ventana de contexto para mejor calidad.

### Edicion Multi-Archivo

Las herramientas de IA modernas pueden editar multiples archivos en un solo turno. Estructura tus requests para aprovechar:

```
# ✅ Bien — ediciones paralelas
Crea un nuevo componente UserProfile, agregalo al router, y actualiza el menu de navegacion.

# ❌ Mal — requests seriales
1. "Crea el componente UserProfile" → esperar
2. "Ahora agregalo al router" → esperar
3. "Ahora actualiza el menu de nav" → esperar
```

### Code Review con IA

La IA sobresale en code review cuando se le dan criterios claros:

```
Revisa este PR para:
1. Issues de OWASP API Security (especialmente BOLA y broken auth)
2. Performance de queries TypeORM (N+1, indices faltantes)
3. Error handling faltante
4. Breaking changes al contrato OpenAPI
```

### Cosas a Vigilar

1. **APIs alucinadas**: Los LLMs a veces inventan firmas de funciones que no existen. Siempre verifica contra los docs reales de la libreria (usa Context7 MCP para esto).
2. **Patrones desactualizados**: Los datos de entrenamiento tienen un corte. Los LLMs pueden sugerir patrones deprecados. Usa Context7 o docs oficiales para verificar.
3. **Sobre-abstraccion**: A los LLMs les encanta crear abstracciones. Rechaza si una funcion simple seria suficiente.
4. **Calidad de tests**: Los LLMs escriben tests que pasan pero no verifican comportamiento real. Revisa las aserciones de tests manualmente.
5. **Puntos ciegos de seguridad**: Los LLMs pueden no senalar riesgos de inyeccion o issues de control de acceso a menos que se les diga explicitamente. Incluye seguridad en tus prompts de revision.
6. **Slopsquatting** (ver seccion anterior): Verifica cada sugerencia de `pnpm add`.

---

## Investigacion: Realmente Ayudan los Archivos de Contexto?

### Vista General del Paper

**"Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?"** — Gloaguen et al., ETH Zurich, febrero 2026 ([arXiv:2602.11988](https://arxiv.org/abs/2602.11988))

Este es el primer estudio academico riguroso sobre si los archivos de contexto (AGENTS.md, CLAUDE.md) realmente mejoran el rendimiento de los agentes de codificacion con IA. Los investigadores probaron 4 agentes de codificacion (Claude Code + Sonnet 4.5, Codex + GPT-5.2, Codex + GPT-5.1 mini, Qwen Code + Qwen3-30b) en dos benchmarks: SWE-bench Lite (300 tareas, repos populares) y AGENTbench (138 tareas de 12 repos con archivos de contexto escritos por desarrolladores).

### Hallazgos Clave

| Hallazgo | Detalle |
|---|---|
| **Los archivos de contexto generados por LLM PERJUDICAN el rendimiento** | -0.5% en SWE-bench Lite, -2% en AGENTbench (promedio entre agentes) |
| **Los escritos por humanos ayudan MARGINALMENTE** | +4% mejora promedio en AGENTbench |
| **Todos los archivos de contexto aumentan el costo** | +20-23% aumento en costo de inferencia |
| **Los archivos NO funcionan como overviews del repo** | Los agentes no encuentran archivos relevantes mas rapido |
| **Los archivos SON documentacion redundante** | Cuando los docs existentes se ELIMINAN, los archivos generados por LLM mejoran el rendimiento +2.7% |
| **Las instrucciones SI se siguen** | Los agentes respetan las instrucciones. El problema no es cumplimiento — es que las instrucciones hacen las tareas MAS DIFICILES |
| **Modelos mas fuertes no generan mejores archivos** | Usar GPT-5.2 para generar archivos para otros agentes no ayudo consistentemente |

### Evaluacion Critica: Por Que Este Paper No Invalida Nuestra Arquitectura

El titular del paper ("los archivos de contexto reducen el rendimiento") es tecnicamente preciso pero enganoso si se aplica sin critica a TODAS las arquitecturas de archivos de contexto. Aqui esta por que nuestra arquitectura sobrevive a sus hallazgos:

#### 1. Probaron archivos INFLADOS. Nosotros usamos LEAN.

Los archivos generados por LLM del paper promediaron **641 palabras con 9.7 secciones** — esencialmente un dump completo del overview del repositorio. Su hallazgo clave: "requisitos innecesarios hacen las tareas mas dificiles." Eso es exactamente contra lo que disenamos:

| Su enfoque | Nuestro enfoque |
|---|---|
| AGENTS.md monolitico (641 palabras promedio, ~9.7 secciones) | Hub AGENTS.md (<150 lineas) + rules condicionales + skills bajo demanda |
| Overview del repo con listado de directorios | SIN listados de directorios (el paper PROBO que no ayudan) |
| Todo el contexto cargado en cada interaccion | Progressive disclosure — rules cargan por tipo de archivo, skills bajo demanda |
| Contenido generado por LLM (auto `/init`) | Contenido escrito por humanos, curado |

La propia conclusion del paper soporta nuestro diseno: **"los archivos de contexto escritos por humanos deberian describir solo requisitos minimos."** Eso es literalmente nuestra arquitectura.

#### 2. Midieron RESOLUCION DE TAREAS. Nosotros optimizamos CALIDAD DE CODIGO.

El paper mide: "el agente produjo un parche que pasa los tests?" Esa es una metrica de exito binaria. NO mide:

- **Consistencia de estilo de codigo** en un equipo
- **Conformidad arquitectonica** (ej., limites de Clean Architecture)
- **Postura de seguridad** (cumplimiento OWASP)
- **Convenciones de nombres** y patrones del proyecto
- **Mejores practicas especificas de framework** (patrones NestJS, patrones React)

Los archivos de contexto son mas valiosos para asegurar que el agente escriba codigo CORRECTAMENTE PARA TU PROYECTO, no solo codigo que pase tests.

#### 3. Probaron repos Python. Nosotros usamos TypeScript/Node.

El paper explicitamente reconoce esta limitacion: "Python esta ampliamente representado en los datos de entrenamiento, asi que mucho conocimiento detallado sobre tooling podria estar presente en el conocimiento parametrico de los modelos." Su benchmark es 100% Python.

TypeScript/Node.js tiene:

- Mas convenciones especificas de framework (NestJS vs. Express vs. Fastify)
- Mas estructuras de proyecto opinionadas (Clean Architecture, feature-based, etc.)
- Mas complejidad de build tools (Vite, esbuild, SWC, etc.)
- Mas enfoques de estilos (Tailwind v4 vs. CSS-in-JS vs. CSS modules)

Los archivos de contexto son MAS valiosos cuando el agente necesita saber CUAL de muchos enfoques validos usa TU proyecto.

#### 4. Probaron resolucion GENERICA de tareas. Nosotros codificamos CONOCIMIENTO DE EQUIPO.

Las tareas del paper son issues de GitHub de repos arbitrarios — el agente no tiene relacion previa con el codebase. En la realidad, los archivos de contexto codifican conocimiento institucional:

- "Usamos Ky, no axios" (evita que el agente sugiera el HTTP client equivocado)
- "Las lazy relations de TypeORM 0.3.27 requieren tipado explicito" (previene un bug)
- "Usa `pnpm`, nunca `npm`" (previene lockfiles rotos)

Estos no son "requisitos innecesarios que hacen las tareas mas dificiles" — son guardas que previenen que el agente introduzca deuda tecnica.

#### 5. Su "aumento de costo" es una feature, no un bug (parcialmente).

El paper muestra que los archivos de contexto aumentan tokens de razonamiento 10-22% y costo total 20%. Pero tambien encontraron: "los archivos de contexto llevan a testing y exploracion mas exhaustivos." Para codebases de produccion, MAS testing es BUENO. El issue es cuando la exploracion es inutil (leer estructuras de directorios ya conocidas). Nuestra arquitectura minimiza la exploracion inutil manteniendo el hub lean y cargando detalles bajo demanda.

### Que Deberiamos Cambiar Basandonos en Este Paper

El paper valida varias practicas y advierte contra otras:

**Validado (seguir haciendo):**

- ✅ Mantener AGENTS.md bajo 150 lineas (sus datos muestran que archivos inflados perjudican)
- ✅ Escrito por humanos sobre generado por LLM (mejora marginal vs. degradacion marginal)
- ✅ Progressive disclosure (no cargar todo en cada llamada)
- ✅ No incluir overviews de repo con listados de directorios (probado inutil)
- ✅ Enfocarse en restricciones conductuales ("usa pnpm"), no contenido descriptivo ("el proyecto tiene 4 modulos")

**Cambiado basado en hallazgos:**

- ⚠️ **Nunca uses `/init` ni auto-generes archivos de contexto** — el paper prueba que son netos negativos. Siempre escribelos manualmente.
- ⚠️ **Audita archivos hub por "requisitos innecesarios"** — si una instruccion no previene un error concreto, eliminala.
- ⚠️ **No dupliques lo que esta en el README** — los archivos de contexto son mas valiosos cuando la documentacion es escasa.

**Preguntas abiertas:**

- Los resultados diferirian para proyectos TypeScript/Node.js? (el paper solo probo Python)
- Progressive disclosure (rules con frontmatter `paths:`) cambiaria la relacion costo/rendimiento? (el paper probo archivos monoliticos unicamente)
- Las features de Skills 2.0 (`context: fork`, `allowed-tools`) mitigarian el aumento de costo? (no probado)

### La Linea de Fondo

Los hallazgos del paper son CONSISTENTES con nuestra arquitectura, no contradictorios. Su conclusion — "los archivos de contexto escritos por humanos deberian describir solo requisitos minimos" — es exactamente lo que construimos. El insight clave es:

> **Los archivos de contexto deben ser PRESCRIPTIVOS (haz esto, no hagas esto) en vez de DESCRIPTIVOS (el proyecto tiene X, Y, Z). Los agentes pueden descubrir la estructura por si mismos. Lo que no pueden descubrir son las convenciones, preferencias y lecciones ganadas a pulso de tu equipo.**

---

## Script de Setup

### Vista General

`setup-ai-tools.sh` es un script de shell que automatiza el setup completo de la arquitectura de dos capas. Maneja deteccion de OS, deteccion de herramientas, creacion de persona, gestion de symlinks, y scaffolding a nivel de proyecto.

### Uso

```bash
# Modo interactivo (pregunta que configurar)
./setup-ai-tools.sh

# Solo configurar persona global + symlinks
./setup-ai-tools.sh --global

# Solo configurar archivos de proyecto en el directorio actual
./setup-ai-tools.sh --project

# Escanear subdirectorios y configurar cada proyecto encontrado
./setup-ai-tools.sh --workspace

# Global + proyecto actual
./setup-ai-tools.sh --all

# Global + workspace (todos los proyectos en subdirectorios) — la opcion "haz todo"
./setup-ai-tools.sh --full
```

### Que Hace

**Setup global (`--global`):**

1. Detecta OS (Linux/macOS)
2. Detecta herramientas de IA instaladas: OpenCode, Claude Code, Cursor, VS Code, Copilot, JetBrains, Gemini CLI, Antigravity
3. Crea `~/.config/ai/persona.md` con un template por defecto (si no existe archivo de persona)
4. Crea symlinks del archivo de persona a la ubicacion esperada de cada herramienta detectada
5. Imprime instrucciones manuales para herramientas que no soportan personas basadas en archivo (Cursor, VS Code)

**Setup de workspace (`--workspace`):**

1. Escanea subdirectorios del folder actual buscando manifiestos de proyecto (package.json, pyproject.toml, go.mod, Cargo.toml, pom.xml, Gemfile)
2. Ejecuta setup de proyecto en CADA proyecto detectado automaticamente
3. Perfecto para workspaces multi-repo — ejecuta una vez, configura todos los proyectos

**Setup de proyecto (`--project`):**

1. Crea directorios `.claude/rules/` y `.claude/skills/`
2. Crea `AGENTS.md` (template hub con seccion de Filosofia de Desarrollo)
3. Crea `CLAUDE.md` (bridge)
4. Crea `GEMINI.md` (bridge)
5. Crea `opencode.json` (apuntando a `.claude/rules/*.md`)
6. Crea `.github/copilot-instructions.md` (si VS Code/Copilot detectado)
7. Crea `.junie/guidelines.md` (si JetBrains detectado)

### Deteccion de Herramientas

El script detecta 7 categorias de herramientas:

| Herramienta | Metodo de Deteccion |
|---|---|
| OpenCode | Binario `opencode` O directorio `~/.config/opencode/` |
| Claude Code | Binario `claude` O directorio `~/.config/Claude/` |
| Cursor | Binario `cursor` O directorio de app/config |
| VS Code | Binario `code` |
| Copilot | Check de extension VS Code (`github.copilot`) |
| JetBrains | Binarios de IDE O directorio de config |
| Gemini CLI | Binario `gemini` O directorio `~/.gemini/` |
| Antigravity | Directorio `~/.gemini/antigravity/` |

### Idempotente por Diseno

El script es seguro de ejecutar multiples veces:

- Los archivos de persona existentes NO se sobreescriben sin confirmacion
- Los symlinks existentes se detectan y saltan
- Los archivos de proyecto existentes (AGENTS.md, CLAUDE.md, etc.) NO se sobreescriben
- Los archivos existentes se respaldan antes de reemplazo (sufijo `.bak`)

---

## Troubleshooting

### OpenCode No Carga las Rules

**Sintoma**: La IA no sigue tus rules o parece no conocer el contexto del proyecto.

**Verifica:**

1. `opencode.json` tiene JSON valido (sin comas finales, sin comentarios)
2. El array `instructions` apunta a archivos existentes: `".claude/rules/*.md"`
3. `AGENTS.md` existe en el root del repo
4. `~/.config/opencode/AGENTS.md` global existe

### Claude Code No Ve el Contexto

**Sintoma**: Claude Code ignora las convenciones del proyecto.

**Verifica:**

1. `CLAUDE.md` existe en el root del repo (NO `AGENTS.md` — Claude Code lee `CLAUDE.md`)
2. `~/.config/Claude/AGENTS.md` existe para contexto global
3. `CLAUDE.md` referencia `AGENTS.md` para que no mantengas dos archivos

### Skills No Disponibles

**Sintoma**: El comando `/skill` no encuentra tu skill.

**Verifica:**

1. El skill esta en `.claude/skills/skill-name/SKILL.md` (path exacto — este es el estandar Agent Skills)
2. El frontmatter YAML tiene ambos campos `name` y `description`
3. El frontmatter usa delimitadores `---` (no ` ```yaml `)
4. El nombre del directorio del skill coincide con el campo `name` en el frontmatter (lowercase kebab-case)

### Config Rompe OpenCode

**Sintoma**: OpenCode no arranca despues de cambios en la config.

**Verifica:**

1. Valida JSON: `cat opencode.json | python3 -m json.tool`
2. Remueve cualquier clave de config no reconocida (OpenCode puede crashear con claves desconocidas)
3. Verifica config global: `~/.config/opencode/opencode.json`

**Issue conocido**: Agregar un bloque `"provider"` con claves custom como `"setCacheKey"` puede crashear OpenCode si no es una opcion de configuracion reconocida. Usa solo claves de config documentadas.

### Rules Duplicadas/Conflictivas

**Sintoma**: La IA se confunde con instrucciones contradictorias.

**Solucion:**

1. Busca duplicados: `rg "patron" .claude/ AGENTS.md CLAUDE.md`
2. Manten UNA fuente de verdad — usualmente en rules para patrones de codigo, AGENTS.md para convenciones
3. La persona global NO deberia repetir rules especificas del repo

---

## Cheatsheet de Referencia Rapida

### Propositos de Archivos

```
AGENTS.md        → Identidad del proyecto (QUIEN soy, QUE stack, COMO codear aqui)
CLAUDE.md        → Bridge para Claude Code → lee AGENTS.md
opencode.json    → Config OpenCode → carga rules
.claude/rules/   → Patrones de codigo (cargados por tipo de archivo via frontmatter paths:)
.claude/skills/  → Guia profunda de workflow (cargada bajo demanda — estandar Agent Skills)
```

### Agregando Cosas

| Quieres agregar... | Haz esto |
|---|---|
| Nuevo repo | Crea AGENTS.md + CLAUDE.md + opencode.json + .claude/ en el root del repo |
| Nueva coding rule | Agrega `.claude/rules/rule-name.md` con frontmatter `paths:` (bajo 80 lineas) |
| Nuevo skill | Crea `.claude/skills/skill-name/SKILL.md` con frontmatter YAML |
| Nuevo MCP | Agrega al bloque `mcp` en `opencode.json` |
| Nueva herramienta de IA | Verifica si lee AGENTS.md o el estandar Agent Skills. Si no, crea un archivo bridge. |
| Workflow cross-repo | Documenta en el orquestador root `AGENTS.md` |

### Presupuestos de Tokens

```
Persona global:   ~500 tokens   (cada llamada, cada proyecto)
Hub AGENTS.md:    ~1,000 tokens (cada llamada, este proyecto)
Archivo de rule:  ~500 tokens   (condicional, por tipo de archivo)
Skill:            ~2,000 tokens (solo bajo demanda)
```

### Comandos

```bash
# Verificar config JSON
python3 -m json.tool < opencode.json

# Encontrar contenido duplicado en archivos de contexto
rg "patron" .claude/ AGENTS.md CLAUDE.md

# Contar tokens (estimacion: 1 token ≈ 4 chars)
wc -c AGENTS.md  # dividir entre 4 para estimacion de tokens

# Listar todos los skills
find .claude/skills -name "SKILL.md" -exec head -4 {} \;
```

---

## Conclusion

Esta arquitectura resuelve un problema real: los agentes de IA son poderosos pero ciegos al contexto de tu proyecto. La solucion no es inundarlos con informacion (eso los empeora), sino darles el contexto CORRECTO en el momento CORRECTO.

Los principios clave:

1. **Progressive Disclosure**: Hub lean siempre cargado, rules condicionales por tipo de archivo, skills bajo demanda
2. **Dos capas**: Tu persona te sigue a todos los proyectos; el contexto del proyecto vive con el repo
3. **Un estandar**: `.claude/skills/` funciona en 30+ herramientas via Agent Skills
4. **Humano > Maquina**: Los archivos escritos por humanos mejoran el rendimiento; los auto-generados lo empeoran
5. **Prescriptivo > Descriptivo**: "Usa pnpm" es mas util que "el proyecto usa 4 modulos"

Copia el script, ejecuta `./setup-ai-tools.sh --full`, y empieza a escribir tus rules y skills. La IA no puede descubrir las convenciones de tu equipo — pero si se las dices, las sigue.
