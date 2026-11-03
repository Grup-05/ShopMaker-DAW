#!/usr/bin/env bash
# ==============================================================================
# Script Instalador y Activador Universal de Git Hooks
# ==============================================================================
# Configura Git para ejecutar hooks versionados en .agent/hooks/
# y prepara el entorno de seguridad local en user_data/security/
# ==============================================================================

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
HOOKS_DIR="$REPO_ROOT/.agent/hooks"

echo "⚙️  Configurando ruta de hooks de Git en '.agent/hooks'..."

# Configurar core.hooksPath de forma relativa para máxima portabilidad
git config core.hooksPath .agent/hooks

# Asegurar permisos de ejecución en todos los scripts de hooks y gobernanza
if [ -d "$HOOKS_DIR" ]; then
    chmod +x "$HOOKS_DIR"/* 2>/dev/null || true
fi

# Configurar y verificar entorno de seguridad local en user_data/security/
SECURITY_DIR="$REPO_ROOT/user_data/security"
PATTERNS_FILE="$SECURITY_DIR/forbidden_patterns.txt"
TOKEN_FILE="$SECURITY_DIR/gh_token.txt"

echo "🔒 Verificando entorno de seguridad local en 'user_data/security/'..."

if [ ! -d "$SECURITY_DIR" ] || [ ! -f "$PATTERNS_FILE" ] || [ ! -f "$TOKEN_FILE" ]; then
    echo "⚠️  [AVISO SAS] Entorno local de seguridad no configurado completamente."
    echo "   ════════════════════════════════════════════════════════════════════════════════"
    echo "   ¿POR QUÉ ES OBLIGATORIA LA CARPETA 'user_data/security/'?"
    echo "   1. Aislamiento SAS (AGENTS.md §7): user_data/ está estrictamente ignorado"
    echo "      en Git para que ningún secreto, token o ruta privada llegue al repositorio."
    echo "   2. forbidden_patterns.txt: Contiene tus rutas locales (\$HOME/) y patrones"
    echo "      privados de tu máquina para que el escáner SAST bloquee fugas accidentales."
    echo "   3. gh_token.txt: Guarda tu token personal de GitHub (permisos 600) para"
    echo "      gestionar issues, PRs y tableros sin exponer tus credenciales."
    echo "   ════════════════════════════════════════════════════════════════════════════════"
    echo "   ⚙️  Inicializando automáticamente la estructura segura con permisos 700/600..."

    mkdir -p "$SECURITY_DIR"
    chmod 700 "$SECURITY_DIR" 2>/dev/null || true

    if [ ! -f "$PATTERNS_FILE" ]; then
        cat << 'EOF' > "$PATTERNS_FILE"
# ==============================================================================
# PATRONES PRIVADOS LOCALES (user_data/security/forbidden_patterns.txt)
# ==============================================================================
# Este archivo reside dentro de user_data/ y está ESTRICTAMENTE IGNORADO en Git.
# Permite definir patrones, nombres de usuario o rutas locales confidenciales que
# el hook de pre-commit debe bloquear sin exponerlos en el repositorio público.
#
# Sintaxis: Expresión regular por línea (se ignoran líneas vacías y con '#').
# ==============================================================================

EOF
        # Autodetectar de forma segura la ruta HOME del desarrollador actual
        if [ -n "${HOME:-}" ] && [ "$HOME" != "/" ]; then
            echo "# Ruta local autodetectada de la estación de trabajo" >> "$PATTERNS_FILE"
            echo "$HOME/" >> "$PATTERNS_FILE"
        fi
        chmod 600 "$PATTERNS_FILE" 2>/dev/null || true
        echo "   ✔ Archivo confidencial de patrones creado: user_data/security/forbidden_patterns.txt"
    fi

    if [ ! -f "$TOKEN_FILE" ]; then
        cat << 'EOF' > "$TOKEN_FILE"
# Token personal de GitHub CLI (gh) — NO versionar
# Para configurar interactivamente tu token:
#   bash scripts/github/gh-auth-env.sh --login
EOF
        chmod 600 "$TOKEN_FILE" 2>/dev/null || true
        echo "   ✔ Plantilla confidencial de token creada: user_data/security/gh_token.txt"
    fi

    echo "   Para configurar tu token personal de GitHub de forma interactiva:"
    echo "     bash scripts/github/gh-auth-env.sh --login"
    echo "   ════════════════════════════════════════════════════════════════════════════════"
else
    chmod 700 "$SECURITY_DIR" 2>/dev/null || true
    chmod 600 "$PATTERNS_FILE" 2>/dev/null || true
    chmod 600 "$TOKEN_FILE" 2>/dev/null || true
    echo "✔ Entorno local de seguridad verificado y con permisos restrictivos (700/600)."
fi

echo "✔ Git Hooks y herramientas de gobernanza activadas con éxito:"
echo "  - Pre-commit:       $HOOKS_DIR/pre-commit (Live Tracking + Inmutabilidad + SAST)"
echo "  - Pre-push:         $HOOKS_DIR/pre-push (Protección de ramas y jerarquía)"
echo "  - Sync Governance:  $HOOKS_DIR/sync-governance.sh (Propagación estática a ramas)"
echo "  - Publish Release:  $HOOKS_DIR/publish-release.sh (Automatización SemVer y metadatos)"
exit 0
