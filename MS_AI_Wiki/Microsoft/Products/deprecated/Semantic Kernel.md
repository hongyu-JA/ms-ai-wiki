---
watch: passive
status: deprecated
research_depth: deep
last_verified: 2026-04-22
aliases: [Semantic Kernel, SK]
moc:
  - "[[Microsoft MOC]]"
  - "[[Agents MOC]]"
---

# Semantic Kernel  🟡 DEPRECATED — konsolidiert in [[Microsoft Agent Framework]]

*Microsofts Enterprise-Agent-/Orchestrierungs-SDK der Jahre 2023–2025 (.NET-first, auch Python & Java). Mit [[Microsoft Agent Framework]] 1.0 (GA 2026-04-07) **konsolidiert**: SK + AutoGen laufen jetzt unter einem Dach. SK-v1.x bleibt in Wartung (Security + kritische Bugs) für **mindestens ein Jahr nach MAF-GA, also bis ~Q2 2027** — danach unklarer Zeitrahmen. Keine neuen Features mehr in SK, alle Innovation fließt in MAF. Hier dokumentiert als Bestandskunden-Migrationspfad.*

> **Analogie:** Wie LangChain v0.x → LangChain v1.0 — derselbe Konzept-Raum, aber bewusst neu geschnittene API. Wer auf SK gebaut hat, kommt inkrementell auf MAF; ein Drop-in-Replace ist es nicht.

> [!warning] Migration-Zeitfenster
> **Kein hartes EOS-Datum angekündigt** (Stand 2026-04). Microsoft committet: Support für SK v1.x „für mindestens ein Jahr nach MAF-GA" — das landet bei **frühestens 2027-04-07**. Praktisch heißt das: Bestandskunden können bis Ende 2026 entspannt planen, sollten aber **nicht über 2026 hinaus neue Features auf SK legen**. Feature-Fluss ist zu 100 % in MAF.

---

## Einsatz

### Job-to-be-done

*(Historisch — nicht mehr für Neu-Projekte.)* When I mit einem .NET- oder Python-Enterprise-Team einen Agent mit Plugins, Planner und Memory zusammensetzen wollte, I want to ein opinionated Framework mit klaren Primitives nutzen, so I can Prompt-Flows strukturiert bauen statt alles selbst um `ChatCompletion` zu wickeln.

**Heutiger Handlungsauftrag:** **Bestandskunden-Migration** zu [[Microsoft Agent Framework]] planen und begleiten.

### Trigger-Signale

- „Wir haben 2024/25 einen PoC / MVP mit Semantic Kernel gebaut — müssen wir jetzt sofort migrieren?" → **Nein, nicht sofort** (Support läuft ≥ 1 Jahr nach MAF-GA weiter), **aber** ja, Migration einplanen bevor neue Features gebraucht werden.
- „Unser SK-Agent nutzt Handlebars-Planner / Stepwise-Planner." → **Planner-Konzept ist weg** — migriert auf Function Calling / Orchestrator-Pattern in MAF.
- „Wir haben SK-Memory-Stores (Azure AI Search / Qdrant / Pinecone) im Einsatz." → Gute Nachricht: SK ≥ 1.38 hat `.as_agent_framework_tool()` auf VectorStore-Collections — Vector-Infra bleibt, nur der Agent wandert.
- „Unsere SK-Plugins sind mit `[KernelFunction]` annotiert." → In MAF entfällt das Attribut, `[Description]` optional — Migration ist eine Annotations-Säuberung.

### Einsatz-Szenarien

*(Nur Migrations-Szenarien.)*

1. **SK-.NET-Agent → MAF-.NET-Agent** — Standardpfad für Bestandskunden mit ChatCompletion-Agents. Namespace-Swap + Agent-Creation-Simplification, Thread → Session, `Invoke` → `Run`. Typisch 1–3 Beratertage pro Agent bei sauberer Code-Basis.
2. **SK-Python-Agent → MAF-Python-Agent** — Package-Swap `semantic-kernel` → `agent-framework-*` (modular), `@kernel_function` → einfache Python-Funktion, Kernel-Instanz entfällt. Python-Migration ist meist leichter als .NET, weil SK-Python-Historie kürzer ist.
3. **SK-Planner-Code (Handlebars/Stepwise) → MAF-Orchestrator** — zeitintensivster Fall. Planner-Logik wird zu Orchestrator-Pattern (Sequential / Handoff / GroupChat) umgedacht. 3–8 Tage pro Planner-Flow, weil Verantwortungs-Schnitt neu gelegt werden muss.
4. **Gradueller Pfad (SK + MAF parallel)** — SK-`KernelFunction` per `.as_agent_framework_tool()` in MAF weiterverwenden. Erlaubt Bestandskunden schrittweise Migration ohne Big-Bang.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Keine — beide OSS (MIT). Kosten nur im Modell-Backend (Azure OpenAI / Foundry / OpenAI direkt) |
| **Tenant / Infrastruktur** | Bestehende Azure-/Modell-Ressourcen können meist 1:1 weiterverwendet werden |
| **Skills / Rollen** | .NET 8+ oder Python 3.11+ Entwickler mit SK-Erfahrung — Migration ist **kein** Junior-Task, weil Thread-/Session-Semantik neu ist |
| **Compliance-Rahmen** | Unverändert — Framework-Tausch ändert Datenfluss nicht, solange Modell-Endpunkt gleich bleibt |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | 1–3 Tage pro Single-Agent ohne Planner; 3–8 Tage pro Agent mit Handlebars/Stepwise-Planner; +2 Tage wenn eigene Memory-Store-Adapter |
| **Laufende Lizenzkosten** | unverändert gegenüber SK — reines Code-Projekt |
| **Laufender Betrieb** | nach Migration tendenziell besser (sauberer getrennte Abstraktionen, bessere Tracing-Hooks in MAF) |

### Empfehlung

**Status:** 🔴 **Meiden für Neu-Projekte** · 🟡 **Planmäßige Migration für Bestandskunden bis Q4 2026**

**Nächster Schritt für Journai:**
1. **Bestandskunden-Audit (quartalsweise):** Welche Kunden haben SK-basierte PoCs oder produktive Agents? Intern-Tabelle pflegen (Kunde, SK-Version, Planner ja/nein, Memory-Stores).
2. **Pro identifizierter SK-Deployment:** Migrations-Assessment anbieten (½ Tag), Ergebnis: Aufwandsschätzung + Migrations-Sprint.
3. **Migration-Runbook pflegen** (diese Note als Basis, Code-Beispiele in MAF-Note).
4. **Bestandskunden-Kommunikation:** *{TODO: Wer bei Journai ist Owner des SK-Migration-Gesprächs? — vermutlich derselbe Ansprechpartner wie für [[Microsoft Agent Framework]]-Einführung. Klären in nächstem Team-Sync.}*

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | deprecated (konsolidiert, nicht abgeschaltet) · SK v1.x bleibt in Wartung |
| **GA-Datum (historisch)** | 2023-05 (erste Releases) / 2024-03 (v1.0 .NET) / 2024-Q2 (v1.0 Python) |
| **EOS / End of Support** | **kein hartes Datum** angekündigt (Stand 2026-04). Commitment: Support ≥ 1 Jahr nach MAF-GA → frühestens **2027-04-07** (eigene Einschätzung auf Basis des MS-Statements) |
| **Standalone-Preis** | kostenlos (MIT), nur Backend-Kosten (Modell-Endpunkt) |
| **Lizenz-Bundle** | keiner |
| **Voraussetzung** | Azure OpenAI / OpenAI / Foundry-Endpunkt |
| **Region-Verfügbarkeit** | global (SDK) — Region-Frage ergibt sich aus Modell-Endpunkt |
| **Hidden Costs** | Keine technischen — aber: **Opportunitätskosten durch stehengebliebene Features.** MAF bekommt Gemini-Client, MCP-Updates, Hyperlight-Sandbox, Foundry-Toolboxes — SK nicht. |
| **Upgrade-Pfad** | → **[[Microsoft Agent Framework]]** (diese Note ist die Migrationsanleitung) |

---

## Kernkonzept (historisch)

### Was es war

Semantic Kernel war Microsofts Antwort auf LangChain — ein Framework, das LLM-Aufrufe in eine typisierte, Enterprise-taugliche Abstraktion hob. Die zentralen Primitives:

- **Kernel** — zentrale DI-Container-artige Komponente, die Modell-Services, Plugins und Memory zusammenhielt. Jeder Agent brauchte eine Kernel-Instanz.
- **Plugin** — Sammlung von `KernelFunction`s (annotierte Methoden oder Prompt-Templates), die der Kernel dem Modell als Tools anbot.
- **Planner** — experimentelle Orchestrierungs-Logik: Sequential (deterministische Kette), Stepwise (ReAct-ähnlich), **Handlebars** (deklarativ mit Handlebars-Template). Sollten LLMs helfen, mehrstufige Pläne zu erzeugen.
- **Memory** — Abstraktion über Vector-Stores (Azure AI Search, Qdrant, Pinecone, Chroma, Redis …) für RAG- und Erinnerungs-Szenarien.
- **Thread** — Konversations-Container mit Nachrichten-History, typspezifisch pro Provider (`ChatHistoryAgentThread`, `AzureAIAgentThread`, `OpenAIAssistantAgentThread`).

Die Design-Philosophie war **„alles über Kernel"** — der Kernel war die zentrale Instanz, von der aus Plugins, Services und Agents orchestriert wurden. Genau diese Zentralität hat MAF bewusst aufgegeben: der Kernel ist weg, Agent und Client sind direkt verbunden.

### Warum deprecated

Die Konsolidierung mit AutoGen unter einem Dach (MAF) ist keine kosmetische Umbenennung, sondern eine strategische Wette:

1. **Zwei parallele Frameworks waren Verwirrung.** SK (Enterprise, .NET-first) vs. AutoGen (Research, Python-first, Multi-Agent-Fokus) — Kunden wussten nie, welches zu wählen war. MAF bündelt beides.
2. **Der Kernel-Layer wurde als unnötige Indirection erkannt.** Moderne `IChatClient`-Abstraktionen (aus `Microsoft.Extensions.AI`) erlauben direkte Agent-Erzeugung via `chatClient.AsAIAgent(...)`. Der Kernel-Zwischenschritt entfällt.
3. **Planner waren Dead-End.** Function Calling der Modelle wurde so gut, dass explizite Planner-Templates redundant wurden. Handlebars-/Stepwise-Planner werden in MAF nicht weitergepflegt — Orchestrator-Pattern (Sequential / Handoff / GroupChat) ist der neue Weg.
4. **Thread-Typen waren Leaky Abstraction.** Der Caller musste den passenden Thread-Typ kennen (`AzureAIAgentThread` vs. `OpenAIAssistantAgentThread`). MAF dreht das um: der Agent erzeugt sich seine Session.

---

## Migrationspfad zu [[Microsoft Agent Framework]]

### API-Äquivalenzen — Cheat-Sheet

| Semantic Kernel | Microsoft Agent Framework | Anmerkung |
|-----------------|----------------------------|-----------|
| `Microsoft.SemanticKernel` (NS .NET) | `Microsoft.Agents.AI` + `Microsoft.Extensions.AI` | Namespace-Swap + neue Message-Types |
| `semantic_kernel` (Package Python) | `agent-framework-core` + Provider-Packages (`agent-framework-openai`, `-foundry`, `-copilotstudio`, `-mem0` …) | Modular statt monolithisch |
| `Kernel` | **entfällt** | Agent wird direkt vom ChatClient erzeugt |
| `ChatCompletionAgent`, `AzureAIAgent`, `OpenAIAssistantAgent` | **ein** `ChatClientAgent` (.NET) / `Agent` (Python) | Typ-Konsolidierung über `IChatClient` |
| `KernelFunction` + `[KernelFunction]` Attribut | Einfache Methode + optionales `[Description]` / `@tool` | Attribut-Zwang entfällt |
| `Plugin` / `KernelPlugin` | **kein Äquivalent** — Tool-Liste direkt am Agent | Gruppierung nur noch via Klassen-Methoden |
| `AgentThread` (typspezifisch) | `AgentSession` (.NET) / `AgentThread` (Python, einheitlich) | Agent erzeugt selbst: `agent.CreateSessionAsync()` / `agent.get_new_thread()` |
| `agent.InvokeAsync()` / `invoke_stream()` | `agent.RunAsync()` / `run(..., stream=True)` | Methoden-Rename + `AgentResponse`-Return |
| `KernelArguments` + `PromptExecutionSettings` | `AgentRunOptions` / `ChatClientAgentRunOptions` | Einfachere Options-API |
| **Sequential / Stepwise / Handlebars Planner** | **entfällt** — Orchestrator-Pattern (Sequential / Handoff / GroupChat) oder Function Calling | **zeitintensivste Stelle der Migration** |
| SK Memory-Stores | externer State-Store (Cosmos DB, Redis, Azure Storage) + optional `agent-framework-mem0` | Memory-Abstraktion bewusst rausgezogen |
| SK VectorStore (`AzureAISearchCollection` etc.) | **bleibt nutzbar** via `.as_agent_framework_tool()` auf `create_search_function` | Brücke ab SK ≥ 1.38 |

### Minimal-Migration: Vorher / Nachher (.NET)

**Vorher (SK):**

```csharp
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents;

Kernel kernel = Kernel
    .CreateBuilder()
    .AddOpenAIChatCompletion(modelId, apiKey)
    .Build();

KernelFunction fn = KernelFunctionFactory.CreateFromMethod(GetWeather);
kernel.Plugins.Add(KernelPluginFactory.CreateFromFunctions("Weather", [fn]));

ChatCompletionAgent agent = new()
{
    Kernel = kernel,
    Instructions = "Du bist ein Wetter-Assistent."
};

AgentThread thread = new ChatHistoryAgentThread();
await foreach (var item in agent.InvokeAsync("Wetter Zürich?", thread))
    Console.WriteLine(item.Message);
```

**Nachher (MAF):**

```csharp
using Microsoft.Extensions.AI;
using Microsoft.Agents.AI;

AIAgent agent = chatClient.AsAIAgent(
    instructions: "Du bist ein Wetter-Assistent.",
    tools: [AIFunctionFactory.Create(GetWeather)]
);

AgentSession session = await agent.CreateSessionAsync();
AgentResponse response = await agent.RunAsync("Wetter Zürich?", session);
Console.WriteLine(response.Text);
```

**Was verschwindet:** Kernel-Builder, Plugin-Wrapping, explizite Thread-Typ-Wahl, async-iterator-Pattern für Non-Streaming.

### Minimal-Migration: Vorher / Nachher (Python)

**Vorher (SK):**

```python
from semantic_kernel import Kernel
from semantic_kernel.agents import ChatCompletionAgent
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
from semantic_kernel.functions import kernel_function

class WeatherPlugin:
    @kernel_function(description="Get weather")
    def get_weather(self, location: str) -> str:
        return f"{location}: sunny"

agent = ChatCompletionAgent(
    service=OpenAIChatCompletion(),
    instructions="Du bist ein Wetter-Assistent.",
    plugins=[WeatherPlugin()],
)
response = await agent.get_response("Wetter Zürich?")
```

**Nachher (MAF):**

```python
from agent_framework.openai import OpenAIChatClient

def get_weather(location: str) -> str:
    """Get weather for a location."""
    return f"{location}: sunny"

agent = OpenAIChatClient().as_agent(
    instructions="Du bist ein Wetter-Assistent.",
    tools=get_weather,
)
response = await agent.run("Wetter Zürich?")
print(response.text)
```

**Was verschwindet:** `Kernel`-Instanz, `@kernel_function`-Decorator, Plugin-Klassen-Zwang.

### Was NICHT 1:1 übernommen wird

| SK-Feature | Status in MAF | Migrations-Aktion |
|------------|----------------|-------------------|
| **Handlebars Planner** | gelöscht | Logik als Orchestrator-Sequential oder Function Calling neu bauen |
| **Stepwise Planner (v1)** | gelöscht | Function Calling + Loop / Orchestrator-Handoff |
| **Sequential Planner (Action)** | gelöscht | Orchestrator-Sequential |
| **SK-Memory-Stores (eigene Abstraktion)** | ausgelagert | Externer State-Store (Cosmos, Redis) oder `agent-framework-mem0` |
| **Thread-Typen (provider-spezifisch)** | konsolidiert | Agent erzeugt Session selbst — meist kein Code-Eingriff nötig |
| **Plugin-Klassen als Pflicht-Container** | optional | Tool-Liste direkt am Agent, Klasse nur noch bei gemeinsamem State |
| **`KernelArguments` / `PromptExecutionSettings`** | ersetzt | TypedDict-Options (Python) / `ChatClientAgentRunOptions` (.NET) |
| **Java-SK** | **keine MAF-Java-Version angekündigt** | *TODO: Bei Java-Bestandskunden klären — ggf. auf MAF-REST-API über OpenAI-kompatibles Gateway setzen (eigene Einschätzung)* |

### Migrations-Runbook (pro Agent, 5 Schritte)

1. **Assessment (½ Tag)** — SK-Version, Planner-Nutzung, Memory-Stores, Plugin-Anzahl inventarisieren. Entscheidung: Big-Bang oder graduell (via `.as_agent_framework_tool()`).
2. **Package-Swap** — `.NET`: `Microsoft.SemanticKernel.*` → `Microsoft.Agents.AI` + `Microsoft.Extensions.AI`. Python: `semantic-kernel` → `agent-framework` (meta-package) oder gezielte Sub-Packages.
3. **Agent-Creation umstellen** — `Kernel`-Builder → `chatClient.AsAIAgent(...)`. Plugin-Registrierung → `tools: [...]` am Agent.
4. **Planner-Ersatz bauen** (wenn vorhanden) — Handlebars/Stepwise-Logik als Orchestrator-Pattern oder reines Function Calling re-implementieren. **Hier die meiste Zeit einplanen.**
5. **Tests + Tracing** — MAF-Tracing (OTel → App Insights / Foundry Control Plane) einschalten, Eval-SDK für Regression-Tests aufsetzen.

---

## Limitierungen & Fallstricke (bei der Migration)

### Was die Migration NICHT leistet

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Kein automatisches Konvertierungs-Tool** | Handarbeit — aber überschaubar dank klarer Muster |
| **Planner-Logik muss neu gedacht werden** | Siehe Schritt 4 oben — Orchestrator-Pattern oder Function Calling |
| **SK-spezifische Memory-Store-Eigenbauten** | Entweder via `.as_agent_framework_tool()` auf VectorStore erhalten oder externen State-Store einführen |
| **Java-SK hat keinen MAF-Pfad** | Bestandskunden-Problem, separate Entscheidung nötig |

### Typische Fallstricke

- **Big-Bang-Migration unterschätzen** — Teams denken „ist ja dasselbe Team, API-nah". Stimmt für Single-Agent, aber Planner-Flows brechen die Annahme. *Gegenmittel: Single-Plugin-Pilot, dann inkrementell.*
- **SK-Memory-Stores 1:1 kopieren wollen** — MAF hat die Memory-Abstraktion bewusst rausgezogen. Nicht nachbauen, stattdessen externen State-Store oder `agent-framework-mem0` nutzen.
- **Planner-Code als Orchestrator 1:1 nachbauen** — verfehlt den Punkt der Konsolidierung. *Gegenmittel: Frage „welches Tool deckt das eigentlich ab?" vor „welches Orchestrator-Pattern?".*
- **Thread-Lifecycle-Annahmen** — in SK war Thread-Deletion-API am Thread selbst. In MAF nicht mehr garantiert. *Gegenmittel: Session-IDs im Caller tracken, Cleanup über Provider-SDK.*
- **`[KernelFunction]` in MAF-Code lassen** — läuft, aber unnötig. *Gegenmittel: Beim Review entfernen, `[Description]` belassen.*
- **Bestandskunden-Kommunikation zu spät** — wenn Kunde erst durch MS-Blog-Post erfährt, ist die Journai-Beratung nicht mehr Primär-Quelle. *Gegenmittel: Proaktiv auf Kunden zugehen, die SK im Einsatz haben (Audit-Liste führen).*

---

## Bestandskunden-Kommunikation (intern Journai)

*{TODO: Wer ist Owner? — vermutlich derselbe Ansprechpartner wie für [[Microsoft Agent Framework]]-Einführung, weil Migrations-Gespräch automatisch in MAF-Adoption mündet. Klären in nächstem Team-Sync.}*

**Gesprächs-Template:**

> „Semantic Kernel wird nicht abgeschaltet, aber Microsoft hat es mit AutoGen zu **Microsoft Agent Framework** konsolidiert. Support läuft mindestens bis Q2 2027. Wir empfehlen, die Migration bis Q4 2026 zu planen — nicht wegen akutem EOS-Druck, sondern weil alle neuen Features (Gemini-Integration, MCP-Updates, Code-Sandbox) nur noch in MAF kommen. Für eueren PoC würde die Migration ca. [X] Tage dauern — wir machen gerne ein Assessment."

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Migration Guide (offiziell, .NET + Python) | SK → MAF Migration | https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-semantic-kernel/ | 2026-04-22 | **Primär-Quelle für Migrations-Details** |
| Migration Guide (RC-Zeit, .NET-Detail) | SK → MAF RC Migration | https://learn.microsoft.com/en-us/semantic-kernel/support/migration/agent-framework-rc-migration-guide | 2026-04-22 | ergänzende Code-Beispiele |
| Deprecation-Context | „Semantic Kernel and Microsoft Agent Framework" | https://devblogs.microsoft.com/agent-framework/semantic-kernel-and-microsoft-agent-framework/ | 2026-04-22 | **Support-Commitment ≥ 1 Jahr nach MAF-GA** |
| Deprecation Package-Liste | „SK: Package previews, Graduations & Deprecations" | https://devblogs.microsoft.com/semantic-kernel/semantic-kernel-package-previews-graduations-deprecations/ | 2026-04-22 | welche SK-Packages konkret auf welchen MAF-Pfad |
| Planner-Archiv | „Migrating from Sequential/Stepwise to Handlebars/Stepwise" | https://devblogs.microsoft.com/agent-framework/migrating-from-the-sequential-and-stepwise-planners-to-the-new-handlebars-and-stepwise-planner/ | 2026-04-22 | historisch — Planner-Landschaft vor Deprecation |
| GitHub Archiv | microsoft/semantic-kernel | https://github.com/microsoft/semantic-kernel | 2026-04-22 | Issues / Community-Migrations-Erfahrung |
| Docs Hub (historisch) | SK Learn | https://learn.microsoft.com/en-us/semantic-kernel/ | 2026-04-22 | Referenz-Dokumentation für Bestandscode |
| Devblogs | SK Blog (jetzt gemeinsam mit MAF) | https://devblogs.microsoft.com/semantic-kernel/ | 2026-04-22 | Deprecation-Hinweise, Release-Notes SK-v1.x |

### Community-Diskussionen (Tertiary)

| Quelle | Link | Einschätzung |
|--------|------|--------------|
| GitHub Discussion „Wird SK deprecated?" | https://github.com/microsoft/semantic-kernel/discussions/12299 | Offizielle MS-Antworten zum Support-Zeitrahmen |
| GitHub Discussion „The Future?" | https://github.com/microsoft/semantic-kernel/discussions/12779 | Community-Signal zur Migrationsreife |
| GitHub Discussion „MAF vs SK?" | https://github.com/microsoft/agent-framework/discussions/1127 | Vergleichs-Argumente aus der Community |

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive SK-Deprecation + Migration-Pfad zu MAF: API-Äquivalenzen, Code-Beispiele (.NET + Python), Support-Timeline (≥ 1 Jahr nach MAF-GA → ~Q2 2027), Planner-Ersatz, Bestandskunden-Kommunikation | https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-semantic-kernel/ |
| 2026-04-22 | Hongyu | Initial Stub — Migration-Pfad zu MAF | — |
