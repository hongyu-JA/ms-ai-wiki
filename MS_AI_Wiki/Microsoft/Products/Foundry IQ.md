---
watch: close
status: preview
last_verified: 2026-04-22
aliases: []
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Foundry IQ

*Foundry's **Custom Knowledge Base** für Agents — Convenience-Layer über [[Azure AI Search]] **Agentic Retrieval**. Portal-Wrapper ohne eigene Billing-Dimension. Exponiert als **MCP-Server** via Tool `knowledge_base_retrieve`. **Switzerland North voll supported** — ideal für Journai-CH-Kunden.*

> **Analogie:** Wie eine vorbereitete Datenbank-Verbindung in einer App — kein Index-Setup nötig, aber wenn du Spezialwünsche hast (Custom Scoring, Synonym Maps), musst du auf [[Azure AI Search]] direkt.

---

## Einsatz

### Job-to-be-done

When I einem Foundry-Agent Knowledge geben will, I want to einen Out-of-Box-Index ohne [[Azure AI Search]]-Setup, so I can schnell starten und später bei Bedarf auf AI Search direkt wechseln.

### Trigger-Signale

- „Agent soll auf ~100 PDFs antworten — schnellster Weg zur PoC?"
- „Wir wollen Agentic Retrieval nutzen ohne Index-Tuning zu lernen."
- „CH-Region + minimal Setup."

### Einsatz-Szenarien

1. **PoC-Phase mit minimaler Infrastruktur** — Foundry-Project + Datenquelle (SPO/OneDrive/Storage) + IQ-Knowledge-Base aktivieren → Agent kann via MCP-Tool `knowledge_base_retrieve` zugreifen.
2. **Standard-MCP-Tool für Foundry-Agents** — wenn Journai nicht mehrere Custom-Indexe verwalten will, bleibt IQ die Convenience-Option.
3. **Later-Switch zu Azure AI Search** — wenn Custom Scoring / Synonym Maps / Entra-DLS gebraucht werden, Migration auf AI Search direkt (IQ nutzt es unter der Haube).

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Azure-Subscription + Foundry-Project |
| **Tenant / Infrastruktur** | Switzerland North GA; Datenquelle SPO/OneDrive/Storage |
| **Skills / Rollen** | keine Search-Expertise nötig; nur Foundry-Portal-Bedienung |
| **Compliance-Rahmen** | Underlying AI Search + Storage unterliegen Region-Wahl |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | <1 Tag für erste Knowledge Base |
| **Laufende Lizenzkosten** | kein eigener IQ-Preis; Underlying Azure AI Search (Basic ~€75/Mo) + Storage |
| **Laufender Betrieb** | minimal; Re-Indexing bei Datenänderungen automatisch |

### Empfehlung

**Status:** 🟢 für PoC + einfache Fälle; 🟡 wenn Custom Scoring / Synonyms / DLS nötig → direkt auf [[Azure AI Search]] wechseln.

**Nächster Schritt für Journai:** Preview → GA monitoren; IQ als Standard in PoC-Phase, AI Search für Produktion wenn Custom-Anforderungen.

---

## Architektur

```
┌─────────────────────────────────────────────────────────────────┐
│ Foundry Project                                                 │
│                                                                 │
│   ┌──────────────────────────────────────────────────────┐     │
│   │ Knowledge Base ("KB")                                │     │
│   │                                                      │     │
│   │   ├── Knowledge Source 1 (Blob)                     │     │
│   │   ├── Knowledge Source 2 (OneLake)                  │     │
│   │   ├── Knowledge Source 3 (SharePoint)               │     │
│   │   ├── Knowledge Source 4 (Web)                      │     │
│   │   └── Knowledge Source 5 (MCP, *{UNCLEAR preview})  │     │
│   │                                                      │     │
│   │   ⇣ exponiert als MCP-Server                         │     │
│   │   {search}/knowledgebases/{kb}/mcp                   │     │
│   │   ?api-version=2025-11-01-preview                    │     │
│   │                                                      │     │
│   │   ⇣ einziges Tool: `knowledge_base_retrieve`         │     │
│   └──────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
   ┌──────────┐        ┌──────────────┐    ┌─────────────┐
   │ [[MAF]]   │        │ Foundry      │    │ Custom Apps │
   │ Agent     │        │ Agent Service│    │ (VS Code,   │
   │           │        │              │    │ Claude,     │
   │           │        │              │    │ Cursor)     │
   └──────────┘        └──────────────┘    └─────────────┘
```

**Wichtig**: Foundry IQ ist **KEIN** Konkurrent zu [[Azure AI Search]] — es ist ein **Convenience-Layer AUF AI Search Agentic Retrieval**. Gleiche Indexes darunter.

---

## Setup-Walkthrough

1. **Foundry Project** öffnen (Switzerland North oder EU-DataZone)
2. **Knowledge Base** anlegen (Portal oder REST-API)
3. **Sources hinzufügen** — Upload (Blob), OneLake, SharePoint, Web, MCP-Server
4. Chunking + Embedding **automatisch** (Defaults nicht Customizable)
5. Index-Erstellung: Minuten bis Stunden je nach Korpus
6. **MCP-Endpoint abrufen** (aus Portal oder REST)
7. Agent registriert KB als MCP-Tool (RemoteTool-Connection mit `ProjectManagedIdentity`)

### Code-Sketch — MAF-Agent konsumiert Foundry IQ

```python
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient
from agent_framework import ChatAgent
from agent_framework.tools import RemoteMCPTool

project = AIProjectClient(
    endpoint="https://<resource>.services.ai.azure.com/api/projects/<project>",
    credential=DefaultAzureCredential())

iq_tool = RemoteMCPTool(
    endpoint=f"{project.endpoint}/knowledgebases/my-kb/mcp",
    api_version="2025-11-01-preview",
    tool_filter=["knowledge_base_retrieve"],
    auth="project-managed-identity")

agent = ChatAgent(
    name="research-agent",
    model="gpt-4.1",
    tools=[iq_tool])
```

---

## Pricing

| Komponente | Abrechnung | Notiz |
|------------|------------|-------|
| **Foundry IQ** selbst | 🟢 **keine eigene Billing-Dimension** | Portal-Wrapper |
| Azure AI Search unter der Haube | Standard-Tier-Pricing | Siehe [[Azure AI Search]] |
| Query-Planning LLM (gpt-4o / 4.1 / 5) | separat via Azure OpenAI / Foundry Models | Haupt-Kostentreiber |
| Embedding-Generierung | separat | beim Indexing |

---

## Kern-Fähigkeiten

### Reasoning Effort Levels

```
Minimal  →  1 Subquery,  1 Source,   geringste Kosten
Low      →  3 Subqueries, 3 Sources, mittlere Kosten
Medium   →  5 Subqueries, 5 Sources, 10k Token-Budget,
            iterative Search, beste Qualität
```

### Query-Flow

```
1. Agent ruft knowledge_base_retrieve mit Frage auf
   ↓
2. Planning-LLM zerlegt Frage in N Subqueries
   ↓
3. Pro Subquery: Hybrid-Search (BM25+Vector) + Semantic Rerank
   (parallel)
   ↓
4. Ergebnisse werden gemerged + an Agent zurück
   ↓
MS-Claim: +36–40% Relevance-Uplift vs. single-shot RAG
```

### Kern-Fähigkeiten

| Fähigkeit | Details |
|-----------|---------|
| **Multi-Source-Federation** | Blob + OneLake + SharePoint + Web + MCP in einer KB |
| **Entra-Doc-Level-Security** | Automatisch synchronisiert (ADLS/Blob) |
| **MCP-Exposure** | KB als Standalone-MCP-Server für externe Clients |
| **Purview-Integration** | Sensitivity-Labels respektiert |
| **Query-Planning-LLM-Config** | gpt-4o / 4.1 / 5 wählbar |
| **Cross-Region-KB** | *{UNCLEAR}* |
| **Custom Chunking** | ❌ Defaults only |
| **Custom Scoring Profiles** | ❌ |
| **Synonym Maps** | ❌ |

---

## Limits

| Limit | Wert |
|-------|------|
| Knowledge Bases pro Service | abhängig vom Tier des darunterliegenden Azure AI Search (siehe [[Azure AI Search]]) |
| **S3 HD = 0 KBs** | nicht nutzbar für IQ |
| Max Sources pro KB (Medium Reasoning) | 5 |
| Max Subqueries pro Call (Medium) | 5 |
| Token-Budget pro Call (Medium) | 10.000 |
| SDK-Support | nur **Python** + REST in Preview — C#/JS/Java fehlen |

---

## IQ vs. Direct-AI-Search — Decision-Matrix

| Kriterium | [[Azure AI Search]] direkt | **Foundry IQ** |
|-----------|-----------------------------|-----------------|
| **Single KB, ein Agent** | ✅ ideal | Overkill |
| **Multi-Source Federation** (M365 + Blob + Web) | manuell orchestrieren | ✅ **nativer Convenience-Layer** |
| **Mehrere Agents teilen KB** | via MCP / REST | ✅ reusable KB-Konzept |
| **Full Control über Index-Schema** | ✅ | abstrahiert |
| **Low-Code / Foundry-Portal-UI** | Portal rudimentär | ✅ Foundry Portal |
| **Entra-basiert, Doc-Level-Security** | ✅ (GA) | ✅ (auto-sync) |
| **Web-Grounding als Source** | nein (extern bauen) | ✅ |
| **SMB: „AI-Assistent in 2 Wochen"** | wenn IT-Team da | ✅ |
| **Custom Scoring / komplexe Filter** | ✅ | ❌ |
| **Reduziert Engineering-Overhead** | nein | ✅ |
| **Quality-of-Service / SLA** | ✅ AI Search GA | 🟡 IQ Preview, kein SLA |

### Journai-Faustregel

- **IQ** = wenn Kunde "AI-Assistent auf SharePoint + Blob + Web in 2 Wochen" will und Preview-Status akzeptabel ist
- **Direct AI Search** = Pro-Dev, Custom-Scoring, Scale, Prod-SLA

---

## Security & Region

### Switzerland North

**Voll supported**: Agentic Retrieval, Free-Tier-Support, Availability Zones, Confidential Computing alles verfügbar. Die Erstwahl für Journai-CH-Kunden.

### Permissions

- Entra-Doc-Level-Security **automatisch** synchronisiert für ADLS/Blob-Sources
- RBAC über Foundry-Control-Plane-Rollen (siehe [[Foundry Control Plane]])
- Private Endpoints via Managed VNet *{UNCLEAR für IQ-Layer direkt}*

---

## Limitierungen & Fallstricke

| Limitierung | Alternative |
|-------------|-------------|
| **Preview → kein SLA** | für Prod: direkt [[Azure AI Search]] bis GA |
| **Custom Scoring/Synonym Maps nicht möglich** | [[Azure AI Search]] direkt |
| **SDK nur Python + REST** | andere Sprachen: REST direkt |
| **S3 HD Tier = 0 KBs** | S1/S2/S3 wählen |
| **Chunking-Defaults** | kein Tuning möglich; bei schlechter Retrieval-Qualität auf Direct-Search migrieren |

### Fallstricke

- **Preview-Status in Prod nutzen** — kein SLA. *Gegenmittel: Parallelbetrieb mit Direct-Search-Fallback.*
- **"Ubiquitous Knowledge" wörtlich nehmen** — Hard-Limits (3 Sources bei low, 5 bei medium) begrenzen die Ausdehnung.
- **Custom-Scoring-Wunsch kommt spät** — Migration IQ → Direct-Search ist ohne Daten-Umzug möglich (gleiche Indexes darunter), aber API-Wechsel.

---

## Integrationen

### Microsoft-intern

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| [[Azure AI Search]] | Backend-Implementierung — IQ ist Convenience-Wrapper | GA | keine Control über Index-Tuning |
| [[Foundry Agent Service]] | MCP-Tool `knowledge_base_retrieve` out-of-box verfügbar | GA | Knowledge nur Foundry-IQ-Format, nicht AI Search direkt |
| [[Microsoft Agent Framework]] | MCP-Client kann IQ-Tool aufrufen | GA | OAuth-Setup via [[Entra Agent ID]] |
| [[Copilot Studio]] | Limited Knowledge-Source-Option (bevorzugt SPO/Dataverse) | Preview | nicht alle IQ-Features exposed |

### Third-Party

| Mit | Zweck | Reifegrad | Friction-Points |
|-----|-------|-----------|-----------------|
| LangChain / LlamaIndex | über Azure AI Search direkt, nicht über IQ | N/A | IQ bietet kein eigenes SDK — wenn Third-Party nötig, auf AI Search gehen |

### APIs / Protokolle

- **MCP Server** — Endpoint `mcp://{project}.foundry.azure.com/knowledge-bases/{id}`, OAuth 2.1 via Entra
- **Foundry REST API** — Management (Create/Update/Delete) via AIProjectClient 2.0
- **Vector + Hybrid Query** — unter der Haube Azure AI Search; nicht direkt exposed

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | What is Foundry IQ | https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-foundry-iq | 2026-04-22 |
| Docs | Foundry IQ FAQ | https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/foundry-iq-faq | 2026-04-22 |
| Docs | Connect to Foundry IQ | https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/foundry-iq-connect | 2026-04-22 |
| Tech Blog | Foundry IQ Ankündigung | https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/foundry-iq-unlocking-ubiquitous-knowledge-for-agents/4470812 | 2026-04-22 |
| Tech Blog | Multi-Source für Agents | https://techcommunity.microsoft.com/blog/microsoftmechanicsblog/foundry-iq-for-multi-source-ai-knowledge-bases/4474921 | 2026-04-22 |
| Docs | Agentic Retrieval Overview (Basis) | https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-overview | 2026-04-22 |
| Docs | Region Support | https://learn.microsoft.com/en-us/azure/foundry/reference/region-support | 2026-04-22 |

---

## UNCLEAR

1. Supported-Formate-Liste vollständig (Doku unklar)
2. Exakter Free-Token-Wert pro Query
3. Migration-Guide IQ → Direct AI Search (offiziell)
4. MCP-Knowledge-Source-Verfügbarkeit (Preview-Access nötig?)
5. Chunking-Customization-Parameter (aktuell nicht exposed)
6. Cross-Region-KB (geht das überhaupt?)
7. GA-Roadmap / Zeitplan

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Architektur-Diagramm KB → Sources → MCP-Server → Clients, MCP-Endpoint-Pattern, Reasoning-Effort-Levels (minimal/low/medium), Code-Sketch MAF-Integration, IQ-vs-Direct-AI-Search Decision-Matrix, Switzerland-North-Voll-Support als Journai-Highlight | Learn + TechCommunity + PyPI |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
