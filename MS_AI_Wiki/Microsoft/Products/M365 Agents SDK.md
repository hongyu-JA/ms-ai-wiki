---
watch: close
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Microsoft 365 Agents SDK, Agents SDK, M365 Agents Toolkit]
moc:
  - "[[Microsoft MOC]]"
  - "[[Agents MOC]]"
---

# M365 Agents SDK

*Microsofts Hosting-/Runtime-Layer für Agents in Teams, Microsoft 365 Copilot, Web und Drittkanälen. Direkter Nachfolger des [[deprecated/Bot Framework]] (Support-Ende 2025-12-31). Behält das Activity-Protocol bei, tauscht aber die Dialog-Ära gegen LLM-basierte Agent-Logik — die Logik selbst kommt typischerweise von [[Microsoft Agent Framework]] oder einem Third-Party-Orchestrator (LangChain, CrewAI, OpenAI Agents SDK).*

> **Analogie:** Was der alte Bot Framework Adapter für Channel-Abstraktion war, ist M365 Agents SDK — mit neuem Namespace, sauberer Trennung von Logik und Hosting und einem bewusst unopinionierten Verhältnis zum verwendeten LLM/Orchestrator.

---

## Einsatz

### Job-to-be-done

When I einen Agent in Teams, M365 Copilot, Web oder Slack hosten will, I want to einen einheitlichen Channel-Adapter mit Activity-Protocol, State-Storage, Auth und Turn-Modell, so I can die Agent-Logik (MAF, LangChain, eigener Code) einmal schreiben und auf beliebig vielen Kanälen ausliefern — ohne pro Kanal einen eigenen Bot-Endpoint bauen zu müssen.

### Trigger-Signale

- „Wir haben mehrere Bot-Framework-Bots im Einsatz — Microsoft hat EOS 12/2025 angekündigt, wir müssen migrieren."
- „Unser MAF-Agent läuft als HTTP-Endpoint, soll aber auch in Teams und als Custom Engine Agent in M365 Copilot verfügbar sein."
- „Wir wollen ein agentisches Teams-Erlebnis, aber Copilot Studio reicht nicht — wir brauchen Code-Kontrolle und eigenen Orchestrator."
- „Wir haben LUIS/QnA Maker im Einsatz und wissen: das ist tot. Was ist jetzt der Pfad?"

### Einsatz-Szenarien

1. **MAF-Agent für Teams deployen** — MAF liefert die Agent-Logik, M365 Agents SDK macht den Teams-Channel-Handshake, Adaptive-Card-Rendering, SSO. *Journai-Fit: Standard-Szenario für Pro-Code-Agents im Kunden-Tenant.*
2. **Bot-Framework-Migration** — Bestandskunden-Bot (C# oder Node.js) auf neues Package-Set umstellen, Azure-Bot-Registration + App ID bleiben erhalten, LUIS/QnA werden durch Azure OpenAI + Retrieval ersetzt. *Journai-Fit: direktes Beratungsgeschäft bis Ende 2025, danach Notfall-Migration für Nachzügler.*
3. **Custom Engine Agent für M365 Copilot** — Agent wird via Agents Toolkit gepackaged und in Copilot veröffentlicht, mit eigenem Orchestrator und eigenen Tools (nicht an Copilot Studio gebunden). *Journai-Fit: Kunden mit eigenen Modellen oder speziellen Compliance-Anforderungen.*

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | SDK selbst kostenlos (MIT) · für Teams-Kanal Teams-Lizenzen · für Custom Engine Agent in M365 Copilot eine M365-Copilot-Lizenz |
| **Tenant / Infrastruktur** | Azure Subscription für Hosting (App Service, Container Apps, Functions) · **Azure Bot Registration** (bleibt bei BF-Migration bestehen) · Entra-App-Registration für Auth |
| **Skills / Rollen** | Pro-Code-Entwickler (.NET 8+, Node.js 20+, Python 3.9–3.11); DevOps für Hosting; Tenant-Admin für Agents-Toolkit-Publishing |
| **Compliance-Rahmen** | Azure Bot Service läuft in EU-Region (West Europe / North Europe); Modell-Region entscheidet Daten-Region; DPA via MS Online Services DPA |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | Neuer Echo-Agent in Teams: 1–2 Beratertage · Bot-Framework-Migration (mittelgroßer Bestand): 3–8 Tage je Bot inkl. LUIS/QnA-Ersatz und Test |
| **Laufende Lizenzkosten** | SDK kostenlos · Hosting (Container Apps Consumption oder App Service B1) 30–150 EUR/Monat · Azure Bot Service Standard-Channels (Teams, WebChat) kostenlos · Premium-Channels (Direct Line) ab ~0,50 USD je 1.000 Messages |
| **Laufender Betrieb** | 0,5–1 Tag/Monat Monitoring + Package-Updates *(eigene Einschätzung)* |

### Empfehlung

**Status:** 🟢 **Empfehlen** — als Standard-Hosting-Layer für alle neuen Pro-Code-Agents, die auf Teams/M365 Copilot/WebChat ausgeliefert werden. **Pflicht-Migrationsziel** für alle bestehenden Bot-Framework-Kunden vor 2025-12-31.

**Nächster Schritt für Journai:**
- Interne BF→Agents-SDK-Migration-Playbook bis Mai 2026 fertigstellen (C# + Node.js Code-Samples, LUIS/QnA-Replacement-Pattern, Test-Strategie)
- Referenz-Deployment: MAF-Agent + Agents SDK in Teams, eigener Tenant, Foundry als Modell-Backend
- Workshop-Angebot „BF-zu-Agents-SDK-Migration in 5 Tagen" für DACH-SMBs entwickeln

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | GA (alle drei Sprach-SDKs) |
| **GA-Datum** | *{TODO: exaktes GA-Datum — das Overview-Doc ist vom 2025-11-21, GA-Announcement bei Ignite 2025; Voitanos nennt „From Preview to GA" im Evolution-Post — Praxis-Zeitpunkt: Ignite 2025 (November 2025).}* |
| **Standalone-Preis (USD)** | SDK selbst kostenlos (MIT-Lizenz, OSS via github.com/microsoft/Agents) |
| **Standalone-Preis (EUR)** | n/a — SDK kostenlos, Kosten entstehen auf Hosting-Layer und Modell-Backend |
| **Lizenz-Bundle** | Kein SDK-Bundle. Für M365-Copilot-Publishing des Agents: M365-Copilot-Lizenz beim End-User nötig. Für Teams-Kanal: Teams-Lizenzen. |
| **Voraussetzung** | .NET 8.0, Node.js 20+, oder Python 3.9–3.11 · Azure Subscription · Azure Bot Registration · Entra-App-Registration |
| **Region-Verfügbarkeit** | SDK global einsetzbar · Azure Bot Service Channel-Endpoints in allen Azure-Regionen (EU-Region wählbar, DSGVO-konform) · Teams-Channel global |
| **CSP-Promo / Discounts** | Nicht anwendbar (OSS) |
| **Hidden Costs** | Hosting-Infrastruktur (Container Apps / App Service / Functions) · Modell-Kosten · Application-Insights-Log-Ingestion bei hohem Volumen · bei Direct-Line-Channel: Pay-per-Message-Gebühren |
| **Upgrade-Pfad** | Bot Framework SDK → Agents SDK: Package-Swap + Namespace-Rename + Auth-Re-Config (siehe Kernkonzept). Azure Bot Registration + App ID bleiben unverändert. LUIS/QnA müssen durch Azure-OpenAI-Retrieval ersetzt werden. |

---

## Kernkonzept

### Was es im Kern ist

Das M365 Agents SDK ist der **Channel-Abstraktion- und Hosting-Layer** im Microsoft-Agent-Stack. Es implementiert das Activity-Protocol (historisch aus dem Bot Framework, bewusst weitergeführt) und stellt einen einheitlichen Turn-basierten Programmier-Contract bereit: Eingehende Events (Message, Invoke, ConversationUpdate, SignIn) werden als `Activity`-Objekte an einen Handler gereicht, ausgehende Antworten laufen durch denselben Adapter zurück zum Channel. Die Logik darüber — Prompt-Konstruktion, Tool-Use, Multi-Agent-Orchestrierung, RAG — gehört explizit **nicht** zum SDK. Genau diese Trennung ist der entscheidende Unterschied zur alten Bot-Framework-Welt, in der Dialogs, LG-Templates und LUIS-Intents fest eingebaut waren.

Die Architektur-Wette: **Agent-Logik und Hosting dürfen sich nicht vermischen.** Das SDK ist bewusst „unopinionated" in Bezug auf das AI-Stack — du kannst MAF, Semantic Kernel, LangChain, CrewAI, OpenAI Agents SDK oder einen eigenen Orchestrator einbinden. Der SDK kümmert sich um Activity-Parsing, State-Storage (In-Memory, Blob, Cosmos DB), Authentication (Entra via MSAL), Channel-spezifische Eigenheiten (Teams-Adaptive-Cards, SSO, Message-Extensions) und das Adapter-Pattern für mehrere Kanäle gleichzeitig.

Das SDK ist das **evolutionäre Nachfolge-Paket** zum Azure Bot Framework SDK — nicht eine separate Codebase, sondern eine komplette Rewrite mit geänderten Namespaces, modernisierten Dependencies (System.Text.Json statt Newtonsoft, zod in JS) und aufgeräumtem Programmier-Modell. Die Class-Hierarchy ist ähnlich (`ActivityHandler` existiert weiter als Kompatibilitäts-Brücke), aber der bevorzugte neue Einstiegspunkt ist die `AgentApplication`-Klasse — sie liefert State-Management, Storage und Routing out-of-the-box, statt diese manuell im Handler zu verdrahten.

Abgrenzungen, die in Kundengesprächen ständig auftauchen: **M365 Agents SDK ≠ [[Microsoft Agent Framework]] (MAF).** MAF ist Agent-Logik (Prompts, Tools, Multi-Agent). Agents SDK ist Hosting (Channels, Activities, State). Beide werden häufig zusammen eingesetzt. **M365 Agents SDK ≠ [[Teams SDK]].** Teams SDK ist der UI-Layer für Teams-native Features (Tabs, Task Modules, Message Extensions). Agents SDK liefert nur den Chat-Channel-Kontrakt — für Teams-UI-Features brauchst du beide. **M365 Agents SDK ≠ [[Copilot Studio]].** Copilot Studio ist Low-Code-Builder mit eigenem Runtime. Agents SDK ist Pro-Code-Hosting. Beide können nebeneinander existieren; ein Custom Engine Agent aus dem Agents SDK kann in Copilot Studio als Topic-Backend referenziert werden.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| Governance / Identity | Agent-Identität, Lifecycle, Audit | [[Agent 365]] + [[Entra Agent ID]] |
| Channel / Publishing | Teams-UI-Features, M365-Copilot-Manifest | [[Teams SDK]] (UI) · Agents Toolkit (Packaging) |
| **Hosting / Runtime** | **Activity-Protocol, Channel-Adapter, State, Auth, Turn-Modell** | **M365 Agents SDK** (diese Note) |
| Agent Logic (Orchestration) | System Prompts, Tool-Use, Multi-Agent | [[Microsoft Agent Framework]] · LangChain · CrewAI · eigener Code |
| Model APIs | Chat-Completion, Embeddings | Azure OpenAI · [[Foundry Agent Service|Foundry Models]] · direkte OpenAI/Anthropic |
| Compute | Container, Functions, VM | [[Azure Container Apps]] · [[Azure Functions]] · App Service · Foundry Agent Service |
| Data / Knowledge | RAG-Backend, Memory | Azure AI Search · Foundry IQ · Cosmos DB · Microsoft Graph |

### Kern-Fähigkeiten

#### Activity-Protocol-Adapter (Channel-Abstraktion)

Das Herzstück: ein `CloudAdapter` (C#) bzw. `@microsoft/agents-hosting` CloudAdapter (Node.js) nimmt HTTP-POST-Requests von Azure Bot Service entgegen, validiert das eingehende JWT (in Node.js via `authorizeJWT`-Middleware, in .NET via `AddAgentAspNetAuthentication`), deserialisiert die Activity, erzeugt einen `TurnContext` und ruft den Agent-Handler. Ausgehende Antworten werden vom Adapter auf das jeweilige Channel-Format gemapt (Teams vs. WebChat vs. Slack vs. Direct Line). Grenze: ohne externen State-Store kein persistentes Thread-Memory über Prozessgrenzen.

#### AgentApplication-Klasse (neu, empfohlen)

Die `AgentApplication`-Klasse ersetzt das alte `ActivityHandler`-Pattern als bevorzugter Einstiegspunkt. Sie bringt Built-in State-Management (`state.conversation`, `state.user`), automatische Persistierung und Routing via Method-Chaining (`agent.onMessage('/help', ...)`). Der alte `ActivityHandler` bleibt als Kompatibilitäts-Shim bestehen für BF-Migrationen, ist aber formell deprecated.

#### State-Storage-Provider

Out-of-the-Box: `MemoryStorage` (nur Dev), `BlobsStorage` (Azure Blob), `CosmosDbPartitionedStorage`. `ConversationState` / `UserState` / `PrivateConversationState` sind drei Scopes über demselben Storage-Provider. `AutoSaveStateMiddleware` (in .NET) entfällt bei `AgentApplication` — State wird implizit gesichert.

#### Channel-Support (Multi-Channel via Azure Bot Service)

Via Azure Bot Service werden folgende Channels bedient: **Microsoft 365 Copilot** (Custom Engine Agent), **Microsoft Teams**, **Web Chat**, **Direct Line** (für eigene Embed-UIs), **SMS (Twilio)**, **Facebook Messenger**, **Slack**, **Telegram**, **Email**. Der Agent-Code selbst ist kanal-agnostisch — kanal-spezifische Eigenheiten werden via Activity-Channel-Data oder Extension-Packages gehandhabt (z.B. `Microsoft.Agents.Extensions.Teams` für Adaptive Cards und Teams-spezifische Activities). Grenze: Teams-Message-Extensions oder Task-Modules brauchen zusätzlich [[Teams SDK]].

#### Authentication (Entra via MSAL)

Das alte `ConfigurationBotFrameworkAuthentication` entfällt. Neu: ASP.NET-native JWT-Validierung (in .NET via `TokenValidation`-Section in appsettings.json), plus eine `Connections`-Sektion, die Service-Connections (Azure Bot Channel, Graph, etc.) mit ClientSecret / ManagedIdentity / Certificate konfiguriert. Die Environment-Variablen-Namen wurden umbenannt: `MicrosoftAppId` → `clientId`, `MicrosoftAppPassword` → `clientSecret`, `MicrosoftAppTenantId` → `tenantId`.

#### Microsoft 365 Agents Toolkit (Developer-Tooling)

VS Code + Visual Studio Extension als Nachfolger von TeamsFx. Bietet Scaffolding, Debug-Tunnel (dev tunnels statt ngrok), F5-Loop in den Teams-Web-Client, Manifest-Generation für M365 Copilot, Channel-Publishing-Automation. Aktuell in Version 6.6.0 (März 2026) — unter anderem MCP-Integration für Declarative Agents auf GA.

#### Observability (OpenTelemetry-First)

Das SDK ist durchgängig mit OTel-Spans instrumentiert. Spans für Turn-Start, Activity-Processing, Adapter-Calls werden automatisch generiert; eigene Tool-Calls können manuell als Child-Spans eingehängt werden. Zielsenken: Application Insights, Foundry Control Plane, beliebiger OTel-Collector. Alt-Integration über `Microsoft.Bot.Builder.ApplicationInsights` ist deprecated.

#### Tool-Use via MCP

Das SDK ist selbst kein Tool-Runner — Tools werden auf der Agent-Logik-Schicht (MAF, LangChain, …) aufgerufen. Aber: die Toolkit-Seite unterstützt Declarative Agents mit MCP-Tools nativ (GA ab v6.6.0), das heißt Agents können MS-Graph-Mail/Calendar/SharePoint/Teams via gouvernierte MCP-Server abfragen — mit Admin-Control-Plane.

### Typischer Workflow

1. **Setup** — Agents Toolkit in VS Code installieren, Template „Custom Engine Agent" wählen, Azure Bot Registration + Entra-App automatisch erzeugen lassen. Alternativ: manuell mit `dotnet new agent` oder `npm create @microsoft/agents-app`.
2. **Build / Configure** — `AgentApplication` anlegen, Handler für `onMessage`, `onConversationUpdate` registrieren. Agent-Logik (MAF / LangChain) hinter einem Service-Interface kapseln und injizieren. Tools als Teil der Logik-Schicht, nicht der SDK-Schicht.
3. **Local Debug** — F5 im Agents Toolkit startet Dev-Tunnel + Teams-Sideload; Bot Emulator wird nicht mehr empfohlen. `.env`-File mit `clientId`, `clientSecret`, `tenantId` für lokale Auth.
4. **Deploy** — Container Apps (Standard für MAF + Agents SDK), Azure Functions (für Event-getriebene/niedrig-volumige Bots), App Service (Legacy-Migration), Foundry Agent Service (managed; aktuell NC-US-Region-Lock — DSGVO-kritisch für EU). Deployment über Agents Toolkit oder Azure CLI.
5. **Operate** — Foundry Control Plane oder Application Insights für Tracing; Teams Admin Center für Agent-Lifecycle; Agent 365 ab Mai 2026 für Identity/Governance.

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai intern)** | .NET 8 / Node.js 20 / Python 3.9–3.11 · ASP.NET Core / Express-Basics · Entra-App-Registration · Azure Bot Service-Konzepte · Agents Toolkit in VS Code |
| **Admin (beim Kunden)** | Azure-Subscription-Admin für Hosting-Ressourcen · Entra-App-Registrierung · Teams-Admin für Side-Loading und Channel-Aktivierung · für M365-Copilot-Publishing: M365-Admin-Rolle |
| **End-User (beim Kunden)** | Keine — konsumiert Agent via Teams-Chat oder M365-Copilot-UI |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Keine Agent-Logik** (kein Orchestrator, kein Prompt-Building, kein Tool-Router) | [[Microsoft Agent Framework]], LangChain, CrewAI, OpenAI Agents SDK |
| **Keine Teams-UI-Features** (Task Modules, Message Extensions, Tabs) | [[Teams SDK]] zusätzlich einbinden |
| **Kein Built-in-Vector-Store / RAG** | Azure AI Search · Foundry IQ · Cosmos DB Vector |
| **Keine Adaptive Dialogs / LG / LUIS / QnA Maker** | Azure OpenAI + Retrieval; Declarative-Dialogs via LLM-Prompt |
| **Keine Composer-Import-Pfade** (Bot Framework Composer-Artefakte) | Komplett neu bauen oder mit BF-Compat-Mode weiterbetreiben bis EOS |
| **BotFrameworkAdapter entfernt** (nur noch CloudAdapter / ChannelAdapter) | Direkte Migration auf `CloudAdapter` bzw. `ChannelAdapter` |
| **Streaming-Connections des alten BF nicht portiert** | Server-Sent-Events in modernen Channels (WebChat/M365 Copilot) statt legacy Direct-Line-Streaming |
| **Kein eingebautes CLI** (`bf`-CLI deprecated) | Agents Toolkit + Azure CLI |

### Typische Fallstricke im Einsatz

- **M365 Agents SDK mit MAF verwechseln** — Das SDK ist Hosting, MAF ist Logik. Ohne MAF (oder Alternative) ist das SDK nur ein „Hello World"-Echo-Bot. *Gegenmittel: Stack-Tabelle oben im Kundengespräch zeigen.*
- **BF-Migration als reinen Package-Swap missverstehen** — Die MS-Docs sagen explizit: „Treat this work as a modernization effort, not only a package swap." Namespaces, Auth-Config, Env-Var-Namen und System.Text.Json erzwingen Code-Änderungen jenseits find/replace. *Gegenmittel: Pilot-Migration mit einem kleinen Bot, Lessons Learned in Playbook.*
- **LUIS/QnA Maker als „wir bauen das später weg" unterschätzen** — Die Online-Services sind bereits deaktiviert (Stand 2026-04). Bestandskunden mit LUIS-Intents stehen vor kompletter NLU-Re-Architektur (Azure OpenAI + Few-Shot oder Retrieval). *Gegenmittel: Migration-Assessment als separater Arbeitspaket.*
- **Foundry Agent Service als Default-Hosting sehen** — Aktuell North-Central-US-Only. Für EU-Kunden DSGVO-Flag. *Gegenmittel: Container Apps in EU-Region als Standard-Hosting-Pfad für DACH-Kunden, Foundry Agent Service nur für US-Kunden oder nach EU-Rollout.*
- **Activity-Protocol als „BF-kompatibel, also alles läuft weiter" annehmen** — Das Protocol ist kompatibel, einzelne Activity-Typen aber wurden entfernt (Payments, Command/CommandResult, Generic Events). *Gegenmittel: Migration-Guide-Liste durchgehen, nicht nur Compile-Errors ausmerzen.*
- **Azure Bot Service-Resource voreilig löschen** — Die MS-Docs sind explizit: die existierende Azure Bot Registration + App ID bleibt erhalten. Bei Löschen geht der WebChat-Embed-Link und Channel-Binding verloren. *Gegenmittel: In-Place-Migration, keine Green-Field-Ressourcen.*

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| [[Microsoft Agent Framework]] | Agent-Logik für den Hosting-Layer | GA, nativ | gering — aber Abgrenzung MAF-vs-SDK oft unklar im Kundengespräch |
| [[Teams SDK]] | Teams-UI-Features (Task Modules, Tabs, Extensions) | GA | mittel — Overlap/Abgrenzung nicht intuitiv |
| [[Copilot Studio]] | Low-Code-Alternative · SDK-Agents als Copilot-Studio-Skills referenzierbar | GA | gering technisch, hoch organisatorisch (welches Team baut was?) |
| Azure Bot Service | Channel-Endpunkt (Teams, WebChat, Slack, Twilio, …) | GA | gering — Azure Bot Registration bleibt aus BF erhalten |
| [[Foundry Agent Service]] | Managed Hosting für SDK-Agents | GA, Region-Lock NC-US | hoch — DSGVO-Problem für EU |
| [[Azure Container Apps]] / [[Azure Functions]] | Self-Hosting | GA | gering |
| [[Agent 365]] + [[Entra Agent ID]] | Governance, Agent-Identity | GA ab 2026-05 | hoch — Identity-Lifecycle muss bewusst designed werden |
| Microsoft Graph | M365-Datenzugriff (Mail, Calendar, SharePoint) via MCP | GA | mittel — Delegated vs. App-only Auth |
| Application Insights | Observability | GA | gering (OTel-native) |
| Agents Toolkit (VS Code / VS) | Scaffolding, Debug, Publishing | GA, v6.6.0 (März 2026) | gering |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| Slack | Channel-Endpoint via Azure Bot Service | GA | gering |
| Twilio (SMS) | Channel-Endpoint | GA | gering |
| Facebook Messenger | Channel-Endpoint | GA | mittel — Meta-App-Review nötig |
| LangChain / LangGraph | Agent-Orchestrator als Alternative zu MAF | GA | gering — SDK agnostisch |
| CrewAI | Agent-Orchestrator | GA | gering |
| OpenAI Agents SDK | Agent-Orchestrator | GA | mittel — OpenAI-Terms statt MS-DPA |

### APIs / Protokolle

- **Activity Protocol** (MS-proprietär, aber offen dokumentiert — BF-kompatibel)
- **Model Context Protocol (MCP)** für Tool-Integration auf Agent-Logik-Ebene
- **OpenTelemetry** für Observability
- **Entra / MSAL** für Authentication
- **System.Text.Json / zod** (in .NET bzw. JS) als Serialisierung — Newtonsoft.Json rausgeflogen

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | Azure Bot Service in EU-Region wählbar (West Europe, North Europe) · Hosting-Compute kann in EU bleiben · Modell-Endpunkt zieht Daten in Modell-Region · **Foundry Agent Service aktuell nur NC-US** (für EU-Deployments vermeiden) |
| **Prompts & Outputs** | SDK selbst speichert nichts · Activity-Payloads laufen durch Azure Bot Service (Transit, nicht Persistenz) · Persistenz-Verantwortung liegt beim Entwickler (State-Store + Modell-Logs) |
| **DPA** | Azure Bot Service + Azure Container Apps + Azure OpenAI unter MS Online Services DPA abgedeckt · Für Teams-Channel: zusätzlich M365 DPA |
| **EU-AI-Act-Klassifizierung** | SDK = Infrastruktur, kein direkter Adressat. Use-Case des Agents entscheidet die Einordnung. |

### Microsoft-Compliance-Stack

- **[[Entra Agent ID]]** für Agent-Identity (ab Mai 2026 GA) — Voraussetzung für gouvernierte MCP-Tool-Calls
- **[[Agent 365]]** als Control Plane für Agent-Lifecycle, Audit-Log, Conditional Access
- **Purview** für Klassifizierung der Tool-In/Outputs (DLP-Policies wirken auf Teams-Channel)
- **Azure AI Content Safety** als Eingangs-/Ausgangs-Filter (auf Agent-Logik-Ebene einzubauen, nicht vom SDK bereitgestellt)
- **Defender for AI** für Runtime-Schutz der Hosting-Ressource

### Bekannte Compliance-Lücken

- **Foundry Agent Service Region-Lock NC-US** — für EU-Kunden blockiert; manuelle Hosting-Variante (Container Apps EU) als Workaround nötig
- **Kein Built-in-PII-Redaction-Layer** im SDK — muss auf Agent-Logik-Ebene (Presidio / Azure AI Language PII) oder als Middleware implementiert werden
- **LUIS/QnA-Maker-Nachfolge nicht DSGVO-identisch** — wer LUIS in DE-Region hatte, muss bei Azure OpenAI ggf. andere Region wählen (Impact-Assessment nötig)
- **Agent-Registration im Entra-Tenant** — Agent-Identity und End-User-Identity laufen über denselben Tenant, klare Rollentrennung nicht automatisch vorhanden *{TODO: mit Agent 365-GA-Dokumentation verifizieren}*

---

## Abgrenzung & Wettbewerb

### Microsoft-intern: Wann M365 Agents SDK vs. welches andere MS-Produkt?

| Frage-Situation | M365 Agents SDK | Alternative MS-Produkt |
|-----------------|-----------------|------------------------|
| „Agent ohne Code bauen" | ❌ | ✅ [[Copilot Studio]] |
| „Agent-Logik (Prompts, Tools, Multi-Agent)" | ❌ (nur Hosting) | ✅ [[Microsoft Agent Framework]] |
| „Teams-UI-Features (Message Extensions, Task Modules)" | ❌ | ✅ [[Teams SDK]] zusätzlich |
| „Pro-Code-Agent in Teams / M365 Copilot / Web" | ✅ als Hosting | + [[Microsoft Agent Framework]] als Logik |
| „Managed Cloud-Hosting ohne eigene Infra" | ⚠️ Agents SDK + [[Foundry Agent Service]] (NC-US-Only) | alternativ: [[Azure Container Apps]] mit EU-Region |
| „Bot Framework-Migration" | ✅ einzige Option ab 2026 | — |
| „Pure HTTP-API ohne Channels" | ⚠️ Overkill | direkt [[Microsoft Agent Framework]] in [[Azure Functions]] / [[Azure Container Apps]] |

### Externe Alternativen

| Dimension | M365 Agents SDK | Vercel AI SDK | BotPress | Direct HTTP-Endpoint |
|-----------|-----------------|---------------|----------|----------------------|
| **Fokus** | Multi-Channel + MS-Integration | Next.js-First + OpenAI-First | OSS-Bot-Builder | Pure Chat-API |
| **Channel-Support** | Teams, M365 Copilot, WebChat, Slack, SMS, Messenger | primär Web/Next.js | WebChat, Slack, Telegram, WhatsApp | nur Web-Custom |
| **EU-Data-Residency** | ✅ via Azure EU-Region | Backend-abhängig | Self-hosted möglich | Backend-abhängig |
| **Integrationstiefe in MS-Ökosystem** | ✅ nativ (Graph, Teams, M365 Copilot, Entra) | ❌ | ⚠️ DIY | ❌ |
| **Pricing** | SDK kostenlos · Hosting + Channel-Traffic | OSS + Hosting | Cloud ab 495 USD/Monat · OSS frei | Reines Compute |
| **Stärke** | Teams/M365-Integration, Enterprise-Auth | DevEx für Web-Devs | Feature-reiche Low-Code-UI | maximale Flexibilität |
| **Schwäche** | MS-lastig · Teams-Feature-Overlap mit Teams SDK | kein Teams-Channel | keine M365-Integration | alles selbst bauen |

### Empfehlungs-Regel

Wir nehmen **M365 Agents SDK** über direkte HTTP-Endpoints, wenn der Agent in **Teams, M365 Copilot oder auf mehreren Kanälen** ausgeliefert werden soll — unabhängig von der Agent-Logik (MAF, LangChain, eigen). Bei **Pure-Web-Only** + **keine M365-Integration** + **OpenAI-first** kann **Vercel AI SDK** (für Next.js-Teams) oder ein **direkter Chat-Endpoint** einfacher sein. Für **Bot-Framework-Bestandskunden** ist das Agents SDK **die einzige sinnvolle Option** ab 2026-01.

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Product Page | M365 Agents SDK Documentation | https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/ | 2026-04-22 | allgemeine Änderungen |
| Overview | What is the Microsoft 365 Agents SDK | https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/agents-sdk-overview | 2026-04-22 | Positionierung, Sprach-Support |
| Migration Guide (Guidance) | BF → Agents SDK Migration Overview | https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/bf-migration-guidance | 2026-04-22 | Feature-Kompatibilitäts-Matrix |
| Migration Guide (.NET) | BF → Agents SDK für .NET | https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/bf-migration-dotnet | 2026-04-22 | Package-/Namespace-Mapping C# |
| Migration Guide (Node.js) | BF → Agents SDK für Node.js | https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/bf-migration-nodejs | 2026-04-22 | Package-/Import-Mapping JS |
| Migration Guide (Python) | BF → Agents SDK für Python | https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/bf-migration-python | 2026-04-22 | Package-/Import-Mapping Python |
| Agents Toolkit Docs | M365 Agents Toolkit | https://learn.microsoft.com/en-us/microsoft-365/agents-toolkit/ | 2026-04-22 | Tooling-Updates, Template-Änderungen |
| GitHub Repository (Meta) | microsoft/Agents | https://github.com/microsoft/Agents | 2026-04-22 | Sample-Code, Readme, Verlinkung auf Lang-Repos |
| GitHub Repository (.NET) | microsoft/Agents-for-net | https://github.com/microsoft/Agents-for-net | 2026-04-22 | C#-SDK-Code, Releases |
| GitHub Repository (JS) | microsoft/Agents-for-js | https://github.com/microsoft/Agents-for-js | 2026-04-22 | Node.js-SDK-Code, Releases |
| GitHub Repository (Python) | microsoft/Agents-for-python | https://github.com/microsoft/Agents-for-python | 2026-04-22 | Python-SDK-Code, Releases |
| Tech Blog | M365 Dev Blog | https://devblogs.microsoft.com/microsoft365dev/ | 2026-04-22 | Ankündigungen, Tutorials |

### Secondary (Analysten & vertrauenswürdige Industrie)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| Voitanos Blog (Andrew Connell) | https://www.voitanos.io/blog/ | 2026-04-22 | detailliertes Toolkit-Release-Tracking, bewusst kritische Sicht |
| Directions on Microsoft | — | — | *{TODO: eigene Analyse zum Agents-SDK-Positionierung suchen}* |

### Tertiary (Community / MVPs / Blogs)

| Autor | Blog / Kanal | Zuletzt gesichtet | Warum relevant? |
|-------|--------------|-------------------|-----------------|
| spknowledge (SharePoint/Agent-Community) | https://spknowledge.com/ | 2026-04-22 | Schritt-für-Schritt-Einstiegs-Posts |

### Events / Konferenzen zum Beobachten

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Build 2026 | Mai 2026 | SDK-Deep-Dives, ggf. Foundry-Agent-Service-EU-Rollout |
| AI Tour Zürich 2026 | 29.04.2026 | regionale EU-Details, Foundry-Roadmap |
| Microsoft Ignite 2026 | November 2026 | nächste SDK-Major-Features, Agent-365-Integration-Vertiefung |

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Kompletter Deep-Dive nach MAF-Template, Bot-Framework-Migration-Path, Code-Beispiele, Hosting-Varianten | https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/ |
| 2026-04-22 | Hongyu | Initial Stub (watch: standard → upgrade auf close nach Deep-Research) | — |
