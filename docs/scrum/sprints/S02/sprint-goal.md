# Sprint Goal — S02 (CMS ShopMaker)

## Identificación

| Campo | Valor |
|---|---|
| Sprint | S02 — Identidad, Contratos Mock y Dashboard CMS |
| Fechas | 2026-11-17 → 2026-11-28 (2 semanas) |
| Duración | 10 días laborables |
| Scrum Master | Fernando Ruescas (`@Fernis23228`) |
| Product Owner | Jesús Hernández (`@Tarrant15`) |

## Sprint Goal

> **«Dotar a ShopMaker de un ciclo completo de identidad (registro, login y rutas protegidas), respaldado por un contrato de API con mock persistente, y desplegar el panel de administración (Dashboard) con gestión de sitios web y catálogo preliminar de módulos, avanzando hacia la experiencia de un CMS maduro.»**

---

## Preguntas que responde el Planning

- **¿Qué?**
  - **PBI-003:** Contrato de API y adaptador mock persistente (`domain/ports/` y `infrastructure/api/mock/`).
  - **PBI-005:** Registro, inicio de sesión, medidor de contraseña y rutas protegidas (`useAuth`, `GuardedRoute`).
  - **PBI-006:** Panel de administración (`/dashboard`), gestión multi-sitio («Mis Sitios Web») y catálogo base de módulos.
- **¿Cómo?**
  - **Arquitectura de Puertos y Adaptadores (Hexagonal ligera):** Definición consensuada de interfaces en el Día 1.
  - **Desarrollo en paralelo con Stubs locales:** Dev B y Dev C avanzan en la UI con stubs en memoria basados en contratos; Dev A construye el motor mock persistente con simulación de red/errores.
  - **TDD estricto:** tests unitarios, de componente y de contrato previos a la implementación.

---

## PBIs comprometidos en S02

| PBI | Título | Estimación S02 | Responsable | Estado inicial |
|---|---|---|---|---|
| PBI-003 | Contrato de API y adaptador mock persistente | 26 h | Dev A (`@FSolaje`) | En Sprint |
| PBI-005 | Registro, inicio de sesión y rutas protegidas | 28 h | Dev B (`@Tarrant15`, PO) | En Sprint |
| PBI-006 | Dashboard de administración y catálogo base (Fase 1) | 26 h | Dev C (`@Fernis23228`, SM) | En Sprint |

**Total planificado:** 80 h en 3 workstreams paralelos.

---

## Capacidad y riesgos

- **Capacidad estimada:** 3 developers × 10 días × 7–8 h ≈ 210–240 h brutas; **80 h comprometidas en PBIs principales** con holgura para ceremonias, refinamiento y testing continuo.
- **Reparto por workstream:**
  - **Workstream 1 (Dev A - `@FSolaje`):** PBI-003 (26 h).
  - **Workstream 2 (Dev B - `@Tarrant15`):** PBI-005 (28 h).
  - **Workstream 3 (Dev C - `@Fernis23228`):** PBI-006 (26 h).
- **Riesgos y mitigaciones:**
  - *Riesgo:* Desacoplamiento entre UI y backend simulado.  
    *Mitigación:* Pactar TypeScript interfaces estrictas en `domain/ports/` durante el Día 1.
  - *Riesgo:* Pérdida de estado de sesión o sitios al recargar la web.  
    *Mitigación:* Adaptador mock con persistencia en `localStorage`/`IndexedDB`.
  - *Riesgo:* Rutas desprotegidas o accesibles sin credenciales.  
    *Mitigación:* Componente `GuardedRoute` probado exhaustivamente en Vitest y Playwright.

---

## Criterio de éxito (Incremento Demostrable)

Al final del Sprint S02 debe ser demostrable en la Sprint Review:
1. Un usuario no autenticado se registra en `/register` (con medidor de contraseña accesible) y sus credenciales quedan persistidas en el mock.
2. Inicia sesión en `/login` y el sistema actualiza la cabecera mostrando su perfil y el botón de «Cerrar sesión».
3. Acceso controlado: intentar acceder a `/dashboard` sin autenticación redirige a `/login`; con sesión activa, da la bienvenida personalizada.
4. Dentro del Dashboard, el usuario puede listar sus sitios web creados, crear una nueva web mediante modal y explorar el catálogo preliminar de módulos con búsqueda y filtros.
5. Toda la suite de pruebas (unitarias, integración de mock y E2E) pasando en verde sin dependencias de red externa.
