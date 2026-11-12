import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Theme } from '../../features/theme/domain/Theme';
import { ThemeService } from '../../features/theme/application/ThemeService';
import { LocalStorageThemeRepository } from '../../features/theme/infrastructure/LocalStorageThemeRepository';

const defaultRepository = new LocalStorageThemeRepository();
const defaultService = new ThemeService(defaultRepository);

export interface UseThemeReturn {
  readonly theme: Theme;
  readonly toggleTheme: () => void;
  readonly setTheme: (theme: Theme) => void;
}

/**
 * Hook de React para la gestión del tema de la aplicación.
 * Sincroniza el estado de React con el atributo data-theme del DOM y la persistencia.
 */
export function useTheme(service: ThemeService = defaultService): UseThemeReturn {
  const [theme, setInternalTheme] = useState<Theme>(() => {
    const initial = service.resolveInitialTheme();
    service.applyTheme(initial);
    return initial;
  });

  useEffect(() => {
    service.applyTheme(theme);
  }, [theme, service]);

  const toggleTheme = useCallback(() => {
    setInternalTheme((prev) => service.toggleTheme(prev));
  }, [service]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      service.applyTheme(newTheme);
      setInternalTheme(newTheme);
    },
    [service]
  );

  return useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme, setTheme]
  );
}
