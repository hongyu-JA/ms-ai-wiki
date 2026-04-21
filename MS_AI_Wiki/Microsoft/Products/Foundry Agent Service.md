---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [Azure AI Agent Service]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
  - "[[Agents MOC]]"
---

# Foundry Agent Service

*Managed Hosting für [[Microsoft Agent Framework]]-Agents in der Azure-Cloud — Alternative zu Self-Hosting auf [[Azure Container Apps]] / [[Azure Functions]]. Agent-in-a-Box mit Out-of-the-Box-Frontend, Tracing im Control Plane, Identity via Entra.*

> **Analogie:** Was App Service für Web-Apps ist, ist Foundry Agent Service für MAF-Agents — managed, aber mit spezifischen Einschränkungen.

## Einsatz

**JTBD:** When I schnell einen MAF-Agent produktiv nehmen will, ohne Container-Ops-Setup, I want to ihn direkt im Foundry-Project deployen und ein Chat-UI erhalten, so I can Time-to-Production minimiere.

**Kritische Fragen (Arbeitsauftrag §2.6):** **EU-Verfügbarkeit!** Aktuell **nur North Central US** für hosted Agents → DSGVO-Implikationen klären. Wann Agent Service vs. Copilot Studio vs. Self-Hosting?

**Empfehlung:** 🟡 **Beobachten** bis EU-Availability. Für US-Kunden/Testzwecke 🟢.

## Status & Pricing

- **Status:** GA · **Region:** aktuell nur North Central US
- **Pricing:** Agent-Instance-basiert + Modell-Token *{TODO: exakte Pricing-Matrix}*

## Kernkonzept

Agent Service ist das **managed Deployment-Ziel** innerhalb Foundry. Ein Foundry-Project kann beliebig viele Agents hosten. Der Service übernimmt: Hosting (Container hinter Load Balancer), Thread-Persistenz (integriert mit Cosmos DB hinter den Kulissen), Chat-UI (out-of-the-box Web-Client), Tracing-Integration (Foundry Control Plane).

**Abgrenzung:**
- vs. Self-Hosting (ACA/Functions): weniger Kontrolle, dafür null Ops
- vs. [[Copilot Studio]]: Pro-Code (MAF) statt Low-Code, Azure-native statt M365-native
- vs. [[M365 Agents SDK]] (Teams): Agent Service ist Web-first, nicht Teams-first

## Limitierungen

- **Region-Lock NC-US** (DSGVO-Problem für EU-Produktiv-Einsätze)
- **Weniger Kontrolle** — Container-Konfiguration eingeschränkt

## Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Agent Service Overview | https://learn.microsoft.com/en-us/azure/ai-foundry/agents/ | 2026-04-22 |

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
