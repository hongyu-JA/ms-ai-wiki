import fs from "node:fs";
import Anthropic from "@anthropic-ai/sdk";
import { PROMPT_SYSTEM } from "./paths.js";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
const MAX_TOKENS = Number(process.env.ANTHROPIC_MAX_TOKENS ?? 1500);

export interface PatchDecision {
  decision: "update" | "new_product" | "deprecate" | "skip";
  reason: string;
  confidence: "high" | "medium" | "low";
  changelog_entry: null | { date: string; change: string; source: string };
  section_patches: Array<{
    section: string;
    mode: "append" | "replace";
    new_content: string;
  }>;
  moc_updates: Array<{
    moc: string;
    action: "add_row" | "update_row" | "mark_deprecated";
    payload: Record<string, unknown>;
  }>;
  deprecation_radar_update:
    | null
    | {
        product: string;
        severity: string;
        replaced_by: string | null;
        eos_date: string | null;
        migration_path: string;
      };
}

export function loadSystemPrompt(): string {
  return fs.readFileSync(PROMPT_SYSTEM, "utf8");
}

/**
 * Input-Schema für das `emit_patch`-Tool. Anthropic validiert die vom Modell
 * erzeugte Struktur gegen dieses Schema — damit können wir kein JSON.parse
 * mehr auf rohen Markdown-behafteten Text machen (der Grund für den v0.1-Bug).
 */
const EMIT_PATCH_TOOL = {
  name: "emit_patch",
  description:
    "Gibt den berechneten Patch für die Produkt-Note zurück. Rufe dieses Tool genau einmal auf. Alle Text-Felder sind UTF-8-Strings; JSON-Escapes sind unnötig, da der Server das Escaping übernimmt.",
  input_schema: {
    type: "object" as const,
    properties: {
      decision: {
        type: "string",
        enum: ["update", "new_product", "deprecate", "skip"],
      },
      reason: { type: "string", description: "Ein Satz, warum diese Entscheidung." },
      confidence: { type: "string", enum: ["high", "medium", "low"] },
      changelog_entry: {
        anyOf: [
          { type: "null" },
          {
            type: "object",
            properties: {
              date: { type: "string", description: "YYYY-MM-DD" },
              change: { type: "string" },
              source: { type: "string" },
            },
            required: ["date", "change", "source"],
          },
        ],
      },
      section_patches: {
        type: "array",
        items: {
          type: "object",
          properties: {
            section: {
              type: "string",
              description:
                "Exakter Sektions-Titel aus dem Template, z. B. 'Status & Pricing'.",
            },
            mode: { type: "string", enum: ["append", "replace"] },
            new_content: {
              type: "string",
              description:
                "Markdown-Fragment. Mehrzeilige Tabellen/Listen sind erlaubt — der Server escape't Newlines selbst.",
            },
          },
          required: ["section", "mode", "new_content"],
        },
      },
      moc_updates: {
        type: "array",
        items: {
          type: "object",
          properties: {
            moc: {
              type: "string",
              description: "MOC-Dateiname ohne .md, z. B. 'Agents MOC'.",
            },
            action: {
              type: "string",
              enum: ["add_row", "update_row", "mark_deprecated"],
            },
            payload: {
              type: "object",
              description:
                "Frei geformtes Objekt mit mindestens 'product' und 'columns'.",
            },
          },
          required: ["moc", "action", "payload"],
        },
      },
      deprecation_radar_update: {
        anyOf: [
          { type: "null" },
          {
            type: "object",
            properties: {
              product: { type: "string" },
              severity: {
                type: "string",
                description: "'🔴 akut' | '🟡 mittel' | '🟢 entspannt'",
              },
              replaced_by: { anyOf: [{ type: "null" }, { type: "string" }] },
              eos_date: {
                anyOf: [{ type: "null" }, { type: "string" }],
                description: "YYYY-MM-DD oder null",
              },
              migration_path: { type: "string" },
            },
            required: [
              "product",
              "severity",
              "replaced_by",
              "eos_date",
              "migration_path",
            ],
          },
        ],
      },
    },
    required: [
      "decision",
      "reason",
      "confidence",
      "changelog_entry",
      "section_patches",
      "moc_updates",
      "deprecation_radar_update",
    ],
  },
} as const;

/**
 * Ruft Claude mit erzwungener Tool-Verwendung auf. System-Prompt bleibt
 * prompt-cached (ephemeral). Antwort kommt als `tool_use`-Block mit bereits
 * geparstem `input` — keine Risiken durch Markdown-in-JSON.
 *
 * Dry-Run (DRY_RUN=1 oder fehlender API-Key) gibt einen deterministischen
 * Stub zurück, damit die Pipeline auch ohne API lauffähig bleibt.
 */
export async function askClaudeForPatch(
  systemPrompt: string,
  userPrompt: string,
  ctx: { productSlug: string; sourceId: string; itemTitle: string; itemLink: string },
): Promise<PatchDecision> {
  const dryRun = process.env.DRY_RUN === "1" || !process.env.ANTHROPIC_API_KEY;
  if (dryRun) return dryRunStub(ctx);

  const client = new Anthropic();
  const resp = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [EMIT_PATCH_TOOL],
    tool_choice: { type: "tool", name: EMIT_PATCH_TOOL.name },
    messages: [{ role: "user", content: userPrompt }],
  });

  const toolUse = resp.content.find(
    (b): b is Extract<typeof b, { type: "tool_use" }> => b.type === "tool_use",
  );
  if (!toolUse) {
    const textDump = resp.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n")
      .slice(0, 500);
    throw new Error(
      `Claude returned no tool_use block (stop_reason=${resp.stop_reason}). Text was: ${textDump}`,
    );
  }
  return toolUse.input as PatchDecision;
}

function dryRunStub(ctx: {
  productSlug: string;
  sourceId: string;
  itemTitle: string;
  itemLink: string;
}): PatchDecision {
  const today = new Date().toISOString().slice(0, 10);
  return {
    decision: "update",
    reason: `[DRY_RUN] Stub-Patch für '${ctx.itemTitle}' (Quelle: ${ctx.sourceId}).`,
    confidence: "low",
    changelog_entry: {
      date: today,
      change: `[DRY_RUN] Auto-Sync erkannte neues Item: ${ctx.itemTitle}`,
      source: ctx.itemLink || ctx.sourceId,
    },
    section_patches: [
      {
        section: "Offizielle Referenzen & Monitoring",
        mode: "append",
        new_content: `<!-- dry-run: ${ctx.itemTitle} via ${ctx.sourceId} am ${today} -->`,
      },
    ],
    moc_updates: [],
    deprecation_radar_update: null,
  };
}
