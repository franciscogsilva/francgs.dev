---
  title: "Solving Docker Permission Issues in Node.js Projects: A Guide to Overcoming EACCES Errors in Volumes"
  author: 'Francisco Gonzalez'
  description: 'A complete guide to solve this issue'
  publishDate: 2024-02-05
  image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'The full Astro logo.'
  tags: ["linux", 'docker', 'nodejs', 'issue']
  layout: ./../../layouts/MarkdownPostLayout.astro
---

<!-- # Solving Docker Permission Issues in Node.js Projects: A Guide to Overcoming EACCES Errors in Volumes -->

## Introduction

When working with Docker in Node.js projects, encountering permission errors, especially when using volumes for databases like MongoDB or PostgreSQL, is common. A typical error might look like this:

```
[Error: EACCES: permission denied, scandir '/home/username/Development/project/postgres-test']
[Error: EACCES: permission denied, scandir '/home/username/Development/project/mongo-test']
```

This tutorial will explain how to resolve this permissions issue, ensuring that Docker volumes are not created with root permissions.

## Problem Explained

The `EACCES` error occurs when attempting to access a directory or file for which you do not have the appropriate permissions. In the context of Docker and Node.js, this often happens with database volumes, which are created with root permissions by default, preventing normal user access or modification.

## Step-by-Step Solution

### Step 1: Preparation

Ensure you have Docker and Node.js installed

```bash
docker --version
node --version
```

You should have a `docker-compose.yml` file for your project.

### Step 2: Adjust the docker-compose.test.yml File

We'll modify the `docker-compose.test.yml` file to use named volumes, which will avoid permission issues.

```
yaml
version: '3.8'

services:
  mongo-db:
    image: mongo:6.0.6
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASS}
    volumes:
      - mongo-test:/data/db
    ports:
      - 27019:27017

  postgres-db:
    image: postgres:15.3
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_PASSWORD: ${POSTGRES_PASS}
    volumes:
      - postgres-test:/var/lib/postgresql/data
    ports:
      - 5435:5432

volumes:
  mongo-test:
  postgres-test:
```

### Step 3: Run Docker Compose

- Run `docker compose down` to stop and remove the current containers.
- Run `docker compose up` -d to start the containers with the updated configuration.

### Step 5: Verification
Check that the `mongo-test` and `postgres-test` directories on your host have the correct permissions and that the `EACCES` error has been resolved.

## Conclusion
By following these steps, you can effectively resolve Docker permission problems in Node.js projects, preventing errors like `EACCES` when accessing database volumes and enhancing security in your development environment.