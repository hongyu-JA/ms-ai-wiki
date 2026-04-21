---
watch: standard
status: ga
last_verified: 2026-04-22
aliases: [Common Data Service, CDS]
moc:
  - "[[Microsoft MOC]]"
  - "[[Data & Knowledge MOC]]"
---

# Dataverse

*Der **strukturierte Daten-Store** von Microsoft Power Platform — Tabellen, Relationships, Business Logic, Row-Level-Security. Für Agents relevant als **Knowledge-/State-Backend** und als Integration-Layer zu Dynamics 365 / Power Apps. Limits: **15 Tables/Source, 500 Knowledge Objects**.*

> **Analogie:** Airtable oder ServiceNow-CMDB im MS-Ökosystem — eine verwaltete relationale DB, die gleichzeitig BLogik und UI-Konventionen durchsetzt.

---

## Einsatz

**JTBD:** When I strukturierte Geschäftsdaten (Leads, Tickets, Verträge) haben möchte, die sowohl Agents konsumieren als auch Power Apps / Dynamics anzeigen, I want to sie in Dataverse halten, so I can **eine** Datenquelle nutze und nicht Sync-Probleme zwischen Systemen habe.

**Trigger-Signale:**
- „Unsere Power Platform-Apps schreiben in Dataverse — Agent sollte auch drauf schreiben können."
- „Wir haben Dynamics 365, wo leben die Agent-Daten am besten?"

**Szenarien:** (1) Agent-State + Thread-Persistenz in Dataverse, (2) Agent liest strukturierte Kundendaten, (3) Knowledge-Store für Declarative Agents in [[Copilot Studio]].

**Empfehlung:** 🟢 wenn Power Platform / Dynamics im Stack. Andernfalls [[Azure Cosmos DB for AI]] flexibler + günstiger.

---

## Status & Pricing

- **Status:** GA
- **Pricing:** Pro User/Monat (Power Apps-Lizenz inkludiert Limit) + Zusatzkapazität pro GB
- **Region:** Dataverse-Environment-Region frei wählbar (EU-Regionen verfügbar)
- **Hard Limits:** 15 Tables pro Knowledge Source, 500 Knowledge Objects *(Arbeitsauftrag)*

---

## Kernkonzept

Dataverse = **relational + governed**. Du definierst Tabellen (Columns + Relationships), Dataverse erzwingt Schema, applies Row-Level-Security (Business Units + Security Roles), triggert Plugins (C#-Server-Code bei CRUD), verbindet sich natively mit Power Apps und Dynamics.

Für Agents zwei Primär-Nutzungsmuster:
1. **Knowledge Source für [[Copilot Studio]] / Agent Builder** — Tabellen werden als durchsuchbare Knowledge indexiert
2. **State-Store für MAF-Agents** — via [[Dataverse MCP Server]] oder direkt via SDK

### Kern-Fähigkeiten

1. **Tabellen + Business Rules** (Formel-Validierung, Plugins)
2. **Row-Level-Security** (Business Units, Security Roles)
3. **Change Tracking** (Delta-Query + Webhooks)
4. **Virtual Tables** (externe Systeme als Dataverse-Tabelle anbinden)

---

## Limitierungen

- **15 Tables / 500 Knowledge Objects Limit** als Knowledge Source — restriktiv für große Korpora
- **Pricing-Komplexität** — Power Platform Lizenz-Matrix nicht trivial
- **Plugins = C#-only** — Python/JS via Azure Functions via Webhooks

### Fallstricke

- **Dataverse als General-Purpose-DB sehen** — es ist opinionated + Power-Platform-native. *Gegenmittel: Für reine App-Daten ohne Power-Platform-Synergie Cosmos DB / SQL.*
- **15-Tables-Limit erst beim Kunden entdecken** — vorher abklopfen.

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Dataverse Overview | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-intro | 2026-04-22 |
| Pricing | Power Platform Pricing | https://www.microsoft.com/power-platform/products/power-apps/pricing | 2026-04-22 |
| Limits | Dataverse Service Protection Limits | https://learn.microsoft.com/en-us/power-apps/developer/data-platform/api-limits | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
