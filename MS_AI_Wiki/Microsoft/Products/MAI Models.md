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

## Pricing & Lizensierung (Stand 2026-06-07, vorläufig)

| Modell | PAYG (Input / Output pro 1M Token) | PTU verfügbar | Region CH-North |
|---|---|---|---|
| MAI-Thinking-1 | ~$3.50 / $14 | ja (ab 100 PTU) | ab Q4/2026 angekündigt |
| MAI-Code-1 (Flash) | ~$0.40 / $1.20 | nein | Q4/2026 |
| MAI-Code-1 (Full) | ~$2.80 / $8.40 | ja | Q4/2026 |
| MAI-Large | ~$2.50 / $10 | ja | Q4/2026 |
| MAI-Small | ~$0.30 / $0.90 | nein | Q4/2026 |
| MAI-Embed | ~$0.08 / 1M Token | nein | Q4/2026 |
| MAI-Voice-2 | ~$15 / 1M Zeichen | nein | Q4/2026 |
| MAI-Transcribe-1.5 | ~$0.005 / Minute Audio | nein | Q4/2026 |

**Vergleich zu OpenAI** (Stand Anfang Juni 2026): MAI-Large ist ca. **30–40 % günstiger** als GPT-4o bei vergleichbarer Qualität in Microsofts internen Benchmarks. PTU-Pricing erst ab 100 PTU/Monat sinnvoll (ca. CHF 7'000-10'000/Monat).

> ⚠ **Vorsicht:** Pricing ist Build-Keynote-Information, kein finales Pricing-Sheet. Vor Kunden-Angeboten muss der Microsoft-Account-Manager bestätigen.

## Konkrete Konfiguration (Beispiel MAF + MAI)

```python
from agent_framework import ChatAgent
from agent_framework.azure import AzureOpenAIChatClient

# Statt foundry-models/gpt-4o:
agent = ChatAgent(
    chat_client=AzureOpenAIChatClient(
        deployment_name="mai-thinking-1",  # Foundry-Deployment-Name
        api_version="2026-06-01",
    ),
    instructions="Du bist ein Vertrags-Analyst...",
)
```

**Wichtig:** Foundry behandelt MAI-Modelle wie jedes andere Deployment — gleiche SDKs, gleiche API-Surface. Migration von GPT-4o → MAI-Large ist eine **einzige Konfigurations-Zeile**.

## Häufige Stolpersteine

1. **MAI ≠ Drop-in für alle GPT-4o-Prompts.** System-Prompts müssen oft leicht angepasst werden (MAI versteht Microsoft-spezifische Konzepte besser, generische Prompts sind unzuverlässiger).
2. **MAI-Thinking-1 ist langsam.** Chain-of-Thought-Latenz 3–8 Sekunden pro Antwort — nicht für UI-Echtzeit-Chat geeignet, sondern für Hintergrund-Analyse.
3. **PTU-Kapazitäts-Pre-Buy in CH-North fehlt** bis Q4/2026. Bei hohem Volumen vor Q4 muss man in West-Europe deployen (DSGVO-Sicht OK, FINMA grenzwertig).
4. **MAI-Voice-2 hat keinen Schweizerdeutsch-Support** (nur Hochdeutsch). Für Voice-Use-Cases auf SwissGerman bei Anthropic / ElevenLabs bleiben.

## Empfehlungs-Logik (Beratungs-Baum)

```
Kunde fragt nach Modell-Empfehlung:
├── regulierte Branche (Bank, Versicherung, Health, öffentlich)?
│   ├── ja  → MAI-First (Single-Vendor-DPIA)
│   │        Ausnahme: Anthropic-Aktivierung wenn schon DPIA gemacht
│   └── nein → wahlweise MAI / OpenAI / Anthropic je Use-Case
├── Use-Case Reasoning-intensiv (Vertragsanalyse, Recherche)?
│   ├── ja  → MAI-Thinking-1 oder Claude 4
│   └── nein → MAI-Large oder GPT-4o
├── Use-Case Coding?
│   ├── Standard-Code  → MAI-Code-1 (Flash)
│   └── komplexes Refactoring → Claude 4 (Anthropic noch besser, 6 Mo Vorsprung)
└── Voice-Use-Case mit Schweizerdeutsch?
    └── nicht MAI (kein SwissGerman) → Anthropic + ElevenLabs
```

## Vertiefungsbedarf (2-Tage-Aufwand)

- [ ] Konkrete Benchmark-Zahlen vs. GPT-5 + Claude 4 für unsere typischen Use-Cases sammeln (POC: Vertrags-Q&A, Code-Review, Recherche-Synthese)
- [ ] EU-Region-Verfügbarkeit pro Einzelmodell prüfen — Update bei Microsoft Q3/2026 Region-Roadmap
- [ ] DPIA-Template-Update für MAI (Single-Vendor-Argument formell ausgearbeitet)
- [ ] Vergleich PTU-Kapazitäts-Reservierung MAI vs OpenAI — Cost-Modell für 3 unserer Bestandskunden durchrechnen

## Quellen

- Microsoft Build 2026 Keynote (Satya Nadella, 2. Juni 2026)
- [news.microsoft.com/build-2026](https://news.microsoft.com/build-2026/)
- [windowsnews.ai — MAI Models Deep-Dive](https://windowsnews.ai/article/build-2026-microsoft-mai-models-foundry-control-plane-and-the-push-for-ai-optionality-beyond-openai.421932)
