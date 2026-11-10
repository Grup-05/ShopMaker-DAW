import type { PageRepository } from '../application/PageRepository';
import type { StartedPage } from '../domain/StartedPage';

/**
 * Adaptador en memoria para el Sprint 0.
 *
 * No hay red, almacenamiento ni API: los datos son ficticios y deterministas.
 * PBI-003 aportará los contratos y adaptadores reales.
 */
export function createInMemoryPageRepository(
  pages: readonly StartedPage[],
): PageRepository {
  const snapshot = [...pages];

  return {
    listStartedPages: () => snapshot,
  };
}
