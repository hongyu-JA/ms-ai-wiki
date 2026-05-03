import { getCollection, type CollectionEntry } from "astro:content";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import yaml from "js-yaml";

interface ProductYaml {
  slug: string;
  note: string;
  primary_home_moc?: string;
  tagline?: string;
  tier: 1 | 2 | 3;
  watch?: "close" | "standard" | "passive";
  enabled?: boolean;
}

export type Product = CollectionEntry<"products"> & {
  slug: string;
  isDeprecated: boolean;
  primaryHomeMoc: string | null;
  tier: 1 | 2 | 3;
  tagline: string;
  displayName: string;
};

/**
 * Liest alle Products aus der Content Collection, normalisiert die slug,
 * extrahiert die Primary Home MOC aus dem moc[]-Frontmatter und merged
 * tier/tagline aus .automation/products.yaml.
 */
export async function loadProducts(): Promise<Product[]> {
  const yamlPath = resolve(process.cwd(), "../.automation/products.yaml");
  const yamlText = readFileSync(yamlPath, "utf8");
  const yamlDoc = yaml.load(yamlText) as { products: ProductYaml[] };
  // YAML hat unabhaengige Felder `slug` (kanonische ID) und `note` (Dateiname).
  // Astro-glob-loader normalisiert den Dateinamen zu entry.id: lowercase, Leerzeichen→Bindestriche,
  // Slashes bleiben erhalten (Unterverzeichnisse wie deprecated/).
  const normalizeNote = (note: string) =>
    note.replace(/\.md$/i, "").toLowerCase().replace(/ +/g, "-").replace(/[^a-z0-9\-/]/g, "");
  const yamlByNote = new Map(yamlDoc.products.map((p) => [normalizeNote(p.note), p]));

  const raw = await getCollection("products");
  return raw.map((entry) => {
    const slugRaw = entry.id;
    const slug = slugRaw.toLowerCase().replace(/[\s/]+/g, "-").replace(/[^a-z0-9-]/g, "");
    const isDeprecated = slugRaw.startsWith("deprecated/");

    const yamlEntry = yamlByNote.get(slugRaw);
    if (!yamlEntry) {
      console.warn(`[load-products] Kein yaml-Eintrag fuer: ${slugRaw}`);
    }

    const primaryHomeMoc = yamlEntry?.primary_home_moc ?? (
      (entry.data.moc ?? [])
        .map((m) => m.replace(/^\[\[|\]\]$/g, ""))
        .find((m) => m !== "Microsoft MOC") ?? null
    );

    const tier = yamlEntry?.tier ?? 3;
    const tagline = yamlEntry?.tagline ?? "(keine Tagline gepflegt)";
    const displayName = yamlEntry?.note
      ? yamlEntry.note.replace(/\.md$/i, "").replace(/^deprecated\//, "")
      : slugRaw.replace(/^deprecated\//, "");

    return { ...entry, slug, isDeprecated, primaryHomeMoc, tier, tagline, displayName };
  });
}
