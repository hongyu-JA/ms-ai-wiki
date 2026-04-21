import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { PRODUCTS_DIR, DEPRECATED_DIR, MOCS_DIR } from "./paths.js";

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

export interface ParsedNote {
  frontmatter: Record<string, unknown>;
  body: string;
  raw: string;
  path: string;
}

// JSON_SCHEMA behandelt ISO-Daten als String — nötig, damit Frontmatter-Felder
// wie `created: 2026-04-21` nicht beim Re-Dump zu `2026-04-21T00:00:00.000Z` werden.
const FM_SCHEMA = yaml.JSON_SCHEMA;

export function parseNote(filePath: string): ParsedNote {
  const raw = fs.readFileSync(filePath, "utf8");
  const m = raw.match(FRONTMATTER_RE);
  if (!m) {
    return { frontmatter: {}, body: raw, raw, path: filePath };
  }
  const fm = (yaml.load(m[1]!, { schema: FM_SCHEMA }) as Record<string, unknown>) ?? {};
  return { frontmatter: fm, body: m[2]!, raw, path: filePath };
}

export function serializeNote(fm: Record<string, unknown>, body: string): string {
  const fmText = yaml
    .dump(fm, { lineWidth: 120, noRefs: true, schema: FM_SCHEMA })
    .trimEnd();
  return `---\n${fmText}\n---\n${body.startsWith("\n") ? body : "\n" + body}`;
}

// --- Heading-Matching -------------------------------------------------------

function normalizeHeading(s: string): string {
  return s
    .toLowerCase()
    .replace(/^\d+\.\s*/, "") // leading "3. "
    .replace(/\*[^*]+\*/g, "") // strip *(close)* / *italics*
    .replace(/\s+/g, " ")
    .trim();
}

interface HeadingHit {
  line: number; // index of the heading line itself
  level: number; // 1..6
  bodyStart: number; // first line of body (heading + 1)
  bodyEnd: number; // exclusive — index of next heading of same-or-lower depth, or EOF
}

/**
 * Finde eine Sektion in `lines` anhand des normalisierten Titels.
 * Sucht zuerst auf level 2 (Template-Standard), bei Misserfolg auf level 3
 * (z. B. „Kern-Fähigkeiten" unter „## 4. Kernkonzept"). Die Sektions-Grenze
 * endet, sobald eine Heading-Zeile mit ≤ eigener Tiefe auftaucht.
 */
function findSection(lines: string[], title: string): HeadingHit | null {
  const target = normalizeHeading(title);
  const headingRe = /^(#{2,6}) +(.+?)\s*$/;
  for (const preferredLevel of [2, 3]) {
    for (let i = 0; i < lines.length; i++) {
      const mm = lines[i]!.match(headingRe);
      if (!mm) continue;
      const level = mm[1]!.length;
      if (level !== preferredLevel) continue;
      if (normalizeHeading(mm[2]!) !== target) continue;
      let end = lines.length;
      for (let j = i + 1; j < lines.length; j++) {
        const m2 = lines[j]!.match(headingRe);
        if (m2 && m2[1]!.length <= level) {
          end = j;
          break;
        }
      }
      return { line: i, level, bodyStart: i + 1, bodyEnd: end };
    }
  }
  return null;
}

// --- Lesen / Schreiben ------------------------------------------------------

export function getSectionBody(body: string, title: string): string | null {
  const lines = body.split(/\r?\n/);
  const hit = findSection(lines, title);
  if (!hit) return null;
  return lines.slice(hit.bodyStart, hit.bodyEnd).join("\n");
}

/**
 * Append-Text am Ende einer bestehenden Sektion (vor dem nächsten gleich-
 * oder höher-stehenden Heading). Legt die Sektion am File-Ende an, falls sie
 * nicht existiert (mit Warnung, damit man das im Log sieht).
 */
export function appendToSection(body: string, title: string, addition: string): string {
  const lines = body.split(/\r?\n/);
  const hit = findSection(lines, title);
  if (!hit) {
    console.warn(`[obsidian] Section "${title}" not found; appending at end.`);
    return body.trimEnd() + `\n\n## ${title}\n\n${addition.trimEnd()}\n`;
  }
  let insertIdx = hit.bodyEnd;
  while (insertIdx > hit.bodyStart && lines[insertIdx - 1]!.trim() === "") insertIdx--;
  const before = lines.slice(0, insertIdx);
  const after = lines.slice(insertIdx);
  return [...before, "", addition.trimEnd(), "", ...after].join("\n");
}

/**
 * Ersetze den ersten Absatz in der gegebenen Sektion, der `needle` enthält,
 * durch `replacement`. Kein Treffer → fallback auf append.
 */
export function replaceInSection(
  body: string,
  title: string,
  needle: string,
  replacement: string,
): string {
  const section = getSectionBody(body, title);
  if (!section || !section.includes(needle)) {
    return appendToSection(body, title, replacement);
  }
  const updated = section.replace(needle, replacement);
  return swapSectionBody(body, title, updated);
}

function swapSectionBody(body: string, title: string, newSectionBody: string): string {
  const lines = body.split(/\r?\n/);
  const hit = findSection(lines, title);
  if (!hit) return body;
  const before = lines.slice(0, hit.bodyStart);
  const after = lines.slice(hit.bodyEnd);
  return [...before, "", newSectionBody.trimEnd(), "", ...after].join("\n");
}

/**
 * Neueste Zeile oben in der Changelog-Tabelle einfügen. Erzeugt Tabelle oder
 * Sektion, falls sie fehlen.
 */
export function prependChangelogRow(
  body: string,
  date: string,
  author: string,
  change: string,
  source: string,
): string {
  const row = `| ${date} | ${author} | ${change.replace(/\n/g, " ")} | ${source} |`;
  const section = getSectionBody(body, "Changelog");
  if (!section) {
    return appendToSection(
      body,
      "Changelog",
      `| Datum | Autor | Änderung | Quelle |\n| ----- | ----- | -------- | ------ |\n${row}`,
    );
  }
  const lines = section.split(/\r?\n/);
  let sepIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\|\s*-{3,}/.test(lines[i]!)) {
      sepIdx = i;
      break;
    }
  }
  if (sepIdx < 0) {
    const rebuilt =
      `| Datum | Autor | Änderung | Quelle |\n| ----- | ----- | -------- | ------ |\n${row}\n` +
      lines.join("\n");
    return swapSectionBody(body, "Changelog", rebuilt);
  }
  const before = lines.slice(0, sepIdx + 1);
  const after = lines.slice(sepIdx + 1);
  const updated = [...before, row, ...after].join("\n");
  return swapSectionBody(body, "Changelog", updated);
}

export function bumpZuletztGesichtet(
  fm: Record<string, unknown>,
  date: string,
): Record<string, unknown> {
  return { ...fm, zuletzt_gesichtet: date, updated: date };
}

export function findProductNote(noteName: string): string | null {
  for (const dir of [PRODUCTS_DIR, DEPRECATED_DIR]) {
    const p = path.join(dir, noteName);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export function findMocNote(mocName: string): string | null {
  const candidates = [
    path.join(MOCS_DIR, `${mocName}.md`),
    path.join(MOCS_DIR, mocName),
  ];
  for (const p of candidates) if (fs.existsSync(p)) return p;
  return null;
}
