import type { SiteDto } from '../../../domain/ports';
import './SiteCard.css';

export interface SiteCardProps {
  readonly site: SiteDto;
  readonly onEdit?: (site: SiteDto) => void;
}

export function SiteCard({ site, onEdit }: SiteCardProps) {
  const isPublished = site.status === 'published';

  return (
    <article
      className="site-card"
      aria-labelledby={`site-title-${site.id}`}
    >
      <div className="site-card__header">
        <div>
          <h3 id={`site-title-${site.id}`} className="site-card__title">
            {site.name}
          </h3>
          <p className="site-card__subdomain">{site.subdomain}</p>
        </div>

        <span
          className={`site-card__badge site-card__badge--${site.status}`}
          aria-label={`Estado: ${isPublished ? 'Publicado' : 'Borrador'}`}
        >
          {isPublished ? 'Publicado' : 'Borrador'}
        </span>
      </div>

      <div className="site-card__actions">
        <button
          type="button"
          className="site-card__edit-btn"
          aria-label={`Editar ${site.name}`}
          onClick={() => onEdit?.(site)}
        >
          Editar
        </button>
      </div>
    </article>
  );
}
