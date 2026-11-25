/**
 * Rutas públicas de acceso compartidas por la home y las vistas de auth.
 *
 * PBI-005 publica las rutas reales de inicio de sesión, registro y
 * recuperación; la home las consume para que los enlaces de la cabecera
 * naveguen dentro de la SPA.
 */
export const AUTH_ROUTES = {
  login: '/login',
  register: '/register',
  recover: '/recover',
} as const;
