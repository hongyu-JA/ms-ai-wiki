---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [AIProjectClient, azure-ai-projects, Foundry SDK]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Foundry SDKs

*Die **SDK-Client-Familie** für programmatischen Zugriff auf Foundry (Projects, Models, Agents, IQ, Control Plane). Zentrale Klasse: `AIProjectClient` 2.0 GA. Verfügbar für Python · .NET · JavaScript · Java.*

> **Analogie:** Was `az` CLI / `azure-mgmt-*` SDKs für Infrastruktur sind, ist Foundry SDK für die AI-Ebene — ein einheitlicher Client über alle Foundry-Services hinweg.

## Einsatz

**JTBD:** When I Foundry-Ressourcen programmatisch verwalten / konsumieren will (Modell-Calls, Agent-Management, IQ-Queries), I want to einen einheitlichen SDK-Client, der alle Teile abdeckt, so I can nicht einzelne Service-SDKs orchestrieren muss.

**Kritische Fragen (Arbeitsauftrag §2.6):** Wie unterscheidet sich `AIProjectClient` vom alten `azure-ai-projects`? Migration-Pfad? Wann Foundry SDK vs. direktes Azure-OpenAI-SDK?

**Empfehlung:** 🟢 als Standard-Client für alle neuen Foundry-Projekte. Für reine Modell-Calls ohne Foundry-Context weiter `azure-openai` oder OpenAI-SDK direkt.

## Status & Pricing

- **Status:** `AIProjectClient` 2.0 GA
- **Pricing:** SDK kostenlos; die dahinter aufgerufenen Services kosten

## Kernkonzept

`AIProjectClient` ist der **Top-Level-Entry-Point**: von hier aus erhält man Handles zu Models, Agents, Knowledge (IQ), Evaluation, Tracing. Ein Foundry-Project = eine Instanz. Die SDK ist **idiomatisch pro Sprache** (async in Python via `asyncio`, `Task` in .NET, Promises in JS).

### Unterschied zu Vorgängern

- **`azure-ai-projects` (alt)** — Preview-SDK mit incomplete Coverage, Rebranding / API-Redesign in 2.0
- **`AIProjectClient` 2.0** — vereinheitlichte API, GA, stabile Namespace-Struktur

Migration: *{TODO: genauer Migrationsguide referenzieren}*

### vs. direktes Azure-OpenAI-SDK

- **Foundry SDK** wenn: Agents + Tracing + IQ im Spiel
- **azure-openai-SDK** wenn: nur Modell-Calls, kein Foundry-Kontext nötig

## Limitierungen

- **Breaking Changes von Preview zu GA** — migrationale Arbeit nötig
- **Nicht alle Features in allen Sprachen gleichzeitig** — .NET/Python sind führend

## Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Foundry SDK Overview | https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/develop/sdk-overview | 2026-04-22 |
| Python SDK | azure-ai-projects | https://pypi.org/project/azure-ai-projects/ | 2026-04-22 |
| .NET SDK | Azure.AI.Projects | https://www.nuget.org/packages/Azure.AI.Projects | 2026-04-22 |

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
