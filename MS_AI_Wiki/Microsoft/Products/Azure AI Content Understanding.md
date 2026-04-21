---
watch: standard
status: ga
last_verified: 2026-04-22
aliases: []
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Azure AI Content Understanding

*Azure's **multimodale Content-Analyse** — Text, Bild, Video, Audio in einem Service. Neuere Generation nach [[Azure AI Document Intelligence]], mit stärkerem Fokus auf **strukturierte Insights aus gemischten Inputs**. Teil von [[Foundry Tools]].*

> **Analogie:** Was AWS Textract + Rekognition + Transcribe getrennt machen, integriert Content Understanding in einen einheitlichen Service — mit Schema-gesteuerter Output-Struktur.

---

## Einsatz

**JTBD:** When I Inhalte verschiedener Modalitäten (Video-Meetings, Fotos von Werkstätten, PDF-Bericht mit Bildern) einheitlich analysieren will, I want to ein Schema definieren und den Service die Extraktion orchestrieren lassen, so I can konsistente JSON-Outputs für Downstream-Systeme erhalte.

**Trigger-Signale:**
- „Wir haben Video-Meeting-Aufnahmen, brauchen Action Items + Topic Summary."
- „Fotos von Schadensfällen aus dem Außendienst automatisch kategorisieren."
- „PDF mit Bildern + Text, wir wollen beides gleichzeitig auswerten."

**Szenarien:** (1) Multimodal-Meeting-Processing, (2) Visual-Inspection-Workflows, (3) Rich-Content-Reports (Text + Bild) für Compliance.

**Empfehlung:** 🟢 bei Multi-Modal-Use-Cases. Für reine Dokument-OCR reicht [[Azure AI Document Intelligence]].

---

## Status & Pricing

- **Status:** GA (nachfolgende Generation zu Document Intelligence + Video Indexer + Vision)
- **Pricing:** Per-Minute (Video/Audio) + Per-Image + Per-Page *{TODO: aktuelle Matrix}*
- **Region:** limitierte EU-Regionen *{TODO: klären}*

---

## Kernkonzept

Content Understanding funktioniert **schema-driven**: Du definierst ein **Analyzer Template** (JSON-Schema „was soll rauskommen: Titel, Sprecher, Topics, Bounding Boxes"), uploadest Content (Video / Bild / Doc), bekommst validated JSON zurück.

Große Unterscheidung zu Document Intelligence: Content Understanding nutzt unter der Haube **LLMs als Extractoren** — nicht nur klassische CV/OCR. Das macht es flexibler (auch unbekannte Doc-Typen), aber weniger deterministisch.

### Kern-Fähigkeiten

1. **Multi-Modal-Pipeline** (Video, Audio, Image, PDF in einem Analyzer)
2. **Schema-gesteuerte Extraktion** (JSON-Schema definiert Output)
3. **Vordefinierte Analyzer** + Custom Training
4. **Agent-Tool-Integration** (über MAF als Tool konsumierbar)

---

## Limitierungen

- **Weniger deterministisch als Document Intelligence** bei Standard-Dokumenten
- **Pricing kann bei hohem Volumen explodieren** (LLM-basiert)
- **EU-Region-Verfügbarkeit limitiert** *(TODO klären)*

### Fallstricke

- **Mit Document Intelligence überlappen** — klassische Rechnungs-OCR über Content Understanding ist Overkill + teuer.

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Content Understanding | https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/ | 2026-04-22 |
| Pricing | | https://azure.microsoft.com/en-us/pricing/details/content-understanding/ | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
