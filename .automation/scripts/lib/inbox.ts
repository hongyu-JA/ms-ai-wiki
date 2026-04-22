/**
 * Inbox-Reader.
 *
 * Liest Markdown-Dateien aus `MS_AI_Wiki/_Inbox/` (rekursiv, ausser den
 * Unterordnern `_processed/` und `_rejected/`) und konvertiert sie in das
 * RawItem-Schema — kompatibel mit RSS-/Atom-Items, damit filter.ts und
 * patch.ts sie ohne Sonderbehandlung weiterverarbeiten können.
 *
 * Das Frontmatter einer Inbox-Datei kann folgende Felder setzen:
 *   - source_url  (authoritative URL, wird als item.link übernommen)
 *   - source_title (Display-Titel, fallback: erste H1 oder Dateiname)
 *   - published   (ISO-Datum des Originals)
 *
 * Fehlen die Felder, wird aus dem Body heuristisch extrahiert.
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { RawItem } from "./feeds.js";
import { INBOX_DIR, INBOX_PROCESSED_DIR, INBOX_REJECTED_DIR } from "./paths.js";

export interface InboxFile {
  abs_path: string;
  relative_id: string; // eindeutig für seen-items: "inbox/<rel-path-ohne-.md>"
  title: string;
  body: string;
  source_url: string;
  published?: string;
}

function hash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return h.toString(36);
}

function listInboxMarkdowns(): string[] {
  if (!fs.existsSync(INBOX_DIR)) return [];
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (abs === INBOX_PROCESSED_DIR || abs === INBOX_REJECTED_DIR) continue;
        if (entry.name.startsWith("_")) continue; // andere _xxx-Ordner defensiv auslassen
        walk(abs);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        // README.md selbst nicht verarbeiten
        if (entry.name.toLowerCase() === "readme.md") continue;
        out.push(abs);
      }
    }
  };
  walk(INBOX_DIR);
  return out;
}

function parseFrontmatter(content: string): { fm: Record<string, unknown>; body: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { fm: {}, body: content };
  try {
    const fm = (yaml.load(match[1]!) as Record<string, unknown>) ?? {};
    return { fm, body: match[2] ?? "" };
  } catch {
    return { fm: {}, body: content };
  }
}

function firstHeading(body: string): string | null {
  const m = body.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1]! : null;
}

function firstHttpLink(body: string): string | null {
  const m = body.match(/https?:\/\/[^\s)]+/);
  return m ? m[0] : null;
}

export function readInboxFile(abs: string): InboxFile {
  const raw = fs.readFileSync(abs, "utf8");
  const { fm, body } = parseFrontmatter(raw);
  const filename = path.basename(abs, path.extname(abs));
  const title =
    (typeof fm.source_title === "string" && fm.source_title) ||
    firstHeading(body) ||
    filename;
  const source_url =
    (typeof fm.source_url === "string" && fm.source_url) ||
    firstHttpLink(body) ||
    "";
  const published =
    typeof fm.published === "string" ? fm.published : undefined;

  const relPath = path
    .relative(INBOX_DIR, abs)
    .replace(/\\/g, "/")
    .replace(/\.md$/i, "");
  const relative_id = `inbox/${relPath}`;

  return {
    abs_path: abs,
    relative_id,
    title,
    body,
    source_url,
    published,
  };
}

export function inboxFileToRawItem(f: InboxFile): RawItem {
  // Summary = erste 2000 Zeichen des Bodys (ohne Frontmatter), normalized
  const summary = f.body.replace(/\s+/g, " ").trim().slice(0, 2000);
  return {
    source_id: f.relative_id, // "inbox/foo" — unterscheidet sich von RSS-source-IDs
    source_url: f.source_url || f.abs_path,
    item_id: f.relative_id,
    title: f.title,
    summary,
    link: f.source_url || "",
    published: f.published,
    fetched_at: new Date().toISOString(),
    raw_hash: hash(f.title + f.body + f.source_url),
  };
}

/**
 * Liefert alle Inbox-Files als RawItems, im Pipeline-Schema.
 */
export function readInboxItems(): RawItem[] {
  const paths = listInboxMarkdowns();
  return paths.map((p) => inboxFileToRawItem(readInboxFile(p)));
}

/**
 * Archiviert eine verarbeitete Inbox-Datei nach `_processed/YYYY-MM-DD/`.
 * Ergänzt Frontmatter um processed_at + classification.
 */
export function archiveInboxFile(
  abs: string,
  classification: string,
  targetRoot: string = INBOX_PROCESSED_DIR,
): void {
  if (!fs.existsSync(abs)) return;
  const today = new Date().toISOString().slice(0, 10);
  const dayDir = path.join(targetRoot, today);
  fs.mkdirSync(dayDir, { recursive: true });

  const raw = fs.readFileSync(abs, "utf8");
  const { fm, body } = parseFrontmatter(raw);
  const newFm = {
    ...fm,
    processed_at: new Date().toISOString(),
    classification,
  };
  const dumped = yaml.dump(newFm, { lineWidth: 200, sortKeys: false }).trimEnd();
  const newContent = `---\n${dumped}\n---\n${body.startsWith("\n") ? body : "\n" + body}`;

  const target = path.join(dayDir, path.basename(abs));
  fs.writeFileSync(target, newContent);
  fs.unlinkSync(abs);
}

/**
 * Verschiebt eine nicht-relevante Inbox-Datei (kein MS-AI-Bezug) nach
 * `_rejected/YYYY-MM-DD/` mit begründendem Frontmatter.
 */
export function rejectInboxFile(abs: string, reason: string): void {
  archiveInboxFile(abs, `rejected: ${reason}`, INBOX_REJECTED_DIR);
}
