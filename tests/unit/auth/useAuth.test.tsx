import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../../src/domain/ports/ApiError';
import type { AuthApiPort, UserDto } from '../../../src/domain/ports';
import { AuthProvider } from '../../../src/features/auth/application/AuthContext';
import { useAuth } from '../../../src/features/auth/application/useAuth';
import { createAuthApi, validUser } from './authApiFake';

function AuthProbe() {
  const { status, user, login, register, logout } = useAuth();

  return (
    <div>
      <p data-testid="status">{status}</p>
      <p data-testid="user">{user ? user.email : 'sin usuario'}</p>
      <button
        type="button"
        onClick={() =>
          void login({
            email: 'ana@example.com',
            password: 'Abcdef12!',
            rememberMe: true,
          })
        }
      >
        login
      </button>
      <button
        type="button"
        onClick={() =>
          void register({
            name: 'Ana Pérez',
            email: 'ana@example.com',
            password: 'Abcdef12!',
            acceptTerms: true,
          })
        }
      >
        register
      </button>
      <button type="button" onClick={() => void logout()}>
        logout
      </button>
    </div>
  );
}

function renderProbe(authApi: AuthApiPort) {
  return render(
    <AuthProvider authApi={authApi}>
      <AuthProbe />
    </AuthProvider>,
  );
}

function unauthenticatedMe() {
  return vi.fn(
    async (): Promise<UserDto> => {
      throw new ApiError({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'No existe una sesión activa.',
      });
    },
  );
}

describe('[PBI-005] useAuth', () => {
  it('hidrata la sesión con me(): Loading → Authenticated', async () => {
    const me = vi.fn(async () => validUser);
    renderProbe(createAuthApi({ me }));

    expect(screen.getByTestId('status')).toHaveTextContent('Loading');
    expect(await screen.findByText('Authenticated')).toBeVisible();
    expect(screen.getByTestId('user')).toHaveTextContent('ana@example.com');
    expect(me).toHaveBeenCalledTimes(1);
  });

  it('pasa a Guest cuando me() rechaza con 401', async () => {
    const me = unauthenticatedMe();
    renderProbe(createAuthApi({ me }));

    expect(await screen.findByText('Guest')).toBeVisible();
    expect(screen.getByTestId('user')).toHaveTextContent('sin usuario');
    expect(me).toHaveBeenCalledTimes(1);
  });

  it('login delega en el puerto y actualiza la sesión', async () => {
    const user = userEvent.setup();
    const login = vi.fn(async () => ({
      user: validUser,
      token: 'token-login',
    }));
    renderProbe(createAuthApi({ login, me: unauthenticatedMe() }));

    await screen.findByText('Guest');
    await user.click(screen.getByRole('button', { name: 'login' }));

    expect(await screen.findByText('Authenticated')).toBeVisible();
    expect(screen.getByTestId('user')).toHaveTextContent('ana@example.com');
    expect(login).toHaveBeenCalledWith({
      email: 'ana@example.com',
      password: 'Abcdef12!',
      rememberMe: true,
    });
  });

  it('register delega en el puerto y actualiza la sesión', async () => {
    const user = userEvent.setup();
    const register = vi.fn(async () => ({
      user: validUser,
      token: 'token-register',
    }));
    renderProbe(createAuthApi({ register, me: unauthenticatedMe() }));

    await screen.findByText('Guest');
    await user.click(screen.getByRole('button', { name: 'register' }));

    expect(await screen.findByText('Authenticated')).toBeVisible();
    expect(screen.getByTestId('user')).toHaveTextContent('ana@example.com');
    expect(register).toHaveBeenCalledWith({
      name: 'Ana Pérez',
      email: 'ana@example.com',
      password: 'Abcdef12!',
      acceptTerms: true,
    });
  });

  it('logout delega en el puerto y limpia la sesión', async () => {
    const user = userEvent.setup();
    const logout = vi.fn(async () => {});
    renderProbe(createAuthApi({ logout }));

    expect(await screen.findByText('Authenticated')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'logout' }));

    expect(await screen.findByText('Guest')).toBeVisible();
    expect(screen.getByTestId('user')).toHaveTextContent('sin usuario');
    expect(logout).toHaveBeenCalledTimes(1);
  });

  it('lanza un error claro fuera del proveedor', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    let thrown: unknown;

    try {
      render(<AuthProbe />);
    } catch (error) {
      thrown = error;
    }

    const logged = consoleError.mock.calls.flat().map(String).join(' ');
    consoleError.mockRestore();

    if (thrown) {
      expect(thrown).toBeInstanceOf(Error);
      expect((thrown as Error).message).toMatch(/AuthProvider/);
      return;
    }

    expect(logged).toMatch(/AuthProvider/);
  });
});
