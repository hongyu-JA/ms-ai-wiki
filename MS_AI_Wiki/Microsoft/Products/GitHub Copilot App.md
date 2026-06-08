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

## Pricing (Build-Keynote-Stand)

| Tier | Preis pro User/Monat | Inhalt |
|---|---|---|
| **Copilot Pro** | $10 | Single-User, alle Modelle, 50k Premium-Tokens |
| **Copilot Business** | $19 | Team-Features, Admin-Console, 100k Tokens |
| **Copilot Enterprise** | $39 | Audit, Custom-Models, Unlimited Tokens (Fair-Use) |

Schätzung für 10er-Dev-Team: ca. **CHF 200-400/Monat**.

Für Schweizer Banken: Copilot Enterprise mit Custom-Models + Audit-Logs ist die Pflicht-Variante.

## Vergleich: Copilot App vs Alternativen

| Aspekt | Copilot App | VS Code + Copilot | Cursor | Replit Desktop |
|---|---|---|---|---|
| Multi-Modell-UI | ✓ | nur Copilot-Modelle | ✓ | begrenzt |
| Canvas-Editing | ✓ | ✗ | ✓ | teilweise |
| GitHub-native Workflows | ✓ (deepest) | ✓ | über Plugin | ✗ |
| Lokal-Modelle (Foundry Local, Aion) | ✓ (Build 2026 angekündigt) | nein | ✓ (Ollama) | nein |
| Multi-Agent-Coding | ✓ | ✗ | beschränkt | ✗ |
| Reifegrad | Preview | sehr reif | reif | reif |
| Vendor-Lock-in | hoch (Microsoft) | mittel | tief | mittel |
| Empfohlen für | Microsoft-First Dev-Teams | gemischt | unabhängige Devs | Hobby + schnelle POCs |

## Konkrete Workflow-Beispiele

### Multi-Agent-Coding-Squad
```
1. Plan-Agent: liest GitHub-Issue, plant Tasks
2. Code-Agent: implementiert Task 1
3. Test-Agent: schreibt + führt Tests aus
4. Review-Agent: macht Self-Code-Review
5. PR-Agent: öffnet Pull-Request mit Description
```

Alles in einer Copilot-App-Session, statt manuell zwischen Tools zu wechseln. Demo-Hit der Build 2026 Keynote.

### Lokal-Modell-Switch
```
"Schreib mir eine Klasse für X" (Standard-Task)
  → MAI-Code-1 (cloud, schnell, billig)

"Refaktoriere unsere ganze Vertrags-Verarbeitung" (sensitiv)
  → Aion Plan (lokal, kein Daten-Export)

"Komplexer System-Design-Diskurs" (Reasoning)
  → Claude 4 (Anthropic, beste Code-Architektur)
```

Modell-Wechsel im UI ohne Code-Änderungen.

## Häufige Stolpersteine

1. **Preview-Status:** Bugs vorhanden, nicht für Mission-Critical-Dev geeignet vor Q4/2026.
2. **GitHub-Lock-in:** Code in privaten GitLab/Bitbucket-Repos schwer integrierbar — primär für GitHub-zentrische Teams.
3. **Lokal-Modelle nur Windows 12.** Mac-Nutzer können Aion nicht nutzen.
4. **Kein Schweizerdeutsch-UI** (klar, ist Dev-Tool — aber Code-Kommentare in CH-Dialekt-Pseudo-Code wird nicht unterstützt).

## Schweizer Compliance-Implikationen

- **Datenschutz:** Code-Snippets werden zu Modell-Provider gesendet (außer bei Lokal-Modell-Wahl)
- **Banken-Vorgabe:** Custom-Models-Feature in Enterprise-Tier ermöglicht Inferenz auf eigenem Foundry-Endpoint statt Microsoft-shared
- **FADP:** Code mit personenbezogenen Daten nur mit Lokal-Modellen oder Enterprise-Endpoint nutzen
- **Audit:** Enterprise-Tier loggt Coding-Activity — bei Mitarbeiter-Bewertung relevant

## Empfehlungs-Schema (verfeinert)

**Für Schweizer Banken:**
- Copilot Enterprise + Custom-Models + Aion-Lokal-Fallback für sensitive Code-Bases
- VS-Code-Plugin parallel halten für nicht-AI-Tasks

**Für Schweizer KMU:**
- Copilot Pro reicht
- VS Code + Plugin als Alternative wenn schon vorhanden

**Für Startups:**
- Cursor oder Copilot App je nach Modell-Vorliebe
- Beide günstig

## Vertiefungsbedarf (0.5-Tag-Aufwand)

- [ ] Hands-on: Copilot App installieren, 1 Tag testen, Eindruck dokumentieren
- [ ] Lokal-Modell-Switch mit Foundry Local testen
- [ ] Compliance-Check mit Banking-Kunde durchsprechen
- [ ] Pricing-Vergleich für 3 Bestandskunden mit ihrer aktuellen IDE-Lizenz

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [news.microsoft.com/build-2026](https://news.microsoft.com/build-2026/)
