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

function readJson<T>(p: string, fallback: T): T {
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, "utf8")) as T;
}

function haystack(item: RawItem): string {
  return `${item.title}\n${item.summary}`.toLowerCase();
}

function matchesProduct(item: RawItem, p: Product): { matched: string[]; excluded: boolean } {
  const hay = haystack(item);
  const matched: string[] = [];
  for (const kw of p.keywords) {
    if (hay.includes(kw.toLowerCase())) matched.push(kw);
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
      // potenzieller new-product Kandidat — einfache Heuristik
      const hay = haystack(item);
      const meta =
        hay.includes("microsoft") &&
        (hay.includes("agent") || hay.includes("copilot") || hay.includes("foundry"));
      if (meta) {
        filtered.push({
          product_slug: "__new_candidate__",
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

  fs.writeFileSync(STATE_FILTERED, JSON.stringify(filtered, null, 2));
  fs.writeFileSync(STATE_SEEN, JSON.stringify(nextSeen, null, 2));
  fs.writeFileSync(STATE_HASHES, JSON.stringify(nextHashes, null, 2));

  console.log(
    `[filter] raw=${raw.length}, filtered=${filtered.length}, seen-dup=${skippedSeen}, no-match=${skippedNoMatch}, freq-skipped=${skippedFrequency}`,
  );
}

main();
