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
| `PBI-003-T01` | Redactar spec, plan y matriz de contratos de API | Spec | Dev A (`@FSolaje`) | 4 h | — | Por hacer |
| `PBI-003-T02` | Definir puertos e interfaces TypeScript de frontera | Spec | Dev A (`@FSolaje`) | 4 h | `PBI-003-T01` | Por hacer |
| `PBI-003-T03` | Test rojo: validación de contratos y DTOs de frontera | Test | Dev A (`@FSolaje`) | 4 h | `PBI-003-T02` | Por hacer |
| `PBI-003-T04` | Implementar adaptador mock con persistencia local | Código | Dev A (`@FSolaje`) | 6 h | `PBI-003-T03` | Por hacer |
| `PBI-003-T05` | Simular latencia de red y códigos de error HTTP | Código | Dev A (`@FSolaje`) | 5 h | `PBI-003-T04` | Por hacer |
| `PBI-003-T06` | Documentación del mock y fixtures iniciales de prueba | Docs | Dev A (`@FSolaje`) | 3 h | `PBI-003-T05` | Por hacer |

### PBI-005 — Registro, Inicio de Sesión y Rutas Protegidas (`@Tarrant15` · 28 h)

| ID | Tarea | Tipo | Responsable | Estimación | Depende de | Estado |
|---|---|---|---|---|---|---|
| `PBI-005-T01` | Redactar spec funcional, plan técnico y matriz de autenticación | Spec | Dev B (`@Tarrant15`) | 4 h | — | Por hacer |
| `PBI-005-T02` | Test rojo: formulario de registro y medidor accesible de contraseña | Test | Dev B (`@Tarrant15`) | 4 h | `PBI-005-T01` | Por hacer |
| `PBI-005-T03` | Implementar página de registro y medidor de contraseña | Código | Dev B (`@Tarrant15`) | 6 h | `PBI-005-T02` | Por hacer |
| `PBI-005-T04` | Test rojo: formulario de login y autocompletado estándar | Test | Dev B (`@Tarrant15`) | 4 h | `PBI-005-T01` | Por hacer |
| `PBI-005-T05` | Implementar página de inicio de sesión accesible | Código | Dev B (`@Tarrant15`) | 5 h | `PBI-005-T04` | Por hacer |
| `PBI-005-T06` | Implementar estado useAuth, guardas GuardedRoute y UserMenu | Código | Dev B (`@Tarrant15`) | 5 h | `PBI-005-T03`, `PBI-005-T05` | Por hacer |

### PBI-006 — Dashboard de Administración y Catálogo Base (`@Fernis23228` · 26 h)

| ID | Tarea | Tipo | Responsable | Estimación | Depende de | Estado |
|---|---|---|---|---|---|---|
| `PBI-006-T01` | Redactar spec funcional, plan técnico y layout de dashboard | Spec | Dev C (`@Fernis23228`) | 4 h | — | Por hacer |
| `PBI-006-T02` | Test rojo: estructura del dashboard y menú lateral | Test | Dev C (`@Fernis23228`) | 4 h | `PBI-006-T01` | Por hacer |
| `PBI-006-T03` | Implementar layout de dashboard y navegación lateral | Código | Dev C (`@Fernis23228`) | 6 h | `PBI-006-T02` | Por hacer |
| `PBI-006-T04` | Implementar vista «Mis Sitios Web» en tarjetas interactivas | Código | Dev C (`@Fernis23228`) | 5 h | `PBI-006-T03` | Por hacer |
| `PBI-006-T05` | Implementar modal accesible «Crear Nueva Web» | Código | Dev C (`@Fernis23228`) | 4 h | `PBI-006-T04` | Por hacer |
| `PBI-006-T06` | Implementar escaparate de módulos con buscador y filtros | Código | Dev C (`@Fernis23228`) | 3 h | `PBI-006-T03` | Por hacer |

---

## Estrategia de Trabajo Desacoplado (Sin Esperas)

1. **Día 1:** Aprobación conjunta de los puertos en `domain/ports/` (`AuthApiPort`, `SitesApiPort`, `ModulesApiPort`).
2. **Días 2–7:**
   - Dev B (`@Tarrant15`) y Dev C (`@Fernis23228`) desarrollan la UI y pruebas consumiendo *stubs* locales en memoria basados en las interfaces acordadas.
   - Dev A (`@FSolaje`) construye el motor mock persistente con almacenamiento local y simulación de latencia y errores.
3. **Días 8–10:** Integración del adaptador mock en los servicios de Auth y Dashboard, verificación E2E, apertura de PRs y revisión cruzada por pares.
