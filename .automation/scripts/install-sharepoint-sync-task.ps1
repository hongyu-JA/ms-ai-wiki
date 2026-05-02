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

# Trigger 2: alle 3 Stunden, dauerhaft.
# Hinweis: Task Scheduler akzeptiert maximal ~P9999D (~27 Jahre) als Duration.
# 36500 Tage (100 Jahre) wird mit "Wert ausserhalb Bereich" abgelehnt.
$tHourly = New-ScheduledTaskTrigger `
    -Once -At (Get-Date) `
    -RepetitionInterval (New-TimeSpan -Hours 3) `
    -RepetitionDuration (New-TimeSpan -Days 9999)

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
