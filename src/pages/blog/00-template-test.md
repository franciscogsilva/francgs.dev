---
title: "Guía Completa de Componentes y Estilos del Blog"
author: "Francisco Gonzalez"
description: "Documentación completa de todos los componentes, estilos y elementos de Markdown disponibles en el blog. Incluye ejemplos de callouts, código, listas, tablas, y más."
pubDate: 2024-11-23
image:
  url: "https://docs.astro.build/assets/full-logo-light.png"
  alt: "The full Astro logo."
tags: ["astro", "css", "documentation"]
layout: ./../../layouts/MarkdownPostLayout.astro
---

Esta es una guía completa de todos los componentes y estilos disponibles en el blog. Úsala como referencia al escribir nuevos posts.

## Jerarquía de Headings

Los headings tienen una jerarquía visual clara y son automáticamente añadidos al Table of Contents (TOC).

### Heading Nivel 3

Los headings de nivel 3 son perfectos para subsecciones principales.

#### Heading Nivel 4

Y los de nivel 4 para sub-subsecciones más específicas.

##### Heading Nivel 5

Raramente necesitarás nivel 5, pero está disponible.

###### Heading Nivel 6

El nivel más profundo de heading.

---

## Formato de Texto

Puedes usar varios tipos de formato de texto:

- **Texto en negrita** para énfasis fuerte
- *Texto en cursiva* para énfasis sutil
- ***Texto en negrita y cursiva*** para máximo énfasis
- ~~Texto tachado~~ para indicar contenido obsoleto
- `código inline` para mencionar código o comandos

También puedes combinarlos: **Este texto está en negrita y contiene `código inline`**.

---

## Enlaces

### Enlaces Internos

Los [enlaces a otras páginas del blog](/blog) usan el color primario del tema.

### Enlaces Externos

Los [enlaces externos](https://astro.build) tienen un indicador ↗ automático.

### Enlaces con Título

Puedes agregar [enlaces con título](https://astro.build "Visita Astro") que muestran un tooltip al pasar el mouse.

---

## Callouts (5 Tipos)

Los callouts son perfectos para destacar información importante. Usa la sintaxis `:::tipo` en Markdown.

:::note
**Nota Informativa**: Este callout es ideal para compartir información adicional, contexto o detalles que complementan el contenido principal. Tiene un icono de comillas y un fondo teal/verde sutil.
:::

:::tip
💡 **Consejo Profesional**: Los callouts pueden contener **cualquier formato Markdown**, incluyendo:
- Listas con viñetas
- `Código inline`
- **Negrita** y *cursiva*
- [Enlaces](https://example.com)

Perfecto para tips, trucos y mejores prácticas.
:::

:::important
ℹ **Información Importante**: Usa este callout para destacar información crítica que el lector debe conocer antes de continuar. Se muestra con el color secundario del tema (morado).
:::

:::warning
⚠ **Advertencia**: Este callout es para precauciones y advertencias. Por ejemplo:
- Asegúrate de hacer backup antes de continuar
- Verifica que tienes los permisos necesarios
- Esta acción puede tener efectos secundarios

Tiene un fondo amarillo/ámbar para llamar la atención.
:::

:::caution
🔥 **PELIGRO - PRECAUCIÓN EXTREMA**: Este es el callout más serio. Úsalo para:
- Acciones irreversibles
- Riesgo de pérdida de datos
- Operaciones que pueden romper el sistema
- Advertencias de seguridad críticas

El fondo rojo indica máxima precaución.
:::

---

## Bloques de Código

Tenemos tres tipos de código disponibles:

### 1. Código Inline

Usa `código inline` para mencionar comandos, variables o fragmentos cortos: `npm install`, `const x = 5`, `function()`.

### 2. Bloques de Código Medianos

Para fragmentos cortos sin syntax highlighting, usa bloques pre sin especificar lenguaje:

```
OPTIONS /
Host: service.example.com
Origin: http://www.example.com
Access-Control-Request-Method: PUT
```

Estos tienen el mismo estilo que el código inline pero en su propio espacio.

### 3. Bloques de Código con Syntax Highlighting

Para código más largo con syntax highlighting, especifica el lenguaje:

```javascript
// JavaScript con syntax highlighting completo
class BlogPost {
  constructor(title, author, tags) {
    this.title = title;
    this.author = author;
    this.tags = tags;
    this.publishedAt = new Date();
  }

  getReadingTime() {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  publish() {
    console.log(`Publishing: ${this.title}`);
    return this.save();
  }
}

// Uso
const post = new BlogPost('Mi Post', 'Francisco', ['astro', 'blog']);
post.publish();
```

```typescript
// TypeScript con tipos e interfaces
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

interface BlogPost {
  title: string;
  content: string;
  author: User;
  tags: string[];
  publishedAt: Date;
}

function createPost(data: Partial<BlogPost>): BlogPost {
  return {
    title: data.title || 'Untitled',
    content: data.content || '',
    author: data.author!,
    tags: data.tags || [],
    publishedAt: new Date(),
  };
}
```

```python
# Python con syntax highlighting
from datetime import datetime
from typing import List, Optional

class BlogPost:
    """Representa un post del blog"""
    
    def __init__(self, title: str, author: str, tags: List[str]):
        self.title = title
        self.author = author
        self.tags = tags
        self.published_at = datetime.now()
    
    def get_reading_time(self) -> int:
        """Calcula el tiempo de lectura en minutos"""
        words_per_minute = 200
        word_count = len(self.content.split())
        return (word_count + words_per_minute - 1) // words_per_minute
    
    def publish(self) -> bool:
        """Publica el post"""
        print(f"Publishing: {self.title}")
        return self.save()

# Uso
post = BlogPost('Mi Post', 'Francisco', ['python', 'blog'])
post.publish()
```

```css
/* CSS con syntax highlighting */
.blog-post {
  max-width: 65ch;
  margin: 0 auto;
  padding: 2rem;
  background: color-mix(in oklab, black 10%, transparent);
  border-radius: 0.5rem;
}

.blog-post h2 {
  color: var(--primary-color);
  font-size: 1.875em;
  margin-top: 2em;
  margin-bottom: 1em;
}

.blog-post code {
  background-color: rgba(80, 80, 80, 0.3);
  border: 1px solid rgba(100, 100, 100, 0.3);
  border-radius: 0.25rem;
  padding: 0.125rem 0.375rem;
}
```

```bash
# Bash/Shell scripts
#!/bin/bash

# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev

# Build para producción
pnpm build

# Preview del build
pnpm preview
```

---

## Listas

### Listas No Ordenadas

Las listas usan el símbolo `❯` como marcador con el color secundario:

- Primer elemento de la lista
- Segundo elemento con más detalles
- Elemento con sub-items:
  - Sub-elemento anidado nivel 1
  - Otro sub-elemento nivel 1
    - Sub-elemento nivel 2
    - Otro sub-elemento nivel 2
- Tercer elemento final

### Listas Ordenadas

1. Primer paso del proceso
2. Segundo paso importante
3. Paso con sub-pasos:
   1. Sub-paso 3.1
   2. Sub-paso 3.2
   3. Sub-paso 3.3
4. Cuarto paso final

### Listas de Tareas (Checkboxes)

- [x] Tarea completada
- [x] Otra tarea completada
- [ ] Tarea pendiente
- [ ] Otra tarea pendiente

### Listas Mixtas

Puedes combinar diferentes tipos de listas:

1. Primer item numerado
   - Sub-item con viñeta
   - Otro sub-item
2. Segundo item numerado
   - [x] Sub-tarea completada
   - [ ] Sub-tarea pendiente
3. Tercer item final

---

## Blockquotes (Citas)

### Cita Simple

> "La simplicidad es la máxima sofisticación."
> — Leonardo da Vinci

### Cita con Múltiples Párrafos

> Este es el primer párrafo de la cita.
>
> Y este es el segundo párrafo, separado del primero.
>
> — Autor de la cita

### Cita Anidada

> Nivel 1 de cita
>
> > Nivel 2 de cita anidada
> >
> > > Nivel 3 de cita doblemente anidada

---

## Tablas

### Tabla Básica

| Característica | Descripción | Estado |
|---------------|-------------|--------|
| TOC Automático | Generado desde headings | ✅ Activo |
| Reading Time | Calculado por palabras | ✅ Activo |
| Syntax Highlighting | Múltiples lenguajes | ✅ Activo |

### Tabla con Alineación

| Izquierda | Centro | Derecha |
|:----------|:------:|--------:|
| Texto | Texto | Texto |
| Más texto | Centrado | Derecha |
| Final | Final | Final |

### Tabla Completa de Características

| Componente | Sintaxis | Ejemplo | Notas |
|-----------|----------|---------|-------|
| Callout Note | `:::note` | Ver arriba | Fondo teal |
| Callout Tip | `:::tip` | Ver arriba | Fondo verde |
| Callout Important | `:::important` | Ver arriba | Fondo morado |
| Callout Warning | `:::warning` | Ver arriba | Fondo amarillo |
| Callout Caution | `:::caution` | Ver arriba | Fondo rojo |
| Código Inline | `` `code` `` | `ejemplo` | Gris oscuro |
| Código Mediano | ` ``` ` sin lenguaje | Ver arriba | Sin highlighting |
| Código Grande | ` ```lang ` | Ver arriba | Con highlighting |

---

## Imágenes

### Imagen Simple

![Logo de Astro](https://docs.astro.build/assets/full-logo-light.png)

### Imagen con Título

![Logo de Astro](https://docs.astro.build/assets/full-logo-light.png "Este es el logo de Astro")

---

## Líneas Horizontales

Usa tres o más guiones para crear separadores:

---

O tres asteriscos:

***

O tres guiones bajos:

___

---

## Combinaciones Avanzadas

### Callout con Código

:::tip
💡 **Tip**: Puedes usar código dentro de callouts:

```javascript
const tip = "Esto es muy útil";
console.log(tip);
```

Y también `código inline` como `npm install`.
:::

### Lista con Callouts

1. Primer paso del tutorial

   :::note
   Asegúrate de tener Node.js instalado antes de continuar.
   :::

2. Segundo paso del tutorial

   :::warning
   ⚠ Este paso puede tardar varios minutos.
   :::

3. Tercer paso final

### Tabla con Código

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `npm install` | Instala dependencias | `npm install astro` |
| `npm run dev` | Inicia servidor | `npm run dev` |
| `npm run build` | Build producción | `npm run build` |

---

## Mejores Prácticas

:::important
ℹ **Recomendaciones para escribir posts**:

1. **Usa headings jerárquicos**: Empieza con H2 y mantén la jerarquía
2. **Aprovecha los callouts**: Usa el tipo apropiado para cada situación
3. **Especifica el lenguaje en código**: Siempre que sea posible para syntax highlighting
4. **Mantén las líneas cortas**: Máximo 80-100 caracteres para mejor legibilidad
5. **Usa listas para enumerar**: Son más fáciles de escanear que párrafos largos
:::

---

## Resumen de Componentes Disponibles

✅ **Headings**: 6 niveles (H1-H6)
✅ **Formato**: Negrita, cursiva, tachado, código inline
✅ **Enlaces**: Internos, externos, con título
✅ **Callouts**: Note, Tip, Important, Warning, Caution
✅ **Código**: Inline, mediano, grande con highlighting
✅ **Listas**: Ordenadas, no ordenadas, tareas, anidadas
✅ **Blockquotes**: Simples, múltiples párrafos, anidadas
✅ **Tablas**: Con alineación y formato
✅ **Imágenes**: Con alt text y título opcional
✅ **Separadores**: Líneas horizontales
✅ **TOC**: Generado automáticamente
✅ **Reading Time**: Calculado automáticamente

---

## Conclusión

Este template de blog ofrece una experiencia de escritura rica y flexible. Todos los componentes están diseñados para trabajar juntos de manera armoniosa y crear posts visualmente atractivos y fáciles de leer.

¡Disfruta escribiendo! 🚀
