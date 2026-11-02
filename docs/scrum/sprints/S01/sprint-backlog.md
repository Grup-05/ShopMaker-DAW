# Sprint Backlog — S01 (Sprint 0: Fundaciones)

## Sprint Goal

> Dejar preparado un entorno de desarrollo verificable —shell de escritorio, sistema visual accesible, contrato de API con mock y arnés de pruebas— para que el primer PBI funcional del CMS pueda construirse con SDD y TDD sin bloqueos técnicos.

## Tareas por PBI

### PBI-001 — Shell de escritorio y estructura base

| # | Tarea | Tipo | Responsable | Estimación | Estado |
|---|---|---|---|---|---|
| 1 | Completar `spec.md` del shell y la estructura | Spec | Developer | — | Pendiente |
| 2 | Completar `plan.md` y matriz spec-test | Spec | Developer | — | Pendiente |
| 3 | Completar `tasks.md` y lista de tests | Spec | Developer | — | Pendiente |
| 4 | Documentar la decisión de stack en ADR | Spec | Developer | — | Pendiente |
| 5 | Test rojo: la app arranca y muestra la ventana base | Test | Developer | — | Pendiente |
| 6 | Implementación verde del shell mínimo | Código | Developer | — | Pendiente |
| 7 | Refactor y revisión de aislamiento del renderer | Refactor | Developer | — | Pendiente |

### PBI-002 — Tokens, tema y accesibilidad base

| # | Tarea | Tipo | Responsable | Estimación | Estado |
|---|---|---|---|---|---|
| 1 | Completar spec, plan y tareas | Spec | Developer | — | Pendiente |
| 2 | Test rojo de tokens y contraste | Test | Developer | — | Pendiente |
| 3 | Implementar tokens semánticos y tema claro/oscuro | Código | Developer | — | Pendiente |
| 4 | Test rojo de foco visible y navegación por teclado | Test | Developer | — | Pendiente |
| 5 | Implementar foco y orden de tabulación | Código | Developer | — | Pendiente |
| 6 | Refactor y revisión de accesibilidad | Refactor | Developer | — | Pendiente |

### PBI-003 — Contrato de API y adaptador mock

| # | Tarea | Tipo | Responsable | Estimación | Estado |
|---|---|---|---|---|---|
| 1 | Completar spec y documentar el contrato | Spec | Developer | — | Pendiente |
| 2 | Test rojo del adaptador con respuestas simuladas | Test | Developer | — | Pendiente |
| 3 | Implementar el puerto y el adaptador mock | Código | Developer | — | Pendiente |
| 4 | Test rojo de estados carga, vacío, error y sin conexión | Test | Developer | — | Pendiente |
| 5 | Implementar normalización de errores | Código | Developer | — | Pendiente |
| 6 | Refactor y revisión de la frontera de red | Refactor | Developer | — | Pendiente |

### PBI-004 — Arnés de pruebas y hook local

| # | Tarea | Tipo | Responsable | Estimación | Estado |
|---|---|---|---|---|---|
| 1 | Completar spec, plan y tareas | Spec | Developer | — | Pendiente |
| 2 | Configurar el runner y el comando único de suite | Código | Developer | — | Pendiente |
| 3 | Test de ejemplo rojo → verde | Test | Developer | — | Pendiente |
| 4 | Crear `.agent/hooks/pre-commit-local.sh` | Código | Developer | — | Pendiente |
| 5 | Documentar el flujo de pruebas en `README.md` | Docs | Developer | — | Pendiente |

## Lista de tests del Sprint

| Test | PBI | RF / Criterio | Estado |
|---|---|---|---|
| `shell-arranque` | PBI-001 | RF-01 | Pendiente |
| `sin-acceso-a-node-en-renderer` | PBI-001 | RNF-01 | Pendiente |
| `tokens-contraste-aa` | PBI-002 | RF-01 | Pendiente |
| `foco-visible-teclado` | PBI-002 | RF-02 | Pendiente |
| `adaptador-mock-contrato` | PBI-003 | RF-01 | Pendiente |
| `estados-carga-vacio-error` | PBI-003 | RF-02 | Pendiente |
| `suite-ejecutable` | PBI-004 | RF-01 | Pendiente |

## Bloqueos e impedimentos

| Fecha | Descripción | Responsable de resolución | Estado |
|---|---|---|---|
| — | Decisión de stack pendiente (Electron, Tauri o web instalable) | Developers + PO | Abierto |

## Evidencia y seguimiento

- Commits: pendientes de aprobación humana.
- PR: pendientes.
- Demo: pendiente.
- Suite: pendiente de configurar.
