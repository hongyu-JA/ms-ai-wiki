---
watch: standard
status: ga
last_verified: 2026-04-22
aliases: [Graph Connectors, Copilot Connectors]
moc:
  - "[[Microsoft MOC]]"
  - "[[Copilot MOC]]"
---

# Microsoft 365 Copilot Connectors

*Das **Graph-Connector-Ökosystem** — erweitert den [[Microsoft Graph]]-Index auf externe Datenquellen (Salesforce, ServiceNow, Box, Jira, Confluence). Antwort auf die Kunden-Frage „Wie grounden wir Copilot auf unsere Datenquellen?"*

> **Analogie:** Was ETL-Connectors für Data Warehouses waren, sind Copilot Connectors für den Graph-Index — eine Brücke zwischen Dritt-Systemen und M365-Kontext.

---

## Einsatz

**JTBD:** When I will, dass [[Microsoft 365 Copilot]] auf unsere Daten in Drittsystemen (CRM, ITSM, Dokumentenmanagement) grounden kann, I want to diese Quellen in den Tenant-Graph-Index einspeisen, so I can Copilot ohne Prompt-Engineering auf diese Daten referenzieren lassen.

**Trigger-Signale:**
- „Copilot weiß nichts von unserem Salesforce — machbar?"
- „Unsere Confluence-Wiki sollte durchsuchbar sein."

**Szenarien:** (1) SharePoint-externe Content-Quellen indexieren, (2) CRM-Connector (Salesforce/Dynamics), (3) Ticketing (ServiceNow/Jira).

**Empfehlung:** 🟢 wenn Kunde nicht-M365-Content in Copilot grounden will. Alternative für externe APIs: direkt als MAF-Tool statt Connector.

---

## Status & Pricing

- **Status:** GA · Connector-Gallery wächst kontinuierlich
- **Pricing:** Copilot-Lizenz ist Voraussetzung; Connector-Laufzeit idR in Copilot-Plan inkludiert *{TODO: Storage-Limits klären}*
- **Region:** an Tenant-Region gebunden

---

## Kernkonzept

Graph Connectors arbeiten über das **Connector-Framework**: Eine Agent-App (Graph Connector App Registration) schickt Items (Dokumente/Datenobjekte) an den Graph-Index-Endpoint, typischerweise schedulbar (Cron oder Change-getrieben). Copilot zieht bei Grounding dann aus dem erweiterten Index.

Zwei Realisierungs-Modi:
1. **Fertige Connectors (Gallery)** — pre-built für Salesforce, ServiceNow, Jira, Confluence, Box, u. a.
2. **Custom Connectors** — eigene App gegen Connector-API, z. B. für proprietäre Systeme

### Kern-Fähigkeiten

1. **Index-Ingestion** (Items + Metadata in Graph-Index einspeisen)
2. **ACL-Propagation** — Permissions aus Source-System respektieren
3. **Change Detection** (Delta-Updates vs. Full Crawl)
4. **Schema-Mapping** (Source → Graph Item Schema)

---

## Limitierungen

- **Graph-Index-Limits** — maximale Item-Anzahl pro Tenant *{TODO: aktuelle Zahlen}*
- **ACL-Mapping kompliziert** — falsche Umsetzung → Copilot zeigt Daten, die der User eigentlich nicht sehen darf

### Fallstricke

- **„Connector einmal einrichten, Rest läuft"** — Schema-Änderungen im Source-System brechen Connectors regelmäßig. *Gegenmittel: Monitoring-Alert aufsetzen.*
- **Für kleine Datenmengen Overkill** — für < 1000 Dokumente lieber direkt als MAF-Tool anbinden.

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Copilot Connectors Overview | https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/connectors | 2026-04-22 |
| Connector Gallery | | https://www.microsoft.com/en-us/microsoft-365-copilot/connectors | 2026-04-22 |
| Custom Connectors Docs | Graph Connectors | https://learn.microsoft.com/en-us/graph/connecting-external-content-connectors-overview | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
