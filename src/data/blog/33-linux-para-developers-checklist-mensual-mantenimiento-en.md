---
title: "Linux for Developers: Monthly Maintenance Checklist"
author: "Francisco Gonzalez"
description: "Monthly checklist to keep your Linux workstation stable, secure, and fast without wasting time."
pubDate: 2026-04-07
tags: ["linux", "productivity", "troubleshooting"]
category: linux
translationKey: post-33
lang: en
---
Most problems in Linux do not appear due to a major catastrophe, but rather due to accumulated small things: full disk, hung services, uncontrolled logs, outdated packages.

This post leaves you with a monthly checklist that you can execute in 30-45 minutes.

Category hub for more guides: [`/blog/category/linux/`](/blog/category/linux/).

## 1) Disk and basic cleaning

Start with visibility:

```bash
df -h
du -sh ~/* 2>/dev/null | sort -h
```

Then clean carefully:

- large caches that you don't use,
- old artifacts,
- excessive local logs,
- deprecated images/containers if you work with Docker.

If you don't know what to delete, first move it to the temporary folder and validate it for 7 days.

## 2) Updates without breaking setup

It is not "updating for the sake of updating". Do it in order:

```bash
sudo apt update
sudo apt upgrade -y
```

Then validate:

- critical tools (git, node, docker),
- audio/network/peripherals,
- local services.

## 3) Network and connectivity

Quick checklist:

- DNS resolves well?
- stable ethernet/wifi speed?
- Does VPN interfere with local routes?

Related:

- [`/blog/18-solution-ethernet-speed-limitation-on-ubuntu-2204/`](/blog/18-solution-ethernet-speed-limitation-on-ubuntu-2204/)
- [`/blog/17-setting-default-audio-device-at-session-start-on-ubuntu-2204/`](/blog/17-setting-default-audio-device-at-session-start-on-ubuntu-2204/)

## 4) Services and processes

Review consumer processes:

```bash
ps aux --sort=-%mem | head -10
ps aux --sort=-%cpu | head -10
```

If there is recurrent abnormal consumption, document the cause and corrective action.

## 5) Backups and recovery

"I make a backup" is not enough. You should be able to restore.

Checklist:

- dotfile backup,
- backup of critical projects,
- monthly restore test in temporary folder.

## 6) Basic security

- validate SSH access and active keys,
- check unnecessary open ports,
- keep basic firewall configured.

## 7) Monthly close (10 minutes)

Leave a brief record:

- maintenance date,
- findings,
- pending actions.

This gives you traceability and reduces reactive debugging.

## Closing

Stable Linux doesn't depend on luck, it depends on routine. A small but constant checklist avoids most major pain.

Recommended next step:

- [`/blog/22-how-to-create-command-aliases-in-linux-and-macos/`](/blog/22-how-to-create-command-aliases-in-linux-and-macos/)
- [`/blog/23-custom-terminal-setup-kitty-ranger-on-ubuntu-2404/`](/blog/23-custom-terminal-setup-kitty-ranger-on-ubuntu-2404/)
