---
watch: passive
status: ga
last_verified: 2026-04-22
aliases: [VS Code AI Toolkit, GitHub Copilot, azd AI]
moc:
  - "[[Microsoft MOC]]"
  - "[[Integration & Compute MOC]]"
---

# Microsoft AI Developer Tooling

*Bündel-Note für alle **Developer-facing AI-Tools** im Microsoft-Stack: **Visual Studio 2026** (AI-native), **VS Code AI Toolkit**, **GitHub Copilot Cloud Agents**, **azd AI**. Für uns primär **internes Produktivitäts-Tooling**, nicht Kunden-Thema — aber Team-Enablement-relevant.*

> **Analogie:** Wie früher „Office für Entwickler" — Microsoft versucht, den gesamten AI-Build-Workflow (Debug → Deploy → Evaluate → Ship) in seine IDEs und CLI zu integrieren.

---

## Einsatz

**JTBD:** When I im Journai-Team AI-Agents/Apps baue, I want to in der vertrauten IDE (VS Code / Visual Studio) Debugging + Prompt-Tuning + Deploy-to-Azure aus einem Tool machen, so I can weniger Kontext-Switches zwischen Docs, Portal, Terminal brauche.

**Trigger-Signale:**
- „Welches Tooling nutzt ihr intern für MAF-Entwicklung?"
- „Wie debuggen wir einen Foundry Agent Service Deploy?"
- „Ist GitHub Copilot für unser Team lohnenswert?"

**Szenarien:** (1) Pro-Code MAF-Agent im VS 2026 AI-native bauen, (2) VS Code AI Toolkit für Model-Playground + RAG-Prototyping, (3) azd AI für End-to-End Infra-Deploys.

**Empfehlung:** 🟢 Für internes Team — VS Code AI Toolkit + GitHub Copilot Business als Standard. VS 2026 für .NET/MAF.

---

## Status & Pricing

| Tool | Status | Pricing (2026) |
|------|--------|----------------|
| **Visual Studio 2026 (AI-native)** | GA | VS Subscriptions (Professional/Enterprise) |
| **VS Code AI Toolkit** | GA | Kostenloses VS-Code-Plugin |
| **GitHub Copilot Cloud Agents** | Preview → GA 2026-Q2 | Copilot Business/Enterprise (~$19/39 per seat/month) |
| **azd AI** (Azure Developer CLI) | GA | Kostenfrei |

---

## Kernkonzept

### Visual Studio 2026 AI-native

- **Ghost Completions** (inline, multi-line) in C#/Python
- **AI Project Template** für MAF/Foundry
- **Inline Agent Testing** — Agent-Debugging direkt in IDE

### VS Code AI Toolkit

- **Model Playground** gegen Azure OpenAI / Foundry Models lokal
- **Prompt Management**
- **Evaluation Runner**
- **RAG-Quickstart-Templates**

### GitHub Copilot Cloud Agents

Der **Cloud-agent**-Modus (nicht klassisches Inline-Copilot): GitHub-issue-getriebene autonome Agents, die PRs eröffnen. Interessant als **meta-Tool** für Team-Automation, nicht direkt für Kunden.

### azd AI

**Azure Developer CLI**-Erweiterung: `azd ai init` erzeugt bereit-deploybare AI-Projekt-Templates mit Foundry + Functions + AI Search vorkonfiguriert. Für Rapid-Prototyping + Infra-as-Code.

---

## Limitierungen & Fallstricke

- **VS Code AI Toolkit vs. VS 2026** — redundant für Python-Heavy-Teams; VS 2026 Advantage nur bei .NET
- **GitHub Copilot Cloud Agents noch Preview** — nicht für Production-Workflows
- **azd AI Templates können veraltet sein** — Foundry-API-Änderungen (siehe [[Foundry SDKs]] 2.0) schlagen durch

### Fallstricke

- **„VS 2026 AI-native macht Jr-Devs produktiv"** — nur wenn Dev das zugrundeliegende Framework versteht. *Gegenmittel: MAF-Grundlagen parallel lernen, nicht IDE-gestützt generieren und hoffen.*

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | VS Code AI Toolkit | https://marketplace.visualstudio.com/items?itemName=ms-windows-ai-studio.windows-ai-studio | 2026-04-22 |
| Docs | Visual Studio 2026 AI | https://visualstudio.microsoft.com/vs/2026/ | 2026-04-22 |
| Docs | GitHub Copilot | https://docs.github.com/en/copilot | 2026-04-22 |
| Docs | azd AI | https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/ | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub (Tier 3 Awareness — Dev-Tooling-Bündel) |
