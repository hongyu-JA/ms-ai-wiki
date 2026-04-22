---
watch: standard
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [DSPM, Data Security Posture Management, Purview DSPM for AI, AI Hub]
moc:
  - "[[Microsoft MOC]]"
  - "[[Security & Identity MOC]]"
---

# Purview DSPM

*Microsofts **Data Security Posture Management** — die „Front Door" innerhalb von [[Microsoft Purview]], die kontinuierlich alle Datenbestände auf **sensitive Inhalte, Oversharing und AI-bezogene Risiken** scannt und priorisiert Remediation-Workflows anbietet. Aktuell parallel als **DSPM classic** (fokus M365/Azure/Fabric) und **DSPM (preview, 2026er Generation)** mit eigener **AI-observability**-Seite, Data-Security-Objectives, Security-Copilot-Agent und Non-MS-SaaS-Coverage. Für SMB-Beratung der **Pre-Flight-Hebel vor jedem Copilot- oder [[Agent 365]]-Rollout**: „Wo liegt PII, wer sieht es, wer pastet es in ChatGPT?"*

> **Analogie:** Was Qualys / Tenable für Netzwerk-Vulnerabilities sind, ist DSPM für Daten — ein kontinuierliches Risk-Posture-Radar. Unterschied zu Drittanbietern (Cyera, BigID, Varonis): DSPM sitzt **in der M365-Runtime selbst** und liest Sensitivity-Labels + DLP-Matches + Insider-Risk-Signale **nativ**, statt sie per Connector zu rekonstruieren.

---

## Einsatz

### Job-to-be-done

When I **Copilot oder Agents einführe** und mein Datenschutzbeauftragter fragt „wisst ihr eigentlich, wo bei euch PII liegt und wer es in ChatGPT pastet?", **I want to** ein Dashboard, das Oversharing-Risiken, sensitive Prompts und Shadow-AI-Usage **automatisch klassifiziert und priorisiert**, **so I can** mit **one-click Policies** statt mühsamer Label-Kampagne gegensteuern und dem DPO belegen, dass die Top-100-SharePoint-Sites scan-geprüft sind, **bevor** der erste Copilot-User sie durchsuchen darf.

### Trigger-Signale

- „Wir wissen gar nicht, wo überall PII liegt — die SharePoint-Seiten wuchern seit 10 Jahren."
- „Unser Pilot hat gezeigt: Copilot hat Gehaltsdaten aus einer 'für alle Mitarbeitenden offenen' HR-Seite gezogen."
- „Der DPO fragt: 'Pastet eigentlich jemand Kundendaten in ChatGPT?' — wir können das nicht beantworten."
- „Wir haben E5, aber die 'AI Hub'-Kachel im Purview-Portal hat nie jemand angeklickt."
- „Audit will eine Liste aller Drittanbieter-AI-Sites, die aus unserem Tenant besucht wurden."

### Einsatz-Szenarien

1. **Pre-Flight vor M365-Copilot-GA beim Kunden** — Standard-Journai-Paket: DSPM (classic oder preview) einschalten, **Default-Data-Risk-Assessment** läuft automatisch wöchentlich über Top-100-SharePoint-Sites, Ergebnis nach 4 Tagen. Wir nutzen das, um dem Kunden **vor** der 300-Lizenzen-Freigabe eine priorisierte Liste überexponierter Sites zu liefern — plus die „Restrict access by label"- und „Restrict all items"-Remediation (SharePoint Restricted Content Discovery).
2. **Shadow-AI-Audit für regulierten DACH-Mittelstand** — Kunde hat Copilot noch nicht, aber 500 Knowledge-Worker nutzen ChatGPT/Gemini/DeepSeek/Claude im Browser. Wir deployen Purview-Browser-Extension + Endpoint-DLP, aktivieren die One-Click-Policy **„DSPM for AI — Detect sensitive info added to AI sites"** (Audit-Mode auf Edge/Chrome/Firefox) und liefern nach 2 Wochen einen Report: „Diese 40 User haben PII/IBAN/Kundenvertrag in einem der ca. 900+ unterstützten AI-Sites gepastet." Das ist oft der Aha-Moment für den Kunden, vor jedem GenAI-Policy-Workshop.
3. **Agent-365-Governance-Baseline** — Sobald [[Agent 365]] am 2026-05-01 GA geht, rollt auch **Purview for Agents** aus (späte Mai 2026): die DSPM-**AI-observability**-Seite zeigt jede Agent-Instance mit Activity, Risk-Level und sensitive Interactions. Unser Wert: Baseline-Konfiguration + monatliches Review-Template.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | **DSPM classic:** E5 oder Purview Suite ($12/user/month, setzt E3 voraus) · **DSPM for AI für M365 Copilot:** zusätzlich Copilot-Lizenz pro beobachtetem User · **Non-MS-AI-Monitoring (ChatGPT Browser etc.):** Pay-as-you-go-Billing + Azure-Subscription verknüpft · **DSPM for Agents (AI observability):** **M365 E7** oder **Agent 365**-Subscription (GA ca. späte Mai 2026) |
| **Tenant** | M365-Tenant mit **Unified Audit Log aktiviert** (Prerequisite!) · **Purview-Browser-Extension** auf Windows für Chrome/Firefox · Devices **ge-onboardet** zu Purview für Endpoint-DLP · **Edge-Configuration-Policy** zur Aktivierung der Purview-Integration im Edge |
| **Skills / Rollen** | **Microsoft Entra Compliance Administrator** oder **Purview Compliance Administrator**-Rollengruppe (für One-Click-Policies **unrestricted** nötig — Admin-Units werden von DSPM **nicht** unterstützt) · für Security-Copilot-Agent: **Data Security Viewer**-Rolle |
| **Compliance-Rahmen** | DPA (Standard-MS-DPA) · EU Data Boundary · Betriebsrat-Einwilligung bei DE-Kunden (§87 BetrVG für Comm.-Compliance-Anbindung) |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup DSPM classic + Default-Assessment** | 2–3 Beratertage (Audit an, Permissions, Default-Policies aktivieren, Report-Review nach 4 Tagen) |
| **Vollständiger DSPM-for-AI-Stack (inkl. Endpoint-DLP für ChatGPT/Gemini, Browser-Extension-Rollout, Custom-Assessments)** | 8–15 Beratertage bei 200–500 Usern |
| **Laufende Lizenzkosten** | Purview Suite $12/user/month *(nicht separat EUR-publiziert — eigene Einschätzung ≈ €11–13)* · zusätzlich **Pay-as-you-go** für Non-M365-AI-Audit + IRM-„Other AI apps"-Indikatoren (ab **2026-04-01** separat abgerechnet, Azure-Bill monatlich) |
| **Laufender Betrieb** | 3–6 h/Woche für Default-Assessment-Review + Custom-Assessment-Planung + False-Positive-Triage |

### Empfehlung

**Status:** 🟢 **Empfehlen** — für **jeden** regulierten SMB-Kunden mit Copilot-Plan oder Shadow-AI-Verdacht. Begründung: DSPM ist die **einzige** Schicht, die „wo pastet jemand PII in welche AI-App" **ohne Eigenbau** beantwortet, und die Default-Data-Risk-Assessments laufen **automatisch** ab Activation — der Setup-Aufwand ist minimal, der Erkenntnis-Gewinn hoch. Achtung bei der Versions-Wahl: **DSPM classic** ist ausgereift aber deprecated-Pfad; **DSPM (preview)** hat die bessere UX und Agent-365-Integration, aber ist bis ca. Mai 2026 noch Preview — Kundenberatung **muss die Wahl erklären**.

**Nächster Schritt für Journai:** Eigenständiges Angebot **„DSPM-for-AI Quick-Assessment — 5 Tage"** entwickeln: Tag 1 Setup, Tag 2–3 warten auf Default-Scan, Tag 4 Findings-Triage, Tag 5 Executive-Readout mit Remediation-Roadmap. Parallel: Testumgebung mit DSPM (preview) aufbauen, um Security-Copilot-Prompts-Kompetenz aufzubauen.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | **DSPM (classic)** = GA · **DSPM for AI (classic)** = GA (ehemals „AI Hub", rebranded) · **DSPM (preview, 2026er Generation)** = **Preview**, Rollout läuft, wird DSPM/DSPM-for-AI classic ablösen · **DSPM — AI observability für Agents** + **IRM für Agents** = Rollout **early May 2026 → GA späte Mai 2026** (gemeinsam mit Agent-365-GA) |
| **GA-Datum** | DSPM classic: 2024 · DSPM for AI classic: Nov 2024 (Rebrand AI Hub) · DSPM (preview): *TBD 2026* · Purview for Agents: 2026-05-Ende |
| **Standalone-Preis (USD)** | DSPM ist **Feature** der Purview Suite ($12/user/month, yearly), **kein eigenes SKU** · Non-MS-AI-Monitoring: **Pay-as-you-go** via Azure (Number-of-audit-records / Number-of-requests / Data-Security-Processing-Units — konkrete Meter-Raten auf [azure.microsoft.com/pricing/details/purview](https://azure.microsoft.com/pricing/details/purview/)) · M365 Copilot-Experiences sind **nicht** pay-as-you-go-pflichtig |
| **Standalone-Preis (EUR)** | *UNCLEAR: keine zentrale EUR-Publikation — eigene Einschätzung ≈ €11–13/user/month für Purview Suite; Pay-as-you-go wird in Azure-Landeswährung abgerechnet* |
| **Lizenz-Bundle** | In **M365 E5** inkludiert · **Purview Suite** (Add-on auf E3) · **M365 E7** / **Agent 365** für DSPM-AI-observability-Agents-Part · **ChatGPT-Enterprise-Connector** + **Entra-registered-AI-Apps** brauchen pay-as-you-go zusätzlich |
| **Voraussetzung** | Copilot-Lizenz pro User für Copilot-Monitoring · Purview-Audit aktiviert · Azure-Subscription für pay-as-you-go-Features · Devices onboardet + Browser-Extension für Shadow-AI-Coverage |
| **Region-Verfügbarkeit** | Global; EU Data Boundary aktiv (erbt von Purview) · **keine expliziten DACH-Einschränkungen dokumentiert**, aber **Sensitive-Info-Type-Klassifier sind englisch-zentriert** — deutsche/französische Built-ins teils schwächer (eigene Einschätzung) |
| **CSP-Promo** | Keine publizierten DSPM-spezifischen Promos |
| **Hidden Costs** | **Pay-as-you-go-Schock:** Network Data Security + Non-MS-AI-Audit + IRM-„Other AI apps"-Indikatoren (ab **2026-04-01** abgerechnet) können bei Browser-intensiven Tenants **4-stellige EUR-Beträge/Monat** erzeugen · **Security-Copilot-SCUs** für DSPM-Agent zusätzlich · **Custom-Data-Risk-Assessments** brauchen Entra-App-Registration (Aufwand, nicht Kosten) |
| **Upgrade-Pfad** | DSPM classic → DSPM (preview): **ohne Neu-Lizenz**, gleiches SKU; [Task-Mapping-Doc](https://learn.microsoft.com/en-us/purview/dspm-task-mapping) beschreibt Feature-Parität · DSPM for AI → DSPM-for-Agents: M365-E7-Upgrade oder Agent-365-SKU |

---

## Kernkonzept

### Was es im Kern ist

DSPM ist **kein Scanner**, sondern ein **Konsolidierungs-Layer** über bereits im Tenant laufende Purview-Solutions: **Information Protection** (Sensitivity Labels), **DLP**, **Insider Risk Management**, **Audit**, **Data Security Investigations**, **Data Lifecycle Management**. Die Einzel-Solutions erzeugen bereits Signale — DSPM aggregiert sie zu einer **Risk-Posture-Sicht** und übersetzt sie in **Data Security Objectives** (wie „Prevent oversharing of sensitive data" oder „Prevent data exposure in Microsoft 365 Copilot"), die Kunden **als Outcomes statt als Policies** wählen.

Das Entwicklungs-Narrativ ist wichtig: **DSPM for AI (classic)** entstand **vor** DSPM classic — als „Microsoft Purview AI Hub" (Preview 2024), dann Rebrand Nov 2024. Es war die erste Purview-Oberfläche, die **AI-zentriert** dachte (welche Copilot-Prompts, welche Browser-AI-Sites). **DSPM classic** kam als generalisierte Version für alle Datenbestände. Die **2026er DSPM-Preview** fusioniert nun beide zu einem gemeinsamen Dashboard — mit Security-Copilot-Agents, erweiterten Connectors (Snowflake, Databricks, GCP via Sentinel-Data-Lake-Integration, Partner-Solutions Cyera/BigID/OneTrust) und einer dedizierten **AI-observability**-Seite für Agent-Instances (inkl. [[Agent 365]]).

Der **fundamentale Design-Move**: DSPM behandelt **Oversharing** als **die** primäre AI-Risk-Ursache — nicht Model-Jailbreaks, nicht Prompt-Injection, sondern dass **Copilot sieht, was der User sieht, und der User zu viel sieht**. Deshalb läuft das Default-Assessment **automatisch wöchentlich über die Top-100-SharePoint-Sites** ohne dass irgendwer irgendwas konfigurieren muss (sobald Audit an ist) — 4 Tage nach Aktivierung liegen die ersten Findings vor.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| **Dashboard / UX** | Data Security Objectives, Posture-Metriken, AI-Observability-Inventar, Asset Explorer | Purview Portal (DSPM-Preview oder DSPM-for-AI-Classic) |
| **Signal-Aggregation** | Risk-Scoring aus IRM-Alerts, DLP-Matches, Label-Coverage, Oversharing-Flags | DSPM-eigener Layer über Shared Capabilities |
| **Scan-Engines** | Sensitive-Info-Type-Detection (400+ Built-ins + Trainable Classifiers), Label-Auto-Application, Activity-Explorer-Events | Purview Shared Classifiers |
| **Enforcement** | DLP-Blocks, Auto-Labeling, SharePoint Restricted Content Discovery, Retention | Downstream-Solutions (werden via One-Click-Policies konfiguriert) |
| **AI-Assist** | Security-Copilot-Prompts, Data-Security-Posture-Agent (natural-language Search über SPO/OneDrive/Teams/Exchange/Copilot) | Security Copilot (SCU-billed) |

### Kern-Fähigkeiten

#### 1. Data Risk Assessments (Default + Custom) — Oversharing-Radar ← **SMB-Kern**

Das **wichtigste Feature** für AI-Beratung. **Default-Assessment** läuft **automatisch wöchentlich** über die nach Nutzung **Top-100-SharePoint-Sites** + optional Top-100-Fabric-Workspaces (setzt Entra-App-Service-Principal + Fabric-Admin-Setup voraus). Output pro Site: **Overview / Identify / Protect / Monitor**-Tabs mit Item-Count, Sensitive-Data-Hits, „shared with anyone"-Links, Remediation-Actions:

- **Restrict access by label** — DLP-Policy generieren, die Copilot das Summarizing von Items mit bestimmten Labels verbietet
- **Restrict all items** — SharePoint Restricted Content Discovery-Liste (diese Site ist **unsichtbar** für Copilot)
- **Auto-labeling policy** — für identifizierte unlabeled-sensitive Items
- **Retention policy** — Auto-Delete für 3+ Jahre unberührte Inhalte

**Custom-Assessments** optional mit **Item-level Scanning** (braucht Entra-App mit `Sites.ReadWrite.All` + `SensitivityLabels.Read.All`). **Limits für M365**: max 200k Items/Location, max **10 SharePoint-Sites** für Item-Level-Scan, **OneDrive wird für Item-Level nicht unterstützt** (Gap!), Counts ≥100k unzuverlässig. **Grenze:** Nur Sites in der Top-100-Nutzungs-Liste bekommen Default — „kalte" Sites mit altem Datenmüll bleiben unsichtbar, bis Custom-Assessment darauf angesetzt wird.

#### 2. AI Observability — Agent-Instance-Inventar

Neu in der **2026er Preview**: eigene Seite zeigt **alle AI Apps + Agents** (inkl. [[Agent 365]] nach dessen GA) mit Activity-Count der letzten 30 Tage, High-Risk-Markierung, sensitive Interactions. Für Top-20-most-used-Agents: Detail-View der accessed sensitive data + applied policies. **Classic-DSPM-for-AI hat das nicht** — dort nur die `Apps and agents`-Seite ohne Agent-365-Support.

Eng gekoppelt mit dem **„Risky AI Usage"**-IRM-Template (GA seit Nov 2024): erkennt Prompt-Injection-Versuche, Access-zu-geschützten-Materialien, ungewöhnliche Prompt-Patterns. Pseudonymisiert Usernames by default.

#### 3. Activity Explorer — Prompt-Response-Forensik

Zeigt **AI-Interactions** (Prompts + Responses, wenn Auditing + optional Collection-Policy aktiv), **AI website visits** (Browsing-Events), **DLP rule matches**, **Sensitive info types detected**. Filter: Workload (`Copilot experiences and agents` / `Enterprise AI apps` / `Other AI apps`), User, Zeit, Web-Queries. **Known issues ehrlich dokumentiert**: Prompt-Response teils nicht voll angezeigt, Microsoft-Facilitator-generierte Notes haben kein Prompt, User ohne Exchange-Online-Mailbox sehen keine Prompts, für Non-MS-AI braucht es Collection-Policy mit `content capture = true` (ist bei einigen One-Click-Policies **default off**!).

#### 4. One-Click-Policies — vorgefertigte Guardrails

Key-Policies in DSPM for AI (classic) — alle werden mit wenigen Klicks erzeugt, danach in der jeweiligen Solution editierbar:

| Policy-Name | Zweck | Solution-Home |
|-------------|-------|---------------|
| **DSPM for AI — Detect sensitive info added to AI sites** | Entdeckt PII/PCI/IBAN-Pastes in ~900+ supported AI-Sites (Edge/Chrome/Firefox), Audit-Mode | DLP |
| **DSPM for AI — Block sensitive info from AI sites** | Adaptive-Protection-gesteuerter Block (elevated-risk-User), Test-Mode | DLP |
| **DSPM for AI — Block elevated risk users from submitting prompts to AI apps in Microsoft Edge** | Block für elevated/moderate/minor-risk über Adaptive Protection | DLP |
| **DSPM for AI — Detect risky AI usage** | Risky-AI-Usage-IRM-Template (Prompt-Injection-Detection) | IRM |
| **DSPM for AI — Unethical behavior in AI apps** | Harassment/Policy-Verstöße in Copilot-Prompts + Responses | Communication Compliance |
| **DSPM for AI — Protect sensitive data from Copilot processing** | DLP auf Location „Microsoft 365 Copilot & Copilot Chat" — blockt Copilot für Label-X-Items | DLP for Copilot |
| **DSPM for AI — Capture interactions for Copilot experiences** | Collection-Policy für Fabric-Copilot + Security-Copilot-Prompts | Collection Policies |
| **DSPM for AI — Capture interactions for enterprise AI apps** | ChatGPT Enterprise + Entra-registered-AI-Apps + Foundry-Apps | Collection Policies |
| **DSPM for AI — Detect sensitive info shared with AI via network** | SASE/SSE-basierte Network-DSec-Integration | Collection Policies |

#### 5. Data Security Posture Agent (Preview-only)

Security-Copilot-Agent mit **Natural-Language-Search** über SPO/OneDrive/Teams/Exchange/Copilot-Interaktionen. **Kein Keyword-/SIT-/Classifier-basiertes Search** — LLM-based. Scope max **1 GB Content**, Default-Lookback **7 Tage**, Output: Item-Count + Sensitivity-Label-Coverage + Risk-Level, Export als Word-Report. **Nur in DSPM (preview)** verfügbar. Verbrauch: **Security Compute Units (SCU)** — separate Abrechnung über Security Copilot.

#### 6. Third-Party-Coverage (Multi-Cloud)

**DSPM (preview)** erweitert über Partner-Integrationen (Sentinel Data Lake als Transport) zu: **Google Cloud Platform, Snowflake, Databricks** (direkt) · **Cyera, BigID, OneTrust** (Partner-Insights). **AWS-S3** und **Azure ADLS/SQL/Fabric** sind via Pay-as-you-go-Assets (Information-Protection-Labeling, IRM-Signale) gedeckt. Asset-Explorer zeigt Microsoft-Locations (M365) + Non-MS-Locations nebeneinander. **Coverage-Reifegrad Stand 04/2026:** M365 ausgereift, Fabric ausgereift (mit Setup-Hürde), AWS/GCP über IRM-Cloud-Indikatoren funktional aber nicht tief, echte Drittcloud-Item-Tiefe erst über Partner-Connectors.

### Typischer Workflow

1. **Prerequisites (½ Tag)** — Audit einschalten, Compliance-Admin-Rolle zuweisen, Devices onboarden (nur bei Shadow-AI-Use-Case), Edge-Config-Policy pushen, Purview-Browser-Extension für Chrome/Firefox verteilen, Azure-Subscription für pay-as-you-go verknüpfen.
2. **Portal-Login → DSPM-Navigation** — je nach Version `DSPM (preview)` oder `DSPM for AI (classic)`. **Entscheidung** mit Kunden treffen: classic = stabile UX, ohne Agent-Support; preview = Agent-365-ready, neue Dashboards, noch Preview-Label.
3. **Get-started-Tasks akzeptieren (Tag 1)** — Default-Policies werden implizit angelegt, Default-Data-Risk-Assessment startet automatisch (4-Tage-Wartezeit bis erste Ergebnisse).
4. **Recommendations durcharbeiten (Tag 5–7)** — „Protect your data with sensitivity labels" (wenn noch keine Taxonomie da), „Detect risky interactions", „Secure interactions for Microsoft Copilot experiences", „Discover and govern ChatGPT Enterprise interactions".
5. **Reports- und Activity-Explorer-Baseline (Tag 7–10)** — Top-User mit sensitive Prompts, Top-Sites mit Oversharing, Top-Third-Party-AI-Destinations. **Executive-Readout** vorbereiten.
6. **Custom-Assessments je SharePoint-Risiko-Site (Tag 10+)** — Item-Level-Scan für gezielt problematische Sites, Remediation via Apply-Label / Notify-Owner / Remove-Sharing-Link.
7. **Betrieb** — wöchentlicher Default-Assessment-Check · monatliches Policies-Page-Review · quartalsweise Top-User-Risk-Trend-Analyse · Agent-365-Observability ab Mai 2026.

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai)** | Purview-Portal-Navigation · KQL-Light für Activity-Explorer-Filter · Sensitive-Info-Type-Anatomy (Built-in vs Trainable vs EDM) · Entra-App-Registration für Custom-Assessments · Azure-Subscription-Verknüpfung für PAYG |
| **Admin (Kunde)** | Compliance Administrator · Entra-App-Permissions-Grant · SharePoint-Site-Owner-Kommunikation (für Remediation-Aufträge) |
| **End-User** | Versteht, dass „sensitive Info"-Warnungen in Outlook/Edge Konsequenzen haben — keine Coding-Skills |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Real-time Prompt-Injection-Block** — DSPM erkennt XPIA im Audit-Nachgang, blockt nicht inline | [[Defender for AI]] + [[Azure AI Content Safety]] |
| **Full-Content-Scan über alle Sites** — nur Top-100-most-used pro Woche (Default); Rest braucht Custom-Assessment | Custom-Assessment auf gezielte Sites; bei >10 Sites iterieren |
| **OneDrive-Item-Level-Scan** — im Custom-Assessment für M365 **nicht** supported | Migration sensitiver OneDrive-Ordner nach SPO-Team-Site, dort scannbar |
| **Admin-Units in DSPM** — **nicht** unterstützt, One-Click-Policies **alle User in Tenant** | Separate Policies in den Home-Solutions anlegen, dort mit Admin-Units scopen |
| **Agent-Output-Label-Inheritance** (Agent 365) | Auto-Labeling-Policy auf Agent-Ziel-SharePoint |
| **Deutsche Klassifier-Tiefe** | Trainable Classifiers mit dt. Beispielen selbst trainieren (50–500 Samples) |
| **DSPM-Score als KPI** — kein offizieller numerischer Score, der Trend ist nicht volumen-normalisiert | Metriken aus Reports (Policy-Coverage-%, Oversharing-Incidents) statt aggregiertem Score verwenden |
| **Agent-Activity vor Mai 2026** | Agent-365-GA abwarten; bis dahin via `Apps and agents` in DSPM-for-AI classic nur rudimentär |

### Typische Fallstricke im Einsatz

- **„Wir haben E5 — warum sehen wir nichts?"** — Unified Audit Log in alten Tenants (vor ~2023) oft **deaktiviert**. Ohne Audit keine DSPM-Daten. Erstprüfung **immer** bei Workshop-Start. *Gegenmittel: Audit-Enable als allererster Schritt, 24–48h Wartezeit einplanen.*
- **Pay-as-you-go-Kosten-Schock** — Pay-as-you-go für Non-MS-AI-Audit-Records + IRM-„Other AI apps"-Indikatoren (ab **2026-04-01** neu abgerechnet) + Network-Data-Security (pro Request). Bei 500 Usern mit intensivem ChatGPT-Browser-Einsatz schnell **> €1k/Monat zusätzlich**. *Gegenmittel: Budget-Alert in Azure, erst Audit-Mode 2 Wochen laufen lassen, dann entscheiden.*
- **Default-Policies aktivieren, danach nie anfassen** — Block-Policies sind zunächst im **Test-Mode** („DSPM for AI — Block sensitive info from AI sites"), passieren also nichts, bis manuell auf Enforce-Mode umgestellt. *Gegenmittel: Policies-Page 2-wöchig reviewen, Test-Mode-Erkenntnisse dokumentieren, dann stufenweise enforcen.*
- **Collection-Policy ohne „content capture"** — Default bei `Detect sensitive info shared with AI via network` ist **content capture off** → Activity-Explorer zeigt nur Metadaten, keine Prompts. *Gegenmittel: nach Auto-Creation Policy öffnen, Content-Capture explizit einschalten — Vorsicht: Privacy-Implications für DE-Betriebsrat.*
- **Content-Scan-Tiefe falsch verstanden** — Data-Security-Posture-Agent durchsucht bis 1 GB, **nicht** den ganzen Tenant; Default-Assessments scannen Metadaten + SIT-Matches, keine OCR auf Bildern, keine Video-Analyse. *Gegenmittel: Scope-Grenzen im Kick-off explizit benennen, Kunde nicht „wir finden alles"-Erwartung aufbauen.*
- **Custom-Assessment-Entra-App vergessen** — ohne App-Registration + `Sites.ReadWrite.All` + Admin-Consent kein Item-Level-Scan. *Gegenmittel: Journai-Runbook mit App-Registration-Script vorbereiten.*
- **Preview vs Classic — Feature-Parität-Annahme** — Kunden wechseln zu DSPM (preview) und wundern sich, warum manche classic-Features noch in den Solution-Homes sind statt im DSPM-Dashboard. *Gegenmittel: Task-Mapping-Doc als Orientierung nutzen; Kunden, die Agent-365 einführen, auf preview; konservative Kunden zunächst classic.*
- **DE-Betriebsrat bei Comm-Compliance-Collection-Policies** — Content-Capture von Copilot-Prompts ist Mitbestimmung (§87 BetrVG Abs. 1 Nr. 6). *Gegenmittel: Legal-Review **vor** Aktivierung der Copilot-experiences-Collection-Policy.*

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| **[[Microsoft Purview]]** | DSPM **ist** Purview-Solution; konsumiert Labels/DLP/IRM/Audit/eDiscovery/DLM-Signale | GA | — (Integrations-interne Komponente) |
| **[[Microsoft 365 Copilot]]** | DLP-Location „Microsoft 365 Copilot & Copilot Chat" · Prompt-/Response-Audit · Oversharing-Assessment vor Rollout | GA | Prompts erscheinen nicht, wenn User keine Exchange-Online-Mailbox hat |
| **[[Agent 365]]** | DSPM-AI-observability-Seite zeigt Agent-Instances · IRM-Policies auf Agent-Activity | Preview, GA späte Mai 2026 | Agent-Output-Label-Inheritance **fehlt** noch |
| **[[Microsoft 365 Copilot]] Studio** | Custom-Copilots werden wie Enterprise-AI-Apps behandelt (Capture + IRM) | GA | Encryption-ohne-Labels nicht supported |
| **Microsoft Foundry** | Entra-registered AI Apps-Kategorie: Integration via Purview SDK | GA | Pay-as-you-go zusätzlich |
| **[[Defender for AI]]** | XPIA-/Jailbreak-Detection-Signale fließen in Activity Explorer + IRM | GA | Cross-Portal-Korrelation via Defender XDR |
| **[[Microsoft Entra Suite]]** | Entra-App-Registration für Custom-Assessments + Fabric-Connector · Compliance-Admin-Rolle · Federated Credentials empfohlen über Client Secret | GA | Service-Principal-Setup ist Entra+Fabric-Admin-Joint-Task |
| **ChatGPT Enterprise Connector** | Direkter Registration-Flow, dediziertes Capture + IRM | GA | Pay-as-you-go pro Audit-Record |
| **Security Copilot** | Data-Security-Posture-Agent (nur DSPM-preview) + SCU-basierte Prompts | GA (SCU-billed) | SCU-Kostenvergleich zu pay-as-you-go nötig |
| **Microsoft Sentinel Data Lake** | Transport-Layer für Non-MS-Data-Source-Integration (GCP, Snowflake, Partner) | Preview | Zusätzliche Sentinel-Lizenz-/Ingestion-Kosten |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| **ChatGPT / Gemini / DeepSeek / Claude / Perplexity / Grok / ~900+ AI-Sites** | Browser-basierte Detection + Endpoint-DLP via Purview-Extension + Edge-Integration | GA | Nur Edge/Chrome/Firefox auf Windows; macOS-Coverage schwächer |
| **Google Cloud Platform / Snowflake / Databricks** | Posture + DLP via Partner-Integration (Sentinel Data Lake) | Preview (DSPM-preview-only) | Setup über Sentinel nötig |
| **Cyera / BigID / OneTrust** | Partner-Signale ins DSPM-Dashboard | Preview | Separate Partner-Lizenz |
| **SASE / SSE-Provider** | Network Data Security Policy ingestiert Signale für `Detect sensitive info shared with AI via network` | GA | Partner-abhängige Implementation-Tiefe |

### APIs / Protokolle

- **Microsoft Graph** (für Custom-Assessment-App: `Application.Read.All`, `Directory.Read.All`, `Files.ReadWrite.All`, `SensitivityLabels.Read.All`, `Sites.ReadWrite.All`, `User.Read.All`)
- **Office 365 Management Activity API** (Audit-Log-Export in Sentinel/Splunk)
- **Purview Developer SDK** (für Entra-registered AI Apps + eigene Foundry-Apps)
- **Fabric Admin API** (Federated Credentials über Kubernetes Service Account empfohlen)

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | EU Data Boundary aktiv (erbt von Purview-Kern); **pay-as-you-go-Daten** werden in der Azure-Subscription-Region gespeichert, die dem Tenant verknüpft wurde — Regions-Wahl relevant |
| **Prompts & Outputs** | Im Tenant gespeichert (Audit-Events), **nicht** für Modell-Training genutzt (Standard MS-DPA) · Content-Capture ist **Opt-in** pro Collection-Policy |
| **DPA** | Standard-MS-DPA abgedeckt — **aber**: Pay-as-you-go-Abrechnung läuft über Azure-Subscription, DPA für Azure separat relevant |
| **EU-AI-Act** | DSPM selbst = Governance-Tool (*limited risk*) — liefert Bausteine für Art.-9-Risk-Management-System (Oversharing-Erkennung, Audit-Trail, Incident-Response) **für** die beaufsichtigten high-risk AI-Systeme |

### Microsoft-Compliance-Stack

- **Mit [[Microsoft Purview]]** (Mutter-Portfolio) — DSPM konsumiert Labels/DLP/IRM/Audit/eDiscovery/DLM.
- **Mit [[Microsoft Entra Suite]]** — Conditional Access kann auf Sensitivity-Labels + DSPM-Risk-Levels reagieren.
- **Mit [[Defender for AI]]** — Runtime-Detections (XPIA, Jailbreak) fließen zurück in DSPM-Aktivitäten.
- **Mit [[Azure AI Content Safety]]** — komplementär (Runtime-Moderation vs. DSPM-Posture-View).

### Bekannte Compliance-Lücken

- **Admin-Units nicht supported** — One-Click-Policies scopen tenant-wide; in DACH-Konzernen mit mehreren Geschäftsbereichen und separatem Datenschutz kann das blockierend sein. Gegenmittel: Policies in den jeweiligen Solution-Homes (IRM/DLP) statt aus DSPM heraus erzeugen, dort Admin-Units verwenden.
- **Betriebsrat-/Works-Council-Thematik (DE/AT/CH)** — Content-Capture von Copilot-Prompts und Email-Comm-Compliance sind mitbestimmungspflichtig; ohne Betriebsvereinbarung juristisch heikel.
- **Pay-as-you-go-Kosten-Transparenz** — Azure-Bill kommt monatlich kumuliert, schwer pro User/Abteilung aufschlüsselbar; Cost-Estimator existiert, aber SMBs unterschätzen Volumen.
- **Classifier-Sprachbias** — deutsche/französische Custom-Classifier brauchen Eigen-Training (Trainable Classifiers, 50–500 Beispiele englisch-zentriert).
- **Timeline Agent-365-Label-Inheritance** — aktuell *UNCLEAR* (keine publizierte Roadmap); bis dahin Workaround via Auto-Labeling-Policy auf Ziel-Location.

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Docs Hub | DSPM (preview) — Learn about | https://learn.microsoft.com/en-us/purview/data-security-posture-management-learn-about | 2026-04-22 | Neue Generation, Objectives, AI-observability |
| Docs | DSPM (preview) — Considerations | https://learn.microsoft.com/en-us/purview/data-security-posture-management-considerations | 2026-04-22 | Prerequisites, Activity-Explorer-Events, Posture-Agent |
| Docs | DSPM for AI (classic) | https://learn.microsoft.com/en-us/purview/dspm-for-ai | 2026-04-22 | Ausgereifte Version, One-Click-Policies |
| Docs | DSPM for AI (classic) — Considerations | https://learn.microsoft.com/en-us/purview/dspm-for-ai-considerations | 2026-04-22 | Prerequisites, Policy-Inventar, Fabric-Setup |
| Docs | Supported AI Sites | https://learn.microsoft.com/en-us/purview/ai-microsoft-purview-supported-sites | 2026-04-22 | ~900+ AI-Apps-Liste (ChatGPT, Gemini, DeepSeek, Claude, Perplexity, Grok, Suno etc.) |
| Docs | Purview Billing Models | https://learn.microsoft.com/en-us/purview/purview-billing-models | 2026-04-22 | Per-User vs Pay-as-you-go, Meter-Definitionen |
| Docs | Purview for Agent 365 | https://learn.microsoft.com/en-us/purview/ai-agent-365 | 2026-04-22 | Agent-365-Integration |
| Docs | Task Mapping DSPM classic → preview | https://learn.microsoft.com/en-us/purview/dspm-task-mapping | 2026-04-22 | Migrations-Guide |
| Pricing | Azure Pricing Purview | https://azure.microsoft.com/en-us/pricing/details/purview/ | 2026-04-22 | PAYG-Meter-Raten |
| Pricing | Purview Suite Pricing | https://www.microsoft.com/en-us/security/business/purview-suite-pricing | 2026-04-22 | $12/user/month |
| Tech Blog | Beyond Visibility: The new DSPM experience | https://techcommunity.microsoft.com/blog/microsoft-security-blog/beyond-visibility-the-new-microsoft-purview-data-security-posture-management-dsp/4470984 | 2026-04-22 | Preview-Announcement |
| What's New | What's new in Microsoft Purview | https://learn.microsoft.com/en-us/purview/whats-new | 2026-04-22 | Laufende Änderungen |

### Secondary (Analysten & Community)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| M365 Admin / Handsontek | https://m365admin.handsontek.net/microsoft-purview-agents-ai-observability-insider-risk-management-now-generally-available/ | 2026-04-22 | Agent-365 + Purview-GA-Timeline (Mai 2026) |
| M365 Admin / Handsontek | https://m365admin.handsontek.net/microsoft-purview-insider-risk-management-pay-go-model-generative-ai-apps/ | 2026-04-22 | PAYG für IRM-AI-Indikatoren ab 2026-04-01 |
| ShareGate Blog | https://sharegate.com/blog/microsoft-purview-dspm-experience | 2026-04-22 | Practitioner-Perspektive DSPM-Preview |
| Forsyte IT Solutions | https://forsyteit.com/microsoft-purview-security-mssp-blog-january-2026-update/ | 2026-04-22 | MSSP-Update Jan 2026 |
| Help Net Security | https://www.helpnetsecurity.com/2026/03/17/microsoft-purview-fabric-security-innovations/ | 2026-04-22 | Fabric-AI-Risk-Coverage |

### Events / Konferenzen

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Build 2026 | Mai 2026 | DSPM-Preview → GA-Indikation, Agent-365-GA + DSPM-for-Agents |
| RSA Conference 2026 | Apr 2026 | AI-Observability-Erweiterungen |
| Microsoft Ignite 2026 | Nov 2026 | Nächste DSPM-Iteration, Partner-Connector-Erweiterungen |

---

## UNCLEAR

1. **EUR/CHF-Preise** für Pay-as-you-go-Meter (Azure-Region-abhängig, nicht zentral publiziert in Fließ-Doku).
2. **Timeline Agent-Output-Label-Inheritance** — keine publizierte Roadmap für den Inheritance-Gap.
3. **DSPM-Preview → GA-Datum** (Wahrscheinlich mit Build 2026 oder Ignite 2026, TBD).
4. **Purview-Sovereign-Cloud-Coverage** für DSPM-Features in DE/CH/AT (erbt vermutlich von Purview-Portfolio, aber nicht DSPM-explizit dokumentiert).
5. **Per-User-Preis** für das **AI-observability-für-Agents**-Add-on (M365 E7 vs Agent 365 — welcher Teil des SKU).
6. **macOS-Endpoint-DLP-Coverage** für ChatGPT-Browser-Detection (Windows ausführlich dokumentiert, macOS schwach).

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive DSPM + DSPM for AI: Risk-Signale, Coverage-Matrix, Pricing, Copilot-spezifische Detections | https://learn.microsoft.com/en-us/purview/dspm-overview |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
