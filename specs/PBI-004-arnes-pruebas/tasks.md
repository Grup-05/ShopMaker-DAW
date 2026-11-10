# Tareas — PBI-004 Configurar el arnés de pruebas y el hook local de calidad

> Desglose de tareas técnicas, ciclo TDD y matriz de verificación para el arnés de pruebas del CMS ShopMaker.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-004` |
| Sprint | `S01` |
| Autor | Fran Tomás (`@FSolaje`, Dev A / PO) |
| Fecha | 2026-11-10 |
| Estado | Tareas desglosadas |
| Estimación Total S01 | 25 h (17 tareas totales del Sprint) |

---

## 1. Desglose de tareas del Sprint S01

### Tarea T01 — Redactar spec, plan y tasks del arnés de pruebas (Issue #17)
- [x] Crear el directorio de especificación `specs/PBI-004-arnes-pruebas/`.
- [x] Redactar `specs/PBI-004-arnes-pruebas/spec.md` con historias de usuario, requerimientos funcionales y no funcionales, y criterios de aceptación.
- [x] Redactar `specs/PBI-004-arnes-pruebas/plan.md` con decisiones técnicas, arquitectura por capas y matriz de trazabilidad spec-test.
- [x] Redactar `specs/PBI-004-arnes-pruebas/tasks.md` con el desglose atómico de tareas y el ciclo TDD.
- [x] Confirmar los documentos de especificación con el commit atómico `docs(spec): definir requerimientos, plan técnico, tareas y matriz de pruebas para PBI-004 arnes-pruebas` (`15f0000`).

**Estimación:** 6 h | **Responsable:** `@FSolaje` | **Estado:** Hecho

---

### Tarea T02 — Configurar Vitest, React Testing Library y scripts en `package.json` (Issue #18)
- [x] Instalar dependencias de desarrollo de testing: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`.
- [x] Crear y configurar `vitest.config.ts` especificando el entorno `jsdom`, alias de módulos y archivo de setup global.
- [x] Crear `tests/setup.ts` con la importación de `@testing-library/jest-dom` y configuración de limpieza de mocks tras cada test.
- [x] Configurar TypeScript (`tsconfig.json`) para reconocer los tipos de Vitest y Jest-DOM.
- [x] Configurar ESLint y scripts en `package.json`: `test`, `test:unit`, `test:watch`, `test:coverage`, `typecheck`, `lint`.
- [x] Crear generador de wrappers portables `scripts/setup/create-bin-wrappers.sh` para compatibilidad total con sistemas de archivos montados (NTFS/exFAT).
- [x] Verificar que `npm test`, `npm run typecheck` y `npm run lint` se ejecutan sin errores de configuración.

**Estimación:** 6 h | **Responsable:** `@FSolaje` | **Estado:** Hecho | **Depende de:** T01

---

### Tarea T03 — Configurar Playwright y el smoke test E2E (Issue #19)
- [x] Instalar dependencia de desarrollo `@playwright/test`.
- [x] Crear y configurar `playwright.config.ts`:
  - Configurar `webServer` para arrancar Vite localmente (`npm run dev` en puerto 5173).
  - Configurar proyectos para navegadores objetivo: Chromium y Firefox en modo headless.
  - Deshabilitar recolección de trazas o vídeos innecesarios para optimizar velocidad.
- [x] Crear prueba inicial de integración `tests/e2e/smoke.spec.ts` verificando que la página carga el título de la aplicación y landmarks accesibles.
- [x] Instalar navegadores Playwright en entorno local y verificar ejecución de suite E2E (`2 passed in 4.3s`).
- [x] Desbloquear la tarea `#9` de `@Tarrant15` para el smoke test de `PBI-001`.

**Estimación:** 6 h | **Responsable:** `@FSolaje` | **Estado:** Hecho | **Depende de:** T01, T02

---

### Tarea T04 — Añadir test de ejemplo demostrativo del ciclo TDD rojo → verde (Issue #20)
- [x] **Rojo:** Escribir una prueba unitaria `tests/unit/example.spec.ts` (`slugify`) y confirmar que **falla por la aserción esperada** (AssertionError: expected '' to be 'mi-primera-web').
- [x] Registrar la salida del fallo rojo para trazabilidad.
- [x] **Verde:** Implementar el código mínimo necesario en `src/shared/lib/slugify.ts` para satisfacer la prueba.
- [x] Comprobar que la prueba pasa a verde (`2 passed in 1.28s`).
- [x] **Refactor:** Normalización limpia con diacríticos Unicode y tipos estrictos de TypeScript.
- [x] Documentar el ciclo TDD en las evidencias de la tarea.

**Estimación:** 3 h | **Responsable:** `@FSolaje` | **Estado:** Hecho | **Depende de:** T02

---

### Tarea T05 — Crear el hook local y resolver la inmutabilidad (Issue #21)
- [x] Crear el script ejecutable `.agent/hooks/pre-commit-local.sh`:
  - Validar que ejecuta `npm run typecheck`, `npm run lint` y `npm run test:unit`.
  - Capturar errores y abortar con código `1` ante cualquier fallo.
  - Asignar permisos de ejecución (`chmod +x .agent/hooks/pre-commit-local.sh`).
- [x] Verificar que el hook universal `.agent/hooks/pre-commit` detecta e invoca correctamente `.agent/hooks/pre-commit-local.sh`.
- [x] Validar que `pre-commit-local.sh` es ignorado por la comprobación estricta de inmutabilidad del núcleo global (excepción explícita confirmada en `AGENTS.md` y `pre-commit`).
- [x] Probar el hook completo confirmando que valida SAST, telemetría y calidad local.

**Estimación:** 4 h | **Responsable:** `@FSolaje` | **Estado:** Hecho | **Depende de:** T02, T03

---

## 2. Tareas pospuestas a Sprint S02

- `PBI-004-T06` (Issue pendiente): Documentar el flujo de pruebas en `README.md` (3 h — `@Fernis23228`).
- `PBI-004-T07` (Issue pendiente): Revisión del arnés y optimización de tiempos de suite (< 60 s unitario, < 3 min E2E) (2 h — `@Fernis23228`).

---

## 3. Matriz de correspondencia CA → Tareas

| Criterio de Aceptación | Tarea Responsable | Evidencia Requerida |
|---|---|---|
| **CA-01** (Comando único de suite) | T02 | `npm test` ejecuta los tests y finaliza limpio. |
| **CA-02** (Aislamiento y sin red) | T02, T04 | Tests ejecutados desconectados de red; setup determinista. |
| **CA-03** (Arnés E2E Playwright) | T03 | `npm run test:e2e` ejecuta Chromium y Firefox con Vite webServer. |
| **CA-04** (Ejemplo TDD rojo → verde) | T04 | Salida de test fallando (rojo) y pasando tras implementar (verde). |
| **CA-05** (Hook local de pre-commit) | T05 | `.agent/hooks/pre-commit-local.sh` bloquea commits rotos. |
| **CA-06** (Documentación SDD) | T01 | Carpeta `specs/PBI-004-arnes-pruebas/` completa y aprobada. |

---

## 4. Definition of Done (DoD) de la fase de especificación (T01)

- [x] Criterios de aceptación verificables en formato Dado/Cuando/Entonces o listas claras.
- [x] Matriz de trazabilidad spec-test completa en `plan.md`.
- [x] Desglose atómico de tareas técnicas en `tasks.md`.
- [x] Identificación de dependencias y tiempos de ejecución (presupuesto de rendimiento).
- [x] Validación humana y confirmación del commit atómico (`15f0000`):
  ```text
  docs(spec): definir requerimientos, plan técnico, tareas y matriz de pruebas para PBI-004 arnes-pruebas
  ```
