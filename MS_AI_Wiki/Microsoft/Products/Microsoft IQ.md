---
watch: open
status: stub_build_2026
last_verified: 2026-06-03
source: build-2026-keynote
aliases:
  - Microsoft IQ Suite
  - MS IQ
  - IQ Familie
moc:
  - '[[Microsoft MOC]]'
  - '[[Data & Knowledge MOC]]'
zuletzt_gesichtet: 2026-06-03
updated: 2026-06-03
---

# Microsoft IQ

*Auf Build 2026 zur Marken-Familie ausgebaut — IQ-Services bieten kuratiertes, regelkonformes Kontextwissen für Agenten. Vier Hauptbestandteile: Foundry IQ, Work IQ, Fabric IQ, Web IQ.*

> **Analogie:** Wenn Foundry Models das "Gehirn" und Foundry Agent Service der "Körper" eines Agenten sind, dann ist Microsoft IQ die "Bibliothek mit Sicherheits-Aufseher" — der Zugriff auf richtige, autorisierte, aktuelle Daten.

---

## Die vier IQ-Bausteine

| IQ-Service | Datenbereich | Status |
|---|---|---|
| **[[Foundry IQ]]** | Enterprise-Knowledge in Azure AI Search (Wrapper) | GA (bestand schon, Build-Update: jetzt vollständig GA) |
| **[[Work IQ]]** | M365 Kontext: Personen, Meetings, Files, Chats, Workflows | GA (neu auf Build 2026) |
| **[[Fabric IQ]]** | Business-Daten und Ontologie-Reasoning aus Microsoft Fabric | GA (neu auf Build 2026) |
| **[[Web IQ]]** | Internet-Grounding, MCP-nativ | GA (neu auf Build 2026) |

## Was unterscheidet "IQ" von rohem Datenzugriff?

Microsoft IQ-Services sind **kuratierte** Grounding-Schichten — sie bringen drei Mehrwerte über reinen API-Zugriff hinaus:

1. **Berechtigungs-Respekt:** ACL-Trimming auf Item-Ebene (User sieht nur, was er darf)
2. **Aktualitäts-Garantie:** automatische Re-Indexierung, Frische-Tracking
3. **Compliance-Hooks:** Audit-Logging, Sensitivity-Labels, Purview-Integration

## Wo passen sie in die Architektur?

- **Layer:** KNOWLEDGE
- **Verbindungen:**
  - `grounds-on` ← MAF, Copilot Studio, M365 Copilot
  - `calls` → Foundry Models (für Embeddings, Re-Ranking)
  - `secured-by` → Microsoft Purview (Sensitivity-Labels, DLP)

## Beratungs-Relevanz für Journai

**Hoch — vereinheitlicht unsere "wie groundet der Agent?"-Erklärung.**

Bisher mussten wir Kunden erklären, dass es viele Knowledge-Quellen gibt (Search, Graph, Connectors, Dataverse) und der Architekt die richtige wählen muss. Mit IQ-Familie wird die Beratung einfacher:

- **Work IQ** → wenn der Use-Case M365-zentrisch ist
- **Fabric IQ** → wenn Business-Daten in Lakehouse liegen
- **Web IQ** → wenn externe Web-Recherche nötig ist
- **Foundry IQ** → wenn enterprise-eigene Dokumente nicht in M365 stehen

Das ist ein klares Entscheidungs-Baum-Muster, das Kunden sofort verstehen.

## Entscheidungs-Baum: welches IQ wann?

```
Wo liegen die zu groundenden Daten?
├── M365 (Mail, Teams, SharePoint, OneDrive)?  → Work IQ
├── Internet (Recherche, externe Quellen)?     → Web IQ
├── Fabric Lakehouse / Data Warehouse?         → Fabric IQ
└── Enterprise-Dokumente außerhalb M365?       → Foundry IQ
                                                 (Wrapper auf AI Search)

Mehrere Quellen? → Foundry IQ als "Meta-Suche" über alle IQs
                   (Build 2026: angekündigt für Q4)
```

## Vergleich: IQ-Familie vs direkter API-Zugriff

| Aspekt | IQ-Familie | Direkter API-Zugriff (Graph, AI Search, etc.) |
|---|---|---|
| Setup-Aufwand | gering (managed) | hoch (Index-Config, ACL-Logik selbst implementieren) |
| Berechtigungs-Respekt | automatisch | manuell programmieren |
| Audit-Logging | automatisch in Purview | selbst implementieren |
| Kontrolle / Anpassbarkeit | mittel | hoch |
| Pricing | Wrapper-Aufschlag (~20 %) | nur Basis-API |
| Empfohlen für | Standard-RAG-Cases, schnelle POCs | Custom-Logik, Hochvolumen mit eigenem Tuning |

## Pricing (vorläufig, Build-Keynote)

- **Foundry IQ:** in Foundry-Standard-Lizenz inkludiert
- **Work IQ:** $2 pro User/Monat (zusätzlich zu M365 Copilot-Lizenz)
- **Fabric IQ:** Fabric-Capacity-Unit-basiert
- **Web IQ:** $0.01 pro Query (PAYG)

Schätzung für Schweizer KMU mit 50 M365-Copilot-Usern und IQ-Familie: **CHF 100/Monat** zusätzlich.

## Häufige Stolpersteine

1. **Work IQ ≠ Microsoft Graph.** Work IQ ist eine **semantische** Schicht über Graph (z.B. "alle Meetings, in denen Hongyu zu Vertragsthemen sprach") — Graph bleibt für rohe Datenzugriffe nötig.
2. **Web IQ ist nicht Bing-Search.** Web IQ kuratiert und cached — keine Real-Time-Web-Suche, sondern indexierte Web-Inhalte mit Frische-SLA.
3. **Fabric IQ braucht aufgesetzte Fabric-Capacity.** Ohne Fabric-Tenant kein Fabric IQ — nicht jeder Schweizer Kunde hat das.
4. **IQ-Family verschiebt API-Surface.** Bestehender Code mit direktem Graph-Zugriff funktioniert weiter — aber neue Empfehlungen sollten auf IQ-Familie umsteigen.

## Migrations-Pfad

### Von eigenem RAG auf Foundry IQ
Aufwand: **2-3 Tage** (Index-Migration, ACL-Mapping).
1. Bestehender AI-Search-Index bleibt
2. Foundry IQ als Wrapper konfigurieren (Index-Reference)
3. MAF/Studio-Code auf IQ-API umstellen
4. Alte Direct-Search-Calls deprecaten

### Von Graph-Connector auf Work IQ
Aufwand: **1 Tag** pro Connector.
1. Work-IQ-Endpoint konfigurieren
2. Permissions-Scope auf Work IQ erweitern
3. Bestehende Graph-Queries als Fallback behalten

## Schweizer Compliance-Implikationen

- **Datenspeicherung:** IQ-Family folgt Microsoft Data Boundary — EU für EU-Tenants konfigurierbar
- **Audit-Trail:** Purview-Integration automatisch (Sensitivity-Labels, DLP)
- **FADP:** Work IQ verarbeitet personenbezogene Mitarbeiter-Daten — Standard-Microsoft-Auftragsverarbeitungs-Vertrag deckt
- **Banken (FINMA):** Web IQ in Compliance-Setup sehr kritisch zu betrachten — externe Web-Anfragen können Audit-Probleme schaffen. **Pre-Production: Web-IQ-Anfragen pro Workflow vorab definieren und genehmigen lassen.**

## Vertiefungsbedarf (1-Tag-Aufwand)

- [ ] Sub-Produkt-Files für Work IQ, Fabric IQ, Web IQ separat vertiefen
- [ ] POC: Foundry IQ auf einem unserer Demo-Indizes aufsetzen, vergleichen mit Direct-Search
- [ ] Schweizer Banken-Compliance-Check für Web IQ: was darf der Bot fragen, was nicht?
- [ ] Pricing-Modell mit Microsoft-Account-Manager bestätigen

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [news.microsoft.com/build-2026](https://news.microsoft.com/build-2026/)
- [theneuron.ai — Everything announced](https://www.theneuron.ai/explainer-articles/everything-microsoft-announced-at-microsoft-build-2026-explained/)
