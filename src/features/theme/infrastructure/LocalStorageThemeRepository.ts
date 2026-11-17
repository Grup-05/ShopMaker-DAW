import { type Theme, isTheme, THEME_STORAGE_KEY } from '../domain/Theme';
import type { ThemeRepository } from '../application/ThemeRepository';

/**
 * Adaptador de infraestructura que persiste el tema en el almacenamiento local.
 * Implementa protección ante excepciones (modo incógnito, storage deshabilitado).
 */
export class LocalStorageThemeRepository implements ThemeRepository {
  private readonly storage: Storage | null;

  constructor(customStorage?: Storage) {
    if (customStorage !== undefined) {
      this.storage = customStorage;
    } else {
      try {
        this.storage = typeof window !== 'undefined' ? window.localStorage : null;
      } catch {
        this.storage = null;
      }
    }
  }

  getTheme(): Theme | null {
    if (!this.storage) return null;

    try {
      const stored = this.storage.getItem(THEME_STORAGE_KEY);
      if (isTheme(stored)) {
        return stored;
      }
      return null;
    } catch {
      return null;
    }
  }

  setTheme(theme: Theme): void {
    if (!this.storage) return;

    try {
      this.storage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Degrada silenciosamente si el almacenamiento no está disponible
    }
  }
}
