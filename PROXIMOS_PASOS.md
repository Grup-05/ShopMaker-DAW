# 🧭 Seguimiento de Trabajo y Próximos Pasos (Live Tracking)

> **Proyecto:** ShopMaker-DAW  
> **Propósito:** Frontend del CMS ShopMaker para construcción de webs con módulos  
> **Marco:** Scrum + SDD + TDD · Gobernanza en `.agent/`

---

## 📡 Telemetría Git (Actualizada automáticamente por Pre-commit Hook)

- **Rama activa:** `feature/PBI-001-aplicacion-web`
- **Último commit consolidado:** `23dd16a — *chore(scrum): añadir plantillas de GitHub y script de automatización del tablero*`
- **Fecha de última sincronización:** 2026-11-03 21:54

---

## 📊 Estado Actual

### ✅ Gobernanza y control de versiones

- [x] Núcleo de gobernanza en `.agent/rules/AGENTS.md`.
- [x] Hooks de Git activados (`pre-commit` con SAST y telemetría, `pre-push`).
- [x] Reglas contextuales de Scrum y TDD en `.agent/rules/`.
- [x] Perfil frontend UI/UX adaptado al CMS ShopMaker.
- [x] `.gitattributes` para empaquetado limpio de releases.
- [x] Archivo local de seguridad en `user_data/security/forbidden_patterns.txt` (gitignored).

### 🧱 Stack y formato de entrega

- [x] React + TypeScript + Vite como stack del frontend (ADR-001).
- [x] Aplicación web SPA desktop-first en navegador, sin shell nativo (ADR-002).
- [ ] Lockfile versionado y dependencias auditadas (PBI-001). Exclusión retirada de `.gitignore`; pendiente de commit.

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
- [x] Plantillas de GitHub Issues/PR (`.github/`) y script de automatización (`scripts/github/`).

PBIs del Sprint S01:

- [ ] **PBI-001** — Aplicación web y estructura base (`T01–T06`, 30 h — `@FSolaje`).
- [ ] **PBI-002** — Tokens, tema claro/oscuro y accesibilidad base (`T01–T05`, 21 h — `@Tarrant15`).
- [ ] **PBI-004** — Arnés de pruebas y hook local de calidad (`T01–T05`, 25 h — `@Fernis23228`).
- [ ] *(Pospuesto a S02)* **PBI-003** — Contrato de API y adaptador mock (38 h).
- [ ] Tablero GitHub Projects con 4 PBIs (3 en Sprint Backlog, 1 en Product Backlog) y 16 tareas de S01, labels, milestone y asignaciones.
- [ ] GitHub CLI (`gh`) autenticado con scopes `repo`, `project` y `read:org`.

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

## 🎯 Próximo Paso Inmediato (Al reanudar la próxima sesión)

1. **Aprobar y ejecutar la secuencia de commits atómicos ya validada:**
   - En `feature/PBI-001-aplicacion-web`:
     1. `chore(ignore): permitir versionado de lockfiles para builds reproducibles` (`.gitignore`)
     2. `chore(scrum): añadir plantillas de GitHub y script de automatización del tablero` (`.github/`, `scripts/github/`)
     3. `docs(scrum): ajustar alcance, fechas y reparto del Sprint S01` (`docs/scrum/`, `PROXIMOS_PASOS.md`)
   - En `main` (el parche listo está guardado en `user_data/governance-main.patch`):
     4. Cambiar a `main` (`git switch main`), aplicar `git apply user_data/governance-main.patch`, confirmar `chore(governance): permitir pre-commit-local.sh en ramas secundarias y ampliar export-ignore` y propagar con `bash .agent/hooks/sync-governance.sh`.
2. **Autenticar `gh` y crear el tablero en GitHub Projects:**
   - Ejecutar `gh auth login --hostname github.com --git-protocol ssh --web --scopes repo,project,read:org` y después `bash scripts/github/setup-sprint-board.sh`.
3. **Iniciar el trabajo SDD/TDD del Sprint S01:**
   - Redactar `spec.md`, `plan.md` y `tasks.md` de `PBI-001`, `PBI-002` y `PBI-004` según el reparto.
   - Aprobar las specs y confirmar `docs(spec): ...` (requiere orden humana).
   - Iniciar el ciclo TDD con el arnés de pruebas (`PBI-004`) y el primer test rojo de la aplicación web (`PBI-001`).

---

## ⚠️ Bloqueos e impedimentos

| Fecha | Bloqueo | Responsable | Estado |
|---|---|---|---|
| 2026-11-03 | Decisión de stack: React + TypeScript + Vite (ADR-001) y aplicación web en navegador (ADR-002) | Developers + PO | Resuelto |
| 2026-11-03 | Ajuste de fechas (`3–8 nov`) y alcance (`76 h` / 16 tareas; `PBI-003` a S02) | PO + Developers | Resuelto en working tree, pendiente de commit |
| 2026-11-03 | `gh` instalado pero sin autenticar; bloquea la creación del tablero | SM / Dev A | Pendiente de autorizar en la próxima sesión |
| 2026-11-03 | `.agent/hooks/pre-commit-local.sh` bloqueado por inmutabilidad del núcleo | Dev C + SM | Parche guardado en `user_data/governance-main.patch`, pendiente de commit en `main` |
| 2026-11-03 | Lockfiles ignorados en `.gitignore` | Dev A | Corregido en working tree, pendiente de commit |

---

## 📌 Reglas de continuidad

- Al iniciar sesión: leer este archivo antes de cualquier acción.
- Al cerrar un hito: actualizar estado, pruebas y próximo paso.
- No ejecutar `git commit` ni `git push` sin aprobación humana explícita.
- El tablero Scrum es la fuente de verdad operativa; este archivo es un resumen.
