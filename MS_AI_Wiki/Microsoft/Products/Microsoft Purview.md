---
watch: standard
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Microsoft Purview, Purview, Compliance Portal]
moc:
  - "[[Microsoft MOC]]"
  - "[[Security & Identity MOC]]"
---

# Microsoft Purview

*Microsofts **Dach-Portfolio für Data Security, Data Governance und Data Compliance** — bündelt Sensitivity Labels, DLP, Information Protection (MIP), Insider Risk Management, Compliance Manager, Audit, Communication Compliance, eDiscovery, Data Lifecycle Management sowie [[Purview DSPM]] und [[Purview Data Map]] in einem Portal. Für AI-Beratung: die Schicht, die „welche Daten darf [[Microsoft 365 Copilot]] / [[Agent 365]] sehen, verarbeiten, speichern, herausgeben?" regelt — und zwar **solution-level, nicht pro Prompt**.*

> **Analogie:** Was Collibra + OneTrust + Varonis + Symantec DLP getrennt abdecken, versucht Purview als **einheitliche M365-native Suite** zu sein — mit dem Vorteil, dass Labels, DLP-Policies und Audit-Events **nicht erst integriert werden müssen**, sondern zwischen Word, Teams, SharePoint, Copilot und Agent 365 **nativ durchgereicht werden**.

---

## Einsatz

### Job-to-be-done

When I als regulierter SMB Copilot oder Agents einführe und meinem Datenschutzbeauftragten, BaFin/FINMA-Prüfer oder NIS2-Auditor belegen muss, **welche sensiblen Daten wo liegen, wer sie sieht, ob AI sie verarbeiten darf und wie lange sie gespeichert werden**, I want to eine zentrale Governance-Plattform statt sechs Einzelprodukte, so I can die DSGVO-Art.-5/24/30-Nachweispflicht **ohne Excel-Mapping** führen und gleichzeitig mein Copilot-Rollout aufsichtssicher machen.

### Trigger-Signale

- „Unser Pilot hat gezeigt: Copilot gibt HR-Gehaltsdaten in Zusammenfassungen preis."
- „Der DPO fragt, wie wir **belegen** können, dass Copilot keine Kundendaten an OpenAI sendet."
- „Wir müssen für den EU-AI-Act-Audit eine Risikoklassifizierung pro AI-System liefern."
- „NIS2 verlangt Vorfallsmeldung binnen 24 h — wie loggen wir Agent-Aktivität?"
- „Unser Wirtschaftsprüfer will Audit-Logs über 1 Jahr, nicht nur 90 Tage."

### Einsatz-Szenarien

1. **Copilot-Rollout-Vorbereitung (Pre-Flight-Check)** — Kunde mit E5 will M365 Copilot einführen; **vor GA-Tag**: Sensitivity-Label-Taxonomie aktivieren, DSPM-for-AI-Pilot laufen lassen, Oversharing-Risk-Assessment abschließen, DLP-Location „Microsoft 365 Copilot & Copilot Chat" aktivieren. Das ist der Standard-Journai-Workshop, bevor 300 Lizenzen freigeschaltet werden.
2. **Agent-365-Governance-Integration** — Sobald [[Agent 365]] am 2026-05-01 GA geht, erwartet der Kunde, dass Agent-Aktivität im selben Audit-Log wie User-Aktivität landet. Purview liefert das automatisch (Agent-Instances als Users behandelt). Unser Wert: Policy-Set aufsetzen, das Agent-Risiken separat erkennt (Risky AI Usage Template).
3. **DSGVO-/NIS2-/AI-Act-Assessment-Bundle** — Compliance Manager liefert vorgefertigte Templates (EU AI Act, NIST AI RMF, ISO 42001, ISO 23894 — alle seit Nov 2024 GA). Für DACH-Mittelstand: aus Template einen Maßnahmen-Plan ableiten, GAP-Analyse in 3 Tagen statt 3 Wochen.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Minimum E3 + Purview Suite ($12/user/month) oder E5 (Purview weitgehend inkludiert); für DSPM und Insider Risk Premium siehe Pricing-Tabelle |
| **Tenant** | M365-Tenant mit Unified Audit Log **aktiviert** (bei älteren Tenants oft deaktiviert!); Purview-Portal-Zugang freigeschaltet |
| **Skills** | Entra-Admin für Rollen-Zuweisung · Compliance Administrator · mind. 1 Person mit Label-Taxonomie-Verständnis (typischerweise IT + Legal gemeinsam) |
| **Compliance-Rahmen** | DPA akzeptiert (Standard-MS-DPA deckt Purview); EU Data Boundary für EU-Kunden konfiguriert; bei Öffentlichem Sektor: EU Sovereign Cloud prüfen |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup Basis-Purview (Labels + DLP + Audit)** | 5–10 Beratertage bei 100–500 Usern |
| **Vollständiger AI-Governance-Stack (DSPM-for-AI + IRM + Comm. Compliance + Retention)** | 15–25 Beratertage |
| **Laufende Lizenzkosten** | Purview Suite $12/user/month *(eigene Einschätzung: ≈ €11–13, EUR nicht zentral publiziert)* — oder inkludiert in E5 |
| **Laufender Betrieb** | 2–5 h/Woche Policy-Review + False-Positive-Triage für SMB < 500 User |

### Empfehlung

**Status:** 🟢 **Empfehlen** — für **jeden** Kunden mit regulierter Datenbasis **und** Copilot/Agent-Rollout in der EU. Begründung: Purview ist die **einzige** MS-Komponente, die „welche Daten darf AI sehen?" beantwortet — ohne sie ist ein Compliance-fester Copilot-Rollout im DACH-Mittelstand **de facto nicht leistbar**. Viele E5-Kunden haben Purview **lizenziert, aber nicht aktiviert** — hier liegt der größte ungehobene Beratungshebel.

**Nächster Schritt für Journai:** Standard-Angebot „Purview Pre-Flight-Workshop" entwickeln — 3-Tage-Paket: Label-Taxonomie + DSPM-for-AI-Risk-Assessment + DLP-for-Copilot-Policy. Parallel: Compliance-Manager-Templates (EU AI Act, ISO 42001) in Demo-Tenant vorbereiten.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | GA (Dach-Portfolio) — Komponenten gemischt: Kern-Solutions GA, **Purview (preview)** = neue DSPM-Generation rollt aus, **Agent-365-Integration** aktuell in Frontier-Preview (GA zusammen mit Agent 365 am 2026-05-01) |
| **GA-Datum** | Dach-Portfolio seit 2022 (Rebrand von „Microsoft 365 Compliance") |
| **Standalone-Preis (USD)** | **Microsoft Purview Suite: $12/user/month** (yearly, Stand 2026-04-22) — setzt E3-Baseline voraus · einzelne Add-ons (Insider Risk Premium, DSPM-Advanced-Features) zusätzlich |
| **Standalone-Preis (EUR)** | *{UNCLEAR: nicht zentral publiziert — eigene Einschätzung ≈ €11–13/user/month}* |
| **Lizenz-Bundle** | Kern-Purview in **M365 E5** inkludiert · **M365 E5 Compliance Add-on abgekündigt (Sep 2025)** — umbenannt in „Microsoft Purview Suite" · Bestandskunden grandfathered |
| **Voraussetzung** | M365 E3 oder EMS+O365 E3 als Baseline für Purview-Suite-Kauf |
| **Region-Verfügbarkeit** | Global; **EU Data Boundary** aktiv; Purview Sovereign für regulierte Industrien in Roll-out |
| **CSP-Promo** | Über CSP-Partner verfügbar; keine öffentlich bekannten Frontier-Rabatte |
| **Hidden Costs** | **Pay-as-you-go Billing** für Audit-Logs von Non-Microsoft-AI-Apps (ChatGPT, Gemini) — separates Enable! · Insider Risk Premium-Features · Communication Compliance über 250k-User-Limit · **eDiscovery-Premium** hat eigene Retention-Tarife |
| **Upgrade-Pfad** | E3 → Purview Suite (Add-on $12) oder E3 → E5 (Compliance + Security + Analytics inkludiert); Co-Terming üblich bei EA/CSP |

---

## Kernkonzept

### Was es im Kern ist

Purview ist **kein einzelnes Produkt** — es ist ein **Dach über drei Solution-Families**, die historisch aus drei getrennten Produkten zusammengewachsen sind: **Azure Purview Data Catalog** (2020, Data Governance), **Microsoft 365 Compliance Center** (2018, Compliance + Security), **Azure Information Protection** (2016, Sensitivity Labels). Seit 2022 sind alle drei als „Microsoft Purview" gebrandet und in ein einheitliches Portal (`purview.microsoft.com`) konsolidiert.

Die **Seele** des Produkts: **Shared Capabilities** (Classifiers, Connectors, Sensitivity Labels, Data Explorer, Activity Explorer) als **horizontale Schicht**, auf der alle Einzel-Solutions operieren. Ein einmal definiertes Sensitivity Label `Vertraulich/Intern` wirkt in Word (als Header), in SharePoint (als Access-Policy), in DLP (als Policy-Trigger), in eDiscovery (als Such-Facet), in Copilot (als Blocklist-Kriterium) und in Audit (als Metadaten-Feld). **Dieses Propagieren ist der eigentliche MS-Vorteil** — nicht die Einzel-Features, die Drittanbieter teils besser abdecken.

Für AI-Beratung ist die **fundamentale Neuerung seit 2024** die **Data Security Posture Management (DSPM) for AI** — eine eigene „Front Door", die zeigt: welche AI-Apps werden in meinem Tenant genutzt (inkl. ChatGPT via Browser-DLP), welche Prompts enthielten sensitive Daten, welche User teilen zu viel mit AI. Das ist die Schicht, die vor 2024 schlicht fehlte.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| **Policy Authoring** | Zentrale Definition von Labels, DLP-Regeln, Retention, IRM-Triggern | Purview Portal |
| **Enforcement Runtime** | Scannen, Klassifizieren, Blockieren, Labeln in Echtzeit | M365-Services (Exchange, SharePoint, OneDrive, Teams) + Endpoint-DLP-Agent + Defender for Cloud Apps |
| **AI-Hook-Layer** | „Data in use"-Kontrolle für Copilot + Agent 365 | [[Microsoft 365 Copilot]], [[Agent 365]] konsumieren Sensitivity Labels + DLP-Policies |
| **Audit Ingestion** | Unified Audit Log, Activity Explorer, DSPM-Reports | Purview Audit |
| **Compliance Mapping** | Regulatory Templates (DSGVO, EU AI Act, ISO 42001, NIS2) | Compliance Manager |

### Kern-Fähigkeiten

Purview bündelt **drei Solution-Families**. Für SMB-Beratung im AI-Kontext sind die **fett markierten** die relevantesten.

#### 1. Data Security Solutions

- **Information Protection (MIP) & Sensitivity Labels** ← **AI-kritisch**
  Label-Taxonomie (Public → Confidential → Strictly Confidential) als Metadaten an Files, Mails, Teams-Nachrichten. Labels können (a) Header/Footer/Wasserzeichen applizieren, (b) Azure-RMS-Encryption mit granularen Usage Rights (VIEW, EDIT, **EXTRACT**, PRINT) erzwingen, (c) Access-Policies in SharePoint steuern. **Für Copilot zentral:** Copilot darf Files nur verwenden, wenn der User **VIEW + EXTRACT**-Rechte hat. Labels mit „Add all users and groups in your organization" reichen **nicht** — EXTRACT muss explizit gegeben sein. **Label-Inheritance** funktioniert in Copilot in Word/PowerPoint/Outlook für neu generierte Inhalte (höchste Priority wins bei mehreren Quell-Labels); in Agent-365-generierten Outputs aktuell **nicht** (Gap).

- **Data Loss Prevention (DLP)** ← **AI-kritisch**
  Policy-Engine über Exchange, SharePoint, OneDrive, Teams, Endpoint und **seit Public Preview 2024: Location „Microsoft 365 Copilot & Copilot Chat"** — damit kann man Copilot verbieten, Files mit Label X zu verarbeiten, oder User hindern, PII in Prompts zu pasten. **Endpoint-DLP** blockiert zusätzlich Browser-Uploads zu ChatGPT/Gemini/DeepSeek.

- **Insider Risk Management (IRM)**
  ML-basierte Anomalie-Erkennung für Datenexfiltration, ungewöhnliches Prompt-Verhalten, IP-Diebstahl. **Risky-AI-Usage-Policy-Template** (GA seit Nov 2024) erkennt Prompt-Injection-Versuche und Zugriff auf geschützte Materialien. Pseudonymisiert Usernames by default (DSGVO-konform). Signale fließen in Defender XDR.

- **Data Security Posture Management (DSPM) & [[Purview DSPM]]**
  „Front Door" für AI-Governance. **Zwei Versionen aktuell parallel:** DSPM for AI (classic) und DSPM (preview) — neue Version hat eigene **„AI observability"**-Seite mit Agent-Instance-Views und Risk-Level-Priorisierung durch IRM. One-Click-Policies: „Protect your data with sensitivity labels", „Detect risky interactions in AI apps", „Protect items from Copilot processing". Eigene Note: [[Purview DSPM]].

- **Data Security Investigations**
  Case-Management für Security-Vorfälle; bündelt Audit-Evidence + IRM-Signale + Defender-Alerts.

- **Information Barriers & Privileged Access Management**
  Ethical Walls (Investment Banking: Research vs Trading) + Just-in-Time-Admin-Access. Für SMB meist **überdimensioniert**.

#### 2. Data Compliance Solutions

- **Audit (Standard + Premium)**
  Unified Audit Log über alle M365-Services. **Standard: 180 Tage Retention** (kürzlich von 90 auf 180 erweitert), **Premium: bis zu 10 Jahre** (in E5 inkludiert, sonst Add-on). Copilot- und Agent-365-Aktivität automatisch geloggt; **Non-Microsoft-AI-Apps** (ChatGPT etc.) über Pay-as-you-go-Billing. Audit-Event-Attribute: `AccessedResources` (welche Files zog Copilot heran, inkl. `SensitivityLabelId`), `XPIADetected` (Cross-Prompt-Injection-Attack-Flag), `JailbreakDetected`, `AgentId`.

- **Communication Compliance**
  Content-Scanning über Teams, Exchange, Yammer — und **Copilot-Prompts/Responses**. Erkennt Harassment, Insider Trading, Policy-Verstöße. Privacy-by-Default (Pseudonymisierung).

- **Compliance Manager**
  Score + Template-basierte GAP-Analyse. **Seit Nov 2024 GA:** EU AI Act, NIST AI RMF, ISO 42001, ISO 23894. Für DACH zusätzlich: DSGVO, NIS2-Richtlinie, BSI C5.

- **Data Lifecycle Management & Records Management**
  Retention Policies für Copilot-Prompts/Responses („Microsoft Copilot Experiences"-Location). Auto-Labeling für Cloud-Attachments in Copilot-Interaktionen. Retention-Konflikte lösen sich via „longest duration wins".

- **eDiscovery**
  Legal-Hold + Content-Search über Exchange, SharePoint, OneDrive, Teams, Viva Engage. Copilot-Interaktionen über `ItemClass = IPM.SkypeTeams.Message.Copilot.*` suchbar. Agent-365-Interaktionen analog (agent-to-human + human-to-agent).

#### 3. Data Governance Solutions (Side-Track)

- **[[Purview Data Map]]** (ehemals Azure Purview Data Catalog)
  Technischer Data-Catalog über Azure SQL, Fabric, Power BI, Synapse + On-Prem + AWS/GCP. **Separate Säule** von M365-Purview — andere Persona (Data Engineer statt Compliance Officer), andere Lizenzierung (Azure-Consumption statt M365-Seat). Für reine M365/Copilot-Beratung **nicht im Scope** — kurz erwähnen, bei Data-Lakehouse-Kunden separat ansprechen.

- **Unified Catalog**
  Nachfolger-Branding des Data Map für die Governance-Säule; integriert stärker mit Fabric.

### Typischer Workflow

1. **Setup (IT + Compliance gemeinsam, Tag 1–2)** — Unified Audit Log aktivieren · Purview Portal-Zugänge (Compliance Administrator, Purview Content Viewer) verteilen · EU Data Boundary verifizieren.
2. **Label-Taxonomie (Workshop, Tag 3–5)** — Meistens 4–5 Labels (Public / Internal / Confidential / Strictly Confidential / Regulated). Sub-Labels für Kompartimente (z.B. HR, Legal). **Kritisch:** Encryption-Settings pro Label mit konkreten Usage Rights durchdenken — **EXTRACT-Right für Copilot-Interop mitdenken**.
3. **Pilot (Woche 2–3)** — Auto-Labeling auf 10% der Daten laufen lassen, False-Positive-Quote messen. Parallel: DSPM for AI / Data Risk Assessment automatisch laufen lassen.
4. **DLP-Policies (Woche 3–4)** — Erst **Audit-Mode**, dann **Notify-Mode**, zuletzt **Block-Mode**. Für Copilot: Location „Microsoft 365 Copilot & Copilot Chat" aktivieren, Labels aus Schritt 2 als Trigger.
5. **IRM + Communication Compliance (Woche 4–6)** — Templates anwenden (Risky AI Usage, Data Exfiltration). Privacy-Beauftragten einbeziehen (Pseudonymisierungs-Einstellung verifizieren).
6. **Compliance-Manager-Baseline (Woche 6+)** — EU-AI-Act- + DSGVO-Template laufen lassen, Score-Baseline dokumentieren.
7. **Betrieb** — wöchentliches DSPM-for-AI-Report-Review · monatlich Compliance-Manager-Score-Check · quartalsweise Label-Taxonomie-Review.

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai)** | Purview-Portal-Navigation · KQL-Light für Audit-Searches · Label-Encryption-Modell (Azure RMS + Usage Rights) · DSGVO-Art.-5/32-Textsicherheit |
| **Admin beim Kunden** | Entra + M365 Admin Center · Compliance Administrator-Rolle · Ownership der Label-Taxonomie |
| **End-User** | Versteht, dass „Confidential/Internal"-Label **Konsequenzen** hat — keine Coding-Skills |

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| **[[Microsoft 365 Copilot]]** | Sensitivity-Label-Respekt in Responses; Label-Inheritance in generierten Inhalten; DLP-Location „Copilot & Copilot Chat"; Audit-Events pro Interaction | GA (Label-Respekt) / Public Preview (DLP-Location) | **EXTRACT-Usage-Right-Falle** (Label mit „all org users" reicht nicht); nur Word/PPT/Outlook erben Labels — Copilot Chat selbst nicht |
| **[[Agent 365]]** | Agent-Instances werden wie User behandelt: Audit, DSPM, DLP, IRM, eDiscovery, Retention; DSPM-preview zeigt dedizierte „AI observability"-Seite | Frontier-Preview (GA 2026-05-01) | **Agent-Outputs erben KEINE Sensitivity Labels** von Quellen (Gap!) · Encryption-ohne-Labels für Agent 365 **nicht** supported |
| **[[Microsoft 365 Copilot]] Studio** | Auto-Governance für Custom Copilots (DLP, IRM, Audit) seit Nov 2024 GA | GA | Einschränkung: nur Data Classification, Sensitivity Labels, DLP, IRM — **nicht** Encryption-ohne-Labels |
| **[[Entra Agent ID]]** | Agent-Identity ist das primäre Subjekt für Purview-Policies | GA (Identity-Teil) | — |
| **[[Defender for AI]]** | IRM-Signale + XPIA-Detection + Jailbreak-Detection fließen aus Defender in Purview-Audit | GA | Cross-Portal-Korrelation erfordert Defender-XDR-Premium |
| **Microsoft Foundry** | Entra-registered AI Apps-Kategorie: Data Classification, Labels, DLP, IRM supported | GA | Andere Bulking-Methode (pay-as-you-go) |
| **[[Microsoft Entra Suite]]** | Conditional Access integriert mit Sensitivity-Label-Signalen; ID Governance für Compliance-Rollen | GA | — |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| **ChatGPT Enterprise** | Direkter Connector mit Prompt-/Response-Audit + DLP | GA | Separate Connector-Lizenz + Pay-as-you-go |
| **ChatGPT / Gemini / DeepSeek (Consumer)** | Endpoint-DLP via Browser (block paste credit cards etc.) | GA | Nur Endpoint-DLP, nicht tenant-wide |
| **SAP / Salesforce** | Classifier-Extension via Connectors | GA | Meist Consulting-Projekt |
| **AWS / GCP** | Data Map extension (Governance-Seite) | GA | Separate Azure-Subscription + Consumption |

### APIs / Protokolle

- **Management API** (REST) für Label-Taxonomie, DLP-Policies, Audit-Search
- **Office 365 Management Activity API** für Audit-Log-Export in SIEM (Sentinel, Splunk)
- **MIP SDK** (C++/C#/Java) für Third-Party-App-Integration — selten im SMB-Einsatz
- **Graph API** für Purview-Labels und Compliance-Szenarien

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | EU Data Boundary aktiv für Purview-Kern-Workloads; manche Classifier-Features (Trainable Classifiers) haben **globale Modell-Hosting** — prüfen |
| **Prompts & Outputs** | Audit-Events werden im Tenant gespeichert; keine Verwendung für Modell-Training (Standard MS-DPA) |
| **DPA** | Standard-MS-DPA deckt Purview ab; keine separate Anlage nötig |
| **EU-AI-Act** | Purview **selbst** ist Governance-Tool → *limited risk*; die damit beaufsichtigten AI-Systeme können high-risk sein — Purview liefert **Bausteine für Art.-9-Compliance** (Risk Management System), **nicht** pauschale AI-Act-Compliance |

### Microsoft-Compliance-Stack

Purview ist **selbst** der Compliance-Stack — aber spielt zusammen mit:
- **[[Microsoft Entra Suite]]** (Conditional Access mit Label-Signalen)
- **[[Defender for AI]]** (XPIA + Jailbreak + Agent-Threat-Signale)
- **[[Azure AI Content Safety]]** (Prompt-/Response-Moderation — **Laufzeit**-Schutz, komplementär zur Purview-Policy-Ebene)

### Bekannte Compliance-Lücken

- **Agent-Output-Label-Inheritance fehlt** (Stand 2026-04) — von Agent 365 generierte Files werden **nicht** automatisch gelabelt/verschlüsselt. Gegenmittel: Auto-Labeling-Policy auf generierte Files im Ziel-SharePoint.
- **Pay-as-you-go-Überraschung** bei Non-MS-AI-Apps-Audit — kann bei Browser-intensiven Tenants >€1k/Monat zusätzlich kosten; explizites Enable nötig.
- **Trainable Classifier** brauchen 50–500 Beispiele, **englisch-zentriert** — deutsche/französische Sprach-Abdeckung teils schwächer (eigene Einschätzung).
- **Communication Compliance** hat in DE arbeitsrechtliche Grauzonen (Mitbestimmung Betriebsrat!) — vor Aktivierung **juristische Prüfung** empfehlen.

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Runtime-Prompt-Injection-Schutz** — Purview erkennt XPIA im Audit-Log, blockt aber nicht in Echtzeit | [[Defender for AI]] + [[Azure AI Content Safety]] |
| **Non-M365-Data-Catalog** ist [[Purview Data Map]]-Sache (separate Säule, separate Lizenzierung) | [[Purview Data Map]] Note |
| **Label auf Bilder/Video-Inhalt** — OCR nur auf Standard-Bildformaten, Video nicht supported | Manuelles Labeling beim Upload |
| **Cross-Tenant-Label-Propagation** — B2B-Sharing erhält Labels nur mit Co-Author-Setup | Azure RMS + gemeinsame RMS-Templates |
| **Agent-Output-Label-Inheritance** | Auto-Labeling-Policy auf Ziel-Location |
| **DLP-Block für Agent-to-Human** — Agent bekommt keinen Block-Hinweis, Workflow bricht silent | Agent-Owner muss Policy aktiv überwachen |

### Typische Fallstricke

- **„E5 haben wir, Purview machen wir später"** — E5-Kunden haben Purview lizenziert, aber nicht aktiviert. Ergebnis: Copilot-Rollout ohne Label-Governance → **sensitive Daten in Prompts**. *Gegenmittel: Pre-Flight-Workshop vor Copilot-Rollout.*
- **EXTRACT-Usage-Right-Falle** — Label konfiguriert mit „all users and groups in your organization" → Copilot kann Files trotzdem nicht verarbeiten, weil EXTRACT nicht explizit. Kunde denkt, Label blockt — in Wirklichkeit blockt die Encryption-Setting. *Gegenmittel: Label-Encryption-Permissions in Pilot-Phase explizit durchtesten.*
- **Audit-Log-Retention-Gap** — Standard 180 Tage; Wirtschaftsprüfer verlangen oft **1+ Jahre**. Audit Premium nötig (E5 inkludiert, sonst $$). *Gegenmittel: frühzeitig SIEM-Export konfigurieren.*
- **DLP-False-Positives** überfluten den Inbox-Owner — Policies in **Block-Mode** ohne Audit-Vorlauf sind Rollout-Killer. *Gegenmittel: 4-Wochen-Audit-Mode + Notify-Mode vor Enforcement.*
- **Label-Taxonomie-Wildwuchs** — IT definiert 30 Labels „damit wir alles abdecken"; End-User verstehen nichts, labeln falsch oder gar nicht. *Gegenmittel: 4–5 Labels maximum, Sub-Labels nur bei klarer Regel-Kompartiment-Logik.*
- **Non-MS-AI-Audit-Kosten-Schock** — Pay-as-you-go bei ChatGPT/Gemini kann bei 500 Usern mit starkem Browser-AI-Einsatz schnell 4-stellig werden. *Gegenmittel: Budget-Alert vor Aktivierung.*
- **Communication Compliance ohne Betriebsrat** — in DE rechtlich heikel (§87 BetrVG Abs. 1 Nr. 6). *Gegenmittel: Legal-Review vor Aktivierung.*
- **Marketing-Verwechslung „Purview" = „Purview Data Map"** — Kunden mit Azure-Data-Lakes erwarten Catalog-Features; im M365-Kontext ist das die **andere Säule**. *Gegenmittel: 3-Säulen-Diagramm im Erstgespräch nutzen.*

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Docs Hub | Microsoft Purview Overview | https://learn.microsoft.com/en-us/purview/purview | 2026-04-22 | Dach-Portfolio |
| Docs | Purview for AI (Copilot + Agents) | https://learn.microsoft.com/en-us/purview/ai-microsoft-purview | 2026-04-22 | AI-Integration |
| Docs | Purview for M365 Copilot | https://learn.microsoft.com/en-us/purview/ai-m365-copilot | 2026-04-22 | Label + DLP Copilot |
| Docs | Purview for Agent 365 | https://learn.microsoft.com/en-us/purview/ai-agent-365 | 2026-04-22 | Agent-Governance |
| Docs | Purview for AI Agents (general) | https://learn.microsoft.com/en-us/purview/ai-agents | 2026-04-22 | Agent-Capability-Matrix |
| Docs | Audit Logs for Copilot and AI | https://learn.microsoft.com/en-us/purview/audit-copilot | 2026-04-22 | Audit-Events, XPIA-Flag |
| Docs | DSPM for AI | https://learn.microsoft.com/en-us/purview/dspm-for-ai | 2026-04-22 | DSPM-for-AI-Classic |
| Docs | DSPM (preview) | https://learn.microsoft.com/en-us/purview/data-security-posture-management-learn-about | 2026-04-22 | DSPM-v2 |
| Docs | Sensitivity Labels | https://learn.microsoft.com/en-us/purview/sensitivity-labels | 2026-04-22 | MIP-Kern |
| Docs | DLP Learn About | https://learn.microsoft.com/en-us/purview/dlp-learn-about-dlp | 2026-04-22 | DLP-Kern |
| Docs | DLP for M365 Copilot Location | https://learn.microsoft.com/en-us/purview/dlp-microsoft365-copilot-location-learn-about | 2026-04-22 | DLP-for-Copilot |
| Docs | Insider Risk Management | https://learn.microsoft.com/en-us/purview/insider-risk-management-solution-overview | 2026-04-22 | IRM-Kern |
| Service Description | Purview Service Description (Lizenzierung) | https://learn.microsoft.com/en-us/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-purview-service-description | 2026-04-22 | Lizenz-Matrix |
| Pricing | Microsoft Purview Suite Pricing | https://www.microsoft.com/en-us/security/business/purview-suite-pricing | 2026-04-22 | $12/user/month |
| Docs | Purview Billing Models (Pay-as-you-go) | https://learn.microsoft.com/en-us/purview/purview-billing-models | 2026-04-22 | Non-MS-AI-Audit-Kosten |
| Tech Blog | Accelerate AI Adoption with Next-Gen Security/Governance | https://techcommunity.microsoft.com/blog/microsoftsecurityandcompliance/accelerate-ai-adoption-with-next-gen-security-and-governance-capabilities/4296064 | 2026-04-22 | Nov-2024-Announcement |

### Secondary (Analysten)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| Practical365 (Tony Redmond) | https://practical365.com/microsoft-365-compliance/ | 2026-04-22 | Pragmatische Licensing-Analysen |
| Redress Compliance (E3 vs E5) | https://redresscompliance.com/microsoft-365-e3-vs-e5-comparison.html | 2026-04-22 | Lizenzierungs-Rechner |
| Cloudficient | https://www.cloudficient.com/blog/what-is-microsoft-365-e5-compliance | 2026-04-22 | E5-Compliance-Rebranding |
| Managed Solution | https://www.managedsolution.com/blog/microsoft-announces-major-security-compliance-licensing-changes/ | 2026-04-22 | Rebrand E5-Compliance → Purview Suite (Sep 2025) |

### Events / Konferenzen

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Build 2026 | Mai 2026 | DSPM-v2-Updates, Purview-SDK-Erweiterungen |
| RSA Conference 2026 | Apr 2026 | AI-Governance-Erweiterungen |
| Microsoft Ignite 2026 | Nov 2026 | nächste Purview-Generation |

---

## UNCLEAR

1. EUR/CHF-Preis für Purview Suite ($12 USD offiziell)
2. Purview Sovereign (Public Sector) — Verfügbarkeit in DE/CH/AT
3. Genaue Audit-Premium-Retention-Limits nach Rebrand (E5 inkludiert: 1 Jahr Standard, 10 Jahre Add-on?)
4. Timeline für Agent-Output-Label-Inheritance-Fix
5. Pay-as-you-go-Pricing pro Audit-Record (publiziert?)

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive Purview: 3-Säulen-Portfolio, Sensitivity Labels für Copilot, Agent-Governance-Hooks, Lizenz-Matrix | https://learn.microsoft.com/en-us/purview/ |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
