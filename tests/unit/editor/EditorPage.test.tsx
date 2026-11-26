import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageMockApiAdapter } from '../../../src/infrastructure/api/mock/LocalStorageMockApiAdapter';
import { EditorPage } from '../../../src/features/editor/presentation/EditorPage';
import { DashboardPage } from '../../../src/features/dashboard/presentation/DashboardPage';

describe('[PBI-008][T02][T04] EditorPage (/editor/:siteId) — Paleta, Lienzo e Inspector', () => {
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

  function renderEditor(siteId = 'site-demo-01') {
    return render(
      <MemoryRouter initialEntries={[`/editor/${siteId}`]}>
        <Routes>
          <Route
            path="/editor/:siteId"
            element={
              <EditorPage sitesApi={mockAdapter} modulesApi={mockAdapter} />
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                authApi={mockAdapter}
                sitesApi={mockAdapter}
                modulesApi={mockAdapter}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );
  }

  it('[PBI-008][CA-01] navega desde el botón Editar de Mis Sitios hacia /editor/:siteId', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                authApi={mockAdapter}
                sitesApi={mockAdapter}
                modulesApi={mockAdapter}
              />
            }
          />
          <Route
            path="/editor/:siteId"
            element={
              <EditorPage sitesApi={mockAdapter} modulesApi={mockAdapter} />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    const editBtn = await screen.findByRole('button', {
      name: /editar tienda demo artesanal/i,
    });
    await user.click(editBtn);

    expect(
      await screen.findByRole('heading', {
        name: /editor: tienda demo artesanal/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('region', { name: /paleta de bloques/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('region', { name: /lienzo de bloques/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('region', { name: /inspector de propiedades/i }),
    ).toBeVisible();
  });

  it('[PBI-008][CA-01] añade bloques estructurales y de módulos instalados, los reordena, duplica y elimina con confirmación', async () => {
    const user = userEvent.setup();
    await mockAdapter.installModule('site-demo-01', 'mod-ecommerce-cart');

    renderEditor('site-demo-01');

    await screen.findByRole('heading', {
      name: /editor: tienda demo artesanal/i,
    });

    // Añadir bloque Hero y bloque de módulo instalado Carrito E-commerce
    await user.click(
      screen.getByRole('button', { name: /añadir bloque hero/i }),
    );
    await user.click(
      screen.getByRole('button', {
        name: /añadir módulo carrito e-commerce/i,
      }),
    );

    const canvas = screen.getByRole('region', { name: /lienzo de bloques/i });
    const itemsBeforeMove = within(canvas).getAllByRole('listitem');
    expect(itemsBeforeMove).toHaveLength(2);
    expect(itemsBeforeMove[0]).toHaveTextContent(/portada principal/i);
    expect(itemsBeforeMove[1]).toHaveTextContent(/carrito e-commerce/i);

    // Subir el segundo bloque (Carrito E-commerce) a la primera posición
    const moveUpBtn = within(itemsBeforeMove[1]).getByRole('button', {
      name: /subir bloque/i,
    });
    await user.click(moveUpBtn);

    const itemsAfterMove = within(canvas).getAllByRole('listitem');
    expect(itemsAfterMove[0]).toHaveTextContent(/carrito e-commerce/i);
    expect(itemsAfterMove[1]).toHaveTextContent(/portada principal/i);

    // Duplicar el primer bloque
    const duplicateBtn = within(itemsAfterMove[0]).getByRole('button', {
      name: /duplicar bloque/i,
    });
    await user.click(duplicateBtn);

    const itemsAfterDuplicate = within(canvas).getAllByRole('listitem');
    expect(itemsAfterDuplicate).toHaveLength(3);
    expect(itemsAfterDuplicate[1]).toHaveTextContent(
      /carrito e-commerce \(copia\)/i,
    );

    // Eliminar bloque con contenido solicita confirmación antes de borrar
    const deleteBtn = within(itemsAfterDuplicate[1]).getByRole('button', {
      name: /eliminar bloque/i,
    });
    await user.click(deleteBtn);

    const confirmDeleteBtn = within(itemsAfterDuplicate[1]).getByRole(
      'button',
      {
        name: /confirmar eliminación/i,
      },
    );
    await user.click(confirmDeleteBtn);

    expect(within(canvas).getAllByRole('listitem')).toHaveLength(2);
  });

  it('[PBI-008][CA-02] edita en tiempo real las propiedades del bloque seleccionado desde el Inspector Lateral', async () => {
    const user = userEvent.setup();
    renderEditor('site-demo-01');

    await screen.findByRole('heading', {
      name: /editor: tienda demo artesanal/i,
    });

    await user.click(
      screen.getByRole('button', { name: /añadir bloque hero/i }),
    );

    const inspector = screen.getByRole('region', {
      name: /inspector de propiedades/i,
    });
    const titleInput = within(inspector).getByLabelText(/título del bloque/i);
    const contentInput = within(inspector).getByLabelText(
      /contenido del bloque/i,
    );
    const ctaInput = within(inspector).getByLabelText(/texto del botón cta/i);

    await user.clear(titleInput);
    await user.type(titleInput, 'Cerámica de Autor');

    await user.clear(contentInput);
    await user.type(contentInput, 'Piezas únicas cocidas a alta temperatura.');

    await user.clear(ctaInput);
    await user.type(ctaInput, 'Comprar ahora');

    const canvas = screen.getByRole('region', { name: /lienzo de bloques/i });
    expect(within(canvas).getByText('Cerámica de Autor')).toBeVisible();
    expect(
      within(canvas).getByText('Piezas únicas cocidas a alta temperatura.'),
    ).toBeVisible();
    expect(within(canvas).getByText('Comprar ahora')).toBeVisible();
  });
});
