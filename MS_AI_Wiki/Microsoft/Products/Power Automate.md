---
watch: standard
status: ga
last_verified: 2026-04-22
aliases: [Microsoft Flow, Agent Flows]
moc:
  - "[[Microsoft MOC]]"
  - "[[Integration & Compute MOC]]"
  - "[[Agents MOC]]"
---

# Power Automate

*Microsoft's **Citizen-Dev-Workflow-Engine** in der Power Platform. Für Agents relevant als **Integration-Glue in M365-nahem Stack** und, seit 2026, über **Agent Flows** als deklaratives Agent-Aktions-Framework in [[Copilot Studio]].*

> **Analogie:** Was Zapier für Citizen-Dev ist, ist Power Automate im MS-Ökosystem — mit Dataverse/Copilot-Studio-Synergie, die externe Tools nicht bieten.

---

## Einsatz

**JTBD:** When I Business-User befähigen will, Agent-Integrationen zu pflegen (nicht Pro-Dev), I want to eine einheitliche UI + Konnektoren-Bibliothek, die M365/Power Platform-nativ ist, so I can IT von Routineanfragen entlasten.

**Trigger-Signale:**
- „Unser Citizen Developer hat Power Automate-Erfahrung."
- „Copilot Studio-Agent braucht Aktion → Mail senden, Termin anlegen, Ticket eröffnen."

**Szenarien:** (1) Agent Flows in Copilot Studio als deklaratives Aktions-Framework, (2) Flow als Konnektor zu M365 (Mail, Teams, SharePoint), (3) RPA-Flows (UI-Automation auf Legacy-Windows-Apps).

**Empfehlung:** 🟢 für Citizen-Dev + M365-Integrationen. Für komplexe Enterprise-Integration [[Logic Apps]], für LLM-Logik [[Microsoft Agent Framework]].

---

## Status & Pricing

- **Status:** GA · Agent Flows GA mit Wave 3
- **Pricing:** Power Automate Premium / Standard / Per-Flow-Lizenzen + Per-User-Lizenzen; Teil vieler Power Platform Bundles
- **Region:** Environment-Region frei wählbar (EU verfügbar)

---

## Kernkonzept

Power Automate hat drei Produktlinien:
- **Cloud Flows** — serverless, Trigger-basiert (Zeitplan, Event, Button), Konnektoren für M365/SaaS
- **Desktop Flows (RPA)** — UI-Automation auf lokaler Windows-Umgebung
- **Agent Flows** (neu, Wave 3) — deklaratives Aktions-Framework für Declarative Agents in Copilot Studio

Agent Flows sind die wichtigste Neuerung für unseren Stack: sie binden sich nativ an Copilot Studio Declarative Agents an, sodass ein Business-User ohne Code sowohl den Agent-Prompt als auch die ausführenden Aktionen in einem Tool pflegen kann.

### Kern-Fähigkeiten

1. **Cloud Flows** mit 1000+ Konnektoren
2. **RPA Desktop Flows** (Legacy-System-Automation)
3. **Agent Flows** (2026-Q1) — deklarative Agent-Aktionen
4. **AI Builder** (Integration von Pre-Built-KI-Modellen in Flows)

---

## Limitierungen

- **Pricing-Komplexität** — Power Platform Lizenz-Modell berüchtigt unübersichtlich
- **Performance nicht deterministisch** — Flow kann 10s oder 10min brauchen
- **Fehler-Handling rudimentär** im Vergleich zu Pro-Code

### Fallstricke

- **Business-kritische Flows ohne Monitoring** — Flows failen still. *Gegenmittel: Alert-Flow auf Exception-Counter.*
- **Agent Flows mit Logic Apps verwechseln** — unterschiedliche Laufzeit, Logic Apps kann keine Declarative-Agent-Aktionen.

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Power Automate | https://learn.microsoft.com/en-us/power-automate/ | 2026-04-22 |
| Docs | Agent Flows | https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-flows | 2026-04-22 |
| Pricing | Power Platform Pricing | https://www.microsoft.com/power-platform/products/power-automate/pricing | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
