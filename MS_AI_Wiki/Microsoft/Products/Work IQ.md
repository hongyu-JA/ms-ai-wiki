---
watch: open
status: stub_build_2026
last_verified: 2026-06-03
source: build-2026-keynote
aliases:
  - Work IQ APIs
  - M365 Work IQ
moc:
  - '[[Microsoft MOC]]'
  - '[[Data & Knowledge MOC]]'
  - '[[Microsoft IQ]]'
zuletzt_gesichtet: 2026-06-03
updated: 2026-06-03
---

# Work IQ

*Teil der [[Microsoft IQ]]-Familie. Wirft den Agenten produktions-reifen Kontext über das M365-Arbeitsumfeld zu — Personen, Meetings, Files, Chats, Workflows.*

> **Analogie:** Was Microsoft Graph als Datenquelle ist, ist Work IQ als verstehende Schicht obendrauf — nicht "hol mir Mails", sondern "was ist relevant für die aktuelle Frage des Users in seinem Arbeitskontext".

---

## Was leistet es?

- **Personen-Kontext:** Wer sind die Kollegen des Users, mit wem hat er kürzlich gesprochen, wer ist sein Manager?
- **Meeting-Kontext:** Welche Meetings hat er heute? Was wurde besprochen? Welche Files wurden geteilt?
- **File-Kontext:** Welche Dokumente bearbeitet er aktuell? Welche sind ihm wichtig?
- **Chat-Kontext:** Aktuelle Teams-Konversationen, Slack-Replikate
- **Workflow-Kontext:** Power-Automate-Flows, geplante Aktionen

Built-in: ACL-Respekt, Sensitivity-Labels, Compliance-Audit.

## Status

- GA seit Build 2026 (Juni)
- Region: US, EU (Switzerland North voraussichtlich Q3 2026)

## Wo passt es in die Architektur?

- **Layer:** KNOWLEDGE
- **Verbindungen:**
  - `grounds-on` ← MAF, Copilot Studio, M365 Copilot
  - Aufbauend auf Microsoft Graph (Work IQ ist Wrapper + Reasoning-Schicht)
  - `secured-by` → Microsoft Purview

## Beratungs-Relevanz

**Hoch — ersetzt graphbasierte Custom-Logik.**

Für M365-zentrische Agent-Lösungen war bisher viel manuelle Arbeit nötig:
- Graph-Queries für Termine
- Eigene Aggregation von Chat-Verläufen
- Berechtigungs-Check pro Item

Mit Work IQ entfällt das. Beratungs-Empfehlung für Sales-/HR-Bots:

> "Bisher hätten wir 5 Tage Custom-Graph-Integration eingeplant. Mit Work IQ ist das ein Tag Konfiguration."

## Vertiefungsbedarf (0.5-Tag-Aufwand)

- [ ] Konkrete API-Endpoints dokumentieren
- [ ] Pricing klären (in M365 Copilot inkludiert? Extra-Lizenz?)
- [ ] Vergleich mit direktem Graph-Zugriff

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [news.microsoft.com/build-2026](https://news.microsoft.com/build-2026/)
