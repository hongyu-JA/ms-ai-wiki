---
type: moc
tags: [moc, microsoft, lens, rag]
last_verified: 2026-04-21
---

# RAG Pattern MOC

*Lens-MOC (einseitig). Beantwortet die **eine Schlüsselfrage**: „Welches RAG-Backend wofür?" — Diese MOC verlinkt die in Frage kommenden Produkte quer, ohne dass die Produkte selbst etwas von dieser Lens wissen.*

> [!note] Lens-Regel
> Als Lens-MOC darf diese Note **nicht** im `moc:`-Frontmatter eines Produkts auftauchen. Verlinkung ist **einseitig** — hier nach außen, nicht zurück.

---

## Zweck

Einstieg für alle Retrieval-Augmented-Generation-Entscheidungen. Microsoft hat mindestens 4 Optionen mit unterschiedlichen Trade-offs — diese MOC stellt sie nebeneinander, damit der Berater in 2 Minuten die richtige Wahl hat.

---

## Die Optionen im Überblick

| Option | Was es ist | Wann wählen | Primary Home |
|--------|------------|-------------|--------------|
| **[[Foundry IQ]]** | Convenience-Layer, unter der Haube Azure AI Search, einheitlich für Agents im Foundry-Projekt | Agent-Native, schneller Start, Foundry-Ökosystem | [[Azure AI MOC]] |
| **[[Azure AI Search]]** | Hybrid-Search (Keyword + Vector + Semantic), volle Index-Kontrolle | Eigene Indexer-Logik, komplexe Synonym-/Scoring-Profile, großer Korpus | [[Azure AI MOC]] |
| **[[Azure Cosmos DB for AI]]** | NoSQL-Datenbank mit Vector Search, co-located mit App-Daten | App-Daten bereits in Cosmos, Query-Latenz kritisch, Transaktion + RAG zusammen | [[Data & Knowledge MOC]] |
| **[[Microsoft Graph]]** + Copilot Connectors | M365-Datenzugriff ohne eigenen Index | SharePoint/OneDrive/Teams-Daten unverändert, Copilot-Grounding | [[Data & Knowledge MOC]] + [[Copilot MOC]] |

---

## Entscheidungs-Matrix

```
                    ┌─ Kleiner Korpus (< 10k Docs)?
                    │   ├─ JA → Foundry IQ
Braucht Index       │   └─ NEIN → Azure AI Search
Kontrolle?          │
──YES──┐            │
       │            ▼
  ┌────┴────────────────────────────────┐
  │                                     │
Korpus ist  ─ M365-Daten ─ JA → Graph + Copilot Connectors (keinen eigenen Index nötig)
             │
             └─ Externe Daten ─ Index bauen (Foundry IQ oder Azure AI Search)

──NO───┐
       │
App-Daten in Cosmos DB? ─ JA → Cosmos DB Vector Search (Co-Location)
                         └─ NEIN → Azure AI Search als Default
```

---

## Kern-Dimensionen

| Dimension | Foundry IQ | Azure AI Search | Cosmos DB | Graph + Connectors |
|-----------|------------|-----------------|-----------|---------------------|
| **Setup-Aufwand** | niedrig | mittel | niedrig (wenn App schon Cosmos) | niedrig |
| **Flexibilität** | mittel | **hoch** | mittel | niedrig |
| **Skalierung** | abhängig AI Search darunter | **hoch** | hoch | M365-Tenant-Limits |
| **Kosten** | vs. Search-Unit | Search-Unit-basiert | RU/s + Storage | im M365-Lizenz-Umfang |
| **Multi-Tenant-Isolation** | via Foundry-Project | via Index/Namespace | via Partitioning | via Graph-App-Scope |
| **MCP-Integration** | via MAF | via MAF | via MAF | via Dataverse MCP / Graph Connector |
| **Hybrid (Keyword+Vector)** | ja (über Search) | **ja, nativ** | Vector nur | Keyword nur |
| **Nicht geeignet für** | sehr große Korpora mit spezifischen Scoring-Bedürfnissen | Schnellen MVP-Start | Komplexes Text-Relevance-Ranking | Nicht-M365-Daten |

---

## Querverweise zu anderen MOCs

- [[Microsoft MOC]] — Root
- [[Azure AI MOC]] — Foundry IQ + Azure AI Search
- [[Data & Knowledge MOC]] — Cosmos DB, Graph
- [[Copilot MOC]] — Copilot Connectors

---

## Offizielle Sammelquellen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| MS Hub-Page | Azure AI Search | https://learn.microsoft.com/en-us/azure/search/ | 2026-04-21 |
| MS Hub-Page | Foundry IQ | https://learn.microsoft.com/en-us/azure/foundry/concepts/foundry-iq | 2026-04-21 |
| MS Hub-Page | Cosmos DB Vector Search | https://learn.microsoft.com/en-us/azure/cosmos-db/vector-search | 2026-04-21 |
| MS Hub-Page | Copilot Connectors | https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/ | 2026-04-21 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-21 | Hongyu | Initial-Erstellung der Lens-MOC mit RAG-Backend-Matrix |
