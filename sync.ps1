# Manueller Voll-Sync — fetch + filter + patch (Claude) + apply + Index-Rebuild.
# Nutzt den ANTHROPIC_API_KEY aus .automation/.env.
#
# Aufruf vom Repo-Root:
#   .\sync.ps1
#
# Mit Dry-Run (keine Claude-Calls, keine File-Writes):
#   .\sync.ps1 -DryRun

param(
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

# .env laden — bevorzugt Repo-Root, Fallback .automation\.env
$envFile = $null
$rootEnv = Join-Path $root ".env"
$autoEnv = Join-Path $root ".automation\.env"
if (Test-Path $rootEnv) { $envFile = $rootEnv }
elseif (Test-Path $autoEnv) { $envFile = $autoEnv }

if ($envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.+?)\s*$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
    Write-Host "[sync] .env geladen aus $envFile" -ForegroundColor DarkGray
} else {
    Write-Host "[sync] WARNUNG: keine .env gefunden — Claude-Calls werden Dry-Run" -ForegroundColor Yellow
}

Set-Location (Join-Path $root ".automation")

if ($DryRun) {
    $env:DRY_RUN = "1"
    $env:DRY_WRITE = "1"
    Write-Host "[sync] DRY-RUN-Modus (keine Claude-Calls, keine File-Writes)" -ForegroundColor Yellow
}

Write-Host "[sync] Stage 0a — classify Clippings/" -ForegroundColor Cyan
bun run scripts/classify-clippings.ts
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "[sync] Stage 0b — fetch" -ForegroundColor Cyan
bun run scripts/fetch.ts
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "[sync] Stage 1 — filter" -ForegroundColor Cyan
bun run scripts/filter.ts
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "[sync] Stage 2 — patch (Claude)" -ForegroundColor Cyan
bun run scripts/patch.ts
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "[sync] Stage 3 — apply + Stage 4 Index-Rebuild" -ForegroundColor Cyan
bun run scripts/apply.ts
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "[sync] Fertig." -ForegroundColor Green
