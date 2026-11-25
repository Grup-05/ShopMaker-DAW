import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { AuthApiPort } from '../../../src/domain/ports';
import { App } from '../../../src/app/App';
import { AuthProvider } from '../../../src/features/auth/application/AuthContext';
import { UserMenu } from '../../../src/features/auth/presentation/UserMenu';
import { createAuthApi } from './authApiFake';

function renderUserMenu(authApi: AuthApiPort = createAuthApi()) {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <AuthProvider authApi={authApi}>
        <Routes>
          <Route path="/dashboard" element={<UserMenu />} />
          <Route path="/" element={<h1>Inicio</h1>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('[PBI-005][CA-06] user-menu-header', () => {
  it('muestra las iniciales y el nombre del usuario autenticado', async () => {
    renderUserMenu();

    const trigger = await screen.findByRole('button', {
      name: /menú de ana pérez/i,
    });

    expect(within(trigger).getByText('AP')).toBeVisible();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('abre un menú accesible y cierra sesión navegando a /', async () => {
    const user = userEvent.setup();
    const logout = vi.fn(async () => {});
    renderUserMenu(createAuthApi({ logout }));

    const trigger = await screen.findByRole('button', {
      name: /menú de ana pérez/i,
    });
    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('ana@example.com')).toBeVisible();

    const menu = screen.getByRole('menu', { name: /acciones de cuenta/i });
    await user.click(
      within(menu).getByRole('menuitem', { name: /cerrar sesión/i }),
    );

    expect(logout).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByRole('heading', { name: /^inicio$/i }),
    ).toBeVisible();
  });

  it('cierra el menú con Escape y devuelve el foco al disparador', async () => {
    const user = userEvent.setup();
    renderUserMenu();

    const trigger = await screen.findByRole('button', {
      name: /menú de ana pérez/i,
    });
    await user.click(trigger);

    expect(screen.getByRole('menu')).toBeVisible();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('sustituye los enlaces de acceso por el menú de usuario en la cabecera', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App authApi={createAuthApi()} />
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('button', { name: /menú de ana pérez/i }),
    ).toBeVisible();

    const navigation = screen.getByRole('navigation');
    expect(
      within(navigation).queryByRole('link', { name: /iniciar sesión/i }),
    ).not.toBeInTheDocument();
    expect(
      within(navigation).queryByRole('link', { name: /registrarse/i }),
    ).not.toBeInTheDocument();
  });
});
