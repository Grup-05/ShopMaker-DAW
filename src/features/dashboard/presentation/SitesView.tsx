import { useState } from 'react';
import type { SiteDto, SitesApiPort } from '../../../domain/ports';
import { useSites } from '../application/useSites';
import { SiteCard } from './SiteCard';
import { CreateSiteModal } from './CreateSiteModal';
import './SitesView.css';

export interface SitesViewProps {
  readonly sitesApi?: SitesApiPort;
  readonly onOpenCreateModal?: () => void;
  readonly onEditSite?: (site: SiteDto) => void;
}

export function SitesView({
  sitesApi,
  onOpenCreateModal,
  onEditSite,
}: SitesViewProps) {
  const { sites, loading, error, reload, createSite } = useSites(sitesApi);
  const [internalModalOpen, setInternalModalOpen] = useState(false);

  const handleOpenModal = () => {
    if (onOpenCreateModal) {
      onOpenCreateModal();
    } else {
      setInternalModalOpen(true);
    }
  };

  return (
    <>
      <section className="sites-view" aria-labelledby="sites-heading">
        <div className="sites-view__header">
          <div className="sites-view__title-group">
            <h2 id="sites-heading" className="sites-view__title">
              Mis Sitios Web
            </h2>
            <p className="sites-view__subtitle">
              Administra, configura y maqueta tus proyectos activos.
            </p>
          </div>

          <button
            type="button"
            className="sites-view__create-btn"
            onClick={handleOpenModal}
          >
            Crear Nueva Web
          </button>
        </div>

        {error && (
          <div className="sites-view__error-alert" role="alert">
            <span>{error}</span>
            <button
              type="button"
              className="sites-view__retry-btn"
              onClick={() => void reload()}
            >
              Reintentar
            </button>
          </div>
        )}

        {loading && !error && (
          <div className="sites-view__state-box" role="status">
            <p>Cargando tus sitios web...</p>
          </div>
        )}

        {!loading && !error && sites.length === 0 && (
          <div className="sites-view__state-box">
            <h3 className="sites-view__empty-title">
              No tienes ningún sitio web todavía
            </h3>
            <p className="sites-view__empty-desc">
              Empieza a crear tu primera web con plantillas optimizadas y módulos
              personalizables.
            </p>
            <button
              type="button"
              className="sites-view__create-btn"
              onClick={handleOpenModal}
            >
              Crear mi primera web
            </button>
          </div>
        )}

        {!loading && !error && sites.length > 0 && (
          <div className="sites-view__grid" role="region" aria-label="Lista de sitios">
            {sites.map((site) => (
              <SiteCard key={site.id} site={site} onEdit={onEditSite} />
            ))}
          </div>
        )}
      </section>

      <CreateSiteModal
        isOpen={internalModalOpen}
        onClose={() => setInternalModalOpen(false)}
        onSubmit={createSite}
      />
    </>
  );
}
