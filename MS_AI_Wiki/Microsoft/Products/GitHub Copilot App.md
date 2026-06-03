---
watch: open
status: stub_build_2026
last_verified: 2026-06-03
source: build-2026-keynote
aliases:
  - GitHub Copilot Desktop
  - Copilot App
moc:
  - '[[Microsoft MOC]]'
  - '[[Copilot MOC]]'
zuletzt_gesichtet: 2026-06-03
updated: 2026-06-03
---

# GitHub Copilot App

*Eine native Desktop-Anwendung für agentic Coding-Workflows, vorgestellt auf Build 2026. Multi-Modell-Hintergrund: MAI-Code, GPT-5, Claude 4, Code Llama 4 — Auswahl im UI.*

> **Analogie:** Was VS Code Copilot Chat im Editor war, ist die Copilot App auf der Desktop-Ebene. Eine eigene Schwerstgewichts-IDE für Agent-orchestriertes Coding, ähnlich Cursor oder Replit Desktop.

---

## Was leistet es?

- **Multi-Modell-Auswahl:** im UI zwischen MAI-Code, GPT-5, Claude 4, Code Llama 4 wechseln
- **Canvas-UI:** visuelles Editieren von Code-Strukturen über Chat hinaus
- **Agentic Workflows:** Multi-Step-Aufgaben (Plan → Implement → Test → Document)
- **Lokale Filesystem-Integration:** keine Browser-Beschränkung
- **GitHub-native:** Issues, PRs, Repos direkt im Workflow

## Status

- GA-Preview seit Build 2026
- Verfügbar für Copilot Pro / Business / Enterprise

## Wo passt es in die Architektur?

- **Layer:** SURFACE (zusammen mit M365 Copilot)
- **Verbindungen:**
  - `uses` → MAF, GitHub-API
  - `calls` → MAI Models (Default), Foundry Models, OpenAI, Anthropic
  - `secured-by` → Entra Agent ID (für GitHub-Auth)

## Beratungs-Relevanz für Journai

**Mittel — relevant für Dev-Team-Beratung.**

Hauptzielgruppe: Kunden mit grossen Dev-Teams, die ihre IDE-Wahl bewerten wollen. Bisherige Empfehlung war "VS Code mit Copilot Chat". Mit der Copilot App:

- Argument **pro** Copilot App: Multi-Modell-Auswahl + Canvas + nativer Workflow
- Argument **contra**: Vendor-Lock-in tiefer, Cursor / Replit-Desktop sind agnostisch und oft erfahrener

Empfehlungs-Schema:
- **Microsoft-First-Kunden** → Copilot App
- **Multi-Cloud / agnostische Kunden** → bewährter VS Code + Plugin-Ansatz
- **Greenfield-Startups** → Cursor oder Copilot App, je nach Workflow-Affinität

## Vertiefungsbedarf (0.5-Tag-Aufwand)

- [ ] Pricing-Tiers (Pro / Business / Enterprise)
- [ ] Vergleich mit Cursor und Replit Desktop
- [ ] Lokale Modell-Unterstützung (kann es Foundry Local aufrufen?)

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [news.microsoft.com/build-2026](https://news.microsoft.com/build-2026/)
