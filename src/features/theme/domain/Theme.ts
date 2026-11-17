/**
 * Dominio puro de Temas para ShopMaker
 */

export type Theme = 'light' | 'dark';

export const THEMES: readonly Theme[] = ['light', 'dark'] as const;

export const DEFAULT_THEME: Theme = 'light';

export const THEME_STORAGE_KEY = 'shopmaker-theme';

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && THEMES.includes(value as Theme);
}
