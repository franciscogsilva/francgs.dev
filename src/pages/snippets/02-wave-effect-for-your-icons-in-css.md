---
  title: 'Wave effect for your icons in css'
  author: 'Francisco Gonzalez'
  description: 'This is a beauty wave effect for your icons only with CSS.'
  publishDate: 2024-02-05
  image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'The full Astro logo.'
  tags: ["css", "resource"]
  layout: ./../../layouts/MarkdownPostLayout.astro
---

<h1 class="block text-center">
  <span class="wave" role="img" aria-label="my-icon-example">🤪</span>
</h1>

```html
<span class="wave" role="img" aria-label="my-icon-example">🤪</span>
```

CSS now

```css
.wave {
  animation: wave-animation 2.5s infinite;
  transform-origin: 70% 70%;
  display: inline-block;
}

@keyframes wave-animation {
  0% {
    transform: rotate(0deg);
  }
  10% {
    transform: rotate(14deg);
  }
  20% {
    transform: rotate(-8deg);
  }
  30% {
    transform: rotate(14deg);
  }
  40% {
    transform: rotate(-8deg);
  }
  50% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
```