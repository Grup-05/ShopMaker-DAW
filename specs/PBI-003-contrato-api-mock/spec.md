# Spec — PBI-003 Definir el contrato de API y el adaptador mock persistente

> Especificación SDD del contrato de frontera (puertos y DTOs) y del adaptador mock con persistencia local (`localStorage`), simulación de latencia configurable y errores HTTP deterministas.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-003` (`#4`) |
| Sprint | `S02` |
| Autor | Francisco Tomás (`@FSolaje`, Dev A) |
| Fecha | 2026-11-23 |
| Estado | Implementada |
| Rama | `feature/PBI-003-contrato-api-mock` |

---

## 1. Contexto y problema

ShopMaker es un CMS cuya arquitectura global es de tres capas (frontend, backend/API y base de datos), donde este repositorio contiene exclusivamente el frontend web desktop-first. Para que los tres desarrolladores puedan construir y verificar los flujos de identidad (`PBI-005`), panel de administración multi-sitio y catálogo de módulos (`PBI-006`) sin bloqueos ni dependencia de un servidor externo, se requiere:

1. Un **contrato de API tipado y formal** mediante puertos en la capa de dominio (`src/domain/ports/`).
2. Un **adaptador mock persistente** en la capa de infraestructura (`src/infrastructure/api/mock/`) que conserve en `localStorage` los usuarios registrados, la sesión activa, los sitios creados y los módulos instalados al recargar el navegador, además de simular latencia de red (200–500 ms) y errores HTTP normalizados (`401`, `404`, `409`, `500`).

---

## 2. Historias de usuario y flujos

### Historia principal

**Como** Developer del frontend de ShopMaker, **quiero** un contrato de API documentado (`src/domain/ports/`) y un adaptador mock con persistencia local (`src/infrastructure/api/mock/`), **para** desarrollar el frontend sin depender del backend real y ejecutar pruebas deterministas con simulación de red, persistencia y errores.

### Flujo principal

1. La capa de aplicación o presentación invoca un método de `AuthApiPort`, `SitesApiPort` o `ModulesApiPort` inyectado a través de su interfaz.
2. El adaptador mock aplica la latencia simulada configurada (por defecto entre 200 y 500 ms en entorno interactivo, o configurable a `0 ms`/valor fijo en pruebas).
3. El adaptador valida el DTO de entrada y comprueba si existe una condición de error simulado o regla de negocio violada.
4. El adaptador lee o actualiza el estado estructurado en `localStorage` (o almacenamiento en memoria inyectable como fallback) bajo claves con namespace `shopmaker.mock.*`.
5. El adaptador devuelve una promesa resuelta con el DTO de salida inmutable cumpliendo estrictamente el contrato TypeScript.

### Flujos alternativos y de error

- **Almacenamiento vacío (primera carga):** el adaptador inicializa automáticamente los fixtures deterministas (usuario demo sin secretos reales, sitios iniciales y catálogo base de módulos).
- **Credenciales inválidas o sesión inexistente (`401 Unauthorized`):** `login()` con contraseña errónea o `me()` sin sesión activa rechaza la promesa con un `ApiError` de código HTTP `401`.
- **Conflicto por duplicidad (`409 Conflict`):** `register()` con un correo ya registrado o `createSite()` con un subdominio existente rechaza la promesa con un `ApiError` de código HTTP `409`.
- **Recurso no encontrado (`404 Not Found`):** `deleteSite()` o `installModule()` sobre un identificador inexistente rechaza la promesa con un `ApiError` de código HTTP `404`.
- **Fallo de red o servidor simulado (`500 Internal Server Error`):** cuando se activa el modo de fallo de red en la configuración del mock (o mediante señal determinista de prueba), cualquier operación rechaza la promesa con un `ApiError` de código HTTP `500`.

---

## 3. Requerimientos funcionales

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-01 | Definir e implementar el puerto `AuthApiPort` (`login`, `register`, `me`, `recoverPassword`, `logout`) con persistencia local de usuarios registrados y sesión activa. | Alta |
| RF-02 | Definir e implementar el puerto `SitesApiPort` (`getUserSites`, `createSite`, `deleteSite`) con generación de subdominio simulado (`*.shopmaker.local`) y persistencia local. | Alta |
| RF-03 | Definir e implementar el puerto `ModulesApiPort` (`getCatalog`, `installModule`) con catálogo inicial pre-sembrado de módulos del CMS y actualización persistente del estado de instalación. | Alta |
| RF-04 | Soportar simulación configurable de latencia de red asíncrona (rango configurable 200–500 ms por defecto, o retardo fijo para pruebas deterministas). | Media |
| RF-05 | Normalizar y simular de forma determinista errores HTTP de frontera (`400`, `401`, `404`, `409`, `500`) mediante una clase/estructura tipada `ApiError`. | Alta |

---

## 4. Requerimientos no funcionales

| ID | Categoría | Requerimiento |
|---|---|---|
| RNF-01 | Arquitectura (SOLID) | Los puertos en `src/domain/ports/` no deben importar frameworks (`react`, `vite`), clientes HTTP ni APIs de Node. |
| RNF-02 | Rendimiento y Determinismo | Ninguna prueba debe realizar peticiones de red reales; el retardo del mock debe ser parametrizable para no penalizar el tiempo de la suite (`npm test`). |
| RNF-03 | Seguridad | Cero secretos, tokens reales o datos personales en código o fixtures; no almacenar contraseñas en texto plano expuestas en los DTOs devueltos (`UserDto`). |
| RNF-04 | Compatibilidad Web | Uso exclusivo de APIs estándar del navegador (`localStorage` con fallback en memoria `StorageLike`); prohibido usar módulos nativos de Node (`fs`, `path`, `crypto`). |

---

## 5. Criterios de aceptación

| ID | Criterio (Dado / Cuando / Entonces) | RF asociado |
|---|---|---|
| CA-01 | **Dado** el contrato de frontera en `src/domain/ports/`, **cuando** se instancia el adaptador mock, **entonces** implementa el 100 % de los métodos de `AuthApiPort`, `SitesApiPort` y `ModulesApiPort` cumpliendo sus firmas TypeScript. | RF-01, RF-02, RF-03 |
| CA-02 | **Dado** un usuario registrado, un sitio web creado o un módulo instalado mediante el adaptador mock, **cuando** se reinicia o crea una nueva instancia del adaptador sobre el mismo `localStorage`, **entonces** los datos creados persisten íntegramente sin perderse al recargar. | RF-01, RF-02, RF-03 |
| CA-03 | **Dado** un adaptador mock configurado con un rango de latencia `[minMs, maxMs]` (ej. 200–500 ms), **cuando** se invoca cualquier método asíncrono, **entonces** la promesa tarda al menos `minMs` antes de resolverse o rechazarse. | RF-04 |
| CA-04 | **Dado** el conjunto de operaciones de `AuthApiPort`, `SitesApiPort` y `ModulesApiPort`, **cuando** se validan las respuestas y errores (`401`, `409`, `500`), **entonces** todos los DTOs devueltos y errores `ApiError` cumplen estrictamente el esquema de contrato al 100 %. | RF-01, RF-02, RF-03, RF-05 |

---

## 6. Estados de interfaz soportados por el contrato

Aunque `PBI-003` se sitúa en las capas de dominio e infraestructura, su diseño habilita todos los estados obligatorios de interfaz en `PBI-005` y `PBI-006`:

| Estado en UI consumidora | Soporte en `PBI-003` |
|---|---|
| Carga | Latencia asíncrona configurable (`minLatencyMs` / `maxLatencyMs`) que mantiene la promesa pendiente durante la ventana definida. |
| Vacío | Posibilidad de inicializar o vaciar la lista de sitios del usuario (`getUserSites()` devuelve `[]`). |
| Error con reintento | Rechazo con `ApiError` (`status: 500`, `code: 'NETWORK_ERROR'`) y recuperación al desactivar el flag de fallo en el siguiente intento. |
| Éxito | Resolución tipada con DTOs inmutables (`AuthResponseDto`, `SiteDto`, `readonly ModuleDto[]`). |
| Sin permisos / No autenticado | Rechazo con `ApiError` (`status: 401`, `code: 'INVALID_CREDENTIALS'` o `'UNAUTHORIZED'`). |
| Conflicto de negocio | Rechazo con `ApiError` (`status: 409`, `code: 'EMAIL_ALREADY_EXISTS'` o `'SUBDOMAIN_ALREADY_EXISTS'`). |

---

## 7. Contrato de API y dependencias

### 7.1. `AuthApiPort` (`src/domain/ports/AuthApiPort.ts`)

- **DTOs:**
  - `UserDto`: `{ readonly id: string; readonly name: string; readonly email: string; readonly avatarUrl?: string }`
  - `LoginCredentialsDto`: `{ readonly email: string; readonly password: string; readonly rememberMe?: boolean }`
  - `RegisterUserDto`: `{ readonly name: string; readonly email: string; readonly password: string; readonly acceptTerms: boolean }`
  - `AuthResponseDto`: `{ readonly user: UserDto; readonly token: string }`
- **Métodos:**
  - `login(credentials: LoginCredentialsDto): Promise<AuthResponseDto>` (Endpoint futuro: `POST /api/v1/auth/login`)
  - `register(userData: RegisterUserDto): Promise<AuthResponseDto>` (Endpoint futuro: `POST /api/v1/auth/register`)
  - `me(): Promise<UserDto>` (Endpoint futuro: `GET /api/v1/auth/me`)
  - `recoverPassword(email: string): Promise<void>` (Endpoint futuro: `POST /api/v1/auth/recover`)
  - `logout(): Promise<void>` (Endpoint futuro: `POST /api/v1/auth/logout`)

### 7.2. `SitesApiPort` (`src/domain/ports/SitesApiPort.ts`)

- **DTOs:**
  - `SiteStatus`: `'draft' | 'published'`
  - `SiteDto`: `{ readonly id: string; readonly name: string; readonly subdomain: string; readonly status: SiteStatus; readonly category?: string; readonly createdAt: string; readonly updatedAt: string }`
  - `CreateSiteDto`: `{ readonly name: string; readonly subdomain?: string; readonly category?: string }`
- **Métodos:**
  - `getUserSites(): Promise<readonly SiteDto[]>` (Endpoint futuro: `GET /api/v1/sites`)
  - `createSite(dto: CreateSiteDto): Promise<SiteDto>` (Endpoint futuro: `POST /api/v1/sites`)
  - `deleteSite(id: string): Promise<void>` (Endpoint futuro: `DELETE /api/v1/sites/:id`)

### 7.3. `ModulesApiPort` (`src/domain/ports/ModulesApiPort.ts`)

- **DTOs:**
  - `ModuleStatus`: `'available' | 'installed' | 'featured'`
  - `ModuleDto`: `{ readonly id: string; readonly name: string; readonly description: string; readonly category: string; readonly icon?: string; readonly status: ModuleStatus; readonly version: string }`
- **Métodos:**
  - `getCatalog(): Promise<readonly ModuleDto[]>` (Endpoint futuro: `GET /api/v1/modules`)
  - `installModule(siteId: string, moduleId: string): Promise<void>` (Endpoint futuro: `POST /api/v1/sites/:siteId/modules/:moduleId/install`)

### 7.4. Modelo normalizado de errores (`ApiError`)

- **Códigos HTTP estandarizados:** `400`, `401`, `404`, `409`, `500`.
- **Propiedades:** `status: ApiErrorStatus`, `code: ApiErrorCode`, `message: string`.

---

## 8. Fuera de alcance

- Conexión HTTP real (`fetch` / `axios`) contra un servidor backend externo (se implementará en un adaptador HTTP futuro bajo los mismos puertos).
- Componentes visuales de formularios de login/registro (`PBI-005`) o vistas del dashboard (`PBI-006`).
- Pasarela de pagos reales o facturación.

---

## 9. Riesgos y supuestos

| Riesgo / supuesto | Impacto | Mitigación |
|---|---|---|
| Divergencia de interfaces entre `PBI-003`, `PBI-005` y `PBI-006` | Alto | Mantener compatibilidad exacta con las firmas pactadas en `src/domain/ports/{AuthApiPort,SitesApiPort,ModulesApiPort}.ts`. |
| Corrupción o cuota excedida en `localStorage` | Medio | Validar el JSON leído al hidratar el estado y restablecer los fixtures por defecto si el contenido está corrupto, además de permitir inyectar un `StorageLike` en memoria. |
| Lentitud de la suite de tests por latencia simulada | Medio | Permitir inyectar `minLatencyMs: 0, maxLatencyMs: 0` en los tests unitarios de lógica y probar la latencia (200–500 ms) en tests específicos dedicados a `CA-03`. |

---

## 10. Preguntas abiertas

- Ninguna bloqueante; los contratos de `AuthApiPort`, `SitesApiPort` y `ModulesApiPort` ya han sido consensuados en la planificación del Sprint S02.

---

## 11. Referencias

- Product Backlog: `docs/scrum/product-backlog.md`
- Borrador del Sprint S02: `draft-specs/sprint-02-borrador.md`
- Perfil técnico UI/UX: `.agent/rules/profile-uiux.md`
