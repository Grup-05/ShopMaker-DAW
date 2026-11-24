import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { DashboardPage } from '../../../src/features/dashboard/presentation/DashboardPage';
import { LocalStorageMockApiAdapter } from '../../../src/infrastructure/api/mock/LocalStorageMockApiAdapter';

describe('DashboardLayout & DashboardPage', () => {
  let mockAdapter: LocalStorageMockApiAdapter;

  beforeEach(async () => {
    localStorage.clear();
    mockAdapter = new LocalStorageMockApiAdapter({ minLatencyMs: 0, maxLatencyMs: 0 });
    await mockAdapter.login({
      email: 'demo@shopmaker.local',
      password: 'DemoPassword2026!',
    });
  });

  describe('[PBI-006][CA-01] dashboard-layout-structure', () => {
    it('debe renderizar los landmarks semánticos, el menú lateral y el saludo al usuario', async () => {
      render(
        <DashboardPage
          authApi={mockAdapter}
          sitesApi={mockAdapter}
          modulesApi={mockAdapter}
        />
      );

      // Esperar a que se cargue la información del usuario autenticado
      const greeting = await screen.findByRole('heading', {
        name: /hola, usuario demo shopmaker/i,
      });
      expect(greeting).toBeVisible();

      // Landmarks semánticos
      const sidebar = screen.getByRole('complementary', { name: /navegación del panel/i });
      expect(sidebar).toBeVisible();

      const nav = within(sidebar).getByRole('navigation', { name: /secciones del panel/i });
      expect(nav).toBeVisible();

      const main = screen.getByRole('main', { name: /contenido principal/i });
      expect(main).toBeVisible();

      // Enlaces / botones de navegación lateral
      const sitesNavBtn = within(nav).getByRole('button', { name: /mis sitios/i });
      const catalogNavBtn = within(nav).getByRole('button', { name: /catálogo de módulos/i });
      const settingsNavBtn = within(nav).getByRole('button', { name: /configuración/i });

      expect(sitesNavBtn).toBeVisible();
      expect(catalogNavBtn).toBeVisible();
      expect(settingsNavBtn).toBeVisible();

      // Por defecto la sección activa es 'Mis Sitios'
      expect(sitesNavBtn).toHaveAttribute('aria-current', 'page');
      expect(catalogNavBtn).not.toHaveAttribute('aria-current', 'page');
    });

    it('debe permitir conmutar entre secciones con el menú lateral', async () => {
      const user = userEvent.setup();
      render(
        <DashboardPage
          authApi={mockAdapter}
          sitesApi={mockAdapter}
          modulesApi={mockAdapter}
        />
      );

      const catalogNavBtn = await screen.findByRole('button', { name: /catálogo de módulos/i });
      await user.click(catalogNavBtn);

      // Ahora el catálogo debe ser la página activa
      expect(catalogNavBtn).toHaveAttribute('aria-current', 'page');

      // Comprobar que en el área principal se visualiza el catálogo
      const catalogHeading = screen.getByRole('heading', { name: /catálogo de módulos/i });
      expect(catalogHeading).toBeVisible();
    });

    it('debe incluir el botón de cambio de tema accesible en la barra superior', async () => {
      render(
        <DashboardPage
          authApi={mockAdapter}
          sitesApi={mockAdapter}
          modulesApi={mockAdapter}
        />
      );

      const themeBtn = await screen.findByRole('button', { name: /cambiar tema/i });
      expect(themeBtn).toBeVisible();
    });
  });
});
