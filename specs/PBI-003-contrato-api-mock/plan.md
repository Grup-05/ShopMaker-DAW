# Plan técnico — PBI-003 Definir el contrato de API y el adaptador mock persistente

> El plan conecta la especificación de `PBI-003` con la arquitectura de Puertos y Adaptadores, la estrategia de persistencia en `localStorage` y la matriz de trazabilidad TDD.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-003` (`#4`) |
| Spec | `specs/PBI-003-contrato-api-mock/spec.md` |
| Autor | Francisco Tomás (`@FSolaje`, Dev A) |
| Fecha | 2026-11-23 |
| Estado | En revisión |

---

## 1. Resumen de la solución

Se implementa una arquitectura **Hexagonal (Puertos y Adaptadores)** donde los contratos de frontera (`AuthApiPort`, `SitesApiPort`, `ModulesApiPort`) y el modelo de error normalizado (`ApiError`) residen en `src/domain/ports/` sin dependencias externas. En la capa de infraestructura (`src/infrastructure/api/mock/`) se construye el adaptador `LocalStorageMockApiAdapter` (junto con un contenedor de almacenamiento `StorageLike` compatible con `window.localStorage` y con un `InMemoryStorage` para entornos sin DOM), provisto de semillas iniciales (fixtures), latencia asíncrona configurable (200–500 ms por defecto) y simulación determinista de errores HTTP (`400`, `401`, `404`, `409`, `500`).

---

## 2. Decisiones técnicas

| ID | Decisión | Alternativas | Justificación |
|---|---|---|---|
| DT-01 | Ubicar los puertos compartidos en `src/domain/ports/` (`AuthApiPort`, `SitesApiPort`, `ModulesApiPort`, `ApiError`) | Duplicar puertos dentro de cada feature (`src/features/auth`, `src/features/dashboard`) | Coincide con la estructura consensuada del Sprint S02 (#39) y permite que `PBI-005` y `PBI-006` importen los mismos contratos desde una ruta canónica única. |
| DT-02 | Abstracción `StorageLike` (`getItem`, `setItem`, `removeItem`, `clear`) con `window.localStorage` por defecto y fallback en memoria | Uso acoplado y directo de `window.localStorage` o `IndexedDB` | `localStorage` cubre síncrona y fiablemente el volumen de datos de usuarios, sitios y módulos del mock, y la interfaz `StorageLike` permite pruebas unitarias aisladas y deterministas. |
| DT-03 | Latencia configurable `{ minLatencyMs, maxLatencyMs }` (por defecto `200`–`500` ms en runtime) | Retardo fijo harcodeado en cada método | Cumple el criterio `CA-03` (200–500 ms) para observar estados de carga en la UI, permitiendo configurar `0` ms o valores exactos en pruebas unitarias para mantener la suite rápida. |
| DT-04 | Clase `ApiError` con `status` (`400 \| 401 \| 404 \| 409 \| 500`), `code` y `message` + control de fallos simulados (`failNextRequestWith` / triggers deterministas) | Lanzar `Error` genérico con strings | Permite a la UI de `PBI-005` y `PBI-006` distinguir de forma tipada entre credenciales inválidas (`401`), duplicados (`409`), recursos no encontrados (`404`) y caídas de red (`500`). |

---

## 3. Arquitectura y capas

- **Presentación:** No se modifican componentes visuales en este PBI (responsabilidad de `PBI-005` y `PBI-006`).
- **Aplicación/estado:** Consumirá los puertos expuestos por `src/domain/ports/`.
- **Dominio (`src/domain/ports/`):** Interfaces puras `AuthApiPort`, `SitesApiPort`, `ModulesApiPort`, DTOs inmutables y modelo de error `ApiError`.
- **Infraestructura (`src/infrastructure/api/mock/`):**
  - `LocalStorageMockApiAdapter`: implementa `AuthApiPort`, `SitesApiPort` y `ModulesApiPort`.
  - `mockFixtures.ts`: semillas deterministas iniciales de usuarios demo, sitios y catálogo de módulos.
  - `storage.ts`: adaptador `StorageLike` (`InMemoryStorage` y resolución segura de `localStorage`).

### Dependencias permitidas

```text
presentación → aplicación → dominio (src/domain/ports/)
infraestructura (src/infrastructure/api/mock/) → dominio (src/domain/ports/) y shared (src/shared/lib/)
```

Prohibido: `dominio` → `infraestructura`, `presentación` → `infraestructura` directa, o cualquier uso de módulos de Node en `src/`.

---

## 4. Archivos y estructura prevista

```text
src/
├── domain/
│   └── ports/
│       ├── ApiError.ts
│       ├── AuthApiPort.ts
│       ├── ModulesApiPort.ts
│       ├── SitesApiPort.ts
│       └── index.ts
└── infrastructure/
    └── api/
        └── mock/
            ├── LocalStorageMockApiAdapter.ts
            ├── mockFixtures.ts
            ├── storage.ts
            └── index.ts
tests/
└── unit/
    └── api/
        ├── api-contracts.test.ts
        ├── mock-persistence.test.ts
        └── mock-network-simulation.test.ts
```

| Archivo / módulo | Responsabilidad |
|---|---|
| `src/domain/ports/AuthApiPort.ts` | Contrato y DTOs de autenticación (`UserDto`, `LoginCredentialsDto`, `RegisterUserDto`, `AuthResponseDto`, `AuthApiPort`). |
| `src/domain/ports/SitesApiPort.ts` | Contrato y DTOs de gestión de sitios (`SiteStatus`, `SiteDto`, `CreateSiteDto`, `SitesApiPort`). |
| `src/domain/ports/ModulesApiPort.ts` | Contrato y DTOs del catálogo de módulos (`ModuleStatus`, `ModuleDto`, `ModulesApiPort`). |
| `src/domain/ports/ApiError.ts` | Error tipado y normalizado de frontera (`ApiError`, códigos HTTP `400`, `401`, `404`, `409`, `500`). |
| `src/domain/ports/index.ts` | Punto de entrada público de todos los puertos y DTOs de frontera. |
| `src/infrastructure/api/mock/mockFixtures.ts` | Datos semilla deterministas (usuario demo, sitios de ejemplo y catálogo inicial de módulos). |
| `src/infrastructure/api/mock/storage.ts` | Abstracción `StorageLike`, `InMemoryStorage` y acceso seguro a `localStorage`. |
| `src/infrastructure/api/mock/LocalStorageMockApiAdapter.ts` | Implementación completa de los 3 puertos con persistencia JSON, latencia configurable y simulación de errores. |
| `src/infrastructure/api/mock/index.ts` | Factoría `createMockApiAdapter` y exportaciones públicas del mock. |

---

## 5. Estrategia de pruebas

- **Unitarias y de Contrato (`tests/unit/api/`):**
  - Verificación de estructura y tipos de todos los DTOs devueltos por `AuthApiPort`, `SitesApiPort` y `ModulesApiPort`.
  - Verificación de reglas de negocio en el mock (registro, login, persistencia de sesión, alta/baja de sitios con slug de subdominio `*.shopmaker.local`, listado e instalación de módulos).
  - Verificación de persistencia entre distintas instancias del adaptador compartiendo el mismo `StorageLike` / `localStorage`.
  - Verificación de latencia asíncrona configurable (rango 200–500 ms).
  - Verificación de errores HTTP normalizados (`401`, `404`, `409`, `500`).
- **Arquitectura (`tests/unit/architecture/`):**
  - Cumplimiento de `client-boundary.test.ts` (ausencia de APIs de Node y de patrones de secretos en `src/`).

### Datos y mocks

- **Fixtures:** `src/infrastructure/api/mock/mockFixtures.ts`.
- **Claves de almacenamiento local:** `shopmaker.mock.state.v1`.
- **Seguridad:** credenciales ficticias de prueba (`demo@shopmaker.local`), sin tokens reales ni información personal.

---

## 6. Matriz de trazabilidad spec-test

| ID | Requerimiento / Criterio | Tipo de prueba | Test previsto | Archivo de prueba | Estado |
|---|---|---|---|---|---|
| RF-01 / CA-01 | `AuthApiPort`: registro, login, `me`, `recoverPassword` y `logout` cumplen el contrato | Unidad / Contrato | `[PBI-003][CA-01] mock-implements-ports` | `tests/unit/api/api-contracts.test.ts` | Pendiente |
| RF-02 / CA-01 | `SitesApiPort`: listado, creación con subdominio `.shopmaker.local` y borrado de sitios | Unidad / Contrato | `[PBI-003][CA-01] mock-implements-ports` | `tests/unit/api/api-contracts.test.ts` | Pendiente |
| RF-03 / CA-01 | `ModulesApiPort`: catálogo inicial e instalación de módulos por sitio | Unidad / Contrato | `[PBI-003][CA-01] mock-implements-ports` | `tests/unit/api/api-contracts.test.ts` | Pendiente |
| CA-04 | Validación estricta de estructura e inmutabilidad de DTOs de frontera | Contrato | `[PBI-003][CA-04] api-contracts-validation` | `tests/unit/api/api-contracts.test.ts` | Pendiente |
| RF-01..03 / CA-02 | Persistencia en `localStorage` de usuarios, sesión, sitios y módulos tras recargar instancia | Integración local | `[PBI-003][CA-02] mock-local-persistence` | `tests/unit/api/mock-persistence.test.ts` | Pendiente |
| RF-04 / CA-03 | Simulación de latencia de red configurable (200–500 ms) | Unidad / Asíncrona | `[PBI-003][CA-03] mock-latency-simulation` | `tests/unit/api/mock-network-simulation.test.ts` | Pendiente |
| RF-05 / CA-04 | Simulación determinista de errores HTTP (`401`, `404`, `409`, `500`) con `ApiError` | Unidad / Contrato | `[PBI-003][CA-04] mock-error-simulation` | `tests/unit/api/mock-network-simulation.test.ts` | Pendiente |

---

## 7. Plan TDD por incrementos

| Incremento | Comportamiento | Test rojo | Implementación mínima | Refactor |
|---|---|---|---|---|
| 1 (`T02` + `T03`) | Contratos de puertos (`AuthApiPort`, `SitesApiPort`, `ModulesApiPort`) y validación de DTOs | `[PBI-003][CA-04] api-contracts-validation` y `[PBI-003][CA-01] mock-implements-ports` | Crear interfaces en `src/domain/ports/` e implementación base en `LocalStorageMockApiAdapter` | Extraer helpers de validación y normalización de subdominios (`slugify`) |
| 2 (`T03` + `T04`) | Persistencia en `localStorage` entre recargas y recuperación ante JSON corrupto | `[PBI-003][CA-02] mock-local-persistence` | Implementar `storage.ts`, hidratación de `mockFixtures.ts` y guardado en `localStorage` | Unificar serialización de estado en un único repositorio interno |
| 3 (`T05`) | Simulación de latencia (200–500 ms) y errores HTTP (`401`, `404`, `409`, `500`) | `[PBI-003][CA-03] mock-latency-simulation` y `[PBI-003][CA-04] mock-error-simulation` | Implementar `simulateLatency()`, triggers de error y rechazos tipados con `ApiError` | Simplificar opciones de configuración y limpiar duplicidad en manejo de errores |

---

## 8. Riesgos técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Conflictos al integrar con `chore/sprint-02-kickoff` | Media | Medio | Mantener exactamente los mismos nombres de archivos y firmas en `src/domain/ports/{AuthApiPort,SitesApiPort,ModulesApiPort}.ts`. |
| Flakiness en pruebas de tiempo (`setTimeout`) | Media | Medio | Comprobar límite inferior con margen de tolerancia de timers o usar configuración explícita de latencia en el test dedicado a `CA-03`. |

---

## 9. Checklist de aprobación del plan

- [x] La arquitectura respeta SOLID y KISS.
- [x] No se introducen dependencias externas nuevas.
- [x] La matriz spec-test cubre todos los RF (`RF-01` a `RF-05`) y CA (`CA-01` a `CA-04`).
- [x] Hay estrategia para estados de error (`401`, `404`, `409`, `500`), vacío y persistencia.
- [x] Hay estrategia de seguridad (ausencia de secretos y sanitización de subdominios).
- [x] El plan es implementable dentro del Sprint S02.
