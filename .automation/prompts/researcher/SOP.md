# Researcher-Workflow · Standard Operating Procedure

> Diese SOP ergänzt `README.md` (Welcher Prompt wann?). README sagt **welchen
> Prompt** du auswählst; diese SOP sagt **was du mit dem Output machst** —
> wie er zurück ins Vault kommt, durch welchen Pfad, mit welcher PR.
>
> **Phase 2 der Roadmap.** Quellen: `cowork-handoff/02-ROADMAP.md` Phase 2,
> `MS_AI_Wiki/_Inbox/README.md` (Inbox-Format), `.automation/scripts/classify-clippings.ts` +
> `filter.ts` + `patch.ts` (Pipeline-Verhalten).

---

## 1. Pfad-Entscheidungs-Baum

Nach Empfang eines Researcher-Outputs entscheidest du in **einer von drei
Routen** — anhand des Output-Charakters:

```
Researcher-Output liegt vor (vollständige Markdown-Note ODER Sektions-Update)
│
├── Vollständige Note für komplett neues Produkt
│       (Researcher hat alle Pflicht-Sektionen ausgefüllt,
│        keine bestehende Note existiert)
│   → PFAD A · Direktablage
│       1. products.yaml-Eintrag erzeugen (slug, primary_home_moc, tagline,
│          tier, watch, keywords, sources, enabled: true)
│       2. Datei direkt in MS_AI_Wiki/Microsoft/Products/<Slug>.md ablegen
│       3. Lokal `npx tsx .automation/scripts/audit-notes.ts` (0 Errors erwartet)
│       4. Branch + PR mit Label `kb-researcher-deep`
│
├── Vollständige Note für bestehendes Produkt (Major-Refresh / Tier-Wechsel)
│       (Researcher hat alle Sektionen neu geschrieben, du willst
│        die alte Note ersetzen oder sich substantiell überarbeitet)
│   → PFAD A' · Direktablage mit Diff-Review
│       1. products.yaml-Eintrag aktualisieren (z.B. watch: passive → standard)
│       2. Datei in MS_AI_Wiki/Microsoft/Products/<Slug>.md überschreiben
│       3. Lokal Audit
│       4. PR mit Label `kb-researcher-refresh-major` —
│          PR-Beschreibung MUSS Diff-Begründung enthalten:
│          "Was ist anders, warum, was wurde bewusst nicht übernommen"
│
├── Sektions-Update / Multi-Source-Fund / Micro-Deltas
│       (Researcher hat zwischen 1 und 5 Sektionen aktualisiert,
│        oder ein Fund betrifft mehrere Notes,
│        oder du willst ausgewählte Deltas backporten)
│   → PFAD B · Inbox-Routing
│       1. Datei in MS_AI_Wiki/_Inbox/<datum>-<slug>-<thema>.md ablegen
│       2. Frontmatter (siehe Sektion 3 unten)
│       3. Body als strukturierte Delta-Auflistung
│          (Beispiel: MS_AI_Wiki/_Inbox/2026-04-30-responses-api-pricing-precision.md)
│       4. Beim nächsten daily-sync greift filter.ts → patch.ts → apply.ts
│       5. PR wird automatisch mit den Patches erzeugt
│       6. Du reviewst, mergst — file landet automatisch in _Inbox/_processed/
│
└── Spekulativ / nicht belegt / Marketing-kontaminiert
    → REJECT
       Researcher-Output direkt verwerfen (oder Researcher-Query mit
       schärferem Prompt wiederholen, siehe README troubleshooting). Niemals
       unbelegt ins Vault speichern — auch nicht "vorläufig".
```

---

## 2. Drei konkrete Beispiele

### Beispiel 1 · Pfad A — neues Produkt

**Situation**: Microsoft kündigt auf Build 2026 ein neues Produkt "Foundry
Voice" an. Es gibt noch keine Note dafür.

**Schritte**:

1. In `.automation/products.yaml` neuen Eintrag ergänzen:
   ```yaml
   - slug: foundry-voice
     note: "Foundry Voice.md"
     primary_home_moc: "Azure AI MOC"
     tagline: "Speech-to-Text + Voice-Synthesis im Foundry-Stack"
     tier: 2
     watch: standard
     keywords: ["Foundry Voice", "Azure Voice"]
     sources: [devblogs-foundry, azure-updates]
     changelog_trigger_sections: ["Status & Pricing", "Kernkonzept"]
     enabled: true
   ```
2. In `MS_AI_Wiki/Microsoft/Products/Foundry Voice.md` Researcher-Output ablegen
3. `cd .automation && npx tsx scripts/audit-notes.ts` → 0 Errors erwartet
4. Branch `feature/kb-foundry-voice-initial` + PR

### Beispiel 2 · Pfad A' — Major-Refresh

**Situation**: Microsoft hat im Januar 2027 die `Microsoft Foundry`-Architektur
vollständig umgebaut. Die existierende Note ist 70 % veraltet — Researcher
soll sie komplett neu schreiben.

**Schritte**:

1. Tier-1-Prompt (`tier1-deep-research.md`) verwenden, Researcher absetzen
2. Output an alten Pfad `MS_AI_Wiki/Microsoft/Products/Microsoft Foundry.md` schreiben (überschreiben)
3. Audit lokal (ggf. `update-indices.ts` triggern für MOC-Auto-Index)
4. Branch + PR mit **expliziter Diff-Begründung**:
   ```
   ## Major-Refresh
   
   Was sich geändert hat in der externen Welt:
   - Foundry-Stack umgebaut zu X (Quelle: Build-2027-Keynote)
   - Pricing-Modell von Y auf Z geändert
   
   Was ich aus alter Note bewahrt habe:
   - Journai-Empfehlungs-Logik in „Empfehlung"-Sektion
   - Hidden-Costs-Beobachtungen (immer noch gültig)
   
   Was bewusst weg ist:
   - Detail-Tabelle für altes Pricing-Modell — neue Tabelle ersetzt
   ```

### Beispiel 3 · Pfad B — Sektions-Update (häufigster Fall)

**Situation**: Refresh-Test (Tier 3) auf `Azure OpenAI Service Pricing`
liefert eine neuere Pricing-Tabelle und 2 neue Limitierungen, aber 60 %
der bestehenden Note bleibt korrekt.

**Schritte** (siehe konkretes Live-Beispiel in
`MS_AI_Wiki/_Inbox/2026-04-30-responses-api-pricing-precision.md`):

1. Datei `MS_AI_Wiki/_Inbox/2026-04-30-aoai-pricing-tier-tables.md` anlegen
2. Frontmatter:
   ```yaml
   ---
   source_url: "https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/"
   source_title: "Azure OpenAI Pricing-Tabelle Q2/2026 + 2 neue Limitierungen"
   source: researcher
   date_clipped: 2026-04-30
   scope: azure-openai-pricing
   ---
   ```
3. Body strukturiert pro Delta:
   - Delta-Nummer + Ziel-Sektion in der Note
   - Aktuelle Formulierung (Auszug)
   - Vorgeschlagener Backport-Patch
   - Quelle (URL, Sichtungs-Datum)
4. Pipeline läuft automatisch im nächsten daily-sync — Patches werden via
   patch.ts erzeugt, in PR vorgeschlagen
5. Du reviewst PR, mergst, Datei wird automatisch nach
   `_Inbox/_processed/<heutiges Datum>/` verschoben

**Wichtig**: für Pfad B muss der Slug in `products.yaml` mit `enabled: true`
markiert sein, sonst überspringt filter.ts das Item. Im Zweifel vorab prüfen.

---

## 3. Inbox-Frontmatter-Schema (Pfad B)

Das Inbox-Format ist bewusst loose (siehe `MS_AI_Wiki/_Inbox/README.md`).
Pflicht ist **nichts**, empfohlen ist:

```yaml
---
source_url: "<Primary-URL der wichtigsten Quelle>"
source_title: "<menschlich lesbarer Titel des Clippings>"
source: researcher                    # immer "researcher" für Researcher-Outputs
date_clipped: YYYY-MM-DD              # heute
scope: <slug-1>[, <slug-2>]           # welche Notes sind betroffen
researcher_session: "<Optional: Frontier-Modus, Querey-ID falls verfügbar>"
title: "<Optional: explizit setzen, sonst Dateiname>"
---
```

Felder, die filter.ts nicht kennt, werden ignoriert. `scope` und `source:
researcher` sind nur informativ — pipeline klassifiziert per Keyword-Match
gegen `products.yaml`.

---

## 4. Wann `products.yaml` updaten

| Szenario | products.yaml-Änderung |
|---|---|
| Pfad A (neues Produkt) | **Pflicht**: neuer Eintrag mit slug, primary_home_moc, tagline, tier, watch, keywords, enabled: true |
| Pfad A' (Major-Refresh) | **Bei Tier-/Watch-Wechsel**: aktualisieren. Sonst nichts. |
| Pfad B (Sektions-Update) | **Nur falls vorher `enabled: false` war**: auf `enabled: true` flippen, sonst greift filter.ts nicht. Sonst nichts. |
| Tagline geändert? | Bei Bedarf: `tagline` field aktualisieren — `update-indices.ts` schreibt das in MOC-Tabelle. |
| Note hat sich von Tier 3 zu Tier 2 geentwickelt | `tier:` + `watch:` aktualisieren, gleiche PR wie Note-Update. |

---

## 5. PR-Beschreibungs-Template

Für jede Researcher-PR, unabhängig von Pfad:

```markdown
## <Pfad-Label> · <Produkt-Slug>

**Researcher-Tier**: <Tier 1 / Tier 2 / Tier 3 / Deprecated>
**Frontier-Modus**: <ja, Critique / ja, Council / nein>
**Quota-Verbrauch**: 1 von 25 (<heutiges Datum>)
**Researcher-Session-ID** (falls verfügbar): <ID>

### Was diese PR tut
<1–3 Sätze>

### Was nicht in dieser PR ist
<bewusste Auslassungen aus dem Researcher-Output, mit Begründung>

### Audit-Status
- [ ] `npx tsx .automation/scripts/audit-notes.ts` lokal grün
- [ ] MOC-Wikilinks haben ` MOC`-Suffix verifiziert
- [ ] Frontmatter-Pflichtfelder vorhanden

### Quellen-Stichprobe
<2–3 zentrale Source-URLs aus dem Output, zur PR-Reviewer-Verifikation>

### Roadmap-Reference
Phase <X> Tag <Y> von `cowork-handoff/02-ROADMAP.md`.
```

---

## 6. Wann Researcher NICHT verwenden

Sparsamkeit ist Pflicht — 25 Queries/Monat-Budget.

| Situation | Statt Researcher |
|---|---|
| 1 Fakt, 1 Datum, 1 Preis | `daily-sync.yml` deckt das via RSS/Atom-Mikro-Patches ab |
| Tippfehler / Formatierung | Direkt-PR ohne Pipeline |
| Eigene Beratungs-Erfahrung dokumentieren | Direkt-Edit, kein Researcher (Researcher kennt Journai nicht) |
| MOC-Auto-Index-Update | `update-indices.ts` macht das — keine PR nötig |
| Sektions-Umorganisation in Note | Direkt-Edit |
| Ein Produkt taucht in News auf, das **nicht** in products.yaml ist | Erst products.yaml-Stub, dann nächster daily-sync — Researcher erst wenn nach 1–2 Wochen substantiell zu schreiben ist |

---

## 7. Refresh-Test → Micro-Deltas (gelernter Workflow ab 2026-04-30)

**Hintergrund**: Phase 1 Tag 2 hat zwei Refresh-Tests gemacht (Azure OpenAI
Pricing + Responses API). Beide zeigten: Researcher-Output ist **nicht der
direkte Ersatz** für eine bestehende Note, sondern **Quelle für Micro-Deltas**.

Typischer Befund eines Refresh-Tests:

| Was Researcher gut macht | Was Researcher nicht kann |
|---|---|
| Aktuelle Pricing-Daten präzise (Tool-Fees, Token-Preise) | Journai-Beratungs-Logik (Empfehlung 🟢/🟡/🔴 mit konkretem nächsten Schritt) |
| Critical observations (Quellen-Diskrepanzen, Doku-Lücken) | Journai-Runbooks (Migrationspfade mit konkreten Code-Snippets) |
| Frische Source-URLs für Monitoring-Tabelle | DSGVO-spezifische Patterns aus Kunden-Erfahrung |
| Region-Verfügbarkeit Stand heute | "Gegenmittel"-Empfehlungen für Anti-Patterns |

**Folge-Workflow nach Refresh-Test**:

1. Existierende Note **nicht überschreiben**
2. Researcher-Output cell-by-cell gegen Note diffen
3. Identifizieren: 1-N Deltas wo Researcher genauer/aktueller ist
4. Identifizieren: Inhalte aus Note die Researcher fehlen → bewusst behalten
5. Inbox-Clipping mit den Deltas anlegen (Pfad B)
6. PR-Beschreibung enthält die "Was nicht übernommen wurde"-Tabelle

**Live-Beispiel**: `MS_AI_Wiki/_Inbox/2026-04-30-responses-api-pricing-precision.md`
ist der erste Anwendungsfall dieses Workflows. Format dort als Vorlage nutzen.

---

## 8. Researcher-Quota-Tracking

Eine einfache Konvention pro PR:

- Quota-Zeile in PR-Description: `**Quota-Verbrauch**: N von 25 (Stand YYYY-MM)`
- Monatliches Reset implizit (Microsoft-365-Lizenz-Cycle)
- Bei N > 20: Wochenrest auf Tier-1-Critical-Notes priorisieren

Vorgeschlagene Verteilung pro Monat:

| Aktivität | Anteil |
|---|---|
| Tier-1-Recherchen (neue close-watch Produkte) | 5–8 |
| Tier-2-Recherchen | 4–6 |
| Tier-3-Refresh-Tests (Micro-Deltas via Pfad B) | 3–5 |
| Major-Refreshes (Pfad A') | 2–4 |
| Deprecated-Rewrites | 1–2 |
| Reserve (ad-hoc, Critique-Loops) | 3–5 |

---

## 9. Fehlerbehandlung

| Symptom | Ursache | Aktion |
|---|---|---|
| Pipeline läuft, aber Inbox-Item bleibt unverarbeitet | Slug in products.yaml `enabled: false` | flip `enabled: true`, nächsten daily-sync abwarten |
| Inbox-Item landet in `_rejected/` | filter.ts findet keinen Keyword-Match | Frontmatter `source_title` und Body um relevante Keywords aus products.yaml ergänzen |
| Audit fehlschlägt nach Pfad A | MOC-Wikilink ohne ` MOC`-Suffix oder Pflicht-Sektion fehlt | Researcher-Prompt schärfen (siehe README troubleshooting), Output korrigieren, audit erneut |
| PR-Diff zeigt Änderungen die ich nicht erwartet habe | patch.ts hat zusätzliche Sections gemerged | PR-Diff manuell editieren (mit `git push --force-with-lease`); Pipeline-Fehler in separater Issue dokumentieren |
| Multiple Notes in einer PR | Inbox-Item hatte `scope: slug-1, slug-2, slug-3` | OK falls 2-3 Notes; ab 4+ besser splitten in mehrere Inbox-Items für getrennte PRs |

---

## 10. Done-Kriterium für Phase 2

- [x] SOP-Datei (diese Datei) im Repo
- [x] Mindestens 1 Pfad-B-Beispiel im `_Inbox/` (`2026-04-30-responses-api-pricing-precision.md`)
- [ ] Erfolgreicher Roundtrip eines Inbox-Items: Researcher → `_Inbox/` → PR → Merge → automatisch nach `_Inbox/_processed/`
- [ ] PR-Reviewer hat Backport-Patches verifiziert (Diff vs. Researcher-Output sichtbar)

Sobald Punkte 3-4 grün sind: Phase 2 ist abgeschlossen, Übergang zu Phase 3 (Declarative Agent in Teams).

---

## Changelog

- 2026-04-30: Initial-Version (Phase 2). Pfad A/A'/B beschrieben, 3 Beispiele, Refresh-Test-Workflow aus Phase 1 Tag 2 dokumentiert.
