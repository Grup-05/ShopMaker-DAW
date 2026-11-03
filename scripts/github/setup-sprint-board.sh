#!/usr/bin/env bash
# ==============================================================================
# Configura el tablero Scrum de un Sprint en GitHub Projects.
#
# Requisitos:
#   - gh autenticado con scopes repo, project y read:org
#   - jq
#
# Uso:
#   DEV_A=usuarioA DEV_B=usuarioB DEV_C=usuarioC \
#   bash scripts/github/setup-sprint-board.sh
#
# Variables opcionales:
#   OWNER, REPO, PROJECT_OWNER, PROJECT_TITLE, SPRINT, SPRINT_START, SPRINT_DUE
#   PROJECT_NUMBER (si el proyecto ya existe)
#   DRY_RUN=true (no escribe nada)
# ==============================================================================

set -euo pipefail

export PATH="$HOME/.local/bin:$PATH"

OWNER="${OWNER:-Grup-05}"
REPO="${REPO:-ShopMaker-DAW}"
PROJECT_OWNER="${PROJECT_OWNER:-$OWNER}"
PROJECT_TITLE="${PROJECT_TITLE:-ShopMaker — S01}"
SPRINT="${SPRINT:-S01}"
SPRINT_START="${SPRINT_START:-2026-11-03}"
SPRINT_DUE="${SPRINT_DUE:-2026-11-08}"
DEV_A="${DEV_A:-FSolaje}"
DEV_B="${DEV_B:-Tarrant15}"
DEV_C="${DEV_C:-Fernis23228}"
DRY_RUN="${DRY_RUN:-false}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
if [ -z "${GH_TOKEN:-}" ] && [ -f "$ROOT_DIR/scripts/github/gh-auth-env.sh" ]; then
  # Carga y valida el token local de user_data/security/gh_token.txt si existe
  # shellcheck disable=SC1091
  source "$ROOT_DIR/scripts/github/gh-auth-env.sh" --quiet-if-missing
fi
PBIS_FILE="$ROOT_DIR/scripts/github/sprint-s01-pbis.json"
TASKS_FILE="$ROOT_DIR/scripts/github/sprint-s01-tasks.json"
TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/shopmaker-board.XXXXXX")"
trap 'rm -rf "$TMP_DIR"' EXIT

command -v gh >/dev/null 2>&1 || { echo "❌ gh no está instalado o no está en PATH."; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "❌ jq no está instalado."; exit 1; }
if [ "$DRY_RUN" != true ]; then
  gh auth status >/dev/null 2>&1 || { echo "❌ gh no está autenticado. Guarda tu token en user_data/security/gh_token.txt o ejecuta: bash scripts/github/gh-auth-env.sh"; exit 1; }
fi
[ -f "$PBIS_FILE" ] || { echo "❌ No existe $PBIS_FILE"; exit 1; }
[ -f "$TASKS_FILE" ] || { echo "❌ No existe $TASKS_FILE"; exit 1; }

log() { echo "▶ $*"; }
warn() { echo "⚠️  $*"; }
run() {
  if [ "$DRY_RUN" = true ]; then
    echo "[dry-run] $*"
  else
    "$@"
  fi
}

owner_dev() {
  case "$1" in
    A) printf '%s' "$DEV_A" ;;
    B) printf '%s' "$DEV_B" ;;
    C) printf '%s' "$DEV_C" ;;
    *) printf '%s' "" ;;
  esac
}

# ------------------------------------------------------------------------------
# 1. Labels
# ------------------------------------------------------------------------------
log "Creando labels del Sprint..."
create_label() {
  run gh label create "$1" --repo "$OWNER/$REPO" --color "$2" --description "$3" --force >/dev/null
}
create_label "type:pbi" "5319e7" "Product Backlog Item"
create_label "type:task" "1d76db" "Tarea atómica del Sprint Backlog"
create_label "type:spec" "0e8a16" "Especificación SDD"
create_label "type:test" "fbca04" "Prueba TDD"
create_label "type:code" "d93f0b" "Implementación"
create_label "type:refactor" "c2e0c6" "Refactor"
create_label "type:docs" "0075ca" "Documentación"
create_label "type:chore" "ededed" "Mantenimiento"
create_label "pbi:001" "b60205" "PBI-001"
create_label "pbi:002" "b60205" "PBI-002"
create_label "pbi:003" "b60205" "PBI-003"
create_label "pbi:004" "b60205" "PBI-004"
create_label "sprint:S01" "006b75" "Sprint S01"
create_label "blocked" "b60205" "Bloqueado"
create_label "priority:alta" "d93f0b" "Prioridad alta"
create_label "priority:media" "fbca04" "Prioridad media"
create_label "priority:baja" "0e8a16" "Prioridad baja"

# ------------------------------------------------------------------------------
# 2. Milestone
# ------------------------------------------------------------------------------
log "Asegurando milestone $SPRINT..."
MS_NUMBER="$(gh api "repos/$OWNER/$REPO/milestones?state=all&per_page=100" --jq ".[] | select(.title==\"$SPRINT\") | .number" 2>/dev/null | head -1 || true)"
if [ -z "$MS_NUMBER" ]; then
  if [ "$DRY_RUN" = true ]; then
    echo "[dry-run] crear milestone $SPRINT"
  else
    gh api "repos/$OWNER/$REPO/milestones" \
      -f title="$SPRINT" \
      -f state="open" \
      -f description="Sprint 0: fundaciones" \
      -f due_on="${SPRINT_DUE}T23:59:59Z" >/dev/null
  fi
else
  log "Milestone existente: $SPRINT (#$MS_NUMBER)"
fi

# ------------------------------------------------------------------------------
# 3. Project v2
# ------------------------------------------------------------------------------
log "Asegurando Project v2 '$PROJECT_TITLE'..."
PROJECT_ENABLED=true
if [ "$DRY_RUN" = true ]; then
  echo "[dry-run] crear proyecto $PROJECT_TITLE"
  PROJECT_JSON='{"number":0,"id":"PVT_dry_run"}'
elif [ -n "${PROJECT_NUMBER:-}" ]; then
  PROJECT_JSON="$(gh project view "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --format json 2>/dev/null || true)"
else
  if ! gh project list --owner "$PROJECT_OWNER" --format json >/dev/null 2>&1; then
    warn "El token actual no tiene los scopes 'read:project' / 'project'. Se crearán labels, milestone e issues; tras ejecutar 'gh auth refresh -h github.com -s project,read:project', vuelve a lanzar este script para vincularlos al Project v2."
    PROJECT_ENABLED=false
    PROJECT_JSON='{"number":0,"id":""}'
  else
    PROJECT_JSON="$(gh project list --owner "$PROJECT_OWNER" --format json --jq ".projects[] | select(.title==\"$PROJECT_TITLE\")" 2>/dev/null || true)"
    if [ -z "$PROJECT_JSON" ] || [ "$PROJECT_JSON" = "null" ]; then
      PROJECT_JSON="$(gh project create --owner "$PROJECT_OWNER" --title "$PROJECT_TITLE" --format json)"
    fi
  fi
fi
PROJECT_NUMBER="$(jq -r '.number' <<<"$PROJECT_JSON")"
PROJECT_ID="$(jq -r '.id' <<<"$PROJECT_JSON")"
if [ "$PROJECT_ENABLED" = true ]; then
  log "Project: #$PROJECT_NUMBER ($PROJECT_ID)"
  run gh project link "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --repo "$OWNER/$REPO" >/dev/null 2>&1 || true
fi

# ------------------------------------------------------------------------------
# 4. Campos
# ------------------------------------------------------------------------------
field_exists() {
  gh project field-list "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --format json \
    --jq "if type==\"array\" then .[] else .fields[] end | select(.name==\"$1\") | .name" 2>/dev/null | grep -q .
}
ensure_field() {
  [ "$PROJECT_ENABLED" = true ] || return 0
  local name="$1" dtype="$2" options="${3:-}"
  if field_exists "$name"; then
    log "Campo existente: $name"
    return
  fi
  if [ "$DRY_RUN" = true ]; then
    echo "[dry-run] crear campo $name ($dtype)"
    return
  fi
  if [ -n "$options" ]; then
    gh project field-create "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --name "$name" --data-type "$dtype" --single-select-options "$options" >/dev/null
  else
    gh project field-create "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --name "$name" --data-type "$dtype" >/dev/null
  fi
}
if [ "$PROJECT_ENABLED" = true ]; then
  log "Creando campos del tablero..."
  ensure_field "Estado Scrum" "SINGLE_SELECT" "Product Backlog,Sprint Backlog,En progreso,En revisión,Hecho"
  ensure_field "Sprint" "SINGLE_SELECT" "S01"
  ensure_field "PBI" "SINGLE_SELECT" "PBI-001,PBI-002,PBI-003,PBI-004"
  ensure_field "Tipo" "SINGLE_SELECT" "PBI,Spec,Test,Código,Refactor,Docs,Chore"
  ensure_field "Estimate" "TEXT"
  ensure_field "Priority" "SINGLE_SELECT" "Alta,Media,Baja"
  ensure_field "Blocked" "SINGLE_SELECT" "Sí,No"
  ensure_field "Target date" "DATE"
fi

if [ "$DRY_RUN" = true ] || [ "$PROJECT_ENABLED" != true ]; then
  FIELDS_JSON='{"fields":[]}'
else
  FIELDS_JSON="$(gh project field-list "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --limit 100 --format json)"
fi

field_id() {
  local name="$1"
  jq -r --arg n "$name" '(if type=="array" then .[] else .fields[] end) | select(.name==$n) | .id' <<<"$FIELDS_JSON" | head -1
}

option_id() {
  local name="$1" opt="$2"
  jq -r --arg n "$name" --arg o "$opt" '(if type=="array" then .[] else .fields[] end) | select(.name==$n) | .options[]? | select(.name==$o) | .id' <<<"$FIELDS_JSON" | head -1
}

add_item() {
  local url="$1"
  if [ "$DRY_RUN" = true ]; then
    echo "PVTI_dry_run"
  else
    gh project item-add "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --url "$url" --format json --jq '.id'
  fi
}

set_field() {
  local item_id="$1" field="$2" value="$3"
  if [ "$DRY_RUN" = true ]; then
    echo "[dry-run] item-edit $item_id $field=$value"
    return
  fi
  local fid oid
  fid="$(field_id "$field")"
  oid="$(option_id "$field" "$value")"
  if [ -n "$fid" ] && [ -n "$oid" ]; then
    gh project item-edit --id "$item_id" --project-id "$PROJECT_ID" --field-id "$fid" --single-select-option-id "$oid" >/dev/null
  fi
}
set_text() {
  local item_id="$1" field="$2" value="$3"
  if [ "$DRY_RUN" = true ]; then
    echo "[dry-run] item-edit $item_id $field=$value"
    return
  fi
  local fid
  fid="$(field_id "$field")"
  if [ -n "$fid" ]; then
    gh project item-edit --id "$item_id" --project-id "$PROJECT_ID" --field-id "$fid" --text "$value" >/dev/null
  fi
}
set_date() {
  local item_id="$1" field="$2" value="$3"
  if [ "$DRY_RUN" = true ]; then
    echo "[dry-run] item-edit $item_id $field=$value"
    return
  fi
  local fid
  fid="$(field_id "$field")"
  if [ -n "$fid" ]; then
    gh project item-edit --id "$item_id" --project-id "$PROJECT_ID" --field-id "$fid" --date "$value" >/dev/null
  fi
}

# ------------------------------------------------------------------------------
# 5. Issues padre por PBI
# ------------------------------------------------------------------------------
log "Creando issues padre de PBI..."
declare -A PBI_NUMBER
for pbi in PBI-001 PBI-002 PBI-003 PBI-004; do
  title="$(jq -r --arg id "$pbi" '.[] | select(.id==$id) | "[" + .id + "] " + .title' "$PBIS_FILE")"
  body="$(jq -r --arg id "$pbi" '.[] | select(.id==$id) | "<!-- pbi:" + .id + " -->\n\n" + .body' "$PBIS_FILE")"
  estimate="$(jq -r --arg id "$pbi" '.[] | select(.id==$id) | .estimate' "$PBIS_FILE")"
  priority="$(jq -r --arg id "$pbi" '.[] | select(.id==$id) | .priority' "$PBIS_FILE")"
  pbi_sprint="$(jq -r --arg id "$pbi" '.[] | select(.id==$id) | .sprint' "$PBIS_FILE")"
  pbi_slug="$(printf '%s' "$pbi" | tr '[:upper:]' '[:lower:]' | tr '-' ':')"
  printf '%s\n' "$body" > "$TMP_DIR/$pbi.body"
  : > "$TMP_DIR/$pbi.tasks"

  existing="$(gh issue list --repo "$OWNER/$REPO" --state all --label "type:pbi" --label "$pbi_slug" --json number,title \
    --jq ".[] | select(.title==\"$title\") | .number" 2>/dev/null | head -1 || true)"
  if [ -n "$existing" ]; then
    PBI_NUMBER[$pbi]="$existing"
    url="https://github.com/$OWNER/$REPO/issues/$existing"
    log "PBI existente: $title (#$existing)"
  else
    if [ "$DRY_RUN" = true ]; then
      echo "[dry-run] crear issue $title"
      PBI_NUMBER[$pbi]="0"
      url="https://github.com/$OWNER/$REPO/issues/0"
    else
      args=(--repo "$OWNER/$REPO" --title "$title" --body-file "$TMP_DIR/$pbi.body" \
        --label "type:pbi" --label "$pbi_slug" \
        --label "priority:$(printf '%s' "$priority" | tr '[:upper:]' '[:lower:]')")
      if [ "$pbi_sprint" = "$SPRINT" ]; then
        args+=(--label "sprint:$SPRINT" --milestone "$SPRINT")
      fi
      url="$(gh issue create "${args[@]}")"
      num="$(basename "$url")"
      PBI_NUMBER[$pbi]="$num"
      log "PBI creado: $title (#$num) [$pbi_sprint]"
    fi
  fi
  if [ "$DRY_RUN" != true ] && [ "$PROJECT_ENABLED" = true ]; then
    item_id="$(add_item "$url")"
    if [ "$pbi_sprint" = "$SPRINT" ]; then
      set_field "$item_id" "Estado Scrum" "Sprint Backlog"
      set_field "$item_id" "Sprint" "$SPRINT"
      set_date "$item_id" "Target date" "$SPRINT_DUE"
    else
      set_field "$item_id" "Estado Scrum" "Product Backlog"
    fi
    set_field "$item_id" "PBI" "$pbi"
    set_field "$item_id" "Tipo" "PBI"
    set_text "$item_id" "Estimate" "$estimate"
    set_field "$item_id" "Priority" "$priority"
    set_field "$item_id" "Blocked" "No"
  fi
done

# ------------------------------------------------------------------------------
# 6. Issues de tarea
# ------------------------------------------------------------------------------
log "Creando issues de tarea..."
declare -A TASK_NUMBER
while IFS= read -r task; do
  key="$(jq -r '.key' <<<"$task")"
  pbi="$(jq -r '.pbi' <<<"$task")"
  type="$(jq -r '.type' <<<"$task")"
  title="$(jq -r '.title' <<<"$task")"
  owner_tag="$(jq -r '.owner' <<<"$task")"
  estimate="$(jq -r '.estimate' <<<"$task")"
  priority="$(jq -r '.priority' <<<"$task")"
  assignee="$(owner_dev "$owner_tag")"
  pbi_slug="$(printf '%s' "$pbi" | tr '[:upper:]' '[:lower:]' | tr '-' ':')"
  type_slug="$(printf '%s' "$type" | tr '[:upper:]' '[:lower:]' | tr 'ó' 'o' | tr 'í' 'i' | tr 'á' 'a')"
  type_label="type:$type_slug"
  # Normalizar etiquetas de tipo a las creadas
  case "$type" in
    Código) type_label="type:code" ;;
    Refactor) type_label="type:refactor" ;;
    Docs) type_label="type:docs" ;;
    Chore) type_label="type:chore" ;;
    Spec) type_label="type:spec" ;;
    Test) type_label="type:test" ;;
  esac

  body="$(jq -r --arg key "$key" '
    .[] | select(.key==$key) |
    "<!-- task:" + .key + " -->\n\n" +
    "## PBI\n\n`" + .pbi + "`\n\n" +
    "## Contexto y entregable\n\n" + .description + "\n\n" +
    "## Criterios de aceptación\n\n" +
    (.acceptance | map("- [ ] " + .) | join("\n")) + "\n\n" +
    "## Pruebas asociadas\n\n" +
    (.tests | map("- `" + . + "`") | join("\n")) + "\n\n" +
    "## Dependencias\n\n" +
    (if (.depends | length) == 0 then "- Ninguna." else (.depends | map("- `" + . + "`") | join("\n")) end) + "\n\n" +
    "## Definition of Done\n\n" +
    "- [ ] Criterios de aceptación cumplidos.\n" +
    "- [ ] Tests escritos antes de la implementación (si aplica).\n" +
    "- [ ] Suite completa en verde.\n" +
    "- [ ] Matriz spec-test actualizada (si aplica).\n" +
    "- [ ] Sin secretos ni rutas privadas.\n" +
    "- [ ] PR revisado y mergeado.\n"
  ' "$TASKS_FILE")"

  issue_title="[$pbi][${key##*-}] $title"
  existing="$(gh issue list --repo "$OWNER/$REPO" --state all --label "type:task" --label "$pbi_slug" --json number,title \
    --jq ".[] | select(.title==\"$issue_title\") | .number" 2>/dev/null | head -1 || true)"
  if [ -n "$existing" ]; then
    TASK_NUMBER[$key]="$existing"
    url="https://github.com/$OWNER/$REPO/issues/$existing"
    log "Tarea existente: $issue_title (#$existing)"
  else
    if [ "$DRY_RUN" = true ]; then
      echo "[dry-run] crear tarea $issue_title"
      TASK_NUMBER[$key]="0"
      url="https://github.com/$OWNER/$REPO/issues/0"
    else
      args=(--repo "$OWNER/$REPO" --title "$issue_title" --body "$body" \
        --label "type:task" --label "$type_label" --label "$pbi_slug" --label "sprint:$SPRINT" \
        --label "priority:$(printf '%s' "$priority" | tr '[:upper:]' '[:lower:]')" --milestone "$SPRINT")
      [ -n "$assignee" ] && args+=(--assignee "$assignee")
      url="$(gh issue create "${args[@]}")"
      num="$(basename "$url")"
      TASK_NUMBER[$key]="$num"
      log "Tarea creada: $issue_title (#$num)"
    fi
  fi
  if [ "$DRY_RUN" != true ] && [ "$PROJECT_ENABLED" = true ]; then
    item_id="$(add_item "$url")"
    set_field "$item_id" "Estado Scrum" "Sprint Backlog"
    set_field "$item_id" "Sprint" "$SPRINT"
    set_field "$item_id" "PBI" "$pbi"
    set_field "$item_id" "Tipo" "$type"
    set_text "$item_id" "Estimate" "$estimate"
    set_field "$item_id" "Priority" "$priority"
    set_field "$item_id" "Blocked" "No"
  fi
  echo "- [ ] #${TASK_NUMBER[$key]} $title" >> "$TMP_DIR/$pbi.tasks"
done < <(jq -c --arg sprint "$SPRINT" '.[] | select(.sprint==$sprint)' "$TASKS_FILE")

# ------------------------------------------------------------------------------
# 7. Enlazar tareas en el issue padre
# ------------------------------------------------------------------------------
log "Actualizando issues padre con la lista de tareas..."
for pbi in PBI-001 PBI-002 PBI-003 PBI-004; do
  num="${PBI_NUMBER[$pbi]:-}"
  [ -z "$num" ] && continue
  if [ ! -s "$TMP_DIR/$pbi.tasks" ]; then
    log "Sin tareas de $SPRINT para $pbi; se mantiene el body original."
    continue
  fi
  {
    cat "$TMP_DIR/$pbi.body"
    echo ""
    echo "## Tareas del Sprint"
    echo ""
    cat "$TMP_DIR/$pbi.tasks"
  } > "$TMP_DIR/$pbi.final"
  if [ "$DRY_RUN" = true ]; then
    echo "[dry-run] actualizar body de $pbi (#$num)"
  else
    gh issue edit "$num" --repo "$OWNER/$REPO" --body-file "$TMP_DIR/$pbi.final" >/dev/null
  fi
done

# ------------------------------------------------------------------------------
# 8. Resumen
# ------------------------------------------------------------------------------
echo ""
echo "✅ Tablero preparado."
echo "   Repo:     $OWNER/$REPO"
echo "   Project:  #$PROJECT_NUMBER — $PROJECT_TITLE"
echo "   Sprint:   $SPRINT ($SPRINT_START → $SPRINT_DUE)"
echo "   Issues:   ${#TASK_NUMBER[@]} tareas + 4 PBIs"
echo ""
echo "Siguiente paso: en la vista Board del Project, agrupa por el campo 'Estado Scrum'"
echo "para obtener las columnas: Product Backlog → Sprint Backlog → En progreso → En revisión → Hecho."
