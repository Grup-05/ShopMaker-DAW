#!/usr/bin/env bash
# ==============================================================================
# Script Estático de Automatización de Releases (publish-release.sh)
# ==============================================================================
# Automatiza el ciclo completo de preparación y publicación de releases:
# 1. Validación SemVer e identificador de proyecto en el tag (<id-proyecto>-vX.Y.Z).
# 2. Determinación del título canónico: <Nombre Proyecto/Aplicación> <VERSION>.
# 3. Promoción automática de entradas en CHANGELOG.md ([Unreleased] -> [<TAG>])
#    incluyendo el resumen ejecutivo de la versión y los cambios categorizados.
# 4. Actualización automática de la versión en el README.md del proyecto.
# 5. Actualización opcional/automática del catálogo central en README.md de 'main'.
# 6. Generación de commit atómico docs(release) y creación de tag anotado Git
#    enriquecido con título y cuerpo completo para GitHub Releases.
# ==============================================================================

set -euo pipefail

# Colores para feedback en consola
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

RAW_VERSION=""
DESCRIPTION=""
PROJECT_ID=""
APP_NAME=""
UPDATE_MAIN_CATALOG=false
DRY_RUN=false

show_help() {
    cat << EOF
Uso: bash .agent/hooks/publish-release.sh <VERSION_O_TAG> "<DESCRIPCION_RESUMEN>" [OPCIONES]

Automatiza la preparación de una versión SemVer con identificador de proyecto en el tag
(<id-proyecto>-vX.Y.Z), actualizando CHANGELOG.md, README.md, generando el commit
atómico y creando el tag anotado con título "<Nombre Proyecto/Aplicación> <VERSION>".

Argumentos:
  <VERSION_O_TAG>         Versión SemVer (ej. v1.0.0) o tag completo con prefijo de proyecto
                          (ej. buscadorPeliculas-v1.0.0). Si se indica solo vX.Y.Z en una
                          rama de práctica (ej. ra02/buscadorPeliculas/main), el identificador
                          del proyecto se detecta e incorpora automáticamente en el tag.
  "<DESCRIPCION_RESUMEN>" Resumen ejecutivo de lo publicado (si es la 1.ª versión, explica
                          qué hace el aplicativo; en versiones sucesivas, qué cambia).

Opciones:
  --project-id "<ID>"     Identificador corto del proyecto para prefijar el tag (<ID>-vX.Y.Z).
  --app-name "<NOMBRE>"   Nombre del proyecto o aplicación para el título de la release
                          (si se omite, se autodetecta de README.md o package.json).
  --update-main-catalog   Actualiza la fila del catálogo central en el README.md de 'main'.
  --dry-run               Muestra las transformaciones sin escribir archivos ni comitear.
  -h, --help              Muestra esta ayuda y finaliza.

Ejemplos:
  bash .agent/hooks/publish-release.sh v1.0.0 "Buscador web de películas en Node.js, Express y EJS."
  bash .agent/hooks/publish-release.sh buscadorPeliculas-v1.0.0 "Primera versión estable del buscador."
EOF
}

# Procesar argumentos (soporta sintaxis posicional y flags)
POSITIONAL_ARGS=()
while [[ $# -gt 0 ]]; do
    case "$1" in
        --project-id|--id)
            if [ -n "${2:-}" ]; then
                PROJECT_ID="$2"
                shift 2
            else
                echo -e "${RED}❌ Error: Se requiere especificar el identificador tras $1.${NC}" >&2
                exit 1
            fi
            ;;
        --app-name|--title)
            if [ -n "${2:-}" ]; then
                APP_NAME="$2"
                shift 2
            else
                echo -e "${RED}❌ Error: Se requiere especificar el nombre tras $1.${NC}" >&2
                exit 1
            fi
            ;;
        --update-main-catalog)
            UPDATE_MAIN_CATALOG=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        -*)
            echo -e "${RED}❌ Opción desconocida: $1${NC}" >&2
            show_help
            exit 1
            ;;
        *)
            POSITIONAL_ARGS+=("$1")
            shift
            ;;
    esac
done

if [ ${#POSITIONAL_ARGS[@]} -ge 1 ]; then
    RAW_VERSION="${POSITIONAL_ARGS[0]}"
fi
if [ ${#POSITIONAL_ARGS[@]} -ge 2 ]; then
    DESCRIPTION="${POSITIONAL_ARGS[1]}"
fi

if [ -z "$RAW_VERSION" ]; then
    echo -e "${RED}❌ [ERROR] Debes especificar la versión o tag a publicar (ej. v1.0.0 o proyecto-v1.0.0).${NC}" >&2
    show_help
    exit 1
fi

if [ -z "$DESCRIPTION" ]; then
    echo -e "${RED}❌ [ERROR GOBERNANZA] Debes proporcionar una descripción/resumen ejecutivo para la release.${NC}" >&2
    echo "   - Si es la primera versión: explica qué hace el aplicativo." >&2
    echo "   - Si es una versión posterior: explica qué cambia respecto a la versión previa." >&2
    exit 1
fi

CURRENT_BRANCH="$(git branch --show-current 2>/dev/null || git rev-parse --abbrev-ref HEAD)"
TODAY="$(date '+%Y-%m-%d')"
CHANGELOG_FILE="$REPO_ROOT/CHANGELOG.md"
README_FILE="$REPO_ROOT/README.md"

# 1. Separar posible prefijo <id-proyecto>- y versión SemVer v<MAJOR>.<MINOR>.<PATCH>
SEMVER_CORE_REGEX='v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-(0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*))*)?'
FULL_TAG_REGEX="^(([a-zA-Z0-9._-]+)-)?(${SEMVER_CORE_REGEX})\$"

if ! [[ "$RAW_VERSION" =~ $FULL_TAG_REGEX ]]; then
    echo -e "${RED}❌ [ERROR SEMVER] '$RAW_VERSION' no cumple con el formato [<id-proyecto>-]v<MAJOR>.<MINOR>.<PATCH>[-<PRERELEASE>].${NC}"
    echo "   Ejemplos válidos: v1.0.0, buscadorPeliculas-v1.0.0, ra02-films-v0.1.0-alpha.1"
    exit 1
fi

EXTRACTED_PREFIX="${BASH_REMATCH[2]:-}"
SEMVER_VERSION="${BASH_REMATCH[3]}"

if [ -z "$PROJECT_ID" ] && [ -n "$EXTRACTED_PREFIX" ]; then
    PROJECT_ID="$EXTRACTED_PREFIX"
fi

# Si no se especificó PROJECT_ID y estamos en una rama de proyecto/práctica (ej. ra02/buscadorPeliculas/main), autodetectarlo
if [ -z "$PROJECT_ID" ] && [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "develop" ] && [ "$CURRENT_BRANCH" != "dev" ]; then
    PROJECT_ID=$(CURRENT_BRANCH="$CURRENT_BRANCH" python3 - << 'EOF'
import os, re, json

branch = os.environ.get("CURRENT_BRANCH", "")
parts = [p for p in branch.split("/") if p]

# Caso 1: ra02/buscadorPeliculas/main -> buscadorPeliculas
if len(parts) >= 2 and re.match(r"^ra\d+$", parts[0], re.IGNORECASE):
    if parts[1] not in ("main", "dev", "develop", "release", "releases", "feature", "fix"):
        print(parts[1])
        raise SystemExit(0)

# Caso 2: buscadorPeliculas/main -> buscadorPeliculas
if len(parts) >= 1 and parts[0] not in ("main", "dev", "develop", "release", "releases", "feature", "fix"):
    print(parts[0])
    raise SystemExit(0)

# Caso 3: Desde package.json
if os.path.exists("package.json"):
    try:
        with open("package.json", "r", encoding="utf-8") as f:
            name = json.load(f).get("name", "")
            if name:
                print(re.sub(r"[^a-zA-Z0-9._-]+", "-", name).strip("-"))
                raise SystemExit(0)
    except Exception:
        pass

print("")
EOF
)
fi

if [ -n "$PROJECT_ID" ]; then
    TAG_NAME="${PROJECT_ID}-${SEMVER_VERSION}"
else
    TAG_NAME="${SEMVER_VERSION}"
fi

# 2. Comprobar existencia previa del tag
if git rev-parse "$TAG_NAME" >/dev/null 2>&1; then
    echo -e "${RED}❌ [ERROR] El tag '$TAG_NAME' ya existe en el repositorio.${NC}"
    exit 1
fi

# 3. Determinar el nombre de la aplicación / proyecto si no se especificó con --app-name
if [ -z "$APP_NAME" ]; then
    APP_NAME=$(python3 - << 'EOF'
import os, json, re

# 1. Intentar extraer del primer encabezado # de README.md
if os.path.exists("README.md"):
    with open("README.md", "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("# "):
                title = line[2:].strip()
                if "·" in title:
                    title = title.split("·", 1)[1].strip()
                print(title)
                raise SystemExit(0)

# 2. Intentar extraer de package.json
if os.path.exists("package.json"):
    try:
        with open("package.json", "r", encoding="utf-8") as f:
            pkg = json.load(f)
            if pkg.get("name"):
                print(pkg["name"])
                raise SystemExit(0)
    except Exception:
        pass

# 3. Fallback al nombre del directorio raíz
print(os.path.basename(os.getcwd()))
EOF
)
fi

RELEASE_TITLE="${APP_NAME} ${SEMVER_VERSION}"

echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║         Publicación Automatizada de Release SemVer             ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo -e "🏷️  Título Release:   ${GREEN}$RELEASE_TITLE${NC}"
echo -e "🔖 Tag de Git:       ${GREEN}$TAG_NAME${NC}"
echo -e "📌 Versión SemVer:   ${GREEN}$SEMVER_VERSION${NC}"
echo -e "📝 Resumen:          ${BLUE}$DESCRIPTION${NC}"
[ "$DRY_RUN" = true ] && echo -e "🔍 ${YELLOW}[MODO DRY-RUN ACTIVADO - No se realizarán escrituras]${NC}"
echo ""

NOTES_TMP_FILE="$(mktemp)"
trap 'rm -f "$NOTES_TMP_FILE"' EXIT

# 4. Actualizar CHANGELOG.md y construir cuerpo completo de notas de la versión
if [ -f "$CHANGELOG_FILE" ]; then
    echo -e "📄 ${CYAN}Procesando CHANGELOG.md...${NC}"
    RELEASE_FILE="$CHANGELOG_FILE" RELEASE_TAG="$TAG_NAME" RELEASE_VERSION="$SEMVER_VERSION" RELEASE_TODAY="$TODAY" RELEASE_DESC="$DESCRIPTION" RELEASE_DRY_RUN="$DRY_RUN" RELEASE_NOTES_OUT="$NOTES_TMP_FILE" python3 - << 'EOF'
import os, sys, re

file_path = os.environ.get("RELEASE_FILE")
tag_name = os.environ.get("RELEASE_TAG")
version = os.environ.get("RELEASE_VERSION")
today = os.environ.get("RELEASE_TODAY")
desc = os.environ.get("RELEASE_DESC").strip()
dry_run = os.environ.get("RELEASE_DRY_RUN") == "true"
notes_out = os.environ.get("RELEASE_NOTES_OUT")

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

pattern = r"(##\s*\[Unreleased\]\s*\n)(.*?)(?=\n---\s*\n##\s*\[|\n##\s*\[|\Z)"
match = re.search(pattern, content, re.DOTALL)

if not match:
    print("   ⚠️  No se encontró la cabecera '## [Unreleased]'. Creando bloque...")
    release_body = f"{desc}\n\n### Added\n- Publicación de la versión {version} ({tag_name})."
    new_release_block = f"## [Unreleased]\n\n---\n\n## [{tag_name}] - {today}\n\n{release_body}\n\n"
    new_content = new_release_block + content
else:
    unreleased_body = match.group(2).strip()
    unreleased_body = re.sub(r"\n---\s*$", "", unreleased_body).strip()

    if not unreleased_body:
        release_body = f"{desc}\n\n### Added\n- Publicación de la versión {version} ({tag_name})."
    elif unreleased_body.startswith("###"):
        release_body = f"{desc}\n\n{unreleased_body}"
    else:
        if desc not in unreleased_body:
            release_body = f"{desc}\n\n{unreleased_body}"
        else:
            release_body = unreleased_body

    new_block = f"## [Unreleased]\n\n---\n\n## [{tag_name}] - {today}\n\n{release_body}\n"
    new_content = content[:match.start()] + new_block + content[match.end():]

with open(notes_out, "w", encoding="utf-8") as nf:
    nf.write(release_body + "\n")

if dry_run:
    print(f"   [DRY-RUN] CHANGELOG.md se actualizaría con la entrada [{tag_name}] - {today}.")
else:
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"   ✔ CHANGELOG.md actualizado con éxito: [{tag_name}] - {today}")
EOF
else
    echo -e "   ⚠️  ${YELLOW}No se encontró CHANGELOG.md. Creando nuevo archivo...${NC}"
    cat << EOF > "$NOTES_TMP_FILE"
$DESCRIPTION

### Added
- Publicación inicial de la versión $SEMVER_VERSION ($TAG_NAME).
EOF
    if [ "$DRY_RUN" = false ]; then
        cat << EOF > "$CHANGELOG_FILE"
# Registro de Cambios (CHANGELOG)

Todas las modificaciones notables de este proyecto quedarán documentadas en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto se adhiere a [Semantic Versioning (SemVer 2.0.0)](https://semver.org/lang/es/).

---

## [Unreleased]

---

## [$TAG_NAME] - $TODAY

$(cat "$NOTES_TMP_FILE")
EOF
        echo -e "   ✔ ${GREEN}CHANGELOG.md creado con éxito.${NC}"
    fi
fi

# 5. Actualizar README.md local
if [ -f "$README_FILE" ]; then
    echo -e "📘 ${CYAN}Procesando README.md local...${NC}"
    RELEASE_FILE="$README_FILE" RELEASE_TAG="$TAG_NAME" RELEASE_VERSION="$SEMVER_VERSION" RELEASE_DRY_RUN="$DRY_RUN" python3 - << 'EOF'
import os, sys, re

file_path = os.environ.get("RELEASE_FILE")
tag_name = os.environ.get("RELEASE_TAG")
version = os.environ.get("RELEASE_VERSION")
dry_run = os.environ.get("RELEASE_DRY_RUN") == "true"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

original_content = content

# 1. Actualizar > **Versión de Entrega:** ...
content = re.sub(
    r"(\>\s*\*\*Versión de Entrega:\*\*\s*)(`?[^`\n]+`?)",
    rf"\g<1>`{tag_name}`",
    content
)

# 2. Actualizar badges tipo https://img.shields.io/badge/version-...
content = re.sub(
    r"(https://img\.shields\.io/badge/version-)[^-\)]+(-[a-zA-Z0-9]+)",
    rf"\g<1>{version}\g<2>",
    content
)

if content == original_content:
    print("   ℹ️  README.md local ya contiene la versión actualizada o no requiere cambios.")
else:
    if dry_run:
        print(f"   [DRY-RUN] README.md local se actualizaría con la versión {tag_name}.")
    else:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"   ✔ README.md local actualizado con la versión {tag_name}.")
EOF
fi

# 6. Actualizar catálogo central en 'main' (si aplica)
if [ "$UPDATE_MAIN_CATALOG" = true ] && [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "📚 ${CYAN}Actualizando catálogo central en rama 'main'...${NC}"
    if git rev-parse --verify main >/dev/null 2>&1; then
        REMOTE_URL="$(git config --get remote.origin.url 2>/dev/null || echo '')"
        REPO_WEB_URL=$(echo "$REMOTE_URL" | sed -E 's|.*github\.com[:/]([^.]+)(\.git)?|https://github.com/\1|')
        [ -z "$REPO_WEB_URL" ] && REPO_WEB_URL="#"

        if [ "$DRY_RUN" = true ]; then
            echo "   [DRY-RUN] Se actualizaría la fila de '$CURRENT_BRANCH' en el catálogo de 'main'."
        else
            git switch main >/dev/null 2>&1
            RELEASE_FILE="$README_FILE" RELEASE_BRANCH="$CURRENT_BRANCH" RELEASE_TAG="$TAG_NAME" RELEASE_REPO_URL="$REPO_WEB_URL" python3 - << 'EOF'
import os, sys, re

file_path = os.environ.get("RELEASE_FILE")
branch = os.environ.get("RELEASE_BRANCH")
tag_name = os.environ.get("RELEASE_TAG")
repo_url = os.environ.get("RELEASE_REPO_URL")

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.splitlines()
updated_lines = []
found = False

for line in lines:
    if line.strip().startswith("|") and branch in line:
        parts = [p.strip() for p in line.split("|")]
        if len(parts) >= 7:
            release_link = f"[`{tag_name}`]({repo_url}/releases/tag/{tag_name})" if repo_url != "#" else f"`{tag_name}`"
            parts[-3] = release_link
            parts[-2] = "`🟢 Entregado`"
            new_line = " | ".join(parts)
            if not new_line.startswith("|"):
                new_line = "| " + new_line
            if not new_line.endswith("|"):
                new_line = new_line + " |"
            updated_lines.append(new_line)
            found = True
            continue
    updated_lines.append(line)

if found:
    with open(file_path, "w", encoding="utf-8") as f:
        f.write("\n".join(updated_lines) + "\n")
    print(f"   ✔ Fila de '{branch}' actualizada en el catálogo de 'main'.")
else:
    print(f"   ℹ️  No se encontró fila para la rama '{branch}' en la tabla de 'main'.")
EOF
            if [ -n "$(git status --porcelain "$README_FILE")" ]; then
                git add "$README_FILE"
                git commit -m "docs(catalog): actualizar entrega $TAG_NAME para rama $CURRENT_BRANCH" >/dev/null 2>&1
                echo "   ✔ Commit de catálogo consolidado en 'main'."
            fi
            git switch "$CURRENT_BRANCH" >/dev/null 2>&1
        fi
    else
        echo -e "   ⚠️  ${YELLOW}La rama 'main' no existe localmente. Omitiendo catálogo central.${NC}"
    fi
fi

if [ "$DRY_RUN" = true ]; then
    echo ""
    echo -e "📋 ${CYAN}Vista previa del Tag Anotado / GitHub Release:${NC}"
    echo -e "   ${GREEN}Tag:${NC}    $TAG_NAME"
    echo -e "   ${GREEN}Título:${NC} $RELEASE_TITLE"
    echo -e "   ${GREEN}Cuerpo:${NC}"
    sed 's/^/     /' "$NOTES_TMP_FILE"
    echo ""
    echo -e "🎉 ${GREEN}[DRY-RUN] Simulación de release $TAG_NAME completada exitosamente.${NC}"
    exit 0
fi

# 7. Commit Atómico de Release
echo -e "💾 ${CYAN}Generando commit atómico de documentación...${NC}"
git add "$CHANGELOG_FILE"
if [ -f "$README_FILE" ]; then
    git add "$README_FILE"
fi
COMMIT_MSG="docs(release): preparar version $TAG_NAME y actualizar changelog/readme"
git commit -m "$COMMIT_MSG"
echo -e "   ✔ ${GREEN}Commit consolidado:${NC} $COMMIT_MSG"

# 8. Creación de Tag Anotado Enriquecido (<Nombre Proyecto/Aplicación> <VERSION> + Cuerpo)
echo -e "🏷️  ${CYAN}Creando tag anotado de Git...${NC}"
TAG_MSG_FILE="$(mktemp)"
{
    echo "$RELEASE_TITLE"
    echo ""
    cat "$NOTES_TMP_FILE"
} > "$TAG_MSG_FILE"
git tag -a "$TAG_NAME" -F "$TAG_MSG_FILE"
rm -f "$TAG_MSG_FILE"
echo -e "   ✔ ${GREEN}Tag anotado creado:${NC} $TAG_NAME ($RELEASE_TITLE)"

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "🚀 ${GREEN}¡Release '$RELEASE_TITLE' ($TAG_NAME) preparada con éxito!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo "Pasos siguientes para publicar hacia el repositorio remoto:"
echo -e "  1. Publicar la rama de trabajo:"
echo -e "     ${CYAN}git push origin $CURRENT_BRANCH${NC}"
echo -e "  2. Publicar el tag anotado (activa GitHub Actions release):"
echo -e "     ${CYAN}git push origin $TAG_NAME${NC}"
echo ""

exit 0
