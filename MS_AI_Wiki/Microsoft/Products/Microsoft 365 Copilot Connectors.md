---
watch: standard
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Copilot Connectors, Graph Connectors, Microsoft Graph Connectors]
moc:
  - "[[Microsoft MOC]]"
  - "[[Copilot MOC]]"
---

# Microsoft 365 Copilot Connectors

*Das **Graph-Connector-Framework** für [[Microsoft 365 Copilot]] — speist externe Datenquellen (Salesforce, ServiceNow, Jira, Confluence, Box, SAP u. a.) in den Tenant-Graph-Index ein, damit Copilot ohne Prompt-Engineering auf diese Daten grounden kann. Ehemals „Microsoft Graph Connectors"; seit 2024 konsolidiert unter dem Copilot-Branding.*

> **Analogie:** Was ETL-Connectors für ein klassisches Data Warehouse waren, sind Copilot Connectors für den Graph-Index — eine Brücke zwischen Dritt-Systemen und M365-Kontext, inkl. ACL-Propagation.

---

## Einsatz

### Job-to-be-done

When I will, dass [[Microsoft 365 Copilot]] auf Daten in unseren Drittsystemen (CRM, ITSM, Wiki, Dokumenten-Management) grounden kann, I want to diese Quellen als indexierte Items in den Tenant-Graph einspeisen — mit User-korrekten ACLs — so I can Copilot-Antworten direkt aus diesen Systemen bekommen, ohne dass ich die Daten vorher nach SharePoint migrieren muss.

### Trigger-Signale

- *„Copilot weiß nichts von unserem Salesforce — machbar?"*
- *„Unsere Confluence-Wiki müsste durchsuchbar sein, sonst bringt Copilot uns wenig."*
- *„ServiceNow-KB ist unser zentrales Knowledge-Asset — wie bekommen wir das in Copilot?"*
- *„Wir wollen, dass Copilot Tickets aus Jira sieht, aber **nur** die, die der User auch in Jira sehen darf."*

### Einsatz-Szenarien

1. **CRM-Grounding** — Salesforce oder Dynamics-Contacts/Opps/Leads/Accounts in Copilot. Typisch für Vertriebs-/Service-Teams im DACH-SMB.
2. **ITSM-/Knowledge-Connectors** — ServiceNow-Knowledge + Jira-Issues für IT-Support-Teams, die First-Level-Fragen per Copilot beantworten lassen.
3. **Wiki- und Docs-Repositories** — Confluence (Cloud + On-Prem) und Box für Produkt-Dokumentation/Projekt-Wikis außerhalb SharePoint.
4. **LOB-/SAP-Daten über Custom Connector** — proprietäre Systeme (Warenwirtschaft, HR-System) via Connector-SDK in den Index. Meist mit Partner-Implementierung.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | M365 Copilot-Lizenz vorhanden (sonst kein Zugriff auf Copilot-Grounding). E5 empfohlen für volle Purview-Integration. |
| **Tenant / Infrastruktur** | M365-Tenant · Entra ID · ggf. On-Prem-Gateway (Connector-Agent) für Confluence/Jira-On-Prem/SAP |
| **Skills / Rollen** | Search-Admin (OOB-Connector-Config) · für Custom Connectors: .NET- oder Python-Dev mit Graph-SDK-Kenntnissen |
| **Compliance-Rahmen** | DSGVO-Setup · Source-System ACLs müssen auf Entra-Identitäten mappbar sein (User-Mapping via UPN/Mail oder Group-Mapping) |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup OOB-Connector** | 0,5–2 Tage pro Connector (Auth + Schema-Config + ACL-Mapping + initialer Crawl) |
| **Setup Custom Connector** | 10–25 Dev-Tage je nach Source-System-Komplexität |
| **Laufende Lizenzkosten** | In Copilot-Lizenz inkludiert bis 50 Mio Items/Tenant (siehe § Status & Pricing) |
| **Laufender Betrieb** | 0,5 Tag/Monat Monitoring (Crawl-Health, Schema-Drift, Re-Auth) |

### Empfehlung

**Status:** 🟢 **Empfehlen**, wenn der Kunde Copilot bereits lizenziert hat **und** einen klaren Business-Case für Grounding auf ein spezifisches Drittsystem nennen kann. Für < 1.000 Dokumente ist direkte Anbindung als MAF-/Copilot-Studio-Tool oft wirtschaftlicher.

**Nächster Schritt für Journai:** Standardisiertes „Connector-Assessment" (halber Tag) — Source-System-Inventar, Item-Volume-Schätzung, ACL-Mappability-Check, Delta-Fähigkeit. Ergebnis: Entscheidung Connector vs. Tool vs. Foundry IQ (siehe § Abgrenzung).

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | GA · Connector-Gallery wächst kontinuierlich (>100 Connectors, davon 35 neue MS-gebaute seit Nov 2025) |
| **GA-Datum** | Seit 2022 als „Graph Connectors", 2024 Rebranding zu „Copilot Connectors" |
| **Pricing (Runtime)** | In M365-Copilot-Lizenz ($30/User/Monat) inkludiert — keine separate Connector-Gebühr |
| **Index-Quota** | **50 Mio Items/Tenant** · Default **5 Mio/Connection**, auf Request kostenlos bis 50 Mio/Connection hochsetzbar. Overage: kein publizierter Tarif — MS-Account-Team fragen. |
| **Hidden Costs** | Partner-Connectors (z. B. Box) können separate Source-Lizenzen voraussetzen · On-Prem-Agent-Hosting (IaaS-Kosten beim Kunden) |
| **Region-Verfügbarkeit** | An Tenant-Region gebunden · für EU-Tenants gilt die EU Data Boundary des Copilot-Haupt-Service |

---

## Kernkonzept

### Was es im Kern ist

Copilot Connectors sind **Indexing-Pipelines**, die externe Daten via Microsoft Graph Connectors API in den Tenant-eigenen Search-Index einspeisen. Jeder Connector liefert (a) **Items** (Content + Metadaten), (b) **Schema** (welche Properties sind searchable/retrievable), und (c) **ACLs** (welche Entra-Identität darf das Item sehen). Copilot zieht bei Grounding aus diesem Index über **Unified Search** — identisch zum SharePoint-Content, nur dass die Source extern ist.

Zwei Realisierungs-Modi:

1. **Prebuilt-Connectors (Gallery)** — MS- oder Partner-gebaut (Salesforce, ServiceNow, Jira, Confluence, Box, u. v. m.). Config-driven, meist via M365 Admin Center oder Search Admin Center.
2. **Custom Connectors** — eigene App gegen Connectors API / Connectors SDK (C# oder Java). Für proprietäre LOB-Systeme, SAP-Spezialfälle, Legacy-Datenbanken.

Die wichtige architektonische Wette: Microsoft behandelt externe Daten **als ob sie M365-nativ wären** — mit demselben Permissions-Modell, denselben Purview-Labels (via Tagging), denselben Copilot-Grounding-Mechanismen. Das ist konsequent anders als Foundry IQ, das externe Daten als separater RAG-Index führt (siehe § Abgrenzung).

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| Source-System | Salesforce/ServiceNow/Jira/Confluence/Box/SAP/Custom | Dritt-System |
| Connector | Crawl + Schema-Transform + ACL-Mapping | MS/Partner/Custom |
| Graph Connector API | Ingestion-Endpoint + Index-Management | [[Microsoft Graph]] |
| Index | Tenant-Search-Index (erweitert um externe Items) | M365 Tenant |
| Grounding | Copilot zieht Items via Unified Search | [[Microsoft 365 Copilot]] |

### Kern-Fähigkeiten

#### Prebuilt-Connector-Gallery *(Start-Punkt für 90 % der SMB-Fälle)*

Über **100 Prebuilt-Connectors** (Stand April 2026) — davon ~65 von Microsoft selbst gebaut (35 neue GA-Connectors allein seit Nov 2025), Rest von Partnern. Top-10 für DACH-SMB: **Salesforce, ServiceNow (Knowledge + Catalog), Jira Cloud + Data Center, Confluence Cloud + On-Prem, Box, Azure DevOps, MediaWiki, Zendesk, SAP (Preview via Power Platform)**.

Config-driven: Admin authentifiziert gegen Source-System, wählt Datenbereich, definiert Refresh-Intervall, und MS betreibt die Crawl-Pipeline. Minimaler Code-Anteil.

#### Custom Connectors via Connectors SDK / API

Für proprietäre Systeme: Connector-App registrieren (Entra App-Registration mit `ExternalConnection.ReadWrite.OwnedBy`-Permission), Schema definieren, Full- und Incremental-Crawls implementieren.

Minimaler Schema-Snippet (C#, Connectors SDK):

```csharp
var schema = new Schema
{
    BaseType = "Item",
    Properties = new List<Property>
    {
        new() { Name = "title", Type = PropertyType.String,
                IsQueryable = true, IsRetrievable = true, IsSearchable = true,
                Labels = new() { Label.Title } },
        new() { Name = "priority", Type = PropertyType.String,
                IsQueryable = true, IsRetrievable = true, IsRefinable = true },
        new() { Name = "assignee", Type = PropertyType.String,
                IsQueryable = true, IsRetrievable = true,
                Aliases = new() { "owner" } },
        new() { Name = "updatedAt", Type = PropertyType.DateTime,
                IsQueryable = true, IsRetrievable = true,
                Labels = new() { Label.LastModifiedDateTime } }
    }
};
```

**Schema-Restriktionen**: max. 32 Zeichen pro Property-Name, nur alphanumerisch · nur `String`/`StringCollection` können `searchable` sein · `Content`-Property muss `searchable` sein. *{TODO: aktueller Limit-Check bei Labels — MS hat das Label-Set 2025 erweitert}*

#### Incremental Indexing via Delta-Crawl

Zwei Crawl-Modi:
- **Full Crawl** — beim Initial-Setup und bei Schema-Breaking-Changes
- **Incremental Crawl** — Delta seit letztem Checkpoint. Connector implementiert `GetCrawlStream` mit *Crawl-Progress-Marker* (Timestamp, Change-Token oder Source-spezifischer Cursor). Auch Deletes werden über diesen Stream propagiert.

**Praxis-Fallstrick**: Wenn der Progress-Marker korrupt wird (Source-System-Migration, Zeitzonen-Bug), muss Full-Crawl angestoßen werden — bei 5 Mio Items nicht trivial. *Gegenmittel: Checkpoint-Persistenz in externem Blob, nicht im Connector-Runtime.*

#### ACL-Propagation & Security Trimming *(der kritischste Teil)*

Jedes Item wird mit einem **ACL-Array** indexiert: Liste von Entra-Identitäten (User-GUIDs, Group-GUIDs, `everyone`), pro Identität `grant` oder `deny`. Bei jeder Copilot-Grounding-Query filtert der Index automatisch: Items, für die der anfragende User keine `grant`-ACL hat, werden **nie retourniert** („Security Trimming").

Zwei Mapping-Strategien:
- **Entra-ID-Mapping** — Source-System-User haben Entra-Identities (UPN/Mail-Match). Präferiert.
- **Source-ACL-Passthrough** — wenn Source-System ein eigenes Gruppen-Modell hat, das nicht Entra-mappbar ist, Custom-Logik nötig.

**Fallstrick ohne Gnade**: Falsches ACL-Mapping → Copilot zeigt Daten, die der User in der Source **nicht** sehen darf → DSGVO-Leak. Vor Produktiv-Rollout: mit mindestens 3 User-Personas stichprobenhaft Queries gegen erwartete Sichtbarkeit vergleichen.

#### Purview-Integration

Items können mit Sensitivity-Labels getaggt werden, wenn der Connector sie aus dem Source-System lesen und in `contentClass`/custom Properties mappen kann. Copilot respektiert dann — identisch zu SharePoint-Content — Label-basierte DLP-Policies (Policy-Location „M365 Copilot and Copilot Chat", seit 2026 verfügbar). *{TODO: wie weit Auto-Classification bei externen Connectors greift — aktuell noch stark Source-abhängig}*

### Typischer Workflow

1. **Assessment** — Source-System + Item-Volume + ACL-Mappability klären. Entscheidung: Prebuilt vs. Custom vs. MAF-Tool.
2. **Auth-Setup** — Service-Account oder App-Registration im Source-System; Entra App mit `ExternalConnection`-Permissions.
3. **Schema + Mapping** — Bei Prebuilt: über Admin-UI. Bei Custom: Schema-Code + Property-Labels (`Title`, `Url`, `IconUrl`, `LastModifiedBy`, `LastModifiedDateTime` sind Pflicht-Kandidaten für gutes Copilot-Grounding).
4. **Initial Full Crawl** — kann Stunden bis Tage dauern. Monitoring über Search Admin Center.
5. **Delta-Schedule** — typisch 15–60 Minuten. Monitoring-Alert bei Crawl-Failures aufsetzen.
6. **Validation** — Copilot-Grounding mit 10–20 realen Queries testen, ACL-Korrektheit stichprobenweise verifizieren.

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| Builder (Journai) | Connectors-SDK (C# oder Java) · Graph-API-Auth · ACL-Design-Patterns |
| Admin (Kunde) | M365 Search Admin Center · Entra App-Registrations · Source-System-Admin-Rights |
| End-User | Keine — Copilot zeigt externe Content-Treffer transparent mit Source-Icon |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Kein Write-Back in Source-System** — Connectors sind read-only in den Index | Für Write-Back: [[Copilot Studio]]-Agent mit Action oder MAF-Tool mit Source-System-API |
| **Kein semantisches Re-Ranking wie bei [[Azure AI Search]]** — klassische Keyword-Index-Logik plus Copilot-LLM-Re-Rank on top | Für Vektor-basiertes RAG auf denselben Quellen: [[Foundry IQ]] mit Azure AI Search |
| **50 Mio Items Hard-Cap/Tenant** — bei großen Enterprises kritisch | Selektiv crawlen · nur Hot-Content indexieren · Foundry IQ als parallele RAG-Ebene |
| **Kein Fine-Grained Tenant-Isolation bei Multi-Tenant-Sources** — alle Connector-Daten landen im Tenant-Index | Multi-Tenant-Customers: separate Connector-Instanzen pro Mandant |
| **Keine Real-Time-Grounding** — Index-Delay typisch 15+ Minuten | Für Live-Daten: Tool/Action statt Connector |

### Typische Fallstricke im Einsatz

- **ACL-Mapping falsch → Datenleck** — Der #1-Fallstrick. Source-System-User ohne Entra-Pendant, Service-Accounts als Fallback-Owner, nested Groups, die nicht expandiert werden. *Gegenmittel: Vor Produktiv-Rollout mit 3 User-Personas Sichtbarkeits-Matrix prüfen; Security-Review als Pflicht-Step.*
- **„Connector einmal einrichten, Rest läuft"** — Schema-Änderungen im Source-System (neue Custom-Fields in Salesforce, Workflow-State-Updates in Jira) brechen Crawls regelmäßig. *Gegenmittel: Crawl-Health-Alert + Schema-Drift-Review monatlich.*
- **Für kleine Datenmengen Overkill** — < 1.000 Items: Tool-basierte Anbindung an [[Copilot Studio]] oder [[Microsoft Agent Framework]] liefert vergleichbares Ergebnis bei einem Bruchteil des Aufwands.
- **50 Mio Item Default missverstanden** — pro Tenant, nicht pro Connection. Bei 10 Connectors à 5 Mio Items → Tenant-Cap ausgeschöpft.
- **On-Prem-Agent unterschätzt** — Confluence/Jira-On-Prem + SAP brauchen einen lokalen **Connector-Agent** auf Windows-VM mit Netzwerk-Zugang zur Source. Hosting + Updates + HA sind Kunden-Betrieb.
- **Custom Connector ohne Delta-Support gebaut** — nur Full-Crawl implementiert, dann unbrauchbar bei > 100k Items wegen Crawl-Dauer. *Gegenmittel: Delta-Design bereits in Architektur-Phase.*

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| [[Microsoft 365 Copilot]] | Primär-Konsument des Index | GA | keine — automatisch |
| [[Microsoft Graph]] | Ingestion-API + Index-Host | GA | Connector-SDK-Lernkurve bei Custom |
| [[Microsoft Purview]] | Sensitivity-Label-Respekt + DLP-Policies | GA | Label-Propagation aus Source nicht trivial |
| [[Copilot Studio]] | Agents können denselben Index über Unified Search nutzen | GA | Knowledge-Source-Konfig separat |
| [[Azure AI Search]] / [[Foundry IQ]] | **Keine Cross-Use** — Foundry-IQ-Sources ≠ Copilot-Connector-Sources | — | Separate Indexe, Daten 2× pflegen |
| [[Microsoft Entra Suite]] | Identity-Provider für ACL-Mapping | GA | Nested-Group-Expansion-Fallstricke |
| [[Agent 365]] | Agents erben Connector-Zugriff über User-Identity-Delegation | GA | Agent-Identity-Permissions klar setzen |

### Third-Party (Top-10 Prebuilt-Connectors für DACH-SMB)

| Connector | Status | Scope | Hinweis |
|-----------|--------|-------|---------|
| Salesforce CRM | GA | Contacts, Opps, Leads, Cases, Accounts | Salesforce-Lizenz vorausgesetzt |
| ServiceNow Knowledge | GA | KB-Artikel | Top-Use-Case ITSM |
| ServiceNow Catalog | GA | Catalog-Items | Oft parallel zu Knowledge |
| Jira Cloud | GA | Issues | |
| Jira Data Center | GA | Issues + Project Data | On-Prem-Agent nötig |
| Confluence Cloud | GA | Pages, Blogs | |
| Confluence On-Prem | GA | Pages | On-Prem-Agent nötig |
| Box | GA (Box-managed) | Files | Enablement über Box-Formular |
| Azure DevOps | GA | Work Items, Wikis, Code | |
| SAP (via Power Platform) | 🟡 Preview | Knowledge-Quellen via OData | GA-Datum unklar *{TODO}* |

### APIs / Protokolle

- **Microsoft Graph Connectors API** (v1.0 GA) — primäres Ingestion-Protokoll
- **Microsoft Graph Connectors SDK** (C# + Java) — für Custom Connectors
- **MCP-Server-Integration** — ab Ignite 2025 können Copilot Agents via MCP auf Connector-Daten zugreifen (über 1.400 Systeme via MCP + Power Platform + Graph kombiniert adressierbar)

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | Index liegt in Tenant-Region (EU-Tenants: EU Data Boundary des Copilot-Haupt-Services gilt) · für Flex-Routing-Details siehe [[Microsoft 365 Copilot]] |
| **Prompts & Outputs** | Nicht für MS-Training genutzt · Standard M365 DPA gilt |
| **DPA** | Von Standard MS Online Services DPA abgedeckt · keine separate Connector-Anlage nötig |
| **EU-AI-Act** | Limited Risk (Grounding-Layer, keine autonome Entscheidung) |

### Microsoft-Compliance-Stack

- **ACL-Security-Trimming** — Pflicht-Mechanismus, nicht optional. Jedes Item trägt ACL.
- **Purview-Sensitivity-Labels** — respektiert, wenn Source-System Labels liefert und Connector sie mappt.
- **DLP-Policy-Location „M365 Copilot and Copilot Chat"** — Content mit bestimmten Labels explizit vom Grounding ausschließbar.
- **Unified Audit Log** — jede Connector-Query durch Copilot protokolliert.

### Bekannte Compliance-Lücken

- **Source-System-Labels selten automatisch übernommen** — außer Salesforce-Sensitivity oder Confluence-Space-Permissions gibt es wenig Out-of-Box-Label-Mapping. Custom-Logik im Connector nötig.
- **On-Prem-Agents laufen beim Kunden** — Network-Trust-Boundary + Patch-Management ist Kunden-Verantwortung.
- **ACL-Drift** — wenn Source-ACLs sich ändern, aber Incremental-Crawl die ACL-Änderung nicht als „Change" erkennt, kann Stale-ACL entstehen. *Gegenmittel: ACL-Full-Refresh-Cadence (z. B. wöchentlich) einplanen.*

---

## Abgrenzung: Copilot Connectors vs. Foundry IQ

*Die häufigste Verwechslungsfrage 2026 — beide grounden AI auf externe Daten, aber für unterschiedliche Konsumenten.*

| Dimension | **Copilot Connectors** | **[[Foundry IQ]]** |
|-----------|------------------------|--------------------|
| **Konsument** | [[Microsoft 365 Copilot]] + Copilot-Studio-Agents | Foundry Agent Service / Azure-AI-Foundry-Agents |
| **Index-Backend** | Tenant-Search-Index (klassisch Keyword + Copilot-LLM-Re-Rank) | [[Azure AI Search]] mit Vektor + Semantic Re-Rank |
| **Ingestion** | Prebuilt-Connectors (100+) oder Custom via Graph Connectors SDK | Native Azure-AI-Search-Indexer + Custom Ingestion |
| **ACL-Modell** | Entra-ID-basierte ACLs, Security Trimming by-default | Source-spezifisch, oft RBAC auf Index-Ebene |
| **Cross-Use** | **Nicht möglich**: Foundry-IQ-Knowledge ≠ Copilot-Knowledge, Indexe separat | — |
| **Pricing** | In Copilot-Lizenz inkludiert | Azure-AI-Search-SKU + Foundry-Consumption |
| **Sweet Spot SMB** | Grounding für Copilot-User auf CRM/ITSM/Wiki | Custom-Agent auf Product-Docs mit hochwertigem RAG |

**Empfehlungs-Regel:** Copilot-Grounding → Copilot Connectors. Custom-Agent mit RAG-Qualität-Priorität → Foundry IQ auf Azure AI Search. **Nicht** beides für denselben Content doppelt pflegen — das wird zum Governance-Albtraum.

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Overview | Copilot Connectors Overview | https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/overview | 2026-04-22 |
| Extensibility Hub | Copilot Extensibility | https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/ | 2026-04-22 |
| Connector Gallery (MS) | Microsoft-built Gallery | https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/connectors-gallery-microsoft | 2026-04-22 |
| Connector Gallery (Partner) | Partner-built Gallery | https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/connectors-gallery-partners | 2026-04-22 |
| SDK Overview | Custom Connector SDK | https://learn.microsoft.com/en-us/graph/custom-connector-sdk-overview | 2026-04-22 |
| SDK Best Practices | SDK Best Practices | https://learn.microsoft.com/en-us/graph/custom-connector-sdk-best-practices | 2026-04-22 |
| API Reference | Connectors API v1.0 | https://learn.microsoft.com/en-us/graph/api/resources/connectors-api-overview | 2026-04-22 |
| Index Licensing & Quota | Licensing + 50M-Quota | https://learn.microsoft.com/en-us/microsoftsearch/licensing | 2026-04-22 |
| API Limits | Connectors API Limits | https://learn.microsoft.com/en-us/graph/connecting-external-content-api-limits | 2026-04-22 |
| Search Schema | Manage Search Schema | https://learn.microsoft.com/en-us/microsoftsearch/manage-search-schema | 2026-04-22 |
| Prerequisites | Deployment Prereqs | https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/prerequisites | 2026-04-22 |
| DevBlog | Graph Connectors Dev Blog | https://devblogs.microsoft.com/microsoft365dev/use-microsoft-graph-connectors-to-securely-bring-external-content-into-microsoft-365/ | 2026-04-22 |
| TechCommunity | Expanded Catalog Nov 2025 | https://techcommunity.microsoft.com/blog/microsoft365copilotblog/fueling-new-experiences-in-microsoft-365-copilot-with-expanded-copilot-connector/4493246 | 2026-04-22 |
| Foundry IQ FAQ (Abgrenzung) | Foundry IQ FAQ | https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/foundry-iq-faq | 2026-04-22 |

### Secondary (Analysten & Community)

| Quelle | Link | Einschätzung |
|--------|------|--------------|
| Practical365 | https://practical365.com/extending-sharepoint-enterprise-search-with-microsoft-graph-connectors/ | Praxis-Sicht für Admins |
| Directions on Microsoft (Ignite 2025) | https://www.directionsonmicrosoft.com/microsoft-ignite-2025-ten-things-you-need-to-know/ | Analyst-Einordnung Connector-/MCP-Expansion |
| Liam Cleary (helloitsliam) | https://helloitsliam.com/2026/01/06/secure-plugins-agents-and-graph-connectors-in-copilot/ | Security-fokussierter MVP-Blog |
| Aakash Bhardwaj | https://aakashbhardwaj619.github.io/2020/07/19/Graph-Connector-Crawler-Function.html | Azure-Functions-Implementierungsmuster (älter, aber Patterns gelten) |

### Events

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Build 2026 | Mai 2026 | Neue Prebuilt-Connectors · SDK-Updates |
| AI Tour Zürich 2026 | 29.04.2026 | EU-Details Connector-Rollouts |
| Microsoft Ignite 2026 | November 2026 | Nächste Connector-Welle + MCP-Integration |

---

## UNCLEAR — offene Fragen

1. **SAP-Connector GA-Datum** — weiterhin Preview via Power Platform; nativer Connector angekündigt, kein fixes GA
2. **Overage-Pricing jenseits 50 Mio Items** — nicht publiziert, Account-Team-Gespräch nötig
3. **Automatische Purview-Label-Propagation aus Salesforce/Confluence** — weiterhin weitgehend manuell, Roadmap unklar
4. **Label-Erweiterungen im Connector-Schema 2025/26** — MS hat Property-Labels erweitert, komplette Liste nicht in einer Docs-Seite konsolidiert

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive Copilot Connectors: OOB-Inventar (>100 Connectors), Custom-Schema-Snippet, Security Trimming via ACLs, 50M-Quota-Details, Abgrenzung zu Foundry IQ | https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/ |
| 2026-04-22 | Hongyu | Initial Stub, watch: standard, status: GA | Arbeitsauftrag |
