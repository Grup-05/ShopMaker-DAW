import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeService } from '../../../src/features/theme/application/ThemeService';
import { LocalStorageThemeRepository } from '../../../src/features/theme/infrastructure/LocalStorageThemeRepository';

describe('ThemeService & LocalStorageThemeRepository', () => {
  let repository: LocalStorageThemeRepository;
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    repository = new LocalStorageThemeRepository();
    service = new ThemeService(repository);
  });

  describe('[PBI-002][RF-03] theme-persists-in-localstorage', () => {
    it('debe persistir el tema en localStorage y recuperarlo', () => {
      repository.setTheme('dark');
      expect(repository.getTheme()).toBe('dark');
      expect(localStorage.getItem('shopmaker-theme')).toBe('dark');

      repository.setTheme('light');
      expect(repository.getTheme()).toBe('light');
      expect(localStorage.getItem('shopmaker-theme')).toBe('light');
    });

    it('debe descartar valores corruptos o desconocidos en localStorage', () => {
      localStorage.setItem('shopmaker-theme', 'neon-invalid');
      expect(repository.getTheme()).toBeNull();
    });

    it('debe degradar limpiamente si localStorage lanza una excepción', () => {
      const failingRepo = new LocalStorageThemeRepository({
        getItem: () => {
          throw new Error('Access denied');
        },
        setItem: () => {
          throw new Error('Quota exceeded');
        },
      } as unknown as Storage);

      expect(() => failingRepo.getTheme()).not.toThrow();
      expect(failingRepo.getTheme()).toBeNull();
      expect(() => failingRepo.setTheme('dark')).not.toThrow();
    });
  });

  describe('[PBI-002][RF-04] theme-detects-system-preference', () => {
    it('debe adoptar prefers-color-scheme: dark si no hay tema guardado', () => {
      vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
        matches: query.includes('dark'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const initial = service.resolveInitialTheme();
      expect(initial).toBe('dark');
    });

    it('debe adoptar prefers-color-scheme: light si no hay tema guardado y el sistema es claro', () => {
      vi.spyOn(window, 'matchMedia').mockImplementation(() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const initial = service.resolveInitialTheme();
      expect(initial).toBe('light');
    });

    it('el tema guardado en localStorage tiene precedencia sobre la preferencia del sistema', () => {
      repository.setTheme('light');

      vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
        matches: query.includes('dark'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const initial = service.resolveInitialTheme();
      expect(initial).toBe('light');
    });
  });

  describe('[PBI-002][RF-02] theme-toggle-updates-dom', () => {
    it('debe actualizar el atributo data-theme en document.documentElement al aplicar tema', () => {
      service.applyTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      service.applyTheme('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('debe alternar de light a dark y de dark a light persistiendo la selección', () => {
      const next1 = service.toggleTheme('light');
      expect(next1).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(repository.getTheme()).toBe('dark');

      const next2 = service.toggleTheme('dark');
      expect(next2).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(repository.getTheme()).toBe('light');
    });
  });
});
