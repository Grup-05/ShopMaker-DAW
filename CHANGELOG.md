# Registro de Cambios (CHANGELOG)

Todas las modificaciones notables de este proyecto quedarán documentadas en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto se adhiere a [Semantic Versioning (SemVer 2.0.0)](https://semver.org/lang/es/).

---

## [Unreleased]

### Added
- *Nuevas funcionalidades incorporadas (`feat`).*

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

---

## [v0.1.0-alpha.1] - 2026-11-02

### Added
- Inicialización del proyecto con el marco de la **Plantilla Universal de Gobernanza de IA**:
  - Constitución transversal del agente en `.agent/rules/AGENTS.md`.
  - Configuración automatizada de hooks Git con `core.hooksPath`.
  - Escáner de seguridad SAST y blindaje contra secretos en staging.
  - Telemetría automática y Live Tracking en `PROXIMOS_PASOS.md`.
