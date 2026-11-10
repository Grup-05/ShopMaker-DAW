# Plan técnico — PBI-004 Configurar el arnés de pruebas y el hook local de calidad

> Plan de arquitectura técnica, configuración de herramientas y matriz de trazabilidad para el arnés de pruebas y calidad.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-004` |
| Spec | `specs/PBI-004-arnes-pruebas/spec.md` |
| Autor | Fran Tomás (`@FSolaje`, Dev A / PO) |
| Fecha | 2026-11-10 |
| Estado | Plan completado |

---

## 1. Resumen de la solución

Implementar la infraestructura completa de pruebas para el frontend React + TypeScript + Vite mediante dos herramientas complementarias:
1. **Vitest + React Testing Library (RTL) + jsdom:** Para pruebas unitarias rápidas de dominio, utilidades y componentes visuales con renderizado simulado del DOM.
2. **Playwright:** Para pruebas de integración de navegador real (*smoke test* y flujos críticos de la SPA), configurado para gestionar de forma autónoma el ciclo de vida del servidor web local de Vite.
3. **TypeScript + ESLint:** Para validación estática de tipos y calidad de código.
4. **Hook local `.agent/hooks/pre-commit-local.sh`:** Para integrar las puertas de calidad en el ciclo de Git local de cada desarrollador.

---

## 2. Decisiones técnicas

| ID | Decisión | Alternativas consideradas | Justificación |
|---|---|---|---|
| **DT-01** | **Vitest como test runner principal.** | Jest, Mocha. | Integración nativa con la configuración de Vite, rendimiento ultra-rápido con ESM y soporte nativo de TypeScript sin transpilaciones intermedias lentas. |
| **DT-02** | **React Testing Library con consultas de accesibilidad.** | Enzyme, shallow rendering. | Promueve pruebas centradas en el comportamiento del usuario y la accesibilidad (WCAG 2.1 AA) mediante roles semánticos (`getByRole`) en lugar de detalles de implementación internos. |
| **DT-03** | **Playwright para integración y pruebas E2E.** | Cypress, Selenium. | Soporte rápido y headless de Chromium y Firefox en Linux/macOS/Windows, integración nativa de `webServer` para arrancar y cerrar Vite automáticamente, y excelente aislamiento. |
| **DT-04** | **Hook local ejecutable desacoplado del núcleo.** | Forzar la suite completa dentro del hook universal `.agent/hooks/pre-commit`. | Respeta la inmutabilidad de la gobernanza constitucional: `.agent/hooks/pre-commit` actúa como orquestador seguro y delega la ejecución de calidad en `.agent/hooks/pre-commit-local.sh`, que puede evolucionar por proyecto sin romper la paridad de `sync-governance.sh`. |
| **DT-05** | **`jsdom` como entorno de DOM virtual.** | `happy-dom`. | `jsdom` ofrece la mayor fidelidad de estándares W3C y compatibilidad total con eventos y consultas complejas de React Testing Library. |
| **DT-06** | **Comandos estandarizados en `package.json`.** | Scripts bash aislados. | Facilita la interoperabilidad y el estándar universal de la comunidad Node (`npm test`, `npm run test:e2e`, `npm run typecheck`, `npm run lint`). |

---

## 3. Arquitectura del arnés y capas de verificación

```text
┌────────────────────────────────────────────────────────┐
│            PUERTA DE CALIDAD LOCAL (Git Hook)          │
│         .agent/hooks/pre-commit-local.sh               │
└───────────────┬────────────────────────┬───────────────┘
                │                        │
       ┌────────▼────────┐      ┌────────▼────────┐
       │   Typecheck     │      │     Linter      │
       │ (tsc --noEmit)  │      │  (eslint .)     │
       └─────────────────┘      └─────────────────┘
                │
       ┌────────▼────────────────────────────────────────┐
       │             SUITE DE PRUEBAS LOCAL              │
       │                   (npm test)                    │
       ├────────────────────────┬────────────────────────┤
       │   Vitest + RTL (DOM)   │    Playwright (E2E)    │
       │   - Tests unitarios    │    - Smoke test app    │
       │   - Componentes        │    - Servidor Vite     │
       │   - Accesibilidad AA   │    - Chromium / FF     │
       └────────────────────────┴────────────────────────┘
```

---

## 4. Archivos y estructura prevista

```text
ShopMaker-DAW/
├── vitest.config.ts                  # Configuración de Vitest, plugins, jsdom y setup
├── playwright.config.ts              # Configuración de Playwright (webServer Vite, navegadores)
├── package.json                      # Scripts de ejecución y dependencias de test
├── tsconfig.json                     # Configuración de TypeScript con soporte de JSX/types
├── .eslintrc.cjs / eslint.config.js  # Reglas de linting del frontend
├── .agent/
│   └── hooks/
│       └── pre-commit-local.sh       # Hook ejecutable local invocado por pre-commit universal
└── tests/
    ├── setup.ts                      # Setup global de RTL (@testing-library/jest-dom)
    ├── unit/
    │   └── example.spec.ts           # Test unitario demostrativo del ciclo TDD
    └── e2e/
        └── smoke.spec.ts             # Smoke test de arranque de la SPA
```

---

## 5. Matriz de trazabilidad spec-test

| ID Criterio | Requerimiento Cubierto | Tipo de Prueba | Archivo de Prueba / Verificación | Comando de Ejecución | Estado |
|---|---|---|---|---|---|
| **CA-01** | Comando único de suite | Integración / Configuración | `package.json` | `npm test` | Verificado |
| **CA-02** | Aislamiento y determinismo sin red | Unitario / Configuración | `tests/setup.ts`, `vitest.config.ts` | `npm run test:unit` | Verificado |
| **CA-03** | Arnés E2E con Playwright y arranque de Vite | E2E / Integración | `tests/e2e/smoke.spec.ts` | `npm run test:e2e` | Verificado |
| **CA-04** | Demostración TDD rojo → verde | Unitario / Demostrativo | `tests/unit/example.spec.ts` | `npm test -- example.spec.ts` | Verificado |
| **CA-05** | Hook local de pre-commit operativo | Sistema / Git Hook | `.agent/hooks/pre-commit-local.sh` | `bash .agent/hooks/pre-commit-local.sh` | Verificado |

---

## 6. Comandos estándar del proyecto

Los scripts acordados que se registrarán en `package.json` son:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:unit": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```
