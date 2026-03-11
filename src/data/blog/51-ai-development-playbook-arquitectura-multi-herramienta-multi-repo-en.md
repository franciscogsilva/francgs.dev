---
title: "AI Development Playbook: Multi-Tool, Multi-Repo Architecture for AI Agents"
author: "Francisco Gonzalez"
description: "Complete, replicable guide to setting up AI-assisted development with AGENTS.md, rules, skills, progressive disclosure, and the Agent Skills standard. Compatible with Claude Code, Cursor, Copilot, OpenCode, Gemini CLI, and 30+ tools. Validated against academic research."
pubDate: 2026-03-10
tags: ["ai", "developer-tools", "productivity", "software-engineering", "typescript", "llm", "tools"]
category: ai
translationKey: post-51
lang: en
---

AI coding agents (Claude Code, Cursor, Codex, Gemini CLI) are powerful out of the box, but they know NOTHING about your project. Without context, an agent suggests `axios` when your project uses `ky`, runs `npm` when your team uses `pnpm`, and generates flat structures when you follow Clean Architecture.

The naive solution is to stuff a massive README into the prompt. But academic research shows that **bloated context files reduce agent performance** (Gloaguen et al., ETH Zurich, 2026). The agent spends more time processing instructions than solving the problem.

This playbook solves both extremes: **too little context** (the agent guesses wrong) and **too much context** (the agent gets slower and more expensive). It is a replicable, project-agnostic guide validated against academic research and compatible with 30+ AI tools.

## Table of Contents

0. [Theoretical Foundations — Why This Architecture Exists](#theoretical-foundations--why-this-architecture-exists)
1. [Philosophy and Principles](#philosophy-and-principles)
2. [Architecture Overview](#architecture-overview)
3. [Two-Layer Persona Architecture](#two-layer-persona-architecture)
4. [File-by-File Breakdown](#file-by-file-breakdown)
5. [Step-by-Step Setup Guide](#step-by-step-setup-guide)
6. [Creating Rules](#creating-rules)
7. [Creating Skills](#creating-skills)
8. [Tool-Specific Configuration](#tool-specific-configuration)
9. [Adding New Repos and Technologies](#adding-new-repos-and-technologies)
10. [MCP Servers](#mcp-servers)
11. [Prompt Engineering Patterns](#prompt-engineering-patterns)
12. [Token Economics and AI Effectiveness](#token-economics-and-ai-effectiveness)
13. [Security Considerations](#security-considerations)
14. [LLM Best Practices for 2026](#llm-best-practices-for-2026)
15. [Research: Do Context Files Actually Help?](#research-do-context-files-actually-help)
16. [Setup Script](#setup-script)
17. [Troubleshooting](#troubleshooting)
18. [Quick Reference Cheatsheet](#quick-reference-cheatsheet)

---

## Theoretical Foundations — Why This Architecture Exists

> Read this section FIRST. It explains the problems this architecture solves, the concepts behind each design decision, and the evidence backing them.

### The Core Problem

AI coding agents (Claude Code, Codex, Cursor, Gemini, etc.) are powerful out of the box, but they know NOTHING about YOUR project. Without guidance, an agent will:

- Suggest `axios` when your project uses `ky`
- Use `npm` when your team enforces `pnpm`
- Create flat file structures when you follow Clean Architecture
- Ignore your naming conventions, testing patterns, and security requirements
- Produce code that "works" but doesn't fit your codebase

The naive solution is to stuff a massive README into the prompt. But research shows that **bloated context files REDUCE agent performance** (Gloaguen et al., 2026 — see Section 15). The agent spends more time processing instructions than solving the problem.

This architecture solves both extremes: **too little context** (the agent guesses wrong) and **too much context** (the agent gets slower and more expensive).

### Progressive Disclosure — The Core Design Pattern

The most important concept in this architecture. Borrowed from UX design:

> **Progressive disclosure**: Show only the information necessary for the current task. Reveal deeper details on demand.

Applied to AI context, this means THREE tiers of information:

```
┌─────────────────────────────────────────────────────┐
│  TIER 1: Always-On (Hub)                            │
│  AGENTS.md — WHO am I? WHAT stack? HOW to code?     │
│  ~1,000 tokens — loads on EVERY interaction          │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │  TIER 2: Conditional (Rules)                  │  │
│  │  .claude/rules/*.md — code patterns           │  │
│  │  ~500 tokens each — loads by FILE TYPE.       │  │
│  │  TypeScript for .ts, React for .tsx           │  │
│  │                                                │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │  TIER 3: On-Demand (Skills)             │  │  │
│  │  │  .claude/skills/*/SKILL.md              │  │  │
│  │  │  ~2,000-3,000 tokens each               │  │  │
│  │  │  Loads ONLY when requested              │  │  │
│  │  │  "Load the database-migration skill"    │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Why it matters**: A "fix this typo" request loads ~1,500 tokens of context. A "create a new NestJS module" request loads ~4,500 tokens. Without progressive disclosure, BOTH requests would load ~15,000+ tokens — the full set of rules and skills. That is 10x more tokens for simple tasks, which means: higher cost, slower responses, and (according to research) WORSE accuracy.

### Prompt Caching — Why Stable Files Save Money

Modern LLM providers cache the beginning of your prompt between API calls:

| Provider | Cache Mechanism | Cost Reduction | Invalidation |
|---|---|---|---|
| Anthropic | Automatic prefix caching | Up to 90% on cached portion | Any content change |
| OpenAI | Automatic for identical prefixes | 50% on cached tokens | Any prefix change |
| Google | Automatic on Gemini 2.5 series | Variable | Any prefix change |

**Architecture impact**: Your persona, AGENTS.md, and rules sit at the START of every prompt. They are stable — they don't change between interactions. This means they get CACHED after the first call, and subsequent calls only pay for the volatile part (your current question + code context).

**Rule of thumb**: Never modify hub files frivolously. Every edit invalidates the cache for every subsequent interaction. Batch changes, don't trickle them.

### The Agent Skills Open Standard

Since 2025, **Agent Skills** (agentskills.io) is an open standard adopted by 30+ AI coding tools. The canonical path for skills is:

```
.claude/skills/skill-name/SKILL.md
```

Despite the `.claude/` prefix, this path is NOT Claude-specific. It was chosen because Claude Code was the first major tool to implement skills, and the standard adopted its path for compatibility. The following tools read `.claude/skills/` natively:

| Reads `.claude/skills/` | Tool |
|---|---|
| ✅ | Claude Code, OpenCode, Cursor, GitHub Copilot |
| ✅ | JetBrains Junie, Gemini CLI, OpenAI Codex |
| ✅ | Roo Code, Amp, Goose, Mistral Vibe |
| ✅ | Factory, Databricks, Spring AI, Snowflake |
| ✅ | 15+ more tools |

**Why it matters**: Write skills ONCE, get compatibility with 30+ tools. No need for tool-specific skill directories.

### Skills 2.0 — Skills as Programs, Not Instructions

Claude Code introduced Skills 2.0 which treats skills as programmable units, not just instruction text.

**Invocation control:**

| Configuration | You can invoke | Claude can invoke | Context loading |
|---|---|---|---|
| (default) | ✅ Yes | ✅ Yes | Description always in context; full skill loads when invoked |
| `disable-model-invocation: true` | ✅ Yes | ❌ No | Description **NOT** in context; skill loads only when you invoke |
| `user-invocable: false` | ❌ No | ✅ Yes | Description always in context; skill loads when Claude decides |

**⚠️ Important distinction**: `user-invocable: false` only hides the skill from the `/` menu — it does NOT block programmatic invocation via the Skill tool. To fully prevent Claude from auto-invoking, use `disable-model-invocation: true`.

**All Skills 2.0 features:**

| Feature | YAML Frontmatter | What It Does | When to Use |
|---|---|---|---|
| **User-only** | `disable-model-invocation: true` | Only you can trigger via `/skill-name`. Description removed from context entirely. | Dangerous ops: deploy, migration, data deletion |
| **Background knowledge** | `user-invocable: false` | Claude auto-loads when relevant. Hidden from `/` menu but description stays in context. | Style guides, API contracts, legacy context |
| **Tool restriction** | `allowed-tools: Read, Grep, Glob` | Skill can only use listed tools. Supports `Bash(pattern *)` for restricted shell. | Read-only skills: audits, analysis, reviews |
| **Forked context** | `context: fork` | Runs in SEPARATE context — no conversation history, doesn't pollute it. Summary returns. | Full codebase audits, multi-file scaffolding |
| **Subagent type** | `agent: Explore` | Which subagent runs a forked skill. Options: `Explore`, `Plan`, `general-purpose`, or custom. | Exploration (Explore), architecture design (Plan) |
| **Arguments** | `$ARGUMENTS`, `$0`, `$1` | Accepts input: `/deploy staging` → `$1` = "staging". Auto-appended if not in content. | Skills that need parameters |
| **Argument hint** | `argument-hint: "[target]"` | Hint shown in autocomplete. Purely UX. | Skills with arguments |
| **Shell injection** | `` !`git diff` `` | Runs commands BEFORE Claude sees the skill. Output replaces placeholder (preprocessing). | Current branch, PR diff, recent changes |
| **Skill directory** | `${CLAUDE_SKILL_DIR}` | Resolves to SKILL.md's directory. Reference bundled scripts/files. | Skills with scripts, templates, reference docs |
| **Session ID** | `${CLAUDE_SESSION_ID}` | Current session ID for logging or session-specific files. | Debugging, audit trails |
| **Model override** | `model: claude-opus-4-6` | Forces a specific model for this skill. | Complex skills for strongest model, or simple ones for fast/cheap |
| **Lifecycle hooks** | `hooks: pre/post` | Commands before/after skill execution. Automatic, no approval needed. | Pre: validation. Post: notifications, cleanup |

**Example — a deploy skill with Skills 2.0:**

```yaml
---
name: deploy
description: Deploy to staging or production
disable-model-invocation: true
context: fork
allowed-tools: Bash, Read
---

# Deploy Skill

Current branch: !`git branch --show-current`
Last commit: !`git log -1 --oneline`

Deploy target: $1 (staging or production)

## Steps
1. Verify all tests pass
2. Build the project
3. Deploy to $1 environment using the script at $CLAUDE_SKILL_DIR/scripts/deploy.sh
```

### MCP Servers — Extending Agent Capabilities

Model Context Protocol (MCP) servers give AI agents access to external services: documentation, databases, APIs, browsers, etc.

**Token impact**: Each MCP tool declaration consumes tokens (~50-200 per tool). With many MCP servers, the tool list alone can consume 2,000-5,000 tokens. This is a HIDDEN cost that most developers ignore.

**Recommendation**: Only enable MCPs you actually use. A Context7 MCP (documentation search) almost always justifies the cost. A PostgreSQL MCP only justifies the cost if you query the database regularly during development.

### How These Concepts Connect

```
                    ┌──────────────────┐
                    │  Prompt Caching   │
                    │  (saves money on  │
                    │  stable context)  │
                    └────────┬─────────┘
                             │ cached prefix
                             ▼
┌────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Personal Layer │──│  Progressive     │──│  Agent Skills     │
│ (persona.md)   │  │  Disclosure      │  │  Standard         │
│ ~500 tokens    │  │  (3 tiers)       │  │  (30+ tools)      │
└────────────────┘  └────────┬─────────┘  └────────┬──────────┘
                             │                      │
                    ┌────────┴─────────┐   ┌───────┴──────────┐
                    │ Tier 1: Hub      │   │ Skills 2.0       │
                    │ Tier 2: Rules    │   │ (programmable     │
                    │ Tier 3: Skills   │   │  skills for       │
                    │                  │   │  advanced flows)  │
                    └──────────────────┘   └──────────────────┘
```

**The flow**: Your persona (Layer 1) + project hub (Layer 2, Tier 1) get cached by the LLM provider. Rules (Tier 2) load conditionally by file type. Skills (Tier 3) load on demand. All skills use the Agent Skills standard path so ANY tool can discover them. Skills 2.0 adds programmability for complex workflows.

**The result**: Minimal token cost per interaction, maximum context relevance, universal tool compatibility, and (according to research) BETTER agent performance than bloated alternatives.

---

## Philosophy and Principles

### Tool-Agnostic Design

The architecture is based on one insight: **every major AI coding tool reads `AGENTS.md`**. By making this the hub document, you get cross-tool compatibility without maintaining separate configs for each tool.

| Tool | Reads AGENTS.md? | Primary Config |
|---|---|---|
| OpenCode | ✅ Yes | `AGENTS.md` + `opencode.json` |
| Claude Code | ❌ No (reads `CLAUDE.md`) | `CLAUDE.md` → references `AGENTS.md` |
| Cursor | ✅ Yes | `AGENTS.md` + `.claude/rules/` (Agent Skills standard) |
| GitHub Copilot | ✅ Yes | `AGENTS.md` + `.github/instructions/` |
| JetBrains Junie | ✅ Yes | `AGENTS.md` + `.claude/skills/` (Agent Skills standard) |
| Gemini CLI | ✅ Yes | `AGENTS.md` + `GEMINI.md` |
| Agent Skills (30+ tools) | Varies | `.claude/skills/*/SKILL.md` (agentskills.io standard) |

**Strategy**: Write context ONCE in `AGENTS.md`, create thin bridges for tools that need their own file.

### Progressive Disclosure

Not every interaction needs every piece of context. The architecture uses three tiers:

1. **Always-on (Hub)**: `AGENTS.md` — project identity, stack, conventions, structure. Every LLM call gets this. Keep it SHORT (<150 lines).
2. **Conditional (Rules)**: `.claude/rules/` — loaded based on files being edited via `paths:` frontmatter. TypeScript rules load when editing `.ts`, React rules for `.tsx`, etc.
3. **On-demand (Skills)**: `.claude/skills/` — detailed guidance that loads ONLY when explicitly requested. 100-500 lines of deep knowledge per skill. Compatible with the Agent Skills open standard (agentskills.io, 30+ tools).

This design minimizes token usage. A simple "fix this typo" doesn't load your entire design system documentation.

### Independent Repos, Not Monorepo

Each repository is self-contained. When someone clones an individual repo, they get ALL the AI context they need. No dependency on a parent folder, shared configs, or symlinks.

The root orchestrator `AGENTS.md` is a convenience for developers working across repos — it provides the system map and cross-repo workflows.

---

## Architecture Overview

### File Tree

```
~/.config/
├── opencode/
│   ├── AGENTS.md              # Global persona (all projects)
│   └── opencode.json          # Global OpenCode config (agent, MCP, plugins)
├── Claude/
│   └── AGENTS.md              # Global persona for Claude Code
│
workspace-root/                 # (optional) Multi-repo workspace
├── AGENTS.md                   # Root orchestrator — repo map + cross-repo workflows
│
repo/
├── AGENTS.md                   # Hub — project identity, stack, conventions, skill index
├── CLAUDE.md                   # Bridge for Claude Code → references AGENTS.md
├── opencode.json               # OpenCode project config → loads rules
├── .claude/
│   ├── rules/                  # Conditional rules with path-scoped loading
│   │   ├── typescript.md       # TS patterns (loads for .ts/.tsx via frontmatter paths:)
│   │   ├── react-patterns.md   # React patterns (loads for .tsx files)
│   │   ├── testing.md          # Testing rules (loads for .spec.ts/.test.ts)
│   │   └── ...
│   └── skills/                 # On-demand skills (Agent Skills open standard — agentskills.io)
│       ├── skill-name/
│       │   ├── SKILL.md        # YAML frontmatter + detailed content (required)
│       │   ├── scripts/        # Support scripts (optional)
│       │   ├── references/     # Reference docs (optional)
│       │   └── assets/         # Templates, configs (optional)
│       └── ...
```

### Information Flow

```
Global Persona (~/.config/*/AGENTS.md)
         │
         ▼
Root Orchestrator (workspace/AGENTS.md)    ← only for multi-repo context
         │
         ▼
Repo Hub (repo/AGENTS.md)                 ← always loaded
         │
         ├──▶ Rules (.claude/rules/*.md)  ← loaded by file type (frontmatter paths:)
         │
         └──▶ Skills (.claude/skills/)    ← loaded by explicit request (Agent Skills standard)
```

### Config Merging (OpenCode)

OpenCode merges configuration in this order (later overrides earlier):

```
Remote defaults → Global (~/.config/opencode/) → Project (repo/opencode.json)
```

This means project-level config overrides global. Global provides defaults.

---

## Two-Layer Persona Architecture

### The Problem

Every AI coding tool reads persona/identity files from a DIFFERENT location:

| Tool | Global persona file |
|---|---|
| OpenCode | `~/.config/opencode/AGENTS.md` |
| Claude Code | `~/.config/Claude/AGENTS.md` |
| Gemini CLI / Antigravity | `~/.gemini/GEMINI.md` |
| Cursor | Settings UI (no file mechanism) |
| VS Code / Copilot | Reference in `settings.json` |
| JetBrains | Project-level only |

Maintaining identical content in 3+ files is unsustainable. Every edit requires updating everywhere.

### The Solution: One Source of Truth + Symlinks

Create ONE persona file and symlink it to every tool's expected location:

```
~/.config/ai/persona.md              ← THE source of truth (edit only here)
    ├── symlink → ~/.config/opencode/AGENTS.md
    ├── symlink → ~/.config/Claude/AGENTS.md
    └── symlink → ~/.gemini/GEMINI.md
```

**Setup commands:**

```bash
# Create the source of truth
mkdir -p ~/.config/ai
# Create/edit ~/.config/ai/persona.md with your persona

# Create symlinks
mkdir -p ~/.config/opencode ~/.config/Claude ~/.gemini
ln -sf ~/.config/ai/persona.md ~/.config/opencode/AGENTS.md
ln -sf ~/.config/ai/persona.md ~/.config/Claude/AGENTS.md
ln -sf ~/.config/ai/persona.md ~/.gemini/GEMINI.md
```

Now editing `~/.config/ai/persona.md` updates ALL tools instantly. For Cursor and VS Code, paste or reference the file manually (one-time setup).

### Two Layers: Personal vs. Project

The architecture separates responsibilities into two layers:

```
LAYER 1: PERSONAL (your machine — follows you across ALL projects)
─────────────────────────────────────────────────────────────────
~/.config/ai/persona.md
  ↳ WHO you are: identity, personality, tone, philosophy
  ↳ HOW you work: CLI preferences, tool behavior, collaboration style
  ↳ ~500 tokens — loads on EVERY call in EVERY project

LAYER 2: PROJECT (each repo — for any developer or AI tool)
─────────────────────────────────────────────────────────────────────────────
repo/AGENTS.md + .claude/rules/ + .claude/skills/
  ↳ WHAT the project is: stack, structure, commands
  ↳ HOW to code HERE: patterns, conventions, anti-patterns
  ↳ Token cost scales per interaction via progressive disclosure
```

**Why two layers?**

1. **Portability**: Your personality and standards follow you to ANY project — open source contributions, new repos, client projects
2. **Consistency**: The AI behaves the SAME across all your projects (same tone, same rigor, same security mindset)
3. **Separation of concerns**: Personal preferences (tone, philosophy) don't pollute project docs. Project conventions don't repeat in every persona file
4. **Team-friendly**: The project layer gets committed to git — every team member and AI tool gets the same project context. The personal layer stays on YOUR machine

### What Goes in Each Layer

| Content | Personal Layer | Project Layer |
|---|---|---|
| AI personality/tone | ✅ | ❌ |
| Collaboration style | ✅ | ❌ |
| CLI tool preferences | ✅ | ❌ |
| Security mindset (global) | ✅ | ❌ |
| Philosophy (KISS, 5 Whys) | ✅ | ❌ |
| Tech stack | ❌ | ✅ |
| Project commands | ❌ | ✅ |
| Architecture patterns | ❌ | ✅ |
| Code conventions | ❌ | ✅ |
| OWASP rules (project-specific) | ❌ | ✅ |
| Skills (workflows) | ❌ | ✅ |

**Rule of thumb**: If it would be the same across ALL your projects, it's personal. If it changes per repo, it's project.

### Design Guidelines for the Persona File

Based on research (see Section 15), keep persona files **lean and behavioral**:

1. **Identity + role** (2-3 sentences): What expert hat to wear
2. **Core principle** (1 paragraph): The #1 behavioral rule
3. **Tone/personality** (bullet list): How to communicate
4. **Philosophy** (bullet list): Decision-making framework
5. **Tool preferences** (table or list): CLI tools, MCP usage

**Anti-patterns to avoid:**

- Don't include project-specific information (stacks, commands)
- Don't include coding patterns (those go in rules)
- Don't include long prose paragraphs (tables and bullets are more token-efficient)
- Don't exceed ~500 tokens — this loads on EVERY interaction

---

## File-by-File Breakdown

### `AGENTS.md` (The Hub)

**Purpose**: Single source of truth for project identity. Every AI tool reads it.

**Target size**: 50-150 lines. This loads on EVERY interaction — keep it lean.

**Required sections:**

```markdown
# project-name — One-Line Description

## What Is This?
<!-- 2-3 sentences: what it does, who uses it, where it runs -->

## Tech Stack
<!-- Table format: layer, technology, version -->

## Commands
<!-- Table: command → what it does -->

## Project Structure
<!-- ASCII tree of src/ — only key directories -->

## Key Conventions
<!-- Bullet list: naming, patterns, anti-patterns -->

## Available Skills
<!-- List of skills with one-line descriptions -->
```

**What NOT to put here**: Implementation details, code examples, full API docs, design system specs. Those go in skills.

### `CLAUDE.md` (Claude Code Bridge)

**Purpose**: Claude Code does not read `AGENTS.md` — it reads `CLAUDE.md`. This file is a thin bridge.

**Template:**

```markdown
# project-name — Short Title

Read AGENTS.md in this directory for full project context, conventions, and available skills.

## Quick Reference
- **Stack**: [key technologies]
- **Dev**: `pnpm dev` (port XXXX) | **Build**: `pnpm build`
- **Key pattern**: [most important architectural decision]

## Critical Rules
- [3-5 most important rules that MUST be followed]
```

**Why not just duplicate AGENTS.md?** Because then you maintain two copies. The bridge pattern means you update ONCE in `AGENTS.md` and both tools see it.

### `opencode.json` (OpenCode Project Config)

**Purpose**: Tell OpenCode where to find rule files.

**Template:**

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    ".claude/rules/*.md"
  ]
}
```

OpenCode loads `AGENTS.md` automatically (walking up directories). The `instructions` array adds conditional rules. Using `.claude/rules/` means the same rules are natively read by Claude Code AND loaded by OpenCode.

### `.claude/rules/*.md` (Conditional Rules)

**Purpose**: Coding standards that apply to specific file types. Loaded automatically when editing matching files.

**Naming convention**: `technology-or-concern.md` — e.g., `typescript.md`, `react-patterns.md`, `testing.md`, `database.md`

**Target size**: 30-80 lines per rule file. These load automatically — don't bloat them.

**YAML frontmatter with `paths:` scope** (native Claude Code feature):

```yaml
---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---
```

Rules with `paths:` only load when Claude Code (or OpenCode via instructions) is working on matching files. This reduces token waste.

**Template:**

```markdown
---
paths:
  - "{glob-pattern}"
---

# Rule Name

## Patterns to Follow
<!-- Numbered list of concrete patterns with brief code snippets -->

## Anti-Patterns
<!-- What NOT to do, with brief WHY explanation -->
```

### `.claude/skills/*/SKILL.md` (On-Demand Skills)

**Purpose**: Detailed, deep guidance for complex workflows. Loaded ONLY when explicitly requested.

**Size**: 100-500 lines. Skills can be exhaustive because they load on demand.

**Path**: `.claude/skills/` — this is the canonical path for the **Agent Skills open standard** (agentskills.io), supported natively by 30+ tools including Claude Code, OpenCode, Cursor, GitHub Copilot, JetBrains Junie, Gemini CLI, and more.

**YAML frontmatter is REQUIRED** (between `---` markers). All fields are technically optional, but `name` and `description` are **strongly recommended** by Anthropic's official skill-building guide:

| Field | Required? | Notes |
|---|---|---|
| `name` | Strongly recommended | Kebab-case, max 64 chars. If omitted, uses directory name. The official guide treats it as required for quality skills. |
| `description` | Strongly recommended | Max 1024 chars, no XML (`< >`). If omitted, uses first paragraph of content. **Must include WHAT it does + WHEN to use it (trigger phrases).** |
| `argument-hint` | Optional | Shown during autocomplete: `[issue-number]`, `[filename] [format]` |

```markdown
---
name: skill-name
description: What this skill does. Use when user asks to [specific trigger phrases].
---

# Skill Title

## Role and Purpose
<!-- What role the AI takes when this skill is loaded -->

## Step-by-Step Workflow
<!-- Detailed instructions, templates, checklists -->

## Examples
<!-- Concrete code examples, patterns -->

## Common Mistakes
<!-- What to watch out for -->
```

**Size guideline**: Keep SKILL.md under 500 lines. Move detailed reference material to separate files in `references/`.

**Critical rules** (from Anthropic's official skill-building guide):
- SKILL.md must be **exactly** `SKILL.md` (case-sensitive)
- Folder name in **kebab-case**: `my-skill` ✅, `My Skill` ❌, `my_skill` ❌
- No `README.md` inside the skill folder
- No `claude` or `anthropic` in the skill name (reserved)
- The `description` field is the **triggering mechanism** — Claude reads ALL skill descriptions at session start to decide which skills to load

#### Skills 2.0 Features (Claude Code)

Claude Code Skills 2.0 adds powerful capabilities. The invocation control table is KEY:

| Configuration | You can invoke | Claude can invoke | Context loading |
|---|---|---|---|
| (default) | ✅ Yes | ✅ Yes | Description always in context; full skill loads when invoked |
| `disable-model-invocation: true` | ✅ Yes | ❌ No | Description **NOT** in context; skill loads only when you invoke |
| `user-invocable: false` | ❌ No | ✅ Yes | Description always in context; skill loads when Claude decides |

**⚠️ Important distinction**: `user-invocable: false` only hides from the `/` menu — it does NOT block programmatic invocation. To fully prevent auto-invocation, use `disable-model-invocation: true`.

**All features:**

| Feature | Syntax | What It Does | When to Use |
|---|---|---|---|
| **User-only** | `disable-model-invocation: true` | Only you can trigger via `/skill-name`. Description removed from context. | Dangerous ops: deploy, migration, deletion |
| **Background knowledge** | `user-invocable: false` | Claude auto-loads when relevant. Hidden from `/` menu. | Style guides, API contracts, legacy context |
| **Tool restriction** | `allowed-tools: Read, Grep, Glob` | Only listed tools. Supports `Bash(pattern *)`. | Read-only: audits, analysis |
| **Forked context** | `context: fork` | SEPARATE context — no history, no pollution. Summary returns. | Full audits, multi-file scaffolding |
| **Subagent type** | `agent: Explore` | Which subagent runs fork. Options: `Explore`, `Plan`, `general-purpose`, custom. | Exploration, architecture design |
| **Arguments** | `$ARGUMENTS`, `$0`, `$1` | Input: `/deploy staging` → `$1` = "staging". Auto-appended if missing. | Skills with parameters |
| **Argument hint** | `argument-hint: "[target]"` | Autocomplete hint. Purely UX. | Skills with arguments |
| **Shell injection** | `` !`git diff` `` | Runs BEFORE Claude sees skill. Output replaces placeholder. | Branch, PR diff, recent changes |
| **Skill directory** | `${CLAUDE_SKILL_DIR}` | Resolves to SKILL.md's directory. | Scripts, templates, reference docs |
| **Session ID** | `${CLAUDE_SESSION_ID}` | Session ID for logging. | Debugging, audit trails |
| **Model override** | `model: claude-opus-4-6` | Forces specific model. | Complex or simple skills as needed |
| **Lifecycle hooks** | `hooks: pre/post` | Commands before/after. Automatic. | Pre: validation. Post: notifications |

**Skill with support files:**

```
skill-name/
├── SKILL.md           # Main instructions (required)
├── references/
│   └── REFERENCE.md   # Detailed docs loaded on demand
├── scripts/
│   └── validate.sh    # Script the AI can execute
└── assets/
    └── template.md    # Templates to fill in
```

---

## Step-by-Step Setup Guide

### Prerequisites

- One or more git repositories
- AI coding tools installed (OpenCode, Claude Code, Cursor, etc.)
- Terminal access

### Global Setup (One Time)

> **Recommended**: Use `setup-ai-tools.sh --global` (see Section 16) to automate this entire process. Manual steps below for reference.

**Step 1: Create the global persona (one source of truth)**

```bash
mkdir -p ~/.config/ai
# Create your persona file — see Section 3.5 for design guidelines
nano ~/.config/ai/persona.md
```

**Step 2: Create symlinks to all tools**

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

Now ALL tools read the same persona. Edit once at `~/.config/ai/persona.md`, every tool sees the update instantly.

**Step 3: Configure OpenCode globally** (if you use OpenCode)

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

### Per-Repository Setup

**Step 1: Create the hub**

```bash
# At your repo root
touch AGENTS.md
# Write the hub document following the template from the previous section
```

**Step 2: Create the Claude Code bridge**

```bash
touch CLAUDE.md
# Write the bridge following the template
```

**Step 3: Create OpenCode project config**

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

**Step 4: Create rule directory and rule files**

```bash
mkdir -p .claude/rules
# Create rule files with paths: frontmatter according to your tech stack:
# - typescript.md (if you use TypeScript)
# - react-patterns.md (if you use React)
# - testing.md (if you have tests)
# - database.md (if you have a database)
```

**Step 5: Create skill directory and skills**

```bash
mkdir -p .claude/skills/skill-name
# Create SKILL.md with YAML frontmatter (name + description required)
```

**Step 6: (Optional) Create root orchestrator for multi-repo workspaces**

```bash
# At your workspace root (parent of all repos)
touch AGENTS.md
# Write the orchestrator with repo map and cross-repo workflows
```

### Verification Checklist

After setup, verify:

- [ ] `AGENTS.md` at repo root — under 150 lines, has all required sections
- [ ] `CLAUDE.md` at repo root — references AGENTS.md, has critical rules
- [ ] `opencode.json` at repo root — valid JSON, points to `.claude/rules/*.md`
- [ ] `.claude/rules/*.md` — each under 80 lines, has `paths:` frontmatter for file-type scoping
- [ ] `.claude/skills/*/SKILL.md` — each has YAML frontmatter with `name` and `description`
- [ ] No duplicate content between AGENTS.md and rules/skills
- [ ] No secrets or credentials in any context file

---

## Creating Rules

### When to Create a Rule vs. a Skill

| Use a RULE when... | Use a SKILL when... |
|---|---|
| The guidance is always relevant for a file type | The guidance is for a specific workflow |
| It's under 80 lines | It's over 80 lines |
| It's about coding standards/patterns | It's about a complex process (migration, audit, scaffold) |
| Example: "always use explicit return types" | Example: "how to create a new NestJS module end-to-end" |

### Rule Design Principles

1. **Be concrete**: "Use `readonly` on all function parameters" is better than "prefer immutability"
2. **Show the pattern**: Include a 3-5 line code snippet for each pattern
3. **Explain the WHY**: "Why? Because TypeORM lazy relations silently fail without explicit typing"
4. **Include anti-patterns**: Show what NOT to do — LLMs learn from counter-examples
5. **Keep it DRY**: If a rule applies across all repos, put it in the global AGENTS.md, not in each repo's rules

### Example: TypeScript Rule

```markdown
# TypeScript Patterns

## When This Applies
All `.ts` and `.tsx` files in this project.

## Patterns

1. **Explicit return types on exported functions**
   ```typescript
   // ✅ Good
   export function calculateScore(answers: Answer[]): number { ... }

   // ❌ Bad — inferred return types leak implementation details
   export function calculateScore(answers: Answer[]) { ... }
   ```

2. **Use `readonly` for function parameters**
   ```typescript
   // ✅ Good
   function processItems(readonly items: Item[]): Result { ... }
   ```

3. **Discriminated unions over boolean flags**
   ```typescript
   // ✅ Good
   type LoadState = { status: 'idle' } | { status: 'loading' } | { status: 'error'; error: Error }

   // ❌ Bad
   type LoadState = { isLoading: boolean; error?: Error }
   ```

## Anti-Patterns
- NEVER use `any` — use `unknown` and narrow with type guards
- NEVER use type assertions `as` — use type predicates or runtime checks
- NEVER use `@ts-ignore` — use `@ts-expect-error` with explanation
```

---

## Creating Skills

### Where Skills Live

Skills can exist at four levels. Higher-priority locations win when skills share the same name:

| Level | Path | Applies to | Priority |
|---|---|---|---|
| Enterprise | Managed settings (admin-deployed) | All users in the organization | Highest |
| Personal | `~/.claude/skills/<skill-name>/SKILL.md` | All your projects on this machine | High |
| Project | `.claude/skills/<skill-name>/SKILL.md` | This project only | Normal |
| Plugin | `<plugin>/skills/<skill-name>/SKILL.md` | Where the plugin is enabled | Namespaced |

**Precedence**: Enterprise > Personal > Project. Plugin skills use `plugin-name:skill-name` namespace, so they never conflict.

### Skill Structure

Every skill follows this pattern:

```
.claude/skills/
└── skill-name/
    ├── SKILL.md              # Required — main instructions (keep under 500 lines)
    ├── scripts/              # Optional — executable code (Python, Bash, etc.)
    ├── references/           # Optional — detailed reference docs (loaded on demand)
    └── assets/               # Optional — templates, fonts, icons, configs
```

The SKILL.md file MUST have YAML frontmatter between `---` markers. All fields are technically optional, but `name` and `description` are **strongly recommended** (Anthropic's official guide treats them as required for quality skills):

```yaml
---
name: skill-name
description: What this skill does. Use when user asks to [trigger phrases].
---
```

**Critical rules** (from Anthropic's official skill-building guide):
- SKILL.md must be **exactly** `SKILL.md` (case-sensitive)
- Folder name in **kebab-case**: `my-skill` ✅, `My Skill` ❌, `my_skill` ❌
- `name`: kebab-case, no spaces/capitals, max 64 chars, should match folder name
- `description`: max 1024 chars, NO XML (`< >`), must include WHAT + WHEN
- No `README.md` inside the skill folder
- No `claude` or `anthropic` in the skill name (reserved)

### Skill Design Principles

1. **One skill = one workflow**: Don't combine "DB migration" and "API security audit" in one skill
2. **Start with role/purpose**: Tell the LLM what expert hat to wear
3. **Steps > paragraphs**: LLMs follow numbered steps better than prose
4. **Include templates**: Provide copy-paste templates for files, code blocks, configs
5. **Include checklists**: End with a validation checklist for the LLM to self-audit against
6. **Cross-reference, don't duplicate**: If two skills share content, reference the other skill instead of copy-pasting
7. **Be specific and actionable**: "Run `python scripts/validate.py`" beats "validate the data"
8. **Include error handling**: Document common failures and what to do about them
9. **Progressive disclosure within skills**: Keep SKILL.md focused, move detailed docs to `references/`

### Skill Template

```markdown
---
name: my-skill
description: What this skill does. Use when user asks to [trigger 1], [trigger 2], or [trigger 3].
argument-hint: "[optional-arg]"
---

# Skill Title

## Role and Purpose
You are an expert [role]. Your job is to [purpose].

## Prerequisites
- [What must exist before using this skill]

## Step-by-Step Workflow

### Step 1: [First thing]
[Instructions with code examples]

### Step 2: [Second thing]
[Instructions with code examples]

## Templates

### [Template Name]
```typescript
// Template code here
```

## Validation Checklist
- [ ] [Check 1]
- [ ] [Check 2]
- [ ] [Check 3]

## Common Mistakes
- [Mistake 1]: [Why it's wrong and what to do instead]

## Troubleshooting
Error: [Common error message]
Cause: [Why it happens]
Solution: [How to fix]

## Additional Resources
- For detailed reference, see [reference.md](reference.md)
```

### Referencing Skills

Skills are loaded explicitly by the user or AI tool. Common invocation patterns:

| Tool | How to Load a Skill |
|---|---|
| OpenCode | `/skill skill-name` |
| Claude Code | `/skill-name` or "Load the clean-architecture skill" |
| Cursor | Auto-discovered from `.claude/skills/` (Agent Skills standard) |
| GitHub Copilot | Auto-discovered from `.claude/skills/` (Agent Skills standard) |
| JetBrains Junie | Auto-discovered from `.claude/skills/` (Agent Skills standard) |
| Gemini CLI | Reference in conversation |

---

## Tool-Specific Configuration

### OpenCode

**Global config**: `~/.config/opencode/opencode.json`

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
    "my-agent": {
      "mode": "primary",
      "description": "Agent description",
      "prompt": "Your agent system prompt here",
      "tools": {
        "write": true,
        "edit": true
      }
    }
  }
}
```

**Project config**: `repo/opencode.json`

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [
    ".claude/rules/*.md"
  ]
}
```

**Key points:**

- OpenCode walks up directories to find `AGENTS.md` — reads ALL of them (project + global)
- Config merges: remote → global → project
- Custom agents defined in `agent` block with `mode`, `description`, `prompt`, `tools`
- Custom agents can also be `.md` files in `.opencode/agents/` (cleaner than inline JSON)
- The `instructions` array accepts glob patterns and URLs
- OpenCode also reads `.claude/skills/` as fallback for the Agent Skills standard

### Claude Code

**Global config**: `~/.config/Claude/AGENTS.md`

- Same content as OpenCode's global persona
- Claude Code reads `CLAUDE.md` at project root, NOT `AGENTS.md`
- The `CLAUDE.md` bridge pattern solves this by referencing `AGENTS.md`
- **Native rule loading**: `.claude/rules/*.md` with `paths:` frontmatter for file-type scoping
- **Native skill loading**: `.claude/skills/*/SKILL.md` — auto-discovered
- **Skills 2.0**: Supports `context: fork`, `disable-model-invocation`, `allowed-tools`, `$ARGUMENTS`, shell injection, and more

### Cursor

Cursor reads `AGENTS.md` natively and supports the Agent Skills standard:

- Rules: reads `.claude/rules/` via the Agent Skills standard
- Skills: reads `.claude/skills/` via the Agent Skills standard

**Recommendation**: Don't maintain separate `.cursor/rules/` — let Cursor read `AGENTS.md` and `.claude/`. Only create Cursor-specific rules if absolutely necessary.

### GitHub Copilot

Copilot reads `AGENTS.md` natively and supports the Agent Skills standard:

- Rules/skills: reads `.claude/skills/` via the Agent Skills standard

**Recommendation**: Rely on `AGENTS.md` + `.claude/` as the primary source. Only create `.github/instructions/` for Copilot-specific behavior.

### Other Tools (Agent Skills Standard)

The following tools support the Agent Skills open standard (agentskills.io) and read `.claude/skills/`:

- JetBrains Junie
- Gemini CLI
- OpenAI Codex
- Roo Code, Amp, Goose
- Mistral Vibe, Factory, Databricks
- Spring AI, Snowflake
- And 15+ more

**This is why `.claude/skills/` is the canonical path** — one set of skills works across 30+ tools.

---

## Adding New Repos and Technologies

### Adding a New Repository

1. **Create the file structure:**

   ```bash
   cd new-repo
   touch AGENTS.md CLAUDE.md opencode.json
   mkdir -p .claude/rules .claude/skills
   ```

2. **Write AGENTS.md** using the template from the previous section. Analyze your repo:
   - What framework/language?
   - What architecture pattern?
   - What commands to run?
   - What conventions to follow?

3. **Write CLAUDE.md** using the bridge template

4. **Create opencode.json** pointing to `.claude/rules/*.md`

5. **Create rules** in `.claude/rules/` based on your tech stack:
   - Every repo gets a `typescript.md` (if TypeScript) with `paths:` frontmatter
   - Add framework-specific rules (`react-patterns.md`, `nestjs-patterns.md`, etc.)
   - Add concern rules (`testing.md`, `database.md`, etc.)

6. **Create skills** in `.claude/skills/` for complex workflows specific to this repo

7. **Update the root orchestrator** `AGENTS.md` (if using multi-repo workspace):
   - Add the repo to the repo map table
   - Add it to the system architecture diagram
   - Document any cross-repo relationships
   - Add its skills to the per-repo skills table

### Adding a New Technology to an Existing Repo

1. **Update AGENTS.md**: Add the technology to the tech stack table
2. **Create a rule** in `.claude/rules/` if the technology has coding patterns worth enforcing (e.g., `redis-patterns.md`)
3. **Create a skill** in `.claude/skills/` if the technology has complex setup/workflow (e.g., `redis-caching` skill)
4. **Update existing rules** if the technology affects them (e.g., adding Redis may affect `testing.md`)

### Removing a Technology

1. **Remove from AGENTS.md** tech stack
2. **Delete associated rules** from `.claude/rules/`
3. **Delete associated skills** from `.claude/skills/`
4. **Update the root orchestrator** if relevant

---

## MCP Servers

### What Are MCPs?

Model Context Protocol (MCP) servers extend your AI tool with external capabilities — documentation search, web search, API access, database queries, and more.

### Adding an MCP to OpenCode

In `~/.config/opencode/opencode.json` (global) or `repo/opencode.json` (project):

```json
{
  "mcp": {
    "server-name": {
      "type": "remote",
      "url": "https://mcp-server-url.com/mcp",
      "enabled": true
    }
  }
}
```

For local (stdio-based) MCP servers:

```json
{
  "mcp": {
    "server-name": {
      "type": "local",
      "command": ["npx", "-y", "@mcp-package/server"],
      "enabled": true
    }
  }
}
```

### Recommended MCPs

| MCP | Purpose | URL |
|---|---|---|
| **Context7** | Library documentation search | `https://mcp.context7.com/mcp` |
| **Playwright** | Browser automation/testing | Local: `npx @anthropic/mcp-playwright` |
| **PostgreSQL** | Database queries | Local: `npx @anthropic/mcp-postgres` |

### Adding an MCP to Claude Code

Claude Code uses a different MCP configuration. Check `.claude/settings.json` or Claude Code documentation for current syntax.

---

## Prompt Engineering Patterns

### System Prompt Design (Global Persona)

**Structure your persona prompt as:**

1. **Identity**: Who is the AI? (e.g., "expert tech lead")
2. **Mindset**: How should it think? (e.g., "critically, avoiding over-engineering")
3. **Standards**: What quality bar to maintain? (e.g., "TypeScript strict, no any")
4. **Anti-patterns**: What to NEVER do? (e.g., "never use console.log")

**Key insight**: LLMs follow negative instructions ("never do X") more reliably than positive ones ("always do Y"). Include BOTH, but prioritize anti-patterns for critical rules.

### Context Document Design (AGENTS.md)

**What works well:**

- Tables over paragraphs for structured data
- ASCII art for architecture diagrams (LLMs parse these well)
- Bullet lists for conventions
- Code snippets for patterns (3-5 lines max)
- File trees for project structure

**What doesn't work:**

- Long prose paragraphs (LLMs lose the key points)
- Vague instructions ("write good code")
- Too many examples (pick the ONE best example)
- Nested headers deeper than H3 (structure gets lost)

### Skill Invocation

When asking an AI to use a skill, be explicit:

```
# ✅ Good
Load the database-migration skill and create a migration to add a "last_login" column to the users table.

# ❌ Bad
Create a migration for last_login.
```

The explicit version ensures the skill context gets loaded and applied.

### Multi-Step Tasks

For complex tasks, use a structured prompt:

```
## Goal
[What you want to accomplish]

## Context
[What exists now, what's been done before]

## Constraints
[What rules to follow, what NOT to do]

## Steps
1. [First step]
2. [Second step]
3. [Verification step]
```

---

## Token Economics and AI Effectiveness

This section answers: **Does this architecture ACTUALLY make AI agents more effective? What's the measurable impact?**

### The Cost of Context

Every token in your context files consumes part of the LLM's context window. Bloated context = less room for actual code, lower quality responses, and higher API costs. But ZERO context = the agent guesses your conventions, uses wrong packages, and produces code that "works" but doesn't fit your project.

The goal is not ZERO context — it's the RIGHT context at the RIGHT time.

### Token Budgets by File Type

| File | Token Budget | When It Loads | Cost Impact |
|---|---|---|---|
| Global persona | ~500 tokens | EVERY call, every project | High frequency × low cost = moderate |
| AGENTS.md (hub) | ~1,000 tokens | Every call in this project | High frequency × moderate cost = significant |
| Rules (each) | ~500 tokens | Only when editing matching files | Low-medium frequency × low cost = low |
| Skills (each) | ~2,000-3,000 tokens | ONLY on explicit request | Rare frequency × moderate cost = negligible |
| CLAUDE.md bridge | ~300 tokens | Every call (Claude Code only) | High frequency × trivial cost = trivial |

**Progressive disclosure saves 60-80% of tokens per interaction** compared to loading everything up front. A typical "fix this bug" interaction loads: persona (500) + hub (1,000) + 1 matching rule (500) = **~2,000 tokens**. Without progressive disclosure, you'd load ALL rules + ALL skills = **~8,000-15,000 tokens**.

### Measured Impact on AI Accuracy

Based on academic research (Gloaguen et al., 2026 — see Section 15) and production experience:

| Metric | No Context | Bloated Context (auto-generated) | Lean Context (this architecture) |
|---|---|---|---|
| Task resolution | Baseline | -2% to -3% (worse) | +4% (better, human-written) |
| Inference cost | Baseline | +20-23% | +5-10% (estimated, progressive disclosure) |
| Convention compliance | ❌ Agent guesses | ✅ Follows instructions | ✅ Follows instructions |
| Architectural conformance | ❌ Agent uses defaults | ⚠️ May over-explore | ✅ Directed guidance |
| Security posture | ❌ No OWASP awareness | ⚠️ Generic awareness | ✅ Project-specific rules |
| Package consistency | ❌ May suggest wrong packages | ⚠️ Depends on content | ✅ "Use Ky, not axios" |

**Key insight from research**: Context files do NOT help agents find files faster (they're already good at that). What they DO help with:

1. **Convention enforcement** — agents follow instructions when given them
2. **Tooling guidance** — "use pnpm", "use uv" reduces failed commands
3. **Error prevention** — "TypeORM 0.3.x lazy relations need explicit typing" prevents bugs
4. **Knowledge gaps** — most valuable for projects with sparse documentation or niche frameworks

### When Context Files Hurt (and How to Avoid It)

Research is clear: context files hurt when:

| Anti-Pattern | Why It Hurts | Our Mitigation |
|---|---|---|
| Repo overview with directory listing | Agent already discovers structure; adds noise | Hub has NO directory listings |
| Duplicated README content | Redundant = wasted tokens + conflicting info | Hub is PRESCRIPTIVE, not descriptive |
| Auto-generated via `/init` | -2 to -3% performance degradation | Always human-written |
| Monolithic file with all rules | 20%+ cost increase per interaction | Progressive disclosure via rules/skills |
| Vague instructions ("write good code") | No actionable signal for the agent | Concrete patterns + anti-patterns |

### Deduplication Strategy

**Problem**: The same content (design system colors, TypeScript rules) copied across N repos = Nx token waste.

**Solution:**

- **Global persona** captures cross-project standards (quality, security mindset)
- **Per-repo rules** capture ONLY what's specific to that repo's tech stack
- **Skills** handle detailed content — loaded on demand, not always

**Example**: Instead of putting the full color palette in each repo's rules, create a `design-system` SKILL that loads only when working on UI.

### Writing Concise Context

```markdown
# ❌ Too verbose (wastes tokens, dilutes signal)
When working with TypeScript in this project, it is very important that you always
make sure to use explicit return types on all functions that are exported from
modules. This is because TypeScript's type inference, while powerful, can sometimes
lead to unexpected type widening or narrowing that causes downstream issues.

# ✅ Concise (same information, higher signal-to-noise ratio)
**Explicit return types on all exported functions** — prevents type inference leaks.
```

### Prompt Caching Synergy

Most LLM providers cache stable context prefixes:

- **Anthropic**: Up to 90% cost reduction on cached prefixes
- **OpenAI**: 50% discount on cached tokens
- **Google**: Automatic on 2.5 series models

Your architecture maximizes caching by keeping the stable parts (persona + hub + rules) constant between interactions. Only the volatile part (user prompt + code context) changes. **Never modify hub files frivolously** — every edit invalidates the cache for every subsequent interaction.

---

## Security Considerations

### What NOT to Put in Context Files

Context files (AGENTS.md, rules, skills) get committed to git. NEVER include:

- API keys, tokens, or passwords
- Database connection strings
- Internal URLs or IP addresses
- Customer data or PII
- Production secrets of any kind

### OWASP Integration

This architecture includes OWASP security standards at multiple levels:

1. **Global persona**: References OWASP Top 10 2025 (Web) and OWASP API Security Top 10 2023 — so the AI always considers security implications
2. **Backend skill** (`security-audit-api`): Full API security audit checklist based on OWASP API Security Top 10
3. **Frontend skills** (`owasp-client-security`): Client-side security patterns — XSS prevention, CSP, token handling, DOM security
4. **Per-repo rules**: Embed security patterns directly in coding rules (e.g., "always sanitize user input" in the database rule)

### Supply Chain Security (OWASP A03 2025)

New in OWASP 2025 — and especially relevant for AI-assisted development:

- **Slopsquatting**: LLMs sometimes hallucinate package names. Attackers register those names with malicious code. ALWAYS verify that AI-suggested packages actually exist and are legitimate before installing.
- **Lock files**: Always commit `pnpm-lock.yaml` / `package-lock.json`. Review lock file changes in PRs.
- **Regular auditing**: Run `pnpm audit` / `npm audit` as part of CI.

---

## LLM Best Practices for 2026

### Model Selection

As of March 2026:

- **Complex architecture/design**: Claude Opus 4, GPT-4.5, Gemini 2.5 Pro
- **Day-to-day coding**: Claude Sonnet 4, GPT-4.1, Gemini 2.5 Flash
- **Quick edits/simple tasks**: Claude Haiku 3.5, GPT-4.1 mini, Gemini 2.5 Flash-Lite

Match the model to the task. Don't use Opus to rename a variable.

### Context Window Management

| Model | Context Window | Effective Limit |
|---|---|---|
| Claude Opus 4 | 200K tokens | ~150K usable (leave room for output) |
| Claude Sonnet 4 | 200K tokens | ~150K usable |
| GPT-4.1 | 1M tokens | ~800K usable |
| Gemini 2.5 Pro | 1M tokens | ~800K usable |

**Rule of thumb**: Keep your total context (persona + AGENTS.md + rules + conversation) under 50% of the context window for best quality.

### Multi-File Editing

Modern AI tools can edit multiple files in a single turn. Structure your requests to take advantage:

```
# ✅ Good — parallel edits
Create a new UserProfile component, add it to the router, and update the navigation menu.

# ❌ Bad — serial requests
1. "Create the UserProfile component" → wait
2. "Now add it to the router" → wait
3. "Now update the nav menu" → wait
```

### AI Code Review

AI excels at code review when given clear criteria:

```
Review this PR for:
1. OWASP API Security issues (especially BOLA and broken auth)
2. TypeORM query performance (N+1, missing indexes)
3. Missing error handling
4. Breaking changes to the OpenAPI contract
```

### Things to Watch Out For

1. **Hallucinated APIs**: LLMs sometimes invent function signatures that don't exist. Always verify against actual library docs (use Context7 MCP for this).
2. **Outdated patterns**: Training data has a cutoff. LLMs may suggest deprecated patterns. Use Context7 or official docs to verify.
3. **Over-abstraction**: LLMs love creating abstractions. Push back if a simple function would suffice.
4. **Test quality**: LLMs write tests that pass but don't verify real behavior. Review test assertions manually.
5. **Security blind spots**: LLMs may not flag injection risks or access control issues unless explicitly told. Include security in your review prompts.
6. **Slopsquatting** (see previous section): Verify every `pnpm add` suggestion.

---

## Research: Do Context Files Actually Help?

### Paper Overview

**"Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?"** — Gloaguen et al., ETH Zurich, February 2026 ([arXiv:2602.11988](https://arxiv.org/abs/2602.11988))

This is the first rigorous academic study on whether context files (AGENTS.md, CLAUDE.md) actually improve AI coding agent performance. The researchers tested 4 coding agents (Claude Code + Sonnet 4.5, Codex + GPT-5.2, Codex + GPT-5.1 mini, Qwen Code + Qwen3-30b) across two benchmarks: SWE-bench Lite (300 tasks, popular repos) and AGENTbench (138 tasks from 12 repos with developer-written context files).

### Key Findings

| Finding | Detail |
|---|---|
| **LLM-generated context files HURT performance** | -0.5% on SWE-bench Lite, -2% on AGENTbench (average across agents) |
| **Human-written ones help MARGINALLY** | +4% average improvement on AGENTbench |
| **All context files increase cost** | +20-23% increase in inference cost |
| **Files do NOT function as repo overviews** | Agents don't find relevant files faster |
| **Files ARE redundant documentation** | When existing docs are REMOVED, LLM-generated files improve performance +2.7% |
| **Instructions ARE followed** | Agents respect instructions. The problem isn't compliance — it's that instructions make tasks HARDER |
| **Stronger models don't generate better files** | Using GPT-5.2 to generate files for other agents didn't consistently help |

### Critical Evaluation: Why This Paper Doesn't Invalidate Our Architecture

The paper's headline ("context files reduce performance") is technically accurate but misleading if applied uncritically to ALL context file architectures. Here's why our architecture survives their findings:

#### 1. They tested BLOATED files. We use LEAN.

The paper's LLM-generated files averaged **641 words with 9.7 sections** — essentially a full repository overview dump. Their key finding: "unnecessary requirements make tasks harder." That's exactly what we design against:

| Their approach | Our approach |
|---|---|
| Monolithic AGENTS.md (641 words average, ~9.7 sections) | Hub AGENTS.md (<150 lines) + conditional rules + on-demand skills |
| Repo overview with directory listing | NO directory listings (the paper PROVED these don't help) |
| All context loaded on every interaction | Progressive disclosure — rules load by file type, skills on demand |
| LLM-generated content (auto `/init`) | Human-written, curated content |

The paper's own conclusion supports our design: **"human-written context files should describe only minimal requirements."** That is literally our architecture.

#### 2. They measured TASK RESOLUTION. We optimize CODE QUALITY.

The paper measures: "did the agent produce a patch that passes tests?" That's a binary success metric. It does NOT measure:

- **Code style consistency** across a team
- **Architectural conformance** (e.g., Clean Architecture boundaries)
- **Security posture** (OWASP compliance)
- **Naming conventions** and project patterns
- **Framework-specific best practices** (NestJS patterns, React patterns)

Context files are most valuable for ensuring the agent writes code CORRECTLY FOR YOUR PROJECT, not just code that passes tests.

#### 3. They tested Python repos. We use TypeScript/Node.

The paper explicitly acknowledges this limitation: "Python is widely represented in training data, so much detailed knowledge about tooling might be present in models' parametric knowledge." Their benchmark is 100% Python.

TypeScript/Node.js has:

- More framework-specific conventions (NestJS vs. Express vs. Fastify)
- More opinionated project structures (Clean Architecture, feature-based, etc.)
- More build tool complexity (Vite, esbuild, SWC, etc.)
- More styling approaches (Tailwind v4 vs. CSS-in-JS vs. CSS modules)

Context files are MORE valuable when the agent needs to know WHICH of many valid approaches YOUR project uses.

#### 4. They tested GENERIC task resolution. We encode TEAM KNOWLEDGE.

The paper's tasks are GitHub issues from arbitrary repos — the agent has no prior relationship with the codebase. In reality, context files encode institutional knowledge:

- "We use Ky, not axios" (prevents the agent from suggesting the wrong HTTP client)
- "TypeORM 0.3.27 lazy relations require explicit typing" (prevents a bug)
- "Use `pnpm`, never `npm`" (prevents broken lockfiles)

These aren't "unnecessary requirements making tasks harder" — they're guardrails preventing the agent from introducing tech debt.

#### 5. Their "cost increase" is a feature, not a bug (partially).

The paper shows context files increase reasoning tokens 10-22% and total cost 20%. But they also found: "context files lead to more exhaustive testing and exploration." For production codebases, MORE testing is GOOD. The issue is when exploration is useless (reading already-known directory structures). Our architecture minimizes useless exploration by keeping the hub lean and loading details on demand.

### What We Should Change Based on This Paper

The paper validates several practices and warns against others:

**Validated (keep doing):**

- ✅ Keep AGENTS.md under 150 lines (their data shows bloated files hurt)
- ✅ Human-written over LLM-generated (marginal improvement vs. marginal degradation)
- ✅ Progressive disclosure (don't load everything on every call)
- ✅ Don't include repo overviews with directory listings (proven useless)
- ✅ Focus on behavioral constraints ("use pnpm"), not descriptive content ("the project has 4 modules")

**Changed based on findings:**

- ⚠️ **Never use `/init` or auto-generate context files** — the paper proves these are net negative. Always write them manually.
- ⚠️ **Audit hub files for "unnecessary requirements"** — if an instruction doesn't prevent a concrete error, remove it.
- ⚠️ **Don't duplicate what's in the README** — context files are most valuable when documentation is sparse.

**Open questions:**

- Would results differ for TypeScript/Node.js projects? (the paper only tested Python)
- Would progressive disclosure (rules with `paths:` frontmatter) change the cost/performance ratio? (the paper tested monolithic files only)
- Would Skills 2.0 features (`context: fork`, `allowed-tools`) mitigate the cost increase? (not tested)

### The Bottom Line

The paper's findings are CONSISTENT with our architecture, not contradictory. Their conclusion — "human-written context files should describe only minimal requirements" — is exactly what we built. The key insight:

> **Context files should be PRESCRIPTIVE (do this, don't do this) rather than DESCRIPTIVE (the project has X, Y, Z). Agents can discover structure on their own. What they can't discover are your team's conventions, preferences, and hard-won lessons.**

---

## Setup Script

### Overview

`setup-ai-tools.sh` is a shell script that automates the complete two-layer architecture setup. It handles OS detection, tool detection, persona creation, symlink management, and project-level scaffolding.

### Usage

```bash
# Interactive mode (asks what to set up)
./setup-ai-tools.sh

# Only set up global persona + symlinks
./setup-ai-tools.sh --global

# Only set up project files in the current directory
./setup-ai-tools.sh --project

# Scan subdirectories and set up each project found
./setup-ai-tools.sh --workspace

# Global + current project
./setup-ai-tools.sh --all

# Global + workspace (all projects in subdirectories) — the "do everything" option
./setup-ai-tools.sh --full
```

### What It Does

**Global setup (`--global`):**

1. Detects OS (Linux/macOS)
2. Detects installed AI tools: OpenCode, Claude Code, Cursor, VS Code, Copilot, JetBrains, Gemini CLI, Antigravity
3. Creates `~/.config/ai/persona.md` with a default template (if no persona file exists)
4. Creates symlinks from the persona file to each detected tool's expected location
5. Prints manual instructions for tools that don't support file-based personas (Cursor, VS Code)

**Workspace setup (`--workspace`):**

1. Scans current folder's subdirectories for project manifests (package.json, pyproject.toml, go.mod, Cargo.toml, pom.xml, Gemfile)
2. Runs project setup on EVERY detected project automatically
3. Perfect for multi-repo workspaces — run once, set up all projects

**Project setup (`--project`):**

1. Creates `.claude/rules/` and `.claude/skills/` directories
2. Creates `AGENTS.md` (hub template with Development Philosophy section)
3. Creates `CLAUDE.md` (bridge)
4. Creates `GEMINI.md` (bridge)
5. Creates `opencode.json` (pointing to `.claude/rules/*.md`)
6. Creates `.github/copilot-instructions.md` (if VS Code/Copilot detected)
7. Creates `.junie/guidelines.md` (if JetBrains detected)

### Tool Detection

The script detects 7 tool categories:

| Tool | Detection Method |
|---|---|
| OpenCode | `opencode` binary OR `~/.config/opencode/` directory |
| Claude Code | `claude` binary OR `~/.config/Claude/` directory |
| Cursor | `cursor` binary OR app/config directory |
| VS Code | `code` binary |
| Copilot | VS Code extension check (`github.copilot`) |
| JetBrains | IDE binaries OR config directory |
| Gemini CLI | `gemini` binary OR `~/.gemini/` directory |
| Antigravity | `~/.gemini/antigravity/` directory |

### Idempotent by Design

The script is safe to run multiple times:

- Existing persona files are NOT overwritten without confirmation
- Existing symlinks are detected and skipped
- Existing project files (AGENTS.md, CLAUDE.md, etc.) are NOT overwritten
- Existing files are backed up before replacement (`.bak` suffix)

---

## Troubleshooting

### OpenCode Not Loading Rules

**Symptom**: The AI doesn't follow your rules or seems unaware of project context.

**Check:**

1. `opencode.json` has valid JSON (no trailing commas, no comments)
2. The `instructions` array points to existing files: `".claude/rules/*.md"`
3. `AGENTS.md` exists at repo root
4. Global `~/.config/opencode/AGENTS.md` exists

### Claude Code Not Seeing Context

**Symptom**: Claude Code ignores project conventions.

**Check:**

1. `CLAUDE.md` exists at repo root (NOT `AGENTS.md` — Claude Code reads `CLAUDE.md`)
2. `~/.config/Claude/AGENTS.md` exists for global context
3. `CLAUDE.md` references `AGENTS.md` so you don't maintain two files

### Skills Not Available

**Symptom**: The `/skill` command doesn't find your skill.

**Check:**

1. The skill is at `.claude/skills/skill-name/SKILL.md` (exact path — this is the Agent Skills standard)
2. The YAML frontmatter has both `name` and `description` fields
3. The frontmatter uses `---` delimiters (not ` ```yaml `)
4. The skill directory name matches the `name` field in the frontmatter (lowercase kebab-case)

### Config Breaking OpenCode

**Symptom**: OpenCode won't start after config changes.

**Check:**

1. Validate JSON: `cat opencode.json | python3 -m json.tool`
2. Remove any unrecognized config keys (OpenCode may crash on unknown keys)
3. Check global config: `~/.config/opencode/opencode.json`

**Known issue**: Adding a `"provider"` block with custom keys like `"setCacheKey"` can crash OpenCode if it's not a recognized configuration option. Use only documented config keys.

### Duplicate/Conflicting Rules

**Symptom**: The AI gets confused with contradictory instructions.

**Fix:**

1. Search for duplicates: `rg "pattern" .claude/ AGENTS.md CLAUDE.md`
2. Keep ONE source of truth — usually in rules for code patterns, AGENTS.md for conventions
3. Global persona should NOT repeat repo-specific rules

---

## Quick Reference Cheatsheet

### File Purposes

```
AGENTS.md        → Project identity (WHO am I, WHAT stack, HOW to code here)
CLAUDE.md        → Bridge for Claude Code → reads AGENTS.md
opencode.json    → OpenCode config → loads rules
.claude/rules/   → Code patterns (loaded by file type via frontmatter paths:)
.claude/skills/  → Deep workflow guidance (loaded on demand — Agent Skills standard)
```

### Adding Things

| You want to add... | Do this |
|---|---|
| New repo | Create AGENTS.md + CLAUDE.md + opencode.json + .claude/ at repo root |
| New coding rule | Add `.claude/rules/rule-name.md` with `paths:` frontmatter (under 80 lines) |
| New skill | Create `.claude/skills/skill-name/SKILL.md` with YAML frontmatter |
| New MCP | Add to the `mcp` block in `opencode.json` |
| New AI tool | Check if it reads AGENTS.md or the Agent Skills standard. If not, create a bridge file. |
| Cross-repo workflow | Document in the root orchestrator `AGENTS.md` |

### Token Budgets

```
Global persona:   ~500 tokens   (every call, every project)
Hub AGENTS.md:    ~1,000 tokens (every call, this project)
Rule file:        ~500 tokens   (conditional, by file type)
Skill:            ~2,000 tokens (on-demand only)
```

### Commands

```bash
# Verify JSON config
python3 -m json.tool < opencode.json

# Find duplicated content in context files
rg "pattern" .claude/ AGENTS.md CLAUDE.md

# Count tokens (estimate: 1 token ≈ 4 chars)
wc -c AGENTS.md  # divide by 4 for token estimate

# List all skills
find .claude/skills -name "SKILL.md" -exec head -4 {} \;
```

---

## Conclusion

This architecture solves a real problem: AI agents are powerful but blind to your project context. The solution is not to flood them with information (that makes them worse), but to give them the RIGHT context at the RIGHT time.

The key principles:

1. **Progressive Disclosure**: Lean hub always loaded, conditional rules by file type, on-demand skills
2. **Two layers**: Your persona follows you across all projects; project context lives with the repo
3. **One standard**: `.claude/skills/` works across 30+ tools via Agent Skills
4. **Human > Machine**: Human-written files improve performance; auto-generated ones make it worse
5. **Prescriptive > Descriptive**: "Use pnpm" is more useful than "the project has 4 modules"

Copy the script, run `./setup-ai-tools.sh --full`, and start writing your rules and skills. The AI can't discover your team's conventions — but if you tell it, it follows them.
