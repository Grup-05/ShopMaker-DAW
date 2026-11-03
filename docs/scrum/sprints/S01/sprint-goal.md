# Sprint Goal — S01 (Sprint 0: Fundaciones)

## Identificación

| Campo | Valor |
|---|---|
| Sprint | S01 — Sprint 0 de fundaciones |
| Fechas | 2026-11-03 → 2026-11-08 (confirmadas) |
| Duración | 6 días naturales / 4 días laborables efectivos (3–6 nov) |
| Scrum Master | Jesús Hernández (`@Tarrant15`) |
| Product Owner | Francisco Tomas (`@FSolaje`) |

## Sprint Goal

> Dejar preparado el núcleo fundacional verificable —aplicación web base, tokens semánticos con tema claro/oscuro y arnés de pruebas con hook local— para que el primer incremento funcional del CMS pueda construirse con SDD y TDD sin bloqueos técnicos.

> **Notas de alcance (2026-11-03):**
> 1. La entrega se ejecuta en navegador; se sustituye "shell de escritorio" por "aplicación web base" ([ADR-002](../../../decisiones/ADR-002-aplicacion-web.md)).
> 2. Al ajustarse el fin del Sprint al **8 de noviembre** (4 días laborables), se recorta el alcance al **núcleo fundacional (76 h / 16 tareas)**: `PBI-001` (`T01–T06`), `PBI-002` (`T01–T05`) y `PBI-004` (`T01–T05`). `PBI-003` (contrato de API y adaptador mock) y las tareas de endurecimiento/documentación (`PBI-001 T07–T08`, `PBI-002 T06–T08`, `PBI-004 T06–T07`) pasan al **Sprint S02**.

## Preguntas que responde el Planning

- **¿Qué?** Núcleo de `PBI-001`, `PBI-002` y `PBI-004` orientado a fundaciones técnicas, sistema de tokens y gobernanza de pruebas (`PBI-003` pospuesto a `S02`).
- **¿Cómo?** Decisiones de stack documentadas, scaffold Vite + React + TypeScript con estructura por capas, tokens semánticos con contraste AA y suite de pruebas (Vitest + RTL + Playwright) ejecutable con hook local.

## PBIs comprometidos

| PBI | Título | Estimación total | Alcance S01 | Responsable | Estado inicial |
|---|---|---|---|---|---|
| PBI-001 | Inicializar la aplicación web y la estructura base | 36 h | 30 h (`T01–T06`) | Dev A (`@FSolaje`) | En Sprint |
| PBI-002 | Definir tokens de diseño, tema claro/oscuro y accesibilidad base | 36 h | 21 h (`T01–T05`) | Dev B (`@Tarrant15`) | En Sprint |
| PBI-004 | Configurar el arnés de pruebas y el hook local de calidad | 30 h | 25 h (`T01–T05`) | Dev C (`@Fernis23228`) | En Sprint |
| PBI-003 | Definir el contrato de API y el adaptador mock | 38 h | 0 h (pasa a S02) | — | Product Backlog (S02) |

## Capacidad y riesgos

- Capacidad estimada: 3 developers × 4 días × 7–8 h = 84–96 h brutas; **76 h planificadas en 16 tareas** + margen de ceremonias y buffer.
- Reparto por workstream:
  - **Dev A (`@FSolaje`):** `PBI-001` (`T01–T06`, 30 h).
  - **Dev B (`@Tarrant15`):** `PBI-002` (`T01–T05`, 21 h).
  - **Dev C (`@Fernis23228`):** `PBI-004` (`T01–T05`, 25 h).
- Riesgo: que el layout desktop-first no se adapte al viewport mínimo → validación en 1024×720 y 1280×800.
- Riesgo: dependencia entre el smoke test E2E de `PBI-001-T04` y la configuración de Playwright en `PBI-004-T03` → coordinar el esqueleto inicial (*walking skeleton*) entre Dev A y Dev C.
- Deuda controlada para S02: primitivas de foco/zoom (`PBI-002 T06–T08`) y contrato de API con adaptador mock (`PBI-003`).

## Criterio de éxito

Al final del Sprint S01 debe ser posible:

1. Arrancar la aplicación web en el navegador objetivo (`1280×800` y `1024×720`).
2. Ver la pantalla base con landmarks semánticos, tokens de diseño con contraste AA y cambio de tema claro/oscuro.
3. Ejecutar la suite de pruebas (Vitest y Playwright) con un comando único y obtener verde.
4. Ejecutar el hook local `.agent/hooks/pre-commit-local.sh` desde el pre-commit universal sin romper la inmutabilidad del núcleo.
5. Demostrar el flujo TDD con al menos un test rojo convertido en verde.

> Este Sprint 0 no entrega funcionalidad de negocio completa, pero sí un entorno listo para el primer incremento funcional.
