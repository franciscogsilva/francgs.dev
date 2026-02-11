---
  title: "How to add MULTIPLE GIT remotes repositories to my CODE"
  author: 'Francisco Gonzalez'
  description: "Step-by-step guide to add and manage multiple Git remote repositories for syncing code across platforms"
  pubDate: 2024-02-05
  image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'The full Astro logo.'
  tags: ["git", "devops"]
  category: git
---

<!-- # How to add MULTIPLE GIT remotes repositories to my CODE -->

## Introduction
This guide provides step-by-step instructions on how to add and manage two different remote repositories in a single local Git project. This is particularly useful when you want to synchronize your codebase across different platforms like GitHub and Bitbucket.

## Steps to Add Multiple Remotes

### 1. Open Your Terminal or Command Prompt
Start by navigating to your local project's directory in your terminal or command prompt.

### 2. Check Existing Remotes
Before adding new remotes, it's a good idea to check if any remotes are already configured with your project:
```bash
git remote -v
```

### 3. Add the First Remote
If you don't have a remote set up, add the first one. For instance, if your first remote is on GitHub, you can add it like this:
```bash
git remote add origin YOUR_GITHUB_REMOTE_URL
```
Replace `YOUR_GITHUB_REMOTE_URL` with the actual URL of your GitHub repository.

### 4. Add the Second Remote
Next, add your second remote, say a repository on Bitbucket. Use a different name for this remote, like `bitbucket`:
```bash
git remote add bitbucket YOUR_BITBUCKET_REMOTE_URL
```
Replace `YOUR_BITBUCKET_REMOTE_URL` with the URL of your Bitbucket repository.

### 5. Verify the Newly Added Remotes
Run `git remote -v` again to ensure that both remotes have been added successfully.

### 6. Working with the Remotes
Now, you can perform operations like push, pull, and fetch with the specified remote. For example, to push to your GitHub remote:
```bash
git push origin your-branch-name
```
And for Bitbucket:
```bash
git push bitbucket your-branch-name
```

### 7. Handling Conflicts and Synchronization
When working with multiple remotes, be mindful of keeping your branches synchronized. Regularly fetch and merge changes from your remotes to avoid conflicts.

## Conclusion
With these steps, you can effectively manage multiple remote repositories within a single Git project, facilitating better control over code distribution and collaboration across different platforms.
