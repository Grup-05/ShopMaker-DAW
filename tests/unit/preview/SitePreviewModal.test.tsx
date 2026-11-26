import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SitePreviewModal } from '../../../src/features/preview/presentation/SitePreviewModal';
import type { SiteDto } from '../../../src/domain/ports';

const draftSite: SiteDto = {
  id: 'site-preview-1',
  name: 'Panadería Artesanal',
  subdomain: 'panaderia.shopmaker.local',
  status: 'draft',
  category: 'ecommerce',
  createdAt: '2026-11-26T10:00:00.000Z',
  updatedAt: '2026-11-26T10:00:00.000Z',
};

describe('[PBI-009][T04] SitePreviewModal', () => {
  describe('[RF-03][CA-03] visor aislado con iframe sandbox', () => {
    it('renderiza un diálogo modal accesible con iframe sandbox estricto y srcDoc', () => {
      render(
        <SitePreviewModal
          site={draftSite}
          isOpen={true}
          onClose={vi.fn()}
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeVisible();
      expect(dialog).toHaveAttribute('aria-modal', 'true');

      const iframe = screen.getByTitle(/previsualización de panadería artesanal/i);
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('sandbox', '');
      expect(iframe.getAttribute('srcdoc')).toContain('Panadería Artesanal');
    });

    it('cierra el modal al pulsar Escape o el botón Cerrar', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <SitePreviewModal
          site={draftSite}
          isOpen={true}
          onClose={onClose}
        />
      );

      await user.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalledTimes(1);

      const closeBtn = screen.getByRole('button', { name: /cerrar previsualización/i });
      await user.click(closeBtn);
      expect(onClose).toHaveBeenCalledTimes(2);
    });
  });

  describe('[RF-03][CA-04] conmutador accesible de viewports', () => {
    it('permite alternar entre Móvil (360px), Tablet (768px) y Escritorio (1280px) actualizando aria-pressed y ancho', async () => {
      const user = userEvent.setup();

      render(
        <SitePreviewModal
          site={draftSite}
          isOpen={true}
          onClose={vi.fn()}
        />
      );

      const desktopBtn = screen.getByRole('button', { name: /escritorio/i });
      const tabletBtn = screen.getByRole('button', { name: /tablet/i });
      const mobileBtn = screen.getByRole('button', { name: /móvil/i });

      expect(desktopBtn).toHaveAttribute('aria-pressed', 'true');
      expect(tabletBtn).toHaveAttribute('aria-pressed', 'false');
      expect(mobileBtn).toHaveAttribute('aria-pressed', 'false');

      const frameWrapper = screen.getByTestId('preview-viewport-frame');
      expect(frameWrapper).toHaveStyle({ width: '1280px' });

      await user.click(mobileBtn);
      expect(mobileBtn).toHaveAttribute('aria-pressed', 'true');
      expect(desktopBtn).toHaveAttribute('aria-pressed', 'false');
      expect(frameWrapper).toHaveStyle({ width: '360px' });

      await user.click(tabletBtn);
      expect(tabletBtn).toHaveAttribute('aria-pressed', 'true');
      expect(mobileBtn).toHaveAttribute('aria-pressed', 'false');
      expect(frameWrapper).toHaveStyle({ width: '768px' });
    });
  });
});
