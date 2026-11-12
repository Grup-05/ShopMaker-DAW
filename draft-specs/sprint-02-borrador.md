# Borrador de Planificación — Sprint S02 (CMS ShopMaker)

> **Documento de trabajo preparatorio:** Este borrador consolida los objetivos, la rotación de roles y la arquitectura de trabajo desacoplada para el Sprint S02, de modo que el equipo pueda iniciar el *Sprint Planning* inmediatamente al concluir el Sprint S01.

---

## 1. Rotación de Roles Scrum para el Sprint S02

Conforme al marco de gobernanza definido en `docs/scrum/team.md` y `scripts/scrum/rotate-roles.sh`, los roles rotan de forma circular para garantizar la corresponsabilidad en el equipo, **manteniendo inmutable el rol de Administrador de Gobernanza**:

| Rol Scrum | Titular Sprint S01 | **Titular Sprint S02** | Responsabilidad en S02 |
|---|---|---|---|
| **Product Owner (PO)** | Francisco Tomás (`@FSolaje`) | **Jesús Hernández (`@Tarrant15`)** | Lidera el *QUÉ*: prioriza el Backlog, valida historias de usuario y acepta el incremento. |
| **Scrum Master (SM)** | Jesús Hernández (`@Tarrant15`) | **Fernando Ruescas (`@Fernis23228`)** | Facilita el *CÓMO*: organiza y modera el Sprint Planning, vela por el tablero y elimina impedimentos. |
| **Developer Core / CI** | Francisco Tomás (`@FSolaje`) | **Francisco Tomás (`@FSolaje`)** | Trabajo técnico 100 % enfocado a desarrollo, arnés y arquitectura de contratos. |
| **Administrador de Gobernanza** | Francisco Tomás (`@FSolaje`) | **Francisco Tomás (`@FSolaje`)** | *Inmutable*: Custodia de `.agent/`, `.github/`, hooks y protección de ramas. |

### Comando de activación de roles al inicio de S02:
```bash
bash scripts/scrum/rotate-roles.sh --sprint S02 --po Tarrant15 --sm Fernis23228 --gov-admin FSolaje
```

---

## 2. Sprint Goal Propuesto (S02)

> **«Dotar a ShopMaker de un ciclo completo de identidad (registro, login y rutas protegidas), respaldado por un contrato de API con mock persistente, y desplegar el panel de administración (Dashboard) con gestión de sitios web y catálogo preliminar de módulos, avanzando hacia la experiencia de un CMS maduro.»**

---

## 3. Reparto de Trabajo Independiente (3 Workstreams Paralelos)

Para garantizar que los tres desarrolladores trabajen **sin bloqueos mutuos** durante todo el Sprint, la arquitectura se divide en tres frentes desacoplados mediante el patrón de **Puertos y Adaptadores**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        SPRINT S02 — 3 WORKSTREAMS                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
 [Workstream 1]               [Workstream 2]               [Workstream 3]
  Dev A: @FSolaje             Dev B: @Tarrant15 (PO)       Dev C: @Fernis23228 (SM)
  PBI-003 (Infra / Mock)      PBI-005 (Auth & Sesión)      PBI-006 (Dashboard & CMS)
  • Contratos DTO / Puertos   • Formularios Login/Register • Dashboard (/dashboard)
  • Adaptador Mock Persistente• Medidor password           • Selector «Mis Sitios»
  • Latencia & Errores        • Guardas de navegación      • Catálogo Módulos base
```

---

## 4. Detalle de PBIs para el Sprint S02

### 4.1. Workstream 1 — PBI-003: Contrato de API y Adaptador Mock Persistente
- **Responsable:** Dev A (`@FSolaje`)
- **Estimación:** ~26 h
- **Propósito:** Proveer el motor de datos simulado pero persistente que alimenta al CMS sin depender de un servidor externo.
- **Entregables:**
  1. **Definición de Puertos e Interfaces (`domain/ports/`):**
     - `AuthApiPort`: `login(dto)`, `register(dto)`, `me()`, `recoverPassword(email)`.
     - `SitesApiPort`: `getUserSites()`, `createSite(dto)`, `deleteSite(id)`.
     - `ModulesApiPort`: `getCatalog()`, `installModule(siteId, moduleId)`.
  2. **Adaptador Mock con Persistencia Local (`infrastructure/api/mock/`):**
     - Almacenamiento en `localStorage` / `IndexedDB` para que los usuarios registrados y los sitios creados no se borren al refrescar.
     - Simulación configurable de latencia de red (200–500 ms) para verificar estados de carga en la UI.
     - Simulación determinista de errores (credenciales erróneas 401, email duplicado 409, error de red 500).
  3. **Trazabilidad y Tests:**
     - Tests unitarios y de contrato asegurando que el adaptador mock cumple al 100 % los DTOs pactados.

---

### 4.2. Workstream 2 — PBI-005: Registro, Inicio de Sesión y Rutas Protegidas
- **Responsable:** Dev B (`@Tarrant15`, Product Owner)
- **Estimación:** ~28 h
- **Propósito:** Dotar al CMS del flujo de acceso y seguridad visual, asegurando que solo usuarios autenticados gestionen webs.
- **Entregables:**
  1. **Página de Registro (`/register`):**
     - Campos: Nombre, Email, Password, Confirmación de Password.
     - Medidor visual y accesible de fortaleza de contraseña (`aria-live="polite"`).
     - Validación de términos y condiciones.
  2. **Página de Inicio de Sesión (`/login`):**
     - Formulario accesible con autocompletado estándar (`autocomplete="username"`, `autocomplete="current-password"`).
     - Casilla «Recordarme» y enlace accesible a «Recuperar contraseña».
  3. **Gestión de Estado de Sesión y Guardas (`application/auth/`):**
     - `AuthContext` / Hook `useAuth()` con estado de usuario (`Guest` vs `Authenticated`).
     - Componente `GuardedRoute`: Redirige a `/login?redirect=...` si se intenta entrar a zonas privadas sin sesión.
     - Redirección automática al `/dashboard` si un usuario autenticado visita `/login` o `/register`.
  4. **Cabecera Dinámica de Usuario:**
     - Reemplaza los botones de «Iniciar sesión / Registro» por el menú del usuario (Avatar/Iniciales, Nombre, «Cerrar Sesión»).

---

### 4.3. Workstream 3 — PBI-006 (Fase 1): Dashboard de Administración y Catálogo Base
- **Responsable:** Dev C (`@Fernis23228`, Scrum Master)
- **Estimación:** ~26 h
- **Propósito:** Construir la experiencia de usuario de administración del CMS similar a WordPress o Shopify.
- **Entregables:**
  1. **Panel Principal de Control (`/dashboard`):**
     - Menú lateral de administración: «Mis Sitios», «Catálogo de Módulos», «Configuración».
     - Saludo personalizado al usuario y resumen de su cuenta.
  2. **Gestión de «Mis Sitios Web» (Multi-sitio):**
     - Listado visual en cuadrícula/tarjetas de las webs creadas por el usuario.
     - Cada tarjeta muestra: Nombre del sitio, subdominio simulado (`mimienda.shopmaker.local`), estado («Borrador» / «Publicado») y botón «Editar».
     - Modal accesible «Crear Nueva Web»: Asistente rápido para dar nombre y categoría inicial al sitio.
  3. **Catálogo Preliminar de Módulos / Apps:**
     - Pantalla con el escaparate de módulos disponibles (ej. *Carrito E-commerce*, *Formulario de Contacto*, *Galería de Imágenes*, *SEO Básico*).
     - Buscador en tiempo real y selector de filtros por categoría.
     - Badges semánticos de estado («Disponible», «Instalado»).

---

## 5. Estrategia de Desacoplamiento (Cero Bloqueos)

Para que ningún desarrollador tenga que esperar a otro:
1. **Día 1 del Sprint (Contratos primero):** Durante el *Sprint Planning*, el equipo aprueba las interfaces de TypeScript de los puertos (`AuthApiPort`, `SitesApiPort`).
2. **Desarrollo en paralelo con Stubs locales:**
   - Dev B y Dev C pueden programar la UI y sus tests inmediatamente utilizando stubs en memoria basados en las interfaces aprobadas.
   - Dev A construye el motor mock completo y los fixtures en paralelo.
3. **Integración limpia:** A mitad de Sprint, Dev B y Dev C simplemente conectan el adaptador mock de Dev A sin cambiar una sola línea de su capa de presentación.
