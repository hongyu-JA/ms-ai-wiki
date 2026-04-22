---
watch: passive
status: ga
last_verified: 2026-04-22
aliases: [Fabric, OneLake, Fabric Data Agents]
moc:
  - "[[Microsoft MOC]]"
  - "[[Data & Knowledge MOC]]"
---

# Microsoft Fabric

*Microsoft's **Lakehouse-Plattform** — OneLake als unified Storage (OneDrive-für-Daten), Data Engineering / BI / Real-Time / Data Science in einem SaaS-Paket. **Fabric Data Agents** bringen AI-gestützte Abfragen auf Lakehouse-Daten. Für uns **nur relevant bei BI-/Analytics-Kunden** — nicht Standard-SMB-Agent-Use-Case.*

> **Analogie:** Wie Databricks + Snowflake + Power BI + Azure Synapse in einem SKU zusammengelegt — Microsofts Antwort auf die Lakehouse-Konsolidierung des Marktes.

---

## Einsatz

**JTBD:** When I Lakehouse-basierte BI-Workloads habe (Datenmengen > Tabellenkalk, nicht transaktional), I want to eine integrierte Plattform für Ingest/Transform/Analyze/Visualize + AI-Agents ohne separate Services, so I can Daten-Silos zwischen Analytics und AI vermeide.

**Trigger-Signale:**
- „Wir haben Fabric/OneLake und fragen uns, ob Data Agents uns was bringen."
- „BI-Analysten wollen einen Chat-Agent auf unser Lakehouse."
- „Wir migrieren von Power BI + Synapse auf Fabric — was ändert sich?"

**Szenarien:** (1) Natural-Language-Abfragen auf Lakehouse (Fabric Data Agent), (2) OneLake-Daten als Quelle für andere Agents via Shortcut, (3) Real-Time-Dashboards mit AI-generierten Insights.

**Empfehlung:** 🔴 **Nicht aktiv pitchen** bei SMB — nur Awareness für BI-Kunden-Kontext.

---

## Status & Pricing

- **Status:** GA. Fabric Data Agents GA 2025/Q4
- **Pricing:** Capacity Units (F-SKUs), ab F2 (~$262/Monat) bis F2048. Skaliert mit gesamtem Workload, nicht per Service
- **Region:** Global, mit Regional Capacity-Pools

---

## Kernkonzept

Fabric besteht aus mehreren **Workloads** auf einem gemeinsamen Storage-Layer (OneLake):

1. **OneLake** — einheitlicher Data-Lake-Storage (Delta Lake-Format), tenant-weit
2. **Data Engineering** — Spark-basiert
3. **Data Warehouse** — T-SQL
4. **Real-Time Intelligence** — KQL / Eventstream
5. **Data Science** — Notebooks + AutoML
6. **Power BI** — Visualisierung
7. **Data Factory** — Pipelines / ETL
8. **Fabric Data Agents** — Natural Language auf Lakehouse

### OneLake — das „OneDrive für Daten"

Single-Source-of-Truth pro Tenant. Shortcuts statt Kopien — verweisen auf Daten in anderen Clouds (AWS S3, ADLS). Keine Duplikation.

### Fabric Data Agents

Kann LLM-Anfragen auf Lakehouse-Daten mappen — generiert SQL/KQL, führt gegen OneLake aus, formatiert Antwort. Nutzt Azure OpenAI im Hintergrund.

---

## Limitierungen & Fallstricke

- **Capacity-Pricing komplex** — F-SKU kaufen ≠ Kosten-Garantie; Overage-Risk bei Spike-Loads
- **Nicht transaktional** — OneLake ist Analytics-optimiert (Parquet/Delta), nicht OLTP
- **EU-Data-Residency**: OneLake folgt Tenant-Region, aber Fabric-Services haben eigene Regional-Subsets — prüfen

### Fallstricke

- **Fabric als OLTP-Ersatz sehen** — ist es nicht. *Gegenmittel: Transaktionale App-Daten in Cosmos/SQL, Fabric für Analytics.*
- **Fabric Data Agent als Copilot-Ersatz** — verschiedene Layer. *Gegenmittel: Copilot für M365-/Agent-Workflows, Fabric Data Agent für BI-Fragen.*

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Microsoft Fabric Overview | https://learn.microsoft.com/en-us/fabric/ | 2026-04-22 |
| Docs | OneLake | https://learn.microsoft.com/en-us/fabric/onelake/ | 2026-04-22 |
| Docs | Fabric Data Agents | https://learn.microsoft.com/en-us/fabric/data-agents/ | 2026-04-22 |
| Blog | Fabric Blog | https://blog.fabric.microsoft.com/ | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub (Tier 3 Awareness — bündelt OneLake + Fabric Data Agents) |
