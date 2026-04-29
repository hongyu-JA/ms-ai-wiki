---
type: moc
tags: [moc, microsoft, commercial, licensing]
last_verified: 2026-04-29
---

# Licensing & SKUs MOC

*Commercial-Querschnitts-MOC. Bündelt alle kommerziell relevanten Produkte: **Microsoft 365 E7** (Dach, $99/user/month, ab 01.05.2026 EUR-Pricing erwartet), **Wave 3** (Feature-Release-Kadenz), **Frontier Program** (Early-Adopter), **Copilot-Lizenz**, **Azure OpenAI Pricing** (PAYG/PTU/Batch). Hier wird geklärt, was der Kunde kaufen muss, um überhaupt zu spielen.*

---

## Zweck

Einstieg für alle **Angebots- und Pricing-Fragen**. Eine Stelle, an der Bundle-Zusammensetzungen, Co-Terming, CSP-Promos, EUR-vs-USD-Pricing und Upgrade-Pfade konsolidiert sind.

---

## Landkarte — die kommerzielle Struktur

```
┌────────────────────────────────────────────────────────────────────┐
│  DACH-BUNDLE                                                       │
│  [[Microsoft 365 E7]]  — $99/user/month                           │
│    = E5 + Copilot + Entra Suite + Agent 365                       │
│    + Wave 3 Features (Cowork, Edit, Multi-Model)                  │
├────────────────────────────────────────────────────────────────────┤
│  RELEASE-KADENZ                                                    │
│  [[Wave 3]] — aktuelle Feature-Welle (Cowork, Edit, Multi-Model,  │
│                Work IQ)                                            │
├────────────────────────────────────────────────────────────────────┤
│  EARLY-ADOPTER                                                     │
│  [[Frontier Program]] — Preview-Zugang zu nicht-GA-Features       │
├────────────────────────────────────────────────────────────────────┤
│  STANDALONE-LIZENZEN                                               │
│  Copilot-Lizenz (Teil von E7, auch standalone kaufbar)            │
│  [[Microsoft Entra Suite]] (Teil von E7, auch standalone)         │
│  [[Agent 365]] (Teil von E7, ab GA 01.05.2026)                    │
├────────────────────────────────────────────────────────────────────┤
│  VERBRAUCHS-PRICING                                                │
│  [[Azure OpenAI Service Pricing]]                                 │
│    PAYG (pro Token) · PTU (Provisioned Throughput)                 │
│    Batch API (50% günstiger, async)                                │
│  Foundry Agent Service (managed hosting)                           │
└────────────────────────────────────────────────────────────────────┘
```

---

## Produkte in dieser MOC


<!-- AUTO-INDEX-START: produkte -->

| Produkt | Was es ist (1 Satz) | Tier | Watch |
| ------- | ------------------- | ---- | ----- |
| 🟢 [[Microsoft 365 E7]] | Dach-Bundle: E5 + Copilot + Entra Suite + Agent 365, $99/user/month | T2 | close |

<!-- AUTO-INDEX-END: produkte -->

## Letzte Aktivität

_Jüngste Changelog-Einträge (30 Tage) der Produkte dieser MOC. Auto-generiert — konsistent mit [[Microsoft MOC#Letzte Aktivität]]._

<!-- AUTO-INDEX-START: activity -->

| Datum | Produkt | Änderung | Autor |
| ----- | ------- | -------- | ----- |
| 2026-04-22 | [[Microsoft 365 E7]] | Bundle-Math mit korrekten $60/$30/$12/$15 Einzelpreisen + $99/$90,45 E7-Preis; CSP-Promo-Realität korrigiert (30/40% Copilot-for-All stat… | Hongyu / Deep-Research |
| 2026-04-21 | [[Microsoft 365 E7]] | Initial Stub mit Bundle-Komposition + Claude-EU-Flag | Hongyu |

<!-- AUTO-INDEX-END: activity -->

---

## Kern-Regeln (Pricing + Compliance-Stolperfallen)

1. **E7 vs. E5 + Copilot einzeln** — Rechnung: E5 ($57) + Copilot ($30) + Entra Suite ($12) + Agent 365 ($x) = ~$99+. E7 als Bundle oft neutraler, aber bei SMB-Kunden ohne Agent 365/Entra-Pflicht kann Einzelkauf günstiger sein.
2. **Copilot in EU: Claude default deaktiviert** — muss im Admin Center aktiv eingeschaltet werden. DSGVO-Hintergrund von MS nicht explizit kommentiert → Vorsicht bei regulierten Kunden.
3. **EUR-Pricing ab 01.05.2026 erwartet** — Kunden, die jetzt kaufen wollen, bekommen USD-Rechnungen; Wechselkurs-Risiko relevant.
4. **CSP-Promos** — typisch 10%/15%/15% (Jahr 1 / 2 / 3) — verhandelbar, fragen lohnt.
5. **Azure OpenAI PTU lohnt ab ~$1.5k/Monat konstantem Volumen** — darunter ist PAYG günstiger trotz höherer Per-Token-Rate. Break-Even-Rechnung vor Entscheidung.
6. **Batch API 50% günstiger, aber 24h Latenz** — gut für nightly Jobs, ungeeignet für interaktive Agents.
7. **Upgrade-Pfad E5 → E7** — Co-Terming möglich, im Microsoft-Licensing-Portal konfigurierbar.

---

## Eskalationsleiter — "Was muss der Kunde kaufen?"

| Kundensituation | Bundle/Lizenz | Begründung |
|-----------------|---------------|------------|
| „Erste Copilot-Experience für eine Abteilung, M365 E3 vorhanden" | +Copilot-Lizenz standalone | Noch nicht E7 nötig |
| „Mehrere Agents, Governance-Sorge" | E5 + Copilot + [[Agent 365]] oder direkt **E7** | Agent 365 ist der Trigger |
| „Regulierte Branche, Identity-Pflicht für Agents" | **E7** | Entra Suite ist Pflicht |
| „Preview-Features testen wollen" | [[Frontier Program]] beitreten | Unabhängig von E7 |
| „Batch-Workload Nacht-Jobs" | Azure OpenAI **Batch API** | 50% günstiger |
| „Konstantes hohes Volumen, Latenz-SLA" | Azure OpenAI **PTU** | ab ~$1.5k/Monat Break-Even |

---

## Querverweise zu anderen MOCs

- [[Microsoft MOC]] — Root
- [[Copilot MOC]] — Copilot-Lizenz kommerziell hier, Produkt dort
- [[Security & Identity MOC]] — Entra Suite + Agent 365
- [[Azure AI MOC]] — Azure OpenAI Pricing

---

## Offizielle Sammelquellen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| MS Hub-Page | Microsoft 365 Enterprise Plans | https://www.microsoft.com/en-us/microsoft-365/enterprise | 2026-04-21 |
| MS Hub-Page | Copilot-Lizenz | https://www.microsoft.com/en-us/microsoft-365-copilot/business | 2026-04-21 |
| MS Hub-Page | Azure OpenAI Pricing | https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/ | 2026-04-21 |
| Analyst | SAMexpert — Copilot Licensing Explained | https://samexpert.com/ | 2026-04-21 |
| Analyst | Directions on Microsoft | | 2026-04-21 |

---

## Changelog

| Datum | Autor | Änderung |
|-------|-------|----------|
| 2026-04-21 | Hongyu | Initial-Erstellung der Commercial-MOC |
