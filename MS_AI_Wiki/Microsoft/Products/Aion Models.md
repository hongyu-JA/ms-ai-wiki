---
watch: open
status: stub_build_2026
last_verified: 2026-06-08
azure_verified: 2026-06-08
source: build-2026-keynote
aliases:
  - Aion Instruct
  - Aion Plan
  - Windows AI APIs
moc:
  - '[[Microsoft MOC]]'
  - '[[Foundry MOC]]'
zuletzt_gesichtet: 2026-06-08
updated: 2026-06-08
---

# Aion Models

*Eingebaute On-Device-Modelle in Windows AI APIs — vorgestellt auf Build 2026. Zwei Modelle: Aion Instruct (Summarization / Light-Tasks) und Aion Plan (14B, 32K Context, Tool-Calling Reasoning).*

> **Analogie:** Was [[Foundry Local]] für selbst-gehostete Foundry-Modelle ist, sind Aion Models für die Windows-OS-Ebene — bereits installiert, sofort nutzbar, kein Setup.

---

## ⚠ POC-Verifikation gegen echtes Azure (2026-06-08)

**Read-only geprüft auf Journai-Core (Reader-Rolle).** Aion Instruct / Aion Plan sind **nicht im Azure-Model-Catalog** (Switzerland North) — was korrekt ist, da Aion eine **Windows-12-On-Device-Komponente** ist (Windows AI APIs), kein Azure-Cloud-Modell. Eine echte Verifikation braucht daher ein **Copilot+ PC mit Windows 12**, nicht Azure.

**Stand der Dinge:** Die Aion-Modellnamen stammen aus Keynote-Berichten und sind weder über Azure noch (mangels Hardware) on-device verifiziert. Real verfügbare On-Device-/Edge-First-Party-Modelle, die wir HEUTE über Foundry Local nutzen könnten, sind die **Phi-4-Familie** (Phi-4-mini-instruct, Phi-4-multimodal-instruct) — Azure-Catalog-bestätigt.

> **Status bleibt `stub_build_2026`** — verifizierbar erst mit Windows-12-Hardware.

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

## Hardware-Voraussetzungen (laut Build-Keynote)

- **Copilot+ PC:** zwingend (NPU mit ≥ 40 TOPS)
- **RAM:** mindestens 16 GB für Aion Plan
- **Speicher:** ca. 8 GB zusätzlich für Modelle
- **Aion Instruct** läuft auch auf älteren NPU-Generation (20 TOPS)
- **Aion Plan** braucht volle 40 TOPS für akzeptable Latenz
- **Windows Server:** Aion-Verfügbarkeit unklar, Microsoft prüft

## Konkrete API-Nutzung

```python
# Windows AI APIs (in jedem Windows-12-App verfügbar)
import winai

# Aion Instruct — Summarization
summary = winai.summarize(text, model="aion-instruct", max_tokens=200)

# Aion Plan — Reasoning mit Tool-Calling
agent = winai.AionAgent(model="aion-plan", tools=[...])
response = await agent.run("Analysiere den Vertrag in C:/docs/...")
```

Keine API-Keys nötig — Authentifizierung über Windows-User-Context.

## Use-Cases (typische Szenarien)

1. **Anwaltskanzlei:** lokaler Vertrags-Reviewer-Bot — Verträge bleiben auf Anwalts-Laptop
2. **Treuhand:** Steuer-Akten-Klassifikation — Daten dürfen Schweiz nicht verlassen
3. **Health-Care:** Patienten-Akten-Summary — KIS-Daten lokal verarbeiten
4. **Field-Service:** Techniker im Tunnel/Mine ohne Netzwerk — Offline-Q&A
5. **Government:** Verschlussache-Bearbeitung — Air-Gap-Kompatibilität

## Vergleich Aion vs Foundry Local

| Aspekt | Aion Models | Foundry Local |
|---|---|---|
| Setup-Aufwand | null (vorinstalliert) | Container-Setup, Modell-Download |
| Modell-Auswahl | 2 fixe Microsoft-Modelle | beliebige Foundry-Modelle (Phi, Llama, MAI, ...) |
| API-Surface | Windows AI APIs | Foundry SDKs (gleich wie Cloud) |
| Pricing | gratis mit Windows 12 | gratis (open-source Modelle) |
| Update-Strategie | Windows Update | manueller Container-Push |
| Cross-Platform | nur Windows | Windows / macOS / Linux |
| Empfohlen für | Endbenutzer-Workflows | Custom Server-Workloads |

## Häufige Stolpersteine

1. **Aion läuft NICHT auf alten Laptops.** Copilot+ PC ist Voraussetzung — Pre-2024-Hardware fällt raus. Für Banken-Kunden mit alter Hardware-Generation muss man **Hardware-Refresh-Plan** mit in die Beratung nehmen.
2. **Modell-Updates kommen mit Windows Update.** Kein Pinning auf alte Version — wenn ein Modell-Update Verhalten ändert, müssen Apps reagieren.
3. **Aion Plan ist 14B — nicht GPT-4o-Niveau.** Reasoning-Qualität liegt zwischen Phi-4 und GPT-4o-mini. Für komplexes Reasoning Cloud-Fallback nötig.
4. **Schweizerdeutsch:** wie MAI-Voice, kein nativer Dialekt-Support.

## Schweizer Compliance-Implikationen

- **FADP / DSGVO:** **dramatische Vereinfachung** — Daten bleiben on-device, kein Datenverkehr, keine DPA, kein DPIA
- **FINMA-Rundschreiben 2023/01:** Outsourcing-Anforderungen entfallen, weil kein Outsourcing stattfindet
- **Audit-Trail:** Microsoft loggt nichts — Audit muss applikativ durch die App selbst gemacht werden
- **HIPAA (für CH-Health-Care relevant):** Aion ist HIPAA-tauglich, weil keine Daten Microsoft erreichen

**Beratungs-Pitch:** _"für eure 50 Anwälte ist Aion + Windows 12 Refresh günstiger als ein Cloud-Setup mit FINMA-Audit."_ Konkrete Rechnung für mittlere Kanzlei: CHF 80'000 Hardware vs CHF 30'000/Jahr Cloud-Compliance-Overhead.

## Vertiefungsbedarf (0.5-Tag-Aufwand)

- [ ] Hands-on POC auf Copilot+ PC sobald verfügbar — Latenz, Qualität messen
- [ ] Vergleich Aion Plan vs Phi-4 vs MAI-Small bei Schweizer Vertrags-Q&A
- [ ] Hardware-Refresh-Cost-Modell für 3 Bestandskunden durchrechnen
- [ ] Windows-Server-Variante mit Microsoft klären

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [theneuron.ai — Build 2026](https://www.theneuron.ai/explainer-articles/everything-microsoft-announced-at-microsoft-build-2026-explained/)
