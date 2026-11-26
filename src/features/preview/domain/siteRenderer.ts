import type { ModuleDto } from '../../../domain/ports';
import { escapeHtml, sanitizeHtml, sanitizeUrl } from './htmlSanitizer';
import type { SiteBlock, SiteRenderInput } from './previewTypes';

const MOBILE_FIRST_STYLES = `
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    line-height: 1.6;
    color: #0f172a;
    background-color: #f8fafc;
  }
  .sm-page {
    width: 100%;
    margin: 0 auto;
    padding: 1rem;
  }
  .sm-header {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.25rem;
    margin-bottom: 1rem;
  }
  .sm-title {
    margin: 0 0 0.25rem;
    font-size: 1.5rem;
    line-height: 1.2;
  }
  .sm-meta {
    margin: 0;
    font-size: 0.875rem;
    color: #475569;
  }
  .sm-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .sm-block {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1rem;
  }
  .sm-image {
    display: block;
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
  .sm-separator {
    border: 0;
    border-top: 1px solid #cbd5e1;
    margin: 0.5rem 0;
  }
  .sm-modules {
    margin-top: 1.25rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  .sm-module-card {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    padding: 0.875rem;
  }
  @media (min-width: 768px) {
    .sm-page { padding: 1.5rem; }
    .sm-title { font-size: 1.875rem; }
    .sm-modules { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (min-width: 1280px) {
    .sm-page { max-width: 1120px; padding: 2rem; }
    .sm-modules { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }
`;

function renderBlock(block: SiteBlock): string {
  switch (block.type) {
    case 'heading':
      return `<section class="sm-block"><h2>${escapeHtml(block.content ?? '')}</h2></section>`;
    case 'text':
      return `<section class="sm-block">${sanitizeHtml(block.content ?? '')}</section>`;
    case 'image': {
      const safeSrc = sanitizeUrl(block.imageUrl ?? '');
      if (!safeSrc) {
        return '';
      }
      const safeAlt = escapeHtml(block.imageAlt ?? '');
      return `<figure class="sm-block"><img class="sm-image" src="${escapeHtml(safeSrc)}" alt="${safeAlt}" /></figure>`;
    }
    case 'separator':
      return '<hr class="sm-separator" />';
  }
}

function renderModules(modules: readonly ModuleDto[]): string {
  if (modules.length === 0) {
    return '';
  }

  const cards = modules
    .map(
      (mod) => `
      <article class="sm-module-card">
        <h3>${escapeHtml(sanitizeHtml(mod.name) || mod.name)}</h3>
        <p>${escapeHtml(sanitizeHtml(mod.description) || mod.description)}</p>
      </article>`
    )
    .join('\n');

  return `<section aria-label="Módulos activos"><div class="sm-modules">${cards}</div></section>`;
}

/**
 * Motor de renderizado HTML5/CSS mobile-first sanitizado para previsualización aislada.
 */
export function renderSiteDocument(input: SiteRenderInput): string {
  const safeName = escapeHtml(sanitizeHtml(input.site.name) || input.site.name);
  const safeSubdomain = escapeHtml(input.site.subdomain);
  const safeCategory = escapeHtml(input.site.category ?? 'general');
  const statusLabel = input.site.status === 'published' ? 'Publicado' : 'Borrador';

  const blocks = input.blocks ?? [];
  const blocksHtml =
    blocks.length > 0
      ? blocks.map(renderBlock).join('\n')
      : `<section class="sm-block"><h2>Bienvenido a ${safeName}</h2><p>Vista previa inicial lista para personalizar con bloques y módulos.</p></section>`;

  const modulesHtml = renderModules(input.activeModules ?? []);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src https: http: data:;" />
  <title>${safeName}</title>
  <style>${MOBILE_FIRST_STYLES}</style>
</head>
<body>
  <main class="sm-page">
    <header class="sm-header">
      <h1 class="sm-title">${safeName}</h1>
      <p class="sm-meta">${safeSubdomain} · ${safeCategory} · ${statusLabel}</p>
    </header>
    <div class="sm-content">
      ${blocksHtml}
    </div>
    ${modulesHtml}
  </main>
</body>
</html>`;
}
