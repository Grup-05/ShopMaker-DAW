/**
 * Destinos provisionales de los enlaces de acceso.
 *
 * PBI-005 todavía no ha definido las rutas reales de inicio de sesión y
 * registro. Para no inventar URLs de producto, PBI-001 usa fragmentos
 * internos y el test `navigation-destinations` verifica la presencia y
 * semántica de los enlaces. Cuando PBI-005 publique sus rutas, basta con
 * sustituir estos valores y reforzar el test con las rutas acordadas.
 */
export const AUTH_ROUTES = {
  login: '#iniciar-sesion',
  register: '#registrarse',
} as const;
