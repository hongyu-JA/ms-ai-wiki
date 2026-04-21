---
watch: standard
status: ga
last_verified: 2026-04-22
aliases: [Azure Logic Apps]
moc:
  - "[[Microsoft MOC]]"
  - "[[Integration & Compute MOC]]"
---

# Logic Apps

*Microsoft's **Pro-Dev-Integration-Plattform** auf Azure — Workflow-Orchestrierung mit 1000+ Enterprise-Konnektoren (SAP, Salesforce, Oracle, ServiceNow). Für Agents relevant als **Integration-Glue zu Legacy-/Enterprise-Systemen**.*

> **Analogie:** Was Zapier + n8n für Citizen-Dev ist, ist Logic Apps für Pro-Dev-Enterprise — tiefere Integration, Code-View-Editor, ARM-basierte Deployment-Story.

---

## Einsatz

**JTBD:** When I Enterprise-Systeme (SAP, Salesforce, Oracle) in Agent-Workflows einbinden will, I want to vorgefertigte Konnektoren + Workflow-Engine ohne eigene Integration-Code-Basis, so I can schnell auf Drittsysteme zugreifen kann.

**Trigger-Signale:**
- „Agent soll SAP-Kunden-Stammdaten lesen."
- „Wir brauchen eine robuste Schleife zwischen Agent-Output und Ticket-System."

**Szenarien:** (1) Agent ruft Logic App als MCP-/HTTP-Tool → LA orchestriert SAP-Call, (2) Event-basierter Workflow (Incoming Mail → LA → Agent → Response).

**Empfehlung:** 🟢 für Pro-Dev + Enterprise-Konnektor-Heavy. Für Citizen-Dev-Szenarien eher [[Power Automate]].

---

## Status & Pricing

- **Status:** GA (Consumption + Standard Tier)
- **Pricing:** Consumption: pay-per-action; Standard: App-Service-Plan-basiert
- **Region:** global, EU-Regionen verfügbar
- **Hidden Costs:** Premium-Konnektoren (SAP, Salesforce etc.) haben zusätzliche Kosten

---

## Kernkonzept

Logic Apps hat zwei Runtime-Modi:
- **Consumption** — serverless, pay-per-trigger-execution, einfachster Start
- **Standard** — App-Service-Plan-basiert, VNet-Integration, bessere Kontrolle + höhere Fix-Kosten

Workflow wird als **Logic App Definition** geschrieben (JSON-basiert, visueller Designer im Portal). Trigger + Actions, Control-Flow (Condition, Switch, ForEach, Scope), Error Handling (runAfter, try-catch via Scope).

### Kern-Fähigkeiten

1. **1000+ Konnektoren** (SAP, Salesforce, Oracle, ServiceNow, SharePoint, Box, …)
2. **Enterprise Integration Pack** (XSLT, EDI, AS2, X12) für B2B
3. **ARM-Deployment** + CI/CD-freundlich
4. **VNet-Integration** (Standard Tier)

---

## Limitierungen

- **Designer-first, Code-Experience nicht so stark wie Functions**
- **Konnektor-Lock-in** — Source-System-Schema-Änderungen brechen Workflow
- **Teuer bei hohem Volumen** (Consumption) bzw. hohen Fixkosten (Standard)

### Fallstricke

- **Alles in Logic Apps** — bei komplexer LLM-Logik lieber Agent im MAF schreiben, Logic Apps nur für Integration
- **Premium-Konnektor-Überraschungen** — vorher Pricing validieren

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Logic Apps Overview | https://learn.microsoft.com/en-us/azure/logic-apps/ | 2026-04-22 |
| Pricing | | https://azure.microsoft.com/en-us/pricing/details/logic-apps/ | 2026-04-22 |
| Connectors | Connector Reference | https://learn.microsoft.com/en-us/connectors/connector-reference/ | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
