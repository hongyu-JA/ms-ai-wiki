---
watch: standard
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Azure Logic Apps, Logic Apps Standard, Logic Apps Consumption]
moc:
  - "[[Microsoft MOC]]"
  - "[[Integration & Compute MOC]]"
---

# Logic Apps

*Microsofts **Pro-Dev-iPaaS auf Azure** — Workflow-Orchestrator mit **1400+ Enterprise-Konnektoren** (SAP, Oracle, Salesforce, ServiceNow, SFTP, AS2/X12/EDIFACT). Seit 2026 auch **Agent-Workflow-Runtime**: autonome und konversationelle Agent-Loops direkt im Designer, und **Foundry-MCP-Tool-Host** für alle Connectors. Abgrenzung zu [[Power Automate]]: **Azure-Consumption-Billing statt M365-Seat, Pro-Dev- statt Citizen-Dev-Persona, VNet/Private Endpoint statt Shared-Tenant**.*

> **Analogie:** Was [[Azure Functions]] für Code ist, ist Logic Apps für Workflow-Grafen — serverless orchestriert, nur dass der „Code" aus 1400 vorgefertigten Konnektor-Kacheln besteht statt aus C#. Und während [[Power Automate]] dasselbe Engine mit Office-365-Lizenz fährt, läuft Logic Apps auf Azure-Subscription mit Pro-Dev-Toolchain (ARM, VS Code, VNet).

---

## Einsatz

### Job-to-be-done

*When I* Enterprise-Systeme (SAP, Oracle, Salesforce, on-prem SQL) in Azure-Workflows oder Agent-Loops einbinden will, *I want to* vorgefertigte Konnektoren + Workflow-Engine + B2B-Pack (EDI/AS2) ohne eigenes Integration-Coding, *so I can* fokussiert auf Business-Logik statt auf Auth-Handshakes, Retry-Policies und Format-Konvertierung arbeiten. Seit 2026 auch: *so I can* Agents mit governed Enterprise-Zugriff ausstatten, ohne jeden MCP-Server selbst zu schreiben.

### Trigger-Signale

- *„Unser Agent soll SAP-Kunden-Stammdaten lesen und in ServiceNow ein Ticket öffnen."*
- *„Wir brauchen EDIFACT-Empfang von unserem Logistik-Partner — nach Azure, nicht auf unseren on-prem BizTalk."*
- *„Power Automate reicht uns nicht mehr: VNet-Zugriff auf on-prem SQL, ARM-Deployment, CI/CD-Pipeline."*
- *„Der Copilot-Agent soll Offerten aus unserem CRM holen — aber wir wollen keinen eigenen MCP-Server bauen."*

### Einsatz-Szenarien

1. **Agent-Tool-Host für Foundry/MAF** — SMB-Kunde hat MAF-Agent auf [[Azure Functions]] laufen, braucht aber Zugriff auf 15 Enterprise-Systeme. Statt 15 Function-Bindings: **Logic Apps Standard als MCP-Server** (seit Ignite 2025 Public Preview) mit Connector-Actions als Tools → [[Foundry Models]]-Agent ruft sie via Foundry Tool Catalog auf. Vorteil: kein Custom-Auth-Code, Entra+OBO out-of-the-box.
2. **EDI/B2B-Drehscheibe** — Mittelständischer Händler bekommt Bestellungen per EDIFACT/X12 von Großkunden. Logic Apps Standard + Integration Account → Nachricht empfangen, parsen, in ERP-System übergeben. Vorher: BizTalk on-prem mit Wartungsvertrag. Journai-Hebel: Migration + AS2-Trading-Partner-Setup.
3. **Autonomer Freigabe-Workflow** — „Eingangsrechnung → Agent prüft Positionen gegen Bestellung → bei Abweichung > 5 % Human-Approval-Step via Teams-Chat → Buchung in Business Central." Logic Apps **Conversational Agentic Workflow** mit Easy-Auth-geschütztem externen Chat-Client.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Azure Subscription (Pay-as-you-go oder EA/MCA). Keine M365-Lizenz nötig — das ist der **Haupt-Unterschied zu [[Power Automate]]**. |
| **Tenant / Infrastruktur** | Azure-Ressourcen-Gruppe; für Standard zusätzlich Storage Account + App Service Plan (WS1/WS2/WS3) oder ASEv3; für Hybrid: Arc-enabled AKS + on-prem SQL + SMB-File-Share. Für Agent-Workflows zusätzlich [[Foundry Models]]- oder Azure-OpenAI-Ressource. |
| **Skills / Rollen** | Pro-Dev (JSON-Definition lesen können), Azure-Admin (ARM/Bicep für Deploy), optional DevOps-Engineer für CI/CD. Konnektor-spezifisches Wissen (SAP, EDI) je nach Szenario. |
| **Compliance-Rahmen** | DPA über Microsoft-Online-Services-Terms abgedeckt. Data-Residency über Region-Wahl (Standard: garantiert in Region; Consumption: Paired-Region für GRS). EU-AI-Act-Einordnung derzeit nicht product-spezifisch kommuniziert. |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | Single-Workflow-PoC: 2–5 Tage. B2B/EDI-Setup mit Trading-Partner: 10–20 Tage. Agent-Workflow mit 3 Tools: 3–7 Tage. |
| **Laufende Lizenzkosten** | Consumption: $0.000025/Action → $5–50/Monat bei SMB. Standard WS1: ~$175/Monat Baseline + Storage-Transaktionen. Premium-Konnektor (SAP, Salesforce): zusätzlich ~$0.001/Call. Integration Account Standard: ~$500/Monat. |
| **Laufender Betrieb** | 0.5–2 Tage/Monat Monitoring, Workflow-Failure-Troubleshooting, Konnektor-Version-Updates. |

### Empfehlung

**Status:** 🟢 **Empfehlen** — für Pro-Dev-Szenarien mit Enterprise-Konnektoren (SAP, Oracle, SFTP), EDI/B2B, Agent-Tool-Hosting oder VNet-Pflicht. Reif, breit deployed, klare Azure-Pricing-Story. 🟡 **Beobachten** für AI-Agent-Workflows selbst (Consumption agentic = Preview, Standard agentic = GA aber noch jung) — hier fall-through zu [[Azure Functions]] + [[Microsoft Agent Framework]] wenn Kontrolle wichtiger als Klick-Speed.

**Nächster Schritt für Journai:** (1) „Logic Apps vs. Power Automate"-Entscheidungs-Canvas als SMB-Workshop entwickeln. (2) Referenz-Architektur „Foundry-Agent mit Logic Apps MCP-Tool-Server" bauen, sobald MCP-Connector-Feature GA wird. (3) EDI-Migrations-Angebot für BizTalk-Kunden prüfen (MS hat BizTalk-Retirement 2028 angekündigt — Bestandsbewegung).

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | **GA** (Consumption + Standard). **Hybrid GA Juni 2025**. **Agent Workflows Standard: GA**; **Consumption Agentic: Preview** (Stand April 2026). **Logic Apps Connectors als Foundry-MCP-Tools: Public Preview seit Ignite 2025 (25.11.2025)**. |
| **GA-Datum** | Consumption: 2016 · Standard: 2021 · Hybrid: Juni 2025 · Agent Workflows: Build 2025 → schrittweise GA |
| **Standalone-Preis (USD)** | **Consumption**: $0.000025/Action (Standard-Connector-Action $0.000125, Enterprise-Connector $0.001). **Standard**: WS1 ~$0.19/h, WS2 ~$0.38/h, WS3 ~$0.76/h (App-Service-Plan-Modell). **Integration Account**: Free (0 USD, 1 pro Subscription) / Basic ~$0.42/h / Standard ~$1.37/h. *{Preise laut Pricing-Page 2026, variieren pro Region}* |
| **Standalone-Preis (EUR/CHF)** | Nicht separat ausgewiesen — Umrechnung über Azure-Pricing-Calculator mit Region-Filter. Switzerland North tendenziell ~10 % Aufschlag. *{UNCLEAR — CH-Pricing im Calculator verifizieren}* |
| **Lizenz-Bundle** | Keins — reines Azure-Consumption-/Plan-Pricing. **Kein M365-Bundle** (das ist [[Power Automate]]). |
| **Voraussetzung** | Azure Subscription. Für Premium-Konnektoren (SAP, Salesforce, Oracle) keine extra Lizenz, aber zusätzliche Per-Call-Kosten. |
| **Region-Verfügbarkeit** | Global, 60+ Regionen. EU: West Europe, North Europe, France Central, Germany West Central, UK South, Italy North. **Switzerland North + West: verfügbar** für Consumption + Standard (Migration westeuropa→CH dokumentiert). |
| **CSP-Promo / Discounts** | EA/MCA-Rabatte, Reserved-Capacity für Standard-Plans (1/3 Jahre). Für Consumption: keine RIs. |
| **Hidden Costs** | (1) **Enterprise-Konnektoren** (SAP, IBM MQ, Oracle EBS) 8× teurer als Standard-Konnektoren. (2) **Storage-Transaktionen** bei Standard-stateful — pro Run werden Inputs/Outputs gespeichert, das summiert sich bei vielen Actions. (3) **Integration-Account Standard** ist quasi-Pflicht für AS2/X12 — fix ~$1k/Monat. (4) **Azure-OpenAI-Token-Kosten** bei Agent-Workflows zusätzlich. |
| **Upgrade-Pfad** | Consumption → Standard: **kein In-Place-Migration**, Workflow neu anlegen (Definitionen weitgehend kompatibel). Power Automate → Logic Apps: offizieller Migrations-Guide vorhanden, aber Connector-Mapping-Arbeit (Premium-Konnektoren überlappen nicht 1:1). |

---

## Kernkonzept

### Was es im Kern ist

Logic Apps ist ein **JSON-definierter Workflow-Graph**, der von der Azure-Logic-Apps-Runtime ausgeführt wird. Jeder Workflow = Trigger + Actions + Control-Flow (Condition, Switch, ForEach, Scope, Until). Die zentrale Wette von Microsoft: **„Integration ist 80 % Connectoren-Glue, 20 % Logik"** — also bietet Logic Apps 1400+ vorgefertigte Konnektoren und einen visuellen Designer, in dem der Pro-Dev den Workflow zusammensteckt statt codet.

Der **Runtime-Split ab 2021** ist die zentrale Architektur-Entscheidung: **Consumption** läuft als **multitenant** serverless auf von Microsoft betriebenen Shared-Compute-Pools (pay-per-action). **Standard** läuft als **single-tenant** auf Azure Functions Runtime im App-Service-Plan-Modell (pay-per-plan-hour, VNet-fähig). Standard ist architektonisch die Weiterentwicklung: portabel (lokal in VS Code, ASEv3, Kubernetes via Hybrid), mehrere Workflows pro Ressource, built-in Connectors laufen in-process statt über API-Connections.

Seit Build 2025 ist Logic Apps zusätzlich **Agent-Workflow-Runtime**: Ein **Agent-Action** im Designer startet einen Agent-Loop (Think → Act → Learn-Pattern) mit einem Azure-OpenAI-Modell, der dann Tools (= andere Actions des Workflows) aufruft. Zwei Modi: **Autonomous** (Trigger-getrieben, ohne Human-Chat) und **Conversational** (externe Chat-UI über Easy-Auth). Das macht Logic Apps zur **ersten MS-Plattform, die sowohl klassische Workflows als auch Agent-Orchestrierung in einer Engine vereint** — konkurrierend mit [[Microsoft Agent Framework]] + [[Azure Functions]] als Code-first-Alternative.

Seit Ignite 2025 der dritte strategische Move: **Logic Apps Connectors als Foundry-MCP-Tools**. Eine Standard-Logic-App wird als remote MCP-Server exponiert, ihre Connector-Actions werden zu MCP-Tools, die [[Foundry Models]]-Agenten via Foundry Tool Catalog aufrufen. Das positioniert Logic Apps als **Haupt-Tool-Layer für Enterprise-Agents** — die einzige MS-Plattform, die 1400 Enterprise-Konnektoren MCP-nativ verfügbar macht.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| **Workflow-Definition** | JSON-Graph (Trigger, Actions, Control-Flow) | Logic Apps (proprietär, aber offen dokumentiert) |
| **Runtime** | Workflow-Execution-Engine | Consumption: MS-multitenant · Standard: single-tenant auf Azure Functions Host · Hybrid: selbst-gehostet auf AKS |
| **Connector-Layer** | Auth + API-Call-Abstraktion zu Drittsystem | Logic Apps (built-in) oder Managed Connector (shared) |
| **Compute-Host** | VM / Container | Consumption: shared · Standard: App Service Plan (WS1–WS3) oder ASEv3 · Hybrid: Arc-enabled Kubernetes |
| **State-Storage** | Run-History, Inputs/Outputs | Azure Storage (stateful) · in-memory (stateless) · on-prem SQL Server (Hybrid) |
| **Agent-Model** | LLM für Agent-Loop | Consumption: Foundry-managed · Standard: eigene Azure-OpenAI-/Foundry-Ressource oder [[APIM AI Gateway]] |

### Kern-Fähigkeiten

#### 1. Drei Runtime-Tiers — Consumption vs. Standard vs. Hybrid

Die zentrale Architektur-Entscheidung eines Logic-Apps-Projekts. Vergleichstabelle:

| Feature | **Consumption** | **Standard (Workflow Service Plan)** | **Standard (ASEv3)** | **Hybrid** |
|---------|:---:|:---:|:---:|:---:|
| **Tenancy** | Multitenant | Single-Tenant | Isolated (eigene ASE) | Self-hosted |
| **Pricing-Modell** | Pay-per-Action | App-Service-Plan (Stunde) | ASE Plan | Plan + Arc-Infra |
| **VNet / Private Endpoint** | ❌ (nur via ISE, deprecated) | ✅ | ✅ | ✅ (eigenes) |
| **Max Workflows pro Ressource** | 1 | n | n | n |
| **Stateful + Stateless** | Nur Stateful | Beide | Beide | Beide |
| **Data Residency** | Region + Paired Region (GRS) | Strikt Region | Strikt Region | **on-prem** |
| **Built-in Connectors in-process** | ❌ | ✅ (viele, z.B. Service Bus, SQL) | ✅ | ✅ |
| **Lokal entwickeln (VS Code)** | ❌ | ✅ | ✅ | ✅ |
| **Storage-Backend** | MS-managed | eigenes Storage Account | eigenes | **on-prem SQL + SMB** |
| **Agent Workflows** | Preview (Auto + Convers.) | GA (Auto + Convers.) | GA | *{UNCLEAR}* |
| **Min. Fix-Kosten** | $0 | ~$175/Monat WS1 | ~$1k+/Monat | Arc + AKS-Kosten |

**Faustregel für SMB:** Consumption für spiky/sporadische Workflows (<100 Runs/Tag), Standard für regelmäßige/VNet-pflichtige, Hybrid nur bei strikter on-prem-Datenresidenz (CH-Bank-Szenario, Logistik mit lokalem SQL) oder partially-connected (Retail-Filiale).

#### 2. 1400+ Enterprise-Konnektoren + Custom

Der Kern-USP gegenüber jedem Open-Source-Workflow-Tool (n8n, Temporal). Gliederung:

- **Standard-Connectors** (~500): SharePoint, Outlook, SQL Server, Azure Service Bus, HTTP, Teams — günstig ($0.000125/Call Consumption)
- **Enterprise-Connectors** (~50): SAP ERP/S4HANA, Oracle EBS, IBM MQ, IBM DB2, IBM 3270, Salesforce, ServiceNow, Dynamics 365 — teuer ($0.001/Call) aber meist konkurrenzlos
- **Built-in Connectors (Standard-Tier only)**: laufen in-process, kosten keine per-Call-Fees, höherer Throughput. Z.B. Azure Blob, Cosmos DB, Service Bus, SQL Server, FTP, SFTP.
- **Custom Connectors**: für Consumption über ARM-Template; für Standard über Custom-Built-In-Framework (C# .NET-Code).

**Grenze:** Konnektor-Schema-Änderungen im Quellsystem brechen Workflows silently — Connector-Version-Management ist SMB-Schmerzpunkt (eigene Einschätzung).

#### 3. B2B / Enterprise Integration Pack (EDI)

Einer der Haupt-Differentiators gegenüber [[Power Automate]] und [[Azure Functions]]: **natives AS2, X12, EDIFACT** für Handel/Logistik. Komponenten:

- **Integration Account** (Free/Basic/Standard-SKU) — zentrales Repository für Trading Partners, Agreements, Schemas, Maps, Certificates
- **AS2-Action** für sicheren B2B-Transport (Signing, Encryption, MDN-Receipts)
- **X12-/EDIFACT-Decode/-Encode** mit Schema-Validation
- **XML-Transformation** (XSLT 1.0/2.0/3.0) und Liquid-Templates (JSON)
- **Rules Engine** (seit 2025 auch auf Linux/Hybrid)

**Seit GA EDI in Standard (2025)**: die Built-in-Operations handhaben batched EDI-Messages + große Payloads, was vorher Consumption-Limits sprengte.

**Grenze:** Integration Account Standard ist teuer (~$1k/Monat fix). Für <100 Trading-Partners oft überdimensioniert.

#### 4. Agent Workflows (autonomous + conversational)

Seit Build 2025, Standard-Tier GA, Consumption-Tier Preview. Zwei Varianten:

| Dimension | **Autonomous Agentic Workflow** | **Conversational Agentic Workflow** |
|-----------|:---|:---|
| **Trigger** | beliebiger Workflow-Trigger (HTTP, Schedule, Queue, ...) | **"When a chat session starts"** |
| **Human-Interaction** | keine | integrierte Chat-UI (Portal) oder externe Chat-Client (Easy-Auth) |
| **Modell-Quelle (Consumption)** | Foundry-managed (auto-provisioned gpt-4o-mini / gpt-5o-mini) | Foundry-managed |
| **Modell-Quelle (Standard)** | Azure OpenAI · Foundry Project · [[APIM AI Gateway]] LLM-API | Azure OpenAI · [[APIM AI Gateway]] |
| **Auth (Production)** | ARM/Workflow-Auth (SAS, Managed Identity) | Consumption: OAuth 2.0 mit Entra ID · Standard: Easy Auth (App Service Auth) |
| **SMB-Use-Case** | Eingangsrechnung → Prüfung → ERP-Buchung | Internes „Offert-Copilot", Facility-Work-Order-Chat |
| **Billing** | Tokens als Enterprise Units (Consumption) bzw. eigene Azure-OpenAI-Kosten (Standard) | dito |

**Agent-Struktur:** Ein **Agent-Action** im Workflow hat **Instructions** (System-Prompt), **Connection** (Modell-Ressource) und **Tools**. Ein Tool = Sequenz von Connector-Actions mit **Agent Parameters** (vom Modell generierte Inputs). Der Agent kann dasselbe Tool mehrfach mit unterschiedlichen Parametern aufrufen (Fan-Out-analog).

**Wichtig:** Ein Agent kann **nicht inline einen anderen Agent als Tool aufrufen** — für Multi-Agent-Setups: sequentielle Agenten im Workflow oder externer Agent-Framework (MAF).

**Grenze:** Context-Length = Modell-Limit. Lange Agent-Loops brauchen Context-Pruning-Strategie. Kein nativer Human-in-the-Loop-State über Tage (dafür [[Azure Functions]] Durable). Observability weniger ausgereift als MAF + App Insights.

#### 5. Foundry-MCP-Tool-Host (Public Preview seit Ignite 2025)

Neu und strategisch zentral: **Standard Logic Apps als remote MCP-Server** für [[Foundry Models]]-Agenten. Mechanik:

1. Im Foundry Agent-Tool-Catalog: Connector auswählen (z.B. „Salesforce")
2. Standard Logic App als Host-Ressource wählen (oder neu anlegen)
3. Operations auswählen, die als MCP-Tools exponiert werden
4. OpenAPI-Definition wird auto-generiert, MCP-Server in Foundry registriert
5. [[Foundry Models]]-Agent (oder MAF-Agent, Claude, Cursor) ruft Tools via Foundry MCP

**Voraussetzung:** Standard-Tier (**nicht Consumption**). Auth-Details zum Ignite-Announcement noch dünn — vermutlich Entra + OBO, aber *{UNCLEAR}*.

**Limitation:** „Some first-party connectors using OAuth are not yet supported" (MS-Blog 11/2025) — also Graph, SharePoint, Outlook initial nicht im MCP-Catalog. Workaround: Custom-Logic-App mit HTTP-Action + OBO-Token selbst wiring.

**Abgrenzung zu [[Azure Functions]]-MCP-Binding:** Functions-MCP ist für **custom Tool-Logik in Code**. Logic-Apps-MCP ist für **Connector-Actions ohne Code**. Koexistenz, nicht Konkurrenz.

#### 6. Deployment & CI/CD

- **Consumption**: ARM/Bicep-Template ist einzige saubere Option (Portal-Deploy nicht produktionstauglich)
- **Standard**: Zip-Deploy (wie Functions), ARM für Infrastruktur, separat Code/Config — **deutlich CI/CD-freundlicher**
- **VS-Code-Extension** für Standard: lokal entwickeln, debuggen, Breakpoints in actions (nicht triggers)
- **Arc-enabled Logic Apps** (seit 2022): Standard-Workflows auf beliebigem Kubernetes
- **Hybrid (GA Juni 2025)**: Arc-enabled AKS + on-prem SQL für Run-History + SMB-Share für Artifacts

### Typischer Workflow

1. **Setup** (Journai · 1–2 Tage) — Azure-Subscription, Resource Group, Storage Account, App Service Plan (für Standard) oder direkt Consumption-Ressource. Bei Agent-Workflows: Azure-OpenAI-Ressource deployen oder Foundry-Projekt anlegen. VS Code mit **Azure Logic Apps (Standard)**-Extension aufsetzen.
2. **Build / Configure** (Journai · 2–10 Tage) — Im Azure-Portal oder VS Code: Trigger wählen, Actions per Drag&Drop hinzufügen, Parameter mappen via Designer oder Code-View. Authentifizierung über Managed Identity (präferiert) oder API Connection. Bei Agent-Workflows: Agent-Instructions schreiben, Tools aus Connector-Actions bauen, Agent-Parameters definieren.
3. **Deploy** (DevOps · 1–3 Tage initial) — Bicep/ARM + Zip-Deploy via GitHub Actions oder Azure DevOps. Environments: Dev / Test / Prod getrennt. Connection-Strings über Key Vault.
4. **Operate** (Admin · 0.5–2 Tage/Monat) — Run-History im Portal prüfen, App-Insights-Dashboards für Latenz/Fehlerrate, Alerting auf Failed Runs. Connector-Version-Monitoring (Breaking Changes selten, aber silent).

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai intern)** | JSON-Workflow-Definitionen lesen/schreiben, Azure-Grundlagen, spezifisches Connector-Wissen (SAP, EDI). Für Custom-Built-In: C# .NET. |
| **Admin (beim Kunden)** | Azure-Admin (RBAC, Key Vault, Managed Identity), Application-Insights-Basics für Monitoring. |
| **End-User (beim Kunden)** | Bei Conversational Agentic Workflow: keine — reines Chat-Interface. Sonst: keiner, Workflows laufen im Hintergrund. |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Komplexe algorithmische Logik** (viele If/Else, Rekursion, dynamische Schleifen) | [[Azure Functions]] als Function-Action in Workflow einklinken |
| **Latenz < 50 ms End-to-End** | Consumption: Cold-Start-bedingt nein. Standard: Always-on, aber dennoch Overhead. Echtzeit-Anforderungen → API Management + Function |
| **Exakte Deterministik bei parallelen Branches** | Reihenfolge nicht garantiert; für strenge Determinism → Durable Functions |
| **On-prem-only ohne Cloud-Verbindung** | Hybrid-Model funktioniert nur „partially connected" (mit Azure-Arc-Heartbeat); full-air-gapped → BizTalk Server (deprecated 2028) oder Drittprodukte |
| **Multi-Agent-Orchestrierung (Agent ruft Agent als Tool)** | nicht inline möglich — sequentiell im Workflow oder extern [[Microsoft Agent Framework]] |
| **Streaming-LLM-Output an UI** | Conversational Workflow hat keine Streaming-API — für Streaming-Chat: MAF + [[Azure Functions]] + SignalR |
| **Version-Control der Workflow-Definitionen** | JSON in Git geht, aber Merge-Conflicts in auto-generierten Designer-Metadaten sind frustrierend — Convention statt Tool-Support |

### Typische Fallstricke im Einsatz

- **Consumption-Billing-Surprises bei Batch-Operations** — ForEach über 10.000 Items = 10.000 Actions. Bei Standard-Connector 10k × $0.000125 = $1.25 pro Run, bei Enterprise-Connector 10k × $0.001 = $10 pro Run. Regelmäßig läuft das aus dem Ruder, wenn niemand die Throttling-Annotations setzt.
- **Integration Account Fixkosten** — Kunden starten mit Free-Tier (1 pro Subscription, limitiert), ziehen irgendwann auf Basic/Standard hoch → $500–$1000/Monat zusätzlich zum Workflow-Pricing. Budget-Planung vergisst das häufig.
- **Premium-Konnektor-Überraschung** — SAP-Connector wirkt im Designer identisch zu SQL, kostet aber 8× mehr pro Call. Vor Projekt-Start Pricing validieren.
- **Retry-Policies sind per-Action, nicht global** — Default: 4 Retries mit 20s Interval. Bei Flaky-APIs reicht das nicht; Custom-Retry mit exponential backoff muss per Action gesetzt werden. Fehlerbild: „Workflow scheint durchzulaufen, aber nachgelagerte Actions bekommen leere Inputs".
- **Consumption ≠ Standard Connector-Parity** — Migration von Consumption zu Standard (oder Power Automate zu Logic Apps) brecht an Connector-Lücken. Built-in-Connectors von Standard sind nicht in Consumption und umgekehrt. Parity-Check vor Migration.
- **Agent-Workflow „alles-in-Logic-Apps"-Anti-Pattern** — Bei komplexer LLM-Logik (Multi-Turn-Planning, Reflection, Custom-Memory) wird Logic Apps zur Zwangsjacke. Faustregel: Logic Apps für Integration + Simple-Tool-Calling, MAF + Functions für echte Agent-Logik.
- **Hybrid + Data Residency Missverständnis** — „on-prem SQL" speichert nur Run-History. Der Connector-Traffic selbst läuft weiterhin über Azure-Connector-APIs (managed) — nicht vollständig on-prem. Für echte Air-Gap: built-in Connectors bevorzugen (Custom-built-in auf Hybrid).
- **Foundry-MCP-Tools: First-Party-OAuth fehlt noch** — Graph, SharePoint, Outlook als MCP-Tool per Default nicht verfügbar (Stand April 2026). Beratungs-Use-Cases „Agent schreibt in SharePoint" gehen noch nicht über Foundry-Tool-Catalog.

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| **[[Microsoft Agent Framework]]** | Logic App als HTTP-Tool für MAF-Agent; oder MAF-Agent ruft Logic App als Function-Tool | GA | Kein natives FunctionTool-Attribut für Logic Apps — via HTTP + OpenAPI-Spec. |
| **[[Foundry Models]] / Foundry Agent Service** | Logic Apps Connectors als **MCP-Tools** im Foundry Tool Catalog | Public Preview (seit 11/2025) | First-Party-OAuth-Connectors noch nicht, Setup-UX neu und rough edges |
| **[[Azure Functions]]** | Function als Action in Workflow, oder Function ruft Logic App via HTTP-Trigger | GA | Function-Action nur mit HTTP-Trigger-Functions kompatibel; nur Query-String-Auth |
| **[[APIM AI Gateway]]** | LLM-API-Proxy für Standard-Agent-Workflows (Quota, Routing, Observability vor Azure OpenAI) | Preview | Extra Ressource + Konfiguration |
| **[[Power Automate]]** | teilen Engine + Designer + Standard-Connectors — aber disjunkte Lizenz-/Pricing-Welten | GA | Migrations-Pfad offiziell, aber Connector-Parity-Probleme (v.a. Premium) |
| **[[Copilot Studio]]** | Copilot-Studio-Agent ruft Logic App als „Workflow-Tool" (HTTP) | GA | kein MCP-Channel, nur HTTP-Wrapper |
| **[[Dataverse]]** | Dataverse-Connector (Standard); Dataverse-Virtual-Tables für ERP-Daten | GA | Premium-Tier-Connector-Kosten |
| **[[Microsoft Graph]]** | Graph-Connector (Premium) für M365-Daten | GA | Neue Graph-API-Features meist mit Delay im Connector |
| **Azure Service Bus / Event Hubs / Event Grid** | Messaging-Integration, native Triggers + Actions | GA | Built-in in Standard, managed in Consumption (Pricing-Delta) |
| **[[Azure Container Apps]]** | Logic Apps Hybrid läuft auf Arc-enabled K8s; ACA als paralleler Compute-Host für Container-Tools | GA | Hybrid ist AKS-spezifisch, nicht ACA |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| **SAP** (ERP, S/4HANA) | RFC, BAPI, IDoc-Empfang/Versand | GA (Premium Enterprise Connector) | SAP-Lizenz-Implikationen (SAP-Lizenzbedarf für Connector-Nutzung!) — Kunde muss prüfen |
| **Salesforce, Dynamics, Oracle EBS, ServiceNow, Workday** | CRUD + Event-Abos | GA | Enterprise-Connector-Pricing |
| **IBM MQ, IBM DB2, IBM 3270** | Mainframe-Integration | GA | Selten im SMB-Umfeld |
| **SFTP, FTP, File-System** | klassische EDI-/File-Drop-Szenarien | GA (built-in in Standard) | on-prem File-Systeme nur via Data Gateway |
| **n8n, Zapier** | nicht direkt — überlappende Ziele | — | Logic Apps ist MS-zentriert, n8n ist cloud-neutral |
| **Claude (MCP-Client)** | via Foundry Tool Catalog oder direkt MCP | Public Preview | Tooling noch jung |

### APIs / Protokolle

- **Workflow-Definition-JSON** (Azure Workflow Definition Language) — proprietär, aber offen dokumentiert
- **REST-API** für Management (CRUD, Run-Trigger, History) — `Microsoft.Logic/workflows` für Consumption, `Microsoft.Web/sites/workflows` für Standard (Azure App Service REST API)
- **OpenAPI/Swagger** — Custom-Connector-Definition-Standard
- **MCP (Model Context Protocol)** — seit Ignite 2025 als Server-Protocol über Foundry
- **AS2, X12, EDIFACT, HL7, XSLT 1.0/2.0/3.0, Liquid** — Enterprise Integration Pack
- **OBO (On-Behalf-Of)** — partiell, abhängig von Connector

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | **Standard**: strikt in deployment-Region (auch Switzerland North/West). **Consumption**: Region + Paired-Region (GRS). **Agent-Workflows Consumption**: Modell kann aus anderer Region kommen → *Residency nicht garantiert für Agent-Daten*. **Hybrid**: on-prem SQL + SMB für Run-History und Artifacts → stärkste Garantie. |
| **Prompts & Outputs** | Agent-Workflow-Inputs/Outputs werden als Run-History gespeichert (abhängig von Tier). Keine Nutzung für MS-Training (Azure-OpenAI-Standard-DPA). Opt-out für History → Stateless-Workflow. |
| **Data Processing Addendum (DPA)** | Vollumfänglich in MOST (Microsoft Online Services Terms) / Product Terms abgedeckt. Für Agent-Workflows zusätzlich Azure-OpenAI-DPA. |
| **EU-AI-Act-Klassifizierung** | Keine product-spezifische MS-Einordnung. Einzelne Agent-Workflows müssen vom Kunden klassifiziert werden (Use-Case-abhängig). |

### Microsoft-Compliance-Stack

- **Entra ID** — Authentifizierung für Designer-Zugriff, Managed Identity für Action-Auth, Easy Auth für Conversational Chat-Client
- **Private Endpoints** — Standard + ASEv3 unterstützen eingehende/ausgehende PEs
- **Key Vault** — Connection-Secrets-Storage (Best Practice, nicht Default)
- **Azure Monitor / App Insights** — Run-History-Telemetrie, Custom-Metrics für Agent-Token-Usage
- **Defender for Cloud** — Logic-Apps-Resource-Recommendations
- **Purview** — keine native Logic-Apps-Coverage für DLP, aber via Managed-Connector-Calls in SharePoint/Dataverse indirekt erfasst

### Bekannte Compliance-Lücken

- **Consumption agentic: Modell-Region nicht deterministisch** — für regulierte Szenarien (CH-Banking, DSGVO-sensible Daten) Standard-Tier + eigene Azure-OpenAI-Ressource mit Region-Pin.
- **Managed Connector Traffic routet über MS-Shared-Proxy** — auch bei VNet-Integration verlassen Calls zu SaaS-Diensten das Kunden-VNet. Für full-tenant-isolation: Built-in Connectors bevorzugen.
- **Easy Auth für External Chat-Client** erfordert Entra App Registration + korrekte Audience-Configuration. Falsch konfiguriert = Chat-Client für jeden Tenant-User zugänglich (Silent-Risk). Security-Review Pflicht.
- **MCP-Server-Exposition via Foundry**: Auth-Details bei Public-Preview-Launch nicht vollständig dokumentiert — vor Produktiv-Einsatz Entra-OBO verifizieren. *{TODO: nach GA verifizieren}*.

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Product Page | Logic Apps Overview | https://learn.microsoft.com/en-us/azure/logic-apps/ | 2026-04-22 | allgemeine Änderungen |
| Docs | Standard vs. Consumption Compare | https://learn.microsoft.com/en-us/azure/logic-apps/single-tenant-overview-compare | 2026-04-22 | Architektur-Diffs, neue Tiers |
| Docs | Agent Workflows Concepts | https://learn.microsoft.com/en-us/azure/logic-apps/agent-workflows-concepts | 2026-04-22 | Agent-Features |
| Docs | Autonomous Agentic Workflows | https://learn.microsoft.com/en-us/azure/logic-apps/create-autonomous-agent-workflows | 2026-04-22 | Autonomous-Agent-Changes |
| Docs | Conversational Agentic Workflows | https://learn.microsoft.com/en-us/azure/logic-apps/create-conversational-agent-workflows | 2026-04-22 | Conversational-Agent-Changes |
| Docs | Hybrid Deployment Setup | https://learn.microsoft.com/en-us/azure/logic-apps/set-up-standard-workflows-hybrid-deployment-requirements | 2026-04-22 | Hybrid-Infra-Requirements |
| Docs | Azure OpenAI + AI Search Connectors | https://learn.microsoft.com/en-us/azure/logic-apps/connectors/azure-ai | 2026-04-22 | AI-Connector-Updates |
| Docs | Functions vs. Logic Apps vs. Flow | https://learn.microsoft.com/en-us/azure/azure-functions/functions-compare-logic-apps-ms-flow-webjobs | 2026-04-22 | Positionierung |
| Docs | Connector Reference | https://learn.microsoft.com/en-us/connectors/connector-reference/connector-reference-logicapps-connectors | 2026-04-22 | neue Connectors, Breaking Changes |
| Pricing | Logic Apps Pricing | https://azure.microsoft.com/en-us/pricing/details/logic-apps/ | 2026-04-22 | Preisänderungen |
| Pricing | Usage Metering & Billing | https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-pricing | 2026-04-22 | Billing-Detail |
| Reliability | Reliability in Logic Apps | https://learn.microsoft.com/en-us/azure/reliability/reliability-logic-apps | 2026-04-22 | AZ/DR-Coverage |
| Roadmap | Azure Updates (Logic Apps) | https://azure.microsoft.com/en-us/updates/?query=logic+apps | 2026-04-22 | GA-Timeline |

### Secondary (Tech Community / Blogs)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| Tech Community — Hybrid GA Announcement | https://techcommunity.microsoft.com/blog/IntegrationsonAzureBlog/announcement-general-availability-of-logic-apps-hybrid-deployment-model/4422414 | 2026-04-22 | GA-Datum + Features |
| Tech Community — Hybrid Preview Launch | https://techcommunity.microsoft.com/blog/integrationsonazureblog/announcement-introducing-the-logic-apps-hybrid-deployment-model-public-preview/4271568 | 2026-04-22 | Architektur-Deep-Dive |
| Tech Community — Logic Apps Connectors als MCP (Ignite 2025) | https://techcommunity.microsoft.com/blog/integrationsonazureblog/%F0%9F%8E%99%EF%B8%8Fpublic-preview-azure-logic-apps-connectors-as-mcp-tools-in-microsoft-foundry/4473062 | 2026-04-22 | Foundry-MCP-Integration |
| Tech Community — AI Connectors Preview | https://techcommunity.microsoft.com/blog/integrationsonazureblog/public-preview-of-azure-openai-and-ai-search-in-app-connectors-for-logic-apps-st/4049584 | 2026-04-22 | Azure-OpenAI-Connector |
| Tech Community — Consumption vs. Standard Pricing | https://techcommunity.microsoft.com/blog/appsonazureblog/azure-logic-apps-plans-consumption-based-vs-standard/3793997 | 2026-04-22 | Tier-Entscheidung |
| Tech Community — Hybrid Scaling | https://techcommunity.microsoft.com/blog/integrationsonazureblog/scaling-mechanism-in-hybrid-deployment-model-for-azure-logic-apps-standard/4389763 | 2026-04-22 | Hybrid-Scaling-Mechanik |
| Azure Update — GA EDI in Standard | https://azure.microsoft.com/en-au/updates/ga-edi-capabilities-in-azure-logic-apps-standard/ | 2026-04-22 | EDI-Parity |

### Events / Konferenzen zum Beobachten

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Ignite 2026 | Nov 2026 | Foundry-MCP-Connectors GA, weitere Agent-Workflow-Features, Hybrid-Enhancements |
| Microsoft Build 2026 | Mai 2026 | Consumption-Agent-GA, Developer-Tooling-Updates |
| AI Tour Zürich | 29.04.2026 | CH-Region-spezifische Details |

---

## UNCLEAR

1. **Foundry-MCP-Connector Auth-Model** (Entra+OBO vs. App-Secret) — beim Ignite-Launch nicht vollständig dokumentiert
2. **Hybrid + Agent Workflows** — läuft Agent-Action auf Arc-K8s mit eigenem LLM-Endpoint? Dokumentation spricht vorwiegend über Standard Cloud
3. **EUR/CHF-Preise** für WS1/WS2/WS3 Switzerland North — via Pricing-Calculator mit Region-Filter zu verifizieren
4. **Integration Account** Pricing 2026 — exakte Stundensätze Basic/Standard
5. **Conversational-Workflow Streaming-Support** — Roadmap-Item?

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive Logic Apps: Consumption vs. Standard vs. Hybrid (Hybrid GA Juni 2025), 1400+ Enterprise-Konnektoren, **Agent Workflows** (autonomous + conversational, Standard GA + Consumption Preview), **Foundry-MCP-Tool-Host** (Public Preview seit Ignite 11/2025), B2B/EDI, Abgrenzung zu [[Power Automate]] (Azure vs. M365, Pro-Dev vs. Citizen-Dev), 13 Primary + 7 Secondary Referenzen | https://learn.microsoft.com/en-us/azure/logic-apps/ |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
