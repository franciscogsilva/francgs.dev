---
title: "Como configurar dispositivos Razer en Ubuntu 22.04"
author: "Francisco Gonzalez"
description: "Instalacion y uso de OpenRazer y Polychromatic para gestionar perifericos Razer en Ubuntu."
pubDate: 2024-07-25
image:
  url: "https://linuxiac.b-cdn.net/wp-content/uploads/2021/08/openrazer.png"
  alt: "Linux Tux logo."
tags: ["linux", "developer-tools"]
category: linux
translationKey: post-19
lang: es
---

## Introduccion

OpenRazer te permite controlar dispositivos Razer en Linux, y Polychromatic agrega una interfaz grafica para configurarlos de forma sencilla.

## Paso a paso

### 1. Actualiza el sistema

```sh
sudo apt update
sudo apt upgrade
```

### 2. Agrega el repositorio de OpenRazer

```sh
sudo add-apt-repository ppa:openrazer/stable
sudo apt update
```

### 3. Instala OpenRazer

```sh
sudo apt install openrazer-meta
```

### 4. Agrega tu usuario al grupo `plugdev`

```sh
sudo gpasswd -a $USER plugdev
```

### 5. Reinicia

```sh
sudo reboot
```

## Opcional: instalar Polychromatic (GUI)

### 1. Agrega el repositorio

```sh
sudo add-apt-repository ppa:polychromatic/stable
sudo apt update
```

### 2. Instala Polychromatic

```sh
sudo apt install polychromatic
```

### Uso

1. Abre Polychromatic desde tus aplicaciones.
2. Configura iluminacion, macros y otras opciones de tus dispositivos detectados.

### Verifica estado de OpenRazer

```sh
sudo openrazer-daemon --verbose
```

## Conclusion

Con OpenRazer y Polychromatic puedes gestionar facilmente tus perifericos Razer en Ubuntu.
