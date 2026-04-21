---
watch: close
status: ga
last_verified: 2026-04-21
aliases: [M365 Copilot, Copilot]
moc:
  - "[[Microsoft MOC]]"
  - "[[Copilot MOC]]"
  - "[[Licensing & SKUs MOC]]"
---

# Microsoft 365 Copilot

*Das Dach-Produkt für Microsoft's AI-Produktivität im M365-Ökosystem — in Word, Excel, Outlook, Teams, PowerPoint integriert. Jedes SMB-Gespräch mit Microsoft-Bezug startet hier. Aktueller Release-Stand: Wave 3 mit Cowork (Long-Running, Claude-powered), Edit, Multi-Model und Work IQ.*

> **Analogie:** Was Clippy 1997 sein sollte, aber tatsächlich funktioniert — und ohne einen zu belehren.

---

## Einsatz

### Job-to-be-done

When I Standard-Office-Aufgaben schneller erledigen will (Mail-Entwürfe, Meeting-Zusammenfassungen, Excel-Formeln, PowerPoint aus Outline), I want to direkt in der App mit natürlichsprachlicher Anweisung arbeiten können, so I can mich auf das Denken statt das Formatieren konzentrieren.

### Trigger-Signale

- „Wir haben E5 und wollen AI nutzen, wo fängt man an?"
- „Unser CEO will, dass Copilot überall reinkommt, bevor die Konkurrenz."
- „Warum sollten wir für Copilot bezahlen, wenn ChatGPT Plus günstiger ist?"
- „Unsere Teams-Meetings sind chaotisch — kann Copilot das retten?"

### Einsatz-Szenarien

1. **Teams-Meeting-Zusammenfassungen + Action Items** — Standard-Entry-Szenario, zeigt Wert schnell.
2. **Outlook-Inbox-Management** — Mail priorisieren, Antworten vorformulieren, Nachverfolgung.
3. **Document-Grounding mit Copilot Connectors** — nicht mehr generisches LLM, sondern Antworten aus eigenem SharePoint-Bestand.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | M365 E3 minimum, E5 empfohlen, Copilot-Lizenz extra ($30/user/month) oder in E7 enthalten |
| **Tenant / Infrastruktur** | Entra-Tenant, Exchange Online, SharePoint Online, Teams |
| **Skills / Rollen** | Admin für Rollout-Policy, End-User-Training empfohlen |
| **Compliance-Rahmen** | DSGVO-Setup, DPA gilt über MS Online Services; Prompt-Daten in EU wenn Tenant EU |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | 2–5 Tage Rollout-Konzept + Admin-Konfiguration + Change-Management; End-User-Trainings 0,5 Tag pro Gruppe |
| **Laufende Lizenzkosten** | $30/user/month standalone oder als Teil von [[Microsoft 365 E7]] ($99/user/month) |
| **Laufender Betrieb** | 1 Tag/Monat Admin-Review, Policy-Anpassungen *(eigene Einschätzung)* |

### Empfehlung

**Status:** 🟢 **Empfehlen** — als Einstiegs-Produkt für jeden M365-E3-/E5-Kunden. Wave 3 macht den Unterschied vs. der frühen Copilot-Version sichtbar.

**Nächster Schritt für Journai:** Pilot-Paket für SMB-Kunden (50–200 User) standardisieren: 4-Wochen-Pilot mit Baseline-Messung und End-User-Feedback-Loop.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | GA, aktuelle Welle: Wave 3 |
| **GA-Datum** | 2024-01 (initial), Wave-3-Rollout 2026-Q1/Q2 |
| **Standalone-Preis (USD)** | $30/user/month (Add-on zu E3/E5) |
| **Standalone-Preis (EUR)** | €29,40/user/month (ab 2026-04 erwartet Anpassung auf E7-Bundle-EUR) |
| **Lizenz-Bundle** | Teil von [[Microsoft 365 E7]]; auch standalone auf E3/E5 |
| **Voraussetzung** | M365 E3 oder E5 |
| **Region-Verfügbarkeit** | Global · **EU-Besonderheit: Claude-Default deaktiviert** (manuell enablen im Admin Center) |
| **CSP-Promo** | 10%/15%/15% (Jahr 1/2/3) verhandelbar über CSP |
| **Hidden Costs** | *{TODO: Overage-Pricing bei Connector-Anbindung recherchieren}* |
| **Upgrade-Pfad** | E3+Copilot → E5+Copilot → E7 (bündelt zusätzlich Entra Suite + Agent 365) |

---

## Kernkonzept

### Was es im Kern ist

Microsoft 365 Copilot ist kein eigenständiges Produkt im klassischen Sinn, sondern eine **Schicht, die auf dem Microsoft Graph aufsitzt** und LLM-Zugriff mit M365-Datenkontext kombiniert. Der Kern-Mechanismus: jede Copilot-Anfrage zieht implizit Graph-Kontext (deine letzten Mails, Teams-Chats, SharePoint-Dokumente), komponiert einen erweiterten Prompt und gibt ihn an ein Modell (GPT-4o-Klasse oder Claude, je nach Wave-3-Modell-Wahl).

Die Wave-3-Neuerungen verschieben Copilot von „Prompt-Response" zu „Agent-gestützt": **Cowork** erlaubt Long-Running-Agent-Sessions (Claude-powered, speziell für Multi-Step-Aufgaben); **Edit** agent-gestützte Dokumenten-Editierung; **Multi-Model** freie Modell-Wahl; **Work IQ** personalisierten Knowledge-Layer aus Nutzer-Historie.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| UI | Chat in M365-Apps (Teams, Outlook, Word, Excel, PowerPoint) | Copilot |
| Orchestration | Prompt-Augmentation mit Graph-Kontext | Copilot Service |
| Modell | GPT-4o · Claude · O-Series (Wave 3 Multi-Model) | Azure OpenAI / Foundry Models |
| Data Plane | Graph-Datenzugriff, Connector-Grounding | [[Microsoft Graph]] + [[Microsoft 365 Copilot Connectors]] |

### Kern-Fähigkeiten

#### Chat über M365-Daten

Copilot Chat in Teams greift auf alle Tenant-Daten zu, die dem User zugänglich sind. Mit Copilot Connectors erweiterbar auf externe Quellen. Basis-Feature, keine Extra-Konfiguration.

#### In-App-Assistenz

Jede M365-App hat einen Copilot-Slot: Outlook schlägt Mail-Antworten vor, Excel generiert Formeln aus Prompt, PowerPoint baut Slides aus Outline, Teams fasst Meetings zusammen.

#### Wave 3: Cowork (Claude-powered)

*{TODO: tiefes Review, da das ein Premium-Layer mit separater Pricing-Story sein könnte. EU-Availability explizit klären.}*

#### Wave 3: Multi-Model

User/Admin kann zwischen GPT-Familie und Claude wechseln für bestimmte Tasks. **EU-Kunden: Claude-Default deaktiviert** — muss aktiv geschaltet werden.

#### Work IQ

Personalisierter Knowledge-Layer — lernt aus Nutzer-Interaktionen, schlägt proaktiv vor. *{TODO: Data-Residency für diese Learning-Daten verifizieren.}*

### Typischer Workflow

1. **Setup** — Lizenzen zuweisen, Copilot-Policies im Admin Center konfigurieren, ggf. Sensitivity-Labels aus [[Microsoft Purview]] aktivieren
2. **Build / Configure** — kaum Build-Step; für Anpassung: Copilot Connectors anlegen
3. **Deploy** — Rollout-Phase: pilot group → broad rollout
4. **Operate** — Admin überwacht Usage-Reports, passt Policies an

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| Builder (Journai) | Keine Pro-Code nötig, nur Prompt-Training-Design |
| Admin (Kunde) | M365 Admin Center, Sensitivity Labels, Connector-Config |
| End-User | Basis-Prompting, Zeit zur Erkundung |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Kein Custom-Code-Agent-Pattern** — wenn Logik komplexer als Prompt wird | [[Copilot Studio]] oder [[Microsoft Agent Framework]] |
| **Nicht für externe Kundenbasis** — nur für interne User mit M365-Lizenz | Custom Engine Agent + M365 Agents SDK für Bot-Kanal |
| **Keine feingranulare Output-Compliance-Policy** — Sensitivity-Labels funktionieren auf Doc-Ebene, nicht auf jede Chat-Antwort | *{TODO: Purview-Chat-Policies-Reife prüfen}* |

### Typische Fallstricke im Einsatz

- **„Copilot ersetzt ChatGPT"** — Kunden glauben, Copilot ist nur ein UI für GPT. Der Unterschied ist der Graph-Kontext. *Gegenmittel: In der Demo explizit Graph-Grounding zeigen.*
- **Rollout ohne Training** — Copilot ohne Prompt-Training wird als „ganz okay" erlebt, mit Training als „transformativ". *Gegenmittel: 0,5 Tag End-User-Training als Pflichtteil des Rollouts.*
- **Sensitivity-Labels nicht konfiguriert** — Copilot kann sensible Inhalte in Antworten mischen. *Gegenmittel: Purview-Labels aktiv vor Rollout konfigurieren.*

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| [[Microsoft Graph]] | Daten-Backbone | GA | keine — unter der Haube |
| [[Microsoft 365 Copilot Connectors]] | externe Datenquellen | GA | mittel — Konnektor-Config ist Arbeit |
| [[Microsoft Purview]] | Sensitivity Labels | GA | niedrig |
| [[Copilot Studio]] | Custom Agents als Copilot-Extensions | GA | mittel — Agent-Lifecycle vs. Copilot-Lifecycle |

### Third-Party

*{TODO: Salesforce-Copilot-Connector, ServiceNow-Graph-Connector, SAP-Connector-Reifegrad recherchieren.}*

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | Prompts/Outputs bleiben in Tenant-Region; für EU-Tenants in EU |
| **Prompts & Outputs** | Nicht für Training verwendet, Standard Online Services DPA |
| **DPA** | Standard MS Online Services DPA |
| **EU-AI-Act** | Limited Risk (User-Assistant) |

### Microsoft-Compliance-Stack

- [[Microsoft Purview]] Sensitivity Labels werden respektiert
- [[Defender for AI]] Runtime-Schutz für Copilot-Prompts
- [[Azure AI Content Safety]] für Prompt Shields

### Bekannte Compliance-Lücken

- **Claude-Integration in EU/EFTA/UK per Default deaktiviert** — muss aktiv im Admin Center freigeschaltet werden (DSGVO-Rückfrage-Haltung seitens MS)

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Product Page | M365 Copilot | https://www.microsoft.com/microsoft-365/copilot | 2026-04-21 | Feature-Updates, Marketing-Positionierung |
| Docs Hub | M365 Copilot Docs | https://learn.microsoft.com/en-us/microsoft-365-copilot/ | 2026-04-21 | technische Details |
| MS Roadmap | M365 Roadmap mit Copilot-Filter | https://www.microsoft.com/microsoft-365/roadmap?filters=Microsoft%20365%20Copilot | 2026-04-21 | geplante GAs |
| Tech Blog | Microsoft 365 Blog (Copilot Category) | https://techcommunity.microsoft.com/category/microsoft365 | 2026-04-21 | neue Features, Roadmap |
| M365 Admin Message Center | *{TODO: Message Center IDs für Copilot-Rollouts sammeln}* | | | für Kunden relevante Änderungen |

### Secondary

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| Directions on Microsoft | | | *{TODO}* |
| SAMexpert | https://samexpert.com/ | 2026-04-21 | Licensing-Details |

### Events

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Build 2026 | Mai 2026 | Wave 4 Features-Preview |
| Microsoft Ignite 2026 | Nov 2026 | Nächste Wave-Konsolidierung |

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-21 | Hongyu | Initial-Erstellung (Stub), watch: close, Status: GA Wave 3 | Arbeitsauftrag |
