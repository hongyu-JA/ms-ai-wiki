# Web Product Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Static-Site Web-Catalog der 45 KB-Notes mit Grid/Table-View, Filter und Detail-Pages, deployed auf Cloudflare Pages mit Basic-Auth.

**Architecture:** Astro Content Collections lesen `MS_AI_Wiki/Microsoft/{Products,MOCs}/*.md` zur Build-Zeit. Static HTML output, mit 2 React-Islands (FilterBar + SearchBox) für Client-Side-Interaktivität. Cloudflare Pages auto-baut bei git push, Cloudflare Access "Service Auth" gated den Zugriff via shared password.

**Tech Stack:** Astro 5+ · TypeScript · React 19 (für Islands) · Tailwind CSS · Bun (Build) · Cloudflare Pages (Hosting) · Cloudflare Access (Auth)

**Spec:** [docs/superpowers/specs/2026-05-03-web-catalog-design.md](../specs/2026-05-03-web-catalog-design.md)

---

## File Structure (was wir bauen)

```
web/                                    # NEU — komplett neuer Ordner
├── package.json
├── bun.lock
├── astro.config.mjs
├── tsconfig.json
├── tailwind.config.mjs
├── README.md
├── .gitignore
├── public/
│   └── favicon.svg
└── src/
    ├── content/
    │   └── config.ts                   # Zod Schema für Product/MOC frontmatter
    ├── pages/
    │   ├── index.astro                 # L2 Grid Homepage
    │   ├── table.astro                 # L1 Table Toggle-View
    │   └── products/
    │       └── [slug].astro            # 3-Spalten Detail-View
    ├── components/
    │   ├── ProductCard.astro
    │   ├── ProductRow.astro
    │   ├── FilterBar.tsx               # React island
    │   ├── SearchBox.tsx               # React island
    │   ├── Sidebar.astro
    │   ├── Header.astro
    │   └── Markdown.astro
    ├── lib/
    │   ├── load-products.ts
    │   ├── load-mocs.ts
    │   └── wikilinks.ts
    └── styles/
        └── global.css
```

Files outside `web/` werden in Tasks 12-13 berührt (`README.md`, `.gitignore`).

---

## Pre-Flight

- [ ] **Pre-Step 1: Verify Node + Bun verfügbar**

```powershell
node --version    # Erwartet: v22+ oder v24+
bun --version     # Erwartet: 1.x
```

Wenn fehlt: `winget install OpenJS.NodeJS` bzw. `irm bun.sh/install.ps1 | iex`.

- [ ] **Pre-Step 2: Worktree-Position prüfen**

```bash
git branch --show-current
```
Erwartet: `feature/web-catalog-spec` (Spec-Branch). Wir entwickeln im selben Branch — am Ende wird er zu `feature/web-catalog` umbenannt oder direkt als PR getitled.

---

## Task 1: Astro-Projekt scaffolden

**Files:**
- Create: `web/package.json`, `web/astro.config.mjs`, `web/tsconfig.json`, `web/.gitignore`, `web/src/pages/index.astro` (placeholder)

- [ ] **Step 1: Astro-Starter via CLI in `web/` Subfolder**

```bash
cd /c/Claude_code/MS_AI_Wiki/.claude/worktrees/web-catalog
bun create astro@latest web -- --template minimal --typescript strict --no-install --no-git --skip-houston --yes
```

- [ ] **Step 2: In `web/` Dependencies installieren**

```bash
cd web
bun add astro@^5 @astrojs/react@^4 @astrojs/tailwind@^6 react@^19 react-dom@^19 zod@^3
bun add -d @types/react @types/react-dom
```

- [ ] **Step 3: `astro.config.mjs` konfigurieren**

Datei `web/astro.config.mjs` ersetzen durch:

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [react(), tailwind()],
  output: "static",
  site: "https://journai-msai-wiki.pages.dev",
});
```

- [ ] **Step 4: Build-Test (sollte mit Default-index passen)**

```bash
cd web && bun run build
```
Erwartet: `dist/` Ordner mit `index.html`, exit code 0.

- [ ] **Step 5: Commit**

```bash
cd /c/Claude_code/MS_AI_Wiki/.claude/worktrees/web-catalog
git add web/
git commit -m "feat(web): scaffold Astro project with React + Tailwind"
```

---

## Task 2: Tailwind + globale Styles

**Files:**
- Create: `web/tailwind.config.mjs`, `web/src/styles/global.css`
- Modify: `web/src/pages/index.astro` (placeholder mit Tailwind-Test)

- [ ] **Step 1: `web/tailwind.config.mjs`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        // Tier badges
        "tier-1": "#16a34a",  // green
        "tier-2": "#ca8a04",  // amber
        "tier-3": "#6b7280",  // gray
        // Watch badges
        "watch-close": "#dc2626",     // red
        "watch-standard": "#2563eb",  // blue
        "watch-passive": "#9ca3af",   // gray
        // Status badges
        "status-ga": "#059669",
        "status-preview": "#7c3aed",
        "status-deprecated": "#dc2626",
        "status-eos": "#991b1b",
      },
    },
  },
};
```

- [ ] **Step 2: `web/src/styles/global.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { @apply bg-gray-50 text-gray-900 font-sans antialiased; }
  h1 { @apply text-3xl font-bold; }
  h2 { @apply text-2xl font-semibold mt-6 mb-3; }
  h3 { @apply text-xl font-semibold mt-4 mb-2; }
  a { @apply text-blue-600 hover:underline; }
}

@layer components {
  .badge { @apply inline-block px-2 py-0.5 text-xs font-semibold rounded-full; }
  .badge-tier-1 { @apply bg-tier-1 text-white; }
  .badge-tier-2 { @apply bg-tier-2 text-white; }
  .badge-tier-3 { @apply bg-tier-3 text-white; }
  .badge-watch-close { @apply bg-watch-close text-white; }
  .badge-watch-standard { @apply bg-watch-standard text-white; }
  .badge-watch-passive { @apply bg-watch-passive text-white; }
  .badge-status-ga { @apply bg-status-ga text-white; }
  .badge-status-preview { @apply bg-status-preview text-white; }
  .badge-status-deprecated { @apply bg-status-deprecated text-white; }
  .badge-status-eos { @apply bg-status-eos text-white; }
}
```

- [ ] **Step 3: `web/src/pages/index.astro` als Placeholder**

```astro
---
import "../styles/global.css";
---
<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <title>MS AI Wiki</title>
  </head>
  <body class="p-8">
    <h1>Microsoft AI Knowledge Base</h1>
    <p class="mt-2 text-gray-600">Catalog wird gebaut...</p>
    <span class="badge badge-tier-1 mt-4">Test Badge</span>
  </body>
</html>
```

- [ ] **Step 4: Dev-Server kurz testen**

```bash
cd web && bun run dev
```
Browser öffnen `http://localhost:4321` — sehen "Microsoft AI Knowledge Base" + grünen Badge. Ctrl+C zum Stoppen.

- [ ] **Step 5: Commit**

```bash
git add web/
git commit -m "feat(web): tailwind config + global styles + badge classes"
```

---

## Task 3: Content Collection Schema + Loader

**Files:**
- Create: `web/src/content/config.ts`, `web/src/lib/load-products.ts`

- [ ] **Step 1: `web/src/content/config.ts`**

```typescript
import { defineCollection, z } from "astro:content";

const products = defineCollection({
  type: "content",
  schema: z.object({
    watch: z.enum(["close", "standard", "passive"]).optional(),
    status: z.enum(["ga", "preview", "deprecated", "eos"]).optional(),
    last_verified: z.string().optional(),
    aliases: z.array(z.string()).default([]),
    moc: z.array(z.string()).default([]),
    research_depth: z.enum(["stub", "deep"]).optional(),
    successor: z.string().optional(),
    deprecation_date: z.string().optional(),
  }),
});

const mocs = defineCollection({
  type: "content",
  schema: z.object({
    type: z.literal("moc").optional(),
    tags: z.array(z.string()).default([]),
    last_verified: z.string().optional(),
  }),
});

export const collections = { products, mocs };
```

- [ ] **Step 2: Content-Verzeichnis konfigurieren — Astro liest `../MS_AI_Wiki/Microsoft/`**

In `web/astro.config.mjs` zwischen die `integrations` und `output` Zeile einfügen:

```js
  // Content Collections lesen aus dem Vault eine Ebene höher
  contentDir: "../MS_AI_Wiki/Microsoft",
```

ACHTUNG: Astro 5 erwartet Content Collections in `src/content/<collection-name>/`. Wir verwenden eine Custom Loader-Pattern statt der Default-Location.

Stattdessen — `web/src/content/config.ts` ändern auf den `glob()` Loader:

```typescript
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
    last_verified: z.string().optional(),
    aliases: z.array(z.string()).default([]),
    moc: z.array(z.string()).default([]),
    research_depth: z.enum(["stub", "deep"]).optional(),
    successor: z.string().optional(),
    deprecation_date: z.string().optional(),
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
    last_verified: z.string().optional(),
  }),
});

export const collections = { products, mocs };
```

(Die Idee: `glob` Loader erlaubt arbiträre Pfade. Custom contentDir-Setting ist nicht nötig.)

- [ ] **Step 3: `web/src/lib/load-products.ts` als Wrapper**

```typescript
import { getCollection, type CollectionEntry } from "astro:content";

export type Product = CollectionEntry<"products"> & {
  slug: string;
  isDeprecated: boolean;
  primaryHomeMoc: string | null;
};

/**
 * Liest alle Products aus der Content Collection, normalisiert die slug
 * und extrahiert die "Primary Home" MOC aus dem moc[]-Frontmatter.
 */
export async function loadProducts(): Promise<Product[]> {
  const raw = await getCollection("products");
  return raw.map((entry) => {
    // glob slug ist relativer Pfad ohne .md, z.B. "deprecated/Bot Framework"
    // oder "Microsoft Agent Framework". Normalisieren zu kebab-case.
    const slugRaw = entry.id;
    const slug = slugRaw.toLowerCase().replace(/[\s/]+/g, "-").replace(/[^a-z0-9-]/g, "");
    const isDeprecated = slugRaw.startsWith("deprecated/");
    // Primary Home MOC = erste MOC im moc[] frontmatter, die NICHT [[Microsoft MOC]] ist
    const primaryHomeMoc = (entry.data.moc ?? [])
      .map((m) => m.replace(/^\[\[|\]\]$/g, ""))
      .find((m) => m !== "Microsoft MOC") ?? null;
    return { ...entry, slug, isDeprecated, primaryHomeMoc };
  });
}
```

- [ ] **Step 4: Build-Test**

```bash
cd web && bun run build
```
Erwartet: build succeeds. Astro logs: "Found N entries for collection 'products'" (N ≈ 45). Wenn frontmatter-Validation-Errors auftauchen: pro Note checken welches Feld fehlt, und ggf. das Schema noch toleranter machen.

- [ ] **Step 5: Commit**

```bash
git add web/
git commit -m "feat(web): content collections — products + mocs glob loader"
```

---

## Task 4: ProductCard + Grid Homepage

**Files:**
- Create: `web/src/components/ProductCard.astro`
- Modify: `web/src/pages/index.astro`

- [ ] **Step 1: `web/src/components/ProductCard.astro`**

```astro
---
import type { Product } from "../lib/load-products";

interface Props {
  product: Product;
  tier: 1 | 2 | 3;
  tagline: string;
}

const { product, tier, tagline } = Astro.props;
const { data, slug } = product;
const status = data.status ?? "ga";
const watch = data.watch ?? "standard";
---
<a href={`/products/${slug}`} class="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition no-underline">
  <div class="flex items-center gap-2 mb-2">
    <span class={`badge badge-tier-${tier}`}>T{tier}</span>
    <span class={`badge badge-watch-${watch}`}>{watch}</span>
    {data.status === "deprecated" && <span class="badge badge-status-deprecated">deprecated</span>}
    {data.status === "eos" && <span class="badge badge-status-eos">EOS</span>}
  </div>
  <h3 class="text-base font-semibold text-gray-900 mb-1 mt-0">{product.id.replace(/^deprecated\//, "")}</h3>
  <p class="text-sm text-gray-600 line-clamp-3">{tagline}</p>
</a>
```

- [ ] **Step 2: `products.yaml` Tier+Tagline einlesen**

`load-products.ts` muss tier/tagline aus `.automation/products.yaml` mergen, da nicht im Note-Frontmatter.

Datei `web/src/lib/load-products.ts` ergänzen — am Anfang importieren:

```typescript
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import yaml from "js-yaml";
```

Dependency installieren:

```bash
cd web && bun add js-yaml && bun add -d @types/js-yaml
```

Dann `loadProducts()` umbauen:

```typescript
interface ProductYaml {
  slug: string;
  note: string;
  primary_home_moc: string;
  tagline?: string;
  tier: 1 | 2 | 3;
  watch?: "close" | "standard" | "passive";
  enabled?: boolean;
}

export type Product = CollectionEntry<"products"> & {
  slug: string;
  isDeprecated: boolean;
  primaryHomeMoc: string | null;
  tier: 1 | 2 | 3;
  tagline: string;
};

export async function loadProducts(): Promise<Product[]> {
  // products.yaml laden — relative zu web/
  const yamlPath = resolve(process.cwd(), "../.automation/products.yaml");
  const yamlText = readFileSync(yamlPath, "utf8");
  const yamlDoc = yaml.load(yamlText) as { products: ProductYaml[] };
  const yamlBySlug = new Map(yamlDoc.products.map((p) => [p.slug, p]));

  const raw = await getCollection("products");
  return raw.map((entry) => {
    const slugRaw = entry.id;
    const slug = slugRaw.toLowerCase().replace(/[\s/]+/g, "-").replace(/[^a-z0-9-]/g, "");
    const isDeprecated = slugRaw.startsWith("deprecated/");
    const primaryHomeMoc = (entry.data.moc ?? [])
      .map((m) => m.replace(/^\[\[|\]\]$/g, ""))
      .find((m) => m !== "Microsoft MOC") ?? null;

    const yamlEntry = yamlBySlug.get(slug);
    const tier = yamlEntry?.tier ?? 3;
    const tagline = yamlEntry?.tagline ?? "(keine Tagline gepflegt)";

    return { ...entry, slug, isDeprecated, primaryHomeMoc, tier, tagline };
  });
}
```

- [ ] **Step 3: `web/src/pages/index.astro`**

```astro
---
import "../styles/global.css";
import { loadProducts } from "../lib/load-products";
import ProductCard from "../components/ProductCard.astro";

const products = await loadProducts();
const sorted = products.sort((a, b) => a.tier - b.tier || a.id.localeCompare(b.id));
---
<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MS AI Wiki — Catalog</title>
  </head>
  <body>
    <header class="bg-white border-b border-gray-200 px-8 py-4">
      <h1 class="m-0">Microsoft AI Knowledge Base</h1>
      <p class="m-0 text-sm text-gray-600">{products.length} Produkte · Stand: {new Date().toISOString().slice(0, 10)}</p>
    </header>
    <main class="p-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sorted.map((p) => <ProductCard product={p} tier={p.tier} tagline={p.tagline} />)}
      </div>
    </main>
  </body>
</html>
```

- [ ] **Step 4: Dev-Server testen**

```bash
cd web && bun run dev
```
Browser → `http://localhost:4321`. Erwartet: 45 Cards in Grid, Tier 1 zuerst (grün), dann Tier 2 (amber), dann Tier 3 (grau). Cards sind klickbar (führt zu `/products/<slug>` was noch nicht existiert — 404 OK).

- [ ] **Step 5: Commit**

```bash
git add web/
git commit -m "feat(web): ProductCard + L2 Grid Homepage with 45 products"
```

---

## Task 5: FilterBar React Island

**Files:**
- Create: `web/src/components/FilterBar.tsx`
- Modify: `web/src/pages/index.astro`

- [ ] **Step 1: `web/src/components/FilterBar.tsx`**

```tsx
import { useState, useEffect } from "react";

export interface FilterState {
  tier: Set<1 | 2 | 3>;
  moc: Set<string>;
  watch: Set<"close" | "standard" | "passive">;
  status: Set<"ga" | "preview" | "deprecated" | "eos">;
}

interface Props {
  allMocs: string[];
  initial?: Partial<{ tier: number[]; moc: string[]; watch: string[]; status: string[] }>;
  onChange: (state: FilterState) => void;
}

export default function FilterBar({ allMocs, initial, onChange }: Props) {
  const [tier, setTier] = useState(new Set<1 | 2 | 3>(
    (initial?.tier ?? []) as (1 | 2 | 3)[]
  ));
  const [moc, setMoc] = useState(new Set<string>(initial?.moc ?? []));
  const [watch, setWatch] = useState(new Set<string>(initial?.watch ?? []));
  const [status, setStatus] = useState(new Set<string>(initial?.status ?? []));

  useEffect(() => {
    onChange({ tier, moc, watch, status } as FilterState);
    // URL-State updaten
    const params = new URLSearchParams();
    if (tier.size) params.set("tier", [...tier].join(","));
    if (moc.size) params.set("moc", [...moc].join(","));
    if (watch.size) params.set("watch", [...watch].join(","));
    if (status.size) params.set("status", [...status].join(","));
    const url = params.toString() ? `?${params}` : window.location.pathname;
    window.history.replaceState({}, "", url);
  }, [tier, moc, watch, status]);

  const toggle = <T,>(set: Set<T>, value: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    setter(next);
  };

  const Chip = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded-full border transition ${
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs uppercase text-gray-500 mr-2">Tier:</span>
      {([1, 2, 3] as const).map((t) => (
        <Chip key={t} active={tier.has(t)} label={`T${t}`} onClick={() => toggle(tier, t, setTier)} />
      ))}
      <span className="text-xs uppercase text-gray-500 ml-3 mr-2">MOC:</span>
      {allMocs.map((m) => (
        <Chip key={m} active={moc.has(m)} label={m} onClick={() => toggle(moc, m, setMoc)} />
      ))}
      <span className="text-xs uppercase text-gray-500 ml-3 mr-2">Watch:</span>
      {(["close", "standard", "passive"] as const).map((w) => (
        <Chip key={w} active={watch.has(w)} label={w} onClick={() => toggle(watch, w, setWatch)} />
      ))}
      <span className="text-xs uppercase text-gray-500 ml-3 mr-2">Status:</span>
      {(["ga", "preview", "deprecated", "eos"] as const).map((s) => (
        <Chip key={s} active={status.has(s)} label={s} onClick={() => toggle(status, s, setStatus)} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Integrate FilterBar in `index.astro`**

`web/src/pages/index.astro` ersetzen durch:

```astro
---
import "../styles/global.css";
import { loadProducts } from "../lib/load-products";
import ProductCard from "../components/ProductCard.astro";
import FilterBar from "../components/FilterBar";

const products = await loadProducts();
const sorted = products.sort((a, b) => a.tier - b.tier || a.id.localeCompare(b.id));
const allMocs = [...new Set(sorted.map((p) => p.primaryHomeMoc).filter(Boolean) as string[])].sort();

// Serialize products für client-side filtering
const productData = sorted.map((p) => ({
  slug: p.slug,
  id: p.id,
  tier: p.tier,
  tagline: p.tagline,
  watch: p.data.watch ?? "standard",
  status: p.data.status ?? "ga",
  primaryHomeMoc: p.primaryHomeMoc,
  isDeprecated: p.isDeprecated,
}));
---
<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MS AI Wiki — Catalog</title>
  </head>
  <body>
    <header class="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
      <h1 class="m-0">Microsoft AI Knowledge Base</h1>
      <p class="m-0 text-sm text-gray-600 mb-3">{products.length} Produkte · Stand: {new Date().toISOString().slice(0, 10)}</p>
      <div id="filter-mount"></div>
    </header>
    <main class="p-8">
      <div id="grid-mount" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sorted.map((p) => <ProductCard product={p} tier={p.tier} tagline={p.tagline} />)}
      </div>
    </main>

    <script type="application/json" id="product-data" set:html={JSON.stringify(productData)} />
    <script type="application/json" id="all-mocs" set:html={JSON.stringify(allMocs)} />
    <FilterBar client:load allMocs={allMocs} onChange={() => {}} />
  </body>
</html>
```

ACHTUNG: Der `<FilterBar client:load>` Pattern + `onChange` zu serialisieren ist tricky. Saubere Lösung — Filter-Logik komplett in einer separaten React-Component, die auch das Grid rendert.

Step 2-FIX — saubere Architektur: erstelle `web/src/components/CatalogClient.tsx`:

```tsx
import { useState } from "react";
import FilterBar, { type FilterState } from "./FilterBar";

interface ProductData {
  slug: string;
  id: string;
  tier: 1 | 2 | 3;
  tagline: string;
  watch: string;
  status: string;
  primaryHomeMoc: string | null;
  isDeprecated: boolean;
}

interface Props {
  products: ProductData[];
  allMocs: string[];
}

export default function CatalogClient({ products, allMocs }: Props) {
  // Initial-Filter aus URL ableiten
  const url = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const initial = {
    tier: (url.get("tier")?.split(",").map(Number) ?? []) as number[],
    moc: url.get("moc")?.split(",") ?? [],
    watch: url.get("watch")?.split(",") ?? [],
    status: url.get("status")?.split(",") ?? [],
  };
  const [filtered, setFiltered] = useState<ProductData[]>(products);

  const onFilterChange = (s: FilterState) => {
    const f = products.filter((p) => {
      if (s.tier.size && !s.tier.has(p.tier)) return false;
      if (s.moc.size && !(p.primaryHomeMoc && s.moc.has(p.primaryHomeMoc))) return false;
      if (s.watch.size && !s.watch.has(p.watch as any)) return false;
      if (s.status.size && !s.status.has(p.status as any)) return false;
      return true;
    });
    setFiltered(f);
  };

  return (
    <>
      <FilterBar allMocs={allMocs} initial={initial} onChange={onFilterChange} />
      <div className="text-sm text-gray-500 mt-2">{filtered.length} von {products.length} Produkten</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {filtered.map((p) => (
          <a key={p.slug} href={`/products/${p.slug}`} className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition no-underline">
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge badge-tier-${p.tier}`}>T{p.tier}</span>
              <span className={`badge badge-watch-${p.watch}`}>{p.watch}</span>
              {p.status === "deprecated" && <span className="badge badge-status-deprecated">deprecated</span>}
              {p.status === "eos" && <span className="badge badge-status-eos">EOS</span>}
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1 mt-0">{p.id.replace(/^deprecated\//, "")}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{p.tagline}</p>
          </a>
        ))}
      </div>
    </>
  );
}
```

Dann `index.astro` final:

```astro
---
import "../styles/global.css";
import { loadProducts } from "../lib/load-products";
import CatalogClient from "../components/CatalogClient";

const products = await loadProducts();
const sorted = products.sort((a, b) => a.tier - b.tier || a.id.localeCompare(b.id));
const allMocs = [...new Set(sorted.map((p) => p.primaryHomeMoc).filter(Boolean) as string[])].sort();

const productData = sorted.map((p) => ({
  slug: p.slug,
  id: p.id,
  tier: p.tier,
  tagline: p.tagline,
  watch: p.data.watch ?? "standard",
  status: p.data.status ?? "ga",
  primaryHomeMoc: p.primaryHomeMoc,
  isDeprecated: p.isDeprecated,
}));
---
<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MS AI Wiki — Catalog</title>
  </head>
  <body>
    <header class="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
      <h1 class="m-0">Microsoft AI Knowledge Base</h1>
      <p class="m-0 text-sm text-gray-600">{products.length} Produkte · Stand: {new Date().toISOString().slice(0, 10)}</p>
    </header>
    <main class="p-8">
      <CatalogClient client:load products={productData} allMocs={allMocs} />
    </main>
  </body>
</html>
```

Damit ist `ProductCard.astro` aus Task 4 obsolet — Card-Markup lebt jetzt direkt in `CatalogClient.tsx`. Das ist OK; `ProductCard.astro` löschen oder leer lassen für später.

- [ ] **Step 3: Test in Browser**

```bash
cd web && bun run dev
```
Browser → `http://localhost:4321`. Erwartet:
- Filter-Chips erscheinen (Tier T1/T2/T3, MOCs, Watch, Status)
- Klick auf "T1" → nur 19 Cards sichtbar
- Klick auf "Agents MOC" → nur die zugehörigen
- URL ändert sich (`?tier=1&moc=Agents%20MOC`)
- Refresh: Filter bleibt erhalten

- [ ] **Step 4: Commit**

```bash
git add web/
git commit -m "feat(web): FilterBar + CatalogClient with URL-state filters"
```

---

## Task 6: SearchBox React Island

**Files:**
- Create: `web/src/components/SearchBox.tsx`
- Modify: `web/src/components/CatalogClient.tsx`

- [ ] **Step 1: `web/src/components/SearchBox.tsx`**

```tsx
import { useState, useEffect } from "react";

interface Props {
  initial?: string;
  onChange: (q: string) => void;
}

export default function SearchBox({ initial = "", onChange }: Props) {
  const [q, setQ] = useState(initial);

  useEffect(() => {
    onChange(q);
    // URL state updaten — search-param "q"
    const params = new URLSearchParams(window.location.search);
    if (q) params.set("q", q);
    else params.delete("q");
    const url = params.toString() ? `?${params}` : window.location.pathname;
    window.history.replaceState({}, "", url);
  }, [q]);

  return (
    <input
      type="search"
      placeholder="Suche in Titel, Tagline, Aliases..."
      className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      value={q}
      onChange={(e) => setQ(e.target.value)}
    />
  );
}
```

- [ ] **Step 2: SearchBox in CatalogClient integrieren**

In `web/src/components/CatalogClient.tsx`:

```tsx
import { useState, useMemo } from "react";
import FilterBar, { type FilterState } from "./FilterBar";
import SearchBox from "./SearchBox";

// ProductData interface bleibt + add aliases:
interface ProductData {
  slug: string;
  id: string;
  tier: 1 | 2 | 3;
  tagline: string;
  watch: string;
  status: string;
  primaryHomeMoc: string | null;
  isDeprecated: boolean;
  aliases: string[];   // NEU
}

// In Props bleibt unverändert. Im Body:
export default function CatalogClient({ products, allMocs }: Props) {
  const url = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const initial = {
    tier: (url.get("tier")?.split(",").map(Number) ?? []) as number[],
    moc: url.get("moc")?.split(",") ?? [],
    watch: url.get("watch")?.split(",") ?? [],
    status: url.get("status")?.split(",") ?? [],
  };
  const initialQ = url.get("q") ?? "";

  const [filterState, setFilterState] = useState<FilterState>({
    tier: new Set(initial.tier as (1|2|3)[]),
    moc: new Set(initial.moc),
    watch: new Set(initial.watch as any),
    status: new Set(initial.status as any),
  });
  const [query, setQuery] = useState(initialQ);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (filterState.tier.size && !filterState.tier.has(p.tier)) return false;
      if (filterState.moc.size && !(p.primaryHomeMoc && filterState.moc.has(p.primaryHomeMoc))) return false;
      if (filterState.watch.size && !filterState.watch.has(p.watch as any)) return false;
      if (filterState.status.size && !filterState.status.has(p.status as any)) return false;
      if (q) {
        const hay = `${p.id} ${p.tagline} ${p.aliases.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [products, filterState, query]);

  return (
    <>
      <div className="mb-3"><SearchBox initial={initialQ} onChange={setQuery} /></div>
      <FilterBar allMocs={allMocs} initial={initial} onChange={setFilterState} />
      <div className="text-sm text-gray-500 mt-2">{filtered.length} von {products.length} Produkten</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {filtered.map((p) => (
          <a key={p.slug} href={`/products/${p.slug}`} className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition no-underline">
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge badge-tier-${p.tier}`}>T{p.tier}</span>
              <span className={`badge badge-watch-${p.watch}`}>{p.watch}</span>
              {p.status === "deprecated" && <span className="badge badge-status-deprecated">deprecated</span>}
              {p.status === "eos" && <span className="badge badge-status-eos">EOS</span>}
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1 mt-0">{p.id.replace(/^deprecated\//, "")}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{p.tagline}</p>
          </a>
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 3: `index.astro` — aliases zu ProductData hinzufügen**

```astro
const productData = sorted.map((p) => ({
  slug: p.slug,
  id: p.id,
  tier: p.tier,
  tagline: p.tagline,
  watch: p.data.watch ?? "standard",
  status: p.data.status ?? "ga",
  primaryHomeMoc: p.primaryHomeMoc,
  isDeprecated: p.isDeprecated,
  aliases: p.data.aliases ?? [],   // NEU
}));
```

- [ ] **Step 4: Browser-Test**

```bash
cd web && bun run dev
```
Eingabe "Foundry" im Suchfeld → ~10 Produkte. URL: `?q=Foundry`. Refresh → Search-Eingabe bleibt.

- [ ] **Step 5: Commit**

```bash
git add web/
git commit -m "feat(web): SearchBox with URL state, integrated in CatalogClient"
```

---

## Task 7: Table View Toggle (L1)

**Files:**
- Create: `web/src/pages/table.astro`, `web/src/components/Header.astro`, `web/src/components/TableClient.tsx`
- Modify: `web/src/pages/index.astro` (Header einbinden)

- [ ] **Step 1: `web/src/components/Header.astro`**

```astro
---
const { current = "grid" } = Astro.props as { current?: "grid" | "table" };
---
<header class="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
  <div class="flex items-baseline justify-between">
    <div>
      <h1 class="m-0">Microsoft AI Knowledge Base</h1>
      <p class="m-0 text-sm text-gray-600">{Astro.props.subtitle ?? ""}</p>
    </div>
    <nav class="flex gap-2">
      <a href="/" class={`px-3 py-1 text-sm rounded ${current === "grid" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Grid</a>
      <a href="/table" class={`px-3 py-1 text-sm rounded ${current === "table" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Table</a>
    </nav>
  </div>
  <slot name="filters" />
</header>
```

- [ ] **Step 2: `web/src/components/TableClient.tsx`**

```tsx
import { useState, useMemo } from "react";
import FilterBar, { type FilterState } from "./FilterBar";
import SearchBox from "./SearchBox";

interface ProductData {
  slug: string;
  id: string;
  tier: 1 | 2 | 3;
  tagline: string;
  watch: string;
  status: string;
  primaryHomeMoc: string | null;
  aliases: string[];
}

interface Props {
  products: ProductData[];
  allMocs: string[];
}

export default function TableClient({ products, allMocs }: Props) {
  const url = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const initial = {
    tier: (url.get("tier")?.split(",").map(Number) ?? []) as number[],
    moc: url.get("moc")?.split(",") ?? [],
    watch: url.get("watch")?.split(",") ?? [],
    status: url.get("status")?.split(",") ?? [],
  };
  const [filterState, setFilterState] = useState<FilterState>({
    tier: new Set(initial.tier as (1|2|3)[]),
    moc: new Set(initial.moc),
    watch: new Set(initial.watch as any),
    status: new Set(initial.status as any),
  });
  const [query, setQuery] = useState(url.get("q") ?? "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (filterState.tier.size && !filterState.tier.has(p.tier)) return false;
      if (filterState.moc.size && !(p.primaryHomeMoc && filterState.moc.has(p.primaryHomeMoc))) return false;
      if (filterState.watch.size && !filterState.watch.has(p.watch as any)) return false;
      if (filterState.status.size && !filterState.status.has(p.status as any)) return false;
      if (q && !`${p.id} ${p.tagline} ${p.aliases.join(" ")}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, filterState, query]);

  return (
    <>
      <div className="mb-3"><SearchBox initial={url.get("q") ?? ""} onChange={setQuery} /></div>
      <FilterBar allMocs={allMocs} initial={initial} onChange={setFilterState} />
      <div className="text-sm text-gray-500 mt-2">{filtered.length} von {products.length} Produkten</div>
      <table className="mt-4 w-full text-sm bg-white border border-gray-200 rounded">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-3 py-2">Produkt</th>
            <th className="text-left px-3 py-2 w-16">Tier</th>
            <th className="text-left px-3 py-2 w-24">Watch</th>
            <th className="text-left px-3 py-2 w-24">Status</th>
            <th className="text-left px-3 py-2 w-40">Primary MOC</th>
            <th className="text-left px-3 py-2">Tagline</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.slug} className="border-t border-gray-100 hover:bg-gray-50">
              <td className="px-3 py-2"><a href={`/products/${p.slug}`} className="font-semibold">{p.id.replace(/^deprecated\//, "")}</a></td>
              <td className="px-3 py-2"><span className={`badge badge-tier-${p.tier}`}>T{p.tier}</span></td>
              <td className="px-3 py-2"><span className={`badge badge-watch-${p.watch}`}>{p.watch}</span></td>
              <td className="px-3 py-2">{p.status}</td>
              <td className="px-3 py-2 text-gray-600">{p.primaryHomeMoc ?? "—"}</td>
              <td className="px-3 py-2 text-gray-600">{p.tagline}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
```

- [ ] **Step 3: `web/src/pages/table.astro`**

```astro
---
import "../styles/global.css";
import { loadProducts } from "../lib/load-products";
import Header from "../components/Header.astro";
import TableClient from "../components/TableClient";

const products = await loadProducts();
const sorted = products.sort((a, b) => a.tier - b.tier || a.id.localeCompare(b.id));
const allMocs = [...new Set(sorted.map((p) => p.primaryHomeMoc).filter(Boolean) as string[])].sort();
const productData = sorted.map((p) => ({
  slug: p.slug, id: p.id, tier: p.tier, tagline: p.tagline,
  watch: p.data.watch ?? "standard", status: p.data.status ?? "ga",
  primaryHomeMoc: p.primaryHomeMoc, aliases: p.data.aliases ?? [],
}));
---
<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MS AI Wiki — Table</title>
  </head>
  <body>
    <Header current="table" subtitle={`${products.length} Produkte`} />
    <main class="p-8">
      <TableClient client:load products={productData} allMocs={allMocs} />
    </main>
  </body>
</html>
```

- [ ] **Step 4: `index.astro` Header einbauen**

`web/src/pages/index.astro` `<header>` Block ersetzen durch:

```astro
<Header current="grid" subtitle={`${products.length} Produkte · Stand: ${new Date().toISOString().slice(0, 10)}`} />
```

und `import Header from "../components/Header.astro";` ergänzen.

- [ ] **Step 5: Browser-Test**

`bun run dev` → `http://localhost:4321` zeigt Grid + Toggle-Buttons. Klick "Table" → Tabelle. Filter-State vererbt sich nicht (URL bleibt gleich, aber FilterBar liest sie beim Hydrate).

- [ ] **Step 6: Commit**

```bash
git add web/
git commit -m "feat(web): table view (L1) + Header with Grid/Table toggle"
```

---

## Task 8: Detail View 3-Column

**Files:**
- Create: `web/src/pages/products/[slug].astro`, `web/src/components/Sidebar.astro`

- [ ] **Step 1: `web/src/components/Sidebar.astro`**

```astro
---
import type { Product } from "../lib/load-products";

interface Props {
  product: Product;
  related: Product[];
}
const { product, related } = Astro.props;
const { data, tier } = product;
---
<aside class="w-72 flex-shrink-0 p-4 bg-white border-l border-gray-200">
  <h3 class="text-base font-semibold mt-0">Metadaten</h3>
  <dl class="text-sm space-y-2">
    <div>
      <dt class="text-gray-500">Tier</dt>
      <dd><span class={`badge badge-tier-${tier}`}>T{tier}</span></dd>
    </div>
    <div>
      <dt class="text-gray-500">Watch</dt>
      <dd><span class={`badge badge-watch-${data.watch ?? "standard"}`}>{data.watch ?? "standard"}</span></dd>
    </div>
    <div>
      <dt class="text-gray-500">Status</dt>
      <dd>{data.status ?? "ga"}</dd>
    </div>
    {data.last_verified && (
      <div>
        <dt class="text-gray-500">Last verified</dt>
        <dd>{data.last_verified}</dd>
      </div>
    )}
    {product.primaryHomeMoc && (
      <div>
        <dt class="text-gray-500">Primary Home MOC</dt>
        <dd>{product.primaryHomeMoc}</dd>
      </div>
    )}
    {data.aliases.length > 0 && (
      <div>
        <dt class="text-gray-500">Aliases</dt>
        <dd class="text-xs text-gray-700">{data.aliases.join(", ")}</dd>
      </div>
    )}
    {data.successor && (
      <div>
        <dt class="text-gray-500">Successor</dt>
        <dd>{data.successor}</dd>
      </div>
    )}
    {data.deprecation_date && (
      <div>
        <dt class="text-gray-500">Deprecation Date</dt>
        <dd>{data.deprecation_date}</dd>
      </div>
    )}
  </dl>

  {related.length > 0 && (
    <>
      <h3 class="text-base font-semibold mt-6">Verwandte Produkte</h3>
      <ul class="text-sm space-y-1 list-none p-0">
        {related.map((r) => (
          <li><a href={`/products/${r.slug}`} class="text-blue-600 hover:underline">{r.id.replace(/^deprecated\//, "")}</a></li>
        ))}
      </ul>
    </>
  )}
</aside>
```

- [ ] **Step 2: `web/src/pages/products/[slug].astro`**

```astro
---
import "../../styles/global.css";
import { loadProducts, type Product } from "../../lib/load-products";
import Header from "../../components/Header.astro";
import Sidebar from "../../components/Sidebar.astro";

export async function getStaticPaths() {
  const products = await loadProducts();
  return products.map((p) => ({ params: { slug: p.slug }, props: { product: p } }));
}

interface Props { product: Product; }
const { product } = Astro.props;
const { Content } = await product.render();

// Related: andere Produkte mit derselben primary_home_moc
const allProducts = await loadProducts();
const related = allProducts
  .filter((p) => p.slug !== product.slug && p.primaryHomeMoc && p.primaryHomeMoc === product.primaryHomeMoc)
  .slice(0, 8);
---
<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{product.id.replace(/^deprecated\//, "")} — MS AI Wiki</title>
  </head>
  <body>
    <Header current="grid" subtitle={`Produkt-Detail`} />
    <div class="flex">
      <nav class="w-48 flex-shrink-0 p-4 border-r border-gray-200">
        <a href="/" class="text-sm text-blue-600 hover:underline">← Zurück zur Übersicht</a>
      </nav>
      <main class="flex-1 p-8 max-w-3xl prose prose-gray">
        <h1>{product.id.replace(/^deprecated\//, "")}</h1>
        <Content />
      </main>
      <Sidebar product={product} related={related} />
    </div>
  </body>
</html>
```

- [ ] **Step 3: Tailwind Typography für `prose` Klassen installieren**

```bash
cd web && bun add -d @tailwindcss/typography
```

In `web/tailwind.config.mjs` Plugin hinzufügen:

```js
import typography from "@tailwindcss/typography";

export default {
  // ...existing config
  plugins: [typography],
};
```

- [ ] **Step 4: Browser-Test**

`bun run dev` → klicke auf eine Card → Detail-Page sollte sich öffnen mit:
- Header oben
- Linke Nav mit "Zurück" Link
- Mitte: gerendertes Markdown (alle Sections der Note)
- Rechte Sidebar: Tier badge, Watch badge, last_verified, Aliases, Verwandte Produkte

- [ ] **Step 5: Commit**

```bash
git add web/
git commit -m "feat(web): 3-column detail view with Sidebar (metadata + related)"
```

---

## Task 9: Wikilinks Pre-Processor

**Files:**
- Create: `web/src/lib/wikilinks.ts` — remark plugin
- Modify: `web/astro.config.mjs`

- [ ] **Step 1: `web/src/lib/wikilinks.ts`**

```typescript
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, Text } from "mdast";

/**
 * Wandelt Obsidian-style [[Note Name]] in normale markdown-Links um.
 * Slug = lowercase + spaces → hyphens. Behält den display name als Link-Text.
 *
 * Bsp.: [[Microsoft Agent Framework]] → [Microsoft Agent Framework](/products/microsoft-agent-framework)
 *       [[deprecated/Bot Framework]]   → [Bot Framework](/products/deprecated-bot-framework)
 */
export const remarkWikilinks: Plugin<[], Root> = () => (tree) => {
  visit(tree, "text", (node: Text, index, parent) => {
    if (!parent || index === undefined) return;
    const value = node.value;
    const re = /\[\[([^\]]+)\]\]/g;
    if (!re.test(value)) return;

    re.lastIndex = 0;
    const newChildren: any[] = [];
    let lastEnd = 0;
    let match: RegExpExecArray | null;

    while ((match = re.exec(value)) !== null) {
      if (match.index > lastEnd) {
        newChildren.push({ type: "text", value: value.slice(lastEnd, match.index) });
      }
      const target = match[1];
      const display = target.replace(/^deprecated\//, "");
      const slug = target.toLowerCase().replace(/[\s/]+/g, "-").replace(/[^a-z0-9-]/g, "");
      newChildren.push({
        type: "link",
        url: `/products/${slug}`,
        children: [{ type: "text", value: display }],
      });
      lastEnd = re.lastIndex;
    }
    if (lastEnd < value.length) {
      newChildren.push({ type: "text", value: value.slice(lastEnd) });
    }

    parent.children.splice(index, 1, ...newChildren);
    return index + newChildren.length;
  });
};
```

Dependency:

```bash
cd web && bun add unist-util-visit
bun add -d @types/mdast @types/unist
```

- [ ] **Step 2: Plugin in `astro.config.mjs` registrieren**

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { remarkWikilinks } from "./src/lib/wikilinks";

export default defineConfig({
  integrations: [react(), tailwind()],
  output: "static",
  site: "https://journai-msai-wiki.pages.dev",
  markdown: {
    remarkPlugins: [remarkWikilinks],
  },
});
```

- [ ] **Step 3: Verifizieren — Detail-Page mit `[[Foo]]` references**

`bun run dev` → öffne z.B. `/products/microsoft-agent-framework`. In der Note steht `[[Semantic Kernel]]` etc. — diese müssen jetzt als blauer Link erscheinen, klickbar zu `/products/deprecated-semantic-kernel`.

- [ ] **Step 4: Commit**

```bash
git add web/
git commit -m "feat(web): remark wikilinks plugin — [[Foo]] → /products/foo"
```

---

## Task 10: Lokale End-to-End Verifikation

**Files:** keine (nur Browser-Tests)

- [ ] **Step 1: Build erst mal voll testen**

```bash
cd web && bun run build
```
Erwartet: keine Errors, `dist/` enthält:
- `dist/index.html` (Grid)
- `dist/table/index.html` (Table)
- `dist/products/<slug>/index.html` × 45

Verifizieren:
```bash
ls dist/products/ | wc -l
```
Erwartet: 45 (oder 48 wenn deprecated/ als Subfolder rauskommt — beides OK)

- [ ] **Step 2: Preview-Server**

```bash
cd web && bun run preview
```
Browser → Preview-URL. Akzeptanz-Test §7 vom Spec durchgehen:

- [ ] Schritt 1 (Grid lädt mit ~45 Cards) — visuell verifizieren
- [ ] Schritt 2 (Filter Tier=1+MOC=Agents) — Cards reduziert sich auf ~6
- [ ] Schritt 3 (Klick auf MAF Card) — Detail-View öffnet
- [ ] Schritt 4 (Sidebar Related Products Link) — Navigation klappt
- [ ] Schritt 5 (URL `?tier=1&moc=Agents%20MOC` direkt) — Filter vorausgewählt
- [ ] Schritt 6 (Header Toggle Grid → Table) — Layout wechselt
- [ ] Schritt 7 (Search "Foundry") — ~10 Produkte
- [ ] Schritt 8 (Wikilink in Note ist klickbar) — Navigation klappt

- [ ] **Step 3: Mobile-Layout testen**

Browser DevTools → Mobile Viewport (z.B. iPhone 14). Cards stacken vertikal. Filter scrollt horizontal oder wraps. Detail-View Sidebar wird unter Content gestapelt (sollte mit `flex-col md:flex-row` automatisch klappen — wenn nicht: in `[slug].astro` `class="flex flex-col md:flex-row"` ergänzen).

- [ ] **Step 4: Wenn alles grün, Commit**

```bash
git add web/
git commit --allow-empty -m "test(web): local E2E acceptance test passed"
```

---

## Task 11: Cloudflare Pages Setup (manuell)

**Files:** keine (UI-Konfiguration in Cloudflare Dashboard)

Diese Schritte macht Hongyu im Cloudflare-Dashboard.

- [ ] **Step 1: Cloudflare Account anlegen** (falls nicht vorhanden)

[https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) — Free Tier reicht.

- [ ] **Step 2: Pages Project erstellen**

1. Cloudflare Dashboard → Workers & Pages → "Create" → Pages → "Connect to Git"
2. GitHub authorisieren, das Repo `hongyu-JA/ms-ai-wiki` auswählen
3. Project name: `journai-msai-wiki`
4. Production branch: `main`
5. Build settings:
   - **Framework preset**: None (Astro fehlt manchmal in der Liste)
   - **Build command**: `cd web && bun install --frozen-lockfile && bun run build`
   - **Build output directory**: `web/dist`
   - **Root directory**: leer lassen
6. Environment variables:
   - `NODE_VERSION`: `22`
7. "Save and Deploy" klicken
8. Warten ~2-3 Min auf erste Deployment

- [ ] **Step 3: Build-Log prüfen**

Wenn Build failt: meist fehlt `bun` im Cloudflare-Build-Image. Workaround:

Build command ändern auf:
```
npm install -g bun && cd web && bun install --frozen-lockfile && bun run build
```

oder ganz auf npm umstellen (Cloudflare hat npm/yarn vorinstalliert):
```
cd web && npm install && npx astro build
```

- [ ] **Step 4: Default-URL testen**

URL etwa `https://journai-msai-wiki.pages.dev` → Site lädt OHNE Auth (Pages ist by default öffentlich, das machen wir in Task 12 dicht).

⚠️ **Bis Task 12 abgeschlossen ist: URL niemandem schicken** (öffentlich zugänglich).

- [ ] **Step 5: Doku-Notiz schreiben**

Datei `web/README.md`:

```markdown
# Web Catalog

Static-Site catalog der MS_AI_Wiki Notes.

## Local Development

```bash
cd web && bun install && bun run dev
# → http://localhost:4321
```

## Build

```bash
cd web && bun run build
# → web/dist/
```

## Deployment

Cloudflare Pages auto-baut bei jedem `main`-Push.
- Production URL: <https://journai-msai-wiki.pages.dev>
- Build command: `cd web && bun install --frozen-lockfile && bun run build`
- Output: `web/dist/`

## Source of Truth

Der Inhalt kommt aus `../MS_AI_Wiki/Microsoft/{Products,MOCs}/*.md`.
Editieren weiterhin in Obsidian. `web/` liest read-only beim Build.
```

- [ ] **Step 6: Commit**

```bash
git add web/README.md
git commit -m "docs(web): README with local dev + Cloudflare deployment notes"
```

---

## Task 12: Cloudflare Access Setup (Auth gate)

**Files:** keine (UI in Cloudflare)

- [ ] **Step 1: Zero Trust Account einrichten**

Cloudflare Dashboard → Sidebar "Zero Trust" → Setup-Wizard durchklicken (Free Tier, max 50 Users — reicht).

- [ ] **Step 2: Application erstellen**

1. Zero Trust → Access → Applications → "Add an application"
2. Type: **Self-hosted**
3. Application name: `MS AI Wiki`
4. Session duration: 24 hours
5. Application domain: `journai-msai-wiki.pages.dev` (oder Custom Domain falls eingerichtet)
6. Application path: leer lassen (alle Pfade gated)
7. Identity providers: vorerst überspringen — wir nutzen "Service Auth" (Token)

- [ ] **Step 3: Policy "Service Auth Token" erstellen**

1. Im Application-Wizard → Policies → "Add a policy"
2. Policy name: `Team Access via Service Token`
3. Action: **Service Auth**
4. Configure rules → Include → "Service Token" → "Create new service token"
5. Token name: `team-access-2026-05`
6. Duration: 1 year
7. → Cloudflare zeigt einmal `CF-Access-Client-Id` + `CF-Access-Client-Secret`. **Beide kopieren** (nur einmal sichtbar).

- [ ] **Step 4: Alternative: Simpler Browser-Auth Modus**

Wenn "Service Auth" zu kompliziert: stattdessen Policy mit "Allow" Action und Rule "Email → in Liste" anlegen:
- Policy name: `Allowed emails`
- Action: Allow
- Rule: Include → Emails → `hongyu.zhou@journai.ch`, `christoph@journai.ch`, `philipp@journai.ch` (anpassen an echte Adressen)

In dem Fall müssen Christoph/Philipp bei jedem Browser-Cookie-Reset einen Magic-Link per Email anfordern. Pragmatischer als Token, weniger sicher als M365 SSO.

- [ ] **Step 5: Test im Inkognito-Browser**

URL öffnen → erwartet:
- Mit Service Auth: 403 Forbidden (ohne Header) — und mit `curl -H "CF-Access-Client-Id: ..." -H "CF-Access-Client-Secret: ..."` funktionierts
- Mit Email-Allow: Cloudflare-Login-Page → Email eintragen → Magic Link → Site

- [ ] **Step 6: Token / Auth-Info dem Team kommunizieren**

(Nicht in git, sondern via 1Password / Bitwarden / WhatsApp / persönlich)

- [ ] **Step 7: Commit doc-Update zu Auth**

`web/README.md` ergänzen:

```markdown
## Access

Geschützt durch Cloudflare Access. Auth-Modi:
- Service Token (im Team-Passwort-Manager)
- ODER Email-Allow für hongyu.zhou@journai.ch, christoph@..., philipp@...

Bei Auth-Problemen: Hongyu fragen. Migration zu M365 SSO via Entra OIDC
ist Spec-Section 9 — passiert wenn IT bereit ist eine App-Registration anzulegen.
```

```bash
git add web/README.md
git commit -m "docs(web): Cloudflare Access auth setup notes"
```

---

## Task 13: PR + Final Acceptance

- [ ] **Step 1: gitignore — node_modules + .astro**

Datei `web/.gitignore` (sollte vom Astro-Scaffold schon drin sein):

```
# Astro
dist/
.astro/
.cache/

# Node
node_modules/

# Env
.env
.env.production
```

- [ ] **Step 2: Branch umbenennen — wir sind im "spec" Branch, jetzt ist es "implementation"**

```bash
git branch -m feature/web-catalog-spec feature/web-catalog
git push -u origin feature/web-catalog
```

(Optional, kann auch im Spec-Branch bleiben — der Name macht's nicht.)

- [ ] **Step 3: PR erstellen**

GitHub → Pull Requests → New PR
- Base: main
- Compare: feature/web-catalog
- Title: `feat(web): Web Product Catalog (Sub-Project A)`
- Body:

```markdown
## Summary

Static-Site-Catalog der 45 KB-Notes mit Grid+Table View, 4 Filter-Dimensionen +
Free-Text-Search, 3-Column Detail-View. Foundation-Block der "Visual
Presentation Layer" Vision (A → D → B → C → E).

## Was neu ist

- `web/` — komplett neuer Astro-Projekt-Ordner
- 13 implementierte Tasks (siehe Plan)
- Cloudflare Pages auto-deployment connected
- Cloudflare Access "Service Auth" gate

## Verifiziert

- [x] Build succeeds (`cd web && bun run build`)
- [x] Local E2E acceptance test §7 (10 Schritte)
- [x] Cloudflare Pages: deployed und über Auth zugreifbar
- [x] Spec coverage: alle §5 Komponenten umgesetzt

## Spec + Plan

- Spec: `docs/superpowers/specs/2026-05-03-web-catalog-design.md`
- Plan: `docs/superpowers/plans/2026-05-03-web-catalog.md`

## Wie testen (für Reviewer)

1. URL: <https://journai-msai-wiki.pages.dev>
2. Auth-Token aus 1Password
3. Acceptance-Test §7 durchgehen

## Nicht in diesem PR

- B (MOC Maps) — separater PR
- C (Plain-Language Toggle) — separater PR
- D (Change-Log Digest) — separater PR
- E (Teams Bot Integration) — separater PR
- M365 SSO Migration (H3) — wenn IT App-Registration macht

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

- [ ] **Step 4: Spec-Changelog aktualisieren**

In `docs/superpowers/specs/2026-05-03-web-catalog-design.md` am Ende:

```markdown
- 2026-05-03: Implementation komplett — siehe PR #<n>. Acceptance-Test §7 grün.
```

```bash
git add docs/superpowers/specs/
git commit -m "docs(spec): mark web catalog implementation complete"
git push
```

- [ ] **Step 5: PR review → merge → finishing-a-development-branch skill**

Nach Merge: `superpowers:finishing-a-development-branch` Skill für Cleanup.

---

## Self-Review Notes

**Spec coverage:**
- §2 Ziele 1-6 → Tasks 1-13 erfüllen alle. Erfolgskriterium ("Christoph kann in 30 Sek...") ist via Acceptance-Test §7 Schritt 2-3 verifizierbar.
- §3 Non-Goals → keine Tasks, per Definition.
- §5.1 Astro Projekt-Struktur → Task 1-9 entstehen exakt diese Files.
- §5.2 Content Schema → Task 3 (Step 1).
- §5.3 Pages → Task 4 (index), Task 7 (table), Task 8 (detail).
- §5.4 Filter Schema (5 Dimensionen) → Task 5 (4 dropdown filters) + Task 6 (search). URL-state in beiden.
- §5.5 Sidebar → Task 8 (Step 1).
- §5.6 Wikilinks → Task 9.
- §6 Daten-Flow → Task 1-9 implementieren Build-Time, Task 11 Deployment, Task 12 Auth.
- §7 Acceptance Test (10 Schritte) → Task 10 (lokal) + Task 13 (live).
- §8 Risiken → mitigations integriert (z.B. Task 3 zod `.optional()`, Task 9 wikilink-fallback).
- §9 H3 Migration-Pfad → in Task 12 Step 7 dokumentiert.

**Placeholder scan:** keine "TBD/TODO/implement later" gefunden. Alle Code-Blöcke vollständig.

**Type consistency:**
- `Product` type definiert in Task 3 → genutzt in Task 4, 8.
- `FilterState` interface in Task 5 → genutzt in Task 6, 7.
- `ProductData` interface in Task 5 → identisch verwendet in Task 7 (TableClient).
- Slug-Berechnung (`lowercase + spaces→-`) konsistent in Task 3 (load-products), Task 9 (wikilinks).
