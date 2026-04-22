---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [Azure AI Agent Service]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
  - "[[Agents MOC]]"
---

# Foundry Agent Service

*Managed Hosting für [[Microsoft Agent Framework]]-Agents in Azure. GA seit März 2026 mit Hosted-Agents-Runtime in Preview. **Wichtige Korrektur**: die frühere North-Central-US-Only-Beschränkung ist überholt — **Switzerland North ist seit März 2026 offiziell gelistete Region**.*

> **Analogie:** Was App Service für Web-Apps ist, ist Foundry Agent Service für MAF-Agents — managed Container-Runtime mit OTel + Identity + Web-UI out-of-the-box.

---

## 🚨 Wichtigste Korrektur zum Arbeitsauftrag §2.6

Der **DSGVO-Flag "nur North Central US"** aus dem Arbeitsauftrag ist **überholt** (Stand März 2026). Foundry Agent Service ist in 10 EU/EFTA-Regionen verfügbar, inkl. **Switzerland North**. Restliche Preview-Limits (Replicas, Private Networking) sind die realen aktuellen Blocker — nicht die Region.

---

## Einsatz

**JTBD:** When I schnell einen MAF-Agent produktiv nehmen will ohne Container-Ops-Setup, I want to ihn direkt im Foundry-Project deployen und ein Chat-UI erhalten, so I can Time-to-Production minimiere.

**Trigger-Signale:**
- „Wir haben MAF-Agenten geschrieben, wo hosten?"
- „Kein DevOps-Team — wer kümmert sich um Container?"
- „Wir brauchen eine Demo-Website für Stakeholder"

**Szenarien:** (1) PoC-Agent mit Web-UI für Stakeholder-Demo, (2) Pro-Code-Agent in Foundry-Project ohne eigene Container-Infra, (3) Teams-/Copilot-Kanal-Publishing für MAF-Agent.

**Empfehlung:**
- 🟢 **für nicht-sensible Agent-Workloads** in Switzerland North / Germany West Central / West Europe
- 🟡 **für regulierte Daten** — bis Private Networking GA wird, lieber [[Azure Container Apps]] Self-Host

---

## Status & Regionale Verfügbarkeit

| Detail | Wert |
|--------|------|
| **Agent Service (Core)** | **GA** März 2026 |
| **Hosted Agents Runtime** | 🟡 **Preview** (Billing ab 2026-04-01) |
| **Billing-Status** | Läuft produktiv (nicht mehr Free-Preview) |
| **Private Networking** | ❌ **NICHT** für Hosted Agents in Preview — kritischer Gap für regulierte Workloads |

### Regionale Verfügbarkeit (Stand 2026-04-16, Hosted Agents)

```
┌────────────────────────────────────────────────────────────────┐
│ EU / EFTA (DSGVO-Zone) — inkl. Switzerland                     │
│   France Central · Germany West Central · Italy North          │
│   Norway East · Poland Central · Spain Central                 │
│   Sweden Central · Switzerland North · UK South                │
├────────────────────────────────────────────────────────────────┤
│ Americas                                                       │
│   Brazil South · Canada Central · Canada East                  │
│   East US · East US 2 · North Central US · South Central US    │
│   West US · West US 3                                          │
├────────────────────────────────────────────────────────────────┤
│ APAC / Africa                                                  │
│   South India · Korea Central · Southeast Asia                 │
│   Australia East · Japan East · UAE North · South Africa North │
└────────────────────────────────────────────────────────────────┘
```

Quelle: [learn.microsoft.com/.../hosted-agents](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents) (updated 2026-04-16).

---

## Pricing

| Komponente | Abrechnung | Notiz |
|------------|------------|-------|
| **Agent Service selbst** | **kostenlos** | Zitat: "No additional charge to use Foundry Agent Service itself" |
| **Hosted-Agents Runtime** | per **vCPU-Stunde + GiB-Stunde** (Container-Compute) | Billing gestartet 2026-04-01 während Preview |
| **Model-Tokens** | separat nach Modell (GPT-4.1, Grok, Llama, DeepSeek, Claude etc.) | Haupt-Kostentreiber |
| **Thread/Conversation Storage** | Retention nach Project-Policy | 100k Messages/Thread max |
| **Application Insights** (Tracing/Observability) | Standard App Insights-Pricing (per GB ingestion) | automatisch provisioniert bei `azd ai agent` |
| **Azure Container Registry** | Basic-Tier ~$5/Monat | Pflicht-Dependency |
| **Vector Stores / File Search** | 2 Mio Tokens/File Limit; Storage via Foundry IQ | Tool-spezifisch |

### Replica-Sizing (Hosted Agents)

**16 CPU/Memory-Stufen** von **0.25 vCPU / 0.5 GiB** bis **4.0 vCPU / 8.0 GiB**. **Scale-to-Zero** mit `--min-replicas 0` möglich (Trade-off: Cold-Start).

**Preview-Limits (hart):**
- **Foundry Resources mit Hosted Agents / Subscription:** 100
- **Hosted Agents pro Foundry Resource:** 200
- **`min_replica` Maximum:** 2
- **`max_replica` Maximum: 5** ← nicht produktions-skalierbar bei Lastspitzen
- LogStream Max Connection: 10 Min / Idle-Timeout: 1 Min

---

## Kernkonzept

### Was es im Kern ist

Agent Service ist das **managed Deployment-Ziel** innerhalb Foundry. Ein Foundry-Project kann beliebig viele Agents hosten. Der Service übernimmt:
- **Hosting** (Container hinter Load Balancer)
- **Thread-Persistenz** (Cosmos DB hinter den Kulissen)
- **Chat-UI** out-of-the-box (Web Application preview channel)
- **Tracing** (Foundry Control Plane + App Insights)
- **Identity** ([[Entra Agent ID]] integration, auto-provisioning)

### Framework-Support

```
             Microsoft Agent Framework (Python + C#) ──┐
                                                       │
             LangGraph (Python only) ──────────────────┤──→  Foundry Agent Service
                                                       │       (Managed Runtime)
             Custom Code (Python + C#) ────────────────┘
```

### Kern-Fähigkeiten (Stand April 2026)

| Fähigkeit | Status | Details |
|-----------|--------|---------|
| **Auto-Scale** | ✅ | Horizontal via `--min-replicas` / `--max-replicas`; Preview-Cap: max=5 |
| **Versioning** | ✅ | `client.agents.create_version()` bei Image/CPU/Memory/Env/Protocol-Änderungen |
| **Non-versioned Update** | ✅ | `az cognitiveservices agent update` für Replica-Count/Description/Tags |
| **A/B / Traffic-Split** | 🟡 nicht native | Nur Versionierung + Publishing-Channels; Canary via externe Traffic-Manager oder APIM AI Gateway |
| **Built-in Web-UI** | ✅ "Web application preview" Channel | Sharebare UI für Stakeholder-Demo |
| **Stable API-Endpoint** | ✅ | Published Agents: eigene Identity + URL über Versionen stabil |
| **Conversation Management** | ✅ | Foundry verwaltet Threads/State, Cross-Session-Continuity |
| **Observability** | ✅ OpenTelemetry-nativ | TracerProvider/MeterProvider/LoggerProvider, App Insights, Live Metrics |
| **Evaluation Built-in** | ✅ | Intent Resolution, Task Adherence, Tool Call Accuracy, Coherence/Fluency |
| **MCP-Support** | ✅ GA | RemoteMCPTool mit Stored-Credentials / Project-MI / OAuth-Passthrough |
| **Private Networking** | ❌ **Hosted Agents Preview: NICHT möglich** | Kritischer Gap für regulierte Workloads |

### Typischer Workflow

1. **Setup** — Foundry Project in gewünschter Region (z. B. Switzerland North); `azd init` mit Agent-Template
2. **Build** — MAF-Agent lokal entwickeln + testen; Container-Image bauen (linux/amd64)
3. **Deploy** — `azd up` oder via Foundry Portal → Hosted-Agent-Runtime
4. **Publish** — Channel wählen (Web, Teams, M365 Copilot, API)
5. **Operate** — Foundry Control Plane für Tracing + Eval; App Insights für SRE-Workflows

---

## Abgrenzungs-Matrix

```
                        ┌────────────────────────────────────────┐
                        │ Hosting-Target-Entscheidung für Agent  │
                        └────────────────────────────────────────┘
                                         │
          ┌──────────────────────────────┼──────────────────────────────┐
          ▼                              ▼                              ▼
┌──────────────────────┐   ┌────────────────────────┐   ┌────────────────────────┐
│ Foundry Agent        │   │ [[Azure Container Apps]]│   │ [[M365 Agents SDK]]    │
│ Service (Hosted)     │   │  Self-Host             │   │                        │
│                      │   │                        │   │                        │
│ ✅ schnelle Produktion│   │ ✅ volle Kontrolle      │   │ ✅ Teams/Copilot-Kanal  │
│ ✅ Web-UI out-of-box │   │ ✅ Private Networking   │   │                        │
│ ✅ 10 EU-Regionen    │   │    (VNet-Injection)    │   │                        │
│ ❌ NO Private VNet   │   │ ✅ Custom-Inference    │   │ — nicht Pro-Code-Layer  │
│ ❌ max 5 replicas    │   │ ❌ eigene Ops-Last     │   │                        │
│                      │   │                        │   │                        │
│ ZIEL: schneller Pilot│   │ ZIEL: reguliert / hohes│   │ ZIEL: M365-Kanal        │
│       nicht reguliert│   │       Volumen / VNet   │   │       (zusätzlich zu   │
│                      │   │                        │   │        Agent Service)  │
└──────────────────────┘   └────────────────────────┘   └────────────────────────┘

                        ┌────────────────────────────────────────┐
                        │ [[Copilot Studio]]                     │
                        │  Low-Code-Alternative                  │
                        │  → bei Business-User-Ownership         │
                        └────────────────────────────────────────┘
```

### Agent Service vs. [[Copilot Studio]]

| Dimension | **Foundry Agent Service** | **[[Copilot Studio]]** |
|-----------|---------------------------|------------------------|
| Paradigma | Pro-Code, Managed Container | Low-Code, visueller Canvas |
| Zielgruppe | Developer für Produktiv-Agents | Business Teams, Pro-Makers |
| Deployment-Artefakt | Docker Image (linux/amd64) | Topic/Flow-Konfiguration |
| Scaling | Auto (Preview: max 5) | SaaS-managed |
| Kontrolle | Mittel (Container + Foundry-Runtime) | Gering |
| Time-to-Production | `azd up` (Minuten) | Klick (Minuten, aber limitierte Logik) |
| Kosten-Modell | Container-Compute + Model-Tokens | Copilot Credits |
| Framework-Lock-in | MAF / LangGraph / Custom | Copilot-Studio-DSL |

---

## EU-/DSGVO-Workaround-Optionen

### Option A — Schweiz-nativ (empfohlen für CH-Kunden)
Foundry Project in **Switzerland North** anlegen, Hosted Agents dort deployen. Model-Deployments als **Data Zone (EUR)** konfigurieren (Sweden Central + Germany West Central als Anker-Regionen für DataZone).

### Option B — Hybrid (risk-tiered)
- **Hosted (Foundry Agent Service):** nicht-sensible Agents (Marketing-Content, interne Recherche) in Switzerland North / Germany West Central
- **Self-hosted ([[Azure Container Apps]] + MAF):** PII-/Patientendaten-exponierte Agents on-prem oder VNet-isoliert, bis Private Networking GA

### Option C — Bring-your-own-Runtime mit Foundry-Endpoints
Agent-Code auf eigener ACA-Instance in CH-North → ruft Foundry Responses-API + Foundry IQ + Foundry Models in EU-DZ auf. Kombiniert Netzwerk-Kontrolle mit Foundry-Convenience.

### Aktuelle DSGVO-Blocker bei Hosted Agents

1. **Hosted Agents ≠ VNet-isolated** in Preview → sensible Workloads ungeeignet bis GA
2. **Non-Microsoft-Tools** (Third-Party MCP, Web-Search) → Daten können an Non-MS-Services fließen
3. **Application Insights** → Ingestion-Region muss geprüft werden

---

## Limitierungen & Fallstricke

### Harte Grenzen

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Private Networking fehlt** für Hosted Agents in Preview | [[Azure Container Apps]] mit VNet-Injection |
| **max 5 Replicas** in Preview | bei höheren Lasten ACA self-hosted |
| **A/B-Traffic-Splitting nicht nativ** | APIM AI Gateway davor oder App-Layer-Routing |
| **Non-Microsoft-Tools über MCP gehen out-of-scope** | interne MS-Tools bevorzugen oder via APIM proxen |
| **Cold-Start bei Scale-to-Zero** | `--min-replicas 1` für latenz-kritische Pfade |

### Typische Fallstricke

- **Annahme NC-US-Only** (Arbeitsauftrag §2.6) — veraltet seit März 2026. *Gegenmittel: dieses Dokument als Quelle für Kundenbriefings.*
- **Preview-Limits ignorieren** — max 5 Replicas scheinen harmlos, brechen aber bei Traffic-Spikes. *Gegenmittel: Lasttest vor Produktionsfreigabe.*
- **Billing startet 2026-04-01** — Teams, die PoCs im Februar/März „kostenlos" liefen, bekommen jetzt unerwartete Rechnungen. *Gegenmittel: Usage-Alert im Azure Monitor.*

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| [[Microsoft Agent Framework]] | Agent-Code-Framework, deployed nach FAS | GA | Agent-Code muss MAF-konform strukturiert sein |
| [[Foundry Control Plane]] | RBAC, Tracing, Evaluation für gehostete Agents | GA | Tracing automatisch in App-Insights-Workspace des Projects |
| [[Entra Agent ID]] | Agent-Identity + Conditional Access | GA | OBO-Flows für User-Daten müssen explizit konfiguriert sein |
| [[Foundry Models]] | Modell-Backend für Agent — Region-Match mit FAS wichtig | GA | Cross-Region-Calls möglich, aber Latenz + DSGVO-Flag |
| [[APIM AI Gateway]] | Proxy vor Agent-Calls für Token-Budget + Audit | GA | zusätzlicher Hop, ~10–30 ms Latenz |
| [[Foundry IQ]] / [[Azure AI Search]] | Knowledge-Quelle für Agent-RAG | GA | IQ einfacher, Search mehr Kontrolle |
| [[Azure Functions]] / [[Azure Container Apps]] | alternative Self-Hosting-Optionen | GA | FAS managed; Functions/ACA für Custom-Container-Needs |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| Custom MCP-Server | FAS-Agent ruft Dritt-MCP-Tools auf | GA | OAuth-2.1-Setup pro Server |
| LangGraph / CrewAI | **NICHT** auf FAS deploybar — FAS ist MAF-spezifisch | – | Alternative: Container Apps mit eigenem Runtime |

### APIs / Protokolle

- **Foundry REST API** für Agent-Management (Create/Update/Deploy)
- **MCP-Client** (Standard 2025-11-25) für Tool-Calls
- **OpenTelemetry** für Tracing — Auto-Export zu Foundry Control Plane + App Insights

---

## Offizielle Referenzen & Monitoring

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Hosted Agents in Foundry Agent Service (Preview) | https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/hosted-agents | 2026-04-22 |
| Docs | Quotas and limits | https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/limits-quotas-regions | 2026-04-22 |
| Docs | Agent Service Overview | https://learn.microsoft.com/en-us/azure/foundry/agents/overview | 2026-04-22 |
| Docs | Region Support | https://learn.microsoft.com/en-us/azure/foundry/reference/region-support | 2026-04-22 |
| Docs | Publish Agents to M365 Copilot and Teams | https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/publish-copilot | 2026-04-22 |
| Pricing | Foundry Agent Service Pricing | https://azure.microsoft.com/en-us/pricing/details/foundry-agent-service/ | 2026-04-22 |
| Tech Blog | Foundry Agent Service is GA (März 2026) | https://devblogs.microsoft.com/foundry/foundry-agent-service-ga/ | 2026-04-22 |
| Tech Blog | Publishing Agents from Foundry | https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/publishing-agents-from-microsoft-foundry-to-microsoft-365-copilot--teams/4471184 | 2026-04-22 |
| Tech Blog | Choosing the Right Azure Hosting | https://devblogs.microsoft.com/all-things-azure/hostedagent/ | 2026-04-22 |
| Docs | EU Data Boundary | https://learn.microsoft.com/en-us/privacy/eudb/eu-data-boundary-transfers-for-optional-capabilities | 2026-04-22 |
| GitHub | MS AI Decision Framework | https://github.com/microsoft/Microsoft-AI-Decision-Framework | 2026-04-22 |

---

## UNCLEAR

1. Welche 6 Regionen **neu** im März-GA-Release waren (aktuell nur Gesamt-Liste verfügbar)
2. Ob Private Networking für Hosted Agents nachgereicht wird (Roadmap unklar)
3. EUR-Preise für vCPU-Stunden / GiB-Stunden (Pricing-Page EUR-Umrechnung)

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | **Major correction**: DSGVO-Flag aus Arbeitsauftrag §2.6 überholt — **Switzerland North ist GA-Region**. 10 EU/EFTA-Regionen. Preview-Limits präzisiert (max 5 Replicas, kein Private Networking). Hybrid-Workarounds dokumentiert. Billing seit 2026-04-01. | Learn-Docs updated 2026-04-16 + DevBlogs GA-Post |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
