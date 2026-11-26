import { useEffect, useMemo, useRef, useState } from 'react';
import type { ModuleDto, SiteDto } from '../../../domain/ports';
import {
  VIEWPORT_PRESETS,
  type DeviceViewport,
  type SiteBlock,
} from '../domain/previewTypes';
import { renderSiteDocument } from '../domain/siteRenderer';
import './SitePreviewModal.css';

export interface SitePreviewModalProps {
  readonly site: SiteDto | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly blocks?: readonly SiteBlock[];
  readonly activeModules?: readonly ModuleDto[];
  readonly onPublish?: (site: SiteDto) => Promise<void>;
  readonly isPublishing?: boolean;
}

export function SitePreviewModal({
  site,
  isOpen,
  onClose,
  blocks,
  activeModules,
  onPublish,
  isPublishing = false,
}: SitePreviewModalProps) {
  const [viewport, setViewport] = useState<DeviceViewport>('desktop');
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setViewport('desktop');
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 20);

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const renderedHtml = useMemo(() => {
    if (!site) {
      return '';
    }
    return renderSiteDocument({ site, blocks, activeModules });
  }, [site, blocks, activeModules]);

  if (!isOpen || !site) {
    return null;
  }

  const activePreset =
    VIEWPORT_PRESETS.find((preset) => preset.id === viewport) ??
    VIEWPORT_PRESETS[2];

  const isPublished = site.status === 'published';

  return (
    <div
      className="site-preview-modal__backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="site-preview-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-preview-modal-title"
      >
        <header className="site-preview-modal__header">
          <div className="site-preview-modal__heading-group">
            <h2
              id="site-preview-modal-title"
              className="site-preview-modal__title"
            >
              Previsualización: {site.name}
            </h2>
            <span className="site-preview-modal__meta">
              {site.subdomain} · {activePreset.widthPx}×{activePreset.heightPx}px
            </span>
          </div>

          <div
            className="site-preview-modal__viewports"
            role="group"
            aria-label="Selector de dispositivo"
          >
            {VIEWPORT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="site-preview-modal__viewport-btn"
                aria-pressed={viewport === preset.id}
                onClick={() => setViewport(preset.id)}
              >
                {preset.label} ({preset.widthPx}px)
              </button>
            ))}
          </div>

          <div className="site-preview-modal__actions">
            {onPublish && !isPublished && (
              <button
                type="button"
                className="site-preview-modal__publish-btn"
                disabled={isPublishing}
                onClick={() => void onPublish(site)}
              >
                {isPublishing ? 'Publicando...' : 'Publicar Web'}
              </button>
            )}

            <button
              ref={closeBtnRef}
              type="button"
              className="site-preview-modal__close-btn"
              aria-label="Cerrar previsualización"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </header>

        <div className="site-preview-modal__stage">
          <div
            data-testid="preview-viewport-frame"
            className="site-preview-modal__frame-wrapper"
            style={{ width: `${activePreset.widthPx}px` }}
          >
            <iframe
              title={`Previsualización de ${site.name}`}
              className="site-preview-modal__iframe"
              sandbox=""
              srcDoc={renderedHtml}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
