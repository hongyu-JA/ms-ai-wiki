---
type: meta
tags: [deprecation, radar, compliance-alerts]
created: 2026-04-21
updated: 2026-04-22
---

# Deprecation Radar

Zentrale Übersicht aller Microsoft-AI-**Deprecations** und **Compliance-Defaults, die man kennen muss**. Bestandskunden-Beratung: hier nachschlagen, bevor man ein Produkt empfiehlt.

## Legende

- 🔴 **akut** — EOS binnen 3 Monaten oder bereits überschritten · oder kritischer DSGVO-Default
- 🟡 **mittel** — EOS in 3–12 Monaten, Migration planen · oder Compliance-Default mit Diskussionsbedarf
- 🟢 **entspannt** — EOS > 12 Monate, Awareness reicht

---

## Aktive Migrationen

| Produkt | Status | Ersetzt durch | EOS | Migrationspfad | Owner |
|---------|--------|---------------|-----|----------------|-------|
| [[deprecated/Bot Framework]] | 🔴 | [[M365 Agents SDK]] | 2025-12-31 | Channel-Mapping + TeamsFx→Agents Toolkit, Activity-Protocol bleibt kompatibel | Hongyu |
| [[deprecated/Semantic Kernel]] | 🟡 | [[Microsoft Agent Framework]] | TBD | API weitgehend kompatibel, Kernel→Agent+Thread, Planner entfällt | — |
| [[deprecated/AutoGen]] | 🟡 | [[Microsoft Agent Framework]] | TBD | GroupChat-Pattern bleibt, AutoGen Studio ohne 1:1-Ersatz | — |
| Prompt Flow *(in [[Microsoft Foundry]])* | 🟡 | neues Foundry Prompt-Tooling | 2027-01 | Migrieren vor 01/2027 | — |
| Azure ML v1 | 🟡 | Azure ML v2 (CLI 2.0, SDK v2) | kein festes EOS | SDK-Migration einplanen | — |
| QnA Maker + LUIS | 🔴 *(bereits retired)* | Azure AI Language (CLU) + [[Azure AI Search]] + MAF-Tool | bereits erreicht | Parallel zu Bot-Framework-Migration | — |

---

## 🚨 Compliance-Alerts — aktive Defaults, die man kennen muss

Keine Deprecations im klassischen Sinn, aber **Microsoft hat Defaults gesetzt, die im EU-Kontext ohne explizite Admin-Entscheidung Compliance-Risiken aufwerfen.** Hier stehen sie, damit niemand aus Versehen an ihnen vorbei läuft.

| Default | Betroffen | Status | Handlungsempfehlung | Quelle |
|---------|-----------|--------|---------------------|--------|
| **Copilot Flex Routing = ON** (EU/EFTA) seit 2026-04-17 | [[Microsoft 365 Copilot]] · [[Microsoft 365 E7]] | 🔴 | **Für strikte EU-Residenz: aktiv opt-out**. Copilot Admin Center → Settings → EU Data Boundary → Flex Routing deaktivieren | [Flex Routing Docs](https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-flex-routing) |
| **Claude-Default = OFF** in EU/EFTA/UK | [[Microsoft 365 Copilot]] · Multi-Model · Cowork | 🟡 | Pro Kunde entscheiden. Vor Enable: **DPIA aktualisieren** (Anthropic jetzt unter MS-DPA). Admin Center → Copilot → Settings → Anthropic enable | [Anthropic Subprocessor](https://learn.microsoft.com/en-us/copilot/microsoft-365/connect-to-ai-subprocessor) |
| **„Microsoft usage data" Cross-Product-Toggle = ON** | Work IQ Personal-Layer (Edge/Bing/MSN-Daten) | 🟡 | Für regulierte Kunden: opt-out setzen | [Copilot Privacy Controls](https://support.microsoft.com/en-us/topic/microsoft-copilot-privacy-controls-8e479f27-6eb6-48c5-8d6a-c134062e2be6) |

---

## Legacy-Beobachtung (kein Handlungsdruck)

| Produkt | Status | Hinweis |
|---------|--------|---------|
| `azure-ai-projects` (altes Foundry-SDK) | 🟡 | Ersetzt durch `AIProjectClient` 2.0 — siehe [[Foundry SDKs]] |
| Teams AI Library (alter Name) | 🟢 | Umbenannt zu [[Teams SDK]], kein Bruch |
| Azure Cognitive Search (alter Name) | 🟢 | Umbenannt zu [[Azure AI Search]], kein Bruch |
| Azure AI Studio / AI Foundry / AI Hub | 🟢 | Rebrand in [[Microsoft Foundry]], kein Bruch, Portale weiterleiten |
| Power Virtual Agents (alter Name) | 🟢 | Teil von [[Copilot Studio]], kein Bruch |
| Form Recognizer | 🟢 | Umbenannt zu [[Azure AI Document Intelligence]], kein Bruch |

---

## Changelog

| Datum | Änderung | Quelle |
|-------|----------|--------|
| 2026-04-22 | Compliance-Alerts-Sektion hinzugefügt (Flex Routing 🔴, Claude-EU-Default 🟡, usage data Toggle 🟡); Legacy-Beobachtung um QnA/LUIS, Prompt Flow, azure-ai-projects, Rebrands erweitert | Deep-Research Copilot + laufende Stub-Erstellung |
| 2026-04-21 | Radar angelegt | — |
