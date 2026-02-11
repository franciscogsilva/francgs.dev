---
title: "Optimizar red en Ubuntu para workstation de desarrollo"
author: "Francisco Gonzalez"
description: "Ajustes practicos de red en Ubuntu para reducir latencia, estabilizar DNS y mejorar la experiencia diaria en entornos de desarrollo."
pubDate: 2026-05-03
tags: ["linux", "ubuntu", "network", "productivity", "dev-workstation"]
category: linux
translationKey: post-47
lang: es
---

Una workstation lenta no siempre es CPU o disco. Muchas fricciones de desarrollo vienen de red: DNS inestable, MTU incorrecta o Wi-Fi con ahorro agresivo.

## Caso practico guiado

Sintomas del equipo:

- `pnpm install` lento e intermitente,
- timeouts al clonar/pushear,
- videollamadas inestables mientras corres contenedores.

Objetivo: estabilizar conectividad y bajar latencia efectiva en tareas de desarrollo.

## Ajustes recomendados (Ubuntu)

Validar interfaz y estado:

```bash
ip -br a
nmcli device status
```

Definir DNS confiable en NetworkManager:

```bash
nmcli connection modify "Wired connection 1" ipv4.ignore-auto-dns yes
nmcli connection modify "Wired connection 1" ipv4.dns "1.1.1.1 8.8.8.8"
nmcli connection up "Wired connection 1"
```

Probar MTU si hay perdida/fragmentacion (ejemplo 1450):

```bash
nmcli connection modify "Wired connection 1" ethernet.mtu 1450
nmcli connection up "Wired connection 1"
```

## Observabilidad local minima

- `ping -c 20 1.1.1.1` para latencia base.
- `resolvectl status` para auditar resolucion DNS real.
- `journalctl -u NetworkManager --since "15 min ago"` ante desconexiones.

## Checklist accionable

- [ ] DNS manual probado y documentado por entorno
- [ ] MTU validada segun proveedor/VPN
- [ ] Power saving revisado en Wi-Fi si hay cortes
- [ ] Pruebas base antes/despues (latencia, perdida, jitter)
- [ ] Playbook de recuperacion de red en onboarding
