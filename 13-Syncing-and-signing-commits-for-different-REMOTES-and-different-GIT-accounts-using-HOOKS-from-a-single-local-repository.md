
# Syncing and signing commits for different REMOTES and different GIT accounts using HOOKS from a single local repository

## Introduction

In the dynamic realm of software development, maintaining consistency across multiple Git repositories is a common challenge. Developers often need to synchronize changes between a primary repository and a secondary or backup repository. Manually managing this process can be time-consuming and error-prone. This article explores an automated solution using Git hooks to streamline synchronization between two identical repositories.

## Use Cases

This approach is particularly beneficial in scenarios such as:
- **Maintaining Backup Repositories:** Keeping a backup repository in sync with the main repository with differents accounts.
- **Consistency in Project Forks:** Ensuring that forks of a primary project reflect the latest changes in other repo with differents accounts.
- **Demonstration or Testing Repositories:** Automatically updating a demo or test repository with changes from the main repository.

## Prerequisites

It's crucial to note that this method requires both repositories to be identical in structure. Any branches and changes made in the primary repository should be mirrored in the secondary repository to ensure seamless synchronization.

## Step-by-Step Guide

### Setting Up the `pre-commit` Hook

The `pre-commit` hook prepares the synchronization process by copying staged files from the primary to the secondary repository.

**Example `pre-commit` Hook Script:**

```bash
#!/bin/bash

# Path to the secondary (backup) repository
BACKUP_REPO_DIR="/path/to/backup/repo"

# Copy staged files to the secondary repository
git diff --cached --name-only --diff-filter=ACM | xargs -I {} cp {} $BACKUP_REPO_DIR
```

### Setting Up the `post-commit` Hook

The `post-commit` hook captures the commit message and author from the primary repository and applies them to the secondary repository.

**Example `post-commit` Hook Script:**

```bash
#!/bin/bash

# Author for the commits in the secondary repository
AUTHOR="example@example.com"

# Path to the secondary repository
BACKUP_REPO_DIR="/path/to/backup/repo"

# Capture the message of the last commit
COMMIT_MESSAGE=$(git log -1 --pretty=%B)

# Go to the secondary repository and commit with the captured message
cd $BACKUP_REPO_DIR
git config user.email "$AUTHOR"
git add .
git commit -m "$COMMIT_MESSAGE"

# Amend the last commit to change the author
git commit --amend --author="$AUTHOR" --no-edit
```

### Setting Up the `pre-push` Hook

The `pre-push` hook finalizes the synchronization by pushing the commits from the secondary repository to its remote.

**Example `pre-push` Hook Script:**

```bash
#!/bin/bash

# Path to the secondary repository
BACKUP_REPO_DIR="/path/to/backup/repo"

# Go to the secondary repository and push the changes
cd $BACKUP_REPO_DIR
git push
```

## Conclusion

Automating the synchronization of Git repositories using custom hooks is an efficient way to manage parallel codebases. It reduces manual effort, minimizes errors, and ensures that changes in the primary repository are accurately reflected in the secondary one. This method is invaluable for developers looking to streamline their workflow and maintain consistency across multiple repositories.
