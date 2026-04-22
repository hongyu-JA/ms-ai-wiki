---
watch: standard
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Document Intelligence, DI, Form Recognizer, Azure Form Recognizer]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Azure AI Document Intelligence

*Azures **deterministischer OCR-/IDP-Service** in [[Foundry Tools]] — extrahiert Text, Layout, Tabellen und fachliche Felder aus Rechnungen, Verträgen, Ausweisen, Belegen, Formularen. GA-Version **v4.0** (REST `2024-11-30`) seit November 2024. Ex-Name **Form Recognizer** (Rebrand 2024). Für SMB-Kunden einer der häufigsten KI-Einstiege: Rechnungsverarbeitung, Vertrags-Backload, ID-Verifikation. **In Switzerland North verfügbar** — das macht DI im DACH-Kontext zur Default-Wahl für regulierte Workloads, wo [[Azure AI Content Understanding]] (noch) scheitert.*

> **Analogie:** Was ABBYY FlexiCapture on-prem seit 15 Jahren macht, nur Cloud-native, REST-first, mit fertigen Modellen für Standard-Dokumenttypen und Transformer-basiertem Custom-Training aus 5 Beispielen.

---

## Einsatz

### Job-to-be-done

*When I* große Mengen strukturierter Daten (Beträge, Daten, Adressen, Zeilenposten) aus semi-strukturierten Dokumenten (Rechnungen, Formularen, Ausweisen, Verträgen) extrahieren muss, *I want to* entweder ein fertiges Prebuilt-Modell aufrufen oder mit 5–500 gelabelten Beispielen ein Custom-Modell trainieren, *so I can* Dokumenten-Daten deterministisch, auditierbar und mit Confidence-Scores in Dataverse, Dynamics, ERP oder SharePoint bereitstellen — ohne eigenes OCR-Setup, ohne LLM-Halluzinationen.

### Trigger-Signale

- „Wir bekommen 500 Lieferantenrechnungen pro Woche per Mail, Buchhaltung tippt das alles ab."
- „Treuhand-Kunde will 10.000 Altverträge strukturieren — Stammdaten, Laufzeit, Klauseln."
- „Fuhrpark-Tankbelege sollen in Dynamics 365 landen, Spesen-App auf dem Handy."
- „Wir brauchen KYC-Workflow für neue Kunden — Ausweise scannen, Daten validieren."
- „Unser Compliance sagt: CH-Residenz Pflicht, Gen-AI zu nicht-deterministisch — wir brauchen einen auditierbaren Extractor."

### Einsatz-Szenarien

1. **Rechnungseingang automatisiert (SMB-Klassiker)** — Mittelständischer DACH-Kunde mit 200–2.000 Eingangsrechnungen/Monat. `prebuilt-invoice` extrahiert Kopfdaten + Zeilenposten, Output via [[Power Automate]] oder [[Logic Apps]] nach Dataverse/Dynamics/Abacus. 70–90 % Straight-Through-Processing möglich, Rest geht in Review-Queue via Confidence-Threshold. **Journai-Hebel**: Standard-Paket „AP-Automation", 5–10 Tage Beratung inkl. Approval-Workflow.
2. **Vertrags-Backload für Treuhand/Recht** — 10.000+ PDF-Altverträge sollen in Stammdatensystem. Zweistufig: `prebuilt-layout` + `prebuilt-contract` für Parteien/Laufzeit, dann **Custom Neural** auf 50 gelabelten Beispielen für klausel-spezifische Felder (Kündigungsfristen, Indexierungen). Ergebnis: durchsuchbare Vertragsdatenbank statt PDF-Ordner. **Journai-Hebel**: Projekt „Vertragsintelligenz-Migration", 10–20 Tage.
3. **KYC/Onboarding für Finanz-/Versicherungs-SMB** — `prebuilt-idDocument` (mit erweitertem EU-Ausweis-Support seit Feb 2024) validiert Pass/ID, gleicht gegen AML-Register ab. Eigene Kundendaten via [[Azure AI Search]] für Dubletten-Check. **CH-Compliance** dank Switzerland North erfüllbar — Differenzierung gegenüber reinen LLM-Lösungen.
4. **Agent-Tool für [[Microsoft Agent Framework]]** — DI als Skill im Agent. User lädt PDF hoch, Agent ruft `analyze_document`, verarbeitet JSON-Output im Kontext weiter („Was ist der Betrag auf Rechnung 2024-0815?"). Low-Code-Variante via [[Copilot Studio]] + DI-Connector.
5. **Spesen-Erfassung Mobile** — `prebuilt-receipt` für Tank-/Bewirtungsbelege, Foto via Handy → JSON → Dynamics/SAP Concur-Ersatz. Günstig (OCR-first, keine LLM-Tokens). Gibt's bei Journai aktuell als PoC-Idee, kein Produktiv-Kunde.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Azure Subscription mit Cognitive Services / Foundry-Resource. Kein M365-/Copilot-Bezug nötig. Pay-as-you-go (S0) oder kostenloser F0-Tier für PoCs. |
| **Tenant / Infrastruktur** | **Switzerland North verfügbar** (Key für CH-Residenz). Auch West Europe, North Europe, France Central, Germany West Central. Optional: Container-Deployment (Read + Layout v4.0 ab 2025) für on-prem / disconnected. |
| **Skills / Rollen** | REST/Python/.NET/JS-Dev für SDK-Integration, Azure-Admin für Resource + RBAC, Labeler für Custom-Training (Studio-Tool integriert, aber manueller Aufwand real). |
| **Compliance-Rahmen** | MS Standard-DPA deckt DI ab, Data-Residency CH möglich, keine Trainingsnutzung von Kundendaten. Für regulierte Branchen: Managed Identity + Private Endpoints via VNet. |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | 3–5 Tage für Prebuilt-Only-Flow (Invoice → Dataverse). 10–20 Tage für Custom-Neural-Training inkl. Labeling + Review-Workflow. Vertrags-Backload je nach Volumen 15–40 Tage. |
| **Laufende Lizenzkosten** | **$10 / 1.000 Seiten** Prebuilt (Invoice, Receipt, ID, Contract, Tax), **$1.50 / 1.000 Seiten** Read-only (OCR). **Custom Extraction $30 / 1.000 Seiten**, Custom Classification $3 / 1.000. **Add-ons** (High-Resolution, Formula, Font) $6 / 1.000. **Free-Tier F0**: 500 Seiten/Monat. SMB-Richtwert 1.000 Rechnungen/Monat (2–3 Seiten): **~$25–30/Monat Prebuilt**. |
| **Laufender Betrieb** | 0.5–1 Personentag/Monat — Confidence-Threshold tunen, Custom-Modell-Retraining bei neuem Lieferanten-Pool, Monitoring via App Insights. |

### Empfehlung

**Status:** 🟢 **Empfehlen** — für dokumentenlastige SMB-Workflows einer der klarsten KI-Business-Cases überhaupt.

DI ist die **deterministische, auditierbare, CH-fähige Alternative** zu [[Azure AI Content Understanding]]: weniger multimodal, weniger „Gen-AI-Zauberei", aber 3–6× günstiger bei Standard-Rechnungen, mit stabilem Verhalten über API-Versionen hinweg und — entscheidend für DACH — **in Switzerland North verfügbar**. Microsoft positioniert CU als Default für „neue Workloads", aber für stabile, extractive, regulierte Flows bleibt DI der Backbone. Kombiniert mit [[Microsoft Agent Framework]] ein sehr starker SMB-Usecase.

**Nächster Schritt für Journai:** (1) Fertiges Standard-Angebot „AP-Automation mit DI + Power Automate + Dataverse" paketieren, Zielpreis 8–12k EUR. (2) PoC-Vorlage `prebuilt-invoice` → Dataverse für Onboarding-Gespräche. (3) Abgrenzungs-Matrix DI vs. CU als internes Entscheidungs-Cheatsheet pflegen — Kunden fragen das aktiv. (4) CH-Residenz als Sales-Argument gegenüber CU + externen Anbietern nutzen.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | **GA v4.0** — REST API `2024-11-30` seit Nov 2024. SDKs (Python/.NET/Java/JS) GA seit Dez 2024. v3.1, v3.0, v2.1 weiterhin GA/supported. Preview-APIs vor `2024-11-30` retired. |
| **GA-Datum** | v4.0 GA: 2024-11 · Rebrand Form Recognizer → Document Intelligence: 2024 · Form Recognizer GA: 2020 · Ursprung (v1): 2019. Neueste inkrementelle Updates **März 2026** (Prebuilt-Tax-Update 2025 forms, Multi-Copy-Extraction). |
| **Preismodell** | Pay-as-you-go pro Seite (S0 Standard Tier) oder F0 Free Tier. Keine Abo-/Seats. Billing monatlich nach Modell + Seitenzahl. |
| **Standardpreise USD (S0, 04/2026)** | **Read (OCR)**: $1.50 / 1.000 Seiten · **Layout**: $10 / 1.000 Seiten · **Prebuilt** (Invoice, Receipt, ID, Contract, Business Card, Tax, Mortgage, Bank Statement, Check, Pay Stub, Credit Card, Marriage Cert, Health Ins.): **$10 / 1.000 Seiten** · **Custom Classification**: $3 / 1.000 Seiten · **Custom Extraction / Custom Generative**: **$30 / 1.000 Seiten** · **Add-ons** (High-Res, Formula, Font, Barcode): $6 / 1.000 Seiten · **Query Fields**: enthalten in Add-ons / Layout · **Custom Neural Training**: erste 20 Runs/Monat frei, dann paid Tier · **Custom Template Training**: frei. |
| **Standardpreise EUR** | Nicht separat publiziert — Azure verrechnet in lokaler Währung basierend auf USD-Preis zum Tagekurs. |
| **F0 Free Tier** | 500 Seiten/Monat für Prebuilt/Read/Layout. Für PoCs + Demos ideal. Keine Custom-Modelle. |
| **Lizenz-Bundle** | Keins — reines Azure-Consumption. Kein E5/E7/Copilot-Bezug. |
| **Voraussetzung** | Azure Subscription + Foundry-/AI-Services-Resource. |
| **Region-Verfügbarkeit** | **🟢 Switzerland North verfügbar** · West Europe · North Europe · France Central · Germany West Central · UK South · Sweden Central · plus US/APAC. Globale Deckung deutlich breiter als CU. **v4.0 Preview-Features anfangs nur EastUS/WestUS2/WestEurope** — GA-Rollout inzwischen abgeschlossen. |
| **Container-Verfügbarkeit** | **Read** v4.0 Container: Juni 2025 · **Layout** v4.0 Container: April 2025. Ermöglicht Disconnected/Air-Gapped-Deployments (Commitment-Tier nötig). |
| **CSP-Promo / Discounts** | Commitment-Tiers für hohe Volumen (Details via Azure Account Team). Enterprise-Agreements mit Azure-Spend-Discount inkludieren DI. |
| **Hidden Costs** | (1) **Add-ons werden zusätzlich** zum Basis-Modell abgerechnet — High-Res + Formula auf Invoice = $16/1.000 Seiten, nicht $10. (2) Custom Neural Training über 20 Runs/Monat kostet extra. (3) Storage + Egress für PDFs sind separate Azure-Kosten. (4) Studio-Labeling-Zeit ist der unsichtbare Hauptkostenposten bei Custom-Projekten. |
| **Upgrade-Pfad** | Bestandskunden auf v3.1/v3.0: SDK-Upgrade auf `2024-11-30` empfohlen, API weitgehend rückwärts-kompatibel. **Richtung [[Azure AI Content Understanding]]**: gleicher Foundry-Endpoint, ähnliche Prebuilt-Namen, Custom-Schemas teils direkt übertragbar — MS empfiehlt CU für **neue** multimodale Workloads, DI für bestehende + deterministische Flows. |

---

## Kernkonzept

### Was es im Kern ist

Document Intelligence ist ein **dreischichtiger IDP-Service**: (1) **OCR/Layout-Engine** — proprietäre Transformer-basierte Text-/Struktur-Erkennung auf Microsoft-Research-Stack, unterstützt 100+ Sprachen, Handschrift, 2D-Barcodes, Formeln. (2) **Prebuilt-Field-Extraktoren** — ~30 domänenspezifische Modelle für Rechnung, Vertrag, Ausweis etc., trainiert von MS auf großen Referenzkorpora, schema-stabil über API-Versionen. (3) **Custom-Training-Pfad** — Nutzer labelt 5–500 Beispiele, DI trainiert Neural (Transformer) oder Template (Regex/Anchor-basiert) Extraktor. Output ist **immer strukturiertes JSON** mit Key-Value-Pairs, Tables, Selection Marks, Bounding Boxes und Confidence-Scores pro Feld.

Der konzeptuelle Kernunterschied zu [[Azure AI Content Understanding]]: DI ist **OCR-first und extractive** — jeder Output-Wert lässt sich auf eine Bounding Box im Input zurückführen, Verhalten ist deterministisch bei identischem Input, keine LLM-Inferenz im Standardpfad. Das ist für regulierte Workflows (Banking, Treuhand, Versicherung, Health) die Voraussetzung, um Prozesse zu auditieren und zu zertifizieren. CU fügt LLM-basierte Contextualization/Generation oben drauf, kostet aber Determinismus.

Die zweite Design-Wette: **klare Trennung Prebuilt vs. Custom**. Prebuilts sind zero-shot nutzbar, decken die 80 %-Standard-Cases, aber sind **fix in Schema und Sprachen** (z. B. `prebuilt-invoice` hat `VendorName`/`InvoiceTotal`/`Items[]` — mehr gibt es nicht ohne Custom). Für fachspezifische Felder (USt-IdNr.-Validierung, Schweizer QR-Referenz, branchenspezifische Klauseln) zwingt DI in den Custom-Pfad. Seit v4.0 gibt es zusätzlich **Custom Generative Extraction** (LLM-gestützt, im Preisschema $30/1.000 Seiten gleich zu Custom Extraction) — das ist die Brücke zu CU, bleibt aber in der DI-Welt deterministisch wo möglich.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| **Input Ingestion** | File-Upload / Blob-URL / Base64 | Kunde ([[Logic Apps]] / [[Power Automate]] / SDK / SharePoint-Trigger) |
| **OCR / Layout** | Text, Tabellen, Selection Marks, Bounding Boxes | Document Intelligence ($1.50/1k Read, $10/1k Layout) |
| **Field Extraction** | Semantische Felder pro Dokumenttyp | Document Intelligence Prebuilt oder Custom ($10 resp. $30/1k) |
| **Classification (optional)** | Dokumenttyp-Routing vor Extraction | Document Intelligence Custom Classifier ($3/1k) |
| **Post-Processing** | Validierung, Threshold-Review, Currency-Normalisierung | Kunde (im Downstream-System) |
| **Output-Persistenz** | JSON → strukturierte DB / ERP | Kunde ([[Dataverse]], SharePoint, SAP, Dynamics) |
| **Orchestration** | Tool-Aufruf aus Agent/Workflow | [[Microsoft Agent Framework]] / [[Foundry Agent Service]] / [[Copilot Studio]] / [[Logic Apps]] / [[Power Automate]] |

### Kern-Fähigkeiten

#### Prebuilt-Modelle (Domain-Bibliothek, ~30 Modelle)

DI bündelt vortrainierte Extraktoren in fünf Kategorien: **Financial & Legal** (`prebuilt-invoice`, `-receipt`, `-contract`, `-check`, `-creditCard`, `-bankStatement`, `-payStub`), **Personal ID** (`prebuilt-idDocument` mit EU-Ausweis-Erweiterung Feb 2024, `-healthInsuranceCard.us`, `-marriageCertificate.us`), **US Tax** (`prebuilt-tax.us`, `-tax.us.w2/w4/1040/1095A/1095C/1098/1099/1099SSA` inkl. Multi-Copy-Extraction seit März 2026 — **DACH-Gap: keine EU-Steuer-Prebuilts**), **US Mortgage** (`prebuilt-mortgage.us.1003/1004/1005/1008/closingDisclosure` — für DACH irrelevant), **Generic** (`prebuilt-read`, `-layout`). Relevant als Zero-Shot-Start für Standard-Cases. Grenze: Schemas sind **fix** — USt-IdNr., IBAN-Validierung, Schweizer QR-Referenz, DACH-spezifische Felder erfordern Custom oder `queryFields`.

#### Custom Neural Models (Transformer, Mixed-Layout)

Für eigene Formulare mit variablem Layout. **Ab 5 gelabelten Beispielen trainierbar**, Transformer-basiert, unterstützt Handschrift + Signature-Detection (seit v4.0). Trainingszeit: Minuten bis Stunden. Erste 20 Training-Runs/Monat frei, danach paid. Relevant, wenn Prebuilts nicht passen und Dokumente strukturell variieren (mehrere Lieferanten mit ähnlicher Semantik, aber unterschiedlichem Layout). Grenze: **Label-Qualität ist alles** — schlechte Trainingsdaten = schlechtes Modell. Seit Feb 2024: Overlapping Fields + Table/Row/Cell Confidence.

#### Custom Template Models (fixes Layout)

Für Formulare mit immer gleichem Layout (behördliche Anträge, interne Formulare). Regex/Anchor-basiert, **ab 2 Beispielen**. Kein ML-Training im Wortsinn, deterministischer als Neural. Relevant bei internen Formularen, die nie variieren. Grenze: reagiert empfindlich auf Layout-Drift — schon leichte Verschiebung = Extraction-Fehler.

#### Custom Classification

Routet Mixed-Batches vor der Extraktion: PDF enthält Rechnung + Vertrag + ID → Classifier trennt, gibt an passende Extraktoren weiter. Seit v4.0: **incremental training** (neue Klassen hinzufügen ohne Neu-Training), 25.000 Seiten Training-Page-Limit, Office-Formate (DOCX/PPTX/XLSX). Kosten: $3/1.000 Seiten — eigenständig am günstigsten. Relevant für zentralen Posteingang mit gemischten Dokumenttypen.

#### Layout-Modell (`prebuilt-layout`)

Tabellen-Extraktion mit Header/Row-Detection, Reading Order, Section Hierarchy, Figure Detection (seit Feb 2024, Figures als Image-Download), **Markdown-Output** (seit Nov 2023) für RAG-Ingestion. `queryFields` als Add-on auf Layout ist der kostengünstige Pfad zu „Freitext-Fragen an PDF". Seit v4.0 auch Office/HTML-Input. Grenze: komplexe nested tables oder visuell anspruchsvolle Layouts (Charts, Infografiken) sind Schwachstelle — hier ist CU mit LLM-Support stärker.

#### Read-Modell (reines OCR + PDF-Search)

Billigster Pfad ($1.50/1k Seiten), pure Text-Extraktion mit Bounding Boxes + Sprach-Detection. Seit v4.0: **Searchable PDF kostenlos inkludiert** (OCR-Overlay auf Scan-PDF), Image-Formate (JPEG/PNG/BMP/TIFF/HEIF), Chinese/Japanese/Korean PDF-Output. Relevant für Archiv-Digitalisierung, Volltext-Indexierung, Screenreader-Zugänglichkeit. Grenze: keine Felder/Struktur — nur Rohtext.

#### Add-On Capabilities (optional, kostenpflichtig)

`ocr.highResolution` (4k-Scans, Mikrotext), `ocr.formula` (LaTeX-Output für technische Dokumente), `ocr.font` (Font-Eigenschaften), `ocr.barcode` (1D/2D inkl. QR), `keyValuePairs`, `queryFields` (LLM-basierte Ad-hoc-Felder per Prompt). Alle $6/1.000 Seiten zusätzlich zum Basis-Modell. Relevant bei Edge-Cases (Engineering-Docs, Barcode-Belege). **Fallstrick**: Summieren sich in Cost-Projection.

#### Batch API (v4.0)

Bulk-Verarbeitung hunderter Dokumente in einem Request, LIST-/DELETE-Support für GDPR-Compliance. Relevant für Migrations-Projekte (Vertrags-Backload, Archiv-Digitalisierung). Seit v4.0 für alle Modelle (vorher nur teilweise).

### Typischer Workflow

1. **Setup** — Cognitive-Services- oder Foundry-Resource in Switzerland North provisionieren (CH-Residenz) oder West Europe für EU. RBAC via Managed Identity (`Cognitive Services User`). Terraform/Bicep ~0.5 Tage. F0-Tier für initiale PoCs kostenlos aktivieren.
2. **Prebuilt-Test** — **[Document Intelligence Studio](https://documentintelligence.ai.azure.com)** öffnen, 3–5 reale Kundendokumente hochladen, passendes Prebuilt ausprobieren (Invoice → Receipt → Contract etc.), JSON-Output prüfen, Confidence-Scores bewerten. Entscheidung: reicht Prebuilt oder Custom nötig? 1–2 Tage.
3. **Custom-Training (falls nötig)** — 5–50 Beispieldokumente im Studio labeln (Rechtecke um Felder + Key zuweisen), Trainingsjob starten, Custom Neural empfohlen für variable Layouts. Iterative Verbesserung: Modell evaluieren, falsch-negative Samples dazulabeln, retrainen. 3–10 Tage je nach Komplexität.
4. **Integration** — Entweder (a) **[[Power Automate]]-Flow** (Low-Code, SMB-Standard: SharePoint-Trigger → DI-Action → Dataverse), (b) **[[Logic Apps]]** (skalierbarer, besser für Batch), (c) **Python/.NET-SDK** in eigene App, (d) **[[Microsoft Agent Framework]]-Tool** (Agent ruft DI bei User-Upload), (e) **[[Copilot Studio]]-Connector** für Self-Service. Managed Identity bevorzugt gegenüber API-Keys.
5. **Operate** — Monitoring via Azure App Insights (Latenz, Error-Rate, Seitenvolumen), Confidence-Threshold in Downstream-Logik (z. B. Felder <0.85 → Review-Queue), Custom-Modell-Retraining bei Drift (neuer Lieferanten-Pool, Template-Änderung), monatliches Kostenreview gegen Seitenvolumen.

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai intern)** | Python oder .NET, REST-APIs, Azure-Grundlagen (RBAC, Managed Identity), Erfahrung mit JSON-Parsing + Post-Processing, Labeling-Geduld für Custom. Kein ML-Deep-Dive nötig (DI abstrahiert das). |
| **Admin (beim Kunden)** | Azure Subscription Contributor, Entra-Admin für Managed Identity. Kein Coding. |
| **End-User (beim Kunden)** | Keine — Dokument rein, JSON landet im ERP/Dataverse. Review-Queue-User brauchen UI (Power Apps / custom Frontend). |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Keine EU-Steuer-Prebuilts** — alle Tax-Modelle sind US (W-2, 1040, 1099, 1095). DACH-USt-Voranmeldung, CH-Mehrwertsteuer fehlen. | Custom Neural auf `prebuilt-layout`-Basis + selbst labeln. Keine Out-of-the-Box-Abkürzung. |
| **Keine Multi-Modal-Analyse** — kein Audio, kein Video, keine Cross-Document-Reasoning | [[Azure AI Content Understanding]] (Sweden Central) für multimodal, aber nicht in Switzerland North |
| **Prebuilt-Schemas sind fix** — z. B. kein `VatId`-Feld in `prebuilt-invoice` für DE/AT/CH | `queryFields` Add-on für Ad-hoc-Felder ($6/1k) oder Custom Neural |
| **Handschrift-Qualität schwankt** bei schlechten Scans / engen Zeilenabständen | Pre-Processing (Deskew, Upscale), `ocr.highResolution` Add-on aktivieren |
| **Kein Deklarationsmodell** für Business-Regeln („Total = Net + Tax") | Post-Processing im Kunden-Code oder Custom-Generative mit LLM-Prüflogik |
| **Custom-Neural-Retraining braucht Repräsentativität** — 5 Samples reichen für PoC, Produktion oft 50–200 | Kontinuierliches Feedback-Loop + Incremental-Retraining einplanen |
| **Prebuilt-Invoice Tax-Items erst seit Feb 2024 für DE/ES/PT** — ältere Integrationen pinnten alte API-Version | Auf API-Version `2024-11-30` upgraden, Integration-Tests nach Upgrade |
| **Preview-APIs sind retired, sobald GA erscheint** — `2023-02-28-preview`, `2023-07-31`, `2023-10-31-preview` außer Support | Immer GA-API (`2024-11-30`) pinnen, nicht Preview in Produktion |

### Typische Fallstricke im Einsatz

- **Confidence-Score ignorieren** — Kunde schiebt alles ungefiltert in ERP, ~5 % Fehler = stumme Falschbuchungen. **Vermeidung**: Threshold-Review-Workflow ab Tag 1, typisch >0.85 auto-pass, zwischen 0.70–0.85 Review-Queue, <0.70 reject.
- **Add-Ons vergessen in Cost-Projection** — Kunde kalkuliert $10/1k Invoice, sieht Rechnung mit $16 (Invoice + High-Res + Formula). **Vermeidung**: Add-ons explizit in Angebot aufschlüsseln.
- **Prebuilt direkt in Produktion referenzieren** — Schema-Updates bei neuen API-Versionen können stille Downstream-Fehler auslösen. **Vermeidung**: API-Version pinnen, Integration-Tests bei SDK-Upgrade.
- **DI vs. CU-Entscheidung verschoben** — Kunde baut PoC auf DI, Business will dann plötzlich Audio-Transkripte/Videos mit drin → Stack-Wechsel teuer. **Vermeidung**: Im Pre-Sales fragen „Welche Modalitäten in 12 Monaten?", **Entscheidungsregel**: multimodal/unstrukturiert → CU, stabil/deterministisch/CH-Residenz → DI.
- **Custom Neural ohne Label-Qualitäts-Budget** — Kunde will „KI soll's lernen", labelt 5 Beispiele schlampig, Modell schlecht → DI-Ruf beschädigt. **Vermeidung**: mindestens 30–50 sorgfältig gelabelte Beispiele für Produktion, Label-Aufwand 1–3 Tage einplanen.
- **Handschrift überschätzen** — Kunde scannt Tank-Quittungen mit Kugelschreiber-Unterschrift bei schlechter Qualität → Extraction-Qualität bricht ein. **Vermeidung**: realistische Sample-Tests im Pre-Sales, falls nötig Content Understanding (LLM robuster) oder manuelles Backup.
- **Free-Tier als Produktions-Basis annehmen** — F0 500/Monat ist nur für Tests. **Vermeidung**: S0 ab Go-Live.
- **Switzerland-North-Verfügbarkeit als selbstverständlich kommunizieren** — einzelne Features (v4.0-Preview-Features) waren zeitweise nur EastUS/WestEurope. **Vermeidung**: vor Commitment prüfen, ob alle benötigten Features in CH-North GA sind.

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| **[[Microsoft Agent Framework]]** | DI als Tool im Agent (Upload → JSON → Context) | GA | Async-Handling bei Batch-Requests, Long-Running-Ops bei großen PDFs |
| **[[Foundry Agent Service]]** | DI als Managed-Agent-Tool | GA | Region-Alignment Agent + DI (beide in CH-North möglich) |
| **[[Copilot Studio]]** | DI-Connector für Declarative Agents | GA | Connector-Lag nach API-Updates (wie bei allen Power-Platform-Connectors) |
| **[[Power Automate]]** | DI-Action für Low-Code-Flows (SMB-Standard-Pfad) | GA | Premium-Connector, benötigt Per-User- oder Per-Flow-Lizenz |
| **[[Logic Apps]]** | DI-Connector für skalierbare Workflows | GA | Connector-Version-Check bei v4.0-Features |
| **[[Dataverse]]** | Output-Sink für strukturiertes JSON | GA (über Power Automate) | JSON-Mapping auf Dataverse-Tabellen manuell gestalten |
| **[[Azure AI Search]]** / **[[Foundry IQ]]** | Layout-Markdown-Output als RAG-Ingestion | GA | `prebuilt-layout`-Markdown + Figures sauber mappen |
| **[[Azure AI Content Understanding]]** | Koexistenz — CU für multimodal/unstrukturiert, DI für stabil/CH/deterministisch | GA | Entscheidungsmatrix in [[Foundry Tools]] beachten, Cost-Doppelung vermeiden |
| **[[Microsoft Purview]]** | Classification auf DI-Output-JSON | Standard | Sensitivity-Labels auf extrahierte Felder separat konfigurieren |
| **Azure Blob Storage** | Input-Source via SAS-URL / Managed Identity | GA | Managed Identity empfohlen, SAS-Keys Rotation-Aufwand |
| **SharePoint** | Trigger (neues Dokument → DI → Dataverse) | GA via Power Automate | Retention-Policies beachten |
| **Dynamics 365 F&O / Business Central** | AP-Automation Output-Sink | GA (via Power Automate) | Custom-Mapping von Invoice-JSON auf Dynamics-Vendor/GL-Accounts |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| **SAP Concur / Abacus / Bexio** (DACH-ERP) | Invoice/Expense-Output-Sink | Custom-Integration | Kein nativer Connector, REST-Custom-Code |
| **Salesforce** | KYC-Daten-Sink | via MuleSoft/Custom | — |
| **n8n / Zapier** | SMB-Low-Code-Automation | Community-Connector | Custom HTTP-Node mit Entra-OAuth |
| **DataSnipper** (Excel-Audit) | DI-Integration für Audit-Workflows | Partner | Audit-/Finance-Scope |
| **ABBYY FlexiCapture (on-prem)** | Migrationspfad zu DI | Direkter Konkurrent | Label-Format-Konvertierung nötig |

### APIs / Protokolle

- **REST API** `2024-11-30` (GA, v4.0) · ältere GA-Versionen `2023-07-31` (v3.1), `2022-08-31` (v3.0) weiterhin supported
- **SDKs (GA Dez 2024)**: Python (`azure-ai-documentintelligence`), .NET (C#), Java, JavaScript/TypeScript
- **Entra-Auth** (Managed Identity, Service Principal) empfohlen über API-Key
- **Container-Deployment** für Read + Layout v4.0 (disconnected / on-prem, Commitment-Tier)
- Keine GraphQL, kein OData — klassisches REST-JSON
- **Batch API** ab v4.0 für alle Modelle — LIST/DELETE für GDPR-Compliance

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | **🟢 Switzerland North verfügbar** für Data-at-Rest + Processing. Auch West/North Europe, France Central, Germany West Central. Einzige AI-Foundry-Tool mit robuster CH-Residenz (vs. CU in Sweden Central). |
| **Prompts & Outputs** | **Keine Trainingsnutzung** von Kundendaten (MS Standard-DPA). Analyse-Response wird **24h** gespeichert für Retrieval, dann auto-gelöscht. Explizite `DELETE /analyzeResult` API für frühere Löschung (GDPR Art. 17). |
| **Data Processing Addendum (DPA)** | MS Products and Services DPA deckt DI vollständig ab. Kein Supplemental nötig für GA-Features. Preview-Features (falls genutzt): Supplemental Terms of Use. |
| **EU-AI-Act-Klassifizierung** | Als General-Purpose-IDP-Tool wahrscheinlich **Limited Risk** für Standard-Extraktion. Spezifische Deployments (KYC/AML-Entscheidungen auf ID-Extraktion, Kreditscoring aus Payslips) können **High Risk** werden — Kunde muss Use-Case-Risk-Assessment durchführen. |

### Microsoft-Compliance-Stack

- **[[Microsoft Purview]]** — Sensitivity-Labels auf DI-Output-JSON möglich (via Dataverse/SharePoint-Integration), Purview DSPM for AI beobachtet DI-Aufrufe als AI-Interactions.
- **Defender for Cloud** — Cognitive-Services-Resource im Scope, Endpoint-Monitoring + Threat-Detection inklusive.
- **Entra** — Managed Identity + RBAC (`Cognitive Services User`, `Cognitive Services Contributor`). Conditional Access auf Portal-Zugriff.
- **Private Endpoints + VNet** — DI-Resource isolierbar, kein Public-Internet-Traffic. Standard-Muster für regulierte SMB (Banking, Health).
- **Content Safety** — nicht standardmäßig relevant (kein Gen-AI im Core), aber Custom-Generative Extraction (LLM-gestützt) triggert CS-Guardrails.
- **Customer-Managed Keys (CMK)** — für Data-at-Rest-Encryption mit eigenem Key Vault.

### Bekannte Compliance-Lücken

- **Face/ID-Dokument-Verarbeitung triggert Biometric-Data-Pflichten (DSGVO Art. 9)** — bei `prebuilt-idDocument` muss Kunde Einwilligung, Retention, Löschung managen.
- **Custom Generative Extraction** (v4.0-Feature) nutzt LLM im Backend → Compliance-Scope größer als rein extractive DI, separat bewerten.
- **24h-Response-Speicherung** ist kurz, aber für ultra-strikte Regulierung (z. B. gewisse Banking-Workflows) evtl. zu lang — `DELETE /analyzeResult` einbauen.
- **Container-Deployment für Disconnected** benötigt Commitment-Tier und separaten DSGVO-Scope (Container läuft in Kunden-Umgebung, aber Modell-Updates pullen von MS-Registry).

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Product Page | Azure Document Intelligence | https://azure.microsoft.com/en-us/products/ai-foundry/tools/document-intelligence | 2026-04-22 | Positionierung, Marketing-Claims |
| Overview | Learn — What is Document Intelligence | https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/overview | 2026-04-22 | Architektur, Modell-Klassen, Feature-Matrix |
| What's New | DI Release Notes | https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/whats-new | 2026-04-22 | API-/SDK-Updates, neue Prebuilts, Region-Rollouts |
| Model Overview | Document Processing Models | https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/model-overview?view=doc-intel-4.0.0 | 2026-04-22 | Prebuilt-Inventar, Feature-Matrix |
| Pricing | Azure DI Pricing | https://azure.microsoft.com/en-us/pricing/details/document-intelligence/ | 2026-04-22 | Preispunkte, Commitment-Tiers |
| Language Support | Prebuilt Language/Locale Support | https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/language-support/prebuilt?view=doc-intel-4.0.0 | 2026-04-22 | DE/AT/CH-Gaps, neue Locales |
| Region Availability | Products by Region | https://azure.microsoft.com/en-us/explore/global-infrastructure/products-by-region/table | 2026-04-22 | **CH-North-Watch**, neue Regionen |
| Service Limits | Quotas & Limits | https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/service-limits?view=doc-intel-4.0.0 | 2026-04-22 | TPS/Size-Limits bei Skalierungs-Projekten |
| Tools | Document Intelligence Studio | https://documentintelligence.ai.azure.com | 2026-04-22 | UX-Experimentieren, Labeling, PoC-Demos |
| FAQ | DI FAQ (Form-Recognizer-Rebrand) | https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/faq?view=doc-intel-4.0.0 | 2026-04-22 | Rebrand-Historie, Migrations-Fragen |
| Blog | DI v4.0 GA Announcement | https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/announcing-the-general-availability-of-document-intelligence-v4-0-api/4357988 | 2026-04-22 | v4.0-Context, Feature-Deltas |
| Container | Install & Run Containers | https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/containers/install-run?view=doc-intel-4.0.0 | 2026-04-22 | Disconnected-Deployments, Image-Tags |
| Concept | Add-On Capabilities | https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/concept-add-on-capabilities | 2026-04-22 | Query Fields, High-Res, Formula — Cost-Impact |

### Secondary (Analysten & vertrauenswürdige Industrie)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| Gartner IDP Magic Quadrant | *TODO: 2026-Ausgabe checken* | — | Marktposition DI vs. ABBYY, Hyperscience, Rossum |
| Directions on Microsoft | (Subscription) | — | *TODO: Foundry-Tools-Positioning, CU-vs-DI* |
| itmagination | https://www.itmagination.com/technologies/azure-ai-document-intelligence | 2026-04-22 | Partner-Overview, Praxistipps |

### Tertiary (Community / MVPs / Blogs)

| Autor | Blog / Kanal | Zuletzt gesichtet | Warum relevant? |
|-------|--------------|-------------------|-----------------|
| *TODO* | Azure AI Docs Team | — | First-Hand-Feature-Blogs |
| Signisys | https://www.signisys.com/blog/azure-ai-document-intelligence/ | 2026-04-22 | 2026-Processing-Guide, SI-Perspektive |

### Events / Konferenzen zum Beobachten

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| AI Tour Zürich 2026 | 29.04.2026 | CH-spezifische DI-Referenzen, CU-vs-DI-Positionierung |
| Microsoft Build 2026 | Mai 2026 | v4.x-Updates, neue Prebuilts (evtl. EU-Tax?), Custom-Generative-GA |
| Microsoft Ignite 2026 | Nov 2026 | CU/DI-Konvergenz-Strategie, Container-Roadmap, MCP-Server |

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive Document Intelligence: Prebuilt-Models-Inventar (Financial, ID, Tax, Mortgage, Generic), Custom Neural/Template/Classification/Generative, v4.0 GA `2024-11-30` + SDK-GA Dez 2024, Pricing-Matrix ($1.50 Read / $10 Prebuilt+Layout / $30 Custom / $3 Classification / $6 Add-ons), Region-Coverage inkl. **🟢 Switzerland North verfügbar**, Abgrenzung zu [[Azure AI Content Understanding]] (DI = deterministisch/CH/extractive, CU = multimodal/Gen-AI/Sweden Central), 8 konkrete Fallstricke, DACH-Gaps bei Tax/Mortgage-Prebuilts, EU-Ausweis-Support seit Feb 2024, Container-Deployments 2025 | https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/ |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
