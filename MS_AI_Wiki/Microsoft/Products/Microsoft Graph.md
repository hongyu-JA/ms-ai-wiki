---
watch: standard
status: ga
last_verified: 2026-04-22
aliases: [Graph API, MS Graph]
moc:
  - "[[Microsoft MOC]]"
  - "[[Data & Knowledge MOC]]"
---

# Microsoft Graph

*Der **Daten-API-Backbone** für M365 — Outlook, Teams, SharePoint, OneDrive, Calendar, People. Fast jeder Agent mit M365-Zugriff braucht Graph. Einheitliche REST-/SDK-API über alle M365-Produkte hinweg.*

> **Analogie:** Was die Stripe-API für Payments ist, ist Microsoft Graph für M365 — die eine API, die alle Teilprodukte einheitlich erreichbar macht.

---

## Einsatz

**JTBD:** When I einem Agent Zugriff auf M365-Daten geben will, I want to nicht einzelne Outlook-/SharePoint-/Teams-APIs orchestrieren, sondern eine einheitliche Graph-API nutzen, so I can mit weniger Boilerplate auf User-/Tenant-Kontext zugreifen.

**Trigger-Signale:**
- „Agent soll meine letzten Mails zusammenfassen."
- „Agent soll SharePoint-Dokumente lesen / schreiben."
- „Agent braucht Kalender-Zugriff, um Meetings zu planen."

**Szenarien:** (1) Agent als Graph-Consumer (Delegated Auth), (2) Backend-Service mit App-Only-Token, (3) Als Grounding-Quelle für [[Microsoft 365 Copilot]] via Copilot Connectors.

**Empfehlung:** 🟢 Standard-Weg für M365-Daten. Kein sinnvoller Ersatz im MS-Ökosystem.

---

## Status & Pricing

- **Status:** GA (v1.0 + Beta)
- **Pricing:** Kostenlos (Rate-Limits pro Tenant)
- **Region:** global
- **Hidden Costs:** Rate-Limits sind lausige DevEx — bei hohem Volumen Throttling-Handling nötig

---

## Kernkonzept

Graph ist eine REST-API (`graph.microsoft.com/v1.0/...`) mit SDK-Wrappers in .NET, Python, JS, Java. Zwei Auth-Modi entscheiden die Sicherheits-Architektur:

- **Delegated** — Agent handelt im Namen des Users (User-Token). Datenzugriff auf User-Scope.
- **App-Only** — Agent handelt mit eigenem App-Principal (App-Token). Datenzugriff tenant-weit.

Scopes werden granular vergeben (`Mail.Read`, `Files.ReadWrite.All`, `Calendars.Read` etc.) — Least-Privilege ist Pflicht.

### Kern-Fähigkeiten

1. **Unified REST API** über M365 (Outlook, SharePoint, Teams, OneDrive, Calendar, People, Planner, OneNote)
2. **Graph Connectors** — externe Datenquellen in den Graph indexieren (Basis für Copilot Connectors)
3. **Change Notifications** (Webhooks) — Event-getrieben auf Daten-Änderungen reagieren
4. **Graph Explorer** — interaktives Test-Tool im Browser

---

## Limitierungen

- **Rate-Limits opak** — Throttling passiert ohne klare Vorankündigung
- **Beta vs. v1.0** — Features wandern, Versionierung nicht trivial
- **Delegated vs. App-Only Entscheidung teuer** — falsche Wahl = Scope-Refactor

### Fallstricke

- **Alle Scopes anfordern „zur Sicherheit"** — Customer-Admin wird es ablehnen. *Gegenmittel: minimaler Scope-Set vor Development definieren.*
- **Graph-Events mit Activity Protocol verwechseln** — Graph-Events sind User-/Tenant-Daten-Änderungen, Activity Protocol ist Agent-/Bot-Conversation. Komplett unabhängig.

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Microsoft Graph Overview | https://learn.microsoft.com/en-us/graph/overview | 2026-04-22 |
| Graph Explorer | | https://developer.microsoft.com/en-us/graph/graph-explorer | 2026-04-22 |
| SDKs | Graph SDK Landing | https://learn.microsoft.com/en-us/graph/sdks/sdks-overview | 2026-04-22 |
| What's New | | https://learn.microsoft.com/en-us/graph/whats-new-overview | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
