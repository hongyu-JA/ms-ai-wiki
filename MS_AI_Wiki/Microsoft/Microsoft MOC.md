---
type: moc
tags:
  - moc
  - microsoft
  - root
last_verified: 2026-04-22
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

<!-- AUTO-INDEX-START: stand -->

| Kennzahl | Wert |
| -------- | ---- |
| Tier-1 Notes | **19 deep** · 0 stub · total 19 |
| Tier-2 Notes | **3 deep** · 13 stub · total 16 |
| Tier-3 Notes | **0 deep** · 4 stub · total 4 |
| Deprecated Notes | **1 deep** · 2 stub · total 3 |
| MOCs insgesamt | 10 (Root + 6 Primary + 2 Lens + 1 Commercial) |
| Automation-Pipeline | läuft seit 2026-04-21 (siehe README) |
| Letzter Index-Rebuild | 2026-04-22 (automatisch durch apply.ts) |

<!-- AUTO-INDEX-END: stand -->

## Research-Status pro Produkt

<!-- AUTO-INDEX-START: research-status -->

| Depth | Tier | Watch | Note | Primary Home MOC |
| ----- | ---- | ----- | ---- | ---------------- |
| 🟢 deep | T1 | close | [[Agent 365]] | Agents MOC |
| 🟢 deep | T1 | close | [[APIM AI Gateway]] | Integration & Compute MOC |
| 🟢 deep | T1 | close | [[Azure AI Search]] | Azure AI MOC |
| 🟢 deep | T1 | close | [[Azure Container Apps]] | Integration & Compute MOC |
| 🟢 deep | T1 | close | [[Azure Functions]] | Integration & Compute MOC |
| 🟢 deep | T1 | passive | [[Azure Machine Learning]] | Azure AI MOC |
| 🟢 deep | T1 | close | [[Copilot Studio]] | Agents MOC |
| 🟢 deep | T1 | close | [[Entra Agent ID]] | Security & Identity MOC |
| 🟢 deep | T1 | close | [[Foundry Agent Service]] | Azure AI MOC |
| 🟢 deep | T1 | close | [[Foundry Control Plane]] | Azure AI MOC |
| 🟢 deep | T1 | close | [[Foundry IQ]] | Azure AI MOC |
| 🟢 deep | T1 | close | [[Foundry Local]] | Azure AI MOC |
| 🟢 deep | T1 | close | [[Foundry Models]] | Azure AI MOC |
| 🟢 deep | T1 | close | [[Foundry SDKs]] | Azure AI MOC |
| 🟢 deep | T1 | close | [[Foundry Tools]] | Azure AI MOC |
| 🟢 deep | T1 | close | [[Microsoft 365 Copilot]] | Copilot MOC |
| 🟢 deep | T1 | close | [[Microsoft Agent Framework]] | Agents MOC |
| 🟢 deep | T1 | close | [[Microsoft Foundry]] | Azure AI MOC |
| 🟢 deep | T1 | close | [[Model Context Protocol]] | Agents MOC |
| 🟢 deep | T2 · 🔻 | passive | [[deprecated/Bot Framework]] | Agents MOC |
| 🟢 deep | T2 | standard | [[M365 Agents SDK]] | Agents MOC |
| 🟢 deep | T2 | close | [[Microsoft 365 E7]] | Licensing & SKUs MOC |
| 🟢 deep | T2 | standard | [[Teams SDK]] | Agents MOC |
| 🟡 stub | T2 · 🔻 | passive | [[deprecated/AutoGen]] | Agents MOC |
| 🟡 stub | T2 | standard | [[Azure AI Content Safety]] | Security & Identity MOC |
| 🟡 stub | T2 | standard | [[Azure AI Content Understanding]] | Azure AI MOC |
| 🟡 stub | T2 | standard | [[Azure AI Document Intelligence]] | Azure AI MOC |
| 🟡 stub | T2 | standard | [[Microsoft 365 Copilot Connectors]] | Copilot MOC |
| 🟡 stub | T2 | standard | [[Dataverse]] | Data & Knowledge MOC |
| 🟡 stub | T2 | standard | [[Dataverse MCP Server]] | Data & Knowledge MOC |
| 🟡 stub | T2 | standard | [[Defender for AI]] | Security & Identity MOC |
| 🟡 stub | T2 | standard | [[Logic Apps]] | Integration & Compute MOC |
| 🟡 stub | T2 | standard | [[Microsoft Entra Suite]] | Security & Identity MOC |
| 🟡 stub | T2 | standard | [[Microsoft Graph]] | Data & Knowledge MOC |
| 🟡 stub | T2 | standard | [[Microsoft Purview]] | Security & Identity MOC |
| 🟡 stub | T2 | standard | [[Power Automate]] | Integration & Compute MOC |
| 🟡 stub | T2 | standard | [[Purview DSPM]] | Security & Identity MOC |
| 🟡 stub | T2 · 🔻 | passive | [[deprecated/Semantic Kernel]] | Agents MOC |
| 🟡 stub | T3 | passive | [[Azure OpenAI Service Pricing]] | Azure AI MOC |
| 🟡 stub | T3 | passive | [[Azure Cosmos DB for AI]] | Data & Knowledge MOC |
| 🟡 stub | T3 | passive | [[Microsoft Fabric]] | Data & Knowledge MOC |
| 🟡 stub | T3 | passive | [[Microsoft AI Developer Tooling]] | Integration & Compute MOC |

<!-- AUTO-INDEX-END: research-status -->

## Letzte Aktivität

_Jüngste Changelog-Einträge der letzten 30 Tage aus allen Product-Notes. Auto-generiert._

<!-- AUTO-INDEX-START: activity -->

| Datum | Produkt | Änderung | Autor |
| ----- | ------- | -------- | ----- |
| 2026-04-22 | [[Microsoft 365 Copilot]] | Copilot Cowork (Long-Running, Multi-Step-Work) ist jetzt via Frontier-Programm verfügbar. Nutzer können über das Frontier-Programm Early … | auto-sync |
| 2026-04-22 | [[Agent 365]] | Kompletter Ausbau: GA-Scope-Diagramm (was GA, was bleibt Preview), Identity-Modell (4 neue Entra-Objekttypen), Sponsor-Konzept als DSGVO-… | Hongyu / Deep-Research |
| 2026-04-22 | [[Agent 365]] | Initial Stub | Hongyu |
| 2026-04-22 | [[APIM AI Gateway]] | 5 GA-AI-Policies dokumentiert, MCP-Proxy GA (mit Einschränkungen: kein Workspace, keine Prompts), Tier-Matrix, CH-Region-Verfügbarkeit (k… | Hongyu / Deep-Research |
| 2026-04-22 | [[Azure AI Search]] | **Agentic Retrieval** als First-Class-Feature (MCP-exposed, +40% relevance), **Entra Doc-Level Security GA 2025**, Hybrid-Search-Flow-Dia… | Hongyu / Deep-Research |
| 2026-04-22 | [[Azure AI Search]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Azure Container Apps]] | Pricing + Regionen (CH North = Consumption + Dedicated, Flex fehlt), Scale-to-Zero-Regeln (nur event-basiert), Dapr Building Blocks + KED… | Hongyu / Deep-Research |
| 2026-04-22 | [[Azure Container Apps]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Azure Functions]] | Drei Agent-Personas (Host / MCP-Tool / Durable-Workflow) als zentrale Struktur, **MCP Binding GA Jan 2026** mit Code-Beispielen (C# + Pyt… | Hongyu / Deep-Research |
| 2026-04-22 | [[Azure Machine Learning]] | v1-vs-v2-Status (SDK v1 EOS 30.06.2026!), 4 legitime Agent-Zeitalter-Use-Cases, Azure ML vs. Foundry Linie, Pricing-Struktur, Journai-Tie… | Hongyu / Deep-Research |
| 2026-04-22 | [[Azure Machine Learning]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Copilot Studio]] | 4-Ebenen-Eskalationsleiter-Diagramm, Cowork Deep-Dive mit EU-Data-Boundary-Warnung (Anthropic default-OFF), vollständige Pricing-Matrix m… | Hongyu / Deep-Research |
| 2026-04-22 | [[Entra Agent ID]] | Kompletter Ausbau von Stub → Deep-Research-Note (watch: close). Abgrenzung zu [[Agent 365]] (Entra Agent ID = Identity-Plane darunter, ni… | Hongyu / Deep-Research |
| 2026-04-22 | [[Foundry Agent Service]] | **Major correction**: DSGVO-Flag aus Arbeitsauftrag §2.6 überholt — **Switzerland North ist GA-Region**. 10 EU/EFTA-Regionen. Preview-Lim… | Hongyu / Deep-Research |
| 2026-04-22 | [[Foundry Agent Service]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Foundry Control Plane]] | Tracing-Architektur-Diagramm (Foundry+AppInsights = ein Storage), 35+ OOB-Evaluators in 6 Kategorien, RBAC-Rollen-Matrix + Journai-Enterp… | Hongyu / Deep-Research |
| 2026-04-22 | [[Foundry Control Plane]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Foundry IQ]] | Architektur-Diagramm KB → Sources → MCP-Server → Clients, MCP-Endpoint-Pattern, Reasoning-Effort-Levels (minimal/low/medium), Code-Sketch… | Hongyu / Deep-Research |
| 2026-04-22 | [[Foundry IQ]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Foundry Local]] | Scope-Klärung Foundry Local vs. Windows AI Foundry (Runtime vs. Platform-Stack), 10-Modell-Katalog mit Hardware-Matrix, API-Delta OpenAI-… | Hongyu / Deep-Research |
| 2026-04-22 | [[Foundry Local]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Foundry Models]] | Top-20-Katalog-Tabelle, PAYG/MaaS/PTU-Entscheidungs-Flow, Break-Even-Rechnung (~$1.8k PAYG/Monat → PTU), EU-Region-Matrix mit **Claude=Sw… | Hongyu / Deep-Research |
| 2026-04-22 | [[Foundry Models]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Foundry SDKs]] | API-Oberfläche mit Sub-Client-Map + Python/.NET Code-Sketches, Migration-Guide `azure-ai-projects 1.x → 2.0` mit 8 Breaking Changes, Spra… | Hongyu / Deep-Research |
| 2026-04-22 | [[Foundry SDKs]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Foundry Tools]] | Services-Inventar mit Status + SMB-Relevanz, DI Deep-Dive (Pricing-Matrix, Prebuilt-Models v4.0, Custom Generative), CU Deep-Dive (Schema… | Hongyu / Deep-Research |
| 2026-04-22 | [[Foundry Tools]] | Initial Stub | Hongyu |
| 2026-04-22 | [[M365 Agents SDK]] | Kompletter Deep-Dive nach MAF-Template, Bot-Framework-Migration-Path, Code-Beispiele, Hosting-Varianten | Hongyu / Deep-Research |
| 2026-04-22 | [[M365 Agents SDK]] | Initial Stub (watch: standard → upgrade auf close nach Deep-Research) | Hongyu |
| 2026-04-22 | [[Microsoft 365 Copilot]] | **Vollständige Deep-Research-Integration** via claude-researcher agent: Wave-3-Features mit EU-Details, Flex-Routing-Warnung (DSGVO-kriti… | Hongyu / Deep-Research |

<!-- AUTO-INDEX-END: activity -->


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
