---
watch: passive
status: ga
last_verified: 2026-04-22
aliases: [Azure OpenAI Pricing, AOAI Pricing, PTU, PAYG, Batch API]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
  - "[[Licensing & SKUs MOC]]"
---

# Azure OpenAI Service Pricing

*Die **drei Bezahlmodelle** für Azure OpenAI: **PAYG** (Pay-as-you-go, per Token), **PTU** (Provisioned Throughput Units — reservierte Kapazität), **Batch API** (50 % günstiger, 24 h Latenz-SLA). Wissen, wann welches Modell wirtschaftlich ist, bestimmt ob ein AI-Workload profitabel läuft oder die Cloud-Rechnung eskaliert.*

> **Analogie:** Wie bei Stromtarifen — PAYG ist Grundversorger (teurer pro kWh, keine Commitment), PTU ist Festkontingent mit Rabatt (günstiger pro kWh ab gewissem Verbrauch), Batch ist Nachtstrom (günstig, aber Zeit-gebunden).

---

## Einsatz

**JTBD:** When I ein AI-Workload plane, I want to wissen welches Pricing-Modell für mein Volumen + Latenz-SLA das günstigste ist, so I can Break-Even-Berechnungen vor Kauf machen und keine Überraschungen am Monatsende bekomme.

**Trigger-Signale:**
- „Unser AOAI-Bill ist letzten Monat auf $5k hochgeschossen — was macht ihr?"
- „Wir planen einen Agent mit 100k Requests/Tag — PAYG oder PTU?"
- „Können wir Nachtjobs günstiger fahren?"

**Empfehlung:** 🟡 Als Entscheidungs-Referenz bei Pricing-Fragen zu Kunden-Gesprächen mitnehmen — nicht als eigenständiger Beratungsanlass.

---

## Status & Pricing

- **PAYG**: Pro 1M Input-/Output-Tokens, modellabhängig (z. B. GPT-4.1: $2 in / $8 out). [Azure OpenAI Pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/)
- **PTU**: Reservierte Durchsatz-Einheiten. Minimum 50 PTU für GPT-4.1. Preis pro PTU/Monat variiert, aber **Break-Even ab ~$1.5k/Monat konstanten PAYG-Volumens**
- **Batch API**: 50 % Rabatt gegenüber PAYG, aber **24 h Latenz-SLA** — ungeeignet für interaktive Agents

---

## Kernkonzept

Drei Dimensionen entscheiden:

1. **Volumen** — PAYG bis ~10k req/h, dann PTU
2. **Latenz-SLA** — interaktiv (< 5 s) → PAYG/PTU, async (> 24 h OK) → Batch
3. **Region** — nicht alle Modelle in allen Regionen. EU-relevant: Sweden Central, West Europe, Switzerland North

### Break-Even PAYG → PTU

Daumenregel: **ab ~$1.5k/Monat konstantem PAYG-Verbrauch** rechnet sich 50 PTU. Exakte Rechnung via Azure Pricing Calculator nötig.

### Hidden Costs

- **Region-Gap-Aufschlag** — Multi-Region-Deployments verdoppeln Betrieb
- **Logging-Volumen** (App Insights / Foundry Tracing) — bei hohem Volumen separat rechnen
- **Filter / Safety** — Prompt Shields + Content Safety zählen separat

---

## Limitierungen & Fallstricke

- **PTU-Capacity nicht immer verfügbar** — vor Commit mit MS-Account-Team abklären
- **Model-Switch bricht PTU** — PTU ist modell-gebunden, Model-Update braucht neue PTU-Reservation
- **Batch API vs. PTU nicht kombinieren** — entweder Batch für Async oder PTU für Steady-State, Mix unwirtschaftlich

### Fallstricke

- **„PTU ist immer günstiger"** — nein, nur bei konstantem Volumen über Break-Even. *Gegenmittel: 2-Wochen PAYG-Baseline messen, dann hochrechnen.*
- **„Batch ist für alles Async"** — Batch-Verarbeitung ist Best-Effort binnen 24 h, keine Garantie. *Gegenmittel: kritische Async-Jobs nicht auf Batch setzen.*

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Azure OpenAI Pricing | https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/ | 2026-04-22 |
| Docs | PTU Onboarding Guide | https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/provisioned-throughput-onboarding | 2026-04-22 |
| Docs | Batch API | https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/batch | 2026-04-22 |
| Tool | Azure Pricing Calculator | https://azure.microsoft.com/en-us/pricing/calculator/ | 2026-04-22 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub (Tier 3 Awareness) |
