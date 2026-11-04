#!/usr/bin/env bash
# ==============================================================================
# Cargador y Validador Seguro de Token GitHub por Desarrollador (gh-auth-env.sh)
# ==============================================================================
# Propósito:
#   Permitir que cada miembro del equipo (@FSolaje, @Tarrant15, @Fernis23228),
#   al rotar entre los roles de Product Owner, Scrum Master y Developer,
#   utilice su propio Personal Access Token almacenado localmente en:
#     user_data/security/gh_token.txt
#
# Garantías de Seguridad (SAS - AGENTS.md §7):
#   1. El archivo reside en user_data/security/ (gitignored y bloqueado por SAST).
#   2. Aborta si el archivo estuviera indexado en Git por accidente.
#   3. Fuerza permisos 700 en el directorio y 600 en el archivo del token.
#   4. Nunca imprime el contenido del token en stdout/stderr ni en logs.
#
# Uso:
#   source scripts/github/gh-auth-env.sh
#   # como validación directa:
#   bash scripts/github/gh-auth-env.sh --check
#   # para autorizar/ampliar el token con gh y guardarlo en user_data/security/gh_token.txt:
#   bash scripts/github/gh-auth-env.sh --login
# ==============================================================================

_gh_auth_env_main() {
  local mode="${1:---load}"
  local root_dir
  root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
  local sec_dir="$root_dir/user_data/security"
  local token_file="$sec_dir/gh_token.txt"

  mkdir -p "$sec_dir"
  chmod 700 "$sec_dir" 2>/dev/null || true

  # 1. Comprobar que el archivo jamás esté versionado en Git
  if git -C "$root_dir" ls-files --error-unmatch "user_data/security/gh_token.txt" >/dev/null 2>&1; then
    echo "❌ [ERROR CRÍTICO DE SEGURIDAD] user_data/security/gh_token.txt figura en el índice de Git." >&2
    echo "   Ejecuta inmediatamente: git rm --cached user_data/security/gh_token.txt" >&2
    return 1
  fi

  # 2. Modo --login: solicita a gh los scopes necesarios y guarda el token en user_data/security/gh_token.txt
  if [ "$mode" = "--login" ]; then
    unset GH_TOKEN
    echo "🔐 Iniciando autorización OAuth con GitHub CLI (scopes: repo, workflow, project, read:project, read:org)..."
    if gh auth status -h github.com >/dev/null 2>&1; then
      printf '\n' | gh auth refresh -h github.com -s repo,workflow,project,read:project,read:org
    else
      printf '\n' | gh auth login --hostname github.com --git-protocol ssh --web --scopes repo,workflow,project,read:project,read:org
    fi
    umask 077
    {
      echo "# Token generado mediante gh-auth-env.sh --login (NO versionar)"
      gh auth token -h github.com
    } > "$token_file"
    chmod 600 "$token_file"
    echo "✔ Token guardado de forma segura en user_data/security/gh_token.txt (permisos 600)."
    mode="--check"
  fi

  # 2. Si no existe el archivo, crearlo vacío con permisos 600 y mostrar guía
  if [ ! -f "$token_file" ]; then
    umask 077
    : > "$token_file"
    chmod 600 "$token_file" 2>/dev/null || true
  else
    chmod 600 "$token_file" 2>/dev/null || true
  fi

  # 3. Leer el token eliminando líneas de comentario (#), espacios y saltos de línea
  local raw_token=""
  if [ -f "$token_file" ]; then
    raw_token="$(grep -v '^[[:space:]]*#' "$token_file" 2>/dev/null | tr -d '[:space:]' || true)"
  fi

  if [ -z "$raw_token" ]; then
    if [ "$mode" = "--quiet-if-missing" ]; then
      return 0
    fi
    cat >&2 << 'EOF'
⚠️  [GitHub Auth] No se encontró un token activo en: user_data/security/gh_token.txt

Para generar tu token personal del proyecto (válido para cualquier rol PO/SM/Dev):
  Opción 1 — Fine-grained Token (recomendado, acotado al repositorio y organización):
    1. Ve a: https://github.com/settings/personal-access-tokens/new
    2. Resource owner: Grup-05
    3. Repository access: Only select repositories -> Grup-05/ShopMaker-DAW
    4. Repository permissions:
       - Actions: Read and write
       - Contents: Read and write
       - Issues: Read and write
       - Pull requests: Read and write
       - Metadata: Read-only
    5. Organization permissions:
       - Projects: Read and write (imprescindible para el tablón GitHub Projects v2)

  Opción 2 — Classic Personal Access Token (alternativa compatible con todo GraphQL Projects v2):
    1. Ve a: https://github.com/settings/tokens/new
    2. Marca los scopes: repo, workflow, project, read:org

Guarda únicamente la cadena del token en:
  user_data/security/gh_token.txt
EOF
    return 1
  fi

  # 4. Validar formato básico del token sin exponerlo jamás en salida
  if [[ ! "$raw_token" =~ ^(github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9_]{20,})$ ]]; then
    echo "❌ [ERROR DE FORMATO] El contenido de user_data/security/gh_token.txt no parece un token válido de GitHub (github_pat_* o ghp_*)." >&2
    return 1
  fi

  export GH_TOKEN="$raw_token"

  if [ "$mode" = "--check" ]; then
    local login
    if ! login="$(gh api user --jq '.login' 2>/dev/null)"; then
      echo "❌ [GitHub Auth] El token en user_data/security/gh_token.txt fue rechazado por GitHub API." >&2
      return 1
    fi
    echo "✔ [GitHub Auth] Token cargado desde user_data/security/gh_token.txt (permisos 600)."
    echo "  • Usuario autenticado: @$login"
    if gh api "repos/Grup-05/ShopMaker-DAW" --jq '.full_name' >/dev/null 2>&1; then
      echo "  • Acceso a repositorio Grup-05/ShopMaker-DAW: OK"
    else
      echo "  ❌ Sin acceso al repositorio Grup-05/ShopMaker-DAW" >&2
      return 1
    fi
    if gh project list --owner Grup-05 --format json >/dev/null 2>&1; then
      echo "  • Acceso a GitHub Projects v2 (Grup-05): OK"
    else
      echo "  ⚠️  El token aún no tiene permisos sobre Projects de Grup-05 (Organization permissions -> Projects: Read and write, o scope 'project')." >&2
      return 1
    fi
  fi

  return 0
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  set -euo pipefail
  _gh_auth_env_main "${1:---check}"
else
  _gh_auth_env_main "${1:---load}"
fi

