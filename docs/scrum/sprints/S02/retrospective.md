# Sprint Retrospective — S02 (Identidad, Contratos Mock y Dashboard CMS)

> Se inspecciona el proceso, no a las personas.

## Identificación

| Campo | Valor |
|---|---|
| Sprint | S02 |
| Fecha | 2026-11-25 |
| Facilitador | Fernando Ruescas (`@Fernis23228`) — Scrum Master S02 |
| Participantes | Francisco Tomás (`@FSolaje`), Jesús Hernández (`@Tarrant15`), Fernando Ruescas (`@Fernis23228`) |

## Revisión de acciones anteriores

| Acción previa | Responsable | Estado | Comentario |
|---|---|---|---|
| Definir contratos en `domain/ports/` antes de implementar UI | Equipo completo | Hecha | Permitió trabajar en paralelo con stubs y mock persistente |
| Armonizar scripts de gobernanza en Windows y Linux | `@FSolaje` | Hecha | Scripts Node.js en `scripts/github/` funcionando en ambos entornos |

## Qué ha funcionado

- La arquitectura de puertos y adaptadores (`AuthApiPort`, `SitesApiPort`, `ModulesApiPort`) desbloqueó el trabajo paralelo de los 3 workstreams sin bloqueos mutuos.
- El ciclo TDD estricto (specs → tests rojos → implementación → refactor) mantuvo la suite en verde en cada PR (`#56`, `#58`, `#59`).
- Los scripts en Node.js (`scripts/github/*.cjs`) evitaron problemas con `bash` en Windows.

## Qué no ha funcionado

- Algunos documentos de seguimiento (`sprint-backlog.md` de S02 y `PROXIMOS_PASOS.md`) quedaron desactualizados respecto al estado real de las PRs tras el merge.
- En Windows, los scripts `.sh` presentan fricciones si el `bash` del `PATH` no es el de Git for Windows.
- Los tests que requerían sesión activa en `LocalStorageMockApiAdapter` necesitaron un paso explícito de `login` en `beforeEach` al no venir documentado un helper común de fixture autenticada.

## Qué hemos aprendido

- Centralizar helpers de autenticación para tests de UI sobre `LocalStorageMockApiAdapter` ahorra tiempo y evita errores `401` repetitivos.
- Verificar los contratos de `domain/ports/` al inicio del Sprint evita retrabajos cuando el UI y el mock se integran.

## Acciones de mejora

| # | Acción | Responsable | Fecha límite | Seguimiento |
|---|---|---|---|---|
| 1 | Actualizar `sprint-backlog.md` y `product-backlog.md` inmediatamente tras el merge de cada PR | Scrum Master S03 (`@FSolaje`) | 2026-12-12 | Pendiente |
| 2 | Ampliar los contratos de `domain/ports/` (`ModulesApiPort`, `SitesApiPort`) en el Día 1 de S03 antes de iniciar PBI-007 y PBI-008 | Equipo completo | 2026-12-01 | Pendiente |
| 3 | Crear helper compartido de sesión mock autenticada para tests de integración/componentes | Dev A (`@FSolaje`) | 2026-12-03 | Pendiente |

## Calidad y pruebas

- Tests frágiles, lentos o duplicados: ninguno detectado en la suite de 20 archivos / 107 tests.
- Huecos de cobertura de criterios: 0 % en PBI-003, PBI-005 y PBI-006; pendiente ampliar tests E2E de flujo completo en S03.
- Deuda técnica identificada: `DashboardPage` y `SitesView` tienen callbacks preparados (`onEditSite`, `onInstallModule`) que aún no navegan ni abren flujos reales — se resolverán en S03 con `PBI-007` y `PBI-008`.

## Acuerdos del equipo

- En S03, ninguna tarea de código comienza sin `specs/PBI-###/spec.md`, `plan.md` y `tasks.md` aprobados por el PO (`@Fernis23228`).
- Todo cambio de contrato en `src/domain/ports/` se acuerda el Día 1 del Sprint para evitar desincronizaciones entre PBI-007 y PBI-008.
