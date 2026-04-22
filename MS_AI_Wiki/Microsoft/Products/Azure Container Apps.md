---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [ACA]
moc:
  - "[[Microsoft MOC]]"
  - "[[Integration & Compute MOC]]"
---

# Azure Container Apps

*Microsoft's **managed Container-Runtime** — Kubernetes-basiert unter der Haube (KEDA, Dapr, Envoy), aber ohne k8s-Komplexität. Für [[Microsoft Agent Framework]]-Agents der Sweet-Spot zwischen [[Azure Functions]] (zu eingeschränkt) und AKS (zu komplex), **insbesondere wenn DSGVO-Private-Networking oder komplexe Container-Customs nötig sind**. **Switzerland North** bietet Consumption + Dedicated (Flex noch nicht).*

> **Analogie:** Heroku-Erfahrung auf Azure — deploye ein Container-Image, ACA kümmert sich um Ingress, Scale, Secrets.

---

## Einsatz

### Job-to-be-done

When I einen langlaufenden Container-basierten MAF-Agent hoste und Functions-Grenzen reiche, I want to managed Kubernetes ohne k8s-Komplexität mit VNet + KEDA + Dapr, so I can Custom-Images deployen ohne AKS zu betreiben.

### Trigger-Signale

- „Agent braucht Private VNet + Custom Docker-Image mit proprietären Libraries."
- „Agent-Session läuft > 10 min — Functions-Grenze."
- „KEDA-Scaling auf Queue-Depth, Kafka-Lag oder Cron."

### Einsatz-Szenarien

1. **MAF-Host in VNet** — Container-Image mit MAF-Agent + Private Endpoint zu [[Foundry Agent Service]] / [[Foundry Models]], Entra-Workload-ID.
2. **Dapr-basierter Multi-Agent-Service-Mesh** — mehrere Micro-Agents kommunizieren via Dapr Pub/Sub + State Store, ohne Kubernetes-Operator.
3. **Migration von Azure Functions** — wenn Cold-Start / Memory / Laufzeit-Limits reichen, minimaler Lift-and-Shift auf ACA ohne Rewrite.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Azure-Subscription + Azure Container Registry (ACR) |
| **Tenant / Infrastruktur** | Switzerland North: Consumption + Dedicated Plan (Flex 2026 TODO) |
| **Skills / Rollen** | Container-Skills beim Kunden (Docker-Build, ACR-Push); DevOps-Pipeline |
| **Compliance-Rahmen** | VNet-Integration + Entra Managed Identity + Private Endpoints für DSGVO |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | 1–3 Tage für ersten produktiven Agent auf ACA |
| **Laufende Lizenzkosten** | Consumption ab ~€30/Monat (Scale-to-Zero); Dedicated ab ~€120/Monat |
| **Laufender Betrieb** | gering bei Scale-to-Zero; Monitoring via App Insights |

### Empfehlung

**Status:** 🟢 — Sweet-Spot zwischen [[Azure Functions]] (zu eingeschränkt für Custom-Container) und AKS (zu komplex). CH-Region mit Consumption + Dedicated GA.

**Nächster Schritt für Journai:** Flex-Consumption-Variante 2026 beobachten (bringt bessere Scale-Granularität); vorerst Consumption als Default empfehlen.

---

## Pricing & Regionen

### Consumption Plan

- Abrechnung **pro Sekunde**: vCPU-Sekunden + GiB-Sekunden + Requests
- **Free Grant / Monat + Subscription**: 180.000 vCPU-s, 360.000 GiB-s, 2 Mio Requests
- **Scale-to-Zero = 0 CHF**
- *{UNCLEAR: exakter CHF-Preis pro vCPU-s für Switzerland North April 2026 — Azure Calculator}*

### Dedicated Plan (Workload Profiles)

- Abrechnung nach **provisionierten** vCPU/GiB-Sekunden je Profile-Instanz
- Zusätzlich **Base Management Fee** pro Stunde fürs Environment
- Profile-Typen: **Consumption**, **Dedicated** (D4/D8/D16/D32, E4/E8/E16/E32, NC24-A100 GPU), **Flex** (v2, neuer Default)

### EU / CH Regionen

- **Switzerland North**: ✅ Consumption + Dedicated verfügbar
- **Flex-Profile**: ❌ noch NICHT in CH North (verfügbar in GWC, North Europe, Sweden Central, UK West u.a.)
- Weitere DSGVO-Regionen: GWC, North Europe, West Europe, Sweden Central, France Central
- **Empfehlung Journai**: Workload-Profiles-Environment in CH North mit Consumption + Dedicated D4

### Scale-to-Zero

```
Default:     minReplicas=0, maxReplicas=10

Voraussetzung:  event-basierter Scaler (HTTP, Queue, Custom/KEDA)
                ⚠️  CPU/Memory-Scaler skalieren NICHT auf 0
                ⚠️  Wenn Ingress disabled UND kein minReplicas/
                    Scale-Rule → App bleibt auf 0 ohne Trigger

Cold-Start:  wenige Sekunden bis >1 Minute
             (Image-Size, Registry-Pull, Startup-Zeit)

Für latenzkritische MAF-Agents:
  minReplicas=1 mit Dedicated oder Flex
```

---

## Dapr-Sidecars (Building Blocks)

Sidecar pro App: HTTP 3500, gRPC 50001. Aktivierung: `--enable-dapr --dapr-app-id <id>`.

| Block | Use für Agents |
|-------|-----------------|
| **Service Invocation** (mTLS, Retry, Discovery) | Multi-Agent-Calls |
| **State Management** (Redis, Cosmos DB, PostgreSQL, Table Storage) | Agent-Memory, Thread-State |
| **Pub/Sub** (Service Bus, Event Hubs, Kafka, Redis Streams) | Async-Agent-Handoffs, deklarative Subscriptions |
| **Bindings** | Input-Trigger (Blob-Upload → Agent-Run), Output-Trigger |
| **Actors** | gekapselte stateful Objekte (1 Actor pro User-Session/Thread) |
| **Secrets** | Abstraktion über Key Vault |
| **Workflows** | langlaufende durable Orchestrierungen — passt zu MAF-Workflows |

---

## KEDA-Scaling Triggers für MAF

| Trigger | Einsatz | Scale-to-0 |
|---------|---------|:---:|
| **HTTP (nativ)** | concurrent in-flight Requests | ✅ |
| **Azure Service Bus Queue** | Queue-Depth | ✅ |
| **Azure Storage Queue** | Queue-Depth | ✅ |
| **Event Hubs** | unprocessed Events | ✅ |
| Kafka | Consumer Lag | ✅ |
| Cron | Zeitplan | ✅ |
| Redis Lists/Streams | Custom Queue-Style | ✅ |
| **CPU / Memory** | Ressourcenbasiert | ❌ min 1 |
| Custom External Scaler | beliebige Metrik via gRPC | ✅ |

**Wichtig**: HTTP-Scaler = concurrent **in-flight** Requests (nicht Total). Rules kombinierbar (OR, Max-Replika-Count gewinnt). Rules unterstützen **Managed-Identity-Auth** (keine Connection-Strings).

---

## Networking, Revisions, Managed Identity

### VNet-Integration (nur Workload-Profiles-Env)

- **Custom VNet** mit dediziertem Subnet, **CIDR minimum /27**
- **Internal-only** via `--internal-only` → kein Public FQDN, Ingress nur aus VNet
- **Private Endpoint** aufs Environment: nur mit Workload-Profiles-Env, `publicNetworkAccess=Disabled` erforderlich
- Integration: UDR, NAT-Gateway, NSG, Application Gateway + WAF, Front Door, Private DNS Zones

**Journai-Empfehlung**: Workload-Profiles-Env in CH North, Internal-only, Private Endpoint für Inbound, NAT-Gateway für kontrollierten Egress zu Azure OpenAI / Foundry.

### Revisions + Traffic-Split

```
Single Revision Mode (Default)   →  neue Revision ersetzt alte, 100% Traffic
Multiple Revision Mode            →  activeRevisionsMode=Multiple + gewichteter Split

Blue/Green:
  1. green-Revision mit 0% deployen (--revision-suffix green)
  2. über Label-FQDN testen (<label>.<app>.<hash>.<region>.azurecontainerapps.io)
  3. Traffic-Split 0% → 5% → 25% → 50% → 100%

Rollback:   Traffic-Split auf alte Revision (Sekunden)
```

### Managed Identity — Auth-Ziele (alle via Entra ID, ohne Secrets)

- **ACR** (Image-Pull via `AcrPull`-Rolle)
- **Key Vault** (Secret-Referenzen via `Key Vault Secrets User`)
- **Storage** (Blob/Queue/Table/Files) — Agent-Attachments, Memory
- **Azure SQL / Cosmos DB / PostgreSQL** — tokenbasierte DB-Auth
- **Azure OpenAI / Foundry** — `Cognitive Services OpenAI User` für MAF-LLM-Calls
- **Service Bus / Event Hubs** — KEDA-Scaler-Auth
- **Dapr Components** — MI-basierte Auth für State-Stores / Pub/Sub

**Empfehlung**: **User-Assigned Identity** pro Umgebung (dev/staging/prod), lifecycle-unabhängig von der App.

---

## ACA vs. Azure Functions vs. AKS

| Kriterium | **ACA** | [[Azure Functions]] | AKS |
|-----------|---------|---------------------|-----|
| Abstraktion | Serverless Container (K8s + KEDA + Dapr + Envoy hidden) | FaaS / Event-Handler | Full Kubernetes |
| Zugang K8s-API | ❌ | ❌ | ✅ |
| Scale-to-Zero | ✅ | ✅ (Consumption) | ❌ (nur KEDA manuell) |
| Sidecars | ✅ (Dapr + custom) | eingeschränkt | ✅ beliebig |
| Cold-Start | Sek bis >1 Min | Sek (Premium: warm) | nur Pod-Startup |
| Stateful | begrenzt (keine StatefulSets) | ❌ | ✅ |
| Ops-Aufwand | niedrig | niedrigst | hoch |
| **MAF-Fit** | **✅ sehr gut** — Multi-Container, Dapr-Workflows, Private VNet, Blue/Green | gut für Single-Agent-Trigger | Overkill |
| Pricing | vCPU-s + GiB-s + Requests | Executions + GB-s | Node-Stunden |

### Journai-Entscheidungs-Heuristik

```
Agent reicht mit Managed-Runtime, Standard-Tool-Calling, keine
Container-Customs
  → [[Foundry Agent Service]]

Agent mit DSGVO + Private-Networking, Custom-Deps (Headless-Browser,
eigene MCP-Server), Multi-Agent-Orchestrierung Dapr-Workflows,
Blue/Green
  → ACA  ← DER MAF-HOSTING-STANDARD für regulierte Workloads

Agent als reiner Event-Handler (Queue → LLM → Response)
  → [[Azure Functions]]

GPU-Scheduling-Details, Custom-Operators, StatefulSets, extremes Tuning
  → AKS
```

---

## MAF-Hosting-Rezept auf ACA

### Build

```dockerfile
FROM python:3.12-slim
RUN pip install agent-framework azure-identity \
                opentelemetry-exporter-otlp fastapi uvicorn
COPY . /app
EXPOSE 8080
# HTTP-Wrapper (FastAPI) um MAF ChatAgent / Workflow
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

Push → ACR via `az acr build` oder GitHub Actions mit OIDC-Federated-Credential.

### Deploy (CLI-Baseline für Journai, CH North, Internal-only)

```bash
az containerapp env create \
  --name aca-journai-prod \
  --resource-group rg-journai-ch \
  --location switzerlandnorth \
  --enable-workload-profiles \
  --infrastructure-subnet-resource-id <subnet-id> \
  --internal-only true

az containerapp create \
  --name agent-orchestrator \
  --environment aca-journai-prod \
  --image <acr>.azurecr.io/journai/agent:<sha> \
  --user-assigned <uami-id> \
  --registry-server <acr>.azurecr.io \
  --registry-identity <uami-id> \
  --ingress internal --target-port 8080 \
  --min-replicas 1 --max-replicas 20 \
  --workload-profile-name D4 \
  --enable-dapr --dapr-app-id agent-orchestrator --dapr-app-port 8080 \
  --scale-rule-name http-rule --scale-rule-type http \
    --scale-rule-http-concurrency 30
```

### Konfiguration

- **Secrets** (kein Klartext):
  ```
  --secrets "oai-key=keyvaultref:https://<kv>.vault.azure.net/secrets/oai-key,identityref:<uami-id>"
  ```
- **Env-Vars**: `AZURE_OPENAI_ENDPOINT`, `AZURE_CLIENT_ID` (UAMI), `OTEL_EXPORTER_OTLP_ENDPOINT`
- **Dapr-Components**: YAML via `az containerapp env dapr-component set` (State-Store Cosmos DB, Pub/Sub Service Bus)

### Monitoring

- **OpenTelemetry** aus MAF (`AGENT_FRAMEWORK_TRACING_ENABLED=true`) → OTLP-Exporter → **Application Insights** oder Foundry-Telemetry
- **Log Analytics Workspace** am Environment — Console/System/Dapr-Logs
- **Azure Monitor Alerts**: `Replica Restarts`, `HTTP 5xx Ratio`, Service-Bus `Queue-Depth`
- Dashboards: Revision-Traffic-Split, Cold-Start-Latency, Dapr-State-Store-Latenz

### Deployment-Strategie

- **azd** (Azure Developer CLI) mit Blue/Green-Template
- GitHub Actions: Build + Push + `az containerapp update --image ... --revision-suffix green` + Traffic-Shift
- Smoke-Test gegen Label-FQDN vor Traffic-Umzug

---

## Limitierungen

| Limitierung | Alternative |
|-------------|-------------|
| **Kein voll k8s-API** | wenn CRDs, Operators, StatefulSets nötig → AKS |
| **Cold-Start bei Scale-to-Zero** | `--min-replicas 1` für latenz-kritisch |
| **CPU/Memory-Scaler skalieren nicht auf 0** | event-basierte Scaler (HTTP, Queue) bevorzugen |
| **Flex-Profile nicht in CH North** *(April 2026)* | Consumption + Dedicated D4 |

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | Container + Revisions + Logs folgen der ACA-Environment-Region. **Switzerland North: Consumption + Dedicated GA** (Flex Plan noch ausstehend) |
| **Prompts & Outputs** | Container-Stdout in Log Analytics Workspace; bei MAF-Agent-Hosting ggf. PII-Redaktion vor Log-Schreib-Pfad |
| **Data Processing Addendum (DPA)** | Azure-DPA covered |
| **EU-AI-Act-Klassifizierung** | ACA = Compute; Klassifizierung folgt Workload (gehosteter Agent-Code) |

### Microsoft-Compliance-Stack

- **Entra Workload Identity** (System- oder User-Assigned Managed Identity) für Backend-Auth zu Foundry / AI Search / Key Vault
- **Private Endpoints** zu Storage, Foundry, ACR in Enterprise-Environments
- **Microsoft Defender for Containers** + **Defender for Cloud** — Image-Scanning + Posture
- **Container Apps Built-In Authentication** (Easy Auth) für Entra-Login vor Container ohne App-Code-Änderung

### Bekannte Compliance-Lücken

- **Flex Plan in CH fehlt** — für DSGVO-harte Anforderungen Consumption oder Dedicated nutzen
- **Container-Images enthalten oft embedded Secrets** — konsequent ACR + Managed Identity; Secret-Scanning via Defender aktivieren
- **KEDA-Scaling-Metriken können PII enthalten** (z. B. Queue-Message-Inhalt) — bei sensitive Payloads auf Metadata-Trigger wechseln

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | ACA Overview | https://learn.microsoft.com/en-us/azure/container-apps/ | 2026-04-22 |
| Pricing | ACA Pricing | https://azure.microsoft.com/en-us/pricing/details/container-apps/ | 2026-04-22 |
| Docs | Billing | https://learn.microsoft.com/en-us/azure/container-apps/billing | 2026-04-22 |
| Docs | Workload Profiles | https://learn.microsoft.com/en-us/azure/container-apps/workload-profiles-overview | 2026-04-22 |
| Docs | Scaling | https://learn.microsoft.com/en-us/azure/container-apps/scale-app | 2026-04-22 |
| Docs | Functions KEDA Mappings | https://learn.microsoft.com/en-us/azure/container-apps/functions-keda-mappings | 2026-04-22 |
| Docs | Dapr Overview | https://learn.microsoft.com/en-us/azure/container-apps/dapr-overview | 2026-04-22 |
| Dapr.io | Dapr on ACA | https://docs.dapr.io/operations/hosting/serverless/azure-container-apps/ | 2026-04-22 |
| Docs | Networking | https://learn.microsoft.com/en-us/azure/container-apps/networking | 2026-04-22 |
| Docs | Private Endpoint | https://learn.microsoft.com/en-us/azure/container-apps/how-to-use-private-endpoint | 2026-04-22 |
| Docs | Custom VNets | https://learn.microsoft.com/en-us/azure/container-apps/custom-virtual-networks | 2026-04-22 |
| Docs | Revisions | https://learn.microsoft.com/en-us/azure/container-apps/revisions | 2026-04-22 |
| Docs | Traffic Splitting | https://learn.microsoft.com/en-us/azure/container-apps/traffic-splitting | 2026-04-22 |
| Docs | Blue-Green Deployment | https://learn.microsoft.com/en-us/azure/container-apps/blue-green-deployment | 2026-04-22 |
| Docs | Managed Identity | https://learn.microsoft.com/en-us/azure/container-apps/managed-identity | 2026-04-22 |
| Docs | Compare Options | https://learn.microsoft.com/en-us/azure/container-apps/compare-options | 2026-04-22 |
| Tech Blog | Agentic Apps on ACA with Foundry | https://techcommunity.microsoft.com/blog/appsonazureblog/agentic-applications-on-azure-container-apps-with-microsoft-foundry/4467601 | 2026-04-22 |
| Blog | azd Blue-Green ACA | https://devblogs.microsoft.com/azure-sdk/azure-developer-cli-azd-blue-green-aca-deployment/ | 2026-04-22 |
| GitHub | foundry-hosted-agents-dotnet-demo | https://github.com/Azure-Samples/foundry-hosted-agents-dotnet-demo | 2026-04-22 |
| Architektur | Multi-Agent Workflow Automation | https://learn.microsoft.com/en-us/azure/architecture/ai-ml/idea/multiple-agent-workflow-automation | 2026-04-22 |

---

## UNCLEAR

1. Exakte CHF/EUR-Preise pro vCPU-s + GiB-s Switzerland North April 2026
2. Flex-Profile-Verfügbarkeit CH North Roadmap (Q3/Q4 2026?)
3. GPU-Workload-Profiles (NC A100) in CH North (Fallback Sweden Central / West Europe)

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Pricing + Regionen (CH North = Consumption + Dedicated, Flex fehlt), Scale-to-Zero-Regeln (nur event-basiert), Dapr Building Blocks + KEDA Triggers als MAF-Tabellen, VNet-Integration mit Private-Endpoint-Pattern, Revisions + Blue/Green-Pattern, Managed-Identity-Auth-Ziele, Decision-Heuristik ACA vs. Functions vs. Foundry Agent Service vs. AKS, MAF-Hosting-Rezept mit CLI-Baseline | Learn + DevBlogs + Dapr.io + Azure-Samples |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
