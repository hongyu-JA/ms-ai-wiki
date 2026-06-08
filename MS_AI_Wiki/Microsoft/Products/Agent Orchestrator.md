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

## Konkrete Architektur-Patterns

### Pattern 1 — Reasoning-Splitter
Eingehende User-Anfrage wird vom Orchestrator klassifiziert. Komplexes Reasoning geht an MAF-Agent mit MAI-Thinking-1, schnelle Faktenfragen an Copilot-Studio-Agent mit MAI-Small.

```
User → Orchestrator (Classifier-Agent)
       ├── reasoning-heavy? → MAF + MAI-Thinking-1
       └── faktisch?         → Studio + MAI-Small
                              (~5× günstiger und schneller)
```

### Pattern 2 — Legacy + Greenfield Koexistenz
Bestehende Semantic-Kernel-Logik bleibt, neue Workflows in MAF. Orchestrator routet zwischen beiden.

```
Workflow-Engine (Logic App)
    ↓
Agent Orchestrator
    ├── SK-Agent (alt, "do not touch")
    └── MAF-Agent (neu, alle Greenfield-Logik)
```

### Pattern 3 — Multi-Agent-Team
Mehrere spezialisierte Agenten arbeiten an einer Aufgabe parallel.

```
User: "Erstelle Compliance-Report über Q1"
Orchestrator → [Recherche-Agent (Web IQ)] +
               [Daten-Agent (Fabric IQ)] +
               [Schreib-Agent (MAF + MAI-Large)]
            → Aggregations-Agent kombiniert Outputs
```

## Pricing (vorläufig, Build-Keynote)

- **Free Tier:** bis 10'000 Orchestrierungs-Calls/Monat
- **Standard:** $0.002 pro Orchestrierungs-Call (entspricht ~CHF 0.0018)
- **Enterprise:** PTU-basiert mit reservierter Kapazität
- Plus durchgeleitete Modell-Kosten (Orchestrator zählt nicht doppelt)

Schätzung für mittleren Kunden (10 Agenten, 100 Calls/Tag): ca. **CHF 50-150/Monat zusätzlich** zum Modell-Verbrauch.

## Häufige Stolpersteine

1. **Orchestrator ≠ State-Machine.** Wer komplexe stateful Workflows mit Konditionen baut, braucht weiterhin Logic Apps oder Durable Functions. Orchestrator ist für **Routing und Koordination**, nicht für Business-Logic.
2. **Pre-Lifecycle-Hooks fehlen** in Preview. Wenn du einen Agent-Aufruf modifizieren willst (z.B. Audit-Log einfügen), brauchst du APIM-AI-Gateway davor.
3. **Cross-Region-Routing** ist Q4/2026-Feature, in Preview nicht verfügbar — bei US-Preview muss man explizit auf US-Region routen.
4. **Cold-Start:** erster Aufruf an einen Agent dauert 2-5 Sekunden — für Echtzeit-Use-Cases warm-up-Strategie nötig.

## Migrations-Pfade

### Aus reinem Semantic Kernel
Aufwand: **halbe bis 2 Tage** pro Agent.
1. SK-Agent als Orchestrator-Tool registrieren (`@orchestrator_tool`-Decorator)
2. Entry-Point ändern von SK-Kernel → Orchestrator-Endpoint
3. Bestehender SK-Code bleibt unverändert!
4. Schrittweise neue Agenten in MAF hinzufügen

### Aus reinem AutoGen
Aufwand: **1-2 Tage** pro GroupChat.
- AutoGen GroupChat → Orchestrator Multi-Agent-Team
- Speaker-Selection-Logic muss neu definiert werden (Orchestrator hat eigene)

### Aus Greenfield
Empfehlung: **direkt MAF + Orchestrator zusammen** lernen. Lernkurve ähnlich wie nur MAF, aber eingebaute Multi-Agent-Skalierbarkeit.

## Schweizer Compliance-Implikationen

- **FADP / DSGVO:** Orchestrator als Microsoft-Service folgt Microsoft-Datenschutz-Standardvertrag. Kein zusätzliches DPIA nötig (deckungsgleich mit Foundry Agent Service).
- **FINMA-Rundschreiben 2023/01 (Outsourcing):** für Banken/Versicherer muss EU-Region-Verfügbarkeit abgewartet werden — US-Preview ist nicht FINMA-tauglich.
- **Audit-Anforderungen:** Orchestrator schreibt alle Routing-Entscheidungen in Azure Monitor — auditierbar.

## Vertiefungsbedarf (1-Tag-Aufwand)

- [ ] Preview-Zugang anfragen (sobald öffentlich) und einen 3-Agenten-POC bauen
- [ ] EU-Region-Roadmap mit Microsoft-Kontakt klären
- [ ] Vergleich Orchestrator + APIM-AI-Gateway: wann beides, wann nur eines?
- [ ] Cost-Modell für 2 unserer Bestandskunden mit Multi-Framework-Code durchrechnen

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [windowsnews.ai — Agent Orchestrator](https://windowsnews.ai/article/build-2026-microsoft-unleashes-ai-agents-across-office-365-windows-and-azure-at-san-francisco-keynot.421349)
