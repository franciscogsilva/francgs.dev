---
title: "How to Create Command Aliases in Linux and macOS"
author: "Francisco Gonzalez"
description: "Learn how to create aliases in Linux and macOS to run multiple commands with a single shortcut."
pubDate: 2025-03-11
image:
  url: "https://assets.francgs.dev/22-how-to-create-command-aliases-in-linux-and-macos.jpg"
  alt: "Linux and macOS terminal alias creation"
tags: ["linux", "terminal", "productivity"]
layout: ./../../layouts/MarkdownPostLayout.astro
---

Aliases in Unix-based systems like Linux and macOS allow you to create shortcuts for frequently used or complex commands. This tutorial will guide you through creating aliases that execute multiple commands in sequence.

## Introduction

Imagine you frequently need to clear the terminal screen and then list all files in the current directory in detail. Instead of running these commands separately:

```bash
clear
ls -la
```

You can create an alias that combines both commands:

```bash
alias ll='clear && ls -la'
```

## What Is an Alias in Unix?

An alias assigns a custom shortcut to a longer command or sequence of commands. This helps simplify command execution and improves workflow efficiency.

## Creating a Temporary Alias

To create a temporary alias (valid only for the current terminal session), use this syntax:

```bash
alias alias_name='command1 && command2 && command3'
```

For example, to create an alias that clears the screen and lists files:

```bash
alias cls='clear && ls -la'
```

Now, typing cls in the terminal will execute both commands sequentially.

## Creating a Permanent Alias

To make an alias persist across terminal sessions, add it to the shell configuration file. The file depends on your shell and operating system.

### In Bash (Linux and macOS)

1. Edit the `.bashrc` (Linux) or `.bash_profile` (macOS) file:

   Open the configuration file with your preferred text editor:

   ```bash
   nano ~/.bashrc   # For Linux
   nano ~/.bash_profile   # For macOS
   ```

2. Add the alias to the file:

   Append this line to the end of the file:

   ```bash
   alias cls='clear && ls -la'
   ```

3. Save and exit the editor.

4. Apply the changes by sourcing the file:

   To apply changes without restarting the terminal, run:

   ```bash
   source ~/.bashrc   # For Linux
   source ~/.bash_profile   # For macOS
   ```

### In Zsh (macOS and Some Linux Distributions)

If you use Zsh, the configuration file is `.zshrc`.

1. Edit the `.zshrc` file:

   Open the configuration file with your preferred text editor:

   ```bash
   nano ~/.zshrc
   ```

2. Add the alias to the file:

   ```bash
   alias cls='clear && ls -la'
   ```

3. Save and close the file.

4. Apply the changes by sourcing the file:

   ```bash
   source ~/.zshrc
   ```

## Additional Considerations

- Use single quotes (') around the command to prevent premature expansion of variables or special characters.
- Aliases do not accept parameters. If you need arguments, consider using a shell function instead.

## Conclusion

Creating aliases in Linux and macOS helps streamline command execution and improves productivity. By following these steps, you can customize your terminal environment and optimize your workflow.
