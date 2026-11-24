# Spec — PBI-006 Dashboard de administración y catálogo preliminar de módulos (Fase 1)

> Especificación SDD (Specification Driven Development) para el panel de administración central del CMS ShopMaker, gestión de sitios web y catálogo preliminar de módulos.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-006` (`#37`) |
| Sprint | `S02` |
| Autor | Fernando Ruescas (`@Fernis23228`, Dev C) |
| Fecha | 2026-11-23 |
| Estado | En especificación / En progreso |
| Rama | `feature/PBI-006-dashboard-catalogo` |

---

## 1. Contexto y problema

El CMS ShopMaker permite a los usuarios construir sitios web y adquirir módulos de extensión. Una vez autenticado, el usuario necesita un **panel de control centralizado (`/dashboard`)** profesional, accesible y fácil de usar para:

1. **Navegar de manera intuitiva** entre las diferentes áreas del CMS a través de un menú lateral accesible.
2. **Gestionar su cartera de sitios web** en una cuadrícula visual de tarjetas («Mis Sitios Web»), verificando su nombre, subdominio simulado (`*.shopmaker.local`) y estado de publicación (`draft` / `published`).
3. **Crear nuevos sitios web** mediante un asistente modal accesible con foco atrapado y validación de datos en tiempo real.
4. **Explorar el catálogo de módulos** disponibles para el CMS, con buscador instantáneo y filtrado por categorías temáticas (`ecommerce`, `content`, `marketing`, etc.).

Este PBI consume los contratos formales desacoplados de `SitesApiPort`, `ModulesApiPort` y `AuthApiPort` establecidos en `PBI-003`.

---

## 2. Historias de usuario y flujos

### Historia 1 (Dashboard y Menú Lateral)
**Como** usuario autenticado,  
**quiero** un panel de control con menú lateral («Mis Sitios», «Catálogo de Módulos», «Configuración») y saludo personalizado,  
**para** orientarme rápidamente y acceder a las funciones del CMS.

### Historia 2 (Cuadrícula de Mis Sitios)
**Como** usuario del CMS,  
**quiero** visualizar mis sitios web en tarjetas interactivas con sus subdominios y badges de estado,  
**para** conocer el estado de mis proyectos y acceder a editarlos.

### Historia 3 (Creación Asistida de Sitio)
**Como** usuario del CMS,  
**quiero** un modal accesible «Crear Nueva Web» con formulario asistido,  
**para** dar de alta un nuevo sitio de forma guiada sin salir de mi panel.

### Historia 4 (Escaparate de Módulos)
**Como** usuario del CMS,  
**quiero** un escaparate de módulos con búsqueda en tiempo real y selector de categorías,  
**para** encontrar extensiones que potencien las capacidades de mi sitio web.

---

## 3. Requerimientos funcionales

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-01 | **Layout del Dashboard:** Disponer de una estructura con cabecera superior (saludo al usuario autenticado, selector de tema y botón de logout) y barra lateral con navegación accesible (`<nav>`) entre las secciones: «Mis Sitios», «Catálogo» y «Configuración». | Alta |
| RF-02 | **Gestión y Cuadrícula de Sitios:** Consumir `SitesApiPort.getUserSites()` para renderizar una cuadrícula de tarjetas con nombre, subdominio simulado, badge de estado (`draft`/`published`) y botón accesible «Editar/Maquetar». Soportar estados de carga, vacío y error con reintento. | Alta |
| RF-03 | **Modal Accesible de Alta:** Implementar un modal accesible con `role="dialog"`, `aria-modal="true"`, foco atrapado y cierre mediante tecla `Escape` o botón de cierre. Contiene formulario con nombre del sitio (obligatorio), subdominio sugerido y selector de categoría. Al confirmar, invoca `SitesApiPort.createSite()` y actualiza la lista. | Alta |
| RF-04 | **Escaparate y Filtrado de Módulos:** Consumir `ModulesApiPort.getCatalog()` para mostrar el catálogo en tarjetas interactivas, con campo de búsqueda instantánea por texto y botones de filtro por categoría con estado `aria-pressed`. | Alta |
| RF-05 | **Persistencia e Integración de Puertos:** Toda la interacción de datos debe canalizarse exclusivamente a través de las interfaces `SitesApiPort`, `ModulesApiPort` y `AuthApiPort`, utilizando el adaptador mock persistente en desarrollo y pruebas. | Alta |

---

## 4. Requerimientos no funcionales

| ID | Categoría | Requerimiento |
|---|---|---|
| RNF-01 | Accesibilidad | Cumplimiento estricto de WCAG 2.1 AA: foco visible (outline ≥ 3px con contraste ≥ 3:1), orden lógico de tabulación por teclado, foco atrapado en modales y restauración de foco al cerrar. |
| RNF-02 | Rendimiento | Filtrado en memoria de módulos y actualización de cuadrícula sin parpadeos ni bloqueos del hilo principal. |
| RNF-03 | Arquitectura | Separación limpia por capas: presentación (componentes React), aplicación (hooks/servicios coordinadores), dominio (DTOs/puertos) e infraestructura (adaptador API mock). |
| RNF-04 | Seguridad | Sanitización de entradas en formularios y ausencia de ejecución de código arbitrario o scripts en los campos de usuario. |

---

## 5. Criterios de aceptación

| ID | Criterio (Dado / Cuando / Entonces) | RF asociado |
|---|---|---|
| CA-01 | **Dado** un usuario que navega a `/dashboard`, **cuando** se monta el componente, **entonces** se muestran los landmarks semánticos (`aside`, `nav`, `main`), el saludo con el nombre del usuario y el menú lateral navegable por teclado. | RF-01, RNF-01 |
| CA-02 | **Dado** el usuario en la sección «Mis Sitios», **cuando** la petición a `getUserSites()` se resuelve, **entonces** se renderiza la cuadrícula de tarjetas con nombre, subdominio simulado y badge de estado. Si no hay sitios, muestra el estado vacío explicativo. | RF-02, RNF-01 |
| CA-03 | **Dado** el botón «Crear Nueva Web», **cuando** se pulsa, **entonces** se abre el modal con foco atrapado y `aria-modal="true"`. Al completar el nombre y guardar, invoca `SitesApiPort.createSite()`, añade la tarjeta a la cuadrícula, cierra el modal y devuelve el foco. Al pulsar `Escape`, se cierra sin guardar. | RF-03, RNF-01 |
| CA-04 | **Dado** el escaparate de módulos, **cuando** el usuario escribe en el buscador o selecciona una categoría, **entonces** la lista de módulos se filtra en tiempo real, los botones de categoría alternan su estado `aria-pressed`, y si no hay coincidencias se muestra un estado de sin resultados. | RF-04, RNF-02 |

---

## 6. Estados de interfaz obligatorios

| Estado | Comportamiento en Dashboard |
|---|---|
| **Carga** | Indicador accesible de carga mientras se resuelven `getUserSites()` y `getCatalog()`. |
| **Vacío (Sitios)** | Mensaje claro «No tienes ningún sitio web todavía» con botón destacado para «Crear mi primera web». |
| **Vacío (Módulos)** | Mensaje «No se encontraron módulos coincidentes» cuando el filtro no arroja resultados, con botón para limpiar filtros. |
| **Error** | Alerta visual con mensaje normalizado de error y botón de reintento si la API falla. |
| **Modal Abierto** | Fondo atenuado (backdrop), foco confinado dentro del formulario, scroll del body bloqueado. |

---

## 7. Contrato de API y dependencias

- `SitesApiPort`: `getUserSites(): Promise<readonly SiteDto[]>`, `createSite(dto): Promise<SiteDto>`, `deleteSite(id): Promise<void>`.
- `ModulesApiPort`: `getCatalog(): Promise<readonly ModuleDto[]>`, `installModule(siteId, moduleId): Promise<void>`.
- `AuthApiPort`: `me(): Promise<UserDto>`, `logout(): Promise<void>`.

---

## 8. Referencias

- Product Backlog: `docs/scrum/product-backlog.md` (`PBI-006`)
- Sprint Backlog: `docs/scrum/sprints/S01/sprint-backlog.md` (y borrador S02)
- Issues de GitHub asociadas: `#37`, `#50`, `#51`, `#52`, `#53`, `#54`, `#55`.
