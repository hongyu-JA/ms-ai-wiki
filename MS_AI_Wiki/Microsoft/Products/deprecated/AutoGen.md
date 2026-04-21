---
watch: passive
status: deprecated
last_verified: 2026-04-22
aliases: [MS AutoGen]
moc:
  - "[[Microsoft MOC]]"
  - "[[Agents MOC]]"
---

# AutoGen  🟡 DEPRECATED — konsolidiert in [[Microsoft Agent Framework]]

*AutoGen war **Microsoft Research's Multi-Agent-Framework** — Python-first, experimentell, konzeptionell einflussreich (GroupChat-Pattern, Role-Based Agents). Seit MAF 1.0 (2026-04-07) **konsolidiert** — Multi-Agent-Pattern sind First-Class in MAF, Research-Features teilweise experimentell erhalten, teilweise entfallen.*

> **Analogie:** Wie CrewAI auf Research-Steroide — einflussreich für die Konzepte, aber nicht Production-Ready im Microsoft-Enterprise-Stack. MAF erbt die Konzepte, nicht die Experimentier-Basis.

---

## Einsatz

**Historischer JTBD:** When I Multi-Agent-Patterns + Role-Based-Teaming prototypen wollte, I want to eine schnelle Python-Framework-API, so I can Research-Ideen wie Reflection, Debate, Auto-Code-Gen erproben.

**Heutiger Handlungsauftrag:** Bestandsprojekte (meist PoCs) auf [[Microsoft Agent Framework]] migrieren oder aufgeben.

**Empfehlung:** 🟡 **Keine neuen Projekte**. Für Research-Experimente reicht MAF Orchestrator-Pattern meist aus. Spezial-Features (z.B. `AutoGenStudio`-UI) nicht in MAF enthalten.

---

## Status & Pricing

- **Status:** Deprecated (Kern-Konzepte in MAF konsolidiert)
- **EOS:** TBD — kein hartes Datum, Repo bleibt für Research offen
- **Pricing:** OSS, kostenlos
- **Pfad:** → [[Microsoft Agent Framework]]

---

## Migrationspfad zu MAF

### Was bleibt konzeptionell erhalten

- **GroupChat-Pattern** wurde 1:1 in MAF als Orchestrator-Pattern übernommen
- **Agent-Rollen** → MAF-`Agent` mit System Prompt
- **Human-In-The-Loop** → MAF-Handoff-Pattern

### Was sich ändert

| Aspekt | AutoGen | Microsoft Agent Framework |
|--------|---------|----------------------------|
| Namespace | `autogen` / `autogen-agentchat` | `agent_framework` |
| Primäre Sprache | Python | Python + .NET |
| UI | AutoGen Studio (Research) | Foundry Portal Playground / eigene UI |
| Teaching Loop | experimentell | nicht adoptiert |
| Code-Execution | integriert in Research-Experimente | **Hyperlight CodeAct** (sicher, sandboxed, in MAF 1.1.0) |

### Migrations-Schritte (Py)

1. `autogen-agentchat` → `agent-framework` Package-Swap
2. Agent-Definitionen anpassen (System Prompt + Tools bleiben nahe)
3. GroupChat-Config auf MAF-Orchestrator übertragen
4. AutoGen-Studio-UI-Funktionalität neu bauen wenn nötig (kein 1:1-Ersatz)

---

## Limitierungen & Fallstricke

- **Research-Features teilweise nicht in MAF** — einige experimentelle Patterns bleiben AutoGen-Only
- **Community-Fork-Risiko** — das MSR-Team hat eigene Pfade

### Fallstricke

- **AutoGen Studio-Dependency** — wer auf Studio-UI aufgebaut hat, muss neu bauen. *Gegenmittel: Foundry Portal Playground evaluieren oder eigenes UI.*
- **„AutoGen ist leichter als MAF"** — stimmt für Py-Prototyp, aber MAF hat die Enterprise-Features. Für Produktiv-Einsatz MAF.

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| GitHub | microsoft/autogen | https://github.com/microsoft/autogen | 2026-04-22 |
| Research Page | AutoGen at MSR | https://microsoft.github.io/autogen/ | 2026-04-22 |
| Migration Guide | AutoGen → Agent Framework | https://learn.microsoft.com/en-us/agent-framework/migrate-from-autogen | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub — Migration-Pfad zu MAF |
