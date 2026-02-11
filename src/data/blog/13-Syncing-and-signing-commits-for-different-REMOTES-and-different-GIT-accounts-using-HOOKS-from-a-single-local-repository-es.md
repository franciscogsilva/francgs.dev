---
title: "Sincronizar y firmar commits para multiples remotos y cuentas Git"
author: "Francisco Gonzalez"
description: "Enfoque avanzado para usar hooks y firmar commits en distintos remotos desde un solo repositorio local."
pubDate: 2024-02-05
image:
  url: "https://docs.astro.build/assets/full-logo-light.png"
  alt: "The full Astro logo."
tags: ["git", "security", "devops"]
category: git
translationKey: post-13
lang: es
---

<!-- # Sincronizar y firmar commits para diferentes remotos y cuentas GIT usando hooks -->

## Introduccion

Mantener sincronizados varios repositorios Git suele ser una tarea manual y propensa a errores. Este enfoque usa hooks para automatizar la sincronizacion entre dos repositorios identicos.

## Casos de uso

- Mantener un repositorio de respaldo sincronizado con la cuenta principal.
- Mantener forks o mirrors consistentes en otra cuenta.
- Actualizar automaticamente repositorios de demo o testing.

## Prerrequisitos

Los dos repositorios deben tener la misma estructura. Las ramas y cambios del principal deben reflejarse en el secundario.

## Paso a paso

### Hook `pre-commit`

Prepara la sincronizacion copiando archivos staged del repo principal al secundario.

```bash
#!/bin/bash

# Path to the secondary (backup) repository
BACKUP_REPO_DIR="/path/to/backup/repo"

# Copy staged files to the secondary repository
git diff --cached --name-only --diff-filter=ACM | xargs -I {} cp {} $BACKUP_REPO_DIR
```

### Hook `post-commit`

Captura mensaje y autor del commit del repo principal y lo replica en el secundario.

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

### Hook `pre-push`

Finaliza la sincronizacion enviando los cambios del repo secundario a su remoto.

```bash
#!/bin/bash

# Path to the secondary repository
BACKUP_REPO_DIR="/path/to/backup/repo"

# Go to the secondary repository and push the changes
cd $BACKUP_REPO_DIR
git push
```

## Conclusion

Automatizar sincronizacion con hooks reduce trabajo manual, evita errores y mantiene consistencia entre repositorios paralelos.
