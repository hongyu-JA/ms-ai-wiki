---
watch: standard
status: ga
last_verified: 2026-06-08
azure_verified: 2026-06-08
source: poc-benchmark-2026-06-08
aliases:
  - revDSG
  - FADP
  - nDSG
  - DSG
  - Datenschutz Schweiz
  - Schweizer Datenschutzrecht
moc:
  - '[[Microsoft MOC]]'
  - '[[Security & Identity MOC]]'
zuletzt_gesichtet: 2026-06-08
updated: 2026-06-08
---

# Datenschutz-Framework Schweiz (revDSG/FADP) für AI-Projekte

*Autoritative Referenz für die korrekte rechtliche Einordnung bei Schweizer AI-Beratungsmandaten. Entstanden aus dem POC-Benchmark 2026-06-08, der ein häufiges Präzisions-Problem aufdeckte: „Schweiz = DSGVO" ist fachlich falsch.*

> **Kernsatz für Kundengespräche:** Die Schweiz ist aus EU-Sicht ein **Drittland**. Der primäre Schweizer Rechtsrahmen ist das **revDSG/FADP**, nicht die DSGVO. Die DSGVO gilt für Schweizer Firmen nur **zusätzlich**, wenn sie Daten von EU-Ansässigen verarbeiten (Marktortprinzip, Art. 3 DSGVO).

---

## Die korrekte Terminologie

| Begriff | Bedeutung | Wann verwenden |
|---|---|---|
| **revDSG** | revidiertes Datenschutzgesetz (in Kraft seit 2023-09-01) | Schweizer Rechtsrahmen — **primär** im CH-Kontext |
| **FADP** | Federal Act on Data Protection (englische Bezeichnung des revDSG) | internationale/englische Kontexte |
| **nDSG / DSG** | neues/altes Datenschutzgesetz (umgangssprachlich) | Synonyme zu revDSG |
| **DSGVO / GDPR** | EU-Verordnung 2016/679 | nur bei **EU-Datenbezug** oder als Vergleichsrahmen |

## Wann gilt was — Entscheidungslogik

```
Schweizer Firma verarbeitet Daten:
├── nur Daten von Personen in der Schweiz?
│     → revDSG/FADP (DSGVO NICHT anwendbar)
├── auch Daten von Personen in der EU/EWR?
│     → revDSG/FADP UND DSGVO (Marktortprinzip)
└── Datenexport in die EU/Cloud-Region EU?
      → revDSG-Anforderungen an Auftragsbearbeitung + ggf. DSGVO
```

## Die häufigsten Präzisions-Fehler (im POC-Benchmark beobachtet)

1. **„Schweiz = DSGVO-Zone"** — falsch. Die Schweiz ist DSGVO-**Drittland**. Korrekt: „EU/EWR-Datenschutzzone; die Schweiz hat mit revDSG ein als gleichwertig anerkanntes eigenes Regime."
2. **„Daten bleiben in der Schweiz = DSGVO-konform"** — unsaubere Kausalkette. Datenresidenz ist EINE Massnahme, ersetzt aber nicht DPA, DSFA, Datensparsamkeit.
3. **„Switzerland North garantiert Datenresidenz"** — differenzieren: garantiert die Region für den jeweiligen Dienst, aber nachgelagerte AI-Inferenz/Modell-Calls können in anderen Regionen laufen. Pro Dienst prüfen.

## Was bedeutet das für unsere Beratung

**Compliance entsteht aus vier Bausteinen — NICHT aus der Modell-/Anbieter-Herkunft:**

1. **Region** — Datenverarbeitung in Switzerland North (pro Dienst verifizieren, nicht pauschal annehmen)
2. **Auftragsbearbeitungsvertrag (DPA)** — Microsoft DPA + ggf. dienst-/anbieterspezifische Zusätze
3. **Datensparsamkeit** — nur verarbeiten, was nötig ist (z.B. `select`-Felder bei AI Search statt Volldokument)
4. **DSFA** (Datenschutz-Folgenabschätzung) — bei hohem Risiko Pflicht nach revDSG Art. 22

> **Wichtige Korrektur aus dem POC (2026-06-08):** Das Argument „Microsoft-First-Party-Modell = automatisch besser/sicherer für regulierte Kunden" ist **widerlegt**. Compliance hängt an den vier Bausteinen oben, nicht am Modellhersteller. Siehe [[2026-06-08-phi4-vs-gpt54-benchmark-results]].

## Sprachregelung für Kunden-Dokumente

- **Primär:** „revDSG/FADP" wenn es um den Schweizer Rechtsrahmen geht
- **Ergänzend:** „und DSGVO bei Verarbeitung von EU-Personendaten"
- **Akzeptabel als Kurzform:** „DSGVO-Zone" / „EU/EFTA-Datenschutzraum" wenn es technisch um die EU-Daten-Boundary einer Azure-Region geht (dort ist DSGVO der etablierte Sammelbegriff) — aber NIE die Schweiz direkt mit DSGVO gleichsetzen.

## Quellen

- revDSG (SR 235.1), in Kraft seit 2023-09-01 — [fedlex.admin.ch](https://www.fedlex.admin.ch/eli/cc/2022/491/de)
- EDÖB (Eidg. Datenschutz- und Öffentlichkeitsbeauftragter) — [edoeb.admin.ch](https://www.edoeb.admin.ch/)
- POC-Benchmark 2026-06-08: [[2026-06-08-phi4-vs-gpt54-benchmark-results]]
