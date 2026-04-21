---
watch: close
status: ga
last_verified: 2026-04-21
aliases: []
moc:
  - "[[Microsoft MOC]]"
  - "[[Integration & Compute MOC]]"
---

# Azure Functions

*Microsoft's Serverless-Compute-Service — event-getrieben, pay-per-invocation. **Für Agents relevant** durch drei Features: **Flex Consumption** (schnellerer Cold-Start, VNet-Support), **MCP Binding** (Function wird zu MCP-Tool-Provider für Agents), **Durable Task** (langlaufende stateful Workflows).*

> **Analogie:** AWS Lambda mit tieferer Azure-Integration. Ab MCP Binding zudem: „Function = Tool, das ein Agent aus der Ferne aufrufen kann."

---

## Einsatz

**JTBD:** When I einem Agent erlaube, benutzerdefinierte Aktionen im Tenant auszuführen, I want to diese Aktionen als Functions hosten, die der Agent via MCP aufruft, so I can schnell Tools hinzufügen, ohne eigene HTTP-Service-Infrastruktur zu bauen.

**Trigger-Signale:**
- „Unser Agent soll Tickets in ServiceNow anlegen, aber kein Logic App-Flow reicht."
- „Wir brauchen langlaufende Orchestrierung — 30-Minuten-Job, zustandsbehaftet."

**Szenarien:** (1) MCP-Tool-Provider für MAF/Copilot Studio Agents, (2) Durable Task für Multi-Step-Workflows, (3) Event-Response (Queue, Blob, Graph-Change-Notification).

**Empfehlung:** 🟢 für event-getriebene + MCP-Tool-Szenarien. Für dauerhaft-laufende Agent-Hosts lieber [[Azure Container Apps]].

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Status** | GA · Flex Consumption GA 2024 · MCP Binding GA 2026 *{TODO: exaktes GA-Datum verifizieren}* |
| **Pricing** | Consumption (pay-per-exec, free tier), Premium (reserved), Flex (new tier) |
| **Region** | Global, alle EU-Regionen |
| **Hidden Costs** | Durable Task nutzt Azure Storage → Storage-Costs; Flex-VNet-Integration kostet extra |

---

## Kernkonzept

### Drei für Agents relevante Runtime-Pfade

1. **Consumption / Flex Consumption** — klassische serverless Functions. Flex bietet VNet + besseren Cold-Start.
2. **Durable Task** — stateful Workflows: Orchestrator-Pattern mit Sub-Functions (Activities), Fan-Out/Fan-In, Human-In-The-Loop. Ideal für Long-Running-Agent-Orchestrierung ohne externe Workflow-Engine.
3. **MCP Binding** (neu) — eine Function wird über MCP-Protokoll verfügbar, der MAF-Agent (oder Copilot Studio) kann sie als Tool registrieren und aufrufen. Ermöglicht „Custom Tool in 20 Zeilen Code".

### Typischer Workflow

1. Function App erstellen, Runtime wählen (.NET, Node, Python)
2. Function-Template wählen (HTTP Trigger / MCP Binding / Durable Orchestrator)
3. Deploy via `func deploy` oder GitHub Actions
4. Agent (MAF/Copilot Studio) konfigurieren, Function-MCP-URL registrieren

---

## Limitierungen & Fallstricke

- **10-Min-Timeout (Consumption)** — für langlaufende Tasks Durable Task oder Container Apps
- **Cold Start** — selbst in Flex nicht null. Für latenz-kritische Pfade Premium reservieren
- **MCP Binding Reife** — neu, möglicherweise Edge-Cases in Streaming *{TODO}*

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Azure Functions | https://learn.microsoft.com/en-us/azure/azure-functions/ | 2026-04-21 |
| Flex Consumption | | https://learn.microsoft.com/en-us/azure/azure-functions/flex-consumption-plan | 2026-04-21 |
| MCP Binding | | https://learn.microsoft.com/en-us/azure/azure-functions/functions-mcp-trigger *{TODO: verifizieren}* | 2026-04-21 |
| Durable Functions | | https://learn.microsoft.com/en-us/azure/azure-functions/durable/ | 2026-04-21 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-21 | Hongyu | Initial Stub |
