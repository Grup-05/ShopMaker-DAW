import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateSiteModal } from '../../../src/features/dashboard/presentation/CreateSiteModal';

describe('CreateSiteModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn().mockResolvedValue({
      id: 'site-new-1',
      name: 'Mi Nueva Web',
      subdomain: 'mi-nueva-web.shopmaker.local',
      status: 'draft' as const,
      category: 'ecommerce',
      createdAt: '2026-11-23T12:00:00.000Z',
      updatedAt: '2026-11-23T12:00:00.000Z',
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('[PBI-006][CA-03] create-site-modal-accessible', () => {
    it('debe renderizarse como diálogo modal accesible con role="dialog" y aria-modal="true"', () => {
      render(<CreateSiteModal {...defaultProps} />);

      const dialog = screen.getByRole('dialog', { name: /crear nueva web/i });
      expect(dialog).toBeVisible();
      expect(dialog).toHaveAttribute('aria-modal', 'true');

      // Campos del formulario
      expect(screen.getByLabelText(/nombre de la web|nombre del sitio/i)).toBeVisible();
      expect(screen.getByLabelText(/subdominio/i)).toBeVisible();
      expect(screen.getByLabelText(/categoría/i)).toBeVisible();

      // Botones de acción
      expect(screen.getByRole('button', { name: /crear web|guardar|crear sitio/i })).toBeVisible();
      expect(screen.getByRole('button', { name: 'Cancelar' })).toBeVisible();
      expect(screen.getByRole('button', { name: 'Cerrar modal' })).toBeVisible();
    });

    it('no debe renderizar nada cuando isOpen es false', () => {
      render(<CreateSiteModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('debe cerrar el modal al pulsar la tecla Escape', async () => {
      const user = userEvent.setup();
      render(<CreateSiteModal {...defaultProps} />);

      await user.keyboard('{Escape}');
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('debe cerrar el modal al hacer clic en el botón de cancelar', async () => {
      const user = userEvent.setup();
      render(<CreateSiteModal {...defaultProps} />);

      const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelBtn);

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('debe validar que el nombre es obligatorio antes de enviar', async () => {
      const user = userEvent.setup();
      render(<CreateSiteModal {...defaultProps} />);

      const submitBtn = screen.getByRole('button', { name: /crear web|guardar|crear sitio/i });
      await user.click(submitBtn);

      expect(defaultProps.onSubmit).not.toHaveBeenCalled();
      const errorMsg = await screen.findByText(/el nombre del sitio es obligatorio/i);
      expect(errorMsg).toBeVisible();
    });

    it('debe autocompletar la sugerencia de subdominio y enviar los datos válidos', async () => {
      const user = userEvent.setup();
      render(<CreateSiteModal {...defaultProps} />);

      const nameInput = screen.getByLabelText(/nombre de la web|nombre del sitio/i);
      await user.type(nameInput, 'Boutique Vintage');

      // Verificar que el subdominio sugiere slug normalizado
      const subdomainInput = screen.getByLabelText(/subdominio/i) as HTMLInputElement;
      expect(subdomainInput.value).toContain('boutique-vintage');

      const submitBtn = screen.getByRole('button', { name: /crear web|guardar|crear sitio/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          name: 'Boutique Vintage',
          subdomain: expect.stringContaining('boutique-vintage'),
          category: expect.any(String),
        });
      });
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });
});
