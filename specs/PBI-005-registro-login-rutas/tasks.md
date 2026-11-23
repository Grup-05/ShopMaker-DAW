# Tareas TDD — PBI-005 Registro, Inicio de Sesión y Rutas Protegidas

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-005` |
| Sprint | `S02` |
| Responsable | Jesús Hernández (`@Tarrant15`, Dev B / Product Owner) |
| Estimación Total | 28 h |
| Estado | Desglosadas — pendientes de ejecución TDD |

---

## 1. Desglose de tareas y ciclos TDD

### Tarea T01 — Redactar spec, plan técnico y matriz spec-test (5 h)
- [x] Redactar `spec.md` con historias de usuario, flujos y criterios CA-01 a CA-06.
- [x] Redactar `plan.md` con decisiones DT-01 a DT-04, arquitectura por capas y matriz spec-test.
- [x] Redactar `tasks.md` con los ciclos TDD y los nombres contractuales de las pruebas.

### Tarea T02 — Ciclo TDD 1: Registro y medidor de contraseña (4 h + 6 h = 10 h)
- [ ] **Rojo (T02):** Escribir pruebas unitarias y de componente para el registro y medidor de contraseña:
  - `tests/unit/auth/passwordStrength.test.ts`: probar cálculo y niveles (débil, medio, fuerte).
  - `tests/unit/auth/RegisterPage.test.tsx`: probar campos, accesibilidad, `aria-live` y llamada a registro.
- [ ] **Verde (T03):**
  - Implementar función pura `calculatePasswordStrength`.
  - Implementar componente `PasswordStrengthMeter` con estilos de tokens.
  - Implementar `RegisterPage` con validación de campos y feedback de errores accesibles.
- [ ] **Refactor:** Limpiar estilos, asegurar contraste de colores de las barras de fuerza y foco visible.

### Tarea T03 — Ciclo TDD 2: Login y manejo de errores (4 h + 5 h = 9 h)
- [ ] **Rojo (T04):** Escribir pruebas de componente para el inicio de sesión:
  - `tests/unit/auth/LoginPage.test.tsx`: probar autocompletado estándar, envío exitoso y visualización de error accesible 401.
- [ ] **Verde (T05):**
  - Implementar `LoginPage` con labels semánticos, casilla de recordar y enlace a recuperar contraseña.
  - Implementar manejo de estados de carga y error accesible con `role="alert"`.
- [ ] **Refactor:** Revisar tabulación por teclado y atajos.

### Tarea T04 — Ciclo TDD 3: Gestión de sesión y guardas de ruta (4 h)
- [ ] **Rojo:** Escribir pruebas para `useAuth` y `GuardedRoute`:
  - `tests/unit/auth/GuardedRoute.test.tsx`: verificar redirección a `/login?redirect=...` si es Guest, y renderizado del hijo si está Authenticated.
  - `tests/unit/auth/UserMenu.test.tsx`: comprobar reemplazo de botones en la cabecera por avatar y botón de cerrar sesión.
- [ ] **Verde (T06):**
  - Implementar `AuthContext`, `useAuth` y `GuardedRoute`.
  - Implementar `UserMenu` e integrarlo en la cabecera de `HomePage`.
- [ ] **Refactor:** Asegurar que no hay parpadeos en transiciones de ruta.

---

## 2. Definición de Hecho (DoD) de la feature
- [ ] Todos los criterios de aceptación (CA-01 a CA-06) tienen test automatizado y en verde.
- [ ] Contraste verificado con WCAG AA.
- [ ] La suite pasa completa con `npm test` y `npm run test:e2e`.
- [ ] Pull Request abierto hacia `develop` con aprobación del revisor por pares (`CODEOWNERS`).
