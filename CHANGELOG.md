# Registro de Cambios (CHANGELOG)

Todas las modificaciones notables de este proyecto quedarán documentadas en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto se adhiere a [Semantic Versioning (SemVer 2.0.0)](https://semver.org/lang/es/).

---

## [Unreleased]

### Added
- Motor de edición visual de páginas web por bloques (`/editor/:siteId`) con paleta de bloques estructurales (`hero`, `text`, `features`, `footer`) y módulos instalados, operaciones inmutables en el lienzo (reordenación arriba/abajo, duplicación y eliminación con confirmación accesible), inspector lateral de propiedades en tiempo real y autoguardado persistente de borradores (`getSiteDraft`, `saveSiteDraft`, `getInstalledModules`, `registerModule`) con indicador `role="status"` (`aria-live="polite"`) e integración con previsualización aislada (`PBI-008` `#79`, `T01`–`T06` `#61`–`#66`).
- 10 nuevas pruebas unitarias, de componente e integración para el editor de webs en `tests/unit/editor/` (`editorBlocks.test.ts`, `EditorPage.test.tsx`, `editorAutosave.test.tsx`).
- Motor de renderizado sanitizado *mobile-first* (`htmlSanitizer.ts`, `siteRenderer.ts`), visor de previsualización aislada multi-dispositivo `<iframe sandbox="">` (`SitePreviewModal`, `360px` / `768px` / `1280px`) y flujo de publicación de sitios (`publishSite`) con12 pruebas automatizadas en `tests/unit/preview/` (`PBI-009` `#81`, `T01`–`T06` `#73`–`#78`, PR `#82`).
- Contrato de API en `src/domain/ports/` (`AuthApiPort`, `SitesApiPort`, `ModulesApiPort` y modelo normalizado `ApiError`) junto con el adaptador mock persistente `LocalStorageMockApiAdapter` en `src/infrastructure/api/mock/` con fixtures iniciales, latencia configurable (200–500 ms) y simulación determinista de errores HTTP (`400`, `401`, `404`, `409`, `500`) (PBI-003 T01–T06).
- 13 pruebas unitarias y de contrato para PBI-003 en `tests/unit/api/` (`api-contracts.test.ts`, `mock-persistence.test.ts`, `mock-network-simulation.test.ts`).
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
