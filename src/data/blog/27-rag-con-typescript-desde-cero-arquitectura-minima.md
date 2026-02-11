---
title: "RAG con TypeScript desde cero: arquitectura minima que si funciona"
author: "Francisco Gonzalez"
description: "Guia practica para construir un pipeline RAG con TypeScript: ingesta, embeddings, retrieval, prompts y evaluacion sin sobreingenieria."
pubDate: 2026-02-24
tags: ["ai", "typescript", "web-development"]
category: ai
translationKey: post-27
lang: es
---

RAG (Retrieval-Augmented Generation) suena sofisticado, pero en muchos proyectos se vuelve un monstruo innecesario. La clave no es agregar capas, es construir un pipeline minimo que puedas observar, medir y evolucionar.

Si llegaste por SEO, este post es parte del clúster AI. Te conviene leer primero el pilar: [`/blog/26-prompt-engineering-para-developers-guia-practica-produccion/`](/blog/26-prompt-engineering-para-developers-guia-practica-produccion/).

## 1) Cuando SI usar RAG

Usa RAG cuando necesitas respuestas basadas en conocimiento propio y cambiante:

- documentacion interna,
- politicas de negocio,
- tickets y procedimientos,
- manuales de producto.

Si solo quieres "explicar conceptos generales", probablemente no necesitas RAG.

## 2) Arquitectura minima (4 componentes)

## A. Ingesta

Tomar fuentes (Markdown, PDF, Notion, DB), normalizar texto y guardar metadata.

Metadata minima recomendada:

- `source`
- `docId`
- `updatedAt`
- `section`

## B. Chunking + Embeddings

Divide documentos en chunks razonables (ej. 400-800 tokens) con overlap pequeno.

Regla practica:

- chunks demasiado chicos pierden contexto,
- chunks demasiado grandes empeoran precision del retrieval.

## C. Retrieval

Top-k documentos relevantes por similitud vectorial + filtro por metadata.

Para empezar:

- `topK = 5`
- reranking simple por score + recencia

## D. Generacion

Construye prompt con:

- pregunta del usuario,
- contexto recuperado,
- instrucciones de respuesta,
- formato esperado.

## 3) Esqueleto en TypeScript

```ts
type Chunk = {
  id: string;
  text: string;
  source: string;
  updatedAt: string;
  embedding: number[];
};

type RetrievalResult = { chunk: Chunk; score: number };

async function answerWithRag(question: string): Promise<string> {
  const queryEmbedding = await embed(question);
  const retrieved: RetrievalResult[] = await vectorSearch(queryEmbedding, {
    topK: 5,
  });

  const context = retrieved.map((r, i) => `[${i + 1}] ${r.chunk.text}`).join("\n\n");

  const prompt = `
Eres un asistente tecnico.
Responde SOLO con base en el contexto.
Si falta informacion, dilo explicitamente.

Pregunta: ${question}

Contexto:
${context}
`;

  return generate(prompt);
}
```

## 4) Errores comunes que te rompen calidad

## No guardar metadata

Sin metadata no puedes filtrar por version ni fuente. Luego es dificil depurar alucinaciones.

## Prompt sin guardrails

Si no dices "solo usa contexto", el modelo rellena huecos con conocimiento general.

## No medir retrieval

Muchos equipos miden solo respuesta final. Primero mide retrieval:

- precision@k
- recall aproximado
- cobertura por fuente

## 5) Evaluacion minima (sin laboratorio gigante)

Arma un set de 20 preguntas reales de usuarios:

- 10 faciles,
- 7 medias,
- 3 borde.

Mide:

- si cita fuente correcta,
- si responde completo,
- si inventa datos.

Con eso puedes iterar chunking, topK y prompt con evidencia.

## 6) Integracion con tu stack actual

Como vienes trabajando Astro + APIs, una estrategia pragmatica es:

1. endpoint de consulta (`/api/ai-query`),
2. pipeline de ingesta por job (cron/manual),
3. observabilidad de latencia y errores,
4. retries/backoff para proveedor LLM.

Este ultimo punto conecta perfecto con: [`/blog/24-mastering-email-retry-strategies-resilience-with-exponential-backoff-and-jitter/`](/blog/24-mastering-email-retry-strategies-resilience-with-exponential-backoff-and-jitter/).

## Cierre

RAG efectivo no es el mas complejo, es el mas claro. Si puedes explicar tu pipeline en 5 minutos y medir cada etapa, vas bien.

Siguiente lectura del clúster:

- [`/blog/28-code-review-asistido-por-ia-que-si-y-que-no/`](/blog/28-code-review-asistido-por-ia-que-si-y-que-no/)
- Hub AI: [`/blog/category/ai/`](/blog/category/ai/)
