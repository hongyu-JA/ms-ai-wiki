---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [Power Virtual Agents, PVA]
moc:
  - "[[Microsoft MOC]]"
  - "[[Agents MOC]]"
---

# Copilot Studio

*Microsoft's **Low-Code-Agent-Builder** im M365/Power-Platform-Ökosystem — vier Builder-Ebenen vom No-Code Agent Builder bis zum Pro-Code Custom Engine Agent. Wave 3 bringt **Copilot Cowork** (Frontier-Programm, Claude-powered Long-Running-Agents). Wichtigste Finanz- und Compliance-Eckdaten: Copilot-Credit-Modell ($200/25k-Pack oder $0.01 PAYG), Cowork in Copilot-Lizenz inkludiert, **Anthropic-Default OFF** in EU/EFTA/UK.*

> **Analogie:** Was Power Apps für Formulare war, ist Copilot Studio für Chatbots — nur dass der „Bot" jetzt LLM-fähig ist, Tools aufrufen kann und sich nach oben zu Pro-Code skalieren lässt.

---

## Die vier Builder-Ebenen (Eskalationsleiter)

```
            No-Code                 Low-Code                Pro-Code
  ┌──────────────────┐  ┌────────────────────┐  ┌────────────────────┐
  │ 1. Agent Builder │→│ 2. Declarative     │→│ 4. Custom Engine   │
  │    (in M365      │  │    Agents          │  │    Agent            │
  │    Copilot UI)   │  │    (Copilot Studio)│  │    ([[MAF]] + M365 │
  │                  │  │                    │  │    Agents SDK)      │
  │ • Prompt-only    │  │ • YAML-Manifest    │  │ • volle Code-      │
  │ • SharePoint +   │  │ • Adaptive Cards   │  │   Kontrolle         │
  │   E-Mail         │  │ • Multi-Channel    │  │ • eigene Modelle    │
  │ • M365-Copilot-  │  │ • Deploy: M365     │  │ • Multi-Agent       │
  │   Chat only      │  │   Copilot Chat     │  │                     │
  │                  │  │   + Teams          │  │                     │
  │ ❌ keine         │  │ + 3. Generative   │  │                     │
  │   Actions        │  │   Actions         │  │                     │
  │ ❌ keine         │  │   (Tools, MCP,    │  │                     │
  │   Triggers       │  │   1400+ Connectors│  │                     │
  │ ❌ nicht in      │  │                   │  │                     │
  │   Teams          │  │                   │  │                     │
  └──────────────────┘  └────────────────────┘  └────────────────────┘
        BUSINESS-USER         CITIZEN-DEV           PRO-DEV
```

**Eskalations-Schwelle Agent Builder → Copilot Studio:** sobald Actions zu externen Services, Multi-Step-Workflows, breitere Zielgruppe oder Deployment-Kontrolle nötig.

**Copilot Studio → Custom Engine Agent:** sobald komplexe Multi-Agent-Logik, eigener Orchestrator, BYOM oder Custom-Tool-State jenseits Session nötig.

---

## Copilot Cowork Deep-Dive (Wave 3)

```
┌────────────────────────────────────────────────────────────────────┐
│ Copilot Cowork — Long-Running-Agent-Layer                          │
│ GA via Frontier-Programm seit 30.03.2026                           │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Was: Autonomer Execution-Agent, plant selbst, arbeitet            │
│       "über Minuten bis Stunden" mit Zwischen-Approvals             │
│                                                                    │
│  Tech: Microsoft lizenziert die Cowork-Technologie direkt von      │
│        Anthropic (Claude-powered)                                  │
│                                                                    │
│  Pricing: 🟢 kein Aufpreis — in $30 M365-Copilot-Lizenz inkludiert │
│                                                                    │
│  Status: Rollout via Frontier-Programm — nicht allgemeine GA       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

  ⚠️  EU/EFTA/UK KRITISCH:
      Anthropic-Subprocessor ist by-default OFF.
      Anthropic ist "out of scope for EU Data Boundary".
      → Cowork in EU-Tenants nur nach expliziter Admin-Aktivierung
        (siehe [[Microsoft 365 Copilot]] § Security & Compliance)
      → DPIA vor Aktivierung empfohlen
```

**Hard-Cap pro Session**: *{UNCLEAR: MS publiziert keinen konkreten Wert; Dokumentation sagt „minutes or hours with approvals"}*. Standard-Copilot-Studio-Session-Boundary (60 min) gilt **nicht** für Cowork.

**Unterschied zu Standard-CS-Agent**: Turn-based Orchestrator (60-Min-Session) vs. Cowork = autonomer Execution-Agent mit eigenem Plan.

---

## Einsatz

**JTBD:** When I einen Agent bauen will, ohne Pro-Code-Entwickler einzustellen, I want to per Low-Code-UI einen Assistenten mit Prompts, Tools und Datenquellen zusammenklicken, so I can Business-Prozesse automatisieren ohne Dev-Kapazität zu warten.

**Trigger-Signale:**
- „Unser Citizen Developer hat schon mit Power Apps gearbeitet — kann der Agents bauen?"
- „FAQ-Bot für Kundenservice, nicht 6 Monate Entwicklung"
- „Long-Running-Research-Task — gibt's einen Agent dafür?" (→ Cowork)

**Empfehlung:**
- 🟢 Agent Builder / Declarative Agents als Standard-Einstieg für SMB
- 🟡 **Cowork für EU-Kunden**: Beobachten bis Anthropic-EU-Datazone geklärt
- 🔴 Connected Agents (Multi-Agent) in Copilot Studio: **nicht produktionsreif** — für Multi-Agent siehe [[Microsoft Agent Framework]]

---

## Status & Pricing

### Lizenz-Modell — Copilot Credits

Seit 2025-09-01 auf **Copilot Credits** als Abrechnungseinheit umgestellt.

| SKU | USD | Zweck |
|-----|-----|-------|
| **Copilot Credit Pack** | **$200/Pack/Monat** | 25.000 Credits tenant-wide |
| **PAYG** | **$0.01 / Credit** (Azure-billed) | nutzungsbasiert, kein Commitment |
| **Pre-Purchase** | bis −20% auf Packs | Volume-Commitment |

### Credit-Consumption-Rates

| Feature | Credits | Für M365-Copilot-User |
|---------|---------|------------------------|
| Classic answer | 1 | 🆓 Free |
| Generative answer | 2 | 🆓 Free |
| **Agent action (inkl. Computer-Use)** | **5** | wird berechnet |
| Tenant graph grounding / message | 10 | 🆓 Free |
| **Agent flow actions / 100 actions** | **13** | wird berechnet |
| AI Tools (basic) / 10 responses | 1 | wird berechnet |
| AI Tools (standard) / 10 responses | 15 | wird berechnet |
| **AI Tools (premium) / 10 responses** | **100** | **Reasoning-Modelle!** |
| Content processing / page | 8 | wird berechnet |

**125%-Overage**: Custom Agents werden tenant-weit disabled, Agent Flows separat geblockt.

*{UNCLEAR: Cowork-spezifische Credit-Kosten — nicht explizit im Learn-Billing-Artikel oder im Licensing Guide Feb 2026 aufgeführt.}*

### Pricing-Kontext (Relation zu anderen SKUs)

| SKU | USD | Notiz |
|-----|-----|-------|
| Copilot (Enterprise) | $30/user/month | Cowork inkludiert |
| Copilot Business (SMB ≤ 300) | $18/user/month (Promo bis 30.06.2026) | |
| [[Microsoft 365 E7]] | $99/user/month | inkludiert alles |

---

## Kernkonzept

### Design-Philosophie

Copilot Studio ist **Low-Code, der Declarative Agents als erste Bürger** behandelt. Die zentrale Architektur-Wette: **Business-User beschreiben Prompts besser als Entwickler sie programmieren**. Primäres Artefakt ist ein Prompt-zentriertes Manifest, nicht Code.

### Kern-Fähigkeiten

#### Declarative Agent (YAML-Manifest Schema 1.6+)

YAML definiert System-Prompt + Tools + Knowledge-Sources + Adaptive Cards. Deploy-Channels: M365 Copilot Chat, Teams. Integration mit [[Microsoft 365 Copilot Connectors]] für Grounding. Nutzt Microsofts Orchestrator-LLM (keine eigene Engine).

#### Generative Actions (Tool-Use)

- **1.400+ Power-Platform-Connectors** — Salesforce, ServiceNow, SAP, Jira, Confluence, Dataverse
- **MCP-Tools** — z.B. [[Dataverse MCP Server]] direkt einbindbar (GA seit 05/2025 in Copilot Studio)
- **REST-APIs** als Custom Actions
- **Computer-Using Agents** — als Agent-Action abgerechnet (5 Credits/Call)

#### Cowork (siehe oben)

#### Agent Flows

Power-Automate-basiertes Workflow-Framework, nativ in Copilot-Studio-Declarative-Agents eingebunden. Business-User pflegt Prompt + Aktion in einem Tool.

---

## Dataverse-Integration (Limits präzise)

| Limit | Wert | Offiziell bestätigt? |
|-------|------|----------------------|
| **Dataverse sources per agent** | **2** | ✅ |
| **Dataverse tables per knowledge source** | **15** | ✅ |
| **Files uploaded per agent** | **500** (ausser SharePoint) | ✅ |
| Knowledge Objects aggregate | *{UNCLEAR: "500 Knowledge Objects" aus v1 nicht mehr im aktuellen Quotas-Artikel; im April-2026-Doc nur als Files-Upload-Wert 500}* | 🟡 |
| **RPM Messages to agent** | 8'000 RPM | ✅ |
| **RPM Generative Messages — Trial/Dev** | **10 RPM / 200 RPH** ⚠️ Enterprise-Killer | ✅ |
| RPM Generative (Paid 1-10 Packs) | 50 RPM / 1'000 RPH | ✅ |
| RPM Generative (M365 Copilot-User) | 100 RPM / 2'000 RPH | ✅ |
| **Instructions per agent** | 8'000 Zeichen | ✅ |
| Skills per agent | 100 | ✅ |
| Topics per agent (Dataverse env) | 1'000 | ✅ |

**Smoke-Test-Fallstrick:** Trial/Dev-Envs throtteln bei 10 RPM — das ist unter der Hand-Test-Rate, also Enterprise-Deployments brauchen dedizierte Paid-Env von Tag 1.

**[[Dataverse MCP Server]]** (Public Preview): `Add Dataverse MCP` im Tools-Tab eines Agents — keine Flows, keine APIs mehr nötig.

---

## Abgrenzungs-Matrix

| Dimension | **Copilot Studio** | **[[Microsoft Agent Framework]]** | **[[Foundry Agent Service]]** |
|-----------|---------------------|-----------------------------------|--------------------------------|
| Zielgruppe | Makers, Fachbereich, Citizen-Dev | Pro-Code-Dev (.NET/Python) | SW-Engineers, ML-Teams |
| Code-Level | No/Low-Code, YAML | SDK (C#/Python), OSS | API/SDK, Azure-native |
| Orchestrator | Microsoft-managed | selbst definiert | Azure Foundry |
| Modell-Wahl | MS-managed | beliebig | Foundry Models + external |
| Governance | Power Platform Admin + Agent 365 | Agent 365 + eigene Infra | Azure RBAC + Agent 365 |
| Pricing-Modell | **Copilot Credits** | Compute + Token (Azure) | Token + Service Fees |
| Multi-Agent | 🔴 nur Preview, nicht prod | ✅ GA | ✅ |

**Hybrid-Muster** (MS-empfohlen): Pro-Code-Spezialagenten in Foundry, User-facing Orchestrator in Copilot Studio, Kommunikation via A2A / MCP.

---

## Limitierungen & Fallstricke

### Was Copilot Studio NICHT kann

| Limitierung | Alternative |
|-------------|-------------|
| **Echte Multi-Agent-Produktion** — Connected Agents explizit „in preview, not meant for production" | [[Microsoft Agent Framework]] |
| **Citation-Preservation über Agent-Grenzen** — SharePoint-Links/Grounding-Info werden bei Sub-Agent-Calls oft gestrippt | einzelner Agent statt Connected Agents |
| **Custom Tools mit externem persistentem State** | Pro-Code: MAF + eigener State-Store |
| **Eigenes LLM als Core-Orchestrator** | Custom Engine Agent mit eigenem Azure-OpenAI-PTU |
| **Observability auf Reasoning-Ebene** — Generative Orchestration ist Black-Box | Foundry-Portal-Tracing für Pro-Code-Szenarien |

### Typische Fallstricke

- **RPM-Throttling in Trial/Dev** — 10 RPM bricht sogar Smoke-Tests. *Gegenmittel: paid Env von Tag 1.*
- **125%-Hard-Enforcement** — Custom Agents werden tenant-weit disabled bei Credit-Überschreitung. *Gegenmittel: Azure Monitor Alert auf 80% Credit-Consumption.*
- **EU-Data-Boundary vs. Anthropic** — Cowork + Claude sind für EU-Tenants nicht im EU-Boundary. *Gegenmittel: Admin-Entscheidung dokumentieren + DPIA.*
- **Dataverse-Dependency** — Copilot Studio ohne Dataverse nicht funktionsfähig; Teams-Env braucht Upgrade für >250 Topics.
- **Agent Flow Enforcement separat** — wenn Credits erschöpft, blockieren Flows auch wenn Agents laufen.
- **Autonomy nur in Copilot Studio, nicht in Declarative Agents** — wer Autonomous Triggers braucht, braucht Copilot Studio (nicht pure Declarative).

---

## Integration mit Agent 365

Ab 2026-05-01 GA: Copilot-Studio-Agents bekommen **automatisch** eine [[Entra Agent ID]] zugewiesen (wenn in Power-Platform-Env aktiviert). User, der Agent erstellt, wird **Sponsor**. Governance-Granularität: einzelner Agent mit eigenem CA-Policy-Target, Owner/Sponsor-Management, M365 Admin Center Approval-Flow.

---

## Security & Compliance

### Datenverarbeitung

| Thema | Status |
|-------|--------|
| **Data Residency** | folgt der M365-Tenant-Region; Copilot-Credit-Abrechnung separat regional getrennt |
| **Prompts & Outputs** | Audit-Logs via [[Microsoft Purview]] (Copilot-Audit-Events seit 2024-11 GA); Retention per M365-Audit-Policy |
| **Data Processing Addendum (DPA)** | MS DPA + Copilot-spezifische Zusätze (Wave 3 / Anthropic-Nutzung) |
| **EU-AI-Act-Klassifizierung** | meist Limited Risk; Hochrisiko nur bei spezifischen Anwendungsfällen (Bewertung / Entscheidung über Personen) |

### Microsoft-Compliance-Stack

- **Purview Sensitivity Labels** werden bei Dataverse-Knowledge-Sources respektiert (EXTRACT-Usage-Right zwingend)
- **[[Purview DSPM]] for AI** zeigt Oversharing-Risiken in Copilot-Studio-Agents
- **[[Defender for AI]]** (Preview → GA 2026-05-01 an Agent 365 gekoppelt) — Runtime-Erkennung von Prompt-Injection-Angriffen
- **[[Azure AI Content Safety]]** als Policy-Layer bei Custom-Engine-Agents einstellbar
- **Conditional Access** via [[Microsoft Entra Suite]] für Agent-Zugriffe

### Bekannte Compliance-Lücken

- **Wave 3 Cowork: Anthropic / Claude default OFF** in EU/EFTA/UK — explizit im Admin Center einschalten; DSGVO-Hintergrund von MS **nicht** kommentiert → Vorsicht bei regulierten Kunden
- **Sensitivity-Label-Propagation auf Agent-Outputs fehlt** (Gap zu [[Agent 365]]) — Compliance-Gap für 2026-05-01-GA
- **Generative Actions mit externen Connectors** können DLP-Policy umgehen — DLP-Prüfung pro Connector manuell nötig
- **Preview-Features (Agent Builder Advanced)** liegen **nicht** zwingend in EU-Data-Boundary

---

## Offizielle Referenzen & Monitoring

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Product Page | Copilot Studio | https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio | 2026-04-22 |
| Docs Hub | Copilot Studio Docs | https://learn.microsoft.com/en-us/microsoft-copilot-studio/ | 2026-04-22 |
| Docs — Quotas & Limits | Quotas and Limits | https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-quotas | 2026-04-22 |
| Docs — Billing | Messages & Billing | https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-messages-management | 2026-04-22 |
| Docs — Declarative Agent | Manifest Schema | https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/declarative-agent-manifest-1.2 | 2026-04-22 |
| Docs — MCP for CS | MCP Extension | https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp | 2026-04-22 |
| Docs — Dataverse MCP | data-platform-mcp | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/data-platform-mcp | 2026-04-22 |
| Docs — Anthropic in M365 | Anthropic Models in Copilot | https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-anthropic-apps | 2026-04-22 |
| Docs — Entra Agent IDs | Auto-Create | https://learn.microsoft.com/en-us/microsoft-copilot-studio/admin-use-entra-agent-identities | 2026-04-22 |
| Docs — Multi-Agent | Patterns (Preview) | https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/multi-agent-patterns | 2026-04-22 |
| Blog — Cowork | Cowork in Frontier (30.03.2026) | https://www.microsoft.com/en-us/microsoft-365/blog/2026/03/30/copilot-cowork-now-available-in-frontier/ | 2026-04-22 |
| Blog — Wave 3 | Frontier Transformation (09.03.2026) | https://www.microsoft.com/en-us/microsoft-365/blog/2026/03/09/powering-frontier-transformation-with-copilot-and-agents/ | 2026-04-22 |
| Pricing | Copilot Studio Pricing | https://www.microsoft.com/en-us/microsoft-365-copilot/pricing/copilot-studio | 2026-04-22 |
| Licensing PDF | Copilot Studio Licensing Guide Feb 2026 | https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/bade/documents/products-and-services/en-us/microsoft-365/1084694-Microsoft-Copilot-Studio-Licensing-Guide-February-2026-PUB.pdf | 2026-04-22 |
| Community — Cowork EU-Blocker | Copilot at Work Substack | https://copilotatwork.substack.com/p/what-is-preventing-eu-organizations | 2026-04-22 |
| Analyst | Directions on Microsoft — Anthropic Risk | https://www.directionsonmicrosoft.com/reports/m365-copilot-adds-choice-and-risk-with-anthropics-claude/ | 2026-04-22 |
| Estimator | Copilot Credit Estimator (MS GitHub) | https://microsoft.github.io/copilot-studio-estimator/ | 2026-04-22 |

---

## UNCLEAR

1. **Cowork Hard-Cap** (Session-Max-Dauer, Token-Budget)
2. **Cowork-Pricing-Meter** — Normal Conversation-Credits, Premium-AI-Tool, oder eigener Meter?
3. **Cowork GA ausserhalb Frontier-Program** — Datum unbekannt
4. **Anthropic EU-Datazone-Ankündigung** — ohne diese bleibt Cowork für CH/EU compliance-kritisch
5. **„500 Knowledge Objects"**-Limit — im aktuellen Quotas-Artikel (14.04.2026) nur als Files-Upload-Wert ausgewiesen, Aggregate-Version nicht mehr explizit

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | 4-Ebenen-Eskalationsleiter-Diagramm, Cowork Deep-Dive mit EU-Data-Boundary-Warnung (Anthropic default-OFF), vollständige Pricing-Matrix mit Copilot Credits (Korrektur zu v1), Dataverse-Limits präzisiert (15 Tables/Source, 500 Files), RPM-Throttling-Warnung für Trial/Dev-Envs, Connected-Agents-Preview-Status, 16 Primary-Quellen | 11 Searches + Docs + Licensing Guide |
| 2026-04-21 | Hongyu | Initial Stub, watch: close, Status: GA | Arbeitsauftrag |
