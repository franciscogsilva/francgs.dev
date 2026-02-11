---
title: "Optimize Ubuntu Networking for a Dev Workstation"
author: "Francisco Gonzalez"
description: "Practical Ubuntu network tuning to reduce latency, stabilize DNS resolution, and improve daily developer workflows."
pubDate: 2026-05-03
tags: ["linux", "ubuntu", "network", "productivity", "dev-workstation"]
category: linux
translationKey: post-47
lang: en
---

A slow workstation is not always a CPU or a disk. Many development frictions come from the network: unstable DNS, incorrect MTU or aggressively saving Wi-Fi.

## Guided practical case

Equipment symptoms:

- `pnpm install` slow and intermittent,
- timeouts when cloning/pushing,
- Unstable video calls while running containers.

Objective: stabilize connectivity and lower effective latency in development tasks.

## Recommended settings (Ubuntu)

Validate interface and state:

```bash
ip -br a
nmcli device status
```

Define trusted DNS in NetworkManager:

```bash
nmcli connection modify "Wired connection 1" ipv4.ignore-auto-dns yes
nmcli connection modify "Wired connection 1" ipv4.dns "1.1.1.1 8.8.8.8"
nmcli connection up "Wired connection 1"
```

Test MTU for loss/fragmentation (example 1450):

```bash
nmcli connection modify "Wired connection 1" ethernet.mtu 1450
nmcli connection up "Wired connection 1"
```

## Minimum local observability

- `ping -c 20 1.1.1.1` for base latency.
- `resolvectl status` to audit real DNS resolution.
- `journalctl -u NetworkManager --since "15 min ago"` in case of disconnections.

## Actionable checklist

- [ ] Manual DNS tested and documented by environment
- [ ] MTU validated according to provider/VPN
- [ ] Revised power saving on Wi-Fi if there are outages
- [ ] Base tests before/after (latency, loss, jitter)
- [ ] Network recovery playbook in onboarding
