/**
 * Template-Konformitäts-Audit für Product-Notes und MOCs.
 *
 * Prüft:
 *   - Frontmatter-Pflichtfelder (watch/status/last_verified/aliases/moc)
 *   - Pflicht-Sektionen (Elevator/Einsatz/Status/Kernkonzept/Limitierungen/
 *     Referenzen/Changelog)
 *   - Watch-Level-konditionale Sektionen (Integrationen/Security/Abgrenzung)
 *   - Changelog hat mindestens eine datierte Zeile
 *   - Primary-Referenzen-Tabelle hat Zuletzt-gesichtet-Daten
 *
 * Gibt einen Gap-Report aus — sortiert nach Produkt mit Issue-Count.
 *
 * Aufruf:
 *   bun run scripts/audit-notes.ts
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { loadAllProducts, type Product } from "./lib/config.js";
import { PRODUCTS_DIR, MOCS_DIR, MICROSOFT_MOC } from "./lib/paths.js";

interface Issue {
  severity: "error" | "warning";
  category: string;
  message: string;
}

interface NoteAudit {
  note_path: string;
  display_name: string;
  watch: string;
  issues: Issue[];
}

// Akzeptiere Template-Sektions-Namen ODER häufige Alternativen (Alias-Map).
// Das fängt die produkt-spezifisch-benannten Sektionen der Tier-1-Deep-Research-
// Notes ab (z. B. „Pricing & Regionen" statt „Status & Pricing").
const PRODUCT_SECTION_ALIASES: Record<string, RegExp[]> = {
  Einsatz: [/^##[^#][^\n]*Einsatz/im, /^##[^#][^\n]*Job[- ]to[- ]be[- ]done/im],
  "Status & Pricing": [
    /^##[^#][^\n]*Status\s*&?\s*Pricing/im,
    /^##[^#][^\n]*Pricing/im,
    /^##[^#][^\n]*Preise/im,
    /^##[^#][^\n]*Lizenz/im,
    /^##[^#][^\n]*Integrations[- ]?Matrix/im,
    /^##[^#][^\n]*GA[- ]Status/im,
    /^##[^#][^\n]*PAYG\s*vs\.?\s*MaaS/im, // Foundry Models
    /^##[^#][^\n]*Hardware[- ]?Matrix/im, // Foundry Local
    /^##[^#][^\n]*Sprach[- ]?Parit[aä]t[s\-]/im, // Foundry SDKs (Versioning)
    /^##[^#][^\n]*Services[- ]Inventar/im, // Foundry Tools (enthält Pricing-Info)
    /^##[^#][^\n]*Deployment[- ]Strateg/im, // Foundry Control Plane
  ],
  Kernkonzept: [
    /^##[^#][^\n]*Kern[- ]?Konzept/im,
    /^##[^#][^\n]*Kern[- ]F[aä]higkeiten/im,
    /^##[^#][^\n]*Architektur/im,
    /^##[^#][^\n]*Konzept/im,
    /^##[^#][^\n]*Top[- ]\d+/im,
    /^##[^#][^\n]*Services[- ]Inventar/im,
    /^##[^#][^\n]*Die drei /im,
    /^##[^#][^\n]*Netzwerk/im,
    /^##[^#][^\n]*Networking/im,
    /^##[^#][^\n]*Tracing/im,
    /^##[^#][^\n]*Spec[- ]?Status/im,
    /^##[^#][^\n]*v1[- ]vs[- ]v2/im,
    /^##[^#][^\n]*API[- ]Oberfl[aä]che/im,
    /^##[^#][^\n]*Policies/im, // APIM AI Gateway "5 GA-AI-Policies"
    /^##[^#][^\n]*Modell[- ]?Katalog/im, // Foundry Local
    /^##[^#][^\n]*Evaluation/im, // Foundry Control Plane
  ],
  Limitierungen: [
    /^##[^#][^\n]*Limit/im,
    /^##[^#][^\n]*Fallstrick/im,
    /^##[^#][^\n]*Einschränk/im,
    /^##[^#][^\n]*Deprecation/im, // Foundry Models "Model Deprecations"
    /^##[^#][^\n]*Abgrenzung/im, // Foundry Control Plane hat Abgrenzung statt Limitierung
  ],
  Referenzen: [/^##[^#][^\n]*Referenzen/im, /^##[^#][^\n]*Quellen/im, /^##[^#][^\n]*Monitoring/im],
  Changelog: [/^##[^#][^\n]*Changelog/im, /^##[^#][^\n]*Historie/im],
};

const PRODUCT_REQUIRED_SECTIONS = Object.keys(PRODUCT_SECTION_ALIASES);

const PRODUCT_WATCH_SECTIONS: Record<string, string[]> = {
  close: ["Integrationen", "Security & Compliance", "Abgrenzung"],
  standard: ["Integrationen", "Security & Compliance"],
  passive: [],
};

const PRODUCT_WATCH_SECTION_ALIASES: Record<string, RegExp[]> = {
  Integrationen: [/^##[^#][^\n]*Integration/im, /^###[^\n]*Integration/im],
  "Security & Compliance": [
    /^##[^#][^\n]*Security\s*&\s*Compliance/im,
    /^##[^#][^\n]*Compliance/im,
    /^##[^#][^\n]*DSGVO/im,
    /^###[^\n]*Security/im,
  ],
  Abgrenzung: [
    /^##[^#][^\n]*Abgrenzung/im,
    /^##[^#][^\n]*Wettbewerb/im,
    /^##[^#][^\n]*vs\.\s*/im,
    /^##[^#][^\n]*Alternative/im,
  ],
};

const MOC_REQUIRED_SECTIONS = [
  "Zweck",
  "Landkarte",
  "Produkte in dieser MOC",
];

// Lens-MOCs verlinken Produkte quer (nicht per Primary-Home) — sie brauchen
// weder "Produkte in dieser MOC" noch zwingend "Landkarte".
const LENS_MOC_NAMES = new Set([
  "Agent-Building-Pattern MOC",
  "RAG Pattern MOC",
]);

function parseFrontmatter(content: string): { fm: Record<string, unknown>; body: string } | null {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return null;
  try {
    const fm = (yaml.load(m[1]!, { schema: yaml.JSON_SCHEMA }) as Record<string, unknown>) ?? {};
    return { fm, body: m[2]! };
  } catch {
    return null;
  }
}

function hasSection(body: string, keyword: string): boolean {
  const re = new RegExp(`^##[^#][^\n]*${keyword}`, "im");
  return re.test(body);
}

function hasAnyPattern(body: string, patterns: RegExp[]): boolean {
  return patterns.some((re) => re.test(body));
}

function auditProductNote(p: Product): NoteAudit {
  const absPath = path.join(PRODUCTS_DIR, p.note);
  const issues: Issue[] = [];
  const audit: NoteAudit = {
    note_path: p.note,
    display_name: p.note.replace(/\.md$/, "").replace(/^deprecated\//, "deprecated/"),
    watch: p.watch,
    issues,
  };

  if (!fs.existsSync(absPath)) {
    issues.push({ severity: "error", category: "missing", message: "Datei existiert nicht" });
    return audit;
  }

  const content = fs.readFileSync(absPath, "utf8");
  const parsed = parseFrontmatter(content);
  if (!parsed) {
    issues.push({ severity: "error", category: "frontmatter", message: "Kein gültiges YAML-Frontmatter" });
    return audit;
  }
  const { fm, body } = parsed;

  // Frontmatter-Pflicht
  if (!fm.watch) issues.push({ severity: "error", category: "frontmatter", message: "fehlt: watch" });
  if (!fm.status) issues.push({ severity: "error", category: "frontmatter", message: "fehlt: status" });
  if (!fm.last_verified) issues.push({ severity: "error", category: "frontmatter", message: "fehlt: last_verified" });
  if (fm.aliases === undefined) issues.push({ severity: "warning", category: "frontmatter", message: "fehlt: aliases" });
  const moc = fm.moc;
  if (!Array.isArray(moc) || moc.length < 2) {
    issues.push({
      severity: "error",
      category: "frontmatter",
      message: "moc fehlt oder < 2 Einträge ([[Microsoft MOC]] + mind. 1 Primary)",
    });
  } else {
    const hasRoot = (moc as unknown[]).some(
      (x) => typeof x === "string" && /Microsoft MOC/.test(x),
    );
    if (!hasRoot) {
      issues.push({
        severity: "error",
        category: "frontmatter",
        message: "moc enthält nicht [[Microsoft MOC]]",
      });
    }
  }

  // Pflicht-Sektionen (mit Alias-Matching)
  for (const sec of PRODUCT_REQUIRED_SECTIONS) {
    const aliases = PRODUCT_SECTION_ALIASES[sec]!;
    if (!hasAnyPattern(body, aliases)) {
      issues.push({
        severity: "error",
        category: "section",
        message: `Pflicht-Sektion fehlt (auch kein Alias): ${sec}`,
      });
    }
  }

  // Watch-konditionale Sektionen (mit Alias-Matching — akzeptiert H2 oder H3)
  const watch = String(fm.watch ?? p.watch);
  const needed = PRODUCT_WATCH_SECTIONS[watch] ?? [];
  for (const sec of needed) {
    const aliases = PRODUCT_WATCH_SECTION_ALIASES[sec] ?? [new RegExp(`^##[^#][^\n]*${sec}`, "im")];
    if (!hasAnyPattern(body, aliases)) {
      issues.push({
        severity: "warning",
        category: "watch-section",
        message: `Für watch:${watch} empfohlene Sektion fehlt: ${sec}`,
      });
    }
  }

  // Changelog hat mindestens eine datierte Zeile
  const changelogStart = body.search(/^##[^#][^\n]*Changelog/m);
  if (changelogStart >= 0) {
    const changelog = body.slice(changelogStart);
    const rows = changelog.match(/^\|\s*20\d{2}-\d{2}-\d{2}\s*\|/gm) || [];
    if (rows.length === 0) {
      issues.push({
        severity: "error",
        category: "changelog",
        message: "Changelog-Tabelle hat keinen datierten Eintrag",
      });
    }
  }

  // Primary-Referenzen haben Zuletzt-gesichtet-Daten
  const refsMatch = body.match(/^###\s*Primary[\s\S]*?(?=^###|\Z)/m);
  if (refsMatch) {
    const refsBlock = refsMatch[0]!;
    // Zähle Daten-Treffer innerhalb Tabellen-Zeilen
    const tableRows = refsBlock.split(/\n/).filter((l) => l.startsWith("|") && !l.match(/^\|\s*-/));
    if (tableRows.length > 1) {
      const withDate = tableRows.filter((l) => /20\d{2}-\d{2}-\d{2}/.test(l));
      if (withDate.length === 0) {
        issues.push({
          severity: "warning",
          category: "references",
          message: "Primary-Referenzen-Tabelle hat keine Zuletzt-gesichtet-Daten",
        });
      }
    }
  }

  return audit;
}

function auditMoc(mocPath: string, displayName: string): NoteAudit {
  const issues: Issue[] = [];
  const audit: NoteAudit = {
    note_path: mocPath,
    display_name: displayName,
    watch: "-",
    issues,
  };

  if (!fs.existsSync(mocPath)) {
    issues.push({ severity: "error", category: "missing", message: "Datei existiert nicht" });
    return audit;
  }

  const content = fs.readFileSync(mocPath, "utf8");
  const parsed = parseFrontmatter(content);
  if (!parsed) {
    issues.push({ severity: "error", category: "frontmatter", message: "Kein gültiges YAML-Frontmatter" });
    return audit;
  }
  const { fm, body } = parsed;

  if (!fm.type) {
    issues.push({ severity: "warning", category: "frontmatter", message: "fehlt: type (sollte 'moc')" });
  } else if (fm.type !== "moc") {
    issues.push({ severity: "warning", category: "frontmatter", message: `type ist '${fm.type}', erwartet 'moc'` });
  }
  if (!fm.last_verified) {
    issues.push({ severity: "error", category: "frontmatter", message: "fehlt: last_verified" });
  }

  const isLens = LENS_MOC_NAMES.has(displayName);
  for (const sec of MOC_REQUIRED_SECTIONS) {
    if (!hasSection(body, sec)) {
      // Lens-MOCs dürfen "Produkte in dieser MOC" und "Landkarte" überspringen
      if (isLens && (sec === "Produkte in dieser MOC" || sec === "Landkarte")) continue;
      issues.push({
        severity: "error",
        category: "section",
        message: `Pflicht-Sektion fehlt: ## ${sec}`,
      });
    }
  }

  return audit;
}

function printReport(audits: NoteAudit[], title: string) {
  console.log(`\n━━━ ${title} ━━━`);
  const clean = audits.filter((a) => a.issues.length === 0);
  const withIssues = audits.filter((a) => a.issues.length > 0);
  console.log(`${clean.length}/${audits.length} konform · ${withIssues.length} mit Lücken\n`);

  for (const a of withIssues.sort((x, y) => y.issues.length - x.issues.length)) {
    const errors = a.issues.filter((i) => i.severity === "error").length;
    const warns = a.issues.filter((i) => i.severity === "warning").length;
    const watchTag = a.watch !== "-" ? `[${a.watch}]` : "";
    console.log(`▸ ${a.display_name} ${watchTag} — ${errors} error${errors !== 1 ? "s" : ""}, ${warns} warning${warns !== 1 ? "s" : ""}`);
    for (const issue of a.issues) {
      const icon = issue.severity === "error" ? "✗" : "⚠";
      console.log(`  ${icon} [${issue.category}] ${issue.message}`);
    }
  }
}

function main() {
  const products = loadAllProducts();
  const productAudits = products.map(auditProductNote);
  printReport(productAudits, "PRODUCT NOTES");

  const mocFiles = fs
    .readdirSync(MOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ abs: path.join(MOCS_DIR, f), name: f.replace(/\.md$/, "") }));
  mocFiles.push({ abs: MICROSOFT_MOC, name: "Microsoft MOC (Root)" });
  const mocAudits = mocFiles.map((m) => auditMoc(m.abs, m.name));
  printReport(mocAudits, "MOC NOTES");

  // Summary
  const totalIssues =
    productAudits.reduce((a, x) => a + x.issues.length, 0) +
    mocAudits.reduce((a, x) => a + x.issues.length, 0);
  const productErrors = productAudits.reduce(
    (a, x) => a + x.issues.filter((i) => i.severity === "error").length,
    0,
  );
  const mocErrors = mocAudits.reduce(
    (a, x) => a + x.issues.filter((i) => i.severity === "error").length,
    0,
  );
  console.log(`\n━━━ SUMMARY ━━━`);
  console.log(`Products: ${productAudits.length} · ${productErrors} errors total`);
  console.log(`MOCs:     ${mocAudits.length} · ${mocErrors} errors total`);
  console.log(`Gesamt:   ${totalIssues} Issues`);
}

main();
