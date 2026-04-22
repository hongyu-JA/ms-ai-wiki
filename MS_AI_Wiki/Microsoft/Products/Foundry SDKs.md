---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [AIProjectClient, azure-ai-projects, Foundry SDK]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Foundry SDKs

*`AIProjectClient` **2.0 GA** — das **vereinheitlichte SDK** für programmatischen Zugriff auf [[Microsoft Foundry]]. Python `≥2.0.0` GA, .NET `2.0.0` GA (01.04.2026), JavaScript `@azure/ai-projects 2.0.2` GA, **Java `1.0.0-beta.3`** (hinkt hinterher). 2.x-Linie bündelt Agents, Evaluations, Memory, Insights unter einem Client — entfernt Connection Strings und Hub-Projekte, verlangt Foundry-Project-Endpoints.*

> **Analogie:** Was `az` CLI + `azure-mgmt-*` für Infrastruktur sind, ist Foundry SDK für die AI-Ebene — ein einheitlicher Client über alle Foundry-Services hinweg.

---

## Einsatz

### Job-to-be-done

When I programmatisch auf Foundry-Ressourcen zugreife (Agents, Models, Evaluations, Memory), I want to einen einheitlichen Client statt drei separater SDKs, so I can Migration + Maintenance + CI-Integration vereinfachen.

### Trigger-Signale

- „Wir haben bestehenden Code mit `azure-ai-projects 1.x` — was passiert?"
- „Brauchen wir Python, .NET, JS oder Java für neues Projekt?"
- „Wie integrieren wir Evaluations in unsere CI-Pipeline?"

### Einsatz-Szenarien

1. **MAF-Agent-Deployment via AIProjectClient 2.0** — MAF-Agent-Code + `foundry.agents.create(...)` deployed nach [[Foundry Agent Service]]; Entra-Workload-ID statt Connection Strings.
2. **CI/CD mit Evaluation-Runs** — `foundry.evaluations.run_batch(...)` gegen definierte Eval-Sets als GitHub-Action / Azure-Pipeline-Step; Regression-Tests pro PR.
3. **Migration `azure-ai-projects 1.x` → `AIProjectClient 2.0`** — Breaking Changes in Auth + Endpoint-Resolution; Journai-Migration-Runbook pro Kunde.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Azure-Subscription + Foundry-Project |
| **Tenant / Infrastruktur** | Python ≥3.10 / .NET 8 / Node 20 / Java 17; Foundry-Project-Endpoint statt Connection Strings |
| **Skills / Rollen** | Dev-Skills in Zielsprache + Entra-Auth-Verständnis |
| **Compliance-Rahmen** | Managed Identity über Service-Principal; MS-DPA für Cloud-Nutzung |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | Neu-Projekt <1 Tag; Migration 1.x → 2.0 typisch 1–3 Tage pro Projekt |
| **Laufende Lizenzkosten** | SDK selbst kostenfrei (MIT); Underlying Foundry-Usage |
| **Laufender Betrieb** | Version-Monitoring folgt Release-Kadenz (quartalsweise Minor) |

### Empfehlung

**Status:** 🟢 Python / .NET / JS — alle GA, stable API. 🟡 Java (1.0.0-beta.3) nur mit Workaround-Bereitschaft.

**Nächster Schritt für Journai:** Starter-Template-Repo mit AIProjectClient 2.0 + `azd ai` für Project-Scaffolding + Evaluation-Pipeline als Standard für neue Kunden-Projekte.

---

## API-Oberfläche — Sub-Clients

```
AIProjectClient
      │
      ├── .connections          → verbundene Ressourcen (Storage, Search, OpenAI)
      │     .list() · .get() · .get_default()
      │
      ├── .deployments          → Modell-Deployments
      │     .list() · .get(name)
      │
      ├── .datasets             → Dataset-Mgmt + Upload
      │     .upload_file() · .list() · .get()
      │
      ├── .indexes              → Search-Indexe (Knowledge)
      │     .create_or_update() · .list() · .get()
      │
      ├── .telemetry            → App Insights + Tracer-Setup
      │     .get_application_insights_connection_string()
      │
      ├── .evaluations / .evaluators / .evaluation_rules /
      │   .evaluation_taxonomies / .insights / .schedules
      │                         → Batch-Evals, Judges, Online-Scheduling
      │     .create() · .get(name) · .list()
      │
      ├── .agents               → Agent-CRUD (Persistent / MAF-kompatibel)
      │     .create_agent() · .update_agent() · .delete_agent()
      │
      └── get_openai_client()   → OpenAI-Responses, Conversations, Evals, FineTuning
            .responses.create(model=..., input=...)
```

### Python-Beispiel

```python
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

project = AIProjectClient(
    endpoint="https://<resource>.services.ai.azure.com/api/projects/<project>",
    credential=DefaultAzureCredential())

with project.get_openai_client() as oai:
    resp = oai.responses.create(model="gpt-5.2", input="Hallo Journai")
    print(resp.output_text)
```

### .NET-Beispiel

```csharp
AIProjectClient projectClient = new(
    endpoint: new Uri("https://<resource>.services.ai.azure.com/api/projects/<project>"),
    tokenProvider: new DefaultAzureCredential());

var responses = projectClient.ProjectOpenAIClient.GetProjectResponsesClientForModel("gpt-5.2");
var result = responses.CreateResponse("What is the speed of light?");
```

---

## Migration `azure-ai-projects 1.x` → `AIProjectClient 2.0`

### Breaking Changes

1. **Package-Konsolidierung**: `azure-ai-agents` entfällt als eigenständige Dependency; Agents, Evaluations, Memory, Inference leben jetzt alle unter `azure-ai-projects` / `Azure.AI.Projects`. `openai` und `azure-identity` direkte Dependencies.

2. **Hub-Projekte & Connection Strings entfernt**: 2.0.0 verlangt **zwingend** Foundry-Projekt + Project-Endpoint. Legacy-Code muss auf neue Foundry-Resource umziehen, sonst `1.0.0-beta.8` pinnen.

3. **Property-Renames (.NET)**:
   - `AIProjectClient.OpenAI` → `ProjectOpenAIClient`
   - `AIProjectClient.Agents` → `AgentAdministrationClient`
   - `Insights` → `ProjectInsights`

4. **Method-Renames (Python)**:
   - `telemetry.get_connection_string()` → `get_application_insights_connection_string()`
   - `Connections.GetDefault` → `GetDefaultConnection`
   - `Datasets.Get` → `GetDatasets`
   - `Evaluation.id` → `name`

5. **Entfernte APIs**:
   - `AIProjectClient.UploadFileRequest` → `Datasets.UploadFile`
   - `AIProjectClient.scope` → Foundry-Endpoint nutzen

6. **Async-Korrektur (Python)**: `get_openai_client()` am async-Client ist **kein** `async`-Call mehr

7. **`allow_preview=True`-Schalter**: globales Preview-Opt-in, ersetzt per-method `foundry_features`-Flags

8. **`ConnectionProperties` → `Connection`**: Properties umstrukturiert

### Migrations-Schritte für Journai

```
1. Foundry-Resource + Project provisionieren (nicht Hub)
2. pip install "azure-ai-projects>=2.0.0"  /  dotnet add package Azure.AI.Projects --version 2.0.0
3. azure-ai-agents-Import entfernen; Agents via project.agents / AgentAdministrationClient
4. Endpoint-URL-Pattern umstellen: .../api/projects/<project>
5. Property-/Method-Renames per globaler Suche ersetzen
6. Integrations-Tests gegen neue Response-Shapes (Evaluation.name statt .id)
```

---

## Sprach-Parität-Matrix (April 2026)

| Feature | Python `2.0.x` | .NET `2.0.0` | JS `2.0.2` | Java `1.0.0-beta.3` |
|---------|:---:|:---:|:---:|:---:|
| **GA-Status** | ✅ GA | ✅ GA (01.04.2026) | ✅ GA | 🟡 **Beta** |
| AIProjectClient | ✅ | ✅ | ✅ | ✅ |
| `.connections` / `.datasets` / `.deployments` / `.indexes` | ✅ | ✅ | ✅ | teilweise *{UNCLEAR}* |
| OpenAI-Client-Adapter | `get_openai_client()` | `ProjectOpenAIClient` | `getOpenAIClient()` | `getOpenAIClient()` |
| Agents (`AgentAdministrationClient`) | ✅ | ✅ | ✅ (via `.agents`) | *{UNC}* |
| Persistent Agents (Classic) | eigenes `azure-ai-agents` | `Azure.AI.Agents.Persistent` | separat | *{UNC}* |
| Evaluations (`.evaluators`, `.insights`, `.schedules`) | ✅ | ✅ | ✅ | *{UNC}* |
| Memory / RAG-Tool integriert | ✅ | ✅ | ✅ | *{UNC}* |
| OTel-Tracing nativ | ✅ | ✅ (`EnableGenAITracing`) | ✅ | eingeschränkt |
| Async-Client | ✅ | ✅ (Task-basiert) | ✅ (Promises) | ✅ (Reactor) |
| `allow_preview`-Flag | ✅ | ✅ | ✅ | *{UNC}* |

**Lücke**: Java ist 6–9 Monate hinterher (letzte beta.3 November 2025, beta.1 Juni 2025). Für JVM-Produktivcode aktuell: **REST-API direkt** oder Kotlin mit JS-SDK bis Java GA folgt.

---

## Auth-Flows (keyless, Entra-first)

```
A) Entwicklerlaptop / Interaktiv
   DefaultAzureCredential()     ← probiert CLI → VS Code → Interactive Browser
   Voraussetzung: az login + Rolle "Azure AI User"

B) Azure-Host mit System-Managed Identity (App Service, AKS, Container Apps)
   ManagedIdentityCredential()

C) User-assigned Managed Identity
   ManagedIdentityCredential(client_id="<uami-client-id>")

D) Entra App Registration / Service Principal (CI/CD)
   ClientSecretCredential(tenant_id, client_id, client_secret)
   oder federated credentials (workload identity) — ohne Secret

Token-Scope für OpenAI-Endpoint: https://ai.azure.com/.default
```

**Journai-Empfehlung**: Dev = `DefaultAzureCredential` · Prod = `ManagedIdentityCredential` (expliziter, weniger Retry-Overhead).

---

## SDK-Abgrenzung — wann welches?

| Use-Case | Empfohlenes SDK | Begründung |
|----------|-----------------|------------|
| Agents + Evals + Memory in einem Projekt | **Foundry SDK** | Einziges SDK mit Agent-Administration, `.insights`, `.schedules` |
| Pure Chat/Responses, max. OpenAI-Kompatibilität | **OpenAI SDK direkt** | Keine Foundry-Abstraktion, Parität mit openai.com |
| Foundry-Direct-Modelle (non-AOAI) via Chat Completions | **OpenAI SDK direkt** | Nur dort verfügbar, nicht über Responses |
| Foundry-Direct-Modelle via Responses | **Foundry SDK** | Responses-Route geht über `/api/projects/<p>/openai` |
| Search-Index-Erstellung ausserhalb Foundry-Projekt | **`azure-search-documents`** | Foundry-SDK deckt nur Projekt-verknüpfte Indexe ab |
| Vision / Speech / Content Safety / Document Intelligence | **Foundry Tools SDKs** einzeln | Separate Endpoints, nicht im Project-Endpoint |
| Tracing / Observability | **Foundry SDK** + `azure-monitor-opentelemetry` | `telemetry.get_application_insights_connection_string()` |
| Multi-Agent-Orchestrierung | **[[Microsoft Agent Framework]]** + Foundry SDK als Connector | siehe unten |

---

## MAF-Integration — MAF + Foundry SDK

```
┌──────────────────────────────────────────────────────────────┐
│ Microsoft Agent Framework (MAF)                              │
│   ← orchestriert lokale Multi-Agent-Workflows                │
│   ← ist cloud-agnostisch (AOAI, OpenAI, Anthropic, Bedrock,  │
│      Gemini, Ollama)                                          │
└──────────────────────────────────────────────────────────────┘
                           ↓ (wenn Foundry-Agents genutzt)
┌──────────────────────────────────────────────────────────────┐
│ Foundry SDK (AIProjectClient)                                │
│   ← Cloud-Connector innerhalb MAF                            │
└──────────────────────────────────────────────────────────────┘
```

**Konkrete Verdrahtung**:
- **.NET**: `AIProjectClient` → `AgentAdministrationClient.CreateAgent(...)` liefert Foundry-Agent → via `.AsAIAgent()` wird er zur MAF-`AIAgent`-Instanz
- **Python**: `AzureAIClient(project_client).as_agent(name="...")` oder `AzureAIProjectAgentProvider` holt existierenden Agent by name aus Foundry in MAF-Workflow

**Antwort auf Journai-Frage**: **Ja** — `AIProjectClient` ist faktisch der „Foundry-Connector" in MAF. MAF selbst enthält **keine** Foundry-spezifischen Primitive; es delegiert an `AIProjectClient`.

---

## Tracing / Logging — OTel-Propagation

Beide Client-Routen (Project Client + OpenAI-Client) emittieren OTel-Spans, sobald OTel konfiguriert ist.

### Python-Setup

```python
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry.instrumentation.openai_v2 import OpenAIInstrumentor

conn = project.telemetry.get_application_insights_connection_string()
configure_azure_monitor(connection_string=conn)
OpenAIInstrumentor().instrument()
```

### .NET

Flag `Azure.Experimental.EnableGenAITracing = true` aktiviert `EnableActivitySource`.

**Tracing-Provider** wurde am 25.02.2026 von `azure.ai.agents` auf **`microsoft.foundry`** umbenannt (2.0.0-beta.1).

**Export-Ziele**: App Insights, Console, beliebiges OTLP-Backend (Datadog, Jaeger, Grafana Tempo, Honeycomb).

**Semantic Conventions**: `gen_ai.*` (`gen_ai.system=microsoft.foundry`).

---

## Versioning & Release-Kadenz

| Sprache | Stable | Preview | Kadenz |
|---------|--------|---------|--------|
| Python | `pip install azure-ai-projects` | `pip install --pre azure-ai-projects` (z.B. `2.0.0b4`) | Monatlich beta, Stable ~Quartal |
| .NET | NuGet `Azure.AI.Projects` | `2.0.0-beta.X` | Monatlich beta, Stable seit 01.04.2026 |
| JavaScript | `npm i @azure/ai-projects` (2.1.0) | `@azure/ai-projects@next` / `v2-beta` | Häufige Patches (2.0.0 → 2.0.2 → 2.1.0) |
| Java | Maven Central `com.azure:azure-ai-projects:1.0.0-beta.3` | Maven beta | Quartal (beta.1 Juni '25 → beta.3 Nov '25) |

- Azure SDK-Gruppe publiziert **monatliche** Sammel-Releases (`azure.github.io/azure-sdk/releases/YYYY-MM/<lang>.html`)
- Preview-Features kommen erst in `-beta.N`, wandern nach 2–4 betas in Stable
- Breaking Changes werden zwischen Majors gebündelt (1.x → 2.x); innerhalb 2.x gilt SemVer strikt

---

## Limitierungen

- **Java hinkt 6+ Monate hinterher** — für Produktivcode REST direkt oder andere Sprache
- **Breaking Changes Preview→GA** erfordern migrationale Arbeit
- **Nicht alle Features in allen Sprachen gleichzeitig** — .NET/Python führen

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | SDK Overview (April 2026) | https://learn.microsoft.com/en-us/azure/foundry/how-to/develop/sdk-overview | 2026-04-22 |
| Docs | Python README | https://learn.microsoft.com/en-us/python/api/overview/azure/ai-projects-readme | 2026-04-22 |
| Docs | .NET README | https://learn.microsoft.com/en-us/dotnet/api/overview/azure/ai.projects-readme | 2026-04-22 |
| Blog | Foundry März 2026 Release Notes | https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-mar-2026/ | 2026-04-22 |
| Blog | Migration Guide — Badr Kacimi | https://medium.com/@badrvkacimi/migrating-to-azure-ai-projects-v2-the-unified-foundry-sdk-you-need-to-know-0102d969df1f | 2026-04-22 |
| Pkg | PyPI `azure-ai-projects` | https://pypi.org/project/azure-ai-projects/ | 2026-04-22 |
| Pkg | NuGet `Azure.AI.Projects` 2.0.0 | https://www.nuget.org/packages/Azure.AI.Projects | 2026-04-22 |
| Pkg | npm `@azure/ai-projects` | https://www.npmjs.com/package/@azure/ai-projects | 2026-04-22 |
| Pkg | Maven `com.azure:azure-ai-projects` | https://mvnrepository.com/artifact/com.azure/azure-ai-projects | 2026-04-22 |
| Docs | MAF + Foundry Agents | https://learn.microsoft.com/en-us/agent-framework/agents/providers/microsoft-foundry | 2026-04-22 |
| Docs | Tracing Setup | https://learn.microsoft.com/en-us/azure/ai-foundry/observability/how-to/trace-agent-setup | 2026-04-22 |
| Docs | Keyless Auth with Entra | https://learn.microsoft.com/en-us/azure/ai-foundry/foundry-models/how-to/configure-entra-id | 2026-04-22 |
| Docs | DefaultAzureCredential | https://learn.microsoft.com/en-us/dotnet/api/azure.identity.defaultazurecredential | 2026-04-22 |

---

## UNCLEAR

1. Java 2.0 Roadmap / GA-Datum
2. Java-Sub-Client-Umfang (beta.3 README nicht im Detail geprüft)
3. Eval-Sub-Client `evaluators.run_batch()` + Scheduling-Details
4. Python-Breaking-Changes-Liste `1.0.0-beta.11 → 2.0.0` (Gesamtliste)

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | API-Oberfläche mit Sub-Client-Map + Python/.NET Code-Sketches, Migration-Guide `azure-ai-projects 1.x → 2.0` mit 8 Breaking Changes, Sprach-Parität-Matrix (Java beta.3!), 4 Auth-Flows, SDK-Abgrenzungs-Matrix, MAF-Integration-Diagramm, OTel-Tracing-Setup, monatliche Release-Kadenz-Tabelle | Learn + DevBlogs + Medium Migration Guide + Paket-Repos |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
