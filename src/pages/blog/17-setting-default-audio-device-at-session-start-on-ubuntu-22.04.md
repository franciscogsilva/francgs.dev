---
  title: "Setting Default Audio Device at Session Start in Ubuntu 22.04"
  author: 'Francisco Gonzalez'
  description: 'Ensure your preferred audio device is selected automatically each time you start a session in Ubuntu.'
  pubDate: 2024-06-29
  image:
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/200px-Tux.svg.png'
    alt: 'Linux Tux logo.'
  tags: ["linux", "terminal"]
  layout: ./../../layouts/MarkdownPostLayout.astro
---

## Introduction

Setting the default audio device at the start of the session is crucial for users who want to ensure their audio configuration remains consistent after every restart. This tutorial provides a step-by-step guide to set a default audio device in various desktop environments in Ubuntu. The goal is to prevent the system from selecting a different device than the user's preferred one each time a session starts. The benefits include a smoother user experience and eliminating the need for repetitive manual adjustments.

## Common Part of the Tutorial for All Desktop Environments

### Step 1: Identify the Audio Device

1. **Open a terminal**.
2. **Run the command to list audio devices**:

   ```bash
   pactl list short sinks
   ```

   The output will be something like this:

   ```text
   2   alsa_output.pci-0000_2b_00.1.hdmi-stereo-extra4   module-alsa-card.c   s16le 2ch 44100Hz   SUSPENDED
   3   alsa_output.pci-0000_2d_00.4.analog-stereo        module-alsa-card.c   s16le 2ch 44100Hz   SUSPENDED
   6   alsa_output.usb-Kingston_Technology_Company_HyperX_Cloud_Flight_Wireless-00.analog-stereo  module-alsa-card.c   s16le 2ch 44100Hz   SUSPENDED
   ```

   Identify the name of the device you want to use, for example, `alsa_output.pci-0000_2d_00.4.analog-stereo`.

### Step 2: Create the Script to Set the Default Audio Device

1. **Create the script file**:

   ```bash
   nano ~/config/set_default_audio.sh
   ```

2. **Add the following content to the script**:

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

3. **Save and close the file** (`Ctrl+O` to save and `Ctrl+X` to exit).

4. **Make the script executable**:

   ```bash
   chmod +x ~/config/set_default_audio.sh
   ```

## Specific Part for Each Desktop Environment

### GNOME

1. **Create a `.desktop` file in the `~/.config/autostart` directory**:

   ```bash
   mkdir -p ~/.config/autostart
   nano ~/.config/autostart/set_default_audio.desktop
   ```

2. **Add the following content to the `.desktop` file**:

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

3. **Save and close the file** (`Ctrl+O` to save and `Ctrl+X` to exit).

### KDE Plasma

1. **Create a `.desktop` file in the `~/.config/autostart` directory**:

   ```bash
   mkdir -p ~/.config/autostart
   nano ~/.config/autostart/set_default_audio.desktop
   ```

2. **Add the following content to the `.desktop` file**:

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

3. **Save and close the file** (`Ctrl+O` to save and `Ctrl+X` to exit).

### XFCE

1. **Create a `.desktop` file in the `~/.config/autostart` directory**:

   ```bash
   mkdir -p ~/.config/autostart
   nano ~/.config/autostart/set_default_audio.desktop
   ```

2. **Add the following content to the `.desktop` file**:

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

3. **Save and close the file** (`Ctrl+O` to save and `Ctrl+X` to exit).

### MATE

1. **Create a `.desktop` file in the `~/.config/autostart` directory**:

   ```bash
   mkdir -p ~/.config/autostart
   nano ~/.config/autostart/set_default_audio.desktop
   ```

2. **Add the following content to the `.desktop` file**:

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

3. **Save and close the file** (`Ctrl+O` to save and `Ctrl+X` to exit).

## Conclusion

Setting the default audio device at the start of the user's session ensures a more consistent experience and eliminates the need for repetitive manual adjustments. This tutorial has demonstrated how to achieve this in various popular desktop environments in Ubuntu. By following these steps, you can ensure that your preferred audio device is automatically selected every time you start a session, enhancing your user experience.
