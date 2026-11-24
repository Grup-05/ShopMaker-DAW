import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { SitesView } from '../../../src/features/dashboard/presentation/SitesView';
import { LocalStorageMockApiAdapter } from '../../../src/infrastructure/api/mock/LocalStorageMockApiAdapter';
import type { SitesApiPort, SiteDto } from '../../../src/domain/ports';

describe('SitesView', () => {
  let mockAdapter: LocalStorageMockApiAdapter;

  beforeEach(async () => {
    localStorage.clear();
    mockAdapter = new LocalStorageMockApiAdapter({ minLatencyMs: 0, maxLatencyMs: 0 });
    await mockAdapter.login({
      email: 'demo@shopmaker.local',
      password: 'DemoPassword2026!',
    });
  });

  describe('[PBI-006][CA-02] my-sites-grid-render', () => {
    it('debe renderizar las tarjetas de sitios con nombre, subdominio, badge de estado y botón de edición', async () => {
      render(<SitesView sitesApi={mockAdapter} />);

      // Esperar a que se carguen los sitios iniciales
      const siteHeading = await screen.findByRole('heading', {
        name: 'Tienda Demo Artesanal',
      });
      expect(siteHeading).toBeVisible();

      // Subdominio simulado
      expect(
        screen.getByText('tienda-demo-artesanal.shopmaker.local')
      ).toBeVisible();

      // Badge de estado (draft / borrador)
      expect(screen.getByText(/borrador|draft/i)).toBeVisible();

      // Botón accesible de editar o maquetar
      const editBtn = screen.getByRole('button', {
        name: /editar|maquetar/i,
      });
      expect(editBtn).toBeVisible();

      // Botón principal de crear nueva web
      const createBtn = screen.getByRole('button', {
        name: /crear nueva web|crear sitio/i,
      });
      expect(createBtn).toBeVisible();
    });

    it('debe mostrar el estado vacío con mensaje explicativo cuando no existen sitios creados', async () => {
      // Mock de API que devuelve lista vacía
      const emptySitesApi: SitesApiPort = {
        getUserSites: async (): Promise<readonly SiteDto[]> => [],
        createSite: mockAdapter.createSite.bind(mockAdapter),
        deleteSite: mockAdapter.deleteSite.bind(mockAdapter),
      };

      render(<SitesView sitesApi={emptySitesApi} />);

      const emptyMessage = await screen.findByText(
        /no tienes ningún sitio web todavía/i
      );
      expect(emptyMessage).toBeVisible();

      const createFirstBtn = screen.getByRole('button', {
        name: 'Crear mi primera web',
      });
      expect(createFirstBtn).toBeVisible();
    });

    it('debe mostrar mensaje de error y permitir reintentar si falla la carga', async () => {
      const user = userEvent.setup();
      let shouldFail = true;

      const failingApi: SitesApiPort = {
        getUserSites: async (): Promise<readonly SiteDto[]> => {
          if (shouldFail) {
            throw new Error('Error al cargar sitios');
          }
          return mockAdapter.getUserSites();
        },
        createSite: mockAdapter.createSite.bind(mockAdapter),
        deleteSite: mockAdapter.deleteSite.bind(mockAdapter),
      };

      render(<SitesView sitesApi={failingApi} />);

      const errorAlert = await screen.findByRole('alert');
      expect(errorAlert).toBeVisible();
      expect(errorAlert).toHaveTextContent(/error al cargar sitios/i);

      const retryBtn = screen.getByRole('button', { name: /reintentar/i });
      expect(retryBtn).toBeVisible();

      // Desactivar fallo y reintentar
      shouldFail = false;
      await user.click(retryBtn);

      const siteHeading = await screen.findByRole('heading', {
        name: 'Tienda Demo Artesanal',
      });
      expect(siteHeading).toBeVisible();
    });
  });
});
