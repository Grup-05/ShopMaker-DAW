# Sprint Backlog — S02 (CMS ShopMaker)

## Sprint Goal

> **«Dotar a ShopMaker de un ciclo completo de identidad (registro, login y rutas protegidas), respaldado por un contrato de API con mock persistente, y desplegar el panel de administración (Dashboard) con gestión de sitios web y catálogo preliminar de módulos, avanzando hacia la experiencia de un CMS maduro.»**

---

## Identificación y capacidad

| Campo | Valor |
|---|---|
| Sprint | S02 — Identidad, Contratos Mock y Dashboard CMS |
| Inicio | 2026-11-17 |
| Fin | 2026-11-28 |
| Duración | 10 días laborables (2 semanas) |
| Product Owner | Jesús Hernández (`@Tarrant15`) |
| Scrum Master | Fernando Ruescas (`@Fernis23228`) |
| Capacidad comprometida | **80 h en 3 workstreams paralelos** |

### Reparto por workstream en S02

| Workstream | Responsable | Usuario GitHub | PBI Principal | Carga S02 |
|---|---|---|---|---|
| 1. Infraestructura / Mock | Dev A (Francisco Tomás) | `@FSolaje` | `PBI-003` | 26 h |
| 2. Identidad y Sesión | Dev B (Jesús Hernández, PO) | `@Tarrant15` | `PBI-005` | 28 h |
| 3. Dashboard y CMS Base | Dev C (Fernando Ruescas, SM) | `@Fernis23228` | `PBI-006` | 26 h |

---

## Tareas comprometidas en el Sprint S02 (80 h)

### PBI-003 — Contrato de API y Adaptador Mock Persistente (`@FSolaje` · 26 h)

| ID | Tarea | Tipo | Responsable | Estimación | Depende de | Estado |
|---|---|---|---|---|---|---|
| `PBI-003-T01` | Redactar spec, plan técnico y contratos de interfaces (`AuthApiPort`, `SitesApiPort`, `ModulesApiPort`) | Spec | Dev A (`@FSolaje`) | 6 h | — | Por hacer |
| `PBI-003-T02` | Test rojo: validación de contratos y DTOs de frontera | Test | Dev A (`@FSolaje`) | 4 h | `PBI-003-T01` | Por hacer |
| `PBI-003-T03` | Implementar adaptador mock con persistencia en `localStorage`/`IndexedDB` | Código | Dev A (`@FSolaje`) | 8 h | `PBI-003-T02` | Por hacer |
| `PBI-003-T04` | Simulación determinista de latencia de red (200-500 ms) y errores HTTP (401, 409, 500) | Código | Dev A (`@FSolaje`) | 5 h | `PBI-003-T03` | Por hacer |
| `PBI-003-T05` | Documentación de endpoints simulados y fixtures iniciales de datos | Docs | Dev A (`@FSolaje`) | 3 h | `PBI-003-T04` | Por hacer |

### PBI-005 — Registro, Inicio de Sesión y Rutas Protegidas (`@Tarrant15` · 28 h)

| ID | Tarea | Tipo | Responsable | Estimación | Depende de | Estado |
|---|---|---|---|---|---|---|
| `PBI-005-T01` | Redactar spec funcional, plan técnico y matriz spec-test para autenticación | Spec | Dev B (`@Tarrant15`) | 5 h | — | Por hacer |
| `PBI-005-T02` | Test rojo: formulario de registro (`/register`) y medidor accesible de contraseña | Test | Dev B (`@Tarrant15`) | 4 h | `PBI-005-T01` | Por hacer |
| `PBI-005-T03` | Implementar componente de registro, medidor visual/accesible y validación de términos | Código | Dev B (`@Tarrant15`) | 6 h | `PBI-005-T02` | Por hacer |
| `PBI-005-T04` | Test rojo: formulario de login (`/login`) y autocompletado accesible | Test | Dev B (`@Tarrant15`) | 4 h | `PBI-005-T01` | Por hacer |
| `PBI-005-T05` | Implementar formulario de login, botón recordarme y enlace recuperar contraseña | Código | Dev B (`@Tarrant15`) | 5 h | `PBI-005-T04` | Por hacer |
| `PBI-005-T06` | Implementar estado `useAuth()`, guardas `GuardedRoute` y cabecera de usuario con avatar | Código | Dev B (`@Tarrant15`) | 4 h | `PBI-005-T03`, `PBI-005-T05` | Por hacer |

### PBI-006 — Dashboard de Administración y Catálogo Base (`@Fernis23228` · 26 h)

| ID | Tarea | Tipo | Responsable | Estimación | Depende de | Estado |
|---|---|---|---|---|---|---|
| `PBI-006-T01` | Redactar spec funcional, plan técnico y layout de administración | Spec | Dev C (`@Fernis23228`) | 5 h | — | Por hacer |
| `PBI-006-T02` | Test rojo: estructura del dashboard (`/dashboard`) y menú lateral de navegación | Test | Dev C (`@Fernis23228`) | 4 h | `PBI-006-T01` | Por hacer |
| `PBI-006-T03` | Implementar layout del dashboard, saludo al usuario y barra de navegación lateral | Código | Dev C (`@Fernis23228`) | 5 h | `PBI-006-T02` | Por hacer |
| `PBI-006-T04` | Implementar vista «Mis Sitios Web» (cuadrícula, estados, subdominio simulado) | Código | Dev C (`@Fernis23228`) | 5 h | `PBI-006-T03` | Por hacer |
| `PBI-006-T05` | Implementar modal accesible «Crear Nueva Web» con formulario asistido | Código | Dev C (`@Fernis23228`) | 4 h | `PBI-006-T04` | Por hacer |
| `PBI-006-T06` | Implementar escaparate de módulos con búsqueda y filtros por categoría | Código | Dev C (`@Fernis23228`) | 3 h | `PBI-006-T03` | Por hacer |

---

## Estrategia de Trabajo Desacoplado (Sin Esperas)

1. **Día 1:** Aprobación conjunta de los puertos en `domain/ports/` (`AuthApiPort`, `SitesApiPort`, `ModulesApiPort`).
2. **Días 2–7:**
   - Dev B (`@Tarrant15`) y Dev C (`@Fernis23228`) desarrollan la UI y pruebas consumiendo *stubs* locales en memoria basados en las interfaces acordadas.
   - Dev A (`@FSolaje`) construye el motor mock persistente con almacenamiento local y simulación de latencia y errores.
3. **Días 8–10:** Integración del adaptador mock en los servicios de Auth y Dashboard, verificación E2E, apertura de PRs y revisión cruzada por pares.
