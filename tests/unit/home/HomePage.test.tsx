import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { StartedPage } from '@/features/home/domain/StartedPage';
import { HomePage } from '@/features/home/presentation/HomePage';

const pages: readonly StartedPage[] = [
  { id: 'page-1', name: 'Mi primera web' },
  { id: 'page-2', name: 'Tienda de ejemplo' },
];

function renderHome(initialPages: readonly StartedPage[] = pages) {
  return render(<HomePage pages={initialPages} />);
}

describe('HomePage', () => {
  it('[PBI-001][CA-01][RF-03] navigation-destinations', () => {
    renderHome();

    const navigation = screen.getByRole('navigation');
    const login = within(navigation).getByRole('link', {
      name: 'Iniciar sesión',
    });
    const register = within(navigation).getByRole('link', {
      name: 'Registrarse',
    });

    expect(login).toHaveAttribute('href');
    expect(login.getAttribute('href')).not.toBe('');
    expect(register).toHaveAttribute('href');
    expect(register.getAttribute('href')).not.toBe('');
    expect(
      within(navigation).queryByRole('link', { name: /contact/i }),
    ).not.toBeInTheDocument();
  });

  it('[PBI-001][CA-01] empty-pages-message', () => {
    renderHome([]);

    expect(screen.getByText('Ninguna Web en Progreso')).toBeVisible();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('[PBI-001][CA-01] preview-instruction', () => {
    renderHome();

    expect(
      screen.getByText('Seleccione una web para visualizar'),
    ).toBeVisible();
    expect(screen.queryByText(/vista previa/i)).not.toBeInTheDocument();
  });

  it('[PBI-001][CA-04] select-page', async () => {
    const user = userEvent.setup();
    renderHome();

    const pageButton = screen.getByRole('button', { name: 'Mi primera web' });
    expect(pageButton).toHaveAttribute('aria-pressed', 'false');

    await user.click(pageButton);

    expect(pageButton).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Web seleccionada: Mi primera web',
    );
  });

  it('[PBI-001][CA-04] selection-clears-instruction', async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByRole('button', { name: 'Tienda de ejemplo' }));

    expect(
      screen.queryByText('Seleccione una web para visualizar'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/vista previa/i)).not.toBeInTheDocument();
  });

  it('[PBI-001][CA-04][RNF-01] keyboard-navigation', async () => {
    const user = userEvent.setup();
    renderHome();

    await user.tab();
    expect(
      screen.getByRole('link', { name: 'Iniciar sesión' }),
    ).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('link', { name: 'Registrarse' })).toHaveFocus();

    await user.tab();
    expect(
      screen.getByRole('button', { name: 'Cambiar tema' }),
    ).toHaveFocus();

    await user.tab();
    expect(
      screen.getByRole('button', { name: 'Crear página' }),
    ).toHaveFocus();

    await user.tab();
    const pageButton = screen.getByRole('button', { name: 'Mi primera web' });
    expect(pageButton).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(pageButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('[PBI-001][CA-04] layout-button-does-not-select', async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(
      screen.getByRole('button', { name: 'Maquetar Mi primera web' }),
    );

    expect(
      screen.getByRole('button', { name: 'Mi primera web' }),
    ).toHaveAttribute('aria-pressed', 'false');
    expect(
      screen.getByText('Seleccione una web para visualizar'),
    ).toBeVisible();
  });

  it('[PBI-001][CA-04] create-button-inert', async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByRole('button', { name: 'Crear página' }));

    expect(
      screen.getByText('Seleccione una web para visualizar'),
    ).toBeVisible();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Ninguna Web en Progreso')).not.toBeInTheDocument();
  });

  it('[PBI-001][CA-04][RNF-01] inert-controls-focusable', async () => {
    const user = userEvent.setup();
    renderHome();

    const createButton = screen.getByRole('button', { name: 'Crear página' });
    createButton.focus();
    expect(createButton).toHaveFocus();

    const layoutButton = screen.getByRole('button', {
      name: 'Maquetar Mi primera web',
    });
    layoutButton.focus();
    expect(layoutButton).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(
      screen.getByRole('button', { name: 'Mi primera web' }),
    ).toHaveAttribute('aria-pressed', 'false');

    await user.keyboard(' ');
    expect(
      screen.getByRole('button', { name: 'Mi primera web' }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('[PBI-001][CA-06] theme-button-placement', () => {
    renderHome();

    const navigation = screen.getByRole('navigation');
    const themeButton = within(navigation).getByRole('button', {
      name: 'Cambiar tema',
    });

    expect(themeButton).toBeVisible();
    expect(themeButton).toBeEnabled();
  });
});
