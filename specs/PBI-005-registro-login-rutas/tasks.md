# Tareas TDD — PBI-005 Registro, Inicio de Sesión y Rutas Protegidas

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-005` (`#36`) |
| Sprint | `S02` |
| Responsable | Jesús Hernández (`@Tarrant15`, Dev B / Product Owner) |
| Estimación total | 28 h |
| Estado | T01 aprobada — T02 a T06 pendientes de ejecución TDD |
| Aprobación T01 | 2026-11-25 (`#44`) |

---

## 0. Prerrequisitos verificados

- `AuthApiPort` disponible en `src/domain/ports/AuthApiPort.ts` (`UserDto`, `LoginCredentialsDto`, `RegisterUserDto`, `AuthResponseDto`).
- `LocalStorageMockApiAdapter` persistente y determinista en `src/infrastructure/api/mock/`.
- `DashboardPage` integrado en `src/features/dashboard/presentation/DashboardPage.tsx`.
- `tests/setup.ts` mockea `localStorage` y `matchMedia`; vitest usa `jsdom`.
- No hay router instalado: se añade `react-router-dom@^7` al inicio de T02 (DT-05).
- **Node ≥ 22.19.0 obligatorio.** `jsdom@31` arrastra `undici@8.12.4`, que exige Node ≥ 22.19 y usa `zlib.createZstdDecompress`. Con Node 22.11 la suite falla al arrancar los workers (`ERR_REQUIRE_ESM` / `bind` de `undefined`). Verificado en T01: con `npx -y node@22.19.0 node_modules/vitest/vitest.mjs run` → **14 archivos, 61 tests verdes**.

---

## 1. Desglose de tareas y ciclos TDD

### T01 — Spec, plan técnico y matriz de autenticación (`#44`, 4 h) — Aprobada

- [x] Redactar `spec.md` con historias, flujos, RF/RNF y criterios CA-01 a CA-06.
- [x] Redactar `plan.md` con decisiones DT-01 a DT-06, arquitectura por capas y matriz spec-test.
- [x] Redactar `tasks.md` con los ciclos TDD y los nombres contractuales de las pruebas.
- [x] Cerrar DT-05: `react-router-dom` v7 (`BrowserRouter` en producción, `MemoryRouter` en tests).
- [x] Cerrar DT-06: sesión hidratada con `AuthApiPort.me()`; token y persistencia delegados en el adaptador.
- [x] Eliminar del plan los DTOs duplicados (`features/auth/domain/User.ts`, `AuthCredentials.ts`) y el `inMemoryAuthStub`; se reutilizan `domain/ports` y el adaptador de `PBI-003`.
- [x] Corregir RNF-02: el mock guarda credenciales ficticias en claro y es solo para desarrollo/demo.
- [x] Declarar `/recover` como página informativa fuera de alcance (sin formulario ni `recoverPassword()`).
- [x] Trazar CA-01 a CA-06 a nombre contractual y archivo de test concreto.
- [x] Verificar `npm run typecheck` y `npm run lint` en verde; `npm test` en verde con Node 22.19 (61 tests).
- [ ] Alinear el Node local/CI a ≥ 22.19.0 y declararlo en `package.json` (`engines`) o `.nvmrc`.
- [x] Commit `docs(spec): aprobar spec, plan tecnico y trazabilidad de PBI-005 (#44)` — `5382eba`.

**DoD T01:** cero decisiones abiertas; matriz completa; `npm run typecheck`, `npm run lint` y `npm test` verdes con Node ≥ 22.19; issue `#44` cerrada con enlace al commit.

---

### T02 — Ciclo TDD 1, rojo: registro y medidor de contraseña (`#45`, 4 h)

**Paso 0 (prerrequisito):** `npm install react-router-dom@^7` y verificar `npm run typecheck`.

- [x] Instalar `react-router-dom@^7` (`7.18.7`).
- [x] `tests/unit/auth/passwordStrength.test.ts`:
  - vacío → `empty` / «Sin contraseña»;
  - `'abc'` → `weak`;
  - `'Abcdef12'` → `medium` (3 puntos);
  - `'Abcdef12!'` → `strong` (4 puntos);
  - etiquetas y monotonía del `score` (0–5).
- [x] `tests/unit/auth/RegisterPage.test.tsx` (rojo, `MemoryRouter` + adaptador con latencia 0):
  - etiquetas `<label>` para nombre, email, contraseña, confirmación y términos;
  - `autocomplete="name"`, `autocomplete="email"`, `autocomplete="new-password"`;
  - confirmación distinta → error asociado con `aria-describedby`;
  - términos sin marcar → error accesible y sin llamada al puerto;
  - medidor con `aria-live="polite"` que anuncia el nivel;
  - envío válido → `register({ name, email, password, acceptTerms: true })` y navegación a `/dashboard`;
  - error 409 → `role="alert"` sin perder los datos.
- [x] Verificar rojo: `npx vitest run tests/unit/auth` falla por ausencia de `passwordStrength.ts`, `PasswordStrengthMeter` y `RegisterPage` (2 suites, 0 tests; solo errores de resolución de módulos).
- [x] Commit `test(auth): anadir pruebas rojas de registro y medidor de clave` — `87a7e51`.

**Estado T02:** rojo verificado. `npm run lint` en verde; `npm run typecheck` solo reporta los dos módulos pendientes de T03.

---

### T03 — Ciclo TDD 1, verde: registro y medidor accesible (`#46`, 6 h)

- [x] Implementar `src/features/auth/application/passwordStrength.ts` con `calculatePasswordStrength()` y `PasswordStrengthLevel`.
- [x] Implementar `PasswordStrengthMeter.tsx` + `.css`: barra con `role="meter"` y un único nodo `aria-live="polite"`.
- [x] Añadir primitiva verde y token `--color-success` en `primitives.css`/`tokens.css`; ampliar `tests/unit/tokens/contrast.test.ts` (≥ 4.5:1).
- [x] Implementar `RegisterPage.tsx` + `.css` con validación de email, longitud mínima 8, confirmación y términos; estados de carga y error accesibles.
- [x] Pasar T02 a verde y refactorizar sin cambiar contratos.
- [x] Verificar: `npx vitest run tests/unit/auth tests/unit/tokens` → 3 archivos, 25 tests verdes.
- [x] Verificar suite completa: `npx vitest run` → 16 archivos, 82 tests verdes; `npm run typecheck` y `npm run lint` en verde.
- [x] Commit `feat(auth): implementar pagina de registro y medidor accesible`.

**Estado T03:** verde. CA-01 y CA-02 cubiertos y trazados.

---

### T04 — Ciclo TDD 2, rojo: login accesible (`#47`, 4 h)

- [x] `tests/unit/auth/LoginPage.test.tsx` (rojo):
  - `autocomplete="username"` y `autocomplete="current-password"`;
  - casilla «Recordarme» y envío de `rememberMe`;
  - enlace accesible «Recuperar contraseña» con `href="/recover"`;
  - login válido → `login({ email, password, rememberMe })`, estado `Authenticated` y navegación a `/dashboard`;
  - respeto de `?redirect=%2Fdashboard` y rechazo de destinos externos;
  - error 401 → `role="alert"` conservando el email;
  - estado de carga: botón deshabilitado y texto accesible.
- [x] Verificar rojo: `npx vitest run tests/unit/auth/LoginPage.test.tsx` falla por ausencia de `LoginPage` (1 suite, 0 tests; solo error de resolución del módulo).
- [x] Commit `test(auth): anadir pruebas rojas de login accesible`.

**Estado T04:** rojo verificado. `npm run typecheck` solo reporta el módulo pendiente de T05.

---

### T05 — Ciclo TDD 2, verde: página de inicio de sesión (`#48`, 5 h)

- [ ] Implementar `LoginPage.tsx` + `.css` con etiquetas semánticas, `rememberMe`, enlace a `/recover`, estado de carga y alerta accesible.
- [ ] Gestionar `ApiError` 401/500 con mensaje comprensible y `role="alert"`.
- [ ] Navegar a `redirect` interno validado o a `/dashboard`.
- [ ] Pasar T04 a verde y revisar tabulación/teclado.
- [ ] Verificar: `npx vitest run tests/unit/auth`.

**Commit:** `feat(auth): implementar pagina de inicio de sesion accesible`

---

### T06 — Ciclo TDD 3: sesión, guardas, cabecera y enrutado (`#49`, 5 h)

**Rojo**

- [ ] `tests/unit/auth/useAuth.test.tsx`: `me()` al montar (`Loading` → `Authenticated`/`Guest`), `login`, `register`, `logout` y error al usar el hook fuera del proveedor.
- [ ] `tests/unit/auth/GuardedRoute.test.tsx`:
  - `Guest` en `/dashboard` → `/login?redirect=%2Fdashboard`;
  - `Authenticated` → renderiza el hijo;
  - `Loading` → indicador `role="status"` sin redirección;
  - modo `guest-only`: `Authenticated` en `/login` → `/dashboard`.
- [ ] `tests/unit/auth/UserMenu.test.tsx`: iniciales/nombre, menú accesible y «Cerrar sesión» que invoca `logout()` y navega a `/`.
- [ ] Verificar rojo.

**Verde**

- [ ] Implementar `AuthStatus.ts`, `AuthContext.tsx` y `useAuth.ts` con inyección de `AuthApiPort`.
- [ ] Implementar `GuardedRoute.tsx` con modos `protected` y `guest-only`, `replace` y sanitización de `redirect`.
- [ ] Implementar `UserMenu.tsx` + `.css` e integrarlo en `HomePage.tsx`.
- [ ] Implementar `RecoverPasswordPage.tsx` + `.css` (informativa, enlace a `/login`).
- [ ] Actualizar `authRoutes.ts` a `/login`, `/register`, `/recover`.
- [ ] Definir `<Routes>` en `App.tsx`, inyectar `LocalStorageMockApiAdapter` y envolver en `BrowserRouter` en `main.tsx`.
- [ ] Pasar T06 a verde.

**Refactor**

- [ ] Revisar parpadeos (`Loading`), foco visible y anuncios accesibles.
- [ ] Verificar: `npx vitest run tests/unit/auth tests/unit/home`.

**Commit:** `feat(auth): implementar useAuth, GuardedRoute, UserMenu y rutas protegidas`

---

## 2. Definición de Hecho (DoD) de la feature

- [ ] CA-01 a CA-06 con test automatizado y en verde.
- [ ] `tests/unit/auth/` cubre registro, login, medidor, sesión, guardas y cabecera.
- [ ] Contraste WCAG AA verificado, incluido `--color-success` del medidor.
- [ ] Sin duplicación de DTOs: la UI importa desde `src/domain/ports/`.
- [ ] Sin acceso directo a `localStorage` desde componentes.
- [ ] `npm run typecheck`, `npm run lint`, `npm test` y `npm run test:e2e` en verde.
- [ ] `bash scripts/github/pre-pr-gate.sh --pre-pr` superado.
- [ ] Matriz de `plan.md` §8 actualizada a «Verde» y `evidence.md` creado con la evidencia de CA.
- [ ] Pull Request hacia `develop` con `Closes #36` y `Closes #44`–`#49`, aprobación de `CODEOWNERS`.
