---
watch: open
status: stub_build_2026
last_verified: 2026-06-03
source: build-2026-keynote
aliases:
  - Foundry Agent Orchestrator
  - Agent Orchestration Service
moc:
  - '[[Microsoft MOC]]'
  - '[[Agents MOC]]'
zuletzt_gesichtet: 2026-06-03
updated: 2026-06-03
---

# Agent Orchestrator

*Neuer Foundry-Service, vorgestellt auf Build 2026 — orchestriert heterogene Agenten-Teams (MAF, Semantic Kernel, LangChain, REST API) unter einer Steuerschicht. Load-Balancing, Logic-Apps-Trigger, einheitliches Billing.*

> **Analogie:** Was Kubernetes für Container war, ist Agent Orchestrator für Agenten — eine Plattform, die nicht fragt, womit du gebaut hast, sondern wie deine Agenten zusammenspielen.

---

## Was ist es?

Eine Orchestrierungsschicht oberhalb der Agent-Frameworks. Bisher musste man wählen: alle Agenten in MAF, oder alle in LangChain, oder alle in Copilot Studio. Mit dem Orchestrator können diese koexistieren und über eine gemeinsame Schnittstelle gesteuert werden:

- **Heterogene Agenten-Teams:** ein Workflow nutzt einen MAF-Agent für Reasoning, einen LangChain-Agent für externe API-Calls und einen Studio-Agent für M365-Interaktion
- **Load Balancing:** über tausende Agenten skalierbar
- **Workflow-Trigger:** Azure Logic Apps als Event-Quelle
- **Unified Billing:** ein Dashboard für Verbrauch + Kosten über alle Agent-Typen

## Status & Verfügbarkeit

- **Status:** Preview ab August 2026
- **Region:** US first, EU folgt (genaue Region-Liste tba)
- **Preisgestaltung:** noch nicht angekündigt

## Wo passt es in die Architektur?

- **Layer:** zwischen AGENT BUILDING und HOSTING — möglicherweise neue eigene **ORCHESTRATION**-Schicht in unserer Map
- **Verbindungen:**
  - `uses` → MAF, Copilot Studio, M365 Agents SDK, Semantic Kernel (legacy)
  - `calls` → Foundry Models
  - `integrated-via` → Azure Logic Apps
  - `secured-by` → Entra Agent ID, Agent 365

## Beratungs-Relevanz für Journai

**Hoch — verändert unsere Migrations-Empfehlungen.**

**Vorher:** "Semantic Kernel + AutoGen sind deprecated, alles muss zu MAF migrieren."

**Nachher:** "Migration zu MAF bleibt die Best-Practice für neue Agenten. Aber Bestandskunden mit SK / AutoGen-Code können diese via Agent Orchestrator weiterleben lassen, statt zwingend zu re-writen. Pragmatischer Path: SK-Agenten bleiben unter Orchestrator, neue Agenten in MAF, beide kommunizieren über Orchestrator-Bus."

Das senkt die Migrationshürde für mittlere Bestandskunden erheblich.

## Vertiefungsbedarf (1-Tag-Aufwand)

- [ ] Genauer Preview-Start-Termin im August 2026
- [ ] EU-Region-Roadmap
- [ ] Pricing-Modell verstehen
- [ ] Integration-Pattern mit bestehenden APIM-AI-Gateway-Setups

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [windowsnews.ai — Agent Orchestrator](https://windowsnews.ai/article/build-2026-microsoft-unleashes-ai-agents-across-office-365-windows-and-azure-at-san-francisco-keynot.421349)
