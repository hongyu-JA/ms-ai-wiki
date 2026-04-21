---
watch: standard
status: ga
last_verified: 2026-04-22
aliases: [Content Safety, Prompt Shields]
moc:
  - "[[Microsoft MOC]]"
  - "[[Security & Identity MOC]]"
---

# Azure AI Content Safety

*Azure's **präventiver Content-Filter-Service** für AI-Inputs und -Outputs — Prompt Shields, Text Analyzer (Hate/Sexual/Violence/Self-Harm), Image Analyzer, Groundedness Detection, Protected Material Detection. Sitzt **vor** und **hinter** dem LLM als Policy-Enforcement-Punkt.*

> **Analogie:** Was OpenAI's Moderation API ist, nur tiefer — Prompt Shields erkennen speziell Prompt-Injection-Patterns zusätzlich zu klassischen Kategorien.

---

## Einsatz

**JTBD:** When I Agents mit externem User-Input betreibe, I want to einen pre-Modell-Filter, der problematische Inhalte (Toxicity, PII-Leaks, Prompt-Injection) erkennt + blockt, so I can weder toxische Responses rausgehen noch Prompts den Agent hijacken.

**Trigger-Signale:**
- „Unsere externen Kunden können Prompts schicken — wie filtern wir?"
- „Compliance fragt nach Content-Moderation-Proof für AI-Outputs."
- „Prompt-Injection-Risk — wie mitigieren wir?"

**Szenarien:** (1) Prompt Shields als Input-Filter vor MAF-Agent, (2) Output-Moderation für Customer-Facing-Chatbot, (3) Image Analyzer für User-uploaded Content.

**Empfehlung:** 🟢 bei jedem Produktiv-Agent mit externem User-Input.

---

## Status & Pricing

- **Status:** GA
- **Pricing:** Per-Call-basiert (pro 1k Texts/Images)
- **Region:** alle großen Azure-Regionen inkl. EU

---

## Kernkonzept

Content Safety ist **stateless Classifier-Service** mit mehreren Endpunkten:
- **Text Moderation** — Kategorien Hate / Sexual / Violence / Self-Harm, konfigurierbare Schwellen
- **Image Moderation** — gleiche Kategorien, auf Bildern
- **Prompt Shields** — spezialisiert auf User-Input-Prompt-Injection + Jailbreak
- **Groundedness Detection** — prüft ob LLM-Response aus gegebenem Kontext abgeleitet (vs. halluziniert)
- **Protected Material Detection** — scant LLM-Output auf Copyright-Material

Üblicher Einsatz: **Prompt Shields + Text Moderation pre-Call**, **Groundedness Detection post-Call**. Für Custom Categories gibt es trainierbare Variante.

### Kern-Fähigkeiten

1. **Prompt Shields** — Prompt-Injection + Jailbreak-Detection
2. **Text/Image Moderation** — 4 Standard-Kategorien
3. **Groundedness Detection** — RAG-Hallucination-Check
4. **Custom Categories** — trainierbares Policy-Framework

---

## Limitierungen

- **Latenz addiert sich** pro Call
- **False Positives** in mehrsprachigen Kontexten (DE/FR/IT qualitativ gut, Nische schwächer)
- **Nicht im Modell-Pricing enthalten** — extra Service-Call

### Fallstricke

- **Nur Content Safety, kein Defender** — Content Safety filtert, Defender detected + responds zur Laufzeit. *Gegenmittel: Beides kombinieren.*

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Azure AI Content Safety | https://learn.microsoft.com/en-us/azure/ai-services/content-safety/ | 2026-04-22 |
| Docs | Prompt Shields | https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection | 2026-04-22 |
| Pricing | | https://azure.microsoft.com/en-us/pricing/details/cognitive-services/content-safety/ | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
