# 🧭 Seguimiento de Trabajo y Próximos Pasos (Live Tracking)

> **Proyecto:** ShopMaker-DAW  
> **Propósito:** Frontend del CMS ShopMaker para construcción de webs con módulos  
> **Marco:** Scrum + SDD + TDD · Gobernanza en `.agent/`

---

## 📡 Telemetría Git (Actualizada automáticamente por Pre-commit Hook)

- **Rama activa:** `feature/PBI-001-aplicacion-web`
- **Último commit consolidado:** `4336063 — *chore(governance): sincronizar nucleo de gobernanza desde main*`
- **Fecha de última sincronización:** 2026-11-04 08:40

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
- [ ] Lockfile versionado y dependencias auditadas (PBI-001). Exclusión retirada de `.gitignore` (confirmado en `f283524`); pendiente de generar lockfile con el scaffold.

### 🏃 Sprint S01 — Sprint 0: Fundaciones

**Sprint Goal:** dejar preparado el núcleo fundacional verificable —aplicación web base, tokens semánticos con tema claro/oscuro y arnés de pruebas con hook local— para construir el primer PBI funcional con SDD y TDD.

**Fechas confirmadas:** 2026-11-03 → 2026-11-08 (4 días laborables) · **Capacidad comprometida:** 3 developers, 76 h planificadas en 16 tareas (64 h / 15 tareas pospuestas a S02).

**Reparto:** Dev A `@FSolaje` (`PBI-001 T01–T06`, 30 h), Dev B `@Tarrant15` (`PBI-002 T01–T05`, 21 h), Dev C `@Fernis23228` (`PBI-004 T01–T05`, 25 h). `PBI-003` pasa a S02.

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
- [x] 17 labels, milestone `S01` y 20 issues creados en GitHub (`#2`–`#5` PBIs; `#6`–`#21` tareas asignadas a `@FSolaje`, `@Tarrant15` y `@Fernis23228`).
- [x] Tarea de infraestructura `#22` (`INFRA-01`) creada y vinculada en el Project `#1` para protección de ramas, CODEOWNERS y roles dinámicos.
- [x] Tablero GitHub Projects v2 creado (`#1 — ShopMaker — S01`) con los 8 campos Scrum y todos los issues vinculados.
- [x] Gobernanza de token multiusuario en `user_data/security/gh_token.txt` (permisos `600`) validada mediante `scripts/github/gh-auth-env.sh`.
- [x] Asignación dinámica de roles en `docs/scrum/active_roles.env`, `.github/CODEOWNERS` y script `scripts/scrum/rotate-roles.sh`.
- [x] Bypass controlado para el Administrador de Gobernanza implementado en `.agent/hooks/pre-commit` y constitucionalizado en `AGENTS.md`.

PBIs del Sprint S01:

- [ ] **PBI-001** (`#2`) — Aplicación web y estructura base (`T01–T06` `#6`–`#11`, 30 h — `@FSolaje`).
- [ ] **PBI-002** (`#3`) — Tokens, tema claro/oscuro y accesibilidad base (`T01–T05` `#12`–`#16`, 21 h — `@Tarrant15`).
- [ ] **PBI-004** (`#5`) — Arnés de pruebas y hook local de calidad (`T01–T05` `#17`–`#21`, 25 h — `@Fernis23228`).
- [ ] *(Pospuesto a S02)* **PBI-003** (`#4`) — Contrato de API y adaptador mock (38 h).

### 🧪 Pruebas

- [ ] Runner y comando único de suite definidos.
- [ ] Test de humo de la aplicación web.
- [ ] Matriz spec-test inicial completada.
- [ ] Hook `.agent/hooks/pre-commit-local.sh` operativo.

### 📝 Documentación

- [x] `README.md` con metodología, roles, ramas, commits y DoD.
- [x] `CHANGELOG.md` inicializado.
- [ ] Especificaciones `specs/PBI-001/`, `specs/PBI-002/` y `specs/PBI-004/` redactadas.
- [x] ADR-001 (React/TS/Vite) y ADR-002 (aplicación web) aceptados.

---

## 🎯 Próximo Paso Inmediato

1. **Reunión de equipo (04-nov):** Decidir si se activan las protecciones de rama de GitHub (`INFRA-01` / issue `#22`) con `bash scripts/github/protect-branches.sh` antes de comenzar a integrar los PBIs en `develop`.
2. **Iniciar el trabajo SDD/TDD del Sprint S01:**
   - Redactar `spec.md`, `plan.md` y `tasks.md` de `PBI-001` (`#6`–`#8`), `PBI-002` (`#12`–`#14`) y `PBI-004` (`#17`).
   - Aprobar las specs y confirmar `docs(spec): ...` (requiere orden humana).
   - Iniciar el ciclo TDD con el arnés de pruebas (`PBI-004`) y el primer test rojo de la aplicación web (`PBI-001`).

---

## ⚠️ Bloqueos e impedimentos

| Fecha | Bloqueo | Responsable | Estado |
|---|---|---|---|
| 2026-11-03 | Decisión de stack: React + TypeScript + Vite (ADR-001) y aplicación web en navegador (ADR-002) | Developers + PO | Resuelto |
| 2026-11-03 | Ajuste de fechas (`3–8 nov`) y alcance (`76 h` / 16 tareas; `PBI-003` a S02) | PO + Developers | Resuelto (`b6766c8`) |
| 2026-11-03 | Creación de labels, milestone `S01`, 20 issues (`#2`–`#21`) y tablero GitHub Projects v2 (`#1`) | SM / Dev A | Resuelto |
| 2026-11-03 | `.agent/hooks/pre-commit-local.sh` bloqueado por inmutabilidad del núcleo | Dev C + SM | Resuelto en `main` (`f29cb46`, `b41ba5f`) y propagado a todas las ramas |
| 2026-11-03 | Lockfiles ignorados en `.gitignore` | Dev A | Resuelto (`f283524`) |

---

## 📌 Reglas de continuidad

- Al iniciar sesión: leer este archivo antes de cualquier acción.
- Al cerrar un hito: actualizar estado, pruebas y próximo paso.
- No ejecutar `git commit` ni `git push` sin aprobación humana explícita.
- El tablero Scrum es la fuente de verdad operativa; este archivo es un resumen.
