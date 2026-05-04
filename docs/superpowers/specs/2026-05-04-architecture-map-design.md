---
type: spec
created: 2026-05-04
owner: Hongyu
status: approved
sub_project: B (Architecture Interaction Map)
parent_vision: KB visual presentation layer
related_specs:
  - 2026-05-03-web-catalog-design.md (Sub-Project A — depends on `web/` codebase)
---

# Spec: Architecture Interaction Map (Sub-Project B)

## 1. Kontext & Vision

Sub-Project A liefert einen Browse-/Filter-Catalog der 45 KB-Notes. Christoph
(im Meeting 2026-05-04) hat **explizit** das Wichtigste benannt:

> "Wie hängen jetzt alles miteinander zusammen, wann nutzt man was."

Eine Karte alphabetisch sortierter Karten beantwortet diese Frage **nicht**.
Christoph braucht eine **Architektur-Sicht** mit **expliziten typisierten
Kollaborations-Beziehungen** zwischen den Tools — wie Microsoft selbst seine
Reference Architectures dokumentiert.

Sub-Project B liefert genau das: eine **Interactive Architecture Map** als
zusätzliche View neben Grid und Table. Die Daten sind teils auto-extrahiert
(aus Wikilinks), teils kuratiert (typisierte Beziehungen mit Beschreibung).
Hover auf Knoten zeigt das vollständige Upstream-/Downstream-Workflow,
Hover auf eine Kante öffnet ein Tooltip mit der konkreten Kollaborations-
Erklärung.

Diese View ist das **zentrale Demo-Material** für die Präsentation Ende der
Woche an Christoph (Philipp ist verhindert).

## 2. Ziele

1. **Architektur-Sicht** — 7 Layer (Surface bis Foundation), 41 wichtige
   Tools im Stack, Layer als horizontale Bänder mit klarer Farbe
2. **Typisierte Kollaborations-Beziehungen** — 6 Edge-Typen (uses,
   hosted-on, grounds-on, secured-by, calls, integrated-via), je mit
   eigener Linien-Farbe und Beschreibung
3. **Hover-Interaktion** —
   - Knoten: alle direkten Upstream- und Downstream-Edges hervorheben,
     Rest auf 15% Opacity faden
   - Kante: Tooltip mit 1–2 Sätzen Konkret-Information
4. **Filter** (reuse von Sub-Project A) — Tier, Watch, Status filtern auch
   die Map
5. **Cross-Link** zu Sub-Project A — Klick auf Knoten öffnet die Detail-Page
   der Note (`/products/<slug>`)
6. **Demo-tauglich am Freitag** — funktionsfähig, sauber, präsentierbar

**Erfolgskriterium:** Christoph kann in der Demo per Mouse über Tools fahren
und sofort sehen welche Tools mit welchen wie zusammenarbeiten — ohne dass
Hongyu eine einzige Folie erklären muss.

## 3. Non-Goals (out-of-scope)

- ❌ **MOC-Hierarchie als Treemap/Sunburst** — die original-Sub-Project-B-
  Idee. Verworfen, weil Christoph konkret nach Kollaboration fragt, nicht
  nach Taxonomie
- ❌ **Decision Tree / Wizard** — gehörte in Sub-Project C/E, nicht hier
- ❌ **Auto-extrahierte Wikilinks als Edges** — verworfen für Demo, wird
  Hairball. Die `[[Wikilink]]`-Daten werden NICHT als Map-Edges genutzt.
  Wikilinks bleiben in den Detail-Pages (Sub-Project A) als Hyperlinks
  bestehen
- ❌ **Plain-Language-Sicht / Dual-Tone** — Sub-Project C
- ❌ **Periodischer Change-Log Digest** — Sub-Project D
- ❌ **Teams Bot Integration** — Sub-Project E
- ❌ **Edit-UI für Collaborations** — Hongyu pflegt YAML manuell
- ❌ **Dynamische Layout-Algorithmen** (z.B. force-directed pure) — Layer
  sind feste horizontale Bänder, nicht ausverhandelt durch Physik

## 4. Architektur

### 4.1 Datenfluss

```
┌──────────────────────────────────────┐
│  MS_AI_Wiki/.../Products/*.md         │
│  + .automation/products.yaml          │
│  → existing loadProducts() liefert    │
│    slug, displayName, tier, watch,    │
│    primaryHomeMoc, status              │
└──────────────────┬──────────────────┘
                   │
                   │ + (NEU)
                   ▼
┌──────────────────────────────────────┐
│  web/data/architecture-layers.yaml    │
│  → Pro Tool-Slug: layer-Zuordnung     │
│    + side-band-Annotation              │
└──────────────────┬──────────────────┘
                   │
                   │ + (NEU)
                   ▼
┌──────────────────────────────────────┐
│  web/data/collaborations.yaml         │
│  → ~30 typisierte Edges:              │
│    {source, target, type, description}│
└──────────────────┬──────────────────┘
                   │
                   │ Build-Zeit-Merge
                   ▼
┌──────────────────────────────────────┐
│  web/src/lib/load-architecture.ts     │
│  → Liefert ArchitectureGraph:         │
│    {nodes: ArchNode[],                │
│     edges: ArchEdge[]}                │
└──────────────────┬──────────────────┘
                   │ Astro page → React island
                   ▼
┌──────────────────────────────────────┐
│  web/src/components/ArchMap.tsx       │
│  → D3.js + React rendering            │
│    SVG, Hover-Interaktionen, Filter   │
└──────────────────────────────────────┘
```

### 4.2 Layer-Struktur

7 Layer, vertikal gestapelt (Surface oben, Foundation unten). Jeder Layer ist
ein **horizontales Band** mit eigener Hintergrund-Farbe. Tools werden innerhalb
ihres Bands per `forceX` simuliert, vertikal sind sie an die Layer-Y-Position
gepinnt (`forceY` mit hoher Strength).

| # | Layer | Was es ist | Farbe (Bg/Fg) |
|---|---|---|---|
| 1 | **SURFACE** | User-Touchpoint | `#fef3c7` / `#06c` |
| 2 | **AGENT BUILDING** | Logic Frameworks (Code + Low-Code) | `#dbeafe` / `#2563eb` |
| 3 | **HOSTING** | Runtime / Compute / Gateway | `#f3e8ff` / `#7c3aed` |
| 4 | **KNOWLEDGE** | Grounding-Datenquellen | `#d1fae5` / `#059669` |
| 5 | **CONTENT PROCESSING** | Spezialisierte AI-Services (Doc/Image) | `#cffafe` / `#0891b2` |
| 6 | **GOVERNANCE & IDENTITY** | Trust / Compliance / Sec | `#fee2e2` / `#dc2626` |
| 7 | **FOUNDATION** | Modelle + Protokolle + Plattform | `#fed7aa` / `#ea580c` |

### 4.3 Tool-Zuordnung (41 Tools in Layern + 5 Side-Band)

**1. SURFACE** (1):
- microsoft-365-copilot

**2. AGENT BUILDING** (8 — 5 aktiv + 3 deprecated):
- microsoft-agent-framework
- copilot-studio
- m365-agents-sdk
- teams-sdk
- power-automate
- bot-framework (deprecated)
- semantic-kernel (deprecated)
- autogen (deprecated)

**3. HOSTING** (5):
- foundry-agent-service
- azure-functions
- azure-container-apps
- apim-ai-gateway
- logic-apps

**4. KNOWLEDGE** (8):
- azure-ai-search
- foundry-iq
- microsoft-graph
- copilot-connectors
- dataverse
- dataverse-mcp-server
- fabric-data-agents
- cosmos-db-for-ai

**5. CONTENT PROCESSING** (3):
- foundry-tools
- azure-ai-document-intelligence
- azure-ai-content-understanding

**6. GOVERNANCE & IDENTITY** (8):
- entra-agent-id
- agent-365
- microsoft-entra-suite
- microsoft-purview
- purview-dspm
- purview-data-map
- defender-for-ai
- azure-ai-content-safety

**7. FOUNDATION** (7):
- microsoft-foundry
- foundry-models
- foundry-control-plane
- foundry-sdks
- foundry-local
- model-context-protocol
- azure-openai-responses-api

**Side-Bands** (5 — als Annotation auf Tool-Knoten, nicht eigener Layer):
- microsoft-365-e7 (commercial bundle)
- azure-openai-pricing (commercial)
- ms-ai-dev-tooling (devex)
- dynamics-365-agents (vertical)
- azure-machine-learning (legacy ML)

Diese 5 Side-Band-Tools werden **nicht in der Map angezeigt**, oder optional
als "Show side-bands" Toggle. v1: weglassen.

### 4.4 Edge-Typen (6)

| # | Typ | Bedeutung | Linie | Marker |
|---|---|---|---|---|
| 1 | **uses** | Surface ruft Logic auf | Solid blau `#1e3a8a` | Pfeil |
| 2 | **hosted-on** | Logic deployed in Runtime | Solid lila `#581c87` | Pfeil |
| 3 | **grounds-on** | Logic queries Knowledge | Solid grün `#065f46` | Pfeil |
| 4 | **secured-by** | Identity wraps Logic | Dashed rot `#991b1b` | Pfeil |
| 5 | **calls** | Inference / Foundation-Aufruf | Solid orange `#7c2d12` | Pfeil |
| 6 | **integrated-via** | Cross-Layer-Protokoll-Brücke (MCP, Connectors) | Dotted türkis `#0891b2` | Pfeil + Label |

### 4.5 Visualisierungs-Tech

**D3.js inside React island** (`client:load`).

- D3 v7+ (modules: `d3-force`, `d3-selection`, `d3-drag`)
- Force-Layout: `forceY(layer.y).strength(1)` pinnt Tools an Layer,
  `forceX(width/2)` zieht zur Mitte, `forceCollide(nodeRadius)` verhindert
  Überlappung, `forceLink(edges)` zieht verbundene Knoten enger zusammen
- React-Rolle: SVG-ref bereitstellen, hover-state managen, Filter-State
  syncen. D3 manipuliert die DOM direkt unter dem Ref.
- Bundle-Größe: D3 modules ~50 KB gzipped (akzeptabel für eine separate page)

### 4.6 Hover-Interaktion

**Hover Node:**
- Find all edges where `node === edge.source || node === edge.target`
- Find connected nodes (one-hop neighbors)
- Set CSS class `dimmed` on all other nodes/edges (opacity 0.15)
- Set CSS class `highlighted` on connected ones (opacity 1, stroke-width +50%)
- The hovered node itself: yellow glow stroke (3px `#fbbf24`)
- "Full chain" mode: optional Shift+hover triggert transitive
  multi-hop highlight (z.B. MAF → AI Search → Foundry Models)

**Hover Edge:**
- Cursor approaches edge → small tooltip (200px wide, dark theme) appears
  with offset above mouse position
- Tooltip content:
  - Top label: `<TYPE>` in small caps, edge color
  - Below: `description` from collaborations.yaml (1–2 sentences)
  - Optional: source-doc-link if description references a Note
- Tooltip follows cursor with `mousemove`, hides on `mouseleave`

### 4.7 Filter (reuse von A)

Existing `useCatalogFilters` hook returns `filtered: ProductData[]`.
ArchMap component subscribes to `filtered` — nodes whose slug is NOT in
`filtered` get class `filtered-out` (opacity 0.05, no pointer events).
Edges with either endpoint filtered-out: also dimmed.

URL-state preserved (same `?tier=1&moc=...&q=...` params).

## 5. Komponenten

### 5.1 Datenfiles

**`web/data/architecture-layers.yaml`:**

```yaml
layers:
  - id: surface
    name: SURFACE
    description: User-Touchpoint
    order: 1
    color_bg: "#fef3c7"
    color_fg: "#06c"
    members: [microsoft-365-copilot]
  - id: agent-building
    name: AGENT BUILDING
    description: Logic Frameworks
    order: 2
    color_bg: "#dbeafe"
    color_fg: "#2563eb"
    members:
      - microsoft-agent-framework
      - copilot-studio
      - m365-agents-sdk
      - teams-sdk
      - power-automate
      - bot-framework
      - semantic-kernel
      - autogen
  # ... 5 weitere Layer
```

**`web/data/collaborations.yaml`:**

```yaml
collaborations:
  - source: microsoft-agent-framework
    target: foundry-models
    type: calls
    description: |
      MAF agent calls Foundry Models for LLM inference. Choose model based on
      workload (GPT-4o for reasoning, Phi-4 for cost). PAYG vs PTU pricing
      depending on volume.
  - source: microsoft-agent-framework
    target: azure-ai-search
    type: grounds-on
    description: |
      MAF agent uses Azure AI Search SDK for vector/hybrid retrieval. CH-North
      verfügbar. Doc-level security via Entra. Agentic Retrieval (GA 2025) gibt
      +40% relevance vs traditional vector search.
  - source: microsoft-agent-framework
    target: foundry-agent-service
    type: hosted-on
    description: |
      Managed Hosting für MAF-Agents in Azure. Aktuell nur North Central US —
      DSGVO-Implication für EU-Kunden klären. Alternative: self-host on
      Azure Functions oder Container Apps.
  - source: microsoft-agent-framework
    target: entra-agent-id
    type: secured-by
    description: |
      Jeder MAF-Agent bekommt eine eigene Entra Agent ID. Voraussetzung für
      Conditional Access auf Agents. Sponsor-Konzept als DSGVO-Workaround.
  # ... ~26 weitere Edges
```

**Schätzung Edge-Anzahl pro Typ:**

| Typ | Anzahl |
|---|---|
| uses | 4–6 (Surface → Logic) |
| hosted-on | 5–7 (Logic → Hosting) |
| grounds-on | 6–8 (Logic → Knowledge) |
| secured-by | 4–5 (Identity → Logic, sparingly) |
| calls | 6–8 (Logic + Knowledge → Foundation) |
| integrated-via | 3–5 (MCP/Connector bridges) |
| **Gesamt** | **~30** |

### 5.2 Loader Library

**`web/src/lib/load-architecture.ts`:**

```typescript
import yaml from "js-yaml";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadProducts, type Product } from "./load-products";

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
  slug: string;
  displayName: string;
  layer: string;
  layerOrder: number;
  tier: 1 | 2 | 3;
  watch: "close" | "standard" | "passive";
  status: "ga" | "preview" | "deprecated" | "eos";
  isDeprecated: boolean;
}

export type EdgeType =
  | "uses" | "hosted-on" | "grounds-on"
  | "secured-by" | "calls" | "integrated-via";

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

export async function loadArchitecture(): Promise<ArchitectureGraph> {
  // Parallel: products + 2 yaml files
  const [products, layersYaml, collabYaml] = await Promise.all([
    loadProducts(),
    readYaml<{ layers: Layer[] }>("../data/architecture-layers.yaml"),
    readYaml<{ collaborations: ArchEdge[] }>("../data/collaborations.yaml"),
  ]);

  const layers = layersYaml.layers;
  const layerBySlug = new Map<string, Layer>();
  for (const layer of layers) {
    for (const m of layer.members) layerBySlug.set(m, layer);
  }

  // Build nodes from products + layers
  const nodes: ArchNode[] = [];
  for (const p of products) {
    const layer = layerBySlug.get(p.slug);
    if (!layer) continue; // Side-band tool, not in map
    nodes.push({
      slug: p.slug,
      displayName: p.displayName,
      layer: layer.id,
      layerOrder: layer.order,
      tier: p.tier,
      watch: p.data.watch ?? "standard",
      status: p.data.status ?? "ga",
      isDeprecated: p.isDeprecated,
    });
  }

  // Validate edges: source + target must exist in nodes
  const slugSet = new Set(nodes.map(n => n.slug));
  const edges: ArchEdge[] = [];
  for (const e of collabYaml.collaborations) {
    if (!slugSet.has(e.source) || !slugSet.has(e.target)) {
      console.warn(`[arch] edge skipped: ${e.source} → ${e.target} (unknown slug)`);
      continue;
    }
    edges.push(e);
  }

  return { layers, nodes, edges };
}

function readYaml<T>(relativePath: string): T {
  const p = resolve(process.cwd(), relativePath);
  return yaml.load(readFileSync(p, "utf8")) as T;
}
```

### 5.3 Page

**`web/src/pages/architecture.astro`:**

```astro
---
import "../styles/global.css";
import { loadArchitecture } from "../lib/load-architecture";
import Header from "../components/Header.astro";
import ArchMap from "../components/ArchMap";

const graph = await loadArchitecture();
---
<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MS AI Wiki — Architecture Map</title>
  </head>
  <body>
    <Header current="architecture" subtitle="Architektur-Karte · Tool-Kollaboration" />
    <main class="p-4">
      <ArchMap client:load graph={graph} />
    </main>
  </body>
</html>
```

### 5.4 Header.astro Update

Add 3rd tab `Architecture`:

```astro
<nav class="flex gap-2">
  <a href="/" class={navClass(current === "grid")}>Grid</a>
  <a href="/table" class={navClass(current === "table")}>Table</a>
  <a href="/architecture" class={navClass(current === "architecture")}>Architecture</a>
</nav>
```

URL-State (filter params) preserve via existing inline-script in Header.astro.

### 5.5 ArchMap Component

**`web/src/components/ArchMap.tsx`:** (~300 lines)

Skeletal structure:

```tsx
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { ArchitectureGraph, ArchNode, ArchEdge } from "../lib/load-architecture";

interface Props {
  graph: ArchitectureGraph;
}

const EDGE_STYLES: Record<EdgeType, { color: string; dash: string; label: string }> = {
  "uses":           { color: "#1e3a8a", dash: "0",     label: "uses" },
  "hosted-on":      { color: "#581c87", dash: "0",     label: "hosted-on" },
  "grounds-on":     { color: "#065f46", dash: "0",     label: "grounds-on" },
  "secured-by":     { color: "#991b1b", dash: "4,2",   label: "secured-by" },
  "calls":          { color: "#7c2d12", dash: "0",     label: "calls" },
  "integrated-via": { color: "#0891b2", dash: "1,3",   label: "integrated-via" },
};

export default function ArchMap({ graph }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<ArchEdge | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{x: number; y: number}>({x: 0, y: 0});

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    // ... layer-band-render, force-simulation, drag, hover-bindings ...
  }, [graph]);

  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full" style={{ height: "calc(100vh - 120px)" }} />
      {hoveredEdge && (
        <div
          className="absolute pointer-events-none bg-gray-900 text-white p-3 rounded-md shadow-lg max-w-xs"
          style={{ left: tooltipPos.x, top: tooltipPos.y, transform: "translate(-50%, -100%)" }}
        >
          <div className="text-xs uppercase font-bold tracking-wide" style={{ color: EDGE_STYLES[hoveredEdge.type].color }}>
            {hoveredEdge.type}
          </div>
          <div className="text-sm mt-1 leading-relaxed">{hoveredEdge.description}</div>
        </div>
      )}
    </div>
  );
}
```

Render-Pipeline (im useEffect):

1. **Layer-Bänder** — pro Layer ein `<rect>` mit voller Breite, Höhe = `containerHeight / 7`, plus Layer-Label links
2. **Edges** — `<path>` (für gekrümmte Linien) oder `<line>` (gerade), color/dash aus `EDGE_STYLES[type]`. Marker-end Pfeil.
3. **Nodes** — `<g>` mit `<circle>` + `<text>`. Radius nach Tier (T1=14, T2=11, T3=9). Fill nach Layer-Farbe. Stroke 2px white default.
4. **Force simulation** — `forceY` an Layer-Y-Position (Strength 1), `forceX` mid (0.05), `forceCollide` (radius+4), `forceLink` (distance 80, strength 0.3 — locker).

### 5.6 ArchMap Filter Integration

ArchMap subscribes to existing `useCatalogFilters` hook. Filter-Bar in Header zeigt — wenn aktiv — auch auf Architecture-Page Wirkung. Filtered-out nodes bekommen CSS-Class `filtered-out` (opacity 0.05, pointer-events none, ihre Edges auch dimmed).

## 6. Daten-Flow

1. **Build-Zeit (astro build):**
   - Astro lädt `architecture.astro`
   - Frontmatter ruft `loadArchitecture()` auf
   - Loader liest `products.yaml`, `architecture-layers.yaml`, `collaborations.yaml`
   - Liefert `{layers, nodes, edges}` JSON-serialisiert in der Page als Astro-Prop
2. **Hydrate (Browser):**
   - React island `ArchMap` mountet mit graph-Daten als Prop
   - useEffect startet D3-Force-Simulation
   - SVG rendert binnen ~500ms zur Stabilität
3. **Interaktion:**
   - Hover Node → React state `hoveredNode` updated → SVG-CSS-Klassen flippen (durch React-Rerender oder D3-direct)
   - Hover Edge → React state `hoveredEdge` updated + tooltipPos → Tooltip-DIV-Render
4. **Click Node** → `window.location = /products/${slug}` — navigates to Sub-Project A detail page
5. **Filter-Change** → graph-Subset wird neu gerendert (oder filtered nodes nur dimmed)

## 7. Acceptance Test

| # | Aktion | Erwartung |
|---|---|---|
| 1 | `/architecture` öffnen | Page lädt, 7 Layer-Bänder sichtbar, ~41 Knoten erscheinen, ~30 Kanten zwischen ihnen |
| 2 | Layer-Bänder farbig korrekt | Surface oben gelb, Foundation unten orange, etc. |
| 3 | Knoten in richtigem Layer | MAF in BUILDING (blau), Foundry Models in FOUNDATION (orange) |
| 4 | Hover MAF | Edges zu Foundry-Models, AI-Search, Foundry-AS, Entra-Agent-ID hervorgehoben; alle anderen Knoten/Kanten auf 15% Opacity |
| 5 | Hover Edge "MAF → Foundry Models" | Tooltip erscheint mit "calls" + Beschreibung "MAF agent calls Foundry Models for LLM inference..." |
| 6 | Klick auf MAF Knoten | Navigation zu `/products/microsoft-agent-framework` |
| 7 | URL `?tier=1` direkt aufrufen | Tier-1-Knoten normal, Tier-2/3 auf 5% Opacity |
| 8 | Header Toggle "Grid" → zurück zu Architecture | Filter-State erhalten (URL-Params bleiben) |
| 9 | Mobile-Viewport | Map skaliert, Layer-Bänder bleiben sichtbar, Tooltip nicht zu groß |
| 10 | `bun run build` | Build durchläuft ohne Errors, dist enthält `architecture/index.html` mit eingebettetem Graph-JSON |

## 8. Risiken & Mitigationen

| Risiko | Wahrscheinlich | Impact | Mitigation |
|---|---|---|---|
| Force-Simulation produziert hässliches Layout | Mittel | Hoch | Manuelles `initialPosition` per Tool aus YAML als Fallback. `simulation.alpha(0)` nach Stabilisierung. |
| Edges überlappen, kreuzen wild | Hoch | Mittel | Curved edges (Bézier) helfen; Edge-Dichte limitieren auf ~30 |
| D3 Bundle zu groß | Niedrig | Niedrig | D3 modules tree-shake gut. ~50 KB gzipped erwartet |
| YAML-Pflege wird Last | Mittel | Mittel | ~30 Edges sind manuell pflegbar. Audit-Skript (separate Task) prüft Konsistenz |
| Knoten verdeckt Tooltip | Mittel | Niedrig | Tooltip-Position mit edge-detection (drücke nach unten wenn oben kein Platz) |
| Mobile Performance schlecht (45 Knoten + 30 Kanten + force-simulation) | Niedrig | Niedrig | Force-simulation läuft ~500ms zur Stabilität, dann stoppen. Reines SVG ist für 70 Elemente trivial. |
| Filter dimmt zu stark — Kontext geht verloren | Niedrig | Mittel | Opacity 0.05 statt 0 — Knoten bleiben sichtbar als Layout-Hint |

## 9. Implementations-Reihenfolge

1. **Datenfiles** schreiben:
   - `web/data/architecture-layers.yaml` (7 Layer × Tools)
   - `web/data/collaborations.yaml` (~30 Edges, manuell aus KB-Wissen kuratiert)
2. `web/src/lib/load-architecture.ts` (loader + Validation)
3. `web/src/pages/architecture.astro` (page skeleton + ArchMap mount)
4. `web/src/components/Header.astro` Update — 3rd tab "Architecture"
5. `web/src/components/ArchMap.tsx` v0 — static layout (no force, fixed positions per layer, hardcoded Y, computed X)
6. ArchMap v1 — D3 force simulation hinzufügen (forceY pinning + forceX center)
7. ArchMap v2 — Edges mit color + dash + Pfeil
8. ArchMap v3 — Hover Node Highlight (full chain)
9. ArchMap v4 — Hover Edge Tooltip
10. ArchMap v5 — Klick Node → Detail-Page
11. ArchMap v6 — Filter-Integration (useCatalogFilters)
12. Acceptance Test §7 durchlaufen
13. Update root + web/ README mit /architecture link
14. PR

## 10. Follow-ups (out-of-scope für B)

- Auto-extract Wikilinks als optional "Show all" toggle (führt sicher zu Hairball, daher nicht v1)
- Side-Band Toggle "Show Commercial / Legacy" (E7, AML)
- Edge-Highlight-Animation (subtle pulse on hover)
- Export Graph as PNG für Folien
- Print-CSS für Architektur-Poster
- Sub-Project D Change-Log Digest baut auf diese Map auf (highlighted "what changed since last week")

## Changelog

- 2026-05-04: Initial-Spec aus Brainstorming-Session.
- 2026-05-04: Implementation komplett (Task 1–8). Subagent-driven mit Code-Reviews
  pro Task. Bekannte Anpassungen vom Plan: foundry-tools aus content-processing
  entfernt (Parent/Child-Konflikt) → 39 statt 41 Tools. urlSlug-Feld auf ArchNode
  hinzugefügt damit Click-Navigation für deprecated Tools funktioniert.
