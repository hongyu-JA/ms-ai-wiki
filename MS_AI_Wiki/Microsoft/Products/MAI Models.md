---
watch: open
status: stub_build_2026
last_verified: 2026-06-03
source: build-2026-keynote
aliases:
  - MAI Model Family
  - MAI-Thinking-1
  - MAI-Code
  - MAI-Voice
  - MAI-Transcribe
  - MAI-Image
  - MAI-Embed
moc:
  - '[[Microsoft MOC]]'
  - '[[Foundry MOC]]'
zuletzt_gesichtet: 2026-06-03
updated: 2026-06-03
---

# MAI Models

*Microsoft's eigene First-Party-Modellfamilie, vorgestellt auf Build 2026 — sieben spezialisierte Modelle, die als Drop-in-Alternativen zu OpenAI / Anthropic in Foundry, Copilot, GitHub und Windows zur Verfügung stehen.*

> **Analogie:** Was Phi für kleine on-device-Modelle war, sind MAI für die ganze Modell-Wertschöpfungskette. Microsofts Antwort auf die "Vendor-Lock-in"-Kritik der OpenAI-Abhängigkeit.

---

## Modell-Familie (Stand 2026-06-03)

| Modell | Kategorie | Status | Parameter / Eckdaten |
|---|---|---|---|
| **MAI-Thinking-1** | Reasoning | Preview | 35B aktive Parameter, Chain-of-Thought, GPQA Diamond 87.2 |
| **MAI-Code-1** | Coding | Rolling Out | 5B (Flash) / 34B (full), integriert in VS Code + GitHub Copilot |
| **MAI-Image-2.5** | Image | GA | Bildgenerierung in PowerPoint, OneDrive |
| **MAI-Transcribe-1.5** | Speech-to-Text | GA | 43+ Sprachen, 5x schneller als Wettbewerb |
| **MAI-Voice-2** | TTS | GA | 15 Sprachen, Low-Latency-Variant verfügbar |
| **MAI-Small / MAI-Large** | Allzweck | Preview | 13B / 170B, Drop-in für GPT-4o / GPT-5 Mini |
| **MAI-Embed** | Embeddings | Preview | 380M, MTEB-Score 68.9 |

## Strategische Einordnung

Microsoft positioniert MAI explizit als "AI-Optionality" — Multi-Provider statt OpenAI-Monokultur. Auf Build 2026 sagte Satya Nadella:

> "We are deeply committed to our partnership with OpenAI. But customers deserve a marketplace of models."

Für Schweizer Kunden mit Compliance-Anforderungen ist das relevant:
- **Single-Vendor-DPIA** möglich (alle Modelle = Microsoft-Vertrag)
- Keine zusätzliche Anthropic-DPIA-Aktualisierung mehr nötig
- Foundry Control Plane bietet automatisches Routing zwischen MAI / OpenAI / Anthropic je nach Kosten/Latenz/Genauigkeit

## Verfügbarkeit & Region

- US + EU bei Launch
- Alle 60+ Azure-Regionen bis Dezember 2026 geplant
- EU AI Act Compliance über Responsible AI Standard v3 (Wasserzeichen, C2PA)

## Wo passt es in die Architektur?

- **Layer:** FOUNDATION (gleiche Schicht wie Foundry Models, OpenAI Responses API)
- **Verbindung:** Foundry Models → MAI (kumulative Aufnahme), MAI-Code → GitHub Copilot App
- **Edge-Typ:** `calls` (Frameworks → MAI), `hosted-on` (MAI → Microsoft Foundry)

## Beratungs-Relevanz für Journai

**Hoch.** MAI verändert die Default-Empfehlung für Modell-Auswahl:
- **Vorher:** "GPT-4o für Reasoning, Phi-4 für Cost, Claude bei DPIA-Aktualisierung"
- **Nachher:** "MAI-Thinking-1 für Reasoning, MAI-Code-1 für Coding, MAI-Embed für Search. OpenAI/Claude nur wenn spezifischer Use-Case dafür spricht."

## Vertiefungsbedarf (2-Tage-Aufwand)

- [ ] Konkrete Benchmark-Zahlen vs. GPT-5 + Claude 4 für unsere typischen Use-Cases sammeln
- [ ] EU-Region-Verfügbarkeit pro Einzelmodell prüfen
- [ ] Pricing-Tabelle PAYG vs PTU für MAI vs. OpenAI vs. Claude
- [ ] DPIA-Template-Update für MAI

## Quellen

- Microsoft Build 2026 Keynote (Satya Nadella, 2. Juni 2026)
- [news.microsoft.com/build-2026](https://news.microsoft.com/build-2026/)
- [windowsnews.ai — MAI Models Deep-Dive](https://windowsnews.ai/article/build-2026-microsoft-mai-models-foundry-control-plane-and-the-push-for-ai-optionality-beyond-openai.421932)
