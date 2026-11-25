# Plan técnico — PBI-005 Registro, Inicio de Sesión y Rutas Protegidas

> Plan técnico SDD para autenticación, sesión persistente y protección de rutas en ShopMaker.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-005` (`#36`) |
| Sprint | `S02` |
| Autor | Jesús Hernández (`@Tarrant15`, Dev B / Product Owner) |
| Fecha | 2026-11-17 |
| Aprobación | 2026-11-25 — T01 (`#44`) |
| Estado | Aprobado |
| Rama | `feature/PBI-005-registro-login-rutas` |
| Spec | `specs/PBI-005-registro-login-rutas/spec.md` |

---

## 1. Resumen de la solución

Se implementan las vistas de `/register`, `/login` y `/recover` con React 19 y TypeScript, más un `AuthContext` ligero que expone `useAuth()`. La UI consume exclusivamente el puerto `AuthApiPort` de `src/domain/ports/`, implementado en desarrollo por el `LocalStorageMockApiAdapter` de `PBI-003`. El enrutado usa `react-router-dom` v7 (`BrowserRouter` en `main.tsx`, `MemoryRouter` en tests) y la protección se centraliza en `GuardedRoute`, con modos `protected` y `guest-only`.

No se duplican DTOs ni se crea un stub de autenticación paralelo: los contratos canónicos ya existen y el adaptador mock persistente está integrado en `develop`.

---

## 2. Alcance y fuera de alcance

**Incluido:** registro, login, medidor accesible de contraseña, sesión (`me`, `login`, `register`, `logout`), guardas de ruta, cabecera dinámica con `UserMenu` y página informativa `/recover`.

**Fuera de alcance:** formulario funcional de recuperación, verificación de email, OAuth, roles/permisos, refresco de token y hash de credenciales en el mock (ver `spec.md` §6).

---

## 3. Decisiones técnicas

| ID | Decisión | Alternativas | Justificación |
|---|---|---|---|
| DT-01 | Contexto ligero de React (`AuthContext`) y hook `useAuth()`. | Redux, Zustand o estado disperso. | KISS: el estado de sesión (`user`, `status`, `login`, `register`, `logout`) es simple y no requiere librerías adicionales. |
| DT-02 | Consumo de `AuthApiPort` como puerto de dominio inyectable. | Llamadas directas a `localStorage` o `fetch` en componentes. | Respeta la arquitectura hexagonal y desacopla la UI de la persistencia mock de `PBI-003`. |
| DT-03 | `GuardedRoute` con modos `protected` y `guest-only`. | Comprobaciones manuales con `useEffect` en cada página. | Centraliza ambas reglas de acceso y evita parpadeos o fugas de vistas privadas. |
| DT-04 | Medidor de fortaleza puro en cliente con heurística accesible. | Librerías externas (`zxcvbn`). | KISS y cero dependencias: evalúa longitud, mayúsculas/minúsculas, dígitos y símbolos con anuncio `aria-live="polite"`. |
| DT-05 | `react-router-dom` v7 con `BrowserRouter` en producción y `MemoryRouter` en tests. | Router propio con History API, hash routing. | Da URLs limpias (`/login`, `/register`, `/dashboard`), `useNavigate`, `useLocation`, query `?redirect=` y guardas testeables sin mantener un router propio. Se instala en T02 como prerrequisito. |
| DT-06 | La sesión se hidrata con `AuthApiPort.me()` al montar el proveedor; el token y la persistencia son responsabilidad del adaptador. | Guardar token/usuario en `localStorage` desde la UI. | Evita duplicar estado persistente y mantiene la UI como consumidora del puerto. `rememberMe` viaja en el DTO; el mock mantiene la sesión en `localStorage` con independencia de la casilla, comportamiento documentado y sustituible por el backend real. |

---

## 4. Arquitectura y estructura por capas

```text
src/
├── main.tsx                              # BrowserRouter + StrictMode
├── app/
│   └── App.tsx                           # <Routes>: /, /login, /register, /recover, /dashboard
├── domain/
│   └── ports/
│       ├── AuthApiPort.ts                # EXISTENTE: UserDto, LoginCredentialsDto, RegisterUserDto, AuthApiPort
│       └── ApiError.ts                   # EXISTENTE: normalización de errores (401, 409, 500...)
├── infrastructure/
│   └── api/mock/
│       └── LocalStorageMockApiAdapter.ts # EXISTENTE: implementación persistente de AuthApiPort
├── features/
│   ├── auth/
│   │   ├── domain/
│   │   │   └── AuthStatus.ts             # 'Guest' | 'Loading' | 'Authenticated' (solo estado de UI)
│   │   ├── application/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── useAuth.ts
│   │   │   └── passwordStrength.ts       # calculatePasswordStrength()
│   │   └── presentation/
│   │       ├── RegisterPage.tsx / .css
│   │       ├── LoginPage.tsx / .css
│   │       ├── RecoverPasswordPage.tsx / .css
│   │       ├── PasswordStrengthMeter.tsx / .css
│   │       ├── GuardedRoute.tsx
│   │       └── UserMenu.tsx / .css
│   ├── dashboard/
│   │   └── presentation/DashboardPage.tsx # EXISTENTE: destino de /dashboard
│   └── home/
│       ├── application/authRoutes.ts      # MODIFICAR: /login, /register, /recover
│       └── presentation/HomePage.tsx      # MODIFICAR: integrar UserMenu
└── shared/
    └── styles/
        ├── tokens.css                     # MODIFICAR (T03): token semántico de éxito para el medidor
        └── primitives.css                 # MODIFICAR (T03): primitiva verde asociada
```

**Regla de dependencias:** `presentation → application → domain` y `presentation → domain/ports`. Ningún componente importa `localStorage` ni el adaptador mock directamente; el adaptador se inyecta en `App.tsx`/tests. Se respeta el test `tests/unit/architecture/layer-boundaries.test.ts`.

---

## 5. Contrato de sesión y estados

```ts
type AuthStatus = 'Guest' | 'Loading' | 'Authenticated';

interface AuthContextValue {
  status: AuthStatus;
  user: UserDto | null;
  login(credentials: LoginCredentialsDto): Promise<UserDto>;
  register(data: RegisterUserDto): Promise<UserDto>;
  logout(): Promise<void>;
}
```

- **Arranque:** `status = 'Loading'`; se llama a `authApi.me()`. Si resuelve → `Authenticated` + `user`; si lanza `ApiError` 401 → `Guest`. Cualquier otro error se registra y deja `Guest` sin romper el render.
- **Login/registro:** delegan en el puerto, actualizan `user` y `status`, y propagan el error a la página para su anuncio accesible.
- **Logout:** llama a `authApi.logout()`, limpia `user` y pasa a `Guest`; la UI navega a `/`.
- **Inyección:** `AuthProvider` recibe `authApi: AuthApiPort` por props. `App.tsx` usa una instancia de `LocalStorageMockApiAdapter`; los tests usan `{ minLatencyMs: 0, maxLatencyMs: 0 }`.
- **Recordarme:** `LoginPage` envía `rememberMe`; no se promete persistencia diferenciada en el mock.

---

## 6. Enrutado y guardas

| Ruta | Componente | Guarda |
|---|---|---|
| `/` | `HomePage` | Pública |
| `/login` | `LoginPage` | `guest-only`: autenticado → `/dashboard` |
| `/register` | `RegisterPage` | `guest-only`: autenticado → `/dashboard` |
| `/recover` | `RecoverPasswordPage` | `guest-only`: autenticado → `/dashboard` |
| `/dashboard` | `DashboardPage` | `protected`: invitado → `/login?redirect=...` |

- `GuardedRoute` usa `useAuth()` y `useLocation()`.
- En modo `protected`, un `Guest` recibe `<Navigate to={`/login?redirect=${encodeURIComponent(pathname + search)}`} replace />`; para `/dashboard` produce exactamente `/login?redirect=%2Fdashboard`.
- En modo `guest-only`, un `Authenticated` recibe `<Navigate to="/dashboard" replace />`.
- En `Loading` no se redirige: se renderiza un indicador con `role="status"` y texto «Comprobando sesión…».
- Tras login/registro, `LoginPage`/`RegisterPage` leen `redirect` de `useSearchParams()`; solo aceptan rutas internas que empiecen por `/` y no por `//` (evita *open redirect*), y por defecto navegan a `/dashboard`.

---

## 7. Medidor de contraseña

```ts
type PasswordStrengthLevel = 'empty' | 'weak' | 'medium' | 'strong';

interface PasswordStrength {
  level: PasswordStrengthLevel;
  score: 0 | 1 | 2 | 3 | 4 | 5;
  label: string; // 'Sin contraseña' | 'Débil' | 'Media' | 'Fuerte'
}

function calculatePasswordStrength(password: string): PasswordStrength;
```

Heurística (máximo 5 puntos): longitud ≥ 8, longitud ≥ 12, mezcla de mayúsculas y minúsculas, al menos un dígito y al menos un símbolo. Niveles: `empty` si la cadena está vacía; `weak` con 0–2 puntos; `medium` con 3; `strong` con 4–5.

`PasswordStrengthMeter` muestra una barra con `role="meter"` (`aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`) y un único nodo de texto con `aria-live="polite"` para evitar anuncios duplicados. Colores: débil con `--color-focus` (rojo), media con `--color-primary`, fuerte con un nuevo `--color-success` (verde AA) añadido en T03 y cubierto por `tests/unit/tokens/contrast.test.ts`.

---

## 8. Estrategia TDD y matriz de trazabilidad

Cada criterio se escribe primero en rojo, se implementa hasta verde y se refactoriza sin cambiar el contrato. Los tests usan `LocalStorageMockApiAdapter` con latencia 0 y `MemoryRouter` cuando hay navegación.

| ID | Requerimiento / Criterio | Tipo | Test contractual | Archivo | Estado |
|---|---|---|---|---|---|
| CA-01 | Registro válido, DTO correcto y redirección | Componente | `[PBI-005][CA-01] register-form-submission` | `tests/unit/auth/RegisterPage.test.tsx` | Verde |
| CA-02 | Medidor visual y accesible de contraseña | Unitario / Componente | `[PBI-005][CA-02] password-strength-live` | `tests/unit/auth/passwordStrength.test.ts` + `RegisterPage.test.tsx` | Verde |
| CA-03 | Login válido con credenciales correctas | Componente | `[PBI-005][CA-03] login-success` | `tests/unit/auth/LoginPage.test.tsx` | Verde |
| CA-04 | Error accesible ante credenciales inválidas | Componente | `[PBI-005][CA-04] login-invalid-credentials` | `tests/unit/auth/LoginPage.test.tsx` | Verde |
| CA-05 | Redirección de invitados y guarda inversa | Integración / Routing | `[PBI-005][CA-05] guarded-route-redirect` | `tests/unit/auth/GuardedRoute.test.tsx` | Verde |
| CA-06 | Cabecera dinámica con avatar y logout | Componente | `[PBI-005][CA-06] user-menu-header` | `tests/unit/auth/UserMenu.test.tsx` | Verde |

**Pruebas de soporte** (sin CA propio, cubren la infraestructura de sesión): `tests/unit/auth/useAuth.test.tsx` para `me()` al montar, `login`, `register`, `logout` y uso fuera del proveedor.

**Cobertura mínima por test:**
- `passwordStrength`: vacío, débil, media, fuerte, etiquetas y monotonía.
- `RegisterPage`: etiquetas, `autocomplete` (`name`, `email`, `new-password`), confirmación distinta, términos obligatorios, `aria-live`, DTO exacto, error 409 accesible y redirección.
- `LoginPage`: `autocomplete` (`username`, `current-password`), `rememberMe`, enlace a `/recover`, éxito, 401 con `role="alert"` conservando el email, estado de carga.
- `GuardedRoute`: `Guest` → `/login?redirect=%2Fdashboard`; `Authenticated` → hijo; `Loading` → sin redirección; `guest-only` → `/dashboard`.
- `UserMenu`: iniciales/nombre, apertura accesible y `logout`.

---

## 9. Archivos previstos

| Archivo | Acción | Tarea |
|---|---|---|
| `package.json` / `package-lock.json` | Añadir `react-router-dom@^7` | T02 |
| `src/domain/ports/AuthApiPort.ts` | Reutilizar sin cambios | — |
| `src/infrastructure/api/mock/LocalStorageMockApiAdapter.ts` | Reutilizar sin cambios | — |
| `src/features/auth/domain/AuthStatus.ts` | Crear | T06 |
| `src/features/auth/application/AuthContext.tsx` | Crear | T06 |
| `src/features/auth/application/useAuth.ts` | Crear | T06 |
| `src/features/auth/application/passwordStrength.ts` | Crear | T03 |
| `src/features/auth/application/safeRedirect.ts` | Crear (sanitización de `redirect`) | T05 |
| `src/features/auth/presentation/RegisterPage.tsx` + `.css` | Crear | T03 |
| `src/features/auth/presentation/LoginPage.tsx` + `.css` | Crear | T05 |
| `src/features/auth/presentation/RecoverPasswordPage.tsx` + `.css` | Crear (informativa) | T06 |
| `src/features/auth/presentation/PasswordStrengthMeter.tsx` + `.css` | Crear | T03 |
| `src/features/auth/presentation/GuardedRoute.tsx` | Crear | T06 |
| `src/features/auth/presentation/UserMenu.tsx` + `.css` | Crear | T06 |
| `src/features/home` → `application/authRoutes.ts` | Modificar a `/login`, `/register`, `/recover` | T06 |
| `src/features/home` → `presentation/HomePage.tsx` | Integrar `UserMenu` | T06 |
| `src/app/App.tsx` | Definir `<Routes>` e inyectar el adaptador | T06 |
| `src/main.tsx` | Envolver en `BrowserRouter` | T06 |
| `src/shared/styles/primitives.css` + `tokens.css` | Añadir verde y `--color-success` | T03 |
| `tests/unit/auth/passwordStrength.test.ts` | Crear (rojo) | T02 |
| `tests/unit/auth/RegisterPage.test.tsx` | Crear (rojo) | T02 |
| `tests/unit/auth/LoginPage.test.tsx` | Crear (rojo) | T04 |
| `tests/unit/auth/GuardedRoute.test.tsx` | Crear (rojo) | T06 |
| `tests/unit/auth/UserMenu.test.tsx` | Crear (rojo) | T06 |
| `tests/unit/auth/useAuth.test.tsx` | Crear (rojo) | T06 |
| `tests/unit/tokens/contrast.test.ts` | Ampliar con `--color-success` | T03 |

---

## 10. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Añadir `react-router-dom` rompe el árbol de dependencias o el build | Baja | Alto | Instalar al inicio de T02, ejecutar `npm run typecheck`, `npm test` y `npm run build` antes de escribir componentes. |
| Tests de navegación frágiles por `window.location` | Media | Medio | Usar `MemoryRouter` + `initialEntries` y aserciones sobre la ruta renderizada, no sobre `window.location`. |
| Latencia del mock vuelve intermitentes los tests | Media | Alto | Inyectar siempre `{ minLatencyMs: 0, maxLatencyMs: 0 }` en tests; nunca usar la instancia por defecto. |
| `aria-live` duplicado (barra + texto) satura al lector de pantalla | Media | Medio | Un solo nodo vivo; la barra usa `role="meter"` sin `aria-live`. |
| Bucle de redirección entre `/login` y `/dashboard` | Media | Alto | Estados explícitos (`Loading` no redirige), `replace` en `Navigate` y tests de ambos modos. |
| Cambiar `authRoutes.ts` afecta a la home | Baja | Bajo | El test existente solo exige `href` no vacío; actualizar el comentario del módulo y verificar `HomePage.test.tsx`. |
| Contraste insuficiente en el medidor | Media | Medio | Añadir `--color-success` con ratio ≥ 4.5:1 y ampliar `contrast.test.ts`. |
| El mock guarda contraseñas ficticias en claro | Alta (conocido) | Bajo en dev | Documentado en RNF-02: solo desarrollo/demo; el backend real hashea. |

---

## 11. Verificación y cierre

**Requisito de entorno:** Node ≥ 22.19.0. `jsdom@31` depende de `undici@8.12.4` (Node ≥ 22.19 y `zlib.createZstdDecompress`); con Node 22.11 la suite no arranca. Verificado en T01 con Node 22.19: 14 archivos y 61 tests verdes.

Antes de abrir PR hacia `develop`:

```bash
npm run typecheck
npm run lint
npm test
npm run test:e2e
bash scripts/github/pre-pr-gate.sh --pre-pr
```

El PR incluirá `Closes #36` y `Closes #44`–`#49`, la matriz de §8 actualizada a «Verde» y la evidencia de CA en `specs/PBI-005-registro-login-rutas/evidence.md`.
