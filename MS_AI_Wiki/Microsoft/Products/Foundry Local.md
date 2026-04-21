---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [Windows AI Foundry]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Foundry Local

*Lokale **Modell-Inference auf Windows-Geräten** (CPU/GPU/NPU). OpenAI-kompatible API. Offline-fähig. MCP-Support lokal. **Hochgradig SMB-relevant** für (1) DSGVO/Datenschutz, (2) Offline-Szenarien, (3) Kostenoptimierung bei hohem Volumen, (4) Privacy-sensitive Branchen (Arzt, Anwalt, Steuerberater).*

> **Analogie:** Was Ollama für lokale Modelle auf Linux/Mac ist — nur mit MS-Support, NPU-Nutzung auf Copilot+-PCs und OpenAI-API-Kompatibilität für Drop-in.

## Einsatz

**JTBD:** When I sensitive Daten nicht in die Cloud geben darf oder offline arbeiten muss, I want to Modelle lokal laufen lassen mit einer API, die zur Cloud-Variante kompatibel ist, so I can denselben Agent-Code gegen Cloud oder Local laufen lassen (Hybrid-Pattern).

**Trigger-Signale:**
- „Unser Kunde ist ein Steuerberater, DSGVO verlangt keine Cloud-Verarbeitung."
- „Außendienst-Team mit instabilem Netz braucht Offline-Agent."
- „Token-Volumen wird zu teuer, wir wollen kleine Modelle lokal."

**Kritische Fragen (Arbeitsauftrag §2.6):** Welche Modelle lokal? Hardware-Mindestanforderungen (NPU-Bedarf für Copilot+ PCs)? Wann lokal, wann Cloud? Hybrid-Pattern?

**Empfehlung:** 🟢 für privacy-sensitive Branchen und Offline-Szenarien. 🟡 als General-Purpose-Ersatz für Cloud — Modell-Qualität variiert, nicht alle Frontier-Modelle lokal.

## Status & Pricing

- **Status:** GA (Foundry Local) · Windows AI Foundry ist die Windows-Integration
- **Pricing:** **kostenlos** (Hardware ist der Kostenpunkt)
- **Hardware:** NPU auf Copilot+-PCs für beste Performance; CPU/GPU fallback

## Kernkonzept

Foundry Local exposed lokal **OpenAI-kompatible REST-API**. Apps/Agents reden dieselbe Sprache wie mit Cloud-Endpoint. Modelle werden von einem Katalog heruntergeladen (Phi-Familie als MS-Flaggschiff lokal, auch andere Open-Weight Modelle). **MCP-Support lokal** macht Foundry Local zu einem vollwertigen Tool-Ziel für Agents.

### Hybrid-Pattern

Gängiger Einsatz: **Chat/Agent läuft lokal** (PII bleibt auf Gerät), bei unbekannten Fragen fallback in Cloud-Modell mit PII-Redaction. Oder: **Screening lokal** (ist die Frage sensitiv?), **Antworten cloudbasiert** wenn nicht.

## Limitierungen

- **Modell-Qualität** — lokale Modelle sind kleiner, Frontier-Modelle nur in Cloud
- **Hardware-Voraussetzung** — ohne NPU langsam; ältere Geräte ungeeignet
- **Deployment + Updates** — Client-seitiges Update-Management

## Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Foundry Local | https://learn.microsoft.com/en-us/azure/ai-foundry/foundry-local/ | 2026-04-22 |
| Docs | Windows AI Foundry | https://learn.microsoft.com/en-us/windows/ai/ | 2026-04-22 |

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
