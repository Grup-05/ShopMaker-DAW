const DEFAULT_REDIRECT = '/dashboard';

/**
 * Acepta solo rutas internas seguras para evitar open redirects.
 *
 * Rechaza URLs absolutas, protocol-relative (`//host`) y variantes con
 * barra invertida (`/\host`), que el navegador puede normalizar a `//host`.
 */
export function resolveSafeRedirect(
  value: string | null,
  fallback: string = DEFAULT_REDIRECT,
): string {
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.startsWith('/\\')
  ) {
    return fallback;
  }

  return value;
}
