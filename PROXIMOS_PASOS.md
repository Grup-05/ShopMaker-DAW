# 🧭 Seguimiento de Trabajo y Próximos Pasos (Live Tracking)

> **Proyecto:** ShopMaker-DAW  
> **Propósito:** Frontend del CMS ShopMaker para construcción de webs con módulos  
> **Marco:** Scrum + SDD + TDD · Gobernanza en `.agent/`

---

## 📡 Telemetría Git (Actualizada automáticamente por Pre-commit Hook)

- **Rama activa:** `feature/PBI-008-editor-webs-borradores`
- **Último commit consolidado:** `927e517 — *test(editor): anadir pruebas unitarias, de componente y autoguardado para PBI-008*`
- **Fecha de última sincronización:** 2026-11-26 22:26

---

## 📊 Estado Actual

### ✅ Gobernanza y control de versiones

- [x] Núcleo de gobernanza en `.agent/rules/AGENTS.md`.
- [x] Hooks de Git activados (`pre-commit` con SAST y telemetría, `pre-push`).
- [x] Reglas contextuales de Scrum y TDD en `.agent/rules/`.
- [x] Perfil frontend UI/UX adaptado al CMS ShopMaker.
- [x] `.gitattributes` para empaquetado limpio de releases.
- [x] Archivo local de seguridad en `user_data/security/forbidden_patterns.txt` (gitignored).
- [x] Verificación mandatoria y guiado interactivo de `user_data/security/` (`scripts/setup/init-user-security.sh`, `install-hooks.sh` y `pre-commit`).
- [x] Modelo de gobernanza flexible en tres capas (Núcleo inmutable, Contexto de PBI en `specs/`, Overrides privados gitignored en `user_data/governance/` y `.agent/local/`).
- [x] Onboarding diferenciado por perfiles sin fricción (Core Admin, Dev Estándar, Cliente/Evaluador y Fork PR).

### 🧱 Stack y formato de entrega

- [x] React + TypeScript + Vite como stack del frontend (ADR-001).
- [x] Aplicación web SPA desktop-first en navegador, sin shell nativo (ADR-002).
- [x] Lockfile versionado y dependencias auditadas (PBI-001). Exclusión retirada de `.gitignore` (confirmado en `f283524`); `package-lock.json` generado y commiteado en `944dce7`.
- [x] Arnés oficial de pruebas (Vitest + RTL + Playwright) adoptado desde PBI-004 para desbloquear T04–T06.

### 🏃 Sprint S01 — Sprint 0: Fundaciones

**Sprint Goal:** dejar preparado el núcleo fundacional verificable —aplicación web base, tokens semánticos con tema claro/oscuro y arnés de pruebas con hook local— para construir el primer PBI funcional con SDD y TDD.

**Fechas confirmadas:** 2026-11-03 → 2026-11-08 (4 días laborables) · **Capacidad comprometida:** 3 developers, 80 h planificadas en 17 tareas (64 h / 15 tareas pospuestas a S02).

**Reparto:** Dev B `@Tarrant15` (`PBI-001 T01–T06`, 30 h), Dev A `@FSolaje` (`PBI-004 T01–T05`, 25 h), Dev C `@Fernis23228` (`PBI-002 T01–T05` 21 h + `INFRA-01` 4 h = 25 h). `PBI-003` pasa a S02.

Artefactos:

- [x] `docs/scrum/team.md`
- [x] `docs/scrum/definition-of-ready.md`
- [x] `docs/scrum/definition-of-done.md`
- [x] `docs/scrum/product-backlog.md`
- [x] Plantillas Scrum en `docs/scrum/plantillas/`.
- [x] Sprint Goal, Sprint Backlog, Review y Retrospective de S01.
- [x] Plantillas SDD/TDD en `specs/`.
- [x] ADR template en `docs/decisiones/`.
- [x] Plantillas de GitHub Issues/PR (`.github/`) y scripts de automatización y autenticación segura (`scripts/github/`).
- [x] 17 labels, milestone `S01` e issues organizados para el Sprint S01 (`#2`, `#3`, `#5` PBIs; `#6`–`#21` tareas; `#22` INFRA-01).
- [x] Tarea de infraestructura `#22` (`INFRA-01`) creada y vinculada en el Project `#1` para protección de ramas, CODEOWNERS y roles dinámicos.
- [x] Tablero GitHub Projects v2 creado (`#1 — ShopMaker — S01`) con los 8 campos Scrum y todos los issues vinculados.
- [x] Gobernanza de token multiusuario en `user_data/security/gh_token.txt` (permisos `600`) validada mediante `scripts/github/gh-auth-env.sh`.
- [x] Asignación dinámica de roles en `docs/scrum/active_roles.env`, `.github/CODEOWNERS` y script `scripts/scrum/rotate-roles.sh`.
- [x] Bypass controlado para el Administrador de Gobernanza implementado en `.agent/hooks/pre-commit` y constitucionalizado en `AGENTS.md`.

PBIs del Sprint S01:

- [x] **PBI-001** (`#2`) — Aplicación web y estructura base (`T01–T06` `#6`–`#11`, 30 h — `@Tarrant15`). Completado e integrado en `develop` (PR `#26` y PR `#31`).
- [x] **PBI-002** (`#3`) — Tokens, tema claro/oscuro y accesibilidad base (`T01–T05` `#12`–`#16`, 21 h — `@Fernis23228`). Completado e integrado en `develop` (PR `#35`).
- [x] **PBI-004** (`#5`) — Arnés de pruebas y hook local de calidad (`T01–T05` `#17`–`#21`, 25 h — `@FSolaje`). Completado e integrado en `develop` (PR `#28`).
- [x] **INFRA-01** (`#22`) — Protección de ramas, CODEOWNERS y roles dinámicos (4 h — `@Fernis23228` / `@FSolaje`). Completado e integrado en `develop` y `main` (PR `#23`, `#25`, `#29`, `#30`).
- [x] *(Pospuesto a S02)* **PBI-003** (`#4`) — Contrato de API y adaptador mock (replanificado en S02).

### 🚀 Sprint S02 — Identidad, Contratos Mock y Dashboard CMS

**Sprint Goal:** Dotar a ShopMaker de un ciclo completo de identidad (registro, login y rutas protegidas), respaldado por un contrato de API con mock persistente, y desplegar el panel de administración (Dashboard) con gestión de sitios web y catálogo preliminar de módulos, avanzando hacia la experiencia de un CMS maduro.

**Fechas:** 2026-11-17 → 2026-11-28 · **Capacidad comprometida:** 3 developers, 80 h planificadas en 3 workstreams paralelos.  
**Roles activos S02:** PO: `@Tarrant15` · SM: `@Fernis23228` · Dev/CI: `@FSolaje` · Admin Gob: `@FSolaje`.

PBIs del Sprint S02:
- [x] **PBI-003** (`#4`) — Contrato de API y adaptador mock persistente (`T01–T06` `#38`–`#43`, 26 h — `@FSolaje`). Completado e integrado en `develop` (PR `#56`).
- [x] **PBI-005** (`#36`) — Registro, inicio de sesión y rutas protegidas (`T01–T06` `#44`–`#49`, 28 h — `@Tarrant15`, PO). Completado e integrado en `develop` (PR `#59`).
- [x] **PBI-006** (`#37`) — Dashboard de administración y catálogo preliminar de módulos (`T01–T06` `#50`–`#55`, 26 h — `@Fernis23228`, SM). Completado e integrado en `develop` (PR `#58`).
- [x] **Cierre S02:** `docs/scrum/sprints/S02/review.md` y `retrospective.md` registrados; Sprint S02 cerrado el 2026-11-25.

### 🧪 Pruebas

- [x] Runner y comando único de suite definidos: `npm test` y `npm run test:e2e`.
- [x] Test de humo de la aplicación web (`app-arranque`, `home-layout`, `minimum-viewport`).
- [x] Matriz spec-test actualizada en `specs/PBI-001-aplicacion-web/plan.md`, `specs/PBI-002-tokens-accesibilidad/plan.md`, `specs/PBI-003-contrato-api-mock/plan.md`, `specs/PBI-004-arnes-pruebas/plan.md`, `specs/PBI-005-registro-login-rutas/plan.md` y `specs/PBI-006-dashboard-catalogo/plan.md`.
- [x] Hook `.agent/hooks/pre-commit-local.sh` operativo e integrado en `develop` (PR `#28`).
- [x] Suite completa en verde en `develop` / `feature/PBI-008-editor-webs-borradores`: 26 archivos / 129 tests unitarios, de componente, contrato y arquitectura + 8 E2E.

### 📝 Documentación

- [x] `README.md` actualizado para el Sprint S03 y sincronizado con `main` (regla obligatoria de Kick-off de Sprint en `AGENTS.md`, `methodology-scrum.md`, `rotate-roles.sh` y `sync-governance.sh`).
- [x] `CHANGELOG.md` inicializado y actualizado con `PBI-001`, `PBI-002`, `PBI-003` y `PBI-004`.
- [x] `specs/PBI-001-aplicacion-web/`, `specs/PBI-002-tokens-accesibilidad/`, `specs/PBI-003-contrato-api-mock/` y `specs/PBI-004-arnes-pruebas/` redactadas e implementadas en `develop`.
- [x] Especificaciones base de Sprint S02 (`specs/PBI-005-registro-login-rutas/` y `specs/PBI-006-dashboard-catalogo/`) incorporadas en PR `#57`.
- [x] ADR-001 (React/TS/Vite) y ADR-002 (aplicación web) aceptados.
- [x] Sincronización automática de Issues y Tablón Scrum al fusionar PRs en `develop` (`.github/workflows/scrum-board-sync.yml` y `scripts/github/sync-pr-issues.sh`).
- [x] Armonización multiplataforma Windows/Linux para scripts de gestión en Node.js (`scripts/github/lib/gh-auth.cjs` cargando `user_data/security/gh_token.txt` y `.gitattributes` con `* text=auto eol=lf`).

---

## 🚀 Sprint S03 — Motor de Edición de Webs, Creación/Compra de Módulos y Previsualización Aislada

**Sprint Goal:** Dotar a ShopMaker de un motor de edición visual de páginas web por bloques con inspector de propiedades y autoguardado de borradores (`PBI-008`), un sistema de registro de nuevos módulos mediante manifiestos declarativos y compra/activación simulada por sitio (`PBI-007`), y un visor de previsualización aislada multi-dispositivo (`iframe sandbox`) con sanitización anti-XSS y publicación de sitios (`PBI-009`), entregando el flujo completo de construcción web al cliente.

**Fechas:** 2026-12-01 → 2026-12-12 · **Capacidad comprometida:** 3 developers, **82 h planificadas en 3 workstreams paralelos (21 issues `#61`–`#81`)**.  
**Roles activos S03:** PO: `@Fernis23228` · SM: `@FSolaje` · Dev: `@Tarrant15` · Admin Gob: `@FSolaje`.

PBIs del Sprint S03:
- [x] **PBI-008** (`#79`) — Motor de edición visual de webs por bloques, inspector de propiedades y autoguardado de borradores (`T01–T06` `#61`–`#66`, 30 h — `@FSolaje`, SM / Admin Gob). Implementado con SDD + TDD en `feature/PBI-008-editor-webs-borradores` (10 nuevos tests, suite 129/129 en verde).
- [ ] **PBI-007** (`#80`) — Creación de módulos mediante manifiestos para la tienda, ficha de detalle y compra/activación simulada por sitio (`T01–T06` `#67`–`#72`, 26 h — `@Tarrant15`).
- [x] **PBI-009** (`#81`) — Motor de renderizado sanitizado mobile-first, previsualización aislada multi-dispositivo (`iframe sandbox`) y publicación de web (`T01–T06` `#73`–`#78`, 26 h — `@Fernis23228`, PO). Completado e integrado en `develop` (PR `#82`).

**Artefactos S03 creados:**
- [x] `docs/scrum/sprints/S03/sprint-goal.md`
- [x] `docs/scrum/sprints/S03/sprint-backlog.md`
- [x] `docs/scrum/sprints/S03/review.md` (plantilla)
- [x] `docs/scrum/sprints/S03/retrospective.md` (plantilla)
- [x] `scripts/github/sprint-s03-pbis.json`, `scripts/github/sprint-s03-tasks.json` y `scripts/github/setup-s03-board-and-issues.cjs`
- [x] Milestone `S03` (`#3`), etiquetas `sprint:S03`, `pbi:007`, `pbi:008`, `pbi:009` y 21 issues (`#61`–`#81`) vinculadas al Tablón GitHub Projects v2 (`#1`).

---

## 🎯 Próximo Paso Inmediato (Sprint S03)

1. **Día 1 — Extensión de contratos (`src/domain/ports/` en `PBI-008-T01` `#61`):**
   - Ampliar `SitesApiPort` (`SiteBlockDto`, `SiteDraftDto`, lectura/guardado de bloques y publicación) y `ModulesApiPort` (`ModuleManifestDto`, registro de nuevos módulos y compra simulada por sitio).
2. **Especificación SDD (`No-Spec-No-Code`):**
   - `specs/PBI-008-editor-webs-borradores/` (`@FSolaje`, `#61`)
   - `specs/PBI-007-detalle-modulo-compra/` (`@Tarrant15`, `#67`)
   - `specs/PBI-009-previsualizacion-publicacion/` (`@Fernis23228`, `#73`)
3. **Creación de ramas de trabajo desde `develop`:**
   - `feature/PBI-008-editor-webs-borradores` (`@FSolaje`)
   - `feature/PBI-007-detalle-modulo-compra` (`@Tarrant15`)
   - `feature/PBI-009-previsualizacion-publicacion` (`@Fernis23228`)
4. **Desarrollo paralelo con TDD y validación estática previa a cada PR (`bash scripts/github/pre-pr-gate.sh --pre-pr`).**

---

## ⚠️ Bloqueos e impedimentos

| Fecha | Bloqueo | Responsable | Estado |
|---|---|---|---|
| 2026-11-03 | Decisión de stack: React + TypeScript + Vite (ADR-001) y aplicación web en navegador (ADR-002) | Developers + PO | Resuelto |
| 2026-11-03 | Ajuste de fechas (`3–8 nov`) y alcance (`76 h` / 16 tareas; `PBI-003` a S02) | PO + Developers | Resuelto (`b6766c8`) |
| 2026-11-03 | Creación de labels, milestone `S01`, 20 issues (`#2`–`#21`) y tablero GitHub Projects v2 (`#1`) | SM / Dev A | Resuelto |
| 2026-11-03 | `.agent/hooks/pre-commit-local.sh` bloqueado por inmutabilidad del núcleo | Dev C + SM | Resuelto en `main` (`f29cb46`, `b41ba5f`) y propagado a todas las ramas |
| 2026-11-03 | Lockfiles ignorados en `.gitignore` | Dev A | Resuelto (`f283524`) |
| 2026-11-09 | PBI-004 T03 (#19) sin arnés Playwright/servidor E2E publicado | Dev A (`@FSolaje`) | Resuelto: arnés oficial integrado en `develop` y adoptado por la rama de PBI-001 |
| 2026-11-09 | PBI-005 sin rutas de login/registro definidas | PBI-005 | Abierto; solo afecta a los destinos exactos de `navigation-destinations` (provisionales documentados) |
| 2026-11-09 | Revisión manual de zoom nativo al 200 % pendiente | Dev B (`@Tarrant15`) | Abierto; proxy de viewport ya verificado |

---

## 📌 Reglas de continuidad

- Al iniciar sesión: leer este archivo antes de cualquier acción.
- Al cerrar un hito: actualizar estado, pruebas y próximo paso.
- No ejecutar `git commit` ni `git push` sin aprobación humana explícita.
- El tablero Scrum es la fuente de verdad operativa; este archivo es un resumen.
