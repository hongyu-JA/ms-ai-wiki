---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [Azure AI Services]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Foundry Tools

*Sammelbegriff für die **Azure AI Services** in [[Microsoft Foundry]] — Rebrand der ehemaligen "Azure Cognitive Services". Für Journai-SMB-Kontext zwei zentrale Tools: **[[Azure AI Document Intelligence]]** (Rechnungen, Belege, IDs — $10/1k pages, CH-Region GA) und **[[Azure AI Content Understanding]]** (Multi-Modal mit LLM-Backend — ⚠️ **CH-Region noch nicht verfügbar**). Plus: Speech, Language (8 MCP-Tools für deterministische Agents), Translator.*

> **Analogie:** Was AWS Textract + Rekognition + Transcribe getrennt machen, integriert Foundry Tools unter einem Azure-Dach — mit MCP-first-Agent-Integration.

---

## Services-Inventar (April 2026)

| Service | Rebranding | Status | SMB-Relevanz |
|---------|------------|--------|--------------|
| **[[Azure AI Document Intelligence]]** | ex "Form Recognizer" | GA v4.0 | 🟢 **sehr hoch** — Rechnungen, Belege, Verträge |
| **[[Azure AI Content Understanding]]** | neu 2024/25, GA Nov 2025 | GA (Standard) / Pro Mode Preview | 🟢 **sehr hoch** — Multi-Modal, generative Feldextraktion |
| **Azure Speech** | ex "Speech Service" | GA | 🟡 mittel — Voice-Agents, Call-Protokolle |
| **Azure Language** | ex "Text Analytics" + "LUIS" | GA | 🟢 hoch — PII, Sentiment, CLU für Intent |
| **Azure Translator** | ex "Translator" | GA | 🟡 mittel-hoch — CH/EU-Multilingual |
| Azure AI Vision / Computer Vision | ex "Computer Vision" | GA | 🔴 niedrig für Journai |
| **[[Azure AI Content Safety]]** | eigenständig seit 2023 | GA | 🟡 mittel — Guardrails in Agents |
| Azure AI Face | Separate API | GA (Limited Access) | 🔴 irrelevant |

---

## Journai-SMB-Use-Case-Matrix

| Use-Case | Primäres Tool | Fallback / Ergänzung |
|----------|---------------|----------------------|
| Rechnungsverarbeitung (Standard-Vendoren) | DI `prebuilt-invoice` | Content Understanding |
| Rechnungen mit starker Layout-Varianz | **Content Understanding** (prebuilt invoice) | DI Custom Neural |
| Vertragsverarbeitung (unstrukturiert, Klausel-Extraktion) | **Content Understanding** (inferred fields, reasoning) | Foundry Models direct |
| Belege / Quittungen (Spesen) | DI `prebuilt-receipt` | Content Understanding |
| ID-Dokumente (KYC light) | DI `prebuilt-idDocument` | — |
| Call-Center-Transkripte | Speech (batch + fast transcription) | + Language (Summarization, Sentiment) |
| PII-Redaction in Agent-Outputs | Language PII Detection | Content Safety |
| Intent-Klassifikation in Chat-Agents | Language CLU | LLM-Routing |
| Mehrsprachige Dokumente (DE/FR/IT/EN) | Translator Document Translation | — |

---

## [[Azure AI Document Intelligence]] — Deep-Dive

### Pricing (Pay-as-you-go, April 2026)

| Component | USD |
|-----------|-----|
| **Prebuilt Models** | **$10 / 1.000 pages** |
| Custom Classification | $3 / 1.000 pages |
| **Custom Extraction & Custom Generative** | **$30 / 1.000 pages** |
| Add-Ons (High-Res, Font, Formula) | +$6 / 1.000 pages |
| Training | 10 h gratis, danach $3/h |
| **Commitment-Tier** | ab $190/Monat (20k pages, $9.50/1k) bis $4.000/Monat (500k pages, $8/1k) |

### Prebuilt-Models v4.0 (GA)

- `prebuilt-read` — OCR (Druck + Handschrift)
- `prebuilt-layout` — Tabellen, Selection-Marks, Markdown-Output
- **`prebuilt-invoice`** — Rechnungen (Journai-Kerncase)
- **`prebuilt-receipt`** — Belege
- **`prebuilt-idDocument`** — Pässe, IDs, Führerscheine
- `prebuilt-contract`
- `prebuilt-tax.us.*`, `prebuilt-healthInsuranceCard.us`, `prebuilt-mortgage.*`, `prebuilt-bankCheck` (US-only)

### Custom Models

- **Custom Template** — feste Layouts, ≥5 Samples
- **Custom Neural** — semi-strukturiert, Layout-Varianz
- **Custom Classifier** — Routing bei mixed document batches
- **Custom Generative** (neu, v4.0) — generative Feldextraktion (konzeptueller Überlapp mit Content Understanding)

### EU-Regions

GA in **Switzerland North**, Switzerland West, Germany West Central, Germany North, West Europe, North Europe, France Central, Sweden Central. ✅ Für Journai-CH-Compliance optimal.

---

## [[Azure AI Content Understanding]] — Deep-Dive

### Key-Capabilities

- **Unified Input**: Dokumente + Bilder + Audio + Video im selben Analyzer
- **Schema-driven Extraction**: Nutzer definiert JSON-Schema, Service befüllt es via LLM (zero-shot, no labeling)
- **Inferred Fields**: Felder, die nicht wörtlich im Dokument stehen (Total-Tax-Berechnung, Jurisdiktion aus Adressen)
- **Classification & Splitting**: Mixed-document batches
- **Post-processing Rules**: Date/Währungs-Normalisierung direkt im Field-Descriptor
- **Confidence + Grounding** (wie DI, Abgrenzung zu "Build-your-own-LLM")
- **Prebuilt Analyzers**: RAG Ingestion, Finance, Procurement
- **Multi-File Input (Pro Mode Preview)**: Cross-Document-Validation
- **Reasoning (Pro Mode Preview)**: Multi-Step-Extraction in einem Call
- **Model Choice**: unterliegendes Foundry-Modell (GPT-4.1 class etc.) für Quality/Cost-Tradeoff wählbar

### Pricing

Token-basiert über gewähltes Gen-AI-Deployment + Content-Extraction-Pricing (günstiger Layout-Pricing als DI). Exakte Punkt-Preise *{UNCLEAR für CH/EU}*.

### EU-Regions (kritisch!)

```
04/2026 GA:     West US · Sweden Central · Australia East
Noch NICHT:     West Europe · Switzerland North · Germany WC
Pro Mode:       nutzt "data zone" oder "global" Processing
```

**🔴 Journai-Blocker für strikte CH-Residenz**: Content Understanding ist in CH noch nicht GA. Workaround über Sweden Central (EU, aber nicht CH).

---

## DI vs. Content Understanding — Entscheidungsmatrix

| Szenario | Empfehlung | Begründung |
|----------|------------|------------|
| Standard-Rechnungen (wenige bekannte Vendoren) | **DI prebuilt-invoice** | Tiefste Latenz, geringster Preis, $10/1k |
| Rechnungen von 100+ Vendoren mit Layout-Chaos | **Content Understanding** | Generalisiert über Templates, keine Labeling-Arbeit |
| Spesenbelege gescannt per Mobile | **DI prebuilt-receipt** | Robust auf Low-Quality-Scans |
| Vertragsklausel-Extraktion (Kündigungsfrist, Parteien) | **Content Understanding** | Inferred Fields, semantisches Verständnis |
| Mixed PDF-Stapel (Rechnung + Vertrag + ID im selben Upload) | **Content Understanding** (Classification + Split) | DI braucht zusätzlichen Custom Classifier |
| Strikte CH-Datenresidenz **heute** | **DI** (Switzerland North) | CU in CH noch nicht verfügbar |
| Multi-Modal (Dokument + Call-Recording zusammen) | **Content Understanding Pro** | Einzige Option |
| Niedrigste Latenz (synchron, User-facing) | **DI** | CU medium latency |

**Strategische Journai-Empfehlung**: DI als Workhorse für Rechnungs-/Belegfluss + Content Understanding für Vertragsintelligenz und unstrukturierte Fälle, sobald Switzerland-Region GA ist.

---

## Speech + Language Highlights

### Speech (Voice-Agents)

- **Real-time STT** — Streaming für Live-Call-Assistent
- **Fast Transcription** — synchrone Datei-API (< 60 s)
- **Batch Transcription** — Call-Archive
- **Custom Speech** — Domain-Vokabular (Finance/Schweiz-Dialekte)
- **Neural HD TTS** — $22/1M Zeichen (reduziert von $30, März 2026); **neu auch France Central + Sweden Central**
- **Custom Neural Voice** — Brand-Voice (Limited Access)
- **Speech Translation** — kombinierter STT + MT Call
- **MAI-Voice-1** (Preview) — Microsofts flagship expressive voice

### Language — 8 MCP-Tools für deterministische Agents

Alle 8 Sub-Tools sind 2026 als **MCP-Tools** direkt in Foundry Agent Service exponiert:

```
1. PII Detection/Redaction      →  GDPR-Pflichtbaustein vor LLM-Calls
2. Sentiment Analysis           →  Kunden-Feedback
3. Summarization                →  Meeting-Recaps, Chapter-Timestamps
4. Named Entity Recognition     →  Firmen/Personen/Orte
5. Key Phrase Extraction        →  schnelles Indexing
6. Language Detection           →  Routing DE/FR/IT/EN
7. Conversational Language     →  Intent-Klassifikation (ersetzt LUIS)
   Understanding (CLU)
8. Custom Question Answering    →  Q&A-Agent direkt aus Playground
   (CQA)
9. Text Analytics for Health    →  nur Healthcare-SMB-Targets
```

**MAF-Tool-Pattern**: Language MCP-Server bietet alle 8 NLP-Ops als aufrufbare Tools — **deterministisch, günstig, privacy-friendly** (kein LLM-Roundtrip für einfache Ops).

### Translator

- 135 Sprachen, Text + Document Translation
- **Custom Translator** — Fine-tuned Domain-Modelle
- Document Translation braucht **Custom Domain Endpoint** (nicht Standard-Cognitive-Endpoint)
- EU-Compliance: alle grossen EU-Regions inkl. **Switzerland North/West** verfügbar

---

## Foundry-Integration vs. Standalone

### Integration in Foundry (empfohlen)

- **Einheitlicher Endpoint**: `https://<resource>.services.ai.azure.com` für Vision, Content Safety, DI, Language, Translator
- **Exposed als MAF-Tools / MCP-Tools**: 1.400+ Systeme inkl. AI Search, SharePoint, Fabric
- **Foundry MCP Server** (cloud-hosted an `mcp.ai.azure.com`, live seit 03.12.2025) — kein lokaler Prozess, Entra-Auth eingebaut
- **Einheitliches Billing** via Foundry-Resource
- **Zentrale Governance**: Control Plane, End-to-End Private Networking GA, OAuth-Passthrough für MCP

### Standalone-Ressource (Legacy / Sonderfälle)

Gleicher REST-API, separates Billing. Relevant bei bestehenden Enterprise-Verträgen, getrennten Cost-Centers, Compliance-Isolation.

### Pro/Contra Journai

**Pro Foundry**: einheitliches RBAC, MCP-First-Agent-Architektur, Tool-Discovery, Control Plane, schnellere Feature-Durchreiche.
**Contra**: **Content Understanding noch nicht in Switzerland** — zwingt zu Sweden Central oder DI-Fallback.

---

## EU-Region-Coverage (Journai-Sicht)

| Service | CH North | CH West | Germany WC | West Europe | France Central | Sweden Central |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|
| Document Intelligence v4.0 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Content Understanding** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Speech (STT/TTS) | *{UNC}* | *{UNC}* | ✅ | ✅ | ✅ (HD seit 03/2026) | ✅ (HD seit 03/2026) |
| Language | ✅ | *{UNC}* | ✅ | ✅ | ✅ | ✅ |
| Translator | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Foundry Agent Service | *{UNC}* | *{UNC}* | *{UNC}* | ✅ | ✅ | ✅ |

**Takeaway für Journai-CH**: DI + Language + Translator in Switzerland North funktioniert heute — **Content Understanding** über Sweden Central fahren oder auf CH-Region-Roadmap warten.

---

## Limitierungen & Fallstricke

- **Content Understanding NICHT in CH** — aktuell Blocker für strikt residente Setups
- **Confidence-Score ignorieren** — unter 0.8 manuell verifizieren, sonst Downstream-Fehler
- **CU-Token-Kosten** können bei hohem Volumen explodieren (LLM-basiert)
- **DI vs. CU überlappen** — klassische Rechnungs-OCR über CU ist Overkill + teuer
- **SAP-OData-Connector** nur Preview via Power Platform (nicht nativer Foundry-Tool-Endpoint)

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Foundry Tools | https://azure.microsoft.com/en-us/products/ai-foundry/tools | 2026-04-22 |
| Docs | Document Intelligence v4.0 | https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/ | 2026-04-22 |
| Docs | DI Prebuilt Invoice Model | https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/prebuilt/invoice?view=doc-intel-4.0.0 | 2026-04-22 |
| Docs | Content Understanding Overview | https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/overview | 2026-04-22 |
| Docs | CU Standard vs Pro Modes | https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/standard-pro-modes | 2026-04-22 |
| Docs | Choose right Azure AI tool | https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/choosing-right-ai-tool | 2026-04-22 |
| Blog | CU GA Announcement | https://devblogs.microsoft.com/foundry/azure-content-understanding-is-now-generally-available/ | 2026-04-22 |
| Docs | CU Region Support | https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/language-region-support | 2026-04-22 |
| Pricing | DI Pricing | https://azure.microsoft.com/en-us/pricing/details/document-intelligence/ | 2026-04-22 |
| Pricing | CU Pricing | https://azure.microsoft.com/en-us/pricing/details/content-understanding/ | 2026-04-22 |
| Docs | Speech Overview | https://learn.microsoft.com/en-us/azure/ai-services/speech-service/overview | 2026-04-22 |
| Docs | Language Overview | https://learn.microsoft.com/en-us/azure/ai-services/language-service/overview | 2026-04-22 |
| Docs | Language for Agents | https://learn.microsoft.com/en-us/azure/ai-services/language-service/concepts/foundry-tools-agents | 2026-04-22 |
| Blog | Language MCP-Tools Announcement | https://devblogs.microsoft.com/foundry/announcing-azure-language-in-foundry-tools-for-deterministic-privacy-first-agents/ | 2026-04-22 |
| Blog | Foundry MCP Server Preview | https://devblogs.microsoft.com/foundry/announcing-foundry-mcp-server-preview-speeding-up-ai-dev-with-microsoft-foundry/ | 2026-04-22 |
| Docs | Translator | https://learn.microsoft.com/en-us/azure/ai-services/translator/ | 2026-04-22 |
| Tools | DI Studio | https://documentintelligence.ai.azure.com | 2026-04-22 |

---

## UNCLEAR

1. CU-Token-Preisliste für CH/EU
2. Translator Custom-Region-Liste
3. Speech-Verfügbarkeit in Switzerland West
4. CU Switzerland-North-Roadmap

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Services-Inventar mit Status + SMB-Relevanz, DI Deep-Dive (Pricing-Matrix, Prebuilt-Models v4.0, Custom Generative), CU Deep-Dive (Schema-driven + Pro Mode Preview), **DI-vs-CU-Entscheidungsmatrix**, Language 8 MCP-Tools als deterministische Agent-Ops, EU-Region-Coverage-Matrix (**CU noch nicht in CH!**), Foundry vs. Standalone Pro/Contra | Learn + DevBlogs + TechCommunity |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
