# Aktiviert die Repo-Hooks (hooks/pre-commit etc.) für diesen Clone.
# Ein Lauf pro Clone reicht.
#   .\install-hooks.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

git config core.hooksPath hooks
Write-Host "[install-hooks] core.hooksPath=hooks gesetzt." -ForegroundColor Green
Write-Host "[install-hooks] Aktive Hooks:" -ForegroundColor DarkGray
Get-ChildItem hooks -File | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor DarkGray }
