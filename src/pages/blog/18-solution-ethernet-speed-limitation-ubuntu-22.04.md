---
  title: "Solution to Ethernet Speed Limitation in Ubuntu 22.04"
  author: 'Francisco Gonzalez'
  description: 'Learn how to resolve the issue of your Ethernet connection being limited to 100 Mb/s instead of 1 Gb/s in Ubuntu.'
  pubDate: 2024-07-13
  image:
    url: 'https://www.lifewire.com/thmb/DJFkg9M0762ac_LclJbNT3Y5K8E=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/how-fast-is-ethernet-817549-5b14c980aebb4891a54c1ed6cd9aacea.png'
    alt: 'Linux Tux logo.'
  tags: ["networking", "ubuntu", "linux", "troubleshooting"]
  layout: ./../../layouts/MarkdownPostLayout.astro
---

# Solution to Ethernet Speed Limitation in Ubuntu 22.04

## Problem

In some cases, Ubuntu users may find that their Ethernet connection is limited to 100 Mb/s instead of the expected 1 Gb/s. This can significantly impact network performance, especially for tasks that require high bandwidth, such as transferring large files, streaming high-definition video, and other network-intensive activities.

## Solution

The solution to this problem involves checking and adjusting the Ethernet network interface settings to ensure it is using the correct speed and duplex. Below is a step-by-step guide to resolve this issue.

### Step 1: Install `ethtool`

`ethtool` is a command-line tool for configuring and querying Ethernet interfaces. If it is not installed on your system, you will need to install it.

1. Open a terminal.
2. Run the following command to update the package list:

    ```sh
    sudo apt update
    ```

3. Then, install `ethtool` by running:

    ```sh
    sudo apt install ethtool
    ```

### Step 2: Check the Current Network Interface Configuration

Once `ethtool` is installed, you can use it to check the current configuration of your network interface.

1. In the terminal, run the following command (replace `enp4s0` with the name of your network interface if different):

    ```sh
    sudo ethtool enp4s0
    ```

2. This command will display detailed information about the network interface configuration, including speed and duplex.

### Step 3: Configure the Correct Speed and Duplex

To configure the network interface to use 1 Gb/s and full duplex, follow these steps:

1. In the terminal, run the following command to set the speed and duplex:

    ```sh
    sudo ethtool -s enp4s0 speed 1000 duplex full autoneg on
    ```

2. This will set the speed to 1000 Mb/s (1 Gb/s) and the duplex to full with auto-negotiation enabled.

### Step 4: Restart the Network Service

To ensure the changes are applied correctly, restart the network service.

1. In the terminal, run the following command:

    ```sh
    sudo systemctl restart NetworkManager
    ```

### Step 5: Verify the New Configuration

After restarting the network service, verify the network interface configuration again to ensure the changes have been applied correctly.

1. In the terminal, run the following command again:

    ```sh
    sudo ethtool enp4s0
    ```

2. You should see that the speed is set to 1000 Mb/s and the duplex is set to full.

## Conclusion

By following these steps, you should be able to resolve the issue of Ethernet speed limitation on Ubuntu. Ensuring that your network is correctly configured is crucial for getting the best performance from your internet connection and local network.

We hope this guide has been helpful. If you have any additional questions or issues, please feel free to leave a comment.
