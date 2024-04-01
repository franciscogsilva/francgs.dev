---
  title: "How to integrate Chat GPT API with Laravel"
  author: 'Francisco Gonzalez'
  description: 'Complete guide for consume OpenAI api in Laravel'
  publishDate: 2024-02-05
  image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'The full Astro logo.'
  tags: ["laravel", 'openai', 'php']
  layout: ./../../layouts/MarkdownPostLayout.astro
---

<!-- # How to integrate Chat GPT API with Laravel -->

## Steps

1. Instalar dependencia: `composer require guzzlehttp/guzzle`

2. Crear un nuevo controlador: `php artisan make:controller ChatGPTController`

3. Configurar variable de entorno:
```
OPENAI_API_KEY=your-openai-open-key-here
```

4. Agregar al archivo de configuración de servicios `config/services.php`:
```
...

'open-ai' => [
    'api_key' => env('OPENAI_API_KEY'),
],

...
```

5. Código del ChatGPTController
```

```