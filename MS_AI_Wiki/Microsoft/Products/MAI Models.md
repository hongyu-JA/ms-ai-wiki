---
watch: open
status: stub_build_2026
last_verified: 2026-06-08
azure_verified: 2026-06-08
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
zuletzt_gesichtet: 2026-06-08
updated: 2026-06-08
---

# MAI Models

*Microsoft's eigene First-Party-Modellfamilie, vorgestellt auf Build 2026 — sieben spezialisierte Modelle, die als Drop-in-Alternativen zu OpenAI / Anthropic in Foundry, Copilot, GitHub und Windows zur Verfügung stehen.*

> **Analogie:** Was Phi für kleine on-device-Modelle war, sind MAI für die ganze Modell-Wertschöpfungskette. Microsofts Antwort auf die "Vendor-Lock-in"-Kritik der OpenAI-Abhängigkeit.

---

## ⚠ POC-Verifikation gegen echtes Azure-Catalog (2026-06-08)

**Hands-on geprüft auf Journai-Core Subscription (Azure AI Foundry, Switzerland North + West Europe).** Ergebnis: **erhebliche Diskrepanz zwischen Keynote-Berichten und realem Modell-Catalog.**

| Behauptung in Keynote-Recap | Reale Azure-Catalog-Situation (2026-06-08) |
|---|---|
| 7 MAI-Modelle (Thinking-1, Code-1, Large, Small, Embed, Voice-2, Transcribe-1.5) | **Keines dieser Modelle existiert im Catalog.** Einziges MAI-Modell: `MAI-DS-R1` |
| MAI als aktive First-Party-Familie | `MAI-DS-R1` ist **`lifecycleStatus: Deprecated`** — Inference-EOL war **2026-02-27** (vor 3 Monaten) |
| MAI-Large als GPT-4o-Drop-in (Preview) | nicht vorhanden — stattdessen sind **GPT-5.1 / GPT-5.4 / GPT-5-nano** real deployt |
| Microsoft-First-Party-Reasoning via MAI | reale First-Party-Modelle sind die **Phi-Familie** (Phi-3 / Phi-3.5 / Phi-4 / Phi-4-reasoning) |

**Schlussfolgerung:** Die 7 MAI-Modellnamen im Recap stammen aus Drittquellen-Berichten (theneuron.ai, windowsnews.ai) und sind **nicht durch Azure verifiziert**. Mögliche Erklärungen: (1) Marketing-Namen ≠ Catalog-Namen, (2) Rollout-Verzögerung Keynote → GA, (3) Berichte ungenau.

**Beratungs-Konsequenz — WICHTIG:** Bis zur Verifikation **keinem Kunden „MAI-Large" oder „MAI-Thinking-1" als verfügbares Modell empfehlen.** Real verfügbare Microsoft-First-Party-Optionen sind heute: **Phi-4 / Phi-4-reasoning** (klein, on-device-tauglich) und als Drop-in-Alternativen zu OpenAI die real deployten **GPT-5.x**. Die „MAI-First für regulierte Kunden"-Empfehlung muss umformuliert werden zu **„Phi-4 + GPT-5.x in CH-North-Foundry"**.

> **Status bleibt bewusst `stub_build_2026`** — diese Note ist erst `ga`, wenn entweder die MAI-Modelle real im Catalog erscheinen oder wir den Recap auf Phi/GPT-5 umgeschrieben haben.

---

## Modell-Familie (laut Keynote-Recap — ⚠ NICHT Azure-verifiziert, siehe oben)

| Modell | Kategorie | Status laut Recap | Azure-Catalog 2026-06-08 |
|---|---|---|---|
| **MAI-Thinking-1** | Reasoning | Preview | ❌ nicht vorhanden |
| **MAI-Code-1** | Coding | Rolling Out | ❌ nicht vorhanden |
| **MAI-Image-2.5** | Image | GA | ❌ nicht vorhanden |
| **MAI-Transcribe-1.5** | Speech-to-Text | GA | ❌ nicht vorhanden |
| **MAI-Voice-2** | TTS | GA | ❌ nicht vorhanden |
| **MAI-Small / MAI-Large** | Allzweck | Preview | ❌ nicht vorhanden |
| **MAI-Embed** | Embeddings | Preview | ❌ nicht vorhanden |
| **MAI-DS-R1** | Reasoning (DeepSeek-basiert) | — (nicht im Recap) | ⚠ vorhanden, aber **Deprecated** (EOL 2026-02-27) |

### Real verfügbare Microsoft-First-Party-Modelle (Azure-verifiziert)

| Modell | Format | Region (geprüft) | Status |
|---|---|---|---|
| **Phi-4** | Microsoft | Switzerland North | aktiv |
| **Phi-4-reasoning** | Microsoft | Switzerland North | aktiv |
| **Phi-4-mini-instruct** | Microsoft | Switzerland North | aktiv |
| **Phi-4-multimodal-instruct** | Microsoft | Switzerland North | aktiv |
| **Phi-3.5-MoE / mini / vision** | Microsoft | Switzerland North | aktiv |
| **GPT-5.4 / 5.1 / 5-nano** | OpenAI | West Europe (dev deployt) | aktiv |

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
- **Nachher (⚠ siehe POC-Verifikation oben — MAI-Modelle NICHT Azure-verifiziert):** Real heute empfehlbar: "Phi-4 / Phi-4-reasoning für First-Party-Reasoning, GPT-5.x als Allzweck-Modell, Claude bei DPIA-Aktualisierung. MAI-Modelle erst empfehlen, wenn sie real im Catalog erscheinen."

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
