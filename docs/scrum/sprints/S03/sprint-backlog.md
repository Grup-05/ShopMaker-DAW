# Sprint Backlog — S03 (CMS ShopMaker)

## Sprint Goal

> **«Dotar a ShopMaker de un motor de edición visual de páginas web por bloques con inspector de propiedades y autoguardado de borradores (`PBI-008`), un sistema de registro de nuevos módulos mediante manifiestos declarativos y compra/activación simulada por sitio (`PBI-007`), y un visor de previsualización aislada multi-dispositivo (`iframe sandbox`) con sanitización anti-XSS y publicación de sitios (`PBI-009`), entregando el flujo completo de construcción web al cliente.»**

---

## Identificación y capacidad

| Campo | Valor |
|---|---|
| Sprint | S03 — Motor de Edición de Webs, Creación/Compra de Módulos y Previsualización Aislada |
| Inicio | 2026-12-01 |
| Fin | 2026-12-12 |
| Duración | 10 días laborables (2 semanas) |
| Product Owner | Fernando Ruescas (`@Fernis23228`) |
| Scrum Master | Francisco Tomás (`@FSolaje`) |
| Capacidad comprometida | **82 h en 3 workstreams paralelos (3 PBIs · 18 tareas)** |

### Reparto por workstream en S03

| Workstream | Responsable | Usuario GitHub | Rol en S03 | PBI Principal | Issue | Carga S03 |
|---|---|---|---|---|---|---|
| 1. Motor Editor de Webs y Borradores | Dev A (Francisco Tomás) | `@FSolaje` | Scrum Master / Admin Gob | `PBI-008` | `#79` | 30 h |
| 2. Creación de Módulos y Compra Simulada | Dev B (Jesús Hernández) | `@Tarrant15` | Developer | `PBI-007` | `#80` | 26 h |
| 3. Renderizado Sanitizado, Preview y Publicación | Dev C (Fernando Ruescas) | `@Fernis23228` | Product Owner | `PBI-009` | `#81` | 26 h |

---

## Tareas comprometidas en el Sprint S03 (82 h · 18 tareas)

### PBI-008 — Motor de Edición Visual de Webs por Bloques, Inspector y Autoguardado (`#79` · `@FSolaje` · 30 h)

> **Spec:** `specs/PBI-008-editor-webs-borradores/` (SDD — No-Spec-No-Code).

| ID | Tarea | Tipo | Responsable | Estimación | Depende de | Estado | Issue |
|---|---|---|---|---|---|---|---|
| `PBI-008-T01` | Redactar spec, plan, tasks y extender contratos de puertos para bloques, borradores y manifiestos | Spec | Dev A (`@FSolaje`) | 5 h | — | Por hacer | `#61` |
| `PBI-008-T02` | Test rojo: modelo del lienzo de bloques y operaciones (añadir, reordenar, duplicar y eliminar) | Test | Dev A (`@FSolaje`) | 5 h | `PBI-008-T01` | Por hacer | `#62` |
| `PBI-008-T03` | Implementar caso de uso `useEditor` y gestión inmutable del árbol de bloques | Código | Dev A (`@FSolaje`) | 6 h | `PBI-008-T02` | Por hacer | `#63` |
| `PBI-008-T04` | Implementar vista `/editor/:siteId` con paleta de bloques, lienzo accesible e inspector de propiedades | Código | Dev A (`@FSolaje`) | 6 h | `PBI-008-T03` | Por hacer | `#64` |
| `PBI-008-T05` | Test rojo: autoguardado de borradores en `localStorage` y recuperación al reabrir | Test | Dev A (`@FSolaje`) | 4 h | `PBI-008-T01` | Por hacer | `#65` |
| `PBI-008-T06` | Implementar autoguardado persistente de borradores, indicador de estado y evidencia TDD | Código | Dev A (`@FSolaje`) | 4 h | `PBI-008-T04`, `PBI-008-T05` | Por hacer | `#66` |

### PBI-007 — Creación de Módulos mediante Manifiestos, Detalle y Compra Simulada (`#80` · `@Tarrant15` · 26 h)

> **Spec:** `specs/PBI-007-detalle-modulo-compra/` (SDD — No-Spec-No-Code).

| ID | Tarea | Tipo | Responsable | Estimación | Depende de | Estado | Issue |
|---|---|---|---|---|---|---|---|
| `PBI-007-T01` | Redactar spec funcional, plan técnico y matriz de manifiestos y compra simulada | Spec | Dev B (`@Tarrant15`) | 4 h | — | Por hacer | `#67` |
| `PBI-007-T02` | Test rojo: validador de manifiestos de módulos y modal de creación para la tienda | Test | Dev B (`@Tarrant15`) | 4 h | `PBI-007-T01` | Por hacer | `#68` |
| `PBI-007-T03` | Implementar validador de manifiestos y asistente accesible «Añadir Módulo a la Tienda» | Código | Dev B (`@Tarrant15`) | 5 h | `PBI-007-T02` | Por hacer | `#69` |
| `PBI-007-T04` | Test rojo: ficha de detalle de módulo y flujo de compra/activación simulada por sitio | Test | Dev B (`@Tarrant15`) | 4 h | `PBI-007-T01` | Por hacer | `#70` |
| `PBI-007-T05` | Implementar ficha de detalle, selector de sitio destino y compra simulada con `useModulePurchase` | Código | Dev B (`@Tarrant15`) | 6 h | `PBI-007-T04` | Por hacer | `#71` |
| `PBI-007-T06` | Documentar esquema de manifiestos de módulos y registrar evidencia TDD de `PBI-007` | Docs | Dev B (`@Tarrant15`) | 3 h | `PBI-007-T03`, `PBI-007-T05` | Por hacer | `#72` |

### PBI-009 — Motor de Renderizado Sanitizado, Previsualización Aislada (`iframe sandbox`) y Publicación (`#81` · `@Fernis23228` · 26 h)

> **Spec:** `specs/PBI-009-previsualizacion-publicacion/` (SDD — No-Spec-No-Code).

| ID | Tarea | Tipo | Responsable | Estimación | Depende de | Estado | Issue |
|---|---|---|---|---|---|---|---|
| `PBI-009-T01` | Redactar spec funcional, plan técnico y matriz de seguridad para previsualización y publicación | Spec | Dev C (`@Fernis23228`) | 4 h | — | Por hacer | `#73` |
| `PBI-009-T02` | Test rojo: sanitizador anti-XSS y motor de renderizado HTML/CSS mobile-first (`SiteRenderer`) | Test | Dev C (`@Fernis23228`) | 4 h | `PBI-009-T01` | Por hacer | `#74` |
| `PBI-009-T03` | Implementar sanitizador anti-XSS y generador `SiteRenderer` mobile-first para bloques y módulos | Código | Dev C (`@Fernis23228`) | 6 h | `PBI-009-T02` | Por hacer | `#75` |
| `PBI-009-T04` | Test rojo: visor de previsualización aislada (`<iframe sandbox>`) y conmutador de viewports | Test | Dev C (`@Fernis23228`) | 4 h | `PBI-009-T01` | Por hacer | `#76` |
| `PBI-009-T05` | Implementar visor `SitePreviewModal` con `iframe sandbox` y selector accesible de dispositivos | Código | Dev C (`@Fernis23228`) | 5 h | `PBI-009-T03`, `PBI-009-T04` | Por hacer | `#77` |
| `PBI-009-T06` | Implementar flujo «Publicar Web» (`Borrador` -> `Publicado`) y registrar evidencia TDD de `PBI-009` | Código | Dev C (`@Fernis23228`) | 3 h | `PBI-009-T05` | Por hacer | `#78` |

---

## Lista de tests contractuales del Sprint S03

| Test | PBI | Criterio / RF | Estado |
|---|---|---|---|
| `[PBI-008][CA-01] editor-block-operations` | PBI-008 | CA-01 | Pendiente |
| `[PBI-008][CA-02] editor-inspector-properties` | PBI-008 | CA-02 | Pendiente |
| `[PBI-008][CA-03] editor-autosave-draft-recovery` | PBI-008 | CA-03 | Pendiente |
| `[PBI-007][CA-01] module-manifest-validation` | PBI-007 | CA-01 | Pendiente |
| `[PBI-007][CA-02] create-store-module-modal` | PBI-007 | CA-02 | Pendiente |
| `[PBI-007][CA-03] module-detail-view` | PBI-007 | CA-03 | Pendiente |
| `[PBI-007][CA-04] simulated-module-purchase` | PBI-007 | CA-04 | Pendiente |
| `[PBI-009][CA-01] xss-content-sanitization` | PBI-009 | CA-01 | Pendiente |
| `[PBI-009][CA-02] mobile-first-site-renderer` | PBI-009 | CA-02 | Pendiente |
| `[PBI-009][CA-03] isolated-iframe-preview-viewports` | PBI-009 | CA-03 | Pendiente |
| `[PBI-009][CA-04] site-publish-flow` | PBI-009 | CA-04 | Pendiente |

---

## Bloqueos e impedimentos

| Fecha | Descripción | Responsable de resolución | Estado |
|---|---|---|---|
| 2026-11-25 | PR `#56` (`PBI-003`), PR `#58` (`PBI-006`) y PR `#59` (`PBI-005`) integrados en `develop` | Equipo | Resuelto (`b5aeda8`, `a780f71`, `0baef80`) |

---

## Evidencia y seguimiento

- **Commits:** pendientes en ramas `feature/PBI-008-editor-webs-borradores`, `feature/PBI-007-detalle-modulo-compra` y `feature/PBI-009-previsualizacion-publicacion`.
- **PRs:** pendientes de apertura (validación previa obligatoria con `bash scripts/github/pre-pr-gate.sh --pre-pr`).
- **Tablero:** 21 issues (`#61`–`#81`) creadas y vinculadas al milestone `S03` y al Tablón GitHub Projects v2 (`#1`).
- **Demo:** Sprint Review el 2026-12-12.
