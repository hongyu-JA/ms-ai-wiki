# Schneller MOC-Rebuild ohne Feeds und ohne Claude.
# Scannt alle Products + Primary-Home-MOCs und schreibt:
#   - "Stand der Wissensbasis" in Microsoft MOC
#   - "Research-Status pro Produkt" in Microsoft MOC
#   - "Produkte in dieser MOC" in allen 7 Primary-Home-MOCs
#
# Aufruf vom Repo-Root:
#   .\indices.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $root ".automation")

Write-Host "[indices] MOC-Tabellen werden neu aufgebaut..." -ForegroundColor Cyan
bun run scripts/update-indices.ts
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "[indices] Fertig." -ForegroundColor Green
