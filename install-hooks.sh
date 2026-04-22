#!/usr/bin/env bash
# Aktiviert die Repo-Hooks (hooks/pre-commit etc.) für diesen Clone.
# Ein Lauf pro Clone reicht.
#   ./install-hooks.sh
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$here"

git config core.hooksPath hooks
echo "[install-hooks] core.hooksPath=hooks gesetzt."
echo "[install-hooks] Aktive Hooks:"
ls hooks | sed 's/^/  - /'
