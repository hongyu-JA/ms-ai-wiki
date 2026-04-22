---
watch: close
status: ga
last_verified: 2026-04-22
aliases: []
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Foundry Control Plane

*Die **Steuerungs- und Observability-Schicht** über [[Microsoft Foundry]]. Bündelt Deployment, RBAC (via Entra), Private Networking, Content Safety Policies, **Tracing + Evaluation + Observability + Responsible AI**. Kernerkenntnis: Foundry Tracing ist **kein separates Backend**, sondern OTel-Producer → Application Insights. **35+ OOB-Evaluators** in 6 Kategorien. **Medium-Threshold auf allen Risikokategorien** als Default, Jailbreak/Protected-Material nicht abschaltbar.*

> **Analogie:** Wie Kubernetes Control Plane für Container — die Komponente, die „die Regeln durchsetzt" und „überwacht, was läuft".

---

## Einsatz

### Job-to-be-done

When I Foundry-Projekte produktiv + compliance-konform betreibe, I want to RBAC + VNet + Tracing + Evaluation + Content Safety an einem Ort, so I can Compliance-Anforderungen ohne Tool-Mosaic erfüllen und Kunden DSGVO-belegbare Evidenz liefern.

### Trigger-Signale

- „Wer darf was im Foundry-Projekt? Wir brauchen RBAC-Klarheit für Audit."
- „Wie kombinieren wir Foundry-Tracing mit Application Insights?"
- „Welche Evaluators sind out-of-the-box für Regression-Testing verfügbar?"

### Einsatz-Szenarien

1. **Enterprise-Tenant-Setup** — Foundry-Rollen-Matrix (4 Foundry-spezifische Rollen), Entra-Groups pro Journai-Kundenprojekt, Private Endpoints für regulierte Branchen.
2. **CI/CD mit Evaluation-Runs** — 35+ OOB-Evaluators (Groundedness, Relevance, Coherence, Safety) als Regression-Test-Suite pro PR, Foundry-SDK + GitHub Actions.
3. **Tracing + App Insights Integration** — Foundry Tracing schreibt in denselben App-Insights-Workspace → einheitliche Observability-Ansicht für SRE-Team.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Azure-Subscription + Foundry-Project + App Insights |
| **Tenant / Infrastruktur** | VNet + Private Endpoints für Enterprise; Entra-Groups für RBAC |
| **Skills / Rollen** | Azure-Architekt für Netzwerk; SRE für Observability; Compliance-Officer für Policy-Reviews |
| **Compliance-Rahmen** | Content Safety Policies aktiviert; Evaluation-Baseline für EU-AI-Act-Audit |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | 1–2 Wochen bei Enterprise-Rollout (Rollen-Matrix + VNet + Baseline-Evaluators) |
| **Laufende Lizenzkosten** | Foundry selbst kostenfrei; Azure AI Evaluation SDK + App Insights volumenbasiert |
| **Laufender Betrieb** | Policy-Reviews quartalsweise; Evaluation-Baseline bei Modell-Wechsel |

### Empfehlung

**Status:** 🟢 für alle produktiven Foundry-Deployments — Governance ist nicht optional. Ohne Control Plane kein DSGVO-/EU-AI-Act-Evidenz-Track.

**Nächster Schritt für Journai:** Rollen-Matrix-Template + Standard-Evaluators-Set (Groundedness + Safety + Relevance) als Infra-as-Code im Starter-Repo ablegen; als Default für alle neuen Foundry-Projekte.

---

## Tracing — kein paralleler Stack, sondern derselbe Storage

```
┌──────────────────────────────────────────────────────────────────┐
│ Gemeinsame Storage-Schicht: Application Insights (ein Workspace) │
└──────────────────────────────────────────────────────────────────┘
                    ▲                           ▲
                    │                           │
   ┌────────────────┴────────┐  ┌───────────────┴─────────────────┐
   │ Foundry-Portal Traces-Tab│  │ App-Insights Agents-Blade        │
   │                          │  │ (Preview)                        │
   │ → Dev / Debug            │  │ → SRE / Ops                      │
   │ • 90-Tage-Retention      │  │ • KQL-Queries                    │
   │ • Span-Tree              │  │ • Alerts                         │
   │ • Conversation-View      │  │ • Cross-Resource-Queries         │
   │ • Agent-aware UI         │  │ • Log Analytics WS > 90d         │
   └──────────────────────────┘  └──────────────────────────────────┘
```

**→ Man wählt NICHT zwischen den beiden — EINE App-Insights-Resource, konsumiert aus beiden UIs.**

**OTel-Semantic-Conventions**: `gen_ai.*` (inkl. `gen_ai.system=microsoft.foundry`). Framework-Integration: [[Microsoft Agent Framework]], Semantic Kernel (deprecated), LangChain, LangGraph, OpenAI Agents SDK.

**Sampling**: *{UNCLEAR: offizielle Docs nennen keine expliziten Ratios. Folgt OTel-SDK-Config oder App-Insights Adaptive Sampling. Empfehlung für Journai: Head-based Sampling im OTel-SDK für Kosten, 100% für Safety-Events.}*

**Erfasst**: Latenz, Exceptions, **Prompt-Content, Completions**, Retrieval-Ops, Tool-Calls, Token-Usage, Safety-Classifier-Scores, Run-Steps. ⚠️ **PII möglich** → Redaction vor Ingest.

---

## Evaluation — 35+ OOB-Evaluators in 6 Kategorien

| Kategorie | Evaluators | Judge-Model? |
|-----------|------------|--------------|
| **General Purpose** | Coherence, Fluency | ja (LLM) |
| **Textual Similarity** | Similarity, F1, BLEU, GLEU, ROUGE, METEOR | nur Similarity |
| **RAG** | Retrieval, Document Retrieval, **Groundedness**, **Groundedness Pro** (Preview, Content-Safety-Service, kein LLM), Relevance, Response Completeness (Preview) | teils |
| **Risk & Safety** | Hate/Unfairness, Sexual, Violence, Self-Harm, Protected Materials, Indirect Attack (XPIA), Code Vulnerability, Ungrounded Attributes, Prohibited Actions (Preview), Sensitive Data Leakage (Preview) | nein (Content-Safety-Service) |
| **Agent** | Task Adherence, Task Completion, Intent Resolution, Task Navigation Efficiency, **Tool Call Accuracy**, Tool Selection, Tool Input Accuracy, Tool Output Utilization, Tool Call Success | ja |
| **OpenAI Graders** | Model Labeler, String Checker, Text Similarity, Model Scorer | teils |

### Microsoft-Recommendation-Bundles

```
RAG-App:    Retrieval + Groundedness + Relevance + Content Safety
Agent-App:  Tool Call Accuracy + Task Adherence + Intent Resolution
            + Content Safety
Alle Apps:  + Hate/Sexual/Violence/Self-Harm
```

**Custom Evaluators**: No-Code im Foundry-Portal (Evaluation → Evaluator Catalog → Custom Evaluator → Create) ODER Code via `azure-ai-evaluation` SDK.

**Judge-Model-Kosten**: keine separate Preisliste; = reguläre Inference-Kosten des Judge-Models (typisch gpt-4o-mini / gpt-4.1). **Groundedness Pro** umgeht Judge-LLM-Kosten via Content-Safety-API.

---

## RBAC — 4 Foundry-spezifische Rollen

**Scopes**: Foundry Resource (Account-Level) + Foundry Project (Sub-Scope).

| Rolle | Create Projects | Create Accounts | Data Actions | Role Assignment | Reader | Manage Models |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| **Azure AI User** | – | – | ✅ | – | ✅ | – |
| **Azure AI Project Manager** | – | – | ✅ | ✅ (nur AI User) | ✅ | – |
| **Azure AI Account Owner** | ✅ | ✅ | – | ✅ (nur AI User) | ✅ | ✅ |
| **Azure AI Owner** | ✅ | ✅ | ✅ | – | ✅ | ✅ |
| (Standard) Owner | ✅ | ✅ | – | ✅ (alle) | ✅ | ✅ |
| (Standard) Contributor | ✅ | ✅ | – | – | ✅ | ✅ |

**Minimum-Setup für Dev**: `Azure AI User` auf Foundry-Resource für User-Principal **UND** Project-Managed-Identity.

### Journai-Enterprise-Mapping

```
IT-Admin              → Owner auf Subscription
Platform-Manager      → Azure AI Account Owner auf Resource
Team-Lead             → Azure AI Project Manager auf Resource
Entwickler            → Azure AI User auf Project + Reader auf Resource
```

**Key-Based Auth**: umgeht RBAC → **Prod-Verbot**. **Fine-Tuning**: braucht `Azure AI Owner` oder Kombi `Azure AI User` + `Azure AI Account Owner`. **Custom Roles**: via JSON mit `Microsoft.CognitiveServices/accounts/AIServices/agents/*`.

---

## Content Safety Policy-Baseline (EU-Kunden)

### Default-Thresholds (alle Modelle ausser Whisper)

| Kategorie | Scope | Default | Abschaltbar? |
|-----------|-------|---------|--------------|
| Hate and Fairness | Prompts + Completions | Medium | ja (Limited-Access-Approval) |
| Violence | Prompts + Completions | Medium | ja (LA) |
| Sexual | Prompts + Completions | Medium | ja (LA) |
| Self-Harm | Prompts + Completions | Medium | ja (LA) |
| **Jailbreak / Prompt Injection** | Prompts | immer aktiv | 🔒 **NEIN** (LA für Downgrade) |
| **Protected Material — Text** | Completions | immer aktiv | 🔒 **NEIN** (LA) |
| **Protected Material — Code** | Completions | immer aktiv | 🔒 **NEIN** (LA) |
| Content Credentials (Bild) | Completions | immer aktiv | 🔒 NEIN |
| Deceptive Political Candidates | Prompts | immer aktiv | 🔒 NEIN |

### Journai-Baseline für EU/CH + Finanz

- **Medium auf allen Kategorien** — kein Downgrade
- **XPIA-Evaluator** in CI-Eval-Pipeline für RAG
- **Sensitive Data Leakage Evaluator** (Preview) für Agents
- **Custom Blocklists** für Branchen-Terms / Wettbewerber / PII-Patterns
- **Prompt Shields** via APIM `llm-content-safety` Policy als zweite Enforcement-Ebene (siehe [[APIM AI Gateway]])
- **Content Credentials** aktiv (C2PA, **EU-AI-Act Art. 50**)
- **Terraform-as-Code** für RAI-Policies (AzureRM-Provider)

---

## Private Networking Setup

```
┌────────────────────────────────────────────────────────────────┐
│ A) Managed Virtual Network (Preview, empfohlen)                │
├────────────────────────────────────────────────────────────────┤
│   Foundry-Account aktiviert Managed-VNet →                     │
│   Outbound via Managed Private Endpoints                       │
│   ⚠️  PEs zu Azure AI Search, Storage, Cosmos DB               │
│       NICHT automatisch — manuell erstellen!                   │
│   ⚠️  Keine Customer-NICs                                       │
│   ❌ Kein Switzerland North / West                              │
│   ✅ West Europe, Sweden Central, France Central,               │
│      Germany West Central, Italy North, Spain Central,         │
│      UK South, …                                                │
├────────────────────────────────────────────────────────────────┤
│ B) VNet-Injection (Customer-Managed, nur Agent-Service)        │
├────────────────────────────────────────────────────────────────┤
│   Agent-Client in Customer-Subnet injiziert                    │
│   Nur mit BYO Storage + Search + Cosmos DB + PNA=disabled       │
│   Nicht mit Basic-Agent-Setup kombinierbar                     │
└────────────────────────────────────────────────────────────────┘
```

**Journai-Problem**: Managed VNet hat **kein Switzerland North**. Für strikte CH-Residenz: Customer-VNet-Injection oder Sweden Central / West Europe als EU-Alternative akzeptieren.

---

## Deployment-Strategien

```
Model-Versioning ≠ API-Versioning (MS-Empfehlung: separat)

Update-Policies pro Deployment:
  • Opt-out                   → manuell
  • Upgrade once new default   → auto
  • Once current expires       → auto bei Retirement

Blue/Green / Canary:
  → Zwei Deployments (Baseline + Candidate)
  → Traffic-Routing via App-Layer oder APIM AI Gateway
  → Foundry selbst hat KEIN natives Canary-Traffic-Splitting

Two-Stage-Validation:
  1. Offline-Eval (Evaluators-Suite)
  2. Limitierter Canary-Traffic mit Online-Observability

Rollback:
  → via Version-History → „Restore"
  → im Playground verifizierbar
```

---

## Responsible-AI-Features

- **Model Cards** pro Modell + Benchmarks-Tab
- **Transparency Notes** pro Service (OpenAI, Agent Service, Content Safety, Image Analysis, Content Understanding, Safety Evaluations)
- **RAI-Standard**: internes Microsoft-Review für alle Modelle
- **Content Credentials** (C2PA) automatisch für generierte Bilder — **EU-AI-Act-Art.-50-konform**
- **Safety Evaluations** als eigene Evaluator-Familie mit Transparency Note
- **Governance**: Purview Compliance Manager (EU-AI-Act-Dashboard), **PyRIT** (Red-Teaming-Framework)
- **Audit**: Traces/Evals → App Insights → Log Analytics → Azure-Monitor-Alerts (nativer SRE-Pfad)

---

## Abgrenzungen + Kombi-Pattern

### Foundry Tracing vs. Application Insights → **keine Alternative, sondern Kombi**

| Aspekt | Foundry Portal (Traces-Tab) | App-Insights Agents-Blade |
|--------|------------------------------|----------------------------|
| Zielgruppe | Dev / Debug | SRE / Ops |
| Zeitraum | 90 Tage | Log Analytics-Retention |
| UI | Span-Tree, Conversation-View, Agent-aware | KQL, Alerts, Cross-Resource |
| Storage | **beide schreiben in dieselbe App-Insights-Resource** |

### Pflicht-Policies für regulierte Kunden

- **Jailbreak + Protected-Material** nicht abschaltbar ohne Limited-Access-Approval
- **Content Credentials** (Bild, C2PA) immer aktiv
- **Content Safety Medium-Threshold** auf Hate/Sexual/Violence/Self-Harm bleibt default — Downgrade = MS-Approval

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| [[Microsoft Foundry]] | Control Plane ist Teil von Foundry, nicht Standalone-Produkt | GA | kein eigenes Portal — UI via ai.azure.com |
| [[Foundry Models]] | Policies (Content Safety, Rate-Limit) vor Modell-Calls | GA | pro Deployment konfiguriert, nicht global |
| [[Foundry Agent Service]] | Agent-Tracing auto-exportiert ins Workspace | GA | App Insights Workspace muss pre-provisioned sein |
| [[Microsoft Agent Framework]] | OpenTelemetry-Propagation in MAF-Agents | GA | OTLP-Endpoint im Env-Var setzen |
| [[Entra Agent ID]] / Entra | RBAC-Rollen auf Foundry-Project-Ebene | GA | 4 Foundry-spezifische Rollen (Admin, Contributor, Reader, Evaluation) |
| Azure Application Insights | Tracing-Daten landen im selben Workspace wie App-Logs | GA | Log-Volumen skaliert mit Agent-Aufrufen — Cost-Alert nötig |
| Azure Monitor / Log Analytics | Kusto-Queries für Auswertungen | GA | eigene Tabellen (`AIAgentsInfo`, `AppTraces`) — Schema-Docs lesen |
| [[Microsoft Purview]] | Audit + Sensitivity-Label-Propagation (Preview) | Preview | Labels noch nicht vollständig in Foundry-Trace übernommen |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| Grafana / Datadog | OTLP-Export aus Foundry-Tracing | GA | OTel-Collector als Proxy; Azure-Monitor-Datenquelle |
| Langfuse / Phoenix | Alternative Trace-Viewer via OTLP | Community | keine offizielle MS-Unterstützung; Self-Hosting |

### APIs / Protokolle

- **OpenTelemetry (OTLP)** als Standard — Foundry Tracing emittiert standard-konforme Spans
- **Azure Monitor REST API** für programmatische Query-Auswertungen
- **Azure AI Evaluation SDK** (`azure-ai-evaluation`) für CI-Integration

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | RBAC for Foundry | https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry | 2026-04-22 |
| Docs | Built-in Evaluators | https://learn.microsoft.com/en-us/azure/foundry/concepts/built-in-evaluators | 2026-04-22 |
| Docs | Custom Evaluators | https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/custom-evaluators | 2026-04-22 |
| Docs | Tracing Setup | https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/trace-agent-setup | 2026-04-22 |
| Docs | Observability Overview | https://learn.microsoft.com/en-us/azure/foundry/concepts/observability | 2026-04-22 |
| Docs | Default Safety Policies | https://learn.microsoft.com/en-us/azure/foundry/openai/concepts/default-safety-policies | 2026-04-22 |
| Docs | Content Safety Transparency Note | https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/content-safety/transparency-note | 2026-04-22 |
| Docs | Configure Private Link | https://learn.microsoft.com/en-us/azure/foundry/how-to/configure-private-link | 2026-04-22 |
| Docs | Managed VNet | https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/managed-virtual-network | 2026-04-22 |
| Docs | Model Versions | https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/model-versions | 2026-04-22 |
| Docs | App Insights Agents-View | https://learn.microsoft.com/en-us/azure/azure-monitor/app/agents-view | 2026-04-22 |
| Compliance | EU AI Act Trust Center | https://www.microsoft.com/en-us/trust-center/compliance/eu-ai-act | 2026-04-22 |
| Tech Blog | Eval/Monitoring/Tracing GA | https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/generally-available-evaluations-monitoring-and-tracing-in-microsoft-foundry/4502760 | 2026-04-22 |
| Tech Blog | Model-Upgrade-Strategie | https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/model-upgrade-and-migration-strategy-for-microsoft-foundry/4503176 | 2026-04-22 |
| PyPI | azure-ai-evaluation | https://pypi.org/project/azure-ai-evaluation/ | 2026-04-22 |
| Terraform | RAI-Policies as Code | https://dev.to/suhas_mallesh/azure-ai-foundry-content-safety-with-terraform-rai-policies-content-filters-as-code-206a | 2026-04-22 |

---

## UNCLEAR

1. OTel-Sampling-Strategie (Plattform-Defaults nicht dokumentiert)
2. Judge-Model-Pricing als separater Line-Item
3. Managed-VNet-CH-Roadmap (Switzerland North nicht in aktueller Liste)
4. Canary-Traffic-Splitting-Roadmap (aktuell nicht native)

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Tracing-Architektur-Diagramm (Foundry+AppInsights = ein Storage), 35+ OOB-Evaluators in 6 Kategorien, RBAC-Rollen-Matrix + Journai-Enterprise-Mapping, Content-Safety-Policy-Baseline für EU-Kunden, Managed-VNet-Limits (kein CH!), Deployment-Strategien (kein natives Canary), Responsible-AI-Features mit EU-AI-Act-Art-50-Compliance | Learn Docs + Tech Community + PyPI + Trust Center |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
