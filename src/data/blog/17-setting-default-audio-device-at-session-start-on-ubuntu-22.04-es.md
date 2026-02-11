---
title: "Definir dispositivo de audio por defecto al iniciar sesion en Ubuntu 22.04"
author: "Francisco Gonzalez"
description: "Asegura que Ubuntu seleccione automaticamente tu salida de audio preferida al iniciar sesion."
pubDate: 2024-06-29
image:
  url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/200px-Tux.svg.png"
  alt: "Linux Tux logo."
tags: ["linux", "terminal"]
category: linux
translationKey: post-17
lang: es
---

## Introduccion

Este tutorial te ayuda a fijar automaticamente el dispositivo de audio por defecto al iniciar sesion en Ubuntu, evitando cambios manuales despues de cada reinicio.

## Parte comun para todos los entornos de escritorio

### Paso 1: Identifica el dispositivo de audio

1. Abre una terminal.
2. Ejecuta:

```bash
pactl list short sinks
```

Salida esperada (ejemplo):

```text
2   alsa_output.pci-0000_2b_00.1.hdmi-stereo-extra4   module-alsa-card.c   s16le 2ch 44100Hz   SUSPENDED
3   alsa_output.pci-0000_2d_00.4.analog-stereo        module-alsa-card.c   s16le 2ch 44100Hz   SUSPENDED
6   alsa_output.usb-Kingston_Technology_Company_HyperX_Cloud_Flight_Wireless-00.analog-stereo  module-alsa-card.c   s16le 2ch 44100Hz   SUSPENDED
```

Elige el nombre del dispositivo que quieres usar, por ejemplo `alsa_output.pci-0000_2d_00.4.analog-stereo`.

### Paso 2: Crea el script para fijar salida por defecto

1. Crea el archivo:

```bash
nano ~/config/set_default_audio.sh
```

2. Pega este contenido:

```bash
#!/bin/bash

# Add a delay to ensure PulseAudio is fully loaded
sleep 10

# Desired output device name
DEFAULT_SINK="alsa_output.pci-0000_2d_00.4.analog-stereo"

# Set the default output device
pactl set-default-sink $DEFAULT_SINK

# Move current applications to the new default output device
for INPUT in $(pactl list short sink-inputs | cut -f1); do
    pactl move-sink-input $INPUT $DEFAULT_SINK
done
```

3. Guarda y cierra el archivo.

4. Hazlo ejecutable:

```bash
chmod +x ~/config/set_default_audio.sh
```

## Configuracion por entorno de escritorio

### GNOME

1. Crea el archivo `.desktop`:

```bash
mkdir -p ~/.config/autostart
nano ~/.config/autostart/set_default_audio.desktop
```

2. Pega:

```ini
[Desktop Entry]
Type=Application
Exec=/home/username/config/set_default_audio.sh
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
Name=Set Default Audio
Comment=Set the default audio output on startup
```

### KDE Plasma

```bash
mkdir -p ~/.config/autostart
nano ~/.config/autostart/set_default_audio.desktop
```

```ini
[Desktop Entry]
Type=Application
Exec=/home/username/config/set_default_audio.sh
Hidden=false
NoDisplay=false
X-KDE-Autostart-enabled=true
Name=Set Default Audio
Comment=Set the default audio output on startup
```

### XFCE

```bash
mkdir -p ~/.config/autostart
nano ~/.config/autostart/set_default_audio.desktop
```

```ini
[Desktop Entry]
Type=Application
Exec=/home/username/config/set_default_audio.sh
Hidden=false
NoDisplay=false
X-XFCE-Autostart-enabled=true
Name=Set Default Audio
Comment=Set the default audio output on startup
```

### MATE

```bash
mkdir -p ~/.config/autostart
nano ~/.config/autostart/set_default_audio.desktop
```

```ini
[Desktop Entry]
Type=Application
Exec=/home/username/config/set_default_audio.sh
Hidden=false
NoDisplay=false
X-MATE-Autostart-enabled=true
Name=Set Default Audio
Comment=Set the default audio output on startup
```

## Conclusion

Con estos pasos, tu dispositivo de audio preferido quedara seleccionado automaticamente al iniciar sesion, sin ajustes manuales repetitivos.
