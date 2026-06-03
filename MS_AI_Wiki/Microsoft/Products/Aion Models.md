---
watch: open
status: stub_build_2026
last_verified: 2026-06-03
source: build-2026-keynote
aliases:
  - Aion Instruct
  - Aion Plan
  - Windows AI APIs
moc:
  - '[[Microsoft MOC]]'
  - '[[Foundry MOC]]'
zuletzt_gesichtet: 2026-06-03
updated: 2026-06-03
---

# Aion Models

*Eingebaute On-Device-Modelle in Windows AI APIs — vorgestellt auf Build 2026. Zwei Modelle: Aion Instruct (Summarization / Light-Tasks) und Aion Plan (14B, 32K Context, Tool-Calling Reasoning).*

> **Analogie:** Was [[Foundry Local]] für selbst-gehostete Foundry-Modelle ist, sind Aion Models für die Windows-OS-Ebene — bereits installiert, sofort nutzbar, kein Setup.

---

## Modelle im Überblick

| Modell | Parameter | Context | Use-Case |
|---|---|---|---|
| **Aion Instruct** | klein (genaue Zahl tba) | Standard | Summarization, Rewrites, Intent-Klassifikation, Accessibility |
| **Aion Plan** | 14B | 32K Tokens | Reasoning + Tool-Calling, mehr-Schritt-Aufgaben |

## Status

- GA mit Windows 12 24H2 Update (Ende 2026)
- Bestandteil der Windows AI APIs Framework
- Free of charge (kein Inference-Cost — läuft on-device)

## Wo passt es in die Architektur?

- **Layer:** FOUNDATION (gleiche Schicht wie Foundry Local)
- **Verbindungen:**
  - `calls` ← Windows-native AI Apps (über Windows AI APIs)
  - alternative zu Foundry Models bei latenz-kritischen / offline-Use-Cases

## Beratungs-Relevanz für Journai

**Mittel-hoch — für Kunden mit Daten-Lokalität-Anforderungen.**

Unterschied zu Foundry Local:
- **Foundry Local:** beliebige Modelle, läuft im Foundry-Lokal-Container, mehr Flexibilität
- **Aion Models:** Microsoft-vorinstalliert, nutzbar via Windows AI API, kein Container-Setup

Empfehlung:
- Branchen mit strikter Daten-Lokalität (Anwaltskanzleien, Behörden) → Aion als Default
- Branchen mit Custom-Modell-Anforderungen → Foundry Local
- Kombination: Aion für leichte Tasks, Foundry Local für komplexe Workloads

## Vertiefungsbedarf (0.5-Tag-Aufwand)

- [ ] Exakte Aion Instruct Parameter-Zahl
- [ ] Performance-Benchmarks
- [ ] Hardware-Voraussetzungen (NPU? GPU?)
- [ ] Verfügbarkeit auf Windows Server

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [theneuron.ai — Build 2026](https://www.theneuron.ai/explainer-articles/everything-microsoft-announced-at-microsoft-build-2026-explained/)
