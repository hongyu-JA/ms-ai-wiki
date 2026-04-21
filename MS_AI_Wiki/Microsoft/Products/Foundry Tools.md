---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [Azure AI Services]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Foundry Tools

*Sammelbegriff für die **Azure AI Services** innerhalb Foundry — Speech, Translator, Language, Face, und die zwei für SMB zentralen: **[[Azure AI Document Intelligence]]** (Rechnungs-/Vertragserkennung) und **[[Azure AI Content Understanding]]** (Multimodal: Doc/Bild/Video).*

## Einsatz

**JTBD:** When I Agents nicht nur auf Text grounden will, sondern auf Dokumente, Bilder, Video, I want to fertige APIs für OCR, Struktur-Extraktion, Multi-Modal-Analyse nutzen, so I can das Rad nicht neu erfinden.

**Kritische Fragen (Arbeitsauftrag §2.6):** Welche Services im SMB-Alltag? EU-Regionen? Wie in Agent-Workflows integrieren (z.B. Content Understanding als Agent-Tool)?

**Empfehlung:** 🟢 für **Document Intelligence** (Rechnungen, Verträge, Formulare) + **Content Understanding** (Multi-Modal). Andere (Speech, Translator) nach Bedarf.

## Status & Pricing

- **Status:** GA (Services individuell)
- **Pricing:** API-Call-basiert, pro 1k transactions
- **Region:** Die meisten EU-Regionen verfügbar

## Kernkonzept

Foundry Tools bündelt **existierende Azure AI Services** unter einem Konsum-Modell. Kunden können sie **standalone** nutzen (direkter Service-Call) oder **über Foundry konsumieren** (einheitliche RBAC, einheitliche Billing, Agent-Tool-Registrierung).

Für SMB-Journai-Kontext relevant:

- **Document Intelligence** — Struktur-Erkennung in Rechnungen, Verträgen, Formularen. Pre-trained Models + Custom Models. Typisch: Rechnungsverarbeitung → in Dataverse schreiben.
- **Content Understanding** — multimodale Analyse (Text + Bild + Video), neuere Generation. Ideal als Agent-Tool, wenn Agent gemischte Inputs verarbeiten soll.
- **Language** — Entity, Sentiment, Key Phrase, Translation — für Text-Preprocessing vor RAG oder als Agent-Tool.

### Foundry vs. Standalone-Nutzung

Technisch identische APIs. Over Foundry: einheitliches Billing, einheitliche RBAC, direkte Agent-Tool-Registrierung. Standalone: bei älteren Projekten oder spezifischen SDK-Wünschen.

## Limitierungen

- **API-Call-Kosten können sich summieren** — Batch-Optionen prüfen
- **Custom Models brauchen Training-Daten** — nicht trivial

## Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Azure AI Services Overview | https://learn.microsoft.com/en-us/azure/ai-services/ | 2026-04-22 |
| Docs | Document Intelligence | https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/ | 2026-04-22 |
| Docs | Content Understanding | https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/ | 2026-04-22 |

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
