import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Blog posts in neutral Spanish for all of Hispanoamérica. The file name is the URL slug.
const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/blog" }),
  schema: z.object({
    // H1 on the page.
    title: z.string(),
    // <title> without the " | Hooksage" suffix; the full title must stay ≤ 60 characters.
    seoTitle: z.string().max(49),
    description: z.string().max(155),
    // Direct answer shown first and quoted by AI search engines.
    shortAnswer: z.string(),
    category: z.enum([
      "Herramientas y precios",
      "Guías de edición",
      "Estrategia de contenido",
      "Ideas por industria",
      "Referencia",
    ]),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    // Lower numbers are listed first and indexed first.
    order: z.number().int(),
    faqs: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .default([]),
    sources: z
      .array(z.object({ title: z.string(), url: z.string().url() }))
      .min(2),
    coverAlt: z.string(),
  }),
});

export const collections = { blog };
