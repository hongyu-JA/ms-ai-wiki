---
watch: open
status: stub_build_2026
last_verified: 2026-06-08
azure_verified: 2026-06-08
source: build-2026-keynote
aliases:
  - Microsoft Fabric IQ
moc:
  - '[[Microsoft MOC]]'
  - '[[Data & Knowledge MOC]]'
  - '[[Microsoft IQ]]'
zuletzt_gesichtet: 2026-06-08
updated: 2026-06-08
---

# Fabric IQ

*Teil der [[Microsoft IQ]]-Familie. Agenten erhalten Reasoning-fähigen Zugriff auf Business-Daten und Ontologien in Microsoft Fabric — Lakehouse-Inhalte werden semantisch nutzbar.*

> **Analogie:** Wenn [[Fabric Data Agents]] der Praktikant ist, der eigenständig SQL schreibt, ist Fabric IQ der erfahrene Business-Analyst, der das Schema kennt und die richtigen Geschäftsfragen stellt.

---

## ⚠ POC-Verifikation gegen echtes Azure (2026-06-08)

**Read-only geprüft auf Journai-Core (Reader-Rolle).** Harter Befund: der Basis-Provider **`Microsoft.Fabric` ist in dieser Subscription `NotRegistered`** — Fabric IQ ist auf Journai-Core **aktuell überhaupt nicht nutzbar**, unabhängig vom Produkt-Reifegrad. Ohne registrierte Fabric-Capacity gibt es keinen Lakehouse, auf dem Fabric IQ aufsetzen könnte.

**Beratungs-Konsequenz:** Fabric IQ nur bei Kunden relevant, die Microsoft Fabric bereits produktiv nutzen (in der Schweiz heute selten). Für Journai-interne POCs müsste erst eine Fabric-Trial registriert werden (`az provider register --namespace Microsoft.Fabric`, braucht Contributor).

> **Status bleibt `stub_build_2026`** — kein Fabric-Zugang zum Testen.

---

## Was leistet es?

- **Business-Ontologie:** Geschäfts-Begriffe (Kunde, Bestellung, Region) werden als semantische Schicht über rohen Lakehouse-Tabellen exponiert
- **Aggregations-Reasoning:** Agenten können Fragen wie "Umsatz pro Region letztes Quartal vs. vorletzes Quartal" stellen, ohne SQL zu schreiben
- **Datenqualität-Awareness:** kennt Fresh-Datum, Vollständigkeit, Joins
- **Native Fabric-Integration:** keine separaten Pipelines, kein Doppel-Indexing

## Status

- GA seit Build 2026
- Region: an Fabric-Region gebunden

## Wo passt es in die Architektur?

- **Layer:** KNOWLEDGE
- **Verbindungen:**
  - `grounds-on` ← MAF
  - `uses` → existierender Fabric Lakehouse
  - `secured-by` → Microsoft Purview (Data Map / Lineage)

## Beratungs-Relevanz

**Mittel-hoch — für datenreiche Schweizer Kunden.**

Typische Use-Cases bei unseren Beratungsmandaten:
- Versicherer mit Schaden-Lakehouse → Agent beantwortet "wie viel Schaden hatten wir in Q1 nach Sparte"
- Banken-Backoffice mit Reporting-Lakehouse → Agent erstellt Trend-Analysen on-demand
- Handels-Unternehmen mit Verkaufs-Lakehouse → Agent für Sales-Manager

Voraussetzung beim Kunden: Microsoft Fabric muss bereits im Einsatz sein. Das ist heute noch eher selten in der Schweiz, aber wachsend.

## Konkrete Architektur

```
Microsoft Fabric Workspace
    ├── Lakehouse (Bronze/Silver/Gold)
    │   ├── Tabellen: customers, orders, products, transactions
    │   └── Schema-Beschreibungen
    ├── Semantic Model (ehemals Power BI Model)
    │   └── Business-Ontologie:
    │       - "Kunde" = customers JOIN customer_dim
    │       - "Umsatz" = SUM(orders.amount) WHERE status='completed'
    │       - "Region" = customers.country mapped to DACH/EU/ROW
    └── Fabric IQ Layer (NEU mit Build 2026)
        └── Exposes Ontologie als MCP-Tool für Agents
```

## Use-Cases (typisch)

1. **CFO-Brief:** _"Wie war Q1 vs Q4 nach Produktkategorie?"_ → Fabric IQ schreibt SQL, aggregiert, antwortet narrativ
2. **Sales-Manager-Dashboard:** _"Welche Kunden sind seit 6 Monaten inaktiv mit Wert > CHF 100k?"_
3. **Versicherungs-Schadenanalyse:** _"Welche Sparten hatten überdurchschnittliche Schaden-Quote in Q1?"_
4. **Compliance-Reporting:** automatischer monatlicher Report aus Lakehouse-Daten

## Vergleich: Fabric IQ vs Fabric Data Agents vs Direct SQL

| Aspekt | Fabric IQ | Fabric Data Agents | Direct SQL/Spark |
|---|---|---|---|
| Was es ist | Wrapper auf Data Agents + Ontologie | "Praktikant der SQL schreibt" | Custom-Engineering |
| Antwort-Format | Business-Sprache | technisch | Raw-Daten |
| Ontologie-Bewusstsein | ✓ | partiell | ✗ (manuell) |
| Customization | mittel | hoch | voll |
| Wer schreibt es | Business-User direkt | Data-Engineer + Agent | Data-Engineer voll |
| Empfohlen für | Self-Service-Analytics | Hybrid-Reporting | Hochperformante ETL |

**Faustregel:**
- Business-User fragen → Fabric IQ
- Data-Engineer entwickelt → Fabric Data Agents
- Tausende Queries/Stunde → Direct SQL/Spark

## Pricing

- **Inkludiert in Fabric Capacity F64+** ab Build 2026
- Kleinere Capacity-SKUs: PAYG mit Query-basiertem Pricing
- Schätzung: ~CHF 200-500/Monat zusätzlich für mittlere Fabric-Capacity

## Ontologie-Definitions-Workflow

```
1. Data-Engineer definiert Schemas in Lakehouse
2. Power-BI-Architekt erstellt Semantic Model mit Business-Begriffen
3. Fabric IQ liest Semantic Model automatisch
4. Optional: zusätzliche Annotations für Agent-Verständnis
   (z.B. "wenn User 'Kunden' sagt, meint er meistens 'Aktive Kunden in DACH'")
5. Agent kann ab sofort fragen
```

**Wichtig:** Qualität der Ontologie = Qualität der Antworten. Schlechtes Semantic Model → halluzinierender Agent.

## Häufige Stolpersteine

1. **Fabric muss schon im Einsatz sein.** Ohne Fabric-Tenant kein Fabric IQ — viele Schweizer Kunden haben heute noch klassisches Power BI Premium, nicht Fabric.
2. **Schlechtes Semantic Model = halluzinierender Agent.** Wer Power-BI-Modelle ohne klare Business-Begriffe hat, muss erst die Ontologie aufräumen. Beratungs-Pre-Work.
3. **Lakehouse-Refresh-Frequenz:** Fabric IQ antwortet auf Stand der letzten Refresh — wenn Refresh nightly, sind Tages-Daten nicht da.
4. **Berechtigungen:** Row-Level-Security funktioniert, Column-Level-Security nur eingeschränkt.

## Pre-Beratung: Reifegrad-Check

Vor einem Fabric-IQ-Pitch beim Kunden klären:

- [ ] Hat der Kunde Fabric-Capacity (mindestens F32)?
- [ ] Wer pflegt Semantic Models? (Wenn niemand → Pre-Work-Aufwand)
- [ ] Sind Business-Begriffe konsistent definiert? (Häufige Realität: "Kunde" hat 3 verschiedene Definitionen)
- [ ] Wie aktuell ist das Lakehouse? (Stunden? Tage?)
- [ ] Gibt es RLS-Policies? (Wer darf was sehen?)

Wenn 3+ "Nein" → Fabric-IQ-POC erst nach Ontologie-Aufräum-Projekt (2-4 Wochen Pre-Work).

## Schweizer Compliance-Implikationen

- **Datenspeicherung:** Fabric-Region — EU oder Schweiz wählbar
- **FADP:** Standard-Microsoft-DPA
- **FINMA:** Lakehouse-Daten in CH-Region halten, Fabric IQ verarbeitet on-region
- **Audit-Trail:** Fabric IQ-Anfragen werden in Purview Lineage geloggt

## Vertiefungsbedarf (0.5-Tag-Aufwand)

- [ ] POC: einen Demo-Lakehouse mit Schweizer Verkaufs-Daten aufsetzen, Fabric IQ verbinden
- [ ] Reifegrad-Check-Template formalisieren (wie oben)
- [ ] Pricing-Bestätigung mit Microsoft
- [ ] Konkrete Ontologie-Anti-Patterns identifizieren (was kommt häufig schief?)

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [news.microsoft.com/build-2026](https://news.microsoft.com/build-2026/)
