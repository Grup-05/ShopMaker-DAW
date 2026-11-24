import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { CatalogView } from '../../../src/features/dashboard/presentation/CatalogView';
import { LocalStorageMockApiAdapter } from '../../../src/infrastructure/api/mock/LocalStorageMockApiAdapter';
import type { ModulesApiPort, ModuleDto } from '../../../src/domain/ports';

describe('CatalogView', () => {
  let mockAdapter: LocalStorageMockApiAdapter;

  beforeEach(() => {
    localStorage.clear();
    mockAdapter = new LocalStorageMockApiAdapter({ minLatencyMs: 0, maxLatencyMs: 0 });
  });

  describe('[PBI-006][CA-04] module-catalog-search-filter', () => {
    it('debe renderizar el catálogo completo de módulos con sus datos y estado', async () => {
      render(<CatalogView modulesApi={mockAdapter} />);

      // Título de la vista
      const title = screen.getByRole('heading', { name: /catálogo de módulos/i });
      expect(title).toBeVisible();

      // Módulos iniciales esperados
      const cartHeading = await screen.findByRole('heading', {
        name: 'Carrito E-commerce',
      });
      expect(cartHeading).toBeVisible();

      const contactHeading = screen.getByRole('heading', {
        name: 'Formulario de Contacto',
      });
      expect(contactHeading).toBeVisible();

      // Versión y categoría
      expect(screen.getByText(/1\.2\.0/)).toBeVisible();
      expect(screen.getByText(/ecommerce/i)).toBeVisible();
    });

    it('debe filtrar en tiempo real al escribir en el campo de búsqueda', async () => {
      const user = userEvent.setup();
      render(<CatalogView modulesApi={mockAdapter} />);

      await screen.findByRole('heading', { name: 'Carrito E-commerce' });

      const searchInput = screen.getByRole('searchbox', {
        name: /buscar módulos/i,
      });
      await user.type(searchInput, 'contacto');

      // Sólo debe aparecer el Formulario de Contacto
      expect(
        screen.getByRole('heading', { name: 'Formulario de Contacto' })
      ).toBeVisible();
      expect(
        screen.queryByRole('heading', { name: 'Carrito E-commerce' })
      ).not.toBeInTheDocument();
    });

    it('debe filtrar por botones de categoría alternando aria-pressed', async () => {
      const user = userEvent.setup();
      render(<CatalogView modulesApi={mockAdapter} />);

      await screen.findByRole('heading', { name: 'Carrito E-commerce' });

      const allBtn = screen.getByRole('button', { name: /todos|todas/i });
      const marketingBtn = screen.getByRole('button', { name: /marketing/i });

      expect(allBtn).toHaveAttribute('aria-pressed', 'true');
      expect(marketingBtn).toHaveAttribute('aria-pressed', 'false');

      // Filtrar por Marketing
      await user.click(marketingBtn);

      expect(marketingBtn).toHaveAttribute('aria-pressed', 'true');
      expect(allBtn).toHaveAttribute('aria-pressed', 'false');

      // Solo muestra los módulos de marketing (Formulario de Contacto)
      expect(
        screen.getByRole('heading', { name: 'Formulario de Contacto' })
      ).toBeVisible();
      expect(
        screen.queryByRole('heading', { name: 'Carrito E-commerce' })
      ).not.toBeInTheDocument();
    });

    it('debe mostrar mensaje explicativo de sin resultados y botón para limpiar filtros', async () => {
      const user = userEvent.setup();
      render(<CatalogView modulesApi={mockAdapter} />);

      await screen.findByRole('heading', { name: 'Carrito E-commerce' });

      const searchInput = screen.getByRole('searchbox', {
        name: /buscar módulos/i,
      });
      await user.type(searchInput, 'modulo_inexistente_999');

      const noResultsMsg = await screen.findByText(
        /no se encontraron módulos coincidentes/i
      );
      expect(noResultsMsg).toBeVisible();

      // Botón para limpiar filtros
      const resetBtn = screen.getByRole('button', {
        name: /limpiar filtros|restablecer/i,
      });
      expect(resetBtn).toBeVisible();

      await user.click(resetBtn);

      // Se recuperan los módulos
      expect(
        await screen.findByRole('heading', { name: 'Carrito E-commerce' })
      ).toBeVisible();
    });

    it('debe mostrar alerta de error si la API de módulos falla', async () => {
      const failingModulesApi: ModulesApiPort = {
        getCatalog: async (): Promise<readonly ModuleDto[]> => {
          throw new Error('Fallo al obtener el catálogo');
        },
        installModule: mockAdapter.installModule.bind(mockAdapter),
      };

      render(<CatalogView modulesApi={failingModulesApi} />);

      const errorAlert = await screen.findByRole('alert');
      expect(errorAlert).toBeVisible();
      expect(errorAlert).toHaveTextContent(/fallo al obtener el catálogo/i);
    });
  });
});
