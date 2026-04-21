/**
 * Stage 0 — Fetcher
 *
 * Lädt alle aktivierten Quellen aus sources.yaml, parst sie in ein
 * einheitliches RawItem-Schema und schreibt sie in state/raw-items.json.
 *
 * Fehler einzelner Quellen werden geloggt, blockieren den Lauf aber nicht.
 */
import fs from "node:fs";
import { loadSources } from "./lib/config.js";
import { fetchSource, type RawItem } from "./lib/feeds.js";
import { STATE_RAW_ITEMS, STATE_LAST_RUN } from "./lib/paths.js";

async function main() {
  const sources = loadSources();
  const all: RawItem[] = [];
  const counts: Record<string, number> = {};
  const errors: Array<{ source: string; error: string }> = [];

  for (const s of sources) {
    try {
      const items = await fetchSource(s);
      counts[s.id] = items.length;
      all.push(...items);
      console.log(`[fetch] ${s.id}: ${items.length} items`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push({ source: s.id, error: msg });
      counts[s.id] = -1;
      console.warn(`[fetch] ${s.id} FAILED: ${msg}`);
    }
  }

  fs.writeFileSync(STATE_RAW_ITEMS, JSON.stringify(all, null, 2));
  fs.writeFileSync(
    STATE_LAST_RUN,
    JSON.stringify(
      {
        last_run_utc: new Date().toISOString(),
        counts,
        errors,
      },
      null,
      2,
    ),
  );
  console.log(`[fetch] wrote ${all.length} items total → ${STATE_RAW_ITEMS}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
