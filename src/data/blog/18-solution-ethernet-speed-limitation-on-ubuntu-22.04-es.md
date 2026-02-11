---
title: "Solucion al limite de velocidad Ethernet en Ubuntu 22.04"
author: "Francisco Gonzalez"
description: "Diagnostico y solucion cuando la red cableada queda limitada a 100 Mb/s en lugar de 1 Gb/s."
pubDate: 2024-07-13
image:
  url: "https://www.lifewire.com/thmb/DJFkg9M0762ac_LclJbNT3Y5K8E=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/how-fast-is-ethernet-817549-5b14c980aebb4891a54c1ed6cd9aacea.png"
  alt: "Ethernet speed comparison diagram"
tags: ["linux", "networking", "troubleshooting"]
category: linux
translationKey: post-18
lang: es
---

## Problema

En algunos casos, Ubuntu limita la conexion Ethernet a 100 Mb/s en vez de 1 Gb/s. Esto afecta transferencias grandes, streaming y otras tareas de alto ancho de banda.

## Solucion

La solucion consiste en revisar y ajustar velocidad/duplex de la interfaz.

### Paso 1: Instalar `ethtool`

```sh
sudo apt update
```

```sh
sudo apt install ethtool
```

### Paso 2: Revisar configuracion actual

```sh
sudo ethtool enp4s0
```

Reemplaza `enp4s0` por tu interfaz real.

### Paso 3: Configurar 1 Gb/s full duplex

```sh
sudo ethtool -s enp4s0 speed 1000 duplex full autoneg on
```

### Paso 4: Reiniciar red

```sh
sudo systemctl restart NetworkManager
```

### Paso 5: Verificar cambios

```sh
sudo ethtool enp4s0
```

Deberias ver `Speed: 1000Mb/s` y `Duplex: Full`.

## Conclusion

Con estos pasos deberias resolver el limite de velocidad Ethernet en Ubuntu y recuperar el rendimiento esperado de tu red.
