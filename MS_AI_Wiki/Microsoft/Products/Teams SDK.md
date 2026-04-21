---
watch: standard
status: ga
last_verified: 2026-04-22
aliases: [Teams AI Library]
moc:
  - "[[Microsoft MOC]]"
  - "[[Agents MOC]]"
---

# Teams SDK

*Teams-spezifische **UI/UX-Schicht** für Agents in Microsoft Teams — Adaptive Cards, Teams-Events, Task Modules, Teams-spezifisches Messaging. Ergänzt [[M365 Agents SDK]], ersetzt es nicht. Früher bekannt als Teams AI Library.*

> **Analogie:** Was React Native für Mobile-UI-Komponenten ist, ist Teams SDK für Teams-native UI-Elemente — eine kuratiere Bibliothek für das Teams-Rendering-Modell.

---

## Einsatz

**JTBD:** When I einen Agent in Teams deploye und das Teams-UI-Erlebnis voll nutzen will (Adaptive Cards, Meeting-Extensions, Task Modules), I want to eine Teams-spezifische Abstraktion, so I can die Unterschiede zu generischem Chat ohne Boilerplate nutzen kann.

**Trigger-Signale:**
- „Wir wollen unseren Agent-Output in hübschen Adaptive Cards, nicht nur Text."
- „Agent soll in Teams-Meetings als Teilnehmer reagieren."
- „Wir brauchen Task Modules für strukturierte Eingaben."

**Szenarien:** (1) Adaptive Cards als Agent-Antwort, (2) Meeting-Extension für Teams-Calls, (3) Task Module für strukturierte User-Eingabe.

**Empfehlung:** 🟢 bei allen Teams-zentrischen Agent-Deployments. Für rein chat-basierte Agents ohne Teams-UI-Spezifika reicht [[M365 Agents SDK]] allein.

---

## Status & Pricing

- **Status:** GA (Umbenennung von Teams AI Library 2025-06)
- **Pricing:** SDK kostenlos
- **Region:** global

---

## Kernkonzept

Teams SDK kapselt Teams-Rendering-Spezifika: **Adaptive Cards** (Schema + Client-Rendering), **Teams-Events** (Meeting-Start, User-Join, File-Upload), **Task Modules** (Modal-Dialoge für Formulare), **Messaging Extensions** (Command-Palette-Integration).

Klare Arbeitsteilung im Stack:
- **[[Microsoft Agent Framework]]** — Agent-Logik
- **[[M365 Agents SDK]]** — Channel-Hosting + Activity-Protocol
- **Teams SDK** — Teams-UI-Primitive

Nicht verwechseln mit Teams Toolkit (VS Code Extension, Dev-Tooling) — das heißt jetzt Agents Toolkit und ist Teil von [[M365 Agents SDK]].

### Kern-Fähigkeiten

1. **Adaptive Cards Authoring + Rendering**
2. **Teams-Events-Handler** (Meeting, Channel, User)
3. **Task Modules** (Modal-Dialog-Framework)
4. **Messaging Extensions** (Command + Link Unfurling)

---

## Limitierungen

- **Nur für Teams** — nicht portable zu WebChat / Slack
- **Adaptive Cards sind eigener Lern-Stack**

### Fallstricke

- **Teams SDK als SDK-Ersatz für M365 Agents SDK sehen** — sie sind komplementär, nicht alternativ.

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Teams SDK | https://learn.microsoft.com/en-us/microsoftteams/platform/ | 2026-04-22 |
| Adaptive Cards | AdaptiveCards.io | https://adaptivecards.io | 2026-04-22 |
| GitHub | microsoft/teams-ai | https://github.com/microsoft/teams-ai | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
