#!/usr/bin/env bash
# ==============================================================================
# Generador de Wrappers Ejecutables para node_modules/.bin
# ==============================================================================
# Propósito:
#   En entornos donde el sistema de archivos no permite enlaces simbólicos
#   (como unidades montadas NTFS, FAT32 o exFAT sin soporte symlink),
#   este script genera wrappers ejecutables portables en node_modules/.bin
#   para permitir que 'npm test', 'npm run build', etc. funcionen sin fricción.
# ==============================================================================

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BIN_DIR="$REPO_ROOT/node_modules/.bin"

mkdir -p "$BIN_DIR"

create_wrapper() {
    local cmd_name="$1"
    local target_rel="$2"
    local wrapper_path="$BIN_DIR/$cmd_name"

    cat << EOF > "$wrapper_path"
#!/usr/bin/env sh
basedir="\$(dirname "\$0")"
exec node "\$basedir/$target_rel" "\$@"
EOF
    chmod +x "$wrapper_path" 2>/dev/null || true
}

# Vitest
if [ -f "$REPO_ROOT/node_modules/vitest/vitest.mjs" ]; then
    create_wrapper "vitest" "../vitest/vitest.mjs"
fi

# TypeScript
if [ -f "$REPO_ROOT/node_modules/typescript/bin/tsc" ]; then
    create_wrapper "tsc" "../typescript/bin/tsc"
fi

# ESLint
if [ -f "$REPO_ROOT/node_modules/eslint/bin/eslint.js" ]; then
    create_wrapper "eslint" "../eslint/bin/eslint.js"
fi

# Vite
if [ -f "$REPO_ROOT/node_modules/vite/bin/vite.js" ]; then
    create_wrapper "vite" "../vite/bin/vite.js"
fi

# Playwright
if [ -f "$REPO_ROOT/node_modules/@playwright/test/cli.js" ]; then
    create_wrapper "playwright" "../@playwright/test/cli.js"
fi

# Generar hook local de calidad (.agent/hooks/pre-commit-local.sh) si no existe
LOCAL_HOOK="$REPO_ROOT/.agent/hooks/pre-commit-local.sh"
if [ ! -f "$LOCAL_HOOK" ]; then
    mkdir -p "$REPO_ROOT/.agent/hooks"
    cat << 'EOF' > "$LOCAL_HOOK"
#!/usr/bin/env bash
# ==============================================================================
# Hook Local de Calidad — ShopMaker-DAW (.agent/hooks/pre-commit-local.sh)
# ==============================================================================
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

if [ -f "$REPO_ROOT/scripts/setup/create-bin-wrappers.sh" ]; then
    bash "$REPO_ROOT/scripts/setup/create-bin-wrappers.sh"
fi

echo "  🧪 [Local QA] 1/3 Comprobando tipos con TypeScript (typecheck)..."
if ! npm run typecheck >/dev/null 2>&1; then
    echo "  ❌ [ERROR] Falló la verificación de tipos (npm run typecheck)." >&2
    echo "     Ejecuta 'npm run typecheck' para ver los detalles de los errores." >&2
    exit 1
fi
echo "     ✔ Typecheck completado sin errores."

echo "  🔍 [Local QA] 2/3 Ejecutando linter (ESLint)..."
if ! npm run lint >/dev/null 2>&1; then
    echo "  ❌ [ERROR] Falló el análisis de linter (npm run lint)." >&2
    echo "     Ejecuta 'npm run lint' para ver y corregir las advertencias/errores." >&2
    exit 1
fi
echo "     ✔ Linting superado sin incidencias."

echo "  ⚡ [Local QA] 3/3 Ejecutando suite de pruebas unitarias (Vitest)..."
if ! npm run test:unit >/dev/null 2>&1; then
    echo "  ❌ [ERROR] Fallaron pruebas unitarias (npm run test:unit)." >&2
    echo "     Ejecuta 'npm test' para ver qué aserciones no se cumplieron." >&2
    exit 1
fi
echo "     ✔ Suite unitaria en verde."

echo "  ✅ [Local QA] Todas las puertas de calidad del proyecto fueron superadas con éxito."
exit 0
EOF
    chmod +x "$LOCAL_HOOK" 2>/dev/null || true
fi

exit 0
