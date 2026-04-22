---
watch: close
status: ga
last_verified: 2026-04-22
aliases:
  - M365 Copilot
  - Copilot
moc:
  - '[[Microsoft MOC]]'
  - '[[Copilot MOC]]'
  - '[[Licensing & SKUs MOC]]'
zuletzt_gesichtet: 2026-04-22
updated: 2026-04-22
---

# Microsoft 365 Copilot

*Das Dach-Produkt für Microsoft's AI-Produktivität im M365-Ökosystem — in Word, Excel, Outlook, Teams, PowerPoint integriert. Jedes SMB-Gespräch mit Microsoft-Bezug startet hier. Aktueller Release-Stand: **Wave 3** mit Cowork (Long-Running, Claude-powered), Edit (agentisch in Word/PowerPoint/Excel), Multi-Model (GPT + Claude + Grok), Work IQ (Personal Knowledge Layer).*

> **Analogie:** Was Clippy 1997 sein sollte, aber tatsächlich funktioniert — und ohne einen zu belehren.

---

## Überblick — Architektur auf einen Blick

```
┌────────────────────────────────────────────────────────────────────┐
│  USER-INTERFACE                                                    │
│    Word · Excel · PowerPoint · Outlook · Teams · Copilot Chat      │
├────────────────────────────────────────────────────────────────────┤
│  ORCHESTRATION + WAVE 3 FEATURES                                   │
│    • Copilot Cowork   (Long-Running, Claude-powered)               │
│    • Copilot Edit     (agentisch, Word/PPT/Excel)                  │
│    • Multi-Model      (GPT · Claude · Grok [US])                   │
│    • Work IQ          (Memory + Inference + Personal Layer)        │
├────────────────────────────────────────────────────────────────────┤
│  GROUNDING / DATA PLANE                                            │
│    Semantic Index  ←  [[Microsoft Graph]]  ←  M365 Tenant Content  │
│                    ←  [[Microsoft 365 Copilot Connectors]]         │
│                    ←  Web (optional, Toggle)                       │
├────────────────────────────────────────────────────────────────────┤
│  COMPLIANCE                                                        │
│    EU Data Boundary · Flex Routing (Opt-Out!) · Purview Labels     │
│    Defender for AI · Prompt Shields                                │
└────────────────────────────────────────────────────────────────────┘
```

---

## Einsatz

### Job-to-be-done

When I Standard-Office-Aufgaben schneller erledigen will (Mail-Entwürfe, Meeting-Zusammenfassungen, Excel-Formeln, PowerPoint aus Outline), I want to direkt in der App mit natürlichsprachlicher Anweisung arbeiten können, so I can mich auf das Denken statt das Formatieren konzentrieren.

### Trigger-Signale

- „Wir haben E5 und wollen AI nutzen, wo fängt man an?"
- „Unser CEO will, dass Copilot überall reinkommt, bevor die Konkurrenz."
- „Warum sollten wir für Copilot bezahlen, wenn ChatGPT Plus günstiger ist?"
- „Unsere Teams-Meetings sind chaotisch — kann Copilot das retten?"
- „Wir haben einen Research-Task, der Tage braucht — gibt's einen Agent dafür in Copilot?" (→ Cowork)

### Einsatz-Szenarien

1. **Teams-Meeting-Zusammenfassungen + Action Items** — Standard-Entry-Szenario, zeigt Wert schnell.
2. **Outlook-Inbox-Management** — Mail priorisieren, Antworten vorformulieren, Nachverfolgung.
3. **Document-Grounding mit Copilot Connectors** — nicht mehr generisches LLM, sondern Antworten aus eigenem SharePoint-/Salesforce-/Jira-/Confluence-Bestand.
4. **Long-Running-Research-Tasks via Cowork** — z. B. „Recherchiere 20 Wettbewerber, erstelle Vergleichstabelle" läuft Stunden im Hintergrund.
5. **Agentische Doc-Edits via Edit** — Word/PPT/Excel Multi-Step-Transformationen in-app.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | M365 E3 minimum, E5 empfohlen; Copilot-Lizenz extra ($30/user/month) oder als Teil von [[Microsoft 365 E7]] |
| **Tenant / Infrastruktur** | Entra-Tenant, Exchange Online, SharePoint Online, Teams |
| **Skills / Rollen** | Admin für Rollout-Policy, End-User-Training empfohlen (0,5 Tag/Gruppe) |
| **Compliance-Rahmen** | DSGVO-Setup, DPA über MS Online Services; Flex Routing-Opt-Out-Entscheidung vor Rollout (siehe § Security) |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | 2–5 Tage Rollout-Konzept + Admin-Konfiguration + Change-Management; End-User-Trainings 0,5 Tag pro Gruppe |
| **Laufende Lizenzkosten** | $30/user/month standalone oder als Teil von [[Microsoft 365 E7]] ($99/user/month) |
| **Laufender Betrieb** | 1 Tag/Monat Admin-Review, Policy-Anpassungen *(eigene Einschätzung)* |

### Empfehlung

**Status:** 🟢 **Empfehlen** — als Einstiegs-Produkt für jeden M365-E3-/E5-Kunden. Wave 3 macht den Unterschied vs. der frühen Copilot-Version sichtbar. **ABER** EU-Kunden: Flex Routing + Claude-Aktivierung vor Rollout compliance-klar ziehen.

**Nächster Schritt für Journai:** Pilot-Paket für SMB-Kunden (50–200 User) standardisieren: 4-Wochen-Pilot mit Baseline-Messung, End-User-Feedback-Loop **und** dokumentiertem Compliance-Check (Flex Routing Opt-Out? Purview-Labels aktiv?).

---

## Status & Pricing

### Aktuelle Pricing-Matrix (Q1/Q2 2026)

| Produkt | USD/Monat | EUR/Monat | Quelle |
|---------|-----------|-----------|--------|
| **M365 Copilot (Enterprise add-on)** | $30/user | ~€28,10 (Listenumrechnung) | [pricing/enterprise](https://www.microsoft.com/en-us/microsoft-365-copilot/pricing/enterprise) |
| **M365 Copilot Business** (≤ 300 user) | $21 (Promo $18 bis 30.06.2026) | ~€21 | [pricing](https://www.microsoft.com/en-us/microsoft-365-copilot/pricing) |
| **M365 E5** (Voraussetzung für viele Features) | $60/user | Variiert | [SAMexpert E7 Guide](https://samexpert.com/microsoft-365-e7-licensing-guide/) |
| **Entra Suite** | $12/user | — | SAMexpert |
| **Agent 365** (standalone, GA 2026-05-01) | $15/user | *{UNCLEAR: EUR}* | [techcommunity Agent 365 GA](https://techcommunity.microsoft.com/discussions/agent-365-discussions/agent-365-will-be-generally-available-on-may-1-2026/4500380) |
| **M365 E7 „Frontier Suite"** (GA 2026-05-01) | **$99** (mit Teams) / **$90,45** (ohne Teams) | *{UNCLEAR: EUR erwartet Mai 2026}* | [CNBC](https://www.cnbc.com/2026/03/09/microsoft-office-365-e7-copilot-ai.html) |

### E7-Bundle-Math

```
                Einzelkauf                           E7 Bundle
                ──────────                           ─────────
  E5:           $60                                  $99
  + Copilot:    $30                                  ─────
  + Entra:      $12           →  ~15% Rabatt  ←      (alles drin)
  + Agent365:   $15                                  (GA 2026-05-01)
  ─────          ───
  TOTAL:        $117                                 $99
```

**Regel**: Ab 3 von 4 Komponenten **genutzt** lohnt E7. Bei nur Copilot + E5 → Einzelkauf günstiger.

### Wichtiger Zusatz — CSP-Promotions (bis 2026-06-30)

| Promo | Rabatt | Zielgruppe |
|-------|--------|------------|
| **„Copilot for All"** | **30%** bei < 1000 Lizenzen · **40%** bei ≥ 1000 Lizenzen *(Schwelle 2026-04-13 von 1500 auf 1000 gesenkt)* | Copilot Rollouts |
| **M365 E5** new-to-offer | **15%** auf 1-Jahres-Term · **10%** auf 3-Jahres-Term | E5-Upgrader |

> **Korrektur zur v1-Note**: Die frühere Annahme „CSP Standard-Staffel 10/15/15%" ist in aktuellen MS-CSP-Announcements **nicht 1:1 bestätigt** — stattdessen volumenbasierte Copilot-for-All-Promos. Quelle: [techcommunity: Key promotional offers in CSP extended through 2026-06-30](https://techcommunity.microsoft.com/blog/partnernews/key-promotional-offers-in-csp-extended-through-june-30-2026/4478937).

### EUR-Ausblick Juli 2026

MS passt EUR-/SEK-/NOK-/DKK-/CHF-Preise an USD-Wechselkurs an — **EUR voraussichtlich ~7% günstiger**. Quelle: [blog.easi.net: M365 2026 pricing](https://blog.easi.net/en/microsoft-365-in-2026-new-capabilities-copilot-skus-and-pricing).

### Region-Verfügbarkeit

Global. **EU-Besonderheiten**: Claude default deaktiviert + Flex Routing default ON — siehe § Security & Compliance.

### Hidden Costs

- **Connector-Index-Limits**: 50 Mio Items/Tenant · 5 Mio/Connection (default). Via Request bis 50 Mio/Connection hochsetzbar (kostenlos). Jenseits: kein publizierter Overage-Tarif — MS-Account-Team fragen. Quelle: [learn.microsoft.com/microsoftsearch/licensing](https://learn.microsoft.com/en-us/microsoftsearch/licensing).
- **Message-Center-Review**: unterschätzt — die Policy-Entscheidungen zu Claude/Flex/Third-Party sind User-sichtbar und kommen monatlich.

---


> **Copilot Cowork (Frontier)**: Ab sofort via [Frontier-Programm](https://www.microsoft.com/en-us/microsoft-365-copilot/frontier-program) zugänglich. Separates Pricing noch nicht kommuniziert; Early Access im Rahmen bestehender M365-Copilot-Lizenzen erwartet.


## Kernkonzept

### Was es im Kern ist

Microsoft 365 Copilot ist kein eigenständiges Produkt im klassischen Sinn, sondern eine **Schicht, die auf dem Microsoft Graph aufsitzt** und LLM-Zugriff mit M365-Datenkontext kombiniert. Der Kern-Mechanismus: jede Copilot-Anfrage zieht implizit Graph-Kontext (letzte Mails, Teams-Chats, SharePoint-Dokumente), komponiert einen erweiterten Prompt und gibt ihn an ein Modell (GPT-4o-Klasse, Claude oder Grok, je nach Wave-3-Modell-Wahl).

Die **Wave-3-Neuerungen verschieben Copilot von „Prompt-Response" zu „Agent-gestützt"**: Cowork erlaubt Long-Running-Agent-Sessions (Claude-powered, Multi-Step-Aufgaben); Edit agent-gestützte Dokumenten-Editierung in Word/PPT/Excel; Multi-Model freie Modell-Wahl; Work IQ personalisierten Knowledge-Layer mit Memory + Inference.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| UI | Chat in M365-Apps (Teams, Outlook, Word, Excel, PowerPoint) | Copilot |
| Orchestration | Prompt-Augmentation mit Graph-Kontext + Wave-3-Agent-Features | Copilot Service |
| Modell | GPT-4o · Claude (Anthropic) · Grok (xAI, nur US) | Azure OpenAI / Foundry Models |
| Data Plane | Graph-Datenzugriff, Connector-Grounding, Semantic Index | [[Microsoft Graph]] + [[Microsoft 365 Copilot Connectors]] |
| Compliance | EU Data Boundary · Purview Labels · Defender for AI | Tenant-Admin |

---

### Kern-Fähigkeiten

#### Chat über M365-Daten *(Basis)*

Copilot Chat in Teams/Web/M365-App greift auf alle Tenant-Daten zu, die dem User zugänglich sind. Grounding ist automatisch, keine Extra-Konfiguration. Mit Copilot Connectors erweiterbar auf externe Quellen (Salesforce, Jira, Confluence, Box, ServiceNow).

#### In-App-Assistenz *(Basis)*

Jede M365-App hat einen Copilot-Slot: Outlook schlägt Mail-Antworten vor, Excel generiert Formeln aus Prompt, PowerPoint baut Slides aus Outline, Teams fasst Meetings zusammen.

#### Wave 3 — Copilot Cowork *(Claude-powered, Long-Running)*

**Was**: Agentische Ausführungs-Engine, die Multi-Step-Tasks in einen Plan zerlegt und im Hintergrund über **Minuten bis Stunden** abarbeitet. Zwischen-Checkpoints + Final-Output. MS lizenziert die Cowork-Technologie direkt von **Anthropic** („working closely with Anthropic … brought the technology that powers Claude Cowork into M365 Copilot"). Quelle: [Microsoft 365 Blog 2026-03-09](https://www.microsoft.com/en-us/microsoft-365/blog/2026/03/09/powering-frontier-transformation-with-copilot-and-agents/).

**EU-Status**: Rollout via **Frontier-Programm** seit Ende März 2026. Cowork läuft auf Anthropic-Modellen — damit in EU/EFTA/UK nur nach expliziter Admin-Aktivierung nutzbar (siehe § Security & Compliance). *{UNCLEAR: konkreter Hard-Cap pro Session — MS publiziert keinen Wert}*.

**Pricing**: **Kein Aufpreis** — in der $30-Copilot-Lizenz enthalten (Frontier-Programm). Keine Consumption-Billing angekündigt.

#### Wave 3 — Copilot Edit *(agentisch, Word/PPT/Excel)*

**Scope**: die komplette Office-Trias. Multi-Step-Edits in-app, agentisch.

- **Word**: Edit mit Zitaten aus Web + Work IQ. GA Windows/Web/Mac.
- **PowerPoint**: standardisiert Fonts, Bullet-Styles, Größen deckweit in einer Operation.
- **Excel**: Multi-Step-Edits auf **lokalen Workbooks** (Windows + Mac) — nicht mehr Cloud-Pflicht. GA.

Quelle: [techcommunity: From draft to done](https://techcommunity.microsoft.com/blog/microsoft365copilotblog/from-draft-to-done-agentic-copilot-in-excel-word-and-powerpoint/4500196).

#### Wave 3 — Multi-Model *(Choice)*

```
             Default                    Frontier                     US-Only
             ───────                    ────────                     ───────
            ┌────────┐              ┌──────────┐                ┌──────────┐
            │ OpenAI │              │ Anthropic│                │   xAI    │
            │ GPT-4o │              │  Claude  │                │  Grok    │
            └────────┘              └──────────┘                └──────────┘
                                  EU: Opt-in pflicht           nicht EU-verfügbar
```

**Steuerung**: pro Tenant + pro User/Gruppe via **MC1263276** (Rollout Ende April 2026). Admins können bis zu 999 User/Gruppen (nested) zuweisen. Quelle: [MC1263276](https://mc.merill.net/message/MC1263276).

#### Wave 3 — Work IQ *(Personal Knowledge Layer)*

**Drei Schichten** (MS Wording): **Data · Memory · Inference**.

```
┌─────────────────────────────────────────────────────────────────┐
│  WORK IQ                                                        │
├─────────────────────────────────────────────────────────────────┤
│  DATA     ← Semantic Index                                      │
│            ← SharePoint · OneDrive · Exchange · Teams-Chats     │
│            ← Meeting-Transkripte · Dynamics 365 · Power Apps    │
│            ← Power BI (coming soon) · Copilot Connectors        │
│                                                                 │
│  MEMORY   Personalisierungs-Layer — lernt Stil, Präferenzen,    │
│            Patterns. Persistent über Sessions.                  │
│            → Opt-out per User jederzeit im Setting              │
│                                                                 │
│  INFERENCE Kontext-Composition → Modell-Call → Response         │
└─────────────────────────────────────────────────────────────────┘
```

**Wichtig**: Tenant-weiter Cross-Product-Toggle „Microsoft usage data" (aus Edge/Bing/MSN-Daten für Personalisierung) ist vielerorts **by-default ON** — Admins müssen explizit opt-out setzen. Quelle: [Microsoft Support: Copilot Privacy Controls](https://support.microsoft.com/en-us/topic/microsoft-copilot-privacy-controls-8e479f27-6eb6-48c5-8d6a-c134062e2be6).

#### Wave 3 — Copilot Cowork *(Long-Running, Multi-Step)*

**Was**: Copilot Cowork ist für lang laufende, mehrstufige Aufgaben in Microsoft 365 konzipiert. Der Nutzer beschreibt das gewünschte Ergebnis; Cowork erstellt einen Plan, arbeitet eigenständig über Dateien und Tools hinweg und liefert sichtbaren Fortschritt mit Interventionsmöglichkeiten.

**Status**: **Verfügbar via [Frontier-Programm](https://www.microsoft.com/en-us/microsoft-365-copilot/frontier-program)** (Early Access). Breiter GA-Zeitplan noch nicht kommuniziert.

**Unterstützte Modell-Basis**: Multi-Model (bringt die Technologie-Plattform hinter Claude Cowork in M365 Copilot).

**Docs**: [learn.microsoft.com/copilot/microsoft-365/cowork](https://learn.microsoft.com/en-us/copilot/microsoft-365/cowork/)

**Voraussetzung**: Anmeldung beim Frontier-Programm erforderlich.


### Typischer Workflow

1. **Setup** — Lizenzen zuweisen, Copilot-Policies im Admin Center konfigurieren (Claude-Toggle, Flex-Routing-Opt-Out, Content-Restrictions), ggf. Sensitivity-Labels aus [[Microsoft Purview]] aktivieren
2. **Build / Configure** — kaum Build-Step; für Anpassung: Copilot Connectors anlegen (siehe Connector-Matrix unten)
3. **Deploy** — Rollout-Phase: pilot group → broad rollout nach Readiness-Report
4. **Operate** — Admin überwacht Usage-Reports (3 separate), passt Policies an, reviewed Message Center zu Copilot-Änderungen monatlich

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| Builder (Journai) | Keine Pro-Code nötig, nur Prompt-Training-Design + Admin-Playbook |
| Admin (Kunde) | M365 Admin Center, Sensitivity Labels, Connector-Config, Flex-Routing-Entscheidung |
| End-User | Basis-Prompting, Zeit zur Erkundung |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Kein Custom-Code-Agent-Pattern** — wenn Logik komplexer als Prompt wird | [[Copilot Studio]] (Low-Code) oder [[Microsoft Agent Framework]] (Pro-Code) |
| **Nicht für externe Kundenbasis** — nur für interne User mit M365-Lizenz | Custom Engine Agent + M365 Agents SDK für Bot-Kanal |
| **Keine feingranulare Output-Compliance-Policy pro Chat-Antwort** | Purview DLP-Policy-Location „M365 Copilot and Copilot Chat" (ab 2026 verfügbar) → Content mit bestimmten Labels vom Grounding ausgeschlossen |
| **Cowork-Session-Duration opak** — MS publiziert keinen Hard-Cap | Kunden-Erwartung auf „Minutes–Hours" stellen; Finales Monitoring im Dashboard |

### Typische Fallstricke im Einsatz

- **„Copilot ersetzt ChatGPT"** — Kunden glauben, Copilot ist nur UI für GPT. Der Unterschied ist Graph-Kontext + Work IQ. *Gegenmittel: In der Demo explizit Graph-Grounding + Memory-Layer zeigen.*
- **Rollout ohne Training** — Copilot ohne Prompt-Training wird „ganz okay" erlebt, mit Training „transformativ". *Gegenmittel: 0,5-Tag-Training als Pflichtteil.*
- **Sensitivity-Labels nicht vor Rollout aktivieren** — Copilot kann dann sensible Daten unklassifiziert in Antworten mischen. *Gegenmittel: Purview-Auto-Classification-Pilot *vor* Copilot-GA.*
- **Flex Routing nicht im Blick** *(kritisch für EU!)* — default ON, Admins müssen aktiv opt-out setzen, wenn sie strikte EU-Residenz wollen. *Gegenmittel: Flex-Routing-Status in Rollout-Checkliste.*
- **Claude-Aktivierung ohne DPIA** — MS rät zu aktualisierter DPIA vor Claude-Enable (Anthropic jetzt unter MS-DPA statt separaten Anthropic-Terms). *Gegenmittel: Compliance-Brief vor Admin-Klick.*

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| [[Microsoft Graph]] | Daten-Backbone | GA | keine — unter der Haube |
| [[Microsoft 365 Copilot Connectors]] | externe Datenquellen in Graph-Index | GA | mittel — Konnektor-Config ist Arbeit, ACL-Mapping prüfen |
| [[Microsoft Purview]] | Sensitivity Labels + DLP | GA | niedrig; DLP-Policy-Location für Copilot neu in 2026 |
| [[Copilot Studio]] | Custom Agents als Copilot-Extensions | GA | mittel — Agent-Lifecycle vs. Copilot-Lifecycle |
| [[Defender for AI]] | Prompt-Injection-/Jailbreak-Detection | GA | niedrig |
| [[Azure AI Content Safety]] | Prompt Shields als Eingangsfilter | GA | niedrig |

### Third-Party Copilot Connectors (First-Party MS-gepflegt, Stand April 2026)

| Connector | Status | Scope | Link |
|-----------|--------|-------|------|
| **Salesforce CRM** | GA | Contacts · Opps · Leads · Cases · Accounts | [Docs](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/salesforce-connector) |
| **ServiceNow Knowledge** | GA | KB-Artikel | [Docs](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/servicenow-knowledge-overview) |
| **ServiceNow Catalog** | GA | Catalog-Items | [Docs](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/servicenow-catalog-overview) |
| **Jira Cloud** | GA | Issues | [Docs](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/jira-cloud-overview) |
| **Jira Data Center** | GA | Issues + Project Data | [Docs](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/jira-data-center-overview) |
| **Confluence Cloud** | GA | Pages · Blogs | [Docs](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/confluence-cloud-overview) |
| **Confluence On-Prem** | GA | — | [Docs](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/confluence-onpremises-deployment) |
| **Box** | GA *(Box-verwaltet)* | Enablement per Box-Formular | [Box Support](https://support.box.com/hc/en-us/articles/28326901596819-Box-for-Microsoft-Copilot-via-Box-Connector-for-Microsoft-Graph) |
| **SAP (OData via Power Platform)** | 🟡 **Preview** | Knowledge-Quelle über Power Platform Connectors | [Docs](https://learn.microsoft.com/en-us/microsoft-copilot-studio/knowledge-real-time-connectors) |
| **Gallery gesamt** | Mix GA/Preview | 100+ prebuilt Connectors | [Gallery](https://learn.microsoft.com/en-us/microsoftsearch/connectors-gallery) |

### APIs / Protokolle

- **Microsoft Graph** als primärer Daten-Contract
- **Copilot Studio** als Extension-Framework (Declarative Agents)
- **Purview-Label-Schema** wird respektiert (Grounding + Output-Label-Inheritance)

---

## Security & Compliance

### EU Data Residency *(kritisch)*

M365 Copilot ist **EU-Data-Boundary-Service** für EU-Tenants: Prompts, abgerufene Daten und Responses bleiben standardmäßig innerhalb der EU-Data-Boundary. Quelle: [Data, Privacy, Security for M365 Copilot](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy).

**ABER — Flex Routing (NEU ab 2026-04-17)**:

```
┌────────────────────────────────────────────────────────────────┐
│ EU/EFTA-Tenant · Copilot-Request                               │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
            ┌────────────────────────────────────┐
            │  Default-Last vorhanden in EU?     │
            └────────────────────────────────────┘
                   JA ▲                     ▼ NEIN (Peak-Demand)
                      │                     │
         ┌────────────┘                     └─────────────┐
         ▼                                                ▼
  ┌──────────────────┐                        ┌──────────────────────┐
  │ Inferencing IN   │                        │ Inferencing AUSSERHALB│
  │ EU Data Boundary │                        │ EU Data Boundary      │
  │ (Standard)       │                        │ • pseudonymisiert     │
  └──────────────────┘                        │ • Data-at-Rest bleibt │
                                              │   in EU               │
                                              └──────────────────────┘

         default ON  ───  Admin muss aktiv opt-out setzen!
```

**Admin-Check für strikte EU-Residenz**: Copilot Admin Center → **Settings** → **EU Data Boundary** → Flex Routing deaktivieren. Quelle: [Flex Routing Docs](https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-flex-routing) · [MC1269223](https://changepilot.cloud/blog/microsoft-365-copilot-flex-routing-eu-data-boundary-mc1269223) · Analyst-Einordnung: [office365itpros 2026-04-07](https://office365itpros.com/2026/04/07/flex-routing-copilot-europe/).

**In-Country Data Processing**: Ende 2026 für 15 Länder angekündigt (inkl. mehrere EU-Länder). Quelle: [Microsoft 365 Blog 2025-11-04](https://www.microsoft.com/en-us/microsoft-365/blog/2025/11/04/microsoft-offers-in-country-data-processing-to-15-countries-to-strengthen-sovereign-controls-for-microsoft-365-copilot/). *{UNCLEAR: Schweiz-spezifische Zusage — im 15-Länder-Programm, aber Zeitplan nicht fix}*.

### Claude-Default-OFF in EU/EFTA/UK

**Offizieller MS-Grund**: *„Anthropic models are out of scope for the EU Data Boundary at this time, and of any in-country LLM processing commitments."* → MS schaltet Claude-Toggle in EU/EFTA/UK **by-default OFF**, damit keine unbeabsichtigte Verarbeitung außerhalb der EU Data Boundary passiert. Quelle: [Anthropic as Subprocessor](https://learn.microsoft.com/en-us/copilot/microsoft-365/connect-to-ai-subprocessor).

**Admin-Enablement-Flow (EU)**:

```
  Global Admin          M365 Admin Center           Copilot Settings
  ──────────┐           ────────────────┐          ────────────────┐
            │                           │                           │
            ▼                           ▼                           ▼
    ┌───────────────┐        ┌──────────────────┐       ┌─────────────────┐
    │ 1. Einloggen   │   →    │ 2. Copilot →     │  →    │ 3. „AI providers │
    │                │        │   Settings →    │       │ operating as MS  │
    │                │        │   View all      │       │ subprocessors"   │
    └───────────────┘        └──────────────────┘       └─────────────────┘
                                                                    │
                                                                    ▼
                                                          ┌─────────────────┐
                                                          │ 4. Anthropic →  │
                                                          │   Enable        │
                                                          └─────────────────┘
                                                                    │
                                                                    ▼
                                                          ┌─────────────────┐
                                                          │ 5. optional:    │
                                                          │ MC1263276-      │
                                                          │ Control → User/ │
                                                          │ Groups scope    │
                                                          └─────────────────┘
```

**DPIA-Pflicht**: MS rät EU-Tenants zu aktualisierter DPIA vor Aktivierung, da Anthropic jetzt unter MS-DPA/Product-Terms läuft (statt separaten Anthropic-Terms). Quelle: [UC Today / Directions on Microsoft](https://www.uctoday.com/unified-communications/microsoft-365-copilot-to-enable-anthropic-models-by-default-what-compliance-leads-need-to-know/).

### Purview Sensitivity Labels *(MS-Garantie)*

**Offizielles Microsoft Statement** (learn.microsoft.com/purview/ai-m365-copilot):

> *„Copilot and agents **recognize and integrate sensitivity labels** into the user interactions to help keep labeled data protected. Copilot works with Microsoft Purview sensitivity labels and encryption to **enforce access controls and protection settings during grounding and content generation**."*

Konkret:
- **EXTRACT-Usage-Rights-Check** bei verschlüsselten Labels — nur bei Erlaubnis zieht Copilot den Content in die Response
- **Label-Inheritance**: neue Copilot-Outputs erben automatisch das **höchstrangige** Label aller referenzierten Quellen
- **DLP-Policy-Location „M365 Copilot and Copilot Chat"**: Content mit bestimmten Labels explizit vom Grounding ausgeschlossen (erscheint weiterhin in Citations, aber Inhalt wird nicht verwendet). Quelle: [DLP for Copilot](https://learn.microsoft.com/en-us/purview/dlp-microsoft365-copilot-location-learn-about).

### Datenverarbeitung (Übersicht)

| Thema | Status |
|-------|--------|
| **Data Residency** | Standard: EU-Boundary · **ABER:** Flex Routing default ON für Peak-Lasten → aktiv opt-out! |
| **Prompts & Outputs** | Nicht für Training verwendet, Standard MS Online Services DPA |
| **DPA** | Standard MS Online Services DPA (Anthropic jetzt unter MS-DPA inkludiert) |
| **EU-AI-Act** | Limited Risk (User-Assistant); bei HR/Credit/Health Use-Cases ggf. High Risk |

### Microsoft-Compliance-Stack (Copilot-spezifisch)

- [[Microsoft Purview]] Sensitivity Labels → respektiert (siehe oben)
- [[Defender for AI]] → Runtime-Schutz für Copilot-Prompts
- [[Azure AI Content Safety]] → Prompt Shields als Eingangsfilter
- Unified Audit Log → jede Copilot-Query protokollierbar

### Bekannte Compliance-Lücken

- **Claude-Integration in EU/EFTA/UK per Default deaktiviert** — aktiv schalten *(Workflow oben)*
- **Flex Routing by-default ON** — EU-Kunden müssen aktiv opt-out, falls strikte Residenz gewünscht
- **Cross-Product-„Microsoft usage data"-Toggle** by-default ON — Admins müssen opt-out für Work-IQ-Personalisierung aus Edge/Bing/MSN-Daten

---

## Admin-/Ops-Playbook

Fünf konkrete Anlaufstellen für einen neuen Copilot-Kunden:

1. **Readiness vor Rollout** → M365 Admin Center → **Reports** → **Usage** → **Microsoft 365 Copilot readiness report**. Spalte „Suggested candidate for Copilot" für datengetriebene Pilot-Auswahl. [Docs](https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/microsoft-365-copilot-readiness?view=o365-worldwide).
2. **Usage-Monitoring** → 3 separate Reports: **Copilot Usage** · **Copilot Chat Usage** · **Copilot Agent Usage** (enabled vs. active, per-App-Adoption, Retention). [Docs](https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/microsoft-365-copilot-usage?view=o365-worldwide).
3. **Admin-Settings-Baseline** (3 Governance-Essentials): (a) Content restrictions für Enterprise Data Protection · (b) Web Search Toggle · (c) Anthropic-/Third-Party-Model-Toggle explizit setzen. [seanshares.com](https://seanshares.com/copilot-admin-settings-to-check-governance/).
4. **Flex Routing Opt-Out** *(EU-kritisch)* → Copilot Admin Center → **Settings** → **EU Data Boundary** → deaktivieren, falls strikt. [Docs](https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-flex-routing).
5. **Message Center Filtering** → Admin Center → **Health** → **Message Center** → Tag-Filter „Microsoft 365 Copilot" + „Stay informed". Relevante IDs: **MC1263276** (Third-Party-Model-Assignment), **MC1269223** (Flex Routing), **MC1193290** (Anthropic-Default). [mc.merill.net](https://mc.merill.net/).

Plus: **Copilot Dashboard (Viva Insights)** für org-weite Adoption-Analytics jenseits Admin-Center. [Docs](https://learn.microsoft.com/en-us/viva/insights/org-team-insights/copilot-dashboard).

---

## Abgrenzung & Wettbewerb

### Microsoft-intern: Wann M365 Copilot vs. welches andere MS-Produkt?

| Frage-Situation | **Microsoft 365 Copilot** | Alternative MS-Produkt |
|-----------------|---------------------------|------------------------|
| „Kunde will AI in Word/Excel/PowerPoint/Outlook/Teams nutzen" | ✅ Out-of-the-box-Erfahrung | – |
| „Custom-Agent in Teams, mit Low-Code bauen" | ⚠️ nur Agent Builder / Declarative Agents | [[Copilot Studio]] — bessere Low-Code-UX + Agent Flows |
| „Pro-Code-Agent mit eigener Orchestration-Logik" | ⚠️ Copilot ist Endbenutzer-Oberfläche, kein Build-Tool | [[Microsoft Agent Framework]] + [[M365 Agents SDK]] + [[Teams SDK]] |
| „Governance über mehrere Agents hinweg" | ⚠️ Copilot allein reicht nicht | [[Agent 365]] + [[Entra Agent ID]] als Overlay |
| „Lange Running-Multi-Step-Task mit Autonomie" | ✅ Copilot Cowork (Wave 3, Frontier) | alternativ: MAF-Agent selbst hosten mit Long-Running-Durable-Task |
| „Kunden-Daten grounden" | ✅ via [[Microsoft 365 Copilot Connectors]] | [[Foundry IQ]] / [[Azure AI Search]] für Azure-Agents |

### Externe Alternativen

| Dimension | **Microsoft 365 Copilot** | Google Workspace + Gemini | Glean | Notion AI | Slack AI |
|-----------|---------------------------|---------------------------|-------|-----------|----------|
| **Fokus** | M365-native Produktivität + Agent-Ausbaupfad | Google-native + Gemini | Enterprise-Search + AI-Assistant | Knowledge-Base + Writing | Chat-Summaries + Search |
| **Pricing** | $30/user/month | $30 (WS + Gemini Add-on) | $30–45/user/month | $10–20/user | Pro $15 |
| **EU-Data-Residency** | EU Data Boundary GA (⚠️ Wave-3-Flex-Routing prüfen) | Google Cloud EU Region | regional ja | USA (begrenzt EU) | USA |
| **Integrationstiefe in MS** | maximal | keine | via Connectors | schwach | schwach |
| **Custom-Agent-Pfad** | via Copilot Studio + Custom Engine | via Vertex AI | via Connector-Actions | keine Agents | Workflow Builder |
| **Stärke** | M365-Deep-Integration + Agent-Governance-Roadmap | Google-Produkte, Gemini Ultra | Enterprise-Such-Qualität | Doc-zentrisch, Solo-Nutzer | Team-Chat-Integration |
| **Schwäche** | Vendor-Lock-in; UI-Konsistenz noch hakelig | kein MS-Ökosystem-Zugriff | kein eigenes LLM, abhängig | schwache Agent-/Tool-Layer | eng begrenzter Scope |

### Empfehlungs-Regel

**Wir empfehlen Microsoft 365 Copilot**, wenn der Kunde (a) M365-E3/E5-basiert ist, (b) mindestens 50 Lizenzen plant, (c) Adoption-Begleitung durchführt. **Sonst** bleibt Glean die bessere Enterprise-Search-Option (Multi-SaaS-Kunden); Notion AI / Slack AI nur als **Ergänzung** zu Copilot, nicht als Ersatz. Für Kunden mit **reiner Google-Workspace-Basis** ist Gemini die natürliche Wahl — aber dann kein Agent 365 / Entra Agent ID-Pfad.

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Product Page | M365 Copilot | https://www.microsoft.com/microsoft-365/copilot | 2026-04-22 |
| Docs Hub | M365 Copilot Docs | https://learn.microsoft.com/en-us/microsoft-365-copilot/ | 2026-04-22 |
| Data Privacy Docs | M365 Copilot Privacy | https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy | 2026-04-22 |
| Flex Routing Docs | Flex Routing (EU) | https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-flex-routing | 2026-04-22 |
| Anthropic Subprocessor | Claude-Toggle | https://learn.microsoft.com/en-us/copilot/microsoft-365/connect-to-ai-subprocessor | 2026-04-22 |
| Cowork Docs | Cowork Overview | https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/ | 2026-04-22 |
| Purview-for-Copilot | AI & Purview | https://learn.microsoft.com/en-us/purview/ai-m365-copilot | 2026-04-22 |
| DLP-for-Copilot | DLP Location Copilot | https://learn.microsoft.com/en-us/purview/dlp-microsoft365-copilot-location-learn-about | 2026-04-22 |
| Work IQ Docs | Work IQ MCP (Preview) | https://learn.microsoft.com/en-us/microsoft-copilot-studio/use-work-iq | 2026-04-22 |
| Connector Docs | Copilot Connectors Overview | https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/overview | 2026-04-22 |
| Connector Gallery | Gallery | https://learn.microsoft.com/en-us/microsoftsearch/connectors-gallery | 2026-04-22 |
| Index-Limits | Microsoft Search Licensing | https://learn.microsoft.com/en-us/microsoftsearch/licensing | 2026-04-22 |
| Admin Readiness | Readiness Report | https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/microsoft-365-copilot-readiness?view=o365-worldwide | 2026-04-22 |
| Admin Usage | Usage Report | https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/microsoft-365-copilot-usage?view=o365-worldwide | 2026-04-22 |
| Admin Agent Usage | Agent Usage Report | https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/microsoft-365-copilot-agents?view=o365-worldwide | 2026-04-22 |
| Roadmap | M365 Roadmap Copilot-Filter | https://www.microsoft.com/microsoft-365/roadmap?filters=Microsoft%20365%20Copilot | 2026-04-22 |
| Pricing (Enterprise) | Enterprise Pricing | https://www.microsoft.com/en-us/microsoft-365-copilot/pricing/enterprise | 2026-04-22 |
| Pricing (Business) | Business Pricing | https://www.microsoft.com/en-us/microsoft-365-copilot/pricing | 2026-04-22 |
| CSP-Promos | Extended-Promos-Blog | https://techcommunity.microsoft.com/blog/partnernews/key-promotional-offers-in-csp-extended-through-june-30-2026/4478937 | 2026-04-22 |
| Wave 3 Recap | techcommunity | https://techcommunity.microsoft.com/blog/microsoft365copilotblog/in-case-you-missed-it-frontier-transformation-and-wave-3-of-microsoft-365-copilo/4504765 | 2026-04-22 |
| What's New March | techcommunity | https://techcommunity.microsoft.com/blog/microsoft365copilotblog/what%E2%80%99s-new-in-microsoft-365-copilot--march-2026/4506322 | 2026-04-22 |
| Edit Feature | techcommunity | https://techcommunity.microsoft.com/blog/microsoft365copilotblog/from-draft-to-done-agentic-copilot-in-excel-word-and-powerpoint/4500196 | 2026-04-22 |
| Work IQ Explainer | techcommunity | https://techcommunity.microsoft.com/blog/microsoft365copilotblog/a-closer-look-at-work-iq/4499789 | 2026-04-22 |
| MC1263276 | Third-Party-Model Control | https://mc.merill.net/message/MC1263276 | 2026-04-22 |

### Secondary (Analysten & Industrie)

| Quelle | Link | Einschätzung |
|--------|------|--------------|
| Directions on Microsoft | https://www.directionsonmicrosoft.com/reports/m365-copilot-adds-choice-and-risk-with-anthropics-claude/ | Kritisch-neutrale Analyse zur Claude-Integration + Risiko |
| SAMexpert | https://samexpert.com/microsoft-365-e7-licensing-guide/ | Licensing-Spezialist, Bundle-Math |
| UC Today | https://www.uctoday.com/unified-communications/microsoft-365-copilot-to-enable-anthropic-models-by-default-what-compliance-leads-need-to-know/ | Compliance-Lens für Anthropic-Default |
| office365itpros | https://office365itpros.com/2026/04/07/flex-routing-copilot-europe/ | EU-IT-Community zu Flex Routing |
| CNBC | https://www.cnbc.com/2026/03/09/microsoft-office-365-e7-copilot-ai.html | E7-Bundle-Pressemeldung |

### Events

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Build 2026 | Mai 2026 | Wave 4 Features-Preview, Agent-365-Deep-Dive |
| AI Tour Zürich 2026 | 29.04.2026 | Regionale EU-Details, In-Country-Processing-Zeitplan |
| Microsoft Ignite 2026 | November 2026 | Nächste Wave-Konsolidierung, Agent-Ecosystem-Updates |

---

## UNCLEAR — offene Fragen

1. **EUR-Listpreise für M365 E7 und Agent 365** (Rollout erwartet Mai 2026)
2. **Consumption-Billing für Cowork-Long-Running-Tasks** jenseits Frontier-Preview — gibt es eine Obergrenze?
3. **Schweiz-spezifische In-Country-Data-Processing-Zusage** — CH ist im 15-Länder-Programm, aber exakter Zeitplan unklar
4. **Cowork Hard-Cap pro Session** — MS sagt „Minutes to hours", kein konkreter Wert publiziert
5. **SAP-OData-Connector GA-Datum** — aktuell nur Preview via Power Platform

---

## Changelog


| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | auto-sync | Copilot Cowork (Long-Running, Multi-Step-Work) ist jetzt via Frontier-Programm verfügbar. Nutzer können über das Frontier-Programm Early Access beantragen. | https://www.microsoft.com/en-us/microsoft-365-copilot |
| 2026-04-22 | Hongyu / Deep-Research | **Vollständige Deep-Research-Integration** via claude-researcher agent: Wave-3-Features mit EU-Details, Flex-Routing-Warnung (DSGVO-kritisch), korrigierte CSP-Realität (30%/40% Copilot-for-All statt 10/15/15%), Connector-Matrix mit realen Reifegraden, Admin-Playbook mit 5 konkreten Anlaufstellen, E7-Bundle-Math. Quellen: 30+ Primary (learn.microsoft.com + techcommunity + Microsoft Blogs) + 7 Secondary (SAMexpert, Directions, UC Today, office365itpros, CNBC) | siehe Referenzen oben |
| 2026-04-21 | Hongyu | Initial Stub, watch: close, Status: GA Wave 3 | Arbeitsauftrag |
