# Tareas TDD — PBI-002 Definir tokens de diseño, tema claro/oscuro y accesibilidad base

> Desglose de tareas TDD atómicas. Cada ciclo avanza estrictamente de **rojo → verde → refactor**.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-002` |
| Spec | `specs/PBI-002-tokens-accesibilidad/spec.md` |
| Plan | `specs/PBI-002-tokens-accesibilidad/plan.md` |
| Responsable | Fernando Ruescas (`@Fernis23228`, Dev C) |
| Estado | Implementado — Suite 100% verde (31 tests) |

---

## 0. Preparación

- [x] Leer la spec y confirmar criterios de aceptación CA-01 a CA-05.
- [x] Confirmar rama de trabajo `feature/PBI-002-tokens-accesibilidad`.
- [x] Redactar `spec.md`, `plan.md` y `tasks.md`.
- [x] **Puerta de calidad:** Obtener aprobación humana y realizar commit `docs(spec)` (`2f5f630`).
- [x] Instalar dependencias del proyecto (`npm install`).

---

## 1. Lista de tests prioritarios

- [x] `[PBI-002][CA-01] tokens-contraste-aa`: Verifica que los pares de color semánticos en tema claro y oscuro cumplen ratio ≥ 4.5:1 (texto) y ≥ 3:1 (controles).
- [x] `[PBI-002][CA-02] sin-color-exclusivo`: Verifica que los archivos CSS de componentes consumen variables CSS semánticas y no valores `#hex`/`rgb` literales.
- [x] `[PBI-002][RF-03] theme-persists-in-localstorage`: Comprueba que la selección de tema persiste en `localStorage` y se recupera correctamente.
- [x] `[PBI-002][RF-04] theme-detects-system-preference`: Comprueba que en ausencia de preferencia previa, se adopta `prefers-color-scheme`.
- [x] `[PBI-002][CA-03] tema-persistente`: Integración del hook `useTheme` que conmuta el atributo `data-theme` en el DOM.
- [x] `[PBI-002][RF-05] theme-button-accessible-label`: Comprueba que el botón de tema tiene `aria-label` y `aria-pressed` según el estado actual.

---

## 2. Ciclos TDD

### Ciclo 1 — Tokens Semánticos y Verificación Algorítmica de Contraste (CA-01, CA-02)

- [x] **Rojo:** Crear `src/shared/lib/colorContrast.ts` y test `tests/unit/tokens/contrast.test.ts`. Verificar que el test falla porque los tokens no están definidos aún.
- [x] **Verde:** Crear `src/shared/styles/primitives.css` y `src/shared/styles/tokens.css`. Asegurar que los contrastes pasan las aserciones de WCAG 2.1 AA.
- [x] **Refactor:** Eliminar colores hardcodeados (`#dbeafe` en `home.css`) e importar tokens en `global.css`.

### Ciclo 2 — Dominio y Servicio de Persistencia de Tema (RF-02, RF-03, RF-04, CA-04)

- [x] **Rojo:** Crear test unitario `tests/unit/theme/themeService.test.ts` evaluando inicialización, conmutación y persistencia.
- [x] **Verde:** Implementar `src/features/theme/domain/Theme.ts`, `ThemeRepository.ts`, `LocalStorageThemeRepository.ts` y `ThemeService.ts`.
- [x] **Refactor:** Proteger el acceso a `localStorage` ante bloqueos de cookies o navegación privada.

### Ciclo 3 — Hook React e Integración en la Interfaz (RF-05, CA-03, CA-05)

- [x] **Rojo:** Crear test de componente `tests/unit/theme/useTheme.test.tsx` evaluando la interacción del botón «Cambiar tema».
- [x] **Verde:** Implementar `src/shared/hooks/useTheme.ts` y conectar el botón en `src/features/home/presentation/HomePage.tsx`.
- [x] **Refactor:** Asegurar compatibilidad con Rollup en `npm run build` mediante imports relativos.

---

## 3. Checklist de Calidad Transversal y Accesibilidad

- [x] Contraste verificado ≥ 4.5:1 en texto y ≥ 3:1 en interactivos (validado matemáticamente en test).
- [x] Foco visible por teclado en el botón de tema (outline ≥ 3px con contraste accesible).
- [x] `data-theme` aplicado en `<html>` sin parpadeo.
- [x] Sin variables o colores quemados en componentes.
- [x] No hay secretos ni datos sensibles en `localStorage`.

---

## 4. Cierre y Definition of Done (DoD)

- [x] Todos los Criterios de Aceptación (CA-01 a CA-05) cubiertos y en verde.
- [x] Matriz spec-test actualizada.
- [x] `npm run lint` y `npm run typecheck` finalizan sin errores.
- [x] `npm run build` compila con éxito.
- [ ] Merge previo de `develop` completado sin conflictos.
- [ ] Pull Request abierto hacia `develop` para revisión por pares (`CODEOWNERS`).
