---
watch: open
status: stub_build_2026
last_verified: 2026-06-03
source: build-2026-keynote
aliases:
  - Microsoft Fabric IQ
moc:
  - '[[Microsoft MOC]]'
  - '[[Data & Knowledge MOC]]'
  - '[[Microsoft IQ]]'
zuletzt_gesichtet: 2026-06-03
updated: 2026-06-03
---

# Fabric IQ

*Teil der [[Microsoft IQ]]-Familie. Agenten erhalten Reasoning-fähigen Zugriff auf Business-Daten und Ontologien in Microsoft Fabric — Lakehouse-Inhalte werden semantisch nutzbar.*

> **Analogie:** Wenn [[Fabric Data Agents]] der Praktikant ist, der eigenständig SQL schreibt, ist Fabric IQ der erfahrene Business-Analyst, der das Schema kennt und die richtigen Geschäftsfragen stellt.

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

## Vertiefungsbedarf (0.5-Tag-Aufwand)

- [ ] Ontologie-Definitions-Workflow dokumentieren
- [ ] Vergleich mit Fabric Data Agents (Wann was?)
- [ ] Pricing

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [news.microsoft.com/build-2026](https://news.microsoft.com/build-2026/)
