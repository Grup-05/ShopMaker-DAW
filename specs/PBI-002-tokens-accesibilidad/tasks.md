# Tareas TDD — PBI-002 Definir tokens de diseño, tema claro/oscuro y accesibilidad base

> Desglose de tareas TDD atómicas. Cada ciclo avanza estrictamente de **rojo → verde → refactor**.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-002` |
| Spec | `specs/PBI-002-tokens-accesibilidad/spec.md` |
| Plan | `specs/PBI-002-tokens-accesibilidad/plan.md` |
| Responsable | Fernando Ruescas (`@Fernis23228`, Dev C) |
| Estado | En progreso — Fase de especificación SDD completada |

---

## 0. Preparación

- [x] Leer la spec y confirmar criterios de aceptación CA-01 a CA-05.
- [x] Confirmar rama de trabajo `feature/PBI-002-tokens-accesibilidad`.
- [x] Redactar `spec.md`, `plan.md` y `tasks.md`.
- [ ] **Puerta de calidad:** Obtener aprobación humana y realizar commit `docs(spec)`.
- [ ] Instalar dependencias del proyecto (`npm install`).

---

## 1. Lista de tests prioritarios

- [ ] `[PBI-002][CA-01] tokens-contraste-aa`: Verifica que los pares de color semánticos en tema claro y oscuro cumplen ratio ≥ 4.5:1 (texto) y ≥ 3:1 (controles).
- [ ] `[PBI-002][CA-02] sin-color-exclusivo`: Verifica que los archivos CSS de componentes consumen variables CSS semánticas y no valores `#hex`/`rgb` literales.
- [ ] `[PBI-002][RF-03] theme-persists-in-localstorage`: Comprueba que la selección de tema persiste en `localStorage` y se recupera correctamente.
- [ ] `[PBI-002][RF-04] theme-detects-system-preference`: Comprueba que en ausencia de preferencia previa, se adopta `prefers-color-scheme`.
- [ ] `[PBI-002][CA-03] tema-persistente`: Integración del hook `useTheme` que conmuta el atributo `data-theme` en el DOM.
- [ ] `[PBI-002][RF-05] theme-button-accessible-label`: Comprueba que el botón de tema tiene `aria-label` descriptivo según el estado actual.

---

## 2. Ciclos TDD

### Ciclo 1 — Tokens Semánticos y Verificación Algorítmica de Contraste (CA-01, CA-02)

- [ ] **Rojo:** Crear `src/shared/lib/colorContrast.ts` y test `tests/unit/tokens/contrast.test.ts`. Verificar que el test falla porque los tokens no están definidos aún.
- [ ] **Verde:** Crear `src/shared/styles/primitives.css` y `src/shared/styles/tokens.css`. Asegurar que los contrastes pasan las aserciones de WCAG 2.1 AA.
- [ ] **Refactor:** Limpiar valores duplicados y asegurar que `src/shared/styles/global.css` importa los tokens semánticos.
- [ ] **Commit:** 
  - `test(tokens): añadir pruebas de ratio de contraste WCAG AA`
  - `feat(tokens): implementar paleta de tokens primitivos y semánticos`

### Ciclo 2 — Dominio y Servicio de Persistencia de Tema (RF-02, RF-03, RF-04, CA-04)

- [ ] **Rojo:** Crear test unitario `tests/unit/theme/themeService.test.ts` evaluando inicialización, conmutación y persistencia.
- [ ] **Verde:** Implementar `src/features/theme/domain/Theme.ts`, `ThemeRepository.ts`, `LocalStorageThemeRepository.ts` y `ThemeService.ts`.
- [ ] **Refactor:** Proteger el acceso a `localStorage` ante bloqueos de cookies o navegación privada.
- [ ] **Commit:**
  - `test(theme): añadir pruebas para ThemeService y persistencia`
  - `feat(theme): implementar servicio de tema y repositorio localstorage`

### Ciclo 3 — Hook React e Integración en la Interfaz (RF-05, CA-03, CA-05)

- [ ] **Rojo:** Crear test de componente `tests/unit/theme/useTheme.test.tsx` evaluando la interacción del botón «Cambiar tema».
- [ ] **Verde:** Implementar `src/shared/hooks/useTheme.ts` y conectar el botón en `src/features/home/presentation/HomePage.tsx`.
- [ ] **Refactor:** Comprobar navegación por teclado (`Tab`) y foco visible de 3px.
- [ ] **Commit:**
  - `test(theme): añadir pruebas de integración para el botón de cambio de tema`
  - `feat(theme): conectar conmutador de tema accesible en la barra de navegación`

---

## 3. Checklist de Calidad Transversal y Accesibilidad

- [ ] Contraste verificado ≥ 4.5:1 en texto y ≥ 3:1 en interactivos.
- [ ] Foco visible por teclado en el botón de tema (outline ≥ 3px).
- [ ] `data-theme` aplicado en `<html>` sin parpadeo.
- [ ] Sin variables o colores quemados en componentes.
- [ ] No hay secretos ni datos sensibles en `localStorage`.

---

## 4. Cierre y Definition of Done (DoD)

- [ ] Todos los Criterios de Aceptación (CA-01 a CA-05) cubiertos y en verde.
- [ ] Matriz spec-test actualizada.
- [ ] `npm run lint` y `npm run typecheck` finalizan sin errores.
- [ ] Hook local de SAST limpio (`pre-commit`).
- [ ] Merge previo de `develop` completado sin conflictos.
- [ ] Pull Request abierto hacia `develop` para revisión por pares (`CODEOWNERS`).
