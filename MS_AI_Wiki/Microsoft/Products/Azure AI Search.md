---
watch: close
status: ga
last_verified: 2026-04-21
aliases: [Cognitive Search, Azure Cognitive Search]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Azure AI Search

*Microsoft's Search-Service und **RAG-/Vektor-Backbone** für fast jeden Agent mit Knowledge Base. Liefert Hybrid-Search (Keyword + Vector + Semantic) und ist die technische Basis von [[Foundry IQ]]. Unentbehrlich für SMB-Knowledge-Szenarien.*

> **Analogie:** Elasticsearch oder Algolia, aber nativ in Azure mit Vector-Search + Semantic Ranking vorgebaut.

---

## Einsatz

**JTBD:** When I einen Agent auf unternehmenseigene Dokumente erden will, I want to einen Search-Index, der sowohl Keyword- als auch semantische Suche kann, plus sauberen Indexer für meine Daten (Blob, SharePoint, SQL), so I can schnell zu einem RAG-Prototyp komme.

**Trigger-Signale:**
- „Copilot beantwortet unsere internen Fragen falsch — können wir das Grounding verbessern?"
- „Wir wollen einen Chatbot, der unser Confluence kennt."

**Szenarien:** (1) RAG-Backbone für MAF-Agent, (2) Copilot-Grounding-Ziel via Connector, (3) Basis von [[Foundry IQ]].

**Empfehlung:** 🟢 **Empfehlen** als Standard-RAG-Backend. Wenn Convenience wichtiger als Kontrolle → [[Foundry IQ]] drüber. Wenn App-Daten schon in Cosmos → [[Azure Cosmos DB for AI]].

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Status** | GA (seit 2016, kontinuierlich erweitert) |
| **Rebranding** | Cognitive Search → Azure AI Search (2024) |
| **Pricing** | Search-Unit-basiert, Tiers: Free / Basic / Standard S1–S3 / Storage Optimized |
| **Region** | Global, alle EU-Regionen verfügbar |
| **Hidden Costs** | *{TODO: Semantic Ranker als separates Pricing-Modul recherchieren}* |

---

## Kernkonzept

### Was es im Kern ist

Azure AI Search ist ein **vollständiger Search-Service** mit Index, Indexer, Skillset und Query-API. Die Unterscheidung zu reinen Vector-DBs (Pinecone, Weaviate): Azure AI Search macht **Hybrid-Search nativ** — Keyword (BM25) + Vector (HNSW) + Semantic Ranker in einer Query.

**Indexer**-Komponente zieht Daten automatisch aus Blob Storage, SharePoint, SQL, Cosmos DB. **Skillsets** chunken, extrahieren (Document Intelligence), embedden (Azure OpenAI) in der Indexing-Pipeline.

### Kern-Fähigkeiten

1. **Hybrid-Search (BM25 + Vector + Semantic)** — nativ, keine DIY-Orchestrierung
2. **Vector-Search mit HNSW** — gängige Embedding-Größen unterstützt
3. **Semantic Ranker** — MS-Reranker-Modell, liftet Relevanz-Qualität sichtbar *{TODO: Pricing-Impact verifizieren}*
4. **Indexer + Skillsets** — Batch-Pipeline von Datenquelle zu durchsuchbarem Index
5. **AI Enrichment** — OCR, Image Analysis, Entity Extraction als Teil der Pipeline

### Typischer Workflow

1. Index-Schema definieren (Felder + Vector-Konfiguration)
2. Indexer + Skillset anlegen (Datenquelle → Verarbeitung → Index)
3. Query-API nutzen (MAF-Tool oder direkt via REST/SDK)
4. Monitoring über Analytics

---

## Limitierungen & Fallstricke

- **Chunking-Strategie ist Eigenverantwortung** — Skillsets geben Default, aber gute Qualität braucht Tuning. *Gegenmittel: Chunking-Experimentier-Phase einplanen.*
- **Keine native PII-Redaction** — vor Indexierung bereinigen oder mit Foundry Tools Integration Language Service nutzen.
- **Semantic Ranker ist nicht kostenlos** — *{TODO: klären}*

---

## Offizielle Referenzen & Monitoring

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Product Page | Azure AI Search | https://azure.microsoft.com/en-us/products/ai-services/ai-search | 2026-04-21 |
| Docs | AI Search Docs | https://learn.microsoft.com/en-us/azure/search/ | 2026-04-21 |
| Quickstart | RAG Quickstart | https://learn.microsoft.com/en-us/azure/search/search-get-started-rag | 2026-04-21 |
| Pricing | AI Search Pricing | https://azure.microsoft.com/en-us/pricing/details/search/ | 2026-04-21 |
| Tech Blog | Azure AI Search Blog | https://techcommunity.microsoft.com/category/azure | 2026-04-21 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-21 | Hongyu | Initial Stub |
