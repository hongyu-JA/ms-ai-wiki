---
watch: standard
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Content Understanding, ACU, Azure AI Content Understanding]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Azure AI Content Understanding

*Multimodaler **Generative-AI-IDP-Service** in [[Foundry Tools]] — verarbeitet Dokumente, Bilder, Audio und Video über einen **schema-getriebenen Analyzer**. Nachfolger-Generation von [[Azure AI Document Intelligence]]: gleiche OCR-/Layout-Basis, zusätzlich LLM-gestützte Inferred Fields, Validierung, Klassifikation und (Pro Mode) Cross-Document-Reasoning. GA seit **25.11.2025** mit API-Version `2025-11-01`.*

> **Analogie:** Was Document Intelligence für strukturierte Formulare ist, ist Content Understanding für „alles, was reinkommt" — ein einziger Analyzer, dem man ein JSON-Schema vorhält und der Video, Audio, PDF und Bild gleichartig mit Confidence + Grounding befüllt.

---

## Einsatz

### Job-to-be-done

*When I* heterogene Inhalte aus verschiedenen Modalitäten (Meeting-Recording, Außendienst-Fotos, PDF mit Diagrammen, Call-Transkript + Rechnung) auswerten muss, *I want to* ein JSON-Schema definieren und den Service Extraktion, Klassifikation und Inferenz orchestrieren lassen, *so I can* strukturierte, bewertbare Daten ohne eigenes Prompt-Engineering, Labeling oder Chunking-Framework in Downstream-Systeme schieben.

### Trigger-Signale

- „Wir haben Rechnungen von 200 Vendoren, alle sehen anders aus — unser altes Template-OCR versagt."
- „Wir wollen aus Call-Center-Recordings Sentiment + Themen + KPIs in einem Durchgang ziehen."
- „Externe Vertrags-PDFs plus zugehörige Bestellungen sollen gegen unser Standardvertragswerk validiert werden."
- „Der Außendienst soll Schadensfotos + kurzes Voice-Memo hochladen — wir brauchen einheitliches JSON für das Schadenssystem."
- „RAG über PDFs mit Chart.js-Diagrammen, Tabellen und Handschrift-Annotationen — `prebuilt-read` reicht nicht mehr."

### Einsatz-Szenarien

1. **Vertrags-Triage mit Cross-Document-Validierung (Pro Mode)** — SMB-Kunde (DACH) wickelt Rahmenverträge + Einzelbestellungen + Rechnungen ab. Pro Mode bekommt Vertrag als `referenceData`, Bestellung + Rechnung als Inputs, gibt zurück: `inconsistencies[]`, `total_matches`, `missing_fields[]`. Ersetzt manuelle Klausel-Prüfung. **Journai-Hebel**: Workshop „Vertragsintelligenz", 5–8 Tage Beratung.
2. **Multimodal-Schadensaufnahme für Versicherungs-/Handwerks-SMB** — Außendienst lädt Fotos + 30 s Voice-Note + evtl. Skizze hoch. Custom Analyzer baut aus `prebuilt-image`-Base: `damage_category`, `severity 1-5`, `estimated_repair_hours`, `voice_summary`. Output geht in Dataverse/SharePoint. Gibt's bei Journai aktuell **nicht** als Kunden-Case — Werbe-Potenzial im KMU-Handwerks-Segment.
3. **Call-Center-Analytics ohne Azure-Video-Indexer-Legacy** — `prebuilt-callCenter` / `prebuilt-audioSearch` liefert Transkript + Speaker-Diarisierung + Sentiment + Summary in einem Request (**$0.47 / Stunde Audio mit GPT-4.1-mini**). Substituiert fragmentiertes Speech + Language + custom-LLM-Pipeline.
4. **RAG-Ingestion mit Figure-Analyse** — `prebuilt-documentSearch` gibt Chart.js- und Mermaid.js-Repräsentationen von Diagrammen aus, erfasst Handschrift-Annotationen, Hyperlinks, Multi-Page-Tables. Ersatz für eigenen Preprocessing-Stack vor [[Azure AI Search]] / [[Foundry IQ]].

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Azure Subscription mit Foundry-Ressource (`services.ai.azure.com`). Keine separate Lizenz, Pay-as-you-go. |
| **Tenant / Infrastruktur** | Foundry-Ressource in CU-Region (für EU: **Sweden Central, North Europe, West Europe**). Eigenes **Foundry-Modell-Deployment** (GPT-4.1, GPT-4.1-mini, GPT-4o, GPT-4o-mini) — der Kunde zahlt Gen-AI-Tokens separat. |
| **Skills / Rollen** | Schema-Designer (denken in JSON Schema + Prompting-Semantik), Python/.NET-Dev für REST/SDK-Calls, Azure-Admin für RBAC. |
| **Compliance-Rahmen** | MS DPA gilt (Foundry-Vertrag), Data-Residency klären: **Switzerland North nicht verfügbar**, EU-Data-Zone via Sweden Central. |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | 3–5 Tage Schema-Design + Analyzer-Tuning für ersten Use-Case; 8–12 Tage für Multi-Modal-Szenario mit Custom-Training. |
| **Laufende Lizenzkosten** | Sehr volumenabhängig. SMB-Richtwerte: **~$6–8 / 1.000 Invoice-Seiten** (GPT-4.1-mini) · **~$0.47 / Stunde Audio** · **~$3.33 / Stunde Video** · **~$4.50 / 1.000 Bilder**. Zusätzlich Foundry-Modell-Token-Budget getrennt kalkulieren. |
| **Laufender Betrieb** | 0.5–2 Personentage/Monat — Schema-Drift beobachten, Confidence-Thresholds tunen, Pro-Mode-Refdocs aktualisieren. |

### Empfehlung

**Status:** 🟡 **Beobachten für strikte CH-Residenz / 🟢 Empfehlen sobald Multi-Modal gefragt und Sweden Central akzeptabel.**

Content Understanding ist die strategisch richtige Wette — MS positioniert CU explizit als **„starting point for new file-processing workloads"** und DI als Backbone für stabile, extractive Flows. Für Journai-SMB-Standard-Rechnungsflüsse (Einzelvendor, bekannte Templates) bleibt **[[Azure AI Document Intelligence]]** günstiger und deterministischer. **Blocker**: CU ist **nicht in Switzerland North** — CH-Residenz-Anforderungen zwingen heute zu DI.

**Nächster Schritt für Journai:** (1) Internen Mini-PoC mit `prebuilt-invoice` + `prebuilt-contract` via Sweden Central bis Q2-Ende aufsetzen, Cost-Benchmark gegen DI-Custom-Neural auf realem Kundendatensatz. (2) Pro-Mode-Preview für **Vertrag-vs-Rechnung-Validierung** testen — potenzielles Angebots-Paket „AI-gestützte Vertragskontrolle" für SMB-Treuhand-Kunden. (3) CH-North-Roadmap via Azure-Account-Team quartalsweise nachhalten.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | **GA** (Standard Mode) seit 25.11.2025 — API `2025-11-01`. **Pro Mode** weiterhin Preview (`2025-05-01-preview`). |
| **GA-Datum** | 2025-11-25 (Ignite 2025). Davor Preview seit Nov 2024 (Ignite 2024). |
| **Pricing-Modell** | **Zweischichtig**: (a) Content-Extraction pro Input-Einheit + (b) Generative-Features (Contextualization + Foundry-Modell-Tokens). Kein Abo, keine Committed-Tiers publiziert. |
| **Content-Extraction (USD, 04/2026)** | Dokumente: **$5 / 1.000 Standard-Pages** (OCR + Layout auf Image-based). `Basic` (Read-only, image-based) und `Minimal` (digitale Formate wie DOCX/XLSX/HTML) günstiger. Audio: **~$0.36 / Minute** (GA-Meter). Video: **$1 / Stunde**. Images: **keine Content-Extraction-Gebühr**, nur LLM + Contextualization. |
| **Contextualization (USD, 04/2026)** | $1 / 1.000 Pages · $1 / 1.000 Images · $0.10 / Stunde Audio · $1 / Stunde Video. Berechnet als 1.000–1M Tokens × $1/M. |
| **Gen-AI-Tokens** | Getrennt abgerechnet über Foundry-Modell-Deployment (GPT-4.1, -mini, GPT-4o-Familie). **GPT-4.1-mini spart bis 80 %** gegenüber Full-GPT-4.1. |
| **Lizenz-Bundle** | Keins — reines Consumption-Modell auf Azure. |
| **Voraussetzung** | Foundry-Ressource + Foundry-Modell-Deployment. |
| **Region-Verfügbarkeit (GA)** | `australiaeast`, `eastus`, `eastus2`, `japaneast`, **`northeurope`**, `southcentralus`, `southeastasia`, **`swedencentral`**, `uksouth`, **`westeurope`**, `westus`, `westus3`. **🔴 Switzerland North / West nicht verfügbar**. **🔴 Germany WC nicht verfügbar.** |
| **Pro-Mode-Regionen (Preview)** | `westus`, `swedencentral`, `australiaeast`. Pro Mode nur mit Processing-Location `dataZone` oder `global`. |
| **CSP-Promo / Discounts** | Keine publizierten CU-Rabatte. Token-Seitig über Foundry-PTU möglich. |
| **Hidden Costs** | (1) Foundry-Modell-Tokens **getrennt abgerechnet** — in Cost-Projections leicht vergessen. (2) Training/Knowledge-Base zieht Embedding-Tokens (~1.500/page). (3) `Source grounding + confidence scores` ≈ **2× Token-Verbrauch**. (4) Chained Analyzers (Segmentation → neuer Analyzer) addieren Content-Extraction erneut. |
| **Upgrade-Pfad** | DI-Bestandskunden: **gleicher Foundry-Endpoint + ähnliche Prebuilt-Namen** (`prebuilt-invoice`, `prebuilt-contract`, `prebuilt-idDocument`). Schemata von DI v4 lassen sich meist direkt als CU-Analyzer-Template übernehmen. MS empfiehlt CU als Default-Startpunkt für **neue** Workloads. |

---

## Kernkonzept

### Was es im Kern ist

Content Understanding ist **ein einziges Analyze-API** über vier Modalitäten (Document / Image / Audio / Video) mit einem **einheitlichen, schema-getriebenen Output**. Der Kern-Design-Move gegenüber [[Azure AI Document Intelligence]]: statt modality-spezifischer SDKs und proprietärer Feldschemata definiert der Nutzer ein **Analyzer** — eine JSON-Konfiguration mit drei Kernteilen: *baseAnalyzerId* (z. B. `prebuilt-document`), *Schema* (Felder mit Typ, Beschreibung, Enum/Format-Regeln) und *Model-Deployment* (welches Foundry-LLM extrahiert/klassifiziert/generiert). Das Feld-Schema ist die **einzige Engineering-Artefakt** — kein Prompt, kein Labeling nötig, um zu starten.

Die Architektur trennt drei Layer: (1) **Content Extraction** — klassische OCR + Layout + Speech-to-Text + Frame-Analyse, deterministisch, pro Seite/Minute abgerechnet. (2) **Contextualization** — proprietärer Layer, der Extraction-Output für den LLM aufbereitet, Source-Grounding-Regionen berechnet, Confidence-Scores ableitet, Output-Normalisierung (Datum → ISO, Currency-Codes) durchführt. (3) **Generative Layer** — Bring-Your-Own-Foundry-Modell, das `extract` / `classify` / `generate` auf den drei Feldtypen ausführt. Diese Dreiteilung ist die **konzeptuelle Seele**: MS positioniert Contextualization als den „Secret Sauce" zwischen nackter LLM-Extraktion (Build-Your-Own mit GPT-4.1) und starren OCR-Pipelines (DI).

Die zweite Design-Wette: **Zwei Betriebsmodi mit klarer Funktionsspaltung**. *Standard Mode* ist für Hochdurchsatz-IDP — billig, niedrige Latenz, Grounding + Confidence, aber stateless, single-document. *Pro Mode* (Preview) fügt drei Dinge hinzu, die aus einem Analyzer eine Mini-Agent-Orchestration machen: **Multi-Document Input** in einem Call, **Reference-Data** (statische Vergleichsdokumente beim Analyzer-Create mitgeben), **Multi-Step Reasoning** (Modell kann Sub-Probleme zerlegen, Inkonsistenzen finden). Pro Mode opfert dafür Confidence-Scores + Grounding — das ist der architektonische Trade-off: Reasoning vs. Auditability.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| **Input Ingestion** | File-Upload / Blob-URL / SAS | Kunde (Logic Apps / Power Automate / SDK) |
| **Content Extraction** | OCR, Speech-to-Text, Frame-Analyse, Layout | Content Understanding (charged per page/min) |
| **Segmentation** | Dokument-/Video-Split in logische Chunks | Content Understanding (`enableSegment`) |
| **Contextualization** | Kontext-Engineering, Grounding, Confidence, Normalisierung | Content Understanding (charged per 1k context-tokens) |
| **Generative Reasoning** | Field-Extract / Classify / Generate | **Foundry-Modell-Deployment des Kunden** (getrennt abgerechnet) |
| **Output** | Markdown (für RAG) oder strukturiertes JSON (für Automation) | Content Understanding |
| **Orchestration** | Tool-Aufruf aus Agent | [[Microsoft Agent Framework]] / [[Foundry Agent Service]] / [[Logic Apps]] / [[Power Automate]] |

### Kern-Fähigkeiten

#### Schema-Driven Field Extraction (drei Feldmethoden)

Jedes Feld im Analyzer-Schema wird über **eine** von drei Methoden erzeugt: `extract` (wörtliche Value aus dem Input — Datum, Betrag, Lieferant — nur für Dokumente), `classify` (Kategorie aus vorgegebener Enum-Liste — Sentiment, Chart-Typ, Dokumenttyp), `generate` (freie LLM-Inferenz — Summary, inferred Total-Tax, Scene-Description). Im Kern ist das ein **strukturiertes Constrained-Decoding-Pattern**: Das Schema wird zusammen mit Extraction-Output an den LLM gereicht, Contextualization verpackt das schema-konform zurück. Relevant wenn man statt Prompt-Engineering ein validierbares JSON-Contract will. Grenze: Max **100 Felder** pro Analyzer (beide Modi) — darüber hinaus muss man Analyzer chainen.

#### Multi-Modal Unified Analyzer

Document, Image, Audio, Video laufen durch denselben Analyzer-Call mit derselben Schema-Syntax. Für jeden Input-Typ gibt es einen `prebuilt-*-Base`, der OCR/STT/Frame-Extraction wählt. Relevant bei Workflows mit gemischtem Content (Foto + Voice-Memo, Meeting-Video + Protokoll-PDF). Grenze: **ein Analyzer-Call = eine Modalität** im Standard Mode — Mischen erfordert Pro Mode (Docs-only) oder eigenes Orchestrieren via MAF.

#### Pro Mode — Reasoning + Multi-Document (Preview)

Pro Mode nimmt mehrere Input-Dokumente plus **Reference-Documents** (am Analyzer-Create angeheftet — Verträge, Richtlinien, Standards) und führt Multi-Step-Reasoning aus. Beispiel: Invoice + PO als Inputs, Rahmenvertrag als Reference — Output sind `inconsistencies[]`, `passes_criteria: bool`, `missing_clauses[]`. Der Unterbau ist ein Retrieval-über-Reference-Docs im Lookup-Mode kombiniert mit Reasoning-Chains. Relevant bei Compliance/Audit/Vertragskontrolle. **Grenzen**: nur Dokumente, kein `extract` (nur `classify` + `generate`), **kein Grounding, keine Confidence-Scores**, Reference-Docs müssen prägnant sein (Lookup-Mode, kein Full-Recall).

#### Prebuilt Analyzers (Domain-Bibliothek)

~80 vorgefertigte Analyzer in fünf Kategorien: **Content-Extraction** (`prebuilt-read`, `prebuilt-layout`), **Base** (`prebuilt-document`, `-image`, `-audio`, `-video` — **nur diese vier sind als `baseAnalyzerId` für Custom erlaubt**), **RAG** (`prebuilt-documentSearch` inkl. Chart.js/Mermaid-Diagramm-Repräsentation, `-imageSearch`, `-audioSearch`, `-videoSearch` mit Auto-Scene-Split), **Domain** (`prebuilt-invoice`, `-receipt`, `-contract`, `-idDocument`, `-callCenter`, `-mortgage.us.*`, `-tax.us.1099*`, ~40 US-Tax-Varianten), **Utility** (`prebuilt-documentFieldSchema` — generiert Schema-Vorschlag aus Sample). Relevant als Starter + für unveränderte Use-Cases. Grenze: **viele Domain-Analyzer US-spezifisch** (Tax, Mortgage); EU-Rechnungen über `prebuilt-invoice` funktionieren, aber DACH-spezifische Felder (USt-IdNr., IBAN-Validierung) brauchen Custom-Extension.

#### Confidence + Grounding (nur Standard Mode)

Für jedes Feld ein Score 0–1 + Source-Region (Bounding-Box auf Page, Time-Range in Video). Aktiviert via `estimateFieldSourceAndConfidence`. Unterbau: Contextualization-Layer berechnet das aus LLM-Logprobs + Extraction-Koordinaten. Relevant für **Straight-Through-Processing** — Threshold-basiert Human-Review triggern. Grenze: **Feature verdoppelt Token-Verbrauch** (~2×), im Pro Mode nicht verfügbar.

#### Classification & Splitting

Mixed-File-Batches (Rechnung + Vertrag + ID in einem PDF) werden zuerst klassifiziert, dann an passende Analyzer geroutet — alles im selben Call. Ersetzt DI Custom Classifier + separaten Routing-Step. Relevant bei Posteingang-Automatisierung.

#### Post-Processing Rules im Feld-Descriptor

Datum-/Currency-/Enum-Normalisierung wird als Natural-Language-Regel im Feld beschrieben (z. B. `"description": "Return in ISO 8601 format"`), nicht als externer Code-Hook. Relevant bei Multi-Locale-Inputs (DE/FR/IT Datums-/Währungsformate).

#### Knowledge Base / Labeled-Examples Training (Preview)

Standard-Analyzer kann mit ~5 Samples + Labels angereichert werden, um domain-spezifische Formulierungen besser zu treffen. Ergänzt das Zero-Shot-Prinzip. Kosten: Embedding-Tokens pro Sample-Page + erhöhter LLM-Verbrauch zur Laufzeit.

### Typischer Workflow

1. **Setup** — Foundry-Ressource in `swedencentral` provisionieren (CH-Residenz-TODO), Foundry-Modell-Deployment (GPT-4.1-mini für SMB-Start) anlegen, RBAC via Entra konfigurieren. Inkl. Terraform/Bicep ~0.5 Tage.
2. **Schema-Design** — Im **Content Understanding Studio** (`https://ai.azure.com` → Vision → Content Understanding) Sample hochladen, `prebuilt-documentFieldSchema` Vorschlag generieren lassen oder von `prebuilt-invoice` kopieren (`POST /analyzers/myInvoice:copy`), Felder manuell erweitern. Iterativ mit Live-Samples testen.
3. **Build / Configure** — Analyzer-Definition als JSON committen (Git), via REST `PUT /analyzers/{id}` oder Python-SDK (`azure-ai-contentunderstanding`) deployen. **Wichtig**: Prebuilts in Produktion immer **kopieren** (`:copy`), nicht direkt referenzieren — sonst bricht nächste API-Version das Verhalten.
4. **Deploy** — Entweder (a) als **[[Microsoft Agent Framework]]-Tool** (CU-Call als Skill in Agent exponieren, Output ins Context-Memory), (b) als **[[Logic Apps]]-Action** (Connector in `services.ai.azure.com`), (c) via **[[Power Automate]]** für Low-Code-SMB-Workflows, oder (d) direkt REST aus Custom-App. Alle Wege nutzen denselben Endpoint.
5. **Operate** — Monitoring via Azure App Insights (Latenz, Error-Rate, Token-Verbrauch), Confidence-Thresholds in Downstream-Logik tunen, Pro-Mode-Reference-Docs quartalsweise aktualisieren (z. B. neue AGB-Version), LLM-Modell-Version upgraden (Modell-Wechsel = separate Deploy-Ressource, CU-Analyzer-Update verweist neu).

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai intern)** | JSON Schema fließend, Python oder .NET, Azure-Grundlagen (RBAC, Managed Identity), iteratives Schema-Tuning (Prompt-ähnliche Disziplin ohne Prompt), Grundverständnis LLM-Kosten/Token-Rechnung. |
| **Admin (beim Kunden)** | Azure-Subscription-Owner, Entra-Admin für Managed Identity, Cost-Management-Reader — kein Coding. |
| **End-User (beim Kunden)** | Keine — konsumiert strukturiertes JSON in Dataverse/SharePoint/ERP. |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Nicht in Switzerland North / West verfügbar** (Stand 04/2026) | Sweden Central (EU-Data-Zone) oder für strikte CH-Residenz **DI in Switzerland North** nutzen; CH-Roadmap beobachten |
| **Pro Mode nur Documents** — kein Multi-Doc-Reasoning über Video/Audio | Orchestrierung in MAF: CU-Standard-Calls pro Modalität + LLM-Aggregator als separater Agent-Schritt |
| **Pro Mode ohne Confidence/Grounding** | Standard Mode für auditierbare Flows; Pro Mode nur wenn Reasoning essentiell und Human-Review akzeptabel |
| **Nur 4 Base-Analyzer** als Parent für Custom (document/image/audio/video) | — architektonische Grenze, kein Workaround |
| **Max 100 Felder** pro Analyzer | Analyzer-Chaining oder Segmentation + separate Analyzer pro Segment |
| **Images haben keine Content-Extraction** (nur LLM + Context) | OK so, aber bedeutet bei hoher Bildzahl: Kosten = LLM-Tokens × Bildzahl, kein günstiger OCR-Pfad |
| **Kein deterministisches Verhalten bei identischem Input** (LLM-basiert) | DI wählen für regulierte Workflows die Bit-identische Outputs verlangen |
| **DACH-spezifische Tax/Mortgage-Prebuilts fehlen** — nur US-Varianten | Custom Analyzer auf `prebuilt-document`-Base bauen |

### Typische Fallstricke im Einsatz

- **Foundry-Modell-Kosten vergessen** — Kunde kalkuliert nur CU-Seitenpreis, sieht am Monatsende die separate Foundry-Rechnung. **Vermeidung**: Token-Budget von Tag 1 in Cost-Projection mit aufnehmen (Beispiel: 1.000 Invoice-Pages mit Grounding + GPT-4.1 = **~$33** statt $8).
- **Direktes Prebuilt statt Copy in Produktion** — `prebuilt-invoice` kann mit nächster API-Version Schema ändern, stumme Downstream-Fehler. **Vermeidung**: `POST /analyzers/myInvoice:copy` als Pattern, Version pinnen.
- **Pro Mode als Silver-Bullet verkaufen** — Kunde erwartet Grounding + Confidence, bekommt nichts. **Vermeidung**: klarstellen „Pro Mode = Reasoning-Layer für Entscheidungen, Standard Mode = Extraktion mit Auditierbarkeit".
- **DI vs. CU überlappend einsetzen** — SMB-Standard-Rechnungen durch CU jagen ist 3–6× teurer als DI bei fast identischer Qualität. **Vermeidung**: CU-Entscheidungsmatrix aus [[Foundry Tools]] nutzen.
- **CH-Residenz zu spät geklärt** — Kunde baut PoC auf Sweden Central, Compliance-Freigabe kippt zu Go-Live. **Vermeidung**: im Pre-Sales CH-vs-EU-Data-Zone vertraglich festnageln.
- **Segmentation-Chaining unterschätzt** — jeder Chained-Analyzer löst eigene Content-Extraction + Contextualization aus. Kosten explodieren bei RAG-Flows mit Video-Segmentation + Per-Segment-Field-Extraction.
- **Schema-Design-Komplexität** — zu generische Feld-Descriptions (`"notes": "any notes"`) führen zu LLM-Halluzinationen. **Vermeidung**: MS-Guidance „Schemas mit höchster Spezifität" — jedes Feld distinkt, Beschreibung explizit, Enum wo möglich.

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| **[[Foundry Models]]** (GPT-4.1/mini, GPT-4o/mini) | Pflicht — liefert Gen-AI-Backend für extract/classify/generate | GA | Modell-Deployment separat verwalten, Token-Billing separat, bei Modell-Deprecation Analyzer-Update nötig |
| **[[Microsoft Agent Framework]]** | CU als Tool im Agent (MCP-artiger Aufruf) | GA | Agent-Developer muss Async-Pattern + Long-Running-Ops (> 60 s bei Video) handhaben |
| **[[Foundry Agent Service]]** | CU als Tool im Managed Agent | GA | Token-Pass-Through via Entra, Region-Alignment (beide in Sweden Central) |
| **[[Azure AI Search]]** / **[[Foundry IQ]]** | `prebuilt-documentSearch` als Ingestion-Pipeline | GA | Chart.js/Mermaid-Output muss im Index als Text-Field gemappt werden |
| **[[Microsoft Fabric]]** / OneLake | CU-Output als Delta-Tables | GA (Standard-Integration) | ETL-Pipeline-Design nötig |
| **[[Azure AI Document Intelligence]]** | Koexistenz — DI für deterministische Standard-Flows, CU für unstrukturiert/multimodal | GA | **Entscheidungsmatrix in [[Foundry Tools]]** beachten, sonst Cost-Doppel-Aufwand |
| **[[Logic Apps]]** | CU als Action in Workflow | GA | Connector-Version muss `2025-11-01` erreichen — Preview-Connector teils hinterher |
| **[[Power Automate]]** | CU-Action für Low-Code-Flows | GA | Power-Platform-Connector-Lag nach CU-API-Updates |
| **[[Microsoft Purview]]** | Data-Classification auf CU-Output | Standard | Purview-Labels müssen auf strukturiertes JSON angewendet werden — separater Classifier |
| **Azure Blob Storage** | Input-Source via SAS-URL | GA | Managed-Identity-Access statt SAS-Key empfohlen |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| **n8n / Zapier** | Low-Code-Automation für SMB | Community — kein offizieller Connector | Custom HTTP-Node mit Entra-OAuth nötig |
| **Salesforce / SAP** | Output-Sink für Invoice-/Contract-Data | via MuleSoft/SAP-CPI | kein nativer Connector |
| **DataSnipper** (Excel-IDP) | Embedding von CU in Excel-Audit-Flows | Partner-Integration, von MS erwähnt | Nur für Audit-/Finance-Use-Cases |

### APIs / Protokolle

- **REST API** `2025-11-01` (GA) und `2025-05-01-preview` (Pro Mode)
- **Python SDK** `azure-ai-contentunderstanding`, **.NET SDK**, **JavaScript SDK**
- **Entra-Auth** (Managed Identity, Service Principal), AAD-OAuth-Tokens
- **Upcoming MCP Server** (laut GA-Announcement) — Content Understanding als MCP-Tool im Multi-Agent-Stack (Roadmap)
- Keine GraphQL, kein OData — klassisches REST-JSON

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | Data-at-Rest in gewählter Region. **🔴 CH nicht verfügbar** — EU-Residenz via `swedencentral`/`northeurope`/`westeurope`. Pro Mode: nur `dataZone` oder `global` Processing — **EU-Data-Zone** gibt EU-Inside-Garantie für Sweden Central. |
| **Prompts & Outputs** | Über Foundry-DPA abgedeckt. **Kein Training** auf Kunden-Daten. Inputs werden transient zur Verarbeitung vorgehalten, keine Langzeit-Speicherung in CU (siehe Foundry-Privacy-Policy). |
| **Data Processing Addendum (DPA)** | MS-Standard-DPA (Products and Services DPA) deckt CU ab — Teil der Foundry-Ressource. **Preview-Features** (Pro Mode) unterliegen Supplemental Terms of Use. |
| **EU-AI-Act-Klassifizierung** | **Unclear — offiziell noch nicht zugeordnet.** Als General-Purpose-AI-Tool wahrscheinlich **Limited Risk** für Standard-IDP-Use-Cases; spezifische Deployments (z. B. Kreditentscheidungen auf Pro-Mode-Reasoning) können **High Risk** werden — Kunde muss sein Use-Case-Risk-Assessment durchführen. |

### Microsoft-Compliance-Stack

- **[[Microsoft Purview]]** — Kann CU-Output-JSON klassifizieren (Sensitivity-Labels auf Extracted Fields), Purview DSPM für AI beobachtet CU-Aufrufe als AI-Interactions.
- **Defender for Cloud** — Foundry-Resource ist Scope-Ziel, CU-Endpoint-Monitoring inklusive.
- **Entra** — Managed Identity + RBAC auf Foundry-Resource-Level (`Cognitive Services User`, `Cognitive Services Contributor`).
- **Conditional Access** — auf Foundry-Portal-Zugriff; API-Calls via Managed Identity umgehen MFA-Prompts.
- **Content Safety** — Guardrails-Instanz am Foundry-Modell-Deployment angehängt; CU gibt `content_filters`-Array im Response zurück. Modifizierte Filter (weniger strikt) erfordern Limited-Access-Antrag.

### Bekannte Compliance-Lücken

- **Switzerland North/West fehlt** — Blocker für Treuhand-/Gesundheits-/Banking-SMB mit CH-Residenz-Pflicht.
- **Pro Mode + EU-Data-Zone Garantie** nur bei `dataZone` Processing-Location, nicht bei `global` — Default im SDK prüfen.
- **Face-Description-Features** (Video-Analyse) triggern Biometric-Data-Verpflichtungen (DSGVO Art. 9) — Kunde muss Einwilligung, Retention, Löschung selbst managen. **Face-Features standardmäßig nicht aktiv.**
- **Foundry-Modell-Deployment vererbt Compliance-Scope** — wird ein Standard-Modell (nicht Azure-OpenAI-Spezifisch-EU-Region) genutzt, kann Token-Processing in US-Region laufen. Always pin Model-Deployment auf EU-Region.

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Product Page | Azure Content Understanding | https://azure.microsoft.com/en-us/products/ai-foundry/tools/content-understanding | 2026-04-22 | Positionierung, Marketing-Claims |
| Overview | Learn — What is Content Understanding | https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/overview | 2026-04-22 | Kern-Architektur, Komponenten |
| Quickstart | Foundry Portal Quickstart | https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/quickstart/use-ai-foundry | 2026-04-22 | PoC-Start, Demos |
| Concept | Standard vs Pro Modes | https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/standard-pro-modes | 2026-04-22 | Pro-Mode-Roadmap + Feature-Deltas |
| Concept | Prebuilt Analyzers Liste | https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/prebuilt-analyzers | 2026-04-22 | Neue Domain-Analyzer tracken |
| Concept | Choose right Azure AI tool | https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/choosing-right-ai-tool | 2026-04-22 | CU-vs-DI-Positionierung, MS-Sprachregelung |
| Concept | Region & Language Support | https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/language-region-support | 2026-04-22 | **CH-Verfügbarkeits-Watch** |
| Concept | Pricing Explainer | https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/pricing-explainer | 2026-04-22 | Kosten-Modell-Änderungen |
| Pricing | Content Understanding Pricing | https://azure.microsoft.com/en-us/pricing/details/content-understanding/ | 2026-04-22 | Preispunkt-Änderungen |
| Concept | Models & Deployments | https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/concepts/models-deployments | 2026-04-22 | Unterstützte Foundry-Modelle |
| What's New | CU Release Notes | https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/whats-new | 2026-04-22 | API-Version-Releases, Feature-Drops |
| Blog | CU GA Announcement (25.11.2025) | https://devblogs.microsoft.com/foundry/azure-content-understanding-is-now-generally-available/ | 2026-04-22 | GA-Context, Kunden-Referenzen |
| Tools | Content Understanding Studio | https://ai.azure.com/explore/aiservices/vision/contentunderstanding | 2026-04-22 | UX-Experimentieren |
| Tools | Azure Pricing Calculator | https://azure.microsoft.com/en-us/pricing/calculator/ | 2026-04-22 | Cost-Projection vor Angebot |
| Roadmap | Azure Updates | https://azure.microsoft.com/en-us/updates/?query=content+understanding | 2026-04-22 | Region-Expansion, Feature-GA |

### Secondary (Analysten & vertrauenswürdige Industrie)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| Directions on Microsoft | (Subscription) | — | *{TODO: Abo checken, Foundry-Tools-Positioning}* |
| Gartner IDP Magic Quadrant 2026 | *{TODO: sobald veröffentlicht}* | — | Marktposition CU vs. ABBYY/Hyperscience |

### Tertiary (Community / MVPs / Blogs)

*{TODO: bekannte CU-MVPs sammeln — Azure AI Advocates Reddy/Burkholder, Foundry-Team-Blog}*

### Events / Konferenzen zum Beobachten

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| AI Tour Zürich 2026 | 29.04.2026 | CH-Regions-Roadmap, Pro-Mode-Demos |
| Microsoft Build 2026 | Mai 2026 | Pro-Mode-GA, MCP-Server-Preview, neue Domain-Analyzer |
| Microsoft Ignite 2026 | Nov 2026 | Evtl. CU-in-CH-North, Cross-Modality-Pro-Mode |

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive Content Understanding: multimodales Schema-Driven Extraction, Abgrenzung zu Document Intelligence, SMB-Use-Cases, Pricing-Matrix (Content-Extraction + Contextualization + Foundry-Tokens), Standard-vs-Pro-Mode, Prebuilt-Analyzer-Kategorien, Region-Coverage (🔴 kein CH), Integrationen (MAF/Logic Apps/Purview), Compliance-Fallstricke (Face-Biometrik, EU-Data-Zone bei Pro Mode), 7 konkrete Fallstricke | https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/ |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
