---
type: spec
created: 2026-05-03
owner: Hongyu
status: approved
sub_project: A (Web Product Catalog)
parent_vision: KB visual presentation layer
related_specs:
  - 2026-05-02-sharepoint-sync-design.md (data layer)
---

# Spec: Web Product Catalog (Sub-Project A)

## 1. Kontext & Vision

Die MS_AI_Wiki Knowledge-Base (45 deep Notes) ist heute nur über zwei Wege
konsumierbar: (1) direkt in Obsidian (nur Hongyu), (2) Copilot Studio Agent
in Teams (Q&A-Modal, debugged sich gerade — siehe `2026-05-02-sharepoint-sync-design.md`).

Christoph und Philipp brauchen einen dritten Weg: **visuelles Browsen + Filtern
ohne Chat**. Z.B. "zeig mir alle Tier-1 Produkte mit watch=close in der Agents
MOC" — eine Frage, die in Chat umständlich ist, aber in einem Catalog-UI ein
2-Klick-Filter ist.

Sub-Project A ist der **Foundation-Block** der Vision-Decomposition
(A → D → B → C → E). D (Change-Log Digest) baut auf den Detail-Pages von A auf;
ohne A gibt es nichts zum Verlinken.

## 2. Ziele

1. **Browse + Filter UI** für die 45 Notes ohne Chat
2. **Authoring bleibt in Obsidian** — keine Doppelpflege, keine UI-Editor
3. **Zero-Install für Viewer** — Christoph/Philipp brauchen nur einen Browser
4. **Auto-Deploy** — `git push` zu main → ~30-60 Sek später live
5. **Kostenlos** — Cloudflare Pages Free Tier reicht
6. **Zugriff geschützt** — internes Tool, keine öffentliche Indexierung

**Erfolgskriterium:** Christoph kann in 30 Sekunden ohne Anleitung folgende
Frage beantworten: "Welche Tier-1 Produkte in der Agents MOC haben aktuell
Status=GA und welche sind in Preview?"

## 3. Non-Goals (out-of-scope für A — kommen in B/C/D/E)

- ❌ **Visuelle MOC-Maps** (Force-Directed-Graph, Treemap) — Sub-Project B
- ❌ **Plain-Language-Sicht zusätzlich zur professionellen** — Sub-Project C
- ❌ **Change-Log Digest / Newsletter** — Sub-Project D
- ❌ **Teams Bot integration / Notifications** — Sub-Project E
- ❌ **In-Browser Editor** für Notes — Authoring bleibt Obsidian
- ❌ **Public access / SEO** — internes Tool, hinter Auth
- ❌ **M365 SSO via Entra OIDC** — braucht App-Registration (kein Admin-Recht);
  Migrationspfad H2 → H3 dokumentiert, aber nicht jetzt
- ❌ **Server-side Code** — pure Static Site

## 4. Architektur

```
                ┌───────────────────────────────────────┐
                │  MS_AI_Wiki/Microsoft/{Products,MOCs} │
                │              45 .md Notes              │
                │           (Source of Truth)            │
                └─────────────────────┬─────────────────┘
                                      │
                                      │ git push
                                      ▼
                ┌───────────────────────────────────────┐
                │  GitHub repo (main branch)             │
                └─────────────────────┬─────────────────┘
                                      │
                                      │ Webhook
                                      ▼
                ┌───────────────────────────────────────┐
                │  Cloudflare Pages                      │
                │  Build: cd web && bun install && build │
                │  Output: web/dist/                     │
                └─────────────────────┬─────────────────┘
                                      │ deployed
                                      ▼
                ┌───────────────────────────────────────┐
                │  Cloudflare CDN                        │
                │  Subdomain: <slug>.pages.dev           │
                └─────────────────────┬─────────────────┘
                                      │ HTTPS
                                      ▼
                ┌───────────────────────────────────────┐
                │  Cloudflare Access "Service Auth"      │
                │  (Basic Auth Token, 1 password/team)   │
                └─────────────────────┬─────────────────┘
                                      │ allowed
                                      ▼
                ┌───────────────────────────────────────┐
                │  Browser (any device)                  │
                │  Hongyu / Christoph / Philipp / future │
                └───────────────────────────────────────┘
```

**Schlüssel-Eigenschaften:**
- **Build-time over runtime** — Astro Static Site Generator, kein Server.
  Cloudflare Pages serviert nur reines HTML/CSS/JS.
- **Source-of-Truth bleibt Obsidian** — `.md` Files sind der einzige Editier-Ort.
  Die `web/` Codebase liest sie nur read-only zum Build-Zeitpunkt.
- **Single repo** — `web/` als Sibling-Ordner zu `MS_AI_Wiki/`. Keine Submodules,
  keine externen Dependencies auf andere Repos.

## 5. Komponenten

### 5.1 Astro Projekt-Struktur

```
web/
├── package.json
├── astro.config.mjs
├── tsconfig.json
├── src/
│   ├── content/
│   │   └── config.ts              # Zod schema für .md frontmatter
│   ├── pages/
│   │   ├── index.astro            # L2 Grid Homepage
│   │   ├── table.astro            # L1 Table Toggle-View
│   │   └── products/
│   │       └── [slug].astro       # 3-Column Detail-View
│   ├── components/
│   │   ├── ProductCard.astro      # Grid card (statisch)
│   │   ├── ProductRow.astro       # Table row (statisch)
│   │   ├── FilterBar.tsx          # React island — 4 dropdown filters
│   │   ├── SearchBox.tsx          # React island — fuzzy search
│   │   ├── Sidebar.astro          # Detail-View metadata sidebar
│   │   ├── Header.astro           # Site header + Grid/Table toggle
│   │   └── Markdown.astro         # Wrapper für .md content rendering
│   ├── lib/
│   │   ├── load-products.ts       # Liest ../MS_AI_Wiki/Microsoft/Products/
│   │   ├── load-mocs.ts           # Liest ../MS_AI_Wiki/Microsoft/MOCs/
│   │   └── wikilinks.ts           # [[Foo]] → <a href="/products/foo">
│   └── styles/
│       └── global.css
└── public/
    └── favicon.svg
```

### 5.2 Content Collection Schema

Pro Product Note werden folgende Felder aus dem YAML frontmatter gelesen
(siehe existierendes `_Templates/Product Note Template.md`):

```typescript
// web/src/content/config.ts
import { defineCollection, z } from "astro:content";

const products = defineCollection({
  type: "content",
  schema: z.object({
    watch: z.enum(["close", "standard", "passive"]),
    status: z.enum(["ga", "preview", "deprecated", "eos"]).optional(),
    last_verified: z.string().optional(),
    aliases: z.array(z.string()).default([]),
    moc: z.array(z.string()).default([]),
    research_depth: z.enum(["stub", "deep"]).default("deep"),
    successor: z.string().optional(),  // nur für deprecated
    deprecation_date: z.string().optional(),  // nur für deprecated
  }),
});

export const collections = { products };
```

**Achtung:** das Schema toleriert fehlende Felder (`.optional()`), damit alte
Notes nicht zur Build-Zeit failen. Validation-Errors werden als WARN gelogged
aber blockieren den Build nicht.

### 5.3 Pages

| Route | Datei | Inhalt |
|---|---|---|
| `/` | `pages/index.astro` | L2 Grid: 45 ProductCards, 4 Filter-Chips oben + Search |
| `/table` | `pages/table.astro` | L1 Table: 45 Rows, gleiche Filter wie Grid |
| `/products/<slug>` | `pages/products/[slug].astro` | 3-Spalten Detail: links nav, mitte content, rechts sidebar |
| `/mocs/<slug>` | `pages/mocs/[slug].astro` | Optional v1.5 — MOC content rendering |

### 5.4 Filter Schema

Frontend-State für die FilterBar:
- `tier: Set<1 | 2 | 3>` — multi-select
- `moc: Set<string>` — Primary Home MOC name, multi-select
- `watch: Set<"close" | "standard" | "passive">` — multi-select
- `status: Set<"ga" | "preview" | "deprecated" | "eos">` — multi-select
- `search: string` — case-insensitive substring match auf title + tagline + aliases

Default = alle Filter inaktiv = alle 45 Produkte sichtbar.
Filter werden **client-side** angewendet (alle Daten sind in einem JSON in
der Page eingebettet, ~50 KB). Kein Server, keine API.

URL-State: `?tier=1,2&moc=agents` etc. → linkable filter views.

### 5.5 Detail-View Sidebar

Rechte Sidebar zeigt:
- **Metadaten-Block**: Tier badge, Watch badge, Status badge, last_verified date
- **Aliases**: kommagetrennte Liste aus `aliases:` frontmatter
- **Primary Home MOC**: Link zum MOC
- **Related Products**: andere Produkte mit derselben primary_home_moc
- **Wikilinks**: Liste aller `[[Note Name]]` Referenzen aus dem Content

### 5.6 Wikilinks

Obsidian `[[Microsoft Agent Framework]]` muss zu `<a href="/products/microsoft-agent-framework">Microsoft Agent Framework</a>` werden. Implementation:

- **rehype-Plugin** in `astro.config.mjs` — pre-processed beim Build
- Slug-Generierung: `kebab-case(title)` (gleiche Logik wie `products.yaml` slug-Feld)
- Fehlende Targets: rendered als grauer Text + `?` icon (Obsidian-Style)

## 6. Daten-Flow

1. **Build-Zeit**:
   - `astro build` startet
   - Content Collection scannt `../MS_AI_Wiki/Microsoft/Products/*.md`
   - Pro Note: parse frontmatter (zod), parse markdown body
   - Erzeugt 45 statische Detail-Pages + 1 Homepage + 1 Table-Page
   - JSON-Index aller Produkte als window-global für FilterBar/SearchBox
   - Output zu `web/dist/`

2. **Deployment**:
   - Cloudflare Pages erkennt main-Push
   - Führt `cd web && bun install && bun run build`
   - Lädt `web/dist/` zu CDN
   - Standard-Subdomain assigned (z.B. `journai-msai-wiki.pages.dev`)

3. **Runtime (Browser)**:
   - User öffnet URL
   - Cloudflare Access "Service Auth" prüft Cookie/Token
   - Bei Auth-Erfolg: HTML/JS/CSS geliefert
   - FilterBar.tsx hydrates → applies URL-state → re-renders Grid/Table

## 7. Acceptance Test

| # | Aktion | Erwartung |
|---|---|---|
| 1 | URL öffnen, kein Token | Cloudflare Access Login-Prompt |
| 2 | Token eingeben | Homepage lädt, Grid mit 45 Cards sichtbar |
| 3 | Filter "Tier=1" + "MOC=Agents" | Grid zeigt nur passende Produkte (~6) |
| 4 | Klick auf "Microsoft Agent Framework" Card | Detail-View lädt, GA 2026-04-07 sichtbar |
| 5 | Detail-View → Sidebar "Related Products" Link | Navigation zu z.B. Copilot Studio funktioniert |
| 6 | URL `?tier=1&moc=agents` direkt aufrufen | Filter ist vorausgewählt |
| 7 | Header → "Table" Toggle | Wechsel zu L1 Tabelle, Filter bleibt erhalten |
| 8 | Search "Foundry" eingeben | ~10 Produkte sichtbar (Foundry-Familie) |
| 9 | Lokal: Note in Obsidian editieren, `git push` | ~30-60 Sek später ist Änderung im Browser sichtbar |
| 10 | Mobile (Phone Browser) | Layout responsive, Cards stacken vertikal |

## 8. Risiken & Mitigationen

| Risiko | Wahrscheinlich | Impact | Mitigation |
|---|---|---|---|
| Cloudflare Pages Free-Tier-Limit überschritten | Niedrig | Niedrig | 500 builds/month — wir machen ~50 max. |
| Build dauert > 1 Min (Cloudflare Limit ist 20 Min) | Sehr niedrig | Niedrig | 45 .md Files = trivial, ~10 Sek Build erwartet |
| `[[Wikilink]]` zu non-existent Note | Mittel | Niedrig | Render als grauer Text + ?, nicht broken link |
| Frontmatter-Field fehlt in alter Note | Hoch | Niedrig | Zod schema mit `.optional()` + WARN log |
| Token leakt per Email/Slack-Screenshot | Mittel | Mittel | Token rotierbar in Cloudflare; in 6 Monaten zu H3 (M365 SSO) |
| Browser kompatibilität (alter IE etc.) | Niedrig | Niedrig | Nur Chromium-basierte + Safari + Firefox supported. Document. |

## 9. Migrations-Pfad H2 → H3

Wenn das Team adoptiert und Christoph bereit ist, IT zu fragen:
- Cloudflare Access "Application" → Authentication-Provider von "Service Auth" auf "Entra OIDC" umstellen
- Entra App-Registration mit Cloudflare's Redirect-URL anlegen (5 min Standard-Verfahren)
- Cloudflare → Pflicht-Login per M365 statt shared password
- Kein Code-Change im `web/` Projekt nötig

## 10. Follow-ups (out of A, in B/C/D/E)

1. **B (MOC Maps)**: Force-directed graph der MOC-Hierarchie als zusätzliche
   `pages/map.astro` Route
2. **C (Dual-Tone)**: Pro Note ein zusätzliches `## TL;DR` Section mit
   Plain-Language. UI-Toggle "Pro / Plain".
3. **D (Change-Log Digest)**: Periodischer Build, der git-diffs analysiert
   und einen `/digest/<date>` Page generiert. Teams-Bot pushed Link.
4. **E (Teams Bot)**: Copilot Studio Agent learnt zu Adaptive-Cards-Antworten
   mit Links auf `/products/<slug>` zu pushen.

## 11. Implementations-Reihenfolge

1. `web/` Projekt scaffolden (Astro-CLI starter)
2. Content Collection schema + load-products lib
3. ProductCard + index.astro (L2 Grid statisch ohne Filter)
4. FilterBar.tsx als React island
5. SearchBox.tsx
6. table.astro (L1 toggle)
7. products/[slug].astro mit Sidebar
8. Wikilink rehype plugin
9. Lokal verifizieren (`bun run dev`)
10. Cloudflare Pages Setup + deployment
11. Cloudflare Access "Service Auth" Konfiguration
12. Acceptance Test § 7 durchlaufen
13. README ergänzen

## Changelog

- 2026-05-03: Initial-Spec aus Brainstorming-Session.
- 2026-05-03: Implementation komplett — siehe Tasks 1-13. Lokale Acceptance §7 grün (automatische Checks). Cloudflare-Deployment (Task 11-12) vom User durchgeführt.
