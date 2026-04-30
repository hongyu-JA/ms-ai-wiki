# Researcher-Prompts · SOP

Vier wiederverwendbare Prompts für **M365 Copilot Researcher**, plus diese
Anleitung. Sie produzieren Markdown-Notes, die zum `audit-notes.ts` grün
durchlaufen sollen.

## Inhalt

| Datei | Wofür | Watch-Level | Quota |
|---|---|---|---|
| `tier1-deep-research.md` | Tier-1-Note (vollständig, alle Sektionen + Wettbewerbs-Profil) | `close` | 1 Query |
| `tier2-standard-research.md` | Tier-2-Note (Pflicht + Integrationen + Sec & Compliance) | `standard` | 1 Query |
| `tier3-awareness-research.md` | Tier-3-Note (nur Pflicht-Sektionen, sparsamster) | `passive` | ~1 Query |
| `deprecated-rewrite.md` | Status-Wechsel `ga → deprecated` (5 Sektionen + Migrationspfad) | `passive` | 1 Query |
| `README.md` | Diese SOP | — | — |

## Welcher Prompt wann?

```
Ist es ein neues Produkt, das ins Wiki soll?
├── Ja, mit hoher Änderungs-Dynamik / direkter Geschäftsimpact
│   → tier1-deep-research.md (watch: close)
├── Ja, moderate Dynamik, fundiertes Einordnen reicht
│   → tier2-standard-research.md (watch: standard)
└── Ja, stabil oder situativ, Überblick reicht
    → tier3-awareness-research.md (watch: passive)

Ist es ein bestehendes Produkt, das deprecated wird?
└── Ja, mit offizieller MS-EOS-Ankündigung + offiziellem Nachfolger
    → deprecated-rewrite.md

Ist es ein bestehendes Produkt, dessen Note refresh braucht?
├── Major-Refresh (mehrere Sektionen, Tier-Wechsel)
│   → entsprechender Tier-Prompt + manuell Diff im PR herausarbeiten
└── Mikro-Update (1 Fakt, 1 Datum, 1 Preis)
    → KEIN Researcher. daily-sync.yml deckt das ab.
```

Faustregel: **Researcher ist teuer (25/Monat-Quota). Verwende ihn nur, wenn
Mikro-Patches via daily-sync nicht reichen.**

## Anwendung — Schritt für Schritt

### Schritt 1: Stub registrieren (falls neue Note)

Wenn das Produkt noch nicht in `products.yaml` steht: erst dort einen
Eintrag anlegen (mindestens `slug`, `note`, `primary_home_moc`, `tagline`,
`tier`, `watch`, `keywords`). Dann ist der Audit-Gate später konsistent.

### Schritt 2: Prompt vorbereiten

1. Den passenden Tier-Prompt aus diesem Verzeichnis öffnen.
2. `{PRODUKT}` durch den Produktnamen ersetzen — überall (es kommt am Ende
   nochmal als "PRODUKT" Block).
3. Optional: bekannte Aliases / Vorgängernamen / GitHub-URL im "PRODUKT"-
   Block am Ende ergänzen, damit der Researcher nicht in Verwechsler stolpert
   (z.B. "Semantic Kernel" vs. "Semantic Kernel Architect" — Job-Titel).

### Schritt 3: Researcher absetzen

1. M365 Copilot Chat öffnen.
2. Researcher-Agent wählen (in der Agent-Liste am oberen Rand).
3. **Frontier-Modus**, falls Lizenz vorhanden: **Council** (Multi-Model)
   für Tier 1/2, **Critique** reicht für Tier 3 / Deprecated.
4. Den vorbereiteten Prompt-Block vollständig in das Eingabefeld einfügen.
5. Abschicken. Researcher braucht 5–15 Min (Tier 1) bzw. 3–8 Min (Tier 3).

### Schritt 4: Output abholen

1. **Komplette** Antwort kopieren — auch wenn lang. Nicht zusammenfassen lassen.
2. Bei Council-Modus: beide Modell-Outputs kopieren (sie werden in der
   Inbox-Receiver-SOP konsolidiert — Phase 2).

### Schritt 5: Pre-Audit (selbst, vor PR)

Vor dem Branch + PR kurz checken:

- [ ] YAML-Frontmatter beginnt in Zeile 1, alle Pflicht-Felder vorhanden
  (`watch`, `status`, `last_verified`, `aliases`, `moc`, `research_depth`)
- [ ] Bei Deprecated zusätzlich `successor` und `deprecation_date`
- [ ] H1 ist `# {Produkt-Name}` (nicht `# Researcher Output`)
- [ ] Mindestens `[[Microsoft MOC]]` und genau eine Primary-Home-MOC im `moc:`-Feld
- [ ] Pflicht-Sektionen vorhanden:
  - Elevator + Analogie · Einsatz · Status & Pricing · Kernkonzept ·
    Limitierungen & Fallstricke · Offizielle Referenzen · Changelog
  - Tier 1 zusätzlich: Integrationen, Security & Compliance, Abgrenzung & Wettbewerb
  - Tier 2 zusätzlich: Integrationen, Security & Compliance
- [ ] "Offizielle Referenzen → Primary" hat URLs (nicht nur Quellen-Namen)
- [ ] "Changelog" hat eine erste Zeile mit heutigem Datum
- [ ] Empfehlung-Block enthält genau einen 🟢 / 🟡 / 🔴

Wenn ja → weiter zu Pfad A oder Pfad B (siehe Phase-2-SOP).
Wenn nein → Researcher nochmal mit gezielter Nachfrage ("die Sektion X fehlt"),
ODER manuell ergänzen und im Changelog vermerken.

### Schritt 6: Pfad A oder Pfad B (siehe Phase-2-SOP)

**Pfad A · Direktablage** (für komplette neue Note):
- Datei direkt unter `MS_AI_Wiki/Microsoft/Products/<Slug>.md` ablegen
- `bun run audit` (oder pre-commit-Hook)
- Branch + PR mit Label `kb-researcher-deep`

**Pfad B · Inbox-Routing** (für Sektions-Update / Multi-Source-Fund):
- Datei in `MS_AI_Wiki/_Inbox/_clippings/<datum>-<thema>.md`
- Frontmatter um `source: researcher`, `date_clipped: YYYY-MM-DD`,
  `scope: <slug-1>, <slug-2>` ergänzen
- Beim nächsten daily-sync greift `classify-clippings.ts`

Details siehe Phase 2 SOP (separat in der Roadmap).

## Quota-Tracking

Researcher hat **25 Queries/Monat/User**. Faustregel:

| Aktivität | Anteil pro Monat |
|---|---|
| Tier-1-Recherchen (neue close-watch Produkte) | 5–8 |
| Tier-2-Recherchen | 4–6 |
| Tier-3-Recherchen | 3–5 |
| Major-Refreshes bestehender Notes | 2–4 |
| Deprecated-Rewrites | 1–2 |
| **Reserve für ad-hoc / Critique-Loops** | 3–5 |

Wenn die Reserve aufgebraucht ist: Tier-3-Notes auf herkömmliche Recherche
zurückstufen, Researcher nur für Tier 1+2.

## Was tun bei Researcher-Fehlern

| Symptom | Ursache | Aktion |
|---|---|---|
| "Quota erreicht" | Monatsbudget verbraucht | Auf nächsten Monat warten oder zweiten User aktivieren |
| Output hat kein YAML-Frontmatter | Researcher hat es als Markdown-Block interpretiert | "Bitte beginne mit `---` und dem YAML-Frontmatter exakt wie spezifiziert" |
| Pflicht-Sektion fehlt | Prompt-Verständnis | "Sektion X (z.B. 'Limitierungen & Fallstricke') ist nicht ausgefüllt — bitte ergänze ohne den Rest zu ändern" |
| Marketing-Sprech ("groundbreaking") | Kontamination durch Quellen | "Bitte umformulieren in sachlich-beratenden Stil. Konkret: 'Microsoft is the leader in...' → '<Faktum mit Quelle>'" |
| Halluzinierte Preise / GA-Daten | Researcher hat keine harte Quelle | Im Frontmatter `last_verified` rotieren, Sektion "Status & Pricing" mit `nicht öffentlich verfügbar (Stand {Datum})` ersetzen |
| URLs in Quellen fehlen | Prompt-Hinweis "Quellen-Pflicht" wurde ignoriert | "Jede Faktenaussage in 'Status & Pricing' muss in 'Offizielle Referenzen → Primary' verlinkt sein" |
| Side-by-Side bei Council | Konsolidierung wurde übersprungen | "Bitte konsolidiere zu einer einzigen Note, nicht zwei. Bei Konflikten gewinnt die belegtere Quelle" |

## Verbesserungs-Loop für die Prompts

Die vier Prompt-Files sind **lebende Dokumente**. Nach jedem Researcher-Run:

1. Welche Audit-Errors blieben übrig nach dem Output?
2. Welche manuellen Korrekturen waren nötig?
3. Prompt schärfen (konkretere Regel oder Beispiel) → in PR mit Label
   `kb-researcher-prompt-tuning`.
4. Changelog-Block am Ende der jeweiligen Prompt-Datei führen
   (`## Changelog` → `- YYYY-MM-DD: Regel X verschärft, Grund: ...`).

Halbjährliche Wartung: alle 4 Prompt-Files gegen den `Product Note Template.md`
abgleichen — wenn das Template um Sektion erweitert wurde, Prompt nachziehen.

## Was diese Prompts NICHT können

- **Mikro-Updates** (1 Fakt, 1 Datum) → das macht `daily-sync.yml` mit
  `fetch → filter → patch`.
- **Multi-Note-Diffs** (ein Fund betrifft 3 Notes) → das macht `classify-clippings.ts`
  nach Pfad B.
- **MOC-Index-Updates** → das macht `update-indices.ts` automatisch nach Merge.
- **Stub-Anlegen in `products.yaml`** → manueller Schritt vor Researcher-Lauf.

## Referenzen

- Roadmap (Phase 1+2): `cowork-handoff/02-ROADMAP.md`
- Product Note Template: `MS_AI_Wiki/Microsoft/_Templates/Product Note Template.md`
- Audit-Skript: `.automation/scripts/audit-notes.ts`
- Pipeline-Stages: `.automation/scripts/{fetch,filter,patch,apply,update-indices,classify-clippings}.ts`

## Changelog

- {heute YYYY-MM-DD}: Initial-Version (4 Prompts + diese SOP) — Phase 1 Tag 1.
