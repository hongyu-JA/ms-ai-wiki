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

async function main() {
  const products = loadProducts();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const filtered: FilteredItem[] = JSON.parse(fs.readFileSync(STATE_FILTERED, "utf8"));
  const systemPrompt = loadSystemPrompt();
  const userTemplate = fs.readFileSync(PROMPT_USER_TEMPLATE, "utf8");

  const envelopes: PatchEnvelope[] = [];

  for (const fi of filtered) {
    const product = bySlug.get(fi.product_slug) ?? null;
    let notePath: string | null = null;
    let frontmatterYaml = "";
    let relevantSectionsText = "";

    if (product) {
      notePath = findProductNote(product.note);
      if (notePath) {
        const parsed = parseNote(notePath);
        frontmatterYaml = JSON.stringify(parsed.frontmatter, null, 2);
        const snippets = product.changelog_trigger_sections
          .map((title) => {
            const body = getSectionBody(parsed.body, title);
            return body ? `### ${title}\n${body.slice(0, 2000)}` : `### ${title}\n(leer)`;
          })
          .join("\n\n");
        relevantSectionsText = snippets;
      } else {
        console.warn(`[patch] note not found: ${product.note} — skipping`);
        continue;
      }
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

    const decision = await askClaudeForPatch(systemPrompt, userPrompt, {
      productSlug: fi.product_slug,
      sourceId: fi.item.source_id,
      itemTitle: fi.item.title,
      itemLink: fi.item.link,
    });

    envelopes.push({
      filtered: fi,
      product,
      note_path: notePath,
      decision,
    });
  }

  fs.writeFileSync(STATE_PATCHES, JSON.stringify(envelopes, null, 2));
  console.log(`[patch] wrote ${envelopes.length} patches → ${STATE_PATCHES}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
