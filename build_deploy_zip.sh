#!/usr/bin/env bash
set -euo pipefail

# Build and package the repository into a single ZIP for manual deployment.
# Excludes .git and node_modules by default to keep archive size reasonable.

OUT_ZIP="deploy-package-full.zip"
echo "Creating $OUT_ZIP ..."

rm -f "$OUT_ZIP"

# Create a temporary staging directory
TMPDIR=$(mktemp -d)
echo "Staging to $TMPDIR"

# Copy repository contents, preserving structure
rsync -a --exclude='.git' --exclude='node_modules' --exclude='dist/node_modules' ./ "$TMPDIR/"

# Ensure deploy config is present
if [ -n "${DB_HOST:-}" ]; then
  echo "Embedding DB config from environment into package."
  mkdir -p "$TMPDIR/deploy/cpanel/api"
  cat > "$TMPDIR/deploy/cpanel/api/db_config.php" <<PHP
<?php
return [
  'DB_HOST' => '${DB_HOST}',
  'DB_PORT' => '${DB_PORT:-5432}',
  'DB_NAME' => '${DB_NAME}',
  'DB_USER' => '${DB_USER}',
  'DB_PASS' => '${DB_PASS}',
];
PHP
else
  echo "No DB_HOST set; package will not include db_config.php (API will use environment variables at runtime)."
fi

# Create the ZIP file from staging dir
(cd "$TMPDIR" && zip -r9 "$OLDPWD/$OUT_ZIP" .)

echo "Created $OUT_ZIP (size: $(du -h "$OUT_ZIP" | cut -f1))"
rm -rf "$TMPDIR"
