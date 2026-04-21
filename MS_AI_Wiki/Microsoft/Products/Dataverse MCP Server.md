---
watch: standard
status: ga
last_verified: 2026-04-22
aliases: []
moc:
  - "[[Microsoft MOC]]"
  - "[[Data & Knowledge MOC]]"
---

# Dataverse MCP Server

*Ein **MCP-Server-Wrapper** um [[Dataverse]], der Tabellen-Zugriff als MCP-Tools exposed. Macht Dataverse-Daten für jeden MCP-fähigen Agent ([[Microsoft Agent Framework]], [[Copilot Studio]], Windows-lokal) ohne eigenen Connector nutzbar.*

> **Analogie:** Was ein JDBC-Treiber für SQL-DBs ist, ist der Dataverse MCP Server für Dataverse — eine standardisierte Zugriffs-Schnittstelle, die das Protokoll überbrückt.

---

## Einsatz

**JTBD:** When I Agents (MAF, Copilot Studio) Dataverse-Zugriff geben will, I want to keinen custom Connector schreiben müssen, sondern einen fertigen MCP-Endpoint nutzen, so I can Dataverse als Tool in beliebigen MCP-fähigen Agents einbinden kann.

**Trigger-Signale:**
- „Unser MAF-Agent soll Leads in Dataverse lesen + updaten."
- „Copilot Studio soll aus Dataverse Knowledge ziehen."

**Szenarien:** (1) MAF-Agent mit Lead-Qualifier-Tool (Dataverse als Backend), (2) Copilot-Studio-Agent mit Dataverse-Knowledge-Source.

**Empfehlung:** 🟢 als Standard-Weg für Dataverse-Integration in Agents. Alternative direkter SDK-Aufruf nur wenn spezielle Operationen (Bulk-Import, Plugin-Trigger) nötig.

---

## Status & Pricing

- **Status:** GA
- **Pricing:** MCP-Server-Aufrufe zählen gegen Dataverse-API-Limits; kein separater MCP-Preis
- **Region:** an Dataverse-Environment-Region gebunden

---

## Kernkonzept

Der Dataverse MCP Server implementiert die MCP-Spec über die Dataverse-Web-API. Er exposed Primitiven wie:
- `list_tables` — verfügbare Tabellen im Environment
- `query_rows` — OData-Query gegen eine Tabelle
- `create_row` / `update_row` / `delete_row` — CRUD mit Plugin-Respekt
- `get_schema` — Tabellen-Schema auslesen

Auth läuft über Entra App Registration mit Dataverse-Scope.

### Kern-Fähigkeiten

1. **Generische Tabellen-Tools** (CRUD + Query)
2. **Schema-Discovery** für Agents zur Laufzeit
3. **Row-Level-Security wird respektiert** (Security Roles greifen)

---

## Limitierungen

- **Rate-Limits = Dataverse-Limits** (Service Protection API)
- **Keine Plugin-Hotpath-Optimierung** — komplexe Dataverse-Logik läuft auf Dataverse-Server

### Fallstricke

- **Zu viele Tools pro Agent registrieren** — Tool-Schema-Explosion im Prompt. *Gegenmittel: Per Usecase relevante Tables als Scope definieren.*

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Dataverse MCP Server | https://learn.microsoft.com/en-us/power-apps/developer/data-platform/mcp-server | 2026-04-22 |
| Docs | Dataverse Web API | https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/overview | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
