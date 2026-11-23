#!/usr/bin/env bash
# ==============================================================================
# Script de Inicialización y Verificación de Seguridad Local (SAS)
# ==============================================================================
# Proyecto: ShopMaker-DAW
# Ubicación: scripts/setup/init-user-security.sh
# Propósito: Detectar, explicar y configurar interactivamente la carpeta
#            confidencial 'user_data/security/' para cada miembro del equipo.
# ==============================================================================

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
SECURITY_DIR="$REPO_ROOT/user_data/security"
PATTERNS_FILE="$SECURITY_DIR/forbidden_patterns.txt"
TOKEN_FILE="$SECURITY_DIR/gh_token.txt"

print_header() {
    cat << 'EOF'
╔══════════════════════════════════════════════════════════════════════════════╗
║        🛡️  ShopMaker-DAW — Verificación y Configuración de Seguridad         ║
╚══════════════════════════════════════════════════════════════════════════════╝
EOF
}

explain_security_purpose() {
    cat << EOF
💡 ¿POR QUÉ ES OBLIGATORIA LA CARPETA 'user_data/security/'?

1. AISLAMIENTO SAS (Constitución AGENTS.md §7):
   La carpeta 'user_data/' y '.agent/local/' están estrictamente excluidas en .gitignore.
   Todo lo que se almacene aquí NUNCA llegará a los commits ni al repositorio remoto.

2. PREVENCIÓN DE FUGAS LOCALES (forbidden_patterns.txt - OBLIGATORIO):
   Cada desarrollador trabaja en una estación de trabajo con rutas y usuarios
   propios (ej: '$HOME/'). Este archivo registra tus rutas locales para que el
   escáner SAST de 'pre-commit' bloquee cualquier commit accidental que las contenga.
   Se autogenera automáticamente sin requerir esfuerzo manual.

3. AUTENTICACIÓN MULTIUSUARIO POR ROL (gh_token.txt - OBLIGATORIO EQUIPO SCRUM):
   - Equipo Scrum (@FSolaje, @Tarrant15, @Fernis23228): OBLIGATORIO. Dado que los
     roles rotan en cada Sprint, cada miembro debe disponer de su propio token
     personal en 'user_data/security/gh_token.txt' con permisos sobre el repo y
     el Tablón Project #1 (validado por 'pre-pr-gate.sh' y 'pre-push').
   - Cliente / Evaluador externo: No requiere instalar hooks ni configurar token.
════════════════════════════════════════════════════════════════════════════════
EOF
}

check_security_env() {
    local status=0
    echo "🔍 Comprobando estado del entorno local de seguridad..."
    echo ""

    if [ -d "$SECURITY_DIR" ]; then
        echo "  ✔ Directorio 'user_data/security/' existe."
    else
        echo "  ❌ FALTA: Directorio 'user_data/security/' no existe."
        status=1
    fi

    if [ -f "$PATTERNS_FILE" ]; then
        echo "  ✔ Archivo 'forbidden_patterns.txt' existe (SAST preventivo)."
    else
        echo "  ❌ FALTA: 'user_data/security/forbidden_patterns.txt' no existe."
        status=1
    fi

    if [ -f "$TOKEN_FILE" ]; then
        if grep -Eq "gh[pousr]_|github_pat_" "$TOKEN_FILE" 2>/dev/null; then
            echo "  ✔ Token personal de GitHub configurado en 'user_data/security/gh_token.txt'."
        else
            echo "  ❌ FALTA: Token en 'user_data/security/gh_token.txt' vacío o no configurado."
            status=1
        fi
    else
        echo "  ❌ FALTA: 'user_data/security/gh_token.txt' no existe."
        status=1
    fi

    # Comprobación de permisos UNIX si aplica
    if [ -d "$SECURITY_DIR" ]; then
        chmod 700 "$SECURITY_DIR" 2>/dev/null || true
    fi
    if [ -f "$PATTERNS_FILE" ]; then
        chmod 600 "$PATTERNS_FILE" 2>/dev/null || true
    fi
    if [ -f "$TOKEN_FILE" ]; then
        chmod 600 "$TOKEN_FILE" 2>/dev/null || true
    fi

    echo ""
    return $status
}

init_security_env() {
    print_header
    explain_security_purpose

    echo "⚙️  Configurando el entorno local 'user_data/security/'..."
    echo ""

    mkdir -p "$SECURITY_DIR"
    chmod 700 "$SECURITY_DIR" 2>/dev/null || true

    if [ ! -f "$PATTERNS_FILE" ]; then
        cat << 'EOF' > "$PATTERNS_FILE"
# ==============================================================================
# PATRONES PRIVADOS LOCALES (user_data/security/forbidden_patterns.txt)
# ==============================================================================
# Este archivo reside dentro de user_data/ y está ESTRICTAMENTE IGNORADO en Git.
# Define rutas y patrones locales confidenciales que el hook SAST debe bloquear.
# ==============================================================================

EOF
        if [ -n "${HOME:-}" ] && [ "$HOME" != "/" ]; then
            echo "# Ruta personal autodetectada de la estación de trabajo" >> "$PATTERNS_FILE"
            echo "$HOME/" >> "$PATTERNS_FILE"
        fi
        chmod 600 "$PATTERNS_FILE" 2>/dev/null || true
        echo "  ✔ Creado: user_data/security/forbidden_patterns.txt (permisos 600)."
    else
        echo "  ✔ user_data/security/forbidden_patterns.txt ya existe."
    fi

    if [ ! -f "$TOKEN_FILE" ]; then
        cat << 'EOF' > "$TOKEN_FILE"
# Token personal de GitHub CLI (gh) — NO versionar
# Para configurar interactivamente tu token:
#   bash scripts/github/gh-auth-env.sh --login
EOF
        chmod 600 "$TOKEN_FILE" 2>/dev/null || true
        echo "  ✔ Creado: plantilla user_data/security/gh_token.txt (permisos 600)."
    else
        echo "  ✔ user_data/security/gh_token.txt ya existe."
    fi

    echo ""
    echo "✅ Entorno básico de seguridad inicializado correctamente."
    echo ""
    echo "👉 Siguiente paso para autenticación en GitHub:"
    echo "   Ejecuta el asistente interactivo para registrar tu token personal:"
    echo "     bash scripts/github/gh-auth-env.sh --login"
    echo ""
    echo "   O verifica la conexión con:"
    echo "     bash scripts/github/gh-auth-env.sh --check"
    echo "════════════════════════════════════════════════════════════════════════════════"
}

MODE="${1:---init}"

case "$MODE" in
    --check)
        print_header
        if check_security_env; then
            echo "✅ El entorno local de seguridad está completo y operativo."
            exit 0
        else
            echo "⚠️  El entorno local está incompleto."
            echo "   Ejecuta: bash scripts/setup/init-user-security.sh --init"
            exit 1
        fi
        ;;
    --init|--fix|"")
        init_security_env
        ;;
    *)
        echo "Uso: $0 [--check | --init]"
        exit 1
        ;;
esac
