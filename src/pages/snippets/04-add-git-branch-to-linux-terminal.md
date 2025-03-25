---
  title: 'Add git branch to linux terminal'
  author: 'Francisco Gonzalez'
  description: 'Add git branch to linux terminal.'
  pubDate: 2025-03-25
  image:
    url: 'https://pub-e67c19bba5c64333a98782860493cce5.r2.dev/add-git-branch-to-linux-terminal.jpg'
    alt: 'Add git branch to linux terminal'
  tags: ["bash", "git",  "terminal"]
  layout: ./../../layouts/MarkdownPostLayout.astro
---

# Git branch config to terminal

Add this to your `.bashrc` or `.zshrc` file:

```bash
parse_git_branch() {
git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/\* \(.\_\)/(\1)/'
}
export PS1="\u@\h \[\e[32m\]\w \[\e[91m\]\$(parse_git_branch)\[\e[00m\]$ "
```

save and reload the file

```bash
source ~/.bashrc
```

or

```bash
source ~/.zshrc
```
