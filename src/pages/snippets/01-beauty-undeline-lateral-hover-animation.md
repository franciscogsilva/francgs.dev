---
  title: 'Beauty underline lateral hover animation'
  author: 'Francisco Gonzalez'
  description: 'This is a beauty hover effect for U.'
  pubDate: 2024-02-05
  image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'The full Astro logo.'
  tags: ["css", "web-development"]
  layout: ./../../layouts/MarkdownPostLayout.astro
---

<!-- # Beauty underline lateral hover animation -->

`class:"hover-underline-animation"`

```css
.hover-underline-animation {
  position: relative;
}

.hover-underline-animation:hover:after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.hover-underline-animation:after {
  content: "";
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #f65252;
  transform-origin: bottom right;
  transition: transform .15s ease-out;
}
```