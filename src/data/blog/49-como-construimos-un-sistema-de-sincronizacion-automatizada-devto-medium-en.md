---
title: "How We Built an Automated Post Sync System for Dev.to and Medium"
author: "Francisco Gonzalez"
description: "Step-by-step guide to implementing a clean-architecture post synchronization engine with rate-limit control, persistent state, and queue-based GitHub Actions migration."
pubDate: 2026-02-11
tags: ["devops", "github-actions", "automation", "api"]
category: devops
translationKey: post-49
lang: en
---

Automating syndication sounds easy until real constraints hit: API rate limits, duplicates, retries, partial failures, and CI pipelines that fail for reasons unrelated to your product.

In this post, I will break down how we built a production-safe sync system to publish blog posts to Dev.to and Medium, step by step, with code and no secrets.

## The Real Goal

We needed to solve four practical problems:

1. Publish only pending posts.
2. Survive Dev.to `429` rate limits.
3. Keep crosspost failures from breaking deploy.
4. Keep architecture extensible for future platforms.

## Chosen Architecture (Simple but Robust)

We used a ports/adapters approach:

- **Domain**: `BlogPost` entity.
- **Application**: `CrossPostArticlesUseCase`.
- **Infrastructure**:
  - markdown repository (`AstroMarkdownPostRepository`),
  - state repository (`FilePublicationStateRepository`),
  - per-platform publishers (`DevToPublisher`, `MediumPublisher`).

This keeps business flow isolated from API-specific HTTP details.

## Step 1: Model Post as an Entity

```js
export class BlogPost {
  constructor({ slug, title, description, tags, pubDate, canonicalUrl, body, lang }) {
    this.slug = slug;
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.pubDate = pubDate;
    this.canonicalUrl = canonicalUrl;
    this.body = body;
    this.lang = lang;
  }
}
```

The key addition here is `lang`, so we can publish by language strategy (`en` only during migration).

## Step 2: Build Correct Canonical URLs

The repository parses frontmatter, skips drafts, and builds canonical by language:

```js
const canonicalUrl = `${this.siteUrl}/${lang}/blog/${slug}/`;
```

This prevents publishing stale canonicals like `/blog/<slug>/` after moving to localized routes.

## Step 3: Persist Sync State

We persist per-platform state:

- `.crosspost/state-devto.json`
- `.crosspost/state-medium.json`

If a post already exists in state, it is skipped. That gives idempotency.

## Step 4: Handle Dev.to Rate Limits Properly

Our initial migration attempted too many posts in one run and triggered massive `429` responses.

Fixes applied:

- minimum spacing between publishes (`minIntervalMs`),
- retry logic reading `Retry-After` or response body hints,
- strict max posts per run (`CROSSPOST_MAX_POSTS=1`).

Core retry logic:

```js
if (response.status === 429) {
  const retrySeconds = parseRetrySeconds(response, errorBody);
  await sleep(retrySeconds * 1000);
  attempt += 1;
  continue;
}
```

## Step 4.1: Fix Dev.to 422 for Invalid Tags

During real migration we hit another failure mode: `422` for tags like `web-development`.

Dev.to API accepts alphanumeric tags, so we tightened sanitization:

```js
const sanitizeTags = (tags) =>
  [...new Set(
    tags
      .map((tag) => tag.normalize("NFKD").replace(/[\u0300-\u036f]/g, ""))
      .map((tag) => tag.toLowerCase().replace(/[^a-z0-9]/g, ""))
      .map((tag) => tag.slice(0, 20))
      .filter(Boolean)
  )].slice(0, 4);
```

With this:

- `web-development` -> `webdevelopment`
- `engineering-culture` -> `engineeringculture`

So one invalid tag no longer breaks the whole crosspost run.

## Step 5: Queue-Based Migration Every 5 Minutes

We added a dedicated GitHub Actions workflow with cron:

```yaml
on:
  schedule:
    - cron: "*/5 * * * *"
```

And we publish only one post per run:

```yaml
env:
  CROSSPOST_LANGS: en
  CROSSPOST_MAX_POSTS: "1"
  CROSSPOST_DEVTO_MAX_RETRIES: "6"
  CROSSPOST_DEVTO_MIN_INTERVAL_MS: "5000"
```

That transforms migration into a controlled queue instead of a bulk spike.

## Step 6: Never Let Crosspost Break Deploy

Crosspost matters, but product deploy is priority.

So we explicitly use:

```yaml
continue-on-error: true
```

and:

```yaml
CROSSPOST_FAIL_ON_ERROR: "false"
```

Now external API failures no longer block production deploy.

## Step 7: Make Behavior Configurable

Entry script supports runtime strategy via env vars:

- `CROSSPOST_LANGS=en`
- `CROSSPOST_MAX_POSTS=1`
- `CROSSPOST_STATE_PATH=.crosspost/state-devto.json`
- `--platform=devto` or `--platform=medium`

This lets us use migration mode and maintenance mode without changing core code.

## Recommended Operational Flow

1. **Initial migration**: every 5 minutes, one post per run, English only.
2. **Transition**: keep deploy sync capped at low volume.
3. **Steady state**: publish only unsynced posts and monitor rate-limit metrics.

## Implementation Checklist

- [ ] Define a post entity
- [ ] Parse markdown + language-aware canonical
- [ ] Persist per-platform sync state
- [ ] Add dedupe checks (state + canonical)
- [ ] Add 429 retries/backoff
- [ ] Limit per-run publication count
- [ ] Run migration as cron queue
- [ ] Keep crosspost isolated from deploy reliability

## Failures This Design Prevents

- Large-batch publishes that trigger hard rate limits.
- Duplicate external posts from missing state.
- Wrong canonical URLs after route refactor.
- Deploy pipeline failures due to third-party API instability.

## Close

The biggest improvement was not “more scripting.” It was operational design: idempotent flow, low-volume queue, explicit retries, and separation from core deploy.

If you replicate one thing, start with this: one post per run + persistent state + retry policy. That alone moves you from fragile automation to production-grade behavior.

Related:

- [`/en/blog/30-cicd-con-github-actions-y-vps-desde-cero-en/`](/en/blog/30-cicd-con-github-actions-y-vps-desde-cero-en/)
- [`/en/blog/42-integracion-llm-apis-retries-costos-observabilidad-en/`](/en/blog/42-integracion-llm-apis-retries-costos-observabilidad-en/)
- [`/en/blog/category/devops/`](/en/blog/category/devops/)
