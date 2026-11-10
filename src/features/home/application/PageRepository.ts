import type { StartedPage } from '../domain/StartedPage';

/**
 * Puerto de lectura de las páginas iniciadas.
 *
 * La infraestructura lo implementa; presentación y aplicación solo conocen
 * esta abstracción.
 */
export interface PageRepository {
  listStartedPages(): readonly StartedPage[];
}
