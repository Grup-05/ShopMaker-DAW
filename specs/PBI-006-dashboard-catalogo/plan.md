# Plan técnico — PBI-006 Dashboard de administración y catálogo preliminar de módulos (Fase 1)

> Plan técnico SDD para la construcción del panel de control de ShopMaker, cuadrícula multi-sitio, modal accesible y catálogo preliminar.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-006` (`#37`) |
| Spec | `specs/PBI-006-dashboard-catalogo/spec.md` |
| Autor | Fernando Ruescas (`@Fernis23228`, Dev C) |
| Fecha | 2026-11-23 |
| Estado | En especificación / En progreso |

---

## 1. Resumen de la solución

Se construye la feature `dashboard` bajo `src/features/dashboard/`, organizada en componentes de presentación desacoplados y hooks de aplicación. 

El componente principal `DashboardPage` coordina el layout (`DashboardLayout`), que integra una barra lateral accesible con selector de sección (`'sites' | 'catalog' | 'settings'`), saludo al usuario actual obtenido de `AuthApiPort.me()`, e inyecta las sub-vistas correspondientes:
- **`SitesView`:** muestra las tarjetas de sitios web consumiendo `SitesApiPort.getUserSites()`, botón «Crear Nueva Web» y estados de carga/error.
- **`CreateSiteModal`:** diálogo accesible (`aria-modal="true"`) con foco atrapado y validación de subdominio asistido.
- **`CatalogView`:** escaparate de módulos consumiendo `ModulesApiPort.getCatalog()` con buscador en tiempo real y selector de categorías.

---

## 2. Decisiones técnicas

| ID | Decisión | Alternativas | Justificación |
|---|---|---|---|
| DT-01 | Vista por pestañas semánticas (`nav` con `aria-current="page"` o botones de sección) | Enrutador externo pesado o hash disperso | Mantiene el principio KISS/YAGNI, es testeable de forma inmediata con Vitest y compatible con `HashRouter` o routing SPA global. |
| DT-02 | Foco atrapado en modal mediante listener de teclado (`Tab` cíclico y `Escape`) | Librerías externas como `react-focus-lock` | Cero dependencias añadidas, control exacto de accesibilidad WCAG 2.1 AA y comportamiento determinista en tests. |
| DT-03 | Inyección de puertos vía props con adaptadores por defecto | Singleton estático global | Permite inyectar mocks con latencia cero o respuestas simuladas en pruebas unitarias manteniendo desacoplamiento SOLID. |

---

## 3. Arquitectura y estructura de archivos

```text
src/
└── features/dashboard/
    ├── application/
    │   ├── useSites.ts              # Hook coordinador de carga y creación de sitios
    │   └── useCatalog.ts            # Hook coordinador de módulos y filtrado
    └── presentation/
        ├── DashboardPage.tsx        # Contenedor raíz de la página del dashboard
        ├── DashboardLayout.tsx      # Estructura visual: Sidebar + Header + Área principal
        ├── DashboardLayout.css      # Estilos usando tokens semánticos
        ├── SitesView.tsx            # Cuadrícula de proyectos y estado vacío
        ├── SiteCard.tsx             # Tarjeta individual de sitio con subdominio y badge
        ├── CreateSiteModal.tsx      # Diálogo accesible con foco atrapado
        ├── CatalogView.tsx          # Escaparate de módulos con buscador y filtros
        └── ModuleCard.tsx           # Tarjeta individual de módulo del CMS
```

---

## 4. Estrategia de pruebas

- **`DashboardLayout.test.tsx`:** Verifica estructura de landmarks, menú lateral accesible por teclado, saludo reactivo y cambio de sección activa.
- **`SitesView.test.tsx`:** Verifica renderizado de tarjetas de sitios, badges de estado (`draft`/`published`), botón de edición y mensaje de estado vacío.
- **`CreateSiteModal.test.tsx`:** Verifica apertura de modal, atributos `role="dialog"` y `aria-modal="true"`, foco confinado, cierre con `Escape` y alta reactiva en la lista.
- **`CatalogView.test.tsx`:** Verifica renderizado del catálogo, filtrado en tiempo real al escribir en el input de búsqueda y selección de categoría con `aria-pressed`.

---

## 5. Matriz de trazabilidad spec-test

| ID | Requerimiento / Criterio | Tipo de prueba | Test previsto | Estado |
|---|---|---|---|---|
| RF-01 | Layout del dashboard y menú lateral navegable | Componente | `[PBI-006][CA-01] dashboard-layout-structure` | Verde |
| RF-02 | Cuadrícula de sitios con subdominio y badge | Componente | `[PBI-006][CA-02] my-sites-grid-render` | Verde |
| RF-03 | Modal accesible con foco atrapado y alta | Componente | `[PBI-006][CA-03] create-site-modal-accessible` | Verde |
| RF-04 | Escaparate de módulos con buscador y filtros | Componente | `[PBI-006][CA-04] module-catalog-search-filter` | Verde |

---

## 6. Plan TDD por incrementos

```text
Incremento 1 (T02 → T03 · Issues #51 y #52):
   └── Test rojo: DashboardLayout.test.tsx (CA-01)
   └── Implementación verde: DashboardLayout.tsx y DashboardPage.tsx
   └── Refactor: Estilos accesibles con tokens semánticos y navegación por teclado.

Incremento 2 (T04 · Issue #53):
   └── Test rojo: SitesView.test.tsx (CA-02)
   └── Implementación verde: SitesView.tsx y SiteCard.tsx
   └── Refactor: Manejo de estados vacío, carga y badges de draft/published.

Incremento 3 (T05 · Issue #54):
   └── Test rojo: CreateSiteModal.test.tsx (CA-03)
   └── Implementación verde: CreateSiteModal.tsx con foco atrapado y tecla Escape
   └── Refactor: Validación de formulario y alta en SitesApiPort.

Incremento 4 (T06 · Issue #55):
   └── Test rojo: CatalogView.test.tsx (CA-04)
   └── Implementación verde: CatalogView.tsx y ModuleCard.tsx
   └── Refactor: Filtrado instantáneo por texto y botones de categoría aria-pressed.
```
