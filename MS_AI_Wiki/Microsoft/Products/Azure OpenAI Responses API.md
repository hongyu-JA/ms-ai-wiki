---
watch: passive
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Responses API, Azure OpenAI Responses, /v1/responses]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Azure OpenAI Responses API

*Azures **Nachfolger-API** von Chat Completions und der sterbenden Assistants API (EOS **26.08.2026**). Stateful, Multi-Turn, Built-in Tools (File Search, Code Interpreter, Image Gen, Remote-MCP, Web Search, Computer Use). Unter `/openai/v1/responses` GA auf Azure seit **August 2025**, verfügbar in **Sweden Central, Switzerland North, Germany West Central, France Central, UK South** u.a. — die API-Ebene, auf der [[Foundry Agent Service]] und [[Microsoft Agent Framework]] intern aufsetzen.*

> **Analogie:** Was Chat Completions für Single-Turn-Prompts war, ist Responses für Agent-artige Multi-Tool-Flows — eine API mit Gedächtnis, die Tool-Calls selbst orchestriert statt sie an den Client zurückzureichen.

---

## Einsatz

### Job-to-be-done

When I einen Agent-artigen Flow baue (mehrere Tool-Calls, Reasoning, Conversation-State), I want to das nicht selbst in der App stitchen, so I can mit einer einzigen stateful API Conversation-State + Built-in Tools + Reasoning-Persistenz in einem Request bekommen — statt 3 separate APIs (Chat Completions + Assistants + Tool-Orchestrierung) zu koordinieren.

### Trigger-Signale

- „Wir haben einen Chat Completions-Integration und kommen mit Tool-Calling-Loops nicht hinterher."
- „Unsere Assistants-API-Anwendung wird im August 2026 abgeschaltet — wohin migrieren?"
- „Wir wollen keinen Full-Stack-Agent-Framework, aber Tool-Use + State ohne eigenen Memory-Store."
- „Brauchen wir MAF oder reicht `responses.create(...)`?"

### Einsatz-Szenarien

1. **Assistants-API-Migration vor EOS 26.08.2026** — Bestehender Kunde mit Assistants-API-Threads/Runs: Migration auf Responses API (wenn Single-Agent) oder auf [[Foundry Agent Service]] (wenn Persistent-State + UI-Portal gewünscht). Journai-Runbook: Threads → `previous_response_id`, File-Search-Vector-Stores bleiben, Runs entfallen.
2. **Neuer Single-Agent-Chat ohne MAF-Overkill** — SMB-Kunde braucht einen Support-Bot mit File Search über PDFs + Code Interpreter für Zahlen — direkt `responses.create()` statt MAF-Workflow; MAF erst wenn Multi-Agent-Handoffs reinkommen.
3. **Stateless Stateful-Hybrid** — Enterprise-Kunde mit eigenem DB-State will Responses nur als Reasoning-Engine: `store=false` + `reasoning.encrypted_content` → Reasoning-Persistenz ohne Server-Side-Storage (DSGVO-Use-Case).

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Azure-Subscription + Foundry/Azure-OpenAI-Resource |
| **Tenant / Infrastruktur** | Deployment in Responses-fähiger Region (EU: Sweden Central, Switzerland North, Germany West Central, France Central, Italy North, Norway East, Poland Central, Spain Central, UK South); v1-API-Endpoint `/openai/v1/responses` |
| **Skills / Rollen** | Dev-Skills Python/.NET/JS; Entra-Auth-Verständnis (Token-Scope `https://ai.azure.com/.default`) |
| **Compliance-Rahmen** | Regional-Deployment für EU-Data-Residency; Standard-Response-Retention = **30 Tage** (bei `store=true`), per Delete abschaltbar oder via `store=false` komplett stateless |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | Greenfield-PoC <1 Tag (OpenAI-SDK + Deployment-Name); Assistants-Migration typisch 2–5 Tage/Projekt (Threads-Umbau + Tool-Tests) |
| **Laufende Lizenzkosten** | Keine API-Gebühr — Token-Cost folgt PAYG/PTU des Modells ([[Azure OpenAI Service Pricing]]). Built-in Tools haben eigene Zusatz-Fees: **Code Interpreter** ~USD 0.03/Session (1h TTL, 20min idle), **File Search** Per-Call + Vector-Store-Storage, **Web Search** Per-Call |
| **Laufender Betrieb** | Minor — SDK-Bump quartalsweise; Region-Monitoring wenn neue Modelle nur in US-Regions landen |

### Empfehlung

**Status:** 🟢 **Empfehlen** als **Default-API** für alle neuen Azure-OpenAI-Integrationen ab 2026. Chat Completions nur noch wenn stateless/minimal. Assistants API ist **de facto tot** (EOS 26.08.2026) — keine Neuprojekte dort.

**Nächster Schritt für Journai:** (1) Assistants-API-Kunden inventarisieren und Q2/2026-Migration-Plan aufsetzen; (2) Starter-Template `responses.create()` + File Search als SMB-Chatbot-Standard; (3) MAF nur empfehlen wenn Multi-Agent/Workflow-Orchestrierung konkret gebraucht wird (siehe Abgrenzung).

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | **GA** seit Azure AI Foundry Announcement August 2025; seit v1-API ohne `api-version`-Parameter |
| **GA-Datum** | August 2025 (Azure); Computer Use + einzelne Tool-Subtypen weiterhin Preview |
| **Standalone-Preis (USD)** | Keine API-Gebühr — Token-Abrechnung folgt Modell-PAYG / PTU (siehe [[Azure OpenAI Service Pricing]]) |
| **Standalone-Preis (EUR)** | Analog — EUR-Preise pro Modell in Azure Pricing Calculator (EMEA-Tier) |
| **Lizenz-Bundle** | Teil des Azure-OpenAI-/Foundry-Resource-Deployments; keine Zusatz-Lizenz |
| **Voraussetzung** | Azure-Subscription + OpenAI-Resource + Modell-Deployment in Responses-Region |
| **Region-Verfügbarkeit** | 25 Regionen stand April 2026. **EU/EFTA**: Switzerland North, Sweden Central, Germany West Central, France Central, Italy North, Norway East, Poland Central, Spain Central, UK South. ⚠️ Modell-Verfügbarkeit variiert pro Region — `gpt-5`-Serie z.B. nur in ausgewählten (Sweden Central, East US2 etc.) |
| **CSP-Promo / Discounts** | Keine — identisch zu AOAI-Commercial |
| **Hidden Costs** | **Built-in Tools extra**: Code Interpreter (~USD 0.03/Container-Session, 1h aktiv, 20min idle), File Search (Tool-Call + Vector-Store-Storage), Web Search (Per-Call). **Stored Responses** 30-Tage-Retention kostenlos aber zählt; `store=false` spart Storage. **MCP-Tool: keine Zusatz-Gebühr** — nur Token für Tool-Definitions + Tool-Calls |
| **Upgrade-Pfad** | Von **Chat Completions**: `messages` → `input`, `response.choices[0].message.content` → `response.output_text`, `previous_response_id` für Multi-Turn. Von **Assistants API**: Threads/Runs ersetzt durch `previous_response_id` + Response-Items; Vector-Stores + File-Search übertragbar; Tools-Schema kompatibel. Co-Existenz möglich — schrittweise Migration |

---

## Kernkonzept

### Was es im Kern ist

Die Responses API ist OpenAIs **vereinheitlichtes API-Primitiv** (OpenAI, März 2025; Azure-GA August 2025), das Chat Completions und die sterbende Assistants API fusioniert. Der zentrale Design-Bruch: Statt einer `messages`-Liste, die der Client komplett selbst managed (Chat Completions), oder einer Thread-zentrierten Objekt-Hierarchie mit Threads/Runs/Messages/Steps (Assistants), arbeitet Responses mit einer **Items**-Union — eine typisierte Liste, die Messages, Tool-Calls, Reasoning-Traces, MCP-Approvals, Compaction-Items und Function-Call-Outputs gleichberechtigt behandelt.

Das zweite Design-Prinzip: **Server-Side State auf Verlangen**. Mit `store=true` (Default) speichert Azure die Response 30 Tage lang; der nächste Call verweist via `previous_response_id` darauf — der Client muss die Historie nicht mehr selbst pflegen. Mit `store=false` bleibt Responses stateless (relevant für DSGVO-strikte Kunden), Reasoning-Context wird dann via `reasoning.encrypted_content` im Input mitgereicht (verschlüsselter Opaque-Blob).

Das dritte Prinzip: **Tools sind Erstklassig und servergehostet**. File Search, Code Interpreter, Image Generation, Web Search, Computer Use und Remote-MCP-Server werden **direkt von der Azure-OpenAI-Instanz** aufgerufen — nicht vom Client. Das heißt: Beim MCP-Tool öffnet Azure OpenAI selbst die Verbindung zum MCP-Server (Public-Internet, kein VNet-Support derzeit). Der Client sieht im Output nur das Ergebnis. Das verschiebt die Orchestrations-Last vom Application-Layer in die API.

Für Journais Beratung heisst das: Responses ist die **API-Ebene**, auf der alles andere aufsetzt — `AIProjectClient.get_openai_client().responses.create(...)` in [[Foundry SDKs]], die `AzureAIAgent`-Provider in [[Microsoft Agent Framework]], und [[Foundry Agent Service]] intern. Wer Responses versteht, versteht die gemeinsame Grundlage.

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| Orchestration / Multi-Agent | Workflow, Handoffs, Human-in-Loop | [[Microsoft Agent Framework]] (optional, App-Layer) |
| Agent-Persistenz / UI-Portal | Named Agents, Threads-UI, AgentStudio | [[Foundry Agent Service]] (optional) |
| **API / Protokoll** | **Stateful-Conversation, Tools, Reasoning-State** | **Responses API (dieser Produkt)** |
| Model Runtime | GPT-5.x / GPT-4.1 / o3 / o4 / gpt-image-1 | [[Foundry Models]] (Azure-direct) |
| Built-in Tool Execution | Code Interpreter Sandbox, File Search Index, Image-Gen | Azure-managed Services (in der API gekapselt) |
| Remote Tools | MCP-Server (extern) | Kunde / Third-Party / Azure APIM AI Gateway |

### Kern-Fähigkeiten

#### Stateful Conversations via `previous_response_id`

Azure speichert jede Response standardmässig 30 Tage. Folge-Calls verweisen per `previous_response_id=<id>` — der Server stitcht Input + Output + Reasoning + Tool-State automatisch. Alternative: **Stateless-Chaining** (manuell Output-Items in `input`-Array des Folge-Calls appenden; für Kunden ohne Server-Storage-Appetit).

**Relevant** wenn Multi-Turn-Chat ohne eigenen Session-Store gebaut wird. **Grenze**: `store=false` zwingt zu manuellem Chaining plus `reasoning.encrypted_content` für Reasoning-Modelle — sonst Context-Loss.

#### Built-in Tools — ohne Glue-Code

- **File Search** — Managed Vector Store + Retrieval; ersetzt Assistants-Datei-Suche 1:1, Tool-Call-Gebühr extra.
- **Code Interpreter** — Sandboxed Python-Container (Auto-Provisioning), 1h Session-TTL, 20min Idle; Files rein/raus automatisch.
- **Image Generation** (Preview) — `gpt-image-1`-Serie als Tool im Response-Flow; Multi-Turn-Editing + Streaming noch nicht supported.
- **Web Search** — Bing-gestützt; separat gepreist.
- **Computer Use** (Preview) — `computer-use-preview` Modell mit Desktop-Bedienung via Playwright.
- **Remote MCP** — beliebige öffentliche MCP-Server (`"type":"mcp"`, `server_url`, `headers`, `require_approval`); **Azure ruft direkt aufs öffentliche Internet** — kein VNet-Private-Link; TLS 1.2+ Pflicht, kein mTLS.

**Grenze**: MCP + File Search + Code Interpreter gemischt kann Tool-Loop-Limits treffen; `o3-deep-research` + MCP meldet manchmal Content-Filter-`incomplete`.

#### Function Calling (unverändert OpenAI-kompatibel)

Identisches Schema wie Chat Completions (`tools=[{type:"function", name, parameters}]`); Output ist ein `function_call`-Item, Client antwortet mit `function_call_output` im nächsten Call. Kombinierbar mit Built-in Tools im selben Request.

#### Streaming + Background Mode

**Streaming**: Server-Sent-Events; Event-Typ `response.output_text.delta` für Token-Delta. **Background Mode** (`background=true`, nur bei `store=true`): Async-Jobs für `o3`/`o1-pro`/Deep Research; Poll via `GET /responses/{id}`; Resume-Streaming per `sequence_number`. Relevant für lang laufende Reasoning-Jobs > HTTP-Timeout.

#### Context Compaction

Server-side `context_management={type:"compaction", compact_threshold:200000}` — automatische Kontext-Komprimierung über verschlüsselte Compaction-Items wenn Output-Tokens Schwelle reissen. Reduziert Token-Cost in langen Sessions um bis zu 80% laut Microsoft-Internal-Benchmarks. Für Long-Running-Agents (Codex, Deep Research) de facto Pflicht.

#### Multimodal Input

**Images** (URL oder Base64; PNG/JPEG/WEBP). **PDFs** als Base64 oder hochgeladenes File (mit `purpose="assistants"` als Workaround — `user_data` noch nicht supported). Output-Annotations zeigen Citations (File-Search-Treffer).

### Typischer Workflow

1. **Setup** — AOAI-Resource + Modell-Deployment in Responses-fähiger Region (z.B. Sweden Central für `gpt-5`); OpenAI-Python-SDK `pip install --upgrade openai`; Base-URL `https://<resource>.openai.azure.com/openai/v1/` (kein `api-version` mehr in v1).
2. **Build** — `client.responses.create(model="gpt-4.1", input="...", tools=[...])` statt `client.chat.completions.create(messages=[...])`; für Multi-Turn `previous_response_id` setzen.
3. **Deploy** — Identisch zu Chat Completions — keine neue Infra. Managed Identity via `get_bearer_token_provider(DefaultAzureCredential(), "https://ai.azure.com/.default")`.
4. **Operate** — App Insights via `OpenAIInstrumentor` (OTel; `gen_ai.system=microsoft.foundry`); Retention-Hygiene bei `store=true` (30d auto-expire + optional Delete).

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai intern)** | OpenAI-SDK (Python/.NET/JS) + Azure-Auth (Entra/Managed Identity); Verständnis Items-Model statt Messages-Array |
| **Admin (beim Kunden)** | AOAI-Resource-Deployment + Region-Wahl + ggf. Content-Safety-Policy; kein Tagesgeschäft nötig |
| **End-User (beim Kunden)** | Keine — reines API-Backend |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **MCP-Tool ohne VNet/Private-Link** — Azure OpenAI ruft MCP-Server über Public-Internet | MCP-Server hinter [[Azure API Management]] AI Gateway mit Allowlist; mTLS noch nicht möglich |
| **Multi-Agent-Orchestrierung fehlt nativ** — Responses ist Single-Agent | [[Microsoft Agent Framework]] / [[Foundry Agent Service]] als Layer darüber |
| **Named Agents + UI-Portal fehlen** — keine Agent-als-Ressource | [[Foundry Agent Service]] für Persistent Agents |
| **Image-Gen ohne Multi-Turn-Editing + Streaming** — Preview-Lücke | Separates Image API direkt nutzen, Result einbetten |
| **Background Mode nur mit `store=true`** | Stateless-Chaining alternativ, aber ohne Async |
| **Model-Region-Coverage inkomplett** — GPT-5-Serie nicht in allen Responses-Regionen | Modell-Region-Matrix pro Projekt prüfen; Global Standard / Data Zone ggf. nutzen |
| **PDF-Upload: `purpose="user_data"` nicht supported** | Workaround `purpose="assistants"` — bekanntes Known-Issue |

### Typische Fallstricke im Einsatz

- **„Responses ersetzt MAF"** — Nein. Responses ist die API-Ebene; MAF ist der Orchestrations-Layer darüber. Kunden, die beides als Konkurrenten behandeln, bauen entweder unnötig komplex (MAF für Trivial-Chatbots) oder hitten schnell die Single-Agent-Decke bei Responses.
- **„Assistants läuft weiter auf Azure, ist doch MS"** — Falsch. Azure OpenAI Assistants API ist ebenfalls **deprecated mit EOS 26.08.2026**. Danach hart abgeschaltet — keine Gnadenfrist. Migration jetzt aufsetzen.
- **`store=true` = Datenspeicherung auf Azure für 30 Tage** — DSGVO-sensible Kunden übersehen, dass Default-Retention 30d Server-Side ist. Für bestimmte Verträge bewusst `store=false` + eigenes State-Handling wählen.
- **MCP-Approval-Flow übersprungen** — Default verlangt `mcp_approval_request` / `mcp_approval_response` Round-Trip bevor Daten zum MCP-Server gehen. Ohne `"require_approval":"never"` doppelte Calls + Latenz-Überraschung.
- **Code-Interpreter-Container-Leak** — Jeder Thread startet neuen Container (1h aktiv, 20min Idle); parallel drei Threads = drei Container × Container-Fee. Bekannter Cost-Explosion-Punkt (OpenAI-Community-Report).
- **`previous_response_id` + Tools auf unterschiedlichen Deployments** — Responses-State ist pro Resource/Deployment; Wechsel des Modells mittendrin kann Reasoning-Traces verlieren.

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Docs (Haupt-How-to) | Use the Azure OpenAI Responses API | https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/responses | 2026-04-22 | API-Surface, Region-Liste, Modell-Support, Limitierungen |
| Docs | Azure OpenAI v1 API (Lifecycle) | https://learn.microsoft.com/en-us/azure/foundry/openai/api-version-lifecycle | 2026-04-22 | v1-API-Evolution, Deprecation-Warnungen |
| Docs | Foundry Models (Region-Matrix) | https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure | 2026-04-22 | Modell-Region-Verfügbarkeit pro Responses-Region |
| Blog | Announcing Responses API + CUA in Azure AI Foundry (GA) | https://azure.microsoft.com/en-us/blog/announcing-the-responses-api-and-computer-using-agent-in-azure-ai-foundry/ | 2026-04-22 | GA-Ankündigung, Messaging |
| Blog | What's new in Azure AI Foundry — August 2025 | https://devblogs.microsoft.com/foundry/whats-new-in-azure-ai-foundry-august-2025/ | 2026-04-22 | GA-Datum + Roadmap-Signale |
| Samples | azure-openai-responses-api-samples (GitHub) | https://github.com/Azure-Samples/azure-openai-responses-api-samples | 2026-04-22 | Code-Patterns |
| Docs | MCP-Server-Endpoints für Agents | https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/model-context-protocol | 2026-04-22 | MCP-Tool Konfiguration |
| Pricing | Azure OpenAI Pricing (Tool-Fees) | https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/ | 2026-04-22 | Code-Interpreter + File-Search-Fees |
| Q&A | Azure OpenAI Assistants API EOS 26.08.2026 | https://learn.microsoft.com/en-us/answers/questions/5790094/will-azure-openai-assistants-api-specifically-be-d | 2026-04-22 | Migration-Pflichttermin |

### Secondary / Community

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| OpenAI Migration Guide | https://developers.openai.com/api/docs/guides/migrate-to-responses | 2026-04-22 | Quell-API von OpenAI — Parität-Check |
| Assistants-EOS OpenAI-Forum | https://community.openai.com/t/assistants-api-beta-deprecation-august-26-2026-sunset/1354666 | 2026-04-22 | Entwickler-Sorgen, Migration-Patterns |
| BSWEN Migrations-Guide Chat→Responses | https://docs.bswen.com/blog/2026-04-16-migrate-to-responses-api/ | 2026-04-22 | Schritt-für-Schritt Cross-API |

### Events / Konferenzen

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Build 2026 | Mai 2026 | Responses-Feature-Updates, CUA-GA-Signal |
| Microsoft AI Tour Zürich | 29.04.2026 | CH-Region-Updates, Switzerland-North-Modell-Koverage |
| Assistants API Sunset | **26.08.2026** | Final Cutoff — keine Verlängerung |
| Microsoft Ignite | Nov 2026 | Responses-Langfrist-Roadmap post-Assistants |

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive Responses API: Azure-Implementierung, Migration von Chat Completions + Assistants, MAF-Abgrenzung | https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/responses |
| 2026-04-22 | Hongyu | Initial Stub (wartet auf Deep-Research) | - |
