---
type: moc
tags:
  - moc
  - microsoft
  - agents
last_verified: 2026-04-29
---

# Agents MOC

*Primary-Home-MOC für alle Produkte, deren Kern es ist, **Agenten zu bauen, zu hosten oder zu orchestrieren**. Von Low-Code (Copilot Studio) über Pro-Code-Frameworks (MAF) bis Governance (Agent 365). Hier liegt die wichtigste Beratungsfrage: „Wann reicht No-Code, wann brauchen wir Code, wann brauchen wir Governance?"*

---

## Zweck

Diese MOC ist der richtige Einstieg, wenn:

- Ein Kunde sagt „Wir wollen einen Agenten bauen" — ohne Klarheit, welcher Werkzeugkasten passt.
- Ein bestehender Bot migriert werden muss (Bot Framework → Agents SDK).
- Mehrere Agents in einer Organisation entstehen und Governance akut wird (Agent 365).
- Die SDK-Frage auftaucht: „Welche SDKs brauche ich für einen Agent in Teams?" — dafür dient zusätzlich die Lens-MOC [[Agent-Building-Pattern MOC]].

---

## Landkarte

Das semantische Modell: **drei Schichten × Reifegrad**.

```
┌─────────────────────────────────────────────────────────────────────┐
│ GOVERNANCE         [[Agent 365]] + [[Entra Agent ID]]              │
│                    (Identity, RBAC, Audit, Conditional Access)      │
├─────────────────────────────────────────────────────────────────────┤
│ HOSTING / RUNTIME  [[Foundry Agent Service]]   [[M365 Agents SDK]] │
│                    (managed Cloud)             (Teams/Copilot)      │
│                    [[Azure Functions]]         [[Azure Container    │
│                    [[Teams SDK]]                 Apps]]             │
├─────────────────────────────────────────────────────────────────────┤
│ AGENT LOGIC        ┌──────────────────┐  ┌──────────────────┐      │
│                    │ [[Microsoft Agent│  │ [[Copilot Studio]]│      │
│                    │  Framework]] (MAF│  │  (Low-Code)       │      │
│                    │  — Pro-Code)     │  │                   │      │
│                    └──────────────────┘  └──────────────────┘      │
├─────────────────────────────────────────────────────────────────────┤
│ CROSS-CUTTING      [[Model Context Protocol]] (Tool-Standard)       │
│                    [[Power Automate]] / Agent Flows (Integration)   │
│                    [[Dataverse MCP Server]] (Knowledge)             │
├─────────────────────────────────────────────────────────────────────┤
│ DEPRECATED         [[deprecated/Bot Framework]] (EOS 2025-12-31)    │
│                    [[deprecated/Semantic Kernel]] (→ MAF)           │
│                    [[deprecated/AutoGen]] (→ MAF)                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Produkte in dieser MOC


<!-- AUTO-INDEX-START: produkte -->

| Produkt | Was es ist (1 Satz) | Tier | Watch |
| ------- | ------------------- | ---- | ----- |
| 🟢 [[Agent 365]] | Governance-Control-Plane für Agents (Identity via Entra Agent ID, RBAC, Audit) — GA 2026-05-01 | T1 | close |
| 🟢 [[Copilot Studio]] | Low-Code-Agent-Builder im M365-Ökosystem, inkl. Declarative Agents, Agent Builder, Cowork | T1 | close |
| 🟢 [[Microsoft Agent Framework]] | Pro-Code-Framework (.NET/Python) für Agent-Logik, Multi-Agent, Tool-Use — GA 2026-04-07, Python SDK 1.1.0 | T1 | close |
| 🟢 [[Model Context Protocol]] | Cross-cutting Tool-Standard, GA in Copilot Studio / Foundry / Functions / Windows | T1 | close |
| 🟢 [[M365 Agents SDK]] | Hosting-/Runtime-Layer, ersetzt Bot Framework; Activity-Protocol bleibt | T2 | standard |
| 🟢 [[Teams SDK]] | Teams-spezifische UI/UX-Schicht (Adaptive Cards, Teams-Events); ergänzt M365 Agents SDK | T2 | standard |
| 🟢 [[deprecated/AutoGen]] | 🟡 Konsolidiert in MAF — Research-Features teilweise experimental | T2 · 🔻 | passive |
| 🟢 [[deprecated/Bot Framework]] | 🔴 EOS 2025-12-31 — Migration zu M365 Agents SDK | T2 · 🔻 | passive |
| 🟢 [[deprecated/Semantic Kernel]] | 🟡 Konsolidiert in MAF — Migration-Pfad | T2 · 🔻 | passive |

<!-- AUTO-INDEX-END: produkte -->

<!-- auto-sync: update_row · {"product":"Microsoft Agent Framework","columns":{"Version":"Python 1.2.0","Stand":"2026-04-24"}} -->


## Letzte Aktivität

_Jüngste Changelog-Einträge (30 Tage) der Produkte dieser MOC. Auto-generiert — konsistent mit [[Microsoft MOC#Letzte Aktivität]]._

<!-- AUTO-INDEX-START: activity -->

| Datum | Produkt | Änderung | Autor |
| ----- | ------- | -------- | ----- |
| 2026-04-24 | [[Microsoft Agent Framework]] | Python SDK 1.2.0: Funktionale Workflow-API (agent-framework-core), OpenTelemetry-Integration für GitHubCopilotAgent, Agent-Framework-to-A… | auto-sync |
| 2026-04-22 | [[Agent 365]] | Kompletter Ausbau: GA-Scope-Diagramm (was GA, was bleibt Preview), Identity-Modell (4 neue Entra-Objekttypen), Sponsor-Konzept als DSGVO-… | Hongyu / Deep-Research |
| 2026-04-22 | [[Agent 365]] | Initial Stub | Hongyu |
| 2026-04-22 | [[deprecated/AutoGen]] | Deep-Dive AutoGen-Deprecation + Migration zu MAF: v0.2 vs v0.4 Unterscheidung, API-Äquivalenzen, Code-Beispiele (RoundRobin→Sequential, C… | Hongyu / Deep-Research |
| 2026-04-22 | [[deprecated/AutoGen]] | Initial Stub — Migration-Pfad zu MAF | Hongyu |
| 2026-04-22 | [[Copilot Studio]] | 4-Ebenen-Eskalationsleiter-Diagramm, Cowork Deep-Dive mit EU-Data-Boundary-Warnung (Anthropic default-OFF), vollständige Pricing-Matrix m… | Hongyu / Deep-Research |
| 2026-04-22 | [[M365 Agents SDK]] | Kompletter Deep-Dive nach MAF-Template, Bot-Framework-Migration-Path, Code-Beispiele, Hosting-Varianten | Hongyu / Deep-Research |
| 2026-04-22 | [[M365 Agents SDK]] | Initial Stub (watch: standard → upgrade auf close nach Deep-Research) | Hongyu |
| 2026-04-22 | [[Microsoft Agent Framework]] | Migration auf neues Product Note Template (v2) — Struktur umgezogen, Inhalt erhalten und erweitert (Einsatz-Szenarien, Stack-Tabelle, Dec… | Hongyu |
| 2026-04-22 | [[Model Context Protocol]] | Spec-Status 2025-11-25, 12+ MS-Integrations-Matrix, Three-Hop-Auth-Diagramm, Enterprise-Patterns (APIM-Proxy, Zero Trust, OTel), Ecosyste… | Hongyu / Deep-Research |
| 2026-04-22 | [[Model Context Protocol]] | Initial Stub | Hongyu |
| 2026-04-22 | [[deprecated/Semantic Kernel]] | Deep-Dive SK-Deprecation + Migration-Pfad zu MAF: API-Äquivalenzen, Code-Beispiele (.NET + Python), Support-Timeline (≥ 1 Jahr nach MAF-G… | Hongyu / Deep-Research |
| 2026-04-22 | [[deprecated/Semantic Kernel]] | Initial Stub — Migration-Pfad zu MAF | Hongyu |
| 2026-04-22 | [[Teams SDK]] | Deep-Dive inkl. SDK-Sandwich-Positionierung, Teams-Primitiven, Adaptive Cards, Meeting-Hooks, Manifest-Workflow | Hongyu / Deep-Research |
| 2026-04-22 | [[Teams SDK]] | Initial Stub | Hongyu |

<!-- AUTO-INDEX-END: activity -->

---

## Eskalationsleiter / Entscheidungslogik

**Hauptfrage in Kundengesprächen:** „Wir wollen einen Agent — womit bauen wir?"

| Kundensituation | Produkt der Wahl | Begründung |
|-----------------|------------------|------------|
| „Kein Code verfügbar, Business-User baut" | **[[Copilot Studio]]** — Agent Builder → Declarative Agent | Low-Code, M365-native, MSExtension-Autor-Erfahrung |
| „Agent soll Long-Running-Multi-Step-Aufgaben durchziehen" | **[[Copilot Studio]] + Copilot Cowork** (Wave 3) | Spezieller Layer für lang laufende Agent-Sessions |
| „Citizen-Dev + Flow-Integration gemischt" | **[[Power Automate]] / Agent Flows** | Integration-Glue, ideal mit Copilot Studio kombiniert |
| „Pro-Code, einfacher Single-Agent, Azure-nah" | **[[Microsoft Agent Framework]]** | Konsolidiertes Framework, OSS, Enterprise-Features |
| „Pro-Code, Multi-Agent-Team mit klarer Verantwortungstrennung" | **[[Microsoft Agent Framework]]** (Orchestrator: Sequential/Handoff/GroupChat) | First-Class Multi-Agent-Pattern, ohne DIY |
| „Agent muss in Teams deployed werden" | **[[Microsoft Agent Framework]]** + **[[M365 Agents SDK]]** + **[[Teams SDK]]** | Dreiteilung: Logik / Hosting / UI |
| „Wir brauchen managed hosting, kein Ops" | **[[Microsoft Agent Framework]]** + **[[Foundry Agent Service]]** | Aber: aktuell Region-Lock NC-US → DSGVO prüfen |
| „Governance-compliant für regulierte Branche" | **[[Agent 365]] + [[Entra Agent ID]]** als Overlay über alle obigen | Pflicht ab ~2026 für größere Kunden |
| „Agent-Code-Execution mit Sandbox nötig" | **[[Microsoft Agent Framework]]** mit Hyperlight CodeAct (Python 1.1.0+) | Isolierte Micro-VM-Ausführung für untrusted Tool-Output |
| „Bestehender Bot Framework-Bot" | 🔴 Migration zu **[[M365 Agents SDK]]** (+ ggf. MAF für Logik) | EOS bereits erreicht, keine Neu-Entwicklung |

### „Welche SDKs brauche ich?" — siehe [[Agent-Building-Pattern MOC]]

Die detaillierte SDK-Matrix lebt in der Lens-MOC [[Agent-Building-Pattern MOC]], nicht hier. Faustregel: **Logik (MAF) → Hosting (M365 Agents SDK) → UI (Teams SDK)**, Governance (Agent 365) optional drüber.

---

## Querverweise zu anderen MOCs

- [[Microsoft MOC]] — Root-Landkarte
- [[Copilot MOC]] — Copilot-Produkte (teilweise Überlappung: Copilot Studio ist auch Agent-Builder)
- [[Azure AI MOC]] — Foundry Agent Service + Modell-Backbone unter MAF
- [[Security & Identity MOC]] — Agent 365 hat ein zweites Zuhause dort (Governance-Charakter)
- [[Integration & Compute MOC]] — Azure Functions / Container Apps als Hosting-Targets für MAF-Agents
- [[Agent-Building-Pattern MOC]] (Lens) — SDK-Auswahl-Frage
- [[Data & Knowledge MOC]] — Dataverse + Graph als Knowledge-Backend für Agents
- [[Deprecation Radar]] — aktuelle Migrations-Pflichten

---

## Offizielle Sammelquellen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| MS Hub-Page | Microsoft Agents Overview | https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/overview | 2026-04-22 |
| MS Blog-Serie | devblogs — Agent Framework | https://devblogs.microsoft.com/agent-framework/ | 2026-04-22 |
| MS Roadmap | M365 Roadmap (Agents-relevante Einträge) | https://www.microsoft.com/microsoft-365/roadmap | 2026-04-22 |
| Analyst-Übersicht | *{TODO: Gartner Magic Quadrant Agent Platforms 2026}* | | |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Migration auf neues MOC Template (v2) mit Landkarte + Eskalationsleiter; Hyperlight-CodeAct-Zeile in Eskalation ergänzt nach MAF 1.1.0 |
| 2026-04-21 | Hongyu | Initial-Erstellung der MOC |
