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
# /S        = Subfolder kopieren
# /MIR      = Mirror (Loeschungen am Source werden am Ziel propagiert)
# /XD       = Verzeichnisse ausschliessen:
#             .obsidian   = App-Konfig, irrelevant
#             .smart-env  = Smart-Connections-Plugin-Cache (~25 MB .ajson Dateien,
#                           wuerden Copilot-Antworten korrumpieren)
# /XF       = Datei-Patterns ausschliessen:
#             .849*       = OneDrive-Sync-Marker (versteckte Datei mit GUID-Namen,
#                           wird vom OneDrive-Client gepflegt — /MIR darf sie
#                           nicht loeschen, sonst verliert OneDrive die Sync-
#                           Verbindung des Ordners).
# /R:3 /W:5 = 3 Retries, 5 Sek Wait (fuer Files, die Obsidian gerade schreibt)
# /LOG+     = Log appenden (nicht ueberschreiben)
# /NP       = kein Progress-Spam
# /TEE      = parallel zu Konsole
"[robocopy] $VaultSrc -> $OneDriveDst" | Out-File -Append -FilePath $LogFile -Encoding utf8

robocopy $VaultSrc $OneDriveDst `
    /S /MIR `
    /XD .obsidian .smart-env `
    /XF .849* `
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
