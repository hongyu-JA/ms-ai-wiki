---
type: moc
tags: [moc, microsoft, azure-ai, foundry]
last_verified: 2026-04-22
---

# Azure AI MOC

*Primary-Home für Microsoft's Azure-AI-Plattform — im Kern **Microsoft Foundry** als Dach-Produkt aus 8 Sub-Komponenten, plus alle begleitenden Azure-AI-Services (Azure AI Search, Azure OpenAI, Content Safety, Document Intelligence, Content Understanding, Azure ML, Evaluation, Observability).*

---

## Zweck

Einstieg für Cloud-AI-Beratung. Hier liegt die am stärksten **konsolidierte** und gleichzeitig am stärksten **verwirrende** Stelle des MS-AI-Ökosystems (Rebranding von Azure AI Studio + AI Foundry + AI Hub + Control Plane). Diese MOC erklärt die Foundry-Taxonomie und ordnet die Einzel-Services ein.

---

## Landkarte — Microsoft Foundry (8 Komponenten)

Microsoft strukturiert Foundry auf [learn.microsoft.com/en-us/azure/foundry](https://learn.microsoft.com/en-us/azure/foundry/) in **8 Hauptbereiche**. Wir folgen dieser offiziellen Taxonomie.

```
┌────────────────────────────────────────────────────────────────────────┐
│                       [[Microsoft Foundry]]                            │
│                       (Dach — Portal, Projects & Hubs, Playground)     │
├────────────────────────────────────────────────────────────────────────┤
│  1. [[Foundry Models]]           Model Catalog: 11k+ Modelle          │
│                                  OpenAI / Anthropic / Meta / DeepSeek  │
│                                  PAYG / MaaS / PTU                     │
├────────────────────────────────────────────────────────────────────────┤
│  2. [[Foundry Agent Service]]    Managed Hosting für MAF-Agents        │
│                                  ⚠️ aktuell nur North Central US        │
├────────────────────────────────────────────────────────────────────────┤
│  3. [[Foundry Control Plane]]    Deployment · RBAC · Private Network   │
│                                  Content Safety · Tracing · Eval       │
├────────────────────────────────────────────────────────────────────────┤
│  4. [[Foundry IQ]]               Custom Knowledge Base                 │
│                                  (unter der Haube Azure AI Search)     │
├────────────────────────────────────────────────────────────────────────┤
│  5. [[Foundry Tools]]            Azure AI Services:                    │
│                                  Speech · Translator · Language · Face │
│                                  **[[Azure AI Document Intelligence]]** │
│                                  **[[Azure AI Content Understanding]]** │
├────────────────────────────────────────────────────────────────────────┤
│  6. [[Azure Machine Learning]]   Klassische ML-Plattform               │
│                                  (Training, AutoML, Pipelines)         │
├────────────────────────────────────────────────────────────────────────┤
│  7. [[Foundry Local]]            Lokale Inference auf Windows          │
│                                  (CPU/GPU/NPU, OpenAI-kompatibel)      │
├────────────────────────────────────────────────────────────────────────┤
│  8. [[Foundry SDKs]]             AIProjectClient 2.0                   │
│                                  Python · .NET · JS · Java             │
└────────────────────────────────────────────────────────────────────────┘

Ergänzend außerhalb Foundry:
  [[Azure AI Search]] (Tier 1)
  [[Azure OpenAI Service Pricing]]
  [[Azure OpenAI Responses API]]
  [[Azure AI Content Safety]] (Prompt Shields)
  [[Application Insights for AI]] + [[Azure AI Evaluation SDK]]
```

---

## Produkte in dieser MOC


<!-- AUTO-INDEX-START: produkte -->

| Produkt | Was es ist (1 Satz) | Tier | Watch |
| ------- | ------------------- | ---- | ----- |
| 🟢 [[Azure AI Search]] | Hybrid-Search-Backbone für RAG (ex Cognitive Search) — Basis von Foundry IQ | T1 | close |
| 🟢 [[Foundry Agent Service]] | Managed Hosting für MAF-Agents in Azure — aktuell nur North Central US | T1 | close |
| 🟢 [[Foundry Control Plane]] | RBAC, Private Networking, Tracing, Evaluation, Content Safety | T1 | close |
| 🟢 [[Foundry IQ]] | Custom Knowledge Base auf Azure AI Search | T1 | close |
| 🟢 [[Foundry Local]] | Lokale Inference (CPU/GPU/NPU), SMB-relevant für DSGVO/Offline | T1 | close |
| 🟢 [[Foundry Models]] | Model Catalog mit 11k+ Modellen (PAYG/MaaS/PTU) | T1 | close |
| 🟢 [[Foundry SDKs]] | AIProjectClient 2.0 GA — Python · .NET · JS · Java | T1 | close |
| 🟢 [[Foundry Tools]] | Sammelbegriff für Azure AI Services (Document Intelligence, Content Understanding u. a.) | T1 | close |
| 🟢 [[Microsoft Foundry]] | Dach-Produkt der Azure-AI-Plattform — Portal, Projects & Hubs, Playground | T1 | close |
| 🟢 [[Azure Machine Learning]] | Klassische ML-Plattform — v1 ist Deprecation-Kandidat | T1 | passive |
| 🟢 [[Azure AI Content Understanding]] | Multimodale Content-Analyse (Text/Bild/Video/Audio) mit Schema-gesteuertem Output — Teil von Foundry Tools | T2 | standard |
| 🟢 [[Azure AI Document Intelligence]] | OCR + Dokumenten-Struktur-Erkennung (Rechnungen, Verträge, Formulare) — SMB-Einstiegs-Use-Case, ex Form Recognizer | T2 | standard |
| 🟢 [[Azure OpenAI Service Pricing]] | PAYG vs PTU vs Batch — Kostenoptimierung | T3 | passive |
| 🟢 [[Azure OpenAI Responses API]] | Neuer Response-API-Standard — Assistants-API-Nachfolger für Azure-OpenAI-Direktzugriff | T3 | passive |

<!-- AUTO-INDEX-END: produkte -->

## Letzte Aktivität

_Jüngste Changelog-Einträge (30 Tage) der Produkte dieser MOC. Auto-generiert — konsistent mit [[Microsoft MOC#Letzte Aktivität]]._

<!-- AUTO-INDEX-START: activity -->

| Datum | Produkt | Änderung | Autor |
| ----- | ------- | -------- | ----- |
| 2026-04-22 | [[Azure AI Content Understanding]] | Deep-Dive Content Understanding: multimodales Schema-Driven Extraction, Abgrenzung zu Document Intelligence, SMB-Use-Cases, Pricing-Matri… | Hongyu / Deep-Research |
| 2026-04-22 | [[Azure AI Content Understanding]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Azure AI Document Intelligence]] | Deep-Dive Document Intelligence: Prebuilt-Models-Inventar (Financial, ID, Tax, Mortgage, Generic), Custom Neural/Template/Classification/… | Hongyu / Deep-Research |
| 2026-04-22 | [[Azure AI Document Intelligence]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Azure AI Search]] | **Agentic Retrieval** als First-Class-Feature (MCP-exposed, +40% relevance), **Entra Doc-Level Security GA 2025**, Hybrid-Search-Flow-Dia… | Hongyu / Deep-Research |
| 2026-04-22 | [[Azure AI Search]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Azure Machine Learning]] | v1-vs-v2-Status (SDK v1 EOS 30.06.2026!), 4 legitime Agent-Zeitalter-Use-Cases, Azure ML vs. Foundry Linie, Pricing-Struktur, Journai-Tie… | Hongyu / Deep-Research |
| 2026-04-22 | [[Azure Machine Learning]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Azure OpenAI Service Pricing]] | Deep-Dive: PAYG/PTU/Batch-Matrix, Break-Even-Rechnung, Region-Deltas, SMB-Beratungs-Szenarien, Hidden-Costs-Tabelle, PTU-modell-unabhängi… | Hongyu / Deep-Research |
| 2026-04-22 | [[Azure OpenAI Service Pricing]] | Initial Stub (Tier 3 Awareness) | Hongyu |
| 2026-04-22 | [[Azure OpenAI Responses API]] | Deep-Dive Responses API: Azure-Implementierung, Migration von Chat Completions + Assistants, MAF-Abgrenzung | Hongyu / Deep-Research |
| 2026-04-22 | [[Azure OpenAI Responses API]] | Initial Stub (wartet auf Deep-Research) | Hongyu |
| 2026-04-22 | [[Foundry Agent Service]] | **Major correction**: DSGVO-Flag aus Arbeitsauftrag §2.6 überholt — **Switzerland North ist GA-Region**. 10 EU/EFTA-Regionen. Preview-Lim… | Hongyu / Deep-Research |
| 2026-04-22 | [[Foundry Agent Service]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Foundry Control Plane]] | Tracing-Architektur-Diagramm (Foundry+AppInsights = ein Storage), 35+ OOB-Evaluators in 6 Kategorien, RBAC-Rollen-Matrix + Journai-Enterp… | Hongyu / Deep-Research |

<!-- AUTO-INDEX-END: activity -->

---

## Eskalationsleiter / Entscheidungslogik — Foundry-Abgrenzungen

Die 7 Foundry-Abgrenzungen aus dem Arbeitsauftrag §2.6, die in jeder Kundenpräsentation beantwortet sein müssen:

| Frage | Antwort-Regel |
|-------|---------------|
| **Foundry Agent Service** vs. **[[Copilot Studio]]**? | Agent Service = Pro-Code, managed Cloud, Azure-nah. Copilot Studio = Low-Code, M365-nah. Code-Reife + Azure-Affinität entscheidet. |
| **Foundry IQ** vs. **direktes [[Azure AI Search]]**? | IQ = Convenience-Layer, einheitlich für Agents. Direct = volle Flexibilität, eigene Indexer-Logik. Start mit IQ, bei Sonder-Bedarf auf Search wechseln. |
| **Foundry Tracing** vs. **Application Insights**? | Kombinieren: Tracing in Foundry Control Plane für Agent-spezifische Flows, App Insights für Infrastruktur-Logs + SLO. |
| **Foundry Models (PAYG)** vs. **Azure OpenAI (PTU)**? | PAYG unter ~10k req/h; PTU lohnt bei konstantem Volumen + Latenz-SLA. Break-Even-Rechnung vor Kauf. |
| **Foundry Portal** vs. **Azure Portal**? | Foundry Portal für AI-zentrische Tasks (Model Deploy, Playground, Tracing). Azure Portal für Infra (RBAC, VNet, Quotas). |
| **Foundry Cloud** vs. **[[Foundry Local]]**? | Cloud = Standard. Local = DSGVO-sensitive Branchen (Arzt/Anwalt/Steuer), Offline-Szenarien, Privacy-Pflichtszenen. Hybrid-Pattern: Chat lokal, Workflow Cloud. |
| **[[Foundry Tools]]** standalone vs. als Foundry-Bestandteil? | Technisch identische REST-APIs. Over Foundry = einheitliches Billing, einheitliche RBAC. Standalone = ältere Projekte / spezifische SDK-Wünsche. |

### Hands-on Minimum (Pflicht vor Präsentation)

> Ein Foundry-Project aufsetzen → ein Modell aus dem Catalog deployen → einen Test-Agent via MAF gegen das Project laufen lassen → Tracing im Control-Plane-Dashboard anschauen. **Ohne diesen Durchstich versteht man Foundry nicht** (Arbeitsauftrag §2.6).

---

## Querverweise zu anderen MOCs

- [[Microsoft MOC]] — Root
- [[Agents MOC]] — Foundry Agent Service als Hosting-Target für MAF-Agents
- [[Data & Knowledge MOC]] — Foundry IQ basiert auf Azure AI Search, Content Understanding verarbeitet Dateien als Agent-Input
- [[Security & Identity MOC]] — Foundry Control Plane integriert Entra RBAC, Content Safety
- [[Integration & Compute MOC]] — Foundry-Modelle werden über APIM AI Gateway gerouted
- [[RAG Pattern MOC]] (Lens) — Foundry IQ vs. AI Search vs. Cosmos DB Decision
- [[Licensing & SKUs MOC]] — Azure OpenAI PTU, Foundry-Pricing

---

## Offizielle Sammelquellen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| MS Hub-Page | Foundry Overview | https://learn.microsoft.com/en-us/azure/foundry/ | 2026-04-21 |
| MS Hub-Page | Azure AI Services | https://learn.microsoft.com/en-us/azure/ai-services/ | 2026-04-21 |
| Tech Blog | Foundry Devblogs | https://devblogs.microsoft.com/foundry/ | 2026-04-21 |
| MS Roadmap | Azure Updates | https://azure.microsoft.com/en-us/updates/ | 2026-04-21 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-21 | Hongyu | Initial-Erstellung mit Foundry-Landkarte (8 Komponenten) + 7 Abgrenzungs-Fragen |
