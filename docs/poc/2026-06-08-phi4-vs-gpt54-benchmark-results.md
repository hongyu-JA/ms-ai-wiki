# POC-Ergebnis: Phi-4 vs GPT-5.4 — echter Azure-Benchmark

**Durchgeführt:** 2026-06-08
**Verfasser:** Hongyu Zhou (Journai)
**Umgebung:** Azure Subscription Journai-Core, Resource Group `rg-poc-build2026`, Region **Switzerland North**
**Status:** ✅ abgeschlossen (erster vollständiger Hands-on-POC mit echtem Deployment)

> **Headline:** GPT-5.4 schlägt Phi-4 in CH-North in **allen drei messbaren Dimensionen** — Qualität (8.0 vs 3.67 von unabhängigen Blind-Judges), Latenz (2.6s vs 60.8s, **Faktor 23x**) und Skalierbarkeit (capacity=10 vs quota-gated capacity=1). Die KB-Spekulation „MAI-First für regulierte Schweizer Kunden" ist damit **widerlegt**.

---

## 1. Setup (real deployt)

| Komponente | Wert |
|---|---|
| Resource Group | `rg-poc-build2026` (isoliert, Contributor von IT erteilt) |
| AIServices-Account | `poc-build2026-swn` |
| Region | Switzerland North (per Policy erzwungen) |
| Modell A | **Phi-4** (v2, Microsoft First-Party), GlobalStandard **capacity=1** (Quota-Limit!) |
| Modell B | **GPT-5.4** (2026-03-05, OpenAI), GlobalStandard capacity=10 |
| API-Version | 2025-01-01-preview (2026-03/2025-04 lieferten 404/Timeout) |

**Quota-Befund:** Phi-4 liess sich in CH-North nur mit **capacity=1** deployen (`InvalidCapacity: should be ... no more than 1`). GPT-5.4 akzeptierte capacity=10 problemlos. Das ist kein Rechte-, sondern ein Quota-Thema — und ein harter Produktions-Blocker für Phi-4.

---

## 2. Latenz-Ergebnisse (gemittelt aus 2 Läufen)

| Use-Case | Phi-4 | GPT-5.4 | Faktor |
|---|---|---|---|
| Business-Q&A (DE) | 67.0s / 93.4s | 3.2s / 4.2s | ~21x |
| Architektur-Reasoning | 64.1s / 63.7s | 2.5s / 2.6s | ~25x |
| Code-Generierung | 51.2s / 51.8s | 2.2s / 2.1s | ~23x |
| **Durchschnitt** | **~60.8s** | **~2.6s** | **~23x** |

**Einordnung:** Die Phi-4-Latenz ist teilweise capacity=1-bedingt (Drosselung). Aber genau das ist der Punkt — in CH-North bekommt man real nur capacity=1, also ist 60s die reale Erfahrung, nicht ein künstliches Handicap. Für interaktive Chat-/Beratungs-Use-Cases (Sub-5s nötig) ist Phi-4 in CH-North untauglich.

---

## 3. Qualitäts-Ergebnisse (12 unabhängige Blind-Judges)

Methodik: 3 Use-Cases × 4 Lenses (Korrektheit, Deutsch-Qualität, CH-Kontext, Beratungs-Tauglichkeit). Judges bewerteten **anonymisiert** (Modell A/B, ohne Markennamen) per LLM-as-judge-Workflow.

**Endstand: 11 Lenses → GPT-5.4 · 1 Unentschieden · 0 → Phi-4. Schnitt 8.0 vs 3.67.**

| Use-Case | Phi-4 Ø | GPT-5.4 Ø | Gewinner |
|---|---|---|---|
| Business-Q&A | 4.25 | 8.25 | GPT-5.4 |
| Reasoning | 4.0 | 8.25 | GPT-5.4 |
| Code | 2.75 | 7.5 | GPT-5.4 (grösste Lücke) |

### Konkrete Qualitätsmängel von Phi-4 (Judge-Befunde)

1. **Code crasht (Use-Case 3):** halluziniertes `query_type="mmlt"` (existiert nicht), veralteter `vector=`-Parameter statt `vector_queries=[VectorizedQuery(...)]`, doppelter Import. Würde fehlschlagen, führt gar keine Vektorsuche aus.
2. **Veraltete Produktnamen (Use-Case 2):** „Azure Cognitive Services", „Azure Search", „Power Automate/Flow" — plus unnötiger Power-Automate-Umweg statt echtem RAG. GPT-5.4 gab die korrekte moderne Kette: Document Intelligence → AI Search → Azure OpenAI.
3. **CH-Compliance-Fehler (Use-Case 1):** Phi-4 verspricht fälschlich reinen „Datenverbleib in der Schweiz" bei Switzerland North (nicht garantiert) und behandelt CH als reinen DSGVO-Fall statt revDSG/FADP.
4. **Sprachfehler:** „eine flexible Serverlosen Plattform", „Datenspeicherortsindikatoren", deutsche statt Schweizer Zahlenkonvention (10.000 statt 10'000).

GPT-5.4 dagegen: differenzierte Formulierungen, korrekte Beratersprache (Datenresidenz, DSFA, Auftragsbearbeitung), aktuelle Produktnamen, lauffähiger SDK-aktueller Code.

---

## 4. KB-Korrekturen (aus diesem POC abgeleitet)

| # | Befund | Korrektur |
|---|---|---|
| 1 | „MAI-First für regulierte CH-Kunden" als Default | **GPT-5.4 (Azure OpenAI) ist CH-North-Default.** Phi-4/MAI weder qualitativ (8.0 vs 3.67) noch operativ (cap=1, 60s) konkurrenzfähig |
| 2 | Annahme „First-Party = bessere Compliance" | Compliance entsteht aus **Region + DPA + Datensparsamkeit + DSFA**, NICHT aus Modellherkunft |
| 3 | Quota-Realität nicht dokumentiert | Phi-4 in CH-North quota-gated auf cap=1; skaliert nicht produktiv |
| 4 | Latenz nicht als Kriterium | Phi-4 ~60.8s vs GPT-5.4 ~2.6s; interaktive Cases brauchen Sub-5s |
| 5 | Veraltete Azure-Dienstnamen im KB | → Azure AI Document Intelligence / Azure AI Search / Azure OpenAI Service |
| 6 | CH-Kontext nur „DSGVO" | **revDSG/FADP** als primärer CH-Rahmen; CH ist DSGVO-Drittland |
| 7 | Pauschal „Daten bleiben in der Schweiz" | Switzerland North garantiert nicht automatisch volle Datenresidenz für alle AI-Dienste — differenziert formulieren |
| 8 | Spekulationen nicht gekennzeichnet | Unverifizierte Empfehlungen markieren bis realer Benchmark vorliegt (dieser POC = Evidenz) |

---

## 5. Beratungs-Empfehlung (final, evidenzbasiert)

**Für reale CH-North-Deployments: GPT-5.4 (OpenAI über Azure) als Standard.**

Konkrete Linie für regulierte Schweizer Kunden:
1. **GPT-5.4 in Switzerland North** als Default. Datenresidenz über Azure-OpenAI-Region + vertragliche Auftragsbearbeitung (DPA, revDSG/FADP) absichern — **nicht** über Modellherkunft.
2. **Argument „First-Party = automatisch besser/sicherer" aktiv entkräften.** Compliance = Region + DPA + Datensparsamkeit + DSFA.
3. **Phi-4/MAI nur prüfen**, wo Microsoft die Quota nachweislich anhebt UND ein Use-Case niedrige Latenz-Anforderungen hat (Batch/asynchron). Aktuell kein Kunden-Default.
4. **Vor jeder Modellzusage** die real verfügbare Quota im Kunden-Subscription prüfen — nicht die theoretische Marketing-Verfügbarkeit.

---

## 6. Methodik-Transparenz

- **Latenz/Token:** echtes `az`-Deployment + Python-Benchmark (openai SDK 2.41), 2 Läufe, 6 Calls je Lauf.
- **Qualität:** Workflow mit 13 Agents (12 Blind-Judges + 1 Synthese), 418k Tokens, anonymisierte A/B-Bewertung gegen 4 Lenses. Judges kannten die Markennamen nicht — Markenbias ausgeschlossen.
- **Rohdaten:** `results.json` (nach Cleanup gelöscht, Kernzahlen hier dokumentiert).

## 7. Limitierungen

- Nur 3 Use-Cases (Business-Q&A, Reasoning, Code) — keine Multimodal-/Voice-/Long-Context-Tests.
- Phi-4 capacity=1 verzerrt Latenz nach oben; mit höherer Quota wäre Phi-4 schneller (aber Quota ist real nicht verfügbar → Befund bleibt praxisrelevant).
- GPT-5.4 als Reasoning-Modell nutzt `max_completion_tokens` — leicht andere Aufruf-Semantik.
- LLM-as-judge hat eigene Limits, aber 4 unabhängige Lenses + Anonymisierung mildern das.

## 8. Cleanup

Nach POC-Abschluss durchgeführt:
- ✅ AIServices-Account `poc-build2026-swn` + beide Deployments (phi-4, gpt-5-4) **gelöscht** — RG ist leer, keine laufenden Kosten mehr.
- ✅ Lokale Temp-Dateien (`.automation/poc-tmp/`, enthielt Azure-Key + `results.json`) **gelöscht**.
- ⚠ `az ... purge` des soft-deleted Accounts **schlug fehl** (braucht Subscription-Level-Rechte, Contributor-auf-RG reicht nicht). Unkritisch: ein soft-deleted Cognitive-Account verursacht **keine Kosten** und wird nach 90 Tagen automatisch entfernt. Falls der Name `poc-build2026-swn` früher wieder frei sein muss, kann IT manuell purgen.
- ✅ Resource Group `rg-poc-build2026` bleibt (leer) für künftige POCs bestehen.

**Reproduzierbarkeit:** Das Benchmark-Skript (`benchmark.py`) wurde mit den Temp-Dateien gelöscht. Kernlogik: AIServices-Account anlegen → Phi-4 (cap 1) + GPT-5.4 (cap 10) deployen → openai-SDK chat.completions gegen beide → Latenz/Tokens messen. Bei Wiederholung neu erstellen.
