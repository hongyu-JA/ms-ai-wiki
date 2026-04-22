/**
 * Stage 4 — Index-Rebuild
 *
 * Scannt alle Produkt-Notes und aktualisiert:
 *   1. „Stand der Wissensbasis" in Microsoft MOC.md (Kennzahl-Tabelle)
 *   2. „Research-Status pro Produkt" in Microsoft MOC.md (neue Sektion,
 *      alphabetische Liste aller Products mit Depth-Indikator)
 *
 * Heuristik für Depth:
 *   - Changelog-Sektion enthält „Deep-Research" → deep
 *   - sonst → stub (wenn Datei existiert) / missing (wenn nicht)
 *
 * Beide Sektionen werden zwischen AUTO-INDEX-START/END-Markern gepflegt.
 * Wenn Marker fehlen, werden sie beim ersten Lauf automatisch eingefügt.
 *
 * Läuft am Ende von apply.ts automatisch. Kann auch standalone aufgerufen
 * werden:
 *   bun run scripts/update-indices.ts
 *   (oder npx tsx scripts/update-indices.ts)
 */
import fs from "node:fs";
import path from "node:path";
import { loadAllProducts, type Product } from "./lib/config.js";
import {
  PRODUCTS_DIR,
  DEPRECATED_DIR,
  MOCS_DIR,
  MICROSOFT_MOC,
} from "./lib/paths.js";

interface ProductStatus {
  slug: string;
  note: string;
  tier: 1 | 2 | 3;
  watch: string;
  primary_home_moc: string;
  is_deprecated: boolean;
  exists: boolean;
  depth: "stub" | "deep" | "missing";
}

function detectDepth(filePath: string): "stub" | "deep" {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // 1. Explizite Override per Frontmatter `research_depth: deep | stub`
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (fmMatch) {
      const depthLine = fmMatch[1]!.match(/^research_depth:\s*(deep|stub)\s*$/m);
      if (depthLine) return depthLine[1] as "stub" | "deep";
    }

    // 2. Heuristik: Changelog-Sektion enthält „Deep-Research" (unser Merge-Marker)
    const changelogStart = content.search(/^##[^#][^\n]*Changelog/m);
    if (changelogStart < 0) return "stub";
    const changelog = content.slice(changelogStart);
    if (/Deep-Research/i.test(changelog)) return "deep";

    // 3. Fallback-Heuristik: lange Note (>10 KB Body) mit >= 3 Changelog-Zeilen
    // fängt Edge-Cases wie MAF auf, wo „Deep-Research" im Changelog fehlt,
    // die Note aber inhaltlich fertig ist.
    const bodyLength = content.length - (fmMatch ? fmMatch[0].length : 0);
    const changelogRowCount = (
      changelog.match(/^\|\s*20\d{2}-\d{2}-\d{2}\s*\|/gm) || []
    ).length;
    if (bodyLength >= 10000 && changelogRowCount >= 3) return "deep";

    return "stub";
  } catch {
    return "stub";
  }
}

interface ActivityEntry {
  date: string; // YYYY-MM-DD
  product_slug: string;
  product_link: string;
  author: string;
  change: string;
  source: string;
}

/**
 * Extrahiert die Changelog-Zeilen aller Product-Notes der Form
 *   | YYYY-MM-DD | author | change | source |
 * und gibt sie sortiert nach Datum (neueste zuerst) zurück.
 * Optional auf die letzten `lookbackDays` Tage eingegrenzt.
 *
 * Mit `mocFilter` werden nur Products berücksichtigt, deren
 * primary_home_moc === mocFilter ist. So bekommt jede Primary-Home-MOC
 * ihre eigene gefilterte Aktivitäts-Ansicht.
 */
function collectRecentActivity(
  lookbackDays = 30,
  limit = 20,
  mocFilter?: string,
): ActivityEntry[] {
  const all = loadAllProducts();
  const products = mocFilter
    ? all.filter((p) => p.primary_home_moc === mocFilter)
    : all;
  const today = new Date();
  const cutoff = new Date(today.getTime() - lookbackDays * 86400_000)
    .toISOString()
    .slice(0, 10);

  const entries: ActivityEntry[] = [];
  for (const p of products) {
    const filePath = path.join(PRODUCTS_DIR, p.note);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, "utf8");
    const changelogStart = content.search(/^##[^#][^\n]*Changelog/m);
    if (changelogStart < 0) continue;
    const changelog = content.slice(changelogStart);

    // Regex: Tabellen-Zeile mit Datum in Spalte 1
    const rowRe =
      /^\|\s*(20\d{2}-\d{2}-\d{2})\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|\s*$/gm;
    let m: RegExpExecArray | null;
    while ((m = rowRe.exec(changelog)) !== null) {
      const [, date, author, change, source] = m;
      if (date! < cutoff) continue;
      const noteLink = `[[${p.note.replace(/\.md$/, "")}]]`;
      entries.push({
        date: date!,
        product_slug: p.slug,
        product_link: noteLink,
        author: author!.trim(),
        change: change!.trim(),
        source: source!.trim(),
      });
    }
  }
  // Sortierung: Datum desc → auto-sync-Einträge zuerst (Automation-Aktivität
  // sichtbar machen) → Produkt-Slug asc.
  entries.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    const aAuto = /auto-sync/i.test(a.author) ? 0 : 1;
    const bAuto = /auto-sync/i.test(b.author) ? 0 : 1;
    if (aAuto !== bAuto) return aAuto - bAuto;
    return a.product_slug.localeCompare(b.product_slug);
  });
  return entries.slice(0, limit);
}

function buildActivityTable(entries: ActivityEntry[]): string {
  if (entries.length === 0) {
    return "_Keine Changelog-Einträge in den letzten 30 Tagen._";
  }
  const rows = entries.map((e) => {
    // Änderung auf ~120 Zeichen kappen, lange Links raus-kürzen
    let change = e.change.replace(/\s+/g, " ");
    if (change.length > 140) change = change.slice(0, 137) + "…";
    return `| ${e.date} | ${e.product_link} | ${change} | ${e.author} |`;
  });
  return [
    "| Datum | Produkt | Änderung | Autor |",
    "| ----- | ------- | -------- | ----- |",
    ...rows,
  ].join("\n");
}

function scanAllProducts(): ProductStatus[] {
  const products = loadAllProducts();
  return products.map((p: Product) => {
    const is_deprecated = p.note.startsWith("deprecated/");
    const filePath = path.join(PRODUCTS_DIR, p.note);
    const exists = fs.existsSync(filePath);
    const depth: "stub" | "deep" | "missing" = exists
      ? detectDepth(filePath)
      : "missing";
    return {
      slug: p.slug,
      note: p.note,
      tier: p.tier,
      watch: p.watch,
      primary_home_moc: p.primary_home_moc,
      is_deprecated,
      exists,
      depth,
    };
  });
}

function countMocFiles(): { total: number; primary: number; lens: number; commercial: number } {
  const files = fs.readdirSync(MOCS_DIR).filter((f) => f.endsWith(".md"));
  // Grobe Klassifikation nach Dateinamen
  let primary = 0;
  let lens = 0;
  let commercial = 0;
  for (const f of files) {
    const low = f.toLowerCase();
    if (low.includes("pattern moc")) lens++;
    else if (low.includes("licensing")) commercial++;
    else primary++;
  }
  // +1 für Root Microsoft MOC selbst
  return { total: files.length + 1, primary, lens, commercial };
}

function buildStandTable(products: ProductStatus[]): string {
  const today = new Date().toISOString().slice(0, 10);
  const tier1 = products.filter((p) => p.tier === 1 && !p.is_deprecated);
  const tier2 = products.filter((p) => p.tier === 2 && !p.is_deprecated);
  const tier3 = products.filter((p) => p.tier === 3 && !p.is_deprecated);
  const deprecated = products.filter((p) => p.is_deprecated);

  const t1Deep = tier1.filter((p) => p.depth === "deep").length;
  const t1Stub = tier1.filter((p) => p.depth === "stub").length;
  const t2Deep = tier2.filter((p) => p.depth === "deep").length;
  const t2Stub = tier2.filter((p) => p.depth === "stub").length;
  const t3Deep = tier3.filter((p) => p.depth === "deep").length;
  const t3Stub = tier3.filter((p) => p.depth === "stub").length;
  const depDeep = deprecated.filter((p) => p.depth === "deep").length;
  const depStub = deprecated.filter((p) => p.depth === "stub").length;

  const mocCounts = countMocFiles();

  return [
    "| Kennzahl | Wert |",
    "| -------- | ---- |",
    `| Tier-1 Notes | **${t1Deep} deep** · ${t1Stub} stub · total ${tier1.length} |`,
    `| Tier-2 Notes | **${t2Deep} deep** · ${t2Stub} stub · total ${tier2.length} |`,
    `| Tier-3 Notes | **${t3Deep} deep** · ${t3Stub} stub · total ${tier3.length} |`,
    `| Deprecated Notes | **${depDeep} deep** · ${depStub} stub · total ${deprecated.length} |`,
    `| MOCs insgesamt | ${mocCounts.total} (Root + ${mocCounts.primary} Primary + ${mocCounts.lens} Lens + ${mocCounts.commercial} Commercial) |`,
    "| Automation-Pipeline | läuft seit 2026-04-21 (siehe README) |",
    `| Letzter Index-Rebuild | ${today} (automatisch durch apply.ts) |`,
  ].join("\n");
}

function buildResearchStatusTable(products: ProductStatus[]): string {
  // Sort: Tier asc · Depth (deep first) · Slug asc
  const sorted = [...products].sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    const depthOrder = { deep: 0, stub: 1, missing: 2 };
    if (a.depth !== b.depth) return depthOrder[a.depth] - depthOrder[b.depth];
    return a.slug.localeCompare(b.slug);
  });

  const rows = sorted.map((p) => {
    // Note-Link: "deprecated/X.md" → [[deprecated/X]], sonst [[X]]
    const noteLink = `[[${p.note.replace(/\.md$/, "")}]]`;
    const depthIcon = p.depth === "deep" ? "🟢" : p.exists ? "🟡" : "🔴";
    const depthText = p.depth === "deep" ? "deep" : p.exists ? "stub" : "missing";
    const tierLabel = p.is_deprecated ? `T${p.tier} · 🔻` : `T${p.tier}`;
    return `| ${depthIcon} ${depthText} | ${tierLabel} | ${p.watch} | ${noteLink} | ${p.primary_home_moc} |`;
  });

  return [
    "| Depth | Tier | Watch | Note | Primary Home MOC |",
    "| ----- | ---- | ----- | ---- | ---------------- |",
    ...rows,
  ].join("\n");
}

function injectOrReplaceMarker(
  content: string,
  markerId: string,
  replacement: string,
  fallbackInsertBefore?: RegExp,
): string {
  const reMarker = new RegExp(
    `<!-- AUTO-INDEX-START: ${markerId} -->[\\s\\S]*?<!-- AUTO-INDEX-END: ${markerId} -->`,
  );
  const newBlock = `<!-- AUTO-INDEX-START: ${markerId} -->\n\n${replacement}\n\n<!-- AUTO-INDEX-END: ${markerId} -->`;

  if (reMarker.test(content)) {
    return content.replace(reMarker, newBlock);
  }
  // Fallback: Marker fehlt — einfügen vor dem fallbackInsertBefore-Match,
  // oder am Ende der Datei.
  if (fallbackInsertBefore && fallbackInsertBefore.test(content)) {
    return content.replace(fallbackInsertBefore, `${newBlock}\n\n$&`);
  }
  return content.trimEnd() + `\n\n${newBlock}\n`;
}

function updateRootMoc() {
  const products = scanAllProducts();
  let content = fs.readFileSync(MICROSOFT_MOC, "utf8");

  const standTable = buildStandTable(products);
  const researchTable = buildResearchStatusTable(products);

  // 1. "Stand der Wissensbasis" — Marker direkt nach dem Sektions-Header
  //    einfügen bzw. Tabelle zwischen Markern ersetzen.
  if (!/<!-- AUTO-INDEX-START: stand -->/.test(content)) {
    // Sektion existiert bereits händisch → alten Inhalt durch Marker + Tabelle ersetzen
    content = content.replace(
      /(## Stand der Wissensbasis\s*\n(?:> [^\n]*\n)?\s*\n)([\s\S]*?)(?=\n## |\n---\s*$)/,
      (_match, header: string) => {
        return `${header}<!-- AUTO-INDEX-START: stand -->\n\n${standTable}\n\n<!-- AUTO-INDEX-END: stand -->\n\n`;
      },
    );
    // Falls die Regex oben nicht gematcht hat (z. B. weil Sektion fehlt):
    // anhängen vor "## Querverweise" oder am Ende.
    if (!/<!-- AUTO-INDEX-START: stand -->/.test(content)) {
      const append = `\n## Stand der Wissensbasis\n\n<!-- AUTO-INDEX-START: stand -->\n\n${standTable}\n\n<!-- AUTO-INDEX-END: stand -->\n`;
      content = content.trimEnd() + append;
    }
  } else {
    content = injectOrReplaceMarker(content, "stand", standTable);
  }

  // 2. "Research-Status pro Produkt" — komplett neue Sektion, direkt unterhalb
  //    der Stand-Tabelle. Einfügen beim ersten Lauf.
  if (!/<!-- AUTO-INDEX-START: research-status -->/.test(content)) {
    const endMarker = "<!-- AUTO-INDEX-END: stand -->";
    const idx = content.indexOf(endMarker);
    if (idx >= 0) {
      const insertAt = idx + endMarker.length;
      const block = `\n\n## Research-Status pro Produkt\n\n<!-- AUTO-INDEX-START: research-status -->\n\n${researchTable}\n\n<!-- AUTO-INDEX-END: research-status -->`;
      content = content.slice(0, insertAt) + block + content.slice(insertAt);
    }
  } else {
    content = injectOrReplaceMarker(content, "research-status", researchTable);
  }

  // 3. "Letzte Aktivität" — zeigt die jüngsten Changelog-Einträge aller Products
  //    der letzten 30 Tage. Macht sichtbar dass der Sync wirklich etwas getan
  //    hat, selbst wenn die Kennzahlen-Tabelle unverändert bleibt.
  const activity = collectRecentActivity(30, 30);
  const activityTable = buildActivityTable(activity);
  if (!/<!-- AUTO-INDEX-START: activity -->/.test(content)) {
    const endMarker = "<!-- AUTO-INDEX-END: research-status -->";
    const idx = content.indexOf(endMarker);
    if (idx >= 0) {
      const insertAt = idx + endMarker.length;
      const block = `\n\n## Letzte Aktivität\n\n_Jüngste Changelog-Einträge der letzten 30 Tage aus allen Product-Notes. Auto-generiert._\n\n<!-- AUTO-INDEX-START: activity -->\n\n${activityTable}\n\n<!-- AUTO-INDEX-END: activity -->`;
      content = content.slice(0, insertAt) + block + content.slice(insertAt);
    }
  } else {
    content = injectOrReplaceMarker(content, "activity", activityTable);
  }

  fs.writeFileSync(MICROSOFT_MOC, content);

  // Zusammenfassung loggen
  const counts = {
    tier1: products.filter((p) => p.tier === 1 && !p.is_deprecated).length,
    tier2: products.filter((p) => p.tier === 2 && !p.is_deprecated).length,
    tier3: products.filter((p) => p.tier === 3 && !p.is_deprecated).length,
    deprecated: products.filter((p) => p.is_deprecated).length,
    deep: products.filter((p) => p.depth === "deep").length,
    stub: products.filter((p) => p.depth === "stub").length,
    missing: products.filter((p) => p.depth === "missing").length,
  };
  console.log(
    `[update-indices] Root-MOC aktualisiert — T1:${counts.tier1} T2:${counts.tier2} T3:${counts.tier3} depr:${counts.deprecated} · depth: ${counts.deep} deep / ${counts.stub} stub / ${counts.missing} missing`,
  );
}

function buildProdukteInMocTable(products: ProductStatus[], originals: Product[]): string {
  // Sort: non-deprecated first → tier asc → watch (close<standard<passive) → slug asc
  const watchOrder: Record<string, number> = { close: 0, standard: 1, passive: 2 };
  const origBySlug = new Map(originals.map((o) => [o.slug, o]));
  const sorted = [...products].sort((a, b) => {
    if (a.is_deprecated !== b.is_deprecated) return a.is_deprecated ? 1 : -1;
    if (a.tier !== b.tier) return a.tier - b.tier;
    const wa = watchOrder[a.watch] ?? 3;
    const wb = watchOrder[b.watch] ?? 3;
    if (wa !== wb) return wa - wb;
    return a.slug.localeCompare(b.slug);
  });

  const rows = sorted.map((p) => {
    const noteLink = `[[${p.note.replace(/\.md$/, "")}]]`;
    const icon = p.depth === "deep" ? "🟢" : p.exists ? "🟡" : "🔴";
    const tierLabel = p.is_deprecated ? `T${p.tier} · 🔻` : `T${p.tier}`;
    const tagline = origBySlug.get(p.slug)?.tagline ?? "—";
    return `| ${icon} ${noteLink} | ${tagline} | ${tierLabel} | ${p.watch} |`;
  });

  return [
    "| Produkt | Was es ist (1 Satz) | Tier | Watch |",
    "| ------- | ------------------- | ---- | ----- |",
    ...rows,
  ].join("\n");
}

function updatePrimaryHomeMocs(): void {
  const originals = loadAllProducts();
  const products = scanAllProducts();

  // Gruppieren nach primary_home_moc
  const byMoc = new Map<string, ProductStatus[]>();
  for (const p of products) {
    if (!byMoc.has(p.primary_home_moc)) byMoc.set(p.primary_home_moc, []);
    byMoc.get(p.primary_home_moc)!.push(p);
  }

  let touched = 0;
  for (const [mocName, ps] of byMoc) {
    const mocPath = path.join(MOCS_DIR, `${mocName}.md`);
    if (!fs.existsSync(mocPath)) {
      console.warn(`[update-indices] MOC fehlt: ${mocName}`);
      continue;
    }
    const table = buildProdukteInMocTable(ps, originals);
    let content = fs.readFileSync(mocPath, "utf8");

    if (!/<!-- AUTO-INDEX-START: produkte -->/.test(content)) {
      // Erste Migration: existierende handgepflegte "Produkte in dieser MOC"-Sektion
      // (mit oder ohne H3-Sub-Tables) durch Marker + Auto-Tabelle ersetzen.
      // Wir matchen vom "## Produkte in dieser MOC"-Header bis zum nächsten
      // H2-Header oder "---"-Trenner.
      const re = /(## Produkte in dieser MOC\s*\n)([\s\S]*?)(?=\n## |\n---\s*\n)/;
      if (re.test(content)) {
        content = content.replace(
          re,
          (_m, header: string) =>
            `${header}\n<!-- AUTO-INDEX-START: produkte -->\n\n${table}\n\n<!-- AUTO-INDEX-END: produkte -->\n`,
        );
      } else {
        // Fallback: Sektion nicht gefunden → am Ende anhängen
        content =
          content.trimEnd() +
          `\n\n## Produkte in dieser MOC\n\n<!-- AUTO-INDEX-START: produkte -->\n\n${table}\n\n<!-- AUTO-INDEX-END: produkte -->\n`;
      }
    } else {
      content = injectOrReplaceMarker(content, "produkte", table);
    }

    // MOC-gefilterte Aktivitäts-Sektion: nur Changelog-Einträge von Products
    // deren primary_home_moc dieser MOC ist.
    const mocActivity = collectRecentActivity(30, 15, mocName);
    const mocActivityTable = buildActivityTable(mocActivity);
    if (!/<!-- AUTO-INDEX-START: activity -->/.test(content)) {
      // Einfügen direkt nach AUTO-INDEX-END: produkte
      const endMarker = "<!-- AUTO-INDEX-END: produkte -->";
      const idx = content.indexOf(endMarker);
      if (idx >= 0) {
        const insertAt = idx + endMarker.length;
        const block = `\n\n## Letzte Aktivität\n\n_Jüngste Changelog-Einträge (30 Tage) der Produkte dieser MOC. Auto-generiert — konsistent mit [[Microsoft MOC#Letzte Aktivität]]._\n\n<!-- AUTO-INDEX-START: activity -->\n\n${mocActivityTable}\n\n<!-- AUTO-INDEX-END: activity -->`;
        content = content.slice(0, insertAt) + block + content.slice(insertAt);
      }
    } else {
      content = injectOrReplaceMarker(content, "activity", mocActivityTable);
    }

    fs.writeFileSync(mocPath, content);
    touched++;
    console.log(`[update-indices] Primary-Home-MOC aktualisiert → ${mocName} (${ps.length} Produkte)`);
  }
  console.log(`[update-indices] ${touched} Primary-Home-MOCs gepatcht`);
}

export function updateAllIndices(): void {
  updateRootMoc();
  updatePrimaryHomeMocs();
  // Zukunft: Deprecation Radar „Aktive Migrationen"-Tabelle
}

// Standalone-Ausführung
const invokedDirectly = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`;
if (invokedDirectly || process.argv[1]?.endsWith("update-indices.ts")) {
  updateAllIndices();
}
