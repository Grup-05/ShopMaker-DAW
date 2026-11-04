#!/usr/bin/env bash
# ==============================================================================
# Configuración Automatizada de Protección de Ramas en GitHub (protect-branches.sh)
# ==============================================================================
# Propósito:
#   Aplica las directrices de Scrum y AGENTS.md §1 en GitHub:
#     - Prohíbe push directo a main, develop y release.
#     - Exige Pull Request con mínimo 1 aprobación ajena al autor.
#     - Aplica revisiones obligatorias basadas en .github/CODEOWNERS.
#     - Revoca aprobaciones previas al subir nuevos commits.
#     - Bloquea push destructivo (--force) y borrado de ramas.
#     - Aplica restricciones incluso a administradores de la organización.
#
# Uso:
#   bash scripts/github/protect-branches.sh [--dry-run] [--branches "main develop release"]
# ==============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
if [ -z "${GH_TOKEN:-}" ] && [ -f "$ROOT_DIR/scripts/github/gh-auth-env.sh" ]; then
  # shellcheck source=/dev/null
  source "$ROOT_DIR/scripts/github/gh-auth-env.sh" --quiet-if-missing
fi

OWNER="${OWNER:-Grup-05}"
REPO="${REPO:-ShopMaker-DAW}"
BRANCHES=""
DRY_RUN="${DRY_RUN:-false}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --branches)
      BRANCHES="$2"
      shift 2
      ;;
    *)
      if [ -z "$BRANCHES" ]; then
        BRANCHES="$1"
      else
        BRANCHES="$BRANCHES $1"
      fi
      shift
      ;;
  esac
done

[ -z "$BRANCHES" ] && BRANCHES="main develop release"

command -v gh >/dev/null 2>&1 || { echo "❌ gh no está instalado."; exit 1; }
if [ "$DRY_RUN" != true ]; then
  gh auth status >/dev/null 2>&1 || { echo "❌ gh no está autenticado."; exit 1; }
fi

echo "🛡️  Configurando protección de ramas en $OWNER/$REPO..."
echo "   Ramas objetivo: $BRANCHES"
[ "$DRY_RUN" = true ] && echo "   [MODO DRY-RUN ACTIVADO - No se escribirán cambios]"

PROTECTION_PAYLOAD='{
  "required_status_checks": null,
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 1,
    "require_last_push_approval": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}'

for branch in $BRANCHES; do
  echo "👉 Aplicando protección a rama '$branch'..."
  if [ "$DRY_RUN" = true ]; then
    echo "   [dry-run] PUT /repos/$OWNER/$REPO/branches/$branch/protection"
  else
    if gh api -X PUT "repos/$OWNER/$REPO/branches/$branch/protection" \
      --input - <<< "$PROTECTION_PAYLOAD" >/dev/null; then
      echo "   ✔ Rama '$branch' protegida con éxito (PR obligatorio, 1 aprobación, CODEOWNERS y bloqueo a administradores)."
    else
      echo "   ❌ Error al aplicar protección en '$branch'." >&2
    fi
  fi
done

echo ""
echo "✔ Proceso de protección completado."
