---
type: moc
moc_role: primary-home
moc_slug: agents
tags:
  - MOC
  - agents
created: 2026-04-21
updated: 2026-04-21
---

# Agents MOC

Primary-Home für alle Produkte, deren Kern es ist, **Agenten zu bauen, zu hosten oder zu orchestrieren**.

## Decision-Logik (in Kundengesprächen)

> Wenn ein Kunde sagt… → starte bei…

- „Wir wollen einen Assistenten ohne Code bauen" → **Copilot Studio** (Agent Builder / Declarative Agents)
- „Wir wollen Multi-Agent-Orchestrierung mit Code" → **Microsoft Agent Framework (MAF)**
- „Wir wollen den Agent in Teams deployen" → **M365 Agents SDK** (+ Teams SDK für UI)
- „Wir müssen Agenten governance-compliant hosten" → **Agent 365** + **Entra Agent ID**
- „Wir wollen Long-Running Multi-Step-Aufgaben" → **Copilot Cowork** (Wave 3)

## Produkte in dieser MOC

| Produkt | Tier | Watch | Status | Kurzbeschreibung |
| ------- | ---- | ----- | ------ | ---------------- |
| [[Microsoft Agent Framework]] | 1 | close | GA (2026-04-07) | Pro-Code-Framework für Agents, ersetzt SK + AutoGen |
| Copilot Studio *(geplant)* | 1 | close | GA | Low-Code-Agent-Builder |
| Agent 365 *(geplant)* | 1 | close | GA (2026-05-01) | Governance-Control-Plane für Agents |
| M365 Agents SDK *(geplant)* | 2 | standard | GA | Hosting-Layer, ersetzt Bot Framework |

<!-- auto-sync: update_row · {"product":"Microsoft Agent Framework","columns":{"Notiz":"Agent Skills (.NET): 3 Authoring-Varianten + Human-Approval für Script-Calls (Apr 2026)"}} -->

<!-- auto-sync: update_row · {"product":"Microsoft Agent Framework","columns":{"version_python":"1.0.1","hinweis":"Security-Breaking-Change in FileCheckpointStorage (restricted unpickler), neuer Cosmos DB Checkpoint Store"}} -->

<!-- auto-sync: update_row · {"product":"Microsoft Agent Framework","columns":{"Version (Python)":"1.1.0","Letzte Änderung":"2026-04-21","Hinweis":"Gemini-Client, Hyperlight CodeAct, Foundry Toolboxes, Breaking: CosmosCheckpointStorage"}} -->




## Deprecated-Vorgänger

| Produkt | Ersetzt durch | EOS |
| ------- | ------------- | --- |
| [[deprecated/Bot Framework]] | M365 Agents SDK | 2025-12-31 |
| [[deprecated/Semantic Kernel]] *(geplant)* | MAF | TBD |
| [[deprecated/AutoGen]] *(geplant)* | MAF | TBD |

## Querverweise

- [[Microsoft MOC]]
- [[Deprecation Radar]]
