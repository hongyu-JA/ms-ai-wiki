import fs from "node:fs";
import yaml from "js-yaml";
import { PRODUCTS_YAML, SOURCES_YAML } from "./paths.js";

export type Watch = "close" | "standard" | "passive";

export interface Product {
  slug: string;
  note: string;
  primary_home_moc: string;
  tier: 1 | 2 | 3;
  watch: Watch;
  keywords: string[];
  regex_exclude?: string[];
  sources: string[];
  changelog_trigger_sections: string[];
  last_seen?: string;
  enabled?: boolean;
}

export interface Source {
  id: string;
  tier: "A" | "B" | "C";
  type: "rss" | "atom" | "json-feed" | "github-releases" | "html";
  url: string;
  covers: string[];
  item_id_field?: string;
  enabled: boolean;
}

export interface ProductsConfig {
  products: Product[];
}

export interface SourcesConfig {
  sources: Source[];
}

export function loadProducts(): Product[] {
  const text = fs.readFileSync(PRODUCTS_YAML, "utf8");
  const parsed = yaml.load(text) as ProductsConfig;
  return (parsed.products ?? []).filter((p) => p.enabled !== false);
}

/**
 * Lädt alle Produkte — auch `enabled: false`. Für Index-Rebuild notwendig,
 * weil auch deaktivierte Stubs in der Wissensbasis gezählt werden sollen.
 */
export function loadAllProducts(): Product[] {
  const text = fs.readFileSync(PRODUCTS_YAML, "utf8");
  const parsed = yaml.load(text) as ProductsConfig;
  return parsed.products ?? [];
}

export function loadSources(): Source[] {
  const text = fs.readFileSync(SOURCES_YAML, "utf8");
  const parsed = yaml.load(text) as SourcesConfig;
  return (parsed.sources ?? []).filter((s) => s.enabled !== false);
}

export function watchFrequencyDays(watch: Watch): number {
  switch (watch) {
    case "close":
      return 1;
    case "standard":
      return 7;
    case "passive":
      return 30;
  }
}
