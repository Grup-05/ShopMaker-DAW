import { type Theme, DEFAULT_THEME } from '../domain/Theme';
import type { ThemeRepository } from './ThemeRepository';

/**
 * Caso de uso: Gestión de temas, resolución de preferencias y sincronización con el DOM.
 */
export class ThemeService {
  constructor(private readonly repository: ThemeRepository) {}

  /**
   * Resuelve el tema inicial según la jerarquía:
   * 1. Preferencia persistida por el usuario.
   * 2. Preferencia del sistema operativo (prefers-color-scheme).
   * 3. Fallback predeterminado ('light').
   */
  resolveInitialTheme(): Theme {
    const saved = this.repository.getTheme();
    if (saved) {
      return saved;
    }

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      try {
        const query = window.matchMedia('(prefers-color-scheme: dark)');
        if (query.matches) {
          return 'dark';
        }
      } catch {
        // En caso de fallo en matchMedia, continúa al fallback
      }
    }

    return DEFAULT_THEME;
  }

  /**
   * Aplica el tema en el DOM inyectando el atributo data-theme en <html>
   * y persistiendo la selección en el repositorio.
   */
  applyTheme(theme: Theme): void {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.setAttribute('data-theme', theme);
    }
    this.repository.setTheme(theme);
  }

  /**
   * Alterna entre 'light' y 'dark', aplica en el DOM y persiste.
   */
  toggleTheme(currentTheme: Theme): Theme {
    const nextTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(nextTheme);
    return nextTheme;
  }
}
