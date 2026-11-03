# 🧭 Seguimiento de Trabajo y Próximos Pasos (Live Tracking)

> **Proyecto:** ShopMaker-DAW  
> **Propósito:** Frontend del CMS ShopMaker para construcción de webs con módulos  
> **Marco:** Scrum + SDD + TDD · Gobernanza en `.agent/`

---

## 📡 Telemetría Git (Actualizada automáticamente por Pre-commit Hook)

- **Rama activa:** `feature/PBI-001-aplicacion-web`
- **Último commit consolidado:** `004a60b — *docs(global): documentar metodología y estado del proyecto en README*`
- **Fecha de última sincronización:** 2026-11-03 17:21

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
- [ ] Lockfile versionado y dependencias auditadas (PBI-001).

### 🏃 Sprint S01 — Sprint 0: Fundaciones

**Sprint Goal:** dejar preparado un entorno verificable —aplicación web base, sistema visual accesible, contrato de API con mock y arnés de pruebas— para construir el primer PBI funcional con SDD y TDD.

Artefactos:

- [x] `docs/scrum/team.md`
- [x] `docs/scrum/definition-of-ready.md`
- [x] `docs/scrum/definition-of-done.md`
- [x] `docs/scrum/product-backlog.md`
- [x] Plantillas Scrum en `docs/scrum/plantillas/`.
- [x] Sprint Goal, Sprint Backlog, Review y Retrospective de S01.
- [x] Plantillas SDD/TDD en `specs/`.
- [x] ADR template en `docs/decisiones/`.

PBIs del Sprint:

- [ ] **PBI-001** — Aplicación web y estructura base.
- [ ] **PBI-002** — Tokens, tema claro/oscuro y accesibilidad base.
- [ ] **PBI-003** — Contrato de API y adaptador mock.
- [ ] **PBI-004** — Arnés de pruebas y hook local de calidad.

### 🧪 Pruebas

- [ ] Runner y comando único de suite definidos.
- [ ] Test de humo de la aplicación web.
- [ ] Matriz spec-test inicial completada.
- [ ] Hook `.agent/hooks/pre-commit-local.sh` operativo.

### 📝 Documentación

- [x] `README.md` con metodología, roles, ramas, commits y DoD.
- [x] `CHANGELOG.md` inicializado.
- [ ] Especificaciones `specs/PBI-001..004/` redactadas.
- [x] ADR-001 (React/TS/Vite) y ADR-002 (aplicación web) aceptados.

---

## 🎯 Próximo Paso Inmediato

1. Revisar y aprobar **ADR-001 (React/TS/Vite)** y **ADR-002 (aplicación web)**.
2. Redactar `spec.md`, `plan.md` y `tasks.md` del **PBI-001**.
3. Aprobar la spec y confirmar `docs(spec): ...` (requiere orden humana).
4. Iniciar el ciclo TDD con el primer test rojo de la aplicación web.

---

## ⚠️ Bloqueos e impedimentos

| Fecha | Bloqueo | Responsable | Estado |
|---|---|---|---|
| 2026-11-03 | Decisión de stack: React + TypeScript + Vite (ADR-001) y aplicación web en navegador (ADR-002) | Developers + PO | Resuelto |

---

## 📌 Reglas de continuidad

- Al iniciar sesión: leer este archivo antes de cualquier acción.
- Al cerrar un hito: actualizar estado, pruebas y próximo paso.
- No ejecutar `git commit` ni `git push` sin aprobación humana explícita.
- El tablero Scrum es la fuente de verdad operativa; este archivo es un resumen.
