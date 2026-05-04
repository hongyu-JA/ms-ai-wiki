# Microsoft AI Knowledge Base (Auto-maintained)

Ein Obsidian-basierter, LLM-gepflegter Wissensspeicher für das Microsoft-AI-Ökosystem.
Folgt der Methode aus `llm-wiki.md` und dem Plan aus `PLAN - Microsoft AI Auto-KB.md`.
Erfüllt die Deliverables aus `Arbeitsauftrag Microsoft AI Research.md`.

**Status:** Walking-Skeleton — die gesamte Pipeline (`fetch → filter → patch → apply`)
läuft durch; jede Forschungs-Kategorie ist bewusst durch **genau eine** Beispiel-Datei
instanziiert. Weiteren Inhalt füllt man nach dem Muster nach.

---

## Struktur

```
C:\Claude_code\MS_AI_Wiki\
├── MS_AI_Wiki/                      ← Obsidian-Vault-Root (diesen Ordner in Obsidian öffnen)
│   └── Microsoft/
│       ├── Microsoft MOC.md         ← Root-Landkarte
│       ├── Deprecation Radar.md     ← Meta-Übersicht aller Deprecations
│       ├── _Templates/
│       │   ├── Product Note Template.md   (7 Pflicht + 3 optional)
│       │   └── MOC Note Template.md
│       ├── MOCs/
│       │   └── Agents MOC.md        ← 1 Beispiel-Primary-Home-MOC
│       └── Products/
│           ├── Microsoft Agent Framework.md   ← 1 Beispiel Tier-1
│           └── deprecated/
│               └── Bot Framework.md            ← 1 Beispiel Deprecation
│
├── .automation/
│   ├── products.yaml                ← Produkte + Keywords + Watch-Level
│   ├── sources.yaml                 ← RSS/JSON-Quellen
│   ├── prompts/
│   │   ├── system.md                (gecached)
│   │   └── user-template.md
│   ├── state/
│   │   ├── feed-hashes.json
│   │   ├── seen-items.json
│   │   └── last-run.json
│   └── scripts/
│       ├── fetch.ts                 ← Stage 0
│       ├── filter.ts                ← Stage 1 (lokal, 0 Token)
│       ├── patch.ts                 ← Stage 2 (Claude Sonnet 4.6 + Caching)
│       ├── apply.ts                 ← Stage 3 (Patches → Notes + MOC + Radar)
│       └── lib/
│           ├── paths.ts
│           ├── config.ts
│           ├── obsidian.ts
│           ├── feeds.ts
│           └── claude.ts
│
├── .github/workflows/
│   └── daily-sync.yml               ← cron 06:00 UTC + workflow_dispatch
│
├── .gitignore
└── README.md
```

---

## Die Pipeline (fetch → filter → patch → apply)

```
┌───────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌────────────────┐
│  fetch.ts     │ --> │  filter.ts   │ --> │  patch.ts       │ --> │  apply.ts      │
│ RSS/JSON/GH   │     │ Dedup + KW   │     │ Claude Sonnet   │     │ Diff auf Vault │
│ → raw-items   │     │ → filtered   │     │ → patches.json  │     │ → PR           │
└───────────────┘     └──────────────┘     └─────────────────┘     └────────────────┘
                          (0 Token)           (nur Delta + Cache)
```

**Warum so:** Claude macht nur, was Regeln nicht können (Sprache verstehen, Abschnitt wählen, Changelog formulieren). Alles andere ist deterministisches Scripting.

---

## Setup

### 1) Node 20+ installieren, Dependencies ziehen

```bash
cd .automation
npm install
```

### 2) Dry-Run (kein API-Key, kein Vault-Write)

```bash
cd .automation
npm run sync:dry       # = DRY_RUN=1 DRY_WRITE=1 fetch && filter && patch && apply
```

- `DRY_RUN=1` → `patch.ts` ruft **nicht** die Anthropic-API auf, sondern
  erzeugt deterministische Stub-Patches. Damit läuft die gesamte Kette auch
  ohne API-Key durch.
- `DRY_WRITE=1` → `apply.ts` schreibt nichts in den Vault, loggt nur.

### 3) Echter Lauf (lokal)

```bash
export ANTHROPIC_API_KEY=sk-ant-...
cd .automation
npm run sync
```

### 4) GitHub Actions aktivieren

- Repo-Secret `ANTHROPIC_API_KEY` setzen.
- `daily-sync.yml` läuft dann täglich 06:00 UTC und öffnet **einen PR**, der
  manuell reviewed und gemerged wird (nie Direct-Push auf `main`).

---

## Wie man neue Produkte / Quellen hinzufügt

**Neues Produkt** (Beispiel Microsoft 365 Copilot):

1. Datei `MS_AI_Wiki/Microsoft/Products/Microsoft 365 Copilot.md` anlegen,
   `_Templates/Product Note Template.md` als Ausgangspunkt kopieren.
2. In `.automation/products.yaml` einen Block ergänzen:

```yaml
- slug: microsoft-365-copilot
  note: "Microsoft 365 Copilot.md"
  primary_home_moc: "Copilot MOC"
  tier: 1
  watch: close
  keywords: ["Microsoft 365 Copilot", "M365 Copilot", "Copilot Wave 3"]
  sources: [azure-updates, m365-roadmap]
  changelog_trigger_sections: ["Status & Pricing", "Kernkonzept"]
```

3. Im MOC `Agents MOC.md` / `Copilot MOC.md` die Tabelle „Produkte in dieser MOC" erweitern (Bidirektionalität).

**Neue Quelle:** Block in `sources.yaml` mit `type: rss|atom|github-releases|json-feed`, `covers: [...slugs...]`, `enabled: true`.

---

## Wie das Versioning-Modell funktioniert

- **Vault ist Git-Repo.** Jede Änderung ist ein Commit.
- **Automatische Änderungen** kommen nie direkt auf `main` — immer via PR,
  der manuell gemerged wird. (Risiko „Claude generiert plausibel, aber falsch"
  wird so abgefedert, Arbeitsauftrag §1.5.)
- **Manuelle Änderungen** (Hongyu schreibt eine Note selbst) commitet man wie normal.
- **State-Dateien** (`feed-hashes.json`, `seen-items.json`, `last-run.json`) sind
  committed — sie sind Teil des reproduzierbaren Status der Pipeline. Die
  flüchtigen Dateien (`raw-items.json`, `filtered-items.json`, `patches.json`)
  sind in `.gitignore`.

---

## SharePoint-Sync (für Copilot Studio Agent)

Das lokale Vault wird zusätzlich zu GitHub auch zu SharePoint gespiegelt,
damit der interne **Copilot Studio Agent** immer den aktuellen Wissensstand
sieht. Architektur: lokales Obsidian = Source of Truth → robocopy → OneDrive
→ SharePoint Library `Microsoft_AIProducts_Wiki`.

**Cadence:** alle 3 Stunden + bei jeder User-Anmeldung (Windows Task Scheduler).

**Skripte:**

| Datei | Wann | Wie |
|---|---|---|
| [`.automation/scripts/sync-to-sharepoint.ps1`](.automation/scripts/sync-to-sharepoint.ps1) | automatisch (Task Scheduler) | wird vom Task triggert, kein manueller Aufruf nötig |
| [`.automation/scripts/install-sharepoint-sync-task.ps1`](.automation/scripts/install-sharepoint-sync-task.ps1) | einmalig | als angemeldeter User in PowerShell ausführen |
| [`.automation/scripts/sync-now.bat`](.automation/scripts/sync-now.bat) | vor Demos | Doppelklick (Desktop-Verknüpfung empfohlen) |

**Setup auf neuer Maschine:**

1. SharePoint-Library im Browser öffnen → "Synchronisieren" klicken
   (OneDrive-Client erstellt lokalen Ordner)
2. Pfade in [`sync-to-sharepoint.ps1`](.automation/scripts/sync-to-sharepoint.ps1)
   an die Maschine anpassen (Konstanten `$RepoRoot` und `$OneDriveDst` oben im Skript)
3. `.\.automation\scripts\install-sharepoint-sync-task.ps1` ausführen
4. Acceptance-Test laut [Spec §6](docs/superpowers/specs/2026-05-02-sharepoint-sync-design.md) durchlaufen

**Logs:** `.automation/state/sharepoint-sync.log` (gitignored, lokal-only).

**Spec + Plan:**
- [Design Spec](docs/superpowers/specs/2026-05-02-sharepoint-sync-design.md)
- [Implementation Plan](docs/superpowers/plans/2026-05-02-sharepoint-sync.md)

---

## Web Catalog (Sub-Project A)

Static-Site Browse/Filter-UI für die KB. 45 Produkt-Notes als Karten + Tabelle, mit Filter (Tier, MOC, Watch, Status) und Free-Text-Search. Auto-deployed zu Cloudflare Pages.

- **Code:** [`web/`](web/) (Astro + React + Tailwind)
- **Lokale Entwicklung:** `cd web && bun install && bun run dev`
- **Setup-Doku:** [web/README.md](web/README.md)
- **Spec:** [docs/superpowers/specs/2026-05-03-web-catalog-design.md](docs/superpowers/specs/2026-05-03-web-catalog-design.md)

---

## Architecture Map (Sub-Project B)

Interaktive Architektur-Karte mit 7 Layern, ~39 Tools und ~30 typisierten
Kollaborations-Edges. Hover für Upstream/Downstream-Highlight + Edge-Tooltips
mit Beschreibung. Klick auf Knoten → Detail-Page (Sub-Project A).

- **Code:** [`web/src/components/ArchMap.tsx`](web/src/components/ArchMap.tsx) + [`web/data/`](web/data/)
- **Live:** `/architecture` route (3rd tab im Header)
- **Spec:** [docs/superpowers/specs/2026-05-04-architecture-map-design.md](docs/superpowers/specs/2026-05-04-architecture-map-design.md)
- **Plan:** [docs/superpowers/plans/2026-05-04-architecture-map.md](docs/superpowers/plans/2026-05-04-architecture-map.md)

Sub-Project B baut auf A's Filter-Hook (`useCatalogFilters`) und Header-
Komponente auf — Filter-State wird zwischen den 3 Views (Grid/Table/Architecture)
preserved.

---

## Mapping auf die Deliverables aus `Arbeitsauftrag Microsoft AI Research.md`

| Deliverable                                     | Status im Skeleton                                                                           |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Obsidian-Notes nach Product Note Template      | Template vorhanden, 1 Referenz-Note (MAF) komplett gefüllt                                   |
| Bidirektionale MOC-Pflege                      | `Microsoft MOC` + `Agents MOC` + Frontmatter-`moc:` + MOC-Tabellen verlinken beidseitig     |
| Changelog-Tracking                              | Jede Note hat `## 7. Changelog`, `apply.ts` schreibt Einträge automatisch                    |
| Monitoring-Quellen mit `Zuletzt gesichtet`     | Primary/Secondary/Tertiary-Tabellen in der Note, Frontmatter-`zuletzt_gesichtet` automatisch |
| Deprecation Radar + Migrationspfade           | `Deprecation Radar.md` + 1 Beispiel `deprecated/Bot Framework.md` mit Migration zu Agents SDK |
| GitHub-Versionierung                           | Commits + PR-basiertes Merging                                                                |
| Automatisches Update                            | GitHub Actions cron + Workflow `daily-sync.yml`                                                |
| Präsentation (60–90 Min)                       | **ausdrücklich out-of-scope** für den Skeleton, wird aus der Wissensbasis erzeugt             |

---

## Nächste Schritte (nach Walking-Skeleton)

1. Restliche Tier-1-Notes nach Muster MAF füllen: Microsoft 365 Copilot, Copilot Studio, Microsoft Foundry (+ 8 Sub-Notes), Azure AI Search, Agent 365, Azure Functions/Container Apps/APIM, Model Context Protocol.
2. Weitere Primary-Home-MOCs anlegen: Copilot, Azure AI, Data & Knowledge, Security & Identity, Integration & Compute.
3. Lens-MOCs `Agent-Building-Pattern` + `RAG Pattern` (einseitig verlinkt).
4. Deprecated-Stubs Semantic Kernel + AutoGen schreiben.
5. `products.yaml` + `sources.yaml` mit jedem neuen Produkt erweitern.
6. `apply.ts` → Tabellen-Mutation in MOCs präziser (statt Append-Kommentar eine echte Zeilen-Änderung).
7. Foundry-Hands-on dokumentieren (Arbeitsauftrag §2.6).
8. Präsentation.
