---
title: "Advanced TypeScript in Real Projects: Patterns and Tradeoffs"
author: "Francisco Gonzalez"
description: "Advanced TypeScript patterns for production systems, with common pitfalls and decision criteria."
pubDate: 2026-03-24
tags: ["typescript", "web-development", "system-design"]
category: web-development
translationKey: post-31
lang: en
---

TypeScript is not about "typing everything"; it's about modeling the domain better without making the code unmaintainable.

## 1) Design types from use cases, not files

When the type is born from infrastructure, it ends up contaminating the entire domain. Better:

- defines contracts at the application layer,
- adapts to edge frameworks.

## 2) Patterns that are worth it

## Discriminated unions for state flows

```ts
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
```

## Branded types for critical IDs

```ts
type UserId = string & { readonly brand: "UserId" };
```

You avoid mixing semantically different IDs by accident.

## Utility types with criteria

`Pick`, `Omit`, `Partial` help, but do not replace explicit modeling when the case is complex.

## 3) Common mistakes

- use `any` to "exit quickly",
- generic over-engineering,
- giant fonts that are difficult to read,
- do not type errors or IO boundaries.

## 4) Practical decision

Always ask yourself:

1. Does this type improve decisions in runtime?
2. Reduces business bugs or just "looks fancy"?
3. Does another developer understand it in 2 minutes?
