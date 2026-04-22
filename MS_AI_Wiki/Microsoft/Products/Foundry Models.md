---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [Model Catalog, Foundry Model Catalog]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Foundry Models

*Der **Model Catalog** in [[Microsoft Foundry]]. 11.000+ Modelle, 11+ Publishers. Drei Deployment-Modi: **PAYG Serverless / MaaS / PTU**. Switzerland North: 92 Modelle verfügbar. **Claude (Anthropic) nur in Sweden Central + East US2** — out-of-EU-Data-Boundary. April-2026-News: neue MAI-Familie (Transcribe-1, Voice-1, Image-2), Llama 4 Scout mit 10M-Token-Kontext, o4-mini mit RFT.*

> **Analogie:** Wie Hugging Face Hub für Enterprise — kuratiertes Modell-Verzeichnis mit einheitlichem Billing, Azure-Integration und vorverhandelten Anbieter-Verträgen (MS-DPA).

---

## Einsatz

### Job-to-be-done

When I Modelle in produktiven Azure-Workloads deployen will, I want to einen kuratierten Katalog mit einheitlichem Billing + Azure-Integration + MS-DPA, so I can Anbieter-Wechsel ohne neuen Vertrag durchführen und pro Region sauber steuern.

### Trigger-Signale

- „Wir brauchen Claude 4.6 — aber EU-Data-Boundary ist kritisch."
- „PAYG skaliert kostenmäßig nicht, lohnt PTU?"
- „Welches Modell für SMB-Rechnungs-Klassifikation?"

### Einsatz-Szenarien

1. **Multi-Modell-Routing via APIM** — [[APIM AI Gateway]] vor mehreren Foundry-Model-Endpoints; Policy entscheidet pro Request (GPT-4.1 für komplex, GPT-4.1-mini für Masse).
2. **PTU-Break-even** — ab ~$1.5k/Monat konstantem PAYG-Volumen rechnet sich 50 PTU (GPT-4.1). Exakt via Azure Pricing Calculator.
3. **Claude-Einsatz in EU** — nur in Sweden Central + East US2 verfügbar, **nicht CH**; DSGVO-Kommunikation mit Kunden Pflicht (EU-Data-Boundary-Warnung).

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Azure-Subscription mit AI-Services-Kontingent |
| **Tenant / Infrastruktur** | Foundry-Project in gewünschter Region; Modell-Verfügbarkeit prüfen (CH: 92 Modelle, ohne Claude) |
| **Skills / Rollen** | Azure-Architekt für Modell-Wahl + Cost-Planning |
| **Compliance-Rahmen** | MS-DPA + ggf. Anbieter-spezifische DPAs (OpenAI/Anthropic/Meta) |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | Deployment eines Modells <1 Tag |
| **Laufende Lizenzkosten** | PAYG: pro 1M Tokens modell-abhängig; PTU: ~$1.5k–10k/Monat je nach Modell + PTU-Count |
| **Laufender Betrieb** | Modell-Deprecations monitoren (siehe Deprecation-Radar) |

### Empfehlung

**Status:** 🟢 für M365-/Azure-Kunden mit klarer Modell-Strategie. 🟡 Claude-Einsatz nur mit expliziter Sweden-Central-Wahl + DSGVO-Kommunikation.

**Nächster Schritt für Journai:** PTU-Break-even-Kalkulator als Standard-Asset im Kunden-Gespräch; Modell-Deprecation-Monitoring via [[Deprecation Radar]].

---

## Top-20-Modelle (April 2026)

| # | Modell | Anbieter | Kontext | Modalität | EU-Region | Pricing |
|---|--------|----------|---------|-----------|-----------|---------|
| 1 | **GPT-5.4 Pro** | Azure OpenAI | *{UNCLEAR}* | Text reasoning | GWC, CH North (DataZone EU) | PAYG + PTU |
| 2 | **GPT-5.4** | Azure OpenAI | *{UNCLEAR}* | Text reasoning | GWC, CH North (DataZone EU) | PAYG + PTU |
| 3 | **GPT-5.3-codex** | Azure OpenAI | *{UNCLEAR}* | Code | DataZone EU | PAYG + PTU |
| 4 | **o4-mini** | Azure OpenAI | *{UNCLEAR}* | Reasoning | DataZone EU (13+ Regionen Global Training) | PAYG + FT + PTU |
| 5 | GPT-4.1 / -mini / -nano | Azure OpenAI | bis ~1M | Text | GWC u.a. | PAYG + FT + PTU — **Retirement ab 11.04.2026** |
| 6 | **Claude Opus 4.6** | Anthropic | ~200k | Text + Vision | **nur Sweden Central (EU)** + East US2 | MaaS Global Standard |
| 7 | Claude Sonnet 4.6 | Anthropic | ~200k | Text + Vision | Sweden Central, East US2 | MaaS Global Standard |
| 8 | **MAI-Transcribe-1** (NEU April 2026) | Microsoft MAI | Audio, 25 Sprachen | Speech→Text | *{UNCLEAR-EU}* | MaaS/PAYG |
| 9 | **MAI-Voice-1** (NEU April 2026) | Microsoft MAI | n/a | Text→Speech | *{UNCLEAR-EU}* | MaaS/PAYG |
| 10 | **MAI-Image-2** (NEU April 2026) | Microsoft MAI | n/a | Text→Image | *{UNCLEAR-EU}* | MaaS/PAYG |
| 11 | DeepSeek-R1 | DeepSeek | *{UNCLEAR}* | Text reasoning | EU Serverless | MaaS PAYG |
| 12 | DeepSeek-V3.2 | DeepSeek | *{UNCLEAR}* | Text (MoE) | EU Serverless | MaaS PAYG + PTU |
| 13 | Grok 4 | xAI | *{UNCLEAR}* | Text reasoning | EU Serverless *{UNCLEAR}* | MaaS PAYG |
| 14 | **Llama 4 Scout (17B)** | Meta | **10M Tokens!** | Text multimodal | EU Serverless | MaaS PAYG + **FT** |
| 15 | Llama 3.1-405B Instruct | Meta | 128k | Text | EU | MaaS PAYG |
| 16 | Mistral Large | Mistral AI | 128k | Text | EU (France Central *{UNCLEAR}*) | MaaS PAYG |
| 17 | Mistral Medium 3 | Mistral AI | *{UNCLEAR}* | Text | EU | MaaS PAYG |
| 18 | Ministral 3B | Mistral AI | *{UNCLEAR}* | Text edge | EU | MaaS PAYG |
| 19 | Mistral-OCR-2503 | Mistral AI | n/a | OCR | EU | MaaS PAYG |
| 20 | Phi-4 / Phi-4-mini-instruct | Microsoft | *{UNCLEAR}* | SLM | EU (Managed Compute) | Managed Compute + FT |

---

## PAYG vs. MaaS vs. PTU — Entscheidungs-Regel

```
                  Kunde fragt: welcher Deployment-Modus?
                              │
                              ▼
         ┌────────────────────────────────────────┐
         │ Prototyp oder variables Volumen?       │
         └────────────────────────────────────────┘
              JA ▼                       NEIN ▼
     ┌──────────────────┐   ┌────────────────────────────────┐
     │ 🟢 PAYG Standard  │   │ Partner-Modell (Claude/Llama/  │
     │    oder Global   │   │ Mistral/DeepSeek/Grok/Cohere)? │
     │    Standard     │   └────────────────────────────────┘
     └──────────────────┘         JA ▼          NEIN ▼
                        ┌─────────────────┐  ┌────────────────┐
                        │ 🟢 MaaS          │   │ > 1 Mio Tokens │
                        │    Serverless    │   │ pro Tag +      │
                        │    Partner       │   │ Latenz-SLA?    │
                        │    Endpoint      │   └────────────────┘
                        └─────────────────┘        JA ▼     NEIN ▼
                                             ┌─────────┐  ┌─────────┐
                                             │ 🟢 PTU   │  │ 🟢 PAYG  │
                                             │  Provis. │  │  Standard│
                                             │  Through.│  │          │
                                             └─────────┘  └─────────┘

  Spiky Traffic mit Baseline → Hybrid (PTU-Baseline + PAYG-Spillover)
```

### PTU-Break-Even

- Einstieg: ~**$2.448/Monat** (Basis-Einheit)
- **Annual Reservation**: ~**35% Rabatt**
- **Break-Even vs. PAYG** (GPT-4o-Referenz): ~**150-200 Mio Tokens/Monat** (≈ 5-7 Mio/Tag)
- **Faustregel**: ab **$1.800 PAYG/Monat** lohnt PTU
- Skalierungseinheit: generische PTU; exakte Tokens/s pro PTU *{UNCLEAR, modellabhängig}*

---

## EU-Region-Matrix für Top-Modelle

| Region | Azure OpenAI | Claude | Llama | Mistral | DeepSeek | Grok | Phi |
|--------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Sweden Central** | ✅ | **✅ (einzige EU)** | ✅ | ✅ | ✅ | *{UNC}* | ✅ |
| **Germany West Central** | ✅ (DataZone) | ❌ | ✅ | ✅ | ✅ | *{UNC}* | ✅ |
| **Switzerland North** | ✅ (92 Modelle, 11 Publishers) | ❌ | ✅ | ✅ | ✅ | *{UNC}* | ✅ |
| Switzerland West | teilweise | ❌ | *{UNC}* | *{UNC}* | *{UNC}* | *{UNC}* | *{UNC}* |
| France Central | ✅ | ❌ | ✅ | ✅ (Mistral-Heimat) | ✅ | *{UNC}* | ✅ |
| West/North Europe | ✅ | ❌ | ✅ | ✅ | *{UNC}* | *{UNC}* | ✅ |

---

## Anthropic Claude in Foundry (DSGVO-kritisch)

- **Modelle**: Claude Opus 4.6, Claude Sonnet 4.6
- **Deployment-Typ**: Global Standard (MaaS). US DataZone „coming soon"; **keine EU-DataZone angekündigt**
- **Regionen**: nur **East US2** + **Sweden Central**
- **EU Data Boundary**: 🔴 **OUT-OF-SCOPE** — Claude läuft auf Anthropic-Infrastruktur

### Aktivierung (EU-Tenant, compliance-kritisch)

1. Bezahltes Azure-Abo, Billing-Land das Anthropic unterstützt
2. Foundry-Resource in East US2 oder Sweden Central
3. Model Catalog → `claude-opus-4-6` oder `claude-sonnet-4-6` → Deploy (Global Standard)
4. ⚠️ Bekannter Fehler: `AnthropicOrganizationCreationFailed` in Sweden Central (siehe MS Q&A)

### Konsequenz für Journai-CH

**Switzerland North liefert kein Claude.** Optionen:
- (A) **Sweden Central akzeptieren** — EU-Region, aber ausserhalb EU-Data-Boundary; DPIA erforderlich
- (B) **Direkte Anthropic-API** (nicht über Foundry); eigener DPA mit Anthropic
- (C) **Claude via AWS Bedrock** — Multi-Cloud

---

## Fine-Tuning-Pfad

**Fine-tunebar (April 2026)**:
- GPT-4.1 / -mini / -nano, GPT-4o / -mini — **SFT**
- **o4-mini** — **RFT** (Reinforcement Fine-Tuning) + **Global Training (13+ Regionen, günstiger)**
- **Llama 4 Scout (17B, 10M Kontext)** — **SFT, seit April 2026 aktiviert**
- Llama 2, Llama 3.1, Phi-4, Phi-4-mini-instruct, Mistral Nemo — SFT

**Pricing-Modell**:
- **Training**: pro Trainings-Token (Tokens × Epochen)
- **Inferenz**: höherer Per-Token-Preis als Basismodell + ggf. **Hosting-Stundensatz** für FT-Deployment
- Exakte USD-Tarife *{UNCLEAR — modell-/region-abhängig}*

---

## Model Deprecations 2026 (wichtig für Kunden-Migrationsplan!)

| Modell | Retirement-Datum | Nachfolger |
|--------|------------------|------------|
| **gpt-4o** | **31.03.2026** (bereits erfolgt!) | GPT-5.x |
| **gpt-4o-mini** | **31.03.2026** | GPT-5.x-mini |
| **gpt-4.1 / -mini / -nano** | **ab 11.04.2026** | GPT-5.x |
| **GPT-4 Turbo** | **13.10.2026** | GPT-5.x |
| **gpt-3.5-turbo-0125** | 31.05.2025 (retired) | GPT-5.x-mini |
| text-embedding-ada-002 | *{UNCLEAR}* | text-embedding-3-large/small |

**Lifecycle**: mind. 60 Tage Vorankündigung → **Legacy** (≥30 T) → **Deprecated** (≥90 T) → **Retired** (API-Error).

**Wichtig**: OpenAI-Retirements (openai.com) gelten **NICHT automatisch** für Azure Foundry — MS-Timeline verfolgen.

---

## Foundry vs. direktem Azure-OpenAI vs. Anbieter-SDK

| Kriterium | **Foundry Catalog** | direkte Azure-OpenAI-Resource | direktes Anbieter-SDK |
|-----------|---------------------|-------------------------------|----------------------|
| Modellbreite | 11.000+, 11+ Publisher | nur OpenAI | nur ein Anbieter |
| Einheitliches API | ✅ Azure AI Inference SDK | Azure OpenAI SDK | anbieter-spezifisch |
| EU Data Boundary | teilweise (OpenAI ja; Claude nein) | ✅ (DataZone) | nein/anbieterabhängig |
| Fine-Tuning | breit (OpenAI+Meta+Phi+Mistral) | nur OpenAI | anbieterabhängig |
| Evaluation / Leaderboards | ✅ **eingebaut** | begrenzt | keine |
| PTU-Option | ✅ | ✅ | ❌ |
| Schweiz / DSGVO | CH North möglich (ohne Claude) | CH North möglich | anbieterabhängig |
| Billing | 1 Azure-Rechnung | 1 Azure-Rechnung | separater Vertrag |

**Journai-Empfehlung**: Foundry als Haupt-Gateway — einheitliches Billing, CH-Region, eingebaute Evaluation. Claude nur wenn Sweden-Central-Compliance akzeptabel.

---

## Model Evaluation im Foundry-Portal

Eingebaut: `ai.azure.com/explore/leaderboard`.

**Dimensionen**: Quality · Safety · Cost · Throughput.

**Features**:
- **Scenario Leaderboards** (Reasoning/Coding/Math/QA/Knowledge)
- **Trade-off Charts** (Quality-vs-Cost etc.)
- **Safety-Evaluators** (PII, harmful content, groundedness)
- **Custom Evaluators** via Foundry Evaluators SDK

**April-2026-Beispiele**: GPT-5.3-codex dominiert Leaderboard (März 2026), MAI-Image-2 Platz 3 auf Arena.ai.

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| [[Foundry Control Plane]] | RBAC + Tracing + Content Safety Policies vor Modell-Calls | GA | Policies pro Modell-Deployment, nicht tenant-weit |
| [[APIM AI Gateway]] | Rate-Limiting, Token-Budget, Semantic Cache, Multi-Backend-Routing | GA | PTU nicht shareable — pro Deployment ein APIM-Backend |
| [[Microsoft Agent Framework]] | Agent ruft Modell via `AIProjectClient.inference.get_chat_client()` | GA | Model-Choice in MAF-Config, nicht zur Laufzeit |
| [[Azure AI Content Safety]] | Built-in Filter (4 Harm-Kategorien default) + optional Prompt Shields | GA | Prompt Shields opt-in, separat abgerechnet |
| [[Foundry Agent Service]] | Managed Agent-Hosting nutzt Foundry-Modelle | GA | Region-Match nötig für niedrige Latenz |
| [[Foundry SDKs]] | `InferenceClient` aus AIProjectClient 2.0 | GA | OpenAI-Kompatibilitäts-Modus über `/openai/deployments/{name}` |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| OpenAI SDK | direkter Zugriff über Azure-OpenAI-Endpoint | GA | Auth via Entra statt OpenAI-API-Key; DNS für `.openai.azure.com` |
| Anthropic SDK | Claude-Modelle in Foundry aufrufbar | Preview | nur Sweden Central + East US2 — **nicht CH** |
| LangChain / LlamaIndex | AzureChatOpenAI-Wrapper | GA | Semantic Kernel MAF-Migration parallel im Fluss |

### APIs / Protokolle

- **OpenAI-kompatible REST** (`/openai/deployments/{name}/chat/completions`) — für Drop-in aus OpenAI-Projekten
- **MaaS REST** für non-OpenAI-Modelle (Anthropic, Meta, Mistral, DeepSeek)
- **Foundry SDK** (`AIProjectClient`) — einheitlich über alle Modelle
- **MCP** — Modelle selbst sind keine MCP-Server, aber Agents rufen Modelle **und** MCP-Tools im selben Call

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Foundry Models Overview | https://learn.microsoft.com/en-us/azure/foundry/concepts/foundry-models-overview | 2026-04-22 |
| Docs | Deployment Types | https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/deployment-types | 2026-04-22 |
| Docs | PTU Onboarding | https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/provisioned-throughput-onboarding | 2026-04-22 |
| Docs | Claude How-To | https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-claude | 2026-04-22 |
| Docs | Model Lifecycle & Retirement | https://learn.microsoft.com/en-us/azure/foundry/concepts/model-lifecycle-retirement | 2026-04-22 |
| Docs | Azure OpenAI Retirements | https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/model-retirements | 2026-04-22 |
| Docs | Region Support | https://learn.microsoft.com/en-us/azure/foundry/reference/region-support | 2026-04-22 |
| Docs | Model Benchmarks | https://learn.microsoft.com/en-us/azure/foundry/concepts/model-benchmarks | 2026-04-22 |
| Pricing | Foundry Pricing | https://azure.microsoft.com/en-us/pricing/details/ai-foundry/ | 2026-04-22 |
| Pricing | Microsoft-Modelle | https://azure.microsoft.com/en-us/pricing/details/ai-foundry-models/microsoft/ | 2026-04-22 |
| Tech Blog | Claude Opus 4.6 Launch | https://azure.microsoft.com/en-us/blog/claude-opus-4-6-anthropics-powerful-model-for-coding-agents-and-enterprise-workflows-is-now-available-in-microsoft-foundry-on-azure/ | 2026-04-22 |
| Blog | MAI-Models Announcement | https://microsoft.ai/news/today-were-announcing-3-new-world-class-mai-models-available-in-foundry/ | 2026-04-22 |
| Blog | Foundry Fine-Tune April 2026 | https://devblogs.microsoft.com/foundry/whats-new-in-foundry-finetune-april-2026/ | 2026-04-22 |
| Catalog | Model Catalog Live | https://ai.azure.com/catalog | 2026-04-22 |
| Catalog | Leaderboard | https://ai.azure.com/explore/leaderboard | 2026-04-22 |
| Third-Party | PTU Calculator | https://www.ptucalc.com/ | 2026-04-22 |
| Third-Party | Model Availability | https://modelavailability.com/platforms/azure/regions | 2026-04-22 |

---

## UNCLEAR

1. Exakte Kontextfenster einiger Modelle
2. Grok-4 EU-Region-Verfügbarkeit
3. Fine-Tuning USD-Tarife pro Modell/Region
4. text-embedding-ada-002 Retirement-Datum
5. MAI-Transcribe/Voice/Image-2 EU-Region-Status

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Top-20-Katalog-Tabelle, PAYG/MaaS/PTU-Entscheidungs-Flow, Break-Even-Rechnung (~$1.8k PAYG/Monat → PTU), EU-Region-Matrix mit **Claude=Sweden-Central-only** + **out-of-EU-Data-Boundary**, Anthropic-Aktivierungs-Flow, Fine-Tuning-Pfad mit Llama 4 Scout 10M-Kontext, Model-Deprecations-Kalender 2026 | Learn + Azure Blog + MAI News + Leaderboards |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
