---
  title: 'Fix to Key'
  author: 'Francisco Gonzalez'
  description: "How to solve GPG key errors and repository authentication issues on Linux systems"
  pubDate: 2024-02-05
  image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'The full Astro logo.'
  tags: ["linux", "troubleshooting"]
  layout: ./../../layouts/MarkdownPostLayout.astro
---
<!-- # FIx to key -->

error: The following signatures couldn't be verified because the public key is not available: NO_PUBKEY A8580BDC82D3DC6C

solución:

sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys A8580BDC82D3DC6C