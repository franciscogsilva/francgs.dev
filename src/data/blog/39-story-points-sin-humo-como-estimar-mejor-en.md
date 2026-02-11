---
title: "Story Points Without the Noise: Better Estimation for Senior Teams"
author: "Francisco Gonzalez"
description: "How senior teams can estimate with story points using risk, complexity, and learning as core signals."
pubDate: 2026-04-25
tags: ["engineering-culture", "agile", "software-engineering"]
category: engineering-culture
translationKey: post-39
lang: en
---
Story points do not measure time. They measure uncertainty, complexity and relative risk. If the team uses them as "disguised hours", they miss the point.

## Guided practical case

History: "Add retry policy to notification service."

Evaluation by axes:

- Technical complexity: medium
- Domain uncertainty: low
- Integration risk: high

Compared to the team's reference stories, it ends at 8 points (not by hours, due to relative risk).

##Simple framework

Evaluate each story on 3 axes:

1. technical complexity,
2. domain uncertainty,
3. integration risk.

Then assign relative point comparing with reference stories.

## Anti-pattern

"This assignment is 3 points because it is 6 hours."

That destroys real speed learning and ends up biasing planning.

## Recommended practice

- review estimates at the end of the sprint,
- capture causes of deviation,
- adjust base references.

## Simple TypeScript helper for workshops

```ts
type StoryScore = {
  complexity: 1 | 2 | 3;
  uncertainty: 1 | 2 | 3;
  integrationRisk: 1 | 2 | 3;
};

function suggestPoints(score: StoryScore): number {
  const total = score.complexity + score.uncertainty + score.integrationRisk;
  if (total <= 3) return 1;
  if (total <= 5) return 3;
  if (total <= 7) return 5;
  if (total <= 8) return 8;
  return 13;
}
```

It does not replace team judgment, but it helps align discussions.

Related:

- [`/blog/20-understanding-story-points-agile-estimation/`](/blog/20-understanding-story-points-agile-estimation/)
- [`/en/blog/32-como-hacer-code-reviews-efectivos-sin-bloquear/`](/en/blog/32-como-hacer-code-reviews-efectivos-sin-bloquear/)
- [`/blog/category/engineering-culture/`](/blog/category/engineering-culture/)
