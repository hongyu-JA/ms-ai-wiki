---
watch: standard
status: ga
last_verified: 2026-04-22
aliases: [Microsoft 365 Agents SDK, Agents SDK]
moc:
  - "[[Microsoft MOC]]"
  - "[[Agents MOC]]"
---

# M365 Agents SDK

*Der **Hosting-/Runtime-Layer** für Agents in Teams, Web und M365-Copilot-Kanälen. Ersetzt [[deprecated/Bot Framework]] (EOS 2025-12-31). Behält das Activity-Protocol, tauscht aber Dialog-Engine gegen LLM-basierte Agent-Logik (via [[Microsoft Agent Framework]]).*

> **Analogie:** Was der alte Bot Framework-Adapter für Channel-Abstraktion war, ist M365 Agents SDK — nur mit neuem Namespace und sauberer Trennung von Logik und Hosting.

---

## Einsatz

**JTBD:** When I einen Agent in Teams, Web oder Copilot hosten will, I want to einen einheitlichen Adapter für alle Kanäle mit Activity-Protocol, so I can einmal bauen und auf mehreren Kanälen deployen.

**Trigger-Signale:**
- „Wir haben Bot Framework-Bots, die müssen migrieren."
- „Unser MAF-Agent soll in Teams, nicht nur als HTTP-Endpunkt."
- „Teams-Integration ohne Teams SDK-Overhead — geht das?"

**Szenarien:** (1) MAF-Agent für Teams deployen, (2) Bot-Framework-Migration-Ziel, (3) Copilot Extension hosten.

**Empfehlung:** 🟢 als Standard-Hosting für alle neuen Teams/Web/Copilot-Agents. Pflicht für BF-Migrationen.

---

## Status & Pricing

- **Status:** GA
- **Pricing:** SDK kostenlos; Hosting-Kosten (Azure App Service / Container Apps / Functions) separat
- **Region:** global

---

## Kernkonzept

M365 Agents SDK ist der **Channel-Abstraktion-Layer**: er spricht Activity-Protocol (kompatibel zu BF) und reicht Events an deine Agent-Logik weiter. Die Logik selbst wird typischerweise mit [[Microsoft Agent Framework]] geschrieben — M365 Agents SDK kümmert sich um Teams-/WebChat-/Direct-Line-Handshake, Auth, Adaptive Cards, State-Management.

Klare Trennung zu [[Teams SDK]]: **M365 Agents SDK = Activity + Hosting**, **Teams SDK = Teams-UI (Adaptive Cards, Teams-Events, Task Modules)**. Für Teams-Deployment brauchst du beide.

### Kern-Fähigkeiten

1. **Activity-Protocol-Adapter** (Channel-Abstraktion, BF-kompatibel)
2. **State-Storage-Provider** (Blob, Cosmos, In-Memory)
3. **Auth-Integration** (Entra, Teams SSO)
4. **Agents Toolkit** (VS Code Extension, TeamsFx-Nachfolger)

---

## Limitierungen

- **UI-Features Teams-spezifisch** → [[Teams SDK]] zusätzlich
- **Logik-Schicht erwartet separates Framework** → [[Microsoft Agent Framework]]

### Fallstricke

- **Mit MAF verwechseln** — M365 Agents SDK ≠ MAF. *Gegenmittel: Stack-Tabelle in MAF-Note.*
- **Channel-Code mit Agent-Logik vermischen** — verletzt die bewusste Schicht-Trennung. *Gegenmittel: Adapter in eigener Datei halten.*

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | M365 Agents SDK Overview | https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/ | 2026-04-22 |
| Docs | Migration Guide (BF → Agents SDK) | https://learn.microsoft.com/en-us/microsoft-365/agents-sdk/migrate-from-bot-framework | 2026-04-22 |
| Docs | Agents Toolkit | https://learn.microsoft.com/en-us/microsoft-365/agents-toolkit/ | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
