---
watch: passive
status: ga
last_verified: 2026-04-22
aliases: [Azure ML, AML]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Azure Machine Learning

*Microsoft's **klassische ML-Plattform** — Training, Pipelines, AutoML. Für Journai-Agent-Zielbild **meist nicht direkt relevant**, nur bei Custom-ML (Forecasting, Klassifikatoren) oder Fine-Tune eigener Modelle mit voller Hyperparameter-Kontrolle. **SDK v1 EOS 30.06.2026** (bereits nah!), v2 ist aktueller Standard.*

> **Analogie:** Wie Databricks / SageMaker — eine klassische MLOps-Plattform, separat von der reinen LLM-Welt.

---

## v1-vs-v2-Status (wichtig!)

| Komponente | Status | Datum |
|------------|--------|-------|
| **CLI v1** | Support beendet | **30.09.2025** (bereits EOL) |
| **SDK v1** (`azureml-core`) | deprecated seit 31.03.2025 | **EOS 30.06.2026** ⚠️ |
| **CLI v2** (`az ml`) / **SDK v2** (`azure-ai-ml`) | aktueller Standard | laufend |

### Migrations-Aufwand

**Kompatibel**: Workspace, Compute, Datastores, Datasets (als Data Assets).
**Neu zu schreiben**: Pipeline-Definitionen + Model-Logging (→ MLflow).
**Inner-Job-Code**: muss **nicht** angepasst werden.
**Problem**: Database-Datastores (SQL etc.) sind in v2 **nicht mehr supported** → Export auf Blob Storage.

---

## Agent-Zeitalter-Relevanz für Journai

Für MAF/Foundry-Zielbild bleiben **4 legitime Azure-ML-Use-Cases**:

1. **Managed-Compute-Fine-Tune** von Open-Source-LLMs/SLMs (Llama, Phi, Mistral) mit eigenen GPUs, wenn Foundry-Serverless-Fine-Tune nicht reicht (mehr Hyperparameter-Kontrolle, Modelle ausserhalb OpenAI-Portfolio). *{UNCLEAR ob Journai das je braucht}*
2. **Klassische Forecasting-Modelle** (AutoML Time-Series) als MAF-Tool eingebunden — AzureML-Endpoint → MAF-Tool-Wrapper
3. **Custom-Klassifikatoren auf Tabellendaten** (Intent-Routing, Risiko-Scoring) — wo LLM-Call Overkill wäre (Kosten, Latenz)
4. **MLOps-Pipelines parallel zu LLM-Ops** — Registered Models, Batch-Endpoints, Drift-Monitoring für Nicht-LLM-Modelle

**Nicht Azure ML**: Agenten-Orchestrierung, RAG, Prompt-Flow-Deployment → gehört zu Foundry / MAF.

---

## Azure ML vs. Foundry — die Linie

| Aufgabe | Tool |
|---------|------|
| Custom-Training auf eigenen Daten (tabular, Forecasting, klassische DL) | **Azure ML** |
| Fine-Tune OpenAI-Modelle (GPT-4.1-nano, o4-mini etc.) | **Foundry** (Serverless) |
| Fine-Tune Open-Source-LLMs mit voller Kontrolle | **Azure ML Managed Compute** |
| Agenten, RAG, Prompt-Flow, Model-Catalog-Deployment | **Foundry** |
| MLOps-Pipelines (CI/CD, Registered Models, Drift) | **Azure ML** |
| Evaluation/Observability für generative AI | **Foundry** |

**Wichtig**: Foundry (classic) **Hub-based Projects** sind technisch eine Azure-ML-Workspace-Implementierung (Hub = AzureML-Workspace-Superset). Microsoft migriert gerade Hub-based → **Foundry-Projects** (neues Resource-Modell). Für Neuprojekte: **Foundry-Projects**, nicht Hub-based.

---

## Pricing

- **Azure ML selbst**: kein Aufpreis ("no additional charge")
- Kosten entstehen bei **konsumierten Azure-Services**:
  - **Compute-Cluster**: VM-Preis pro Stunde (GPU-SKUs dominieren Fine-Tune-Kosten); Auto-Scale auf 0 Nodes im Idle
  - **Load Balancer**: ~$0.33/Tag pro 50 Nodes
  - Storage (Blob), Key Vault, Container Registry, Application Insights
- **Savings Plan** (1/3-Jahre Commitment) für Compute verfügbar
- *{UNCLEAR: exakte CHF-Preise Swiss North — via Pricing Calculator}*

---

## EU-Regions

- Azure ML in den meisten Standard-Azure-Regionen verfügbar
- **Switzerland North**: Hauptregion CH, grundsätzlich verfügbar; einzelne Features (Serverless-Endpoints für bestimmte Modelle, bestimmte AutoML-Tasks) können regional eingeschränkt sein
- **Switzerland West**: Restricted Access
- *{UNCLEAR: vollständige Paritäts-Matrix Switzerland North — pro Feature auf Learn-Seite verifizieren}*

---

## Limitierungen & Risiken

- **v1-EOS 30.06.2026** — wenn Alt-Artefakte existieren, **vor diesem Datum** migrieren
- **Managed-Compute-Fine-Tune** erfordert hohe GPU-Quotas, keine OpenAI-Modelle, keine Multi-Tenant-Optimierungen → für Journai i.d.R. unattraktiv gegenüber Foundry Serverless
- **Komplexität**: AzureML ist deutlich DevOps-lastiger als Foundry (YAML, Environments, Compute-Targets, Data-Assets) — steile Lernkurve
- **Hub-based vs. Foundry-Projects** — Microsoft migriert aktiv → Hub-based wird mittelfristig Legacy
- **Überschneidung mit Foundry** führt zu Governance-Fragen (zwei Workspaces, zwei Billing-Pfade) — für Tier-3 vermeiden

---

## Journai-Empfehlung

- **Default**: Azure ML **nicht** einführen, solange kein Use-Case ausserhalb Foundry/MAF existiert
- **Trigger für Adoption**: (a) Custom-Forecasting/Klassifikator nötig, oder (b) Fine-Tune eines Open-Source-SLM strategisch
- **Tier-3-watch-passive**: v1-EOS-Datum (30.06.2026) und Hub→Foundry-Projects-Übergang beobachten; sonst kein aktives Tracking

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | v1 deprecation | https://github.com/MicrosoftDocs/azure-ai-docs/blob/main/articles/machine-learning/includes/sdk-v1-deprecation.md | 2026-04-22 |
| Docs | CLI & SDK v2 Overview | https://learn.microsoft.com/en-us/azure/machine-learning/concept-v2 | 2026-04-22 |
| Docs | Upgrade v1 → v2 | https://learn.microsoft.com/en-us/azure/machine-learning/how-to-migrate-from-v1 | 2026-04-22 |
| Docs | Pipelines upgrade | https://learn.microsoft.com/en-us/azure/machine-learning/migrate-to-v2-execution-pipeline | 2026-04-22 |
| Docs | Feature availability across regions | https://learn.microsoft.com/en-us/azure/machine-learning/reference-machine-learning-cloud-parity | 2026-04-22 |
| Docs | Plan/Manage Costs | https://learn.microsoft.com/en-us/azure/machine-learning/concept-plan-manage-cost | 2026-04-22 |
| Pricing | Azure ML Pricing | https://azure.microsoft.com/en-us/pricing/details/machine-learning/ | 2026-04-22 |
| Docs | Serverless Region Availability | https://learn.microsoft.com/en-us/azure/machine-learning/concept-endpoint-serverless-availability | 2026-04-22 |
| Blog | Fine-Tuning Foundry | https://azure.microsoft.com/en-us/blog/announcing-new-fine-tuning-models-and-techniques-in-azure-ai-foundry/ | 2026-04-22 |
| Docs | Hub-based Project (classic) | https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/ai-resources?view=foundry-classic | 2026-04-22 |
| Docs | Migrate Hub → Foundry Projects | https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/migrate-project | 2026-04-22 |
| Docs | AutoML Time-Series | https://learn.microsoft.com/en-us/azure/machine-learning/how-to-auto-train-forecast | 2026-04-22 |
| Architektur | MLOps v2 Guide | https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/mlops-technical-paper | 2026-04-22 |

---

## UNCLEAR

1. Switzerland-North-Feature-Parität (feature-by-feature)
2. Aktuelle CHF-Preise für typisches Training-Setup

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | v1-vs-v2-Status (SDK v1 EOS 30.06.2026!), 4 legitime Agent-Zeitalter-Use-Cases, Azure ML vs. Foundry Linie, Pricing-Struktur, Journai-Tier-3-Empfehlung | Learn-Docs + Foundry-Docs |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
