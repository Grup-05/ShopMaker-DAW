# ADR-010 — Puerta estática `pre-pr-gate.sh`, token personal por rol y sincronización automática del Tablón

## Metadatos

| Campo | Valor |
|---|---|
| ID | `ADR-010` |
| Fecha | 2026-11-17 → 2026-11-24 |
| Estado | Aceptado |
| Sprint / PBI | S01–S02 · transversal |
| Decisores | Equipo Grup-05 (implementado por `@FSolaje`) |
| Registro | Retroactivo (2026-11-26), reconstruido desde el historial Git y `AGENTS.md` §6 |
| Sustituye a | — |
| Sustituido por | — |

## Contexto

GitHub solo cierra issues con `Closes #XX` cuando la PR llega a la rama por defecto (`main`), pero el trabajo se integra en `develop`. Además, las PRs llegaban con conflictos o desactualizadas, y los scripts debían funcionar en Windows y Linux.

## Decisión

1. **`scripts/github/pre-pr-gate.sh`** con 5 puertas, invocado por `pre-push` y antes de cada PR: (1) herramientas y token personal por rol, (2) sincronización con `origin/develop` sin conflictos, (3) paridad del núcleo de gobernanza, (4) suite local en verde, (5) reconciliación de issues y Tablón.
2. **Token personal** en `user_data/security/gh_token.txt` para cada miembro del equipo; ningún token personal en GitHub Secrets.
3. **`.github/workflows/scrum-board-sync.yml`** (ref `main`, `GITHUB_TOKEN` nativo) cierra issues y mueve tarjetas a «Hecho» al fusionar en `develop`; `sync-pr-issues.sh --reconcile` lo cubre en local.
4. Scripts de gestión en **Node.js (`*.cjs`)** y `* text=auto eol=lf` en `.gitattributes` para compatibilidad Windows/Linux.

## Alternativas consideradas

| Alternativa | Ventajas | Inconvenientes | Motivo de descarte |
|---|---|---|---|
| Cerrar issues a mano | Sin automatización | Olvidos y desfases del Tablón | Fue una acción de mejora de la retrospectiva S02 |
| Token de organización en Secrets | Sin gestión local | Sin autoría personal; riesgo de fuga | Contradice `AGENTS.md` §7 |
| Scripts solo en `bash` | Más simple | Fricción en Windows | Se añadieron versiones `.cjs` |

## Consecuencias

- Positivas: PRs listas para revisar; Tablón fiable; cierre automático de issues.
- Negativas o deuda asumida: requiere `gh`, `jq`, `node` y token válido; algunos pasos necesitan red.
- Impacto en pruebas: la puerta ejecuta `pre-commit-local.sh` (typecheck, lint, Vitest).
- Impacto en accesibilidad y seguridad: cero secretos en el repositorio.

## Referencias

- Commits `d956f1e`, `b3329f3`, `01b8fdf`, `f8ae252`, `4d7d563` · PRs `#30`, `#33`
