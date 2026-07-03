#!/usr/bin/env bash
# ── Migration health check ──────────────────────────────────────────
# Run this in CI or as a pre-commit hook to ensure the Prisma migration
# history is clean. Fails if:
#   1. Pending migrations exist that haven't been deployed
#   2. The DB has drifted from the migration history (db push was used)
#
# Usage: ./scripts/check-migrations.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "==> Checking Prisma migration status..."

# migrate status returns non-zero when there are pending migrations,
# drift, or other issues. Capture the full output.
STATUS_OUTPUT=$(npx prisma migrate status 2>&1) || true

echo "$STATUS_OUTPUT"

# Fail if there are unapplied migrations (should have been deployed)
if echo "$STATUS_OUTPUT" | grep -q "not yet been applied"; then
    echo ""
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    echo "!  PENDING MIGRATIONS DETECTED.                           !"
    echo "!  Run 'prisma migrate deploy' before merging.             !"
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    exit 1
fi

# Fail if drift is detected (someone used db push)
if echo "$STATUS_OUTPUT" | grep -qi "drift"; then
    echo ""
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    echo "!  DATABASE DRIFT DETECTED.                                !"
    echo "!  Someone likely used 'prisma db push'.                   !"
    echo "!  DO NOT db push again — create a proper migration.       !"
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    exit 1
fi

echo "==> Migration history is CLEAN."
