---
type: moc
tags: [moc, microsoft, data, knowledge]
last_verified: 2026-04-21
---

# Data & Knowledge MOC

*Primary-Home für alle Daten-/Knowledge-Backends, mit denen Agenten geerdet werden: **Microsoft Graph** (M365-Daten-API), **Dataverse** (strukturierte Daten + MCP), **Fabric** + **OneLake** (Lakehouse), **Cosmos DB for AI** (Vektoren co-located mit App-Daten). Das RAG-Pattern-Denken lebt in der Lens-MOC [[RAG Pattern MOC]].*

---

## Zweck

Einstieg für die Frage: **„Wie kommen Daten in den Agent?"** Drei Achsen entscheiden:

1. **Strukturiert vs. unstrukturiert** — Dataverse/SQL vs. Dokumente/Chat/E-Mail
2. **M365-intern vs. App-Daten** — Graph vs. Dataverse/Cosmos
3. **Read-Pfad vs. Write-Pfad** — Retrieval für Answer vs. Tool-Call für Action

---

## Landkarte

```
┌──────────────────────────────────────────────────────────────────┐
│ STRUKTURIERT                                                     │
│   [[Dataverse]] + [[Dataverse MCP Server]]                       │
│     └─ Power Platform-Store, Limits: 15 Tables/Src, 500 KO       │
│   [[Azure Cosmos DB for AI]]                                     │
│     └─ Vector Search + App-Daten co-located                      │
├──────────────────────────────────────────────────────────────────┤
│ UNSTRUKTURIERT / DOKUMENTE                                       │
│   [[Microsoft Graph]]                                            │
│     └─ M365-Backbone: Outlook, Teams, SharePoint, OneDrive       │
│   [[Microsoft 365 Copilot Connectors]]                           │
│     └─ Graph-Connector-Ökosystem für externe Quellen            │
├──────────────────────────────────────────────────────────────────┤
│ LAKEHOUSE / BI                                                   │
│   [[Microsoft Fabric]] + [[OneLake]] + [[Fabric Data Agents]]    │
│     └─ nur bei BI/Analytics-Kunden relevant                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## Produkte in dieser MOC

| Produkt | Was es ist (1 Satz) | Watch |
|---------|---------------------|-------|
| [[Microsoft Graph]] | M365-Daten-API-Backbone (Outlook, Teams, SharePoint, OneDrive) | standard |
| [[Dataverse]] | Strukturierter Knowledge-Store (Power Platform) — Limits: 15 Tables/Source, 500 Knowledge Objects | standard |
| [[Dataverse MCP Server]] | Dataverse via MCP für Agents zugänglich | standard |
| [[Microsoft Fabric]] | Lakehouse / Data-Plattform | passive |
| [[OneLake]] | Fabric-Storage-Layer | passive |
| [[Fabric Data Agents]] | AI-gesteuerte Abfragen auf Lakehouse | passive |
| [[Azure Cosmos DB for AI]] | NoSQL + Vector-Search, Co-Location mit App-Daten | passive |

---

## Eskalationsleiter / Entscheidungslogik

| Kundensituation | Wahl | Begründung |
|-----------------|------|------------|
| „Agent soll auf SharePoint-Dokumente zugreifen" | [[Microsoft Graph]] + Copilot Connectors oder [[Azure AI Search]] | Graph für direkte M365-Zugriffe, AI Search für eigenen Index mit feinerer Kontrolle |
| „Agent braucht strukturierte Kunden-/Lead-Daten" | [[Dataverse]] + [[Dataverse MCP Server]] | Power-Platform-native, MCP-Integration für MAF |
| „Wir haben unsere App-Daten in Cosmos DB, wollen RAG on top" | [[Azure Cosmos DB for AI]] | Spart separate AI-Search-Instanz, Co-Location |
| „BI-Kunde mit Fabric-Setup will Daten-Agent" | [[Fabric Data Agents]] | Nativ im Fabric-Ökosystem |
| „Unstrukturierte Docs aus Drittsystem (z.B. Box/Drive)" | Copilot Connector oder Azure AI Search Datasource | Graph-Connector-Framework ist der Standard-Weg |

Weitere RAG-Backend-Fragen siehe [[RAG Pattern MOC]] (Lens).

---

## Querverweise zu anderen MOCs

- [[Microsoft MOC]] — Root
- [[Azure AI MOC]] — Azure AI Search als Vektor-Backbone
- [[Agents MOC]] — Dataverse MCP als Tool-Provider für MAF
- [[Copilot MOC]] — Copilot Connectors als Grounding-Weg
- [[RAG Pattern MOC]] (Lens) — „Welches RAG-Backend?"
- [[Security & Identity MOC]] — Data Residency, Purview-Klassifizierung

---

## Offizielle Sammelquellen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| MS Hub-Page | Microsoft Graph | https://learn.microsoft.com/en-us/graph/ | 2026-04-21 |
| MS Hub-Page | Dataverse | https://learn.microsoft.com/en-us/power-apps/maker/data-platform/ | 2026-04-21 |
| MS Hub-Page | Microsoft Fabric | https://learn.microsoft.com/en-us/fabric/ | 2026-04-21 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-21 | Hongyu | Initial-Erstellung der MOC |
