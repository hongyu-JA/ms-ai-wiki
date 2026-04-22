---
watch: standard
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Dataverse, Common Data Service, CDS, Power Platform Dataverse]
moc:
  - "[[Microsoft MOC]]"
  - "[[Data & Knowledge MOC]]"
---

# Dataverse

*Der **strukturierte, governed Daten-Store** der Power Platform — eine managed Cloud-DB, die gleichzeitig Schema, Business-Logik und feingranulare Security (Business Units, Row-/Column-Level) erzwingt. Für SMB-Agents der **Default-State-Store in [[Copilot Studio]]** und die Brücke zu Dynamics 365. Wer die Power Platform schon hat, baut Knowledge- und Agent-State hier — wer nicht, sollte bewusst abwägen gegen [[Azure Cosmos DB for AI]] / SQL.*

> **Analogie:** Was Salesforce Data Cloud für Salesforce-Agenten ist, ist Dataverse für Copilot-Studio-Agents — eine opinionated Business-DB mit eingebautem RBAC, Plugins und Knowledge-Indexierung. Kein generisches „SQL in der Cloud", sondern eine Plattform-DB.

---

## Einsatz

### Job-to-be-done

When I für einen Copilot-Studio-Agent **strukturierte Geschäftsdaten** (Leads, Tickets, Kundenobjekte, Agent-Thread-State) persistieren will, I want to **nicht** eine eigene Datenbank + eigenes RBAC + eigenen Konnektor bauen, sondern eine managed Tabelle anlegen, die der Agent via MCP oder Knowledge-Source liest/schreibt und die identisch in Power Apps / Dynamics 365 sichtbar ist, so I can **eine** Datenquelle für Business-Apps und Agents nutzen und Sync-Probleme vermeiden.

### Trigger-Signale

- *„Unsere Power-Platform-Apps schreiben in Dataverse — der Agent sollte auch lesen/schreiben."*
- *„Wir haben Dynamics 365 Sales/Service, wo leben Agent-Daten am besten?"*
- *„Copilot Studio soll Kundendaten abfragen — was ist der einfachste Weg?"*
- *„Wir brauchen Row-Level-Security für Agent-Antworten (Manager sieht alle Tickets, Support nur eigene Region)."*
- *„Kann der Agent einen Datensatz anlegen, ohne dass wir einen Custom-Connector bauen?"*

### Einsatz-Szenarien

1. **Knowledge Source für Copilot-Studio-Agent** — Dataverse-Tabellen (bis 15/Source) als durchsuchbare Knowledge. Synonyms + Glossary verbessern Generative Orchestration. Default-Pfad für Low-Code-Agents mit strukturierten Daten.
2. **Agent-State + CRUD via [[Dataverse MCP Server]]** — MAF-/Claude-/VS-Code-Agents rufen `create_record`, `read_query`, `update_record`, `Search` tenant-weit. URL: `https://{org}.crm.dynamics.com/api/mcp`. Seit Preview 2025, öffentlich nutzbar 2026.
3. **Dynamics-365-Brücke** — Wenn Kunde D365 Sales/Service/Customer Insights hat, liegen diese Daten **bereits** in Dataverse. Agent-Zugriff ohne ETL, direkt via Web API + vorhandenen Security-Rollen.
4. **Structured-RAG statt Vector-Search** — Für hochstrukturierte Business-Daten (Verträge mit Feldern, Ticket-Status, Produkt-Katalog) liefert Dataverse-Search + Synonyms oft präzisere Grounding-Ergebnisse als generische Vector-RAG auf dem gleichen Korpus.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Mindestens **1 Power Apps Per-User** ($20/User/Mo) oder Per-App ($5) im Tenant, damit Dataverse-Environment produktiv wird. **Copilot Studio** ($200/Tenant/Mo für 25'000 Messages) enthält Dataverse-Nutzung für Agent-Szenarien. D365-Lizenzen (Sales/Service) enthalten Dataverse ebenfalls. M365-Lizenzen geben nur eingeschränkten Dataverse-Zugriff (nur für First-Party-Apps wie Project) |
| **Tenant / Infrastruktur** | Power-Platform-Environment in gewünschter Region. **Dataverse Search muss ON sein** für Knowledge-Source in Copilot Studio |
| **Skills / Rollen** | Power Platform Admin oder Environment Admin für Provisioning. Security-Rollen-Design braucht jemand mit Erfahrung — Business Units + Teams sind nicht trivial. Plugins = C#-Entwickler (Python/JS nur via Webhooks → Azure Functions) |
| **Compliance-Rahmen** | MS DPA deckt Dataverse ab. EU-Residency verfügbar (West Europe, North Europe, France, Germany, Switzerland → URL `crm17.dynamics.com`). Switzerland North explizit für CH-Kunden mit Bankgeheimnis-/FINMA-Anforderungen |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | 0.5–1 Tag für ersten Agent-Knowledge-Source (Environment + 2–3 Tabellen + Security-Rolle). 3–7 Tage für produktives Agent-Setup mit MCP + Plugins + Business-Units-Design |
| **Laufende Lizenzkosten** | **Base-Entitlement** pro Tenant: 10 GB DB + 20 GB File + 2 GB Log. Pro Per-User-Lizenz +250 MB DB. **Add-on-Pricing (2026)**: ~$40/GB/Mo Database-Capacity, ~$2/GB/Mo File, ~$10/GB/Mo Log. Pay-as-you-go via Azure-Subscription möglich |
| **Laufender Betrieb** | 0.5–1 Tag/Monat für Capacity-Monitoring + Security-Rollen-Drift. Steigt bei hoher Write-Last (Indexing) oder sehr restriktiver Business-Unit-Hierarchie |

### Empfehlung

**Status: 🟢 Empfehlen, wenn Power Platform / Dynamics 365 im Stack — 🟡 Abwägen sonst.**

Für SMB-Kunden mit **existierendem Copilot Studio / D365** ist Dataverse der Pfad des geringsten Widerstands: Agent-Knowledge + Agent-State in einem Store, Security kommt gratis, MCP-Server out-of-the-box. Für Green-Field-Projekte ohne Power-Platform-Bindung ist [[Azure Cosmos DB for AI]] günstiger/flexibler, Azure SQL performanter — Dataverse „zahlt sich erst aus", wenn man die Power-Platform-Integrationen nutzt.

**Nächster Schritt für Journai:** **Dataverse-MCP-Referenz-Setup** dokumentieren (Aktivieren + Client-Konfig für Claude Code / VS Code / Copilot Studio + Capacity-Monitoring-Check). Zusätzlich **Security-Rollen-Template** bauen für typisches SMB-Szenario (Sales-Role / Support-Role / Admin-Role mit Column-Level-Security für PII-Felder) — Berater kann bei Kunden in 2h produktive Baseline setzen.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | **GA** (Kern seit 2016 als Common Data Service, Rebrand zu Dataverse Nov 2020). Neuere Features wie **Modernized Business Units**, **Virtual Tables**, **Dataverse MCP Server** (Preview → öffentlich 2026), **Search-Unterstützung für Multiline/File-Columns** (Preview April 2026) |
| **GA-Datum** | Core GA 2016. Rolling Feature-Releases via Power Platform Release Waves (1 und 2 pro Jahr) |
| **Standalone-Preis (USD)** | **Capacity-basiert**: ~$40/GB/Mo Database, ~$2/GB/Mo File, ~$10/GB/Mo Log (Add-on). **Zugangs-Lizenz**: Per-App $5/User/Mo, Per-User $20/User/Mo Power Apps. Dataverse-MCP-Tools werden seit 15.12.2025 **außerhalb** Copilot Studio per Copilot-Credit abgerechnet (Search = Tenant-Grounding-Rate; andere Tools = Basic-Generative-AI-Rate pro 10 Responses) |
| **Standalone-Preis (EUR)** | Nicht separat publiziert; MS-typische EUR-Parität ~1:1 zu USD |
| **Lizenz-Bundle** | In **Power Apps Per-User/Per-App**, **Power Automate Premium**, **Copilot Studio**, **Dynamics 365** (Sales, Service, Marketing, F&O, Customer Insights) enthalten. **NICHT** in M365 E3/E5/Copilot enthalten (außer eingeschränkter Dataverse-Service-Plan für Project) |
| **Voraussetzung** | Entra-Tenant, Power-Platform-Environment, mindestens 1 kostenpflichtige Power-Platform- oder D365-Lizenz für produktive DB-Erstellung |
| **Region-Verfügbarkeit** | Global. EU: West Europe (`crm4`), North Europe, France (`crm12`), Germany (`crm16`), Norway (`crm19`), **Switzerland (`crm17.dynamics.com`)**. Data-Residency pro Environment wählbar, aber **nach Anlage unveränderlich** — Region-Wahl ist kritischer Early-Entscheid |
| **CSP-Promo / Discounts** | Über Partner/CSP verfügbar, Enterprise-Agreements mit Staffeln. Developer-Plan (Dev-Environment) kostenfrei für Einzelnutzer |
| **Hidden Costs** | (1) **Dataverse Search Indexes** zählen auf Database-Capacity — `DataverseSearch`-Tabelle (früher `RelevanceSearch`) kann bei aktivierter Copilot-Knowledge-Source erheblich wachsen. (2) **Long-term Retention / Audit-Logs** füllen Log-Capacity schnell. (3) **Plugins / Webhooks** können indirekt Azure-Kosten verursachen. (4) **Overage-Enforcement**: Bei Deficit in einer Capacity-Kategorie werden Operationen wie *Create Environment*, *Copy Environment*, *Restore* gesperrt |
| **Upgrade-Pfad** | Bestehende CDS-Environments wurden automatisch auf Dataverse migriert. Legacy-Storage-Modell → neues Kapazitäts-Modell (Database/File/Log getrennt) für Kunden mit April-2019+-Käufen |

---

## Kernkonzept

### Was es im Kern ist

Dataverse ist Microsofts Wette, dass Business-Daten **nicht** generisch sein sollten. Wo Azure SQL oder Cosmos DB „gib mir Schema und Storage, Rest machst du selbst" anbieten, liefert Dataverse einen **opinionated Stack**: Tabellen mit semantischem Typ-System (Choice, Lookup, Owner, Customer), Business Rules (Formel-Validierung), Workflows, Plugins (C#-Server-Code bei CRUD-Events), Change Tracking, Audit-Log, **rollenbasierte Security mit Business-Unit-Hierarchie**, und eine Dual-Interface (REST Web API + SDK für .NET) — alles aus einer Hand. Das Design-Prinzip: **Daten tragen Governance mit sich**, nicht die Apps, die darauf zugreifen.

Unter der Haube: **Azure SQL** für strukturierte Daten, **Azure Blob** für File-/Image-Columns, **Elastic Tables** (Cosmos DB-basiert) für High-Scale-Szenarien, **Dataverse Search** (Azure-AI-Search-basiert) für Volltext und Knowledge-Grounding. Microsoft abstrahiert das vollständig — Kunden sehen „Tabellen", nicht die Backend-Technologie. Der Preis dieser Abstraktion: **keine direkten SQL-Queries**, keine eigenen Indexe-Strategien, keine Custom-Sharding. Man arbeitet über Web API (OData), FetchXML, Organization Service oder die neuen TDS-Endpoints (SQL-like Read-Only-Zugriff).

Für Agents hat Dataverse 2025/2026 einen strategischen Boost bekommen: Der **Dataverse MCP Server** (`api/mcp`) macht jede Tabelle eines Environments zum **standardisierten Tool-Set** für jeden MCP-Client — Copilot Studio, MAF-Agents, Claude Code, VS Code GitHub Copilot. Damit wird Dataverse zum **Default-State-Backend für SMB-Copilot-Studio-Deployments**, weil es in exakt dem Bundle enthalten ist, das Copilot-Studio-Lizenzen mitbringen. Gleichzeitig kann es als **Knowledge-Source** (max. 15 Tables, inkl. Synonyms/Glossary für Generative Orchestration) direkt Grounding für Agent-Antworten liefern — kein separater Vector-Store nötig für strukturierte Daten.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| **Agent / Client** | Copilot Studio, MAF, Claude Code, VS Code, Power Apps, D365-UI | Mehrere |
| **Integration-Protokoll** | MCP (`/api/mcp`), Web API (OData v4), SDK .NET, FetchXML | Dataverse |
| **Platform-Logik** | Organization Service (Message-Bus), Plugins (C#), Business Rules, Workflows, Dataverse Search | Dataverse |
| **Security** | Business Units, Security Roles, Row-/Column-Level, Teams, [[Microsoft Entra Suite]] | Dataverse + Entra |
| **Storage-Backend** | Azure SQL (strukturiert), Azure Blob (File/Image), Elastic Tables (Cosmos DB), Search-Index | Azure (verborgen) |

### Kern-Fähigkeiten

#### Tabellen + Typ-System + Relationships

Dataverse-Tabellen tragen semantisches Typ-Wissen: `Choice` (Option-Set), `Lookup` (FK), `Customer` (polymorpher Lookup Account/Contact), `Owner` (Security-relevant), `File`/`Image` (Blob-Storage), `MemoType` (Multiline-Text). Relationships sind **First-Class**: 1:N mit Cascade-Behavior (Cascade-Delete, Reparent, Reassign), N:N mit auto-generierter Intersect-Tabelle. Business Rules (Formel-basiert) validieren Cross-Column-Abhängigkeiten ohne Code.

Grenze: Keine echten Views-mit-Joins (Query via FetchXML oder OData), keine Stored Procedures (Logik via Plugins in C#).

#### Security-Model: Business Units + Rollen + Row/Column-Level

Der Kern-USP gegenüber generischen DBs. **Vier Schichten**, additiv:

1. **Business Units** — hierarchische Security-Boundaries. Jedes Environment hat Root-BU; Child-BUs für Segmentierung. Ownership-Modell: *Traditional* (User gehört zu einer BU) oder **Modernized Business Units** (Matrix — User kann in mehreren BUs arbeiten, Ownership pro Record setzbar).
2. **Security Roles** — Bündel von Privilegien (Create/Read/Write/Delete/Append/AppendTo/Assign/Share) × Table × Access-Level (Organization/BU/BU+Child/User). User kann mehrere Rollen haben — **immer kumulativ** („größte Rechte gewinnen"; einmal freigegeben kann nicht einzeln zurückgezogen werden).
3. **Row-Level via Ownership/Sharing** — User-/Team-owned Records mit tierten Zugriffs-Levels. Sharing einzeln möglich, aber Performance-Kosten → Teams/Access-Teams bevorzugen.
4. **Column-Level-Security** — Column-Security-Profiles (per Column: Create/Update/Read), gekoppelt an User oder Team. **Kritisch für Copilot-Ausgaben**: PII-Columns (Gehalt, Geburtsdatum, SSN) können Agents selektiv entzogen werden, ohne ganze Records zu sperren.

**Für Agents entscheidend**: Der Agent agiert mit der Identity des authentifizierten Users (Delegated) oder einer Service-Identity — **Row-Level-Security wird transparent durchgesetzt**. Ein Support-Agent sieht nur Tickets seiner BU, ohne dass Entwickler das explizit coden müssen. Das ist der Haupt-Unterschied zu Cosmos DB / SQL Server.

#### Web API (OData v4) + SDK .NET + MCP

Drei Interface-Layer über dem **Organization Service** (dem internen Message-Bus):

- **Web API** (`{org}.api.crm.dynamics.com/api/data/v9.2/`) — REST, OData v4, `$filter`/`$select`/`$expand`/`$top`, Batch via `$batch`. Sprach-unabhängig, Python-SDK verfügbar.
- **SDK für .NET** (`Microsoft.Xrm.Sdk`) — Strongly-typed C#-Client, direkt gegen Organization Service. Nötig für Plugin-Entwicklung.
- **Dataverse MCP Server** (`{org}.crm.dynamics.com/api/mcp`) — **Neu**. Exposes Tools: `create_record`, `read_query`, `update_record`, `describe_table`, `list_tables`, `Create Table`, `Delete Record`, `Search`, `Fetch`. Aktivierbar per Environment, Client-Whitelist konfigurierbar. Kostet Copilot-Credits außerhalb Copilot Studio (seit 15.12.2025), innerhalb Copilot Studio enthalten.

Grenze: **GraphQL nicht supported**. FetchXML ist proprietäre XML-Query-Sprache für komplexe Hierarchie-Queries (legacy, aber noch in aktivem Einsatz).

#### Knowledge Source für Copilot Studio

Dataverse-Tabellen können direkt als Grounding-Quelle in Copilot Studio eingebunden werden. **Harte Limits (Stand April 2026)**:

- **Max. 15 Tables pro Knowledge Source**
- Synonyms + Glossary-Terms pro Column/Table für AI-Orchestration (bis zu 15 Min. Sync-Delay bei Änderungen)
- **Dataverse Search muss im Environment aktiv sein** — wird typischerweise auf On/Default gesetzt für produktive Environments
- Preview April 2026: Multiline-Text- und File-Column-Support für unstructured reasoning (vorher nur strukturierte Columns)
- Virtual Tables: Nur F&O-Data-Provider supported als Knowledge-Source

Indexing verbraucht Database-Capacity (sichtbar als `DataverseSearch`-Tabelle). Full re-index nach Off/On-Toggle kann Stunden bis Tage dauern.

*{TODO: „500 Knowledge Objects pro Agent"-Limit aus Arbeitsauftrag — konnte in den MS-Docs 2026-04 nicht verifiziert werden; möglicherweise Copilot-Studio-agentweit summierbar über Sources, inkl. File-/Web-Sources. In Copilot-Studio-Release-Notes Q2 2026 erneut prüfen.}*

#### Plugins, Workflows, Business Rules (Server-Side-Logik)

- **Business Rules** — No-Code-Formel-Validierung, läuft in allen Clients einheitlich
- **Workflows** — automatisierte Prozesse (Realtime oder Async), tendenziell ersetzt durch Power Automate
- **Plugins** — C#-Code, registriert auf CRUD-Events einer Tabelle (Pre-/Post-Validation, Pre-/Post-Operation). Führt Server-Side aus, kann eigene Org-Service-Calls machen, strikte 2-Min-Laufzeit. **Keine Python/JS-Plugins** — einziger Workaround: Webhook → Azure Functions.
- **Custom APIs** — deklarativ definierte Messages (wie Plugin-Events), direkt als Web-API-Endpoint nutzbar

Für Agents relevant: Plugins können Validation vor dem Write des Agents erzwingen („Agent darf Status nur auf X setzen, wenn Owner = Agent-Identity").

#### Change Tracking + Virtual Tables

- **Change Tracking** (`?$deltatoken=...`) — Delta-Query-Pattern wie in [[Microsoft Graph]], für Sync in externe Systeme. Subscriptions über Power Automate oder Service-Bus
- **Virtual Tables** — Externe Datenquellen (SQL, OData, Custom-Provider) **erscheinen wie Dataverse-Tabellen**. Keine Daten-Kopie, Live-Reads. Verwendung: Legacy-ERP-Integration, F&O-Verbindung, SharePoint-Listen als Tabelle. Write-Support variiert pro Provider

### Typischer Workflow

1. **Environment-Setup (Admin)** — Power-Platform-Environment in Ziel-Region provisionieren (Region **nachträglich nicht änderbar**!), Dataverse-DB aktivieren, Dataverse Search = On. 15–30 Min.
2. **Tabellen-Modellierung (Maker)** — Via Power Apps Maker Portal Tabellen anlegen, Columns definieren, Relationships, Business Rules. Schema-First, keine Migrations im Entwickler-Sinn.
3. **Security-Design (Admin + Architekt)** — Business-Units-Hierarchie, Security-Rollen (idealerweise aus Templates), Column-Security-Profiles für PII. Mit Entra-Sicherheitsgruppen verknüpfen für automatische Role-Assignment.
4. **Agent-Integration (Builder)** — (a) Copilot Studio: Knowledge-Source hinzufügen, Synonyms/Glossary pflegen. (b) MCP: Environment → Settings → Features → *Model Context Protocol Server* = On, Client-URL konfigurieren, Client-Authentifizierung via Entra.
5. **Deploy/Betrieb** — Solutions-Pakete für Schema-Transfer zwischen Environments (Dev/Test/Prod). Capacity-Monitoring im Power Platform Admin Center wöchentlich (Email-Alerts bei 15%/5% Remaining).

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai intern)** | OData-Basics, MCP-Client-Config, SQL/FetchXML zum Debuggen. Für Plugin-Entwicklung: C# + Xrm SDK. Python via Web API ausreichend für Read-Scenarios |
| **Admin (beim Kunden)** | Power Platform Admin Center + Entra-Admin (Gruppen, App-Registration). Solides Verständnis Business-Units + Security-Rollen — das ist die **größte Hürde**, Fehler führen zu Silent-Data-Leakage oder Zugriffsverweigerung |
| **End-User (beim Kunden)** | Nichts — Dataverse ist transparent via Copilot-Studio-UI / Teams-Chat |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Kein Raw-SQL-Zugriff für Writes** — nur OData/FetchXML/SDK. TDS-Endpoint ist Read-only. | Für komplexe analytische Queries: Synapse-Link / Azure Data Lake-Export, dann SQL darauf |
| **Plugins ausschließlich C#** — keine Python/JS Server-Side-Logik | Webhooks → Azure Functions (Python/Node), zusätzliche Latenz + Operational Complexity |
| **15 Tables pro Knowledge Source in Copilot Studio** — restriktiv für breite Domain-Models | Mehrere Knowledge-Sources pro Agent, oder aggregierte „View-Tables" via Virtual Tables |
| **Region nicht änderbar nach Anlage** — falsche Wahl = Re-Environment + Datenmigration | Region-Entscheid **vor** Produktiv-Setup mit Kunde klären |
| **Column-Level-Security hat Performance-Kosten** — nicht exzessiv nutzen | Sensible Daten in separate Tabelle mit eigener Security-Rolle trennen |
| **Keine native Vector-Search** — Dataverse Search ist keyword-/semantisch (Azure-AI-Search-basiert), kein eigenständiger Embedding-Store | Für True Vector-RAG: [[Azure AI Search]] oder Foundry IQ parallel |
| **Capacity-Preise deutlich höher als Raw-Azure** — ~$40/GB/Mo Database vs. ~$0.15/GB/Mo Azure SQL Hyperscale | Nur die Daten in Dataverse, die Governance/Integration brauchen; Rest in Cosmos/SQL |

### Typische Fallstricke im Einsatz

- **Region-Entscheid zu spät getroffen** — CH-Kunde wählt „West Europe" (Niederlande) statt `crm17` Switzerland; bei FINMA/Bankgeheimnis-Audit Problem. **Gegenmittel**: Bei Erst-Meeting mit IT Region + Data-Residency-Policy klären, `crm17.dynamics.com` für CH-only dokumentieren.
- **Security-Rollen „zur Sicherheit" großzügig vergeben** — Admin vergibt Organization-Level-Read an alle „damit nichts blockiert ist". Agent antwortet dann mit Daten, die User gar nicht sehen sollte. DSGVO-Problem. **Gegenmittel**: Security-Rollen auf BU-Level als Default, Test-User mit Minimal-Rolle im PoC verifizieren.
- **Capacity-Surprise durch `DataverseSearch`-Indexe** — Knowledge-Source in Copilot Studio aktiviert, nach 4 Wochen ist Database-Capacity-Limit überschritten. Search-Index ist unsichtbar bis man Licensing-Report öffnet. **Gegenmittel**: Monthly Capacity-Review im Admin Center, Search-Consumption-Tab im Blick, nur benötigte Columns als Searchable markieren.
- **Power-Platform-Lizenz-Matrix unterschätzt** — Kunde denkt „M365 E5 reicht", tatsächlich ist Dataverse in M365 stark beschränkt (nur für Project + First-Party-Apps). **Gegenmittel**: Lizenz-Check vor Produkt-Empfehlung; Copilot-Studio-Lizenz oder Power-Apps-Per-User als Baseline einpreisen.
- **MCP-Server als „kostenlos" verkauft** — Seit 15.12.2025: Dataverse-MCP-Tools werden **außerhalb** Copilot Studio per Copilot-Credit abgerechnet. Bei hoher Nutzung durch Claude-Code-/VS-Code-Agents skaliert das. **Gegenmittel**: Bei MAF-/externen-Client-Szenarien Credit-Verbrauch monitoren; D365-Premium- oder M365-Copilot-USL-Kunden sind ausgenommen für D365-Daten.
- **Modernized Business Units nicht eingeschaltet** — Kunde mit Matrix-Org (User arbeitet für mehrere Regionen) kämpft mit klassischem BU-Modell → zuviel Sharing-Hacks. **Gegenmittel**: Vor Security-Design prüfen, ob Matrix nötig ist; Feature-Switch `EnableOwnershipAcrossBusinessUnits` aktivieren.
- **Solution-basierter Transfer zwischen Environments übersehen** — Team codet direkt in Prod-Environment, keine Dev/Test-Pipeline. Beim nächsten Release Chaos. **Gegenmittel**: Solutions + CI/CD via Power Platform Pipelines oder ALM Accelerator von Tag 1.

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| [[Copilot Studio]] | Knowledge Source + Agent-State + MCP-Tool-Integration | ✅ GA, Default-Integration | 15-Tables-Limit pro Knowledge-Source; Synonyms-Pflege manuell |
| [[Dataverse MCP Server]] | MCP-Bridge für jeden MCP-Client (MAF, Claude Code, VS Code, Copilot CLI) | ✅ Preview → öffentlich 2026, produktiv nutzbar | Copilot-Credit-Abrechnung außerhalb Copilot Studio seit 15.12.2025 |
| [[Microsoft Agent Framework]] | MAF-Agents greifen via MCP oder direktem SDK auf Dataverse zu | ✅ unterstützt | Auth via Entra Agent ID + OBO-Pattern noch nicht vollständig generisch |
| [[Power Automate]] | Trigger (When row added/modified/deleted) + Actions (Create/Update/Delete Row, List Rows) | ✅ GA, Core-Integration | Premium-Lizenz nötig für Dataverse-Connector |
| Dynamics 365 Sales/Service/Customer Insights | Daten liegen **nativ** in Dataverse — keine Integration nötig, sondern *gleicher Store* | ✅ GA | Security-Rollen aus D365 müssen mit Agent-Rollen abgestimmt werden |
| [[Microsoft Graph]] | Indirekt via Entra-User-Lookup; **keine** Graph-Endpoints für Dataverse-Daten (Power Platform hat eigenen API-Layer) | 🟡 Nicht nahtlos | Dev muss zwei SDKs parallel benutzen |
| [[Microsoft 365 Copilot]] | Über „Build business understanding with Dataverse" → Dataverse als Grounding-Quelle in M365 Copilot | ✅ GA 2026 | Setup in Copilot-Admin-Center, pro Tabelle freischalten |
| [[Microsoft Purview]] | Sensitivity-Labels, DLP, Data-Map-Integration | 🟡 partiell — Labels bei File-Columns, DLP-Connector-Policies für Power Platform | Row-Level-Label-Propagation limitiert |
| [[Microsoft Fabric]] | Synapse Link / Azure Synapse Link for Dataverse — Near-realtime-Replikation in OneLake/Fabric | ✅ GA | Nur Reads; Fabric als Analytics-Layer, nicht Write-Back |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| n8n / Zapier / Make | Low-Code-Workflows mit Dataverse-REST-Calls | ✅ Standard-Nodes verfügbar | Auth-Setup umständlicher als für Graph |
| Salesforce | Bidirektional via D365 Customer Insights oder via Logic Apps | 🟡 kein natives Out-of-the-Box | Virtual Tables als Leseweg möglich |
| SAP | Virtual Tables mit SAP-Data-Provider + SAP ERP-Connector | 🟡 Custom-Entwicklung | F&O-integrierter Pfad wenn D365 F&O vorhanden |
| Claude Desktop / Claude Code | Via Dataverse MCP Server direkt verbindbar | ✅ 2026 GA | Credits für MCP-Tool-Calls außerhalb Copilot Studio |

### APIs / Protokolle

- **Web API (REST + OData v4)** — primärer API-Layer, URL `{org}.api.crm.dynamics.com/api/data/v9.2/`
- **MCP** — `{org}.crm.dynamics.com/api/mcp` (neu 2026)
- **SDK für .NET** — `Microsoft.Xrm.Sdk`, `Microsoft.PowerPlatform.Dataverse.Client`
- **Python-SDK** — `dataverse-sdk-python` (offiziell, neuer, weniger Features als .NET)
- **FetchXML** — proprietäre XML-Query-Sprache (legacy, aber für komplexe Queries weiter nötig)
- **TDS-Endpoint (Read-only SQL)** — für BI-Tools, Power BI, SSMS. Keine Writes.
- **GraphQL** — **nicht** supported
- **Change Notifications** — via Power Automate-Trigger oder Service-Bus-Integration

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | Pro Environment wählbar, **nach Anlage unveränderlich**. EU-Regionen: West Europe, North Europe, France, Germany, Norway, **Switzerland North** (`crm17.dynamics.com`). Daten inkl. Backups bleiben in gewählter Region für Customer Data. System-Generated Logs folgen EUDB-Framework analog zu M365 |
| **Prompts & Outputs** | Dataverse-Writes = Customer Data, werden **nicht** für Modell-Training verwendet. Agent-Interaktionen via Copilot Studio fallen unter Copilot-Studio-Audit (separat dokumentiert) |
| **Data Processing Addendum (DPA)** | Dataverse vom MS DPA abgedeckt (als Teil von Power Platform / Dynamics 365). Keine separate Anlage nötig |
| **EU-AI-Act-Klassifizierung** | Dataverse selbst: **N/A** (Daten-Store, kein AI-System). Bei Nutzung als Knowledge-Source für Copilot: Klassifizierung folgt dem AI-System (Copilot = Limited Risk). High-Risk-Use-Cases (HR-Entscheidungen, Credit-Scoring) machen die Anwendung High-Risk, nicht Dataverse |

### Microsoft-Compliance-Stack

- **[[Microsoft Entra Suite]]** — App-Registration für MCP/Web-API-Clients, Conditional Access kann Token-Issuance blocken. Entra-Gruppen → Dataverse-Teams-Mapping für skalierbare Role-Assignment
- **[[Microsoft Purview]]** — Audit-Log-Events für alle CRUD-Operationen (einstellbar pro Tabelle). Sensitivity-Labels an File-Columns. DLP-Policies (Connector-basiert) über Power Platform Admin Center
- **Customer Lockbox + Customer Key** — für Enterprise-Kunden mit Zero-Trust-Anforderungen verfügbar
- **Compliance Manager** — Dataverse-Assessments verfügbar (ISO 27001, SOC 2, HIPAA, FedRAMP)

**Was der Kunde konfigurieren muss:**

1. Audit-Log pro Tabelle aktivieren (default Off!) — DSGVO-Rechenschaftspflicht
2. Long-term Retention einstellen für Audit-Daten (Log-Capacity beachten)
3. Column-Security-Profiles für PII-Columns definieren
4. DLP-Policies im Admin Center für Connectors (z.B. kein Business-Data → Consumer-Connector)

### Bekannte Compliance-Lücken

- **Switzerland North nicht automatisch = Bankgeheimnis-konform** — CH-Kunden mit FINMA-Anforderungen brauchen zusätzlich vertragliche Addenda + ggf. Customer Key
- **Plugin-Code läuft in Sandbox ohne Purview-Integration** — Plugin-interne Daten-Flows sind „Blind Spots" für Data-Map
- **MCP-Server-Aktivität in Standard-Audit-Log noch limitiert** (April 2026) — detaillierte Tool-Call-Logs über Copilot-Studio-Analytics, nicht Dataverse-Audit; für Dataverse-MCP-Aufrufe aus externen Clients zusätzliche App-Insights-Integration erwägen
- **Cross-Environment-Data-Leakage via Solutions** — Solution-Export kann Daten (nicht nur Schema) mitziehen, wenn Config-Data aktiviert. Als DSGVO-Datentransfer behandeln

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Product Page | Dataverse Overview | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-intro | 2026-04-22 | Strategische Einordnung |
| Docs Hub | Dataverse Developer Docs | https://learn.microsoft.com/en-us/power-apps/developer/data-platform/ | 2026-04-22 | API/SDK-Updates |
| Web API | Web API Overview | https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/overview | 2026-04-22 | OData-Endpunkte |
| Security | Security Concepts in Dataverse | https://learn.microsoft.com/en-us/power-platform/admin/wp-security-cds | 2026-04-22 | Business-Units/Rollen/Column-Security |
| Capacity | Dataverse Capacity Storage | https://learn.microsoft.com/en-us/power-platform/admin/capacity-storage | 2026-04-22 | Preis/GB, Limits, Overage |
| Pricing | Power Platform Licensing Overview | https://learn.microsoft.com/en-us/power-platform/admin/pricing-billing-skus | 2026-04-22 | Lizenz-Matrix |
| Regions | Power Platform Datacenter Regions | https://learn.microsoft.com/en-us/power-platform/admin/new-datacenter-regions | 2026-04-22 | EU-Availability, CH-Region |
| Copilot Studio Knowledge | Add Dataverse as Knowledge Source | https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-add-dataverse | 2026-04-22 | 15-Tables-Limit + Synonyms-Pflege |
| MCP Server | Connect to Dataverse with MCP | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-mcp | 2026-04-22 | MCP-Tools + URL-Format |
| MCP Config | Configure Dataverse MCP Server | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-mcp-disable | 2026-04-22 | Feature-Enable pro Environment |
| Search | Dataverse Search | https://learn.microsoft.com/en-us/power-apps/user/relevance-search-benefits | 2026-04-22 | Knowledge-Source-Voraussetzung |
| Release Plan | Power Platform 2026 Wave 1 | https://learn.microsoft.com/en-us/power-platform/release-plan/2026wave1/ | 2026-04-22 | Feature-Roadmap |
| Dev Blog | Power Platform Blog | https://www.microsoft.com/en-us/power-platform/blog/ | 2026-04-22 | Feature-Ankündigungen |
| Community | Power Platform Release Plans | https://releaseplans.microsoft.com | 2026-04-22 | Zukünftige Features |

### Secondary (Analysten & vertrauenswürdige Industrie)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| Directions on Microsoft | https://www.directionsonmicrosoft.com | 2026-04-22 | Lizenz-Analysen Power Platform |
| SAMexpert | https://samexpert.com | 2026-04-22 | Power-Apps/D365-Lizenz-Optimierung |
| Agent And Copilot | https://agentandcopilot.com | 2026-04-22 | Power-Platform-Agent-Trends |
| The Custom Engine (Microsoft MCS Blog) | https://microsoft.github.io/mcscatblog/ | 2026-04-22 | MCP-/Copilot-Studio-Praxis |

### Tertiary (Community / MVPs)

| Autor | Blog / Kanal | Zuletzt gesichtet | Warum relevant? |
|-------|--------------|-------------------|-----------------|
| Mark Smith (NZ365guy) | https://www.nz365guy.com | 2026-04-22 | Power Platform / Dataverse Deep-Dives |
| Priyesh Wagh | https://priyeshwagh777.com | 2026-04-22 | Plugins, Web API, C#-Patterns |

### Events / Konferenzen zum Beobachten

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Build 2026 | Mai 2026 | Dataverse-MCP-GA-Ankündigung, neue Knowledge-Source-Features |
| Microsoft Ignite 2026 | Nov 2026 | Release Wave 2 Features, Security-Model-Erweiterungen |
| Power Platform Community Conference (PPCC) 2026 | Q3 2026 | Architektur-Sessions, Release Wave 2 Deep-Dives |
| AI Tour Zürich 2026 | 29.04.2026 | CH-Region (`crm17`) Positionierung für EU-Compliance |

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive Dataverse: Knowledge-Objects-Limits, Security-Model, Agent-Integration, Pricing-Modell | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/ |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
