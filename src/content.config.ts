import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Valid categories for the SILO architecture.
 * Each category maps to a pillar page and a topical cluster.
 */
const CATEGORIES = [
  "ai",
  "devops",
  "engineering-culture",
  "git",
  "linux",
  "tools",
  "web-development",
] as const;

const blogSchema = z.object({
  title: z.string(),
  author: z.string(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  image: z
    .object({
      url: z.string().url(),
      alt: z.string(),
    })
    .optional(),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  category: z.enum(CATEGORIES).optional(),
  translationKey: z.string().optional(),
  draft: z.boolean().default(false),
  lang: z.enum(["en", "es"]).default("en"),
});

const snippetSchema = z.object({
  title: z.string(),
  author: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  image: z
    .object({
      url: z.string().url(),
      alt: z.string(),
    })
    .optional(),
  tags: z.array(z.string()).min(1),
  draft: z.boolean().default(false),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/blog" }),
  schema: blogSchema,
});

const snippets = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/snippets" }),
  schema: snippetSchema,
});

export const collections = { blog, snippets };
