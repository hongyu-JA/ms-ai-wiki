---
type: spec
created: 2026-05-02
owner: Hongyu
status: approved
related_issue: M365 Copilot Declarative Agent Hands-on (Pivot von Foundry Hands-on)
---

# Spec: SharePoint-Sync für Copilot Agent Knowledge Base

## 1. Kontext & Problem

Die MS_AI_Wiki Knowledge-Base existiert in zwei Welten, die nicht synchron sind:

- **Lokales Obsidian-Vault** unter `C:\Claude_code\MS_AI_Wiki\` — Hongyus
  primärer Bearbeitungs-Ort, **Source of Truth**.
- **GitHub Repo** — Kollaborations- und Automation-Layer, downstream zum lokalen
  Vault. Daily-Sync-Pipeline öffnet PRs, die Hongyu in main merged.
- **SharePoint Library** `Microsoft_AIProducts_Wiki` — wurde einmalig manuell
  hochgeladen, ist seit Wochen nicht mehr aktualisiert worden.

Ein in Copilot Studio gebauter "einfacher Agent" zieht aus dieser SharePoint
Library — und antwortet damit auf veralteten Inhalten. Christoph/Philipp
können den Agent nicht für Kundengespräche verwenden, solange das so bleibt.

**Constraint:** Hongyu hat **keine Entra App-Registration-Berechtigung**, also
keinen Service-Principal-basierten Graph-API-Zugang. Damit fällt der saubere
GitHub-Actions → Graph-API-Pfad weg (Pfad α aus Brainstorming).

## 2. Ziel

Eine Pipeline, die das **lokale Obsidian-Vault automatisch zu SharePoint
spiegelt**, damit der Copilot Studio Agent immer den aktuellen Wissensstand
sieht — ohne tägliches manuelles Hochladen.

**Erfolgskriterium (akzeptiert, wenn alles erfüllt):**
1. Eine Änderung an einem Note in lokalem Obsidian erscheint **innerhalb von
   3 Stunden** auf SharePoint (ohne menschlichen Eingriff).
2. Eine Änderung am Note erscheint **innerhalb von ~3,5 Stunden insgesamt** in
   den Antworten des Copilot Studio Agents.
3. Wenn Hongyu vor einer Demo manuell `sync-now.bat` ausführt, sieht er das
   Ergebnis in SharePoint binnen ~5 Minuten und im Agent binnen ~30 Minuten.
4. Die gesamte Konfiguration (Sync-Skript, Task-Scheduler-Setup, Verifizierung)
   ist **git-versioniert** im Repo, nicht in der UI versteckt.

## 3. Non-Goals (explizit out-of-scope)

- **Keine bidirektionale Sync.** Wenn jemand auf SharePoint editiert, geht das
  beim nächsten lokalen Sync-Run **verloren**. SharePoint ist nur Konsum, nicht
  Bearbeitung.
- **Kein Real-Time-Sync.** 3-Stunden-Latenz ist akzeptiert.
- **Kein Service-Principal / Graph-API-Pfad.** Unmöglich ohne App-Registration.
- **Keine Migration des Agents zu M365 Agents Toolkit Manifest.** Der bestehende
  Copilot-Studio-Agent bleibt; nur seine Knowledge-Source-Konfiguration wird
  geprüft / präzisiert.
- **Keine Behebung der defekten Daily-Sync-RSS-Quellen.** `azure-updates`,
  `m365-roadmap`, `devblogs-foundry` bleiben deaktiviert — separates Ticket
  (siehe §8 Open Questions).

## 4. Architektur

```
                       ┌─────────────────────────────────┐
              git pull │  Lokales Obsidian Vault         │ git push
        ┌────────────► │  C:\Claude_code\MS_AI_Wiki\...  │ ────────────┐
        │              │       (Source of Truth)         │             │
        │              └──────────────┬──────────────────┘             │
        │                             │                                │
        │                       robocopy /MIR                          │
        │                             ▼                                │
        │           ┌─────────────────────────┐                        │
        │           │  OneDrive-sync. Ordner  │                        │
        │           │  C:\...\Journai\        │                        │
        │           │  Microsoft_AIProducts_  │                        │
        │           │  Wiki - Dokumente\      │                        │
        │           └────────────┬────────────┘                        │
        │                        │ OneDrive-Client (M$, automatisch)   │
        │                        ▼                                     │
        │           ┌─────────────────────────┐         ┌──────────────▼─┐
        │           │  SharePoint Library     │         │  GitHub repo   │
        │           │  /Microsoft (Subfolder) │         │  (collab + CI) │
        │           └────────────┬────────────┘         │                │
        │                        │ Indexer (M$, auto)   │ daily-sync.yml │
        │                        ▼                      │   ↓ erstellt PR│
        │              Copilot Studio Agent             │   Hongyu mergt │
        │                                               └────────┬───────┘
        │                                                        │
        └────────────────────────────────────────────────────────┘
              git pull --ff-only (best-effort, im Sync-Skript)
```

**Zwei Sync-Pfade vom lokalen Vault aus, beide einseitig:**
- `git push` → GitHub (manuell durch Hongyu, wie bisher)
- `robocopy /MIR` → OneDrive-Ordner (automatisiert via Task Scheduler)

**Reverse-Pfad GitHub → Lokal**: das robocopy-Skript macht vorab ein
**best-effort `git pull --ff-only`**, damit GitHub-side Daily-Sync-Merges
automatisch zurück ins lokale Vault kommen und von dort zu SharePoint
propagieren (β-B Variante).

## 5. Komponenten

### 5.1 Sync-Skript

**Datei:** `.automation/scripts/sync-to-sharepoint.ps1`

**Verantwortung:**
1. `git fetch + pull --ff-only` (best effort — bei Konflikt überspringen)
2. `robocopy` mit `/MIR` vom Vault-Root zum OneDrive-Pfad
3. Logging in `.automation/state/sharepoint-sync.log`

**Konfigurations-Konstanten:**
- `$RepoRoot    = 'C:\Claude_code\MS_AI_Wiki'`
- `$VaultSrc    = "$RepoRoot\MS_AI_Wiki"` (gesamtes Vault, nicht nur `Microsoft/`)
- `$OneDriveDst = 'C:\Users\zhouh\Journai\Microsoft_AIProducts_Wiki - Dokumente'`
- `$LogFile    = "$RepoRoot\.automation\state\sharepoint-sync.log"`

**Robocopy-Regeln:**
- `/S /MIR` — Subfolder + Mirror (Löschungen werden propagiert)
- `/XD .obsidian` — nur Obsidian-App-Konfig ausschliessen (sonst alles dabei)
- `/R:3 /W:5` — 3 Retries, 5 Sek Wait (für Files, die Obsidian gerade schreibt)
- `/LOG+ /NP /TEE` — Append-Log, kein Progress-Spam, parallel zu stdout

**Fehler-Handling:**
- robocopy-Exit-Code 0–7 = OK, ≥ 8 = Fehler (Skript exit 1)
- Git-pull-Fehler werden gelogged, aber unterbrechen nicht — robocopy läuft trotzdem

### 5.2 Task-Scheduler-Installations-Skript

**Datei:** `.automation/scripts/install-sharepoint-sync-task.ps1`

**Verantwortung:** Einmalig ausführen, registriert die geplante Aufgabe
`MS_AI_Wiki SharePoint Sync`. Idempotent (läuft mit `-Force`, überschreibt
existierende Task-Definition).

**Trigger:**
- Bei jeder Anmeldung des aktuellen Users (`-AtLogOn`)
- Alle **3 Stunden** dauerhaft (`-RepetitionInterval (New-TimeSpan -Hours 3)`)

**Settings:**
- `-StartWhenAvailable` — verpasste Läufe werden nachgeholt
- `-AllowStartIfOnBatteries -DontStopIfGoingOnBatteries` — auch im Akku-Betrieb
- `-ExecutionTimeLimit 10 Min` — Sicherheitsnetz
- `-MultipleInstances IgnoreNew` — wenn vorheriger Lauf noch läuft, neuen ignorieren

**Läuft im User-Kontext, nicht als SYSTEM** (braucht User-Git-Credentials und
User-OneDrive-Sync-Client). Daher kein Admin-Recht für die Installation nötig.

### 5.3 Manueller Trigger

**Datei:** `.automation/scripts/sync-now.bat`

**Verantwortung:** Doppelklick führt `sync-to-sharepoint.ps1` interaktiv aus.
Für Pre-Demo-Szenarien.

```bat
@echo off
echo Manueller SharePoint-Sync laeuft...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0sync-to-sharepoint.ps1"
echo.
echo Fertig. SharePoint braucht jetzt ~5-15 Min, bis Copilot die Aenderungen sieht.
pause
```

Verknüpfung auf Desktop legen für 1-Klick-Zugriff.

### 5.4 Copilot Studio Agent — Konfigurations-Anpassungen

**Wo:** [copilotstudio.microsoft.com](https://copilotstudio.microsoft.com) → bestehender Agent.

**A. Knowledge Source URL präzisieren** auf den Subfolder `Microsoft/`:
```
https://journai.sharepoint.com/sites/Microsoft_AIProducts_Wiki/Freigegebene Dokumente/Microsoft
```
**Begründung:** SharePoint-Library enthält jetzt auch `_Inbox`, `_Templates`,
`Clippings` (Hongyus Wahl, für Browsing-Zweck). Aber Templates enthalten
`{{placeholder}}`-Strings, die der Agent als faktischen Inhalt zitieren würde.
Subfolder-Scoping verhindert das.

**B. Instructions** ersetzen durch:
```
Du bist der Microsoft-AI-Wissens-Assistent von Journai. Deine Wissensbasis ist
die interne Knowledge-Base zu Microsofts AI-Produkt-Ökosystem (M365 Copilot,
Foundry, Agent Framework, Copilot Studio, Entra Agent ID, etc.).

REGELN:
- Antworte auf Deutsch, sachlich und beratend (kein Marketing-Sprech).
- Wenn du eine Antwort nicht in der Wissensbasis findest, sage das ehrlich.
  Beispiel: "Diese Information habe ich nicht in meiner Knowledge-Base — frag
  Hongyu oder check direkt bei Microsoft Learn."
- Zitiere bei jeder Faktenaussage die Quell-Note (z.B. "laut Microsoft Agent
  Framework.md").
- Bei Deprecation-Fragen: immer den Migrationspfad mitnennen.
- Bei Pricing-Fragen: immer das `last_verified`-Datum aus dem Frontmatter erwähnen.
```

**C. Sharing für Demo:**
- Settings → Security → Authentication → "Anyone in your tenant"
- Channels → Microsoft Teams → Enable → Link an Christoph/Philipp

## 6. Acceptance Test (End-to-End)

Nachweis, dass die ganze Pipeline durchgängig funktioniert:

| Schritt | Aktion | Erwartung | Bei Fehler prüfen |
|---|---|---|---|
| 1 | In `Microsoft Agent Framework.md` lokalen Marker einfügen: `SYNC-TEST-2026-05-02` | Datei lokal geändert | — |
| 2 | `sync-now.bat` doppelklicken | Konsole zeigt "Fertig" | sharepoint-sync.log lesen |
| 3 | 5 Min warten | OneDrive-Symbol in Tray = "Up to date" | OneDrive-Client läuft? |
| 4 | SharePoint-Web öffnen, Datei ansehen | Marker sichtbar | OneDrive-Sync-Status |
| 5 | Copilot Studio → Test agent: "Welcher Marker steht in Microsoft Agent Framework Note?" | Erstantwort evtl. ohne Marker (noch nicht indiziert) | — |
| 6 | 30 Min später erneut fragen | Antwort enthält `SYNC-TEST-2026-05-02` | Knowledge-Source manuell refreshen |
| 7 | Marker entfernen, neuen Sync triggern | Cleanup abgeschlossen | — |

Test bestanden = Pipeline läuft. Im Spec dokumentieren wann letztes Mal grün durchgelaufen.

## 7. Risiken & Mitigationen

| Risiko | Wahrscheinlich | Impact | Mitigation |
|---|---|---|---|
| PC ist tagelang aus → Sync friert ein | Mittel | Mittel | `StartWhenAvailable` holt nach. Worst-Case: Hongyu mergt vor Demo manuell + sync-now.bat |
| Lokale uncommitted edits blockieren `git pull --ff-only` | Mittel | Niedrig | Skript loggt Warnung, robocopy läuft trotzdem. Hongyu sieht im Log → manuell auflösen |
| OneDrive-Client meldet Sync-Konflikt (manuell editiert auf SharePoint) | Niedrig (siehe Non-Goals) | Mittel | OneDrive macht "konfliktierte Kopie", lokal `/MIR` überschreibt beim nächsten Lauf. SharePoint-Edits gehen verloren — bewusst akzeptiert |
| Copilot-Indexierung dauert 4+ Stunden | Niedrig | Mittel | Vor Demo: 1 h Vorlauf einplanen. Im Studio "Refresh Knowledge" manuell triggern |
| `robocopy /MIR` löscht versehentlich SharePoint-Inhalte (z.B. wenn Pfad falsch) | Niedrig | Hoch | **Erstes Mal mit `/L` Dry-Run** (siehe Verifikation in Implementation-Plan) |
| Task Scheduler Task wird durch Windows-Update / GPO entfernt | Niedrig | Niedrig | install-Skript ist idempotent, einfach erneut ausführen |

## 8. Open Questions / Future Work (separate Tickets)

1. **Daily-Sync-Quellen reparieren** (großer Sub-Befund aus diesem Brainstorming):
   - 4 von 5 Sources in `sources.yaml` sind disabled oder broken
   - Effektive Coverage: 1/45 Notes (nur Microsoft Agent Framework)
   - Separate Aufgabe: `azure-updates`, `m365-roadmap`, `devblogs-foundry` reaktivieren / fixen
2. **Migration zu M365 Agents Toolkit Manifest** wenn Studio-UI-Limitierungen
   stören (nicht jetzt — "wenn nicht broken, nicht anfassen")
3. **Foundry Hands-on (echter Plan-§2.6 Punkt)** sobald Azure-Subscription
   verfügbar (via Christoph/Philipp oder Free Trial). Heute aufgeschoben wegen
   fehlendem Azure-Zugang.
4. **Bidirektionale Sync** falls Christoph/Philipp anfangen, Notes direkt
   auf SharePoint zu editieren — explizit jetzt nicht gebaut.

## 9. Implementations-Reihenfolge

1. `sync-to-sharepoint.ps1` schreiben + lokal **mit `/L` dry-runnen**
2. Wenn dry-run-Output sinnvoll: real ausführen, Ergebnis in SharePoint prüfen
3. `install-sharepoint-sync-task.ps1` schreiben + ausführen
4. `sync-now.bat` schreiben, Desktop-Verknüpfung anlegen
5. Copilot Studio Agent — Knowledge-URL präzisieren (Subfolder), Instructions
   ersetzen, publish
6. Acceptance-Test (§6) durchlaufen
7. Test bestanden → Christoph/Philipp Teams-Link senden
8. Im Repo: README-Hinweis auf neue Skripte ergänzen

## Changelog

- 2026-05-02: Initial-Spec nach Brainstorming-Session.
