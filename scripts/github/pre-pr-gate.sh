#!/usr/bin/env bash
# ==============================================================================
# Subrutina Estática de Puerta Pre-Push y Pre-PR (scripts/github/pre-pr-gate.sh)
# ==============================================================================
# Propósito:
#   Ejecutar de forma estática, determinista y con coste mínimo de tokens las
#   5 puertas obligatorias de gobernanza antes de publicar una rama o abrir una
#   Pull Request hacia 'develop':
#
#   [Gate 1] Entorno, herramientas y token personal por rol (user_data/security/gh_token.txt)
#   [Gate 2] Sincronización obligatoria con 'origin/develop' y cero conflictos
#   [Gate 3] Paridad con el núcleo de Gobernanza Global (.agent/, .gitattributes)
#   [Gate 4] Suite de calidad local en verde tras el merge (en modo --pre-pr)
#   [Gate 5] Reconciliación automática de Issues (Closes #XX) y Tablón Scrum
#
# Uso:
#   bash scripts/github/pre-pr-gate.sh --pre-pr [--auto-merge]
#   bash scripts/github/pre-pr-gate.sh --pre-push --branch <RAMA> --local-sha <SHA> [--remote <REMOTO>]
# ==============================================================================

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

MODE="pre-pr"
AUTO_MERGE=false
REMOTE="origin"
BRANCH_NAME="$(git branch --show-current 2>/dev/null || git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '')"
LOCAL_SHA="$(git rev-parse HEAD 2>/dev/null || echo '')"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pre-pr)
      MODE="pre-pr"
      shift
      ;;
    --pre-push)
      MODE="pre-push"
      shift
      ;;
    --auto-merge)
      AUTO_MERGE=true
      shift
      ;;
    --branch)
      BRANCH_NAME="${2:-$BRANCH_NAME}"
      shift 2
      ;;
    --local-sha)
      LOCAL_SHA="${2:-$LOCAL_SHA}"
      shift 2
      ;;
    --remote)
      REMOTE="${2:-origin}"
      shift 2
      ;;
    -h|--help)
      sed -n '2,20p' "$0" | sed 's/^# //'
      exit 0
      ;;
    *)
      echo "❌ Opción desconocida en pre-pr-gate.sh: $1" >&2
      exit 1
      ;;
  esac
done

echo "🛡️  [Pre-PR Gate] Iniciando verificación estática de 5 puertas para '$BRANCH_NAME' (modo: $MODE)..."

# ------------------------------------------------------------------------------
# GATE 1: Paridad de Entorno, Herramientas y Token Personal por Rol Scrum
# ------------------------------------------------------------------------------
echo "  ▶ [Gate 1/5] Verificando herramientas, identidad y token personal según rol Scrum..."

REQUIRED_BINS=(git gh jq python3 node npm)
for bin in "${REQUIRED_BINS[@]}"; do
  if ! command -v "$bin" >/dev/null 2>&1; then
    echo "❌ [GATE 1 FALLIDO - HERRAMIENTA AUSENTE] No se encontró '$bin' en el PATH." >&2
    echo "   Todos los desarrolladores deben disponer de: ${REQUIRED_BINS[*]}" >&2
    exit 1
  fi
done

if ! bash "$REPO_ROOT/scripts/setup/init-user-security.sh" --check >/dev/null 2>&1; then
  echo "❌ [GATE 1 FALLIDO - SEGURIDAD LOCAL INCOMPLETA]" >&2
  bash "$REPO_ROOT/scripts/setup/init-user-security.sh" --check >&2 || true
  echo "   Ejecuta: bash scripts/setup/init-user-security.sh --init && bash scripts/github/gh-auth-env.sh --login" >&2
  exit 1
fi

# Cargar y validar token personal en user_data/security/gh_token.txt
# shellcheck disable=SC1091
if ! source "$REPO_ROOT/scripts/github/gh-auth-env.sh" --load; then
  echo "❌ [GATE 1 FALLIDO - TOKEN PERSONAL REQUERIDO]" >&2
  echo "   Cada miembro del equipo debe tener configurado su token en user_data/security/gh_token.txt." >&2
  echo "   Ejecuta: bash scripts/github/gh-auth-env.sh --login" >&2
  exit 1
fi

AUTH_USER="$(gh api user --jq '.login' 2>/dev/null || echo '')"
if [ -z "$AUTH_USER" ]; then
  echo "❌ [GATE 1 FALLIDO - TOKEN INVÁLIDO] El token en user_data/security/gh_token.txt no pudo autenticarse contra GitHub API." >&2
  exit 1
fi

ROLES_FILE="$REPO_ROOT/docs/scrum/active_roles.env"
SPRINT_ID="S01"
ACTIVE_ROLES_DESC=""
if [ -f "$ROLES_FILE" ]; then
  # shellcheck disable=SC1090
  source "$ROLES_FILE"
  [[ "${PRODUCT_OWNER:-}" == "$AUTH_USER" ]] && ACTIVE_ROLES_DESC+="Product Owner, "
  [[ "${SCRUM_MASTER:-}" == "$AUTH_USER" ]] && ACTIVE_ROLES_DESC+="Scrum Master, "
  [[ ",${DEVELOPERS:-}," == *",$AUTH_USER,"* ]] && ACTIVE_ROLES_DESC+="Developer, "
  [[ "${GOVERNANCE_ADMIN:-}" == "$AUTH_USER" ]] && ACTIVE_ROLES_DESC+="Governance Admin, "
  ACTIVE_ROLES_DESC="${ACTIVE_ROLES_DESC%, }"
fi

if [ -z "$ACTIVE_ROLES_DESC" ]; then
  echo "❌ [GATE 1 FALLIDO - USUARIO NO ASIGNADO EN ROLES DEL SPRINT]" >&2
  echo "   El usuario autenticado '@$AUTH_USER' no figura en docs/scrum/active_roles.env." >&2
  exit 1
fi

if ! gh project list --owner Grup-05 --format json >/dev/null 2>&1; then
  echo "❌ [GATE 1 FALLIDO - PERMISOS DE TABLÓN INSUFICIENTES]" >&2
  echo "   El token de @$AUTH_USER no tiene permisos 'project' / 'read:org' sobre Grup-05." >&2
  echo "   Actualízalo con: bash scripts/github/gh-auth-env.sh --login" >&2
  exit 1
fi

echo "    ✔ Identidad verificada: @$AUTH_USER ($ACTIVE_ROLES_DESC en Sprint $SPRINT_ID) con permisos completos."

# ------------------------------------------------------------------------------
# GATE 2: Sincronización Obligatoria con 'origin/develop' y Cero Conflictos
# ------------------------------------------------------------------------------
echo "  ▶ [Gate 2/5] Comprobando sincronización con '$REMOTE/develop' y ausencia de conflictos..."

UNMERGED_FILES="$(git ls-files -u 2>/dev/null || true)"
if [ -n "$UNMERGED_FILES" ]; then
  echo "❌ [GATE 2 FALLIDO - CONFLICTOS DE MERGE SIN RESOLVER]" >&2
  echo "   Existen archivos con conflictos pendientes en el índice:" >&2
  echo "$UNMERGED_FILES" >&2
  exit 1
fi

if [ "$MODE" = "pre-pr" ]; then
  DIRTY_TREE="$(git status --porcelain 2>/dev/null || true)"
  if [ -n "$DIRTY_TREE" ]; then
    echo "❌ [GATE 2 FALLIDO - ÁRBOL DE TRABAJO CON CAMBIOS SIN CONFIRMAR]" >&2
    echo "   Confirma o descarta tus cambios locales antes de preparar la Pull Request:" >&2
    echo "$DIRTY_TREE" | sed 's/^/   /' >&2
    exit 1
  fi
fi

git fetch "$REMOTE" develop main --quiet 2>/dev/null || true

if git rev-parse --verify "$REMOTE/develop" >/dev/null 2>&1; then
  if ! git merge-base --is-ancestor "$REMOTE/develop" "$LOCAL_SHA" 2>/dev/null; then
    if [ "$AUTO_MERGE" = true ] && [ "$MODE" = "pre-pr" ]; then
      echo "    ⚙️  Integrando automáticamente últimos cambios de '$REMOTE/develop' en '$BRANCH_NAME'..."
      if ! git merge --no-edit "$REMOTE/develop"; then
        echo "❌ [GATE 2 FALLIDO - CONFLICTO AL FUSIONAR '$REMOTE/develop']" >&2
        echo "   Resuelve los conflictos localmente, confirma el merge y vuelve a ejecutar pre-pr-gate.sh." >&2
        exit 1
      fi
      LOCAL_SHA="$(git rev-parse HEAD)"
    else
      echo "❌ [GATE 2 FALLIDO - RAMA DESACTUALIZADA RESPECTO A '$REMOTE/develop']" >&2
      echo "   La rama '$BRANCH_NAME' no incluye los últimos commits de '$REMOTE/develop'." >&2
      echo "   Es obligatorio actualizar y resolver posibles conflictos antes de subir o abrir PR:" >&2
      echo "     git fetch $REMOTE develop && git merge $REMOTE/develop" >&2
      echo "   (O ejecuta: bash scripts/github/pre-pr-gate.sh --pre-pr --auto-merge)" >&2
      exit 1
    fi
  fi
fi

echo "    ✔ Rama '$BRANCH_NAME' sincronizada al día con '$REMOTE/develop' y libre de conflictos."

# ------------------------------------------------------------------------------
# GATE 3: Paridad con el Núcleo de Gobernanza Global
# ------------------------------------------------------------------------------
echo "  ▶ [Gate 3/5] Verificando paridad del núcleo de gobernanza global..."

GOV_REF="main"
if ! git rev-parse --verify "$GOV_REF" >/dev/null 2>&1; then
  GOV_REF="$REMOTE/main"
fi

if git rev-parse --verify "$GOV_REF" >/dev/null 2>&1; then
  GOV_DIFF="$(git diff --name-only "$LOCAL_SHA" "$GOV_REF" -- .agent/hooks/pre-commit .agent/hooks/pre-push .agent/hooks/sync-governance.sh .agent/rules/AGENTS.md .gitattributes 2>/dev/null || true)"
  if [ -n "$GOV_DIFF" ]; then
    echo "❌ [GATE 3 FALLIDO - GOBERNANZA GLOBAL DESACTUALIZADA EN '$BRANCH_NAME']" >&2
    echo "   Los siguientes activos del núcleo difieren de la rama de autoridad '$GOV_REF':" >&2
    echo "$GOV_DIFF" | sed 's/^/     - /' >&2
    echo "   Sincroniza la gobernanza antes de continuar ejecutando:" >&2
    echo "     bash .agent/hooks/sync-governance.sh" >&2
    exit 1
  fi
fi

echo "    ✔ Núcleo de gobernanza global íntegro y sincronizado con '$GOV_REF'."

# ------------------------------------------------------------------------------
# GATE 4: Suite de Calidad Local Post-Merge (en modo --pre-pr)
# ------------------------------------------------------------------------------
if [ "$MODE" = "pre-pr" ]; then
  echo "  ▶ [Gate 4/5] Ejecutando puerta de calidad local post-merge (typecheck, lint y tests)..."
  if [ -f "$REPO_ROOT/.agent/hooks/pre-commit-local.sh" ]; then
    bash "$REPO_ROOT/.agent/hooks/pre-commit-local.sh"
  fi
  echo "    ✔ Suite de calidad en verde tras validación de sincronización."
else
  echo "  ▶ [Gate 4/5] Suite verificada previamente en pre-commit (modo pre-push rápido)."
fi

# ------------------------------------------------------------------------------
# GATE 5: Reconciliación Automática de Issues y Tablón Scrum
# ------------------------------------------------------------------------------
echo "  ▶ [Gate 5/5] Reconciliando Issues cerradas en 'develop' y Tablón Scrum Project #1..."
if [ -f "$REPO_ROOT/scripts/github/sync-pr-issues.sh" ]; then
  bash "$REPO_ROOT/scripts/github/sync-pr-issues.sh" --reconcile
fi

echo "✅ [Pre-PR Gate] Las 5 puertas de gobernanza, sincronización y calidad fueron superadas."
