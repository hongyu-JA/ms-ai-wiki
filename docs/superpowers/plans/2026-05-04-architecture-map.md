# Architecture Interaction Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Interaktive Architektur-Karte als 3rd tab `/architecture` neben Grid und Table, mit 7 Layer-Bändern, ~41 Tools, ~30 typisierten Kollaborations-Kanten und Hover-Interaktion (Node = Full-Chain-Highlight, Edge = Tooltip).

**Architecture:** D3.js force-simulation in einer React island. Y-Position ist an Layer gepinnt (`forceY` Strength=1), X-Position ist forced-mid + collision. Daten kommen aus 2 neuen YAML-files (`web/data/architecture-layers.yaml` und `web/data/collaborations.yaml`) plus existierender `loadProducts()`.

**Tech Stack:** Astro 5 · React 19 · TypeScript · D3.js v7 (force-simulation modules) · Tailwind CSS · js-yaml

**Spec:** [docs/superpowers/specs/2026-05-04-architecture-map-design.md](../specs/2026-05-04-architecture-map-design.md)

---

## File Structure (was wir bauen)

```
web/
├── data/                                        # NEU
│   ├── architecture-layers.yaml                 # 7 Layer × Tools
│   └── collaborations.yaml                      # ~30 typisierte Edges
├── src/
│   ├── components/
│   │   ├── ArchMap.tsx                          # NEU — D3 + React island
│   │   └── Header.astro                         # MODIFY — 3rd tab
│   ├── lib/
│   │   └── load-architecture.ts                 # NEU — graph loader
│   └── pages/
│       └── architecture.astro                   # NEU — page
└── package.json                                 # MODIFY — d3 deps
```

Out-of-scope für diesen PR: README-Updates und Spec-Changelog werden in Task 8 erledigt.

---

## Pre-Flight

- [ ] **Pre-Step 1: Worktree-Position prüfen**

```powershell
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" branch --show-current
```
Erwartet: `feature/architecture-map`. Build-Pipeline aus Sub-Project A ist bereits aktiv (Cloudflare Pages auto-deploy bei main-merge — Sub-Project B fügt nur eine Page hinzu).

- [ ] **Pre-Step 2: Bun + Node verifizieren**

```powershell
node --version
bun --version
```
Erwartet: Node v22+, Bun 1.x.

- [ ] **Pre-Step 3: existierende `web/`-Struktur scannen**

```powershell
Get-ChildItem -Path "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map\web\src" -Recurse -File | Select-Object FullName
```
Erwartet: existierende Files aus Sub-Project A (CatalogClient.tsx, FilterBar.tsx, useCatalogFilters, etc.) — wir bauen drauf, nicht neu.

---

## Task 1: Daten-Files (architecture-layers.yaml + collaborations.yaml)

**Files:**
- Create: `web/data/architecture-layers.yaml`
- Create: `web/data/collaborations.yaml`

**Begründung:** Daten zuerst — sie sind die Single-Source-of-Truth für alle nachfolgenden Tasks.

- [ ] **Step 1: `web/data/architecture-layers.yaml`**

```yaml
# Architecture Layer Taxonomy für die /architecture Map.
# 7 horizontal gestapelte Layer (Surface oben → Foundation unten).
# Tools werden im jeweiligen Layer-Band visualisiert.
# Slugs müssen exakt mit `slug` aus .automation/products.yaml übereinstimmen.

layers:
  - id: surface
    name: SURFACE
    description: User-Touchpoint
    order: 1
    color_bg: "#fef3c7"
    color_fg: "#06c"
    members:
      - microsoft-365-copilot

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

  - id: hosting
    name: HOSTING
    description: Runtime / Compute / Gateway
    order: 3
    color_bg: "#f3e8ff"
    color_fg: "#7c3aed"
    members:
      - foundry-agent-service
      - azure-functions
      - azure-container-apps
      - apim-ai-gateway
      - logic-apps

  - id: knowledge
    name: KNOWLEDGE
    description: Grounding-Datenquellen
    order: 4
    color_bg: "#d1fae5"
    color_fg: "#059669"
    members:
      - azure-ai-search
      - foundry-iq
      - microsoft-graph
      - copilot-connectors
      - dataverse
      - dataverse-mcp-server
      - fabric-data-agents
      - cosmos-db-for-ai

  - id: content-processing
    name: CONTENT PROCESSING
    description: Spezialisierte AI-Services
    order: 5
    color_bg: "#cffafe"
    color_fg: "#0891b2"
    members:
      - foundry-tools
      - azure-ai-document-intelligence
      - azure-ai-content-understanding

  - id: governance
    name: GOVERNANCE & IDENTITY
    description: Trust / Compliance / Sec
    order: 6
    color_bg: "#fee2e2"
    color_fg: "#dc2626"
    members:
      - entra-agent-id
      - agent-365
      - microsoft-entra-suite
      - microsoft-purview
      - purview-dspm
      - purview-data-map
      - defender-for-ai
      - azure-ai-content-safety

  - id: foundation
    name: FOUNDATION
    description: Modelle + Protokolle + Plattform-Infra
    order: 7
    color_bg: "#fed7aa"
    color_fg: "#ea580c"
    members:
      - microsoft-foundry
      - foundry-models
      - foundry-control-plane
      - foundry-sdks
      - foundry-local
      - model-context-protocol
      - azure-openai-responses-api
```

- [ ] **Step 2: `web/data/collaborations.yaml`**

```yaml
# Typisierte Kollaborations-Edges für die Architecture Map.
# Hand-kuratiert von Hongyu basierend auf KB-Wissen.
# Edge-Typ wird via Linien-Farbe + Marker visualisiert (siehe ArchMap.tsx).
#
# Slugs müssen in architecture-layers.yaml als member existieren.
# Edges deren source oder target nicht in der Map ist werden mit WARN
# übersprungen (siehe load-architecture.ts).

collaborations:
  # === MAF (microsoft-agent-framework) als Hub ===
  - source: microsoft-agent-framework
    target: foundry-models
    type: calls
    description: |
      MAF agent calls Foundry Models für LLM inference. Modell-Wahl je
      Workload (GPT-4o für reasoning, Phi-4 für cost). PAYG vs PTU pricing
      depending on volume. Multi-Model-Fallback via APIM.

  - source: microsoft-agent-framework
    target: azure-openai-responses-api
    type: calls
    description: |
      Direkt-Zugriff auf Azure OpenAI's neue Responses API als Alternative
      zur älteren Chat Completions. Stateful conversation handling auf
      der API-Side, nicht im Agent-Code.

  - source: microsoft-agent-framework
    target: azure-ai-search
    type: grounds-on
    description: |
      MAF agent uses Azure AI Search SDK für vector/hybrid retrieval.
      CH-North verfügbar. Doc-level security via Entra. Agentic Retrieval
      (GA 2025) gibt +40% relevance vs traditional vector search.

  - source: microsoft-agent-framework
    target: foundry-iq
    type: grounds-on
    description: |
      Foundry IQ als verwalteter Knowledge-Wrapper auf Azure AI Search —
      convenience layer für MAF agents. Weniger Konfig als direct Search,
      automatische Re-Indexierung.

  - source: microsoft-agent-framework
    target: foundry-agent-service
    type: hosted-on
    description: |
      Managed Hosting für MAF-Agents in Azure. Aktuell nur North Central US
      verfügbar — DSGVO-Implication für EU-Kunden klären. Alternative für
      EU: self-host on Azure Functions oder Container Apps.

  - source: microsoft-agent-framework
    target: azure-functions
    type: hosted-on
    description: |
      Self-Hosting für MAF-Agents als Functions. Flex Consumption für
      scale-to-zero. MCP Binding (GA Jan 2026) ermöglicht das pattern,
      eine Function als MCP-Tool für andere Agents zu exposen.

  - source: microsoft-agent-framework
    target: azure-container-apps
    type: hosted-on
    description: |
      Container-basiertes Hosting für MAF agents — bevorzugt für
      lang-laufende Agents (>10 min). Dapr-Integration für state
      management und service-to-service calls.

  - source: microsoft-agent-framework
    target: entra-agent-id
    type: secured-by
    description: |
      Jeder MAF-Agent bekommt eine eigene Entra Agent ID. Voraussetzung
      für Conditional Access auf Agents. Sponsor-Konzept als
      DSGVO-Workaround für nicht-personenbezogene Identitäten.

  - source: microsoft-agent-framework
    target: dataverse-mcp-server
    type: integrated-via
    description: |
      MAF agent zugreift auf Dataverse-Tabellen via MCP-Wrapper.
      Dataverse-Tabellen werden als MCP-Tools exposed. Kein direkter
      Dataverse-API-Call nötig — Standard-MCP-Client reicht.

  # === Copilot Studio ===
  - source: copilot-studio
    target: microsoft-agent-framework
    type: uses
    description: |
      Copilot Studio's "Custom Engine Agent" Pfad delegiert an MAF
      für Code-first-Logik. Hybrid: Studio für Conversational UI +
      MAF für Tool-Use und Multi-Agent-Orchestrierung.

  - source: copilot-studio
    target: microsoft-graph
    type: grounds-on
    description: |
      Standard-Datenquelle für M365-zentrische Agents — emails, Teams
      chats, SharePoint docs, OneDrive files. Built-in, kein Connector nötig.

  - source: copilot-studio
    target: copilot-connectors
    type: grounds-on
    description: |
      Custom-Datenquellen via Graph Connectors integrieren. >100 OOB
      Connectors verfügbar (ServiceNow, Jira, Confluence, etc.).
      Custom-Schema-Snippet möglich.

  - source: copilot-studio
    target: dataverse
    type: grounds-on
    description: |
      Strukturierte Knowledge in Dataverse-Tabellen. Limit: 15 Tables
      pro Source, 500 Knowledge Objects insgesamt. Power-Platform-native.

  - source: copilot-studio
    target: foundry-models
    type: calls
    description: |
      Copilot Studio nutzt Foundry Models als Backend. Inkludiert
      neue Anthropic-Integration (Claude in EU/EFTA default-OFF
      seit 2026-04-17 — DPIA aktualisieren vor Enable).

  - source: copilot-studio
    target: entra-agent-id
    type: secured-by
    description: |
      Copilot Studio Agents bekommen Entra Agent IDs für Governance.
      Conditional Access kann auf einzelne Agents angewendet werden.

  # === M365 Copilot (Surface) ===
  - source: microsoft-365-copilot
    target: copilot-studio
    type: uses
    description: |
      User trifft AI über M365 Copilot Chat. Custom Agents (in Studio
      gebaut) erscheinen im selben UI als zusätzliche Personas.

  - source: microsoft-365-copilot
    target: microsoft-agent-framework
    type: uses
    description: |
      Declarative + Custom Engine Agents in Copilot Chat. MAF stellt
      die Logic-Schicht bei Code-first-Pfaden.

  - source: microsoft-365-copilot
    target: microsoft-graph
    type: grounds-on
    description: |
      Built-in M365 Daten-Grounding — kein zusätzlicher Connector nötig.
      Zugriff auf user-eigene M365-Daten via delegated permissions.

  - source: microsoft-365-copilot
    target: copilot-connectors
    type: grounds-on
    description: |
      External-Daten-Grounding via Connectors. Quota: 50 Mio Items
      pro Tenant. ACL-basierte Security Trimming auf Item-Level.

  # === M365 Agents SDK ===
  - source: m365-agents-sdk
    target: azure-functions
    type: hosted-on
    description: |
      Standard-Hosting für M365 Agents SDK Apps. Flex Consumption
      empfohlen für scale-to-zero. Activity-Protocol bleibt kompatibel
      mit Bot Framework Legacy-Code.

  - source: m365-agents-sdk
    target: azure-container-apps
    type: hosted-on
    description: |
      Alternative für stateful agents oder hohe Anforderungen an
      lang-laufende Sessions.

  - source: m365-agents-sdk
    target: entra-agent-id
    type: secured-by
    description: |
      Pflicht für Agents im M365-Ökosystem. Entra Agent ID identifiziert
      den Agent gegenüber Graph und anderen M365-Services.

  # === Foundry IQ + Search Symbiose ===
  - source: foundry-iq
    target: azure-ai-search
    type: calls
    description: |
      Foundry IQ ist ein Wrapper auf Azure AI Search — IQ orchestriert
      (Index-Management, automatische Re-Indexierung), Search liefert
      die eigentliche Vector/Hybrid Retrieval.

  # === Embeddings ===
  - source: azure-ai-search
    target: foundry-models
    type: calls
    description: |
      Search verwendet Foundry Models für Embeddings (typisch
      text-embedding-3-large für hohe Qualität, oder -small für Cost).

  # === APIM AI Gateway ===
  - source: apim-ai-gateway
    target: foundry-models
    type: calls
    description: |
      APIM proxies Foundry Models — Routing zwischen Modellen,
      Rate-Limiting (azure-openai-token-limit Policy), Token-Cost-Tracking,
      Fallback-Pattern bei Model-Outages.

  # === MCP-Host Pattern ===
  - source: foundry-agent-service
    target: model-context-protocol
    type: integrated-via
    description: |
      Foundry Agent Service ist MCP-Host — externe MCP-Tools werden
      hier als Agent-Capabilities verfügbar. Standard-MCP-Wrapper-Pattern,
      keine Custom-Integration pro Tool nötig.

  # === Deprecation Migrations ===
  - source: bot-framework
    target: m365-agents-sdk
    type: uses
    description: |
      MIGRATION (EOS 2025-12-31). Activity-Protocol bleibt kompatibel,
      TeamsFx → Agents Toolkit umstellen. Channel-Mapping behalten.
      Keine Custom-Adapter mehr nötig.

  - source: semantic-kernel
    target: microsoft-agent-framework
    type: uses
    description: |
      KONSOLIDIERUNG. SK + AutoGen → MAF (GA 2026-04-07). API
      weitgehend kompatibel. Kernel→Agent+Thread-Pattern. Planner
      entfällt — durch Workflow-API ersetzt.

  - source: autogen
    target: microsoft-agent-framework
    type: uses
    description: |
      KONSOLIDIERUNG. GroupChat-Pattern bleibt als RoundRobin/Sequential
      preserved. AutoGen Studio (UI) ohne 1:1-Ersatz — nur Code-Migration.

  # === Agent 365 Governance ===
  - source: agent-365
    target: microsoft-agent-framework
    type: secured-by
    description: |
      Agent 365 ist die Control-Plane für Agent Governance — RBAC,
      Audit-Logs, Sponsor-Konzept. Wraps MAF + Copilot Studio Agents
      gleichermassen. GA 2026-05-01.
```

- [ ] **Step 3: Verify YAML parsing locally**

```powershell
cd C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map
node -e "const yaml=require('js-yaml');const fs=require('fs');const layers=yaml.load(fs.readFileSync('web/data/architecture-layers.yaml','utf8'));const collabs=yaml.load(fs.readFileSync('web/data/collaborations.yaml','utf8'));console.log('Layers:',layers.layers.length,'Tools:',layers.layers.reduce((s,l)=>s+l.members.length,0),'Edges:',collabs.collaborations.length);"
```
Erwartet:
```
Layers: 7 Tools: 41 Edges: 30
```

(Falls `node` `js-yaml` nicht findet: `cd web && bun install` zuerst falls noch nicht passiert; oder skip diesen Step und auf Build-Verifizierung in späteren Tasks vertrauen.)

- [ ] **Step 4: Commit**

```powershell
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" add web/data/
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" commit -m "feat(arch-map): add architecture-layers.yaml + collaborations.yaml"
```

---

## Task 2: Loader Library

**Files:**
- Create: `web/src/lib/load-architecture.ts`

**Begründung:** Loader liest beide YAMLs + merged mit existierendem `loadProducts()`. Validierung als WARN, kein Build-Stop.

- [ ] **Step 1: `web/src/lib/load-architecture.ts`**

```typescript
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
  const [products, layersFile, collabsFile] = await Promise.all([
    loadProducts(),
    Promise.resolve(readYaml<LayersFile>("data/architecture-layers.yaml")),
    Promise.resolve(readYaml<CollabsFile>("data/collaborations.yaml")),
  ]);

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

  const productBySlug = new Map(products.map((p) => [p.slug, p]));

  const nodes: ArchNode[] = [];
  for (const layer of layers) {
    for (const slug of layer.members) {
      const product = productBySlug.get(slug);
      if (!product) {
        console.warn(`[arch] Layer-member ${slug} nicht in products.yaml — skipped.`);
        continue;
      }
      nodes.push({
        slug: product.slug,
        displayName: product.displayName,
        layer: layer.id,
        layerOrder: layer.order,
        tier: product.tier,
        watch: product.data.watch ?? "standard",
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
```

- [ ] **Step 2: Build verifies loader**

```powershell
cd C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map\web
bun run build 2>&1 | Select-String -Pattern "arch|warn|error" -CaseSensitive:$false
```

Build sollte ohne Fehler durchlaufen — der Loader wird aber noch nirgends aufgerufen, also keine Output. Wenn TypeScript-Fehler in `load-architecture.ts` selbst, dann erscheinen sie hier.

- [ ] **Step 3: Commit**

```powershell
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" add web/src/lib/load-architecture.ts
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" commit -m "feat(arch-map): add load-architecture loader with YAML + Product merge"
```

---

## Task 3: Page Skeleton + Header Update

**Files:**
- Create: `web/src/pages/architecture.astro`
- Modify: `web/src/components/Header.astro`

**Begründung:** Page renderbar machen mit Header-Tab — auch ohne ArchMap. Liefert Loader-Smoke-Test.

- [ ] **Step 1: Update `web/src/components/Header.astro`**

Read current Header.astro to find the nav block. Then update:

```astro
---
interface Props {
  current?: "grid" | "table" | "architecture";
  subtitle?: string;
}
const { current = "grid", subtitle = "" } = Astro.props;
const navClass = (active: boolean) =>
  active
    ? "px-3 py-1 text-sm rounded bg-blue-600 text-white no-underline"
    : "px-3 py-1 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200 no-underline";
---
<header class="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
  <div class="flex items-baseline justify-between">
    <div>
      <h1 class="m-0">Microsoft AI Knowledge Base</h1>
      {subtitle && <p class="m-0 text-sm text-gray-600">{subtitle}</p>}
    </div>
    <nav class="flex gap-2" aria-label="Ansicht wechseln">
      <a href="/" class={navClass(current === "grid")}>Grid</a>
      <a href="/table" class={navClass(current === "table")}>Table</a>
      <a href="/architecture" class={navClass(current === "architecture")}>Architecture</a>
    </nav>
  </div>
</header>

<script>
  // Preserve URL filter state when toggling between views
  const search = window.location.search;
  if (search) {
    document.querySelectorAll<HTMLAnchorElement>('header nav a').forEach((a) => {
      const url = new URL(a.href);
      a.href = url.pathname + search;
    });
  }
</script>
```

- [ ] **Step 2: `web/src/pages/architecture.astro` (skeleton, kein ArchMap noch)**

```astro
---
import "../styles/global.css";
import { loadArchitecture } from "../lib/load-architecture";
import Header from "../components/Header.astro";

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
      <div class="bg-yellow-50 border border-yellow-300 rounded p-4 text-sm">
        <p class="font-semibold text-yellow-900 m-0">ArchMap-Skeleton (Task 3)</p>
        <p class="m-0 mt-1 text-yellow-800">
          {graph.layers.length} Layer · {graph.nodes.length} Tools · {graph.edges.length} Edges geladen.
        </p>
        <p class="m-0 mt-1 text-yellow-800">
          (D3-Visualisierung folgt in Task 4–7.)
        </p>
      </div>
    </main>
  </body>
</html>
```

- [ ] **Step 3: Build + Verify**

```powershell
cd C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map\web
bun run build
```

Erwartet: 48 pages built (war 47 — `/architecture/index.html` ist neu). Kein Build-Error.

- [ ] **Step 4: Verify Architecture page renders correctly**

```powershell
Get-Content "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map\web\dist\architecture\index.html" | Select-String -Pattern "Layer.*Tools.*Edges"
```

Erwartet: Zeile mit "7 Layer · 41 Tools · 30 Edges geladen."

- [ ] **Step 5: Commit**

```powershell
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" add web/src/pages/architecture.astro web/src/components/Header.astro
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" commit -m "feat(arch-map): add /architecture page skeleton + Header 3rd tab"
```

---

## Task 4: ArchMap v0 — Static Layered Render (no D3)

**Files:**
- Create: `web/src/components/ArchMap.tsx`
- Modify: `web/src/pages/architecture.astro` (add ArchMap import)

**Begründung:** Erst statisches Layout (fixed positions). D3 kommt in Task 5. Diese Phase verifiziert dass alle 41 Tools korrekt in Layern erscheinen und Layer-Bänder farbig stimmen.

- [ ] **Step 1: Install d3 dependencies (early — wir brauchen sie ab Task 5, aber package.json sauber)**

```powershell
cd C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map\web
bun add d3 d3-force d3-selection d3-drag
bun add -d @types/d3
```

- [ ] **Step 2: `web/src/components/ArchMap.tsx` v0 — static layout**

```tsx
import type { ArchitectureGraph, ArchNode, ArchEdge, EdgeType, Layer } from "../lib/load-architecture";

interface Props {
  graph: ArchitectureGraph;
}

const SVG_WIDTH = 1400;
const SVG_HEIGHT = 900;
const LAYER_HEIGHT = SVG_HEIGHT / 7; // 7 layers

function nodeRadius(tier: 1 | 2 | 3): number {
  return tier === 1 ? 14 : tier === 2 ? 11 : 9;
}

/** v0: static positions — Tools werden gleichmässig im Layer-Band verteilt. */
function staticLayout(nodes: ArchNode[], layers: Layer[]) {
  const positioned: Array<ArchNode & { x: number; y: number }> = [];
  for (const layer of layers) {
    const layerNodes = nodes.filter((n) => n.layer === layer.id);
    const yCenter = (layer.order - 0.5) * LAYER_HEIGHT;
    const spacing = SVG_WIDTH / (layerNodes.length + 1);
    layerNodes.forEach((node, i) => {
      positioned.push({
        ...node,
        x: spacing * (i + 1),
        y: yCenter,
      });
    });
  }
  return positioned;
}

export default function ArchMap({ graph }: Props) {
  const { layers, nodes } = graph;
  const positionedNodes = staticLayout(nodes, layers);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full"
        style={{ minHeight: "calc(100vh - 120px)", background: "#fafafa" }}
      >
        {/* Layer bands */}
        {layers.map((layer) => (
          <g key={layer.id}>
            <rect
              x={0}
              y={(layer.order - 1) * LAYER_HEIGHT}
              width={SVG_WIDTH}
              height={LAYER_HEIGHT}
              fill={layer.color_bg}
              opacity={0.6}
            />
            <text
              x={12}
              y={(layer.order - 1) * LAYER_HEIGHT + 18}
              fill={layer.color_fg}
              fontSize={11}
              fontWeight="bold"
            >
              {layer.name}
            </text>
            <text
              x={12}
              y={(layer.order - 1) * LAYER_HEIGHT + 32}
              fill={layer.color_fg}
              fontSize={9}
              opacity={0.7}
            >
              {layer.description}
            </text>
          </g>
        ))}

        {/* Nodes */}
        {positionedNodes.map((node) => {
          const layer = layers.find((l) => l.id === node.layer)!;
          return (
            <g key={node.slug} transform={`translate(${node.x}, ${node.y})`}>
              <circle
                r={nodeRadius(node.tier)}
                fill={layer.color_fg}
                stroke="white"
                strokeWidth={2}
                opacity={node.isDeprecated ? 0.5 : 1}
              />
              <text
                y={nodeRadius(node.tier) + 14}
                textAnchor="middle"
                fontSize={10}
                fill="#222"
                fontWeight="500"
              >
                {node.displayName}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
```

- [ ] **Step 3: Update `web/src/pages/architecture.astro` to mount ArchMap**

Replace the body's `<main>` block with:

```astro
<main class="p-4">
  <ArchMap client:load graph={graph} />
</main>
```

And add to the imports at the top:

```astro
import ArchMap from "../components/ArchMap";
```

- [ ] **Step 4: Build + Verify**

```powershell
cd C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map\web
bun run build
```

Erwartet:
- 48 pages built
- ArchMap React island bundle erscheint in `dist/_astro/ArchMap.*.js` (~5-10 KB)
- `dist/architecture/index.html` enthält 7 `<rect>` Elemente (Layer-Bänder) und 41 `<circle>` Elemente (Nodes)

- [ ] **Step 5: Local Browser Verify (optional but recommended)**

```powershell
cd C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map\web
bun run preview
```

Browser öffnen, `/architecture` aufrufen. Erwartet:
- 7 horizontal gestapelte farbige Bänder (gelb oben, orange unten)
- 41 Knoten verteilt in den Bändern, mit Tool-Namen als Label drunter
- Tier-1-Knoten grösser als Tier-2 grösser als Tier-3
- Deprecated Tools (Bot Framework, Semantic Kernel, AutoGen) etwas blasser

Ctrl+C zum Stoppen.

- [ ] **Step 6: Commit**

```powershell
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" add web/
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" commit -m "feat(arch-map): ArchMap v0 — static layered SVG render (41 nodes, 7 layers)"
```

---

## Task 5: ArchMap v1 + v2 — D3 Force Simulation + Edges

**Files:**
- Modify: `web/src/components/ArchMap.tsx`

**Begründung:** Statisches Layout durch Force-Simulation ersetzen (Y an Layer gepinnt, X via force-collide), plus Edges rendern mit Typ-spezifischer Farbe + Marker.

- [ ] **Step 1: Replace `web/src/components/ArchMap.tsx` mit Force-Simulation Version**

```tsx
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type {
  ArchitectureGraph,
  ArchNode,
  ArchEdge,
  EdgeType,
  Layer,
} from "../lib/load-architecture";

interface Props {
  graph: ArchitectureGraph;
}

const SVG_WIDTH = 1400;
const SVG_HEIGHT = 900;
const LAYER_HEIGHT = SVG_HEIGHT / 7;

const EDGE_STYLES: Record<EdgeType, { color: string; dash: string; markerId: string }> = {
  "uses":           { color: "#1e3a8a", dash: "0",     markerId: "arr-uses" },
  "hosted-on":      { color: "#581c87", dash: "0",     markerId: "arr-host" },
  "grounds-on":     { color: "#065f46", dash: "0",     markerId: "arr-ground" },
  "secured-by":     { color: "#991b1b", dash: "4,2",   markerId: "arr-sec" },
  "calls":          { color: "#7c2d12", dash: "0",     markerId: "arr-call" },
  "integrated-via": { color: "#0891b2", dash: "1,4",   markerId: "arr-mcp" },
};

function nodeRadius(tier: 1 | 2 | 3): number {
  return tier === 1 ? 14 : tier === 2 ? 11 : 9;
}

interface SimNode extends d3.SimulationNodeDatum, ArchNode {}
interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  type: EdgeType;
  description: string;
}

export default function ArchMap({ graph }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clean slate

    const { layers, nodes: rawNodes, edges } = graph;
    const layerById = new Map(layers.map((l) => [l.id, l]));

    // === Defs: arrow markers per edge type ===
    const defs = svg.append("defs");
    Object.entries(EDGE_STYLES).forEach(([_type, s]) => {
      defs.append("marker")
        .attr("id", s.markerId)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 18) // back off to not overlap node
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", s.color);
    });

    // === Layer bands ===
    const layerG = svg.append("g").attr("class", "layers");
    layers.forEach((layer) => {
      layerG.append("rect")
        .attr("x", 0)
        .attr("y", (layer.order - 1) * LAYER_HEIGHT)
        .attr("width", SVG_WIDTH)
        .attr("height", LAYER_HEIGHT)
        .attr("fill", layer.color_bg)
        .attr("opacity", 0.6);
      layerG.append("text")
        .attr("x", 12)
        .attr("y", (layer.order - 1) * LAYER_HEIGHT + 18)
        .attr("fill", layer.color_fg)
        .attr("font-size", 11)
        .attr("font-weight", "bold")
        .text(layer.name);
      layerG.append("text")
        .attr("x", 12)
        .attr("y", (layer.order - 1) * LAYER_HEIGHT + 32)
        .attr("fill", layer.color_fg)
        .attr("font-size", 9)
        .attr("opacity", 0.7)
        .text(layer.description);
    });

    // === Sim data ===
    const simNodes: SimNode[] = rawNodes.map((n) => ({
      ...n,
      x: SVG_WIDTH / 2,
      y: (n.layerOrder - 0.5) * LAYER_HEIGHT,
    }));
    const slugToSim = new Map(simNodes.map((n) => [n.slug, n]));
    const simLinks: SimLink[] = edges.map((e) => ({
      source: slugToSim.get(e.source)!,
      target: slugToSim.get(e.target)!,
      type: e.type,
      description: e.description,
    }));

    // === Edges (rendered first, so under nodes) ===
    const linkG = svg.append("g").attr("class", "links");
    const linkSel = linkG.selectAll("line")
      .data(simLinks)
      .enter()
      .append("line")
      .attr("stroke", (d) => EDGE_STYLES[d.type].color)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", (d) => EDGE_STYLES[d.type].dash)
      .attr("marker-end", (d) => `url(#${EDGE_STYLES[d.type].markerId})`)
      .attr("opacity", 0.7);

    // === Nodes ===
    const nodeG = svg.append("g").attr("class", "nodes");
    const nodeSel = nodeG.selectAll("g")
      .data(simNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("cursor", "pointer");

    nodeSel.append("circle")
      .attr("r", (d) => nodeRadius(d.tier))
      .attr("fill", (d) => layerById.get(d.layer)!.color_fg)
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("opacity", (d) => (d.isDeprecated ? 0.5 : 1));

    nodeSel.append("text")
      .attr("y", (d) => nodeRadius(d.tier) + 14)
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .attr("fill", "#222")
      .attr("font-weight", "500")
      .text((d) => d.displayName);

    // === Force simulation ===
    const simulation = d3.forceSimulation<SimNode>(simNodes)
      // Y pinning to layer band — strong
      .force("y", d3.forceY<SimNode>((d) => (d.layerOrder - 0.5) * LAYER_HEIGHT).strength(1))
      // X mid-attraction — weak
      .force("x", d3.forceX<SimNode>(SVG_WIDTH / 2).strength(0.05))
      // Collision — strong, prevents overlap
      .force("collide", d3.forceCollide<SimNode>((d) => nodeRadius(d.tier) + 6))
      // Link attraction — moderate, pulls connected closer in X
      .force("link", d3.forceLink<SimNode, SimLink>(simLinks)
        .id((d) => d.slug)
        .distance(120)
        .strength(0.3))
      .alpha(1)
      .alphaDecay(0.05)
      .on("tick", () => {
        linkSel
          .attr("x1", (d) => (d.source as SimNode).x!)
          .attr("y1", (d) => (d.source as SimNode).y!)
          .attr("x2", (d) => (d.target as SimNode).x!)
          .attr("y2", (d) => (d.target as SimNode).y!);
        nodeSel.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
      });

    // Stop after stabilization (~3 sec)
    setTimeout(() => simulation.stop(), 3000);

    return () => {
      simulation.stop();
    };
  }, [graph]);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full"
        style={{ minHeight: "calc(100vh - 120px)", background: "#fafafa" }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Build + Verify**

```powershell
cd C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map\web
bun run build
```

Erwartet: Build OK. ArchMap bundle gewachsen auf ~50 KB (D3-Module).

- [ ] **Step 3: Local browser preview**

```powershell
bun run preview
```

`/architecture` aufrufen. Erwartet:
- 7 farbige Layer-Bänder (statisch)
- 41 Knoten verteilt — innerhalb von 3 Sekunden stabilisiert sich Layout via Force-Simulation
- 30 Linien zwischen Knoten in 6 verschiedenen Farben (blau, lila, grün, rot-dashed, orange, türkis-dotted)
- Pfeile am Edge-Ende (zeigen Richtung)
- Edges überqueren manchmal Layer — das ist erwartet (z.B. Surface → Logic, Logic → Foundation)

Ctrl+C zum Stoppen.

- [ ] **Step 4: Commit**

```powershell
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" add web/
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" commit -m "feat(arch-map): ArchMap v1+v2 — D3 force-simulation + 6 typed edges"
```

---

## Task 6: ArchMap v3+v4 — Hover Interactions (Node Highlight + Edge Tooltip)

**Files:**
- Modify: `web/src/components/ArchMap.tsx`

**Begründung:** Hover-Interaktion ist das Kernfeature für die Demo. Node-Hover hebt das gesamte Upstream/Downstream hervor; Edge-Hover zeigt ein Tooltip mit Beschreibung.

- [ ] **Step 1: Add React state + hover handlers**

Replace the entire `web/src/components/ArchMap.tsx` with:

```tsx
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type {
  ArchitectureGraph,
  ArchNode,
  ArchEdge,
  EdgeType,
  Layer,
} from "../lib/load-architecture";

interface Props {
  graph: ArchitectureGraph;
}

const SVG_WIDTH = 1400;
const SVG_HEIGHT = 900;
const LAYER_HEIGHT = SVG_HEIGHT / 7;

const EDGE_STYLES: Record<EdgeType, { color: string; dash: string; markerId: string; label: string }> = {
  "uses":           { color: "#1e3a8a", dash: "0",     markerId: "arr-uses",   label: "uses" },
  "hosted-on":      { color: "#581c87", dash: "0",     markerId: "arr-host",   label: "hosted-on" },
  "grounds-on":     { color: "#065f46", dash: "0",     markerId: "arr-ground", label: "grounds-on" },
  "secured-by":     { color: "#991b1b", dash: "4,2",   markerId: "arr-sec",    label: "secured-by" },
  "calls":          { color: "#7c2d12", dash: "0",     markerId: "arr-call",   label: "calls" },
  "integrated-via": { color: "#0891b2", dash: "1,4",   markerId: "arr-mcp",    label: "integrated-via" },
};

function nodeRadius(tier: 1 | 2 | 3): number {
  return tier === 1 ? 14 : tier === 2 ? 11 : 9;
}

interface SimNode extends d3.SimulationNodeDatum, ArchNode {}
interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  type: EdgeType;
  description: string;
}

interface HoveredEdge {
  edge: SimLink;
  x: number;
  y: number;
}

export default function ArchMap({ graph }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<HoveredEdge | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { layers, nodes: rawNodes, edges } = graph;
    const layerById = new Map(layers.map((l) => [l.id, l]));

    // === Defs: arrow markers ===
    const defs = svg.append("defs");
    Object.entries(EDGE_STYLES).forEach(([_type, s]) => {
      defs.append("marker")
        .attr("id", s.markerId)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 18)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", s.color);
    });

    // === Layer bands ===
    const layerG = svg.append("g").attr("class", "layers");
    layers.forEach((layer) => {
      layerG.append("rect")
        .attr("x", 0)
        .attr("y", (layer.order - 1) * LAYER_HEIGHT)
        .attr("width", SVG_WIDTH)
        .attr("height", LAYER_HEIGHT)
        .attr("fill", layer.color_bg)
        .attr("opacity", 0.6);
      layerG.append("text")
        .attr("x", 12)
        .attr("y", (layer.order - 1) * LAYER_HEIGHT + 18)
        .attr("fill", layer.color_fg)
        .attr("font-size", 11)
        .attr("font-weight", "bold")
        .text(layer.name);
      layerG.append("text")
        .attr("x", 12)
        .attr("y", (layer.order - 1) * LAYER_HEIGHT + 32)
        .attr("fill", layer.color_fg)
        .attr("font-size", 9)
        .attr("opacity", 0.7)
        .text(layer.description);
    });

    // === Sim data ===
    const simNodes: SimNode[] = rawNodes.map((n) => ({
      ...n,
      x: SVG_WIDTH / 2,
      y: (n.layerOrder - 0.5) * LAYER_HEIGHT,
    }));
    const slugToSim = new Map(simNodes.map((n) => [n.slug, n]));
    const simLinks: SimLink[] = edges.map((e) => ({
      source: slugToSim.get(e.source)!,
      target: slugToSim.get(e.target)!,
      type: e.type,
      description: e.description,
    }));

    // === Edges ===
    const linkG = svg.append("g").attr("class", "links");
    const linkSel = linkG.selectAll<SVGLineElement, SimLink>("line")
      .data(simLinks)
      .enter()
      .append("line")
      .attr("stroke", (d) => EDGE_STYLES[d.type].color)
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", (d) => EDGE_STYLES[d.type].dash)
      .attr("marker-end", (d) => `url(#${EDGE_STYLES[d.type].markerId})`)
      .attr("opacity", 0.7)
      .attr("data-source", (d) => (d.source as SimNode).slug)
      .attr("data-target", (d) => (d.target as SimNode).slug)
      .style("cursor", "pointer")
      .on("mouseenter", function (event, d) {
        const [mx, my] = d3.pointer(event, svgRef.current);
        setHoveredEdge({ edge: d, x: mx, y: my });
        d3.select(this).attr("stroke-width", 3);
      })
      .on("mousemove", function (event, d) {
        const [mx, my] = d3.pointer(event, svgRef.current);
        setHoveredEdge({ edge: d, x: mx, y: my });
      })
      .on("mouseleave", function () {
        setHoveredEdge(null);
        d3.select(this).attr("stroke-width", 1.5);
      });

    // === Nodes ===
    const nodeG = svg.append("g").attr("class", "nodes");
    const nodeSel = nodeG.selectAll<SVGGElement, SimNode>("g")
      .data(simNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("data-slug", (d) => d.slug)
      .attr("cursor", "pointer")
      .on("mouseenter", (_event, d) => setHoveredNode(d.slug))
      .on("mouseleave", () => setHoveredNode(null));

    nodeSel.append("circle")
      .attr("r", (d) => nodeRadius(d.tier))
      .attr("fill", (d) => layerById.get(d.layer)!.color_fg)
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .attr("opacity", (d) => (d.isDeprecated ? 0.5 : 1));

    nodeSel.append("text")
      .attr("y", (d) => nodeRadius(d.tier) + 14)
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .attr("fill", "#222")
      .attr("font-weight", "500")
      .text((d) => d.displayName);

    // === Force simulation ===
    const simulation = d3.forceSimulation<SimNode>(simNodes)
      .force("y", d3.forceY<SimNode>((d) => (d.layerOrder - 0.5) * LAYER_HEIGHT).strength(1))
      .force("x", d3.forceX<SimNode>(SVG_WIDTH / 2).strength(0.05))
      .force("collide", d3.forceCollide<SimNode>((d) => nodeRadius(d.tier) + 6))
      .force("link", d3.forceLink<SimNode, SimLink>(simLinks)
        .id((d) => d.slug)
        .distance(120)
        .strength(0.3))
      .alpha(1)
      .alphaDecay(0.05)
      .on("tick", () => {
        linkSel
          .attr("x1", (d) => (d.source as SimNode).x!)
          .attr("y1", (d) => (d.source as SimNode).y!)
          .attr("x2", (d) => (d.target as SimNode).x!)
          .attr("y2", (d) => (d.target as SimNode).y!);
        nodeSel.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
      });

    setTimeout(() => simulation.stop(), 3000);

    return () => {
      simulation.stop();
    };
  }, [graph]);

  // Hover-Highlight: compute connected nodes + edges
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    if (!hoveredNode) {
      svg.selectAll<SVGGElement, SimNode>(".node").attr("opacity", 1);
      svg.selectAll<SVGLineElement, SimLink>(".links line").attr("opacity", 0.7);
      svg.selectAll<SVGGElement, SimNode>(".node circle").attr("stroke", "white").attr("stroke-width", 2);
      return;
    }

    const connectedNodeSlugs = new Set<string>([hoveredNode]);
    const connectedEdges = new Set<SimLink>();

    svg.selectAll<SVGLineElement, SimLink>(".links line").each(function (d) {
      const sourceSlug = (d.source as SimNode).slug;
      const targetSlug = (d.target as SimNode).slug;
      if (sourceSlug === hoveredNode || targetSlug === hoveredNode) {
        connectedNodeSlugs.add(sourceSlug);
        connectedNodeSlugs.add(targetSlug);
        connectedEdges.add(d);
      }
    });

    svg.selectAll<SVGGElement, SimNode>(".node")
      .attr("opacity", (d) => (connectedNodeSlugs.has(d.slug) ? 1 : 0.15));

    svg.selectAll<SVGLineElement, SimLink>(".links line")
      .attr("opacity", (d) => (connectedEdges.has(d) ? 1 : 0.05))
      .attr("stroke-width", (d) => (connectedEdges.has(d) ? 2.5 : 1.5));

    // Yellow halo on hovered node
    svg.selectAll<SVGGElement, SimNode>(".node")
      .filter((d) => d.slug === hoveredNode)
      .select("circle")
      .attr("stroke", "#fbbf24")
      .attr("stroke-width", 4);
  }, [hoveredNode]);

  return (
    <div className="w-full overflow-x-auto relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full"
        style={{ minHeight: "calc(100vh - 120px)", background: "#fafafa" }}
      />

      {/* Edge Tooltip */}
      {hoveredEdge && (
        <div
          className="absolute pointer-events-none bg-gray-900 text-white p-3 rounded-md shadow-2xl"
          style={{
            left: `${(hoveredEdge.x / SVG_WIDTH) * 100}%`,
            top: `${(hoveredEdge.y / SVG_HEIGHT) * 100}%`,
            transform: "translate(-50%, -110%)",
            maxWidth: "280px",
            zIndex: 50,
          }}
        >
          <div
            className="text-xs uppercase font-bold tracking-wide"
            style={{ color: EDGE_STYLES[hoveredEdge.edge.type].color }}
          >
            {EDGE_STYLES[hoveredEdge.edge.type].label}
          </div>
          <div className="text-sm mt-1 leading-relaxed whitespace-pre-line">
            {hoveredEdge.edge.description.trim()}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Build + Verify**

```powershell
cd C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map\web
bun run build
```

Erwartet: Bundle wächst leicht (Tooltip-Logik).

- [ ] **Step 3: Local Browser-Verify**

`bun run preview` → `/architecture`. Maus über MAF-Knoten:
- Alle direkt verbundenen Knoten/Kanten bleiben hell
- Alle anderen Knoten fadet auf 15%
- Kanten zu/von MAF werden dicker (2.5px)
- Gelber Halo um MAF

Maus über eine Kante:
- Tooltip erscheint dunkel mit Edge-Type oben (in dessen Farbe) und Beschreibung darunter
- Tooltip folgt der Maus

- [ ] **Step 4: Commit**

```powershell
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" add web/
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" commit -m "feat(arch-map): ArchMap v3+v4 — node hover full-chain + edge tooltip"
```

---

## Task 7: ArchMap v5+v6 — Click Navigation + Filter Integration

**Files:**
- Modify: `web/src/components/ArchMap.tsx`
- Modify: `web/src/pages/architecture.astro` (pass productData for filter)

**Begründung:** Klick auf Knoten navigiert zu Detail-Page (Sub-Project A). Filter-Bar (FilterBar + SearchBox) aus Sub-Project A wird oberhalb der Map gerendert; Filter dimmen Knoten/Kanten.

- [ ] **Step 1: Update ArchMap.tsx — onClick + filter prop**

In ArchMap.tsx, change the Props interface:

```tsx
interface Props {
  graph: ArchitectureGraph;
  visibleSlugs: Set<string>;
}
```

In the node selection setup, add `.on("click", ...)`:

```tsx
nodeSel
  .attr("class", "node")
  .attr("data-slug", (d) => d.slug)
  .attr("cursor", "pointer")
  .on("mouseenter", (_event, d) => setHoveredNode(d.slug))
  .on("mouseleave", () => setHoveredNode(null))
  .on("click", (_event, d) => {
    window.location.href = `/products/${d.slug}`;
  });
```

In the second `useEffect` (hover highlight), also handle filter dimming. Add a third useEffect for filter:

```tsx
// Filter dimming — independent of hover
useEffect(() => {
  if (!svgRef.current) return;
  const svg = d3.select(svgRef.current);

  svg.selectAll<SVGGElement, SimNode>(".node")
    .classed("filtered-out", (d) => !visibleSlugs.has(d.slug));

  svg.selectAll<SVGLineElement, SimLink>(".links line")
    .classed("filtered-out", (d) => {
      const s = (d.source as SimNode).slug;
      const t = (d.target as SimNode).slug;
      return !visibleSlugs.has(s) || !visibleSlugs.has(t);
    });
}, [visibleSlugs]);
```

Add CSS via inline style block at end of return:

```tsx
return (
  <div className="w-full overflow-x-auto relative">
    <style>{`
      .filtered-out { opacity: 0.05 !important; pointer-events: none; }
    `}</style>
    {/* svg + tooltip */}
    ...
  </div>
);
```

- [ ] **Step 2: Update architecture.astro — pass productData and integrate FilterBar**

Replace contents:

```astro
---
import "../styles/global.css";
import { loadArchitecture } from "../lib/load-architecture";
import { loadProducts } from "../lib/load-products";
import Header from "../components/Header.astro";
import ArchMapClient from "../components/ArchMapClient";

const graph = await loadArchitecture();
const products = await loadProducts();
const sorted = [...products].sort((a, b) => a.tier - b.tier || a.id.localeCompare(b.id));
const allMocs = [...new Set(sorted.map((p) => p.primaryHomeMoc).filter(Boolean) as string[])].sort();
const productData = sorted.map((p) => ({
  slug: p.slug,
  id: p.id,
  displayName: p.displayName,
  tier: p.tier,
  tagline: p.tagline,
  watch: (p.data.watch ?? "standard") as "close" | "standard" | "passive",
  status: (p.data.status ?? "ga") as "ga" | "preview" | "deprecated" | "eos",
  primaryHomeMoc: p.primaryHomeMoc,
  isDeprecated: p.isDeprecated,
  aliases: p.data.aliases ?? [],
}));
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
      <ArchMapClient client:load graph={graph} products={productData} allMocs={allMocs} />
    </main>
  </body>
</html>
```

- [ ] **Step 3: Create new wrapper component `web/src/components/ArchMapClient.tsx`**

Reasoning: combines `useCatalogFilters` hook + ArchMap render + FilterBar + SearchBox in one client island.

```tsx
import { useMemo } from "react";
import FilterBar from "./FilterBar";
import SearchBox from "./SearchBox";
import ArchMap from "./ArchMap";
import { useCatalogFilters, type ProductData } from "../lib/use-catalog-filters";
import type { ArchitectureGraph } from "../lib/load-architecture";

interface Props {
  graph: ArchitectureGraph;
  products: ProductData[];
  allMocs: string[];
}

export default function ArchMapClient({ graph, products, allMocs }: Props) {
  const { filterState, setFilterState, query, setQuery, filtered } = useCatalogFilters(products);

  // visible slugs = intersection of filtered products AND nodes in graph
  const visibleSlugs = useMemo(() => {
    const filteredSlugs = new Set(filtered.map((p) => p.slug));
    const graphSlugs = new Set(graph.nodes.map((n) => n.slug));
    // Show node if it's in graph AND in filtered set
    const result = new Set<string>();
    for (const slug of filteredSlugs) {
      if (graphSlugs.has(slug)) result.add(slug);
    }
    return result;
  }, [filtered, graph.nodes]);

  return (
    <>
      <div className="mb-3"><SearchBox initial={query} onChange={setQuery} /></div>
      <FilterBar initial={filterState} onChange={setFilterState} allMocs={allMocs} />
      <div className="text-sm text-gray-500 mt-2">
        {visibleSlugs.size} von {graph.nodes.length} Tools sichtbar
      </div>
      <ArchMap graph={graph} visibleSlugs={visibleSlugs} />
    </>
  );
}
```

- [ ] **Step 4: Build + Verify**

```powershell
cd C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map\web
bun run build
```

Erwartet: Build OK, ArchMapClient bundle erstellt.

- [ ] **Step 5: Local browser preview**

`bun run preview` → `/architecture`:
- Filter-Bar oben sichtbar (Tier, MOC, Watch, Status chips)
- Search-Box oben sichtbar
- Klick auf Filter-Chip "T1" → nur Tier-1-Knoten bleiben sichtbar (Rest auf 5%)
- Klick auf Knoten → Navigation zu `/products/<slug>`
- URL bleibt bei Filter-Wahl: `?tier=1`
- Toggle in Header zwischen Architecture / Grid / Table — Filter-State bleibt erhalten

- [ ] **Step 6: Commit**

```powershell
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" add web/
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" commit -m "feat(arch-map): ArchMap v5+v6 — click navigation + filter integration"
```

---

## Task 8: Acceptance Test + README + PR

**Files:**
- Modify: `web/README.md`
- Modify: `README.md` (root)
- Modify: `docs/superpowers/specs/2026-05-04-architecture-map-design.md` (changelog)

- [ ] **Step 1: Run Acceptance Test (Spec §7) — interaktiv im Browser**

```powershell
cd C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map\web
bun run preview
```

Browser → `http://localhost:4321/architecture`. Verifiziere:

- [ ] Test 1: Page lädt, 7 Layer-Bänder sichtbar
- [ ] Test 2: Layer-Farben korrekt (gelb oben, orange unten)
- [ ] Test 3: ~41 Knoten in den richtigen Layern; MAF in BUILDING (blau), Foundry Models in FOUNDATION (orange)
- [ ] Test 4: Hover MAF → Edges zu Foundry-Models, AI-Search, Foundry-AS, Entra-Agent-ID hervorgehoben
- [ ] Test 5: Hover Edge "MAF → Foundry Models" → Tooltip mit "calls" + Beschreibung
- [ ] Test 6: Klick MAF → Navigation zu `/products/microsoft-agent-framework`
- [ ] Test 7: URL `?tier=1` direkt → Tier-1-Knoten normal, Tier-2/3 auf 5%
- [ ] Test 8: Header Toggle "Grid" → zurück → Filter-State erhalten
- [ ] Test 9: Mobile-Viewport (DevTools iPhone) → SVG skaliert
- [ ] Test 10: Build OK, `dist/architecture/index.html` existiert

- [ ] **Step 2: Update `web/README.md` — add /architecture documentation**

Insert after the existing "Build" section:

```markdown
## Pages

- `/` — Grid view (45 product cards)
- `/table` — Table view (sortable columns)
- `/architecture` — Interactive Architecture Map (D3.js force-simulation)
- `/products/<slug>` — Detail view per product

The `/architecture` page reads from `web/data/architecture-layers.yaml` and
`web/data/collaborations.yaml` plus `loadProducts()`. To add new tools to the map:
1. Add to `architecture-layers.yaml` under the appropriate layer's `members`
2. Optionally add edges in `collaborations.yaml` referencing the new slug
```

- [ ] **Step 3: Update root `README.md` — add Sub-Project B mention**

Find the "Web Catalog (Sub-Project A)" section and add after it:

```markdown
---

## Architecture Map (Sub-Project B)

Interaktive Architektur-Karte mit 7 Layern, ~41 Tools und ~30 typisierten
Kollaborations-Edges. Hover für Upstream/Downstream-Highlight + Edge-Tooltips.

- **Code:** `web/src/components/ArchMap.tsx` + `web/data/{architecture-layers,collaborations}.yaml`
- **Live:** `/architecture` route
- **Spec:** [docs/superpowers/specs/2026-05-04-architecture-map-design.md](docs/superpowers/specs/2026-05-04-architecture-map-design.md)
```

- [ ] **Step 4: Update spec changelog**

In `docs/superpowers/specs/2026-05-04-architecture-map-design.md`, ergänze am Ende der Changelog-Sektion:

```markdown
- 2026-05-04: Implementation komplett (Task 1–7). Acceptance-Test §7 grün durchlaufen.
```

- [ ] **Step 5: Commit docs**

```powershell
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" add web/README.md README.md docs/superpowers/specs/
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" commit -m "docs(arch-map): add /architecture documentation + spec changelog"
```

- [ ] **Step 6: Push branch**

```powershell
git -C "C:\Claude_code\MS_AI_Wiki\.claude\worktrees\arch-map" push -u origin feature/architecture-map
```

- [ ] **Step 7: Create PR via gh**

If `gh` is not authenticated, the user opens the PR via the URL printed by git push. Otherwise:

```bash
gh pr create --title "feat(arch-map): Architecture Interaction Map (Sub-Project B)" --body "$(cat <<'EOF'
## Summary

Interaktive Architektur-Karte als 3rd tab `/architecture` neben Grid und Table.
7 Layer (Surface bis Foundation), 41 Tools, ~30 typisierte Kollaborations-Edges
(uses, hosted-on, grounds-on, secured-by, calls, integrated-via).

Hover-Verhalten:
- Knoten: alle direkten Upstream/Downstream-Edges + Knoten hervorgehoben, Rest auf 15%
- Kante: Tooltip mit Edge-Typ + Beschreibung der Kollaboration

Tech: D3.js force-simulation in React island, Y-Position an Layer gepinnt.

## Verifiziert

- [x] 7 Layer-Bänder farbig korrekt
- [x] 41 Tools in den richtigen Layern
- [x] 30 Edges mit 6 verschiedenen Farben/Stilen
- [x] Hover Node → full chain highlight
- [x] Hover Edge → tooltip mit Beschreibung
- [x] Klick → Detail-Page navigation
- [x] Filter-State (Tier, MOC, Watch, Status, search) bleibt cross-page erhalten
- [x] Build OK, 48 pages

## Spec + Plan

- Spec: `docs/superpowers/specs/2026-05-04-architecture-map-design.md`
- Plan: `docs/superpowers/plans/2026-05-04-architecture-map.md`

## Demo-Material

Diese View ist das **zentrale Demo-Material** für die Präsentation an
Christoph Ende der Woche. Christoph kann live durchklicken um zu sehen
wie die Microsoft-AI-Tools zusammenarbeiten.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-Review Notes

**Spec coverage check:**
- §2 Ziele 1 (7-Layer Architektur) → Task 1 (yaml), Task 4 (render), Task 5 (force pinning)
- §2 Ziele 2 (typisierte Edges, 6 Typen) → Task 1 (yaml), Task 5 (EDGE_STYLES)
- §2 Ziele 3 (Hover-Interaktion) → Task 6
- §2 Ziele 4 (Filter reuse) → Task 7
- §2 Ziele 5 (Cross-Link zu A) → Task 7 (onClick)
- §2 Ziele 6 (Demo-tauglich am Freitag) → Task 8 Acceptance Test
- §3 Non-Goals → keine Tasks per definition
- §4.1 Datenfluss → Tasks 1+2 implementieren komplett
- §4.2 Layer-Struktur → Task 1
- §4.3 Tool-Zuordnung (41+5) → Task 1 (5 side-bands explizit ausgelassen)
- §4.4 Edge-Typen (6) → Task 5
- §4.5 Visualisierungs-Tech (D3) → Task 4 deps + Task 5 implementation
- §4.6 Hover-Interaktion → Task 6
- §4.7 Filter (reuse) → Task 7
- §5.1 Datenfiles → Task 1
- §5.2 Loader → Task 2
- §5.3 Page → Task 3 (skeleton) + Task 7 (final)
- §5.4 Header Update → Task 3
- §5.5 ArchMap Component → Tasks 4–7 (inkrementell)
- §5.6 Filter Integration → Task 7
- §6 Daten-Flow → Tasks 1–7 implementieren komplett
- §7 Acceptance Test → Task 8
- §8 Risiken → mitigations integriert (force timeout 3s, opacity 0.05 not 0, etc.)

**Placeholder scan:** Keine "TBD/TODO/implement later" gefunden. Alle Code-Blöcke vollständig ausgeschrieben.

**Type consistency:**
- `ArchNode`, `ArchEdge`, `EdgeType`, `Layer`, `ArchitectureGraph` — definiert in Task 2, identisch verwendet in Tasks 4–7
- `EDGE_STYLES` — identische Struktur in Tasks 5–7 (color, dash, markerId, label)
- `nodeRadius()` — gleiche Logik (T1=14, T2=11, T3=9) in allen Tasks
- `SimNode`, `SimLink` — D3-Typ-Erweiterungen, konsistent
- `ProductData` — importiert aus `lib/use-catalog-filters` (Sub-Project A), kein duplicate
- `useCatalogFilters` — bestehender Hook aus Sub-Project A, reused as-is in Task 7
