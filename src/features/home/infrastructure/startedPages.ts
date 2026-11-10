import type { StartedPage } from '../domain/StartedPage';

/**
 * Datos ficticios del Sprint 0. No representan páginas reales ni datos
 * personales; sirven para que la pantalla base tenga contenido seleccionable.
 */
export const startedPages: readonly StartedPage[] = [
  { id: 'web-ejemplo', name: 'Web de ejemplo' },
  { id: 'tienda-ejemplo', name: 'Tienda de ejemplo' },
];
