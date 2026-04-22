---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [Azure AI Studio, AI Foundry, AI Hub, Azure AI Foundry]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Microsoft Foundry

*Microsoft's **neue konsolidierte Platform-as-a-Service** für AI-Entwicklung. Seit Ignite 2025 (18.11.2025) **nicht mehr nur ein Rebrand** von Azure AI Studio/AI Foundry/AI Hub — es ist ein eigener Azure-Resource-Provider (`Microsoft.CognitiveServices/accounts` mit `kind=AIServices`) und ersetzt die alte **Hub+Project**-Architektur durch **Foundry Resource + Projects**. Gleichberechtigt neben M365 und Fabric positioniert.*

> **Analogie:** Was Fabric für Data Engineering ist, ist Foundry für AI — eine eigene Produktsäule mit eigenem Portal, eigenem Namespace und eigener Integrationsphilosophie.

---

## Die wichtigste Erkenntnis zuerst

**Foundry ≠ Rebrand.** Mein Stub war falsch: seit Ignite 2025 ist Foundry eine neue PaaS-Klasse mit **eigenem Resource Provider**. Hubs bleiben nur für Altlasten (klassisches Prompt Flow + AzureML-Custom-Training). Alle neuen Projekte sollten **Foundry Projects** (ohne Hub) verwenden.

```
VORHER (Azure AI Foundry classic, bis 2025)            NACHHER (Microsoft Foundry, ab 2026)
                                                       
┌─────────────────────────────────────┐                ┌─────────────────────────────────────┐
│  Hub (AzureML-Workspace-Superset)   │                │  Foundry Resource                   │
│  + Storage Account                  │        →       │  kind=AIServices                    │
│  + Key Vault                        │                │  (Microsoft.CognitiveServices/..)   │
│  + App Insights                     │                │                                     │
│  + Container Registry               │                │    ├── Project A                    │
│    ├── Hub-based Project A          │                │    ├── Project B                    │
│    └── Hub-based Project B          │                │    └── Project C                    │
└─────────────────────────────────────┘                │  (alles im Account-Resource)        │
                                                       └─────────────────────────────────────┘
```

---

## Einsatz

**JTBD:** When I eine produktive AI-App oder Agents baue, I want to Modelle, Knowledge, Agents, Tracing und Deployment an einem Ort verwalten, so I can nicht 10 einzelne Azure-Services orchestrieren muss.

**Trigger-Signale:**
- „Wir haben Azure OpenAI, aber alles Drumherum ist Flickwerk."
- „Unser Team kennt Azure AI Studio — ist das umbenannt worden?"
- „Wir haben einen Hub-basierten Workspace — sollen wir migrieren?"

**Szenarien:** (1) **Hands-on Minimum** (Arbeitsauftrag §2.6): Foundry-Project → Modell deployen → MAF-Agent → Tracing im Control Plane. (2) Multi-Team-Plattform für Agent-Entwicklung. (3) Enterprise mit 3+ AI-Projekten + Zentral-Governance.

**Empfehlung:** 🟢 als Plattform für alle neuen Azure-zentrischen AI-Projekte. **Keine neuen Hub-based Projects mehr** — direkt Foundry Projects.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Status** | GA (aktuelle Generation seit Ignite 2025) |
| **Resource Provider** | `Microsoft.CognitiveServices/accounts` mit `kind=AIServices` |
| **Portal** | https://ai.azure.com (neues Portal) / US-Gov: https://ai.azure.us |
| **Pricing (Dach selbst)** | **kostenlos**. Zitat: *"The platform is free to use and explore. Pricing occurs at the deployment level."* |
| **Switzerland-Support** | **Switzerland North: ✅ verfügbar** für Foundry Projects |
| **EU-Data-Zone-Anker** | Nur **Sweden Central** + **Germany West Central** für DataZone-Deployments |
| **EFTA in EU Data Boundary** | Schweiz + Norwegen **ab 2026-05-01** in EU-Data-Residency eingeschlossen |

### Rebrand-Timeline (Kunden-FAQ-relevant)

```
2023-11  Azure AI Studio (Preview)                      ── Ignite 2023
   │
2024-11  Azure AI Studio → Azure AI Foundry             ── Ignite 2024
   │         (inkl. Foundry Portal + Foundry SDK)
   │
2025-11  Azure AI Foundry → Microsoft Foundry           ── Ignite 2025
   │         ("Azure" bewusst gestrichen, 3. Säule)
   │
2026-01  Umbenennung in Microsoft Product Terms
   │
2026-04  Prompt Flow Feature-Dev eingestellt            ── 20.04.2026
   │
2027-01  Deadline Prompt Flow → MAF Framework Workflows
   │
2027-04  Prompt Flow Retirement (read-only)             ── 20.04.2027
```

---

## Kernkonzept

### Zwei-Portale-Modell — merken Sie sich die Eselsbrücke

```
┌──────────────────────────────┐        ┌──────────────────────────────┐
│   Foundry Portal             │        │   Azure Portal               │
│   ai.azure.com               │        │   portal.azure.com           │
│                              │        │                              │
│   → BUILD + OPERATE AI       │        │   → GOVERN + PAY             │
│                              │        │                              │
│   • Model Deploy             │        │   • Subscription Mgmt        │
│   • Agents Playground        │        │   • Resource Groups + Tags   │
│   • Tracing / Eval           │        │   • RBAC auf Resource-Ebene  │
│   • AgentOps                 │        │   • Cost Management          │
│   • Connections + MCP        │        │   • Networking (VNet)        │
│   • Playground + Prompts     │        │   • Azure Policy             │
│                              │        │   • Quotas (Subscription)    │
│   PERSONA: AI-Developer      │        │   PERSONA: IT-Admin          │
└──────────────────────────────┘        └──────────────────────────────┘
```

**Wichtiger Constraint**: Connections können **nicht im Azure Portal** angelegt werden — nur Foundry Portal oder Bicep-Template. Das ist eine bewusste Policy von MS.

### Projects vs. Hubs — die Entscheidungs-Matrix

```
                    Neues AI-Projekt?
                           │
                           ▼
              ┌─────────────────────────────┐
              │ Brauchst du klassisches      │
              │ Prompt Flow oder AzureML-    │
              │ Custom-Training-Pipeline?    │
              └─────────────────────────────┘
                   │               │
                 NEIN ▼          JA ▼
          ┌──────────────┐   ┌──────────────────┐
          │ 🟢 Foundry    │   │ 🟡 Hub-based     │
          │   Project    │   │   Project         │
          │   (neu,      │   │   (classic,       │
          │   direct)    │   │   AzureML-Stack)  │
          └──────────────┘   └──────────────────┘
                 │
                 ▼
         ┌─────────────────────────┐
         │ Compliance-Grenze?      │
         │ (z. B. CH vs. EU-DZ)    │
         └─────────────────────────┘
              │              │
           JA ▼           NEIN ▼
  ┌────────────────────┐  ┌────────────────────┐
  │ Separate Foundry   │  │ 1 Foundry Resource │
  │ Resource pro       │  │ + mehrere Projects │
  │ Grenze             │  │ mit Shared         │
  │                    │  │ Connections        │
  └────────────────────┘  └────────────────────┘
```

**Faustregel:** `Foundry Resource = Hard-Grenze` (Region, RBAC, Policies) · `Project = Team/Usecase` · `Shared Connections leben auf Resource-Ebene`.

### Playground-Inventory (Stand April 2026)

| Playground | Status | Zweck | Besonderheit |
|------------|--------|-------|--------------|
| **Model Playground** | GA | Prompt Engineering + Modell-Vergleich | bis zu **3 Modelle parallel** mit synchronem Input, Tools (Web Search, File Search, Code Interpreter), **Open in VS Code for the Web** |
| **Agents Playground** | GA | Multi-Turn Agent-Prototyping | **AgentOps Tracing + Evaluations built-in** (consumption-billed), Save-as-Agent |
| **Images Playground 2.0** | GA | Bildgenerierung + Inpainting | `gpt-image-1`, Stable Diffusion 3.5 Large, FLUX.1-Kontext-pro, FLUX-1.1-pro |
| **Video Playground** | 🟡 Preview | Generative Video | `Azure OpenAI Sora-2`. ⚠️ **Videos nur 24h retained** → Download lokal |
| **Prompt Optimizer** | *{UNCLEAR: GA vs. Preview}* | Iteratives Prompt-Tuning mit Eval-Connection | Data-driven, verbunden mit Evaluation-Ergebnissen |
| **Evaluation Playground** | GA (im Agents Playground) | Eval-Runs, Tracing | siehe [[Foundry Control Plane]] |

**Prompt Flow ist Legacy** — nur noch in Hub-based Projects, migrieren bis 2027-01 (siehe [[Deprecation Radar]]).

### Die 8 Sub-Komponenten (eigene Notes)

1. [[Foundry Models]] — Model Catalog (11.000+ Modelle)
2. [[Foundry Agent Service]] — Managed Agent Hosting (jetzt **inkl. Switzerland North**!)
3. [[Foundry Control Plane]] — RBAC / Tracing / Evaluation / Responsible AI
4. [[Foundry IQ]] — Knowledge Base (MCP-exposed)
5. [[Foundry Tools]] — Azure AI Services (Speech, Language, DI, CU, …)
6. [[Azure Machine Learning]] — klassisches ML (nicht primär Foundry)
7. [[Foundry Local]] — lokale Inference auf Windows/Mac/Linux
8. [[Foundry SDKs]] — `AIProjectClient` 2.0

---

## Migration Hub-based → Foundry Projects

**Was bleibt kompatibel:**
- Workspace / Compute / Datastore (Shared Resources)
- Azure OpenAI-Deployments (kein Re-Deploy)
- Data Assets (backwards-compatible)

**Was NICHT migriert:**
- Preview Agent State (Messages, Threads, Files)
- Open-Source Model Deployments
- Hub-Project-Zugriff auf neue Foundry-Projects (einseitig)

**Schritt-für-Schritt** (aus [learn.microsoft.com/.../migrate-project](https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/migrate-project)):
1. Neue Foundry Resource + Project provisionieren
2. Connections manuell neu anlegen (Account-Level in neuer Resource)
3. Modelle neu deployen im neuen Project
4. Prompt-Flow-Artefakte nach MAF-Framework-Workflows portieren
5. Agent-State nach Anforderung neu aufbauen
6. Parallelbetrieb 30–60 Tage, dann Hub decommissionieren

---

## Abgrenzungen zum Azure Portal (zeilenweise)

| Task | Foundry Portal | Azure Portal |
|------|----------------|---------------|
| Model Deployment + Playground | ✅ | — |
| Agent bauen, testen, tracen | ✅ (Agent Service, Agents Playground) | — |
| Connections zu externen Tools/Daten | ✅ | ❌ nicht möglich (nur Bicep) |
| Azure Policy, Compliance | — | ✅ |
| Cost-Analyse, Tagging | — | ✅ |
| Netzwerk (VNet, Private Endpoints) | teilweise | ✅ (primär) |
| Quota-Management für Models | ✅ (`Operate → Quota`) | ✅ (Subscription-Level) |
| Prompt Shield, Safety-Features | ✅ (only) | — |
| Foundry Project erstellen | ✅ | ✅ (`Resource management → Projects`) |

**Merkregel für Kunden:** Foundry = **Build + Operate AI**. Azure = **Govern + Pay**.

---

## Limitierungen & Fallstricke

### Harte Grenzen

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Dach selbst kein eigenes Pricing** — einzelne Sub-Komponenten haben eigene Billing-Dimensionen | nicht abstrahierbar, Kosten-Monitoring pro Sub-Komponente |
| **Connections nicht über Azure Portal** verwaltbar | Foundry Portal oder Bicep |
| **EU DataZone-Deployments nur Sweden Central + Germany West Central** | für strikte CH-Residenz: regulärer Standard-Deployment in Switzerland North, kein DataZone |
| **Hub-Projects sind Legacy-Weg** | neue Projects als Foundry-Projects |

### Typische Fallstricke

- **Als Monolith denken** — klassischer Fehler. Foundry = 8 Services mit unterschiedlicher Reife + Region-Availability. *Gegenmittel: [[Azure AI MOC]] Abgrenzungs-Matrix konsultieren.*
- **Prompt Flow als produktiv nutzen** — Legacy seit 2026-04-20. *Gegenmittel: auf Framework Workflows (MAF) umsteigen bis 2027-01.*
- **Hub-based Project neu anlegen** — Microsoft lenkt Neuprojekte auf Foundry-Projects. *Gegenmittel: In Pre-Sales kommunizieren, dass Hub nur für Prompt-Flow-/AzureML-Kontinuität sinnvoll ist.*
- **„New Foundry" Toggle übersehen** — Portal hat Banner-Toggle zwischen neu + classic. Nutzer landen sonst im classic-UI ohne es zu merken.

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction |
|-----|-------|-----------|----------|
| [[Microsoft Agent Framework]] | Agent-Logik (Foundry hostet) | GA | gering |
| [[Foundry Agent Service]] | Managed Hosting | GA | gering (Region: Switzerland North jetzt GA!) |
| [[Foundry Models]] | Model Catalog, 11k+ Modelle | GA | gering |
| [[Foundry IQ]] | Knowledge (MCP-exposed) | GA | gering |
| [[Foundry Tools]] | Azure AI Services | GA | mittel (CU noch nicht in CH) |
| [[Foundry Control Plane]] | Tracing, Eval, RBAC | GA | gering (OTel nativ) |
| [[Microsoft Entra Suite]] + [[Agent 365]] | Identity + Governance | GA / 2026-05-01 | hoch (Agent 365 Preview-Teile) |
| [[Microsoft Purview]] | Data Governance | GA | gering |
| Application Insights | Tracing-Backend | GA | nativ |

### APIs / Protokolle

- **ARM / Bicep / Terraform** für Provisioning (primärer IaC-Pfad)
- **Azure AI Inference SDK** (einheitlich über alle Modelle)
- **OpenAI-kompatibler Endpoint** für Foundry Models
- **MCP** (Model Context Protocol) für Tool-Integration — GA, siehe [[Model Context Protocol]]

---

## Offizielle Referenzen & Monitoring

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Product Page | Microsoft Foundry | https://azure.microsoft.com/en-us/products/ai-foundry/ | 2026-04-22 |
| Portal | Foundry Portal | https://ai.azure.com | 2026-04-22 |
| Docs | What is Foundry | https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry | 2026-04-22 |
| Docs | Playgrounds | https://learn.microsoft.com/en-us/azure/foundry/concepts/concept-playgrounds | 2026-04-22 |
| Docs | Migrate Hub → Project | https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/migrate-project | 2026-04-22 |
| Docs | Region Support | https://learn.microsoft.com/en-us/azure/foundry/reference/region-support | 2026-04-22 |
| Docs | Deployment Types | https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types | 2026-04-22 |
| Tech Blog | What's new März 2026 | https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-mar-2026/ | 2026-04-22 |
| Tech Blog | What's new Feb 2026 | https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-feb-2026/ | 2026-04-22 |
| Analyst | Power Platform Cave Ignite 2025 | https://www.thepowerplatformcave.com/microsoft-foundry-ignite-2025-analysis/ | 2026-04-22 |
| Analyst | InfoWorld Rebrand 2024 | https://www.infoworld.com/article/3608598/microsoft-rebrands-azure-ai-studio-to-azure-ai-foundry.html | 2026-04-22 |
| Analyst | SAMexpert Product Terms Jan 2026 | https://samexpert.com/microsoft-product-terms-january-2026/ | 2026-04-22 |
| Privacy | EU Data Boundary | https://learn.microsoft.com/en-us/privacy/eudb/eu-data-boundary-learn | 2026-04-22 |
| News | Digital Sovereignty Switzerland (Feb 2026) | https://news.microsoft.com/source/emea/2026/02/how-microsoft-is-addressing-digital-sovereignty-in-switzerland/ | 2026-04-22 |

---

## UNCLEAR

1. Prompt Optimizer GA vs. Preview-Status
2. Prompt Catalog als offizielles Feature im neuen Foundry (oder nur Save-as-Agent-Workflow)
3. Multi-Tenant-Pattern offiziell von MS empfohlen (für Journai-Kundenberatung relevant)
4. Switzerland-spezifische In-Country-Data-Processing-Zeitplan (im 15-Länder-Programm, aber exaktes Datum nicht fix)

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | **Grössere Korrektur**: Foundry ist seit Ignite 2025 **neue PaaS**, nicht Rebrand. Neuer Resource Provider `Microsoft.CognitiveServices/accounts kind=AIServices`, **Hub+Project → Foundry Resource+Projects**. Rebrand-Timeline, 2-Portale-Modell, Decision-Matrix Hub vs. Project, Playground-Inventory (6 Playgrounds), Prompt-Flow-Retirement-Timeline. **Switzerland North GA** für Foundry Projects. | 6 Learn-Docs + 3 DevBlogs + 4 Secondary |
| 2026-04-21 | Hongyu | Initial Stub, Dach-Note für 8 Sub-Komponenten | Arbeitsauftrag |
