---
title: "Complete Guide to Install Cursor AI IDE on Ubuntu 24.04"
author: "Francisco Gonzalez"
description: "Learn how to install and configure Cursor AI IDE on Linux - Ubuntu 24.04, an AI-powered first code editor, to improve your development productivity."
pubDate: 2025-03-03
image:
  url: "https://pub-e67c19bba5c64333a98782860493cce5.r2.dev/1731997744170-Cursor%20AI-min.png"
  alt: "Cursor AI IDE banner"
tags:
  [
    "Cursor AI IDE",
    "Ubuntu",
    "AI-First Code Editor",
    "Development Tools",
    "linux",
  ]
layout: ./../../layouts/MarkdownPostLayout.astro
---

# Complete Guide to Install Cursor AI IDE on Ubuntu 24.04

## Introduction

In the world of software development, having efficient tools is crucial to optimizing workflow. **Cursor AI IDE** has become a popular AI-powered code editor designed to enhance developer productivity. This tutorial will guide you step by step on how to install Cursor AI IDE on **Ubuntu 24.04**, ensuring proper integration into your development environment.

## Method 1: Manuel Installation

### 1. Download the Cursor AppImage File

Visit the official Cursor website at [www.cursor.com](https://www.cursor.com) and download the latest version of the AppImage file. This file allows you to run the software without a traditional installation.

### 2. Move the AppImage File to a Designated Folder

To keep things organized, move the downloaded file to a dedicated applications folder:

```bash
cd ~/Downloads
mkdir -p ~/Applications
mv cursor-*.AppImage ~/Applications/cursor.AppImage
```

### 3. Install Required Dependencies

Cursor requires `libfuse2` to function correctly. Install it by running:

```bash
sudo apt update
sudo apt install libfuse2
```

### 4. Grant Execution Permissions to the AppImage

Ensure the AppImage has execution permissions:

```bash
chmod +x ~/Applications/cursor.AppImage
```

### 5. Run Cursor with `--no-sandbox` Option

Due to security configurations in Ubuntu 24.04, it is recommended to run Cursor with the `--no-sandbox` option:

```bash
~/Applications/cursor.AppImage --no-sandbox
```

### 6. Create a Desktop Entry for Menu Access

To make Cursor accessible from the application menu, create a `.desktop` file:

1. Open a text editor with superuser privileges:

   ```bash
   sudo nano /usr/share/applications/cursor.desktop
   ```

2. Add the following content:

   ```ini
   [Desktop Entry]
   Name=Cursor AI IDE
   Exec=/home/your_user/Applications/cursor.AppImage --no-sandbox
   Icon=/home/your_user/Applications/cursor.png
   Type=Application
   Categories=Development;
   ```

   Replace `your_user` with your actual username and ensure the icon path is correct.

3. Save and close the file.

### 7. Add an Alias to Run Cursor from Terminal

To simplify launching Cursor from the terminal, add an alias to your shell configuration file:

1. Open `.bashrc` file:

   ```bash
   nano ~/.bashrc
   ```

2. Append the following line:

   ```bash
   # Alias for Cursor AI IDE
   alias cursor='~/Applications/cursor.AppImage --no-sandbox'
   ```

3. Save the file and reload the configuration:

   ```bash
   source ~/.bashrc
   ```

## Method 2: Automated Installation with Script

You can automate all the previous steps using a script. Below is an example of a script based on the content of the gist (with incorporated corrections and comments from various users):

### 1. Create the script:

Open a text editor and save the following content in a file named, for example, `install_cursor.sh`:

```bash
#!/bin/bash

# Definición de variables de rutas y URLs
APPIMAGE_PATH="/opt/cursor.appimage"
ICON_PATH="/opt/cursor.png"
DESKTOP_ENTRY_PATH="/usr/share/applications/cursor.desktop"
CURSOR_URL="https://downloader.cursor.sh/linux/appImage/x64"
ICON_URL="https://pub-e67c19bba5c64333a98782860493cce5.r2.dev/cursor.png"

# Función para instalar Cursor AI IDE
function installCursor() {
  if [ -f "$APPIMAGE_PATH" ]; then
    echo "Cursor AI IDE ya está instalado. Para actualizar, ejecute el script con el parámetro 'update'."
    exit 0
  fi
  echo "Instalando Cursor AI IDE..."

  # Verificar si curl está instalado
  if ! command -v curl &> /dev/null; then
    echo "curl no está instalado. Instalando..."
    sudo apt-get update
    sudo apt-get install -y curl
  fi

  # Descargar el AppImage
  echo "Descargando Cursor AppImage..."
  sudo curl -L $CURSOR_URL -o $APPIMAGE_PATH
  sudo chmod +x $APPIMAGE_PATH

  # Descargar el ícono
  echo "Descargando el ícono de Cursor..."
  sudo curl -L $ICON_URL -o $ICON_PATH

  # Crear la entrada de escritorio (.desktop)
  echo "Creando entrada de escritorio..."
  sudo bash -c "cat > $DESKTOP_ENTRY_PATH" <<EOL
[Desktop Entry]
Name=Cursor AI IDE
Exec=$APPIMAGE_PATH --no-sandbox
Icon=$ICON_PATH
Type=Application
Categories=Development;
EOL

  # Agregar alias al archivo de configuración de shell (.bashrc)
  echo "Agregando alias 'cursor' a .bashrc..."
  bash -c "cat >> \$HOME/.bashrc" <<EOL

# Alias para Cursor AI IDE
function cursor() {
    $APPIMAGE_PATH --no-sandbox "\${@}" > /dev/null 2>&1 & disown
}
EOL

  # Recargar la configuración del shell para aplicar el alias
  source \$HOME/.bashrc

  echo "Instalación completada. Puede iniciar Cursor AI IDE desde el menú de aplicaciones o usando el comando 'cursor'."
}

# Función para actualizar Cursor AI IDE
function updateCursor() {
  if ! [ -f "$APPIMAGE_PATH" ]; then
    echo "Cursor AI IDE no está instalado. Primero ejecute la instalación usando 'install'."
    exit 1
  fi
  echo "Actualizando Cursor AI IDE..."

  # Verificar si curl está instalado
  if ! command -v curl &> /dev/null; then
    echo "curl no está instalado. Instalando..."
    sudo apt-get update
    sudo apt-get install -y curl
  fi

  # Descargar la nueva versión del AppImage
  echo "Descargando la nueva versión del AppImage..."
  sudo curl -L $CURSOR_URL -o $APPIMAGE_PATH
  sudo chmod +x $APPIMAGE_PATH

  # Descargar el ícono actualizado
  echo "Descargando el ícono actualizado..."
  sudo curl -L $ICON_URL -o $ICON_PATH

  echo "Actualización completada."
}

# Función para desinstalar Cursor AI IDE
function uninstallCursor() {
  if ! [ -f "$APPIMAGE_PATH" ]; then
    echo "Cursor AI IDE no está instalado."
    exit 1
  fi
  echo "Desinstalando Cursor AI IDE..."

  # Eliminar AppImage y el ícono
  sudo rm -f $APPIMAGE_PATH
  sudo rm -f $ICON_PATH

  # Eliminar la entrada de escritorio
  sudo rm -f $DESKTOP_ENTRY_PATH

  # Avisar al usuario que el alias agregado en .bashrc deberá eliminarse manualmente
  echo "Por favor, elimine manualmente la función alias 'cursor' de su archivo ~/.bashrc si ya no la desea."
  echo "Desinstalación completada."
}

# Función para mostrar el uso del script
function showUsage() {
  echo "Uso: $0 {install|update|uninstall}"
  exit 1
}

# Comprobar que se haya pasado un parámetro
if [ -z "$1" ]; then
  showUsage
fi

# Seleccionar la acción según el parámetro recibido
case "$1" in
  install)
    installCursor
    ;;
  update)
    updateCursor
    ;;
  uninstall)
    uninstallCursor
    ;;
  *)
    showUsage
    ;;
esac
```

### 2. Make the script executable and run it:

```bash
chmod +x install_cursor.sh
sudo ./install_cursor.sh
```

> **Important:** Since the script installs files in system directories (such as `/opt` and `/usr/share/applications`), it must be executed with administrator privileges (using `sudo`).

## Summary of Steps

1. Download the `AppImage` from [www.cursor.com](https://www.cursor.com).
2. Move the file to an appropriate location (e.g., `~/Applications` or `/opt`).
3. Install the required dependencies: `libfuse2` (and `curl` if needed).
4. Grant execution permissions to the `AppImage` file.
5. Run the `AppImage` using `--no-sandbox`.
6. Create a desktop entry (.desktop) to integrate Cursor into the application menu.
7. Add an alias in your shell configuration file to simplify launching from the terminal.
8. (Optional) Use a script to automate all steps.

## Conclusion

By following these steps, you will successfully install and configure **Cursor AI IDE** on your Ubuntu 24.04 system. This AI-powered tool will help improve your workflow and productivity in software development. Ensure you keep the software updated and explore its full capabilities to maximize its benefits.
