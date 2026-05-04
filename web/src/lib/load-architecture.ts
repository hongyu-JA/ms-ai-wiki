import yaml from "js-yaml";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadProducts } from "./load-products";

export interface Layer {
  id: string;
  name: string;
  description: string;
  order: number;
  color_bg: string;
  color_fg: string;
  members: string[];
}

export interface ArchNode {
  slug: string;       // YAML slug — used for edge matching (source/target in ArchEdge)
  urlSlug: string;    // URL slug — used for /products/<urlSlug> navigation in Sub-Project A
  displayName: string;
  layer: string;
  layerOrder: number;
  tier: 1 | 2 | 3;
  watch: "close" | "standard" | "passive";
  status: "ga" | "preview" | "deprecated" | "eos";
  isDeprecated: boolean;
}

export type EdgeType =
  | "uses"
  | "hosted-on"
  | "grounds-on"
  | "secured-by"
  | "calls"
  | "integrated-via";

export interface ArchEdge {
  source: string;
  target: string;
  type: EdgeType;
  description: string;
}

export interface ArchitectureGraph {
  layers: Layer[];
  nodes: ArchNode[];
  edges: ArchEdge[];
}

// File-private interfaces matching the YAML file structure for type-cast targets in readYaml.
interface LayersFile {
  layers: Layer[];
}
interface CollabsFile {
  collaborations: ArchEdge[];
}

function readYaml<T>(relativePath: string): T {
  const p = resolve(process.cwd(), relativePath);
  return yaml.load(readFileSync(p, "utf8")) as T;
}

/**
 * Liest architecture-layers.yaml + collaborations.yaml + merged mit
 * loadProducts(). Liefert kompletten Graph für die /architecture Page.
 *
 * Validation:
 * - Edges deren source/target nicht in der Layer-Map sind werden mit
 *   WARN übersprungen (Side-band-Tools, deprecated, etc.)
 * - Layer-Members deren Slug nicht in products.yaml ist werden mit
 *   WARN protokolliert aber als Node trotzdem erzeugt (mit displayName=slug)
 */
export async function loadArchitecture(): Promise<ArchitectureGraph> {
  const products = await loadProducts();
  const layersFile = readYaml<LayersFile>("data/architecture-layers.yaml");
  const collabsFile = readYaml<CollabsFile>("data/collaborations.yaml");

  const layers = layersFile.layers.sort((a, b) => a.order - b.order);
  const layerBySlug = new Map<string, Layer>();
  for (const layer of layers) {
    for (const m of layer.members) {
      if (layerBySlug.has(m)) {
        console.warn(`[arch] Slug ${m} appears in multiple layers — second win.`);
      }
      layerBySlug.set(m, layer);
    }
  }

  // Primär per yamlSlug (kanonisch aus .automation/products.yaml) indexieren,
  // damit architecture-layers.yaml Slugs direkt matchen.
  const productBySlug = new Map(products.map((p) => [p.yamlSlug, p]));

  const nodes: ArchNode[] = [];
  for (const layer of layers) {
    for (const slug of layer.members) {
      const product = productBySlug.get(slug);
      if (!product) {
        console.warn(`[arch] Layer-member ${slug} nicht in products.yaml — skipped.`);
        continue;
      }
      nodes.push({
        slug: product.yamlSlug,
        urlSlug: product.slug,
        displayName: product.displayName,
        layer: layer.id,
        layerOrder: layer.order,
        tier: product.tier,
        watch: product.data.watch ?? "standard",
        // status is rarely set in product frontmatter; "ga" is a safe rendering default.
        // Use isDeprecated for ground truth on deprecated tools (path-based, more reliable).
        status: product.data.status ?? "ga",
        isDeprecated: product.isDeprecated,
      });
    }
  }

  const slugSet = new Set(nodes.map((n) => n.slug));
  const edges: ArchEdge[] = [];
  for (const e of collabsFile.collaborations) {
    if (!slugSet.has(e.source)) {
      console.warn(`[arch] Edge skipped — unknown source: ${e.source}`);
      continue;
    }
    if (!slugSet.has(e.target)) {
      console.warn(`[arch] Edge skipped — unknown target: ${e.target}`);
      continue;
    }
    edges.push(e);
  }

  return { layers, nodes, edges };
}
