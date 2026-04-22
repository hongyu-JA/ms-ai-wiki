# Live-Watcher: startet einen FileSystemWatcher auf MS_AI_Wiki/ und
# .automation/products.yaml und führt bei jeder Änderung `indices.ps1`
# automatisch aus — damit die MOC-Tabellen ohne manuellen Trigger aktuell
# bleiben, sobald du in Obsidian speicherst.
#
# Aufruf vom Repo-Root:   .\watch.ps1
# Beenden:                Strg+C
#
# Zur Vermeidung von Endlos-Schleifen werden die AUTO-INDEX-Zieldateien
# (Root-MOC und Primary-Home-MOCs) und Pipeline-State-Files ignoriert.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$watchRoot = Join-Path $root "MS_AI_Wiki"
$debounceMs = 1500

# Pfad-Filter: Änderungen hier ignorieren (würden Endlos-Loops erzeugen).
$ignorePatterns = @(
  'Microsoft[\\/]Microsoft MOC\.md$',
  'Microsoft[\\/]MOCs[\\/].+\.md$',
  '_Inbox[\\/]_processed',
  '_Inbox[\\/]_rejected',
  '\.obsidian[\\/]',
  '\.trash[\\/]'
)

function Test-ShouldIgnore($path) {
  foreach ($pat in $ignorePatterns) {
    if ($path -match $pat) { return $true }
  }
  return $false
}

$script:lastRun = [DateTime]::MinValue
$script:pending = $false

function Invoke-IndicesIfStale {
  $now = [DateTime]::UtcNow
  if (($now - $script:lastRun).TotalMilliseconds -lt $debounceMs) {
    $script:pending = $true
    return
  }
  $script:lastRun = $now
  $script:pending = $false
  try {
    Push-Location (Join-Path $root ".automation")
    Write-Host "[watch] $(Get-Date -Format 'HH:mm:ss') → indices rebuild..." -ForegroundColor Cyan
    bun run scripts/update-indices.ts | Out-Host
  } catch {
    Write-Host "[watch] Fehler: $($_.Exception.Message)" -ForegroundColor Red
  } finally {
    Pop-Location
  }
}

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $watchRoot
$watcher.Filter = "*.md"
$watcher.IncludeSubdirectories = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor
                       [System.IO.NotifyFilters]::FileName -bor
                       [System.IO.NotifyFilters]::DirectoryName

$action = {
  $evPath = $Event.SourceEventArgs.FullPath
  $rel = $evPath.Substring($using:root.Length).TrimStart('\','/')
  if (Test-ShouldIgnore $rel) { return }
  Write-Host "[watch] Event: $($Event.SourceEventArgs.ChangeType) — $rel" -ForegroundColor DarkGray
  Invoke-IndicesIfStale
}

$handlers = @()
foreach ($evt in 'Changed','Created','Deleted','Renamed') {
  $handlers += Register-ObjectEvent -InputObject $watcher -EventName $evt -Action $action
}

$watcher.EnableRaisingEvents = $true
Write-Host "[watch] überwache $watchRoot (Strg+C zum Beenden)" -ForegroundColor Green
Write-Host "[watch] ignoriere: MOCs, _Inbox/_processed, _Inbox/_rejected, .obsidian, .trash" -ForegroundColor DarkGray

try {
  while ($true) {
    Start-Sleep -Milliseconds 500
    # Debounce: wenn während des Cooldowns Events ankamen, am Ende ein Mal nachlaufen
    if ($script:pending -and (([DateTime]::UtcNow - $script:lastRun).TotalMilliseconds -ge $debounceMs)) {
      Invoke-IndicesIfStale
    }
  }
} finally {
  $watcher.EnableRaisingEvents = $false
  $handlers | ForEach-Object { Unregister-Event -SourceIdentifier $_.Name }
  $watcher.Dispose()
}
