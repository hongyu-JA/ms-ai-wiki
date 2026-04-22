#!/usr/bin/env bash
# Manueller Voll-Sync — fetch + filter + patch (Claude) + apply + Index-Rebuild.
# Aufruf vom Repo-Root:   ./sync.sh        (normal)
#                         ./sync.sh --dry  (Dry-Run)
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$here/.automation"

# .env laden (nur simple KEY=VALUE Zeilen)
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . .env
  set +a
  echo "[sync] .env geladen"
else
  echo "[sync] WARNUNG: keine .env gefunden — Claude-Calls werden Dry-Run"
fi

if [ "${1:-}" = "--dry" ]; then
  export DRY_RUN=1
  export DRY_WRITE=1
  echo "[sync] DRY-RUN-Modus"
fi

echo "[sync] Stage 0 — fetch"
bun run scripts/fetch.ts

echo "[sync] Stage 1 — filter"
bun run scripts/filter.ts

echo "[sync] Stage 2 — patch (Claude)"
bun run scripts/patch.ts

echo "[sync] Stage 3 — apply + Stage 4 Index-Rebuild"
bun run scripts/apply.ts

echo "[sync] Fertig."
