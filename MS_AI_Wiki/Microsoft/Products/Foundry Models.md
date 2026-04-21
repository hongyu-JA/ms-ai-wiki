---
watch: close
status: ga
last_verified: 2026-04-22
aliases: [Model Catalog, Foundry Model Catalog]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
---

# Foundry Models

*Der **Model Catalog** innerhalb [[Microsoft Foundry]] — 11.000+ Modelle: OpenAI, Anthropic (Claude 4.6), Meta, DeepSeek V3.2, Grok 4, Phi, Mistral. Drei Deployment-Modi: **PAYG / MaaS / PTU**.*

## Einsatz

**JTBD:** When I ein LLM für eine Anwendung auswähle, I want to aus einem kuratierten Katalog wählen, mit MS-DPA-Absicherung und einheitlicher Billing, so I can ohne direkt mit OpenAI/Anthropic zu kontraktieren die Breite der Modelle nutze.

**Kritische Fragen (Arbeitsauftrag §2.6):** Welche Modelle für uns relevant? Welche EU-Region? Serverless vs. MaaS vs. PTU — Unterschiede? Ab wann PTU vs. PAYG?

**Empfehlung:** 🟢 als Standard-Modell-Bezugsquelle für Azure-Kunden.

## Status & Pricing

- **Status:** GA
- **PAYG:** pay-per-token
- **MaaS (Models-as-a-Service):** abonnement-basiert für Drittanbieter-Modelle
- **PTU (Provisioned Throughput Units):** reservierte Kapazität ab ~$1.5k/Monat, lohnt bei konstantem Volumen + Latenz-SLA
- **EU-Region:** *{TODO: Modell-weise Availability-Matrix — Claude 4.6 ist EU-technisch begrenzt, GPT-Familie weitgehend EU}*

## Kernkonzept

Foundry Models ist ein **Meta-Katalog**: MS-eigene (GPT via OpenAI-Partnerschaft), Third-Party (Anthropic, Meta), Open-Source (Phi, Mistral, DeepSeek). Drei Konsum-Modi:
1. **Serverless / PAYG** — geteilte Kapazität, pay-per-token, Default-Einstieg
2. **MaaS** — Abonnement-Modell für Anbieter-Modelle, teils eigene Pricing-Logik
3. **PTU** — reservierte Kapazität, garantierte Latenz, attraktiv ab ~10k req/h oder strikten SLAs

## Limitierungen

- **Regionale Verfügbarkeit** ungleich — nicht jedes Modell in jeder Region
- **Anthropic-Claude in EU/EFTA/UK default deaktiviert** (Admin-Center-Schalter)

## Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Docs | Model Catalog | https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/model-catalog-overview | 2026-04-22 |
| Pricing | Foundry Pricing | https://azure.microsoft.com/en-us/pricing/details/ai-foundry/ | 2026-04-22 |

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-22 | Hongyu | Initial Stub |
