---
watch: standard
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Dataverse MCP, DV MCP, Power Platform MCP]
moc:
  - "[[Microsoft MOC]]"
  - "[[Data & Knowledge MOC]]"
---

# Dataverse MCP Server

*Ein von Microsoft gehosteter **remote MCP-Endpoint**, der jedes [[Dataverse]]-Environment als standardisiertes **Tool-Set** für beliebige MCP-Clients exponiert — [[Copilot Studio]], [[Microsoft Agent Framework]], VS Code GitHub Copilot, Copilot CLI, Claude Desktop / Claude Code. Eine Zeile Config, und der Agent kann Tables lesen, Records schreiben, Suchen absetzen und Schemata modifizieren — mit den **Security-Rollen des angemeldeten Users**. Für SMB-Copilot-Studio-Deployments der **Default-Pfad** zu Business-Daten; für externe MCP-Clients **credit-pflichtig** seit 15.12.2025.*

> **Analogie:** Was ein JDBC-Treiber für relationale DBs ist, ist der Dataverse MCP Server für Dataverse — ein standardisierter Protokoll-Adapter, der jeden MCP-fähigen Agent „plug-and-play" an eine Business-DB anschließt, ohne dass der Agent-Builder OData, FetchXML oder das .NET-SDK kennen muss.

---

## Einsatz

### Job-to-be-done

When I **einen Agent** ([[Microsoft Agent Framework]]-Python-Service, [[Copilot Studio]]-Low-Code, oder Claude Code lokal) **an Dataverse-Daten** anbinden will, I want to **keinen Custom-Connector** mit OData-Client, Auth-Handling und Schema-Discovery bauen müssen, sondern **einen MCP-Endpoint** anbinden, der Tabellen, CRUD-Operationen und Suche als **fertige Tools** ausliefert — inklusive Row-Level-Security via Entra-User-Token — so I can **in Minuten** statt Tagen eine produktive Agent-Dataverse-Verbindung haben.

### Trigger-Signale

- *„Unser MAF-Agent soll Leads in Dataverse lesen, qualifizieren und updaten."*
- *„Copilot Studio soll aus Dataverse Knowledge ziehen — welcher Weg ist der einfachste?"*
- *„Kann Claude Code direkt gegen unser Dynamics 365 Sales abfragen, ohne dass wir ein Connector-Projekt aufsetzen?"*
- *„Wir brauchen Row-Level-Security für Agent-Antworten, ohne dass wir sie im Code nachbauen."*
- *„Wie zählen Dataverse-Lookups in unseren Copilot-Credit-Verbrauch?"*

### Einsatz-Szenarien

1. **Copilot-Studio-Agent mit Dataverse-Knowledge + CRUD** — Agent-Builder fügt den Dataverse MCP Server als Tool in Copilot Studio hinzu (ein Klick), Agent kann Tabellen auflisten, Records lesen/anlegen/updaten. **Default-Architektur** für SMB mit Power-Platform-Stack, **kein Credit-Aufschlag** innerhalb Copilot Studio. Typische Kunden: Dynamics-365-Sales-/-Service-Kunden, die einen „Sales-Assistenten" oder „Support-Bot" schnell aufbauen wollen.
2. **MAF-Service-Agent mit Dataverse-Backend** — Produktiver Python/C#-Agent (z.B. als [[Azure Container Apps]]-Service), verbindet sich via `MCPStreamableHTTPTool` auf `https://{org}.crm.dynamics.com/api/mcp`. Authentifiziert sich als Service-Principal (App-Only) oder im OBO-Pattern als User. **Credit-pflichtig seit 15.12.2025** außerhalb Copilot Studio.
3. **Claude Code / VS Code Copilot als Dataverse-Dev-Tool** — Berater/Entwickler nutzt Claude Code mit `@microsoft/dataverse` npm-Proxy gegen Dev-Environment zum **Schema-Prototyping** („erzeuge Tabelle X mit Feldern Y/Z", „zeig mir alle Leads der letzten Woche"). Produktivitäts-Boost für Maker-Persona ohne Power-Apps-UI-Kenntnisse.
4. **Zero-Code-Data-Exploration für Fachbereiche** — Business-User mit Claude Desktop + Dataverse MCP macht natürlichsprachliche Queries („welche Verträge laufen in Q3 aus?"). Alternative zu Power-BI/Excel-Exports mit direkter Row-Level-Security — kein Export-Datensatz in E-Mail-Anhang.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | [[Dataverse]]-Environment im Tenant (Power Apps Per-User/Per-App, Copilot Studio, oder Dynamics 365). **Copilot-Studio-Usage** innerhalb Copilot Studio durch Copilot-Studio-Lizenz abgedeckt. **Außerhalb Copilot Studio** (MAF, Claude, VS Code) seit 15.12.2025 **Copilot-Credit-pflichtig** — außer bei **Dynamics 365 Premium** (Sales/Finance/Supply Chain/Customer Service Premium) oder **M365 Copilot USL** auf D365-Daten |
| **Tenant / Infrastruktur** | **Managed Environment** in Power Platform (unmanaged Environments unterstützen MCP-Server-Toggle nicht laut aktueller Doku). Dataverse Search für Search/Fetch-Tools empfohlen. Region folgt Dataverse-Environment |
| **Skills / Rollen** | **Power Platform Admin** für Enable + Client-Allowlist im Admin Center. **Entra-Admin** für App-Registration bei Remote-Endpoint-Pfad (sonst Tenant-Admin-Consent für Dataverse-CLI-App einmalig). Builder: MCP-Client-Config (JSON-Snippet) reicht |
| **Compliance-Rahmen** | Identisch zu Dataverse-Environment (DPA, Customer Data Location, Audit). **Switzerland North** via `crm17.dynamics.com` nutzbar — MCP-Endpoint folgt automatisch der Environment-Region, d.h. für CH-Kunden mit FINMA/Bankgeheimnis-Kontext sicher in CH gehosted (Environment **muss** vor Anlage in `crm17` platziert sein — Region nachträglich nicht änderbar) |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | **15 Min** für Enable + Copilot-Studio-Verbindung (1-Klick-Tool-Add). **30–60 Min** für Claude Code via `@microsoft/dataverse`-Proxy (Tenant-Admin-Consent + Client-Allowlist). **2–4 h** für Custom-Entra-App mit `mcp.tools`-Permission + MAF-Integration. **0.5–1 Tag** für produktives MAF-Agent-Setup mit Security-Rollen-Validierung |
| **Laufende Lizenzkosten** | **0 €** innerhalb Copilot Studio (durch Copilot-Studio-Lizenz abgedeckt). **Außerhalb Copilot Studio**: `Search` = Tenant-Grounding-Rate, alle anderen Tools = „Text & Generative AI (basic)" pro 10 Responses. Bei moderater Agent-Nutzung (1-2k Tool-Calls/Monat) ~**niedriger 3-stelliger Credit-Verbrauch**; bei High-Volume-Data-Exploration schnell skalierend |
| **Laufender Betrieb** | 1–2 h/Monat für Credit-Monitoring (Copilot Studio Admin Center → Usage) + Client-Allowlist-Review. Bei Schema-Änderungen: Agent-Instruction-Anpassung, da Tool-Descriptions aus Dataverse-Schema abgeleitet werden |

### Empfehlung

**Status: 🟢 Empfehlen — der einzig sinnvolle Weg für Agent ↔ Dataverse.**

Für Kunden mit Power-Platform-/D365-Stack ist der Dataverse MCP Server die **architektonische Default-Antwort**: Security-Rollen werden transparent durchgesetzt, kein Custom-Connector, GA seit 15.12.2025, out-of-the-box in Copilot Studio. Die Copilot-Credit-Abrechnung außerhalb Copilot Studio ist der einzige Stolperstein — für **D365-Premium-/M365-Copilot-USL-Kunden entfällt** sie bei D365-Daten ohnehin. Alternative direkter Web-API-/SDK-Aufruf nur noch für **Bulk-Import** oder **Plugin-Trigger**, die das MCP-Tool-Set nicht abdeckt.

**Nächster Schritt für Journai:** **Journai-Referenz-Setup** dokumentieren mit drei Pfaden: (1) Copilot-Studio-Tool-Add (Standard für Kundenagenten), (2) `@microsoft/dataverse`-npm-Proxy für Dev/Demo mit Claude Code, (3) Custom-Entra-App mit `mcp.tools`-Scope für produktive MAF-Agents. **Credit-Rechner-Template** für Kundengespräche: „1000 Tool-Calls/Monat ≈ X Credits ≈ Y USD". Bis Build 2026 (Mai): aktive **Auth-Pattern-Klärung OBO vs. App-Only** bei MS-FastTrack.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | **GA seit 15.12.2025** (alle Regionen). Preview-Endpoint (`/api/mcp_preview`) parallel verfügbar für zukünftige Tools (Opt-in pro Environment) |
| **GA-Datum** | **2025-12-15** — nach Public-Preview seit Mai 2025 und erster Ankündigung Build 2025 / Blog 07.07.2025 |
| **Standalone-Preis (USD)** | **Kein separater Server-Preis**. Credit-Abrechnung ausschließlich **außerhalb Copilot Studio** (seit 15.12.2025): `Search`-Tool = **Tenant-Grounding-Rate** (≈ die höchste Copilot-Studio-Rate), alle anderen Tools = **„Text & Generative AI tools (basic)"-Rate pro 10 Responses**. Exakte Credit-Mengen siehe Copilot-Studio-Pricing-Sheet |
| **Standalone-Preis (EUR)** | N/A — folgt Copilot-Studio-Credit-Preis; keine separate EUR-Publikation |
| **Lizenz-Bundle** | **Inkludiert** in Copilot Studio (für In-Studio-Nutzung), Dynamics 365 Premium (Sales/Finance/SCM/Customer Service Premium) und M365 Copilot USL (beide **zero-charge auf D365-Daten** auch extern). Für alle anderen externen Nutzungen: Copilot-Credit-Pool nötig |
| **Voraussetzung** | Dataverse-Environment (Managed). Entra-Tenant. Feature-Toggle *Allow MCP clients to interact with Dataverse MCP server* On (Default On für Copilot Studio). Für Non-MS-Clients: zusätzliche Allowlist-Einträge |
| **Region-Verfügbarkeit** | **Global** — folgt Dataverse-Environment-Region. EU: West Europe (`crm4`), North Europe, France (`crm12`), Germany (`crm16`), Norway (`crm19`), **Switzerland North (`crm17.dynamics.com`)**. EUDB-Framework gilt analog zum Dataverse-Store |
| **CSP-Promo / Discounts** | Über Copilot-Studio-Pooled-Credits oder D365-Premium-Bundle-Käufe mitlaufend; keine MCP-spezifischen Discounts |
| **Hidden Costs** | (1) **Credit-Surprise** bei Non-Studio-Agents mit hohem Query-Volumen — `Search` ist am teuersten. (2) **Schema-Chat-Tokens**: `list_tables` + `describe_table` füllen Prompt-Context schnell auf (Tool-Schema-Explosion). (3) **Managed-Environment-Add-On** falls Environments bisher unmanaged waren (Governance-Kosten via Power Platform Premium / Managed Environments-SKU). (4) Dataverse-Service-Protection-Limits gelten weiter — Burst-Abuse = 429-Throttling |
| **Upgrade-Pfad** | Preview-User (Mai–Dez 2025): nach GA automatisch migriert. Nach GA-Rollout sind **nur Copilot Studio per Default enabled** — bestehende Claude-/VS-Code-Integrationen müssen nach Governance-Update explizit erneut freigegeben werden |

---

## Kernkonzept

### Was es im Kern ist

Der Dataverse MCP Server ist Microsofts Antwort auf die Frage „wie verbinden wir Dataverse mit der MCP-Welt, ohne jeden Agent-Builder in OData-Details zu zwingen?" — und gleichzeitig die **strategische Wette**, dass MCP der Standard-Protokoll-Layer zwischen LLMs und Business-Daten wird. Jedes Dataverse-Environment bekommt automatisch einen **remote HTTP-Endpoint** unter `https://{org}.crm.dynamics.com/api/mcp`, der die MCP-Spec spricht. Es gibt **nichts zu deployen**: der Server ist teil der Dataverse-Runtime, versioniert und gepatcht durch Microsoft.

Das Design-Prinzip: **Der Agent muss Dataverse nicht verstehen** — er ruft Tools wie `read_query`, `create_record`, `Search` auf und bekommt strukturierte Antworten. Schema-Discovery läuft zur Laufzeit via `list_tables` + `describe_table`, d.h. neue Tabellen stehen dem Agent **sofort** zur Verfügung, ohne Redeployment. Die **Security-Rollen des authentifizierten Users** werden transparent durchgesetzt — der Agent kann architekturell nur das, was der User darf. Dieser Zero-Trust-Default ist der Haupt-USP gegenüber selbstgebauten Web-API-Connectors, bei denen Security-Rollen-Handling leicht falsch gemacht wird.

Die **Governance** ist zweistufig: (1) Feature-Toggle pro Environment (Admin entscheidet, ob MCP überhaupt an diesem Environment erlaubt ist), (2) Client-Allowlist (Admin entscheidet, welche MCP-Clients konkret zugreifen dürfen — identifiziert über Entra-App-Client-IDs). Nach GA-Rollout 15.12.2025 ist **nur Microsoft Copilot Studio per Default enabled**. Claude, VS Code GitHub Copilot, Copilot CLI, GitHub Copilot CLI müssen explizit freigegeben werden — das ist Microsofts Versuch, „versehentliche" externe Credit-Kosten zu vermeiden.

Strategisch interessant: Microsoft positioniert MCP hier als **offene Brücke** (jeder Claude-Client kann sich verbinden) und gleichzeitig als **Monetisierungs-Hebel** (Credit-Abrechnung außerhalb Copilot Studio). Für SMB-Berater heißt das: **In-Studio-Szenarien bleiben günstig**, externe Agent-Architekturen brauchen Credit-Planung.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| **Agent / Client** | Copilot Studio, MAF (Python/.NET), Claude Desktop/Code, VS Code GitHub Copilot, Copilot CLI | Mehrere |
| **Auth-Broker** | [[Microsoft Entra Suite]] — App Registration + `Dynamics CRM / mcp.tools`-Scope, OAuth-2.0-Flow je nach Client | Entra |
| **Protokoll** | MCP (Streamable HTTP oder via `@microsoft/dataverse` npm-Proxy als stdio-Bridge) | Microsoft (Dataverse) |
| **Server (remote)** | `https://{org}.crm.dynamics.com/api/mcp` — Microsoft-gehosted, keine eigene Infrastruktur | Microsoft (Dataverse) |
| **Business-Logik** | Dataverse Web API, Plugins, Business Rules, Dataverse Search | [[Dataverse]] |
| **Security-Layer** | Business Units, Security Roles, Row-/Column-Level — greifen auf Tool-Ebene transparent | [[Dataverse]] + Entra |
| **Storage** | Azure SQL, Blob, Elastic Tables, Search-Index | Azure (verborgen) |

### Kern-Fähigkeiten

#### Tool-Set (11 Tools, Stand April 2026)

Der Server exposed die folgenden Tools (direkt aus `data-platform-mcp`-Doku, MS-Learn 2026-03-30):

| Tool | Zweck | Billing-Kategorie (out-of-Studio) |
|------|-------|-----------------------------------|
| `list_tables` | Listet alle Tabellen im Environment | Basic |
| `describe_table` | Liefert T-SQL-Schema einer Tabelle | Basic |
| `read_query` | SELECT-Queries gegen Dataverse (mit SQL-Subset-Restriktion) | Basic |
| `create_record` | Neuer Row-Insert, liefert GUID zurück | Basic |
| `update_record` | Update bestehender Row | Basic |
| `Delete Record` | Row-Delete | Basic |
| `Create Table` | Neue Tabelle mit Schema | Basic |
| `Update Table` | Schema-/Metadata-Änderung | Basic |
| `Delete Table` | Tabelle löschen | Basic |
| `Search` | Keyword-/semantische Suche (Dataverse Search) | **Tenant-Grounding-Rate** (teuer) |
| `Fetch` | Vollständiger Record-Content per Entity-Name + ID | Basic |

**Wichtig**: `read_query` hat **SQL-Keyword-Restriktionen** — nicht jedes SQL-Statement funktioniert. Die Tool-Description definiert erlaubte Klauseln; Agent-Instructions müssen darauf hinweisen (siehe MS-Sample-Instructions).

Grenze: **Kein Bulk-Insert** (Schleife durch `create_record` nötig → Rate-Limit-Risiko). **Kein Plugin-Trigger-Bypass** — Plugins laufen weiter Server-Side und können Agent-Writes ablehnen. **Keine Transaktions-Klammern** über mehrere Tool-Calls.

#### Authentifizierungs-Pfade

**Drei Auth-Szenarien**, je nach Client-Typ:

1. **In-Studio (Copilot Studio)** — Voll-integriert, keine separate App-Registration nötig. Connection-Reference verwendet Copilot-Studio-System-Identity. Default enabled.
2. **Local Proxy via `@microsoft/dataverse` npm** — Für Claude Desktop, Claude Code, VS Code. Microsoft stellt **Dataverse-CLI-Entra-App** (`0c412cc3-0dd6-449b-987f-05b053db9457`) bereit; Tenant-Admin gibt einmalig Admin-Consent via `https://login.microsoftonline.com/{tenant}/adminconsent?client_id=0c412cc3-0dd6-449b-987f-05b053db9457`. Client läuft lokal als Node.js-Proxy (`npx @microsoft/dataverse mcp {orgUrl}`), authentifiziert User interaktiv (Browser-Login), leitet Calls weiter. **Delegated-Auth** — User-Security-Rollen greifen.
3. **Remote-Endpoint mit Custom-Entra-App** — Für produktive MAF-Agents / In-House-Clients. Manuell registrierte Entra-App mit API-Permission **`Dynamics CRM / mcp.tools`**. Client-ID muss in Environment-Allowlist stehen. Flow hängt vom MCP-Client ab (Bearer-Token-Header, Device-Code, oder OBO). **Dataverse + Entra supporten keine Dynamic Client Registration** — App muss manuell angelegt werden.

**App-Only-Auth (Service-Principal)**: Dokumentiert für Web-API seit Jahren, MCP-Endpoint erbt das Verhalten. Für MAF-Agents als Daemon-Service nötig; Security-Rollen müssen am Application User im Power Platform Admin Center gesetzt werden (nicht am Entra-User-Objekt). **OBO-Pattern** (On-Behalf-Of für MAF-Agents im Namen des Users) ist technisch unterstützt, aber Setup-Details noch nicht als fertiges Doku-Pattern in MS-Learn — aktuell Praxis über Agent-Framework-`header_provider` mit weitergereichtem User-Access-Token.

#### Security-Rollen-Enforcement

Dataverse-Security-Rollen werden **pro Tool-Call** durchgesetzt. Das bedeutet konkret:

- Ein User mit *Salesperson*-Rolle sieht via `read_query` nur eigene Accounts; der Agent bekommt nichts, was der User nicht darf.
- **Column-Security-Profiles** blockieren PII-Columns (z.B. Gehaltsfelder) — der Agent bekommt bei `describe_table` die Metadaten, aber bei `read_query` NULL oder Error.
- **Row-Sharing** wirkt wie überall: ein geteilter Record taucht in `read_query` des Agents auf.
- Agent kann **nicht „sudo"-en** — keine Delegation über den User-Scope hinaus.

Für Agent-Builder kritisch: Test-User mit Minimal-Rolle im PoC verifizieren, weil Silent-Data-Leakage bei zu großzügigen Rollen schnell passiert.

#### Knowledge-Source-Alternative vs. MCP-Tool

Wichtige Abgrenzung: In Copilot Studio gibt es **zwei Wege** zu Dataverse:

- **Knowledge Source** — statisches Grounding, Dataverse-Tabellen werden indexiert, 15-Tables-Limit, Synonyms/Glossary für Generative Orchestration. **Read-only**. Siehe [[Dataverse]]-Note.
- **MCP Server als Tool** — dynamischer Tool-Call pro User-Query. **CRUD + Search**, kein Indexing-Delay, aber latency-kritischer im Live-Chat. **Credits im Studio enthalten**.

Empfehlung (eigene Einschätzung): Für reines Retrieval mit stabilem Schema → Knowledge Source (günstiger, schneller im Response). Für CRUD + dynamische Queries → MCP-Tool. Beide gleichzeitig möglich.

### Typischer Workflow

1. **Environment-Admin: Enable** — Power Platform Admin Center → Environment → Settings → Product → Features → *Dataverse Model Context Protocol* → *Allow MCP clients to interact with Dataverse MCP server* = On. Für Non-Studio-Clients zusätzlich: *Advanced Settings* → Client (z.B. Dataverse CLI, GitHub Copilot) → *Is Enabled* = Yes. **Nur Managed Environments**. Dauer: 5 Min.
2. **Tenant-Admin: Consent (einmalig für Local-Proxy-Pfad)** — Adminconsent-URL aufrufen, Dataverse-CLI-App `0c412cc3-...9457` freigeben. Für Custom-Entra-App: App registrieren + `Dynamics CRM / mcp.tools`-Permission + Admin-Consent.
3. **Builder: Client-Config** — (a) Copilot Studio: Agent → Tools → + Add tool → Model Context Protocol → Dataverse MCP Server → Add to agent. (b) Claude Desktop: `claude_desktop_config.json` um `"mcpServers": { "DV": { "command": "npx", "args": ["-y", "@microsoft/dataverse", "mcp", "https://org.crm.dynamics.com"] }}` erweitern. (c) Claude Code CLI: `claude mcp add dataverse -t stdio -- npx -y @microsoft/dataverse mcp https://org.crm.dynamics.com`. (d) MAF Python: `MCPStreamableHTTPTool(url="https://org.crm.dynamics.com/api/mcp", header_provider=lambda kw: {"Authorization": f"Bearer {kw['token']}"})`.
4. **Agent-Instructions schreiben** — Microsoft liefert Sample-Instructions (Role/Objective/MCP-Tool-Selection/Reasoning). Kernregel: vor `read_query` immer `list_tables` + `describe_table` aufrufen, SQL-Restriktionen aus Tool-Description beachten.
5. **Test mit Minimal-Rollen-User** — PoC-Konto mit restriktivster Security-Rolle durchlaufen lassen, Datenzugriff prüfen. Vermeidet Data-Leakage-Surprise in Produktion.
6. **Produktion + Monitoring** — Credit-Dashboard in Copilot Studio Admin Center (für Out-of-Studio-Agents), Dataverse-Audit-Log für CRUD-Events (pro Tabelle aktivieren), App-Insights-Integration für Custom-Entra-App-Clients.

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai intern)** | MCP-Basics (Tool-Call-Konzept, stdio vs. HTTP), Entra-App-Registration, JSON/YAML-Config. Für MAF: Python (`agent_framework` + `MCPStreamableHTTPTool`) oder C# (`ModelContextProtocol`-NuGet). Kein tiefes Dataverse-SDK-Wissen nötig — Tools abstrahieren OData |
| **Admin (beim Kunden)** | Power Platform Admin Center + Entra Admin. Managed-Environments-Konzept. Copilot-Credit-Verständnis für Allowlist-Entscheidungen |
| **End-User (beim Kunden)** | Nichts — im Copilot-Studio-Bot transparent. Für Claude Desktop/Code: einmaliger Browser-Login bei Erst-Verbindung |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Nur Managed Environments** — Unmanaged-Environments haben den Feature-Toggle nicht | Environment auf Managed heben (Power Platform Premium / Managed Environments-Lizenz) |
| **Kein Bulk-Insert-Tool** — jeder Record = separater `create_record`-Call, Rate-Limit-Risiko | Für Bulk: Direct Web API mit Batch-`$batch`-Requests oder Power Automate-Flow |
| **`read_query` hat SQL-Subset-Restriktion** — bestimmte Keywords (CTE-Varianten, komplexe Window-Functions) nicht erlaubt | Komplexe Queries via FetchXML direkt (außerhalb MCP) oder TDS-Read-Endpoint für BI |
| **Keine Transaktionen über Tool-Calls** — Multi-Step-Update kann bei Fehler halb geschrieben bleiben | Plugin Server-Side als Compensation-Layer, oder Custom-API-Endpoint mit atomischer Logik |
| **Tool-Schema-Explosion im Prompt** — 11 Tools × Description + Tabellen-Schemas können Token-Budget fressen | Scope-Begrenzung via Agent-Instructions („nutze nur Tables X/Y"), idealerweise Pre-Fetch per `list_tables` vor Agent-Run |
| **Keine Webhook-/Event-Streaming** — MCP ist Request-Response, kein Push | Power Automate für Change-Notifications parallel |
| **Dynamic Client Registration nicht unterstützt** — Claude/andere Clients mit DCR-Fallback müssen Custom-App manuell bekommen | `@microsoft/dataverse` npm-Proxy als Workaround (nutzt vorregistrierte Dataverse-CLI-App) |
| **OBO-Flow für MAF noch kein fertiges Pattern** | Aktuell `header_provider` mit weitergereichtem User-Token, Session-Scope; App-Only + Application User als Alternative |

### Typische Fallstricke im Einsatz

- **Credit-Surprise außerhalb Copilot Studio** — Seit 15.12.2025 zählen Dataverse-MCP-Tool-Calls gegen Copilot-Credits, wenn Agent **nicht** in Copilot Studio läuft. MAF-Agent mit hoher Query-Frequenz kann schnell 4-stellige EUR-Beträge/Monat erzeugen. Search-Tool ist am teuersten (Tenant-Grounding-Rate). **Gegenmittel**: Kunde mit D365 Premium / M365 Copilot USL? → kein Charge auf D365-Daten. Sonst: Rate-Limits im Agent-Code, Cache-Layer, Scope-reduzierte Tool-Sets.
- **Default-State nach GA ist restriktiv** — Kunden, die im Preview Claude oder VS Code gegen Dataverse genutzt haben, stehen nach 15.12.2025 plötzlich ohne Verbindung da, weil **nur Copilot Studio default enabled** ist. **Gegenmittel**: Migration-Checkliste mit Admins durchgehen, Client-Allowlist nach Governance-Update erneut pflegen.
- **Row-Level-Security falsch konfiguriert** — Service-Principal-Auth mit großzügiger Application-User-Rolle → Agent liefert Daten, die der konkrete End-User nie sehen dürfte. **DSGVO-Problem**. **Gegenmittel**: OBO-Pattern (Agent handelt **im Namen** des Users) wenn möglich; App-Only nur für wirklich user-agnostische Flows (Hintergrund-Sync). Minimal-Rolle für Application User per Default, inkrementell erweitern.
- **Tool-Schema-Explosion** — Agent-Prompt wird durch 11-Tool-Descriptions + jedes `describe_table`-Response aufgebläht; Token-Budget für eigentliche Business-Logik schrumpft. **Gegenmittel**: Pro Usecase Tool-Subset in Agent-Instructions scopen; Tables über `list_tables` nur on-demand laden.
- **Schema-Änderungen brechen Agent-Antworten** — Maker ändert Spalte, Agent-Instructions verweisen auf alten Namen, Silent Failure. **Gegenmittel**: Agent-Instructions dynamisch bauen lassen (erst `describe_table`, dann SQL); Schema-Change-Management via Solutions + Test-Environment vor Prod.
- **Switzerland-North-Environment zu spät gewählt** — CH-Kunde mit FINMA-Kontext hat Environment in West Europe, MCP-Endpoint dann ebenfalls `crm4` — Compliance-Problem. **Region nach Anlage nicht änderbar**. **Gegenmittel**: Region-Entscheid **vor** Environment-Anlage klären, `crm17.dynamics.com` für CH-Only dokumentieren.
- **`@microsoft/dataverse`-Proxy als „offiziell kostenlos" missverstanden** — Das npm-Package ist nur der Transport, die Tool-Calls selbst sind credit-pflichtig sobald außerhalb Copilot Studio. **Gegenmittel**: Bei Kunden-Pitch klar kommunizieren: „Der Proxy ist gratis, die Calls nicht."
- **Preview-Endpoint mit GA-Endpoint verwechselt** — `/api/mcp` (GA) vs. `/api/mcp_preview` (Preview-Tools). Preview muss separat enabled werden, nicht produktionsstabil. **Gegenmittel**: Production-Pipelines gegen GA-Endpoint fest verdrahten, Preview nur in Dev/Test.

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| [[Copilot Studio]] | Default-Client; 1-Klick-Tool-Add, Credits inkludiert | ✅ GA, Default | Nur Studio-eigene Orchestrations-Runtime — Debug-Loop eingeschränkt |
| [[Microsoft Agent Framework]] | Python: `MCPStreamableHTTPTool`; .NET: `ModelContextProtocol`-NuGet | ✅ GA-supported | OBO-Auth-Pattern noch nicht als fertiges Template; `header_provider` manuell |
| [[Dataverse]] | Backend — keine Integration, gleiche Runtime | ✅ Native | Keine |
| [[Microsoft Entra Suite]] | App Registration + `mcp.tools`-Scope; Conditional Access wirkt | ✅ GA | DCR nicht unterstützt; Manual-App-Setup für Custom-Clients |
| VS Code GitHub Copilot (Agent Mode) | Integrierter MCP-Client; Dev-Scenario | ✅ GA | Client muss nach Governance-Update explizit ge-allowlisted werden |
| GitHub Copilot CLI | MCP-Client für Terminal-Workflows | ✅ GA | Wie VS Code |
| Dynamics 365 Sales / Service / F&O / Customer Insights | Daten liegen **nativ** in Dataverse — MCP greift direkt | ✅ GA | D365-Security-Rollen müssen zu Agent-User-Rollen passen |
| Dynamics 365 Sales MCP Server | **Separater, Sales-spezialisierter MCP-Server** (eigenes Doku-Thema) | ✅ GA | Abgrenzung: Dataverse-MCP = generisch; D365-Sales-MCP = domänen-spezialisierte Tools |
| [[Microsoft Purview]] | Audit-Log pro Tabelle (Standard-Dataverse-Audit); Sensitivity-Labels an File-Columns | 🟡 partiell | MCP-spezifische Tool-Call-Events in Standard-Audit-Log noch limitiert (April 2026) |
| [[Microsoft Foundry]] Agent Service | Via `MCPStreamableHTTPTool` als Tool registrierbar | ✅ unterstützt | Auth-Setup wie bei MAF; Foundry-spezifische Managed Identity als bevorzugter Pfad |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| Claude Desktop | MCP-Client über `@microsoft/dataverse` npm-Proxy (stdio) | ✅ GA-supported | Tenant-Admin-Consent nötig; einmaliger Setup-Schritt |
| Claude Code | Wie Claude Desktop, CLI-basiert | ✅ GA-supported | Wie Claude Desktop |
| OpenAI-SDK / LangGraph / CrewAI Agents | Kein direktes MS-Pattern; verwenden generischen MCP-Client gegen `/api/mcp` mit Custom-Entra-App | 🟡 grundsätzlich möglich | Kein Microsoft-Support-Kanal; Community-Beispiele spärlich |
| n8n / Zapier / Make | Keine native MCP-Knoten (April 2026); Zugriff weiter über Dataverse-Web-API-Connector | 🔴 N/A | MCP lohnt sich hier nicht — weiter Web API nutzen |

### APIs / Protokolle

- **MCP Streamable HTTP** — primärer Zugang, `https://{org}.crm.dynamics.com/api/mcp`
- **MCP via stdio-Proxy** — `@microsoft/dataverse` npm, für Clients ohne HTTP-MCP-Support
- **Preview-Endpoint** — `/api/mcp_preview` für Early-Features
- **Auth** — OAuth 2.0 via Entra, Scopes: `Dynamics CRM / mcp.tools` (Custom-App-Flow) oder vorregistrierte Dataverse-CLI-App
- **Kein GraphQL, kein OData-Batch via MCP** — diese Features weiter nur über Dataverse Web API

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | Identisch zu Dataverse-Environment. MCP-Endpoint folgt automatisch der Environment-Region. **Switzerland North (`crm17`)** für CH-Kunden mit FINMA-/Bankgeheimnis-Kontext. EUDB-Framework für Customer Data |
| **Prompts & Outputs** | User-Prompts passieren den **MCP-Client** (Claude, VS Code, Copilot Studio) — deren Datenverarbeitung **gilt separat**. Der Server selbst speichert keine Prompts; Tool-Input/-Output sind reguläre Dataverse-Operationen (nicht für Modell-Training verwendet) |
| **Data Processing Addendum (DPA)** | Dataverse-seitig vom MS DPA abgedeckt. **Wichtig**: bei Non-MS-Clients (Claude) gilt deren Vertragsbasis für Prompt-Inhalt separat — Journai-Kundenprojekte müssen das explizit regeln |
| **EU-AI-Act-Klassifizierung** | MCP-Server selbst: **N/A** (Daten-Gateway, kein AI-System). Klassifizierung folgt dem AI-System, das ihn nutzt — Copilot-Studio-Agent = Limited Risk; Custom-Agent für HR/Kreditentscheidungen kann High-Risk werden |

### Microsoft-Compliance-Stack

- **[[Microsoft Entra Suite]]** — App Registration mit `mcp.tools`-Permission; Conditional Access kann Token-Ausstellung blocken (MFA, Compliant Device). Client-ID-Allowlist im Environment ergänzt als zweite Schicht
- **[[Microsoft Purview]]** — Audit-Log pro Tabelle aktivieren (Default Off!), erfasst alle CRUD-Events inklusive MCP-initiierte. Sensitivity-Labels auf File-Columns bleiben gültig
- **Dataverse Column-Security-Profiles** — greifen per Tool-Call, schützen PII gegenüber Agent-Antworten
- **Compliance Manager** — Dataverse-Assessments (ISO 27001, SOC 2, HIPAA, FedRAMP) decken MCP mit ab, da gleiche Service-Grenze

**Was der Kunde konfigurieren muss:**

1. Managed Environment aktivieren (falls nicht gegeben)
2. Audit-Log pro Tabelle aktivieren für DSGVO-Rechenschaftspflicht
3. Client-Allowlist auf das Minimum begrenzen (nur aktiv genutzte Clients)
4. Custom-Entra-Apps mit Conditional Access absichern (MFA, Compliant Device)
5. Column-Security-Profile für PII-Columns
6. Security-Rolle für Application User (bei App-Only-Szenarien) — **Least Privilege by Default**

### Bekannte Compliance-Lücken

- **MCP-Tool-Call-Events im Standard-Audit-Log noch limitiert** (April 2026) — detaillierte Tool-Call-Logs liefern Copilot-Studio-Analytics (nicht Dataverse-Audit); für externe Clients eigene App-Insights-Integration nötig. TODO: mit Release Wave 2 2026 erneut prüfen
- **OBO-Pattern für MAF noch kein fertiges MS-Template** — Custom-Code-Brücke nötig; bei Review-Pflicht durch Compliance-Team erhöhter Aufwand
- **Non-MS-Clients (Claude Desktop/Code) verarbeiten Prompts außerhalb MS-Cloud** — Datentransfer-Klausel in Kundenverträgen explizit regeln; für streng regulierte CH-Branchen (FINMA) kritische Diskussion
- **Switzerland North nicht automatisch = Bankgeheimnis-konform** — Standard-Antwort der [[Dataverse]]-Note gilt: zusätzliche vertragliche Addenda + ggf. Customer Key nötig
- **Credit-Verbrauch aus externen Clients steuerungsseitig erst nachträglich sichtbar** — keine Hard-Cap pro Agent, Burst-Kosten möglich. Monitoring-Dashboard im Copilot-Studio-Admin-Center pflichtig

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Product Page | Connect to Dataverse with MCP | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-mcp | 2026-04-22 | Tool-Liste, URL-Format, Credit-Hinweis |
| Configure | Configure the Dataverse MCP server | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-mcp-disable | 2026-04-22 | Enable/Disable, Managed-Environment, Client-Allowlist |
| Copilot Studio | Connect to Dataverse with MCP in Copilot Studio | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-mcp-copilot-studio | 2026-04-22 | Tool-Add in Copilot Studio |
| VS Code / CLI | Connect Dataverse MCP with GitHub Copilot in VS Code and Copilot CLI | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-mcp-vscode | 2026-04-22 | Dev-Workflow |
| Non-MS Clients | Connect Dataverse MCP with non-Microsoft clients | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-mcp-other-clients | 2026-04-22 | Claude Desktop/Code, Custom-Entra-App |
| Preview Tools | Preview tools and upcoming features | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-mcp-preview-tools | 2026-04-22 | `/api/mcp_preview`-Features |
| Billing | Copilot Studio Billing rates | https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management | 2026-04-22 | Credit-Raten für externe MCP-Calls |
| MAF Docs | Using MCP Tools in Agent Framework | https://learn.microsoft.com/en-us/agent-framework/agents/tools/local-mcp-tools | 2026-04-22 | Python/`MCPStreamableHTTPTool` + C#-Sample |
| Foundry Agents | Set Up MCP Server Authentication | https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/mcp-authentication | 2026-04-22 | Auth-Patterns für Foundry-Agents |
| Blog (Announcement) | Dataverse MCP Server: A Game Changer | https://www.microsoft.com/en-us/power-platform/blog/2025/07/07/dataverse-mcp/ | 2026-04-22 | Strategische Einordnung |
| Admin / GA | M365 Admin — Dataverse MCP GA | https://m365admin.handsontek.net/dataverse-dataverse-model-context-protocol-mcp-server-general-availability/ | 2026-04-22 | GA-Datum, Rollout, Governance-Änderung |
| Release Plan | Power Platform 2025 Wave 2 Overview | https://learn.microsoft.com/en-us/power-platform/release-plan/2025wave2/ | 2026-04-22 | MCP-Roadmap |
| MSDynamicsWorld | Major capabilities roadmap | https://msdynamicsworld.com/story/microsoft-enhance-dataverse-mcp-server-major-capabilities | 2026-04-22 | Analyst-Einschätzung |

### Secondary (Analysten & vertrauenswürdige Industrie)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| Directions on Microsoft | https://www.directionsonmicrosoft.com | 2026-04-22 | Lizenz-/Credit-Modell-Analyse |
| SAMexpert Copilot Studio Licensing Guide | https://samexpert.com/copilot-studio-licensing-guide/ | 2026-04-22 | Copilot-Credits + MCP-Abrechnung |
| Licensing School (Microsoft Copilot Studio Dec 2025) | https://www.licensingschool.co.uk/wp-content/uploads/2025/12/microsoft-copilot-studio-licensing-guide-december-2025-pub.pdf | 2026-04-22 | Offizielle Licensing-Guide-Deep-Dive |
| Licensing.Guide — Dataverse MCP requirements | https://licensing.guide/dataverse-mcp-server-licensing-requirements/ | 2026-04-22 | User-SL-Anforderungen für externe Clients |
| Agent & Copilot — MCP Deep Dive | https://agentandcopilot.com/ai-and-copilots/microsoft-deepens-mcp-support-with-new-power-apps-and-dataverse-servers/ | 2026-04-22 | Power-Apps-MCP-Kontext |
| The Custom Engine (MCS Blog) — Cross-Env | https://microsoft.github.io/mcscatblog/posts/connecting-copilot-studio-dataverse-mcp-endpoint-across-environments/ | 2026-04-22 | Praxis-Pattern für Cross-Environment |

### Tertiary (Community / MVPs)

| Autor | Blog / Kanal | Zuletzt gesichtet | Warum relevant? |
|-------|--------------|-------------------|-----------------|
| The Nullpointer Blog (Markus) | https://nullpointer.se/dvmcpserver-context-reduction.html | 2026-04-22 | Context-Reduction-Strategien, MAF-Integration |
| Mark Smith (NZ365guy) | https://www.nz365guy.com | 2026-04-22 | Power Platform / Dataverse Deep-Dives |

### Events / Konferenzen zum Beobachten

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| AI Tour Zürich 2026 | 29.04.2026 | CH-Region Positionierung, Copilot-Studio-MCP-Demos |
| Microsoft Build 2026 | Mai 2026 | Neue MCP-Tools (aktuell in `/api/mcp_preview`), OBO-Auth-Pattern-Templates für MAF |
| Power Platform Release Wave 1 2026 | laufend bis April 2026 | Governance-Erweiterungen, Management-MCP-Server (GA 30.04.2026) |
| Microsoft Ignite 2026 | Nov 2026 | Release Wave 2 2026 Features, weitere Tool-Erweiterungen |

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive Dataverse MCP Server: Endpoint, Auth-Flows, Copilot-Credit-Modell, MAF-Integration | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-mcp |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
