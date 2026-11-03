#!/usr/bin/env bash
# ==============================================================================
# Rotación Dinámica de Roles Scrum y Generador de CODEOWNERS (rotate-roles.sh)
# ==============================================================================
# Uso:
#   bash scripts/scrum/rotate-roles.sh [OPCIONES]
#
# Opciones:
#   --sprint <ID>         Identificador del Sprint (ej. S02)
#   --po <usuario>        Usuario GitHub del nuevo Product Owner (ej. Tarrant15)
#   --sm <usuario>        Usuario GitHub del nuevo Scrum Master (ej. Fernis23228)
#   --devs <usuarios>     Lista separada por comas de Developers (ej. FSolaje,Tarrant15,Fernis23228)
#   --gov-admin <usuario> Usuario GitHub del Administrador de Gobernanza (ej. FSolaje)
#   -h, --help            Muestra esta ayuda
#
# Ejemplo:
#   bash scripts/scrum/rotate-roles.sh --sprint S02 --po Tarrant15 --sm Fernis23228 --gov-admin FSolaje
# ==============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ROLES_FILE="$ROOT_DIR/docs/scrum/active_roles.env"
CODEOWNERS_FILE="$ROOT_DIR/.github/CODEOWNERS"

# Cargar valores actuales si existe
if [ -f "$ROLES_FILE" ]; then
  # shellcheck source=/dev/null
  source "$ROLES_FILE"
fi

SPRINT_ID="${SPRINT_ID:-S01}"
PRODUCT_OWNER="${PRODUCT_OWNER:-FSolaje}"
SCRUM_MASTER="${SCRUM_MASTER:-Tarrant15}"
DEVELOPERS="${DEVELOPERS:-FSolaje,Tarrant15,Fernis23228}"
GOVERNANCE_ADMIN="${GOVERNANCE_ADMIN:-FSolaje}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --sprint)
      SPRINT_ID="$2"
      shift 2
      ;;
    --po)
      PRODUCT_OWNER="${2#@}"
      shift 2
      ;;
    --sm)
      SCRUM_MASTER="${2#@}"
      shift 2
      ;;
    --devs)
      DEVELOPERS="$2"
      shift 2
      ;;
    --gov-admin)
      GOVERNANCE_ADMIN="${2#@}"
      shift 2
      ;;
    -h|--help)
      sed -n '2,17p' "$0" | sed 's/^# //'
      exit 0
      ;;
    *)
      echo "❌ Opción desconocida: $1" >&2
      exit 1
      ;;
  esac
done

# Formatear lista de devs con @
IFS=',' read -ra DEVS_ARRAY <<< "$DEVELOPERS"
DEVS_TAGGED=""
for dev in "${DEVS_ARRAY[@]}"; do
  clean_dev="${dev#@}"
  clean_dev="$(echo "$clean_dev" | tr -d '[:space:]')"
  [ -n "$clean_dev" ] && DEVS_TAGGED+="@$clean_dev "
done
DEVS_TAGGED="$(echo "$DEVS_TAGGED" | sed 's/[[:space:]]*$//')"

# 1. Escribir active_roles.env
cat > "$ROLES_FILE" << EOF
# ==============================================================================
# Roles Activos del Sprint — Asignación de Autoridad y Decisión
# ==============================================================================
# Este archivo define la titularidad activa de cada rol Scrum y la administración
# de gobernanza para el Sprint en curso.
#
# Se actualiza en cada Sprint Planning o al rotar roles mediante:
#   bash scripts/scrum/rotate-roles.sh
# ==============================================================================

SPRINT_ID="$SPRINT_ID"
PRODUCT_OWNER="$PRODUCT_OWNER"
SCRUM_MASTER="$SCRUM_MASTER"
DEVELOPERS="$DEVELOPERS"
GOVERNANCE_ADMIN="$GOVERNANCE_ADMIN"
EOF

# 2. Generar .github/CODEOWNERS
cat > "$CODEOWNERS_FILE" << EOF
# ==============================================================================
# GitHub CODEOWNERS — Control de Aprobaciones por Responsabilidad de Rol
# ==============================================================================
# Este archivo define quién debe revisar y aprobar cambios en Pull Requests
# según las rutas afectadas, garantizando la separación de poderes Scrum.
#
# Generado automáticamente por scripts/scrum/rotate-roles.sh
# Roles activos actuales (Sprint $SPRINT_ID):
#   - Product Owner:        @$PRODUCT_OWNER
#   - Scrum Master:         @$SCRUM_MASTER
#   - Developers:           $DEVS_TAGGED
#   - Administrador Gob.:   @$GOVERNANCE_ADMIN
# ==============================================================================

# Requisitos del Producto, Historias de Usuario y Backlog (Product Owner)
/docs/scrum/product-backlog.md  @$PRODUCT_OWNER
/specs/                         @$PRODUCT_OWNER

# Proceso Scrum, Definiciones y Retrospectivas (Scrum Master)
/docs/scrum/definition-*.md     @$SCRUM_MASTER
/docs/scrum/sprints/            @$SCRUM_MASTER
/docs/scrum/team.md             @$SCRUM_MASTER
/docs/scrum/active_roles.env    @$SCRUM_MASTER

# Núcleo de Gobernanza, Hooks y Workflows (Administrador de Gobernanza)
/.agent/                        @$GOVERNANCE_ADMIN
/.github/                       @$GOVERNANCE_ADMIN
/.gitattributes                 @$GOVERNANCE_ADMIN
/scripts/github/                @$GOVERNANCE_ADMIN

# Código de Producción, UI/UX, Componentes y Pruebas (Developers)
/src/                           $DEVS_TAGGED
/tests/                         $DEVS_TAGGED
/scripts/                       $DEVS_TAGGED

# Regla global por defecto para cualquier otro archivo no listado
*                               $DEVS_TAGGED
EOF

echo "✔ Roles Scrum actualizados para el Sprint $SPRINT_ID:"
echo "  • Product Owner:        @$PRODUCT_OWNER"
echo "  • Scrum Master:         @$SCRUM_MASTER"
echo "  • Developers:           $DEVS_TAGGED"
echo "  • Administrador Gob.:   @$GOVERNANCE_ADMIN"
echo "✔ Archivo actualizado: docs/scrum/active_roles.env"
echo "✔ Archivo regenerado:  .github/CODEOWNERS"
