---
watch: close
status: ga
last_verified: 2026-04-22
aliases: []
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Foundry IQ

*Foundry's **Custom Knowledge Base** für Agents — Convenience-Layer über [[Azure AI Search]], einheitlich für alle Agents in einem Foundry-Project bereitgestellt.*

> **Analogie:** Wie eine vorbereitete Datenbank-Verbindung in einer App — du musst dich nicht um Index-Setup kümmern, aber wenn du Spezialwünsche hast, musst du auf die Basis-Datenbank direkt.

## Einsatz

**JTBD:** When I Agents mit eigenen Dokumenten erden will, I want to einen schnellen Weg von „ich habe SharePoint/Blob" zu „Agent kann mit Grounding antworten", ohne Index-Engineering, so I can beim Prototyping Tempo habe.

**Kritische Fragen (Arbeitsauftrag §2.6):** Wie unterscheidet sich IQ von direktem Azure AI Search? Wann Convenience (IQ), wann Flexibilität (Search)?

**Empfehlung:** 🟢 für schnellen Start + kleine/mittlere Korpora. Bei Bedarf auf [[Azure AI Search]] direkt wechseln — siehe [[RAG Pattern MOC]] Matrix.

## Status & Pricing

- **Status:** GA
- **Pricing:** Abhängig von Azure AI Search unter der Haube *{TODO: eigene IQ-Billing-Dimension prüfen}*

## Kernkonzept

Foundry IQ abstrahiert Azure AI Search: du lädst Dokumente ins Foundry-Project, IQ kümmert sich um Chunking, Embedding, Index-Erstellung. Die Query-API ist vereinheitlicht mit der Agent-SDK — ein MAF-Agent bekommt den IQ-Endpoint als Tool/Resource.

### IQ vs. Azure AI Search direkt

| Dimension | Foundry IQ | [[Azure AI Search]] direkt |
|-----------|------------|-----------------------------|
| **Setup** | Klicks | Index-/Skillset-Design |
| **Kontrolle** | Defaults | voll |
| **Chunking-Strategie** | Vorgegeben | Custom |
| **Scoring-Profile** | nein | ja |
| **Skalierung** | Foundry-Project-gebunden | eigenständig |

→ **Faustregel:** Start mit IQ, bei Retrieval-Quality-Grenze auf Search wechseln.

## Limitierungen

- **Begrenzte Kontrolle über Chunking/Scoring**
- **Nicht für riesige Korpora** — Foundry-Project-Scope

## Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Foundry IQ | https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/foundry-iq | 2026-04-22 |

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
