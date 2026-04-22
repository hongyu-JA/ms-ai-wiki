#!/usr/bin/env bash
# Schneller MOC-Rebuild ohne Feeds und ohne Claude.
# Aufruf vom Repo-Root:   ./indices.sh
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$here/.automation"

echo "[indices] MOC-Tabellen werden neu aufgebaut..."
bun run scripts/update-indices.ts
echo "[indices] Fertig."
