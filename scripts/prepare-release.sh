#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"
WORK_DIR="${ROOT_DIR}/.release-work-${STAMP}"
OUT_DIR="${ROOT_DIR}/release"
ARCHIVE="${OUT_DIR}/smart-money-radar-${STAMP}.tar.gz"
SHA_FILE="${ARCHIVE}.sha256"

cleanup() { rm -rf "${WORK_DIR}"; }
trap cleanup EXIT

log(){ printf '\n[%s] %s\n' "$(date +%H:%M:%S)" "$*"; }
fail(){ echo "ERROR: $*" >&2; exit 1; }

command -v node >/dev/null || fail "Node.js is required."
command -v npm >/dev/null || fail "npm is required."
command -v tar >/dev/null || fail "tar is required."
command -v sha256sum >/dev/null || fail "sha256sum is required."

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
(( NODE_MAJOR >= 20 )) || fail "Node.js 20+ is required; found ${NODE_MAJOR}."

mkdir -p "${OUT_DIR}"
rm -rf "${WORK_DIR}"
mkdir -p "${WORK_DIR}"

log "Creating isolated release workspace"
rsync -a --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='backend/node_modules' \
  --exclude='release' \
  --exclude='.release-work-*' \
  --exclude='.env' \
  --exclude='backend/.env' \
  --exclude='dist' \
  --exclude='*.bak*' \
  --exclude='*.backup*' \
  --exclude='*.before-*' \
  --exclude='backend/logs' \
  --exclude='backend/cache' \
  "${ROOT_DIR}/" "${WORK_DIR}/"

log "Checking for secrets or forbidden artifacts"
if find "${WORK_DIR}" -type f \( -name '.env' -o -name '*.pem' -o -name '*.key' \) | grep -q .; then
  find "${WORK_DIR}" -type f \( -name '.env' -o -name '*.pem' -o -name '*.key' \)
  fail "Secret/key files detected in release workspace."
fi
if find "${WORK_DIR}" -type f \( -name '*.bak*' -o -name '*.backup*' -o -name '*.before-*' \) | grep -q .; then
  fail "Backup artifacts detected in release workspace."
fi

log "Installing frontend dependencies from lockfile"
(cd "${WORK_DIR}" && npm ci --no-audit --no-fund)

log "Type-checking/building frontend"
(cd "${WORK_DIR}" && npx tsc --noEmit -p tsconfig.app.json)
(cd "${WORK_DIR}" && npm run build)

log "Installing backend production dependencies from lockfile"
(cd "${WORK_DIR}/backend" && npm ci --omit=dev --no-audit --no-fund)

log "Checking backend JavaScript syntax"
find "${WORK_DIR}/backend" -maxdepth 2 -type f -name '*.js' -not -path '*/node_modules/*' -print0 |
  xargs -0 -n1 node --check

log "Creating deployment manifest"
cat > "${WORK_DIR}/RELEASE-MANIFEST.txt" <<MANIFEST
Smart Money Radar release
Generated: ${STAMP}
Domain: irdubai20.ir
Frontend: Vite production build
Backend: Node.js/Express

IMPORTANT:
- No runtime .env files are included.
- Configure frontend VITE_* variables in the hosting/build environment.
- Configure backend variables from backend/.env.example on the server.
- This package intentionally does NOT deploy or modify DNS/server state.
MANIFEST

rm -rf "${WORK_DIR}/node_modules" "${WORK_DIR}/backend/node_modules"

log "Packaging release"
tar -C "${WORK_DIR}" -czf "${ARCHIVE}" .
sha256sum "${ARCHIVE}" > "${SHA_FILE}"

log "Release ready"
printf '\nARCHIVE: %s\nSHA256: %s\n' "${ARCHIVE}" "${SHA_FILE}"
printf '\nDeployment has NOT been performed.\n'
