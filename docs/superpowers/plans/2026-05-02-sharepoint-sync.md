# SharePoint-Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Spiegelt das lokale Obsidian-Vault automatisch alle 3 Stunden zu SharePoint, damit der Copilot Studio Agent immer den aktuellen Wissensstand sieht.

**Architecture:** β-B Variante (siehe Spec): PowerShell-Skript macht best-effort `git pull --ff-only` + `robocopy /MIR` vom lokalen Vault zum OneDrive-synced SharePoint-Library-Ordner. Windows Task Scheduler triggert das Skript bei Anmeldung + alle 3 Stunden. OneDrive-Client und Copilot-Indexer kümmern sich automatisch um den Rest.

**Tech Stack:** PowerShell 5.1 (Windows Built-in), robocopy (Windows Built-in), Windows Task Scheduler, OneDrive Sync Client, Copilot Studio (UI).

**Spec Reference:** [docs/superpowers/specs/2026-05-02-sharepoint-sync-design.md](../specs/2026-05-02-sharepoint-sync-design.md)

---

## Pre-Flight Check (vor Task 1)

- [ ] **Pre-Step 1: SharePoint-Library lokal synchronisieren**

Falls noch nicht erfolgt:
1. Im Browser öffnen: <https://journai.sharepoint.com/sites/Microsoft_AIProducts_Wiki/Freigegebene%20Dokumente/Forms/AllItems.aspx>
2. Toolbar → **"Synchronisieren"** klicken
3. OneDrive-Client erstellt Ordner `C:\Users\zhouh\Journai\Microsoft_AIProducts_Wiki - Dokumente`

- [ ] **Pre-Step 2: Pfad verifizieren**

```powershell
Test-Path 'C:\Users\zhouh\Journai\Microsoft_AIProducts_Wiki - Dokumente'
```
Erwartet: `True`. Wenn `False` → Pre-Step 1 nicht erfolgt oder OneDrive-Client noch nicht gesynct.

- [ ] **Pre-Step 3: PowerShell-Version prüfen**

```powershell
$PSVersionTable.PSVersion
```
Erwartet: `Major >= 5, Minor >= 1`. Windows 11 hat 5.1 vorinstalliert.

---

## Task 1: .gitignore um neue Log-Datei erweitern

**Files:**
- Modify: `.gitignore`

**Begründung:** Sync-Skript schreibt eine Log-Datei in `.automation/state/sharepoint-sync.log`. Diese Datei ändert sich alle 3 Stunden — niemals committen.

- [ ] **Step 1: Log-Eintrag in .gitignore ergänzen**

Datei `.gitignore` öffnen, **direkt nach** dem Block `# Transient pipeline artefacts` (Zeile ~30), folgende Zeile hinzufügen:

```
# SharePoint-Sync-Log (Skript schreibt jeden Lauf an, lokal-only)
.automation/state/sharepoint-sync.log
```

- [ ] **Step 2: Verifizieren**

```powershell
Select-String -Path .gitignore -Pattern 'sharepoint-sync'
```
Erwartet: 1 Match in Zeile mit `.automation/state/sharepoint-sync.log`.

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore(gitignore): exclude sharepoint-sync.log"
```

---

## Task 2: sync-to-sharepoint.ps1 schreiben

**Files:**
- Create: `.automation/scripts/sync-to-sharepoint.ps1`

**Begründung:** Das ist der zentrale Sync-Worker. β-B Variante: best-effort git pull, dann robocopy /MIR.

- [ ] **Step 1: Skript-Datei erstellen**

Vollständiger Inhalt von `.automation/scripts/sync-to-sharepoint.ps1`:

```powershell
# ============================================================================
# sync-to-sharepoint.ps1
# Spiegelt lokales MS_AI_Wiki Vault zu OneDrive-syncroniserter SharePoint-
# Library. β-B Variante: macht vorab best-effort `git pull --ff-only`, damit
# GitHub-side Daily-Sync-Merges automatisch zurück ins lokale Vault kommen.
#
# Aufruf:
#   - automatisch via Task Scheduler (siehe install-sharepoint-sync-task.ps1)
#   - manuell via sync-now.bat
#   - direkt: powershell.exe -ExecutionPolicy Bypass -File <pfad>
#
# Spec: docs/superpowers/specs/2026-05-02-sharepoint-sync-design.md
# ============================================================================

$ErrorActionPreference = 'Stop'

# === Konfiguration ==========================================================
$RepoRoot    = 'C:\Claude_code\MS_AI_Wiki'
$VaultSrc    = Join-Path $RepoRoot 'MS_AI_Wiki'
$OneDriveDst = 'C:\Users\zhouh\Journai\Microsoft_AIProducts_Wiki - Dokumente'
$LogFile     = Join-Path $RepoRoot '.automation\state\sharepoint-sync.log'

# === Header in Log =========================================================
$ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
"`n=== $ts Sync gestartet ===" | Out-File -Append -FilePath $LogFile -Encoding utf8

# === 1. Best-effort git pull ===============================================
Push-Location $RepoRoot
try {
    "[git] fetch origin main" | Out-File -Append -FilePath $LogFile -Encoding utf8
    git fetch origin main 2>&1 | Out-File -Append -FilePath $LogFile -Encoding utf8

    "[git] pull --ff-only" | Out-File -Append -FilePath $LogFile -Encoding utf8
    git pull --ff-only 2>&1 | Out-File -Append -FilePath $LogFile -Encoding utf8

    if ($LASTEXITCODE -ne 0) {
        "[git] pull fehlgeschlagen (vermutlich lokale uncommitted changes oder divergierte Historie). robocopy laeuft trotzdem mit lokalem Stand." | Out-File -Append -FilePath $LogFile -Encoding utf8
    }
} catch {
    "[git] Exception: $_" | Out-File -Append -FilePath $LogFile -Encoding utf8
} finally {
    Pop-Location
}

# === 2. Robocopy Mirror =====================================================
# /S       = Subfolder kopieren
# /MIR     = Mirror (Loeschungen am Source werden am Ziel propagiert)
# /XD      = Verzeichnisse ausschliessen (.obsidian = App-Konfig, irrelevant + Lärm)
# /R:3 /W:5 = 3 Retries, 5 Sek Wait (fuer Files, die Obsidian gerade schreibt)
# /LOG+    = Log appenden (nicht ueberschreiben)
# /NP      = kein Progress-Spam
# /TEE     = parallel zu Konsole
"[robocopy] $VaultSrc -> $OneDriveDst" | Out-File -Append -FilePath $LogFile -Encoding utf8

robocopy $VaultSrc $OneDriveDst `
    /S /MIR `
    /XD .obsidian `
    /R:3 /W:5 `
    /LOG+:$LogFile /NP /TEE

$rc = $LASTEXITCODE

# robocopy Exit-Codes: 0-7 = OK (mit/ohne Aenderungen), 8+ = Fehler
"[robocopy] exit code = $rc" | Out-File -Append -FilePath $LogFile -Encoding utf8

if ($rc -ge 8) {
    "=== FEHLER ($rc) ===" | Out-File -Append -FilePath $LogFile -Encoding utf8
    exit 1
}

"=== Sync fertig ($rc) ===" | Out-File -Append -FilePath $LogFile -Encoding utf8
exit 0
```

- [ ] **Step 2: Syntax-Check**

```powershell
$tokens = $errors = $null
[System.Management.Automation.Language.Parser]::ParseFile('.\.automation\scripts\sync-to-sharepoint.ps1', [ref]$tokens, [ref]$errors)
if ($errors.Count -eq 0) { 'OK' } else { $errors | ForEach-Object { $_.Message } }
```
Erwartet: `OK`.

- [ ] **Step 3: Dry-Run mit `/L` (zeigt was passiert ohne zu schreiben)**

```powershell
robocopy 'C:\Claude_code\MS_AI_Wiki\MS_AI_Wiki' 'C:\Users\zhouh\Journai\Microsoft_AIProducts_Wiki - Dokumente' /S /MIR /L /XD .obsidian /NP
```
Erwartet:
- Output zeigt mehrere Dutzend `New File` für `.md`-Dateien aus `Microsoft/`
- Output zeigt auch `_Inbox`, `_Templates`, `Clippings`-Inhalte
- KEIN Eintrag mit `.obsidian/` im Pfad
- KEINE `*EXTRA*`-Markierung (= robocopy würde am Ziel nichts löschen, weil Ziel weitgehend leer/identisch ist)

Falls Output anders aussieht: STOP, Ursache klären (vor allem falls `EXTRA Dir` auf SharePoint-Inhalte zeigt — das wäre ein Pfad-Tippfehler und würde später fremde SP-Inhalte löschen).

- [ ] **Step 4: Echter Lauf**

```powershell
.\.automation\scripts\sync-to-sharepoint.ps1
```
Erwartet:
- Konsole zeigt robocopy-Output (durch /TEE)
- Exit-Code 0–3 (0 = nichts zu tun, 1 = Files kopiert, 2 = extras gelöscht, 3 = beides)
- Log-Datei `.automation/state/sharepoint-sync.log` enthält Header + git + robocopy

- [ ] **Step 5: SharePoint-Verifizierung**

1. SharePoint im Browser öffnen
2. In `Microsoft_AIProducts_Wiki/Freigegebene Dokumente/Microsoft/` navigieren
3. `Microsoft Agent Framework.md` muss da sein, mit `Last Modified` = jetzt

Falls SharePoint die Datei nicht zeigt: 5 Min warten (OneDrive-Upload-Latenz), erneut prüfen.

- [ ] **Step 6: Commit**

```bash
git add .automation/scripts/sync-to-sharepoint.ps1
git commit -m "feat(sharepoint-sync): add sync-to-sharepoint.ps1 (β-B variant)"
```

---

## Task 3: install-sharepoint-sync-task.ps1 schreiben

**Files:**
- Create: `.automation/scripts/install-sharepoint-sync-task.ps1`

**Begründung:** Task Scheduler Definition als Code, nicht als GUI-Klicks. Idempotent (`-Force` überschreibt existierende Definition).

- [ ] **Step 1: Skript-Datei erstellen**

Vollständiger Inhalt von `.automation/scripts/install-sharepoint-sync-task.ps1`:

```powershell
# ============================================================================
# install-sharepoint-sync-task.ps1
# Registriert eine geplante Aufgabe, die sync-to-sharepoint.ps1 alle 3 Stunden
# und bei jeder Anmeldung ausfuehrt.
#
# Einmalig als angemeldeter User ausfuehren (kein Admin-Recht noetig — Task
# laeuft im User-Kontext, nicht als SYSTEM, weil OneDrive-Client + git creds
# user-spezifisch sind).
#
# Idempotent: kann beliebig oft erneut aufgerufen werden, -Force ueberschreibt
# die existierende Task-Definition.
# ============================================================================

$ErrorActionPreference = 'Stop'

$ScriptPath = 'C:\Claude_code\MS_AI_Wiki\.automation\scripts\sync-to-sharepoint.ps1'
$TaskName   = 'MS_AI_Wiki SharePoint Sync'

if (-not (Test-Path $ScriptPath)) {
    Write-Error "Skript nicht gefunden: $ScriptPath"
    exit 1
}

# Aktion: PowerShell ohne Konsolen-Fenster, ohne Execution-Policy-Prompt
$action = New-ScheduledTaskAction `
    -Execute 'powershell.exe' `
    -Argument "-WindowStyle Hidden -ExecutionPolicy Bypass -File `"$ScriptPath`""

# Trigger 1: bei jeder Anmeldung des aktuellen Users
$tLogin = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME

# Trigger 2: alle 3 Stunden, dauerhaft (100 Jahre = "praktisch fuer immer")
$tHourly = New-ScheduledTaskTrigger `
    -Once -At (Get-Date) `
    -RepetitionInterval (New-TimeSpan -Hours 3) `
    -RepetitionDuration ([TimeSpan]::FromDays(36500))

# Settings
$settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 10) `
    -MultipleInstances IgnoreNew

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger @($tLogin, $tHourly) `
    -Settings $settings `
    -Description 'Spiegelt MS_AI_Wiki vault auf SharePoint via OneDrive-Sync. Spec: docs/superpowers/specs/2026-05-02-sharepoint-sync-design.md' `
    -Force | Out-Null

Write-Host "OK: Task '$TaskName' registriert."
Write-Host "    Trigger: bei Login + alle 3 Stunden"
Write-Host "    Manuell starten: schtasks /Run /TN `"$TaskName`""
Write-Host "    Status pruefen: Get-ScheduledTask -TaskName '$TaskName'"
```

- [ ] **Step 2: Syntax-Check**

```powershell
$tokens = $errors = $null
[System.Management.Automation.Language.Parser]::ParseFile('.\.automation\scripts\install-sharepoint-sync-task.ps1', [ref]$tokens, [ref]$errors)
if ($errors.Count -eq 0) { 'OK' } else { $errors | ForEach-Object { $_.Message } }
```
Erwartet: `OK`.

- [ ] **Step 3: Skript ausfuehren**

```powershell
.\.automation\scripts\install-sharepoint-sync-task.ps1
```
Erwartet: `OK: Task 'MS_AI_Wiki SharePoint Sync' registriert.`

- [ ] **Step 4: Task-Existenz verifizieren**

```powershell
Get-ScheduledTask -TaskName 'MS_AI_Wiki SharePoint Sync' | Format-List TaskName, State, Triggers
```
Erwartet:
- `State: Ready`
- 2 Triggers (LogonTrigger + TimeTrigger mit Repetition 03:00:00)

- [ ] **Step 5: Manuell triggern und Log pruefen**

```powershell
Start-ScheduledTask -TaskName 'MS_AI_Wiki SharePoint Sync'
Start-Sleep -Seconds 30
Get-Content '.\.automation\state\sharepoint-sync.log' -Tail 20
```
Erwartet:
- Log enthaelt einen frischen `=== ... Sync gestartet ===` Block
- Mit git + robocopy-Output
- Letzte Zeile: `=== Sync fertig ($rc) ===` mit rc 0–3

Falls die Task-Ausfuehrung scheitert, im Task Scheduler Last-Run-Result ansehen:
```powershell
Get-ScheduledTaskInfo -TaskName 'MS_AI_Wiki SharePoint Sync' | Format-List
```

- [ ] **Step 6: Commit**

```bash
git add .automation/scripts/install-sharepoint-sync-task.ps1
git commit -m "feat(sharepoint-sync): add Task Scheduler installer (3h cadence)"
```

---

## Task 4: sync-now.bat schreiben

**Files:**
- Create: `.automation/scripts/sync-now.bat`

**Begründung:** Pre-Demo-Trigger. Doppelklick-Workflow für Hongyu (und später Christoph/Philipp wenn sie selbst syncen wollen).

- [ ] **Step 1: Datei erstellen**

Vollständiger Inhalt von `.automation/scripts/sync-now.bat`:

```bat
@echo off
REM ============================================================================
REM sync-now.bat
REM Manueller Trigger fuer SharePoint-Sync. Doppelklick aus Explorer.
REM Bleibt nach Ausfuehrung offen (pause), damit man die Ausgabe sehen kann.
REM ============================================================================

echo.
echo === Manueller SharePoint-Sync ===
echo.

powershell.exe -ExecutionPolicy Bypass -File "%~dp0sync-to-sharepoint.ps1"

echo.
echo === Fertig ===
echo SharePoint braucht jetzt ~5-15 Min, bis Copilot die Aenderungen sieht.
echo.
pause
```

- [ ] **Step 2: Datei testen (aus cmd, nicht doppelklicken)**

```cmd
cmd /c .\.automation\scripts\sync-now.bat
```
Erwartet:
- "=== Manueller SharePoint-Sync ===" am Anfang
- robocopy-Output im Mittelteil
- "=== Fertig ===" am Ende
- "Druecken Sie eine beliebige Taste..." (pause)

- [ ] **Step 3: Commit**

```bash
git add .automation/scripts/sync-now.bat
git commit -m "feat(sharepoint-sync): add sync-now.bat for manual pre-demo trigger"
```

- [ ] **Step 4 (optional, nicht in git): Desktop-Verknuepfung anlegen**

Hongyu macht das selbst:
1. Im Explorer zu `C:\Claude_code\MS_AI_Wiki\.automation\scripts\` navigieren
2. Rechtsklick auf `sync-now.bat` → **Senden an** → **Desktop (Verknüpfung erstellen)**
3. Auf dem Desktop die Verknuepfung umbenennen zu z.B. "Sync to SharePoint"

(Diese Verknuepfung wird NICHT in git versioniert, ist user-lokal.)

---

## Task 5: Copilot Studio Agent Konfiguration

**Files:** keine (UI-Konfiguration in Copilot Studio Web)

**Begründung:** Spec §5.4 — Knowledge-Source auf Subfolder einschraenken + Instructions setzen.

- [ ] **Step 1: Knowledge-Source URL aktualisieren**

1. Browser: <https://copilotstudio.microsoft.com>
2. Bestehenden Agent auswählen
3. Tab **Knowledge** öffnen
4. Existierende SharePoint-Source selektieren → **Remove**
5. **Add knowledge** → **SharePoint** → folgende URL eintragen:

```
https://journai.sharepoint.com/sites/Microsoft_AIProducts_Wiki/Freigegebene Dokumente/Microsoft
```

6. **Add** klicken, warten bis Status = "Ready"

- [ ] **Step 2: Instructions ersetzen**

1. Tab **Overview** oder **Settings** → Feld **Instructions**
2. Bestehenden Inhalt komplett ersetzen durch:

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

3. **Save** klicken

- [ ] **Step 3: Publish**

1. Oben rechts **Publish** Button klicken
2. Confirm-Dialog bestaetigen
3. Warten auf "Published" Bestaetigung

- [ ] **Step 4: Quick-Smoke-Test**

Im rechten Test-Panel folgendes fragen:
> Was ist Microsoft Agent Framework?

Erwartete Antwort-Eigenschaften:
- Auf Deutsch
- Erwaehnt MAF / Agent Framework
- Zitiert irgendwie die Quell-Note (z.B. "laut Microsoft Agent Framework.md")

Falls Antwort generic / englisch / ohne Quellen-Zitat: Instructions wurden nicht uebernommen → Step 2-3 wiederholen.

(Knowledge-Indexierung kann beim ersten Pointing auf Subfolder ein paar Minuten brauchen — falls Agent "ich kenne nichts" antwortet: 15 Min warten.)

---

## Task 6: End-to-End Acceptance Test

**Files:** keine (Test-Durchlauf)

**Begründung:** Spec §6 — beweist dass die ganze Pipeline funktioniert.

Diese Schritte sind die formale Abnahme. Ergebnis im Plan-Changelog am Ende dokumentieren.

- [ ] **Step 1: Test-Marker in lokalem Note einbauen**

Datei `MS_AI_Wiki/Microsoft/Products/Microsoft Agent Framework.md` öffnen, in der **Elevator-Pitch-Sektion** (typisch Zeile 11-15) am Ende eine Markerzeile einfügen, z.B.:

```markdown
SYNC-TEST-MARKER: 2026-05-02-acceptance
```

Speichern.

- [ ] **Step 2: Manuellen Sync triggern**

```cmd
cmd /c .\.automation\scripts\sync-now.bat
```
Erwartet: "=== Fertig ===" + Druecken Sie eine Taste...

- [ ] **Step 3: 5 Minuten warten + OneDrive-Status pruefen**

Im Windows-Tray das OneDrive-Icon ansehen. Erwartet: "Up to date" (kein animiertes Sync-Icon).

- [ ] **Step 4: SharePoint-Web-Verifizierung**

1. Browser: <https://journai.sharepoint.com/sites/Microsoft_AIProducts_Wiki/Freigegebene%20Dokumente/Forms/AllItems.aspx>
2. Navigieren zu `Microsoft / Products / Microsoft Agent Framework.md`
3. Datei oeffnen / preview
4. Marker `SYNC-TEST-MARKER: 2026-05-02-acceptance` muss sichtbar sein

Wenn nicht: robocopy-Log lesen → falls dort grün, OneDrive-Client neu starten.

- [ ] **Step 5: Copilot-Agent — Erstanfrage (kann noch fehlschlagen)**

In Copilot Studio Test-Panel:
> Welcher Marker steht in Microsoft Agent Framework Note in der Elevator-Pitch-Sektion?

Erste Antwort kann ohne Marker sein — Agent hat noch nicht reindiziert.

- [ ] **Step 6: 30 Minuten warten + erneute Anfrage**

Gleiche Frage erneut. Erwartet: Antwort enthaelt `SYNC-TEST-MARKER: 2026-05-02-acceptance` (oder ein wörtliches Zitat davon).

Wenn nach 1h immer noch nicht: in Copilot Studio Knowledge-Tab manuell **Refresh** klicken, weitere 15 Min warten.

- [ ] **Step 7: Marker entfernen + Cleanup-Sync**

1. Markerzeile aus `Microsoft Agent Framework.md` wieder entfernen
2. `cmd /c .\.automation\scripts\sync-now.bat` erneut ausfuehren
3. Optional: 30 Min spaeter prüfen dass Agent den Marker nicht mehr zitiert

- [ ] **Step 8: Test-Ergebnis im Spec-Changelog dokumentieren**

In `docs/superpowers/specs/2026-05-02-sharepoint-sync-design.md` am Ende, im `## Changelog`-Block ergänzen:

```markdown
- 2026-05-02: Acceptance-Test §6 erfolgreich durchlaufen. Markersichtbarkeit nach: SharePoint = X Min, Copilot Agent = Y Min.
```

(X und Y mit den real gemessenen Werten ersetzen.)

```bash
git add docs/superpowers/specs/2026-05-02-sharepoint-sync-design.md
git commit -m "docs(spec): document successful acceptance test run"
```

---

## Task 7: README aktualisieren

**Files:**
- Modify: `README.md`

**Begründung:** Damit ein neuer Entwickler (oder Hongyu in 6 Monaten) die SharePoint-Sync-Pipeline findet, ohne den Spec zu lesen.

- [ ] **Step 1: Neuer Abschnitt in README einfügen**

In `README.md` nach dem Abschnitt `## Wie das Versioning-Modell funktioniert` (vor `## Mapping auf die Deliverables`), folgenden neuen Abschnitt einfügen:

```markdown
---

## SharePoint-Sync (für Copilot Studio Agent)

Das lokale Vault wird zusätzlich zu GitHub auch zu SharePoint gespiegelt,
damit der interne **Copilot Studio Agent** immer den aktuellen Wissensstand
sieht. Architektur: lokales Obsidian = Source of Truth → robocopy → OneDrive
→ SharePoint Library `Microsoft_AIProducts_Wiki`.

**Cadence:** alle 3 Stunden + bei jeder User-Anmeldung (Windows Task Scheduler).

**Skripte:**

| Datei | Wann | Wie |
|---|---|---|
| `.automation/scripts/sync-to-sharepoint.ps1` | automatisch (Task Scheduler) | wird vom Task triggert, kein manueller Aufruf nötig |
| `.automation/scripts/install-sharepoint-sync-task.ps1` | einmalig | als angemeldeter User in PowerShell ausführen |
| `.automation/scripts/sync-now.bat` | vor Demos | Doppelklick (Desktop-Verknuepfung empfohlen) |

**Setup auf neuer Maschine:**

1. SharePoint-Library im Browser öffnen → "Synchronisieren" klicken (OneDrive-Client erstellt lokalen Ordner)
2. Pfad in `sync-to-sharepoint.ps1` an die Maschine anpassen (Konstanten oben im Skript)
3. `.\.automation\scripts\install-sharepoint-sync-task.ps1` ausführen
4. Acceptance-Test laut [docs/superpowers/specs/2026-05-02-sharepoint-sync-design.md](docs/superpowers/specs/2026-05-02-sharepoint-sync-design.md) §6 durchlaufen

**Logs:** `.automation/state/sharepoint-sync.log` (gitignored, lokal-only).

**Spec + Plan:**
- [Design Spec](docs/superpowers/specs/2026-05-02-sharepoint-sync-design.md)
- [Implementation Plan](docs/superpowers/plans/2026-05-02-sharepoint-sync.md)
```

- [ ] **Step 2: Verifizieren**

```powershell
Select-String -Path README.md -Pattern 'SharePoint-Sync'
```
Erwartet: 1+ Match.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs(readme): document SharePoint-Sync pipeline"
```

---

## Task 8: PR erstellen

**Files:** keine

- [ ] **Step 1: Branch-Status prüfen**

```bash
git status
git log --oneline origin/main..HEAD
```
Erwartet: ~6 Commits ahead (gitignore, sync-script, install-script, bat, spec-changelog, README).

- [ ] **Step 2: Push**

```bash
git push -u origin claude/trusting-shaw-6872f3
```

- [ ] **Step 3: PR oeffnen via gh**

```bash
gh pr create --title "feat: SharePoint-Sync für Copilot Studio Agent" --body "$(cat <<'EOF'
## Summary

Spiegelt das lokale Obsidian-Vault automatisch alle 3 Stunden zu SharePoint
(Library `Microsoft_AIProducts_Wiki`), damit der interne Copilot Studio Agent
immer den aktuellen Wissensstand sieht.

β-B Variante: PowerShell-Skript macht best-effort `git pull --ff-only` + 
`robocopy /MIR`. Windows Task Scheduler triggert bei Anmeldung + alle 3h.

Pivot von Foundry Hands-on (blockiert: kein Azure-Zugang) zu M365 Copilot
Declarative Agent Hands-on. Path α (Graph API) nicht moeglich ohne Entra
App-Registration-Rechte.

## Test plan

- [x] Spec self-review (siehe spec §1-9)
- [x] Acceptance Test §6 durchlaufen (Markersichtbarkeit-Latenzen dokumentiert)
- [x] Copilot Studio Agent antwortet auf Deutsch mit Quellen-Zitaten
- [x] Task Scheduler Task aktiv und triggert alle 3h

## Spec + Plan

- Design: `docs/superpowers/specs/2026-05-02-sharepoint-sync-design.md`
- Plan: `docs/superpowers/plans/2026-05-02-sharepoint-sync.md`

## Side-finding (separate work)

Beim Brainstorming entdeckt: 4 von 5 Sources in `sources.yaml` sind disabled
oder broken. Effektive Daily-Sync-Coverage: 1/45 Notes. Nicht in diesem PR
behoben — separates Ticket.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-Review Notes

**Spec coverage:**
- §2 Ziel 1 (3h SharePoint-Latenz) → Task 3 (3h-Cadence im Trigger)
- §2 Ziel 2 (3.5h Agent-Latenz) → Task 6 (Acceptance Test misst real)
- §2 Ziel 3 (Pre-Demo manueller Sync) → Task 4 (sync-now.bat)
- §2 Ziel 4 (alles git-versioniert) → Tasks 2/3/4/7 committen alles
- §3 Non-Goals → keine Tasks dafür (per Definition out of scope)
- §5.1 Sync-Skript → Task 2
- §5.2 Task-Scheduler-Installer → Task 3
- §5.3 sync-now.bat → Task 4
- §5.4 Copilot Studio Config → Task 5
- §6 Acceptance Test → Task 6
- §7 Risiken → adressiert via Dry-Run (Task 2 Step 3) + idempotent installer + log
- §8 Open Questions → in PR-Description erwaehnt als side-finding

**Placeholder scan:** Keine "TBD/TODO/implement later" gefunden. Alle Skripte vollstaendig ausgeschrieben.

**Type consistency:**
- `$LogFile` einheitlich `.automation/state/sharepoint-sync.log` in sync-Skript, gitignore und README
- `$TaskName` einheitlich `'MS_AI_Wiki SharePoint Sync'` in installer + Verifikations-Befehlen
- Pfad `C:\Claude_code\MS_AI_Wiki\` einheitlich in allen Skripten
- OneDrive-Pfad `C:\Users\zhouh\Journai\Microsoft_AIProducts_Wiki - Dokumente` einheitlich
