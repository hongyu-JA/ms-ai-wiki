/**
 * Stage 3 — Patch-Applier
 *
 * Liest state/patches.json und wendet jedes Envelope auf den Vault an:
 *  - Note: section_patches (append/replace), Changelog-Zeile, frontmatter.zuletzt_gesichtet
 *  - MOC: add_row / update_row / mark_deprecated in den Produkt-Tabellen
 *  - Deprecation Radar: Zeile einfügen/updaten
 *
 * Wenn DRY_WRITE=1 gesetzt ist, wird nichts geschrieben, nur geloggt.
 */
import fs from "node:fs";
import path from "node:path";
import {
  STATE_PATCHES,
  DEPRECATION_RADAR,
  INBOX_DIR,
} from "./lib/paths.js";
import {
  parseNote,
  serializeNote,
  appendToSection,
  prependChangelogRow,
  bumpZuletztGesichtet,
  findMocNote,
} from "./lib/obsidian.js";
import type { PatchDecision } from "./lib/claude.js";
import type { Product } from "./lib/config.js";
import { updateAllIndices } from "./update-indices.js";
import { archiveInboxFile, rejectInboxFile } from "./lib/inbox.js";

interface PatchEnvelope {
  filtered: {
    product_slug: string;
    variant: string;
    item: {
      title: string;
      link: string;
      source_id: string;
    };
  };
  product: Product | null;
  note_path: string | null;
  decision: PatchDecision;
}

/**
 * Inbox-Item? source_id startet mit "inbox/..." → die Datei liegt im Vault-
 * Unterordner `_Inbox/` und sollte nach Verarbeitung archiviert werden.
 */
function isInboxItem(env: PatchEnvelope): boolean {
  return env.filtered.item.source_id.startsWith("inbox/");
}

/**
 * Rekonstruiert den absoluten Pfad der Inbox-Datei aus der source_id.
 * source_id hat die Form "inbox/<rel-path-ohne-.md>".
 */
function inboxAbsPath(env: PatchEnvelope): string | null {
  const sid = env.filtered.item.source_id;
  if (!sid.startsWith("inbox/")) return null;
  const rel = sid.slice("inbox/".length) + ".md";
  return path.join(INBOX_DIR, rel);
}

const DRY_WRITE = process.env.DRY_WRITE === "1";

function writeFile(p: string, content: string) {
  if (DRY_WRITE) {
    console.log(`[apply] (dry-write) would write ${p} (${content.length} bytes)`);
    return;
  }
  fs.writeFileSync(p, content);
}

function applyToProductNote(envelope: PatchEnvelope, today: string): void {
  const { note_path, decision, filtered } = envelope;
  if (!note_path) return;
  const parsed = parseNote(note_path);
  let body = parsed.body;

  const patches = Array.isArray(decision.section_patches) ? decision.section_patches : [];
  for (const patch of patches) {
    if (patch.mode === "append") {
      body = appendToSection(body, patch.section, patch.new_content);
    } else if (patch.mode === "replace") {
      // Walking-Skeleton: als append behandeln. Eine saubere Replace-Logik
      // kommt wenn wir von Claude häufiger replace-Patches sehen.
      body = appendToSection(body, patch.section, patch.new_content);
    }
  }

  if (decision.changelog_entry) {
    body = prependChangelogRow(
      body,
      decision.changelog_entry.date,
      "auto-sync",
      decision.changelog_entry.change,
      decision.changelog_entry.source,
    );
  } else {
    body = prependChangelogRow(
      body,
      today,
      "auto-sync",
      `Auto-Scan: ${filtered.item.title}`,
      filtered.item.link || filtered.item.source_id,
    );
  }

  const fm = bumpZuletztGesichtet(parsed.frontmatter, today);
  writeFile(note_path, serializeNote(fm, body));
  console.log(`[apply] patched note → ${path.basename(note_path)}`);
}

function applyToMoc(envelope: PatchEnvelope): void {
  const updates = Array.isArray(envelope.decision.moc_updates)
    ? envelope.decision.moc_updates
    : [];
  for (const mu of updates) {
    const mocPath = findMocNote(mu.moc);
    if (!mocPath) {
      console.warn(`[apply] MOC not found: ${mu.moc}`);
      continue;
    }
    const parsed = parseNote(mocPath);
    // Walking-Skeleton: wir hängen einfach eine Notiz unter „Produkte in dieser MOC"
    // an. Echte Tabellen-Mutation kommt in v2.
    const payloadJson = JSON.stringify(mu.payload);
    const note = `<!-- auto-sync: ${mu.action} · ${payloadJson} -->`;
    const newBody = appendToSection(parsed.body, "Produkte in dieser MOC", note);
    writeFile(mocPath, serializeNote(parsed.frontmatter, newBody));
    console.log(`[apply] MOC touched → ${path.basename(mocPath)} (${mu.action})`);
  }
}

function applyToDeprecationRadar(envelope: PatchEnvelope, today: string): void {
  const d = envelope.decision.deprecation_radar_update;
  if (!d) return;
  if (!fs.existsSync(DEPRECATION_RADAR)) {
    console.warn(`[apply] Deprecation Radar not found at ${DEPRECATION_RADAR}`);
    return;
  }
  const parsed = parseNote(DEPRECATION_RADAR);
  const row = `| [[${d.product}]] | ${d.severity} | ${d.replaced_by ?? "—"} | ${
    d.eos_date ?? "TBD"
  } | ${d.migration_path} | auto |`;
  const newBody = appendToSection(parsed.body, "Aktive Migrationen", row);
  const newBody2 = prependChangelogRow(
    newBody,
    today,
    "auto-sync",
    `Deprecation-Signal: ${d.product} (${d.severity})`,
    envelope.filtered.item.link || envelope.filtered.item.source_id,
  );
  writeFile(DEPRECATION_RADAR, serializeNote(parsed.frontmatter, newBody2));
  console.log(`[apply] Deprecation Radar updated`);
}

function main() {
  const envelopes: PatchEnvelope[] = JSON.parse(fs.readFileSync(STATE_PATCHES, "utf8"));
  const today = new Date().toISOString().slice(0, 10);
  let applied = 0;
  let skipped = 0;

  let inboxArchived = 0;
  let inboxRejected = 0;

  for (const env of envelopes) {
    const inbox = isInboxItem(env);
    const inboxPath = inbox ? inboxAbsPath(env) : null;

    if (env.decision.decision === "skip") {
      skipped++;
      // Inbox-Skip: wenn der Grund „Inbox-Item ohne Microsoft-AI-Signal" ist
      // → Datei nach _rejected/ verschieben.
      if (inbox && inboxPath && env.filtered.product_slug === "__inbox_rejected__") {
        if (!DRY_WRITE) {
          rejectInboxFile(inboxPath, env.decision.reason || "kein MS-AI-Signal");
          console.log(`[apply] inbox-reject → ${path.basename(inboxPath)}`);
          inboxRejected++;
        } else {
          console.log(`[apply] (dry-write) would reject inbox ${path.basename(inboxPath)}`);
        }
      }
      continue;
    }
    if (env.decision.decision === "update" || env.decision.decision === "deprecate") {
      applyToProductNote(env, today);
    }
    if (env.decision.decision === "deprecate") {
      applyToDeprecationRadar(env, today);
    }
    if (env.decision.decision === "new_product") {
      console.log(
        `[apply] NEW-PRODUCT candidate flagged — manual triage required: ${env.filtered.item.title}`,
      );
      // Wir erzeugen im Walking-Skeleton keinen Stub automatisch; PR-Reviewer
      // legt manuell eine Note nach Template an. Hook kommt in v2. Für
      // new_product skippen wir auch MOC-Updates — es gibt noch keine Zeile
      // in der MOC-Tabelle, die aktualisiert werden könnte.
      applied++;
      if (inbox && inboxPath) {
        if (!DRY_WRITE) {
          archiveInboxFile(inboxPath, "new_product_candidate");
          console.log(`[apply] inbox-archive (new_product) → ${path.basename(inboxPath)}`);
          inboxArchived++;
        } else {
          console.log(`[apply] (dry-write) would archive inbox ${path.basename(inboxPath)}`);
        }
      }
      continue;
    }
    applyToMoc(env);
    applied++;
    // Normale Inbox-Updates: nach erfolgreicher Verarbeitung archivieren,
    // damit dieselbe Datei nicht beim nächsten Lauf erneut verarbeitet wird.
    if (inbox && inboxPath) {
      if (!DRY_WRITE) {
        archiveInboxFile(inboxPath, `applied: ${env.decision.decision} → ${env.filtered.product_slug}`);
        console.log(`[apply] inbox-archive → ${path.basename(inboxPath)}`);
        inboxArchived++;
      } else {
        console.log(`[apply] (dry-write) would archive inbox ${path.basename(inboxPath)}`);
      }
    }
  }

  console.log(
    `[apply] applied=${applied}, skipped=${skipped}, inbox-archived=${inboxArchived}, inbox-rejected=${inboxRejected}`,
  );

  // Stage 4 — Index-Rebuild. Läuft IMMER (auch ohne Patches), damit Änderungen
  // durch manuelle Edits oder neue Stubs erkannt werden.
  if (process.env.DRY_WRITE !== "1") {
    try {
      updateAllIndices();
    } catch (e) {
      console.warn(
        `[apply] update-indices failed (non-fatal): ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  } else {
    console.log("[apply] (dry-write) update-indices übersprungen");
  }
}

main();
