---
watch: standard
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [MS Graph, Graph API, graph.microsoft.com]
moc:
  - "[[Microsoft MOC]]"
  - "[[Data & Knowledge MOC]]"
---

# Microsoft Graph

*Die **einheitliche REST-/SDK-API** über alle M365-Daten (Outlook, Teams, SharePoint, OneDrive, Calendar, People, Directory, Security, Copilot). Ein Endpoint (`graph.microsoft.com/v1.0`), ein Auth-Modell (Entra OAuth 2.0), ein Scope-System. Für fast jeden SMB-Agent mit M365-Zugriff der Pflicht-Eintrag — es gibt im Microsoft-Ökosystem keine sinnvolle Alternative.*

> **Analogie:** Was die Stripe-API für Payments ist, ist Microsoft Graph für M365 — eine einzige HTTP-API, die alle Teilprodukte einheitlich erreichbar macht. Ohne Graph sind Teams, Exchange und SharePoint drei Silos; mit Graph sind sie eine Daten-Ebene.

---

## Einsatz

### Job-to-be-done

When I einem Agent oder Backend-Service Zugriff auf M365-Daten geben will, I want to **nicht** einzelne Outlook-/SharePoint-/Teams-APIs nebeneinander orchestrieren, sondern über **eine REST-API** mit konsistenter Auth- und Permission-Semantik auf User- und Tenant-Kontext zugreifen, so I can mit weniger Boilerplate mehr Agent-Logik liefern — und habe ein einziges Audit-/Compliance-Surface statt fünf.

### Trigger-Signale

- *„Unser Agent soll die letzten Mails des Users zusammenfassen."*
- *„Wir brauchen Zugriff auf alle SharePoint-Dokumente im Tenant, aber respektierend die User-Berechtigungen."*
- *„Der Bot soll Kalender-Termine planen und Teams-Chat-Nachrichten schicken."*
- *„Wir wollen Copilot-Usage-Daten in unser BI-System ziehen."*
- *„Wir müssen externe Daten (Confluence, Jira) in M365 Copilot einspeisen."*

### Einsatz-Szenarien

1. **Agent als Graph-Consumer (Delegated-Auth)** — M365-Agent liest Mails/Kalender/Files im Namen des angemeldeten Users. Standard-Pattern für Teams-Bots, Declarative Agents, Copilot-Extensions. → Nutzt `/me/*`-Endpunkte + User-Token.
2. **Backend-Service mit App-Only-Token** — Nightly-Job zieht tenant-weit alle neuen SharePoint-Dokumente für Indexierung in Azure AI Search. → Nutzt `/sites/*`, `/users`, `/groups` mit Application-Permissions + Admin-Consent.
3. **Graph als Grounding-Quelle für Copilot** — externe Line-of-Business-Daten via [[Microsoft 365 Copilot Connectors]] in den Tenant-Graph ingestieren, damit Copilot sie in Antworten zitieren kann.
4. **Agent mit [[Entra Agent ID]] + OBO** — Autonomer Agent mit eigener Identity handelt im User-Kontext via On-Behalf-Of-Token-Exchange. Neuestes 2026-Pattern, siehe [Kernkonzept](#kernkonzept).

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | M365-Tenant (Business Basic genügt für Basics; einzelne APIs wie Copilot-Retrieval/Analytics brauchen Copilot-Lizenzen bzw. M365 E5/E7) |
| **Tenant / Infrastruktur** | Entra-Tenant, App-Registration mit API-Permissions. Für EUDB-Kunden: Tenant-Default-Geo = EU |
| **Skills / Rollen** | **Global Admin** oder **Privileged Role Admin** für Admin-Consent auf app-only Permissions + High-Privilege Delegated Scopes. Ohne diese Person kein `Mail.Read.All`/`Files.Read.All`/`Sites.Read.All` |
| **Compliance-Rahmen** | MS DPA deckt Graph ab. DSGVO-Einordnung abhängig vom Underlying-Service (Exchange/SPO = EUDB ✅; Copilot-Retrieval = EUDB mit Flex-Routing-Einschränkung ab 17.04.2026) |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | 0.5–2 Tage für einfache PoC (App-Registration, Consent-Flow, Scope-Design). 3–5 Tage wenn OBO + mehrere Permissions + Throttling-Handling |
| **Laufende Lizenzkosten** | **API selbst kostenlos**. Kosten entstehen nur in abhängigen Services (Copilot-Lizenzen für `/copilot/*`, Storage für Connector-Daten) |
| **Laufender Betrieb** | 0.5 Tage/Monat bei stabilem Setup. Steigt deutlich bei Hochlast-Szenarien (Throttling-Tuning, Delta-Query-Drift, Permission-Drift durch Admin-Änderungen) |

### Empfehlung

**Status: 🟢 Empfehlen** — Standard-Weg für jeden SMB-Agent mit M365-Datenkontext. Kein sinnvoller Ersatz im MS-Ökosystem, und wird durch Copilot + Agents strategisch nur wichtiger (neue `/copilot/*`-Endpunkte, Retrieval-API, Agent-Management-APIs GA mitte April 2026).

**Nächster Schritt für Journai:** Internen **Graph-Permission-Cheat-Sheet** bauen (Scope → Use-Case → Consent-Level), damit Berater bei Kunden-Workshops sofort den richtigen Scope-Set vorschlagen statt „zur Sicherheit alles anfordern". Zusätzlich **Referenz-MCP-Server**-Setup (Microsoft EnterpriseMCP oder Lokka) für Claude-Code-basierte Tenant-Exploration dokumentieren.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | **GA** (v1.0) + **Beta** (`/beta`, produktiv nicht empfohlen); Copilot-Endpunkte teils Preview → GA mitte April 2026 |
| **GA-Datum** | Kernendpunkte GA seit 2015/2016; kontinuierliche Feature-Erweiterung. Neue Copilot-Agent/App-Management-APIs: Preview März 2026, GA mitte April 2026 |
| **Standalone-Preis (USD)** | **$0** — API-Calls kostenlos, nur Rate-Limits gelten |
| **Standalone-Preis (EUR)** | **€0** |
| **Lizenz-Bundle** | Graph ist kein Produkt, sondern **API-Layer**. Nutzung impliziert Lizenz auf den Unterliegenden Service (Exchange/SPO/Teams via M365 Business/E-SKU; `/copilot/*` via M365 Copilot) |
| **Voraussetzung** | M365-Tenant + App-Registration in Entra |
| **Region-Verfügbarkeit** | Global. Datenresidenz folgt dem unterliegenden Service: Exchange/OneDrive/SharePoint/Teams sind **EUDB-covered** seit Feb 2025 für EU-Tenants |
| **CSP-Promo / Discounts** | n/a — API kostenlos |
| **Hidden Costs** | (1) **Throttling-Overhead**: ab mittlerer Last braucht man Batching, Retry-Logik, Delta-Queries — das ist Engineering-Zeit, kein Lizenz-Cost. (2) **Copilot-abhängige Endpunkte** (`/copilot/retrieval`, `/copilot/interactionHistory`) brauchen **Copilot-Lizenz** pro User (~$30/User/Monat). (3) **Connectors-Ingestion** kann SharePoint-Storage-Quota verbrauchen |
| **Upgrade-Pfad** | Beta → v1.0: oft Breaking Changes, muss pro Endpunkt geprüft werden |

---

## Kernkonzept

### Was es im Kern ist

Microsoft Graph ist Microsofts **„One-API-to-rule-them-all"-Strategie** für den M365-Cloud-Stack. Vor Graph hatte jeder Service seine eigene API (EWS für Exchange, CSOM/REST für SharePoint, Bot Framework für Teams) mit eigenen Auth-Modellen, eigenen Rate-Limits, eigenen SDKs. Graph bündelt diese unter einem **einzigen REST-Endpoint** (`https://graph.microsoft.com/v1.0/...`) mit **einem Auth-Modell** (Entra OAuth 2.0) und **einem Permission-Framework** (Scopes/Roles).

Die tiefere Design-Philosophie: **Daten sind user-centric, nicht service-centric**. Der `/me`-Root steht für den angemeldeten User — seine Mails, seine Files, seine Termine, seine Chats. Das zwingt Agent-Entwickler dazu, in User-Kontext zu denken (Delegated Auth als Default), was mit DSGVO-„Zweckbindung" erstaunlich gut harmoniert. App-Only ist der **Opt-out** für Tenant-weite Admin-Szenarien, der Admin-Consent erzwingt.

2026 hat Graph seine Rolle erweitert: `/copilot/*`-Endpunkte machen Graph zur **programmatischen Oberfläche für M365 Copilot** (Retrieval-API für RAG-Grounding, Interaction-History für Audit, Analytics für BI, Agent-Management ab April GA). Gleichzeitig bleibt Graph selbst ein **Connector-Target**: Via Copilot Connectors können externe Daten (Jira, Confluence, eigene LoB-Apps) in den Tenant-Graph ingestiert werden, wodurch Copilot sie zitieren kann. Graph ist damit **gleichzeitig API-Surface und Daten-Repository**.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| **API-Gateway** | Single-Endpoint-Fassade + Throttling + Auth-Check | Microsoft Graph Service |
| **Authorization** | OAuth-2.0-Token-Validierung, Scope/Role-Enforcement | [[Microsoft Entra Suite]] (Entra ID) |
| **Service-Backends** | Exchange Online, SharePoint, Teams, OneDrive, Entra Directory, Copilot | M365-Services (je eigenes Backend) |
| **SDKs** | Wrapper in .NET, Python, JS/TS, Java, Go, PowerShell | Microsoft (microsoftgraph/msgraph-sdk-*) |
| **Test-Tools** | Graph Explorer, Postman-Collection, CLI (`mgc`) | Microsoft |

### Kern-Fähigkeiten

#### Unified REST API über M365

Ein Endpoint (`graph.microsoft.com/v1.0/...`), JSON-Payload, OData-Query-Syntax (`$filter`, `$select`, `$expand`, `$top`). Navigation folgt Resource-Graph-Pattern: `/me/messages/{id}/attachments/{id}`. Der Hauptgewinn für Agent-Entwickler: **eine Auth-Konfiguration deckt alle M365-Services ab** — es gibt keinen Grund mehr, EWS oder CSOM zu lernen (beide deprecated bzw. im Deprecation-Radar).

**Relevante SMB-Endpunkte:**

| Endpunkt | Zweck | Typischer Agent-Use |
|----------|-------|---------------------|
| `/me/messages`, `/me/events`, `/me/drive` | User-Kontext: Mail, Kalender, OneDrive | Personal Assistants, Meeting-Scheduler |
| `/sites/{id}/drive` · `/sites/{id}/lists` | SharePoint-Files + Listen | Dokumenten-Agents, LoB-Datenzugriff |
| `/teams/{id}/channels/{id}/messages` | Teams-Kanal-Inhalte | Chat-Zusammenfassung, Moderation |
| `/users`, `/groups`, `/directoryObjects` | Entra-Directory | User-Lookup, Gruppen-Mitgliedschaft, Onboarding |
| `/search/query` | Unified Search über Mail + Files + Sites + Teams | Agent-interne Suche statt eigener Index |
| `/copilot/retrieval` | RAG-Retrieval über SPO + OneDrive + Connectors (GA seit 2026) | Custom-RAG-App die Copilot-Index nutzt |
| `/copilot/interactionHistory` · `/copilot/usage` | Audit + Analytics | Compliance-Reporting, Adoption-Metriken |
| `/solutions/virtualEvents` · `/chats` | Events, 1:1-Chats | Event-Bot, Notification-Service |
| `/security/*` | Defender-Incidents, Alerts | SecOps-Automatisierung (eher Enterprise) |
| `/external/connections` | Copilot-Connectors-Ingestion | Externe Daten → Tenant-Graph |

Grenze: Nicht **jeder** M365-Service ist in Graph. Power Platform hat eigene APIs (Dataverse-REST), Fabric/OneLake haben eigene APIs, Purview-Config großenteils separat.

#### Auth-Flows (3 relevante, 1 neu)

**Delegated (User-Token) — Default für interaktive Agents**

```
User-Login → Entra → ID-Token + Access-Token mit Delegated-Scopes
         → Agent ruft Graph mit User-Token auf
         → Graph liefert nur Daten, die User sehen darf
```

- Scope-Beispiel: `Mail.Read`, `Calendars.ReadWrite`, `Files.Read.All`
- Consent: User-Consent für Low-Privilege, **Admin-Consent** für High-Privilege (alles mit `.All`, `ReadWrite.All`)
- Verwendung: Teams-Bots, Declarative Agents, Copilot-Extensions, User-facing Web-Apps

**App-Only (Client-Credentials) — Backend-Services**

```
App authentisiert sich mit Client-Secret/Cert → App-Token mit App-Roles
         → Agent ruft Graph tenant-weit auf
```

- Scope-Beispiel: `Mail.Read` (App-Role), `Sites.Read.All`, `User.Read.All`
- Consent: **Immer Admin-Consent zwingend** (nicht delegierbar)
- Verwendung: Nightly-Jobs, Indexer, Webhooks-Verarbeitung, Service-to-Service
- Gefahr: **Tenant-weiter Zugriff ohne User-Kontext** — schwierige DSGVO-Zweckbindung, muss in DPIA begründet werden

**On-Behalf-Of (OBO) mit [[Entra Agent ID]] — neuestes 2026-Pattern**

```
User ruft Agent auf (User-Token)
   → Agent-Identity tauscht User-Token gegen Downstream-Graph-Token
   → Agent ruft Graph im User-Kontext, aber mit Agent-Identity als Audit-Spur
```

- Agent hat eigene Identity (`Entra Agent ID`), die delegierte Permissions zugewiesen bekommt
- User-Kontext bleibt für Graph-Authorization erhalten (Least-Privilege ist weiterhin enforced)
- **Einschränkung per April 2026:** Agents sind **nicht** für OBO `/authorize`-Flows supported; nur `client_credential`, `jwt-bearer`, `refresh_token` als Grant-Types
- Verwendung: Autonome Agents in [[Microsoft Agent Framework]] / [[Copilot Studio]], die Graph-Calls machen und dabei Agent-Identity + User-Identity beide im Audit-Log brauchen

*{TODO: OBO-Support für Agent-Identity wird laut MS-Docs schrittweise erweitert — in Q3 2026 erneut prüfen.}*

#### Permissions-Model & Admin-Consent

Microsoft unterscheidet **Delegated Permissions** (scopes, für User-Token) und **Application Permissions** (app roles, für App-Only). Jeder Scope hat ein **Consent-Level**:

- **User-Consent**: Endnutzer kann selbst zustimmen (nur Low-Privilege, z.B. `User.Read`, `Mail.Send` für eigene Mailbox)
- **Admin-Consent**: Nur Global Admin / Privileged Role Admin kann zustimmen (alle `.All`-Scopes, alle App-Roles, sensible Bereiche wie `Directory.ReadWrite.All`)

**Consent-Prozess für SMB-Kunden:**

1. App-Registrierung in Entra (einmalig)
2. Scopes in Manifest deklarieren
3. Admin-Consent-URL generieren: `https://login.microsoftonline.com/{tenant}/adminconsent?client_id={app-id}`
4. Customer-Admin klickt durch → Consent tenant-weit gespeichert

**Fallstrick**: Ohne Admin-Consent funktioniert **nichts mit `.All`-Scopes**. Das wird bei Kunden-PoCs oft zu spät gemerkt. → Gegenmittel: vorab mit Kunden-IT Consent-Termin vereinbaren.

#### Graph Connectors (Basis für Copilot Connectors)

Mit `/external/connections/{id}/items` kann man **beliebige externe Daten** in den Tenant-Graph-Index ingestieren. Daten werden semantisch indiziert und für Copilot + `/search`-API verfügbar.

Zwei Modelle:

- **Synced Connectors** — Daten werden in Graph-Index kopiert, periodisch aktualisiert. → für stabile LoB-Systeme (Confluence, Jira, SAP-Extract)
- **Federated Connectors (MCP-basiert, 2026 neu)** — Daten werden **nicht** indiziert, sondern live via MCP-Server retrieved. → für Echtzeit-Daten (CRM, Ticket-System)

Per April 2026 > 100 vorgebaute Connectors, 35 neue GA in 2026. Details in der dedizierten Note [[Microsoft 365 Copilot Connectors]].

#### Change Notifications + Delta Queries (Event-Pattern)

Für Agents, die auf Daten-Änderungen reagieren sollen (z.B. *„neue Mail → Agent klassifiziert automatisch"*):

- **Subscriptions** (`/subscriptions`): Webhook-Endpoint beim Agent, Graph pusht Event-Trigger
- **Delta Queries** (`?$delta=...`): Agent ruft Graph mit Delta-Token auf, bekommt nur Änderungen seit letzter Query zurück

**Best Practice (MS-Docs)**: Kombinieren — Subscription als Trigger, dann Delta-Query für State-Sync. Subscription allein ist unreliable (Renewals, Missed Events), Delta allein ist teuer (Polling). Zusätzlich: Backstop-Polling (z.B. täglich 1× voller Delta-Sync) für Safety-Net.

#### Batching (`$batch`)

Bis zu **20 Requests** in einem Batch-Call bündeln. Wichtig: Outlook-spezifisch nur 4 concurrent innerhalb eines Batches (erzwungen vom Exchange-Backend). Bei Ordering-Abhängigkeit `dependsOn` nutzen, sonst parallel.

**Impact**: Batching senkt Throttling-Risiko drastisch, weil Graph den Batch als weniger Requests zählt als einzelne Calls.

### Typischer Workflow (Agent mit Graph-Zugriff)

1. **Setup (Admin)** — App-Registrierung in Entra, Scopes deklarieren, Admin-Consent einholen. 30–60 Min.
2. **Scope-Design (Dev)** — minimalen Scope-Set definieren. Beispiel: Mail-Summarizer braucht `Mail.Read` (nicht `Mail.ReadWrite`!), Kalender-Bot `Calendars.ReadWrite`. **Vor Coding festlegen**, nachträgliche Scope-Ausweitungen brauchen erneut Admin-Consent.
3. **Build (Dev)** — SDK einbinden (`pip install msgraph-sdk` / `dotnet add package Microsoft.Graph`), Credential via `DefaultAzureCredential` (Dev) oder Managed Identity (Prod), Graph-Client aufbauen.
4. **Test** — Graph Explorer (`developer.microsoft.com/graph/graph-explorer`) für interaktive Endpoint-Exploration. Postman-Collection offiziell verfügbar.
5. **Deploy** — Agent in Azure (Container Apps, Functions) oder M365-Plattform (Teams-App-Manifest, Declarative Agent). Token-Acquisition via MSAL / Azure Identity.
6. **Operate** — Throttling (429) und transient errors (503) handeln, Retry mit `Retry-After`-Header respektieren, Delta-Token persistieren für Resume nach Outages.

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai intern)** | OAuth 2.0 Grundlagen (v.a. Delegated vs. App-Only), SDK der Wahl (Python/.NET/JS), REST + JSON, grundlegendes Entra-Verständnis (App-Registration, Consent) |
| **Admin (beim Kunden)** | Global Admin oder Privileged Role Admin für Consent-Approval. Kein Coding — Browser-Klick auf Consent-URL reicht. Muss aber verstehen **was** er freigibt (Scopes lesen!) |
| **End-User (beim Kunden)** | Nichts — Graph-Calls sind für Endnutzer transparent (Agent handelt in deren Namen) |

### Code-Beispiel: User-Kalender mit Delegated Auth (Python)

```python
# pip install msgraph-sdk azure-identity
import asyncio
from azure.identity.aio import InteractiveBrowserCredential
from msgraph import GraphServiceClient
from msgraph.generated.users.item.calendar.events.events_request_builder \
    import EventsRequestBuilder

async def main():
    credential = InteractiveBrowserCredential(
        tenant_id="<tenant-id>",
        client_id="<app-registration-client-id>",
    )
    scopes = ["Calendars.Read"]   # Least-Privilege
    graph = GraphServiceClient(credential, scopes)

    # Die nächsten 10 Kalender-Events des Users
    query = EventsRequestBuilder.EventsRequestBuilderGetQueryParameters(
        top=10,
        orderby=["start/dateTime"],
        select=["subject", "start", "end", "location"],
    )
    config = EventsRequestBuilder.EventsRequestBuilderGetRequestConfiguration(
        query_parameters=query,
    )

    events = await graph.me.calendar.events.get(request_configuration=config)
    for ev in events.value:
        print(f"{ev.start.date_time}  {ev.subject}  @ {ev.location.display_name}")

asyncio.run(main())
```

**Produktions-Variante**: `InteractiveBrowserCredential` → `DefaultAzureCredential` (probiert Managed Identity, CLI, VS Code, Interactive in dieser Reihenfolge). Für Service-to-Service: `ClientSecretCredential` / Federated Credentials ohne Secret.

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Harte Latenz-SLA fehlt** — Graph ist „best effort", 99.9% Uptime ist offiziell, aber P99-Latenzen in der Praxis schwanken (teilweise >2s bei komplexen Queries) | Bei Realtime-Anforderungen: Change Notifications + lokaler Cache statt Live-Queries |
| **Keine eigene Rate-Limit-Konfiguration pro Kunde** — Limits sind MS-seitig fix, nicht verhandelbar | Architektur auf Limits auslegen: Batching, Delta, Caching. Für Backups dedicated Partnerprogramme (Veeam Drive-Connect etc.) |
| **Nicht alle M365-Services in Graph** — Power Platform, Fabric/OneLake, große Teile von Purview haben separate APIs | Hybrid-Integration: Graph für Core-M365, separate SDKs für Power/Fabric |
| **Beta-Endpoints nicht produktiv stabil** — Breaking Changes ohne Vorwarnung, SLA = keine | Nur v1.0 für Produktion; Beta nur für PoC/Experiment |
| **Bulk-Operations limitiert** — `/$batch` max 20 Requests, Outlook-Teile max 4 parallel | Parallel-Batches + Backpressure-Logik, oder Delta-Query für reine Reads |
| **Echte Cross-Tenant-Queries schwer** — Multi-Tenant-Apps müssen pro Tenant separat Consent + Token holen | Multi-Tenant-App-Registration, Per-Tenant-Token-Cache |

### Typische Fallstricke im Einsatz

- **„Alle Scopes anfordern zur Sicherheit"** — Customer-Admin wird es ablehnen oder im besten Fall skeptisch nachfragen. Jeder zusätzliche Scope ist Compliance-Überzeugungsarbeit. **Gegenmittel**: Scope-Liste vor First-Contact mit Admin definieren, für jeden Scope eine 1-Satz-Begründung parat haben.
- **Delegated vs. App-Only zu spät entschieden** — wenn ein Agent erst als Delegated gebaut wird und dann auf App-Only umgestellt werden muss (weil User nicht immer online ist), ist das ein **Scope-Refactor** (andere Permission-Namen, anderes Consent). **Gegenmittel**: Auth-Flow in der allerersten Architektur-Skizze festlegen.
- **Throttling wird übersehen bis Production-Crash** — Dev-Traffic ist niedrig, man merkt's nicht. In Prod kommen plötzlich 429er. **Gegenmittel**: Retry-with-Backoff + `Retry-After`-Respect **immer** ab Tag 1 einbauen, auch im Prototyp.
- **Seit 01.03.2026: App-Registration-Multiplexing nicht mehr möglich** — Früher beliebter Trick: für einen Tenant mehrere App-Registrations anlegen, um Limits zu vervielfachen. Ab 01.03.2026 aggregiert Microsoft Limits tenant-weit über alle Apps. **Gegenmittel**: Echte Bulk-Architektur statt Multiplexing.
- **Admin-Consent-URL vs. User-Consent-URL verwechselt** — User klickt `/common/oauth2/v2.0/authorize`, kriegt keinen Admin-Consent-Dialog, App funktioniert scheinbar, bricht aber bei ersten `.All`-Call mit 403. **Gegenmittel**: Explizit `/adminconsent`-Endpoint für Tenant-Install nutzen.
- **Graph-Events mit Activity-Protocol verwechseln** — Graph Change Notifications = Daten-Änderungen (neue Mail, geupdatetes File). Activity Protocol (A2A) = Agent-zu-Agent-Kommunikation. Komplett unabhängig, wird oft verwechselt. **Gegenmittel**: In Team-Docs klar benennen.
- **Delta-Token-Verlust** — Wenn Agent crasht ohne Delta-Token zu persistieren, muss er wieder full-sync machen (teuer). **Gegenmittel**: Delta-Token nach jedem erfolgreichen Call atomar in Durable-Store schreiben.

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| [[Microsoft 365 Copilot]] | Copilot konsumiert Graph als primäre Grounding-Quelle über `/copilot/retrieval`, `/search` | ✅ GA + in aktiver Weiterentwicklung | `/copilot/*`-Endpunkte brauchen Copilot-Lizenz pro User |
| [[Microsoft 365 Copilot Connectors]] | Externe Daten → Graph-Index | ✅ GA (> 100 Connectors) | Synced vs. Federated Modell-Entscheidung komplex |
| [[Microsoft Agent Framework]] | MAF-Agents rufen Graph via SDK für M365-Kontext | ✅ MAF-Providers nutzen es explizit | OBO-Flow mit [[Entra Agent ID]] hat Grant-Type-Einschränkungen (April 2026) |
| [[Copilot Studio]] | Declarative Agents nutzen Graph-Connector-Actions | ✅ GA | Connector-Auth-Konfiguration in Studio nicht trivial |
| [[Entra Agent ID]] | Agent-Identity holt Graph-Tokens via OBO/Client-Credentials | ✅ GA (Q1 2026) | Agents noch **nicht** für `/authorize` OBO-Flows supported |
| [[Microsoft Entra Suite]] | Graph = primäres Write-Interface für Directory-Objekte (User, Group, Role) | ✅ GA | `Directory.ReadWrite.All` ist höchster Admin-Consent-Level |
| [[Microsoft Purview]] | Purview-Labels/DLP/Retention greifen auf Graph-Calls | ✅ transparent (Daten werden mit Labels zurückgegeben) | Sensitive-Content kann per Policy maskiert/geblockt sein — Agent muss 403 handeln |
| [[Agent 365]] | Agent-Governance-Layer nutzt Graph für Agent-Inventar | 🟡 Preview → GA 2026 | Überschneidung mit Entra Agent ID noch nicht final geklärt |
| Azure AI Search | Graph als Indexer-Source (nicht umgekehrt!) | 🟡 über Custom-Code oder Logic Apps | Kein out-of-the-box Graph-Indexer |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| n8n / Zapier / Make | Low-Code-Workflows mit Graph-Calls | ✅ stabil (vorgebaute Nodes) | Oft nur Delegated-Mode, App-Only manuell |
| Slack / Salesforce / Jira (via Copilot Connectors) | Cross-Plattform-Grounding | ✅ GA | Per Connector unterschiedlich tief |
| Backup-Tools (Veeam, Afi, Spanning) | Mailbox/SPO/OneDrive-Backup | ✅ stabil | Seit 01.03.2026: kein App-Multiplexing mehr, echte Partnerprogramme mit erhöhten Limits nötig |

### APIs / Protokolle

- **REST + OData** (primär) — `$filter`, `$select`, `$expand`, `$top`, `$count`, `$search`
- **GraphQL** — **nicht** supported (trotz Namens-Ähnlichkeit — „Graph" bezieht sich auf People-Graph-Konzept, nicht GraphQL)
- **Webhooks** (Change Notifications) — HTTPS-Push, Renewal alle 3–90 Tage je Resource
- **SDK-Sprachen**: .NET, Python, JS/TS, Java, Go, PowerShell (`Microsoft.Graph` module), CLI (`mgc`)
- **MCP**: Mehrere (teils Community, teils MS): `microsoft/EnterpriseMCP` (Read-only, Entra-Fokus, offiziell), `Softeria/ms-365-mcp-server`, `merill/lokka` (populär in Community). **Kein** vollständig offizielles `@microsoft/mcp-server-graph` per April 2026 — EnterpriseMCP ist der offizielle Einstieg, deckt aber bewusst nur Read-Entra-Szenarien ab.

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | Graph selbst ist ein **Gateway** — tatsächliche Daten liegen bei Underlying-Service. Für EU-Tenants: Exchange/OneDrive/SharePoint/Teams sind **EUDB-covered** seit Feb 2025 (Customer Data, Service Data, System-Generated Logs, Support Data alle in EU/EFTA) |
| **Prompts & Outputs** | Graph-Calls **werden** in Audit-Logs gespeichert (Entra + Purview), aber **nicht** für Model-Training verwendet. `/copilot/*`-Endpunkte: Interaktions-History ist Teil des Copilot-Audit-Streams |
| **Data Processing Addendum (DPA)** | Graph vom MS DPA abgedeckt (als Teil von M365-Services, keine separate Anlage nötig) |
| **EU-AI-Act-Klassifizierung** | Graph selbst: **N/A** (API, kein AI-System). Aber: `/copilot/*`-Endpunkte fallen unter Copilot-Klassifizierung (Limited Risk). Verwendung von Graph-Daten in einem High-Risk-AI-System (z.B. HR-Entscheidungen) macht **die Anwendung** High-Risk, nicht Graph |

### Microsoft-Compliance-Stack

- **[[Microsoft Entra Suite]]** — App-Registration, Consent-Grants, Conditional-Access kann Graph-Token-Issuance blocken (z.B. „nur von managed devices"). Signin-Logs zeigen jeden Graph-Auth-Call.
- **[[Microsoft Purview]]** — Sensitivity-Labels wandern mit Graph-Responses mit. Purview-Audit-Log hat `GraphAPI`-Events. DLP-Policies können `/me/messages`-POSTs inspect.
- **Defender for Cloud Apps / Defender for Identity** — anomaly-detection auf Graph-App-Usage (z.B. OAuth-App mit plötzlich 10× Traffic-Anstieg).
- **Conditional Access für Workload-Identities** — ab 2024 GA: CA-Policies für Service-Principals, nicht nur User. → Kritisch für App-Only-Apps mit High-Privilege.

**Was der Kunde konfigurieren muss:**

1. Admin-Consent-Workflow aktivieren (damit User Consent-Requests einreichen, Admin entscheidet)
2. App-Governance in Defender aktivieren (Monitoring für auffällige OAuth-Apps)
3. Purview-Audit-Log-Retention auf ≥180 Tage (für DSGVO-Nachweise)

### Bekannte Compliance-Lücken

- **Copilot Flex Routing ab 17.04.2026 by default ON** für EU/EFTA-Tenants — wenn EU-Inference-Kapazität voll, kann Copilot-LLM-Call **außerhalb EUDB** ausgeführt werden. Betrifft `/copilot/retrieval` und andere Copilot-Endpunkte. Muss bei DSGVO-sensiblen Kunden explizit **abgeschaltet** werden (siehe MC1269223).
- **System-Generated Logs für manche Graph-Services nicht in EUDB** (in „Services temporarily excluded from EUDB" aufgeführt) — typischerweise Telemetrie, keine Customer Data, aber für sehr strenge Compliance-Kunden relevant.
- **App-Only-Token haben keinen User-Context-Nachweis** — Audit zeigt App-Identity, nicht welcher Admin den Call-Trigger war. → Für DSGVO-Zweckbindung-Nachweis zusätzliches App-internes Logging nötig.
- **Beta-Endpoints nicht in allen Compliance-Attestations** — wer ISO 27001 / SOC 2 vollständig braucht, nur v1.0.

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Product Page | Microsoft Graph Overview | https://learn.microsoft.com/en-us/graph/overview | 2026-04-22 | Strategische Einordnung |
| Docs Hub | Graph Docs Hub | https://learn.microsoft.com/en-us/graph/ | 2026-04-22 | API-/SDK-Updates |
| Quickstart | Graph Tutorials | https://learn.microsoft.com/en-us/graph/tutorials | 2026-04-22 | PoC/Demo-Pfad |
| Permissions | Permissions Reference | https://learn.microsoft.com/en-us/graph/permissions-reference | 2026-04-22 | Scope-Tabelle für Scope-Design |
| Throttling | Throttling Guidance + Limits | https://learn.microsoft.com/en-us/graph/throttling · https://learn.microsoft.com/en-us/graph/throttling-limits | 2026-04-22 | Rate-Limit-Änderungen |
| What's New | What's New in Graph | https://learn.microsoft.com/en-us/graph/whats-new-overview | 2026-04-22 | Feature-Roadmap |
| Graph Explorer | Interactive Tool | https://developer.microsoft.com/en-us/graph/graph-explorer | 2026-04-22 | Ad-hoc Endpoint-Test |
| Copilot APIs | Copilot APIs Overview | https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/copilot-apis-overview | 2026-04-22 | `/copilot/*`-Endpunkte |
| Retrieval API | Copilot Retrieval | https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/api/ai-services/retrieval/overview | 2026-04-22 | RAG-Grounding-Endpunkte |
| Connectors | Copilot Connectors | https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/overview | 2026-04-22 | External-Data-Ingestion |
| OBO + Agent ID | Agent OBO Flow | https://learn.microsoft.com/en-us/entra/agent-id/identity-platform/agent-on-behalf-of-oauth-flow | 2026-04-22 | Auth-Pattern für Agents |
| EUDB | EU Data Boundary | https://learn.microsoft.com/en-us/privacy/eudb/eu-data-boundary-learn | 2026-04-22 | Residency-Einordnung |
| Dev Blog | M365 Dev Blog | https://devblogs.microsoft.com/microsoft365dev/ | 2026-04-22 | Feature-Ankündigungen |
| GitHub (Docs) | microsoft-graph-docs-contrib | https://github.com/microsoftgraph/microsoft-graph-docs-contrib | 2026-04-22 | Doc-Änderungen vor Publish |
| GitHub (SDK Python) | msgraph-sdk-python | https://github.com/microsoftgraph/msgraph-sdk-python | 2026-04-22 | Python-SDK-Updates |
| MCP Server (offiziell) | microsoft/EnterpriseMCP | https://github.com/microsoft/EnterpriseMCP | 2026-04-22 | MCP-Integration |
| Pricing Page | Graph is free (verification) | https://learn.microsoft.com/en-us/graph/overview | 2026-04-22 | Falls MS Pricing einführt |

### Secondary (Analysten & vertrauenswürdige Industrie)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| Practical365 (Tony Redmond) | https://practical365.com/category/microsoft-graph/ | 2026-04-22 | Pragmatische Admin-Sicht, sehr zuverlässig |
| Office 365 IT Pros | https://office365itpros.com/ | 2026-04-22 | Detail-Reporting zu neuen Endpunkten (z.B. Retrieval-API) |
| MSEndpointMgr | https://msendpointmgr.com/ | 2026-04-22 | Intune/Endpoint-Fokus, gute Throttling-Deep-Dives |
| Voitanos (Andrew Connell) | https://www.voitanos.io/blog/ | 2026-04-22 | Dev-Fokus, gute Delta-Query-Patterns |

### Tertiary (Community / MVPs)

| Autor | Blog / Kanal | Zuletzt gesichtet | Warum relevant? |
|-------|--------------|-------------------|-----------------|
| Merill Fernando (MVP) | https://github.com/merill/lokka · https://mc.merill.net | 2026-04-22 | Pflegt `lokka` MCP-Server + M365-Message-Center-Archiv |
| Laura Kokkarinen (MVP) | https://laurakokkarinen.com | 2026-04-22 | Didaktisch starke Einführungs-Artikel |

### Events / Konferenzen zum Beobachten

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Build 2026 | Mai 2026 | Graph-Agent-Management-APIs GA, neue MCP-Server-Features |
| Microsoft Ignite 2026 | Nov 2026 | Nächste Copilot-API-Welle, EUDB-Erweiterungen, Agent-ID-OBO-Expansion |
| AI Tour Zürich 2026 | 29.04.2026 | Regionale EU-Compliance-Details |

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Kompletter Deep-Dive: Auth-Flows inkl. Entra Agent ID OBO, Kern-Endpunkte SMB, Throttling-Patterns, DSGVO-Einordnung | https://learn.microsoft.com/en-us/graph/ |
| 2026-04-22 | Hongyu | Initial Stub, watch: standard, Status GA | Arbeitsauftrag |
