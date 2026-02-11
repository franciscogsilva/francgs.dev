---
title: "RAG with TypeScript from Scratch: Minimal Architecture that Works"
author: "Francisco Gonzalez"
description: "Practical guide to build a lean RAG pipeline in TypeScript with ingestion, embeddings, retrieval, and evaluation."
pubDate: 2026-02-24
tags: ["ai", "typescript", "web-development"]
category: ai
translationKey: post-27
lang: en
---
RAG (Retrieval-Augmented Generation) sounds sophisticated, but in many projects it becomes an unnecessary monster. The key is not to add layers, it is to build a minimum pipeline that you can observe, measure and evolve.

If you came for SEO, this post is part of the AI ​​cluster. You should read the pillar first: [`/en/blog/26-prompt-engineering-para-developers-guia-practica-produccion/`](/en/blog/26-prompt-engineering-para-developers-guia-practica-produccion/).

## 1) When to use RAG

Use RAG when you need answers based on your own and changing knowledge:

- internal documentation,
- business policies,
- tickets and procedures,
- product manuals.

If you just want to "explain general concepts", you probably don't need RAG.

## 2) Minimum architecture (4 components)

## A. Intake

Take fonts (Markdown, PDF, Notion, DB), normalize text and save metadata.

Minimum recommended metadata:

- `source`
- `docId`
- `updatedAt`
- `section`

## B. Chunking + Embeddings

Splits documents into reasonable chunks (e.g. 400-800 tokens) with small overlap.

Practical rule:

- chunks that are too small lose context,
- Too large chunks worsen retrieval precision.

## C. Retrieval

Top-k relevant documents by vector similarity + filter by metadata.

For a start:

- `topK = 5`
- simple reranking by score + recency

## D. Generation

Build prompt with:

- user question,
- recovered context,
- response instructions,
- expected format.

## 3) Skeleton in TypeScript

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

## 4) Common mistakes that break your quality

## Do not save metadata

Without metadata you cannot filter by version or source. Then it is difficult to purge hallucinations.

## Prompt without guardrails

If you don't say "just use context", the model fills in gaps with general knowledge.

## Do not measure retrieval

Many teams measure only final response. First retrieval measures:

- precision@k
- approximate recall
- coverage by source

## 5) Minimum evaluation (without giant laboratory)

Put together a set of 20 real user questions:

- 10 easy ones,
- 7 stockings,
- 3 edge.

Measures:

- if you cite correct source,
- if you answer completely,
- if you invent data.

With that you can iterate chunking, topK and prompt with evidence.

## 6) Integration with your current stack

As you have been working with Astro + APIs, a pragmatic strategy is:

1. query endpoint (`/api/ai-query`),
2. ingestion pipeline per job (cron/manual),
3. latency and error observability,
4. retries/backoff for LLM provider.

This last point connects perfectly with: [`/blog/24-mastering-email-retry-strategies-resilience-with-exponential-backoff-and-jitter/`](/blog/24-mastering-email-retry-strategies-resilience-with-exponential-backoff-and-jitter/).

## Closing

Effective RAG is not the most complex, it is the clearest. If you can explain your pipeline in 5 minutes and measure each stage, you are doing well.

Next cluster read:

- [`/en/blog/28-code-review-asistido-por-ia-que-si-y-que-no/`](/en/blog/28-code-review-asistido-por-ia-que-si-y-que-no/)
- AI Hub: [`/blog/category/ai/`](/blog/category/ai/)
