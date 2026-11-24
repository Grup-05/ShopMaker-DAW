import { useState, useEffect, useCallback } from 'react';
import type { CreateSiteDto, SiteDto, SitesApiPort } from '../../../domain/ports';

export interface UseSitesReturn {
  readonly sites: readonly SiteDto[];
  readonly loading: boolean;
  readonly error: string | null;
  readonly reload: () => Promise<void>;
  readonly createSite: (dto: CreateSiteDto) => Promise<SiteDto>;
}

export function useSites(sitesApi?: SitesApiPort): UseSitesReturn {
  const [sites, setSites] = useState<readonly SiteDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadSites = useCallback(async () => {
    if (!sitesApi) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await sitesApi.getUserSites();
      setSites(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al cargar sitios';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [sitesApi]);

  useEffect(() => {
    void loadSites();
  }, [loadSites]);

  const createSite = useCallback(
    async (dto: CreateSiteDto): Promise<SiteDto> => {
      if (!sitesApi) {
        throw new Error('SitesApiPort no configurado');
      }
      const newSite = await sitesApi.createSite(dto);
      setSites((prev) => [...prev, newSite]);
      return newSite;
    },
    [sitesApi]
  );

  return {
    sites,
    loading,
    error,
    reload: loadSites,
    createSite,
  };
}
