---
watch: close
status: ga
last_verified: 2026-04-22
aliases: []
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Foundry Control Plane

*Die **Steuerungs- und Observability-Schicht** über [[Microsoft Foundry]]. Bündelt: Deployment-Management, RBAC (via Entra), Private Networking, Content Safety Policies, **Tracing + Evaluation + Observability + Responsible AI**.*

> **Analogie:** Wie Kubernetes Control Plane für Container — die Komponente, die „die Regeln durchsetzt" und „überwacht, was läuft".

## Einsatz

**JTBD:** When I produktive AI-Workloads betreibe, I want to an einer Stelle sehen, wer was deployed hat, welche Policies greifen, wie die Agents performen, welche Fehler passieren, so I can Compliance + Ops-Fragen ohne 5 verschiedene Dashboards beantworte.

**Kritische Fragen (Arbeitsauftrag §2.6):** Welche Policies sind Pflicht? Wie Tracing mit App Insights kombinieren? Welche Evaluators out-of-the-box? Wie im VNet/Private Endpoint?

**Empfehlung:** 🟢 als Standard-Governance-Ebene für jeden Foundry-Einsatz.

## Status & Pricing

- **Status:** GA
- **Pricing:** *{TODO: Tracing-Log-Ingestion via App Insights separat}*

## Kernkonzept

Control Plane bündelt fünf Aspekt-Bereiche in einer UI + API:

1. **Deployment & RBAC** — welche Entra-Principals dürfen Modelle deployen, Agents editieren
2. **Networking** — Private Endpoints, VNet-Integration
3. **Content Safety Policies** — Prompt Shields, Content-Filter-Levels (hate/sexual/violence thresholds)
4. **Tracing + Evaluation** — OTel-Traces aller Agent-Runs, Eval-Runs mit Judge-Models
5. **Responsible AI** — Audit-Logs, Model-Cards, Transparency-Notes

### Tracing vs. [[Application Insights for AI]] — Kombi statt Alternative

**Foundry Tracing** = Agent-/Flow-zentrisch (welche Tools wurden mit welchem Input aufgerufen). **App Insights** = Infrastruktur-zentrisch (HTTP-Latenz, Ressourcen-Auslastung). Beide Telemetrie-Pfade sind komplementär, nicht redundant.

## Limitierungen

- **VNet-Setup komplex** — Private Endpoints für jede beteiligte Ressource
- **Eval-Kosten** — Judge-Model-Calls summieren sich bei großen Test-Suites

## Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Foundry Control Plane Overview | https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/foundry-control-plane | 2026-04-22 |
| Docs | Tracing | https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/develop/trace | 2026-04-22 |
| Docs | Evaluation | https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/develop/evaluate | 2026-04-22 |

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
