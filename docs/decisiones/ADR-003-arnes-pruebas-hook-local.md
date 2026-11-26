# ADR-003 — Arnés de pruebas Vitest + Testing Library + Playwright y hook local de calidad

## Metadatos

| Campo | Valor |
|---|---|
| ID | `ADR-003` |
| Fecha | 2026-11-10 |
| Estado | Aceptado |
| Sprint / PBI | S01 · `PBI-004` (`#5`) |
| Decisores | Equipo Grup-05 (`@FSolaje` como autor del plan) |
| Registro | Retroactivo (2026-11-26), reconstruido desde `specs/PBI-004-arnes-pruebas/plan.md` y el historial Git |
| Sustituye a | — |
| Sustituido por | — |

## Contexto

La metodología exige TDD (rojo → verde → refactor) y suite en verde antes de cada PR. Hacía falta un arnés único, rápido y reproducible, y una puerta de calidad local que no rompiera la inmutabilidad del núcleo de gobernanza (`.agent/hooks/pre-commit`).

## Decisión

1. **Vitest + React Testing Library + jsdom** para pruebas unitarias, de componente, contrato y arquitectura (`npm test`).
2. **Playwright** (Chromium y Firefox, con `webServer` de Vite) para E2E (`npm run test:e2e`).
3. **TypeScript (`tsc --noEmit`) y ESLint** como calidad estática (`npm run typecheck`, `npm run lint`).
4. **Hook local `.agent/hooks/pre-commit-local.sh`**, invocado por el `pre-commit` universal, que ejecuta `typecheck`, `lint` y Vitest. Es una extensión local permitida por `AGENTS.md` §1.1 y puede evolucionar sin romper la paridad de `sync-governance.sh`.
5. Las consultas de RTL se hacen por rol, etiqueta o texto visible (accesibilidad), nunca por clases CSS.
6. En unidades montadas sin soporte de enlaces simbólicos (exFAT/NTFS) se instala con `npm install --no-bin-links` y envoltorios locales en `.agent/local/` (ignorado por Git).

## Alternativas consideradas

| Alternativa | Ventajas | Inconvenientes | Motivo de descarte |
|---|---|---|---|
| Jest | Ecosistema amplio | Configuración extra con ESM/Vite | Vitest comparte configuración con Vite y es más rápido |
| Cypress / Selenium | E2E conocidos | Más pesados; menor integración con `webServer` | Playwright arranca y cierra Vite de forma nativa |
| Suite completa dentro del hook universal | Un único hook | Rompería la inmutabilidad del núcleo | Se delega en `pre-commit-local.sh` |

## Consecuencias

- Positivas: comando único de suite, TDD verificable en cada commit, E2E reproducible.
- Negativas o deuda asumida: el hook ejecuta solo Vitest (no Playwright) para mantener el commit rápido; los E2E se lanzan manualmente o en revisión.
- Impacto en pruebas: define los niveles de prueba de todos los PBI posteriores.
- Impacto en accesibilidad y seguridad: las consultas por rol empujan a HTML semántico.

## Referencias

- `specs/PBI-004-arnes-pruebas/` · Issue `#5` · PR `#28`
- Commits `8cf780e`, `3f0dde2`, `f29cb46`
