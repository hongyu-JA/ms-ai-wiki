---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [Cognitive Search, Azure Cognitive Search]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Azure AI Search

*Microsoft's Search-Service und **RAG-/Vektor-Backbone** für praktisch jeden Azure-Agent mit Knowledge-Base. Basis von [[Foundry IQ]]. Hybrid-Search (BM25 + Vector + Semantic Ranker via RRF). 2025/2026-Neuerungen: **Agentic Retrieval** (Knowledge Bases als MCP-exposed First-Class-Objekte, +40% Relevanz) und **Entra-based Document-Level Security** (GA seit 2025 für ADLS Gen2 + Blob). **Switzerland North mit Confidential Computing** — ideal für CH-regulierte Branchen.*

> **Analogie:** Elasticsearch oder Algolia, aber nativ in Azure mit Vector-Search + Semantic Ranker + MCP-Server-Exposition out-of-the-box.

---

## Einsatz

### Job-to-be-done

When I einen Agent mit Knowledge-Base baue, I want to ein produktives RAG-/Vector-Backend mit Hybrid-Search + Entra-DLS + CH-Residenz, so I can ohne eigenen Search-Stack valide Retrievals mit Re-Ranking liefern.

### Trigger-Signale

- „Copilot Studio Knowledge reicht uns nicht — wir brauchen einen Custom-Index."
- „Agentic Retrieval für komplexe Multi-Hop-Queries."
- „DSGVO: Daten müssen in der Schweiz bleiben, Index inklusive."

### Einsatz-Szenarien

1. **Custom-Index für MAF-Agent** — Firmenwissen (PDFs, SPO, Dataverse) in Switzerland North, Hybrid Search + Semantic Ranker, MCP-exponiert für MAF/Foundry.
2. **Backend für [[Foundry IQ]]** — wenn Custom-Scoring / Synonym-Maps / Entra-DLS nötig sind, direkt auf AI Search statt über den IQ-Wrapper.
3. **Entra Document-Level Security** — Agent darf nur das retrieven, was der anfragende User sehen darf (ab ADLS Gen2 + Blob GA 2025).

### Voraussetzungen beim Kunden

| Voraussetzung | Details |
|---------------|---------|
| **Lizenz-Baseline** | Azure-Subscription mit AI-Search-Kontingent |
| **Tenant / Infrastruktur** | Basic- oder Standard-Tier in Switzerland North (Confidential Computing) |
| **Skills / Rollen** | Azure-Architekt für Index-Design, Data-Engineer für Ingest-Pipeline |
| **Compliance-Rahmen** | Entra-RBAC konfiguriert für DLS, ggf. Private Endpoints |

### Aufwand & Kosten (Journai-Schätzung)

| Dimension | Größenordnung |
|-----------|---------------|
| **Setup / Einführung** | ½–2 Tage für ersten produktiven Index |
| **Laufende Lizenzkosten** | ab ~€75/Monat (Basic); Standard-Tiers ab ~€230/Monat |
| **Laufender Betrieb** | gering; Re-Indexing + Monitoring ~2h/Monat |

### Empfehlung

**Status:** 🟢 — Default-Wahl für jeden Azure-Agent mit Knowledge-Base. CH-verfügbar, Entra-DLS GA, Agentic Retrieval bringt messbar +40 % Relevanz.

**Nächster Schritt für Journai:** PoC in Switzerland North mit Agentic Retrieval + Entra-DLS bei einem ausgewählten SMB-Kunden als Referenzfall.

---

## Pricing-Matrix (April 2026)

| Tier | Storage / Partition | Max SU | USD / SU / Monat | Notiz |
|------|---------------------|--------|-------------------|-------|
| **Free** | 50 MB (shared) | — | $0 | kein SLA, kann bei Inaktivität gelöscht werden |
| **Basic** | 15 GB (neu) | 9 SU | ~$73 | **100 Felder-Cap** (≠ 1000 wie andere Tiers!) |
| Standard S1 | 160 GB | 36 SU | ~$245 | |
| Standard S2 | 512 GB | 36 SU | ~$981 | |
| Standard S3 | 1 TB | 36 SU | ~$1.962 | |
| S3 HD | 1 TB, Multi-Tenant | 36 SU | ~ S3 | ❌ **kein Indexer** — push-only |
| Storage Optimized L1 | 2 TB | 36 SU | ~$2.900 *{UNCLEAR}* | |
| Storage Optimized L2 | 4 TB | 36 SU | ~$5.800 *{UNCLEAR}* | |

### ⚠️ Realistische Produktions-Rechnung

1 SU = 1 Replica ODER 1 Partition. Produktiv mit SLA brauchst du **min. 2 Replicas** (Query-SLA) oder **3 Replicas** (Query+Index-SLA). **Basic-Produktions-Minimum realistisch ~$220/Monat** (nicht $73).

### Semantic Ranker — separates Pricing-Modul

- **Free-Plan**: 1.000 Semantic-Queries/Monat gratis (alle billable Tiers)
- **Standard-Plan**: erste 1.000 gratis, danach metered pro 1.000 Queries
- *{UNCLEAR: exakter Preis — historisch ~$1 pro 1.000 Queries, bitte auf Pricing-Page verifizieren}*

### Vector-Index

- **Keine separate Gebühr** — läuft aus Partitions-Storage + RAM des Tiers
- **Aber:** HNSW-Index muss komplett im RAM leben → mehr Partitionen = mehr RAM = teurer

### Switzerland North — Besonderheit für CH-Kunden

- Verfügbar (Switzerland West auch)
- **Confidential Computing** verfügbar → für regulierte Branchen (Pharma, Finanz, Health) der Default

### Agentic Retrieval — LLM-Kosten

Knowledge-Base-Planungsschritt ruft ein LLM (GPT-4o / GPT-4.1 / GPT-5). **LLM-Kosten laufen separat über Azure OpenAI / Foundry Models**, nicht über AI-Search-Billing.

---

## Kern-Fähigkeiten

### Hybrid Search — so funktioniert RRF

```
┌─────────────────────────────────────────────────────────────────┐
│ Query kommt rein                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           ▼                  ▼                  ▼
  ┌─────────────┐    ┌─────────────┐   ┌──────────────┐
  │ BM25        │    │ Vector      │   │ (optional)    │
  │ (Keyword)   │    │ (HNSW /     │   │ Semantic      │
  │ Ranking     │    │ exhaustive  │   │ Ranker        │
  │             │    │ kNN)        │   │ L2-Rerank     │
  │ bis 1000    │    │ beliebig    │   │ Top-50 RRF    │
  │ Treffer     │    │ Vektoren    │   │ → Cross-      │
  │             │    │             │   │ Encoder       │
  └─────────────┘    └─────────────┘   └──────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
              ┌────────────────────────────┐
              │ RRF (Reciprocal Rank       │
              │ Fusion):                   │
              │ score = 1 / (rank + k)     │
              │ k = 60 (Default)           │
              └────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────────┐
              │ Top-N Ergebnisse           │
              └────────────────────────────┘
```

**Vector-Weighting**: `0.5` halbiert Vector-Gewicht, `2.0` verdoppelt.

### Vector Search Spezifika

- **Max Dimensions**: 4.096 pro Vector-Feld (alle Tiers)
- **HNSW-Parameter**: `m` (4–10, Default 4), `efConstruction` (100–1000, Default 400), `efSearch` (100–1000, Default 500)
- **Alternative**: exhaustive kNN (kein Index, brute force)
- **Truncate Dimensions** unterstützt (z.B. text-embedding-3-large 3.072 → 1.024)
- **HNSW-Zwang**: muss komplett im RAM liegen

### Agentic Retrieval (2025/2026, NEU!)

**Public Preview** mit API `2025-11-01-preview`. Knowledge Base ist **erst-klass Objekt**.

```
┌────────────────────────────────────────────────────────────────┐
│ Agentic Retrieval Pipeline                                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ 1. Query Planning (LLM zerlegt Frage in Subqueries)           │
│    Planning-LLM: gpt-4o / gpt-4.1 / gpt-5                     │
│                                                                │
│ 2. Parallel Execution: Hybrid Search + Semantic Rerank        │
│    pro Subquery                                                │
│                                                                │
│ 3. Merged Ergebnis an den Agent                                │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│ MS-Claim: Relevance-Uplift bis zu +40% vs. klassisches RAG     │
└────────────────────────────────────────────────────────────────┘
```

**MCP-Exposure**: Jede Knowledge Base ist ein **Standalone-MCP-Server**. Endpoint-Pattern:

```
{search}/knowledgebases/{kb}/mcp?api-version=2025-11-01-preview
```

Einziges exposed Tool: `knowledge_base_retrieve`. Konsumierbar von [[Foundry Agent Service]], [[Microsoft Agent Framework]], GitHub Copilot, Claude, Cursor.

**Reasoning Effort Levels**: `minimal` / `low` / `medium` — beeinflusst LLM-Kosten + Anzahl erlaubter Knowledge Sources (low=3, medium=5).

### Indexer + Skillset + AI Enrichment

**Offiziell unterstützte Indexers (pull-mode)**:
- Azure Blob Storage, ADLS Gen2
- Azure SQL Database, MySQL, PostgreSQL (Preview)
- Azure Cosmos DB (NoSQL, MongoDB, Gremlin)
- Azure Table Storage
- **SharePoint in M365** (nur Online, nicht on-prem; Entra-App + pro-Site-Konfig)
- **Microsoft OneLake / Fabric** (GA 2024)

Alles andere → **Push-API** (REST/SDK) oder **Custom Web API Skill**.

**Built-in Skills**: OCR (Druck + Handschrift), Image Analysis, Entity Recognition, Entity Linking, Key Phrase, Language Detection, Sentiment, **PII Detection**, Translation, **Text Split** (Chunking), **Azure OpenAI Embedding Skill** (Integrated Vectorization), Azure Vision Multimodal Embeddings, Custom Skill.

**Max 30 Skills pro Skillset**, Max 2h Laufzeit (public) / 24h (private env).

---

## [[Foundry IQ]] vs. Azure AI Search (direkt) — Decision-Matrix

**Wichtig**: Foundry IQ ist **KEIN** Konkurrent zu Azure AI Search — es **baut AUF** Azure AI Search auf als Convenience-Layer.

```
                 Use-Case
                    │
                    ▼
       ┌───────────────────────────┐
       │ Single Knowledge Base,    │
       │ ein Agent, schnell fertig │
       └───────────────────────────┘
              JA ▼          NEIN ▼
    ┌─────────────────┐  ┌──────────────────────────┐
    │ 🟢 [[Foundry IQ]]│  │ Multi-Source Federation? │
    │   Convenience   │  │ Custom Scoring Profiles? │
    │   Portal-UI     │  │ Enterprise-Scale?        │
    └─────────────────┘  └──────────────────────────┘
                                 JA ▼
                        ┌─────────────────────┐
                        │ 🟢 Azure AI Search   │
                        │    direkt            │
                        │    (voll Control)    │
                        └─────────────────────┘
```

**Journai-Faustregel:**
- **AI Search direkt** = Kunde ist Azure-Power-User, komplexes Schema / Custom Skills / Latenz-/Kosten-Tuning
- **[[Foundry IQ]]** = „AI-Assistent auf SharePoint + Blob + Web in 2 Wochen"

Volle Decision-Matrix siehe [[RAG Pattern MOC]].

### Cosmos DB Vector Search — wann stattdessen?

**[[Azure Cosmos DB for AI]]** = wenn Daten **sowieso** operativ in Cosmos UND Vektoren **häufig** ändern (real-time updates).

**Azure AI Search** = wenn Hybrid (BM25 + Vector), Semantic Rerank, AI Enrichment oder unstrukturierte Dokumente.

**Häufiges Pattern**: Cosmos operativ + AI-Search-Indexer darauf.

---

## Hard Limits pro Tier (Auswahl)

| Limit | Free | Basic | S1 | S2 | S3 | S3 HD | L1 | L2 |
|-------|------|-------|-----|-----|-----|-------|-----|-----|
| Max Indexes | 3 | 5 / 15 | 50 | 200 | 200 | 3000 total | 10 | 10 |
| **Max Felder pro Index** | 1000 | **100** | 1000 | 1000 | 1000 | 1000 | 1000 | 1000 |
| Max Vector-Dims / Feld | 4096 | 4096 | 4096 | 4096 | 4096 | 4096 | 4096 | 4096 |
| Vector-Quota / Partition (GB) | — | 5 | 35 | 150 | 300 | 300 | 150 | 300 |
| Max Doc-Size | 16 MB | 16 MB | 16 MB | 16 MB | 16 MB | 16 MB | 16 MB | 16 MB |
| Blob Indexer max Size | 16 MB | 16 MB | 128 MB | 256 MB | 256 MB | — | 256 MB | 256 MB |
| Knowledge Bases / Service | 3 | 5 / 15 | 50 | 200 | 200 | 0 | 10 | 10 |

### Konzeptionelle Grenzen

- **Chunking ist Ownership des Kunden** — außer Text-Split-Skill oder Integrated Vectorization mit Azure OpenAI Embedding Skill
- **S3 HD unterstützt KEINE Indexer** — push-only (Multi-Tenant-Szenarien)
- **HNSW Vector-Index lebt permanent im RAM** → Partitionen skalieren = RAM skalieren = teuer
- **Max 10 Vector-Felder pro Query**, max 3000 Search-Clauses, max 32.766 Bytes Such-Term
- **Semantic Ranker Throttle**: 2–4 concurrent requests pro SU

---

## Security & Compliance

### Document-Level Access Control — GA 2025

```
┌─────────────────────────────────────────────────────────────────┐
│ Entra-ID-basierte ACL-Inheritance für ADLS Gen2 + Blob         │
├─────────────────────────────────────────────────────────────────┤
│ Query-Zeit-Enforcement via                                     │
│ `x-ms-query-source-authorization` Header                       │
│ mit User/Group-Token                                            │
└─────────────────────────────────────────────────────────────────┘
```

**Security Filter Pattern (klassisch)**: für alle anderen Quellen — Groups/Principals in Feld indexieren, am Query filtern.

**RBAC-Rollen**: Search Index Data Reader / Contributor / Search Service Contributor.

### Private Endpoints + VNet

- Verfügbar **ab Basic Tier** (nicht Free, nicht S3 HD)
- Max PEs: Basic 10/30, S1 100, S2/S3 400, L1/L2 20
- Shared Private Link Resources für Indexer-Zugriff auf VNet-isolierte Quellen

### Encryption

- Default: AES-256 at Rest, service-managed key
- **Customer-Managed Keys (CMK)** via Azure Key Vault → Double-Encryption
- **NEU 2026**: Service-Level CMK ab API `2026-03-01-preview`

### EU Data Boundary

- Respektiert **Geo-Boundary** — Daten bleiben im gewählten Geo
- **Switzerland Geo = EFTA**, Teil von EU-Data-Boundary-Scope ab 2026-05-01
- Achtung: einige Foundry-Tools-abhängige Skills können cross-region gehen — im Skillset explizit EU-Region wählen
- *{UNCLEAR: ob alle Agentic-Retrieval-Preview-Features bereits EU-Data-Boundary-zertifiziert sind}*

---

## Typischer SMB-Workflow

1. Index-Schema definieren (Felder + Vector-Config HNSW)
2. Integrated Vectorization: Azure OpenAI Embedding Skill + Text-Split-Skill
3. Indexer + Schedule: Data Source → Skillset → Index (5–60 Min)
4. Query-Client: REST (`/search` POST) oder `azure-search-documents` Python/.NET SDK; `query_type="semantic"`, `hybrid_search` mit Vector + Text
5. Integration: als **MAF-Tool** / **[[Foundry IQ]] Knowledge Base** / **MCP-Server**

---

## Limitierungen & Fallstricke

| Limitierung | Alternative |
|-------------|-------------|
| **Chunking-Strategie ist Eigenverantwortung** | Text-Split-Skill als Default, Tuning-Phase einplanen |
| **Keine native PII-Redaction** | vor Indexierung bereinigen oder Foundry Tools Language Service |
| **Semantic Ranker nicht kostenlos** über 1000 queries/month hinaus | metered |
| **Basic-Tier 100-Felder-Cap** | S1 ab, alle haben 1000 |
| **Agentic Retrieval in Preview** | für Prod auf GA warten |

### Fallstricke

- **Chunking übersehen** → schlechte Retrieval-Qualität. *Gegenmittel: Chunking-Experimentier-Phase einplanen.*
- **Vector-Index-RAM-Kosten** unterschätzt → unerwartete Partitionen-Skalierung
- **Preview-APIs in Prod nutzen** (Agentic Retrieval) ohne SLA → Risiko

---

## Offizielle Referenzen & Monitoring

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Azure AI Search Intro | https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search | 2026-04-22 |
| Pricing | | https://azure.microsoft.com/en-us/pricing/details/search/ | 2026-04-22 |
| Service Limits | updated 26.01.2026 | https://learn.microsoft.com/en-us/azure/search/search-limits-quotas-capacity | 2026-04-22 |
| Hybrid Search | RRF Mechanik | https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking | 2026-04-22 |
| Vector Search | Index Size / HNSW | https://learn.microsoft.com/en-us/azure/search/vector-search-index-size | 2026-04-22 |
| Semantic Ranker | Overview | https://learn.microsoft.com/en-us/azure/search/semantic-search-overview | 2026-04-22 |
| Indexer Overview | | https://learn.microsoft.com/en-us/azure/search/search-indexer-overview | 2026-04-22 |
| Data Sources Gallery | | https://learn.microsoft.com/en-us/azure/search/search-data-sources-gallery | 2026-04-22 |
| Skills Reference | | https://learn.microsoft.com/en-us/azure/search/cognitive-search-predefined-skills | 2026-04-22 |
| Document-Level Access | GA Feature | https://learn.microsoft.com/en-us/azure/search/search-document-level-access-overview | 2026-04-22 |
| Query-Time RBAC | Enforcement | https://learn.microsoft.com/en-us/azure/search/search-query-access-control-rbac-enforcement | 2026-04-22 |
| CMK Config | | https://learn.microsoft.com/en-us/azure/search/search-security-manage-encryption-keys | 2026-04-22 |
| Region Support | inkl. Switzerland | https://learn.microsoft.com/en-us/azure/search/search-region-support | 2026-04-22 |
| **Agentic Retrieval** | NEW | https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-overview | 2026-04-22 |
| Agentic Retrieval How-to | Create KB | https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-how-to-create-knowledge-base | 2026-04-22 |
| Tech Blog | Entra Doc-Level-Security GA | https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/announcing-enterprise-grade-microsoft-entra-based-document-level-security-in-azu/4418584 | 2026-04-22 |
| Tech Blog | OneLake Integration GA | https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/azure-ai-search-integration-with-microsoft-onelake-now-generally-available/4136672 | 2026-04-22 |
| InfoQ | Agentic Retrieval Preview | https://www.infoq.com/news/2025/05/azure-ai-search-agent-retrieval/ | 2026-04-22 |
| MS Switzerland | Digital Sovereignty | https://news.microsoft.com/source/emea/2026/02/how-microsoft-is-addressing-digital-sovereignty-in-switzerland/ | 2026-04-22 |

---

## UNCLEAR

1. Exakter Semantic-Ranker-Preis ab 1000 Queries
2. L1/L2 USD-Preise (nicht direkt in Pricing-Page zugänglich)
3. Agentic Retrieval GA-Datum / Roadmap
4. EU-Data-Boundary-Zertifizierung für Agentic-Retrieval-Preview-Features

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | **Agentic Retrieval** als First-Class-Feature (MCP-exposed, +40% relevance), **Entra Doc-Level Security GA 2025**, Hybrid-Search-Flow-Diagramm mit RRF, Hard-Limits-Matrix (Basic 100-Felder-Cap!), CH-Confidential-Computing-Highlight, IQ-vs-Direct-Decision-Matrix, 19 Primary-Quellen | Learn Docs + TechCommunity + InfoQ |
| 2026-04-22 | Hongyu | Initial Stub | Arbeitsauftrag |
