---
title: "Linux para developers: checklist mensual de mantenimiento"
author: "Francisco Gonzalez"
description: "Checklist mensual para mantener tu entorno Linux estable, seguro y rapido: disco, red, servicios, backups y updates sin perder tiempo."
pubDate: 2026-04-07
tags: ["linux", "productivity", "troubleshooting"]
category: linux
translationKey: post-33
lang: es
---

La mayoria de problemas en Linux no aparecen por una gran catastrofe, sino por pequenas cosas acumuladas: disco lleno, servicios colgados, logs sin control, paquetes desactualizados.

Este post te deja un checklist mensual que podes ejecutar en 30-45 minutos.

Hub de categoria para mas guias: [`/blog/category/linux/`](/blog/category/linux/).

## 1) Disco y limpieza basica

Empieza por visibilidad:

```bash
df -h
du -sh ~/* 2>/dev/null | sort -h
```

Luego limpia con criterio:

- caches grandes que no usas,
- artefactos viejos,
- logs locales excesivos,
- imagenes/containers en desuso si trabajas con Docker.

Si no sabes que borrar, primero mueve a carpeta temporal y valida 7 dias.

## 2) Updates sin romper setup

No es "actualizar por actualizar". Hazlo con orden:

```bash
sudo apt update
sudo apt upgrade -y
```

Despues valida:

- herramientas criticas (git, node, docker),
- audio/red/perifericos,
- servicios locales.

## 3) Red y conectividad

Checklist rapido:

- DNS resuelve bien?
- velocidad ethernet/wifi estable?
- VPN interfiere con rutas locales?

Relacionados:

- [`/blog/18-solution-ethernet-speed-limitation-on-ubuntu-2204/`](/blog/18-solution-ethernet-speed-limitation-on-ubuntu-2204/)
- [`/blog/17-setting-default-audio-device-at-session-start-on-ubuntu-2204/`](/blog/17-setting-default-audio-device-at-session-start-on-ubuntu-2204/)

## 4) Servicios y procesos

Revisa procesos consumidores:

```bash
ps aux --sort=-%mem | head -10
ps aux --sort=-%cpu | head -10
```

Si hay consumo anomalo recurrente, documenta causa y accion correctiva.

## 5) Backups y recuperacion

No alcanza con "hago backup". Debes poder restaurar.

Checklist:

- backup de dotfiles,
- backup de proyectos criticos,
- prueba de restore mensual en carpeta temporal.

## 6) Seguridad basica

- validar acceso SSH y claves activas,
- revisar puertos abiertos innecesarios,
- mantener firewall basico configurado.

## 7) Cierre mensual (10 minutos)

Deja registro breve:

- fecha de mantenimiento,
- hallazgos,
- acciones pendientes.

Eso te da trazabilidad y reduce debugging reactivo.

## Cierre

Linux estable no depende de suerte, depende de rutina. Un checklist chico pero constante evita la mayoria de dolores grandes.

Siguiente paso recomendado:

- [`/blog/22-how-to-create-command-aliases-in-linux-and-macos/`](/blog/22-how-to-create-command-aliases-in-linux-and-macos/)
- [`/blog/23-custom-terminal-setup-kitty-ranger-on-ubuntu-2404/`](/blog/23-custom-terminal-setup-kitty-ranger-on-ubuntu-2404/)
