import fs from "node:fs";
import Anthropic from "@anthropic-ai/sdk";
import { PROMPT_SYSTEM } from "./paths.js";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
const MAX_TOKENS = Number(process.env.ANTHROPIC_MAX_TOKENS ?? 1200);

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

function extractJson(text: string): string {
  // Strip accidental code fences / prose.
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fence) return fence[1]!.trim();
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first >= 0 && last > first) return text.slice(first, last + 1);
  return text.trim();
}

/**
 * Call Claude with prompt-caching on the system prompt.
 * In DRY_RUN mode (no API key, or DRY_RUN=1), synthesize a deterministic
 * stub patch so the pipeline is runnable end-to-end without an API key.
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
    messages: [{ role: "user", content: userPrompt }],
  });
  const out = resp.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("\n");
  const jsonText = extractJson(out);
  return JSON.parse(jsonText) as PatchDecision;
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
