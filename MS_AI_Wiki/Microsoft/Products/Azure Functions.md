---
watch: close
status: ga
last_verified: 2026-04-22
aliases: []
moc:
  - "[[Microsoft MOC]]"
  - "[[Integration & Compute MOC]]"
---

# Azure Functions

*Microsoft's Serverless-Compute — **seit 2026 nicht mehr nur Event-Handler**, sondern **Agent-Baustein mit drei Personas**: Agent-Host, MCP-Tool-Provider und Durable-Workflow-Engine. Drei GA-Features relevant: **Flex Consumption** (GA Dez 2024, neuer Default-Plan), **MCP Binding** (GA Januar 2026, Function als MCP-Server), **Durable Task Scheduler** (GA, neuer State-Provider für langlaufende Workflows). ⚠️ **Flex Consumption Switzerland-Verfügbarkeit UNCLEAR** — wichtig für CH-Datenresidenz.*

> **Analogie:** AWS Lambda mit drei Agent-Erweiterungen: MCP-Tool-Binding macht Functions zum nativen Tool-Provider für LLM-Agents, Durable Task erlaubt Human-in-the-Loop über Tage, Flex Consumption bringt VNet + 1000 Instanzen.

---

## Einsatz

### Job-to-be-done

When I event-getriebene Agent-Bausteine oder MCP-Tools hoste, I want to Serverless-Compute mit Flex Consumption + MCP Binding + Durable Task, so I can Pay-per-Invocation-Skalierung ohne Container-Build erreichen.

### Trigger-Signale

- „Agent soll auf Message-Queue / Blob-Upload reagieren — nicht 24/7 laufen."
- „Wir wollen ein Custom MCP-Tool in Python für unseren Agent hosten."
- „Long-Running-Workflow mit Human-in-the-Loop über Tage."

### Einsatz-Szenarien

1. **MCP-Tool-Provider für Foundry-Agents** — Function-App mit MCP Binding exponiert Line-of-Business-Funktionen als Tools; Auth via Easy Auth + Entra.
2. **Durable-Task-Workflow** — mehrtägige Prozesse mit Timeouts, Approvals und Fan-out; ersetzt klassisches Azure-Logic-Apps-State-Management wenn Pro-Code gewünscht.
3. **Event-driven Ingestion** — Blob/Service-Bus-triggered Function, die Dokumente an [[Azure AI Document Intelligence]] / [[Azure AI Search]] pusht.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Azure-Subscription |
| **Tenant / Infrastruktur** | Flex-Consumption-Plan-Region — *{TODO: CH-Verfügbarkeit UNCLEAR, ggf. Consumption v2 als Fallback}* |
| **Skills / Rollen** | Python/.NET-Dev + Azure-Basics |
| **Compliance-Rahmen** | Entra Managed Identity für Bindings, Private Endpoints für VNet-Integration |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | 1–3 Tage für erste produktive Function |
| **Laufende Lizenzkosten** | typisch €50–200/Monat (volumenabhängig), Flex ab Execution Units |
| **Laufender Betrieb** | minimal bei Flex (kein Plan-Mindestbetrag) |

### Empfehlung

**Status:** 🟢 — Default-Hosting für MAF-Agents ohne Container-Build-Pipeline und für Custom-MCP-Tools. MCP Binding (GA Jan 2026) macht Function-Apps zum nativen Tool-Provider.

**Nächster Schritt für Journai:** CH-Flex-Verfügbarkeit final klären; Referenz-Template „Function as MCP-Tool" im Journai-Starter-Repo ablegen.

---

## Die drei Agent-Personas

```
┌─────────────────────────────────────────────────────────────────┐
│ Azure Functions als Agent-Baustein (2026)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. HOSTING                    → MAF-Agent in Function-App      │
│     Microsoft.Agents.AI            (Single-Agent, Event-        │
│     .Hosting.AzureFunctions         Handler-Agent)              │
│                                                                 │
│  2. MCP-TOOL-PROVIDER          → Function = MCP-Server          │
│     McpToolTrigger +               für MAF / Copilot / Claude    │
│     McpResourceTrigger             (Streamable HTTP + OBO)       │
│                                                                 │
│  3. DURABLE-WORKFLOW-ENGINE    → langlaufende Agent-Jobs mit    │
│     OrchestrationTrigger +         Human-Approval (Tage), Fan-  │
│     Durable Task Scheduler         Out/Fan-In, Sub-Orchestr.    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Drei Runtime-Modi — Vergleichstabelle

| Feature | **Consumption** (Legacy) | **Premium (EP1–EP3)** | **Flex Consumption** *(neu)* |
|---------|:---:|:---:|:---:|
| **Status** | Legacy, aber GA | GA | **GA seit Dez 2024** (Pricing ab 01.12.2024) |
| **Scale-to-Zero** | ✅ | ❌ (min. 1 Instanz) | ✅ |
| **Cold Start** | 1–10 s | ❌ pre-warmed | reduziert; mit **Always-Ready**: kein Cold Start |
| **Max. Instanzen** | 200 | 100 (EP1) / 20–40 Plans | **1.000** |
| **Timeout** | ⚠️ **10 min Hard-Limit** | 30 min default, unlimited konfigurierbar | konfigurierbar, länger als Consumption |
| **VNet / Private Endpoint** | ❌ | ✅ | ✅ native Integration |
| **OS** | Windows + Linux | Windows + Linux | **Linux only** |
| **Instance-Größen** | fix | EP1/EP2/EP3 | 512 MB / 2.048 MB / 4.096 MB |
| **Billing-Modell** | GB-s + Executions | Core-Seconds (immer) | Per-Execution + optional Always-Ready-Baseline |
| **Per-Function-Scaling** | ❌ | ❌ | ✅ (HTTP/Blob/Durable-Gruppen) |
| **Deployment Slots** | ✅ | ✅ | ❌ (stattdessen Rolling Updates, Preview) |
| **Durable Storage** | Azure Storage | Azure Storage + DTS | **Nur Azure Storage oder Durable Task Scheduler** |

**→ Für Agents empfohlen: Flex Consumption** (VNet, skaliert, Always-Ready gegen Cold Start). Legacy Consumption disqualifiziert sich durch das 10-min-Timeout.

---

## Flex Consumption — Details

### Wann Flex, wann Premium?

```
Flex Consumption      →   event-driven, Scale-to-Zero, VNet nötig, Linux OK
                          (neuer Default für die meisten Szenarien)

Premium               →   Windows-Pflicht oder Deployment Slots oder
                          In-Process .NET oder CH-Region-Blocker
                          (Switzerland North funktioniert überall auf Premium)
```

### Einschränkungen (wichtig bei Pre-Sales)

- **Linux only** — keine Windows-Unterstützung
- **Kein In-Process .NET** — Isolated Worker Pflicht (siehe Migration-Notiz weiter unten)
- **Nur 1 App pro Plan** — keine Mehrfach-Hosting
- **Keine Deployment Slots** (stattdessen Rolling Updates in Preview)
- **Kein `WEBSITE_TIME_ZONE`**
- **Init-Timeout 30 s** — sonst gRPC-Fehler beim Startup
- **Per-Subscription Region-Quota: 250 Cores default**

### Regionale Verfügbarkeit (EU, Build-2025-Launch + Waves)

| Region | Flex Consumption GA |
|--------|:---:|
| West Europe | ✅ |
| North Europe | ✅ |
| France Central | ✅ |
| Germany West Central | ✅ |
| UK South | ✅ |
| Italy North | ✅ |
| **Switzerland North** | *{UNCLEAR}* ⚠️ |
| **Switzerland West** | *{UNCLEAR}* ⚠️ |

**🚨 Journai-Blocker für strikt-CH-residente Kunden**: Flex Consumption **nicht verifiziert in CH**. Fallback:
- **Premium-Plan in Switzerland North** (GA, alle EU-Regionen)
- **[[Azure Container Apps]]** in Switzerland North (bestätigt GA)

**Verifikations-Command**:
```bash
az functionapp list-flexconsumption-locations
```

---

## MCP Binding Deep-Dive (GA Januar 2026!)

### Status + Language-Support

- **Public Preview**: April 2025 → **GA Januar 2026**
- **Languages**: .NET (**nur Isolated Worker**), Java, JavaScript, TypeScript, Python (**v2-Modell Pflicht**)
- **❌ KEIN PowerShell**

### Package-Versionen (Minimum)

```
C#:      Microsoft.Azure.Functions.Worker.Extensions.Mcp
         Worker ≥ 2.1.0, SDK ≥ 2.0.2
Python:  azure-functions ≥ 1.24.0, v2-Programmiermodell
Node/TS: @azure/functions ≥ 4.9.0
Java:    azure-functions-java-library ≥ 3.2.2
```

### Trigger-Typen

| Trigger | Zweck |
|---------|-------|
| **`McpToolTrigger`** | Function wird als MCP-**Tool** aufgerufen (action) |
| **`McpResourceTrigger`** | Function liefert MCP-**Resource** (z.B. für Apps mit UI-Rückgabe) |

### Transport-Endpoints (beide automatisch exponiert)

- **Streamable HTTP** (empfohlen): `/runtime/webhooks/mcp`
- SSE (deprecated): `/runtime/webhooks/mcp/sse`

### Auth-Modell

```
Default:  System-Key "mcp_extension"
          via x-functions-key-Header oder ?code=-Query

Anonymous: system.webhookAuthorizationLevel="Anonymous" in host.json

Entra ID / OAuth: via App Service Built-in Authentication

OBO (On-Behalf-Of): ✅ unterstützt
                    → Tool ruft Downstream-Services (Graph, Dataverse,
                      SharePoint) mit User-Identität auf
```

### Code-Beispiel — C# (Isolated Worker)

```csharp
[Function(nameof(SaveSnippet))]
public string SaveSnippet(
    [McpToolTrigger("save_snippet", "Saves a code snippet")]
        ToolInvocationContext ctx,
    [McpToolProperty("name", "string", "Snippet name")] string name,
    [McpToolProperty("content", "string", "Snippet code")] string content)
{
    // Persistenz-Logik (Blob, Cosmos, SQL, …)
    return $"Saved: {name}";
}
```

### Code-Beispiel — Python (v2)

```python
import json

@app.generic_trigger(
    arg_name="context",
    type="mcpToolTrigger",
    toolName="save_snippet",
    description="Saves a snippet",
    toolProperties=json.dumps([
        {"propertyName": "name", "propertyType": "string",
         "description": "Snippet name"},
        {"propertyName": "content", "propertyType": "string",
         "description": "Snippet code"}
    ]))
def save_snippet(context) -> str:
    args = json.loads(context)["arguments"]
    # Persistenz
    return f"Saved: {args['name']}"
```

### host.json (Server-Metadata)

```json
{
  "extensions": {
    "mcp": {
      "serverName": "Journai-Tools",
      "serverVersion": "1.0.0",
      "instructions": "Beschreibung für Client-Agents",
      "encryptClientState": true
    }
  }
}
```

### Use-Case Journai

Beratungs-Tools (CRM-Lookup, Offert-Berechnung, Dokument-Generator) als MCP-Server in Functions hosten, von MAF / Copilot / Claude via `mcp.json` konsumieren. **Vorteil gegenüber Container-MCP**: kein Container-Build, Entra+OBO out-of-the-box, Scale-to-Zero.

---

## Durable Task — Kern-Pattern

### State-Storage (zwei Provider 2026)

```
Azure Storage Provider (klassisch)
  → Storage Account mit Queues + Tables
  → Overhead bei hoher Last

Durable Task Scheduler (DTS, neues Managed Backend)
  ├── Dedicated SKU (GA)
  │     → Capacity-Units: 2.000 Actions/s + 50 GB + 90 Tage Retention
  │     → empfohlen für konsistente Last
  └── Consumption SKU (GA)
        → pay-per-action, dynamisch skalierend
        → empfohlen für spiky Workloads
```

### Pattern 1 — Fan-Out / Fan-In

```csharp
[Function("Orchestrator")]
public async Task<int[]> Run([OrchestrationTrigger] TaskOrchestrationContext ctx)
{
    var items = await ctx.CallActivityAsync<string[]>("GetItems");
    var tasks = items.Select(i => ctx.CallActivityAsync<int>("Process", i));
    return await Task.WhenAll(tasks);  // parallel, stateful
}
```

### Pattern 2 — Human-in-the-Loop *(Journai-Relevant: Offert-Freigabe, Vertrag-Review)*

```csharp
[Function("ApprovalOrchestrator")]
public async Task Run([OrchestrationTrigger] TaskOrchestrationContext ctx)
{
    await ctx.CallActivityAsync("NotifyApprover", ctx.InstanceId);

    // Orchestrator schläft stateful, überlebt Neustarts
    var decision = await ctx.WaitForExternalEvent<string>(
        "ApprovalEvent",
        TimeSpan.FromDays(3),
        defaultValue: "timeout");

    if (decision == "approved")
        await ctx.CallActivityAsync("Finalize", ...);
}
```

### Pattern 3 — Sub-Orchestrations

```csharp
var subResult = await ctx.CallSubOrchestratorAsync<MyResult>(
    "SubFlow", subInput);
```

### Maximal-Laufzeit

- **Orchestrator**: praktisch unbegrenzt (inkremental, checkpointed)
- **Activity-Functions**: unterliegen Plan-Timeout (Consumption 10 min, Flex/Premium länger)

### Neu 2026 — Durable Agent Orchestration

**MAF-Agent-Logic im Durable Functions Orchestrator + SignalR-Streaming für Live-UI**. Ziel: Agents, die **Tage warten** (Incident Response, Infrastruktur-Provisioning, Vertragsprozesse). Siehe [DevBlog Foundry Feb 2026](https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-feb-2026/).

---

## Abgrenzungs-Matrix

### Azure Functions vs. [[Azure Container Apps]]

| Kriterium | Functions (Flex) | ACA |
|-----------|:---:|:---:|
| **Event-driven Trigger** (20+ Bindings) | ✅ Best | ❌ Nur HTTP/KEDA-Custom |
| **Container/Docker Pflicht** | ❌ | ✅ |
| **Scale-to-Zero** | ✅ | ✅ |
| **Lange HTTP-APIs, Always-On** | OK (Always-Ready) | **besser** |
| **VNet out-of-the-box** | ✅ (Flex) | ✅ (default) |
| **Dapr, Service Mesh** | ❌ | ✅ |
| **Long-Running Jobs (>10 min)** | Flex/Premium OK | **besser** |
| **Multi-Container, Sidecars** | ❌ | ✅ |
| **Switzerland North** | *{UNCLEAR Flex}* · Premium OK | ✅ Consumption + Dedicated |

**Faustregel**: Functions für **Event-Handler + Agent-Tools**. ACA für **containerisierte Microservices, Dapr, oder immer-on-APIs**.

### Durable Task vs. [[Logic Apps]] vs. reine Functions

| Szenario | Empfehlung |
|----------|------------|
| Visuelle Designer, Business-User, 450+ Connectors (SAP, Salesforce, Teams) | **[[Logic Apps]] Standard** |
| Code-first, komplexe State-Logik, Fan-Out, C#/Python-Teams | **Durable Functions** |
| Kurze, zustandslose Events, <10 min | **Plain Functions** |
| Agent-Orchestrierung mit Human-Approval (Tage) | **Durable Functions + DTS** |

### MCP Binding vs. Container-basierter MCP-Server

| Kriterium | **Functions MCP Binding** | Container-basiert (z.B. ACA) |
|-----------|:---:|:---:|
| Schnell zu starten | ✅ | Mittel |
| Entra/OBO-Auth out-of-the-box | ✅ | selbst bauen |
| Custom-MCP-Framework (nicht MS-SDK) | ❌ | ✅ |
| Sidecar-Pattern, Multi-Prozess | ❌ | ✅ |
| Skaliert auf Null | ✅ (Flex) | ✅ (ACA) |

**Faustregel**: MCP Binding ist Default. Container nur wenn Non-MS-SDK oder komplexe Multi-Prozess-Laufzeit nötig.

---

## MAF-Integration — drei Szenarien

```
┌──────────────────────────────────────────────────────────────────┐
│ Szenario 1: Functions als MAF-Host                               │
├──────────────────────────────────────────────────────────────────┤
│   Microsoft.Agents.AI.Hosting.AzureFunctions (NuGet)             │
│   Single-Agent oder Event-Handler-Agent                          │
│   (Webhook kommt → Agent läuft → Response)                       │
│   Flex Consumption + Isolated Worker empfohlen                   │
├──────────────────────────────────────────────────────────────────┤
│ Szenario 2: Function als MAF-Tool                                │
├──────────────────────────────────────────────────────────────────┤
│   Function mit HTTP-Trigger                                      │
│   Vom Agent via FunctionTool / HTTP-Call konsumiert              │
│   Einfach, kein MCP-Overhead                                     │
│   Aber keine MCP-Standardisierung (nur 1 Agent nutzt)            │
├──────────────────────────────────────────────────────────────────┤
│ Szenario 3: Function als MCP-Server  (NEU via MCP Binding)       │
├──────────────────────────────────────────────────────────────────┤
│   Empfohlen für wiederverwendbare Tool-Kataloge                  │
│   Mehrere Agents/Clients teilen Tools                            │
│   (Copilot + MAF + Claude + Cursor)                              │
│   Streamable HTTP + OBO                                          │
└──────────────────────────────────────────────────────────────────┘

Bonus: Durable Agent Orchestration
   MAF-Agent-Logic in Durable Functions Orchestrator
   + SignalR für Live-Streaming an UI
   → für tagelang laufende Workflows
```

---

## Pricing (USD, Stand 2026)

| Plan | Execution | Memory/Compute | Free-Grant | Immer-kostet |
|------|-----------|-----------------|------------|--------------|
| **Consumption** | $0.20 / 1M | $0.000016 / GB-s | 1M Executions + 400k GB-s / Monat | $0 |
| **Flex On-Demand** | ~$0.40 / 1M | GB-s pro Memory-Size | **250k Executions + 100k GB-s** / Monat | $0 |
| **Flex Always-Ready** | zusätzlich Per-Execution | Baseline-GB-s (auch idle) | kein Free-Grant auf Always-Ready | Baseline |
| **Premium EP1** | keine Execution-Charge | vCore + Memory immer | — | ~$150+/Monat (1 Instanz min) |
| **DTS Consumption** | pay-per-Action | — | *{UNCLEAR}* | $0 |
| **DTS Dedicated** | pro Capacity-Unit | 2.000 Actions/s + 50 GB | — | Baseline (min. 1 CU) |

EUR/CHF *{UNCLEAR — Azure Pricing Calculator mit Region=Switzerland North prüfen}*.

---

## Limitierungen & Fallstricke

| Limitierung | Workaround |
|-------------|-----------|
| **Consumption 10-min-Timeout** | Flex oder Premium; Durable für wirklich lange Workflows |
| **Flex: Linux only, kein In-Process .NET** | Isolated Worker Migration |
| **Flex: 1 App / Plan** | mehrere Plans |
| **Flex: keine Deployment Slots** | Rolling Updates Preview + Blue/Green via ACA |
| **Flex: CH-Region unverifiziert** | Premium oder ACA in CH North |
| **MCP: kein PowerShell** | .NET/Python/JS/TS/Java wählen |
| **MCP: SSE deprecated** | Streamable HTTP als Default |
| **MCP + Entra-OBO**: User-Token muss durchgereicht werden | funktioniert nicht bei System-Key-only Auth |
| **Durable: Orchestrator-Code muss deterministisch sein** | keine `DateTime.Now`, keine HTTP-Calls im Orchestrator — nur via Activities |
| **Durable auf Flex: nur Storage Provider oder DTS** | kein MSSQL/Netherite |
| **Cold Start auch mit Always-Ready bei Scale-Events** | Lasttests Pflicht |

---

## Offizielle Referenzen

### Primary (Microsoft Learn)

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Flex Consumption Plan | https://learn.microsoft.com/en-us/azure/azure-functions/flex-consumption-plan | 2026-04-22 |
| Docs | MCP Bindings Overview | https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-mcp | 2026-04-22 |
| Docs | MCP Tool Trigger | https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-mcp-tool-trigger | 2026-04-22 |
| Docs | Build Custom Remote MCP Server | https://learn.microsoft.com/en-us/azure/azure-functions/scenario-custom-remote-mcp-server | 2026-04-22 |
| Docs | Durable Functions Overview | https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview | 2026-04-22 |
| Docs | Durable Task Scheduler | https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-task-scheduler/durable-task-scheduler | 2026-04-22 |
| Docs | DTS Billing | https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-task-scheduler/durable-task-scheduler-billing | 2026-04-22 |
| Docs | Fan-Out/Fan-In Scenarios | https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-fan-in-fan-out | 2026-04-22 |
| Docs | Functions vs. Logic Apps vs. WebJobs | https://learn.microsoft.com/en-us/azure/azure-functions/functions-compare-logic-apps-ms-flow-webjobs | 2026-04-22 |
| Pricing | Functions Pricing | https://azure.microsoft.com/en-us/pricing/details/functions/ | 2026-04-22 |
| Docs | Reliability in Azure Functions (AZ-Regions) | https://learn.microsoft.com/en-us/azure/reliability/reliability-functions | 2026-04-22 |

### Secondary (Blogs / News)

| Quelle | Link | Zuletzt gesichtet |
|--------|------|-------------------|
| Tech Community — Flex Consumption GA | https://techcommunity.microsoft.com/blog/appsonazureblog/azure-functions-flex-consumption-is-now-generally-available/4298778 | 2026-04-22 |
| Tech Community — Build 2025 | https://techcommunity.microsoft.com/blog/appsonazureblog/azure-functions-%E2%80%93-build-2025/4414655 | 2026-04-22 |
| Tech Community — Remote MCP with Functions | https://techcommunity.microsoft.com/blog/appsonazureblog/build-ai-agent-tools-using-remote-mcp-with-azure-functions/4401059 | 2026-04-22 |
| InfoQ — MCP GA (Jan 2026) | https://www.infoq.com/news/2026/01/azure-functions-mcp-support/ | 2026-04-22 |
| Tech Community — DTS Consumption SKU GA | https://techcommunity.microsoft.com/blog/appsonazureblog/the-durable-task-scheduler-consumption-sku-is-now-generally-available/4506682 | 2026-04-22 |
| Tech Community — DTS Dedicated SKU GA | https://techcommunity.microsoft.com/blog/appsonazureblog/announcing-azure-functions-durable-task-scheduler-dedicated-sku-ga--consumption-/4465328 | 2026-04-22 |
| Foundry DevBlog — Durable Agent Orchestration (Feb 2026) | https://devblogs.microsoft.com/foundry/whats-new-in-microsoft-foundry-feb-2026/ | 2026-04-22 |
| MCP Apps TypeScript Quickstart | https://devblogs.microsoft.com/azure-sdk/mcp-apps-on-azure-functions-quickstart-with-typescript/ | 2026-04-22 |
| Python Samples | https://learn.microsoft.com/en-us/samples/azure-samples/remote-mcp-functions-python/remote-mcp-functions-python/ | 2026-04-22 |
| GitHub — azure-functions-mcp-extension | https://github.com/Azure/azure-functions-mcp-extension | 2026-04-22 |
| GitHub — microsoft/agent-framework | https://github.com/microsoft/agent-framework | 2026-04-22 |

---

## UNCLEAR

1. **Flex Consumption Switzerland North / West** — nicht in Build-2025-Launch-Liste; per `az functionapp list-flexconsumption-locations` verifizieren
2. **DTS EUR-/CHF-Preise** Switzerland North (Pricing-Seite mit Region-Filter)
3. **DTS Regions-Rollout** — CH-Verfügbarkeit in DTS-Doku prüfen
4. `Microsoft.Agents.AI.Hosting.AzureFunctions` Versionen + Lizenz-Details

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Drei Agent-Personas (Host / MCP-Tool / Durable-Workflow) als zentrale Struktur, **MCP Binding GA Jan 2026** mit Code-Beispielen (C# + Python) + OBO-Auth, **Flex Consumption GA Dez 2024** mit Linux-only + Per-Function-Scaling + ⚠️ CH-Region-Blocker, **Durable Task Scheduler** als neuer State-Provider (Consumption + Dedicated SKU GA), 3 Durable-Pattern (Fan-Out/Human-in-the-Loop/Sub-Orchestr.), **Durable Agent Orchestration** (MAF + Durable + SignalR) für tagelange Agent-Workflows, 3 MAF-Integrations-Szenarien, 11 Primary + 11 Secondary Referenzen | Learn Docs + DevBlogs + InfoQ + GitHub |
| 2026-04-21 | Hongyu | Initial Stub | Arbeitsauftrag |
