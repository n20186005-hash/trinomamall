#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

rm -rf node_modules dist
CI=1 corepack pnpm install --frozen-lockfile
pnpm check
pnpm build

if [[ -f pnpm-workspace.yaml ]]; then
  python3 - <<'PY'
from pathlib import Path
import sys
text = Path('pnpm-workspace.yaml').read_text()
if 'packages:' not in text or "'.'" not in text and '"."' not in text and '- .' not in text:
    sys.exit('pnpm-workspace.yaml must contain a non-empty packages entry including .')
PY
fi

if grep -RInE 'example\.com|localhost|chrome-extension://' dist; then
  echo 'Forbidden placeholder or injected content found in dist.' >&2
  exit 1
fi

if find dist -maxdepth 1 -type f -name 'sitemap*.xml' -print -quit | grep -q .; then
  if grep -RIn '<lastmod>' dist/sitemap*.xml; then
    echo 'Unexpected lastmod found in generated sitemap.' >&2
    exit 1
  fi
  if grep -RInE 'example\.com|localhost' dist/sitemap*.xml; then
    echo 'Invalid sitemap URL found.' >&2
    exit 1
  fi
fi

echo 'Self-check passed.'
