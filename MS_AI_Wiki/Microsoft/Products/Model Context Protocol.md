---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [MCP]
moc:
  - "[[Microsoft MOC]]"
  - "[[Agents MOC]]"
---

# Model Context Protocol (MCP)

*Offener OAuth-2.1-basierter **Tool-Integration-Standard**. Spec **`2025-11-25`** ist aktuell. Microsoft hat MCP in **12+ eigenständige Integrationen** eingebaut (Copilot Studio GA 05/2025, Azure Functions GA 01/2026, MAF 1.0 GA 03.04.2026, Windows ODR, Foundry, Dataverse, APIM-Proxy). **OpenAI sunsetted die Assistants API zugunsten von MCP** (Mitte 2026) — MCP ist de-facto Industriestandard.*

> **Analogie:** Was LSP (Language Server Protocol) für Code-Editoren wurde, wird MCP für LLM-Agents — ein kanonisches Schnittstellen-Format, das M×N-Integrationen auf M+N reduziert.

---

## Spec-Status 2025-11-25

```
Primitiv              Status         Notes
──────────            ─────          ─────
Tools                 final          JSON-RPC Kern jeder Integration
Resources             final          URI-addressierbare Kontextobjekte
Prompts               final          Serverseitige Templates
Sampling              final          Server ruft Client-LLM zurück (MS-seitig selten)
Streamable HTTP       final          seit 2025-03-26, ersetzt SSE-Only
SSE-Only Transport    deprecated     Atlassian + andere migrieren bis 04/2026
Resumability          Roadmap 2026   Multipart Streams experimentell
Media (Bild/Video)    experimentell  nicht in 2025-11
Stateless Sessions    Roadmap 2026   für horizontale Skalierung
```

### Breaking Changes in 2025-11-25 (wichtig für Kunden-Upgrades)

1. **OAuth neu** — Server MÜSSEN RFC 9728 Protected Resource Metadata implementieren, Clients MÜSSEN Resource Indicators (RFC 8707) setzen, **OAuth 2.1 + PKCE Pflicht**
2. **Client Registration Profiles** — Enterprise-Profil zusätzlich zu Dynamic Client Registration
3. **SSE-Only Sunset** — Remote-Server migrieren auf Streamable HTTP

---

## Microsoft-Integrations-Matrix (April 2026)

| # | Integration | Status | Rolle | Auth | Besonderheit |
|---|-------------|--------|-------|------|--------------|
| 1 | **[[Copilot Studio]] MCP-Client** | GA (29.05.2025) | Client | OAuth 2.1 via Custom Connector; Entra oder API-Key | Verbrauch auf Copilot-Studio-Nachrichten |
| 2 | **[[Microsoft Agent Framework]] 1.0** | GA (03.04.2026) | Client + Agent-as-MCP-Tool-Server | Entra ID bevorzugt (Managed Identity, Agent ID); API-Key möglich | Provider-neutral: Azure OpenAI, OpenAI, Anthropic, Bedrock, Gemini, Ollama |
| 3 | **[[Azure Functions]] MCP Extension** | GA (01/2026) | Server-Host | Entra ID inkl. **OBO**; Function-Keys als Fallback | .NET/Java/JS/Python/TS; Streamable HTTP Default |
| 4 | **[[Foundry Agent Service]] MCP-Tool** | GA | Client | Entra Agent ID oder bring-your-own-OAuth | Hosted MCP Tools im Foundry-Portal |
| 5 | **Foundry MCP Server** (`mcp.ai.azure.com`) | Live seit 12/2025 *{UNCLEAR GA-Kennzeichnung}* | Server (MS-eigen) | Entra ID | VS Code / Visual Studio / Foundry-Portal |
| 6 | **[[Foundry IQ]] Knowledge Bases via MCP** | Preview/GA *{UNCLEAR}* | Server | Entra ID | MCP-Endpoint `/knowledgebases/{kb}/mcp?api-version=2025-11-01-preview` |
| 7 | **[[Foundry Local]] MCP** | GA | Client + Server (lokal) | Lokal passwortfrei; Remote via Entra | Hardware-gebunden (NPU/GPU/CPU-Fallback) |
| 8 | **Windows 11 On-device Agent Registry (ODR)** | Insider Preview (12/2025); Taskbar-AI-Agents ab 17.04.2026 | Host/Broker für lokale MCP-Connectoren | Per-Connector-Identity + Sandbox | Built-in: File Explorer + Windows Settings |
| 9 | **[[Dataverse MCP Server]]** | GA (Billing ab 15.12.2025) | Server | Entra ID | Built-in Tools: read/insert/update, search knowledge, exec prompts. **Externe Agents werden berechnet** (ausser D365-Premium / M365-Copilot-USL) |
| 10 | **Power Apps MCP Server** | Preview/GA *{UNCLEAR}* | Server | Entra ID | Model-driven App Operations |
| 11 | **Agent 365 / Work IQ MCP Servers** | Preview | Server-Familie | Entra ID | Kuratierte M365-Produktivitäts-Tools |
| 12 | **[[APIM AI Gateway]] MCP-Proxy** | GA | Proxy | Vor-Auth (Subscription Key, Entra OAuth, mTLS) | Rate-Limit, Token-Quota, Logging via App Insights |

---

## Auth-Story (Three-Hop-Flow im MS-Kontext)

```
Step 1: User → Agent-Host
────────────────────────────
Interactive SSO gegen Entra ID
Access Token für MCP-Server (audience = MCP-Server-App-Reg)

                   ▼

Step 2: Agent-Host → MCP-Server
────────────────────────────────
Bearer-Token mit `resource`-Parameter (RFC 8707)
Server validiert via Entra JWKS + PRM (RFC 9728)

                   ▼

Step 3: MCP-Server → Downstream (Graph, Dataverse, SharePoint)
─────────────────────────────────────────────────────────────
On-Behalf-Of (OBO) — Server tauscht User-Token
gegen Downstream-Audience-Token
→ ACLs bleiben erhalten (wichtig für Business-Daten)
```

### OBO vs. App-Principal

- **OBO (User-Kontext)** — bevorzugt für Business-Daten, ACLs bleiben erhalten. [[Azure Functions]] MCP Extension unterstützt OBO nativ.
- **App-Principal / Managed Identity / [[Entra Agent ID]]** — für Backend ohne User-Context (Batch-Agents). Entra Agent ID bevorzugt gegenüber Service-Principal, weil Agent-spezifische Governance greift.

### Scope-Granularität

**Coarse by Spec** — ein Scope pro MCP-Server. **Feingranular pro Tool** ist nicht Spec-Feature; über **[[APIM AI Gateway]]-Policy** nachgelagert.

### Token-Storage-Patterns

1. **Session-Key** — Token im Client-Session-State (Spec-konform)
2. **Persistent Refresh Token** — in Secure Storage (Windows Credential Manager, Copilot-Studio-Connector-Secrets)
3. **Entra Agent ID** — automatische Token-Rotation, keine Secrets in Dev-Hand

---

## Enterprise-Patterns

### Pattern A — [[APIM AI Gateway]] als MCP-Proxy

```
┌───────────────────────────────────────────────────────────────┐
│  Agents (MAF, Copilot Studio, Foundry)                        │
└───────────────────────────────────────────────────────────────┘
                            │ mTLS + Entra OAuth
                            ▼
┌───────────────────────────────────────────────────────────────┐
│  APIM AI Gateway                                              │
│   • rate-limit-by-key (per Session / Subscription)            │
│   • llm-token-limit (Token-Budget)                            │
│   • llm-content-safety (Prompt Shields)                       │
│   • Prompt-Logging (App Insights)                             │
│   • Circuit Breaker mit Retry-After                           │
└───────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
  ┌──────────────┐  ┌─────────────┐  ┌──────────────┐
  │ MCP Server 1 │  │ MCP Server 2│  │ MCP Server N │
  │ (Dataverse)  │  │ (Jira)      │  │ (Custom)     │
  └──────────────┘  └─────────────┘  └──────────────┘
```

### Pattern B — Zero Trust Agent-Identity

[[Entra Agent ID]] + Conditional Access werten Agent-Risk aus (Frequenz, Location, anomale Tool-Muster) **vor** jedem MCP-Call. Server validiert Agent-ID-Claims im Token.

### Pattern C — OpenTelemetry-Tracing

OTel-Context wird durch MCP-Call propagiert; ein Trace zeigt Agent-Reasoning → Tool-Auswahl → MCP-Server → Downstream.

---

## Ecosystem-Landschaft

**Third-Party MCP-Server (offiziell, stable)**:
- **Atlassian** (Jira, Confluence) — Remote-MCP auf Cloudflare, HTTP/SSE-Sunset 04/2026
- **Notion** — Official Server v2.0.0
- **GitHub** — Remote-Server (offiziell)
- **Slack** — Community/Marketplace *{UNCLEAR: offizieller Slack-Server}*

**Directories**:
- [modelcontextprotocol.io/servers](https://github.com/modelcontextprotocol/servers) — Steering-Group-Reference
- [pulsemcp.com/servers](https://www.pulsemcp.com/servers) — Community-Directory, 12.970+ Server

### Eigenbau vs. Konsum

```
                Drittanbieter hat offiziellen MCP-Server?
                              │
                           JA ▼    NEIN ▼
              ┌─────────────────┐    ┌──────────────────────┐
              │ 🟢 Konsumieren  │    │ Legacy-API?          │
              └─────────────────┘    └──────────────────────┘
                                           │
                                        JA ▼    NEIN ▼
                               ┌─────────────────┐  ┌──────────────┐
                               │ [[Azure Funct.]]│  │ Eigen-Server │
                               │ MCP Extension   │  │ via Spec SDK │
                               │ (serverless,    │  │              │
                               │  OBO, günstig)  │  │              │
                               └─────────────────┘  └──────────────┘

                Ab 2 MCP-Servern im Enterprise: [[APIM AI Gateway]] vorschalten
```

---

## vs. Konkurrenz

- **OpenAI Function Calling** — bleibt sinnvoll für app-interne Tools; MCP für shared Infrastructure-Tools
- **OpenAI Assistants API** — von OpenAI selbst zu **Mitte 2026 deprecated** zugunsten von MCP
- **LangChain Tools** — Layer oberhalb; konsumiert MCP-Server als ein Backend

---

## Limitierungen & Fallstricke

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| **Versioning-Chaos** — 3 Spec-Versionen (2024-11, 2025-03, 2025-11) laufen parallel | Alignment-Check in jeder Integration, SDK-Versionen pinnen |
| **Schema-Explosion** — Cursor-Limit 30 Tools/Agent | Tool-Sets pro Agent-Rolle zuschneiden |
| **Tool Poisoning** — schadhafte Instruktionen in Tool-Descriptions (CVE-2026-26118) | `mcp-scan` (Invariant Labs) in CI; OWASP MCP Top 10 als Audit-Baseline |
| **Prompt Injection via MCP-Outputs** — Server-Antworten können Modell-Instruktionen enthalten | Output-Filter / Content Safety nach jedem MCP-Call |
| **Auth-Komplexität** — OAuth 2.1 + PKCE + OBO + Agent ID steil | Journai-interne Referenz-Implementierung als Muster |
| **Microsoft-MCP-Server-CVEs** — selbst MS-Server sind angreifbar | Defense-in-Depth: APIM-Proxy + Defender for AI + Audit |

### Fallstricke (konzeptionell)

- **MCP als Heilsbringer sehen** — löst Integrations-Problem, nicht Agent-Design-Problem
- **Dataverse-Billing-Überraschung** — externe Agents (nicht Copilot Studio) werden seit 15.12.2025 pro MCP-Tool-Call berechnet
- **A2A vs. MCP verwechseln** — MAF 1.0 bringt A2A (Agent-to-Agent) separat; klare Trennung: MCP = Tool-Integration, A2A = Agent-zu-Agent-Kollaboration

---

## Offizielle Referenzen & Monitoring

### Primary

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Spec | MCP 2025-11-25 | https://modelcontextprotocol.io/specification/2025-11-25 | 2026-04-22 |
| Spec-Auth | Authorization Spec | https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization | 2026-04-22 |
| Roadmap | 2026 MCP Roadmap | https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/ | 2026-04-22 |
| MS Copilot Studio | GA-Ankündigung 29.05.2025 | https://www.microsoft.com/en-us/microsoft-copilot/blog/copilot-studio/model-context-protocol-mcp-is-now-generally-available-in-microsoft-copilot-studio/ | 2026-04-22 |
| MS Copilot Studio Docs | | https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp | 2026-04-22 |
| MS Azure Functions MCP Bindings | | https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-mcp | 2026-04-22 |
| MS Azure Functions Repo | azure-functions-mcp-extension | https://github.com/Azure/azure-functions-mcp-extension | 2026-04-22 |
| MS MAF 1.0 GA | DevBlog 03.04.2026 | https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/ | 2026-04-22 |
| MS MAF Local MCP Tools | | https://learn.microsoft.com/en-us/agent-framework/agents/tools/local-mcp-tools | 2026-04-22 |
| MS MAF Hosted MCP Tools | | https://learn.microsoft.com/en-us/agent-framework/agents/tools/hosted-mcp-tools | 2026-04-22 |
| MS Foundry Agent Service MCP | | https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/tools/model-context-protocol | 2026-04-22 |
| MS Foundry MCP Server | | https://github.com/microsoft-foundry/mcp-foundry | 2026-04-22 |
| MS Windows 11 MCP Overview | | https://learn.microsoft.com/en-us/windows/ai/mcp/overview | 2026-04-22 |
| MS Dataverse MCP | | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-mcp | 2026-04-22 |
| MS APIM MCP Server | | https://learn.microsoft.com/en-us/azure/api-management/mcp-server-overview | 2026-04-22 |
| MS Entra Agent ID Security | | https://learn.microsoft.com/en-us/entra/agent-id/security-for-ai-overview | 2026-04-22 |

### Security / Community

| Quelle | Link | Zuletzt gesichtet |
|--------|------|-------------------|
| OWASP MCP Top 10 | https://owasp.org/www-project-mcp-top-10/ | 2026-04-22 |
| PointGuard AI — CVE-2026-26118 | https://www.pointguardai.com/ai-security-incidents/microsoft-mcp-server-vulnerability-opens-door-to-ai-tool-hijacking-cve-2026-26118 | 2026-04-22 |
| Simon Willison — MCP Prompt Injection | https://simonwillison.net/2025/Apr/9/mcp-prompt-injection/ | 2026-04-22 |
| PulseMCP Directory | https://www.pulsemcp.com/servers | 2026-04-22 |
| MCP Reference Servers | https://github.com/modelcontextprotocol/servers | 2026-04-22 |

---

## UNCLEAR

1. Welche MS-Produkte Sampling explizit exposen
2. Foundry IQ MCP-Endpoint GA-Status (Preview oder GA)
3. Power Apps MCP Server Preview/GA-Status
4. Foundry MCP Server `mcp.ai.azure.com` GA-Kennzeichnung
5. MAF Python 2026 Streaming-spezifische Bugs (Changelog-Details)

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Spec-Status 2025-11-25, 12+ MS-Integrations-Matrix, Three-Hop-Auth-Diagramm, Enterprise-Patterns (APIM-Proxy, Zero Trust, OTel), Ecosystem-Landschaft, Fallstricke inkl. CVE-2026-26118 + OWASP MCP Top 10 | 38 Quellen |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
