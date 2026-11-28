# ADR-015 — Transiciones obligatorias del Tablón Scrum (`En progreso` / `En revisión`) y paridad con `Status` nativo

## Metadatos

| Campo | Valor |
|---|---|
| ID | `ADR-015` |
| Fecha | 2026-11-28 |
| Estado | Aceptado |
| Sprint / PBI | S03 · gobernanza transversal |
| Decisores | Equipo Grup-05 (solicitado por `@FSolaje`) |
| Registro | En la sesión en que se acuerda (`AGENTS.md` §11) |
| Sustituye a | — |
| Sustituido por | — |

## Contexto

Durante los Sprints S01–S03 se detectó que la columna `En progreso` (`In Progress`) del Tablón GitHub Projects `#1` quedaba prácticamente vacía y las tareas saltaban directamente de `Sprint Backlog` (`Todo`) a `Hecho` (`Done`). Se identificaron tres causas:

1. `scripts/github/sync-pr-issues.sh` solo contemplaba transiciones a `En revisión` y `Hecho`, sin ningún mecanismo para mover tareas a `En progreso` al iniciar una rama `feature/PBI-###-*` o hacer `git push`.
2. El workflow `.github/workflows/scrum-board-sync.yml` usa `GITHUB_TOKEN`, que carece de permisos de escritura sobre Projects v2 de organización (`Grup-05`), por lo que la transición a `En revisión` al abrir una PR se omitía en CI.
3. El Tablón tiene dos campos de estado (`Estado Scrum` y el campo nativo `Status`: `Todo` / `In Progress` / `Done`), pero los scripts solo actualizaban `Estado Scrum`, dejando `In Progress` vacío en la vista por defecto.

## Decisión

1. **Script multiplataforma `scripts/github/sync-board-status.cjs`:** gestiona en Windows y Linux las transiciones `--in-progress`, `--in-review`, `--done` y `--reconcile-status`, manteniendo sincronizados ambos campos:
   - `Product Backlog` / `Sprint Backlog` ↔ `Todo`
   - `En progreso` / `En revisión` ↔ `In Progress`
   - `Hecho` ↔ `Done`
   - Sin retrocesos accidentales: `--in-progress` nunca baja una issue que ya esté en `En revisión` o `Hecho`.
2. **Integración automática en `scripts/github/pre-pr-gate.sh` (Gate 5):**
   - Tanto en `--pre-push` (hook `pre-push`) como en `--pre-pr`, si la rama corresponde a un `PBI-###`, mueve automáticamente a `En progreso` (`In Progress`) todas las issues abiertas de ese PBI que sigan en `Sprint Backlog` / `Todo`.
   - Así, ninguna rama sube trabajo ni abre una PR con tareas todavía en `Todo`.
3. **Actualización de `scripts/github/sync-pr-issues.sh`:** al mover a `En revisión` o `Hecho` actualiza también el campo nativo `Status` (`In Progress` / `Done`).
4. **Regla en gobernanza y PR:** se documenta la prohibición de saltar `Todo` → `Done` en `.agent/rules/AGENTS.md` §6, `.agent/rules/methodology-scrum.md` §2.5, `docs/scrum/definition-of-done.md` y `.github/pull_request_template.md`.

## Alternativas consideradas

| Alternativa | Ventajas | Inconvenientes | Motivo de descarte |
|---|---|---|---|
| Mover tarjetas manualmente | Sin scripts nuevos | Olvidos recurrentes; el problema ya se había producido en S01–S03 | No garantiza consistencia |
| Bloquear `pre-pr-gate.sh` sin auto-mover | Fuerza intervención manual | Añade fricción repetitiva al abrir cada PR | La sincronización automática con el PAT del desarrollador da el mismo rigor sin fricción |
| Guardar un PAT personal en GitHub Secrets para CI | Permitiría mover ProjectV2 desde Actions | Contraviene `AGENTS.md` §7 y `ADR-010` (cero PATs personales en Secrets) | Descartado por seguridad |

## Consecuencias

- Positivas: la columna `En progreso` (`In Progress`) refleja trabajo real desde el primer push de cada PBI; tanto la vista `Estado Scrum` como la vista nativa `Status` son coherentes para el equipo y el profesorado.
- Negativas o deuda asumida: requiere que cada desarrollador tenga configurado su PAT en `user_data/security/gh_token.txt` con permiso `project` (ya obligatorio por `ADR-010`).
- Impacto en pruebas: sin impacto sobre la suite de producto; verificable con `--dry-run` y `--reconcile-status`.

## Referencias

- [ADR-010 — Puerta estática `pre-pr-gate.sh` y sincronización del Tablón](ADR-010-puerta-pre-pr-sincronizacion-tablon.md)
- `scripts/github/sync-board-status.cjs`, `scripts/github/pre-pr-gate.sh`, `scripts/github/sync-pr-issues.sh`
