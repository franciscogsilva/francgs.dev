
# Sign commits for different REMOTES and different GIT accounts using pre-commit HOOK

## Introduction

Working with multiple Git remotes in the same repository often requires different user configurations. This tutorial will guide you through the process of setting up a `pre-commit` hook in Git to automatically configure the correct email address for different remotes. This approach ensures your commits are accurately attributed to your personal or work accounts.

## Prerequisites

- Basic understanding of Git.
- Git installed on your machine.
- A local Git repository with multiple remotes configured.

## Step-by-Step Guide

### Step 1: Understanding Your Repository Setup

First, ensure you have multiple remotes added to your repository. You can check this with:
```bash
git remote -v
```
Identify the remotes for which you want to configure different email addresses.

### Step 2: Creating a Pre-Commit Hook

1. **Navigate to the Hooks Directory**:
   Go to the `.git/hooks` directory in your local repository.

2. **Create the Pre-Commit Hook**:
   Create a file named `pre-commit` in the hooks directory.

3. **Edit the Pre-Commit Hook**:
   Open the `pre-commit` file in a text editor and add the following script:

```bash
#!/bin/sh

# Get the current remote
REMOTE="$1"

# Setup remote-based email
if [ "$REMOTE" = "origin" ]; then
  # Setup for ORIGIN (work) remote
  git config user.email "work-email@mail.com"
elif [ "$REMOTE" = "other-remote" ]; then
  # Setup for OTHER-REMOTE (Otro remote) remote
  git config user.email "othe-email-example@mail.com"
fi
```

Replace `origin` and `other-remote` with the names of the REMOTES you use for personal and work projects. Also, replace the email addresses with your own.

4. **Make the Script Executable**:
   Run the following command to make your script executable:
   ```bash
   chmod +x .git/hooks/pre-commit
   ```

### Step 3: Testing the Hook

To test the hook:

1. **Make Changes and Commit**:
    Make some changes in your repository and commit them.

2. **Push changes for each remote**:
    `git push origin develop`
    `git push other-remote develop`

3. **Verify the Email Configuration**:
    Use `git log` to check the email address used in the latest commit. It should reflect the configuration set in the hook for the current branch.

### Step 4: Advanced Configuration (Optional)

For more advanced users, you can modify the script to check for the current branch instead of the remote, or use other conditions that suit your workflow.

## Conclusion

By setting up a `pre-commit` hook in your Git repository, you can automate the process of switching between different email configurations for personal and work-related projects. This ensures that your commits are always attributed to the correct account, helping maintain a clean and organized Git history.
