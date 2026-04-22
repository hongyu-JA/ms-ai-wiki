/**
 * Stage 0 · Classify — Vorfilter für Clippings/
 *
 * Scannt `MS_AI_Wiki/Clippings/` rekursiv nach Markdown-Dateien und entscheidet
 * pro Datei per Keyword-Heuristik:
 *   - Microsoft-AI-relevant → verschiebe nach `MS_AI_Wiki/_Inbox/`, damit die
 *     normale Pipeline (filter → patch → apply) den Rest erledigt.
 *   - Nicht relevant → Datei bleibt in Clippings/ als private Sammlung.
 *
 * Die Heuristik ist bewusst eng: wir wollen False-Positives (nicht-Microsoft-
 * Artikel, die ins Inbox wandern) vermeiden, weil Inbox-Items dann Claude-
 * Tokens verbrauchen. False-Negatives (MS-Artikel bleiben in Clippings) sind
 * weniger schlimm — User kann manuell nach _Inbox/ verschieben.
 *
 * Aufruf:
 *   bun run scripts/classify-clippings.ts
 */
import fs from "node:fs";
import path from "node:path";
import { CLIPPINGS_DIR, INBOX_DIR } from "./lib/paths.js";

const DRY_WRITE = process.env.DRY_WRITE === "1";

/**
 * Heuristisches Scoring. Rückgabe > 0 bedeutet "Microsoft-AI-Kontext".
 * Die Schwelle (siehe RELEVANT_THRESHOLD) entscheidet, ob verschoben wird.
 */
function scoreMicrosoftAi(hay: string): { score: number; hits: string[] } {
  const lower = hay.toLowerCase();
  const hits: string[] = [];
  let score = 0;

  const microsoftMention =
    lower.includes("microsoft") ||
    lower.includes(" m365") ||
    lower.includes("/azure/") ||
    lower.includes("learn.microsoft.com") ||
    lower.includes("techcommunity") ||
    lower.includes("devblogs.microsoft");
  if (microsoftMention) {
    score += 1;
    hits.push("microsoft-context");
  }

  // Produkt-/Konzept-Marker (starke Signale, jedes zählt einzeln)
  const strongKeywords = [
    "copilot",
    "foundry",
    "azure ai",
    "azure openai",
    "m365 copilot",
    "agent framework",
    "maf ",
    "entra",
    "purview",
    "defender for ai",
    "dataverse",
    "copilot studio",
    "model context protocol",
    "mcp server",
    "autogen",
    "semantic kernel",
    "power automate",
    "logic apps",
    "azure functions",
    "apim ai",
  ];
  for (const kw of strongKeywords) {
    if (lower.includes(kw)) {
      score += 2;
      hits.push(kw);
    }
  }

  // Schwache Signale: allgemeine AI-Begriffe zählen nur zusammen mit Microsoft
  if (microsoftMention) {
    const weakKeywords = ["agent", "llm", "rag", "retrieval", "embedding"];
    for (const kw of weakKeywords) {
      if (lower.includes(kw)) {
        score += 1;
        hits.push(`weak:${kw}`);
      }
    }
  }

  return { score, hits };
}

const RELEVANT_THRESHOLD = 3;

function listClippings(): string[] {
  if (!fs.existsSync(CLIPPINGS_DIR)) return [];
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith("_")) continue; // Reserve-Unterordner
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(abs);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
        if (entry.name.toLowerCase() === "readme.md") continue;
        out.push(abs);
      }
    }
  };
  walk(CLIPPINGS_DIR);
  return out;
}

function readFileText(abs: string): string {
  try {
    return fs.readFileSync(abs, "utf8");
  } catch {
    return "";
  }
}

function safeMove(src: string, destDir: string): string {
  fs.mkdirSync(destDir, { recursive: true });
  const base = path.basename(src);
  let target = path.join(destDir, base);
  if (fs.existsSync(target)) {
    // Dedupe: Zeitstempel anhängen
    const ext = path.extname(base);
    const stem = path.basename(base, ext);
    target = path.join(destDir, `${stem} (${Date.now()})${ext}`);
  }
  fs.renameSync(src, target);
  return target;
}

function main() {
  const files = listClippings();
  if (files.length === 0) {
    console.log("[classify] keine Clippings gefunden — nichts zu tun");
    return;
  }

  let moved = 0;
  let kept = 0;
  for (const abs of files) {
    const content = readFileText(abs);
    const { score, hits } = scoreMicrosoftAi(content);
    const rel = path.relative(CLIPPINGS_DIR, abs);
    if (score >= RELEVANT_THRESHOLD) {
      if (DRY_WRITE) {
        console.log(`[classify] (dry) would move → _Inbox/: ${rel} (score=${score}, hits: ${hits.join(", ")})`);
      } else {
        const dest = safeMove(abs, INBOX_DIR);
        console.log(`[classify] → _Inbox/${path.basename(dest)} (score=${score}, hits: ${hits.slice(0, 4).join(", ")})`);
      }
      moved++;
    } else {
      console.log(`[classify] bleibt in Clippings/: ${rel} (score=${score})`);
      kept++;
    }
  }

  console.log(`[classify] ${moved} verschoben, ${kept} behalten · Schwelle=${RELEVANT_THRESHOLD}`);
}

main();
