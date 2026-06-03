---
watch: open
status: stub_build_2026
last_verified: 2026-06-03
source: build-2026-keynote
aliases:
  - MS Scout
  - Personal Microsoft Agent
moc:
  - '[[Microsoft MOC]]'
  - '[[Copilot MOC]]'
zuletzt_gesichtet: 2026-06-03
updated: 2026-06-03
---

# Microsoft Scout

*"Always-on personal agent" — vorgestellt auf Build 2026. Eine immer-aktive AI-Schicht, die Teams, Outlook, OneDrive, SharePoint und Geräte-Aktionen autonom orchestrieren kann.*

> **Analogie:** Wenn M365 Copilot der Assistent ist, der antwortet wenn man fragt, ist Microsoft Scout der proaktive Mitarbeiter, der von sich aus Aufgaben anstösst — Meetings zusammenfasst, Folgemails entwirft, Termine vereinbart, ohne dass man ihn beauftragt.

---

## Was leistet es?

- **Proaktive Aktionen:** ohne explizite User-Anweisung — basierend auf Kontext (Meeting endet → Zusammenfassung erstellen)
- **Cross-Service-Orchestration:** ein Workflow spannt Outlook + Teams + OneDrive + SharePoint
- **Geräte-Aktionen:** kann auf Windows-Aktionen zugreifen (Datei öffnen, Notiz speichern)
- **Persönlicher Kontext:** lernt User-Gewohnheiten, passt sich an

## Status

- GA für Frontier-User (höchste M365 Copilot Stufe)
- Step-by-step Rollout für Business / Enterprise

## Wo passt es in die Architektur?

- **Layer:** SURFACE (zusammen mit M365 Copilot — Scout ist eine spezialisierte Erweiterung)
- **Verbindungen:**
  - `grounds-on` → Work IQ (für M365-Kontext), Microsoft Graph
  - `uses` → MAF (interne Logik), Microsoft IQ
  - `secured-by` → Entra Agent ID, Microsoft Execution Containers

## Beratungs-Relevanz für Journai

**Mittel — interessanter Demo-Hook, aber nicht für jeden Kunden.**

Use-Cases:
- Executive-Assistance: CEO-Office-Workflows (Meetings, Emails, Terminkoordination)
- Sales-Acceleration: automatische CRM-Updates nach Kunden-Meetings
- Knowledge-Worker-Automation: Mit-Erstellung von Berichten

Limit: setzt **Frontier-Tier-Lizenz** voraus — das ist teuer und nicht für jeden mittelständischen Schweizer Kunden geeignet. Beratungs-Empfehlung erst, wenn Lizenz-Voraussetzungen geklärt sind.

## Vertiefungsbedarf (0.5-Tag-Aufwand)

- [ ] Frontier-Tier Pricing
- [ ] Datenschutz: lernt es User-Gewohnheiten? Wie lange werden diese gespeichert?
- [ ] Schweiz-Verfügbarkeit (CH-North?)

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [news.microsoft.com/build-2026](https://news.microsoft.com/build-2026/)
