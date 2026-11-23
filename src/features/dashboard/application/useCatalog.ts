import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ModuleDto, ModulesApiPort } from '../../../domain/ports';

export interface UseCatalogReturn {
  readonly modules: readonly ModuleDto[];
  readonly filteredModules: readonly ModuleDto[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly searchTerm: string;
  readonly selectedCategory: string;
  readonly setSearchTerm: (term: string) => void;
  readonly setSelectedCategory: (category: string) => void;
  readonly resetFilters: () => void;
  readonly reload: () => Promise<void>;
}

export function useCatalog(modulesApi?: ModulesApiPort): UseCatalogReturn {
  const [modules, setModules] = useState<readonly ModuleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadCatalog = useCallback(async () => {
    if (!modulesApi) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await modulesApi.getCatalog();
      setModules(data);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al cargar catálogo de módulos';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [modulesApi]);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
  }, []);

  const filteredModules = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    return modules.filter((mod) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        mod.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        !normalizedTerm ||
        mod.name.toLowerCase().includes(normalizedTerm) ||
        mod.description.toLowerCase().includes(normalizedTerm);

      return matchesCategory && matchesSearch;
    });
  }, [modules, searchTerm, selectedCategory]);

  return {
    modules,
    filteredModules,
    loading,
    error,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    resetFilters,
    reload: loadCatalog,
  };
}
