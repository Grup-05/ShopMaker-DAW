import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageMockApiAdapter } from '../../../src/infrastructure/api/mock/LocalStorageMockApiAdapter';
import { SitesView } from '../../../src/features/dashboard/presentation/SitesView';
import type { SiteDto, SitesApiPort } from '../../../src/domain/ports';

describe('[PBI-009][T06] Flujo Publicar Web y Previsualización en SitesView', () => {
  let mockAdapter: LocalStorageMockApiAdapter;

  beforeEach(async () => {
    localStorage.clear();
    mockAdapter = new LocalStorageMockApiAdapter({
      minLatencyMs: 0,
      maxLatencyMs: 0,
    });
    await mockAdapter.login({
      email: 'demo@shopmaker.local',
      password: 'DemoPassword2026!',
    });
  });

  describe('[RF-05][CA-05] persistencia en LocalStorageMockApiAdapter.publishSite', () => {
    it('cambia el estado de draft a published y persiste en localStorage', async () => {
      const sites = await mockAdapter.getUserSites();
      const target = sites[0];
      expect(target.status).toBe('draft');

      const published = await mockAdapter.publishSite(target.id);
      expect(published.status).toBe('published');

      const reloadedAdapter = new LocalStorageMockApiAdapter({
        minLatencyMs: 0,
        maxLatencyMs: 0,
      });
      const reloadedSites = await reloadedAdapter.getUserSites();
      expect(reloadedSites.find((s) => s.id === target.id)?.status).toBe(
        'published'
      );
    });
  });

  describe('[RF-04][RF-05][CA-03][CA-05][CA-06] integración en SitesView', () => {
    it('permite abrir la previsualización aislada desde la tarjeta del sitio', async () => {
      const user = userEvent.setup();
      render(<SitesView sitesApi={mockAdapter} />);

      const previewBtn = await screen.findByRole('button', {
        name: /previsualizar tienda demo artesanal/i,
      });
      await user.click(previewBtn);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeVisible();
      expect(
        screen.getByTitle(/previsualización de tienda demo artesanal/i)
      ).toHaveAttribute('sandbox', '');
    });

    it('publica un sitio en borrador y actualiza su badge a Publicado', async () => {
      const user = userEvent.setup();
      render(<SitesView sitesApi={mockAdapter} />);

      const publishBtn = await screen.findByRole('button', {
        name: /publicar tienda demo artesanal/i,
      });
      await user.click(publishBtn);

      expect(await screen.findByText('Publicado')).toBeVisible();
      expect(
        screen.queryByRole('button', {
          name: /publicar tienda demo artesanal/i,
        })
      ).not.toBeInTheDocument();
    });

    it('muestra alerta accesible y mantiene estado Borrador si falla la publicación', async () => {
      const user = userEvent.setup();
      const failingPublishApi: SitesApiPort = {
        getUserSites: mockAdapter.getUserSites.bind(mockAdapter),
        createSite: mockAdapter.createSite.bind(mockAdapter),
        deleteSite: mockAdapter.deleteSite.bind(mockAdapter),
        publishSite: async (): Promise<SiteDto> => {
          throw new Error('Error de red al publicar');
        },
      };

      render(<SitesView sitesApi={failingPublishApi} />);

      const publishBtn = await screen.findByRole('button', {
        name: /publicar tienda demo artesanal/i,
      });
      await user.click(publishBtn);

      const alert = await screen.findByRole('alert');
      expect(alert).toHaveTextContent(/error de red al publicar/i);
      expect(screen.getByText('Borrador')).toBeVisible();
    });
  });
});
