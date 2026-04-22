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

export function updateAllIndices(): void {
  updateRootMoc();
  // Zukunft: Primary-Home-MOC "Produkte in dieser MOC"-Tabellen ebenso
  //           (aktuell über Dataview-Queries live, daher nicht zwingend)
  // Zukunft: Deprecation Radar "Aktive Migrationen"-Tabelle
}

// Standalone-Ausführung
const invokedDirectly = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`;
if (invokedDirectly || process.argv[1]?.endsWith("update-indices.ts")) {
  updateAllIndices();
}
