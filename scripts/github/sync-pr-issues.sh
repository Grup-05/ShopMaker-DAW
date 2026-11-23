#!/usr/bin/env bash
# ==============================================================================
# Sincronización Automática de Issues y Tablón Scrum al Abrir/Fusionar PRs
# (scripts/github/sync-pr-issues.sh)
# ==============================================================================
# Problema que resuelve:
#   GitHub solo cierra automáticamente las issues con "Closes #XX" cuando el PR
#   se fusiona en la rama por defecto ('main'). En GitFlow + Scrum, los PRs del
#   Sprint se fusionan en 'develop', por lo que GitHub ignora "Closes #XX" y
#   tampoco actualiza el campo "Estado Scrum" del tablón GitHub Projects v2.
#
# Qué hace este script:
#   1. En PRs abiertos (--pr <N>): mueve las issues vinculadas a "En revisión".
#   2. En PRs fusionados en 'develop' o 'main' (--pr <N> o --reconcile):
#      - Detecta "Closes/Fixes/Resolves #XX" en el cuerpo del PR.
#      - Cierra las issues que sigan ABIERTAS añadiendo comentario de trazabilidad.
#      - Mueve las issues cerradas a la columna "Hecho" en GitHub Projects v2 (#1).
#   3. Reconciliación global (--reconcile):
#      - Asegura que toda issue ya cerrada (CLOSED) en el repositorio figure en
#        la columna "Hecho" del tablón GitHub Projects v2.
#
# Uso:
#   bash scripts/github/sync-pr-issues.sh [--reconcile] [--pr <NUM>] [--dry-run]
# ==============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
if [ -z "${GH_TOKEN:-}" ] && [ -f "$ROOT_DIR/scripts/github/gh-auth-env.sh" ]; then
  # shellcheck disable=SC1091
  source "$ROOT_DIR/scripts/github/gh-auth-env.sh" --load >/dev/null 2>&1 || true
fi
GH_TOKEN="${GH_TOKEN:-${GITHUB_TOKEN:-}}"

OWNER="${OWNER:-Grup-05}"
REPO="${REPO:-ShopMaker-DAW}"
PROJECT_NUMBER="${PROJECT_NUMBER:-1}"
DRY_RUN="${DRY_RUN:-false}"
MODE="reconcile"
TARGET_PR=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pr)
      MODE="pr"
      TARGET_PR="${2:-}"
      shift 2
      ;;
    --reconcile)
      MODE="reconcile"
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    *)
      echo "❌ Opción desconocida: $1" >&2
      echo "Uso: bash scripts/github/sync-pr-issues.sh [--reconcile] [--pr <NUM>] [--dry-run]" >&2
      exit 1
      ;;
  esac
done

if [ -z "$GH_TOKEN" ]; then
  echo "❌ Error: No se encontró GH_TOKEN en user_data/security/gh_token.txt." >&2
  exit 1
fi

command -v jq >/dev/null 2>&1 || { echo "❌ Error: jq no está instalado." >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "❌ Error: python3 no está instalado." >&2; exit 1; }

api_rest() {
  local method="$1" endpoint="$2" data="${3:-}"
  if [ -n "$data" ]; then
    curl -fsSL -X "$method" \
      -H "Authorization: Bearer $GH_TOKEN" \
      -H "Accept: application/vnd.github+json" \
      "https://api.github.com$endpoint" \
      -d "$data"
  else
    curl -fsSL -X "$method" \
      -H "Authorization: Bearer $GH_TOKEN" \
      -H "Accept: application/vnd.github+json" \
      "https://api.github.com$endpoint"
  fi
}

api_graphql() {
  local query="$1"
  curl -fsSL https://api.github.com/graphql \
    -H "Authorization: bearer $GH_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$(jq -nc --arg q "$query" '{query: $q}')"
}

extract_closing_issues() {
  python3 -c '
import re, sys
text = sys.stdin.read()
matches = re.findall(r"(?i)\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s*:?\s*#(\d+)\b", text)
seen = []
for m in matches:
    if m not in seen:
        seen.append(m)
print(" ".join(seen))
'
}

extract_all_referenced_issues() {
  python3 -c '
import re, sys
text = sys.stdin.read()
matches = re.findall(r"(?i)\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?|refs?)\s*:?\s*#(\d+)\b", text)
seen = []
for m in matches:
    if m not in seen:
        seen.append(m)
print(" ".join(seen))
'
}

echo "🔄 [Scrum Sync] Consultando estado de PRs, Issues y Tablón Project #$PROJECT_NUMBER en $OWNER/$REPO..."

BOARD_QUERY="query {
  repository(owner: \"$OWNER\", name: \"$REPO\") {
    pullRequests(first: 30, states: [OPEN, MERGED], orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes {
        number
        title
        state
        merged
        baseRefName
        body
      }
    }
  }
  organization(login: \"$OWNER\") {
    projectV2(number: $PROJECT_NUMBER) {
      id
      title
      field(name: \"Estado Scrum\") {
        ... on ProjectV2SingleSelectField {
          id
          options { id name }
        }
      }
      items(first: 100) {
        nodes {
          id
          fieldValues(first: 10) {
            nodes {
              ... on ProjectV2ItemFieldSingleSelectValue {
                name
                field { ... on ProjectV2FieldCommon { name } }
              }
            }
          }
          content {
            ... on Issue {
              number
              title
              state
            }
          }
        }
      }
    }
  }
}"

SNAPSHOT="$(api_graphql "$BOARD_QUERY" 2>/dev/null || echo '{}')"

PROJECT_ID="$(jq -r '.data.organization.projectV2.id // empty' <<<"$SNAPSHOT")"
STATUS_FIELD_ID="$(jq -r '.data.organization.projectV2.field.id // empty' <<<"$SNAPSHOT")"
OPT_EN_REVISION="$(jq -r '.data.organization.projectV2.field.options[]? | select(.name=="En revisión") | .id' <<<"$SNAPSHOT")"
OPT_HECHO="$(jq -r '.data.organization.projectV2.field.options[]? | select(.name=="Hecho") | .id' <<<"$SNAPSHOT")"

set_issue_board_status() {
  local issue_num="$1" target_status_name="$2" target_option_id="$3"
  if [ -z "$PROJECT_ID" ] || [ -z "$STATUS_FIELD_ID" ] || [ -z "$target_option_id" ]; then
    echo "   ℹ️  [Tablón] Sin acceso de escritura a ProjectV2 o campo 'Estado Scrum' no disponible; se omite actualización de columna para #$issue_num."
    return 0
  fi

  local item_id current_status
  item_id="$(jq -r --argjson n "$issue_num" '.data.organization.projectV2.items.nodes[]? | select(.content.number == $n) | .id' <<<"$SNAPSHOT" | head -n1)"
  if [ -z "$item_id" ]; then
    return 0
  fi

  current_status="$(jq -r --argjson n "$issue_num" '
    .data.organization.projectV2.items.nodes[]?
    | select(.content.number == $n)
    | .fieldValues.nodes[]?
    | select(.field.name == "Estado Scrum")
    | .name
  ' <<<"$SNAPSHOT" | head -n1)"

  if [ "$current_status" = "$target_status_name" ]; then
    return 0
  fi

  if [ "$DRY_RUN" = true ]; then
    echo "   [dry-run] Mover issue #$issue_num en Project #$PROJECT_NUMBER: '${current_status:-—}' -> '$target_status_name'"
    return 0
  fi

  local mutation="mutation {
    updateProjectV2ItemFieldValue(input: {
      projectId: \"$PROJECT_ID\",
      itemId: \"$item_id\",
      fieldId: \"$STATUS_FIELD_ID\",
      value: { singleSelectOptionId: \"$target_option_id\" }
    }) {
      projectV2Item { id }
    }
  }"
  api_graphql "$mutation" >/dev/null
  echo "   ✔ [Tablón] Issue #$issue_num movida de '${current_status:-—}' -> '$target_status_name'."
}

close_issue_if_open() {
  local issue_num="$1" pr_num="$2" base_branch="$3"
  local current_state
  current_state="$(jq -r --argjson n "$issue_num" '.data.organization.projectV2.items.nodes[]? | select(.content.number == $n) | .content.state' <<<"$SNAPSHOT" | head -n1)"

  if [ -z "$current_state" ]; then
    current_state="$(api_rest GET "/repos/$OWNER/$REPO/issues/$issue_num" | jq -r '.state' | tr '[:lower:]' '[:upper:]')"
  fi

  if [ "$current_state" = "CLOSED" ]; then
    return 0
  fi

  if [ "$DRY_RUN" = true ]; then
    echo "   [dry-run] Cerrar issue #$issue_num (por merge de PR #$pr_num en '$base_branch')"
    return 0
  fi

  local comment_body
  comment_body="$(jq -nc --arg msg "✅ Issue completada y cerrada automáticamente tras fusionarse el Pull Request #$pr_num en la rama \`$base_branch\`." '{body: $msg}')"
  api_rest POST "/repos/$OWNER/$REPO/issues/$issue_num/comments" "$comment_body" >/dev/null
  api_rest PATCH "/repos/$OWNER/$REPO/issues/$issue_num" '{"state":"closed","state_reason":"completed"}' >/dev/null
  echo "   ✔ [Issue] #$issue_num cerrada automáticamente (vinculada a PR #$pr_num -> $base_branch)."
}

process_pr_node() {
  local pr_json="$1"
  local pr_num pr_state pr_merged base_branch body
  pr_num="$(jq -r '.number' <<<"$pr_json")"
  pr_state="$(jq -r '.state' <<<"$pr_json")"
  pr_merged="$(jq -r '.merged' <<<"$pr_json")"
  base_branch="$(jq -r '.baseRefName' <<<"$pr_json")"
  body="$(jq -r '.body // ""' <<<"$pr_json")"

  if [ "$base_branch" != "develop" ] && [ "$base_branch" != "main" ]; then
    return 0
  fi

  if [ "$pr_state" = "OPEN" ]; then
    local ref_issues
    ref_issues="$(extract_all_referenced_issues <<<"$body")"
    for issue_num in $ref_issues; do
      set_issue_board_status "$issue_num" "En revisión" "$OPT_EN_REVISION"
    done
  elif [ "$pr_merged" = "true" ]; then
    local closing_issues
    closing_issues="$(extract_closing_issues <<<"$body")"
    for issue_num in $closing_issues; do
      close_issue_if_open "$issue_num" "$pr_num" "$base_branch"
      set_issue_board_status "$issue_num" "Hecho" "$OPT_HECHO"
    done
  fi
}

if [ "$MODE" = "pr" ]; then
  if [ -z "$TARGET_PR" ]; then
    echo "❌ Error: Debes indicar el número de PR tras --pr." >&2
    exit 1
  fi
  PR_NODE="$(jq -c --argjson n "$TARGET_PR" '.data.repository.pullRequests.nodes[]? | select(.number == $n)' <<<"$SNAPSHOT")"
  if [ -z "$PR_NODE" ]; then
    PR_REST="$(api_rest GET "/repos/$OWNER/$REPO/pulls/$TARGET_PR")"
    PR_NODE="$(jq -c '{number: .number, title: .title, state: (.state | ascii_upcase), merged: .merged, baseRefName: .base.ref, body: .body}' <<<"$PR_REST")"
  fi
  echo "▶ Procesando PR #$TARGET_PR..."
  process_pr_node "$PR_NODE"
else
  echo "▶ Reconciliando PRs fusionados en 'develop' y 'main'..."
  while IFS= read -r pr_node; do
    [ -z "$pr_node" ] && continue
    process_pr_node "$pr_node"
  done < <(jq -c '.data.repository.pullRequests.nodes[]?' <<<"$SNAPSHOT")

  echo "▶ Verificando coherencia entre Issues CLOSED y columna 'Hecho' en Project #$PROJECT_NUMBER..."
  while IFS= read -r issue_num; do
    [ -z "$issue_num" ] && continue
    set_issue_board_status "$issue_num" "Hecho" "$OPT_HECHO"
  done < <(jq -r '.data.organization.projectV2.items.nodes[]? | select(.content.state == "CLOSED") | .content.number' <<<"$SNAPSHOT")
fi

echo "✅ [Scrum Sync] Sincronización de Issues y Tablón finalizada."
