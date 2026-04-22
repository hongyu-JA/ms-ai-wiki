---
watch: passive
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Purview Data Map, Purview Data Catalog, Azure Purview]
moc:
  - "[[Microsoft MOC]]"
  - "[[Security & Identity MOC]]"
---

# Purview Data Map

*Die **Data-Governance-Säule** von [[Microsoft Purview]] — ehemals „Azure Purview Data Catalog" (2020), seit 2022 rebranded und konsolidiert. Data Map ist ein **technisches Metadaten-Fundament**: scannt Data Assets in Azure + Multi-Cloud (AWS S3, GCP BigQuery, Snowflake) + On-Prem (Oracle, SAP HANA, Teradata) + SaaS (Power BI, Salesforce), extrahiert Schema/Klassifikationen/Lineage und speichert sie als durchsuchbares Asset-Inventar. **Persona: Data Engineer / Data Steward — nicht Security Ops.** Seit 2025 läuft der Nachfolger **[[Purview Unified Catalog]]** (Pay-as-you-go, Data-Product-zentriert) darauf auf.*

> **Analogie:** Was **Collibra** oder **Alation** als Data-Catalog-Schicht für Data-Engineering-Teams sind, ist Purview Data Map für Azure-zentrische Data-Estates — mit dem Vorteil, dass Fabric/Power-BI/Synapse-Lineage **nativ** hineingereicht wird, statt per Connector rekonstruiert zu werden.

---

## Einsatz

### Job-to-be-done

When I **als Data-Engineering-Team in einem Mittelständler mit wachsendem Data-Lakehouse** (Azure SQL + Fabric + ggf. Snowflake/SAP) nicht mehr weiß, welche Tabellen wo liegen, wer die fachlich „owned", welche Klassifikation sie haben und wie sie miteinander verknüpft sind, **I want to** ein **automatisiert gepflegtes Asset-Inventar mit Lineage und Business-Glossary**, **so I can** Data-Consumer Self-Service geben („wo finde ich Customer-Master-Daten?"), Impact-Analysen fahren („was bricht, wenn ich diese Spalte ändere?") und Data-Products im Fabric-Umfeld governance-fest herausgeben.

**Wichtig für SMB-AI-Kontext:** Data Map beantwortet **nicht** „darf Copilot diese Daten sehen?" (das ist [[Purview DSPM]]) — sondern **„welche Daten existieren überhaupt in meinem Unternehmen?"**. Zwei völlig getrennte Fragestellungen, zwei Personas.

### Trigger-Signale

- „Wir bauen gerade ein Data Lakehouse in [[Microsoft Fabric]] und brauchen ein Catalog darauf."
- „Unsere Data Scientists fragen ständig, welche Tabellen wofür gut sind — wir haben kein zentrales Verzeichnis."
- „Wir migrieren von on-prem Oracle nach Azure und brauchen Lineage-Nachweis für den Fachbereich."
- „Der CDO will Data-Products-Katalog mit Self-Service-Access — mesh-ähnlich."
- Kommt **nicht** von Security/Compliance — kommt typischerweise vom **Data-Engineering-Lead** oder **CDO-Büro**.

### Einsatz-Szenarien

1. **Fabric-Lakehouse-Governance-Begleitung** — Kunde baut Data Lakehouse in Fabric auf, will Metadata-Tracking + Lineage + Data-Product-Konzept. Unified Catalog (auf Data Map) ist für Fabric **nativ integriert**; Lineage zwischen Fabric-Items, Power-BI-Reports und Bronze/Silver/Gold-Medallion-Tabellen wird automatisch erfasst. **Für Journai relevant nur**, wenn der Kunde **sowohl** Fabric-Kompetenz aufbaut **als auch** uns bei der Governance-Konzeption einbindet.
2. **Multi-Cloud-Data-Catalog bei Enterprise-SMB** — Kunde mit >500 Mitarbeitenden hat Azure + AWS S3 (Daten-Archiv) + Snowflake (Analytics) + SAP HANA (ERP). Data Map deckt alle vier Quellen mit nativen Connectors ab — das ist der **Sweet Spot**. **Nicht der Journai-Kernfall** (kleinere SMB haben meist nur M365+Azure).
3. **TODO — AI-Grounding-Vorbereitung für Copilot in Fabric** — *(eigene Einschätzung)* wenn Fabric Data Agents auf Lakehouse-Daten antworten sollen, kann ein Unified-Catalog-Glossary die Qualität der Antworten heben (business-term-aware). Konkreter Kundenfall bei uns noch **nicht** vorhanden.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | **Eigenes Purview-Governance-SKU** — **nicht** Teil von M365 E5 oder Purview Suite. Pay-as-you-go über Azure-Subscription; seit 2025-01-06 neues Consumption-Modell (governed assets/day + DGPUs für Data Quality) |
| **Tenant / Infrastruktur** | **Azure-Subscription** (zwingend) · Resource Group · Purview-Account (früher: Data-Map-Capacity-Units; ab Unified Catalog: PAYG) · Service Principal mit Scan-Rechten auf Ziel-Quellen |
| **Skills / Rollen** | **Data Engineer** mit Python/SQL · **Data Steward** für Glossary-Pflege · Azure-Admin für Identity-/Netzwerk-Setup (Private Endpoints bei Enterprise-Kunden) |
| **Compliance-Rahmen** | Standard MS-DPA deckt Purview · **EU Data Boundary** für Data-Map-Metadaten (tatsächliche Daten bleiben in Quell-System!) · Bei SAP/Oracle: Netzwerk-Integration (Self-Hosted Integration Runtime) klären |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup Basis-Data-Map (1 Azure-Quelle, 1 Fabric)** | 3–5 Beratertage — meistens durch Kunden-interne Data-Engineers selbst machbar, Journai nur Coaching |
| **Multi-Cloud-Catalog + Glossary + Lineage-Baseline** | 15–30 Beratertage — jenseits des Journai-SMB-Kerns, eher Enterprise-Projekt |
| **Laufende Kosten (klassisches Modell)** | 1 Capacity Unit ≙ 25 ops/sec + 10 GB Metadaten — **ca. $0.40/Stunde** *(eigene Einschätzung, auf Basis Azure-Pricing-Seite — exakte Rate variiert; **TODO** verifizieren)*. Bei kleinem Fabric-Lakehouse typisch 1–2 CUs → €300–600/Monat |
| **Laufende Kosten (PAYG / Unified Catalog, ab 2025-01-06)** | **Pro governed asset/Tag** + **DGPU pro Data-Quality-Run** (0.02–0.04 DGPU für 1M Rows, Basic-SKU) — *TODO: EUR/Region-Raten aus Azure Pricing Calculator ziehen, nicht zentral publiziert* |
| **Laufender Betrieb** | 0.5–1 FTE Data-Steward bei Kunde — **nicht Journai-billable** in der Regel |

### Empfehlung

**Status:** 🟡 **Beobachten** — für Journai's AI-Kernfokus (Copilot / Agents / RAG auf M365-Daten) **nicht in erster Reihe relevant**. Data Map wird erst ab der **Data-Engineering-Tiefe** interessant, die typische Journai-SMB-Kunden **nicht** haben. Sobald ein Kunde ernsthaft [[Microsoft Fabric]] einführt oder Multi-Cloud-Lakehouses baut, kommt es auf den Tisch — bis dahin: kennen, nicht aktiv anbieten.

**Abgrenzung zu [[Purview DSPM]] (entscheidend!):**
- **Data Map = Data Governance.** Wo liegen Daten, welches Schema, welche Business-Bedeutung, welche Lineage. Persona: Data Engineer.
- **DSPM = Data Security.** Sind Daten überexponiert, wer greift zu, welche Risk-Score. Persona: CISO / DPO / Compliance Officer.
- **Beides ist Purview, aber zwei separate Säulen**: eigene Portale (Unified Catalog vs. DSPM-Dashboard), eigene SKUs (Azure-PAYG vs. Purview Suite $12/user/month bzw. E5), eigene Personas. Journai-Kernfokus ist DSPM, **nicht** Data Map.

**Nächster Schritt für Journai:** **Nicht aktiv verfolgen.** Bei Fabric-Kunden 1x erwähnen („falls ihr Catalog braucht: Unified Catalog ist der Weg, eigenes Consumption-Modell, Data-Engineering-Team-Thema"). Kein eigenes Angebot aufbauen, keine PoC-Investition. Bei konkreter Kunden-Nachfrage: verweisen auf Microsoft-Partner mit Data-Engineering-Fokus oder Spezialisten einkoppeln.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | **GA** (Data Map selbst seit 2020 als Azure Purview, 2022 rebranded als Microsoft Purview Data Map) · **Unified Catalog** rollt seit 2024/2025 aus und ersetzt das klassische Data-Catalog-UI · **Classic Data Map** weiter für Altkunden verfügbar, aber kein Ziel-Pfad |
| **GA-Datum** | Azure Purview GA: 2021-09 · Rebrand zu „Microsoft Purview Data Map": 2022-07 · Unified Catalog GA: regional gestaffelt 2024–2026 · Neues PAYG-Modell wirksam: **2025-01-06** |
| **Standalone-Preis (USD)** | **Zwei parallele Modelle**: (a) **Klassisch** — Capacity-Unit-Hour (1 CU = 25 ops/sec + 10 GB Metadata-Storage) + vCore-Hour für Scanning/Classification. (b) **Neu (PAYG, ab 2025-01-06 für Unified-Catalog-Kunden)** — **Meter 1:** unique governed assets/day · **Meter 2:** DGPUs (Data Governance Processing Units) pro Data-Quality- oder Health-Control-Run, Basic / Standard / Advanced SKU · Data-Map-Scan-Gebühren entfallen, **sobald** Kunde in PAYG konsentiert |
| **Standalone-Preis (EUR)** | *UNCLEAR — nicht zentral als EUR-Fließpreis publiziert. Azure Pricing Calculator je Region verwenden (Azure DE-WestEurope oder CH-North). **TODO:** Raten für typischen SMB-Workload (z.B. 500 governed assets, 100 DQ-Rules/Tag) berechnen und in Note eintragen.* |
| **Lizenz-Bundle** | **Nicht in M365 E5 enthalten.** **Nicht in Purview Suite ($12/user/month)**. Eigenständiges Azure-Consumption-SKU. **Free Tier** existiert für Unified Catalog („Free Version") — für kleines Setup bis X assets; Enterprise-Upgrade nötig für Produktivnutzung (*TODO: Free-Tier-Limits verifizieren*) |
| **Voraussetzung** | Azure-Subscription im selben Tenant wie Purview · Resource Group · Service Principal oder Managed Identity für Scans · Bei On-Prem: Self-Hosted Integration Runtime |
| **Region-Verfügbarkeit** | **Unified Catalog rollt regional gestaffelt aus** — Check [Supported Regions Page](https://learn.microsoft.com/en-us/purview/unified-catalog-regions). EU Data Boundary aktiv. **DE/CH-Spezifika**: noch zu verifizieren — *TODO* |
| **CSP-Promo** | Keine publizierten DSPM-spezifischen Promos; Azure-Commit-Rabatte (MACC) gelten generisch |
| **Hidden Costs** | **Scan-vCore-Hours** im klassischen Modell skalieren mit Datenmenge — bei großem Estate schnell 4-stellig/Monat · **DGPU-Verbrauch** bei Data Quality auf 100M+ Rows steigt deutlich · **Self-Hosted IR für On-Prem** = zusätzlicher VM-Betrieb · **Private Endpoints** für Enterprise = zusätzliche Azure-Networking-Kosten |
| **Upgrade-Pfad** | Klassisches Data-Map → Unified Catalog: **PAYG-Consent** nötig (Onboarding-Flow im Portal), Metadaten bleiben intakt · Free Tier → Enterprise: Upgrade-Flow im Portal |

---

## Kernkonzept

### Was es im Kern ist

Data Map ist ein **Graph-Store über Metadaten** — nicht über die eigentlichen Daten. Jede gescannte Quelle wird in **Asset-Knoten** zerlegt (Server → Database → Schema → Table → Column), mit **Beziehungen** zwischen ihnen (Lineage, Ownership, Glossary-Mapping, Classification). Das Herz ist ein **elastisches Capacity-Unit-Modell** (klassisch) bzw. ein **governed-asset-Meter** (neu), das mit dem Daten-Estate mitwächst.

Die **Seele** des Produkts: **„Catalog-first, not Policy-first"**. Data Map erzwingt keine Access-Policies auf Source-Daten (das ist Azure-RBAC-/SQL-Level-Sache) — es liefert **Sichtbarkeit und Business-Kontext**. Das ist die fundamentale Abgrenzung zu [[Purview DSPM]] (policy-/risk-first) und zu klassischem MDM (master-data-first).

**Historische Entwicklung:** Azure Data Catalog (2016) → Azure Purview Data Catalog (2020, Rebrand + Multi-Cloud) → Microsoft Purview Data Map (2022, als Teil des Purview-Dach-Portfolios) → Purview Unified Catalog (2024/2025, als Nachfolger-UI mit Data-Products-Konzept und neuem PAYG-Modell). **Classic Data Map läuft parallel weiter** — für Altkunden, die nicht migriert sind.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| **Discovery / UX** | Catalog-Suche, Asset-Detail-Seiten, Lineage-Graph, Glossary-Browsing, Data-Products-Karten | Purview Portal (Unified Catalog) oder Classic Data Catalog |
| **Metadata Store** | Atlas-basierter Graph-Store (Asset-Knoten + Beziehungen) | Purview-Backend (Azure-managed, serverless) |
| **Scan & Classification** | Regelbasierte + Trainable Classifiers, Schema-Extraktion, Sampling | Purview Shared Classifiers + Native/SHIR-Connectors |
| **Lineage-Propagation** | Quellen-Events (ADF, Fabric, Power BI, Spark) → Lineage-Edges | Quell-Systeme emittieren Lineage-Events, Purview aggregiert |
| **Policy / Access** | Unified Catalog Access Policies (Self-Service-Requests auf Data Products) | Unified Catalog (neu) — nicht Classic |

### Kern-Fähigkeiten

#### 1. Data Catalog (Asset-Inventar + Suche)

Durchsuchbares Inventar aller gescannten Assets — Keyword-Suche + Filter (Classification, Owner, Tags, Governance Domain). **Copilot-gestützte Semantic Search** in Unified Catalog. Jedes Asset hat eine Detail-Seite mit Schema, Sample-Data (wenn gescannt), Business-Description, Glossary-Terms, Classifications (z.B. „PII — Email Address"), Owner, Lineage-Upstream/Downstream. **Grenze:** Suche durchsucht Metadaten, nicht den tatsächlichen Inhalt — dafür braucht es [[Azure AI Search]] oder ähnliches.

#### 2. Automated Scan & Classification

**100+ native Connectors** — Azure (SQL, Blob, ADLS, Synapse, Cosmos DB, Fabric), AWS (S3, RDS, Redshift), GCP (BigQuery, Cloud Storage), On-Prem (SQL Server, Oracle, SAP HANA, Teradata, Cassandra), SaaS (Power BI, Salesforce, Databricks, Snowflake). Scans laufen **scheduled** oder **on-demand**, extrahieren Schema + Sample-Data-für-Klassifikation + statistische Profile. **400+ Built-in Classifiers** für PII, PCI, IBAN etc.; Trainable Classifiers für custom Business-Entities (50–500 Beispiele). **Grenze:** Klassifier sind **englisch-zentriert** — deutsche/französische Detection oft schwächer (*eigene Einschätzung, konsistent mit [[Microsoft Purview]]-Note*).

#### 3. Lineage-Tracking

**End-to-End-Lineage** zwischen Quellen, ETL-Pipelines und Konsumenten — automatisch für: Azure Data Factory, Fabric (Pipelines, Notebooks, Dataflows), Power BI, Synapse Spark. **Manuell/API** für alles andere (OpenLineage-Standard möglich). Zeigt column-level Lineage, wenn Quell-Tool das emittiert. **Grenze:** Third-Party-Tools (dbt, Fivetran, Airflow) brauchen Custom-Integration via Atlas-API — kein Out-of-Box-Lineage.

#### 4. Business Glossary + Critical Data Elements (Unified Catalog)

**Glossary Terms** = aktive Business-Begriffe, die an Assets gemappt werden (z.B. „Customer ID" → zeigt in drei Tabellen als `CustID`, `CID`, `customer_id`). **Critical Data Elements (CDEs)** = logische Bündelung über heterogene Schema-Namen. An Terms können **Policies** geknüpft werden (DQ-Regeln, Access-Policies), die automatisch auf alle verknüpften Assets wirken. Das ist der **Herzstück-Hebel** für skalierbare Governance.

#### 5. Data Estate Insights

Dashboard mit Posture-Metriken: Klassifikations-Coverage pro Quelle, Owner-Coverage, Glossary-Coverage, Health-Score pro Governance-Domain, DQ-Trend. In Unified Catalog: **Health Controls** messen Governance-Reife gegen Standards, **Health Actions** sind konkrete To-Dos. **Grenze:** Kein echtes „Risk-Score" wie in [[Purview DSPM]] — rein governance-posture-fokussiert.

#### 6. Data Products (Unified Catalog, neu)

Kuratierte Bündel verwandter Assets als Business-Entity — typischer Data-Mesh-Ansatz. User abonnieren Data Products statt einzelner Tabellen-Berechtigungen. Self-Service-Access-Requests mit automatisiertem Approval-Workflow. **Für SMB-Kunden oft overkill** — Data Mesh setzt Data-Engineering-Reife voraus, die im DACH-Mittelstand selten vorhanden ist.

### Typischer Workflow

1. **Purview-Account + Azure-Subscription einrichten (Tag 1)** — Resource Group, Identity, Networking (Private Endpoints bei sensitiven Kunden).
2. **Quellen registrieren (Tag 2–3)** — Azure-Quellen per Service Principal, On-Prem per Self-Hosted IR, Multi-Cloud per Credentials.
3. **Scans konfigurieren (Tag 3–4)** — Scope (welche Datenbanken/Schemas), Classifier-Set, Schedule. Erster Full-Scan 4–24h je nach Größe.
4. **Glossary + Governance Domains aufbauen (Woche 2–4)** — Business-Workshop mit Data-Owners, Mapping zu Assets.
5. **Data-Product-Curation (Woche 4+)** — Data-Stewards bündeln Assets zu Products, definieren Access-Policies.
6. **Betrieb** — inkrementelle Scans täglich/wöchentlich · DQ-Rules laufen scheduled · Health-Controls-Dashboard monatlich reviewen.

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai, wenn involviert)** | Azure-Admin · Purview-Portal-Navigation · Atlas-API-Grundlagen für Custom-Lineage · **Nicht Journai-Kerncompetenz aktuell** |
| **Admin (Kunde)** | Purview Data Source Administrator · Entra-App-Permissions · Azure-Networking bei Private Endpoints |
| **Data Steward (Kunde)** | Business-Verständnis der Domäne · Glossary-Modellierung · Governance-Domain-Ownership |
| **End-User (Data Consumer)** | Portal-Navigation · Self-Service-Access-Request-Workflow — keine Coding-Skills |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Data Security / Risk-Scoring für AI-Zugriffe** | [[Purview DSPM]] (separate Säule!) |
| **Access-Enforcement auf Source-Level** — Data Map ist catalog, kein Access-Layer | RBAC im Quell-System (Azure SQL, Snowflake); Unified Catalog Access Policies nur für Data Products, nicht für Raw-Tables |
| **Volltext-/Content-Suche** — nur Metadaten, keine Daten-Inhalte | [[Azure AI Search]] oder Fabric-Search für Inhalte |
| **Unstrukturierte Daten (SharePoint/OneDrive-Dokumente)** — M365-Daten sind **nicht** primärer Data-Map-Scope | [[Microsoft Purview]] Information Protection + DSPM für M365 |
| **Real-time Lineage** — Lineage-Events kommen batch, nicht streaming | Akzeptieren; Event-Stream-Architekturen brauchen Custom-Emit |
| **Deutsche/französische Classifier-Tiefe** | Trainable Classifiers selbst trainieren; englische Built-ins ergänzen |

### Typische Fallstricke im Einsatz

- **„Wir haben doch Purview — warum sehen wir unsere SharePoint-Daten nicht?"** — Klassiker. Data Map und M365-Purview (DSPM, IP, DLP) sind **verschiedene Säulen** mit verschiedenen Scopes. SharePoint-Oversharing = DSPM, nicht Data Map. *Gegenmittel: 2-Säulen-Diagramm im Kick-off zeigen.*
- **Kosten-Schock bei klassischem Modell** — bei großen Estates skalieren Capacity Units + Scan-vCore-Hours schnell. *Gegenmittel: Pilot-Mode mit engem Scope, Cost-Monitoring-Alert in Azure, bei Enterprise-Volumen in PAYG-Unified-Catalog migrieren (oft günstiger).*
- **Scan ohne Governance-Konzept** — Kunde scannt alles und hat danach 50.000 Assets ohne Owner, Glossary oder Klassifikation. Catalog ist nutzlos. *Gegenmittel: **zuerst** Governance-Domains + Glossary definieren, **dann** scannen.*
- **Lineage-Erwartung aus Marketing** — Marketing suggeriert „automatisches column-level lineage für alles"; Realität: nur für native MS-Tools. dbt/Fivetran/Custom-Python brauchen Integration. *Gegenmittel: Lineage-Coverage-Liste ehrlich vor Projektstart durchgehen.*
- **Verwechslung „Purview Data Map" mit „Purview für Copilot/AI"** — typisch im AI-Beratungskontext. Data-Map-Aktivierung hilft **nicht** beim Copilot-Governance — das ist DSPM-for-AI + Sensitivity Labels. *Gegenmittel: **diese Note** im Beratungsgespräch abgrenzen.*
- **Classic → Unified Catalog Migration** — PAYG-Consent ist Einbahnstraße in manchen Regionen; Altkunden müssen Mapping zwischen Klassik-Features und Unified-Catalog verstehen. *Gegenmittel: [Task Mapping](https://learn.microsoft.com/en-us/purview/data-governance-billing) durchgehen, Migrations-PoC vor Breit-Rollout.*

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Docs | Learn about Purview Data Map | https://learn.microsoft.com/en-us/purview/data-map | 2026-04-22 | Capacity-Units, Scan-Modell |
| Docs | Learn about Purview Unified Catalog | https://learn.microsoft.com/en-us/purview/unified-catalog | 2026-04-22 | Nachfolger, Data Products |
| Docs | Billing in Purview Data Governance | https://learn.microsoft.com/en-us/purview/data-governance-billing | 2026-04-22 | PAYG-Modell, DGPUs, governed assets |
| Docs | Data sources in Purview Data Map | https://learn.microsoft.com/en-us/purview/data-map-data-sources | 2026-04-22 | Connector-Matrix (Multi-Cloud) |
| Docs | Amazon S3 Multicloud Connector | https://learn.microsoft.com/en-us/purview/register-scan-amazon-s3 | 2026-04-22 | Multi-Cloud-Setup |
| Docs | Unified Catalog Supported Regions | https://learn.microsoft.com/en-us/purview/unified-catalog-regions | 2026-04-22 | Regional-Roll-out-Timing |
| Pricing | Azure Pricing — Purview | https://azure.microsoft.com/en-us/pricing/details/purview/ | 2026-04-22 | CU-Hour / PAYG-Raten |
| Docs | Classic Data Map Pricing Guidelines | https://learn.microsoft.com/en-us/purview/data-gov-classic-pricing-data-map | 2026-04-22 | Legacy-Modell (Capacity Units) |

### Secondary (Analysten / Community)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| James Serra Blog (MS Data BI) | https://www.jamesserra.com/archive/2024/04/microsoft-purview-update/ | 2026-04-22 | Unified-Catalog-Roadmap-Analyse |
| EPC Group Enterprise Guide 2026 | https://www.epcgroup.net/microsoft-purview-data-governance-enterprise-guide-2026 | 2026-04-22 | Enterprise-Rollout-Perspektive |
| erwindekreuk (Data BI) | https://erwindekreuk.com/2023/04/updated-microsoft-purview-pricing-and-applications/ | 2026-04-22 | Pricing-Analyse |

---

## UNCLEAR / TODOs

1. **EUR-Raten** für PAYG-Modell (governed asset/day + DGPU) in DE/CH-Azure-Regionen — Azure Pricing Calculator nötig
2. **Free-Tier-Limits** für Unified Catalog (ab wann Enterprise-Upgrade-Pflicht)
3. **Unified Catalog Regional Availability** DE-WestEurope / CH-North — konkretes Ausroll-Datum
4. **Classic Data Map EOL-Datum** — Microsoft hat keine Abkündigung kommuniziert, aber PAYG ist klarer Strategie-Pfad
5. **Purview Sovereign / EU Data Boundary** Coverage-Tiefe für Data-Map-Metadaten (erbt vermutlich von Purview, nicht Data-Map-explizit dokumentiert)

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive Data Map: Data-Governance-Säule, Abgrenzung zu DSPM, SMB-Relevanz (meist irrelevant für AI-Kunden ohne Data-Engineering-Team) | https://learn.microsoft.com/en-us/purview/data-map |
| 2026-04-22 | Hongyu | Initial Stub (wartet auf Deep-Research) | Arbeitsauftrag |
