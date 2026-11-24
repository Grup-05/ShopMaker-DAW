import type { ModuleDto, ModulesApiPort } from '../../../domain/ports';
import { useCatalog } from '../application/useCatalog';
import { ModuleCard } from './ModuleCard';
import './CatalogView.css';

export interface CatalogViewProps {
  readonly modulesApi?: ModulesApiPort;
  readonly onInstallModule?: (module: ModuleDto) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'contenido', label: 'Contenido' },
  { id: 'seo', label: 'SEO' },
] as const;

export function CatalogView({
  modulesApi,
  onInstallModule,
}: CatalogViewProps) {
  const {
    filteredModules,
    loading,
    error,
    searchTerm,
    selectedCategory,
    setSearchTerm,
    setSelectedCategory,
    resetFilters,
    reload,
  } = useCatalog(modulesApi);

  return (
    <section className="catalog-view" aria-labelledby="catalog-heading">
      <div className="catalog-view__header">
        <h2 id="catalog-heading" className="catalog-view__title">
          Catálogo de Módulos
        </h2>
        <p className="catalog-view__subtitle">
          Descubre, amplía y potencia tu tienda o sitio web con extensiones oficiales.
        </p>
      </div>

      <div className="catalog-view__toolbar">
        <div className="catalog-view__search-wrapper">
          <input
            type="search"
            className="catalog-view__search-input"
            aria-label="Buscar módulos"
            placeholder="Buscar módulos por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div
          className="catalog-view__categories"
          role="group"
          aria-label="Filtrar por categoría"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="catalog-view__category-btn"
              aria-pressed={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="catalog-view__error-alert" role="alert">
          <span>{error}</span>
          <button
            type="button"
            className="catalog-view__reset-btn"
            onClick={() => void reload()}
          >
            Reintentar
          </button>
        </div>
      )}

      {loading && !error && (
        <div className="catalog-view__state-box" role="status">
          <p>Cargando catálogo de extensiones...</p>
        </div>
      )}

      {!loading && !error && filteredModules.length === 0 && (
        <div className="catalog-view__state-box">
          <h3 className="catalog-view__empty-title">
            No se encontraron módulos coincidentes
          </h3>
          <p className="catalog-view__empty-desc">
            Prueba a modificar los términos de búsqueda o cambiar la categoría
            seleccionada.
          </p>
          <button
            type="button"
            className="catalog-view__reset-btn"
            onClick={resetFilters}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {!loading && !error && filteredModules.length > 0 && (
        <div
          className="catalog-view__grid"
          role="region"
          aria-label="Listado de extensiones disponibles"
        >
          {filteredModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onInstall={onInstallModule}
            />
          ))}
        </div>
      )}
    </section>
  );
}
