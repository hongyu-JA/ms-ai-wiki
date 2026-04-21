---
type: moc
tags: [moc, microsoft, root]
last_verified: 2026-04-21
---

# Microsoft MOC

*Root-Index und Landkarte der Microsoft-AI-Wissensbasis von Journai. Master-Einstieg für jede Beratungssituation im Microsoft-Ökosystem.*

---

## Zweck

Jede Product-Note im Vault hat diese MOC im Frontmatter. Sie ist die **oberste Navigationsebene**: hier siehst du das gesamte Portfolio auf einen Blick, mit Tier-Priorität (Abarbeitungs-Reihenfolge) und Watch-Level (Monitoring-Intensität).

**Lese-Reihenfolge für neue Team-Mitglieder:**

1. Diese Seite
2. `_Templates/Product Note Template.md`
3. Zwei Referenz-Notes: [[Microsoft Agent Framework]] und [[Microsoft 365 E7]]
4. Deine Haupt-MOC je nach Projekt ([[Agents MOC]], [[Copilot MOC]], [[Azure AI MOC]], …)
5. [[Deprecation Radar]]

---

## Landkarte — die 10 MOCs

```
┌───────────────────────────────────────────────────────────────────────┐
│                         [[Microsoft MOC]]  (Root)                     │
└───────────────────────────────────────────────────────────────────────┘
         │                     │                    │
         ▼                     ▼                    ▼
┌───────────────┐   ┌────────────────────┐   ┌───────────────────┐
│  PRIMARY HOMES │   │   LENS-MOCs        │   │  COMMERCIAL       │
│  (6)           │   │   (2, einseitig)   │   │  (1)              │
└───────────────┘   └────────────────────┘   └───────────────────┘
         │                     │                    │
         ▼                     ▼                    ▼
  [[Agents MOC]]        [[Agent-Building-    [[Licensing & SKUs MOC]]
  [[Copilot MOC]]        Pattern MOC]]
  [[Azure AI MOC]]      [[RAG Pattern MOC]]
  [[Data & Knowledge MOC]]
  [[Security & Identity MOC]]
  [[Integration & Compute MOC]]
```

**Primary Home** (6): Jedes Produkt hat genau eines als thematische Heimat.
**Lens** (2): Queries quer über das Portfolio, verlinken einseitig, keine Home.
**Commercial** (1): Licensing-Querschnitt (E7, Frontier, Wave 3).

---

## Produkte in dieser MOC — das vollständige Portfolio (28)

### Tier 1 — Must-Know (Kern)

| # | Produkt | Primary Home | Watch | Status |
|---|---------|--------------|-------|--------|
| 1 | [[Microsoft 365 Copilot]] | [[Copilot MOC]] | close | GA |
| 2 | [[Microsoft Agent Framework]] | [[Agents MOC]] | close | GA 2026-04-07 |
| 3 | [[Copilot Studio]] + Cowork | [[Agents MOC]] | close | GA / Cowork Wave 3 |
| 4 | [[Microsoft Foundry]] *(Dach, 8 Sub-Komponenten)* | [[Azure AI MOC]] | close | GA |
| 5 | [[Azure AI Search]] | [[Azure AI MOC]] | close | GA |
| 6 | [[Agent 365]] + [[Entra Agent ID]] | [[Agents MOC]] + [[Security & Identity MOC]] | close | GA 2026-05-01 |
| 7 | [[Azure Functions]] + [[Azure Container Apps]] + [[APIM AI Gateway]] | [[Integration & Compute MOC]] | close | GA |
| 8 | [[Model Context Protocol]] | [[Agents MOC]] | close | GA |

#### Foundry-Sub-Komponenten (Tier 1, gehören zu #4)

| # | Komponente | Status | Watch |
|---|------------|--------|-------|
| 4.1 | [[Foundry Models]] (Model Catalog) | GA | close |
| 4.2 | [[Foundry Agent Service]] | GA, Region NC-US | close |
| 4.3 | [[Foundry Control Plane]] | GA | close |
| 4.4 | [[Foundry IQ]] (Knowledge) | GA | close |
| 4.5 | [[Foundry Tools]] (Azure AI Services) | GA | close |
| 4.6 | [[Azure Machine Learning]] | GA | passive |
| 4.7 | [[Foundry Local]] + Windows AI Foundry | GA | close |
| 4.8 | [[Foundry SDKs]] (AIProjectClient 2.0) | GA | close |

### Tier 2 — Important

| # | Produkt | Primary Home | Watch |
|---|---------|--------------|-------|
| 9 | [[Copilot Hierarchie]] (Agent Builder → Declarative → Custom Engine) | *lebt in [[Copilot MOC]]* | — |
| 10 | [[M365 Agents SDK]] | [[Agents MOC]] | standard |
| 11 | [[Teams SDK]] | [[Agents MOC]] | standard |
| 12 | [[Microsoft Graph]] | [[Data & Knowledge MOC]] | standard |
| 13 | [[Microsoft 365 Copilot Connectors]] | [[Copilot MOC]] | standard |
| 14 | [[Dataverse]] + [[Dataverse MCP Server]] | [[Data & Knowledge MOC]] | standard |
| 15 | [[Logic Apps]] + [[Power Automate]] / Agent Flows | [[Integration & Compute MOC]] / [[Agents MOC]] | standard |
| 16 | [[Microsoft Purview]] (Dach) + [[Purview DSPM]] + [[Defender for AI]] + [[Azure AI Content Safety]] | [[Security & Identity MOC]] | standard |
| 17 | [[Microsoft Entra Suite]] | [[Security & Identity MOC]] | standard |
| 18 | [[Azure AI Content Understanding]] + [[Azure AI Document Intelligence]] | [[Azure AI MOC]] *(Foundry Tools)* | standard |
| 19 | [[Microsoft 365 E7]] + [[Wave 3]] + [[Frontier Program]] | [[Licensing & SKUs MOC]] | close |

### Tier 3 — Awareness

| # | Produkt | Primary Home | Watch |
|---|---------|--------------|-------|
| 20 | [[Microsoft AI Developer Tooling]] *(Bündel)* | [[Integration & Compute MOC]] | passive |
| 21 | [[Azure OpenAI Service Pricing]] (PAYG/PTU/Batch) | [[Azure AI MOC]] + [[Licensing & SKUs MOC]] | passive |
| 22 | [[Azure OpenAI Responses API]] | [[Azure AI MOC]] | passive |
| 23 | [[Application Insights for AI]] + [[Azure AI Evaluation SDK]] + Foundry Tracing | [[Azure AI MOC]] | passive |
| 24 | [[Azure Cosmos DB for AI]] | [[Data & Knowledge MOC]] | passive |
| 25 | [[Microsoft Fabric]] + [[OneLake]] + [[Fabric Data Agents]] | [[Data & Knowledge MOC]] | passive |
| 26 | [[Purview Data Map]] | [[Security & Identity MOC]] | passive |
| 27 | [[Dynamics 365 Agents]] | [[Agents MOC]] | passive |
| 28 | [[Deprecation Radar]] *(Meta)* | — | — |

### Deprecated

| Note | Status | EOS |
|------|--------|-----|
| [[deprecated/Bot Framework]] | 🔴 akut | 2025-12-31 (erreicht) |
| [[deprecated/Semantic Kernel]] | 🟡 mittel | TBD (→ MAF) |
| [[deprecated/AutoGen]] | 🟡 mittel | TBD (→ MAF) |

---

## Stand der Wissensbasis

| Kennzahl | Wert |
|----------|------|
| Tier-1 Notes gefüllt | 1 / 16 (MAF — Referenz) |
| Tier-2 Notes gefüllt | 0 / 11 |
| Tier-3 Notes gefüllt | 0 / 9 |
| MOCs | 10 (Root + 6 Primary + 2 Lens + 1 Commercial) |
| Deprecated Notes gefüllt | 1 / 3 (Bot Framework) |
| Automation-Pipeline | läuft seit 2026-04-21 ([[README]]) |

---

## Querverweise

- [[Deprecation Radar]] — Meta-Note aller Deprecations
- `_Templates/Product Note Template.md`
- `_Templates/MOC Note Template.md`
- `.automation/` im Repo-Root — Daily-Sync-Pipeline

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-21 | Hongyu | Root-MOC als vollständiges 28-Produkte-Portfolio-Index neu strukturiert |
| 2026-04-21 | Hongyu | Initial-Erstellung (Walking-Skeleton-Version) |
