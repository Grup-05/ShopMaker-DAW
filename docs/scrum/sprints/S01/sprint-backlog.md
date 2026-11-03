# Sprint Backlog — S01 (Sprint 0: Fundaciones)

## Sprint Goal

> Dejar preparado el núcleo fundacional verificable —aplicación web base, tokens semánticos con tema claro/oscuro y arnés de pruebas con hook local— para que el primer incremento funcional del CMS pueda construirse con SDD y TDD sin bloqueos técnicos.

## Identificación y capacidad

| Campo | Valor |
|---|---|
| Sprint | S01 — Sprint 0 de fundaciones |
| Inicio | 2026-11-03 |
| Fin | 2026-11-08 |
| Duración | 6 días naturales / 4 días laborables efectivos (3–6 nov) |
| Capacidad bruta | 3 developers × 4 días × 7–8 h = 84–96 h |
| Capacidad comprometida (S01) | **76 h en 16 tareas** + margen de ceremonias y buffer |
| Trabajo pospuesto a S02 | 64 h en 15 tareas (`PBI-003` completo + cierre/pulido de `PBI-001`, `PBI-002`, `PBI-004`) |
| Estimación | Horas (tareas de 2–8 h) |

### Reparto por workstream en S01

| Workstream | Responsable | Usuario GitHub | PBIs en S01 | Tareas S01 | Carga S01 |
|---|---|---|---|---|---|
| Aplicación web y estructura base | Dev A (Francisco Tomas) | `@FSolaje` | `PBI-001` (`T01–T06`) | 6 tareas | 30 h |
| Tokens, tema y contraste AA | Dev B (Jesús Hernández) | `@Tarrant15` | `PBI-002` (`T01–T05`) | 5 tareas | 21 h |
| Arnés de pruebas y hook local | Dev C (Fernando Ruescas) | `@Fernis23228` | `PBI-004` (`T01–T05`) | 5 tareas | 25 h |

> El tablero en GitHub Projects es la fuente de verdad operativa; la columna `Issue` se completa automáticamente al ejecutar `scripts/github/setup-sprint-board.sh`.

## Tareas comprometidas en el Sprint S01 (16 tareas · 76 h)

### PBI-001 — Aplicación web y estructura base (`#2` · `@FSolaje` · 30 h en S01)

| ID | Tarea | Tipo | Responsable | Estimación | Depende de | Sprint | Estado | Issue |
|---|---|---|---|---|---|---|---|---|
| T01 | Redactar la spec de la aplicación web | Spec | Dev A (`@FSolaje`) | 4 h | — | S01 | Pendiente | `#6` |
| T02 | Redactar el plan técnico y la matriz spec-test | Spec | Dev A (`@FSolaje`) | 4 h | T01 | S01 | Pendiente | `#7` |
| T03 | Redactar `tasks.md` y la lista de tests | Spec | Dev A (`@FSolaje`) | 2 h | T02 | S01 | Pendiente | `#8` |
| T04 | Test rojo: la aplicación arranca en el navegador | Test | Dev A (`@FSolaje`) | 4 h | T03, PBI-004-T03 | S01 | Pendiente | `#9` |
| T05 | Scaffold Vite + React + TypeScript y estructura por capas | Código | Dev A (`@FSolaje`) | 8 h | T04 | S01 | Pendiente | `#10` |
| T06 | Layout base con landmarks y navegación por teclado | Código | Dev A (`@FSolaje`) | 8 h | T05 | S01 | Pendiente | `#11` |

### PBI-002 — Tokens, tema y accesibilidad base (`#3` · `@Tarrant15` · 21 h en S01)

| ID | Tarea | Tipo | Responsable | Estimación | Depende de | Sprint | Estado | Issue |
|---|---|---|---|---|---|---|---|---|
| T01 | Redactar la spec de tokens, tema y accesibilidad | Spec | Dev B (`@Tarrant15`) | 4 h | — | S01 | Pendiente | `#12` |
| T02 | Redactar el plan técnico y la matriz spec-test | Spec | Dev B (`@Tarrant15`) | 3 h | T01 | S01 | Pendiente | `#13` |
| T03 | Redactar `tasks.md` y la lista de tests de accesibilidad | Spec | Dev B (`@Tarrant15`) | 2 h | T02 | S01 | Pendiente | `#14` |
| T04 | Test rojo: tokens semánticos y contraste AA | Test | Dev B (`@Tarrant15`) | 4 h | T03 | S01 | Pendiente | `#15` |
| T05 | Implementar tokens semánticos y tema claro/oscuro | Código | Dev B (`@Tarrant15`) | 8 h | T04 | S01 | Pendiente | `#16` |

### PBI-004 — Arnés de pruebas y hook local (`#5` · `@Fernis23228` · 25 h en S01)

| ID | Tarea | Tipo | Responsable | Estimación | Depende de | Sprint | Estado | Issue |
|---|---|---|---|---|---|---|---|---|
| T01 | Redactar spec, plan y tasks del arnés de pruebas | Spec | Dev C (`@Fernis23228`) | 6 h | — | S01 | Pendiente | `#17` |
| T02 | Configurar Vitest, React Testing Library y scripts | Código | Dev C (`@Fernis23228`) | 6 h | T01 | S01 | Pendiente | `#18` |
| T03 | Configurar Playwright y el smoke test E2E | Código | Dev C (`@Fernis23228`) | 6 h | T01 | S01 | Pendiente | `#19` |
| T04 | Añadir el test de ejemplo rojo → verde | Test | Dev C (`@Fernis23228`) | 3 h | T02 | S01 | Pendiente | `#20` |
| T05 | Crear el hook local y resolver la inmutabilidad | Código | Dev C (`@Fernis23228`) | 4 h | T02, T03 | S01 | Pendiente | `#21` |

---

## Tareas pospuestas al Sprint S02 (15 tareas · 64 h)

| Clave | PBI | Tarea | Tipo | Responsable previsto | Estimación | Estado |
|---|---|---|---|---|---|---|
| `PBI-001-T07` | PBI-001 | Documentar el fallback de SPA y el despliegue estático | Docs | Dev B (`@Tarrant15`) | 3 h | Pospuesta (S02) |
| `PBI-001-T08` | PBI-001 | Revisar el aislamiento del cliente y las dependencias | Refactor | Dev A (`@FSolaje`) | 3 h | Pospuesta (S02) |
| `PBI-002-T06` | PBI-002 | Test rojo: foco visible y orden de tabulación | Test | Dev B (`@Tarrant15`) | 4 h | Pospuesta (S02) |
| `PBI-002-T07` | PBI-002 | Implementar foco, primitivas y selector de tema | Código | Dev B (`@Tarrant15`) | 8 h | Pospuesta (S02) |
| `PBI-002-T08` | PBI-002 | Revisar accesibilidad, contraste y zoom al 200 % | Refactor | Dev B (`@Tarrant15`) | 3 h | Pospuesta (S02) |
| `PBI-003-T01` | PBI-003 | Redactar la spec y el contrato de API | Spec | Dev C (`@Fernis23228`) | 6 h | Pospuesta (S02) |
| `PBI-003-T02` | PBI-003 | Redactar el plan técnico y la matriz spec-test | Spec | Dev C (`@Fernis23228`) | 3 h | Pospuesta (S02) |
| `PBI-003-T03` | PBI-003 | Redactar `tasks.md` y la lista de tests de contrato | Spec | Dev C (`@Fernis23228`) | 2 h | Pospuesta (S02) |
| `PBI-003-T04` | PBI-003 | Test rojo: el adaptador mock cumple el contrato | Test | Dev C (`@Fernis23228`) | 4 h | Pospuesta (S02) |
| `PBI-003-T05` | PBI-003 | Implementar puerto, adaptador mock y fixtures | Código | Dev C (`@Fernis23228`) | 8 h | Pospuesta (S02) |
| `PBI-003-T06` | PBI-003 | Test rojo: carga, vacío, error, reintento y sin conexión | Test | Dev C (`@Fernis23228`) | 4 h | Pospuesta (S02) |
| `PBI-003-T07` | PBI-003 | Implementar normalización de errores y demo de estados | Código | Dev C (`@Fernis23228`) | 8 h | Pospuesta (S02) |
| `PBI-003-T08` | PBI-003 | Revisar la frontera de red y el contrato | Refactor | Dev C (`@Fernis23228`) | 3 h | Pospuesta (S02) |
| `PBI-004-T06` | PBI-004 | Documentar el flujo de pruebas en `README.md` | Docs | Dev C (`@Fernis23228`) | 3 h | Pospuesta (S02) |
| `PBI-004-T07` | PBI-004 | Revisar el arnés y reducir el tiempo de suite | Refactor | Dev C (`@Fernis23228`) | 2 h | Pospuesta (S02) |

---

## Lista de tests del Sprint S01

| Test | PBI | RF / Criterio | Estado |
|---|---|---|---|
| `[PBI-001][CA-01] app-arranque` | PBI-001 | CA-01 | Pendiente |
| `[PBI-001][CA-01] layout-base` | PBI-001 | CA-01 | Pendiente |
| `[PBI-001][RNF-03] sin-acceso-a-node` | PBI-001 | RNF-03 | Pendiente |
| `[PBI-001][CA-04] navegacion-teclado` | PBI-001 | CA-04 | Pendiente |
| `[PBI-002][CA-01] tokens-contraste-aa` | PBI-002 | CA-01 | Pendiente |
| `[PBI-002][CA-02] sin-color-exclusivo` | PBI-002 | CA-02 | Pendiente |
| `[PBI-002][CA-03] tema-persistente` | PBI-002 | CA-03 | Pendiente |
| `[PBI-004][CA-01] suite-ejecutable` | PBI-004 | CA-01 | Pendiente |
| `[PBI-004][CA-02] sin-red-real` | PBI-004 | CA-02 | Pendiente |
| `[PBI-004][CA-03] e2e-arranque` | PBI-004 | CA-03 | Pendiente |
| `[PBI-004][CA-04] ejemplo-rojo-verde` | PBI-004 | CA-04 | Pendiente |
| `[PBI-004][CA-05] hook-local` | PBI-004 | CA-05 | Pendiente |

## Bloqueos e impedimentos

| Fecha | Descripción | Responsable de resolución | Estado |
|---|---|---|---|
| 2026-11-03 | Decisión de stack: React + TypeScript + Vite (ADR-001) y aplicación web en navegador (ADR-002) | Developers + PO | Resuelto |
| 2026-11-03 | Ajuste de capacidad al terminar S01 el 2026-11-08 (recorte a 76 h / 16 tareas; PBI-003 pasa a S02) | PO + Developers | Resuelto |
| 2026-11-03 | Lockfiles ignorados en `.gitignore`; impide builds reproducibles | Dev A (`@FSolaje`) | Resuelto (`f283524`) |
| 2026-11-03 | `.agent/hooks/pre-commit-local.sh` bloqueado por la inmutabilidad del núcleo | Dev C + SM | Resuelto en `main` (`f29cb46`, `b41ba5f`) y sincronizado |
| 2026-11-03 | `gh` sin autenticar y tablero de GitHub Projects sin crear | SM / Dev A | Resuelto (Project `#1` y 20 issues `#2`–`#21` vinculados) |

## Evidencia y seguimiento

- Commits: gobernanza y planificación de `S01` confirmadas.
- PR: pendientes.
- Demo: pendiente.
- Suite: pendiente de configurar.
- Tablero: creado en GitHub Projects v2 (`#1 — ShopMaker — S01`) con 4 PBIs (`#2`–`#5`) y 16 tareas (`#6`–`#21`) vinculadas.
