# Spec — PBI-006 Dashboard de Administración y Catálogo Base (Fase 1)

> Especificación SDD del panel de administración del CMS y catálogo preliminar de módulos.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-006` |
| Sprint | `S02` |
| Autor | Fernando Ruescas (`@Fernis23228`, Dev C / Scrum Master) |
| Fecha | 2026-11-17 |
| Estado | Borrador inicial — pendiente de revisión |
| Rama prevista | `feature/PBI-006-dashboard-catalogo` |

---

## 1. Contexto y problema

Una vez autenticado el usuario, ShopMaker debe ofrecer una experiencia de panel de control (Dashboard) similar a plataformas maduras como WordPress o Shopify. Esto incluye la gestión de múltiples sitios creados por el usuario y un catálogo donde explorar e instalar módulos.

---

## 2. Requerimientos funcionales

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-01 | Panel de administración principal `/dashboard` con sidebar de navegación accesible («Mis Sitios», «Catálogo de Módulos», «Configuración»). | Alta |
| RF-02 | Vista «Mis Sitios Web» en cuadrícula interactiva mostrando nombre, subdominio simulado (`*.shopmaker.local`), estado («Borrador» / «Publicado») y botón de edición. | Alta |
| RF-03 | Modal accesible «Crear Nueva Web» con formulario asistido para dar de alta un sitio mediante `SitesApiPort.createSite`. | Alta |
| RF-04 | Escaparate visual de módulos con tarjetas, buscador en tiempo real y filtrado por categoría (`ModulesApiPort.getCatalog`). | Alta |

---

## 3. Criterios de aceptación (CA)

- [ ] **CA-01:** La ruta `/dashboard` muestra el saludo de usuario, sidebar accesible y resumen de sitios.
- [ ] **CA-02:** La lista de sitios se alimenta reactivamente de `SitesApiPort.getUserSites()`.
- [ ] **CA-03:** Al pulsar «Crear Nueva Web», se abre un modal accesible con foco atrapado que valida el nombre y añade el sitio a la lista.
- [ ] **CA-04:** El catálogo de módulos permite buscar por texto y filtrar por etiquetas de categoría en tiempo real.
