---
title: "Resolver errores EACCES en Docker para proyectos Node.js"
author: "Francisco Gonzalez"
description: "Guia para eliminar conflictos de permisos al usar volumenes Docker en proyectos Node.js."
pubDate: 2024-02-05
image:
  url: "https://docs.astro.build/assets/full-logo-light.png"
  alt: "The full Astro logo."
tags: ["docker", "nodejs", "linux", "troubleshooting"]
category: devops
translationKey: post-07
lang: es
---

<!-- # Resolver errores EACCES en Docker para proyectos Node.js -->

## Introduccion

Al trabajar con Docker en proyectos Node.js, es comun encontrar errores de permisos, especialmente cuando usas volumenes para bases de datos como MongoDB o PostgreSQL. Un error tipico se ve asi:

```
[Error: EACCES: permission denied, scandir '/home/username/Development/project/postgres-test']
[Error: EACCES: permission denied, scandir '/home/username/Development/project/mongo-test']
```

Este tutorial explica como resolver este problema para evitar que los volumenes se creen con permisos de `root`.

## Explicacion del problema

El error `EACCES` aparece cuando intentas acceder a un archivo o directorio sin los permisos adecuados. En Docker + Node.js suele pasar con volumenes de base de datos, que por defecto se crean con permisos de `root`, bloqueando el acceso normal del usuario.

## Solucion paso a paso

### Paso 1: Preparacion

Asegurate de tener Docker y Node.js instalados.

```bash
docker --version
node --version
```

Tambien debes tener un archivo `docker-compose.yml` en tu proyecto.

### Paso 2: Ajustar el archivo docker-compose.test.yml

Vamos a modificar `docker-compose.test.yml` para usar volumenes nombrados y evitar problemas de permisos.

```yaml
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

### Paso 3: Ejecutar Docker Compose

- Ejecuta `docker compose down` para detener y eliminar contenedores actuales.
- Ejecuta `docker compose up -d` para levantarlos con la nueva configuracion.

### Paso 5: Verificacion

Verifica que `mongo-test` y `postgres-test` tengan permisos correctos y que el error `EACCES` haya desaparecido.

## Conclusion

Con estos pasos puedes resolver de forma efectiva los problemas de permisos en Docker para proyectos Node.js y evitar errores `EACCES` al trabajar con volumenes de base de datos.
