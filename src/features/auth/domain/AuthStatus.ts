/**
 * Estado de sesión exclusivo de la UI.
 *
 * `Loading` evita redirecciones prematuras mientras se hidrata la sesión con
 * `AuthApiPort.me()`; `Guest` y `Authenticated` son los estados estables.
 */
export type AuthStatus = 'Guest' | 'Loading' | 'Authenticated';
