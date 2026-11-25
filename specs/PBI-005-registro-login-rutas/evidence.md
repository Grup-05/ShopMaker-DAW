# Evidencia — PBI-005 Registro, Inicio de Sesión y Rutas Protegidas

> Registro del ciclo TDD (Rojo → Verde) y verificación de los criterios `CA-01` a `CA-06`.
> Fecha de ejecución: 2026-11-25 · Rama: `feature/PBI-005-registro-login-rutas`.

---

## 1. Resumen de ejecución TDD

| Tarea | Issue | Fase roja | Fase verde |
|---|---|---|---|
| T01 | `#44` | Spec, plan y tareas aprobados | `5382eba` |
| T02 | `#45` | `87a7e51` | — |
| T03 | `#46` | — | `7839522` |
| T04 | `#47` | `7c8b76d` | — |
| T05 | `#48` | — | `1d6a1df` |
| T06 | `#49` | `0735c51` | `fb91153` |

- **Rojo T06:** las suites de `useAuth`, `GuardedRoute` y `UserMenu` fallaron únicamente por ausencia de los módulos del ciclo verde (0 tests ejecutados).
- **Verde T06:** `tests/unit/auth` + `tests/unit/home` → **7 archivos, 56 tests verdes**.
- **Suite completa:** **20 archivos, 107 tests verdes**.
- **E2E:** **8 tests verdes** en Chromium y Firefox.

---

## 2. Cobertura de criterios de aceptación

| Criterio | Test contractual | Casos verificados | Estado |
|---|---|---|---|
| `CA-01` | `[PBI-005][CA-01] register-form-submission` | Campos y `autocomplete`, DTO exacto, confirmación, términos, `aria-live`, error `409` accesible, redirect interno seguro | Verde |
| `CA-02` | `[PBI-005][CA-02] password-strength-live` | Heurística 0–5, etiquetas `Sin contraseña`/`Débil`/`Media`/`Fuerte`, `role="meter"` y un único `role="status"` con `aria-live="polite"` | Verde |
| `CA-03` | `[PBI-005][CA-03] login-success` | `autocomplete` `username`/`current-password`, `rememberMe`, enlace a `/recover`, éxito con redirect seguro, estado de carga | Verde |
| `CA-04` | `[PBI-005][CA-04] login-invalid-credentials` | Error `401` con `role="alert"`, mensaje comprensible y correo conservado | Verde |
| `CA-05` | `[PBI-005][CA-05] guarded-route-redirect` | Invitado en `/dashboard` → `/login?redirect=%2Fdashboard`; autenticado renderiza el hijo; `Loading` con `role="status"` sin redirección; `guest-only` autenticado → `/dashboard` | Verde |
| `CA-06` | `[PBI-005][CA-06] user-menu-header` | Iniciales y nombre, `aria-haspopup="menu"`, `aria-expanded`, menú accesible, `Escape` devuelve el foco, `logout()` y navegación a `/`, integración en la cabecera | Verde |

---

## 3. Accesibilidad y contraste

- `tests/unit/tokens/contrast.test.ts` verifica `--color-success` en tema claro y oscuro con ratio ≥ 4.5:1.
- Medidor de contraseña: `role="meter"` sin `aria-live` y un único nodo vivo `role="status"`.
- Formularios: errores asociados con `aria-describedby`, `aria-invalid` y alertas con `role="alert"`.
- Guardas: indicador `role="status"` durante `Loading`.
- Menú de usuario: `aria-haspopup`, `aria-expanded`, `aria-controls`, `role="menu"`/`role="menuitem"` y foco visible global.

---

## 4. Comandos y resultados

| Comando | Resultado |
|---|---|
| `npx -y node@24 node_modules/vitest/vitest.mjs run tests/unit/auth tests/unit/home` | 7 archivos, 56 tests verdes |
| `npx -y node@24 node_modules/vitest/vitest.mjs run` | 20 archivos, 107 tests verdes |
| `npm run typecheck` | Verde (`tsc --noEmit`) |
| `npm run lint` | Verde (`eslint .`) |
| `npm run build` | Verde (Vite genera `dist/`) |
| `npm run test:e2e` | 8 tests verdes en Chromium y Firefox |

> **Entorno:** el Node del sistema es `22.11.0`; `jsdom@31`/`undici@8` requieren `Node ≥ 22.19`. Los tests de Vitest se ejecutaron con Node 24 mediante `npx -y node@24`. Vite emite un aviso de versión al compilar, pero el build finaliza correctamente.

---

## 5. Decisiones verificadas

- DTOs únicos importados desde `src/domain/ports/`; no hay duplicación en la UI.
- La UI no accede a `localStorage`; la persistencia y el token son responsabilidad de `LocalStorageMockApiAdapter`.
- `AuthProvider` hidrata la sesión con `me()` y distingue `Loading`, `Guest` y `Authenticated`.
- `GuardedRoute` centraliza `protected` y `guest-only` con `replace` y redirect codificado.
- `BrowserRouter` se usa solo en `main.tsx`; los tests emplean `MemoryRouter`.
- `/recover` es una página informativa, fuera del alcance del formulario funcional.

---

## 6. Pendiente de cierre

- Ejecutar `bash scripts/github/pre-pr-gate.sh --pre-pr` con el árbol limpio, token de GitHub válido y rama sincronizada con `origin/develop`.
- Abrir la Pull Request hacia `develop` con `Closes #36` y `Closes #44`–`#49`.
