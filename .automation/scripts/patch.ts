/**
 * Stage 2 — Claude-Patcher
 *
 * Liest state/filtered-items.json. Für jedes Item:
 *   - Lädt Target-Note (frontmatter + changelog_trigger_sections)
 *   - Baut User-Prompt (template), system-prompt wird gecached
 *   - Ruft Claude (oder Dry-Run-Stub) auf
 *   - Schreibt PatchEnvelope nach state/patches.json
 *
 * Wichtig: Dieser Schritt ändert KEINE Vault-Dateien. Das macht apply.ts.
 */
import fs from "node:fs";
import { loadProducts, type Product } from "./lib/config.js";
import type { RawItem } from "./lib/feeds.js";
import {
  STATE_FILTERED,
  STATE_PATCHES,
  PROMPT_USER_TEMPLATE,
} from "./lib/paths.js";
import {
  findProductNote,
  parseNote,
  getSectionBody,
} from "./lib/obsidian.js";
import { askClaudeForPatch, loadSystemPrompt, type PatchDecision } from "./lib/claude.js";

interface FilteredItem {
  product_slug: string;
  item: RawItem;
  matched_keywords: string[];
  variant: "update" | "new_product_candidate" | "deprecation_candidate";
}

interface PatchEnvelope {
  filtered: FilteredItem;
  product: Product | null;
  note_path: string | null;
  decision: PatchDecision;
}

function renderUser(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? "");
}

function templateSectionTitles(): string[] {
  return [
    "Elevator Pitch + Analogie",
    "Einsatz",
    "Status & Pricing",
    "Kernkonzept",
    "Limitierungen & Fallstricke",
    "Offizielle Referenzen & Monitoring",
    "Changelog",
    "Integrationen",
    "Security & Compliance",
    "Abgrenzung & Wettbewerb",
  ];
}

const CONCURRENCY = Number(process.env.PATCH_CONCURRENCY ?? 4);

async function processOne(
  fi: FilteredItem,
  i: number,
  total: number,
  products: Map<string, Product>,
  systemPrompt: string,
  userTemplate: string,
): Promise<PatchEnvelope | null> {
  const product = products.get(fi.product_slug) ?? null;
  let notePath: string | null = null;
  let frontmatterYaml = "";
  let relevantSectionsText = "";

  if (product) {
    notePath = findProductNote(product.note);
    if (!notePath) {
      console.warn(`[patch] (${i}/${total}) note not found: ${product.note} — skipping`);
      return null;
    }
    const parsed = parseNote(notePath);
    frontmatterYaml = JSON.stringify(parsed.frontmatter, null, 2);
    relevantSectionsText = product.changelog_trigger_sections
      .map((title) => {
        const body = getSectionBody(parsed.body, title);
        return body ? `### ${title}\n${body.slice(0, 2000)}` : `### ${title}\n(leer)`;
      })
      .join("\n\n");
  }

  const userPrompt = renderUser(userTemplate, {
    variant: fi.variant,
    source_id: fi.item.source_id,
    source_url: fi.item.source_url,
    product_slug: fi.product_slug,
    matched_keywords: fi.matched_keywords.join(", "),
    feed_title: fi.item.title,
    feed_summary: fi.item.summary,
    feed_published: fi.item.published ?? "",
    feed_link: fi.item.link,
    note_frontmatter: frontmatterYaml,
    relevant_sections_text: relevantSectionsText,
    template_section_titles: templateSectionTitles().join(", "),
  });

  const start = Date.now();
  console.log(
    `[patch] (${i}/${total}) → claude: ${fi.product_slug} · ${fi.item.title.slice(0, 60)}`,
  );
  try {
    const decision = await askClaudeForPatch(systemPrompt, userPrompt, {
      productSlug: fi.product_slug,
      sourceId: fi.item.source_id,
      itemTitle: fi.item.title,
      itemLink: fi.item.link,
    });
    const ms = Date.now() - start;
    console.log(
      `[patch] (${i}/${total}) ✓ ${decision.decision} (${decision.confidence}) in ${ms}ms`,
    );
    return { filtered: fi, product, note_path: notePath, decision };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn(`[patch] (${i}/${total}) ✗ ${msg}`);
    return null;
  }
}

async function runInParallel<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, idx: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  let cursor = 0;
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (true) {
      const idx = cursor++;
      if (idx >= items.length) return;
      const r = await fn(items[idx]!, idx);
      results.push(r);
    }
  });
  await Promise.all(workers);
  return results;
}

async function main() {
  const products = loadProducts();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const filtered: FilteredItem[] = JSON.parse(fs.readFileSync(STATE_FILTERED, "utf8"));
  const systemPrompt = loadSystemPrompt();
  const userTemplate = fs.readFileSync(PROMPT_USER_TEMPLATE, "utf8");

  console.log(
    `[patch] starting ${filtered.length} items · concurrency=${CONCURRENCY} · model=${
      process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6"
    } · dry_run=${process.env.DRY_RUN === "1" || !process.env.ANTHROPIC_API_KEY}`,
  );

  const total = filtered.length;
  const raw = await runInParallel(filtered, CONCURRENCY, (fi, i) =>
    processOne(fi, i + 1, total, bySlug, systemPrompt, userTemplate),
  );
  const envelopes = raw.filter((e): e is PatchEnvelope => e !== null);

  fs.writeFileSync(STATE_PATCHES, JSON.stringify(envelopes, null, 2));
  console.log(
    `[patch] wrote ${envelopes.length}/${total} patches → ${STATE_PATCHES}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
