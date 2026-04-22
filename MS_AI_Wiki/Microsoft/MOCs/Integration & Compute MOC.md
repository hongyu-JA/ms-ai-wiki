---
type: moc
tags: [moc, microsoft, integration, compute]
last_verified: 2026-04-22
---

# Integration & Compute MOC

*Primary-Home für Compute- und Integration-Services, auf denen Custom Agents laufen oder die sie orchestrieren: **Azure Functions** (Flex Consumption + MCP Binding + Durable Task), **Azure Container Apps**, **APIM AI Gateway** (Model-Routing, Rate-Limiting, MCP-Proxy), **Logic Apps** + **Power Automate / Agent Flows**.*

---

## Zweck

Einstieg für die Frage **„Wo läuft der Custom Agent, wie integriert er sich?"**. Hier entscheidet sich: Function vs. Container, wann APIM AI Gateway, Pro-Dev vs. Citizen-Dev. Mit Azure Functions Flex Consumption + MCP Binding werden Function-Apps zu MCP-Tool-Providern ohne eigenen HTTP-Layer.

---

## Landkarte

```
┌────────────────────────────────────────────────────────────────────┐
│ COMPUTE — Agent Hosting                                           │
│   [[Azure Functions]] (Flex Consumption + MCP Binding +           │
│                        Durable Task)                               │
│     └─ event-getrieben, kurzlaufend, pay-per-invocation            │
│   [[Azure Container Apps]]                                         │
│     └─ Container-basiert, langlaufend, scale-to-zero möglich       │
├────────────────────────────────────────────────────────────────────┤
│ GATEWAY — Model-Routing + Proxy                                   │
│   [[APIM AI Gateway]]                                              │
│     └─ Rate-Limiting, Retry-Policies, MCP-Proxy, Token-Budget      │
├────────────────────────────────────────────────────────────────────┤
│ INTEGRATION-GLUE — Workflow-Orchestrierung                         │
│   [[Logic Apps]]                                                   │
│     └─ Pro-Dev + Code-View + Enterprise-Konnektoren                │
│   [[Power Automate]] / Agent Flows                                 │
│     └─ Citizen-Dev + M365-native                                   │
├────────────────────────────────────────────────────────────────────┤
│ DEV-TOOLING (Tier 3)                                               │
│   [[Microsoft AI Developer Tooling]] (Bündel-Note)                 │
│     VS 2026 AI-native · VS Code AI Toolkit · GitHub Copilot Cloud  │
│     Agents · azd AI                                                │
└────────────────────────────────────────────────────────────────────┘
```

---

## Produkte in dieser MOC


<!-- AUTO-INDEX-START: produkte -->

| Produkt | Was es ist (1 Satz) | Tier | Watch |
| ------- | ------------------- | ---- | ----- |
| 🟢 [[APIM AI Gateway]] | Model-Routing, Rate-Limiting, MCP-Proxy zwischen Agents und Modell-Endpunkten | T1 | close |
| 🟢 [[Azure Container Apps]] | Container-Runtime als Hosting-Ziel für langlaufende Agents | T1 | close |
| 🟢 [[Azure Functions]] | Serverless-Compute mit Flex Consumption, MCP Binding, Durable Task für Agent-Workflows | T1 | close |
| 🟢 [[Logic Apps]] | Pro-Code-Integration-Plattform, Enterprise-Konnektoren | T2 | standard |
| 🟢 [[Power Automate]] | Citizen-Dev-Workflow-Engine, Agent Flows für Agent-Integration | T2 | standard |
| 🟢 [[Microsoft AI Developer Tooling]] | Bündel: VS 2026 AI-native + VS Code AI Toolkit + GitHub Copilot Cloud Agents + azd AI | T3 | passive |

<!-- AUTO-INDEX-END: produkte -->

## Letzte Aktivität

_Jüngste Changelog-Einträge (30 Tage) der Produkte dieser MOC. Auto-generiert — konsistent mit [[Microsoft MOC#Letzte Aktivität]]._

<!-- AUTO-INDEX-START: activity -->

| Datum | Produkt | Änderung | Autor |
| ----- | ------- | -------- | ----- |
| 2026-04-22 | [[APIM AI Gateway]] | 5 GA-AI-Policies dokumentiert, MCP-Proxy GA (mit Einschränkungen: kein Workspace, keine Prompts), Tier-Matrix, CH-Region-Verfügbarkeit (k… | Hongyu / Deep-Research |
| 2026-04-22 | [[Azure Container Apps]] | Pricing + Regionen (CH North = Consumption + Dedicated, Flex fehlt), Scale-to-Zero-Regeln (nur event-basiert), Dapr Building Blocks + KED… | Hongyu / Deep-Research |
| 2026-04-22 | [[Azure Container Apps]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Azure Functions]] | Drei Agent-Personas (Host / MCP-Tool / Durable-Workflow) als zentrale Struktur, **MCP Binding GA Jan 2026** mit Code-Beispielen (C# + Pyt… | Hongyu / Deep-Research |
| 2026-04-22 | [[Logic Apps]] | Deep-Dive Logic Apps: Consumption vs. Standard vs. Hybrid (Hybrid GA Juni 2025), 1400+ Enterprise-Konnektoren, **Agent Workflows** (auton… | Hongyu / Deep-Research |
| 2026-04-22 | [[Logic Apps]] | Initial Stub | Hongyu |
| 2026-04-22 | [[Microsoft AI Developer Tooling]] | Deep-Dive 4 Dev-Tools: VS 2026 AI-native, VS Code AI Toolkit (= Foundry Toolkit Rebrand Mär 2026), GitHub Copilot Cloud Agents (Rename + … | Hongyu / Deep-Research |
| 2026-04-22 | [[Microsoft AI Developer Tooling]] | Initial Stub (Tier 3 Awareness — Dev-Tooling-Bündel) | Hongyu |
| 2026-04-22 | [[Power Automate]] | Deep-Dive Power Automate: Cloud/Desktop/Agent Flows, Lizenz-Matrix, Abgrenzung zu Logic Apps, Copilot-Credit-Modell | Hongyu / Deep-Research |
| 2026-04-22 | [[Power Automate]] | Initial Stub | Hongyu |
| 2026-04-21 | [[APIM AI Gateway]] | Initial Stub | Hongyu |
| 2026-04-21 | [[Azure Functions]] | Initial Stub | Hongyu |

<!-- AUTO-INDEX-END: activity -->

---

## Eskalationsleiter / Entscheidungslogik

| Kundensituation | Wahl | Begründung |
|-----------------|------|------------|
| „Agent reagiert auf Events (Message Queue, Blob Upload), lebt kurz" | [[Azure Functions]] (Flex Consumption) | Event-getrieben, Cold-Start akzeptabel |
| „Agent muss Tool für andere Agents sein (MCP)" | [[Azure Functions]] + MCP Binding | Integration in ein Funktions-Projekt |
| „Langlaufender Multi-Step-Workflow mit Zustand" | [[Azure Functions]] Durable Task **oder** [[Azure Container Apps]] | Durable Task für Pure-Code, ACA wenn Container-Image-Build ohnehin da |
| „Agent braucht > 10 Min Laufzeit pro Request" | [[Azure Container Apps]] | Functions haben 10-Min-Grenze |
| „Wir brauchen Rate-Limiting + Cost-Caps pro Kunde auf Modell-Calls" | [[APIM AI Gateway]] als Proxy | Modelle dahinter, Policies davor |
| „Workflow-Integration zu SAP/ServiceNow/Salesforce" | [[Logic Apps]] | Enterprise-Konnektoren |
| „Business-User soll Workflow pflegen" | [[Power Automate]] | Citizen-Dev-Erfahrung |
| „Power Platform + Copilot Studio vorhanden, Flow soll Agent-aware sein" | [[Power Automate]] / Agent Flows | Native Kombination |

---

## Querverweise zu anderen MOCs

- [[Microsoft MOC]] — Root
- [[Agents MOC]] — Azure Functions / ACA sind Hosting-Targets für MAF-Agents
- [[Azure AI MOC]] — APIM AI Gateway zwischen Agent und Foundry Models
- [[Data & Knowledge MOC]] — Logic Apps / Power Automate für Datenflüsse
- [[Security & Identity MOC]] — Identity + Conditional Access für Function-Endpoints

---

## Offizielle Sammelquellen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| MS Hub-Page | Azure Functions | https://learn.microsoft.com/en-us/azure/azure-functions/ | 2026-04-21 |
| MS Hub-Page | Azure Container Apps | https://learn.microsoft.com/en-us/azure/container-apps/ | 2026-04-21 |
| MS Hub-Page | APIM AI Gateway | https://learn.microsoft.com/en-us/azure/api-management/genai-gateway-capabilities | 2026-04-21 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-21 | Hongyu | Initial-Erstellung der MOC |
