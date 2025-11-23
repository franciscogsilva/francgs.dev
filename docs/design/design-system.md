# Design System - francgs.dev

> Sistema de diseño completo para el sitio web personal de Francisco González

**Versión:** 2.1  
**Última actualización:** Noviembre 2024  
**Framework:** Astro + Tailwind CSS v4

---

## 📋 Tabla de Contenidos

1. [Fundamentos](#fundamentos)
2. [Paleta de Colores](#paleta-de-colores)
3. [Tipografía](#tipografía)
4. [Espaciado y Layout](#espaciado-y-layout)
5. [Componentes](#componentes)
6. [Efectos y Animaciones](#efectos-y-animaciones)
7. [Guías de Uso](#guías-de-uso)

---

## Fundamentos

### Filosofía de Diseño

El diseño del sitio se basa en tres pilares fundamentales:

1. **Minimalismo Técnico** - Interfaces limpias que destacan el contenido
2. **Experiencia Fluida** - Transiciones suaves y feedback visual inmediato
3. **Accesibilidad** - Contraste adecuado y navegación clara

### Principios Visuales

- **Dark-first**: Diseño optimizado para modo oscuro
- **Fondos sutiles**: Overlays semi-transparentes con color-mix
- **Patrón SVG**: Fondo geométrico sutil
- **Micro-interacciones**: Hover states y transiciones en todos los elementos interactivos

---

## Paleta de Colores

### Colores Principales

```css
/* Colores de Marca */
--color-primary: #00fff7    /* Cyan brillante - Acento principal */
--color-secondary: #bd8afc  /* Púrpura suave - Acento secundario */
--color-accent: #bd8afc     /* Alias de secondary */
```

#### Primary Color (#00fff7)
- **Uso:** Links, highlights, elementos interactivos activos, TOC activo
- **Contraste:** Alto contraste sobre fondos oscuros
- **Aplicaciones:**
  - Enlaces de navegación
  - Botones primarios
  - Indicadores de estado activo en TOC
  - Bordes de elementos enfocados
  - Headings H1 en blog posts

#### Secondary Color (#bd8afc)
- **Uso:** Hover states, elementos decorativos, markers
- **Contraste:** Medio-alto sobre fondos oscuros
- **Aplicaciones:**
  - Hover effects en botones
  - Markers de listas (❯)
  - Elementos secundarios de UI
  - Callout Important

### Colores de Fondo

```css
/* Fondos */
--color-black: rgb(24, 25, 26)    /* Fondo principal con patrón SVG */
--color-neutral-950: #0a0a0a      /* Fondo alternativo */
--color-neutral-900: #171717      /* Fondo de tarjetas */
--color-neutral-800: #262626      /* Fondo de elementos elevados */
```

#### Background Principal
```css
/* Fondo con patrón SVG geométrico */
background-color: rgb(24, 25, 26);
background-image: url("data:image/svg+xml,..."); /* Patrón geométrico */
```

#### Overlays Semi-Transparentes
```css
/* Overlay sutil para contenido (10% opacidad) */
background-color: color-mix(in oklab, black 10%, transparent);
```

**Uso:** 
- Contenido de blog posts
- Lista de posts en home
- Áreas de contenido principal

### Colores de Texto

```css
/* Texto */
--text-primary: rgb(255, 255, 255)      /* Blanco - Texto principal */
--text-secondary: rgb(156, 163, 175)    /* Gris claro - Texto secundario */
--text-muted: rgb(107, 114, 128)        /* Gris medio - Texto terciario */
```

### Colores Semánticos (Blog)

#### Callouts/Alerts

**Note (Informativo)**
```css
background: rgba(20, 184, 166, 0.1);
border-color: rgba(20, 184, 166, 0.5);
color: rgb(204, 231, 227);
icon: '"' (comillas grandes)
```

**Tip (Consejo)**
```css
background: rgba(34, 197, 94, 0.1);
border-color: rgb(34, 197, 94);
color: rgb(220, 252, 231);
icon: '💡' (bombilla)
```

**Important (Importante)**
```css
background: rgba(168, 85, 247, 0.1);
border-color: var(--secondary-color);
color: rgb(243, 232, 255);
icon: 'ℹ' (información)
```

**Warning (Advertencia)**
```css
background: rgba(251, 191, 36, 0.1);
border-color: rgb(251, 191, 36);
color: rgb(254, 243, 199);
icon: '⚠' (advertencia)
```

**Caution (Peligro)**
```css
background: rgba(239, 68, 68, 0.1);
border-color: rgba(239, 68, 68, 0.5);
color: rgb(254, 202, 202);
icon: '🔥' (fuego)
```

---

## Tipografía

### Familia Tipográfica

```css
font-family: "Onest Variable", system-ui, sans-serif;
```

**Onest Variable** - Fuente principal del sitio
- **Tipo:** Sans-serif variable
- **Fuente:** @fontsource-variable/onest
- **Pesos disponibles:** 100-900
- **Características:** Moderna, legible, optimizada para pantallas

### Escala Tipográfica

#### Headings (Blog Posts)

```css
/* H1 - Título principal del post */
font-size: 2.25em;        /* 36px */
line-height: 1.1111111;
font-weight: 800;
margin-top: 0;
margin-bottom: 0.8888889em;
color: var(--primary-color);

/* H2 - Secciones principales */
font-size: 1.5em;         /* 24px */
line-height: 1.3333333;
font-weight: 700;
margin-top: 2em;
margin-bottom: 1em;

/* H3 - Subsecciones */
font-size: 1.25em;        /* 20px */
line-height: 1.6;
font-weight: 600;
margin-top: 1.6em;
margin-bottom: 0.6em;
```

#### Body Text

```css
/* Párrafo principal */
font-size: 1rem;          /* 16px */
line-height: 1.75;
margin-top: 1.25em;
margin-bottom: 1.25em;

/* Texto pequeño */
font-size: 0.875rem;      /* 14px */
line-height: 1.7142857;
```

#### Code

```css
/* Inline code */
font-family: "Fira Code", "JetBrains Mono", "Courier New", monospace;
font-size: 0.875em;
font-weight: 500;
padding: 0.125rem 0.375rem;
background: rgba(80, 80, 80, 0.3);
border: 1px solid rgba(100, 100, 100, 0.3);
border-radius: 0.25rem;

/* Code blocks medianos (sin lenguaje) */
background-color: rgba(80, 80, 80, 0.3);
border: 1px solid rgba(100, 100, 100, 0.3);
border-radius: 0.375rem;
padding: 0.75rem 1rem;
font-size: 0.875em;
line-height: 1.7;

/* Code blocks grandes (con lenguaje) */
font-family: "Fira Code", "JetBrains Mono", "Courier New", monospace;
font-size: 0.875em;
line-height: 1.7;
background: #0d1117;
```

---

## Espaciado y Layout

### Sistema de Espaciado

Basado en múltiplos de 4px (0.25rem):

```css
/* Espaciado base */
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
--spacing-16: 4rem;     /* 64px */
--spacing-20: 5rem;     /* 80px */
--spacing-24: 6rem;     /* 96px */
```

### Contenedores

#### Main Container
```css
.main-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  max-width: 48rem;        /* 768px */
  margin: 0 auto;
  padding: 1rem;           /* Mobile */
}

@media (min-width: 640px) {
  padding: 1.5rem;         /* Tablet */
}

@media (min-width: 1280px) {
  max-width: 64rem;        /* 1024px - Desktop */
  padding: 0;
}
```

#### Blog Post Content
```css
max-width: 65ch;           /* ~520px - Óptimo para lectura */
```

#### Links Page
```css
max-width: 470px;
padding: 2.5rem 1rem;      /* py-10 px-4 */
margin: 0 auto;
```

### Grid System (Blog Layout)

```css
/* Blog post con ToC (Desktop) */
display: grid;
grid-template-columns: repeat(6, 1fr);
gap: 2.5rem;               /* 40px */

/* Contenido principal */
grid-column: span 4;

/* Table of Contents */
grid-column: span 2;

/* Mobile: TOC oculto */
@media (max-width: 1279px) {
  /* TOC no se muestra */
  /* Contenido ocupa todo el ancho */
}
```

---

## Componentes

### 1. Background

**Archivo:** `src/components/Background.astro`

```astro
<div class="absolute top-0 z-[-2] h-screen w-screen" 
     style="background-color: rgb(24, 25, 26); 
            background-image: url('data:image/svg+xml,...');">
  <div class="absolute inset-0" 
       style="background-color: color-mix(in oklab, black 10%, transparent);"></div>
  <slot />
</div>
```

**Características:**
- Fondo base: `rgb(24, 25, 26)`
- Patrón SVG geométrico
- Overlay semi-transparente (10% opacidad)
- Posición absoluta, z-index -2

---

### 2. Header

**Componente:** `src/components/Header.astro`

**Elementos:**
- Logo/Nombre del sitio
- Navegación principal
- Transiciones suaves entre páginas

**Estilos clave:**
```css
/* Navegación */
display: flex;
gap: 1.5rem;
align-items: center;

/* Links de navegación */
color: white;
transition: color 0.2s ease;

/* Hover state */
color: var(--primary-color);
```

---

### 3. Links/Buttons (Página Links)

**Archivo:** `src/pages/links.astro`

```astro
<div class="flex flex-col justify-center w-full p-4 
            text-sm text-center text-white 
            transition-all duration-500 
            bg-[rgba(255,255,255,0.1)] 
            backdrop-filter backdrop-blur-lg 
            rounded-xl 
            hover:bg-[rgba(189,138,252,0.2)] 
            hover:scale-105">
  <button>
    <span class="font-semibold">{title}</span> {description}
  </button>
</div>
```

**Características:**
- **Background:** Glassmorphism con 10% opacidad blanca
- **Backdrop:** Blur de 16px
- **Border radius:** 12px (rounded-xl)
- **Hover:** 
  - Background cambia a secondary color con 20% opacidad
  - Scale aumenta a 105%
- **Transición:** 500ms ease-in-out

---

### 4. Callouts (Blog)

**Implementación:** Plugin remark-directive + CSS

**Sintaxis en Markdown:**
```markdown
:::note
Contenido de la nota
:::

:::tip
Contenido del tip
:::

:::important
Contenido importante
:::

:::warning
Contenido de advertencia
:::

:::caution
Contenido de precaución
:::
```

**Estilos base:**
```css
.callout {
  padding: 1rem 1.25rem;
  margin: 1.5em 0;
  border-left: 3px solid;
  border-radius: 0.375rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.callout::before {
  content: "";
  font-size: 1.25em;
  line-height: 1.5;
  flex-shrink: 0;
  margin-top: 0.1em;
}
```

**Iconos automáticos:**

| Tipo | Icono | Color Icono |
|------|-------|-------------|
| note | `"` (comillas) | `rgba(20, 184, 166, 0.8)` |
| tip | 💡 | Emoji nativo |
| important | ℹ | `var(--secondary-color)` |
| warning | ⚠ | `rgb(251, 191, 36)` |
| caution | 🔥 | Emoji nativo |

---

### 5. Table of Contents

**Componente:** `src/components/TableOfContents.astro`

**Características:**
- Sticky positioning (top: 2rem)
- Scroll tracking activo con scroll-based logic
- Click navigation con smooth scroll y offset de 150px
- Ubicación: Lado derecho del contenido (desktop)
- Oculto en mobile (<1280px)
- Ancho: 2 de 6 columnas del grid

**Estilos:**
```css
.toc {
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  padding-left: 1rem;
}

.toc-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(156, 163, 175);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.toc-link {
  color: rgb(156, 163, 175);
  font-size: 0.875rem;
  padding: 0.375rem 0 0.375rem 1rem;
  border-left: 2px solid transparent;
  transition: all 0.2s ease;
}

.toc-link:hover {
  color: rgb(209, 213, 219);
}

.toc-link.active {
  color: var(--primary-color);
  border-left-color: var(--primary-color);
  font-weight: 500;
}
```

**JavaScript:**
- Active tracking basado en `window.scrollY`
- Click handler con `preventDefault()` y smooth scroll
- Offset de 150px para header sticky
- Update automático de clase `.active`

---

### 6. Code Blocks

**Tres tipos de código:**

#### 1. Inline Code
```css
background: rgba(80, 80, 80, 0.3);
border: 1px solid rgba(100, 100, 100, 0.3);
border-radius: 0.25rem;
padding: 0.125rem 0.375rem;
```

#### 2. Código Mediano (sin lenguaje)
```css
/* pre sin class="language-*" */
background-color: rgba(80, 80, 80, 0.3);
border: 1px solid rgba(100, 100, 100, 0.3);
border-radius: 0.375rem;
padding: 0.75rem 1rem;
```

#### 3. Código Grande (con lenguaje)

**Estilo macOS Window:**

```css
.prose pre {
  background-color: #0d1117;
  border: 1px solid rgb(48, 48, 48);
  border-radius: 0.5rem;
  position: relative;
  padding: 0;
}

/* macOS window controls */
.prose pre::before {
  content: "";
  display: block;
  background: #2d2d2d;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgb(48, 48, 48);
  border-radius: 0.5rem 0.5rem 0 0;
  background-image:
    radial-gradient(circle, #ff5f56 6px, transparent 6px),
    radial-gradient(circle, #ffbd2e 6px, transparent 6px),
    radial-gradient(circle, #27c93f 6px, transparent 6px);
  background-size: 12px 12px;
  background-position: 12px center, 32px center, 52px center;
  background-repeat: no-repeat;
  min-height: 2.5rem;
}
```

---

### 7. Listas

**Estilos:**
```css
/* Marker personalizado */
ul > li::marker {
  content: "❯ ";
  color: var(--secondary-color);
}

/* Espaciado reducido */
ul > li, ol > li {
  padding-left: 0.5em;
}
```

---

### 8. Content Overlays

**Uso:** Blog posts y home del blog

```css
/* Wrapper con background sutil */
.relative {
  position: relative;
}

.absolute.inset-0 {
  position: absolute;
  inset: 0;
  background-color: color-mix(in oklab, black 10%, transparent);
  border-radius: 0.5rem;
}

.relative {
  position: relative;
  z-index: 1;
}
```

---

## Efectos y Animaciones

### Transiciones Globales

```css
/* Transiciones de página (Astro) */
<ViewTransitions />

/* Duración estándar */
transition-duration: 200ms;  /* Rápida - hover states */
transition-duration: 300ms;  /* Media - navegación */
transition-duration: 500ms;  /* Lenta - animaciones complejas */

/* Easing */
transition-timing-function: ease;        /* Estándar */
transition-timing-function: ease-in-out; /* Suave inicio/fin */
```

### Hover Effects

#### Links
```css
color: white;
transition: color 0.2s ease;

&:hover {
  color: var(--primary-color);
}
```

#### Buttons (Links page)
```css
transition: all 0.5s ease;

&:hover {
  background: rgba(189, 138, 252, 0.2);
  transform: scale(1.05);
}
```

#### TOC Links
```css
transition: all 0.2s ease;

&:hover {
  color: rgb(209, 213, 219);
}

&.active {
  color: var(--primary-color);
  border-left-color: var(--primary-color);
}
```

### Smooth Scroll

```javascript
window.scrollTo({
  top: offsetPosition,
  behavior: 'smooth'
});
```

---

## Guías de Uso

### Cuándo Usar Cada Color

#### Primary (#00fff7)
✅ **Usar para:**
- Enlaces principales
- Estados activos (TOC)
- H1 en blog posts
- Indicadores de progreso

❌ **Evitar para:**
- Fondos grandes (muy brillante)
- Texto de párrafos largos (fatiga visual)

#### Secondary (#bd8afc)
✅ **Usar para:**
- Hover states
- Markers de listas
- Callout Important
- Gradientes de fondo

❌ **Evitar para:**
- Texto principal
- Elementos de alta importancia

### Espaciado Consistente

```css
/* Espaciado entre secciones */
margin-top: 2rem;      /* Secciones pequeñas */
margin-top: 4rem;      /* Secciones principales */

/* Padding de contenedores */
padding: 1rem;         /* Mobile */
padding: 1.5rem;       /* Tablet */
padding: 2rem;         /* Desktop */

/* Gap en flexbox/grid */
gap: 1rem;             /* Elementos relacionados */
gap: 2rem;             /* Grupos de elementos */
```

### Responsive Breakpoints

```css
/* Mobile first approach */
@media (min-width: 640px)  { /* sm - Tablet */ }
@media (min-width: 768px)  { /* md - Tablet landscape */ }
@media (min-width: 1024px) { /* lg - Desktop */ }
@media (min-width: 1280px) { /* xl - Large desktop */ }
```

### Accesibilidad

#### Contraste de Colores

| Combinación | Ratio | Cumple WCAG AA |
|-------------|-------|----------------|
| Primary / Black | 12.5:1 | ✅ AAA |
| Secondary / Black | 8.2:1 | ✅ AAA |
| White / Black | 19.8:1 | ✅ AAA |

#### Focus States

```css
/* Todos los elementos interactivos */
&:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

---

## Markdown Features

### Sintaxis Soportada

- **Headings:** H1-H6 con anclas automáticas
- **Formato:** Negrita, cursiva, tachado, código inline
- **Enlaces:** Internos y externos
- **Callouts:** 5 tipos con sintaxis `:::tipo`
- **Código:** Inline, mediano, grande con syntax highlighting
- **Listas:** Ordenadas, no ordenadas, tareas, anidadas
- **Blockquotes:** Simples y anidadas
- **Tablas:** Con alineación
- **Imágenes:** Con alt text y título
- **Separadores:** Líneas horizontales

### Plugins Remark/Rehype

```javascript
// astro.config.mjs
import remarkDirective from 'remark-directive';
import rehypeRaw from 'rehype-raw';
import { remarkCallouts } from './src/plugins/remark-callouts.mjs';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, remarkCallouts],
    rehypePlugins: [rehypeRaw],
  },
});
```

---

## Checklist de Implementación

Al crear nuevos componentes, asegúrate de:

- [ ] Usar colores de la paleta definida
- [ ] Aplicar espaciado del sistema (múltiplos de 4px)
- [ ] Incluir estados hover con transiciones
- [ ] Implementar focus states accesibles
- [ ] Probar en mobile, tablet y desktop
- [ ] Verificar contraste de colores (WCAG AA mínimo)
- [ ] Usar tipografía Onest Variable
- [ ] Aplicar border-radius consistente (0.375rem o 0.5rem)
- [ ] Incluir transiciones suaves (200-500ms)
- [ ] Usar color-mix para overlays sutiles
- [ ] Documentar el componente en este design system

---

## Recursos

### Fuentes
- [Onest Variable](https://fonts.google.com/specimen/Onest) - Fuente principal
- [Fira Code](https://github.com/tonsky/FiraCode) - Código monoespaciado

### Herramientas
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - Verificar contraste
- [Coolors](https://coolors.co/) - Paletas de colores
- [CSS Gradient](https://cssgradient.io/) - Generador de gradientes

### Referencias
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Astro Docs](https://docs.astro.build)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Remark Directive](https://github.com/remarkjs/remark-directive)

---

**Mantenido por:** Francisco González  
**Última revisión:** Noviembre 2024  
**Versión del Design System:** 2.1

## Changelog

### v2.1 (Noviembre 2024)
- ✅ Actualizado background a patrón SVG geométrico
- ✅ Cambiado overlays a color-mix con 10% opacidad
- ✅ Implementado sistema de callouts con remark-directive
- ✅ Agregado TOC con scroll-based tracking y smooth scroll
- ✅ Añadidos 3 tipos de código (inline, mediano, grande)
- ✅ Actualizado espaciado de listas a 0.5em
- ✅ Documentado offset de 150px para TOC navigation
- ✅ Agregado soporte para Markdown nativo
