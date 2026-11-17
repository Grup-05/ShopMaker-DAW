import type { Theme } from '../domain/Theme';

/**
 * Puerto de persistencia para el tema de la aplicación.
 */
export interface ThemeRepository {
  getTheme(): Theme | null;
  setTheme(theme: Theme): void;
}
