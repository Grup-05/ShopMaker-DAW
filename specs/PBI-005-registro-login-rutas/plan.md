# Plan técnico — PBI-005 Registro, Inicio de Sesión y Rutas Protegidas

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-005` |
| Sprint | `S02` |
| Autor | Jesús Hernández (`@Tarrant15`, Dev B / Product Owner) |
| Fecha | 2026-11-17 |
| Estado | Borrador inicial — pendiente de revisión |

---

## 1. Resumen de la solución

Implementar las vistas de `/register` y `/login` utilizando React y TypeScript, integradas mediante una capa de aplicación desacoplada (`application/auth/`) que interactúa con el puerto `domain/ports/AuthApiPort`. Durante el desarrollo de la interfaz, el servicio consumirá un stub local en memoria; posteriormente se conectará al adaptador mock persistente de `PBI-003`. La protección de rutas se implementará con un componente `GuardedRoute` y el estado global mediante un contexto de autenticación ligero `AuthContext` con su hook `useAuth()`.

---

## 2. Decisiones técnicas

| ID | Decisión | Alternativas | Justificación |
|---|---|---|---|
| DT-01 | Contexto ligero de React (`AuthContext`) y hook `useAuth()`. | Redux, Zustand o estado disperso. | KISS: el estado de sesión (`user`, `status`, `login`, `logout`) es simple y no requiere librerías pesadas adicionales. |
| DT-02 | Consumo de `AuthApiPort` como puerto de dominio inyectable. | Llamadas directas a `localStorage` o `fetch` en componentes. | Respeta la arquitectura hexagonal y desacopla la UI de la persistencia mock de PBI-003. |
| DT-03 | Componente de orden superior / enrutador `GuardedRoute`. | Comprobaciones manuales en cada página mediante `useEffect`. | Centraliza la regla de acceso, evitando fugas de vistas privadas y parpadeos en pantalla. |
| DT-04 | Medidor de fortaleza de contraseña puro en cliente con heurística accesible. | Librerías pesadas externas (`zxcvbn`). | KISS y cero dependencias externas: evalúa longitud, mayúsculas, números y símbolos con anuncio `aria-live="polite"`. |

---

## 3. Arquitectura y estructura por capas

```text
src/
├── features/
│   ├── auth/
│   │   ├── application/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── useAuth.ts
│   │   │   └── passwordStrength.ts
│   │   ├── domain/
│   │   │   ├── User.ts
│   │   │   └── AuthCredentials.ts
│   │   ├── infrastructure/
│   │   │   └── inMemoryAuthStub.ts   # Stub local para TDD independiente
│   │   └── presentation/
│   │       ├── LoginPage.tsx
│   │       ├── RegisterPage.tsx
│   │       ├── PasswordStrengthMeter.tsx
│   │       ├── GuardedRoute.tsx
│   │       ├── UserMenu.tsx
│   │       └── auth.css
```

---

## 4. Matriz de trazabilidad spec-test

| ID | Requerimiento / Criterio | Tipo de prueba | Test contractual | Estado |
|---|---|---|---|---|
| CA-01 | Registro válido y redirección a dashboard | Componente | `[PBI-005][CA-01] register-success` | Planificado |
| CA-02 | Medidor visual y accesible de contraseña | Unitario / Componente | `[PBI-005][CA-02] password-strength-live` | Planificado |
| CA-03 | Login válido con credenciales correctas | Componente | `[PBI-005][CA-03] login-success` | Planificado |
| CA-04 | Error accesible ante credenciales inválidas | Componente | `[PBI-005][CA-04] login-invalid-credentials` | Planificado |
| CA-05 | Redirección de invitados fuera de rutas privadas | Integración / Routing | `[PBI-005][CA-05] guarded-route-redirect` | Planificado |
| CA-06 | Cabecera dinámica con avatar y logout | Componente | `[PBI-005][CA-06] user-menu-header` | Planificado |
