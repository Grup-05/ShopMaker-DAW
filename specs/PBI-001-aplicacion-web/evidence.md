# Evidencia — PBI-001 (T04–T06)

> Registro de los ciclos rojo → verde y de las revisiones manuales. Fecha de ejecución: 2026-11-09; consolidación con el arnés de PBI-004: 2026-11-10. Rama: `feature/PBI-001-aplicacion-web`.

## 1. Arnés utilizado

| Elemento | Valor |
|---|---|
| Runtime | Node.js `v24.18.0`, npm `11.16.0` |
| Test unitario/componente | Vitest `4.1.12` + jsdom + React Testing Library |
| Test E2E | Playwright `1.65.0` (Chromium y Firefox) |
| Servidor E2E | Vite `7.3.8` en `http://localhost:5173` |
| Comandos | `npm test`, `npm run test:e2e`, `npm run typecheck`, `npm run lint`, `npm run build` |

El arnés oficial de PBI-004 ya está integrado en `develop` y esta rama lo adopta como configuración única: `tests/setup.ts`, `tests/unit/` para pruebas unitarias, de componente y de arquitectura, `tests/e2e/` para Playwright, alias `@` y servidor Vite gestionado por `webServer`. La suite de PBI-001 convive con los tests demostrativos de PBI-004 sin duplicar configuración. Las versiones de dependencias se mantienen fijadas en `package.json` y `package-lock.json`.

## 2. Rojo de T04 — smoke test E2E

- **Comando:** `npm run test:e2e`
- **Resultado:** `6 failed` (3 tests × Chromium y Firefox).
- **Servidor E2E:** arrancó correctamente; el fallo fue de aserción de contenido.
- **Motivo:** no existía el heading `ShopMaker` ni los landmarks esperados.
- **Fixture de arranque:** para que el servidor devolviera `200` sin aplicación se usó un `index.html` mínimo con solo `<div id="root"></div>`. En T05 se sustituyó por el punto de entrada real.

Extracto de la salida:

```text
Error: expect(locator).toBeVisible() failed
Locator: getByRole('heading', { name: 'ShopMaker', level: 1 })
Expected: visible
Error: element(s) not found

6 failed
  [chromium] › [PBI-001][CA-01] app-arranque
  [chromium] › [PBI-001][CA-01] home-layout
  [chromium] › [PBI-001][CA-01][RNF-02] minimum-viewport
  [firefox]  › [PBI-001][CA-01] app-arranque
  [firefox]  › [PBI-001][CA-01] home-layout
  [firefox]  › [PBI-001][CA-01][RNF-02] minimum-viewport
```

## 3. Rojo de T05 — límites de arquitectura

- **Comando:** `npm test`
- **Resultado:** `3 failed` suites, `0` tests ejecutados.
- **Motivos:**
  - `HomePage.test.tsx`: no existía `src/features/home/presentation/HomePage.tsx`.
  - `layer-boundaries.test.ts`: faltaba la capa `presentation` y no había archivos que inspeccionar.
  - `client-boundary.test.ts`: no había código de cliente que inspeccionar.

Extracto:

```text
FAIL  tests/unit/home/HomePage.test.tsx
Error: Failed to resolve import "../presentation/HomePage"

FAIL  tests/unit/architecture/layer-boundaries.test.ts
AssertionError: Falta la capa presentation: expected false to be true

FAIL  tests/unit/architecture/client-boundary.test.ts
AssertionError: expected 0 to be greater than 0
```

> Los archivos se trasladaron desde `src/features/home/tests/` y `e2e/` a `tests/unit/` y `tests/e2e/` al consolidar el arnés de PBI-004. Los nombres contractuales de los tests no cambiaron.

## 4. Verde de T05/T06

| Comando | Resultado |
|---|---|
| `npm test` | 4 archivos, **17 tests pasados** (15 de PBI-001 + 2 demostrativos de PBI-004) |
| `npm run test:e2e` | **8 tests pasados** (4 × Chromium y Firefox, incluido el smoke de PBI-004) |
| `npm run typecheck` | OK, sin errores |
| `npm run lint` | OK, sin errores |
| `npm run build` | OK; `dist/index.html` 0,56 kB, CSS 2,94 kB, JS 224,66 kB |

Tests automatizados por nombre contractual:

- E2E PBI-001: `app-arranque`, `home-layout`, `minimum-viewport`.
- E2E PBI-004: smoke de arranque (`[PBI-004][CA-03]`).
- Componente: `navigation-destinations`, `empty-pages-message`, `preview-instruction`, `select-page`, `selection-clears-instruction`, `keyboard-navigation`, `layout-button-does-not-select`, `create-button-inert`, `inert-controls-focusable`, `theme-button-placement`.
- Arquitectura: `layer-boundaries`, `client-browser-only`.
- PBI-004: `slugify` (demostrativo TDD).

## 5. Revisiones manuales de accesibilidad

Ejecutadas con un script Playwright sobre Chromium y Firefox.

| Revisión | Resultado |
|---|---|
| `focus-visible` | Primer enlace «Iniciar sesión» con contorno `solid 3px rgb(185, 28, 28)` en ambos navegadores. |
| Contraste de texto | Cuerpo `13,75:1`; enlace de navegación `6,7:1`; botón primario `6,7:1`. Cumple WCAG AA. |
| `zoom-200` | Proxy de viewport `512×360` (equivalente CSS al 200 % de `1024×720`): sin scroll horizontal y con heading, navegación, `main` y aside visibles en ambos navegadores. |

> La comprobación de zoom es un proxy de viewport, no una emulación del zoom nativo del navegador. Se deja constancia para la revisión humana final.

## 6. Dependencias y límites conocidos

- **PBI-005 (rutas de acceso):** los enlaces «Iniciar sesión» y «Registrarse» usan destinos provisionales (`#iniciar-sesion` y `#registrarse`) definidos en `src/features/home/application/authRoutes.ts`. No se inventan URLs de producto. El test `navigation-destinations` verifica presencia, semántica y ausencia de enlace de contactos; las rutas exactas se reforzarán cuando PBI-005 las publique.
- **PBI-004 (arnés):** consolidado. La rama adopta la configuración oficial integrada en `develop` (`tests/setup.ts`, `tests/unit/`, `tests/e2e/`, alias `@`); la suite de PBI-001 se ejecuta con los mismos comandos del proyecto.
- **PBI-002 (tema):** el botón «Cambiar tema» solo se presenta; no implementa alternancia ni anuncio de estado.
- **CSP/hosting:** fuera del alcance de PBI-001; corresponde a T07 en S02.
