# Sprint Backlog — S03 (CMS ShopMaker)

## Sprint Goal

> **«Permitir al usuario autenticado acceder al detalle de un módulo, realizar una compra simulada y abrir el editor de webs con autoguardado y recuperación de borradores, completando así el flujo central del CMS desde el catálogo hasta la construcción de la web.»**

---

## Identificación y capacidad

| Campo | Valor |
|---|---|
| Sprint | S03 — Editor de Webs, Detalle de Módulos y Compra Simulada |
| Inicio | 2026-12-01 |
| Fin | 2026-12-12 |
| Duración | 10 días laborables (2 semanas) |
| Product Owner | Fernando Ruescas (`@Fernis23228`) |
| Scrum Master | Francisco Tomás (`@FSolaje`) |
| Capacidad comprometida | **~52 h en 2 workstreams paralelos** |

### Reparto por workstream en S03

| Workstream | Responsable | Usuario GitHub | PBI Principal | Carga S03 |
|---|---|---|---|---|
| 1. Detalle y Compra | Dev B (Jesús Hernández, PO-anterior) | `@Tarrant15` | `PBI-007` | ~24 h |
| 2. Editor y Borradores | Dev C (Fernando Ruescas, PO) | `@Fernis23228` | `PBI-008` | ~28 h |
| 3. Calidad e Integración | Dev A (Francisco Tomás, SM) | `@FSolaje` | Soporte transversal | — |

---

## Tareas comprometidas en el Sprint S03

### PBI-007 — Detalle de Módulo y Compra Simulada (`@Tarrant15` · ~24 h)

> **Spec pendiente:** `specs/PBI-007-detalle-modulo-compra/` debe redactarse y aprobarse antes de la primera línea de código (SDD — No-Spec-No-Code).

| ID | Tarea | Tipo | Responsable | Estimación | Depende de | Estado |
|---|---|---|---|---|---|---|
| `PBI-007-T01` | Redactar spec funcional, plan técnico y matriz de criterios de compra | Spec | Dev B (`@Tarrant15`) | 4 h | — | Pendiente |
| `PBI-007-T02` | Test rojo: pantalla de detalle del módulo (nombre, descripción, precio, estado de titularidad) | Test | Dev B (`@Tarrant15`) | 3 h | `PBI-007-T01` | Pendiente |
| `PBI-007-T03` | Implementar página de detalle del módulo (`/catalog/:moduleId`) | Código | Dev B (`@Tarrant15`) | 5 h | `PBI-007-T02` | Pendiente |
| `PBI-007-T04` | Test rojo: flujo de compra simulada (selección → confirmación → éxito/error) | Test | Dev B (`@Tarrant15`) | 3 h | `PBI-007-T01` | Pendiente |
| `PBI-007-T05` | Implementar modal/flujo de checkout simulado con `usePurchase` | Código | Dev B (`@Tarrant15`) | 5 h | `PBI-007-T04` | Pendiente |
| `PBI-007-T06` | Verificar persistencia de titularidad en mock y actualización del catálogo | Integración | Dev B (`@Tarrant15`) | 4 h | `PBI-007-T05` | Pendiente |

### PBI-008 — Editor de Webs con Autoguardado y Borradores (`@Fernis23228` · ~28 h)

> **Spec pendiente:** `specs/PBI-008-editor-webs-borradores/` debe redactarse y aprobarse antes de la primera línea de código (SDD — No-Spec-No-Code).

| ID | Tarea | Tipo | Responsable | Estimación | Depende de | Estado |
|---|---|---|---|---|---|---|
| `PBI-008-T01` | Redactar spec funcional, plan técnico, tipos de bloque y matriz de criterios del editor | Spec | Dev C (`@Fernis23228`) | 5 h | — | Pendiente |
| `PBI-008-T02` | Test rojo: workspace del editor (bloques de texto, imagen y separador; añadir, reordenar, eliminar) | Test | Dev C (`@Fernis23228`) | 4 h | `PBI-008-T01` | Pendiente |
| `PBI-008-T03` | Implementar `useEditor` y estructura de datos de bloques (`EditorBlock[]`) | Código | Dev C (`@Fernis23228`) | 5 h | `PBI-008-T02` | Pendiente |
| `PBI-008-T04` | Implementar componentes visuales del editor (`EditorCanvas`, `BlockToolbar`, bloques básicos) | Código | Dev C (`@Fernis23228`) | 6 h | `PBI-008-T03` | Pendiente |
| `PBI-008-T05` | Test rojo: autoguardado periódico y recuperación de borrador al reabrir | Test | Dev C (`@Fernis23228`) | 3 h | `PBI-008-T01` | Pendiente |
| `PBI-008-T06` | Implementar autoguardado en `localStorage`/IndexedDB cada 30 s y al perder el foco | Código | Dev C (`@Fernis23228`) | 5 h | `PBI-008-T05`, `PBI-008-T03` | Pendiente |

---

## Lista de tests del Sprint

| Test | PBI | Criterio / RF | Estado |
|---|---|---|---|
| Pantalla detalle módulo muestra nombre, descripción, precio y estado de titularidad | PBI-007 | CA-01 | Pendiente |
| Módulo ya comprado muestra botón «Gestionar» en lugar de «Comprar» | PBI-007 | CA-01 | Pendiente |
| Flujo de compra: selección → confirmación → estado éxito | PBI-007 | CA-02 | Pendiente |
| Flujo de compra: error de red muestra mensaje de reintento | PBI-007 | CA-02 | Pendiente |
| Titularidad persiste en el mock tras recargar | PBI-007 | CA-03 | Pendiente |
| Editor carga bloques existentes al abrir una web | PBI-008 | CA-01 | Pendiente |
| Añadir bloque de texto aumenta el nº de bloques en 1 | PBI-008 | CA-01 | Pendiente |
| Reordenar bloque cambia su posición en el array | PBI-008 | CA-01 | Pendiente |
| Eliminar bloque pide confirmación si hay contenido | PBI-008 | CA-01 | Pendiente |
| Autoguardado persiste el estado en localStorage cada 30 s | PBI-008 | CA-02 | Pendiente |
| Al reabrir el editor, se recupera el borrador guardado | PBI-008 | CA-02 | Pendiente |
| Sin borrador guardado, se muestra canvas vacío con guía de acción | PBI-008 | CA-02 | Pendiente |

---

## Bloqueos e impedimentos

| Fecha | Descripción | Responsable de resolución | Estado |
|---|---|---|---|
| 2026-11-25 | PR `#58` (PBI-006) pendiente de revisión y merge en `develop` | PO (`@Fernis23228`) + Reviewer | Abierto — bloquea inicio de workstream 2 |

---

## Evidencia y seguimiento

- **Commits:** pendientes (rama `feature/PBI-007-*` y `feature/PBI-008-*`)
- **PRs:** pendientes de apertura
- **Suite:** ejecutar `npm test` antes de abrir cada PR; resultado esperado: **verde**
- **Demo:** Sprint Review el 2026-12-12
