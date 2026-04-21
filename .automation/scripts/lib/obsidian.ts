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

/**
 * Return the body of a section identified by its heading text
 * (heading level 2, "## Section Title" — the common pattern in our Template).
 * Case-insensitive, ignores leading section number like "3. ".
 */
export function getSectionBody(body: string, title: string): string | null {
  const lines = body.split(/\r?\n/);
  const normalize = (s: string) => s.toLowerCase().replace(/^\d+\.\s*/, "").trim();
  const target = normalize(title);
  const headingRe = /^## +(.+?)\s*$/;
  let startIdx = -1;
  let endIdx = lines.length;
  for (let i = 0; i < lines.length; i++) {
    const mm = lines[i]!.match(headingRe);
    if (!mm) continue;
    if (normalize(mm[1]!) === target) {
      startIdx = i + 1;
      for (let j = i + 1; j < lines.length; j++) {
        if (/^## +/.test(lines[j]!)) {
          endIdx = j;
          break;
        }
      }
      break;
    }
  }
  if (startIdx < 0) return null;
  return lines.slice(startIdx, endIdx).join("\n");
}

/**
 * Append text to an existing section (before the next "## " heading).
 * If the section does not exist, returns the body unchanged and logs a warning.
 */
export function appendToSection(body: string, title: string, addition: string): string {
  const lines = body.split(/\r?\n/);
  const normalize = (s: string) => s.toLowerCase().replace(/^\d+\.\s*/, "").trim();
  const target = normalize(title);
  const headingRe = /^## +(.+?)\s*$/;
  for (let i = 0; i < lines.length; i++) {
    const mm = lines[i]!.match(headingRe);
    if (!mm || normalize(mm[1]!) !== target) continue;
    // find next H2 or end-of-file
    let j = i + 1;
    while (j < lines.length && !/^## +/.test(lines[j]!)) j++;
    // trim trailing blank lines inside this section
    let insertIdx = j;
    while (insertIdx > i + 1 && lines[insertIdx - 1]!.trim() === "") insertIdx--;
    const before = lines.slice(0, insertIdx);
    const after = lines.slice(insertIdx);
    return [...before, "", addition.trimEnd(), "", ...after].join("\n");
  }
  console.warn(`[obsidian] Section "${title}" not found; appending at end.`);
  return body.trimEnd() + `\n\n## ${title}\n\n${addition.trimEnd()}\n`;
}

/**
 * Replace the first paragraph that contains `needle` within the given section
 * with `replacement`. If not found, falls back to append.
 */
export function replaceInSection(
  body: string,
  title: string,
  needle: string,
  replacement: string,
): string {
  const section = getSectionBody(body, title);
  if (!section) return appendToSection(body, title, replacement);
  if (!section.includes(needle)) return appendToSection(body, title, replacement);
  const updated = section.replace(needle, replacement);
  // Swap the section in-place
  return swapSectionBody(body, title, updated);
}

function swapSectionBody(body: string, title: string, newSectionBody: string): string {
  const lines = body.split(/\r?\n/);
  const normalize = (s: string) => s.toLowerCase().replace(/^\d+\.\s*/, "").trim();
  const target = normalize(title);
  const headingRe = /^## +(.+?)\s*$/;
  for (let i = 0; i < lines.length; i++) {
    const mm = lines[i]!.match(headingRe);
    if (!mm || normalize(mm[1]!) !== target) continue;
    let j = i + 1;
    while (j < lines.length && !/^## +/.test(lines[j]!)) j++;
    const before = lines.slice(0, i + 1);
    const after = lines.slice(j);
    return [...before, "", newSectionBody.trimEnd(), "", ...after].join("\n");
  }
  return body;
}

/**
 * Add a new row to the changelog table inside the `## 7. Changelog` section.
 * Creates the section if missing.
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
    // No table yet — rebuild
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
