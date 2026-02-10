---
  title: "How to setup multiple GIT accounts with SSH"
  author: 'Francisco Gonzalez'
  description: "Complete guide to configure and manage multiple Git accounts with SSH keys on a single machine"
  pubDate: 2024-02-05
  image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'The full Astro logo.'
  tags: ["git", "security", "devops"]
  layout: ./../../layouts/MarkdownPostLayout.astro
---

<!-- # How to setup multiple GIT accounts with SSH -->

When working with multiple Git accounts, like a personal and a work account on GitHub and GitLab, it can be challenging to manage different SSH keys for each account. This tutorial will guide you through the process of setting up your SSH configuration to easily handle multiple Git accounts.

## Problem Explanation

The issue arises when you need to use different SSH keys for various Git accounts. Git does not natively support multiple SSH keys for different repositories on the same system. This means that without proper configuration, you cannot easily switch between your personal and work accounts or between different hosting services like GitHub and GitLab.

## Solution Overview

The solution involves creating unique SSH keys for each account and then configuring your SSH setup to use the appropriate key for each account. This way, you can seamlessly work with multiple Git repositories across different accounts and services.

## Step-by-Step Guide

### Step 1: Generate Different SSH Keys

Start by creating separate SSH keys for each of your GitHub and GitLab accounts.

1. **SSH Key for Personal GitHub Account**:

   Open your terminal and run:

   ```bash
   ssh-keygen -t ed25519 -C "your_personal_email@example.com" -f ~/.ssh/id_ed25519_github_personal
   ```

   Replace `your_personal_email@example.com` with the email associated with your personal GitHub account.

2. **SSH Key for Work GitHub Account**:

   ```bash
   ssh-keygen -t ed25519 -C "your_work_email@example.com" -f ~/.ssh/id_ed25519_github_work
   ```

   Replace `your_work_email@example.com` with the email associated with your work GitHub account.

3. **SSH Key for Work GitLab Account**:

   ```bash
   ssh-keygen -t ed25519 -C "your_work_email_gitlab@example.com" -f ~/.ssh/id_ed25519_gitlab_work
   ```

   Replace `your_work_email_gitlab@example.com` with the email associated with your GitLab account.

### Step 2: Add SSH Keys to Corresponding Accounts

Add each of these public keys to the respective accounts on GitHub and GitLab. The public keys can be found in your `~/.ssh` directory with a `.pub` extension.

### Step 3: Configure the `~/.ssh/config` File

Edit or create the `~/.ssh/config` file to specify which key should be used for each account.

```bash
# Personal GitHub Account
Host github.com-personal
   HostName github.com
   User git
   IdentityFile ~/.ssh/id_ed25519_github_personal
   IdentitiesOnly yes

# Work GitHub Account
Host github.com-work
   HostName github.com
   User git
   IdentityFile ~/.ssh/id_ed25519_github_work
   IdentitiesOnly yes

# Work GitLab Account
Host gitlab.com-work
   HostName gitlab.com
   User git
   IdentityFile ~/.ssh/id_ed25519_gitlab_work
   IdentitiesOnly yes
```

### Step 4: Clone Repositories Using Aliases

Use the defined aliases in your `config` file to clone repositories:

- **Personal GitHub Repository**:

  ```bash
  git clone git@github.com-personal:username/repository.git
  ```

- **Work GitHub Repository**:

  ```bash
  git clone git@github.com-work:username/repository.git
  ```

- **Work GitLab Repository**:

  ```bash
  git clone git@gitlab.com-work:username/repository.git
  ```

Replace `username/repository.git` with the actual repository path.

### Step 5: Verify Configuration

Verify your setup by connecting to each service:

```bash
ssh -T git@github.com-personal
ssh -T git@github.com-work
ssh -T git@gitlab.com-work
```

These commands will check if you can successfully connect to each service using the respective SSH keys.

## Conclusion

With this setup, you can efficiently and securely manage multiple Git repositories across different accounts and services. This approach simplifies the development workflow, especially when dealing with multiple roles or organizations.
