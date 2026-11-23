import type { ModuleDto } from '../../../domain/ports';
import './ModuleCard.css';

export interface ModuleCardProps {
  readonly module: ModuleDto;
  readonly onInstall?: (module: ModuleDto) => void;
}

export function ModuleCard({ module, onInstall }: ModuleCardProps) {
  const isInstalled = module.status === 'installed';

  return (
    <article
      className="module-card"
      aria-labelledby={`module-title-${module.id}`}
    >
      <div className="module-card__header">
        <h3 id={`module-title-${module.id}`} className="module-card__title">
          {module.name}
        </h3>
        <span className="module-card__version">v{module.version}</span>
      </div>

      <p className="module-card__desc">{module.description}</p>

      <div className="module-card__footer">
        <span className="module-card__category-badge">{module.category}</span>

        <button
          type="button"
          className="module-card__status-btn"
          aria-label={isInstalled ? `${module.name} ya instalado` : `Instalar ${module.name}`}
          disabled={isInstalled}
          onClick={() => onInstall?.(module)}
        >
          {isInstalled ? 'Instalado' : 'Instalar'}
        </button>
      </div>
    </article>
  );
}
