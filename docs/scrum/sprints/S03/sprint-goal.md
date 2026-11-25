# Sprint Goal — S03 (CMS ShopMaker)

## Identificación

| Campo | Valor |
|---|---|
| Sprint | S03 — Motor de Edición de Webs, Creación/Compra de Módulos y Previsualización Aislada |
| Fechas | 2026-12-01 → 2026-12-12 (2 semanas) |
| Duración | 10 días laborables |
| Scrum Master | Francisco Tomás (`@FSolaje`) |
| Product Owner | Fernando Ruescas (`@Fernis23228`) |

## Sprint Goal

> **«Dotar a ShopMaker de un motor de edición visual de páginas web por bloques con inspector de propiedades y autoguardado de borradores (`PBI-008`), un sistema de registro de nuevos módulos mediante manifiestos declarativos y compra/activación simulada por sitio (`PBI-007`), y un visor de previsualización aislada multi-dispositivo (`iframe sandbox`) con sanitización anti-XSS y publicación de sitios (`PBI-009`), entregando el flujo completo de construcción web al cliente.»**

---

## Preguntas que responde el Planning

- **¿Qué?**
  - **PBI-008 (`#79`):** Motor de edición visual de webs por bloques (`/editor/:siteId`), inspector lateral de propiedades y autoguardado de borradores.
  - **PBI-007 (`#80`):** Creación de módulos mediante manifiestos declarativos para la tienda, ficha de detalle y compra/activación simulada por sitio.
  - **PBI-009 (`#81`):** Motor de renderizado sanitizado mobile-first (`SiteRenderer`), previsualización aislada en `<iframe sandbox>` (`360px`, `768px`, `1280px`) y publicación (`draft` → `published`).
- **¿Cómo?**
  - **Arquitectura de Puertos y Adaptadores:** Extensión consensuada en el Día 1 de `SitesApiPort` y `ModulesApiPort` (`SiteBlockDto`, `SiteDraftDto`, `ModuleManifestDto`) sobre `LocalStorageMockApiAdapter`.
  - **3 Workstreams paralelos y desacoplados:** Cada desarrollador lidera un frente completo con TDD estricto (*rojo → verde → refactor*) sin bloqueos mutuos.

---

## PBIs comprometidos en S03

| PBI | Issue | Título | Estimación S03 | Responsable | Estado inicial |
|---|---|---|---|---|---|
| `PBI-008` | `#79` | Motor de edición visual de webs por bloques, inspector de propiedades y autoguardado de borradores | 30 h | Dev A (`@FSolaje`, SM / Admin Gob) | En Sprint |
| `PBI-007` | `#80` | Creación de módulos mediante manifiestos para la tienda, ficha de detalle y compra/activación simulada por sitio | 26 h | Dev B (`@Tarrant15`) | En Sprint |
| `PBI-009` | `#81` | Motor de renderizado sanitizado mobile-first, previsualización aislada multi-dispositivo (`iframe sandbox`) y publicación de web | 26 h | Dev C (`@Fernis23228`, PO) | En Sprint |

**Total planificado:** **82 h en 3 workstreams paralelos** (18 tareas atómicas `#61`–`#78`).

---

## Capacidad y riesgos

- **Capacidad estimada:** 3 developers × 10 días × 7–8 h ≈ 210–240 h brutas; **82 h comprometidas en 3 PBIs** con margen para ceremonias, integración y testing continuo.
- **Reparto por workstream:**
  - **Workstream 1 (Dev A — `@FSolaje`, SM):** `PBI-008` (`#79`, 30 h, tareas `#61`–`#66`) — Motor de edición visual, contratos y autoguardado.
  - **Workstream 2 (Dev B — `@Tarrant15`):** `PBI-007` (`#80`, 26 h, tareas `#67`–`#72`) — Creación de módulos por manifiesto, detalle y compra simulada.
  - **Workstream 3 (Dev C — `@Fernis23228`, PO):** `PBI-009` (`#81`, 26 h, tareas `#73`–`#78`) — Sanitización, previsualización aislada multi-dispositivo y publicación.
- **Riesgos y mitigaciones:**
  - *Riesgo:* Complejidad del editor de bloques y acoplamiento con módulos de la tienda.
    *Mitigación:* Pactar `SiteBlockDto` y `ModuleManifestDto` en `src/domain/ports/` en `PBI-008-T01` (`#61`).
  - *Riesgo:* Ejecución de código no seguro al crear módulos o previsualizar contenido.
    *Mitigación:* Validación estática de manifiestos sin `eval` (`PBI-007`) y sanitización anti-XSS + `<iframe sandbox="">` (`PBI-009`).

---

## Criterio de éxito (Incremento Demostrable al Cliente)

Al final del Sprint S03 debe ser demostrable en la Sprint Review:

1. Un usuario autenticado registra un nuevo módulo en la tienda mediante su manifiesto declarativo (o selecciona uno existente), consulta su detalle y realiza la compra/activación simulada para uno de sus sitios web (`PBI-007`).
2. Desde el Dashboard, el usuario pulsa «Editar» en su sitio y accede a `/editor/:siteId`, donde añade bloques estructurales y bloques de módulos instalados, los reordena, edita sus propiedades en el Inspector y comprueba cómo el borrador se autoguarda y se recupera al recargar (`PBI-008`).
3. El usuario abre la previsualización aislada (`<iframe sandbox>`) con contenido sanitizado, alterna entre vistas Móvil (`360px`), Tablet (`768px`) y Escritorio (`1280px`), y publica la web cambiando su estado a «Publicado» en el Dashboard (`PBI-009`).
4. Toda la suite de pruebas pasa al 100 % en verde superando las 5 puertas estáticas de `pre-pr-gate.sh`.
