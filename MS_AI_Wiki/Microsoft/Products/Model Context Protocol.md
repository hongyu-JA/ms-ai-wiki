---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [MCP]
moc:
  - "[[Microsoft MOC]]"
  - "[[Agents MOC]]"
---

# Model Context Protocol (MCP)

*Offener Standard für **Tool-Integration in LLM-Agents** — entwickelt von Anthropic, von Microsoft breit adoptiert. GA in Copilot Studio, Foundry, Azure Functions (MCP Binding), Windows. Der **Querschnitts-Standard**, den jeder im Team verstehen muss.*

> **Analogie:** Was LSP (Language Server Protocol) für Code-Editoren wurde, wird MCP für LLM-Agents — ein kanonisches Schnittstellen-Format, das die M×N-Integration zu M+N reduziert.

---

## Einsatz

**JTBD:** When I Tools für einen Agent bereitstelle (oder umgekehrt Tools verbrauche), I want to ein Standard-Protokoll nutzen, das Microsoft, Anthropic und viele andere Plattformen unterstützen, so I can nicht für jede Agent-Plattform einen eigenen Adapter bauen muss.

**Trigger-Signale:**
- „Copilot Studio MCP Tool soll auch in MAF-Agent funktionieren."
- „Wir wollen Dataverse-Zugriff von Agent X geben, ohne eigenen Connector zu bauen."

**Szenarien:** (1) Dataverse MCP Server von MAF-Agent konsumieren, (2) Azure Functions MCP Binding als Tool-Provider schreiben, (3) Lokaler MCP-Server auf Windows AI Foundry.

**Empfehlung:** 🟢 als Standard-Tool-Integration-Pfad für alle neuen Agent-Projekte.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Status** | Spec GA · MS-Integrationen: Copilot Studio GA · Azure Functions MCP Binding GA · Windows MCP (Local) GA · Foundry GA |
| **Pricing** | Protokoll kostenlos; MCP-Server selbst kosten je nach Hosting |

---

## Kernkonzept

MCP definiert ein **JSON-RPC-basiertes Protokoll** mit drei Primitive-Klassen: **Tools** (Actions, die der Agent aufrufen kann), **Resources** (Daten, die der Agent lesen kann), **Prompts** (vorgefertigte Prompt-Templates, die der Agent komponieren kann). Ein MCP-Server exposed eine oder mehrere dieser Primitiven; ein MCP-Client (Agent) konsumiert sie.

Microsoft hat MCP als **Tool-Standard quer über das Portfolio** etabliert: [[Copilot Studio]] kann MCP-Server als Tool-Quelle registrieren, [[Microsoft Agent Framework]] hat MCP-Adapter, [[Azure Functions]] MCP Binding macht Functions zu MCP-Servern, [[Foundry Local]] exposed lokale Modelle via MCP.

### Kern-Fähigkeiten

1. **Tool-Aufruf** — Modell fordert an, Server führt aus, Ergebnis zurück
2. **Resource-Read** — Agent kann Dokumente, Tabellen als Kontext ziehen
3. **Streaming** — Tools können schrittweise Output liefern *{TODO: Reife in MS-Implementierungen prüfen}*
4. **Authentication** — OAuth-basierter Auth-Flow für sichere Tool-Nutzung

---

## Limitierungen & Fallstricke

- **Auth-Story komplex** — OAuth-Flow zwischen Agent-Host + MCP-Server + Downstream-Resource nicht trivial
- **Versioning-Chaos** — Spec entwickelt sich, Clients/Server müssen sich einig sein. *Gegenmittel: SDK-Versionen pinnen.*
- **Fallstrick:** MCP als Heilsbringer sehen — es löst das Integrations-Problem, nicht das Agent-Design-Problem

---

## Offizielle Referenzen & Monitoring

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Spec | Model Context Protocol | https://modelcontextprotocol.io | 2026-04-22 |
| MS-Integration | Copilot Studio MCP | https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp | 2026-04-22 |
| MS-Integration | MAF MCP Adapter | https://learn.microsoft.com/en-us/agent-framework/tools/mcp | 2026-04-22 |
| MS-Integration | Azure Functions MCP Binding | https://learn.microsoft.com/en-us/azure/azure-functions/functions-mcp-trigger | 2026-04-22 |
| GitHub | MCP Reference Servers | https://github.com/modelcontextprotocol/servers | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
