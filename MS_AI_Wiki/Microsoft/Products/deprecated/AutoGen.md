---
watch: passive
status: deprecated
research_depth: deep
last_verified: 2026-04-22
aliases: [AutoGen, MS AutoGen, pyautogen]
moc:
  - "[[Microsoft MOC]]"
  - "[[Agents MOC]]"
---

# AutoGen  🟡 DEPRECATED — konsolidiert in [[Microsoft Agent Framework]]

*Microsoft Research's Multi-Agent-Framework der Jahre 2023–2025 (Python-first). Konzeptionell einflussreich — `GroupChat`, Role-Based Agents, ConversableAgent-Loop haben die Multi-Agent-Welt geprägt. Seit MAF 1.0 (2026-04-07) **konsolidiert** mit [[deprecated/Semantic Kernel]] unter [[Microsoft Agent Framework]]. AutoGen ist **in Maintenance Mode** (Stand: python-v0.7.5, 2025-09-30) — keine neuen Features, Community-managed, Microsoft empfiehlt MAF für alle Neu-Projekte. Hier dokumentiert als Bestandskunden-Migrationspfad.*

> **Analogie:** Was LangChain für Single-Agent-Prompts war, war AutoGen für Multi-Agent-Konversationen — das Framework, das „Agents diskutieren mit Agents" salonfähig gemacht hat. MAF erbt die Konzepte (Sequential, Magentic, Handoff, GroupChat), nicht den experimentellen Research-Charakter.

> [!warning] Zwei Inkarnationen — Migrations-Pfad unterscheidet sich
> **AutoGen v0.2 (Classic, „pyautogen")** — `ConversableAgent` / `UserProxyAgent` / `GroupChatManager`. Monolithisch, synchron-nah. Meisten Bestandskunden-PoCs sitzen hier.
> **AutoGen v0.4 / AgentChat** — 2024-Q4-Rewrite, event-driven, async-first, mit `AssistantAgent` + `RoundRobinGroupChat` / `MagenticOneGroupChat` / `SelectorGroupChat`. Näher an MAF-Workflow-Modell.
> **v0.2 → MAF** ist ein größerer Sprung als **v0.4 → MAF**. Bei PoC-Audit zuerst Version klären.

> [!note] Community-Fork: AG2 (ag2ai/ag2)
> Die AutoGen-Ursprungs-Autoren haben das Projekt Ende 2024 geforkt und als **AG2** (ag2ai/ag2) weitergeführt — community-governed, Discord-Community, eigene Roadmap. **Für Bestandskunden:** AG2 ist **kein Microsoft-supporteter Pfad**. Wer auf MS-Support-Commitment, Foundry-Integration und Enterprise-SLAs baut, muss auf MAF migrieren. AG2 ist nur dann eine Option, wenn der Kunde sich bewusst aus dem MS-Ökosystem in Richtung OSS-Community bewegen will.

---

## Einsatz

### Job-to-be-done

*(Historisch — nicht mehr für Neu-Projekte.)* When I als Researcher/Entwickler Multi-Agent-Patterns (Debate, Reflection, Teacher-Learner, Code-Generate-and-Execute) prototypen wollte, I want to eine Python-API mit fertigen GroupChat-/ConversableAgent-Primitives nutzen, so I can in einem Nachmittag eine Agenten-Konversation aufsetzen statt Orchestrierung selbst zu bauen.

**Heutiger Handlungsauftrag:** **Bestandskunden-PoCs** auditieren und auf [[Microsoft Agent Framework]] migrieren — oder einstellen, wenn nie über PoC hinaus gekommen.

### Trigger-Signale

- „Wir haben 2024 mit AutoGen einen **Multi-Agent-Research-PoC** gebaut — wie geht's weiter?" → **MAF-Migration oder PoC-Stopp.** Support läuft community-seitig, aber kein MS-Enterprise-Commitment mehr.
- „Unser Code nutzt `UserProxyAgent` mit `code_execution_config` in Docker." → **v0.2-Signal.** Code-Execution in MAF läuft über Hosted Code Interpreter (OpenAI/Foundry) oder — MAF 1.1+ — **Hyperlight CodeAct-Sandbox**. Docker-Sandbox-Pattern entfällt.
- „Wir nutzen `GroupChatManager` / `ConversableAgent`-Loop." → **v0.2-Idiom** — muss zu MAF `SequentialBuilder` / `MagenticBuilder` / `ConcurrentBuilder` umgebaut werden.
- „Wir nutzen `RoundRobinGroupChat` / `MagenticOneGroupChat` / `SelectorGroupChat`." → **v0.4-Signal** — Mapping ist direkter (`SequentialBuilder` / `MagenticBuilder`), aber `SelectorGroupChat` + `Swarm` sind in MAF **noch auf der Roadmap** (Stand 2026-04).
- „Wir benutzen **AutoGen Studio** als No-Code-UI." → **Kein 1:1-MAF-Ersatz.** Entweder neu bauen auf [[Foundry Portal]] Playground oder eigenes UI.
- „Unser Agent macht **Self-Critique / Debate / Teacher-Learner**." → Research-Pattern sind in MAF **nicht als First-Class-Pattern übernommen** — müssen als Workflow-Executor-Graphen neu modelliert werden.

### Einsatz-Szenarien

*(Nur Migrations-/Abschluss-Szenarien.)*

1. **v0.2-PoC → MAF-Workflow** — häufigster Bestandskunden-Fall. `ConversableAgent`-Loops werden zu MAF-`Workflow` mit `SequentialBuilder` oder `MagenticBuilder`. `UserProxyAgent` verschwindet — ersetzt durch MAF-Request-Response-API (`ctx.request_info()` + `@response_handler`). 3–8 Beratertage pro PoC je nach Komplexität.
2. **v0.4-AgentChat → MAF-Workflow** — leichter, weil Konzepte näher beieinander. `AssistantAgent` → MAF `Agent`, `RoundRobinGroupChat` → `SequentialBuilder`, `MagenticOneGroupChat` → `MagenticBuilder`. 1–3 Tage pro Team.
3. **Research-PoC einstellen** — viele AutoGen-Einsätze waren Experimente ohne Produktiv-Pfad. Oft ehrlicher: Kunde beraten „PoC war erfolgreich als Beweis, keine Produktivierung — neuer PoC lohnt erst mit MAF + klarem Business-Case".
4. **Code-Executor-Migration (Docker → Hyperlight)** — für PoCs, die AutoGen's Docker-Code-Sandbox nutzten: MAF 1.1+ bringt **Hyperlight CodeAct** als sichere, millisekundenschnelle µVM-Sandbox. Architektur-Wechsel, nicht nur API-Swap.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Keine — AutoGen & MAF beide OSS (MIT). Nur Modell-Backend-Kosten (Azure OpenAI / Foundry / OpenAI direkt) |
| **Tenant / Infrastruktur** | Bestehende Azure-/Modell-Endpunkte können meist 1:1 weiterverwendet werden. Für Hyperlight-CodeAct: Azure Container Apps / AKS mit Hyperlight-Support nötig |
| **Skills / Rollen** | Python 3.11+-Entwickler mit AutoGen-Erfahrung. **Wichtig:** Wer nur AutoGen Studio (No-Code) bedient hat, kann MAF nicht direkt übernehmen — Migration ist Dev-Task |
| **Compliance-Rahmen** | Unverändert — Framework-Tausch ändert Datenfluss nicht, solange Modell-Endpunkt gleich bleibt. Hyperlight-Sandbox in EU-Regionen: *TODO: Verfügbarkeit prüfen bei konkretem Kunden-Setup* |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Migration** | v0.4 → MAF: 1–3 Tage pro Team. v0.2 → MAF: 3–8 Tage pro PoC (UserProxyAgent-Ersatz + GroupChatManager-Redesign). +2 Tage wenn AutoGen Studio-UI nachgebaut werden muss. +3–5 Tage bei Docker→Hyperlight-Umbau |
| **Laufende Lizenzkosten** | unverändert — reines Code-Projekt. Modell-Kosten identisch |
| **Laufender Betrieb** | Nach Migration besser (MAF hat OTel-Tracing, Checkpointing, Request-Response-Pause — AutoGen v0.2 nichts davon) |

### Empfehlung

**Status:** 🔴 **Meiden für Neu-Projekte** · 🟡 **Planmäßige Migration für Bestandskunden bis Q4 2026** · 🔴 **Kein Support-Commitment von MS** (Community-managed)

**Nächster Schritt für Journai:**
1. **Bestandskunden-Audit (quartalsweise, gemeinsam mit SK-Audit):** Welche Kunden haben AutoGen-PoCs/Agents? Erfassen: Kunde, v0.2-vs-v0.4, GroupChat-Pattern, Code-Execution-Nutzung, AutoGen-Studio-Dependency.
2. **Pro PoC: Migrations-Assessment (½–1 Tag)** — Version-Check, Pattern-Inventar, Docker-Code-Execution ja/nein, Entscheidung: **Migrate vs. Stop**.
3. **Research-Pattern-Check:** Falls Kunde Debate/Self-Critique/Teacher-Learner nutzt → ehrliche Einschätzung, dass MAF diese Patterns nicht als First-Class hat — Neu-Modellierung als Workflow-Graph.
4. **Bestandskunden-Kommunikation:** *{TODO: Wer bei Journai ist Owner des AutoGen-Migration-Gesprächs? — sollte identisch mit SK-/MAF-Ansprechpartner sein. Klären in nächstem Team-Sync.}*

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | deprecated / maintenance mode (community-managed) · v0.4 bleibt auf GitHub verfügbar |
| **GA-Datum (historisch)** | 2023-09 (erster OSS-Release MSR) · 2024-03 (v0.2 stabil) · 2024-Q4 (v0.4 „AgentChat" Rewrite) · 2025-09-30 (letztes MS-Release: python-v0.7.5) |
| **EOS / End of Support** | **Kein hartes MS-EOS** — Repo bleibt, aber **keine neuen Features, keine Enterprise-SLAs**. MS empfiehlt offiziell MAF für Neu-Projekte |
| **Standalone-Preis** | kostenlos (MIT), nur Backend-Kosten (Modell-Endpunkt) |
| **Lizenz-Bundle** | keiner |
| **Voraussetzung** | Azure OpenAI / OpenAI / Anthropic / Ollama-Endpunkt |
| **Region-Verfügbarkeit** | global (SDK) — Region-Frage ergibt sich aus Modell-Endpunkt |
| **Hidden Costs** | **Opportunitäts-Kosten:** Keine Integration in Foundry Control Plane, kein Agent-365-Governance, keine Entra-Agent-ID-Hooks, keine MAF-Middleware. Wer auf AutoGen bleibt, klinkt sich vom MS-Agent-Stack ab |
| **Upgrade-Pfad** | → **[[Microsoft Agent Framework]]** (diese Note + MS-Migration-Guide sind die Basis) |

---

## Kernkonzept (historisch)

### Was es war

AutoGen war Microsoft Research's Antwort auf die Frage „Wie bringt man LLMs dazu, miteinander zu reden, bis die Aufgabe gelöst ist?". Zentrale Primitives:

- **`ConversableAgent` (v0.2)** — Basis-Agent mit Messaging-API. Jeder Agent konnte Nachrichten senden und empfangen, Loop wurde vom Framework gesteuert. Grundbaustein für alle höheren Patterns.
- **`AssistantAgent` + `UserProxyAgent` (v0.2-Idiom)** — das klassische Duo: Assistant schreibt Code/Antworten, UserProxy führt Code aus und vertritt den User. Self-Play zwischen den beiden war die originelle „Agents reden mit Agents"-Erfahrung.
- **`GroupChat` + `GroupChatManager` (v0.2)** — mehrere Agents im selben Kanal, Manager wählt den nächsten Speaker (Round-Robin, Auto-Select via LLM, oder Custom-Function). Vorlage für alle späteren Multi-Agent-Orchestrations.
- **`code_execution_config` + Docker-Sandbox (v0.2)** — UserProxyAgent konnte ausgeführten Code in Docker-Container isolieren. Integraler Teil der „Agent schreibt & testet Code"-Demo-Story.
- **`AssistantAgent` + `RoundRobinGroupChat` / `MagenticOneGroupChat` / `SelectorGroupChat` / `Swarm` (v0.4)** — Rewrite auf event-driven async Runtime. `Team`-Abstraktion mit pluggable Termination Conditions (`StopAfterNMessages`, `TextMentionTermination`).
- **AutoGen Studio** — No-Code-GUI zum visuellen Komponieren von Agent-Teams. Research-Prototyp, ausdrücklich nicht production-ready, aber stark in Conference-Demos genutzt.

Die Design-Philosophie war **„Agents als Konversations-Teilnehmer"** — jeder Agent ein Actor in einem Gespräch, Framework steuert Turn-Taking. Genau diese Konversations-Metapher hat MAF in **Workflow-mit-typisierten-Kanten** umgebaut: Daten fließen über Edges, nicht Messages in einem geteilten Chat.

### Warum deprecated

Die Konsolidierung mit [[deprecated/Semantic Kernel]] unter [[Microsoft Agent Framework]] ist keine kosmetische Umbenennung, sondern eine strategische Bereinigung:

1. **Zwei Frameworks mit überlappenden Zielen waren Verwirrung.** SK (Enterprise, .NET-first) vs. AutoGen (Research, Python-first, Multi-Agent-Fokus) — Kunden wussten nie, welches zu wählen war. MAF bündelt beides unter einer klaren Abstraktion.
2. **Research-Fokus ≠ Enterprise-Anforderung.** AutoGen war MSR-getrieben — experimentelle Features (Teacher-Learner, Debate, Reflection) hatten keinen Production-Path. Enterprise-Kunden brauchten Tracing, Checkpointing, Governance — das lieferten weder v0.2 noch v0.4.
3. **Die „Team als shared chat"-Abstraktion war leaky.** Alle Agents sahen alle Nachrichten, Turn-Taking war fragil, Human-in-the-Loop musste außerhalb des Frameworks gebaut werden. MAF dreht das um: Workflow-Graph mit expliziten Edges, Request-Response-Pausen eingebaut.
4. **AutoGen-Ursprungs-Community ist weggegangen.** Die originalen Autoren haben als [AG2](https://github.com/ag2ai/ag2) geforkt — MS hat damit den Research-Community-Anker verloren. Wer MS-Commitment will, muss zu MAF. Wer Community-Dynamik will, geht zu AG2.

---

## Migrationspfad zu [[Microsoft Agent Framework]]

### API-Äquivalenzen — Cheat-Sheet

| AutoGen (v0.2 / v0.4) | Microsoft Agent Framework | Anmerkung |
|-----------------------|----------------------------|-----------|
| `autogen` / `autogen-agentchat` (Package) | `agent-framework` + Provider-Packages (`agent-framework-openai`, `-foundry` …) | Modular statt monolithisch |
| `ConversableAgent` (v0.2) | **`Agent`** | Konzept-Sprung: MAF-Agent ist Workflow-Node, nicht Chat-Teilnehmer |
| `AssistantAgent` (v0.2 + v0.4) | **`Agent`** | Einheitlicher Typ · Multi-Turn-Default (kein `max_tool_iterations` nötig) |
| `UserProxyAgent` (v0.2) | **entfällt** → Request-Response-API: `ctx.request_info()` + `@response_handler` | **konzeptioneller Bruch** — HITL ist First-Class in MAF |
| `GroupChat` + `GroupChatManager` (v0.2) | `SequentialBuilder` / `MagenticBuilder` / `ConcurrentBuilder` | Speaker-Selection-Logik wird zu Workflow-Edge-Routing |
| `RoundRobinGroupChat` (v0.4) | **`SequentialBuilder`** | Direkte Übersetzung · shared conversation bleibt erhalten |
| `MagenticOneGroupChat` (v0.4) | **`MagenticBuilder`** | Manager-Agent explizit, `max_round_count` / `max_stall_count` / `max_reset_count` |
| `SelectorGroupChat` (v0.4) | **🚧 Roadmap** | Noch nicht verfügbar — Workaround: Custom-Executor mit LLM-Speaker-Selection |
| `Swarm` / Handoff (v0.4) | **🚧 Roadmap** | Noch nicht verfügbar — Workaround: `MagenticBuilder` oder Custom-Handoff-Executor |
| `FunctionTool` / `register_function` | `@tool`-Decorator | Auto-Schema aus Type-Hints + Pydantic |
| `code_execution_config` + Docker-Sandbox | **Hosted Code Interpreter** (OpenAI/Foundry) oder **Hyperlight CodeAct** (MAF 1.1+) | Architektur-Wechsel · Docker-Sandbox-Pattern entfällt |
| `StopAfterNMessages` / `TextMentionTermination` | Workflow-Edge-Conditions / `max_round_count` in Magentic | Termination wird zu Workflow-Logik |
| `ChatCompletionCache`-Wrapper | 🚧 Planned | Caching bisher manuell via Middleware |
| AutoGen Studio (UI) | **kein 1:1-Ersatz** | Foundry Portal Playground evaluieren oder eigenes UI |
| `AnthropicChatCompletionClient` / `OllamaChatCompletionClient` | 🚧 Planned | Aktuell OpenAI + Foundry; Gemini kommt, Anthropic/Ollama noch nicht |

### Minimal-Migration: v0.4 → MAF (Python)

**Vorher (AutoGen v0.4 AgentChat — RoundRobinGroupChat):**

```python
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import StopAfterNMessages
from autogen_ext.models.openai import OpenAIChatCompletionClient

client = OpenAIChatCompletionClient(model="gpt-5")

writer = AssistantAgent(name="writer", model_client=client,
                       system_message="Du schreibst Entwürfe.")
reviewer = AssistantAgent(name="reviewer", model_client=client,
                         system_message="Du reviewst Entwürfe.")

team = RoundRobinGroupChat(
    participants=[writer, reviewer],
    termination_condition=StopAfterNMessages(6),
)
result = await team.run(task="Schreibe einen Einleitungsabsatz zu MAF.")
```

**Nachher (MAF — SequentialBuilder):**

```python
from agent_framework.openai import OpenAIChatClient
from agent_framework.orchestrations import SequentialBuilder

client = OpenAIChatClient(model="gpt-5")

writer = client.as_agent(name="writer",
                        instructions="Du schreibst Entwürfe.")
reviewer = client.as_agent(name="reviewer",
                          instructions="Du reviewst Entwürfe.")

workflow = SequentialBuilder(participants=[writer, reviewer]).build()

async for event in workflow.run_stream("Schreibe einen Einleitungsabsatz zu MAF."):
    if event.type == "output":
        conversation = event.data  # list[Message]
```

**Was verschwindet:** explizite `termination_condition`-Klasse, `model_client`-Parameter-Pflicht (via `client.as_agent()` gekoppelt), `team.run()`-Blocking-Call — stattdessen `run_stream()` mit Event-Loop.

### Minimal-Migration: v0.2 (Classic) → MAF (Python)

**Vorher (AutoGen v0.2 — ConversableAgent + UserProxy):**

```python
from autogen import AssistantAgent, UserProxyAgent

assistant = AssistantAgent(name="assistant",
                          llm_config={"model": "gpt-4"})
user_proxy = UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",
    code_execution_config={"work_dir": "coding", "use_docker": True},
)
user_proxy.initiate_chat(assistant, message="Berechne π auf 10 Stellen.")
```

**Nachher (MAF — Agent + Hosted Code Interpreter):**

```python
from agent_framework.openai import OpenAIChatClient

client = OpenAIChatClient(model="gpt-5")
code_tool = client.get_code_interpreter_tool()  # hosted, kein Docker

agent = client.as_agent(
    name="assistant",
    instructions="Löse numerische Aufgaben mit dem Code-Interpreter.",
    tools=[code_tool],
)
response = await agent.run("Berechne π auf 10 Stellen.")
print(response.text)
```

**Was verschwindet:** `UserProxyAgent` (HITL über Request-Response-API), `code_execution_config` + Docker (Hosted Code Interpreter oder Hyperlight), `initiate_chat`-Idiom (einfaches `agent.run()`).

### Was NICHT 1:1 übernommen wird

| AutoGen-Feature | Status in MAF | Migrations-Aktion |
|-----------------|---------------|-------------------|
| **`UserProxyAgent` als HITL-Platzhalter** | konzeptionell ersetzt | Request-Response-API (`ctx.request_info()` + `@response_handler`) — sauberer, aber Code-Umbau |
| **`code_execution_config` mit Docker** | ersetzt | Hosted Code Interpreter (Provider-seitig) oder Hyperlight CodeAct (MAF 1.1+) |
| **`SelectorGroupChat` (v0.4)** | 🚧 Roadmap | Custom-Executor mit LLM-Speaker-Selection bauen oder auf `MagenticBuilder` umsteigen |
| **`Swarm` / Handoff-Pattern (v0.4)** | 🚧 Roadmap | Custom-Handoff-Executor (Workflow-Edge mit Routing-Logik) |
| **Debate / Self-Critique / Multi-Step Reflection** | **nicht als First-Class-Pattern** | Als Workflow-Graph neu modellieren (z.B. Writer → Critic → Writer als Loop-Executor); Konsens-Aggregation via `ConcurrentBuilder` + Custom-Aggregator |
| **Teacher-Learner-Pattern** | **nicht übernommen** | Research-Feature ohne Production-Path; neu bauen oder Pattern aufgeben |
| **`ChatCompletionCache`-Wrapper** | 🚧 Planned | Manuell via Middleware |
| **Anthropic / Ollama Model-Clients** | 🚧 Planned | Aktuell nur OpenAI + Foundry; für Anthropic/Ollama Provider-Workaround |
| **AutoGen Studio (No-Code-UI)** | **kein Äquivalent** | Foundry Portal Playground evaluieren oder eigenes UI bauen |
| **Distributed Runtime (v0.4, experimental)** | 🚧 Planned | MAF aktuell single-process — für verteilte Szenarien warten |
| **Event-Driven Core Runtime (v0.4)** | konzeptionell anders | MAF nutzt typisierten Workflow-Graph statt Actor-Messages |

### Migrations-Runbook (pro Agent-Team, 5 Schritte)

1. **Assessment (½–1 Tag)** — Version klären (v0.2 vs v0.4), Pattern inventarisieren (RoundRobin / Magentic / Selector / Swarm / GroupChat-Custom), Code-Execution-Nutzung, AutoGen-Studio-Dependency. Entscheidung: **Migrate · Stop · Fork zu AG2**.
2. **Package-Swap** — `autogen` / `autogen-agentchat` / `autogen-ext` → `agent-framework` + Provider-Sub-Packages.
3. **Agent-Creation umstellen** — `AssistantAgent(model_client=…)` → `client.as_agent(instructions=…, tools=[…])`. `UserProxyAgent` entfernen, durch Request-Response-API oder Hosted Code Interpreter ersetzen.
4. **Team-Orchestration übersetzen** — `RoundRobinGroupChat` → `SequentialBuilder`; `MagenticOneGroupChat` → `MagenticBuilder` (mit explizitem Manager-Agent); `GroupChatManager` v0.2 → Workflow-Builder je nach Intent. **Hier bei Custom-GroupChat-Logik die meiste Zeit einplanen.**
5. **Tests + Tracing** — MAF-OTel-Tracing aktivieren (→ App Insights / Foundry Control Plane), Eval-SDK für Regression-Tests. **Bonus:** Checkpointing via `FileCheckpointStorage` einrichten — AutoGen hatte das nie.

---

## Limitierungen & Fallstricke (bei der Migration)

### Was die Migration NICHT leistet

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Kein automatisches Konvertierungs-Tool** | Handarbeit — Mapping-Muster sind aber klar |
| **`Swarm` / `SelectorGroupChat` noch nicht in MAF** | Custom-Executor bauen oder warten auf Roadmap-Release |
| **Research-Pattern (Debate, Self-Critique, Teacher-Learner) nicht First-Class** | Als Workflow-Graph modellieren — kostet mehr Zeit als v0.4-Idiom |
| **Docker-Sandbox ≠ Hyperlight-Sandbox** | Architektur-Wechsel; bei EU-Regionen Verfügbarkeit prüfen |
| **AutoGen Studio-UI ist weg** | Foundry Portal Playground evaluieren oder eigenes UI |
| **Anthropic/Ollama-Clients fehlen** | Warten oder eigener Provider-Adapter |

### Typische Fallstricke

- **„v0.2 und v0.4 sind eh ähnlich"** — falsch. v0.2→MAF ist 2–3× aufwändiger als v0.4→MAF, weil `UserProxyAgent` + `GroupChatManager` + Docker-Sandbox drei konzeptionelle Brüche gleichzeitig sind. *Gegenmittel: Version beim Assessment als erste Frage.*
- **`UserProxyAgent` 1:1 nachbauen wollen** — verfehlt das Design-Prinzip von MAF. HITL ist nun Request-Response, nicht Agent. *Gegenmittel: Request-Response-Pattern erklären, nicht Code übersetzen.*
- **Research-Pattern unkritisch übernehmen** — Debate/Self-Critique waren in AutoGen-Demos eindrucksvoll, aber selten productivated. Bei Migration ehrlich fragen: „Brauchen wir das Pattern oder hatten wir einfach Zeit damit zu spielen?". *Gegenmittel: Business-Case-Check vor Pattern-Umbau.*
- **AutoGen Studio-Dependency unterschätzen** — Teams, die Demos/PoCs über die UI gebaut haben, haben **keinen Code** — die Migration ist eigentlich eine Neu-Implementierung. *Gegenmittel: Früh klären, ob Code existiert oder nur Studio-Config.*
- **AG2-Fork als „einfacheren Weg" wählen** — klingt attraktiv (weniger Änderungen), bedeutet aber Exit aus MS-Ökosystem (kein Foundry, kein Agent 365, kein Entra Agent ID). *Gegenmittel: Kunde muss aktive Entscheidung für OSS-Community treffen — nicht aus Migrations-Müdigkeit.*
- **Bestandskunden-Kommunikation zu spät** — wenn Kunde erst durch MS-Blog erfährt, ist Journai nicht mehr Primär-Quelle. *Gegenmittel: Proaktive Audit-Liste wie bei SK.*

---

## Bestandskunden-Kommunikation (intern Journai)

*{TODO: Owner identisch mit [[deprecated/Semantic Kernel]]- und [[Microsoft Agent Framework]]-Ansprechpartner. Klären in nächstem Team-Sync.}*

**Gesprächs-Template:**

> „AutoGen wurde nicht abgeschaltet, ist aber seit 2025-09 **im Maintenance Mode** — Microsoft committet keine neuen Features mehr, die Community um AG2 hat sich abgespalten. Microsoft empfiehlt offiziell **Microsoft Agent Framework** als Nachfolger. Für eueren PoC würden wir ein Migrations-Assessment (½–1 Tag) machen und dann entscheiden: Migration (3–8 Tage je nach Version) oder PoC-Abschluss. Kernfrage: Habt ihr den PoC produktiviert oder als Experiment gefahren? Wenn Experiment: Jetzt der gute Moment, Lessons-Learned zu sichern und mit MAF neu aufzusetzen."

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Migration Guide (offiziell, Python) | AutoGen → MAF Migration | https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/ | 2026-04-22 | **Primär-Quelle für API-Mapping + Code-Beispiele** |
| GitHub Archiv (v0.4 + v0.2 Docs) | microsoft/autogen | https://github.com/microsoft/autogen | 2026-04-22 | Maintenance-Mode-Hinweis, Community-Issues |
| v0.2→v0.4 Migration (historisch) | AutoGen AgentChat Migration | https://microsoft.github.io/autogen/dev/user-guide/agentchat-user-guide/migration-guide.html | 2026-04-22 | für v0.2-Bestandskunden: erst v0.4, dann MAF — oder direkt MAF |
| MAF Overview | Microsoft Agent Framework | https://learn.microsoft.com/en-us/agent-framework/overview/ | 2026-04-22 | Ziel-Framework-Dokumentation |
| Research Page | AutoGen at MSR | https://microsoft.github.io/autogen/ | 2026-04-22 | historischer Kontext · Research-Pattern-Katalog |
| AutoGen Studio | Studio User Guide | https://microsoft.github.io/autogen/dev/user-guide/autogenstudio-user-guide/index.html | 2026-04-22 | für Studio-abhängige Kunden |
| Devblogs (MAF + SK gemeinsam) | Agent Framework Devblog | https://devblogs.microsoft.com/agent-framework/ | 2026-04-22 | Konsolidierungs-Announcements |

### Secondary (Community / Analyse)

| Quelle | Link | Einschätzung |
|--------|------|--------------|
| VentureBeat | „Microsoft retires AutoGen and debuts Agent Framework" | https://venturebeat.com/ai/microsoft-retires-autogen-and-debuts-agent-framework-to-unify-and-govern | Klare Industry-Einordnung der Deprecation |
| European AI & Cloud Summit | MAF als Konvergenz von AutoGen + SK | https://cloudsummit.eu/blog/microsoft-agent-framework-production-ready-convergence-autogen-semantic-kernel | EU-Perspektive auf die Konsolidierung |
| AG2-Fork | ag2ai/ag2 GitHub | https://github.com/ag2ai/ag2 | Community-Alternative — **nicht MS-supportet**, für Kunden nur als bewusste OSS-Wahl |
| „AutoGen vs AG2" | gettingstarted.ai | https://www.gettingstarted.ai/autogen-vs-ag2/ | Erklärt den Fork-Hintergrund |

### Community-Diskussionen (Tertiary)

| Quelle | Link | Einschätzung |
|--------|------|--------------|
| AutoGen Studio Status | microsoft/autogen#4208 | https://github.com/microsoft/autogen/discussions/4208 | Studio-Zukunft unter v0.4 · Signal für Studio-Bestandskunden |

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive AutoGen-Deprecation + Migration zu MAF: v0.2 vs v0.4 Unterscheidung, API-Äquivalenzen, Code-Beispiele (RoundRobin→Sequential, ConversableAgent+UserProxy→Agent+HostedCI), Research-Features-Gap (Debate/Self-Critique nicht First-Class), AG2-Fork-Kontext, Code-Execution-Migration (Docker→Hyperlight), Bestandskunden-Kommunikation | https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/ |
| 2026-04-22 | Hongyu | Initial Stub — Migration-Pfad zu MAF | — |
