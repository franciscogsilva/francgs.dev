---
  title: "Optimizing Disk Space on Linux and program to run ONE TIME a MONTH"
  author: 'Francisco Gonzalez'
  description: 'Automate monthly disk cleanup on Linux with Docker environment using cron jobs and system maintenance scripts'
  pubDate: 2024-02-05
  image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'The full Astro logo.'
  tags: ["linux", "docker", "devops"]
  layout: ./../../layouts/MarkdownPostLayout.astro
---

<!-- # Optimizing Disk Space on Linux and program to run ONE TIME a MONTH -->

## Introduction
Maintaining sufficient disk space is crucial for the smooth operation of any Linux system. Over time, unused files, logs, and temporary data can accumulate, leading to inefficient disk usage. This tutorial provides a step-by-step guide on how to automate disk space optimization on a Linux system, ensuring your system remains efficient and clutter-free.

## Prerequisites
- Basic knowledge of Linux commands
- Root access to the Linux system
- Docker installed (if docker cleanup is required)

## Script Breakdown
The provided script automates the process of cleaning up unnecessary files and optimizing disk space. It includes several key components:

1. **Display Current Disk Usage**: The script starts by displaying the current disk usage using the `df -h` command.
2. **Remove Specific Directories**: It removes user-specified directories. Adjust `/path/to/directory` to the directories you want to delete.
3. **Clean Temporary Files and Cache**: It cleans up temporary files and cache using `apt-get clean` and `apt-get autoremove`. This is particularly useful for Debian-based distributions.
4. **Reduce System Log Size**: Reduces the size of system logs, keeping logs from the last three days using `journalctl --vacuum-time=3d`.
5. **Clean Unused Docker Images**: For systems using Docker, it removes unused Docker images and containers with `docker system prune -a -f`.
6. **Display Disk Usage After Cleanup**: Again shows the disk usage after the cleanup process.
7. **Logging Activity**: The script logs the cleanup activity in a specified log file.

### Script

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

## Step-by-Step Tutorial

### 1. Create the Script
- Open a text editor and paste the provided script. `touch disk_cleanup.sh && nano disk_cleanup.sh`
- Modify the paths and commands according to your requirements.
- Save the file as `disk_cleanup.sh`.

### 2. Make the Script Executable
Run the following command in the terminal:
```bash
chmod +x disk_cleanup.sh
```

### 3. Testing the Script
Before automating, test the script:
```bash
sudo ./disk_cleanup.sh
```

### 4. Automate the Script (Monthly Cleanup)
- Edit the crontab file for the root user:
  ```bash
  sudo crontab -e
  ```
- Add the following line to run the script monthly:
  ```bash
  0 0 1 * * /path/to/disk_cleanup.sh
  ```
- Save and exit the editor.

## Conclusion
By following this guide, you've successfully set up a monthly disk space optimization routine for your Linux system. This automation ensures that your system remains clean and efficient, preventing potential issues related to disk space shortages.

Remember to periodically review and adjust the script to meet your evolving system needs.
