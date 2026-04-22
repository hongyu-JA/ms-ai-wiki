---
watch: passive
status: ga
research_depth: deep
last_verified: 2026-04-22
aliases: [Azure OpenAI Pricing, AOAI Pricing, PTU, PAYG, Batch API]
moc:
  - "[[Microsoft MOC]]"
  - "[[Azure AI MOC]]"
  - "[[Licensing & SKUs MOC]]"
---

# Azure OpenAI Service Pricing

*Die **drei Bezahlmodelle** für Azure OpenAI: **PAYG** (Pay-as-you-go, per Token), **PTU** (Provisioned Throughput Units — reservierte Kapazität, modell-unabhängig), **Batch API** (50 % Rabatt, 24 h Latenz-SLA). Das Wissen, wann welches Modell wirtschaftlich ist, entscheidet ob ein AI-Workload profitabel läuft oder die Cloud-Rechnung eskaliert. Für SMB-Beratung im DACH-Raum der zentrale Kosten-Hebel nach der Modell-Wahl.*

> **Analogie:** Wie bei Stromtarifen — PAYG ist Grundversorger (teurer pro kWh, keine Commitment), PTU ist Festkontingent mit Rabatt (günstiger pro kWh ab gewissem Verbrauch), Batch ist Nachtstrom (günstig, aber zeit-gebunden).

---

## Einsatz

### Job-to-be-done

When I einen AI-Workload plane (Copilot-Backend, RAG-Agent, Dokument-Klassifikation), I want to wissen welches Pricing-Modell für mein Volumen + Latenz-SLA + Region wirtschaftlich ist, so I can Break-Even vor Commit rechnen und nicht am Monatsende von 4- oder 5-stelligen AOAI-Rechnungen überrascht werde.

### Trigger-Signale

- „Unser AOAI-Bill ist letzten Monat auf $5k hochgeschossen — was macht ihr?"
- „Wir planen einen Agent mit 100k Requests/Tag — PAYG oder PTU?"
- „Können wir Nachtjobs (Rechnungs-Klassifikation, Embedding-Generierung) günstiger fahren?"
- „Lohnt sich eine Reservation? Monatlich oder jährlich?"

### Einsatz-Szenarien

1. **SMB-Copilot-Backend (typisch 50–500 User)** — PAYG auf GPT-4.1-mini oder GPT-5-mini. Monats-Budget-Größenordnung $200–$1.500. PTU-Wechsel erst wenn Nutzung stabil >$1.800/Monat.
2. **Nächtliche Dokument-Klassifikation** — Batch API mit 50 % Rabatt. SLA ist „binnen 24 h", kein Live-User wartet.
3. **PTU-Break-Even-Prüfung** — Kunde mit stabilen 150–200 M Tokens/Monat auf GPT-5/GPT-4o prüft Wechsel auf 50 PTU Regional + Monats-Reservation (64 % günstiger als Hourly).

### Empfehlung

🟡 **Als Entscheidungs-Referenz mitnehmen** — kein eigenständiger Beratungsanlass, aber Pflicht-Wissen für jedes AOAI-Kunden-Gespräch. Typischer SMB landet zunächst auf PAYG-Global-Standard; PTU erst nach 2–4 Wochen PAYG-Baseline-Messung.

**Nächster Schritt für Journai:** Break-Even-Rechner als Standard-Asset im Kunden-Gespräch pflegen; PAYG → PTU-Migrations-Workshop als Produkt-Angebot paketieren (3–5 Tage).

---

## Status & Pricing

| Detail | Wert |
|--------|------|
| **Aktueller Status** | GA für alle drei Modelle (PAYG, PTU, Batch) |
| **Standalone-Preis (USD)** | siehe Matrix unten |
| **Lizenz-Bundle** | keine — reine Azure-Subscription-Abrechnung (EA / CSP / MCA) |
| **Voraussetzung** | Azure Subscription + Foundry-Resource + Modell-Quota |
| **Region-Verfügbarkeit EU/CH** | Switzerland North: GPT-4o verfügbar, GPT-4.1/GPT-5/o4-mini **nicht im Standard-Deployment** (Q&A, Stand 2026-04) — *{TODO verifizieren}*. Sweden Central + Germany West Central: volle Model-Abdeckung inkl. DataZone-EU |
| **CSP-Promo / Discounts** | PTU-Reservation: bis zu **64 % (monatlich)** oder **70 % (jährlich)** Rabatt gegenüber Hourly |
| **Hidden Costs** | siehe eigene Sektion unten |

### PAYG-Preise (Global Standard, pro 1M Tokens, Stand April 2026)

| Modell | Input | Cached Input | Output |
|--------|------:|-------------:|-------:|
| **GPT-5** | ~$1.25 | ~$0.125 | ~$10.00 *{TODO verifizieren Azure}* |
| **GPT-5-mini** | $0.25 | $0.025 | $2.00 |
| **GPT-5.2** | $0.75 | $0.175 | $4.00 |
| **GPT-5-nano** | $0.05 | n/a | $0.40 |
| **GPT-4.1** | $2.00 | $0.50 | $8.00 |
| **GPT-4.1-mini** | ~$0.40 | ~$0.10 | ~$1.60 *{TODO verifizieren}* |
| **GPT-4.1-nano** | ~$0.10 | — | ~$0.40 *{TODO verifizieren}* |
| **o3** | *{TODO}* | *{TODO}* | *{TODO}* |
| **o4-mini** | ~$1.10 | ~$0.275 | ~$4.40 *{TODO verifizieren}* |

**DataZone-Preise (EU/US)**: typisch ~10 % Aufschlag auf Global Standard für Data-Residency-Garantie.

### PTU-Preise (Stand April 2026, modell-unabhängig)

| Deployment-Typ | Hourly $/PTU | Monats-Reservation | Annual Reservation | Min. PTU |
|----------------|-------------:|-------------------:|-------------------:|---------:|
| **Global Provisioned** | ~$1.00 | ~$0.356 (−64 %) | ~$0.303 (−70 %) | 15 |
| **Data Zone Provisioned** | ~$1.00–$1.50 *{TODO}* | −64 % | −70 % | 15 |
| **Regional Provisioned** | ~$2.00 | −64 % | −70 % | 25–50 (modell-abhängig, GPT-4.1/GPT-5: **50**; mini-Varianten: **25**) |

**Einstiegskosten**: 15 PTU Global Hourly ≈ **$360/Monat** (15 × $1 × 24 h × 30 d = $10.800, korrigiert: $1/h/PTU × 24 × 30 = $720/PTU/Monat → *Public-Zahl im Web: ~$260/Monat für 15 PTU Global bei Reservation, ~$2.448/Monat für 50-PTU-Regional-Basis*). *{TODO Pricing Calculator nachrechnen — Web-Quellen widersprechen sich}*.

### Batch API

- **50 % Rabatt** gegenüber PAYG-Global-Standard — auf Input und Output
- **24 h-SLA** (typisch 1–6 h Turnaround, aber keine Garantie unter 24 h)
- **Stackbar mit Prompt-Caching** — cached-input in Batch: bis zu **−75 %** gegenüber Standard-Rate
- Beispiel GPT-4.1: PAYG $2/$8 → Batch **$1.00/$4.00** pro 1M Tokens
- Beispiel o4-mini: Batch **$0.55/$2.20**

---

## Kernkonzept

### Die drei Entscheidungs-Dimensionen

1. **Volumen** — PAYG skaliert linear; PTU lohnt ab ~150–200 M Tokens/Monat konstant (GPT-4o-Referenz, Microsoft-Richtwert)
2. **Latenz-SLA** — interaktiv (<5 s) → PAYG oder PTU; async/nachts OK → **Batch** (50 % billiger)
3. **Region / Data-Residency** — EU-Data-Boundary → DataZone-EU; CH-Residency → Switzerland North (eingeschränkter Katalog); Global Standard günstigste Option ohne Residency-Anforderung

### Break-Even-Rechnung PAYG → PTU (2026-aktualisiert)

**Faustregel: ab ~$1.800/Monat konstantem PAYG-Verbrauch** rechnet sich der Wechsel auf 50 PTU Regional (mit Monats-Reservation).

Konkretes Beispiel (GPT-4.1, 50 PTU Regional):
- Input-Kapazität: 3.000 TPM × 50 = **150.000 Input-TPM** = ~6,5 Mrd Tokens/Monat (theoretisch, bei 100 % Auslastung)
- Realistische Auslastung 40–60 % → ~2,5–4 Mrd Tokens/Monat nutzbar
- Monats-Kosten bei Reservation: **~50 × $720 × 0.36 ≈ $13.000/Monat** (Größenordnung, *{TODO Calculator-Ergebnis einfügen}*)
- Äquivalent PAYG: 3 Mrd Tokens × (80 % Input × $2 + 20 % Output × $8) = ~$9.600 — **PAYG hier billiger**
- Break-Even liegt bei **hoher Auslastung (>70 %) + konstantem Volumen + Output-Schwergewicht**

→ **SMB-Realität**: Die meisten SMB-Copilot-Backends landen bei **$200–$1.500/Monat** PAYG und kommen **nie in PTU-Territorium**. PTU wird für SMB relevant, wenn ein produktiver Customer-Facing-Agent (Support-Bot, hochfrequentes RAG) 24/7 läuft.

### PTU ist modell-unabhängig (wichtige Änderung seit 2024)

Ein 50-PTU-Regional-Kontingent kann für **jedes unterstützte Modell** in der Region genutzt werden (GPT-5.4, GPT-4.1, o3, o4-mini — gleicher Preis pro PTU). Aber: TPM pro PTU variiert stark je Modell:

| Modell | Input TPM pro PTU | Regional Min-PTU |
|--------|------------------:|-----------------:|
| GPT-5.4 | 2.400 | 50 |
| GPT-5 | 4.750 | 50 |
| GPT-5-mini | 23.750 | 25 |
| GPT-4.1 | 3.000 | 50 |
| GPT-4.1-mini | 14.900 | 25 |
| GPT-4.1-nano | 59.400 | 25 |
| o4-mini | 5.400 | 25 |
| o3 | 3.000 | 50 |

**Praktische Konsequenz**: Model-Switch innerhalb derselben Region **ohne** neue PTU-Reservation möglich — war vor 2024 anders. Reservation ist an **Region × Deployment-Typ** gebunden, nicht an Modell.

### Hidden Costs (der SMB-Stolperdraht)

| Kostenblock | Größenordnung | Bemerkung |
|-------------|--------------:|-----------|
| **Azure AI Content Safety** (Prompt Shields, Groundedness) | separat abgerechnet ab ~$0.75/1.000 Records | Built-in-Filter sind inkludiert, Prompt Shields opt-in |
| **App Insights / Tracing** | ~$2.30/GB ingested | bei hohem Token-Volumen schnell $100–$500/Monat |
| **Data Transfer Out** | $0.087/GB nach 100 GB Free-Tier | relevant bei Cross-Region-Agents |
| **Fine-Tuned Model Hosting** | $1.70–$3.00/h = **$1.200–$2.160/Monat** pro FT-Deployment | zusätzlich zu Training + Inferenz |
| **File Search Storage** (Foundry Agent Service / Assistants) | $0.10/GB/Tag = **$3/GB/Monat** | leicht übersehen bei RAG-Pipelines |
| **Production Support Plan** | $100–$1.000/Monat | kein AOAI-Zuschlag, aber MS-Support-Pflicht bei Produktion |
| **Multi-Region-Aufschlag** | 2× Betriebskosten | Failover-Deployments verdoppeln fixe PTU-Reservation |

**Realitäts-Test**: Produktions-AOAI-Rechnungen liegen typisch **15–40 % über** der reinen Token-Kalkulation.

### Region-Unterschiede (Stand April 2026)

| Region | Model-Abdeckung | Pricing-Delta | Empfehlung |
|--------|-----------------|---------------|------------|
| **Global Standard** | voll | Referenz | günstigste Option ohne Residency |
| **DataZone EU** | voll (GPT-5.x, GPT-4.1, o-Familie) | ~+10 % | Default für DE/AT/CH-Kunden mit EU-Data-Boundary |
| **Sweden Central** | voll inkl. Claude (MaaS) | EU-Preis | einzige EU-Region mit Claude |
| **Germany West Central (GWC)** | voll, DataZone-EU | EU-Preis | starke Wahl für DACH |
| **Switzerland North** | eingeschränkt (GPT-4o ja; GPT-4.1/GPT-5/o4-mini Stand 2026-04 **nicht Standard** *{TODO}*) | CH-Preis-Aufschlag typisch +10–15 % | nur bei harter CH-Residency-Vorgabe; Modell-Auswahl begrenzt |
| **West Europe / North Europe** | GPT-Familie ja, neueste Reasoner teilweise verzögert | EU-Preis | sekundäre EU-Option |

**SMB-Faustregel DACH**: Default **Sweden Central** oder **GWC** (DataZone-EU). CH North nur wenn Kunde explizit auf CH-Residency besteht und mit GPT-4o-Niveau zufrieden ist.

---

## Limitierungen & Fallstricke

### Was AOAI-Pricing NICHT kann

| Limitierung | Alternative / Workaround |
|-------------|--------------------------|
| Reservation **nicht kündbar** nach Kauf (nur Cancel mit limitierten Credits) | Deployments **vor** Reservation-Kauf erzeugen; erst 2 Wochen Baseline messen |
| PTU-Kapazität ≠ Quota-Garantie | Region-Capacity mit MS-Account-Team abklären, wenn >50 PTU geplant |
| Batch API keine harten SLAs < 24 h | kritische Async-Jobs nicht auf Batch setzen; SLA-bindende Workloads immer auf PAYG/PTU |
| Keine EU-weite DataZone-Cross-Region-Reservation | pro Region eigene Reservation nötig; Multi-Region verdoppelt Kosten |

### Typische Fallstricke

- **„PTU ist immer günstiger bei Volumen"** — falsch. Nur bei **konstantem** Volumen mit hoher Auslastung. Spiky Traffic → PTU-Kapazität liegt brach. *Gegenmittel*: 2–4 Wochen PAYG-Baseline, dann PTU-Calculator mit realer Auslastungs-Verteilung (P50, P95 TPM).
- **„Batch ist für alles Async"** — Batch ist Best-Effort binnen 24 h, keine Garantie. *Gegenmittel*: Kritische nächtliche Reports nicht nur auf Batch, sondern mit PAYG-Fallback bauen.
- **„Reservation kann ich einfach stornieren"** — nein. Reservations sind wie Azure-Reservations im Compute: Exchange möglich, Cancel nur mit Credit-Limits. *Gegenmittel*: Monats-Reservation statt Annual bei Unsicherheit (Annual lohnt nur bei >12 Monaten Commitment-Sicherheit).
- **„Switzerland North hat alle Modelle wie Sweden"** — falsch. CH-Katalog ist deutlich kleiner, neuere Reasoner (o3/o4-mini/GPT-5) teilweise nicht im Standard-Deployment. *Gegenmittel*: Modell-Verfügbarkeit in CH North **vor** Kunden-Zusage im Foundry-Portal prüfen.
- **„Content Safety ist kostenlos"** — Built-in 4-Kategorie-Filter ja, aber Prompt Shields + Groundedness + Custom Categories sind **separate** Cognitive-Services-Abrechnung.
- **„PTU-Pricing ist dasselbe global"** — falsch. Regional Provisioned kostet ca. **2×** Global Provisioned pro PTU/Stunde. Data-Residency hat Preis.

### Abgrenzung: AOAI-Pricing vs. MaaS-Pricing (Foundry)

- **AOAI** (Azure OpenAI) = Microsoft-gehostete OpenAI-Modelle → PAYG / PTU / Batch, 1 Azure-Rechnung
- **MaaS** (Model-as-a-Service, Non-OpenAI) = Anthropic Claude, Meta Llama, Mistral, DeepSeek → **nur PAYG-Serverless** (+ Partner-PTU bei DeepSeek/Llama-3.3). Preise pro Modell & Publisher, Content Safety opt-in, keine Batch-API-Rabatte
- → siehe [[Foundry Models]] für MaaS-Details; diese Note behandelt **nur** die OpenAI-Modelle

---

## Offizielle Referenzen

| Typ | Quelle | Link | Zuletzt gesichtet |
|-----|--------|------|-------------------|
| Pricing | Azure OpenAI Pricing | https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/ | 2026-04-22 |
| Docs | PTU Onboarding & Billing | https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/provisioned-throughput-onboarding | 2026-04-22 |
| Docs | Batch API | https://learn.microsoft.com/en-us/azure/ai-services/openai/how-to/batch | 2026-04-22 |
| Docs | Foundry Region Support | https://learn.microsoft.com/en-us/azure/foundry/reference/region-support | 2026-04-22 |
| Tool | Azure Pricing Calculator | https://azure.microsoft.com/en-us/pricing/calculator/ | 2026-04-22 |
| Blog | PTU Reservations & Hourly Pricing | https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/unveiling-azure-openai-service-provisioned-reservations-and-hourly-pricing/4214560 | 2026-04-22 |
| Tool | PTU Calculator (Third-Party) | https://www.ptucalc.com/ | 2026-04-22 |

---

## UNCLEAR / TODOs

1. Exakte PAYG-USD-Preise für GPT-5 (Vollmodell), o3, GPT-4.1-mini/nano auf azure.microsoft.com/pricing (Seite hat 2× getimeouted — bei nächster Iteration direkt verifizieren)
2. Switzerland North aktuelle Model-Liste 2026-04 (Q&A-Eintrag sagt „nur GPT-4o", widerspricht ggf. Foundry-Portal-Realität)
3. Genaue USD-Zahl für 15-PTU-Global-Basis (Web-Quellen nennen $260/Monat und $2.448/Monat widersprüchlich — via Pricing Calculator bestätigen)
4. DataZone-EU-Aufschlag vs. Global Standard (geschätzt +10 %, exakt verifizieren)

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|-------|-------|----------|--------|
| 2026-04-22 | Hongyu / Deep-Research | Deep-Dive: PAYG/PTU/Batch-Matrix, Break-Even-Rechnung, Region-Deltas, SMB-Beratungs-Szenarien, Hidden-Costs-Tabelle, PTU-modell-unabhängig-Detail, Abgrenzung zu MaaS | https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/ |
| 2026-04-22 | Hongyu | Initial Stub (Tier 3 Awareness) | Arbeitsauftrag |
