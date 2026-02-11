---
title: "Optimizar espacio en disco en Linux con ejecucion mensual"
author: "Francisco Gonzalez"
description: "Automatiza limpieza mensual de disco con scripts de mantenimiento, cron y tareas para Docker."
pubDate: 2024-02-05
image:
  url: "https://docs.astro.build/assets/full-logo-light.png"
  alt: "The full Astro logo."
tags: ["linux", "docker", "devops"]
category: devops
translationKey: post-16
lang: es
---

<!-- # Optimizar espacio en disco en Linux y programa para ejecutar una vez al mes -->

## Introduccion

Mantener suficiente espacio en disco es clave para un sistema Linux estable. Esta guia muestra como automatizar una limpieza mensual.

## Prerrequisitos

- Conocimiento basico de comandos Linux
- Acceso root
- Docker instalado (si vas a limpiar recursos Docker)

## Script

```bash
#!/bin/bash

# Display current disk usage
echo "Disk space usage before cleanup:"
df -h

# Remove specific directories (adjust according to your needs)
rm -rf /path/to/directory

# Clean temporary files and cache (adjust as needed)
# This is just an example, make sure to adapt it to your needs
apt-get clean && apt-get autoremove

# Reduce the size of system logs.
sudo journalctl --vacuum-time=3d

# Clean up unused Docker images
docker system prune -a -f

# Display disk usage after cleanup
echo "Disk space usage after cleanup:"
df -h

# Activity log
echo "Cleanup completed on: $(date)" >> /path/to/logfile.log
```

## Paso a paso

### 1. Crea el script

- Abre un editor y pega el script: `touch disk_cleanup.sh && nano disk_cleanup.sh`
- Ajusta rutas y comandos segun tu entorno.
- Guarda como `disk_cleanup.sh`.

### 2. Dale permisos de ejecucion

```bash
chmod +x disk_cleanup.sh
```

### 3. Pruebalo manualmente

```bash
sudo ./disk_cleanup.sh
```

### 4. Automatizalo mensualmente con cron

- Edita crontab de root:
  ```bash
  sudo crontab -e
  ```
- Agrega esta linea para ejecutar el dia 1 de cada mes:
  ```bash
  0 0 1 * * /path/to/disk_cleanup.sh
  ```

## Conclusion

Con esta automatizacion, tu sistema se mantiene limpio y eficiente cada mes. Revisa periodicamente el script para adaptarlo a nuevas necesidades.
