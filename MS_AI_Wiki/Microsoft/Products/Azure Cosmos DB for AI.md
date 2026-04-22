---
watch: passive
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Cosmos DB Vector Search, Cosmos DB AI, Cosmos DB for NoSQL Vector]
moc:
  - "[[Microsoft MOC]]"
  - "[[Data & Knowledge MOC]]"
---

# Azure Cosmos DB for AI

*Azure Cosmos DB for NoSQL mit **integriertem Vector Store** — Vektoren werden als weitere Property **co-located** mit den JSON-App-Daten gespeichert und via `VectorDistance()` direkt in der SQL-Syntax abgefragt. Alternative zu [[Azure AI Search]] für alle Fälle, in denen die Anwendungsdaten **ohnehin** in Cosmos liegen und ein separater Search-Service architektonisch unnötig wäre. DiskANN-Indexing ist GA seit Ignite 2024; Full-Text- und Hybrid-Search (RRF aus BM25 + Vector) sind seit Ende 2024 in Public Preview.*

> **Analogie:** Wie PostgreSQL mit `pgvector` — die Vector-Funktion ist ein Feature der bestehenden OLTP-Datenbank, kein separater Service. Spart Ops-Overhead und Cross-Service-Latenz, auf Kosten spezialisierter Search-Features (Semantic Ranker, komplexe Scoring-Profile).

---

## Einsatz

### Job-to-be-done

When I App-Daten bereits in Cosmos DB habe und darauf RAG oder semantische Suche brauche, I want to Vector-Search **direkt in derselben DB-Instanz** (ohne parallelen Search-Dienst), so I can Cross-Service-Konsistenz-Probleme, zusätzliche ETL-Pipelines und separate Lizenzkosten für Azure AI Search vermeide — bei akzeptabler Relevanz-Qualität.

### Trigger-Signale

- *„Unsere Produkt-/User-/Chat-Daten liegen schon in Cosmos, wir brauchen jetzt RAG."*
- *„AI Search wäre ein separater Service — können wir das in einer DB fahren?"*
- *„Wenn sich App-Daten ändern, müssen die Vektoren **sofort** mitziehen — keine Indexer-Lag-Toleranz."*
- *„Wir haben Millionen Chat-Sessions und wollen semantische History-Retrieval ohne Index-Cluster."*

### Einsatz-Szenarien

1. **E-Commerce-Produktsuche auf Cosmos-OLTP-Bestand** — Produktkatalog liegt bereits in Cosmos (Warenkorb, Session, Orders). DiskANN-Vector-Index auf dem `productDescription`-Embedding-Feld, Hybrid-Query mit `WHERE c.category = 'shoes' AND c.price < 200` + Vector-Similarity in einem Roundtrip.
2. **Chat-History-RAG für Copilot-ähnliche Agents** — Conversation-Messages leben in Cosmos, Embeddings als zusätzliches Feld pro Message. Retrieval „zeige mir ähnliche frühere Konversationen des Users X" läuft mit einer Query — keine separate Vector-DB.
3. **Realtime-RAG auf App-Daten mit hoher Change-Rate** — Wo ein AI-Search-Indexer mit 5–60 min Lag zu langsam wäre (z.B. Support-Ticket-System, Live-Inventar). Änderung am Dokument → Vektor kann im selben Transaktions-Write aktualisiert werden.

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Azure-Subscription mit Cosmos-DB-NoSQL-Account (provisioned oder serverless) |
| **Tenant / Infrastruktur** | Vector-Search-Capability muss explizit aktiviert sein (`EnableNoSQLVectorSearch`); **Shared Throughput wird nicht unterstützt** — dedicated throughput auf Container-Ebene nötig |
| **Skills / Rollen** | Cosmos-DB-Data-Engineer (Partition-Key-Design, RU-Budgetierung), App-Developer mit NoSQL-Query-Erfahrung; **kein Search-Spezialist nötig** |
| **Compliance-Rahmen** | DSGVO via Region-Pinning; Schweiz: Switzerland North + West verfügbar; EU Data Boundary ab Mai 2026 |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | ½–1 Tag, wenn Cosmos bereits produktiv läuft (Feature aktivieren, Vector-Policy definieren, Index anlegen) |
| **Laufende Lizenzkosten** | Teil der Cosmos-RU-Bill; Beispielrechnung 10 M Dokumente × 1 536 dim, 10 QPS Autoscale → ca. **USD 1.500–1.600/Monat** (Quelle: arxiv-Paper 2025); bei 100 QPS Manual ca. **USD 10.500/Monat** *(eigene Einschätzung, auf Basis der Microsoft-Research-Messungen — muss pro Kunde modelliert werden)* |
| **Laufender Betrieb** | gering: kein separater Service, Monitoring läuft über Cosmos-Diagnostics; RU-Optimierung ~2–4 h/Monat |

### Empfehlung

**Status:** 🟡 **Beobachten / selektiv empfehlen** — Für Kunden, die **bereits** Cosmos produktiv nutzen, ist die integrierte Vector-Search die naheliegende erste Wahl: kein zweiter Service, keine Sync-Pipelines, kein Consistency-Gap. Für Neukunden ohne Cosmos-Bestand ist [[Azure AI Search]] trotzdem Default, weil Hybrid-Search (BM25 + Semantic Ranker) ausgereifter und Agentic Retrieval nur dort existiert. Kurz: **„Cosmos first" wenn Daten dort sind, sonst AI Search.**

**Nächster Schritt für Journai:** Bei Bestands-Cosmos-Kunden gezielt im Discovery prüfen, ob RAG-Ambitionen existieren. Als Proof-of-Concept-Pattern Pinboard anlegen: „10 M Produkte + Chat-History, Vector-Policy mit DiskANN, Hybrid-Query mit `WHERE`-Filter". Full-Text/RRF-Preview aktuell **nicht in Prod** empfehlen.

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | **GA** seit **19.11.2024** (Ignite 2024): Vector Search + DiskANN-Index + quantizedFlat + flat. Full-Text Search (BM25) und Hybrid Search (RRF) in **Public Preview** seit Ignite 2024. |
| **GA-Datum (Detail)** | Vector Search + DiskANN GA: 19.11.2024 · Full-Text/Hybrid GA: *{TBD — noch nicht angekündigt, Stand 2026-04}* |
| **Pricing-Modell** | **Keine separate Feature-Gebühr** — Vector-Operationen werden über **Request Units (RUs)** abgerechnet wie alle Cosmos-Queries. Vector-Writes + Index-Builds verbrauchen RUs; Vector-Queries mit Index deutlich billiger als ohne. |
| **RU-Größenordnung** | Top-10-Vector-Query über 1 Mrd. Vektoren: ~1 500–3 000 RUs pro Query (Microsoft-Research-Benchmark) |
| **Beispiel-Rechnung** | 10 M Dokumente × 1 536 dim Embeddings, 10 QPS Autoscale Provisioned → **~USD 1.580/Monat**; Serverless bei gleicher Last ~**USD 11.470/Monat** (Serverless deutlich teurer bei konstanter Last!) |
| **Lizenz-Bundle** | Keines — pure Azure-Subscription-Consumption |
| **Region-Verfügbarkeit** | **Vector Search (DiskANN, quantizedFlat, flat)**: alle Cosmos-DB-Regionen inkl. **Switzerland North, Switzerland West, West Europe, Sweden Central, North Europe**. **Full-Text/Hybrid Search Preview**: eingeschränkte Regionen — *{UNCLEAR: aktueller CH-Status, bitte vor Prod-Einsatz verifizieren}* |
| **Hidden Costs** | (1) **Vector-Write-RU-Kosten** — jeder Insert/Update mit Embedding kostet deutlich mehr RUs als ein reguläres Dokument; (2) **Vector-Index-Storage** im Partition-Budget; (3) **Partitions-Skalierung** kritisch — Query-Cost wächst linear mit Partitions-Anzahl, logarithmisch mit Vektoren-pro-Partition ⇒ **wenige, volle Partitionen sind effizienter als viele kleine**. |
| **Upgrade-Pfad** | Bestands-Cosmos-Account: Feature aktivieren via `az cosmosdb update --capabilities EnableNoSQLVectorSearch` (15 min Apply-Zeit). **Einmal aktiviert, nicht deaktivierbar.** |

---

## Kernkonzept

### Was es im Kern ist

Cosmos DB for AI ist **kein neues Produkt**, sondern ein **Feature-Set** innerhalb von Azure Cosmos DB for NoSQL: Vektoren werden als JSON-Property auf einem Dokument mitgeführt, und eine **Container-Vector-Policy** erklärt der DB, welche Pfade Embeddings enthalten, welche Distanzfunktion gilt und welche Dimensionalität. Darauf definiert eine **Vector-Indexing-Policy** den konkreten Indextyp (`flat`, `quantizedFlat`, `diskANN`). Gequeried wird mit der SQL-System-Funktion `VectorDistance(path, queryVector)` — also ganz normal in der bekannten Cosmos-Query-Sprache, inklusive `WHERE`, `TOP N` und JOIN.

Das zentrale Design-Prinzip ist **Co-Location**: Microsoft argumentiert, dass eine separate Vector-DB (Pinecone, Zilliz, Weaviate) für Anwendungen, die ohnehin Cosmos für ihren operativen Zustand nutzen, drei Kosten einführt — Ops-Overhead, Sync-Lag und Consistency-Risiko. Wenn das App-Dokument und sein Embedding im selben logischen Container leben, fällt diese ganze Schicht weg. Der Trade-off: Cosmos ist primär OLTP-DB mit Vector-Fähigkeit, kein dedizierter Search-Service. **Keine BM25-basiertes Full-Text mit Semantic Ranker (wie AI Search), keine Custom-Scoring-Profile, keine Agentic Retrieval.** Microsoft füllt die BM25-Lücke gerade mit der Full-Text-Search-Preview und RRF-basiertem Hybrid-Search, aber das ist noch nicht GA (Stand 2026-04).

Zweite Wette: **DiskANN statt HNSW** (den AI Search und Pinecone nutzen). DiskANN wurde in Microsoft Research entwickelt und ist SSD-basiert statt RAM-gebunden — dadurch skaliert es auf Milliarden Vektoren pro Partition, ohne dass der RAM explodiert. Praktisch: Ein Cosmos-Partition kann Indices auf Milliarden-Vector-Skala halten, was HNSW-Implementierungen (wie in AI Search) nur mit massivem RAM-Scaling schaffen. *{Eigene Einschätzung: Für SMB-Szenarien < 10 M Vektoren ist dieser Skalierungs-Vorteil irrelevant — da zählen eher Query-Latenz und Ops-Aufwand.}*

### Wo es im Stack sitzt

| Layer | Rolle | Wer liefert das? |
|-------|-------|------------------|
| **App / API** | REST/SDK-Client ruft Cosmos-Query mit `VectorDistance()` auf | Kunde (App-Code) |
| **Query-Engine** | parst NoSQL-Query, plant Vector-Index-Scan + ggf. `WHERE`-Filter-Pushdown | Cosmos DB |
| **Vector Index** | DiskANN / quantizedFlat / flat auf dem Embedding-Feld | Cosmos DB |
| **Storage** | JSON-Dokument + Embedding als Property (float32/float16/int8/uint8) | Cosmos DB |
| **Change Feed** | triggert externe Consumer (Azure Functions, Event Hub), wenn Dokumente inkl. Embeddings geändert werden | Cosmos DB + Kunden-Pipeline |

### Kern-Fähigkeiten

#### Drei Vector-Index-Typen mit klaren Trade-offs

| Typ | Mechanik | Max. Dimensionen | Wann wählen | Grenze |
|-----|----------|-------------------|-------------|--------|
| **`flat`** | Brute-Force-kNN, volle Genauigkeit | **505** | kleine Vektor-Mengen, 100% Recall Pflicht, Debugging/Baseline | 505-Dim-Cap schließt `text-embedding-3-large` (3072) und `ada-002` (1536) aus |
| **`quantizedFlat`** | Komprimierte Brute-Force (DiskANN-Quantisierung) | **4096** | ≤ 50 000 Vektoren im Query-Scope; starke `WHERE`-Filter grenzen Menge ein | < 1 000 Vektoren ⇒ Fallback auf Full-Scan |
| **`diskANN`** | Approximate NN, SSD-basiert | **4096** | > 50 000 Vektoren, Produktions-Standard, niedrigste RU pro Query | approximate (Recall typisch 90–95%); < 1 000 Vektoren ⇒ Full-Scan |

**Wichtig fürs Beratungsgespräch:** Die 4 096-Dim-Grenze ist für alle aktuellen OpenAI-Embedding-Modelle (ada-002: 1 536, text-embedding-3-small: 1 536, text-embedding-3-large: 3 072) ausreichend. *Aber:* `flat` scheidet für alle gängigen Embeddings aus — sobald das Prod-Embedding genutzt wird, bleibt nur `quantizedFlat` oder `diskANN`.

#### Vier Distanzfunktionen + Vier Data-Types

- **Distanzen:** `cosine` (Default, −1…+1), `dotproduct` (−∞…+∞), `euclidean` (0…+∞)
- **Data-Types:** `float32` (Standard), `float16` (50% Storage-Reduktion bei kleinem Accuracy-Verlust), `int8`, `uint8`

**SMB-Empfehlung:** `float32 + cosine` als Default, `float16` nur bei knappem RU/Storage-Budget und nach A/B-Test. *(eigene Einschätzung)*

#### Hybrid Query: Vector + SQL-Filter in einem Roundtrip

Das ist der strukturelle Vorteil gegenüber dedizierten Vector-DBs:

```sql
SELECT TOP 10
  c.title,
  c.price,
  VectorDistance(c.embedding, @queryVector) AS score
FROM c
WHERE c.category = 'shoes'
  AND c.price BETWEEN 50 AND 200
  AND c.inStock = true
ORDER BY VectorDistance(c.embedding, @queryVector)
```

Pinecone et al. können zwar Metadata-Filter, aber ohne volle SQL-Semantik (Joins, Subqueries, Range-Filter). Cosmos macht das mit dem regulären Query-Optimizer. **`TOP N` ist Pflicht** — ohne Top-Limit versucht die Engine alle Vektoren zurückzugeben, was RU-Kosten explodieren lässt.

#### Change Feed → automatische Vector-Updates

Cosmos' Change-Feed-Mechanismus feuert bei Dokument-Änderungen. Typisches Pattern: Azure Function auf Change Feed → Embedding neu berechnen (Azure OpenAI) → ins Dokument zurückschreiben. **Das kann Cosmos auch selbst** — aber nur konzeptionell; Embedding-Generierung ist Kunden-Verantwortung. Abgrenzung zu AI Search: Dort macht der Indexer das beim Batch-Pull mit 5–60 min Lag; Cosmos kann unter einer Sekunde.

#### Full-Text Search mit BM25 + RRF-Hybrid (Preview)

Seit Ignite 2024 in Public Preview: `FullTextScore()` als SQL-Funktion, dazu `RRF()` (Reciprocal Rank Fusion), die BM25- und Vector-Scores fusioniert — analog zum AI-Search-Pattern. **Stand 2026-04 nicht GA**, Regional-Verfügbarkeit unvollständig. *(eigene Einschätzung: Kein Prod-Einsatz vor GA; bis dahin für Hybrid-Bedarf AI Search nutzen.)*

#### DiskANN-Skalierung: Was Microsoft bewirbt

Microsoft-Research-Paper (arxiv 2505.05885): 1 Mrd. Vektoren indexiert, **< 100 ms P95-Query-Latenz bei 90–95 % Recall**. Kosten-Behauptung: 43× günstiger als Pinecone Serverless, 12× günstiger als Zilliz Enterprise. **Achtung:** Das sind MSR-Benchmarks — in SMB-Szenarien (< 10 M Vektoren) kaum relevant, aber technisch ist die Richtung: **Cosmos skaliert linear-günstig nach oben**, während HNSW-basierte Services RAM-exponentiell teurer werden.

### Typischer Workflow

1. **Feature aktivieren** — `az cosmosdb update --capabilities EnableNoSQLVectorSearch` (einmalig, 15 min)
2. **Container-Vector-Policy definieren** — beim Container-Create: Path, Dimensions, DistanceFunction, DataType
3. **Vector-Index-Policy setzen** — `diskANN` für Prod-Standard; `quantizedFlat` wenn Scope < 50 k Vektoren
4. **Embedding-Pipeline** — App-Code oder Azure Function: Text → Azure OpenAI Embedding → Cosmos Upsert mit Embedding als Property
5. **Query** — SDK (Python/.NET/Java/Node) oder REST; `VectorDistance()` in SELECT und ORDER BY; `TOP N` Pflicht
6. **Monitor** — RU/s-Verbrauch, Query-Latenz-Perzentile, Partition-Hotspots via Cosmos Diagnostics

### Skills-Voraussetzungen

| Rolle | Was er/sie können muss |
|-------|------------------------|
| **Builder (Journai intern)** | Cosmos-DB-Grundlagen (Partition-Keys, RU-Modell), SQL-API-Queries, Python/.NET-SDK, Azure-OpenAI-Embedding-API |
| **Admin (beim Kunden)** | Azure-RBAC auf Cosmos-Account, Private-Endpoint-Setup optional |
| **End-User (beim Kunden)** | keine — Vector-Search liegt hinter der App-API |

---

## Limitierungen & Fallstricke

### Was das Produkt NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|---------------------------|
| **Kein Semantic Ranker / L2-Rerank** wie in AI Search | AI Search in hybridem Deployment nachgeschaltet, oder Reranker-Modell selbst aufrufen (Cohere Rerank, Azure OpenAI) |
| **BM25 / Full-Text / RRF noch in Preview** — kein Prod-SLA | Aktuell [[Azure AI Search]] für Hybrid-Use-Cases; auf GA warten |
| **Keine Agentic Retrieval** (Query-Planning mit LLM-Subqueries) | AI Search Agentic Retrieval (Preview) oder selbst bauen |
| **Keine built-in AI Enrichment / OCR / PII-Detection** | Azure AI Document Intelligence + eigene Pipeline vor Insert |
| **Keine Indexer-Pull-Mode** (Cosmos **ist** die Source) | Push-Model ist Design-Entscheidung — Einträge müssen von App/Function geschrieben werden |
| **Shared Throughput nicht unterstützt** für Vector | Dedicated Throughput pro Container erzwungen |
| **Vector-Policy nach Create nicht mutierbar** | Neuer Container + Daten-Migration |
| **Max 4 096 Dimensionen** | für gängige Embeddings ausreichend (text-embedding-3-large = 3 072 ✓) |

### Typische Fallstricke im Einsatz

- **Cosmos als Search-Ersatz missverstehen** — Cosmos ist OLTP-DB mit Vector-Fähigkeit, kein Search-Service. Kunden, die „AI Search ersetzen" wollen, weil es billiger klingt, enttäuschen sich bei Relevanz-Qualität ohne Semantic Ranker. *Gegenmittel: In Discovery klar abfragen „brauchen wir Hybrid mit BM25+Rerank?" — wenn ja, AI Search.*
- **RU-Budget bei Vector-Writes unterschätzen** — Ein Insert mit 1 536-dim Embedding und DiskANN-Index-Update kostet **ein Vielfaches** eines regulären Doc-Writes. Bei Batch-Ingest von 1 M Dokumenten kann das Throttling auslösen. *Gegenmittel: Ingest-Phase mit dediziertem RU-Budget planen (z.B. temporär auf Autoscale hochziehen), danach zurück.*
- **Partitions-Strategie falsch** — Query-Cost wächst **linear** mit Partitionen, aber nur **logarithmisch** mit Vektoren-pro-Partition. Ein „breit verteiltes" Schema (viele kleine Partitions) ist teurer als wenige volle. *Gegenmittel: Partition-Key so wählen, dass einzelne Partitions 1–10 M Vektoren halten.*
- **`flat`-Index in Prod** — Die 505-Dim-Grenze schließt alle üblichen OpenAI-Embeddings aus. Wer `flat` wählt, landet bei selbstgebauten kleinen Embeddings oder muss umstellen. *Gegenmittel: Default ist `diskANN` für Prod, `quantizedFlat` für < 50 k Vektoren im Scope.*
- **Full-Text-Preview in Prod ausrollen** — Limit Regional-Rollout + kein SLA. *Gegenmittel: Hybrid (BM25 + Vector) aktuell nur via AI Search produktiv.*
- **Einmal aktiviert, nicht deaktivierbar** — Wer die Vector-Search-Capability aktiviert, kann sie auf dem Account nicht mehr entfernen. Keine praktischen Auswirkungen, aber für Compliance-Teams relevant zu wissen. *Gegenmittel: bewusst in Architektur-Review entscheiden.*

---

## Abgrenzung zu [[Azure AI Search]] (SMB-Haupt-Entscheidungsfrage)

Der Decision-Baum, der im [[RAG Pattern MOC]] lebt — hier die Kurzform:

| Frage | Cosmos DB for AI | Azure AI Search |
|-------|------------------|-----------------|
| *„Liegen die App-Daten schon in Cosmos?"* | ✅ natürliche Wahl — keine Sync-Pipeline | ⚠️ erzwingt zweites System + Indexer |
| *„Brauchen wir BM25 + Semantic Ranker?"* | ❌ nur Preview (RRF), kein L2-Rerank | ✅ nativ, GA, +40% Relevanz mit Agentic Retrieval |
| *„Millisekunden-Realtime bei Daten-Changes?"* | ✅ Change Feed, Sub-Sekunden-Update | ❌ Indexer-Schedule (5–60 min) |
| *„< 10 M Dokumente, einfacher RAG-Use-Case?"* | ✅ wenn Cosmos da | ✅ wenn [[Foundry IQ]] als Convenience gewünscht |
| *„Milliarden Vektoren, Kosten-Druck?"* | ✅ DiskANN skaliert linear-günstig | ⚠️ HNSW-RAM-Kosten wachsen überlinear |
| *„Complex Custom Scoring Profiles / Synonyme?"* | ❌ nicht vorhanden | ✅ voll unterstützt |
| *„AI Enrichment (OCR, PII, Language Detection)?"* | ❌ Kunde baut vor Insert selbst | ✅ 30+ Skills, Skillset-Pipeline |
| *„Agentic Retrieval mit Query-Planning-LLM?"* | ❌ nicht vorhanden | ✅ Preview, MCP-exposed |
| *„Switzerland-North + Confidential Computing?"* | ✅ alle CH-Regionen | ✅ nur CH mit Confidential Computing |

**Häufiges Hybrid-Pattern in der Praxis:** Cosmos als operative Source-of-Truth + AI-Search-Indexer zieht daraus einen Such-Index für komplexe Relevanz-Szenarien. Das löst den Streit „entweder-oder" auf — beide Systeme haben ihren Job.

**Journai-Faustregel:**

- **Cosmos DB for AI** = *Kunde hat Cosmos bereits, RAG ist ein Feature der App, Realtime-Updates wichtig, Qualität „gut genug"*
- **Azure AI Search** = *Dedizierter Such-/RAG-Service, Hybrid mit Semantic Ranker, komplexe Scoring-Profile, Agentic Retrieval, Enterprise-Scale*

---

## Offizielle Referenzen & Monitoring

### Primary (Microsoft offiziell)

| Typ | Quelle | Link | Zuletzt gesichtet | Monitoring-Zweck |
|-----|--------|------|-------------------|------------------|
| Docs | Integrated Vector Store | https://learn.microsoft.com/en-us/azure/cosmos-db/vector-search | 2026-04-22 | Feature-Updates, Index-Typen |
| Docs | Vector Search in Cosmos DB for NoSQL | https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/vector-search | 2026-04-22 | Technische Details, Limits |
| Docs | Vector Database Overview | https://learn.microsoft.com/en-us/azure/cosmos-db/vector-database | 2026-04-22 | Konzeptueller Überblick |
| Docs | Pricing Model | https://learn.microsoft.com/en-us/azure/cosmos-db/how-pricing-works | 2026-04-22 | RU-Pricing-Logik |
| Docs | Gen-AI Vector Search | https://learn.microsoft.com/en-us/azure/cosmos-db/gen-ai/vector-search-overview | 2026-04-22 | AI-Overlay-Patterns |
| Product Page | Cosmos DB | https://azure.microsoft.com/en-us/products/cosmos-db | 2026-04-22 | Positionierung, Roadmap |
| Pricing | Autoscale Provisioned | https://azure.microsoft.com/en-us/pricing/details/cosmos-db/autoscale-provisioned/ | 2026-04-22 | RU/s-Preis pro Region |
| Tech Blog | Full-Text + Hybrid Search Announcement (Ignite 2024) | https://devblogs.microsoft.com/cosmosdb/new-vector-search-full-text-search-and-hybrid-search-features-in-azure-cosmos-db-for-nosql/ | 2026-04-22 | GA-Dates, RRF-Syntax |
| Tech Blog | DiskANN scaling to 1B vectors | https://devblogs.microsoft.com/cosmosdb/azure-cosmos-db-with-diskann-part-2-scaling-to-1-billion-vectors-with/ | 2026-04-22 | Performance-Benchmarks |
| Research Paper | Cost-Effective Low-Latency Vector Search | https://arxiv.org/pdf/2505.05885 | 2026-04-22 | MSR-Benchmarks, Cost-Vergleiche |

### Secondary (Analysten & Industrie)

| Quelle | Link | Zuletzt gesichtet | Einschätzung |
|--------|------|-------------------|--------------|
| Visual Studio Magazine — Ignite 2025 Cosmos-AI-Update | https://visualstudiomagazine.com/articles/2025/11/19/azure-cosmos-db-adds-new-ai-search-and-agentic-capabilities-at-ignite.aspx | 2026-04-22 | *{FETCH-Blocker 403 — manuell prüfen}* |
| Signisys — Cosmos DB 2026 Guide | https://www.signisys.com/azure-cosmos-db/ | 2026-04-22 | Konsolidierte 2026er Sicht |

### Events zum Beobachten

| Event | Datum | Erwartete Ankündigungen |
|-------|-------|-------------------------|
| Microsoft Build 2026 | Mai 2026 | Full-Text-Search GA, Agentic Features in Cosmos |
| Microsoft Ignite 2026 | Nov 2026 | Hybrid-Search GA, evtl. MCP-Server-Exposition analog AI Search |

---

## UNCLEAR / TODO

1. **Full-Text-Search / Hybrid-RRF GA-Datum** — aktuell Preview seit 2024-11; kein offizielles GA-Target kommuniziert
2. **Regional-Verfügbarkeit der Preview-Features in CH** — Switzerland North/West Status für Full-Text/Hybrid unklar
3. **EU-Data-Boundary-Zertifizierung** für Vector-Features (analog AI Search): Status ab Mai 2026 prüfen
4. **Konkrete USD/RU-Kosten pro Region CH** — Pricing-Page via Azure Calculator pro Kunde durchrechnen

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive Cosmos DB for AI: DiskANN-Index, Pricing-Modell, Abgrenzung zu Azure AI Search, SMB-Use-Cases | https://learn.microsoft.com/en-us/azure/cosmos-db/vector-search |
| 2026-04-22 | Hongyu | Initial Stub (Tier 3 Awareness) | Arbeitsauftrag |
