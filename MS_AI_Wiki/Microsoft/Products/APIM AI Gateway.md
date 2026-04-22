---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [API Management AI Gateway, GenAI Gateway]
moc:
  - "[[Microsoft MOC]]"
  - "[[Integration & Compute MOC]]"
---

# APIM AI Gateway

*Azure API Management mit **spezifischen AI-Policies** als Enterprise-Proxy zwischen Agents und Modell-Endpunkten (oder [[Model Context Protocol|MCP]]-Servern). **Kein separates SKU** — Erweiterung des bestehenden APIM-Gateways. Fünf GA-Policies: `llm-token-limit`, `llm-emit-token-metric`, `llm-semantic-cache-lookup`/`-store`, `llm-content-safety`, **MCP-Server-Proxy**. Journai-Produktions-Baseline: **Standard v2 in Switzerland North** (~€665/Monat, VNet inklusive).*

> **Analogie:** Was ein klassisches API-Gateway für REST-APIs ist, nur dass die AI-Variante speziell Token/Prompt/MCP versteht.

---

## Einsatz

### Job-to-be-done

When I mehrere AI-Workloads oder Kunden auf gemeinsame Modell-Backends route, I want to Rate-Limiting, Token-Budget, Semantic-Cache und MCP-Proxy vor dem LLM-Endpunkt, so I can Cost-Caps + Auditing zentral durchsetzen statt pro Agent.

### Trigger-Signale

- „Azure-OpenAI-Rechnung ist letzten Monat explodiert, weil ein User einen Loop gebaut hat."
- „Mehrere Agents teilen ein PTU — wer verbraucht wieviel?"
- „Wir brauchen einen MCP-Proxy für Enterprise-Governance."

### Einsatz-Szenarien

1. **Token-Budget pro Kunde / Agent** — bei Multi-Tenant-Deployments mit `llm-token-limit` harte Caps pro Subscription-Key; Budget-Alert via Azure Monitor.
2. **Semantic-Cache für häufige Prompts** — `llm-semantic-cache-lookup`/`-store` senkt Kosten messbar bei Customer-Support-Agents mit repetitiven Queries.
3. **MCP-Server-Proxy** — einheitlicher Auth + Audit für mehrere Backend-MCP-Server (z. B. [[Azure Functions]] + [[Dataverse MCP Server]] + Dritt-MCP).

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | APIM Standard v2 oder Premium v2 (VNet-Support + AI Policies) |
| **Tenant / Infrastruktur** | Azure-Architekt für Policy-Definition; Journai-Baseline: Standard v2 in Switzerland North |
| **Skills / Rollen** | Policy-XML / IaC-Skills; Observability für `llm-emit-token-metric` |
| **Compliance-Rahmen** | VNet-Integration + Private Endpoints + Managed Identity |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | 2–5 Tage für Baseline-Policies als Infra-as-Code |
| **Laufende Lizenzkosten** | Standard v2 CH ~€665/Monat (VNet inklusive); Premium deutlich höher |
| **Laufender Betrieb** | gering; Policy-Reviews quartalsweise bei Feature-Änderungen |

### Empfehlung

**Status:** 🟢 **für Multi-Agent-/Multi-Kunden-Setups Pflicht**; 🟡 für Single-Agent unnötiger Overhead.

**Nächster Schritt für Journai:** Standard-Policy-Template (`llm-token-limit` + `semantic-cache` + `llm-content-safety` + MCP-Proxy) als Bicep/IaC im Starter-Repo ablegen; als Default-Deployment für alle Multi-Agent-Kunden.

---

## 5 GA-AI-Policies (Stand April 2026)

### Token-Kontrolle & Metriken

| Policy | Zweck |
|--------|-------|
| **`llm-token-limit`** | TPM oder Token-Quota pro Zeitfenster (hourly/daily/weekly/monthly/yearly); Counter-Key frei (Subscription-Key, IP, Custom-Header). Prompt-Tokens vorab berechnet. Unterstützt auch GPT-4o Realtime (WebSocket) |
| `azure-openai-token-limit` | identisch, aber nur AOAI-Endpunkte (die generische `llm-token-limit` ist bevorzugt) |
| **`llm-emit-token-metric`** / **`llm-emit-metric`** | emittiert Token-Verbrauch an Application Insights mit custom dimensions (Client IP, API ID, User ID) |

### Semantic Cache

| Policy | Zweck |
|--------|-------|
| **`llm-semantic-cache-lookup`** | sucht semantisch ähnliche Prompts via Embeddings-API in Azure Managed Redis |
| **`llm-semantic-cache-store`** | speichert Completion mit Vektor-Embedding |
| **Neu 2026** | Import-Workflow konfiguriert Redis + Embedding-Modell automatisch via Dropdown |

### Content Safety

**`llm-content-safety`** — proxyt Prompts/Completions zu [[Azure AI Content Safety]].

```xml
<llm-content-safety shield-prompt="true"
                    enforce-on-completions="true"
                    categories="FourSeverityLevels">
  <blocklists>
    <blocklist name="journai-custom">...</blocklist>
  </blocklists>
</llm-content-safety>
```

- `shield-prompt="true"` → aktiviert **Prompt Shields** (Direct = Jailbreak, Indirect = XPIA/Cross-Domain Prompt Injection)
- `enforce-on-completions="true|false"` — auch Antworten prüfen
- `categories`: `FourSeverityLevels` oder `EightSeverityLevels`
- Bei Detection → **HTTP 403**
- Backend-Auth nur via Managed Identity auf `https://cognitiveservices.azure.com`

### MCP-Server-Proxy (GA!)

Tier-Support: Developer | Basic | Basic v2 | Standard | Standard v2 | Premium | Premium v2.

**Registrierung (Portal-Flow):**

```
APIM-Instanz
  → APIs → MCP servers → + Create MCP server
  → "Expose an existing MCP server"
  → Backend-URL (z.B. https://learn.microsoft.com/api/mcp)
  → Transport: Streamable HTTP (Default) oder SSE
  → Base-Path (z.B. "mytools")
  → Server-URL: https://<apim>.azure-api.net/<base-path>-mcp/mcp
```

**Auth-Passthrough-Optionen:**
1. APIM Subscription Key (`Ocp-Apim-Subscription-Key`-Header)
2. OAuth 2.0 / JWT via Entra ID
3. Forwarding (MCP-Spec 2025-06-18 Authorization-Standard)

**Policies auf MCP-Server** gelten für alle Tools. **Evaluations-Reihenfolge**: Global → MCP-Server.

**Beispiel Rate-Limit pro MCP-Session:**

```xml
<choose>
  <when condition="@(...method == 'tools/call')">
    <rate-limit-by-key calls="1" renewal-period="60"
      counter-key="@(context.Request.Headers.GetValueOrDefault('Mcp-Session-Id','unknown'))" />
  </when>
</choose>
```

**Einschränkungen (Stand April 2026):**
- 🔴 **Kein Workspace-Support** für MCP-Server
- 🔴 **Tools werden NICHT in APIM angezeigt** (Registry liegt auf externem MCP-Server)
- 🔴 **MCP-Prompts nicht unterstützt** — nur Tools + Resources
- 🔴 `context.Response.Body` in Policies vermeiden (bricht Streaming)
- Diagnostics: `Frontend Response payload bytes = 0` global setzen

---

## APIM-Tier-Anforderungen

Banner-Phrase auf der AI-Gateway-Doc: *„APPLIES TO: All API Management tiers"* — aber mit Einschränkungen:

| Tier | AI-Policies | Semantic Cache | Workspaces | MCP-Server |
|------|:---:|:---:|:---:|:---:|
| **Consumption** | ❌ keine `*-by-key` / `llm-token-limit` (Counter-Key fehlt) | ❌ | ❌ | *{UNCLEAR}* |
| **Developer** | ✅ (nicht für Prod) | ✅ | ✅ | ✅ |
| **Basic v2** | ✅ | ✅ | *{UNCLEAR — Workspace-Gateway nur Premium}* | ✅ |
| **Standard v2** | ✅ | ✅ | ✅ (Workspaces GA) | ✅ |
| **Premium / Premium v2** | ✅ (voller Umfang, VNet, Zonen, Multi-Region) | ✅ | ✅ + Workspace-Gateway | ✅ |

**Wichtig für Journai**:
- AI-Gateway-Integration in Microsoft Foundry (Preview) verlangt APIM in **v2-Tier** — Default beim Neuanlegen aus Foundry ist **Basic v2**, Produktion → **Standard v2** oder **Premium v2**
- MCP-Server in **Workspaces aktuell nicht** supported

---

## EU/CH-Regionen v2-Tiers (Stand 2026-03-11)

| Region | Basic v2 | Standard v2 | Premium v2 | Workspace Gateway |
|--------|:---:|:---:|:---:|:---:|
| **Switzerland North** | ✅ | ✅ | **❌** | **❌** |
| Switzerland West | — | — | — | — |
| **West Europe** | ✅ | ✅ | ❌ | ✅ |
| **North Europe** | ✅ | ✅ | ❌ | ✅ |
| France Central | ✅ | ✅ | ❌ | ✅ |
| **Germany West Central** | ✅ | ✅ | **✅** | ✅ |
| Norway East | ✅ | ✅ | ✅ | ✅ |
| Sweden Central | ✅ | ✅ | ✅ | ❌ |
| Italy North | ✅ | ✅ | ❌ | ❌ |

**Für Journai (CH-Fokus)**:
- Switzerland North hat v2, aber **kein Premium v2** und **kein Workspace-Gateway**
- Bei Bedarf (Zonen, Workspace-Runtime): **Germany West Central** oder **Norway East** als EU-Fallback — DSGVO-konform
- **Workspace-Gateway** für Multi-Team-Runtime nur West Europe / GWC / France Central / Norway East

---

## Multi-Backend-Routing & Resilienz

APIM hat einen **nativen Backend-Load-Balancer** (kein separates Produkt):

```
           ┌─────────────────────────────────┐
           │ APIM AI Gateway                 │
           └─────────────────────────────────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
    ┌───────────────┐ ┌────────┐ ┌──────────┐
    │ Priority-1    │ │ Prio-2 │ │ Prio-2   │
    │ PTU-Deploy    │ │ Global │ │ Global   │
    │ (CH North)    │ │ Std    │ │ Std      │
    │               │ │ (EU)   │ │ (EU)     │
    └───────────────┘ └────────┘ └──────────┘
      graceful failover bei 429 · Circuit Breaker mit dynamic
      trip duration (liest Retry-After Header!)
```

**Features:**
- **Priority-based Routing** (PTU-first, PAYG-Fallback)
- Round-Robin / Weighted / Session-Aware
- **Circuit Breaker** mit dynamic trip duration — liest `Retry-After`, pausiert nur so lange wie nötig, **maximiert PTU-Utilization**
- Retry mit Exponential Backoff als Policy
- **Built-in LLM-Logging** trackt Token-Verbrauch pro Backend für Cost Attribution

---

## Pricing (Stand April 2026)

Modell: **Fixe Stunden-/Monatsrate pro Instanz + Skalierungseinheiten**, keine Per-Request-Gebühr für APIM selbst.

| Tier | Preis | Bemerkung |
|------|-------|-----------|
| **Basic v2** | ~€0,29–0,35/h (≈ €210/Monat) | Dev/Test, SLA |
| **Standard v2** | **€0,912/h** (≈ **€665/Monat**) | VNet inklusive (vorher nur Premium) |
| **Premium (klassisch)** | ~$2.800/Monat Einstieg | Multi-Region, Zonen, Workspace-Gateway |
| **Premium v2** | *{UNCLEAR: abweichend pro Region}* | |

**Zusatzkosten bei AI-Gateway-Nutzung**:
- **Azure Managed Redis** für Semantic Cache (ab ~€0,40/h)
- **[[Azure AI Content Safety]]** per-Request (`llm-content-safety`)
- **Application Insights** Log-Ingestion

**CH-spezifische Premium-v2-Preise**: *{UNCLEAR — via Azure-Pricing-Calculator mit Region-Filter}*.

---

## Abgrenzung zu Foundry Control Plane

| Aspekt | **APIM AI Gateway** | **[[Foundry Control Plane]]** |
|--------|---------------------|--------------------------------|
| **Rolle** | Netzwerk-Edge: Policy-Enforcement zwischen Client und Modell | Orchestrierung: Agent-Inventory, Model-Registry, Tool-Governance |
| **Position** | **Davor**: Client → APIM → Model-Endpoint | **Dahinter/Seitlich**: Foundry verwaltet Deployments, Agents, Tools |
| **Use-Case** | Token-Limits, Rate-Limit, Content Safety, Semantic Cache, Auth | Agent-Lifecycle, Prompt Flow, Evaluation, Foundry Agents Service |
| **2026-Integration** | Lässt sich **direkt in Foundry integrieren** (Preview): Foundry UI konfiguriert APIM-Policies für Models, Agents, Tools | Registriert Custom-Agents (auch ausserhalb Azure) → Governance via APIM |
| **Produktions-Empfehlung** | Für Custom-Policies, Enterprise-Networking, Federated Gateways | Für Agent-Service + managed Tool-Inventory |

**Regel für Journai**:
> **APIM davor für Policy-Enforcement** (Token, Safety, Cache, MCP-Proxy). **Foundry dahinter für Agent-Lifecycle & Model-Deployments**. AI-Gateway-Foundry-Integration (Preview) verschmilzt beide UIs, Backend bleibt APIM.

---

## Journai-Produktions-Baseline (Empfehlung)

```
Tier:         Standard v2 in Switzerland North
              (~€665/Monat, VNet inklusive)

Policies:
  ┌─────────────────────────────────────────────────────────────┐
  │ llm-token-limit        → pro Subscription-Key (= Tenant/    │
  │                          Agent-Team)                         │
  │ llm-semantic-cache     → Azure Managed Redis                │
  │   -lookup + -store                                           │
  │ llm-content-safety     → shield-prompt="true"               │
  │                          enforce-on-completions="true"      │
  │ llm-emit-token-metric  → Tenant-ID-Dimension                │
  │ Multi-Backend          → Priority-Pool PTU (CH) → Global    │
  │                          Standard (EU) Fallback              │
  │                          Circuit Breaker nutzt Retry-After   │
  │ MCP-Proxy              → externe MCP-Server registrieren,   │
  │                          NICHT in Workspaces                │
  └─────────────────────────────────────────────────────────────┘

Foundry-Integration: aktivieren (Preview), aber Policies in APIM-
                     nativer UI pflegen
```

---

## Limitierungen & Fallstricke

| Limitierung | Workaround |
|-------------|-----------|
| **Consumption-Tier unzureichend** (keine `*-by-key`) | v2-Tier von Anfang an |
| **CH North hat kein Premium v2** | Germany West Central / Norway East |
| **CH North kein Workspace-Gateway** | WE / GWC / FC / NE |
| **MCP-Server in Workspaces unsupported** | eigene APIM-Instanz oder Root-APIM |
| **MCP-Prompts nicht supported** | Tools + Resources only |
| **Streaming-Bruch bei Response-Body-Access** | Policy-Design vermeiden |

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| [[Foundry Models]] | Backend für `llm-*`-Policies — Azure OpenAI + MaaS | GA | PTU-Deployment als Backend-Pool-Eintrag; Key-Vault für Secrets |
| [[Microsoft Agent Framework]] | Agent-Calls durch APIM geroutet für Budget + Audit | GA | MAF-Client-Config auf APIM-Endpoint, nicht direkt auf Foundry |
| [[Foundry Control Plane]] | komplementär: APIM = Traffic-Layer, Control Plane = Observability | GA | keine Überlappung — beide parallel einsetzen |
| [[Microsoft Entra Suite]] / Entra | OAuth 2.1 Policy-basierte Auth | GA | App-Registration pro Consumer-Agent |
| [[Azure AI Content Safety]] | `llm-content-safety`-Policy ruft Content Safety vor Modell | GA | eigener AI-Services-Account nötig |
| [[Model Context Protocol]] | MCP-Proxy als GA-Feature seit Ignite 2025 | GA | MCP-Server-Definition in Backend-Pool, OAuth-Flow weitergereicht |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| OpenAI API (direkt) | als Backend neben Azure OpenAI — Multi-Vendor-Routing | GA | OpenAI-Key-Management separat |
| Anthropic API (direkt) | Backend-Option; als Alternative zu Foundry-Anthropic | GA | Nicht-MS-DPA prüfen |
| Datadog / Dynatrace | Monitoring via APIM-Metrics (Token-Count, Latency) | GA | APIM-Diagnostic-Settings → Event Hub → Third-Party |

### APIs / Protokolle

- **APIM REST** für Policy-Management (IaC via Bicep / Terraform / `az apim`)
- **OpenAI-kompatible REST** als Frontend-Schema — macht APIM zum Drop-in-Proxy
- **MCP (2025-11-25)** für Tool-Server-Proxying

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | APIM-Instanz-Region bestimmt Daten-Lokation. Standard v2 + Premium v2 in Switzerland North GA |
| **Prompts & Outputs** | werden NICHT persistiert von APIM (nur Metrics + Diagnostic-Logs). Semantic Cache speichert Hashes + Response-Bodies im Azure Cache for Redis — eigene Region-Wahl |
| **Data Processing Addendum (DPA)** | Azure-DPA covered; bei Third-Party-Backends (OpenAI, Anthropic) zusätzliche DPAs |
| **EU-AI-Act-Klassifizierung** | APIM selbst = Limited Risk; der durchgeleitete Workload kann High Risk sein — Policies + Logging bilden Audit-Basis |

### Microsoft-Compliance-Stack

- **Entra Managed Identity** für Backend-Auth (statt Subscription Keys im Klartext)
- **Key Vault** für Backend-Secrets (OpenAI-Keys, Anthropic-Keys)
- **VNet-Integration** (Standard v2 / Premium v2) mit Private Endpoints zu Foundry, AI Search
- **Azure Monitor** + **Application Insights** für `llm-emit-token-metric`-Auswertung
- **Microsoft Defender for Cloud** — APIM-Ressourcen-Posture

### Bekannte Compliance-Lücken

- **Semantic Cache speichert Response-Bodies** — sensitive Outputs landen im Cache. Opt-out per Policy nötig für regulierte Kunden.
- **llm-content-safety blockiert**, aber der Attempt wird in Logs geschrieben — Prompt-Leak-Risiko wenn Log-Retention zu lang.
- **MCP-Proxy-OAuth-Flow** leitet User-Tokens weiter — Token-Expiry-Handling prüfen, sonst Silent Failures.

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | GenAI Gateway Capabilities | https://learn.microsoft.com/en-us/azure/api-management/genai-gateway-capabilities | 2026-04-22 |
| Docs | Azure OpenAI Token Limit Policy | https://learn.microsoft.com/en-us/azure/api-management/azure-openai-token-limit-policy | 2026-04-22 |
| Docs | LLM Content Safety Policy | https://learn.microsoft.com/en-us/azure/api-management/llm-content-safety-policy | 2026-04-22 |
| Docs | Semantic Caching | https://learn.microsoft.com/en-us/azure/api-management/azure-openai-enable-semantic-caching | 2026-04-22 |
| Docs | MCP Server Overview | https://learn.microsoft.com/en-us/azure/api-management/mcp-server-overview | 2026-04-22 |
| Docs | Expose Existing MCP Server | https://learn.microsoft.com/en-us/azure/api-management/expose-existing-mcp-server | 2026-04-22 |
| Docs | Secure MCP Servers | https://learn.microsoft.com/en-us/azure/api-management/secure-mcp-servers | 2026-04-22 |
| Docs | v2 Tiers Overview | https://learn.microsoft.com/en-us/azure/api-management/v2-service-tiers-overview | 2026-04-22 |
| Docs | Region Availability | https://learn.microsoft.com/en-us/azure/api-management/api-management-region-availability | 2026-04-22 |
| Docs | Enable AI Gateway in Foundry | https://learn.microsoft.com/en-us/azure/foundry/configuration/enable-ai-api-management-gateway-portal | 2026-04-22 |
| Docs | Connect AI Gateway to Foundry Agents | https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/ai-gateway | 2026-04-22 |
| Ref-Arch | APIM-based GenAI Gateway | https://learn.microsoft.com/en-us/ai/playbook/technology-guidance/generative-ai/dev-starters/genai-gateway/reference-architectures/apim-based | 2026-04-22 |
| Multi-Backend | Architecture Guide | https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/azure-openai-gateway-multi-backend | 2026-04-22 |
| Pricing | APIM Pricing | https://azure.microsoft.com/en-us/pricing/details/api-management/ | 2026-04-22 |
| GitHub | Azure-Samples/AI-Gateway | https://github.com/Azure-Samples/AI-Gateway | 2026-04-22 |
| GitHub | Backend-Pool Load-Balancing Lab | https://github.com/Azure-Samples/AI-Gateway/blob/main/labs/backend-pool-load-balancing/README.MD | 2026-04-22 |
| GitHub | openai-apim-lb Python | https://github.com/Azure-Samples/openai-apim-lb | 2026-04-22 |
| GitHub | remote-mcp-apim-functions-python | https://github.com/Azure-Samples/remote-mcp-apim-functions-python | 2026-04-22 |
| GitHub | ai-hub-gateway-solution-accelerator | https://github.com/Azure-Samples/ai-hub-gateway-solution-accelerator | 2026-04-22 |

---

## UNCLEAR

1. CH-spezifische Premium-v2-Preise (Pricing-Calculator direkt)
2. MCP-Server-Support in Consumption-Tier (unklar)
3. Workspace-Gateway-Roadmap für Switzerland North

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | 5 GA-AI-Policies dokumentiert, MCP-Proxy GA (mit Einschränkungen: kein Workspace, keine Prompts), Tier-Matrix, CH-Region-Verfügbarkeit (kein Premium v2), Multi-Backend-Routing mit Circuit Breaker + Retry-After, Pricing Std v2 ~€665/Monat CH North, Abgrenzung zu Foundry Control Plane (APIM davor, Foundry dahinter), Journai-Produktions-Baseline | 6 Searches + 3 Docs-Fetches + GitHub Samples |
| 2026-04-21 | Hongyu | Initial Stub | Arbeitsauftrag |
