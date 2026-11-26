# ADR-005 — Puertos hexagonales de API y adaptador mock persistente

## Metadatos

| Campo | Valor |
|---|---|
| ID | `ADR-005` |
| Fecha | 2026-11-23 |
| Estado | Aceptado |
| Sprint / PBI | S02 · `PBI-003` (`#4`) |
| Decisores | Equipo Grup-05 (`@FSolaje` como autor del plan) |
| Registro | Retroactivo (2026-11-26), reconstruido desde `specs/PBI-003-contrato-api-mock/plan.md` |
| Sustituye a | — |
| Sustituido por | — |

## Contexto

Este repositorio contiene solo el frontend; el backend no existe todavía. Tres desarrolladores debían trabajar en paralelo (auth, dashboard, catálogo) sin bloquearse y con pruebas deterministas.

## Decisión

1. Los contratos viven en `src/domain/ports/` (`AuthApiPort`, `SitesApiPort`, `ModulesApiPort`) junto con el error normalizado `ApiError` (`400`, `401`, `404`, `409`, `500`). Es la ruta canónica única para todas las features.
2. El adaptador `LocalStorageMockApiAdapter` (`src/infrastructure/api/mock/`) implementa los tres puertos con persistencia en `localStorage` (clave `shopmaker.mock.state.v1`), latencia configurable (200–500 ms por defecto, 0 en tests) y errores HTTP simulados.
3. La abstracción `StorageLike` permite `localStorage` en navegador y `InMemoryStorage` en pruebas.
4. Presentación e infraestructura no se importan entre sí; el adaptador se inyecta desde la composición (`App.tsx`) o los tests.
5. Los cambios de contrato se acuerdan el Día 1 del Sprint (acuerdo de la retrospectiva de S02).

## Alternativas consideradas

| Alternativa | Ventajas | Inconvenientes | Motivo de descarte |
|---|---|---|---|
| Puertos duplicados por feature | Autonomía | Divergencia de contratos | Ruta canónica única |
| `fetch` directo en componentes | Rápido | Viola `profile-uiux.md` §2.5 | Imposible de probar sin red |
| IndexedDB | Más capacidad | Asíncrono y más complejo | `localStorage` cubre el volumen del mock |

## Consecuencias

- Positivas: trabajo paralelo sin bloqueos; sustituir el mock por el backend real solo exige un nuevo adaptador.
- Negativas o deuda asumida: el mock guarda contraseñas ficticias en claro (solo desarrollo/demo); la sesión persiste en `localStorage`.
- Impacto en pruebas: `tests/unit/api/*` (contrato, persistencia, red simulada).
- Impacto en accesibilidad y seguridad: sin secretos en cliente; datos de prueba ficticios.

## Referencias

- `specs/PBI-003-contrato-api-mock/` · Issues `#4`, `#38`–`#43` · PR `#56`
- Retrospectiva S02 (`docs/scrum/sprints/S02/retrospective.md`)
