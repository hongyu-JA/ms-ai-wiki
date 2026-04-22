import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

// .automation/scripts/lib -> repo root
export const REPO_ROOT = path.resolve(here, "..", "..", "..");
export const AUTOMATION_DIR = path.resolve(REPO_ROOT, ".automation");
export const STATE_DIR = path.resolve(AUTOMATION_DIR, "state");
export const PROMPTS_DIR = path.resolve(AUTOMATION_DIR, "prompts");

export const VAULT_DIR = path.resolve(REPO_ROOT, "MS_AI_Wiki");
export const MS_DIR = path.resolve(VAULT_DIR, "Microsoft");
export const PRODUCTS_DIR = path.resolve(MS_DIR, "Products");
export const DEPRECATED_DIR = path.resolve(PRODUCTS_DIR, "deprecated");
export const MOCS_DIR = path.resolve(MS_DIR, "MOCs");
export const TEMPLATES_DIR = path.resolve(MS_DIR, "_Templates");

export const PRODUCTS_YAML = path.resolve(AUTOMATION_DIR, "products.yaml");
export const SOURCES_YAML = path.resolve(AUTOMATION_DIR, "sources.yaml");

export const STATE_RAW_ITEMS = path.resolve(STATE_DIR, "raw-items.json");
export const STATE_FILTERED = path.resolve(STATE_DIR, "filtered-items.json");
export const STATE_PATCHES = path.resolve(STATE_DIR, "patches.json");
export const STATE_SEEN = path.resolve(STATE_DIR, "seen-items.json");
export const STATE_HASHES = path.resolve(STATE_DIR, "feed-hashes.json");
export const STATE_LAST_RUN = path.resolve(STATE_DIR, "last-run.json");

export const PROMPT_SYSTEM = path.resolve(PROMPTS_DIR, "system.md");
export const PROMPT_USER_TEMPLATE = path.resolve(PROMPTS_DIR, "user-template.md");

export const MICROSOFT_MOC = path.resolve(MS_DIR, "Microsoft MOC.md");
export const DEPRECATION_RADAR = path.resolve(MS_DIR, "Deprecation Radar.md");

// Inbox: Ort, an dem User manuell Markdown-Files für den nächsten Sync ablegt.
export const INBOX_DIR = path.resolve(VAULT_DIR, "_Inbox");
export const INBOX_PROCESSED_DIR = path.resolve(INBOX_DIR, "_processed");
export const INBOX_REJECTED_DIR = path.resolve(INBOX_DIR, "_rejected");

// Clippings: Obsidian Web Clipper Ziel + Roh-Clippings-Ablage.
// Der classify-clippings.ts Vorfilter verschiebt MS-AI-relevante Files nach
// INBOX_DIR, nicht-relevante bleiben hier.
export const CLIPPINGS_DIR = path.resolve(VAULT_DIR, "Clippings");
