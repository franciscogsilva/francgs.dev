---
title: "Guia completa para instalar Cursor AI IDE en Ubuntu 24.04"
author: "Francisco Gonzalez"
description: "Instala y configura Cursor AI en Linux para mejorar productividad de desarrollo con asistencia de IA."
pubDate: 2025-03-03
image:
  url: "https://assets.francgs.dev/1731997744170-Cursor%20AI-min.png"
  alt: "Cursor AI IDE banner"
tags: ["linux", "ai", "developer-tools"]
category: tools
translationKey: post-21
lang: es
---

## Introduccion

Cursor AI IDE es un editor de codigo con capacidades de IA. En esta guia veras dos formas de instalarlo en Ubuntu 24.04: manual y automatizada con script.

## Metodo 1: instalacion manual

### 1. Descargar el AppImage de Cursor

Ve a [www.cursor.com](https://www.cursor.com) y descarga la version mas reciente para Linux.

### 2. Mover el AppImage a una carpeta dedicada

```bash
cd ~/Downloads
mkdir -p ~/Applications
mv cursor-*.AppImage ~/Applications/cursor.AppImage
```

### 3. Instalar dependencias

Cursor requiere `libfuse2`:

```bash
sudo apt update
sudo apt install libfuse2
```

### 4. Dar permisos de ejecucion

```bash
chmod +x ~/Applications/cursor.AppImage
```

### 5. Ejecutar con `--no-sandbox`

```bash
~/Applications/cursor.AppImage --no-sandbox
```

### 6. Crear acceso en el menu de aplicaciones

1. Crea el archivo:

   ```bash
   sudo nano /usr/share/applications/cursor.desktop
   ```

2. Pega este contenido:

   ```ini
   [Desktop Entry]
   Name=Cursor AI IDE
   Exec=/home/your_user/Applications/cursor.AppImage --no-sandbox
   Icon=/home/your_user/Applications/cursor.png
   Type=Application
   Categories=Development;
   ```

3. Reemplaza `your_user` por tu usuario y verifica la ruta del icono.

### 7. Crear alias para abrir Cursor desde terminal

1. Abre `~/.bashrc`:

   ```bash
   nano ~/.bashrc
   ```

2. Agrega:

   ```bash
   # Alias for Cursor AI IDE
   alias cursor='~/Applications/cursor.AppImage --no-sandbox'
   ```

3. Recarga configuracion:

   ```bash
   source ~/.bashrc
   ```

## Metodo 2: instalacion automatizada con script

### 1. Crea el script

Guarda este contenido en `install_cursor.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

# ==============================
# Configuración de rutas y URLs
# ==============================
APPIMAGE_PATH="/opt/cursor.appimage"
ICON_PATH="/opt/cursor.png"
DESKTOP_ENTRY_PATH="/usr/share/applications/cursor.desktop"
ICON_URL="https://assets.francgs.dev/cursor.png"
API_URL="https://www.cursor.com/api/download?platform=linux-x64&releaseTrack=stable"

# =======================================
# Función: Comprueba e instala dependencia
# =======================================
ensure_dependency() {
  local cmd="$1" pkg="$2"
  if ! command -v "$cmd" &> /dev/null; then
    echo "Instalando dependencia: $pkg..."
    sudo apt-get update
    sudo apt-get install -y "$pkg"
  fi
}

# ===================================
# Función: Obtiene URL del AppImage
# ===================================
get_cursor_url() {
  # Seguimos redirecciones para obtener el JSON final
  local raw
  if ! raw=$(curl -sSL "$API_URL"); then
    echo "Error: no se pudo contactar la API ($API_URL)" >&2
    return 1
  fi

  # Muestra JSON completo en stderr para debug
  echo "DEBUG: respuesta API -> $raw" >&2

  # Extrae downloadUrl o url con jq
  local url
  url=$(printf '%s' "$raw" | jq -r '.downloadUrl // .url // empty')
  printf '%s' "$url"
}

# ==================================================
# Función: Descarga e instala AppImage, ícono y .desktop
# ==================================================
fetch_and_install() {
  echo "Obteniendo URL de descarga de Cursor..."
  local CURSOR_URL
  if ! CURSOR_URL=$(get_cursor_url); then
    echo "Error: no se pudo obtener la URL de descarga." >&2
    exit 1
  fi

  if [[ -z "$CURSOR_URL" ]]; then
    echo "Error: campo downloadUrl/url vacío en la respuesta." >&2
    exit 1
  fi

  echo "Descargando AppImage desde:"
  echo "  $CURSOR_URL"
  sudo curl -L --fail "$CURSOR_URL" -o "$APPIMAGE_PATH"
  sudo chmod +x "$APPIMAGE_PATH"

  echo "Descargando ícono..."
  sudo curl -L --fail "$ICON_URL" -o "$ICON_PATH"

  echo "Creando/actualizando entrada de escritorio..."
  sudo tee "$DESKTOP_ENTRY_PATH" > /dev/null <<EOF
[Desktop Entry]
Name=Cursor AI IDE
Exec=$APPIMAGE_PATH --no-sandbox
Icon=$ICON_PATH
Type=Application
Categories=Development;
EOF
}

# ============================
# Lógica principal del script
# ============================
case "${1:-install}" in
  install)
    if [[ -f "$APPIMAGE_PATH" ]]; then
      echo "Cursor ya está instalado. Usa '$0 update' para actualizar."
      exit 0
    fi
    echo "=== Instalando Cursor AI IDE ==="
    ensure_dependency curl curl
    ensure_dependency jq jq
    fetch_and_install
    echo "¡Instalación completada!"
    ;;
  update)
    if [[ ! -f "$APPIMAGE_PATH" ]]; then
      echo "Cursor no está instalado. Usa '$0 install' primero."
      exit 1
    fi
    echo "=== Actualizando Cursor AI IDE ==="
    ensure_dependency curl curl
    ensure_dependency jq jq
    fetch_and_install
    echo "¡Actualización completada!"
    ;;
  *)
    echo "Uso: $0 [install|update]"
    exit 1
    ;;
esac
```

### 2. Haz ejecutable el script y ejecutalo

```bash
chmod +x install_cursor.sh
sudo ./install_cursor.sh
```

> **Importante:** el script escribe en rutas del sistema (`/opt` y `/usr/share/applications`), por eso debe ejecutarse con `sudo`.

## Resumen rapido

1. Descarga AppImage desde [www.cursor.com](https://www.cursor.com).
2. Mueve el archivo a `~/Applications` o `/opt`.
3. Instala dependencias (`libfuse2`, y `curl/jq` si usas script).
4. Da permisos de ejecucion.
5. Ejecuta con `--no-sandbox`.
6. Crea el `.desktop`.
7. (Opcional) agrega alias.
8. (Opcional) automatiza con script.

## Conclusion

Con estos pasos puedes instalar y mantener Cursor AI IDE en Ubuntu 24.04 de forma manual o automatizada.
