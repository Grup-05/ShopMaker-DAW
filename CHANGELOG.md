# Registro de Cambios (CHANGELOG)

Todas las modificaciones notables de este proyecto quedarán documentadas en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto se adhiere a [Semantic Versioning (SemVer 2.0.0)](https://semver.org/lang/es/).

---

## [Unreleased]

### Added
- Aplicación web base de PBI-001 con React + TypeScript + Vite: navegación, título «ShopMaker», aside de páginas, mensaje central, selección local accesible, controles futuros inertes y botón de tema (T04–T06).
- Arnés de pruebas consolidado sobre la configuración oficial de PBI-004 (`tests/setup.ts`, `tests/unit/`, `tests/e2e/`, alias `@`) con Vitest + React Testing Library + Playwright y servidor Vite.
- 17 tests contractuales de PBI-001 (3 E2E, 10 de componente, 2 de arquitectura y 2 revisiones manuales) y documentación de evidencia y accesibilidad.

### Fixed
- *Correcciones de errores o bugs solventados (`fix`).*

### Changed
- Adoptado **React + TypeScript + Vite** como stack del frontend ([ADR-001](docs/decisiones/ADR-001-react-typescript.md)).
- Definida la primera entrega como **aplicación web SPA en navegador**, desktop-first, sin shell nativo ([ADR-002](docs/decisiones/ADR-002-aplicacion-web.md)).

### Security
- *Mejoras de seguridad, políticas SAST o parches criptográficos.*

### Documentation
- Actualizados PBI-001, Sprint S01, `README.md` y `PROXIMOS_PASOS.md` para reflejar la entrega web.
- Añadidos los ADR-001 y ADR-002 al índice de decisiones.
- Completados T01–T03 de PBI-001: `spec.md`, `plan.md` y `tasks.md` con 17 tests, cuatro ciclos TDD, mapeo CA/RNF → test y plan de acometida de T04.
- Completados T04–T06 de PBI-001: ciclos rojo → verde registrados en `evidence.md` y revisión de accesibilidad en `accessibility-checklist.md`.
- Actualizados Sprint Backlog S01, `PROXIMOS_PASOS.md` y `README.md` con comandos y resultados reales de la suite.

---

## [v0.1.0-alpha.1] - 2026-11-02

### Added
- Inicialización del proyecto con el marco de la **Plantilla Universal de Gobernanza de IA**:
  - Constitución transversal del agente en `.agent/rules/AGENTS.md`.
  - Configuración automatizada de hooks Git con `core.hooksPath`.
  - Escáner de seguridad SAST y blindaje contra secretos en staging.
  - Telemetría automática y Live Tracking en `PROXIMOS_PASOS.md`.
