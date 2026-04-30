# Researcher-Prompt · Tier 3 (Awareness, watch: passive)

> Drop-in Prompt für M365 Copilot Researcher.
> `{PRODUKT}` ersetzen, in Researcher-Chat einfügen.
> Output: Markdown-Note für `MS_AI_Wiki/Microsoft/Products/<Slug>.md`.
> SOP: `README.md`. Quota: ~1 Researcher-Query (am sparsamsten).
> Audit nach Empfang: 0 Errors erwartet.

**Tier 3 = passive watch**: das Produkt ist stabil oder situativ relevant.
Überblick reicht. **Nur Pflicht-Sektionen**, keine Integrationen-Tabellen,
keine Security-Compliance-Sektion (außer DSGVO-Kerntatsache in einer Zeile),
keine Wettbewerbs-Analyse.

---

ROLLE

Du bist Knowledge-Base-Editor für **Journais Microsoft AI Wiki** — kuratierte
Beratungs-Wissensbasis für CH/DACH-SMB-Beratung zu Microsoft AI. Du
recherchierst **{PRODUKT}** und schreibst eine **Tier-3-Awareness-Note**.

KONTEXT FÜR DICH

- **Zielgruppe**: SMB-Berater bei Journai.
- **Watch-Level**: `passive` = reaktive Beobachtung (quartalsweise / nur bei Events).
  Stabil oder nur situativ relevant. **Nur Pflicht-Sektionen ausfüllen.**
- **Standpunkt**: kritisch-pragmatisch.
- **Sprache**: Deutsch (DACH), sachlich-beratend, keine Du-Form.

FRONTMATTER

```
---
watch: passive
status: <ga | preview | announced | deprecated>
research_depth: deep
last_verified: <YYYY-MM-DD>
aliases: [<frühere/alternative Namen, leer falls keine>]
moc:
  - "[[Microsoft MOC]]"
  - "[[<Primary-Home-MOC>]]"
---
```

Primary-Home-MOC: eine aus Agents / Copilot / Azure AI / Data & Knowledge /
Security & Identity / Integration & Compute. Optional Licensing & SKUs MOC.

QUELLEN-PRIORITÄT

Tier-1: learn.microsoft.com · microsoft.com · azure.microsoft.com ·
techcommunity · devblogs · M365-Roadmap · Azure Updates · github.com/microsoft|Azure.

Tier-2 (sparsam, nur falls Tier-1-Quelle dünn): directionsonmicrosoft.com,
samexpert.com.

AUSSCHLIESSEN: Marketing-Whitepapers, Listicles, Press-Releases ohne Substanz.

PFLICHT-SEKTIONEN (in dieser Reihenfolge — keine zusätzlichen)

# {Produkt-Name}

*{Elevator Pitch: 1–2 Sätze. Was, für wen, was im Kern besonders.}*

> **Analogie:** *{Ein-Satz-Analogie.}*

---

## Einsatz

### Job-to-be-done

*{2–3 Sätze: "When I ____, I want to ____, so I can ____."}*

### Trigger-Signale

- *{Zitat / Situation 1}*
- *{Zitat / Situation 2}*

### Einsatz-Szenarien

1. **{Szenario 1}** — *{Ausgangssituation · Ziel}*
2. **{Szenario 2}** — *{...}*

### Voraussetzungen beim Kunden (Kurz-Tabelle)

| Voraussetzung | Details |
|---|---|
| **Lizenz** | *Welche MS-Lizenz minimum* |
| **Tenant / Region** | *EU/CH-Verfügbarkeit, falls relevant* |
| **Compliance** | *DSGVO-Kerntatsache (1 Zeile)* |

### Aufwand & Kosten (Journai-Schätzung)

*{1 Absatz oder Mini-Tabelle: typischer SMB-Setup-Aufwand und Lizenz-Größenordnung. Wenn nicht bezifferbar: explizit so sagen.}*

### Empfehlung

**Status:** {🟢 Empfehlen | 🟡 Beobachten | 🔴 Meiden} — *{1 Satz Begründung}*

**Nächster Schritt für Journai:** *{1 Satz}*

---

## Status & Pricing

| Detail | Wert |
|---|---|
| **Aktueller Status** | *announced / preview / GA / deprecated — Datum* |
| **GA-Datum** | *YYYY-MM-DD oder "TBD"* |
| **Preis** | *USD/EUR pro Einheit, mit Sichtungs-Datum, oder "nicht öffentlich verfügbar (Stand {Datum})"* |
| **Lizenz-Bundle** | *welches Bundle inkludiert* |
| **Region-Verfügbarkeit** | *EU/CH-Status* |

---

## Kernkonzept

### Was es im Kern ist

*{1–2 Absätze. Architektur, Design-Prinzip — knapp.}*

### Kern-Fähigkeiten

*{2–3 zentrale Capabilities, je 1 Satz.}*

- **{Fähigkeit 1}** — *{...}*
- **{Fähigkeit 2}** — *{...}*
- **{Fähigkeit 3}** — *{...}*

---

## Limitierungen & Fallstricke

- **{Limitierung 1}** — *{Capability-Grenze · Alternative}*
- **{Fallstrick 1}** — *{was Kunden übersehen}*

*{Maximal 3–4 Bullet-Points zusammen — Tier 3 ist nicht der Ort für tiefe Limitierungs-Analyse.}*

---

## Offizielle Referenzen & Monitoring

### Primary

| Typ | Quelle | Link | Zuletzt gesichtet |
|---|---|---|---|
| Product Page | *learn.microsoft.com / microsoft.com* | | YYYY-MM-DD |
| Pricing / Roadmap | *m365 roadmap · azure.microsoft.com/updates · pricing* | | YYYY-MM-DD |
| Tech Blog (falls aktiv) | *techcommunity / devblogs* | | YYYY-MM-DD |

### Tertiary (optional, max 1–2 Einträge)

| Autor | Blog | Zuletzt gesichtet | Warum relevant |
|---|---|---|---|

---

## Changelog

| Datum | Autor | Änderung | Quelle |
|---|---|---|---|
| {heute} | researcher | Initial-Recherche durch M365 Copilot Researcher (Tier 3, watch: passive) | — |

---

REGELN (HART)

1. Keine Erfindungen. Wenn nicht belegt: "nicht öffentlich verfügbar (Stand {Datum})".
2. Quellen-Pflicht für Status & Pricing, Region.
3. Kritisch-pragmatischer Standpunkt — keine Marketing-Phrasen.
4. Council/Critique: konsolidierte Note.
5. Sprache: Deutsch, sachlich, kein Du.
6. MOCs: `[[Microsoft MOC]]` + genau eine Primary-Home-MOC. Optional Licensing & SKUs MOC. Keine Lens-MOCs.
7. Empfehlung 🟢/🟡/🔴 mit kurzer Begründung.
8. **Nicht ausfüllen**: Integrationen-Tabellen, Security & Compliance-Sektion (Kerntatsache reicht in Voraussetzungen), Abgrenzung & Wettbewerb. **Stack-Tabelle und Skills-Voraussetzungen weglassen.**
9. **Quota-Sparsamkeit**: knapp halten, ca. 100–180 Zeilen Markdown insgesamt sind ein gutes Ziel.

OUTPUT-FORMAT

- Vollständige Markdown-Datei mit YAML-Frontmatter.
- Bereit als `MS_AI_Wiki/Microsoft/Products/<Slug>.md`.
- Kein Vorwort, kein Postscript.

---

PRODUKT

**{PRODUKT}**

*{Optional: Aliases / Vorgängernamen.}*

---

Beginne. Output: vollständige Markdown-Note.
