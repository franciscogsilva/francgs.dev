---
title: "Como integrar la API de ChatGPT con Laravel"
author: "Francisco Gonzalez"
description: "Guia paso a paso para integrar la API de OpenAI ChatGPT en una aplicacion Laravel."
pubDate: 2024-02-05
image:
  url: "https://docs.astro.build/assets/full-logo-light.png"
  alt: "The full Astro logo."
tags: ["laravel", "ai", "php", "web-development"]
category: web-development
translationKey: post-10
lang: es
---

<!-- # Como integrar la API de ChatGPT con Laravel -->

## Pasos

1. Instalar dependencia: `composer require guzzlehttp/guzzle`

2. Crear un nuevo controlador: `php artisan make:controller ChatGPTController`

3. Configurar variable de entorno:
```
OPENAI_API_KEY=your-openai-open-key-here
```

4. Agregar en `config/services.php`:
```
...

'open-ai' => [
    'api_key' => env('OPENAI_API_KEY'),
],

...
```

5. Codigo del `ChatGPTController`
```

```
