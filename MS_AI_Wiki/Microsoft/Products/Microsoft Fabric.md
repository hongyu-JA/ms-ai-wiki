---
watch: passive
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Fabric, OneLake, Fabric Data Agents]
moc:
  - "[[Microsoft MOC]]"
  - "[[Data & Knowledge MOC]]"
---

# Microsoft Fabric

*Microsoft's **SaaS-Lakehouse-Plattform** — unifiziert Ingest, Lakehouse, Warehouse, Real-Time-Analytics, Data Science und Power BI auf einem gemeinsamen Storage-Layer (**OneLake**, Delta-Parquet-basiert). **Fabric Data Agents** (GA) bringen Natural-Language-Abfragen auf Lakehouse-/Warehouse-/Semantic-Model-Daten und sind via Microsoft 365 Copilot und Copilot Studio konsumierbar. Für Journai **selektiv relevant**: nur bei Kunden mit bestehender BI-/Analytics-Landschaft — **kein Default-SMB-Produkt**.*

> **Analogie:** Fabric ist die Microsoft-SaaS-Antwort auf Databricks + Snowflake + Power BI + Synapse — in einem einzigen Tenant-weiten SKU gebündelt, mit OneLake als „OneDrive für Daten" als Fundament.

---

## Einsatz

**JTBD:** When I Lakehouse-basierte BI-/Analytics-Workloads betreibe (Datenmengen jenseits Tabellenkalk, nicht transaktional), I want to eine integrierte Plattform für Ingest/Transform/Analyze/Visualize **plus** Natural-Language-Zugriff ohne separat lizenzierte Services, so I can Daten-Silos zwischen Analytics und AI-Agents vermeide.

**Trigger-Signale:**
- *„Wir haben Fabric/OneLake produktiv — was bringen uns Data Agents?"*
- *„Business-User wollen Lakehouse-Daten in Chat-Form abfragen, ohne SQL zu lernen."*
- *„Wir migrieren Power BI Premium + Synapse auf Fabric — was ändert sich bei Lizenz und Architektur?"*
- *„Unser Warenwirtschaft-ERP soll Daten ins Lakehouse streamen und per Teams-Chat abgefragt werden."*

**Einsatz-Szenarien (selektiv):**
1. **BI-Kunde mit Power-BI-Premium-Bestand** — Co-Termination-Migration auf F-SKU, OneLake als zentraler Storage, Data Agent für Sales-/Finance-Chat-Queries.
2. **Multi-Cloud-Datenintegration via OneLake-Shortcuts** — Daten liegen in AWS S3 / ADLS Gen2 / GCS; Shortcut statt Kopie; Analytics in Fabric, ohne Egress-Migration.
3. **Real-Time-Dashboards + AI-Insights** — Eventstream → Eventhouse (KQL) → Power BI, mit Data Agent als Natural-Language-Layer darüber.

**Voraussetzungen beim Kunden:**

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Azure-Subscription mit Fabric-Capacity (F2–F2048) ODER Power BI Premium P1+ mit Fabric-enabled; **Data Agents benötigen F64+** (Stand 2026-04) |
| **Tenant / Infrastruktur** | M365-Tenant; für M365-Copilot-Konsumption zusätzlich M365-Copilot-Lizenz pro Endnutzer |
| **Skills / Rollen** | Data Engineer mit Delta-Lake-/Spark-Kenntnissen, Power BI-Developer, Fabric-Admin (Capacity-Management, Governance); **nicht per Self-Service einführbar** |
| **Compliance-Rahmen** | DSGVO via Region-Pinning; Switzerland North / West verfügbar; EU Data Boundary deckt CH ab |

**Aufwand & Kosten (Journai-Schätzung):**

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | 2–6 Wochen Beratungs- und Migrations-Aufwand für typisches SMB-BI-Szenario (je nach Quell-System-Komplexität) |
| **Laufende Lizenzkosten** | F2 ab ~**USD 263/Monat** (PAYG); für Data Agents faktisch F64 nötig → **USD 8.400+/Monat** (PAYG, Reserved günstiger); plus OneLake-Storage + ggf. M365-Copilot-Seats |
| **Laufender Betrieb** | Capacity-Monitoring + RU-Throttling-Management 4–8 h/Monat; Fabric-Releases monatlich — passive Beobachtung über Feature-Summary-Blog |

**Empfehlung:**

🟡 **Selektiv empfehlen** — Fabric ist für Analytics-Kunden strategisch die richtige Microsoft-Plattform. Für **typische Journai-SMB-Use-Cases (Agents, Copilot, RAG auf App-Daten)** aber **nicht der Default**: Zu teuer (F64-Schwelle für Data Agents), zu breit (8 Workloads für die meisten SMB-Kunden überdimensioniert), zu BI-lastig. **Aktiv relevant nur bei:** Bestandskunden mit Power BI Premium, echten Analytics-Workloads, Multi-Cloud-Daten-Konsolidierungs-Bedarf.

**Nächster Schritt für Journai:** Bei BI-Discovery-Gesprächen gezielt prüfen, ob Fabric-Migration ansteht. Für Agent-/RAG-Use-Cases **nicht** Fabric als Storage empfehlen — da [[Azure Cosmos DB for AI]] oder [[Azure AI Search]] deutlich passender. **TODO:** 1–2 BI-Pilot-Kunden identifizieren, wo Fabric-Data-Agent als Power-BI-Chat-Extension kommerziell sinnvoll ist.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | **GA** (Fabric-Platform GA: 2023-11-15); **Fabric Data Agents GA** in 2025 (über alle Daten-Quellen: Lakehouse, Warehouse, Semantic Models, Eventhouse, SQL Databases) |
| **Pricing-Modell** | Capacity Units (F-SKUs F2–F2048); PAYG **USD 0,18 pro CU/Stunde** → F2 = 2 CU = **USD 262,80/Monat** (PAYG, US-West-2-Referenz). Reserved Instance-Rabatte via Fabric Capacity Reservations |
| **F64 als Schwellenwert** | Ab **2025-04-30** aufgehoben für **allgemeine Copilot-/AI-Features** — F2+ reicht für AI Functions + Copilot. **Fabric Data Agents benötigen aber weiterhin F64** (ca. **USD 8.400/Monat PAYG**) |
| **Storage** | OneLake-Storage wird **separat** über GB/Monat abgerechnet (nicht in Capacity-Kosten enthalten) |
| **Lizenz-Bundle** | Power BI Premium P1/P2/P3 → Fabric-enabled; M365-Copilot-Seats nötig für M365-Copilot-Konsumption der Data Agents |
| **Region-Verfügbarkeit** | F-SKUs in allen Azure Public Cloud Regionen inkl. **Switzerland North, Switzerland West, West Europe, North Europe, Sweden Central**. Multi-Geo-Workspaces optional |
| **EU Data Boundary** | CH ist Bestandteil der EU Data Boundary (Microsoft-Privacy-Dokumentation); Multi-Geo-enabled EU-Region garantiert Storage in EU Data Boundary |
| **Hidden Costs** | (1) **OneLake-Storage** separat; (2) **Copilot-Consumption** zieht CUs aus der Capacity — Spike-Risiko; (3) **Data Agents nur auf F64+** — praktisch verdoppelt/verzehnfacht die Einstiegskosten; (4) **Egress-Kosten** bei S3/GCS-Shortcuts ohne File-Caching |
| **Upgrade-Pfad** | Power-BI-Premium-Kunden: Co-Term-Migration auf F-SKU möglich (Microsoft-Sales-Case). Reservierungen für F64+ lohnen ab Dauerbetrieb |

---

## Kernkonzept

Fabric ist Microsofts SaaS-Konsolidierung mehrerer vorher getrennter Analytics-Services (Synapse, Power BI Premium, Data Factory, Event Hubs/Kusto) auf **einem einheitlichen Storage-Layer (OneLake)** und **einem einheitlichen Capacity-Modell (F-SKUs)**. Das zentrale Design-Prinzip: **„One Lake, One Copy"** — jede Workload liest/schreibt Delta-Parquet-Tabellen im selben Storage-Konto, statt jeweils eigene Daten-Silos zu halten.

Die Plattform besteht aus acht Workloads:

1. **OneLake** — Tenant-weiter, ADLS-Gen2-basierter Delta-Parquet-Storage; Single-Source-of-Truth
2. **Data Engineering** — Spark-basierte Notebooks, Native Execution Engine (C++/Vectorized), Z-Order / Liquid Clustering
3. **Data Warehouse** — T-SQL auf Delta-Lake mit ACID-Transaktionen
4. **Real-Time Intelligence** — Eventstream (Ingest) + Eventhouse (KQL-Analytics auf Zeitreihen)
5. **Data Science** — Notebooks, AutoML, SynapseML
6. **Power BI** — Semantic Models + Reports auf Fabric-Data
7. **Data Factory** — Pipelines / ETL-Orchestrierung
8. **Fabric Data Agents** — Natural-Language-Layer (LLM generiert SQL/KQL, führt gegen OneLake-Daten aus)

### OneLake — das „OneDrive für Daten"

OneLake ist **pro Tenant einmal vorhanden** — alle Workspaces/Capacities teilen denselben logischen Storage-Namespace. Daten werden **standardmäßig in Delta-Parquet** gespeichert.

**Shortcuts** sind der Schlüsselmechanismus: Statt Daten zu kopieren, legt man einen Shortcut auf externe Storage-Quellen (AWS S3, ADLS Gen2, GCS, Dataverse) oder andere Fabric-Workspaces. Die Shortcut-Zieldaten werden **in-place gelesen**, ohne ETL oder Duplikation. File-Caching reduziert Cross-Cloud-Egress-Kosten.

### Fabric Data Agents — die Natural-Language-Schicht

Fabric Data Agents (GA 2025) nehmen User-Fragen in natürlicher Sprache, entscheiden anhand des verknüpften Datenkontexts (Lakehouse, Warehouse, Semantic Model, KQL-DB, Microsoft Graph) über das passende Tool, **generieren SQL/KQL**, validieren gegen Schema, führen aus, und geben strukturierte Antworten zurück. Sie nutzen **Azure OpenAI im Hintergrund** und sitzen **auf Power-BI-Semantic-Models** — d.h. sie respektieren Measures und Relationships, die der BI-Analyst bereits modelliert hat.

**Konsumption:**
- **Native** in Fabric-UI (Chat-Panel)
- **Via [[Microsoft 365 Copilot]]** (Preview/teilweise GA) — Data Agent als Connector-Copilot
- **Via [[Copilot Studio]]** (Preview) — als Data-Source für Custom Agents
- **OneLake MCP** (GA) — Data Agents können externen AI-Agents (z.B. aus [[Microsoft Foundry]]) via MCP-Protokoll zur Verfügung gestellt werden

### Kern-Fähigkeiten

#### Capacity-Modell (F-SKUs)

F2–F2048, linear skalierend. CUs werden **tenant-weit** über alle Workloads geteilt — d.h. ein Data-Factory-Pipeline-Run und eine Power-BI-Query teilen dieselbe Capacity. Vorteil: Simpel. Nachteil: **Spike-Risk** — eine teure Copilot-Query kann Power-BI-Reports drosseln.

#### OneLake-Shortcuts

Zero-Copy-Referenzen auf externe Storage. **S3-Shortcuts sind read-only**; ADLS-Gen2 und OneLake-interne Shortcuts unterstützen Read/Write. Nutzt Cloud Connections für Authentifizierung. File-Caching reduziert Egress.

#### Delta Lake als Format-Zwang

Alle Fabric-Items (Lakehouse, Warehouse, KQL-DB) schreiben Delta-Parquet. Das ermöglicht **Cross-Workload-Interoperabilität** — ein Data-Warehouse-Table ist gleichzeitig ein Lakehouse-File und ein Power-BI-Semantic-Model-Source, ohne ETL.

#### Fabric Data Agents

Nutzt LLMs (Azure OpenAI) zur Query-Generierung. **Respektiert Power-BI-Semantic-Model-Logic** (Measures, Relationships) — der große Vorteil gegenüber generischem Text-zu-SQL. **Benötigt F64-Capacity** (nicht F2). M365-Copilot-Integration ermöglicht Konsumption im Teams-/Outlook-Kontext ohne separate UI.

### Typischer Workflow

1. **Capacity provisionieren** — F-SKU in Azure Portal (Admin); Home-Region festlegen (= EU-Data-Residency-Anker)
2. **Workspace anlegen + Capacity zuordnen** — pro Business-Domäne
3. **Daten einbringen** — Data Factory Pipeline / Eventstream / OneLake Shortcut
4. **Lakehouse / Warehouse / Semantic Model bauen** — SQL/Spark/Notebook
5. **Data Agent konfigurieren** — Datenquellen verknüpfen, Example-Queries, Tone-Instructions
6. **Publizieren** — Nativ in Fabric, per M365 Copilot oder Copilot Studio
7. **Betreiben** — Capacity-Monitoring via Fabric Capacity Metrics App; Query-Cost / Throttling-Watching

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai intern)** | Fabric-Architektur, Delta-Lake-Grundlagen, Power-BI-Semantic-Modeling, Capacity-Sizing, Spark/SQL |
| **Admin (beim Kunden)** | Fabric-Admin-Portal, Capacity-Management, Tenant-Settings (Copilot-Aktivierung), Governance |
| **End-User (beim Kunden)** | Power-BI-Grundlagen; für Data-Agent-Nutzung nur Chat-Interface |

---

## Limitierungen & Fallstricke

### Was Fabric NICHT ist

| Limitierung | Alternative / Workaround |
|-------------|---------------------------|
| **Kein OLTP-Store** — OneLake ist Delta-Parquet, Analytics-optimiert | Transaktionale App-Daten in [[Azure Cosmos DB for AI]] oder Azure SQL |
| **Data Agents nur auf F64+** | Für kleine Teams: Data Agent wirtschaftlich unattraktiv; Alternative Copilot Studio mit Custom-Data-Connectors |
| **Kein dedizierter RAG-/Vector-Store** | [[Azure AI Search]] oder [[Azure Cosmos DB for AI]] für Vector-Search |
| **Kein Agent-Framework** | [[Microsoft Foundry]] (Azure AI Foundry) oder Copilot Studio für Agent-Building |
| **Capacity-Modell ist shared** — Power BI + Spark + Copilot teilen CUs | Separate Capacities pro kritischer Workload; Monitoring per Capacity Metrics App |
| **Full-Text-Search / klassisches ML-Training** limitiert | Azure AI Search für Full-Text; [[Azure Machine Learning]] für klassisches ML/MLOps |

### Typische Fallstricke im Einsatz

- **Fabric als OLTP-Ersatz sehen** — OneLake ist Analytics-Storage. *Gegenmittel: Transaktionale Daten in Cosmos/SQL, Fabric für Analytics daraus abgeleitet.*
- **F2 für Data Agents kalkulieren** — Data Agents brauchen F64. Wer mit F2-Pricing plant, muss bei Agent-Aktivierung um Faktor ~30 aufrüsten. *Gegenmittel: Von Anfang an F64-TCO kommunizieren, wenn Data Agents Teil des Scopes sind.*
- **Data Agent mit [[Microsoft 365 Copilot]] verwechseln** — Fabric Data Agent = BI-Chat auf Lakehouse; M365 Copilot = Produktivitäts-Assistent auf Mails/Docs/Teams. Integration existiert, sind aber verschiedene Produkte. *Gegenmittel: In Discovery klar trennen — „Copilot auf Daten oder Copilot auf Dokumenten?"*
- **Fabric für klassisches ML halten** — Data Science Workload kann Notebooks, aber kein MLOps-Full-Stack. *Gegenmittel: [[Azure Machine Learning]] für MLOps, Fabric nur für Data-Exploration + AutoML.*
- **Capacity-Spike bei Copilot-Nutzung unterschätzen** — Copilot-Queries ziehen CUs aus der gleichen Capacity wie Reports. *Gegenmittel: Separate Capacity für Copilot-Traffic oder Auto-Scale aktivieren.*
- **Shared Tenant heißt nicht Shared Access** — OneLake ist tenant-weit; Workspace-Permissions steuern Zugriff. *Gegenmittel: OneLake Security Access Control Model (Preview) beobachten; Workspace-Governance früh aufsetzen.*

---

## Abgrenzung & Wettbewerb

### Microsoft-intern

| Frage-Situation | Fabric | Alternative MS-Produkt |
|-----------------|--------|------------------------|
| *„Wir wollen Lakehouse + BI konsolidieren"* | ✅ Fabric (das ist der Use-Case) | — |
| *„Wir brauchen RAG auf App-Daten"* | ❌ nicht das Tool | ✅ [[Azure Cosmos DB for AI]] oder [[Azure AI Search]] |
| *„Wir brauchen einen Agent, der auf Dokumente/Mails antwortet"* | ❌ nein | ✅ [[Microsoft 365 Copilot]] + [[Copilot Studio]] |
| *„Wir brauchen eine AI-Agent-Plattform mit Modellen, Evaluations, Tools"* | ❌ nicht die Ebene | ✅ [[Microsoft Foundry]] |
| *„Klassisches Machine Learning / MLOps-Pipelines"* | ⚠️ nur teilweise (AutoML, Notebooks) | ✅ [[Azure Machine Learning]] für Full-MLOps |
| *„Chat-Interface auf BI-Daten mit Power-BI-Semantic-Model-Respekt"* | ✅ Fabric Data Agent (das ist der USP) | — |

**Faustregel:** Fabric ist für **Analytics + BI**, nicht für Agents oder App-Daten-RAG. Nicht missverstehen als „MS-Daten-Platform-für-alles".

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | What is Microsoft Fabric | https://learn.microsoft.com/en-us/fabric/fundamentals/microsoft-fabric-overview | 2026-04-22 |
| Docs | OneLake Overview | https://learn.microsoft.com/en-us/fabric/onelake/onelake-overview | 2026-04-22 |
| Docs | OneLake Shortcuts | https://learn.microsoft.com/en-us/fabric/onelake/onelake-shortcuts | 2026-04-22 |
| Docs | Fabric Data Agent Concept | https://learn.microsoft.com/en-us/fabric/data-science/concept-data-agent | 2026-04-22 |
| Docs | Region Availability | https://learn.microsoft.com/en-us/fabric/admin/region-availability | 2026-04-22 |
| Docs | Fabric Licenses | https://learn.microsoft.com/en-us/fabric/enterprise/licenses | 2026-04-22 |
| Docs | Fabric Copilot Capacity | https://learn.microsoft.com/en-us/fabric/enterprise/fabric-copilot-capacity | 2026-04-22 |
| Docs | EU Data Boundary | https://learn.microsoft.com/en-us/privacy/eudb/eu-data-boundary-learn | 2026-04-22 |
| Pricing | Fabric Pricing | https://azure.microsoft.com/en-us/pricing/details/microsoft-fabric/ | 2026-04-22 |
| Estimator | Fabric Capacity Estimator | https://www.microsoft.com/en-us/microsoft-fabric/capacity-estimator | 2026-04-22 |
| Blog | Fabric Monthly Feature Summary | https://blog.fabric.microsoft.com/ | 2026-04-22 |
| Blog | Copilot/AI jetzt auf allen F-SKUs (Apr 2025) | https://blog.fabric.microsoft.com/en/blog/copilot-and-ai-capabilities-now-accessible-to-all-paid-skus-in-microsoft-fabric | 2026-04-22 |
| Blog | OneLake MCP GA | https://blog.fabric.microsoft.com/en-us/blog/give-your-ai-agent-the-keys-to-onelake-onelake-mcp-generally-available | 2026-04-22 |

### Events zum Beobachten

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Build 2026 | Mai 2026 | Data-Agent-Enhancements, MCP-Erweiterungen |
| Microsoft Ignite 2026 | Nov 2026 | nächste Fabric-Gen-Features, ggf. Pricing-Updates |
| Fabric Monthly Summary | jeden Monat | Workload-Updates via blog.fabric.microsoft.com |

---

## UNCLEAR / TODO

1. **Data-Agent-F64-Schwelle**: Wann (wenn überhaupt) für kleinere Capacities geöffnet? Ankündigung beobachten.
2. **OneLake Security Access Control Model** aktuell Preview — GA-Datum unklar.
3. **M365-Copilot-Integration der Data Agents**: Preview-Status vs. GA pro Konnektor-Typ (Lakehouse/Warehouse/Semantic Model) — unterschiedliche Reifegrade, vor Kundeneinsatz verifizieren.
4. **Pricing Schweiz konkret**: USD→CHF-Rechnung und CH-Regional-Premium im Vergleich zu West Europe nicht verifiziert — via Azure Calculator pro Kunde durchrechnen.

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive Fabric: OneLake + Data Agents bundled, 8 Workloads, F-SKU-Pricing, SMB-Ehrlichkeit (nur BI-Kunden) | https://learn.microsoft.com/en-us/fabric/ |
| 2026-04-22 | Hongyu | Initial Stub (Tier 3 Awareness — bündelt OneLake + Fabric Data Agents) | Arbeitsauftrag |
