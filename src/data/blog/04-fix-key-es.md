---
title: "Correccion de llaves GPG en Linux"
author: "Francisco Gonzalez"
description: "Como resolver errores de llaves GPG y autenticacion de repositorios en sistemas Linux."
pubDate: 2024-02-05
image:
  url: "https://docs.astro.build/assets/full-logo-light.png"
  alt: "The full Astro logo."
tags: ["linux", "troubleshooting"]
category: linux
translationKey: post-04
lang: es
---

<!-- # Fix to key -->

Error:

`The following signatures couldn't be verified because the public key is not available: NO_PUBKEY A8580BDC82D3DC6C`

Solucion:

`sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys A8580BDC82D3DC6C`
