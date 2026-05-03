import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const products = defineCollection({
  loader: glob({
    pattern: ["**/*.md"],
    base: "../MS_AI_Wiki/Microsoft/Products",
  }),
  schema: z.object({
    watch: z.enum(["close", "standard", "passive"]).optional(),
    status: z.enum(["ga", "preview", "deprecated", "eos"]).optional(),
    last_verified: z.coerce.string().optional(),
    aliases: z.array(z.string()).default([]),
    moc: z.array(z.string()).default([]),
    research_depth: z.enum(["stub", "deep"]).optional(),
    successor: z.string().optional(),
    deprecation_date: z.coerce.string().optional(),
  }),
});

const mocs = defineCollection({
  loader: glob({
    pattern: ["*.md"],
    base: "../MS_AI_Wiki/Microsoft/MOCs",
  }),
  schema: z.object({
    type: z.literal("moc").optional(),
    tags: z.array(z.string()).default([]),
    last_verified: z.coerce.string().optional(),
  }),
});

export const collections = { products, mocs };
