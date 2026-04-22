---
watch: passive
status: ga
last_verified: 2026-04-22
aliases: [Cosmos DB Vector Search, Cosmos DB AI]
moc:
  - "[[Microsoft MOC]]"
  - "[[Data & Knowledge MOC]]"
---

# Azure Cosmos DB for AI

*Azure Cosmos DB mit **integrierter Vector-Search** — Vektoren **co-located** mit den eigentlichen App-Daten (JSON-Dokumente). Alternative zu [[Azure AI Search]] wenn die App-Daten ohnehin in Cosmos leben und eine separate Search-Instanz vermeidbar wäre.*

> **Analogie:** Wie PostgreSQL mit `pgvector` — die Vector-Funktion ist ein Feature der bestehenden Datenbank, kein separater Service. Spart Ops-Aufwand auf Kosten spezialisierter Relevanz-Tuning-Features.

---

## Einsatz

**JTBD:** When I App-Daten bereits in Cosmos DB habe und RAG on top brauche, I want to Vector-Search direkt in der gleichen DB-Instanz, so I can Cross-Region-Reads, Cross-Service-Konsistenz und separate AI-Search-Kosten vermeide.

**Trigger-Signale:**
- „Wir haben unsere App-Daten in Cosmos, brauchen jetzt RAG."
- „AI Search wäre ein separater Service — können wir das nicht in einem fahren?"
- „Realtime-Update: App-Daten ändern sich, Vektoren müssen sofort folgen."

**Szenarien:** (1) App + RAG in einer DB, (2) E-Commerce-Produktsuche mit semantischer Ähnlichkeit, (3) Chat-History mit Vector-Retrieval.

**Empfehlung:** 🟡 Wenn Cosmos-Kunde ohnehin da ist → evaluieren. Sonst lieber [[Azure AI Search]] (mehr Features).

---

## Status & Pricing

- **Status:** GA (Vector Search in Cosmos DB for NoSQL)
- **Pricing:** Teil des Cosmos-DB-RU-Pricings — Vector-Index verbraucht RUs beim Schreiben + Lesen
- **Region:** alle Cosmos-DB-Regionen

---

## Kernkonzept

Cosmos DB for AI speichert Vector-Embeddings als zusätzliches Feld im JSON-Dokument:

```json
{
  "id": "doc-123",
  "content": "...",
  "embedding": [0.12, -0.34, ...]
}
```

Vector-Index wird auf dem `embedding`-Feld angelegt. Query via `VectorDistance()` in SQL-Syntax.

### Kern-Fähigkeiten

1. **Vector Search** — kNN + Approximate (DiskANN) — Trade-off Präzision vs. Latenz
2. **Hybrid Query** — Vector + strukturierte Filter in einem Query
3. **Global Distribution** — Cosmos-typisch Multi-Region, niedrigere Replikations-Latenz als separate Search-Instanz
4. **Change Feed Integration** — App-Datenänderung triggert automatisch Vector-Update

---

## Limitierungen & Fallstricke

- **Keine Semantic Ranker wie AI Search** — reiner Vector-Abstand, keine L2 re-ranking
- **Index-Qualität nicht so feinkörnig tunebar** — DiskANN-Parameter eingeschränkt
- **Limit: 3072 Dimensionen** — passt für gängige Embedding-Modelle (text-embedding-3-large hat 3072)

### Fallstricke

- **Cosmos als Search-Ersatz sehen** — Cosmos ist OLTP + Vector, nicht Search. *Gegenmittel: Bei komplexen Relevanz-Anforderungen lieber AI Search.*
- **RU-Kosten unterschätzen** — Vector-Writes sind teuer. *Gegenmittel: RU-Budget bei Embed-Ingestion separat kalkulieren.*

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Vector Search in Cosmos DB | https://learn.microsoft.com/en-us/azure/cosmos-db/vector-search | 2026-04-22 |
| Docs | DiskANN | https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/vector-search-diskann | 2026-04-22 |
| Blog | Cosmos + OpenAI Reference Architecture | https://devblogs.microsoft.com/cosmosdb/ | 2026-04-22 |

---

## Abgrenzung

Siehe [[RAG Pattern MOC]] — die Entscheidung „Cosmos DB for AI vs. Azure AI Search vs. Foundry IQ" lebt dort.

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub (Tier 3 Awareness) |
