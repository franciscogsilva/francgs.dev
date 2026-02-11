---
title: "Commit Signing and Team Traceability Without Friction"
author: "Francisco Gonzalez"
description: "How to roll out commit signing and traceability rules that improve auditability and trust without slowing engineering teams down."
pubDate: 2026-04-30
tags: ["git", "security", "team-workflow", "compliance"]
category: git
translationKey: post-44
lang: en
---

Signing commits is not bureaucracy: it is the integrity of the author and history. When an incident occurs, knowing who approved and who integrated a change is no longer optional.

## Guided practical case

Team of 8 people, two critical repos and quarterly audit requirement. Current problem:

- commits without verifiable author,
- squash merges without clear PR reference,
- difficulty reconstructing decisions in incidents.

Plan in 3 phases:

1. mandatory signature on protected branches,
2. message convention + reference to issue/PR,
3. CI rules to reject unverified commits.

## Base configuration

Signing with SSH (simple and portable):

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
```

Quick check:

```bash
git log --show-signature -1
```

## Traceability policy that does work

- Every commit in `main` enters via PR.
- Each PR reference issue (`Closes #123`) and risk context.
- Merges maintain a relationship with PR and author (avoid opaque flows).
- Hook/CI validates commit convention + verified signature.

## Actionable checklist

- [ ] Activate commit signing for the entire team
- [ ] Block merge of unverified commits on protected branches
- [ ] Define commit convention and mandatory reference to issue/PR
- [ ] Train the team in `git log --show-signature`
- [ ] Audit each sprint a sampling of end-to-end traceability
