# ADR-006 — Sesión con `AuthContext`, rutas protegidas con `GuardedRoute` y React Router v7

## Metadatos

| Campo | Valor |
|---|---|
| ID | `ADR-006` |
| Fecha | 2026-11-25 |
| Estado | Aceptado |
| Sprint / PBI | S02 · `PBI-005` (`#36`) |
| Decisores | Equipo Grup-05 (`@Tarrant15` como autor del plan; aprobación en `#44`) |
| Registro | Retroactivo (2026-11-26), reconstruido desde `specs/PBI-005-registro-login-rutas/plan.md` |
| Sustituye a | — |
| Sustituido por | — |

## Contexto

Había que ofrecer registro, login y áreas privadas sin backend real, respetando la arquitectura por capas y la regla de que la UI no calcula permisos definitivos.

## Decisión

1. **Contexto ligero de React** (`AuthContext`, `useAuth()`) con estados `Guest | Loading | Authenticated`; la sesión se hidrata con `AuthApiPort.me()` al montar.
2. **`react-router-dom` v7** (`BrowserRouter` en producción, `MemoryRouter` en tests) con URLs limpias: `/`, `/login`, `/register`, `/recover`, `/dashboard`.
3. **`GuardedRoute`** con modos `protected` (invitado → `/login?redirect=…`) y `guest-only` (autenticado → `/dashboard`); en `Loading` no se redirige.
4. Solo se aceptan redirecciones internas que empiecen por `/` y no por `//` (anti *open redirect*).
5. **Medidor de contraseña** puro en cliente (sin librerías) con `aria-live="polite"`.
6. Requisito de entorno: Node ≥ 22.19.0 (por `jsdom@31` / `undici`).

## Alternativas consideradas

| Alternativa | Ventajas | Inconvenientes | Motivo de descarte |
|---|---|---|---|
| Redux / Zustand | Estado global potente | Complejidad innecesaria | KISS: el estado de sesión es pequeño |
| Router propio con History API | Sin dependencia | Mantenimiento propio | Router v7 da `useNavigate`, `useLocation` y guardas testeables |
| `zxcvbn` para fortaleza | Más preciso | Dependencia | Heurística propia suficiente y accesible |

## Consecuencias

- Positivas: protección de rutas centralizada y testeable; sin dependencias de seguridad adicionales.
- Negativas o deuda asumida: «Recordarme» no diferencia persistencia en el mock; recuperación de contraseña solo informativa; el backend real deberá aplicar *hash* y cookies `HttpOnly`.
- Impacto en pruebas: `tests/unit/auth/*`.
- Impacto en accesibilidad y seguridad: errores con `role="alert"`, estados de carga anunciados.

## Referencias

- `specs/PBI-005-registro-login-rutas/` · Issues `#36`, `#44`–`#49` · PR `#59`
