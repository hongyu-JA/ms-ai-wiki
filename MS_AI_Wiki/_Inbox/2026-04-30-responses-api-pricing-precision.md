---
source_url: "https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/"
source_title: "Azure OpenAI Responses API · Tool-Pricing-Präzision + 2 Critical-Observations (Refresh-Test 2026-04-30)"
source: researcher
date_clipped: 2026-04-30
scope: azure-openai-responses-api
researcher_session: "M365 Copilot Researcher (Tier 3 Refresh-Test, watch: passive)"
title: "Azure OpenAI Responses API — Tool-Pricing-Präzision + EOS-Diskrepanz + Web-Search-Status"
---

# Azure OpenAI Responses API · Refresh-Test-Deltas

Auswertung des Researcher-Refresh-Tests (Tier 3, 2026-04-30) gegen die
existierende Note `MS_AI_Wiki/Microsoft/Products/Azure OpenAI Responses API.md`
(Stand 2026-04-22). **Vier Micro-Deltas zum Backport** — keine vollständige
Note-Ersetzung.

> **Pfad-B-Beispiel**: Diese Datei ist Beispiel-Output für die in
> `.automation/prompts/researcher/SOP.md` beschriebene Arbeitsweise
> "Refresh-Test → Micro-Deltas via Inbox-Clipping".

---

## Delta 1 · Tool-Pricing präzise (statt approximativ)

**Ziel-Sektion**: `## Status & Pricing` (Tabelle, Zeile "Hidden Costs") sowie
`### Aufwand & Kosten (Journai-Schätzung)` (Tabelle, Zeile "Laufende Lizenzkosten").

**Aktuell in Note** (Stand 2026-04-22):

> Code Interpreter (~USD 0.03/Container-Session, 1h aktiv, 20min idle), File
> Search (Tool-Call + Vector-Store-Storage), Web Search (Per-Call). [...] —
> **Per-Call-Preise sind nicht beziffert.**

**Korrigierte Zahlen** (Quelle: Azure OpenAI Pricing, gesichtet 2026-04-30):

| Tool | Bisher in Note | Präziser Wert | Quelle |
|---|---|---|---|
| Code Interpreter | ~$0.03/Session | **$0.033 pro Container-Session** (1h aktiv, 20min idle TTL) | [Azure OpenAI Pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/) |
| File Search Tool Call | "Per-Call" (vague) | **$2.50 pro 1.000 Tool-Calls** | [Azure OpenAI Pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/) |
| File Search Vector Storage | "Vector-Store-Storage" (vague) | **$0.11 pro GB pro Tag**, 1 GB Free-Tier | [Azure OpenAI Pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/) |
| Computer Use | nicht beziffert | **$3 Input / $12 Output pro 1M Tokens** | [Azure OpenAI Pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/) |

**Backport-Patch (Vorschlag für Hidden-Costs-Zelle)**:

> Built-in Tools extra: Code Interpreter **$0.033/Container-Session** (1h
> aktiv, 20min idle), File Search **$2.50/1K Tool-Calls + $0.11/GB/Tag
> Vector-Storage** (1 GB Free-Tier), Web Search Per-Call (Bing-gestützt),
> **Computer Use $3/$12 pro 1M Token I/O**. MCP-Tool: keine Zusatz-Gebühr.
> Stored Responses 30-Tage-Retention zählt zu Storage. (Stand 2026-04-30,
> [Azure OpenAI Pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/))

---

## Delta 2 · Cache-Verbesserung 40-80 % (Kern-Fähigkeit ergänzen)

**Ziel-Sektion**: `### Kern-Fähigkeiten` → neue Zeile bei "Stateful Conversations
via `previous_response_id`" oder als eigene Subsektion.

**Neuer Insight** (Quelle: OpenAI Migration Guide, gesichtet 2026-04-30):

> Responses API liefert laut OpenAI **40–80 % bessere Cache-Auslastung
> gegenüber Chat Completions** (Cache-Hit-Rate für wiederholende Prompt-
> Präfixe via Server-Side-Caching durch `previous_response_id`-Kette).
> Für Multi-Turn-Workflows = effektive Token-Cost-Reduktion ohne Code-
> Änderung — Default-Verhalten bei `store=true`. Quelle: [OpenAI · Migrate to Responses](https://developers.openai.com/api/docs/guides/migrate-to-responses).

**Backport-Patch (Vorschlag, ergänzt zur Stateful-Conversations-Subsektion)**:

> Zusätzlich: Server-Side-Caching durch `previous_response_id`-Kette liefert
> laut OpenAI-internen Benchmarks **40–80 % bessere Cache-Auslastung** vs.
> Chat Completions — Token-Cost-Reduktion ohne Code-Änderung in Multi-Turn-
> Setups. Default bei `store=true`.

---

## Delta 3 · EOS-Datum-Diskrepanz Azure vs OpenAI (neuer Fallstrick)

**Ziel-Sektion**: `### Typische Fallstricke im Einsatz` → neuer Bullet.

**Neuer kritischer Befund** (Quelle: Researcher-Auswertung gegen mehrere Quellen):

OpenAI offizieller Sunset-Termin Assistants API: **26.08.2026** (Quelle:
[OpenAI Community](https://community.openai.com/t/assistants-api-beta-deprecation-august-26-2026-sunset/1354666)).

Drittquelle (APIScout) berichtet jedoch eine **abweichende Azure-spezifische
Frist bis Februar 2027** (Quelle: [APIScout Migration-Guide](https://apiscout.dev/guides/openai-responses-api-vs-assistants-api-migration-2026)).

**Status**: Microsoft hat diese Verlängerung in seinen offiziellen Q&A/Lifecycle-
Docs **nicht öffentlich bestätigt** (Stand 2026-04-30). Drei mögliche Lesarten:

1. APIScout hat falsche Information
2. Verlängerung existiert, ist aber nur über CSP-Account-Team kommunikabel
3. Microsoft plant Verlängerung, hat sie noch nicht angekündigt

**Backport-Patch (Vorschlag, neuer Fallstrick-Bullet)**:

> - **EOS-Datum für Azure unsicher** — OpenAI sunsetet Assistants API offiziell
>   am 26.08.2026 ([OpenAI Forum](https://community.openai.com/t/assistants-api-beta-deprecation-august-26-2026-sunset/1354666)).
>   APIScout nennt für Azure-Kunden eine Frist bis **Februar 2027**
>   ([APIScout Guide](https://apiscout.dev/guides/openai-responses-api-vs-assistants-api-migration-2026)),
>   Microsoft hat das in den offiziellen Lifecycle-Docs **nicht bestätigt**
>   (Stand 2026-04-30). *Konsequenz für Beratung*: Kundenvertrag/CSP-Account-Team
>   einzeln verifizieren, bevor Migration-Plan auf "Azure-Frist 02/2027" verlässt.
>   Im Zweifel **konservativ auf 26.08.2026 planen**.

---

## Delta 4 · Web Search Tool — Azure-Status mehrdeutig (neue Limitierung)

**Ziel-Sektion**: `## Limitierungen & Fallstricke` → "Was das Produkt NICHT kann" Tabelle.

**Neuer Befund**: OpenAI listet Web Search als reguläres Responses-Tool
(siehe [Migration Guide](https://developers.openai.com/api/docs/guides/migrate-to-responses)).
In der gesichteten Azure-Dokumentation (`learn.microsoft.com/azure/foundry/openai/how-to/responses`,
gesichtet 2026-04-30) wird Web Search jedoch **nicht explizit als Azure-supported
Tool aufgeführt** (auch nicht im "Built-in Tools"-Abschnitt der Azure-spezifischen
How-to-Page).

**Status**: Tool funktioniert via OpenAI-direkt-Endpoint, Azure-Verfügbarkeit pro
Region/Modell ist **nicht klar dokumentiert**.

**Backport-Patch (Vorschlag, neue Zeile in "Was das Produkt NICHT kann"-Tabelle)**:

> | **Web-Search-Tool auf Azure nicht explizit dokumentiert** — OpenAI listet es als Built-in-Tool, Azure-Docs erwähnen es nicht; Verfügbarkeit pro Region/Modell unklar (Stand 2026-04-30) | Vor Einsatz: in gewählter Region/Modell-Kombination via Test-Call validieren; alternativ Bing-Search-API direkt anbinden + Result als Function-Call-Output reinreichen |

---

## Delta 5 · Frontmatter-Bumps (gehört zu jedem Refresh)

**Ziel-Sektion**: YAML-Frontmatter Top.

- `last_verified: 2026-04-22` → **`last_verified: 2026-04-30`**
- `aliases: [Responses API, Azure OpenAI Responses, /v1/responses]` → ergänzen
  um **`responses.create()`** (häufiger Code-Such-Token im SDK)

---

## Was NICHT übernommen wird (vom Researcher-Output)

Diese Researcher-Inhalte wurden **bewusst nicht** als Backport vorgeschlagen:

| Researcher hatte | Warum nicht backporten |
|---|---|
| Empfehlung: 🟡 Beobachten | Aktuelle Note hat 🟢 Empfehlen — strategisch korrekt (Default-API ab 2026), Researcher war risk-averse |
| Generischere Trigger-Signale (2 statt 4) | Aktuelle Trigger-Signale sind beratungs-spezifischer (MAF-vs-Responses-Decision) |
| Generische Einsatz-Szenarien (IT-Service-Desk, Datenanalyse) | Aktuelle Note hat Journai-spezifische Szenarien (Stateless-Stateful-Hybrid für DSGVO) |
| `[[Licensing & SKUs MOC]]` als 3. MOC | Responses API ist keine eigenständige SKU — Researcher übergeneralisiert |
| 5 statt 9 EU-Regionen | Aktuelle Note hat vollständigere Liste (Italy North, Norway East, Poland Central, Spain Central) |

---

## Quellen-Konsolidierung

Alle in diesem Clipping verlinkten Primärquellen (alphabetisch):

- [APIScout — Responses vs Assistants Migration 2026](https://apiscout.dev/guides/openai-responses-api-vs-assistants-api-migration-2026) (Tertiary, für EOS-Diskrepanz)
- [Azure OpenAI Pricing — Cognitive Services](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/) (Primary, für alle Tool-Pricing-Werte)
- [OpenAI Community — Assistants API Sunset 26.08.2026](https://community.openai.com/t/assistants-api-beta-deprecation-august-26-2026-sunset/1354666) (Tertiary, für OpenAI-Sunset)
- [OpenAI Developers — Migrate to Responses](https://developers.openai.com/api/docs/guides/migrate-to-responses) (Tertiary, für Cache-Improvement-Behauptung + Web-Search-Listing)

Microsoft-offizielle Bestätigung der Cache-Verbesserung-Werte und der EOS-
Diskrepanz fehlt — Verifikation beim nächsten Microsoft-Build (Mai 2026)
oder via Microsoft Account-Team einplanen.
