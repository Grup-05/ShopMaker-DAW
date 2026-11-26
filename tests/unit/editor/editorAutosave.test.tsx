import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageMockApiAdapter } from '../../../src/infrastructure/api/mock/LocalStorageMockApiAdapter';
import { EditorPage } from '../../../src/features/editor/presentation/EditorPage';

describe('[PBI-008][T05][T06] Autoguardado y recuperación de borradores en /editor/:siteId', () => {
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

  function mountEditor(adapter = mockAdapter, siteId = 'site-demo-01') {
    return render(
      <MemoryRouter initialEntries={[`/editor/${siteId}`]}>
        <Routes>
          <Route
            path="/editor/:siteId"
            element={<EditorPage sitesApi={adapter} modulesApi={adapter} />}
          />
        </Routes>
      </MemoryRouter>,
    );
  }

  it('[PBI-008][CA-03] autoguarda los bloques en localStorage, anuncia el estado accesible y los recupera al reabrir el editor', async () => {
    const user = userEvent.setup();

    const firstRender = mountEditor();

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
    await user.clear(titleInput);
    await user.type(titleInput, 'Borrador Persistente S03');

    // Verificar anuncio accesible de autoguardado
    const statusBadge = await screen.findByRole('status');
    expect(statusBadge).toHaveTextContent(
      /borrador guardado automáticamente/i,
    );

    // Desmontar completamente y crear nueva instancia del adaptador que lee de localStorage
    firstRender.unmount();

    const reloadedAdapter = new LocalStorageMockApiAdapter({
      minLatencyMs: 0,
      maxLatencyMs: 0,
    });
    mountEditor(reloadedAdapter);

    const canvas = await screen.findByRole('region', {
      name: /lienzo de bloques/i,
    });
    expect(
      await within(canvas).findByText('Borrador Persistente S03'),
    ).toBeVisible();
  });

  it('[PBI-008][CA-03] permite abrir la previsualización aislada (<iframe sandbox>) desde el editor con los bloques actuales', async () => {
    const user = userEvent.setup();
    mountEditor();

    await screen.findByRole('heading', {
      name: /editor: tienda demo artesanal/i,
    });

    await user.click(
      screen.getByRole('button', { name: /añadir bloque hero/i }),
    );

    const previewBtn = screen.getByRole('button', {
      name: /previsualizar web/i,
    });
    await user.click(previewBtn);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeVisible();
    const iframe = screen.getByTitle(
      /previsualización de tienda demo artesanal/i,
    );
    expect(iframe).toHaveAttribute('sandbox', '');
    expect(iframe.getAttribute('srcdoc')).toContain('Portada Principal');
  });
});
