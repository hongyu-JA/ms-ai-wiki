---
watch: passive
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [D365 Copilot Agents, Dynamics Agents, D365 AI Agents]
moc:
  - "[[Microsoft MOC]]"
  - "[[Copilot MOC]]"
---

# Dynamics 365 Agents

*Sammelbegriff für die in **Dynamics-365-Modulen eingebetteten AI-Agents** (Sales Qualification, Sales Close, Customer Service, Finance, Supply Chain, Field Service — sowie **Business Central** mit Sales Order Agent und Payables Agent). Technische Basis: **[[Copilot Studio]]-Runtime + [[Dataverse]]-Grounding**. Abrechnung ab 2026 Wave 1 einheitlich über **Copilot Credits** ($200/25k Pack oder $0.01 PAYG). Für Journai-SMB-Fokus sind **nur zwei Agents wirklich relevant**: **Business Central Sales Order Agent** und **Sales Qualification Agent** — alles andere ist Enterprise-/F&O-Territorium.*

> **Analogie:** Dynamics 365 Agents sind das, was Macros für Excel waren — nur dass der „Macro" jetzt eine E-Mail liest, einen Kunden im ERP findet, Lagerbestände prüft und einen Quote als PDF rausschickt, bevor der User am Montagmorgen seinen Kaffee aufhat.

---

## Überblick — Agent-Landschaft nach Modul

```
┌────────────────────────────────────────────────────────────────────┐
│  D365 AI AGENTS (2026 Wave 1)                                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  SMB-relevant (Journai-Fokus)            Enterprise-Territory      │
│  ────────────────────────────            ────────────────────      │
│                                                                    │
│  Business Central                         Dynamics 365 F&O          │
│  ├─ Sales Order Agent (GA)                ├─ Finance Agent (preview)│
│  ├─ Payables Agent (GA, geo-limit)        ├─ Supplier Communications│
│  └─ Custom Agents (preview, AI Dev Kit)   ├─ Supply-Chain Planner   │
│                                           └─ Project Agents         │
│  Dynamics 365 Sales                                                 │
│  ├─ Sales Qualification Agent (GA)        Dynamics 365 Customer     │
│  ├─ Sales Close Agent Research (preview)  Service (enterprise heavy)│
│  ├─ Sales Close Agent Engage (preview)    ├─ Case Management Agent  │
│  └─ Sales Research Agent (preview)        ├─ Customer Intent Agent  │
│                                           └─ Knowledge Mgmt Agent   │
├────────────────────────────────────────────────────────────────────┤
│  UNTER DER HAUBE                                                   │
│   Copilot-Studio-Runtime · Dataverse-Grounding · MCP-Tools        │
│   Copilot-Credit-Abrechnung · Entra-Agent-ID (ab 2026-05-01)      │
└────────────────────────────────────────────────────────────────────┘
```

---

## Einsatz

### Job-to-be-done

**When I** als SMB-Kunde bereits Dynamics 365 Sales oder Business Central nutze, **I want to** wiederkehrende Prozesse (Lead-Qualifikation, Quote-Erstellung aus E-Mails, Rechnungs-Capture) automatisieren, ohne einen Power-Platform-Developer zu beauftragen, **so I can** mit meinem bestehenden Team mehr Volumen verarbeiten, ohne zusätzliche Sachbearbeiter einzustellen.

### Trigger-Signale

- *„Wir haben Business Central und kriegen Bestellungen per E-Mail von Stammkunden — das tippen wir jeden Tag manuell ab."* → Sales Order Agent
- *„Unser Vertrieb qualifiziert Leads aus Web-Formularen, aber 70 % sind Müll. Kann AI vorsortieren?"* → Sales Qualification Agent
- *„Wir haben D365 Sales Enterprise und wollen AI endlich wirklich nutzen, nicht nur Summary-Copilot."*
- *„Unsere Buchhaltung tippt Lieferanten-Rechnungen ab — das muss doch heute anders gehen."* → BC Payables Agent (wenn Land unterstützt)

### Einsatz-Szenarien

1. **Business Central Sales Order Agent bei SMB-Großhändler (Journai-typisch)** — Kunde mit ~50 Innendienst-Aufträgen/Tag, hohe Wiederkäufer-Quote. Agent liest E-Mails im dedizierten Postfach, matcht Kunde + Artikel in BC, erzeugt Quote-PDF, wartet auf Bestätigung, wandelt in Sales Order. **Mensch reviewt jede ausgehende E-Mail** (Approval-Gate). Business-Case: Entlastung Innendienst, keine „Agent läuft komplett autonom"-Illusion.
2. **Sales Qualification Agent für D365-Sales-Kunde mit Inbound-Lead-Flut** — Agent recherchiert Lead autonom (Firma, Rolle, Web-Signale), entscheidet Fit/No-Fit, sendet templatisierte Outreach-E-Mail. Zwei Modi: *research-only* (sicherer) oder *research-and-engage* (aggressiver).
3. **„Wir bauen selbst einen Agent" in Business Central (preview)** — ab 2026 Wave 1 gibt es das **AI Development Toolkit for Business Central** (Public Preview) — Consultants/Partner können Custom Agents in natürlicher Sprache definieren, im Sandbox gegen echte BC-Daten testen. Geht darüber hinaus, was pure Copilot Studio kann. *(Relevant für Journai als Partner-Angebot ab H2 2026.)*

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Entsprechende D365-Modul-Lizenz (BC Essentials/Premium · D365 Sales Enterprise · D365 Customer Service Enterprise). Copilot-Basics sind in der Lizenz **ohne Aufpreis** inkludiert; Agents werden über **Copilot Credits** separat abgerechnet. |
| **Tenant / Infrastruktur** | Dataverse-Environment, für BC: **BC Online** (on-prem nicht unterstützt). Dedizierte Mailbox für Sales Order Agent. |
| **Skills / Rollen** | BC Admin für Agent-Permissions/Profile-Setup; Sales Ops für Lead-Routing-Regeln. Keine Pro-Code-Entwicklung. |
| **Compliance-Rahmen** | DPA über MS Online Services · **Achtung: AI-Agents können Daten außerhalb der Primär-Region verarbeiten** ([Docs](https://learn.microsoft.com/en-us/power-platform/admin/geographical-availability-copilot)) — DPIA für EU-Kunden empfohlen. |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | 3–8 Tage für Sales Order Agent Pilot (Mailbox-Config, Item-Datenqualität-Audit, Approval-Workflow, Pilot-User-Training) *(eigene Einschätzung)* |
| **Laufende Lizenzkosten** | Copilot Credit Consumption — *{TODO: konkrete Credit-Raten pro Agent-Action für BC Sales Order Agent sind in MS-Docs nicht vollständig publiziert}*. Faustregel: Copilot Credit Pack $200/25k Credits/Monat tenant-wide als Startpunkt. |
| **Laufender Betrieb** | 0,5–1 Tag/Monat Monitoring + Review-Queue-Qualitätscheck *(eigene Einschätzung)* |

### Empfehlung

**Status:** 🟡 **Selektiv empfehlen**

- 🟢 **Business Central Sales Order Agent** — für SMB-Großhandels-/B2B-Distributoren mit hohem E-Mail-Order-Volumen: konkrete, messbare Entlastung. **Aber nur in unterstützten Ländern** — Schweiz *{TODO: Payables-Agent-Rollout-Liste hat DK/FR/ES/IT, CH bisher nicht genannt, BC-Online-Verfügbarkeit aber gegeben — Sales Order Agent Verfügbarkeit in CH explizit prüfen}*.
- 🟢 **Sales Qualification Agent** — für D365-Sales-Enterprise-Kunden mit ≥ 200 Leads/Monat.
- 🟡 **Finance Agent / Supply Chain Agent / Customer Service Agent** — Beobachten: hoher Enterprise-Fit, für Journai-SMB-Zielgruppe kaum relevant. Erst bei konkretem Kundenwunsch vertiefen.
- 🔴 **Multi-Agent-Connected-Szenarien in D365 produktiv** — noch nicht reif (gleicher Reifegrad wie in [[Copilot Studio]] § Connected Agents).

**Nächster Schritt für Journai:** Bei BC-Bestandskunden aktiv **Sales Order Agent** als Pilot-Angebot platzieren (Voraussetzung: BC Online + Items mit guter Datenqualität). Bei D365-Sales-Kunden Sales Qualification Agent als Add-on-Workshop anbieten. Custom-Agent-Angebot in BC mit AI Development Toolkit ab H2 2026 evaluieren, wenn Public Preview stabilisiert.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | GA für Core-Agents (Sales Qualification, BC Sales Order Agent, BC Payables Agent); Preview für Sales Close Agents + Finance Agent + Supplier Communications Agent + BC Custom-Agent-Design |
| **GA-Datum** | Sales Qualification Agent: 2025 GA · BC Sales Order Agent: 2025 GA (BC26.x), erweitert in 2026 Wave 1 · BC Payables Agent: 2026 Wave 1 GA in ersten Ländern · Finance Agent (F&O „Payflow Agent"): Wave 1 2026 in rolling GA |
| **Pricing-Modell (einheitlich ab 2026 Wave 1)** | **Copilot Credits** — $200/25.000 Credits/Monat (Pack, tenant-wide) oder **$0.01/Credit PAYG** (Azure-Abrechnung). Pre-Purchase bis −20%. [Copilot Credit Pre-Purchase](https://www.microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/scale-your-agent-rollout-with-confidence-introducing-copilot-credit-pre-purchase-plan/) |
| **Standalone-Preis (EUR)** | *{TODO: EUR-Listpreise pro Credit / Pack nicht durchgehend publiziert, gleiche Mechanik wie Copilot Studio erwartet}* |
| **Lizenz-Bundle** | **Keine Bundling in M365 E7** — Credits sind immer zusätzlich. Modul-Basis-Lizenz (BC Essentials/Premium, D365 Sales Enterprise) muss vorhanden sein. |
| **Voraussetzung** | Jeweilige Modul-Lizenz · Dataverse · für BC: **BC Online** |
| **Region-Verfügbarkeit** | **Geo-Limit!** BC Payables Agent startete in US/UK/AU/NZ (2026-04), weitere Rolling-Rollouts DK/FR/ES/IT/CA. **Schweiz explizit nicht genannt** im bisherigen Rollout-Plan — CH-SMB-Kunden bekommen Agent entweder via EN-UK-Instanz oder warten. Sales Order Agent: ähnliches Muster *(prüfen per [Explore Feature Geography Report](https://learn.microsoft.com/en-us/dynamics365/business-central/copilot-agents-region-language-availability))*. AI-Agent-Daten können region-übergreifend verarbeitet werden. |
| **Hidden Costs** | **125%-Credit-Overage-Enforcement** gleich wie in [[Copilot Studio]] — bei Überschreitung werden Custom Agents tenant-weit disabled. Agent Flows separat blockiert. |
| **Upgrade-Pfad** | Bestandskunde mit „alten" Copilot-Message-Packs (pre 2025-09) wird auf Credits migriert. BC-Kunden müssen Consumption-Billing-Setup aktiv durchführen ([Manage consumption-based billing](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/administration/tenant-admin-center-manage-consumption-billing)). |

---

## Kernkonzept

### Was es im Kern ist

**Dynamics 365 Agents sind nicht ein Produkt** — sie sind eine **Agent-Klasse, die pro D365-Modul ausgeliefert wird**, aber sich eine gemeinsame Laufzeitbasis teilt: die **[[Copilot Studio]]-Runtime** mit **[[Dataverse]]-Grounding**. Das zentrale Design-Prinzip: der Agent agiert **wie ein User des jeweiligen Moduls** — mit zugewiesener Rolle, Permissions und Profile — und nutzt die UI-Metadaten (Captions, Tooltips, Pages) plus natürlich-sprachliche Instruktionen, um Aufgaben zu erledigen. Das ist konträr zu „Hardcoded Workflow" — der Agent entdeckt auch Custom Fields zur Laufzeit.

Das **zweite Design-Prinzip**: der Mensch bleibt **im Approval-Loop**. Der BC Sales Order Agent sendet *nie* ausgehende E-Mails ohne Review-Step; ebenso Sales Close Agent Engage hat Customer-Outreach-Templates, die reviewt werden. Das unterscheidet D365 Agents von naiven „autonomen" Agent-Konzepten: Microsoft positioniert sie bewusst als **assistiert-autonom**, nicht voll-autonom.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| UI / Einstiegspunkt | Mailbox (BC) · Lead-Record (Sales) · Case (CS) | D365-Modul |
| Orchestration | Agent-Runtime mit Generative Orchestrator | Copilot Studio |
| Grounding / Daten | Dataverse-Tabellen des Moduls (Items, Contacts, Leads, Cases) + [[Dataverse MCP Server]] | Dataverse |
| Tool-Layer | UI-Actions als „Tools" + MCP-Tools über Dataverse | Copilot Studio / BC / Modul |
| Modell | Microsoft-managed Orchestrator-LLM (GPT-4o-Klasse) | Azure OpenAI |
| Abrechnung | Copilot Credits | Azure/Power Platform |
| Governance (ab 2026-05-01) | Entra Agent ID, Agent-365-Overlay | [[Agent 365]] · [[Entra Agent ID]] |

### Kern-Fähigkeiten

#### 1. Business Central Sales Order Agent *(SMB-Kern-Agent)*

**Was**: Agent liest designierte Mailbox, identifiziert Kunde/Contact per E-Mail-Adresse in BC, sucht Artikel in Items/Item-Variant/Item-Reference/Item-Attributes/Item-Category (8 Tabellen werden durchsucht), prüft Verfügbarkeit (optional via Capable-to-Promise für Lead-Time-Berechnung), erzeugt Sales-Quote-PDF, handhabt Multi-Turn-E-Mail-Dialog mit Kunde, wandelt nach Bestätigung in Sales Order.

**Mechanik**: Agent bekommt eine BC-Rolle zugewiesen, hat Permission-Set (welche Tabellen) + Profile (welche Pages/Actions). Agent navigiert Pages wie User. Datenqualität der Items-Stammdaten ist **harter Erfolgsfaktor** — bei schlechter Description/Attributen findet Agent nichts.

**Wann relevant**: B2B-Händler mit wiederkehrendem E-Mail-Order-Eingang, Stammkunden mit relativ normalisiertem Produkt-Katalog.

**Grenze**: Reindex-Lag von 15 Min bei neu erfassten Items. Agent braucht immer Human-Approval für ausgehende Mails. Multi-Currency-Szenarien nicht explizit adressiert.

#### 2. Business Central Payables Agent

**Was**: Automatisiert Accounts-Payable — liest Eingangsrechnungen, matcht Vendor + GL-Accounts, bereitet Invoice zur Approval vor. **GA in 2026 Wave 1**, aber geografisch beschränkt: US/UK/AU/NZ zuerst, dann CA/DK/FR/ES/IT.

**Schweiz-Lücke**: Im publizierten Rollout-Plan bis April 2026 **nicht genannt** — CH-Kunden müssen auf Global-Rollout warten oder UK-Instanz nutzen (nicht empfohlen). *{TODO: Roadmap-Update alle 4 Wochen prüfen}*

#### 3. Sales Qualification Agent

**Was**: Autonome Lead-Recherche + Outreach. Zwei Modi: *research-only* (Agent recherchiert, User entscheidet über Outreach) oder *research-and-engage* (Agent sendet autonom templatisierte Follow-up-E-Mails).

**Datenbasis**: Lead-Record in Dataverse + Web-Grounding + M365-Graph-Signale (E-Mail-Historie, Kalender).

**Wann relevant**: D365 Sales Enterprise-Kunde mit hohem Inbound-Lead-Volumen (≥ 200/Monat), bei dem manuelle Qualifikation Bottleneck ist.

#### 4. Sales Close Agent (Research + Engage) *(Preview)*

Research-Variante: analysiert Opportunities für Risiken + „Promising"-Scoring. Engage-Variante: autonome Customer-Outreach im Deal-Zyklus mit Template-Personalisierung. **Preview-Status** → nicht produktionsreif für Journai-Kunden.

#### 5. Sales Research Agent *(Preview)*

Natural-Language-Query-Layer über D365-Sales-Daten. *„Was sind unsere Top-Produkte in Branche X?"* → Antwort aus Dataverse. **Preview** — gleiches Muster wie Dataverse-MCP-Server, nur Sales-spezifisch gewrappt.

#### 6. Customer Service Agents

**Umfang** (2026 Wave 1): Case-Management-Agent, Customer-Intent-Agent (Email-Triage mit Urgency/Sentiment-Analyse), Knowledge-Management-Agent, Quality-Evaluation-Agent für Supervisor. **Enterprise-Fokus** — Forrester 2026 Q1 hat MS als Leader bei Customer-Service-Solutions bewertet, aber das ist Enterprise-Contact-Center-Territory, nicht SMB.

#### 7. Finance Agent (F&O) *(Preview → Rolling GA 2026)*

Reconciliation, Variance Analysis, Excel-Datenvorbereitung + Outlook-Customer-Communication. Interessant: der Agent zieht Finance-Intelligence **in M365-Produktivität** (Excel/Outlook) rein, statt in separaten F&O-Screens. Für SMB aber nicht relevant (F&O ist Enterprise-ERP).

#### 8. Custom Agents in Business Central *(Preview, AI Development Toolkit)*

**2026 Wave 1 Neuerung**: Partner (wie Journai) können **eigene BC-Agents** in natürlicher Sprache designen und gegen echte BC-Daten im Sandbox testen — mit der gleichen Agent-Runtime wie Sales Order / Payables. Später als **MCP-Tools** in Copilot Studio und M365 Copilot consumable. **Strategisch wichtig** für Journai-Partner-Angebot ab H2 2026.

### Typischer Workflow (BC Sales Order Agent als Beispiel)

1. **Setup (1–3 Tage)**: Admin legt Agent-Rolle in BC an, weist Permissions + Profile zu, konfiguriert Mailbox (Exchange-Postfach), definiert Reviewer, setzt Consumption-Billing auf.
2. **Datenqualität-Check (1–2 Tage)**: Items-Stammdaten aufräumen — Descriptions, Attributes, Categories. Sonst findet Agent nichts.
3. **Pilot mit 3–5 Stammkunden** (1 Woche): reale E-Mail-Orders, jeder Review-Step durch Reviewer getrackt, Fehlerquote gemessen.
4. **Rollout** auf breitere Kunden-/Item-Basis, Monitoring-Dashboard im BC Admin Center.
5. **Betrieb**: Review-Queue täglich durchgehen, Credit-Consumption im Power-Platform-Admin-Center beobachten, 125%-Hard-Cap nicht überschreiten.

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| Builder (Journai) | BC-Funktionswissen (Sales, Items-Stammdaten, Role-Permissions), Copilot-Credit-Dimensioning, für Custom Agents ab 2026 H2: AI Dev Toolkit + AL Sandbox |
| Admin (Kunde) | BC Admin (Permissions, Profile, Mailbox-Config), Power Platform Admin für Credit-Monitoring |
| End-User (Kunde) | Reviewer: Mail-/Order-Review-Disziplin; keine Tech-Skills |

---

## Limitierungen & Fallstricke

### Was D365 Agents NICHT können

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Volle Autonomie** ohne Human-Approval | by-design — Approval-Gate ist Feature, nicht Bug; für echte End-to-End-Autonomie eigenen Agent in [[Microsoft Agent Framework]] |
| **On-Prem-BC** (NAV / BC on-prem) | Nur BC Online unterstützt — Upgrade-Pfad zu BC Online nötig |
| **Komplexe Multi-Entity-Workflows** über Modul-Grenzen (z.B. „Lead → Opportunity → Finance-Reconciliation") | Copilot Studio Connected Agents (preview, noch nicht prod) oder MAF-Multi-Agent |
| **Cross-Tenant / Cross-Environment** | jeder Agent läuft im Dataverse-Env, kein Env-Crossing |
| **Finance Agent in EU bei strikter Residenz** | Copilot-AI-Agent-Daten können region-übergreifend verarbeitet werden — für strikte EU-Residenz Compliance-Gap |

### Typische Fallstricke im Einsatz

- **„Agents sind gratis in der Modul-Lizenz"** — nein. Basics-Copilot ist gratis, aber Agent-Actions kosten Credits. Kunden unterschätzen Credit-Burn bei hoch-volumigen Szenarien. *Gegenmittel: Credit-Estimator durchrechnen ([Estimator](https://microsoft.github.io/copilot-studio-estimator/)), 80%-Alarm einrichten.*
- **Item-/Stammdaten-Schwäche killt BC Sales Order Agent** — schlechte Descriptions/Attributes → Agent findet nichts → Human-Intervention-Rate explodiert → ROI kippt. *Gegenmittel: Datenqualität-Audit vor Pilot.*
- **Schweiz-Rollout-Lücke bei Payables Agent** — Partner-Versprechen an CH-Kunden darf nicht auf einem Feature basieren, das erst in 6+ Monaten kommt. *Gegenmittel: Rollout-Liste dokumentieren + Changelog-Review.*
- **125%-Credit-Overage** blockiert Custom Agents tenant-weit — gleiche Falle wie [[Copilot Studio]], nur jetzt in BC-Produktiv-Szenarien schärfer. *Gegenmittel: Power-Platform-Admin-Alert + Pre-Purchase-Plan.*
- **Preview-Agents mit Enterprise-Kundenversprechen** — Sales Close Agent und Finance Agent sind 2026 noch Preview in Teilen. Nicht auf Preview-Feature committen. *Gegenmittel: GA-Status pro Agent aus Release Plan ziehen, nicht aus Marketing.*
- **Datenresidenz unklar** — MS dokumentiert explizit, dass Agent-Daten region-übergreifend verarbeitet werden *können*. Für DSGVO-strikte Kunden DPIA-Update. *Gegenmittel: [geographical-availability-copilot](https://learn.microsoft.com/en-us/power-platform/admin/geographical-availability-copilot) lesen.*

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs Hub | Agents, Copilot, AI in D365 apps (Dach-Seite) | https://learn.microsoft.com/en-us/dynamics365/copilot/ai-get-started | 2026-04-22 |
| Docs | AI agents in Dynamics 365 Sales | https://learn.microsoft.com/en-us/dynamics365/sales/ai-agent-overview | 2026-04-22 |
| Docs | Sales Qualification Agent | https://learn.microsoft.com/en-us/dynamics365/sales/sales-qualification-agent | 2026-04-22 |
| Docs | Sales Close Agent | https://learn.microsoft.com/en-us/dynamics365/sales/sales-close-agent | 2026-04-22 |
| Docs | Sales Research Agent | https://learn.microsoft.com/en-us/dynamics365/sales/sales-research-agent | 2026-04-22 |
| Docs | BC Sales Order Agent Overview | https://learn.microsoft.com/en-us/dynamics365/business-central/sales-order-agent | 2026-04-22 |
| Docs | BC Sales Order Agent Setup | https://learn.microsoft.com/en-us/dynamics365/business-central/sales-order-agent-setup | 2026-04-22 |
| Docs | BC Copilot + Agents Region/Language Availability | https://learn.microsoft.com/en-us/dynamics365/business-central/copilot-agents-region-language-availability | 2026-04-22 |
| Docs | BC Consumption-Based Billing | https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/administration/tenant-admin-center-manage-consumption-billing | 2026-04-22 |
| Release Plan | D365 2026 Wave 1 Overview | https://learn.microsoft.com/en-us/dynamics365/release-plan/2026wave1/ | 2026-04-22 |
| Release Plan | BC 2026 Wave 1 Overview | https://learn.microsoft.com/en-us/dynamics365/release-plan/2026wave1/smb/dynamics365-business-central/ | 2026-04-22 |
| Docs | Payables Agent Geo-Rollout | https://learn.microsoft.com/en-us/dynamics365/release-plan/2025wave2/smb/dynamics365-business-central/use-payables-agent-more-countries-regions | 2026-04-22 |
| Docs | Copilot Data Residency + Movement | https://learn.microsoft.com/en-us/power-platform/admin/geographical-availability-copilot | 2026-04-22 |
| Blog | 2026 Release Wave 1 Plans (Dach-Blog) | https://www.microsoft.com/en-us/dynamics-365/blog/business-leader/2026/03/18/2026-release-wave-1-plans-for-microsoft-dynamics-365-microsoft-power-platform-and-copilot-studio-offerings/ | 2026-04-22 |
| Blog | Copilot Credit Pre-Purchase | https://www.microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/scale-your-agent-rollout-with-confidence-introducing-copilot-credit-pre-purchase-plan/ | 2026-04-22 |

### Secondary

| Quelle | Link | Einschätzung |
|--------|------|--------------|
| MSDynamicsWorld — BC AI Agents GA | https://msdynamicsworld.com/story/directions-emea-2025-dynamics-365-business-central-crosses-customer-milestone-key-ai-agents | Partner-Ökosystem-Sicht, GA-Tracking |
| ERP Software Blog — Agents-Era | https://erpsoftwareblog.com/2026/04/from-copilot-to-agents/ | Einordnung Agentic Shift |
| Cloud Wars — Agentic AI D365 Wave 1 | https://cloudwars.com/ai/microsoft-unveils-agentic-ai-push-across-d365-power-platform-and-m365-copilot-in-2026-release-wave-1/ | Analyst-Sicht Wave 1 |
| Rand Group — D365 Customer Service Agents | https://www.randgroup.com/insights/microsoft/dynamics-365/customer-engagement/customer-service/what-ai-agents-are-in-dynamics-365-customer-service/ | Deep-Dive CS-Agents |

### Events

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Build 2026 | Mai 2026 | AI Development Toolkit BC Deep-Dive, MCP-Tool-Exposure |
| Directions EMEA 2026 | Herbst 2026 | BC-Partner-Ecosystem-Agent-Updates, Länder-Rollout |
| Microsoft Ignite 2026 | Nov 2026 | Wave 2 D365 Agent Preview |

---

## UNCLEAR — offene Fragen

1. **CH-Verfügbarkeit BC Payables Agent + Sales Order Agent** — weder Bestätigung noch Ablehnung im aktuellen Rollout-Plan; Monitoring via Explore-Feature-Geography-Report pflichtig
2. **Konkrete Credit-Kosten pro BC-Agent-Action** — BC-Docs verweisen auf „complexity-based" ohne publizierte Rate-Tabelle
3. **Custom-Agent-AI-Dev-Toolkit GA-Datum** — aktuell Public Preview, GA-Timeline unklar
4. **Finance-Agent-EU-Data-Boundary-Status** — MS dokumentiert region-übergreifende Verarbeitung als möglich → DSGVO-DPIA-Implikation für EU-Kunden unklar
5. **Payables-Agent-Rollout-Schedule post-April-2026** — globaler Rollout-Termin nicht publiziert

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive D365 Agents: Sales/Customer Service/Finance/Business Central; SMB-Relevanz; Copilot-Studio-Basis; Pricing | https://learn.microsoft.com/en-us/dynamics365/ai/ |
| 2026-04-22 | Hongyu | Initial Stub (wartet auf Deep-Research) | Arbeitsauftrag |
