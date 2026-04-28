---
watch: close
status: ga
last_verified: 2026-04-22
aliases:
  - MAF
  - Agent Framework
moc:
  - '[[Microsoft MOC]]'
  - '[[Agents MOC]]'
zuletzt_gesichtet: 2026-04-28
updated: 2026-04-28
---

# Microsoft Agent Framework

*Microsoft's Pro-Code-Framework für Agents und Multi-Agent-Systeme in .NET und Python — GA seit 07.04.2026. Ersetzt Semantic Kernel und AutoGen als konsolidiertes, Enterprise-orientiertes Orchestration-SDK mit Tool-Use, Multi-Agent-Pattern und Observability-Hooks.*

> **Analogie:** Wie LangGraph oder CrewAI für Python-Teams, aber mit direktem Anschluss an Foundry, M365 Agents SDK und Entra — das ist der „Enterprise-LangGraph" im Microsoft-Stack.

---

## Einsatz

### Job-to-be-done

When I einen zuverlässigen, wartbaren, unter Governance stehenden Agent bauen will (nicht ein Notebook-Prototyp), I want to eine klar typisierte Framework-API nutzen, die Multi-Agent-Orchestrierung, Tool-Use und Tracing als First-Class-Konstrukte liefert, so I can von Anfang an in die Produktiv-Infrastruktur deployen, statt einen Prototyp umbauen zu müssen.

### Trigger-Signale

- „Unser Copilot-Studio-Bot reicht nicht mehr, wir brauchen Code-Kontrolle und unsere eigenen Tools."
- „Wir hatten Semantic Kernel im Einsatz — was jetzt nach der Konsolidierung? Was ist der Migrationspfad?"
- „Wir wollen Multi-Agent-Workflows, bei denen verschiedene Agents verschiedene Verantwortungen haben (Researcher + Reviewer + Schreiber), aber sauber entkoppelt."
- „Unser Azure-OpenAI-Client-Code wird ein Spaghetti aus Retry-Logik, Tool-Calls und State. Wir brauchen Struktur."

### Einsatz-Szenarien

1. **Multi-Step-Research-Agent** — Planner-Agent zerlegt eine Kundenanfrage, delegiert an Worker-Agents, die Azure AI Search + Microsoft Graph abfragen; ein Review-Agent verifiziert Antwort vor dem Senden. *Journai-Fit: typisches SMB-Kundenservice-Szenario mit geprüfter Antwortqualität.*
2. **Ticket-Triage** — Eingangs-Agent klassifiziert Ticket (Kategorie + Priorität), Fach-Agent formuliert Entwurf-Antwort, Review-Agent prüft Tonalität + Compliance. *Journai-Fit: konkret bei Kunden aus dem regulierten Umfeld relevant.*
3. **Migration Semantic Kernel → MAF** — Bestandskunden-Agents auf MAF umstellen, ohne die umliegende Azure-Infrastruktur anzufassen. *Journai-Fit: Bestandskunden-Pflege nach der SK-Konsolidierung.*

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Keine — Framework ist OSS (MIT). Kosten nur bei den Backend-Services (Azure OpenAI / Foundry Models) |
| **Tenant / Infrastruktur** | Azure Subscription mit Foundry-Project oder Azure OpenAI; Entra-App-Registration für Tool-Aufrufe; Region-Wahl EU-konform |
| **Skills / Rollen** | Pro-Code-Entwickler (.NET 8+ oder Python 3.11+), DevOps für Container Apps / Functions Deployment, Solution Architect für Stack-Einordnung |
| **Compliance-Rahmen** | Modell-Region entscheidet Daten-Region; bei EU-Kunden Foundry-Region explizit prüfen (Foundry Agent Service aktuell nur NC-US) |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | 3–5 Beratertage für ersten produktiven Single-Agent; 10–15 Tage für Multi-Agent-System mit Tracing + Evaluation |
| **Laufende Lizenzkosten** | Framework kostenlos; Modell-Kosten variabel — typischer SMB-Agent 50–300 EUR/Monat PAYG, bei hohem Volumen PTU ab ~800 EUR/Monat |
| **Laufender Betrieb** | 1–2 Tage/Monat für Monitoring-Review + Eval-Ergebnisse sichten *(eigene Einschätzung)* |

### Empfehlung

**Status:** 🟢 **Empfehlen** — als Standard-Framework für alle Pro-Code-Agents ab 2026-04. GA-Reife, Enterprise-Features, klarer Migrationspfad von SK/AutoGen, gut dokumentiert.

**Nächster Schritt für Journai:** Referenz-Agent in Foundry aufsetzen (siehe Arbeitsauftrag §2.6 Hands-on), internen Migration-Runbook SK→MAF dokumentieren, Workshop-Angebot „MAF-Pilot in 2 Wochen" entwickeln.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | GA · Python SDK aktuell 1.1.0 |
| **GA-Datum** | 2026-04-07 |
| **Standalone-Preis (USD)** | Framework selbst kostenlos (MIT); Backend-Kosten via Azure OpenAI PAYG oder Foundry PTU (Mindestabnahme ~$2500/Monat) |
| **Standalone-Preis (EUR)** | n/a — EUR-Preise ergeben sich aus dem gewählten Backend |
| **Lizenz-Bundle** | Kein Bundle — eigenständiges OSS-Paket. Azure-OpenAI-Credits können über E7 / Azure-EA kommen |
| **Voraussetzung** | .NET 8+ oder Python 3.11+ · Azure OpenAI Resource oder Foundry Project · Entra App Registration für Tool-Aufrufe |
| **Region-Verfügbarkeit** | SDK global einsetzbar — **Foundry Agent Service (managed hosting) aktuell nur North Central US** (DSGVO-Flag für EU-Kunden!) |
| **CSP-Promo / Discounts** | Nicht anwendbar auf das Framework selbst |
| **Hidden Costs** | Tracing + Evaluation erzeugt Log-Ingestion in Application Insights — bei hohem Volumen nicht trivial. Multi-Agent-Orchestrierung multipliziert Modell-Calls — Kostenschätzung vor Produktion Pflicht. |
| **Upgrade-Pfad** | Semantic Kernel → MAF (API-nah, einige Plugins wandern nicht 1:1 — Migration-Runbook notwendig). AutoGen → MAF (Research-Features teilweise in MAF experimental, teilweise entfallen) |

---

| Detail | Wert |
|--------|------|
| **Aktueller Status** | GA · Python SDK aktuell 1.2.0 |
| **GA-Datum** | 2026-04-07 |
| **Standalone-Preis (USD)** | Framework selbst kostenlos (MIT); Backend-Kosten via Azure OpenAI PAYG oder Foundry PTU (Mindestabnahme ~$2500/Monat) |
| **Standalone-Preis (EUR)** | n/a — EUR-Preise ergeben sich aus dem gewählten Backend |
| **Lizenz-Bundle** | Kein Bundle — eigenständiges OSS-Paket. Azure-OpenAI-Credits können über E7 / Azure-EA kommen |
| **Voraussetzung** | .NET 8+ oder Python 3.11+ · Azure OpenAI Resource oder Foundry Project · Entra App Registration für Tool-Aufrufe |
| **Region-Verfügbarkeit** | SDK global einsetzbar — **Foundry Agent Service (managed hosting) aktuell nur North Central US** (DSGVO-Flag für EU-Kunden!) |
| **CSP-Promo / Discounts** | Nicht anwendbar auf das Framework selbst |
| **Hidden Costs** | Tracing + Evaluation erzeugt Log-Ingestion in Application Insights — bei hohem Volumen nicht trivial. Multi-Agent-Orchestrierung multipliziert Modell-Calls — Kostenschätzung vor Produktion Pflicht. |
| **Upgrade-Pfad** | Semantic Kernel → MAF (API-nah, einige Plugins wandern nicht 1:1 — Migration-Runbook notwendig). AutoGen → MAF (Research-Features teilweise in MAF experimental, teilweise entfallen) |


## Kernkonzept

### Was es im Kern ist

MAF ist die **Agent-Logik-Schicht** im Microsoft-Stack. Darunter liegen Modell-APIs (Azure OpenAI, Foundry Models); darüber liegen optionale Hosting-Schichten (M365 Agents SDK für Teams/Copilot, Foundry Agent Service für managed Cloud-Hosting) und Governance (Agent 365 + Entra Agent ID). MAF selbst ist bewusst **runtime-agnostisch** — du kannst es in Azure Functions, Container Apps, on-prem oder im Notebook laufen lassen. Diese Entkopplung ist die zentrale Architektur-Wette: Agent-Logik und Hosting dürfen sich nicht vermischen.

MAF ist das **konsolidierte Nachfolge-Framework** von zwei Vorgängern mit unterschiedlicher DNA: **Semantic Kernel** (Enterprise-orientiert, .NET-first, Planner + Plugins) und **AutoGen** (Microsoft Research, Multi-Agent-Research, Python-first). Die Konsolidierung ist **inhaltlich, nicht nur kosmetisch**: die Kernabstraktionen (Agent, Thread, Tool, Orchestration-Pattern) wurden neu gedacht, nicht 1:1 aus SK oder AutoGen übernommen. Das ist für Bestandskunden beider Vorgänger relevant — wer mit einem Drop-in-Ersatz plant, wird enttäuscht.

Die Design-Philosophie: **Multi-Agent ist First-Class**, aber nicht Default. Du fängst mit einem Single-Agent an und nimmst Multi-Agent-Patterns (Sequential, Handoff, GroupChat) nur hinzu, wenn Verantwortlichkeiten klar trennbar sind. Das ist eine bewusste Gegenposition zur „mehr Agents = besser"-Erzählung in der Community — jeder zusätzliche Agent ist Latenz + Kosten + Failure-Mode.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| Governance / Identity | Agent-Identität, Conditional Access, Audit | Agent 365 + Entra Agent ID |
| Hosting / Runtime | Container, HTTP-Endpunkt, Teams-Kanal | Foundry Agent Service · M365 Agents SDK · Azure Functions · Container Apps |
| **Agent Logic (Orchestration)** | **System Prompts, Tool-Use, Multi-Agent-Patterns, Threads** | **Microsoft Agent Framework** (diese Note) |
| Model APIs | Chat-Completion, Embeddings, Tool-Call-Spec | Azure OpenAI · Foundry Models · direkte OpenAI/Anthropic |
| Data / Knowledge | Retrieval, Memory, Vector Search | Azure AI Search · Foundry IQ · Cosmos DB · Microsoft Graph |

### Kern-Fähigkeiten

#### Agent + Thread + Tool-Use

Ein Agent besitzt ein System Prompt, eine Modell-Referenz und eine Tool-Liste. Jeder Konversationsfaden ist ein Thread mit Nachrichten-History. Tools sind annotierte Funktionen (`[KernelFunction]` in .NET / `@tool` in Python), die der Agent via Function-Calling auswählt und aufruft. Grenze: ohne externes State-Store kein persistentes Thread-Memory über Prozessgrenzen hinweg.

#### Multi-Agent-Orchestrierung (Sequential / Handoff / GroupChat)

Drei orthogonale Patterns als First-Class-Konstrukte. **Sequential**: deterministische Kette. **Handoff**: Agent A entscheidet zur Laufzeit, ob Agent B übernimmt. **GroupChat**: mehrere Agents antworten auf dieselbe Konversation, ein Moderator entscheidet wer als nächstes spricht. Grenze: keine eingebaute Retry/Timeout-Strategie pro Agent.

#### MCP-Tool-Integration

MCP-Server als Tool-Provider einbindbar — Copilot-Studio-MCP-Tools und Dataverse-MCP direkt wiederverwendbar. MCP-Streaming-Bug in v1.0.5 behoben.

#### Tracing + Evaluation

OTel-Tracing, der Foundry Control Plane und Application Insights gleichzeitig beliefert. Evaluation-SDK für Offline-Regression-Tests mit Judge-Modell. Pflicht für Produktiv-Einsatz.

#### Gemini-Client *(neu in Python 1.1.0, 2026-04-21)*

Erster offizieller Non-Azure/Non-OpenAI-Client. `agent-framework-google`-Package ermöglicht Gemini-Modelle im selben Agent-Code — Multi-Modell-Strategie erweitert. Grenze: initiales Release, Feature-Parität noch nicht vollständig dokumentiert.

#### Hyperlight CodeAct *(neu in Python 1.1.0, 2026-04-21)*

Package `agent-framework-hyperlight` bringt Hyperlight-basierte CodeAct-Ausführung — **isolierte Micro-VM-Sandbox für Code-Execution durch Agenten**. Erhöht Sicherheit bei Code-ausführenden Agents erheblich, relevant für Pro-Code-Szenarien mit untrusted Tool-Output. Grenze: eigenes Package, Hyperlight-Runtime-Infrastruktur nötig.

#### Foundry Toolboxes & Hosted Agent V2 *(neu in Python 1.1.0, 2026-04-21)*

`agent-framework-foundry` unterstützt jetzt Foundry Toolboxes (gebündelte Tool-Sammlungen aus dem Foundry-Katalog) und die Hosted Agent V2 API. Vereinfacht Anbindung managed Foundry-Tools ohne manuelle Tool-Definitionen. Grenze: Foundry Agent Service nach wie vor NC-US-Only.

#### .NET Agent Skills *(neu 2026-04-13)*

In .NET können **Skills über drei Authoring-Wege** definiert werden: datei-basiert, inline C#-Code, gekapselte Klassen. Alle drei kombinierbar unter einem gemeinsamen Provider, inklusive Built-in Script Execution + **Human-Approval-Mechanismus** für sicherheitskritische Script-Calls.

### Typischer Workflow

1. **Setup** — `dotnet add package Microsoft.AgentFramework` / `pip install microsoft-agent-framework`, Foundry-Project + Modell-Deployment, Entra-App-Registration.
2. **Build / Configure** — Agent-Klasse definieren (System Prompt, Tool-Liste, Modell), Tools als annotierte Funktionen schreiben, Orchestrator-Pattern wählen.
3. **Deploy** — Container Apps (Standard), Azure Functions (Event-getrieben), Foundry Agent Service (managed, Region-Lock), M365 Agents SDK (Teams).
4. **Operate** — Foundry Control Plane Tracing + Eval-Suite in CI; App Insights Alerts; Kosten-Monitoring.

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai intern)** | .NET 8+ oder Python 3.11+, async/await, DI-Pattern, HTTP-APIs, Azure CLI; Prompt-Engineering-Basics |
| **Admin (beim Kunden)** | Azure-Subscription-Admin für Foundry/OpenAI-Deployment, Entra-App-Registration |
| **End-User (beim Kunden)** | Keine — konsumiert den Agent via Chat-UI |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Keine eingebaute UI** | M365 Agents SDK + Teams SDK · Foundry Agent Service |
| **Kein Built-in Vector Store** | Azure AI Search, Foundry IQ, Cosmos DB Vector |
| **Keine Retry/Timeout-Policy pro Agent** | Polly (.NET), tenacity (Python), oder Foundry Agent Service |
| **Thread-Memory nicht persistent über Prozessgrenzen** | Externer State-Store (Cosmos DB Checkpoint, Redis, Azure Storage) |

### Typische Fallstricke im Einsatz

- **MAF als Drop-in-Ersatz für Semantic Kernel sehen** — APIs sind *nah*, aber Thread-Semantik + Plugin-System sind neu. *Gegenmittel: Migrations-Runbook + kleiner Pilot.*
- **„Multi-Agent = besser"-Trugschluss** — Latenz + Kosten + Failure-Modes. *Gegenmittel: Single-Agent zuerst, Multi nur wenn Verantwortung klar trennbar.*
- **DSGVO übersehen, weil MAF-Runtime lokal läuft** — Modell-Endpunkt zieht die Daten in die Modell-Region. *Gegenmittel: Region explizit prüfen.*
- **Tracing erst nach Go-Live anschalten** — Baseline-Daten fehlen für Eval. *Gegenmittel: Tracing ist „Definition of Done".*

### Security-Hinweise (Python SDK ≥ 1.0.1)

- **`FileCheckpointStorage` — restricted unpickler (BREAKING CHANGE):** ab 1.0.1 läuft Checkpoint-Deserialisierung durch einen eingeschränkten Unpickler, der nur sichere Built-in-Typen + `agent_framework`-Framework-Typen zulässt. Eigene Klassen via Parameter `allowed_checkpoint_types` (Format: `"module:qualname"`) explizit freigeben — sonst `WorkflowCheckpointException`.
- **Cosmos DB NoSQL Checkpoint Storage:** neues Package `agent-framework-azure-cosmos` als skalierbare Alternative zu `FileCheckpointStorage`.
- **BREAKING in 1.1.0:** `CosmosCheckpointStorage` nutzt jetzt ebenfalls restriktive Pickle-Deserialisierung per Default — Bestandscheckpoints mit nicht-erlaubten Typen müssen migriert werden, bevor ein Upgrade auf 1.1.0 eingespielt wird.

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| Azure OpenAI / Foundry Models | Modell-Endpunkt | GA, nativ | keine — SDK wählt Endpunkt-Typ automatisch |
| M365 Agents SDK | Hosting-Runtime für Teams/Copilot-Kanäle | GA | mittel — SDK-Abgrenzung MAF (Logik) ≠ M365 Agents SDK (Hosting) nicht intuitiv |
| Foundry Agent Service | Managed Hosting in der Cloud | GA, Region-Lock NC-US | gering technisch, aber DSGVO-Problem für EU |
| Agent 365 + Entra Agent ID | Governance / Identity | GA 01.05.2026 | hoch — Agent-ID-Lifecycle muss verstanden sein |
| Azure AI Search / Foundry IQ | RAG-Backend | GA | gering |
| Microsoft Graph | M365-Datenzugriff | GA | mittel — Delegated vs. App-only Auth bewusst wählen |
| Application Insights | Tracing, Metrics | GA | gering |
| Azure AI Evaluation SDK | Offline-Eval | GA | gering |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| OpenAI (direkt) | Modell-Backend | GA | kein PTU/Bundle-Vorteil, keine MS-DPA |
| Anthropic Claude (via Foundry Models) | Modell-Backend | GA | EU-Region-Availability prüfen |
| Google Gemini (neu 1.1.0) | Modell-Backend | Initial | Feature-Parität noch unvollständig |
| MCP-Server (beliebig) | Tool-Provider | GA | gering — via Standard-Protokoll |

### APIs / Protokolle

- **OpenAI-kompatible Chat-Completion** als primärer Modell-Contract
- **Model Context Protocol (MCP)** für Tool-Integration
- **OpenTelemetry** für Tracing
- **Activity Protocol** (via M365 Agents SDK) wenn für Teams deployed
- **Hyperlight** (neu 1.1.0) für isolierte Code-Execution

---

- **A2A-Bridge** (`agent-framework-a2a`, ab 1.2.0): Direkte Brücke zwischen Agent Framework und dem Agent-to-Agent-Protokoll (A2A) — ermöglicht Interoperabilität mit A2A-kompatiblen Agenten außerhalb des MAF-Ökosystems.
- **OpenTelemetry** (`agent-framework-github-copilot`, ab 1.2.0): Tracing für `GitHubCopilotAgent` via OpenTelemetry-Integration.


## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | Ergibt sich aus der Modell-Region. Bei Azure OpenAI/Foundry explizit EU-Region wählen. Foundry Agent Service aktuell nur NC-US. |
| **Prompts & Outputs** | Bei Azure OpenAI: nicht für Training, Logging abschaltbar. Bei direktem OpenAI-Endpoint: OpenAI-Terms. |
| **DPA** | Abgedeckt im MS Online Services DPA auf Azure. |
| **EU-AI-Act** | Framework = Infrastruktur → kein direkter Adressat. Use-Case entscheidet. |

### Microsoft-Compliance-Stack

- **Defender for AI** (Runtime-Schutz)
- **Purview** (Klassifizierung der Tool-In/Outputs)
- **Entra Agent ID** (Identity)
- **Azure AI Content Safety** (Prompt Shields als Eingangsfilter)

### Bekannte Compliance-Lücken

- **Kein Built-in-PII-Redaction-Layer** — muss als Tool/Middleware implementiert werden (Presidio, Azure AI Language PII).
- **Anthropic Claude via Foundry** in EU/EFTA/UK per Default deaktiviert — manuell freischalten.

---

## Abgrenzung & Wettbewerb

### Microsoft-intern: Wann MAF vs. welches andere MS-Produkt?

| Frage-Situation | MAF | Alternative MS-Produkt |
|-----------------|-----|------------------------|
| „Agent ohne Code" | ❌ | ✅ [[Copilot Studio]] |
| „Nur Teams-Bot-Activity-Protocol-Hosting" | ⚠️ Overkill | ✅ [[M365 Agents SDK]] ohne MAF |
| „Agent in Teams" | ✅ (Logik) | + [[M365 Agents SDK]] + [[Teams SDK]] |
| „Managed Cloud-Hosting" | ✅ (Logik) | + [[Foundry Agent Service]] |
| „Data-Flow ohne LLM" | ❌ | ✅ [[Logic Apps]] / [[Power Automate]] |

### Externe Alternativen

| Dimension | MAF | LangGraph | CrewAI | OpenAI Agents SDK |
|-----------|-----|-----------|--------|-------------------|
| **Fokus** | Enterprise + MS-Integration | Stateful Graph, aggressive Velocity | Rollen-Teams, einfache UX | OpenAI-native |
| **EU-Data-Residency** | ✅ via Azure | Backend-abhängig | Backend-abhängig | ⚠️ begrenzt |
| **Integrationstiefe in MS** | ✅ nativ | ⚠️ DIY | ⚠️ DIY | ❌ |
| **Multi-Cloud** | ⚠️ MS-lastig | ✅ | ✅ | ❌ |

### Empfehlungs-Regel

Wir nehmen **MAF** über LangGraph, wenn MS-Ökosystem-Heavy + DSGVO-Pflicht + Governance via Agent 365 realistisch. Sonst, bei Python-Teams ohne MS-Bindung + Multi-Cloud-Ambition, kann **LangGraph** passender sein.

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Product Page | Agent Framework Overview | https://learn.microsoft.com/en-us/agent-framework/ | 2026-04-22 | allgemeine Änderungen |
| Quickstart | Agent Framework Quickstart | https://learn.microsoft.com/en-us/agent-framework/quickstart/ | 2026-04-22 | Demos/PoCs |
| Docs Hub | Agent Framework Docs | https://learn.microsoft.com/en-us/agent-framework/docs/ | 2026-04-22 | API-/SDK-Updates |
| GitHub Repository | microsoft/agent-framework | https://github.com/microsoft/agent-framework | 2026-04-22 | Code-Änderungen, Issues |
| Releases (Atom Feed) | Release-Atom | https://github.com/microsoft/agent-framework/releases.atom | 2026-04-22 | Versionsänderungen (→ automation fetcher) |
| Tech Blog | devblogs – Agent Framework / SK | https://devblogs.microsoft.com/agent-framework/ · https://devblogs.microsoft.com/semantic-kernel/ | 2026-04-22 | neue Features, Roadmap |

### Events

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Build 2026 | Mai 2026 | MAF-Deep-Dive, Foundry Agent Service Region-Expansion, Multi-Agent-Patterns |
| Microsoft Ignite 2026 | November 2026 | Nächste MAF-Major-Version, Enterprise-Features, Agent 365-Integration |
| AI Tour Zürich 2026 | 29.04.2026 | Regionale EU-Details, Foundry-EU-Roadmap |

---

## Changelog


| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-24 | auto-sync | Python SDK 1.2.0: Funktionale Workflow-API (agent-framework-core), OpenTelemetry-Integration für GitHubCopilotAgent, Agent-Framework-to-A2A-Bridge-Support, oauth_consent_request-Events in Foundry-Clients, FoundryAgent-Update für hosted agent sessions, Hosting-Server-Upgrade (agent-framework-foundry-hosting); Fixes: AG-UI reasoning role + multimodal media parsing, [TOOLBOXES]-Warning unterdrückt, User-Agent-Prefix korrigiert (Anthropic, Azure AI Search, Cosmos). | https://github.com/microsoft/agent-framework/releases/tag/python-1.2.0 |
| 2026-04-22 | Hongyu | Migration auf neues Product Note Template (v2) — Struktur umgezogen, Inhalt erhalten und erweitert (Einsatz-Szenarien, Stack-Tabelle, Decision-Regel vs. externe Alternativen, neue Fähigkeiten aus 1.1.0 eingepflegt). | — |
| 2026-04-21 | auto-sync | **Python SDK 1.1.0**: Gemini-Client (erster Non-Azure/Non-OpenAI-Client), Hyperlight CodeAct-Package (isolierte Micro-VM-Sandbox für Agent-Code-Exec), Foundry Toolboxes + Hosted Agent V2, A2A-Metadaten-Propagation, AG-UI forwardedProps, finish_reason in AgentResponse, experimenteller File-History-Provider. **BREAKING:** `CosmosCheckpointStorage` nutzt jetzt restriktive Pickle-Deserialisierung per Default. | https://github.com/microsoft/agent-framework/releases/tag/python-1.1.0 |
| 2026-04-13 | auto-sync | **.NET Agent Skills**: 3 Authoring-Varianten (Datei-basiert / Inline-C#-Code / gekapselte Klassen) frei kombinierbar unter einem Provider. Built-in Script Execution + Human-Approval-Mechanismus für Script-Calls. | https://devblogs.microsoft.com/agent-framework/agent-skills-in-net-three-ways-to-author-one-provider-to-run-them/ |
| 2026-04-10 | auto-sync | **Python SDK 1.0.1**: Security-Hardening für `FileCheckpointStorage` (restricted unpickler, **Breaking Change**) — eigene Klassen in Checkpoints müssen via `allowed_checkpoint_types` explizit freigegeben werden. Neues Cosmos DB NoSQL Checkpoint Storage `agent-framework-azure-cosmos`. Breaking Change im Handoff-Workflow-Context-Management. | https://github.com/microsoft/agent-framework/releases/tag/python-1.0.1 |
| 2026-04-21 | Hongyu | Initial-Erstellung der Note, watch: close, Status: GA | GitHub Release v1.0 |

| 2026-04-24 | **Python SDK 1.2.0** — Funktionale Workflow-API (`agent-framework-core`); OpenTelemetry-Integration für `GitHubCopilotAgent`; Agent-Framework-to-A2A-Bridge-Support (`agent-framework-a2a`); `oauth_consent_request`-Events aus Responses API in Foundry-Clients; `FoundryAgent`-Update für hosted agent sessions; Hosting-Server-Upgrade + erweiterter Typ-Support (`agent-framework-foundry-hosting`). Fixes: AG-UI reasoning role + multimodal media parsing spec-konform; `[TOOLBOXES]`-Warning bei `FoundryChatClient` unterdrückt; User-Agent-Prefix für Anthropic, Azure AI Search, Cosmos korrigiert. | [Release Notes](https://github.com/microsoft/agent-framework/releases/tag/python-1.2.0) |
