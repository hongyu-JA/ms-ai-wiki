/**
 * Stage 1 — Filter (lokal, 0 Token)
 *
 * Kombiniert RawItems mit products.yaml. Entscheidet pro Item:
 *  1. Ist das Item schon in seen-items.json? → skip
 *  2. Hat sich der Hash ggü. feed-hashes.json geändert? → keep
 *  3. Matcht das Item die keywords eines Produkts (und kein regex_exclude)?
 *  4. Liegt die letzte Sync für dieses Produkt länger als watchFrequencyDays zurück?
 * Nur wenn alle vier „ja" geliefert wird, kommt das Item in filtered-items.json.
 *
 * Ein Item kann mehrere Produkte matchen; für jede Kombination wird ein
 * FilteredItem erzeugt.
 */
import fs from "node:fs";
import { loadProducts, watchFrequencyDays, type Product } from "./lib/config.js";
import type { RawItem } from "./lib/feeds.js";
import {
  STATE_RAW_ITEMS,
  STATE_FILTERED,
  STATE_SEEN,
  STATE_HASHES,
} from "./lib/paths.js";

export interface FilteredItem {
  product_slug: string;
  item: RawItem;
  matched_keywords: string[];
  variant: "update" | "new_product_candidate" | "deprecation_candidate";
}

// Obergrenze pro Produkt pro Lauf. Verhindert, dass der erste Run 30+ historische
// Release-Notes in ein einziges Note-Changelog kippt. Env-var `MAX_ITEMS_PER_PRODUCT`
// überschreibt den Default.
const MAX_PER_PRODUCT = Number(process.env.MAX_ITEMS_PER_PRODUCT ?? 5);

function readJson<T>(p: string, fallback: T): T {
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, "utf8")) as T;
}

function haystack(item: RawItem): string {
  return `${item.title}\n${item.summary}`.toLowerCase();
}

/**
 * Kurze, wortähnliche Keywords (<=4 Zeichen, kein Leerzeichen) werden per
 * Wortgrenzen-Regex gematcht, um False-Positives durch Substring-Hits zu
 * vermeiden (z. B. "SK" in "task", "MAF" in "Mafia").
 * Längere Keywords werden weiter als Substring gematcht (normaler Titel-
 * /Summary-Scan), weil bei Produktnamen wie "Copilot Studio" Wortgrenzen
 * irrelevant sind.
 */
function keywordMatches(hay: string, kw: string): boolean {
  const lower = kw.toLowerCase();
  const isShortToken = lower.length <= 4 && !/\s/.test(lower);
  if (!isShortToken) {
    return hay.includes(lower);
  }
  // Wortgrenzen: links Non-Word oder Start, rechts Non-Word oder Ende
  const escaped = lower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`);
  return re.test(hay);
}

function matchesProduct(item: RawItem, p: Product): { matched: string[]; excluded: boolean } {
  const hay = haystack(item);
  const matched: string[] = [];
  for (const kw of p.keywords) {
    if (keywordMatches(hay, kw)) matched.push(kw);
  }
  if (matched.length === 0) return { matched, excluded: false };
  for (const rex of p.regex_exclude ?? []) {
    try {
      if (new RegExp(rex, "i").test(item.title + "\n" + item.summary)) {
        return { matched, excluded: true };
      }
    } catch {
      /* broken regex → ignore exclude */
    }
  }
  return { matched, excluded: false };
}

function isDeprecationSignal(item: RawItem): boolean {
  const hay = haystack(item);
  return (
    hay.includes("deprecated") ||
    hay.includes("retirement") ||
    hay.includes("end of support") ||
    hay.includes("eos") ||
    hay.includes("retiring")
  );
}

function daysBetween(a: string, b: string): number {
  return Math.abs((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

function main() {
  const products = loadProducts();
  const raw = readJson<RawItem[]>(STATE_RAW_ITEMS, []);
  const seen = readJson<Record<string, string>>(STATE_SEEN, {});
  const hashes = readJson<Record<string, string>>(STATE_HASHES, {});
  const today = new Date().toISOString().slice(0, 10);

  const filtered: FilteredItem[] = [];
  const nextSeen = { ...seen };
  const nextHashes = { ...hashes };

  let skippedSeen = 0;
  let skippedNoMatch = 0;
  let skippedFrequency = 0;

  for (const item of raw) {
    const seenKey = `${item.source_id}::${item.item_id}`;
    const lastHash = hashes[seenKey];
    const isNewOrChanged = lastHash !== item.raw_hash;
    nextHashes[seenKey] = item.raw_hash;

    if (!isNewOrChanged) {
      skippedSeen++;
      continue;
    }

    let matchedAny = false;
    for (const p of products) {
      const { matched, excluded } = matchesProduct(item, p);
      if (matched.length === 0 || excluded) continue;
      matchedAny = true;

      // watch-frequency window — wenn last_seen gesetzt und Fenster noch nicht
      // abgelaufen, behandle es dennoch, weil ein „neues" Item selbst das Signal
      // ist; die Frequenz-Drosselung greift bei Null-Events (kein Fetch-Trigger).
      const days = p.last_seen ? daysBetween(p.last_seen, today) : Infinity;
      const window = watchFrequencyDays(p.watch);
      if (days < window && !isNewOrChanged) {
        skippedFrequency++;
        continue;
      }

      filtered.push({
        product_slug: p.slug,
        item,
        matched_keywords: matched,
        variant: isDeprecationSignal(item) ? "deprecation_candidate" : "update",
      });
      nextSeen[seenKey] = today;
    }

    if (!matchedAny) {
      const hay = haystack(item);
      const isInbox = item.source_id.startsWith("inbox/");

      // MS-AI-Heuristik: vermerken wenn es nach Microsoft-AI-Umfeld aussieht.
      const msAiSignal =
        hay.includes("microsoft") &&
        (hay.includes("agent") ||
          hay.includes("copilot") ||
          hay.includes("foundry") ||
          hay.includes("azure ai") ||
          hay.includes("entra") ||
          hay.includes("purview"));

      if (msAiSignal) {
        filtered.push({
          product_slug: "__new_candidate__",
          item,
          matched_keywords: [],
          variant: "new_product_candidate",
        });
      } else if (isInbox) {
        // Inbox-Items ohne MS-AI-Signal: als Nicht-Treffer markieren, damit
        // apply.ts die Datei später nach `_Inbox/_rejected/` verschieben kann.
        // Wir tragen sie als special-variant ein — Claude wird nicht aufgerufen.
        filtered.push({
          product_slug: "__inbox_rejected__",
          item,
          matched_keywords: [],
          variant: "new_product_candidate",
        });
      } else {
        skippedNoMatch++;
      }
      nextSeen[seenKey] = today;
    }
  }

  // Pro Produkt auf MAX_PER_PRODUCT kappen — neueste zuerst.
  const capped: FilteredItem[] = [];
  const byProduct = new Map<string, FilteredItem[]>();
  for (const fi of filtered) {
    const bucket = byProduct.get(fi.product_slug) ?? [];
    bucket.push(fi);
    byProduct.set(fi.product_slug, bucket);
  }
  let capDropped = 0;
  for (const [, bucket] of byProduct) {
    bucket.sort((a, b) => {
      const da = a.item.published ? Date.parse(a.item.published) : 0;
      const db = b.item.published ? Date.parse(b.item.published) : 0;
      return db - da;
    });
    capped.push(...bucket.slice(0, MAX_PER_PRODUCT));
    if (bucket.length > MAX_PER_PRODUCT) capDropped += bucket.length - MAX_PER_PRODUCT;
  }

  fs.writeFileSync(STATE_FILTERED, JSON.stringify(capped, null, 2));
  fs.writeFileSync(STATE_SEEN, JSON.stringify(nextSeen, null, 2));
  fs.writeFileSync(STATE_HASHES, JSON.stringify(nextHashes, null, 2));

  console.log(
    `[filter] raw=${raw.length}, filtered=${capped.length} (${capDropped} gekappt auf max ${MAX_PER_PRODUCT}/Produkt), seen-dup=${skippedSeen}, no-match=${skippedNoMatch}, freq-skipped=${skippedFrequency}`,
  );
}

main();
