---
watch: standard
status: ga
last_verified: 2026-04-22
aliases: [Form Recognizer, Azure Form Recognizer]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Azure AI Document Intelligence

*Azure's **OCR + Dokumenten-Struktur-Erkennung** — Rechnungen, Verträge, Formulare, Belege, ID-Dokumente. Teil von [[Foundry Tools]]. Für SMB-Kunden einer der häufigsten Einstiegs-Use-Cases (Rechnungs-/Vertragsverarbeitung).*

> **Analogie:** Was ABBYY FlexiCapture seit Jahren macht, nur Cloud-native, API-first und mit Pre-Built-Modellen für Standard-Dokumenttypen.

---

## Einsatz

**JTBD:** When I strukturierte Daten (Zahlen, Datum, Adressen) aus semi-strukturierten Dokumenten (Rechnungen, Formulare) extrahieren will, I want to fertige Modelle oder einen Custom-Training-Workflow, so I can ohne eigenes OCR-Setup Daten für Downstream-Systeme (Dataverse, SAP, Excel) bereitstellen kann.

**Trigger-Signale:**
- „Wir bekommen 500 Rechnungen pro Woche per Mail, alles manuell."
- „Vertragsstammdaten-Migration: 10.000 PDFs zu strukturieren."
- „Fuhrpark-Tankbelege sollten in Dynamics 365 landen."

**Szenarien:** (1) Rechnungs-OCR → Dataverse/Dynamics, (2) Agent-Tool: MAF-Agent extrahiert Doc-Daten, (3) Massive Backload von Verträgen.

**Empfehlung:** 🟢 für Dokument-Heavy-SMB-Szenarien. In der Kombi mit [[Microsoft Agent Framework]] ein sehr starker Usecase.

---

## Status & Pricing

- **Status:** GA (Rebrand von Form Recognizer 2024)
- **Pricing:** Per-Page pay-per-use (Pre-Built Models günstiger als Custom)
- **Region:** alle EU-Regionen verfügbar

---

## Kernkonzept

Document Intelligence hat drei Modell-Klassen:

1. **Pre-Built Models** — für Standard-Typen (Invoice, Receipt, ID, Tax/W-2, Layout, Business Card). Kein Training nötig.
2. **Custom Neural Models** — für eigene Formulare, Training mit 5+ gelabelten Beispielen, Transformer-basiert, auch handwritten.
3. **Custom Template Models** — für strukturierte Formulare mit fixem Layout, bereits ab 2 Beispielen trainierbar.

Output: JSON mit **Key-Value Pairs**, **Tables**, **Selection Marks** (Checkboxes), **Bounding Boxes**, **Confidence Scores**.

### Kern-Fähigkeiten

1. **Layout-Analyse** (Tabellen + Struktur-Erkennung)
2. **Pre-Built für häufige Typen** (ohne Training)
3. **Custom-Training-Pfad** (Neural + Template)
4. **Handwriting Recognition**
5. **Langue-Support**: 100+ Sprachen

---

## Limitierungen

- **Custom-Training braucht gute Labels** — Labeling-Tool integriert, aber Aufwand real
- **Komplex vermischte Dokumente** (Foto eines Formulars am Foto eines Tisches) senken Qualität

### Fallstricke

- **Confidence-Score ignorieren** — unter 0.8 manuell verifizieren, sonst Downstream-Fehler. *Gegenmittel: Threshold-Review-Workflow.*

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Document Intelligence | https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/ | 2026-04-22 |
| Pricing | | https://azure.microsoft.com/en-us/pricing/details/ai-document-intelligence/ | 2026-04-22 |
| Studio | Document Intelligence Studio | https://documentintelligence.ai.azure.com | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
