# Spec — PBI-005 Registro, Inicio de Sesión y Rutas Protegidas

> Especificación SDD de autenticación, gestión de sesión y protección de rutas en ShopMaker.

## Metadatos

| Campo | Valor |
|---|---|
| PBI | `PBI-005` (`#36`) |
| Sprint | `S02` |
| Autor | Jesús Hernández (`@Tarrant15`, Dev B / Product Owner) |
| Fecha | 2026-11-17 |
| Aprobación | 2026-11-25 — T01 (`#44`), revisado por `@Tarrant15` |
| Estado | Aprobado |
| Rama | `feature/PBI-005-registro-login-rutas` |

---

## 1. Contexto y problema

ShopMaker necesita que los usuarios puedan registrarse e iniciar sesión para gestionar sus propios sitios web y módulos en el CMS. Actualmente, la barra de navegación contiene destinos provisionales (`#iniciar-sesion` y `#registrarse`) implementados en el PBI-001. Se requiere dotar al CMS de un flujo de autenticación completo, accesible, persistente y con protección de rutas hacia zonas privadas (`/dashboard`).

---

## 2. Historias de usuario y flujos

### Historia principal
**Como** usuario del CMS, **quiero** registrarme e iniciar sesión de forma segura y accesible, **para** acceder al panel de administración y gestionar mis páginas web.

### Flujo 1: Registro de nuevo usuario (`/register`)
1. El usuario navega a `/register` o pulsa «Registrarse» en la cabecera.
2. Rellena su nombre, correo electrónico y contraseña.
3. El medidor de fortaleza evalúa la contraseña en tiempo real anunciando su nivel accesible (`aria-live="polite"`).
4. Confirma su contraseña (validación exclusiva de cliente, no forma parte de `RegisterUserDto`) y marca la casilla de términos y condiciones.
5. Pulsa «Crear cuenta». El sistema valida los datos mediante `AuthApiPort.register({ name, email, password, acceptTerms })`.
6. Si es exitoso, la sesión se inicia automáticamente y el usuario es redirigido a `/dashboard`.

### Flujo 2: Inicio de sesión (`/login`)
1. El usuario navega a `/login` o pulsa «Iniciar sesión» en la cabecera.
2. Introduce email y contraseña (con soporte de autocompletado accesible del navegador).
3. Opcionalmente marca «Recordarme»; el valor se envía como `rememberMe` dentro de `LoginCredentialsDto`.
4. Pulsa «Entrar». El sistema valida credenciales contra `AuthApiPort.login()`.
5. Si es correcto, el estado de sesión pasa a `Authenticated` y se redirige a `/dashboard` (o a la ruta previa indicada en `?redirect=...`).
6. El enlace «Recuperar contraseña» apunta a `/recover`, una página informativa sin formulario ni llamada a `AuthApiPort.recoverPassword()` en este PBI (ver §6).

### Flujo 3: Rutas protegidas y guardas de navegación
1. Un usuario no autenticado intenta acceder directamente a `/dashboard`.
2. El componente `GuardedRoute` detecta el estado `Guest` y redirige a `/login?redirect=%2Fdashboard`.
3. Un usuario ya autenticado que visita `/login`, `/register` o `/recover` es redirigido automáticamente a `/dashboard` (guarda inversa o *guest-only*).
4. Al cerrar sesión, la sesión se limpia y el usuario vuelve a la página pública de inicio.
5. Mientras el estado es `Loading` no se renderiza contenido privado ni se redirige: se muestra un indicador accesible.

---

## 3. Requerimientos funcionales

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-01 | Página y formulario de registro en `/register` con campos obligatorios (nombre, email, password, confirmación y términos). | Alta |
| RF-02 | Medidor visual y accesible de fortaleza de contraseña con anuncios ARIA en vivo (`aria-live="polite"`). | Alta |
| RF-03 | Página y formulario de inicio de sesión en `/login` con autocompletado estándar (`autocomplete="username"`, `autocomplete="current-password"`), casilla «Recordarme» (`rememberMe`) y enlace accesible a `/recover`. | Alta |
| RF-04 | Servicio y estado de autenticación (`useAuth()`, `AuthContext`) con estados observables (`Guest`, `Loading`, `Authenticated`) y acciones `login`, `register` y `logout` delegadas en `AuthApiPort`. | Alta |
| RF-05 | Componente de protección `GuardedRoute` que redirige a invitados a `/login?redirect=...` y a usuarios autenticados fuera de las páginas de acceso. | Alta |
| RF-06 | Cabecera dinámica que sustituye los botones de login/registro por el perfil de usuario (avatar con iniciales, nombre y botón accesible «Cerrar sesión»). | Alta |

---

## 4. Requerimientos no funcionales

| ID | Categoría | Requerimiento |
|---|---|---|
| RNF-01 | Accesibilidad | Cumplimiento WCAG 2.1 AA: contraste de texto ≥ 4.5:1, etiquetas explícitas (`<label>`), mensajes de error asociados mediante `aria-describedby` y foco visible. |
| RNF-02 | Seguridad | La UI nunca persiste contraseñas: delega en `AuthApiPort`. Validar en cliente formato de email y longitud mínima de contraseña (8 caracteres). El adaptador mock de `PBI-003` guarda credenciales ficticias en `localStorage` y es **exclusivo de desarrollo/demo**; no debe usarse con datos reales. El backend definitivo será responsable del hash y de la emisión de tokens. |
| RNF-03 | Rendimiento | Validación en cliente sin parpadeos ni bloqueos del hilo principal. |
| RNF-04 | Responsive | Formularios utilizables en viewports desde 1024×720 hasta 1440×900 sin scroll horizontal. |

---

## 5. Criterios de aceptación (CA)

- [ ] **CA-01 (Registro):** Dado el formulario `/register`, cuando el usuario introduce datos válidos, confirma la contraseña, acepta los términos y envía el formulario, entonces se invoca `AuthApiPort.register({ name, email, password, acceptTerms: true })`, se guarda la sesión y se redirige a `/dashboard`.
- [ ] **CA-02 (Validación de contraseña):** Dado el campo de contraseña, a medida que el usuario escribe, el indicador de fortaleza se actualiza visualmente y anuncia el nivel por lector de pantalla.
- [ ] **CA-03 (Login):** Dado `/login`, cuando se envían credenciales válidas, entonces el estado pasa a `Authenticated`, se respeta `rememberMe` en el DTO y se redirige al usuario al panel de administración o a la ruta segura indicada en `?redirect=...`.
- [ ] **CA-04 (Error de login):** Si las credenciales son incorrectas (error 401 del puerto), entonces se muestra un mensaje de alerta accesible sin perder el correo introducido.
- [ ] **CA-05 (Guarda de ruta):** Si un invitado navega a `/dashboard`, entonces es interceptado y redirigido a `/login?redirect=%2Fdashboard`.
- [ ] **CA-06 (Cabecera dinámica):** Cuando el usuario está autenticado, la navegación sustituye «Iniciar sesión» y «Registrarse» por su avatar/iniciales, su nombre y el botón «Cerrar sesión».

---

## 6. Fuera de alcance

- **Recuperación de contraseña:** `/recover` es una página informativa con enlace de vuelta a `/login`. No incluye formulario, envío de correo ni llamada a `AuthApiPort.recoverPassword()`; se abordará en un PBI posterior.
- **Registro con verificación de email, OAuth, roles/permisos y refresco de token:** no forman parte de `PBI-005`.
- **Endurecimiento del adaptador mock:** el hash de contraseñas y la seguridad real corresponden al backend definitivo, no al mock de `PBI-003`.
