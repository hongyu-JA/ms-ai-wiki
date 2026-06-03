# Microsoft Build 2026 — Recap & KB-Auswirkungen

**Event:** Microsoft Build 2026, San Francisco
**Keynote:** 2. Juni 2026, Satya Nadella
**Recap-Datum:** 3. Juni 2026
**Verfasser:** Hongyu Zhou (Journai)

## Leitthese der Konferenz

> **Agenten sind nicht ein Feature. Sie sind das neue Betriebssystem für Arbeit.**

Microsoft positioniert sich strategisch in zwei Richtungen:
- **AI-Optionality:** Weg von der reinen OpenAI-Abhängigkeit — eigene MAI-Modellfamilie + Multi-Provider-Routing.
- **Agentic Platform:** Foundry als Orchestrierungsschicht für heterogene Agenten-Teams.

Für unsere Beratungspraxis bedeutet das: Die Architektur-Map muss um zentrale neue Bausteine erweitert werden, und unsere Empfehlungen zur Vendor-Lock-in-Diskussion bekommen neue Optionen.

---

## Neue Produkte (KB-Status nach Recap)

| Produkt | Layer (Architektur-Map) | Status | KB-Stub erstellt | Tiefer-Recherche-Aufwand |
|---|---|---|---|---|
| **MAI Models** (Familie) | FOUNDATION | Preview/GA gemischt | ✅ | 2 Tage |
| **Agent Orchestrator** | HOSTING / ORCHESTRATION | Preview 08/2026 | ✅ | 1 Tag |
| **Microsoft IQ** (umbrella) | KNOWLEDGE | GA | ✅ | 1 Tag |
| **Work IQ APIs** | KNOWLEDGE | GA | ✅ | 0.5 Tag |
| **Web IQ** | KNOWLEDGE | GA | ✅ | 0.5 Tag |
| **Fabric IQ** | KNOWLEDGE | GA | ✅ | 0.5 Tag |
| **GitHub Copilot App** | SURFACE | GA | ✅ | 0.5 Tag |
| **Microsoft Execution Containers (MXC)** | GOVERNANCE | GA | ✅ | 1 Tag |
| **Microsoft Scout** | SURFACE | GA (Frontier) | ✅ | 0.5 Tag |
| **Aion Instruct & Plan** | FOUNDATION (Edge) | GA mit Win 12 | ✅ | 0.5 Tag |
| **Agent Control Specification** | GOVERNANCE | Announced | ✅ | 1 Tag |

## Bestehende Produkte mit signifikanten Updates

| Produkt | Update | Status-Änderung |
|---|---|---|
| **Foundry Control Plane** | Model-agnostic Routing, A/B-Testing, automatische Rollbacks, Purview + Sentinel Integration | bedeutender Funktionsausbau |
| **Foundry IQ** | Jetzt GA, Teil der Microsoft-IQ-Familie | preview → GA |
| **Foundry Models** | Aufgenommen: 7 MAI-Modelle, Anthropic Claude 4, Code Llama 4 | Multi-Provider erweitert |
| **Agent 365** | Agent-Attestation (kryptografische Signatur jeder Aktion), Agent-Confidence-Scores | Governance-Vertiefung |

## Bewusst nicht in KB aufgenommen (für Beratung nicht relevant)

- **Azure HorizonDB** (Postgres für Agents) — interessant aber überschneidet sich mit Cosmos DB für AI
- **Cobalt 200 / Maia 200** (Infrastruktur-Hardware) — unterhalb unserer Beratungs-Ebene
- **Project Solara** (Agent-Device-Plattform) — zu früh, kein Schweizer Markt
- **Surface RTX Spark Dev Box / Surface Laptop Ultra** — Endgeräte, nicht Architektur
- **Majorana 2** (Quantum-Chip) — irrelevant für nächste 3 Jahre
- **Microsoft Discovery** (Wissenschafts-Plattform) — nicht Journai-Zielmarkt
- **Frontier Tuning** — sehr nischenartig
- **MDASH** (AI-Security) — abwarten, Coming Soon

---

## Strategische Implikationen für Journai

### 1. Anthropic-EU-Frage entspannt sich

Mit MAI-Modellen als gleichwertiger erster Klasse haben Schweizer Kunden mit DSGVO-Bedenken nun einen vollständigen Microsoft-First-Party-Stack:
- MAI-Thinking-1 statt Claude für Reasoning
- MAI-Code (oder Coder) statt Claude für Coding
- Standard Microsoft-Datenschutz-Garantien

Unsere Beratungsempfehlung verschiebt sich:
- **Vorher:** "Anthropic in EU default-OFF, DPIA-Aufwand für Aktivierung"
- **Nachher:** "Anthropic ist eine Option neben MAI; für Schweizer Banken/Versicherer empfehlen wir MAI-First, weil Single-Vendor-DPIA"

### 2. MCP-Standardisierung wird zur Pflicht

Web IQ ist "model-agnostic, MCP native" — Microsoft adoptiert MCP nicht nur passiv, sondern baut nativ auf MCP auf. Unsere Architektur-Empfehlungen sollten künftig:
- MCP als Standard-Integrationspfad annehmen
- Nicht-MCP-Tools als "Migrationskandidaten" markieren

### 3. Foundry Control Plane wird zum unverzichtbaren Pflicht-Layer

Mit Model-agnostic Routing wird Control Plane das, was APIM für klassische Microservices ist: nicht optional, sondern Standard.

**Empfehlungs-Update:** Jedes Production-Setup ab Q3/2026 sollte Foundry Control Plane einplanen — vorher war es "nice to have".

### 4. Agent Orchestrator löst die "Multi-Framework-Frage"

Bisher beraten wir streng: "Lernt MAF, vergesst Semantic Kernel und LangChain." Mit Agent Orchestrator, der heterogene Agenten-Teams unterstützt, ist diese harte Empfehlung weniger zwingend. Pragmatischer:
- Neukunden mit Greenfield → MAF (wie bisher)
- Bestandskunden mit SK/LangChain → Migration zu MAF **oder** Coexistenz via Agent Orchestrator (neuer Pfad)

### 5. Architektur-Map muss erweitert werden

Die aktuelle Map (39 Tools, 48 Edges, 7 Layer) bekommt:
- **+11 neue Knoten** (siehe Tabelle oben)
- **~15 neue Edges** (Schätzung)
- Möglicherweise eine **neue Layer**: ORCHESTRATION zwischen AGENT BUILDING und HOSTING

**Empfohlene Aktion:** Sub-Projekt B Iteration 2 nach Build, mit eigener Spec und eigenem Plan. Aufwand: 3-5 Tage.

---

## Nächste-Schritte-Plan

### Kurzfristig (diese Woche)

1. ✅ Recap-Dokument erstellen (dieses File)
2. ✅ Stub-KB-Files für alle 11 neuen Produkte (markiert `status: stub_build_2026`)
3. ✅ Update von 4 bestehenden Produkten (`last_verified: 2026-06-03`, neue Funktionsabschnitte)
4. ⬜ MOC-Aktualisierungen mit neuen Produkt-Links
5. ⬜ Commit + Push als eigene PR

### Mittelfristig (Juni/Juli)

6. ⬜ Vertiefungs-Recherche für jedes Stub-File (siehe Aufwand-Schätzung oben)
7. ⬜ Sub-Projekt B Iteration 2: Architektur-Map mit neuen Knoten + Edges + neuer ORCHESTRATION-Layer
8. ⬜ Voice Agent "Emma" — wie geplant
9. ⬜ Sub-Projekt D Change-Log Digest — basiert auf diesem Format

### Langfristig (Q3/Q4 2026)

10. ⬜ Kunden-Erstgespräche mit neuem Stack-Wissen testen
11. ⬜ Microsoft-IQ-Familie POC bei mind. 1 Kunden
12. ⬜ MAI-Models vs OpenAI Vergleichs-Benchmark für unsere typische Use-Cases

---

## Quellen

- **Microsoft offiziell:** [news.microsoft.com/build-2026](https://news.microsoft.com/build-2026/)
- **The Neuron — vollständige Übersicht:** [theneuron.ai/build-2026](https://www.theneuron.ai/explainer-articles/everything-microsoft-announced-at-microsoft-build-2026-explained/)
- **WindowsNews — MAI Models Deep-Dive:** [windowsnews.ai/mai-models](https://windowsnews.ai/article/build-2026-microsoft-mai-models-foundry-control-plane-and-the-push-for-ai-optionality-beyond-openai.421932)
- **WindowsNews — Agent-Orchestrator:** [windowsnews.ai/agents](https://windowsnews.ai/article/build-2026-microsoft-unleashes-ai-agents-across-office-365-windows-and-azure-at-san-francisco-keynot.421349)
- **Tom's Guide Live-Blog:** [tomsguide.com/build-2026](https://www.tomsguide.com/news/live/microsoft-build-2026)
