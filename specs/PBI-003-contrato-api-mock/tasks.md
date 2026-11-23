# Tareas TDD — PBI-003 Definir el contrato de API y el adaptador mock persistente

> Desglose de tareas de `PBI-003` (`#4`) alineado con los issues `#38`–`#43` del Sprint Backlog `S02`.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-003` (`#4`) |
| Spec | `specs/PBI-003-contrato-api-mock/spec.md` |
| Plan | `specs/PBI-003-contrato-api-mock/plan.md` |
| Responsable | Francisco Tomás (`@FSolaje`, Dev A) |
| Estado | En progreso |

---

## 0. Tareas del Sprint Backlog (`#38`–`#43`)

| ID | Issue | Tarea | Tipo | Estimación | Depende de | Estado |
|---|---|---|---|---|---|---|
| `PBI-003-T01` | `#38` | Redactar spec, plan y matriz de contratos de API | Spec | 4 h | — | En progreso |
| `PBI-003-T02` | `#39` | Definir puertos e interfaces TypeScript de frontera | Spec | 4 h | `PBI-003-T01` | Pendiente |
| `PBI-003-T03` | `#40` | Test rojo: validación de contratos y DTOs de frontera | Test | 4 h | `PBI-003-T02` | Pendiente |
| `PBI-003-T04` | `#41` | Implementar adaptador mock con persistencia local | Código | 6 h | `PBI-003-T03` | Pendiente |
| `PBI-003-T05` | `#42` | Simular latencia de red y códigos de error HTTP | Código | 5 h | `PBI-003-T04` | Pendiente |
| `PBI-003-T06` | `#43` | Documentación del mock y fixtures iniciales de prueba | Docs | 3 h | `PBI-003-T05` | Pendiente |

---

## 1. Preparación (SDD)

- [x] Leer la spec y localizar los requerimientos `RF-01` a `RF-05` y criterios `CA-01` a `CA-04`.
- [x] Revisar la matriz spec-test del plan técnico.
- [x] Definir fixtures deterministas, claves de `localStorage` y entorno de pruebas sin red real.
- [x] Confirmar que la rama `feature/PBI-003-contrato-api-mock` está creada desde `develop`.
- [ ] Confirmar el commit `docs(spec): definir requerimientos, plan técnico, tareas y matriz de pruebas para PBI-003 contrato-api-mock`.

---

## 2. Lista de tests

- [ ] `[PBI-003][CA-04] api-contracts-validation` — Valida que los DTOs de `AuthApiPort`, `SitesApiPort` y `ModulesApiPort` contienen todos los campos obligatorios y tipos esperados sin exponer datos sensibles.
- [ ] `[PBI-003][CA-01] mock-implements-ports` — Verifica el flujo completo de `register`, `login`, `me`, `recoverPassword`, `logout`, `getUserSites`, `createSite`, `deleteSite`, `getCatalog` e `installModule`.
- [ ] `[PBI-003][CA-02] mock-local-persistence` — Verifica que los usuarios registrados, la sesión activa, los sitios creados y los módulos instalados se conservan en `localStorage` al crear una nueva instancia del adaptador y que el estado se recupera ante JSON corrupto.
- [ ] `[PBI-003][CA-03] mock-latency-simulation` — Verifica que el adaptador mock respeta el rango de latencia configurable (ej. 200–500 ms).
- [ ] `[PBI-003][CA-04] mock-error-simulation` — Verifica la generación determinista de errores `ApiError` con códigos HTTP `401` (credenciales inválidas / no autenticado), `404` (sitio o módulo inexistente), `409` (email o subdominio duplicado) y `500` (error de red simulado).

---

## 3. Ciclos TDD

### Ciclo 1 — Puertos, contratos DTO y persistencia local (`T02`, `T03`, `T04`)

- [ ] **Puertos (`T02` `#39`):** Crear `AuthApiPort.ts`, `SitesApiPort.ts`, `ModulesApiPort.ts`, `ApiError.ts` e `index.ts` en `src/domain/ports/`.
- [ ] **Rojo (`T03` `#40`):** Escribir las pruebas en `tests/unit/api/api-contracts.test.ts` y `tests/unit/api/mock-persistence.test.ts` y comprobar que fallan por ausencia del adaptador mock.
- [ ] **Verde (`T04` `#41`):** Implementar `storage.ts`, `mockFixtures.ts` y `LocalStorageMockApiAdapter.ts` en `src/infrastructure/api/mock/`.
- [ ] **Refactor:** Simplificar serialización y reutilizar `slugify` de `src/shared/lib/slugify.ts` para generar subdominios `*.shopmaker.local`.

### Ciclo 2 — Simulación de latencia y errores HTTP (`T05`)

- [ ] **Rojo (`T03`/`T05` `#42`):** Escribir las pruebas en `tests/unit/api/mock-network-simulation.test.ts` para latencia configurable (200–500 ms) y errores HTTP (`401`, `404`, `409`, `500`).
- [ ] **Verde (`T05` `#42`):** Implementar simulación de latencia asíncrona y disparadores deterministas de `ApiError` en `LocalStorageMockApiAdapter`.
- [ ] **Refactor:** Garantizar limpieza de flags de error simulado y actualizar la matriz spec-test a `Verde`.

### Ciclo 3 — Documentación, fixtures y cierre (`T06`)

- [ ] **Documentación (`T06` `#43`):** Documentar la guía de uso del adaptador mock, fixtures disponibles y contrato de errores en `README.md`, `CHANGELOG.md` y `specs/PBI-003-contrato-api-mock/evidence.md`.
- [ ] Actualizar estados en `plan.md` y `tasks.md`.

---

## 4. Calidad transversal y seguridad

- [ ] Sin llamadas de red reales (`fetch`/`XMLHttpRequest`).
- [ ] Sin importaciones de módulos de Node en `src/` (`client-boundary.test.ts` en verde).
- [ ] Sin secretos, tokens reales ni datos personales en `mockFixtures.ts`.
- [ ] Tipado estricto TypeScript (`npm run typecheck` sin errores) y linter limpio (`npm run lint`).

---

## 5. Cierre

- [ ] Suite completa en verde (`npm test`, `npm run typecheck`, `npm run lint`).
- [ ] Matriz spec-test al 100 % de CA cubiertos.
- [ ] Sin tests omitidos o debilitados.
- [ ] Revisión de código mediante PR hacia `develop`.

---

## 6. Evidencia

| Elemento | Enlace / resultado |
|---|---|
| Comando de pruebas | `npm test && npm run typecheck && npm run lint` |
| Resultado de la suite | Pendiente |
| PR | Pendiente |
| Commits | Pendiente |
| Notas de seguridad | Fixtures sin secretos reales; verificación SAST en `pre-commit` |
