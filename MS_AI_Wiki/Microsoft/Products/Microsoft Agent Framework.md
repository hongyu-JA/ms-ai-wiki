---
type: product-note
slug: microsoft-agent-framework
aliases:
  - MAF
  - Agent Framework
tier: 1
watch: close
status: ga
lifecycle: active
vendor: Microsoft
moc:
  - '[[Microsoft MOC]]'
  - '[[Agents MOC]]'
tags:
  - agents
  - framework
  - pro-code
created: 2026-04-21
updated: 2026-04-21
zuletzt_gesichtet: 2026-04-21
---

# Microsoft Agent Framework

## 1. Elevator Pitch + Analogie

Microsoft Agent Framework (MAF) ist das **Pro-Code-Framework von Microsoft, um produktive Agenten und Multi-Agent-Systeme zu bauen** — .NET und Python, Tool-Use, Orchestrierung, Observability-Hooks inklusive. **Analogie:** Wie LangGraph oder CrewAI, aber mit direktem Anschluss an Foundry, M365 Agents SDK und Entra.

## 2. Einsatz

**Job-to-be-done:** Ein zuverlässiger, wartbarer Agent, der mehrere Tools orchestriert und in eine Produktiv-Infrastruktur passt — nicht ein Notebook-Prototyp.

**Trigger-Signale beim Kunden:**
- "Unser Copilot-Studio-Bot reicht nicht mehr, wir brauchen Code-Kontrolle."
- "Wir hatten Semantic Kernel im Einsatz, was jetzt?"
- "Wir wollen Multi-Agent-Workflows mit klarer Verantwortungstrennung."

**Einsatz-Szenarien:**
1. **Multi-Step-Research-Agent** — ein Planner-Agent koordiniert mehrere Worker, die AI Search + Graph anfragen.
2. **Ticket-Triage** — Eingangs-Agent klassifiziert, Fach-Agent antwortet, Review-Agent verifiziert vor dem Senden.
3. **Migration Semantic Kernel → MAF** für Bestandskunden.

**Voraussetzungen:** .NET 8+ oder Python 3.11+, Azure-OpenAI- oder Foundry-Project, Entra-App-Registration (für Graph/Tools).

**Empfehlung:** 🟢 — als Standard-Framework für alle Pro-Code-Agents ab 2026-04. Für reine No-Code-Szenarien weiter Copilot Studio.

**Nächster Schritt für Journai:** Referenz-Agent in Foundry deployen (siehe §2.6 Hands-on des Arbeitsauftrags).

## 3. Status & Pricing

- **Reifegrad:** **GA**
- **GA-Datum:** 2026-04-07
- **Pricing:** Framework ist **OSS/kostenlos** (MIT-License). Kosten entstehen durch die dahinterliegenden Modelle (Foundry/Azure OpenAI PAYG/PTU) und optional durch **Foundry Agent Service** (managed hosting).
- **Bundle-Zugehörigkeit:** keine — läuft Standalone, integriert sich aber tief in Foundry.
- **Region-Verfügbarkeit:** SDK global, **Foundry Agent Service aktuell nur North Central US** (DSGVO-Flag!).
- **Hidden Costs:** Tracing/Evaluation verursacht Log-Ingestion in Application Insights → prüfen.
- **Upgrade-Pfade:** Semantic Kernel → MAF (API-nah), AutoGen → MAF (Research-Teile bleiben experimentell).

## 4. Kernkonzept

### Architektur-Einordnung

MAF ist die **Agent-Logik-Schicht**. Darunter liegen Modell-APIs (Azure OpenAI, Foundry Models), darüber liegen Hosting-Schichten (M365 Agents SDK für Teams/Copilot, Foundry Agent Service für Cloud-Hosting) und Governance (Agent 365 + Entra Agent ID). MAF selbst ist **runtime-agnostisch** — du kannst es in Azure Functions, Container Apps, on-prem oder im Notebook laufen lassen.

MAF ist das **konsolidierte Nachfolge-Framework** von zwei Vorgängern:
- **Semantic Kernel** (Enterprise-orientiert, .NET-first, Planner + Plugins)
- **AutoGen** (Microsoft Research, Multi-Agent, Python-first)

Die Konsolidierung ist **inhaltlich**, nicht nur kosmetisch: die Kernabstraktionen (Agent, Thread, Tool, Orchestration) sind neu gedacht und nicht 1:1 übernommen.

### Kern-Fähigkeiten

**Fähigkeit 1 — Agent + Thread + Tool**
- Mechanik: Ein Agent besitzt ein System Prompt, eine Modell-Referenz und eine Tool-Liste; jeder Konversationsfaden ist ein Thread mit Nachrichten-History.
- Kontext: Tools sind annotierte Funktionen (`[KernelFunction]` / `@tool`), die der Agent via Tool-Call aufruft.
- Grenzen: Ohne externes State-Store kein persistentes Thread-Memory über Prozessgrenzen hinweg.

**Fähigkeit 2 — Multi-Agent-Orchestrierung**
- Mechanik: Orchestrator-Pattern (Sequential, Handoff, GroupChat) als First-Class-Konstrukte.
- Kontext: Deterministisch (Sequential) bis dynamisch (GroupChat mit Moderator).
- Grenzen: Keine eingebaute Retry/Timeout-Strategie pro Agent — musst du selbst wrappen.

**Fähigkeit 3 — MCP-Support**
- Mechanik: MCP-Server können als Tool-Provider eingebunden werden.
- Kontext: Damit sind Copilot-Studio-MCP-Tools und Dataverse-MCP direkt nutzbar.
- Grenzen: MCP-Streaming ist noch experimentell.

**Fähigkeit 4 — Tracing + Evaluation**
- Mechanik: OTel-Tracing, das Foundry Control Plane und Application Insights beliefert; Evaluation-SDK für Offline-Regression.
- Kontext: Pflicht für Produktiv-Einsatz.
- Grenzen: Eval-Scores hängen stark vom Judge-Modell ab — nicht blind trauen.

**Fähigkeit 5 — Agent Skills (.NET)**
- Mechanik: Skills können auf drei Arten erstellt werden — als **Dateien auf Disk**, als **Inline-C#-Code** oder als **gekapselte Klassen** — und werden über einen einzigen gemeinsamen `SkillProvider` ausgeführt.
- Kontext: Der Provider kombiniert alle drei Authoring-Varianten beliebig, sodass Teams ihre bevorzugte Abstraktion wählen können, ohne die Laufzeitumgebung zu wechseln.
- Besonderheiten: Built-in Script Execution ist integriert; für Script-Calls steht ein **Human-Approval-Mechanismus** zur Verfügung, der eine manuelle Freigabe vor Ausführung erzwingen kann.
- Grenzen: Feature aktuell nur für **.NET** dokumentiert; Python-Parität noch offen (vgl. bekannte .NET-First-Asymmetrie).

**Fähigkeit 5 — Checkpoint Storage (Python)**
- Mechanik: Persistente Workflow-Zustände via `FileCheckpointStorage` (lokal) oder dem neuen `agent-framework-azure-cosmos` Cosmos DB NoSQL Storage.
- Kontext: Cosmos DB-Variante ermöglicht skalierbares, serverless Checkpoint-Management für Python-Workflows.
- Grenzen: `FileCheckpointStorage` erfordert ab 1.0.1 explizite Whitelisting-Konfiguration für eigene Typen (`allowed_checkpoint_types`) — sonst `WorkflowCheckpointException` bei Load.

**Fähigkeit 5 — Gemini-Integration (neu in 1.1.0)**
- Mechanik: `GeminiChatClient` im neuen Package `agent-framework-gemini` ermöglicht die direkte Nutzung von Google-Gemini-Modellen als Chat-Backend.
- Kontext: Erster offizieller Non-Azure/Non-OpenAI Client im Framework — erweitert Multi-Modell-Strategie.
- Grenzen: Initiales Release; Feature-Parität zu OpenAI/Foundry-Client noch nicht vollständig dokumentiert.

**Fähigkeit 6 — Hyperlight CodeAct (neu in 1.1.0)**
- Mechanik: Package `agent-framework-hyperlight` bringt Hyperlight-basierte CodeAct-Ausführung (isolierte Micro-VM-Sandbox für Code-Execution durch Agenten).
- Kontext: Erhöht Sicherheit bei Code-ausführenden Agenten erheblich — relevant für Pro-Code-Szenarien mit untrusted Tool-Output.
- Grenzen: Eigenes Package, erfordert Hyperlight-Runtime-Infrastruktur.

**Fähigkeit 7 — Foundry Toolboxes & Hosted Agent V2 (neu in 1.1.0)**
- Mechanik: `agent-framework-foundry` unterstützt jetzt Foundry Toolboxes (gebündelte Tool-Sammlungen aus dem Foundry-Katalog) sowie die Hosted Agent V2 API.
- Kontext: Vereinfacht die Anbindung von verwalteten Foundry-Tools ohne manuelle Tool-Definitionen.
- Grenzen: Foundry Agent Service aktuell nur North Central US (DSGVO-Flag bleibt bestehen).




### Typischer Workflow

1. **Setup** — `dotnet add package Microsoft.AgentFramework` / `pip install microsoft-agent-framework`, Foundry-Project + Modell-Deployment, Entra-App-Registration für Tools.
2. **Build** — Agent-Klasse, Tools als annotierte Funktionen, Orchestrator-Pattern wählen, Lokal-Tests.
3. **Deploy** — Container Apps / Functions / Foundry Agent Service (je nach Hosting-Anforderung).
4. **Operate** — Tracing in Foundry Control Plane aktivieren, Evaluation-Suite in CI einbinden.

### Skills-Voraussetzungen

| Rolle | Was muss er/sie können |
| ----- | ---------------------- |
| Entwickler | .NET 8+ oder Python 3.11+, async/await, DI, HTTP-APIs |
| Solution Architect | Stack-Verständnis Foundry ↔ MAF ↔ Hosting, Tracing-Konzepte |
| Citizen Developer | Nicht die Zielgruppe — gehört zu Copilot Studio |

## 5. Limitierungen & Fallstricke

### Harte Capability-Grenzen

- **Keine eingebaute UI** — MAF ist Logik-Layer. Für Teams/Web braucht man M365 Agents SDK + Teams SDK. **Alternative:** Foundry Agent Service bietet Web-Frontend out-of-the-box.
- **Kein Built-in Vector Store** — Retrieval muss man anbinden (Azure AI Search, Foundry IQ, Cosmos DB Vector). **Alternative:** Foundry IQ für Convenience.
- **Python-SDK nicht feature-parity zu .NET** (Stand 2026-04) — einige Enterprise-Features (Kernel-Hooks, Planner-Varianten) zuerst in .NET.

### Konzeptionelle Fallstricke

- **Fallstrick:** Teams sehen MAF als Drop-in-Ersatz für Semantic Kernel — **Warum:** APIs sind _nah_, aber Thread-Semantik und Plugin-System sind neu — **Gegenmittel:** Migrations-Runbook + kleiner Pilot, nicht Big-Bang.
- **Fallstrick:** Multi-Agent wird als "mehr Agenten = besser" verkauft — **Warum:** Jeder zusätzliche Agent ist Latenz + Kosten + Failure-Mode — **Gegenmittel:** Standard-Antwort "Single-Agent zuerst, Multi nur wenn Verantwortung klar trennbar".
- **Fallstrick:** DSGVO wird übersehen, weil MAF lokal läuft — **Warum:** Modell-Endpunkt zieht Daten in die Modell-Region — **Gegenmittel:** Foundry-Region prüfen, ggf. Foundry Local.

### Security-Hinweise (Python SDK ≥ 1.0.1)

- **`FileCheckpointStorage` – restricted unpickler (Breaking Change):** Ab 1.0.1 läuft Checkpoint-Deserialisierung standardmäßig durch einen eingeschränkten Unpickler, der nur sichere Python-Built-in-Typen sowie alle `agent_framework`-Framework-Typen zulässt. Eigene Klassen in Checkpoints müssen über den neuen Konstruktorparameter `allowed_checkpoint_types` (Format: `"module:qualname"`) explizit freigegeben werden — sonst wirft der Load eine `WorkflowCheckpointException`. → [Security Considerations](https://learn.microsoft.com/en-us/agent-framework/workflows/checkpoints?pivots=programming-language-python#security-considerations)
- **Cosmos DB NoSQL Checkpoint Storage:** Neues Package `agent-framework-azure-cosmos` bietet skalierbaren, verwalteten Checkpoint-Store als Alternative zu `FileCheckpointStorage`.

**Breaking Change (python-1.1.0):** `CosmosCheckpointStorage` (package `agent-framework-azure-cosmos`) verwendet ab 1.1.0 **restriktive Pickle-Deserialisierung per Default**. Bestehende Checkpoints mit nicht erlaubten Typen können nicht mehr geladen werden — Migration erforderlich, bevor ein Upgrade auf 1.1.0 eingespielt wird.



## 6. Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Quelle | URL | Zuletzt gesichtet |
| ------ | --- | ----------------- |
| Product Page | https://learn.microsoft.com/en-us/agent-framework/ | 2026-04-21 |
| GitHub Repo | https://github.com/microsoft/agent-framework | 2026-04-21 |
| Releases (Atom) | https://github.com/microsoft/agent-framework/releases.atom | 2026-04-21 |
| devblogs (Semantic Kernel / Foundry) | https://devblogs.microsoft.com/semantic-kernel/feed/ | 2026-04-21 |
| Azure Updates (Agent Framework tag) | https://azure.microsoft.com/en-us/updates/feed/ | 2026-04-21 |

### Secondary (Analysten)

| Quelle | URL | Zuletzt gesichtet |
| ------ | --- | ----------------- |

### Tertiary (MVPs / Community)

| Quelle | URL | Zuletzt gesichtet |
| ------ | --- | ----------------- |

### Events

- Microsoft Build 2026: Deep-Dive-Sessions zu MAF + Foundry Agent Service (erwartet Mai 2026)
- Microsoft Ignite 2025: GA-Ankündigung (November 2025)

## 7. Changelog




| Datum | Autor | Änderung | Quelle |
| ----- | ----- | -------- | ------ |
| 2026-04-21 | auto-sync | Python SDK 1.1.0: GeminiChatClient (Gemini-Integration), Hyperlight CodeAct-Package, Foundry Toolboxes & Hosted Agent V2, A2A-Metadaten-Propagation, AG-UI forwardedProps via Session-Metadata, finish_reason in AgentResponse, experimenteller File-History-Provider, AgentExecutorResponse.with_text(). BREAKING: CosmosCheckpointStorage nutzt jetzt restriktive Pickle-Deserialisierung per Default. | https://github.com/microsoft/agent-framework/releases/tag/python-1.1.0 |
| 2026-04-10 | auto-sync | Python SDK 1.0.1: Security-Hardening für FileCheckpointStorage (restricted unpickler, Breaking Change), neuer Cosmos DB NoSQL Checkpoint Storage (`agent-framework-azure-cosmos`), Breaking Change im Handoff-Workflow-Context-Management. | https://github.com/microsoft/agent-framework/releases/tag/python-1.0.1 |
| 2026-04-13 | auto-sync | Agent Skills in .NET: Drei Authoring-Varianten (Datei-basiert, Inline-C#-Code, gekapselte Klassen) können frei kombiniert und über einen einzigen Provider ausgeführt werden. Hinzu kommen Built-in Script Execution sowie ein Human-Approval-Mechanismus für Script-Calls. | https://devblogs.microsoft.com/agent-framework/agent-skills-in-net-three-ways-to-author-one-provider-to-run-them/ |
| 2026-04-21 | Hongyu | Note angelegt als Walking-Skeleton-Referenz | — |

## 8. Integrationen *(close)*

### Microsoft-intern

| Produkt | Integrationsart | Friction |
| ------- | --------------- | -------- |
| Azure OpenAI / Foundry Models | Modell-Endpunkt | keine — nativ |
| M365 Agents SDK | Hosting-Runtime für Teams/Copilot | mittel — SDK-Abgrenzung zu Agent ≠ intuitiv |
| Foundry Agent Service | managed hosting | gering, aber Region-Lock NC-US |
| Agent 365 + Entra Agent ID | Governance | hoch — Agent-ID-Lifecycle muss verstanden sein |
| Azure AI Search / Foundry IQ | RAG | gering |
| Application Insights | Tracing | gering |

### Third-Party

| System | Integrationsart | Friction |
| ------ | --------------- | -------- |
| OpenAI (direkt) | Modell-Backend | gering, aber kein PTU/Bundle-Vorteil |
| Anthropic Claude (via Foundry Models) | Modell-Backend | gering, EU-Availability prüfen |
| MCP-Server (beliebig) | Tool-Provider | gering |

## 9. Security & Compliance *(close)*

- **DSGVO-Lage:** Framework selbst neutral — Modell-Region bestimmt Daten-Region.
- **Data Residency:** Foundry-Modell-Deployment wählt die Region; Foundry Agent Service derzeit nur NC-US.
- **DPA-Scope:** Standard MS Online Services DPA, wenn auf Azure gehostet.
- **EU-AI-Act:** Framework ist Infrastruktur → kein direkter Adressat; relevant sind die Use-Cases, die man darauf baut.
- **Microsoft-Compliance-Stack:** Defender for AI (Runtime-Schutz), Purview (Classification der Tool-In/Outputs), Entra Agent ID (Identity).
- **Bekannte Lücken:** Kein Built-in-PII-Redaction-Layer — muss als Tool/Middleware implementiert werden.

## 10. Abgrenzung & Wettbewerb *(close)*

### Microsoft-intern (wann welches MS-Produkt?)

| Alternative | Wann stattdessen? |
| ----------- | ----------------- |
| Copilot Studio | Low-Code, M365-zentriert, Business-User als Builder |
| M365 Agents SDK ohne MAF | Wenn nur Activity-Protocol-Hosting gebraucht wird (einfache Bots) |
| Foundry Agent Service (UI-only) | Wenn "Agent-in-a-box" in der Cloud reicht und kein Code-Ownership gebraucht wird |

### Externe Alternativen

| Alternative | Wann stattdessen? | Risiko für MS |
| ----------- | ----------------- | ------------- |
| LangGraph | Python-only, aggressive Feature-Velocity, Stateful Graph | mittel — Entwickler-Präferenz |
| CrewAI | Einfache Rolle-basierte Multi-Agent | gering — Enterprise-Features schwach |
| OpenAI Agents SDK | Wenn Kunde OpenAI-first und nicht Azure | hoch bei OpenAI-nativen Kunden |
| n8n / Zapier AI | Integration-first statt Agent-first | gering — andere Zielgruppe |
