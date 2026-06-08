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

## Konkrete API-Endpoints (laut Build-Keynote)

```python
from microsoft_iq import WorkIQ

iq = WorkIQ(tenant_id=..., user_context=current_user)

# Personen-Kontext
team = iq.people.colleagues(user_id="hongyu@journai.ch")
manager = iq.people.manager(user_id="hongyu@journai.ch")

# Meeting-Kontext mit Semantik
relevant = iq.meetings.relevant_to_query("Vertrag mit Kunde X")
# → liefert Meetings + Summary + geteilte Files

# File-Kontext nach Aktualität + Wichtigkeit
recent = iq.files.recent(scope="user", limit=20)
important = iq.files.important_to_user()  # ML-Ranking
```

## Pricing & Lizensierung

- **Inkludiert in M365 Copilot E3/E5** ohne Zusatzkosten
- **Standalone Work IQ:** CHF 12/User/Monat (für Tenants ohne Copilot-Lizenz)
- API-Calls aus Custom-Agents kosten zusätzlich: ca. $2 pro 1'000 Calls

## Use-Cases (typisch)

1. **Sales-Bot:** _"Wie war der letzte Kontakt mit Kunde X?"_ — Work IQ aggregiert Mails, Meetings, Notizen
2. **HR-Onboarding-Bot:** _"Was muss ich am ersten Tag tun?"_ — Personalisiert nach Position, Team, Sponsor
3. **Project-Status-Bot:** _"Wie steht's mit Projekt Y?"_ — aggregiert Teams-Chats, geteilte Files, Meeting-Notes
4. **Manager-Briefing:** automatisches morgendliches Briefing über Team-Aktivitäten der letzten 24h
5. **Compliance-Check:** _"Welche Mitarbeiter haben Zugriff auf vertrauliche Datei Z?"_

## Vergleich: Work IQ vs direkter Graph-Zugriff

| Aspekt | Work IQ | Direct Graph API |
|---|---|---|
| Aggregations-Logik | eingebaut (semantisch) | selbst implementieren |
| Berechtigungs-Trimming | automatisch | manuell |
| Relevanz-Ranking | ML-basiert | keyword-basiert oder selbst |
| Latenz | etwas höher (Wrapper) | direkt |
| Code-Aufwand | gering | hoch |
| Custom-Logik | begrenzt | voll |
| Empfohlen für | 80% Standard-M365-Bot-Cases | Spezial-Anforderungen, Hochvolumen |

**Faustregel:** wenn der Use-Case "Was hat der User mit/zu/über X gemacht/gesagt/geteilt?" ist → Work IQ. Wenn der Use-Case "Liste alle Files in Folder X" ist → Direct Graph.

## Häufige Stolpersteine

1. **Work IQ ist personalisiert pro User-Context.** Daher kein "globaler Tenant-Index" — jeder Call muss im User-Context laufen. Macht Multi-User-Reports tricky.
2. **Cross-Tenant funktioniert nicht.** Für externe Partner-Kollaboration weiterhin Graph + Custom-Logic.
3. **Schwergewichts-Permissions:** Work IQ braucht erweiterte Graph-Scopes — Admin-Consent erforderlich.
4. **Latenz höher als Direct Graph:** typisch 1-3 Sek vs 200ms — nicht für Real-Time-UI.

## Migrations-Pfad

### Von Direct-Graph-Integration auf Work IQ
Aufwand: **0.5-1 Tag** pro Bot.
1. Work-IQ-Endpoint im Tenant aktivieren (Admin Consent)
2. Bestehende Graph-Queries identifizieren, die "What is relevant?"-Frage stellen
3. Direkt durch Work-IQ-Calls ersetzen
4. Spezial-Logik (Listen, raw Item-Access) bleibt bei Direct Graph

## Schweizer Compliance-Implikationen

- **Datenspeicherung:** EU-Region wenn Tenant in EU — Switzerland North Q3/2026
- **FADP:** Standard-Microsoft-DPA deckt — keine zusätzliche Vereinbarung
- **Mitarbeiter-Datenschutz:** Work IQ verarbeitet Aktivitäts-Daten der Mitarbeiter — **Betriebsvereinbarung mit PR/HR empfohlen**, weil indirekter "Aktivitäts-Tracking" möglich
- **Audit:** vollständige Purview-Integration, jede IQ-Anfrage geloggt

## Vertiefungsbedarf (0.5-Tag-Aufwand)

- [ ] POC: Sales-Bot mit Work IQ auf Journai-eigenem Tenant
- [ ] Latenz-Messung im Vergleich zu unserer aktuellen Graph-Integration
- [ ] Mitarbeiter-Tracking-Implikationen mit Schweizer Arbeitsrecht klären
- [ ] Lizenz-Klarstellung bei nächstem Microsoft-Quartals-Review

## Quellen

- Microsoft Build 2026 Keynote (2. Juni 2026)
- [news.microsoft.com/build-2026](https://news.microsoft.com/build-2026/)
