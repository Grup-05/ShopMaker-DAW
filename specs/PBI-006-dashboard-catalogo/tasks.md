# Tareas TDD — PBI-006 Dashboard de administración y catálogo preliminar de módulos (Fase 1)

> Desglose de tareas TDD atómicas. Cada incremento avanza estrictamente de **rojo → verde → refactor**.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-006` (`#37`) |
| Spec | `specs/PBI-006-dashboard-catalogo/spec.md` |
| Plan | `specs/PBI-006-dashboard-catalogo/plan.md` |
| Responsable | Fernando Ruescas (`@Fernis23228`, Dev C) |
| Estado | En progreso — Fase de especificación SDD completada |

---

## 0. Preparación

- [x] Revisar las issues `#37`, `#50`, `#51`, `#52`, `#53`, `#54`, `#55` en GitHub.
- [x] Crear y verificar la rama de trabajo `feature/PBI-006-dashboard-catalogo`.
- [x] Redactar `spec.md`, `plan.md` y `tasks.md` (Tarea `T01` · Issue `#50`).
- [ ] Confirmar el commit `docs(spec): definir requerimientos, plan técnico y tareas para PBI-006 dashboard-catalogo`.

---

## 1. Lista de tests prioritarios

- [x] `[PBI-006][CA-01] dashboard-layout-structure`: Comprueba landmarks (`aside`, `nav`, `main`), saludo reactivo al usuario autenticado y navegación lateral por teclado.
- [x] `[PBI-006][CA-02] my-sites-grid-render`: Comprueba renderizado de tarjetas de sitios, badges `draft`/`published`, subdominio simulado y estado vacío.
- [x] `[PBI-006][CA-03] create-site-modal-accessible`: Comprueba diálogo accesible con foco atrapado, cierre con `Escape`, validación de formulario y adición del sitio a la lista.
- [x] `[PBI-006][CA-04] module-catalog-search-filter`: Comprueba búsqueda en tiempo real de módulos por texto y filtrado por categoría con `aria-pressed`.

---

## 2. Ciclos TDD

### Ciclo 1 — Layout de Dashboard y Menú Lateral (`T02` y `T03` · Issues `#51` y `#52`)
- [x] **Rojo:** Escribir test `tests/unit/dashboard/DashboardLayout.test.tsx` verificando estructura de sidebar, navegación accesible y saludo. Debe fallar por ausencia de `DashboardPage`.
- [x] **Verde:** Implementar `DashboardLayout.tsx`, `DashboardLayout.css` y `DashboardPage.tsx`. Conectar con `AuthApiPort.me()`.
- [x] **Refactor:** Asegurar que los estilos consumen tokens semánticos y que la navegación por teclado (`Tab`) es fluida.

### Ciclo 2 — Cuadrícula de «Mis Sitios Web» (`T04` · Issue `#53`)
- [x] **Rojo:** Escribir test `tests/unit/dashboard/SitesView.test.tsx` verificando renderizado de tarjetas, subdominio simulado, badge de estado y botón «Editar».
- [x] **Verde:** Implementar `SitesView.tsx` y `SiteCard.tsx` consumiendo `SitesApiPort.getUserSites()`.
- [x] **Refactor:** Añadir estados accesibles de carga y mensaje explicativo cuando la lista está vacía.

### Ciclo 3 — Modal Accesible «Crear Nueva Web» (`T05` · Issue `#54`)
- [x] **Rojo:** Escribir test `tests/unit/dashboard/CreateSiteModal.test.tsx` evaluando `aria-modal="true"`, foco confinado en el modal, tecla `Escape` y callback de alta.
- [x] **Verde:** Implementar `CreateSiteModal.tsx` con trampa de foco accesible y conexión a `SitesApiPort.createSite()`.
- [x] **Refactor:** Manejar validación de campos obligatorios y actualización reactiva de la cuadrícula de sitios.

### Ciclo 4 — Escaparate de Módulos con Buscador y Filtros (`T06` · Issue `#55`)
- [x] **Rojo:** Escribir test `tests/unit/dashboard/CatalogView.test.tsx` evaluando búsqueda instantánea y filtros por categoría con `aria-pressed`.
- [x] **Verde:** Implementar `CatalogView.tsx` y `ModuleCard.tsx` consumiendo `ModulesApiPort.getCatalog()`.
- [x] **Refactor:** Comprobar estado de "sin resultados encontrados" y botón para reiniciar filtros.

---

## 3. Checklist de Calidad Transversal y Accesibilidad

- [x] Landmarks semánticos (`header`, `aside`, `nav`, `main`).
- [x] Foco visible de al menos 3px con contraste ≥ 3:1 en todos los controles.
- [x] Modal con foco atrapado y restauración de foco al botón disparador tras cerrar.
- [x] Cero colores hardcodeados (consumo de tokens de `tokens.css`).
- [x] Suite completa en verde y 0 errores en `npm run typecheck` y `npm run lint`.

---

## 4. Cierre y Definition of Done (DoD)

- [x] Todos los Criterios de Aceptación (`CA-01` a `CA-04`) cubiertos y en verde.
- [x] Matriz spec-test actualizada al 100 %.
- [ ] Pull Request abierto hacia `develop` vinculando `Closes #37`, `Closes #50`, `Closes #51`, `Closes #52`, `Closes #53`, `Closes #54`, `Closes #55`.
