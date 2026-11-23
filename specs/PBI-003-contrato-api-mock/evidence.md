# Evidencia y Guía de Consumo — PBI-003 (T01–T06)

> Registro del ciclo TDD (Rojo → Verde), verificación de criterios de aceptación `CA-01` a `CA-04` y guía de consumo del contrato de API y adaptador mock para `PBI-005` y `PBI-006`.
> Fecha de ejecución: 2026-11-23 · Rama: `feature/PBI-003-contrato-api-mock`.

---

## 1. Resumen de Ejecución TDD

### 1.1. Fase Roja (`T03` `#40`)

- **Comando:** `npm test`
- **Resultado:** `3 failed | 7 passed (10)` archivos · `13 failed | 31 passed (44)` tests.
- **Motivo:** Métodos del esqueleto de `LocalStorageMockApiAdapter` no implementados (`Error: Not implemented: register / createSite / getCatalog / login / deleteSite / simulateNextError`), mientras `npm run typecheck` y `npm run lint` compilaban sin errores.

### 1.2. Fase Verde (`T04` `#41` y `T05` `#42`)

| Comando | Resultado |
|---|---|
| `npm test` | **10 archivos pasados, 44 tests en verde** (13 de `PBI-003` + 31 existentes) |
| `npm run typecheck` | OK (`tsc --noEmit`, 0 errores) |
| `npm run lint` | OK (`eslint .`, 0 errores) |

### 1.3. Cobertura de Criterios de Aceptación (100 %)

| Criterio | Test Suite | Casos verificados | Estado |
|---|---|---|---|
| `CA-01` (Implementación 100 % de puertos) | `[PBI-003][CA-01] mock-implements-ports` | Ciclo de `AuthApiPort`, `SitesApiPort` y `ModulesApiPort` | Verde |
| `CA-02` (Persistencia local en `localStorage`) | `[PBI-003][CA-02] mock-local-persistence` | Conservación tras recargar instancia + recuperación ante JSON corrupto | Verde |
| `CA-03` (Latencia configurable 200–500 ms) | `[PBI-003][CA-03] mock-latency-simulation` | Medición de retardo mínimo asíncrono (≥ 200 ms) | Verde |
| `CA-04` (Validación de DTOs y errores HTTP) | `[PBI-003][CA-04] api-contracts-validation` y `[PBI-003][CA-04] mock-error-simulation` | Esquemas DTO + errores normalizados `401`, `404`, `409`, `500` con `ApiError` | Verde |

---

## 2. Guía de Consumo para `PBI-005` (Auth) y `PBI-006` (Dashboard y Catálogo)

### 2.1. Importación de contratos (`src/domain/ports/`)

La capa de aplicación y los casos de uso deben depender únicamente de las interfaces del dominio:

```ts
import type {
  AuthApiPort,
  SitesApiPort,
  ModulesApiPort,
  UserDto,
  SiteDto,
  ModuleDto,
} from '@/domain/ports';
import { isApiError } from '@/domain/ports';
```

### 2.2. Instanciación e inyección del adaptador mock (`src/infrastructure/api/mock/`)

En la raíz de composición (`src/app/`) o en pruebas de integración:

```ts
import {
  createMockApiAdapter,
  InMemoryStorage,
} from '@/infrastructure/api/mock';

// En navegador (persiste en window.localStorage con latencia 200-500 ms):
const apiAdapter = createMockApiAdapter();

// En tests unitarios rápidos y aislados (sin latencia y en memoria):
const testAdapter = createMockApiAdapter({
  storage: new InMemoryStorage(),
  minLatencyMs: 0,
  maxLatencyMs: 0,
});
```

### 2.3. Simulación de errores HTTP y manejo con `isApiError`

```ts
// Forzar un error de red 500 en la siguiente llamada para probar estados de error y reintento:
testAdapter.simulateNextError(500);

try {
  await testAdapter.getCatalog();
} catch (error) {
  if (isApiError(error)) {
    // error.status: 400 | 401 | 404 | 409 | 500
    // error.code: 'NETWORK_ERROR' | 'INVALID_CREDENTIALS' | 'EMAIL_ALREADY_EXISTS' | ...
    console.error(error.status, error.code, error.message);
  }
}
```

### 2.4. Fixtures Iniciales Pre-cargados (`mockFixtures.ts`)

- **Usuario Demo (`INITIAL_MOCK_USERS`):**
  - Email: `demo@shopmaker.local`
  - Password de prueba: `DemoPassword2026!`
- **Sitio Inicial (`INITIAL_MOCK_SITES`):**
  - `Tienda Demo Artesanal` (`tienda-demo-artesanal.shopmaker.local`, estado `'draft'`, categoría `'ecommerce'`).
- **Catálogo Base de Módulos (`INITIAL_MOCK_MODULES`):**
  1. `mod-ecommerce-cart` — *Carrito E-commerce* (`featured`, `v1.2.0`)
  2. `mod-contact-form` — *Formulario de Contacto* (`available`, `v1.0.4`)
  3. `mod-image-gallery` — *Galería de Imágenes* (`available`, `v1.1.0`)
  4. `mod-seo-basic` — *SEO Básico* (`available`, `v1.0.0`)

---

## 3. Trazabilidad de Commits

- `38719de` — `docs(spec): definir requerimientos, plan técnico, tareas y matriz de pruebas para PBI-003 contrato-api-mock`
- `53d9fe2` — `test(api): añadir pruebas de contratos, persistencia local y simulación de red para PBI-003`
- `eeab28b` — `feat(api): implementar puertos de dominio y adaptador mock persistente para PBI-003`
