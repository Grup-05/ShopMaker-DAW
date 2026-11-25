import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../../src/domain/ports/ApiError';
import type {
  LoginCredentialsDto,
  UserDto,
} from '../../../src/domain/ports/AuthApiPort';
import { LoginPage } from '../../../src/features/auth/presentation/LoginPage';

type LoginHandler = (credentials: LoginCredentialsDto) => Promise<UserDto>;

const validUser: UserDto = {
  id: 'user-1',
  name: 'Ana Pérez',
  email: 'ana@example.com',
};

function renderLoginPage(login: LoginHandler, initialEntry = '/login') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<LoginPage login={login} />} />
        <Route path="/dashboard" element={<h1>Panel de administración</h1>} />
        <Route path="/register" element={<h1>Crear cuenta</h1>} />
        <Route path="/recover" element={<h1>Recuperar contraseña</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillCredentials(
  user: ReturnType<typeof userEvent.setup>,
  email = 'ana@example.com',
  password = 'Abcdef12!',
) {
  await user.type(screen.getByLabelText(/correo electrónico/i), email);
  await user.type(screen.getByLabelText(/^contraseña$/i), password);
}

async function submitLogin(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /^entrar$/i }));
}

describe('[PBI-005][CA-03] login-success', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza campos accesibles, recordarme y enlace de recuperación', () => {
    renderLoginPage(vi.fn());

    expect(
      screen.getByRole('heading', { name: /iniciar sesión/i }),
    ).toBeVisible();

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^contraseña$/i);

    expect(emailInput).toHaveAttribute('autocomplete', 'username');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    expect(
      screen.getByRole('checkbox', { name: /recordarme/i }),
    ).not.toBeChecked();
    expect(
      screen.getByRole('link', { name: /recuperar contraseña/i }),
    ).toHaveAttribute('href', '/recover');
    expect(
      screen.getByRole('button', { name: /^entrar$/i }),
    ).toBeVisible();
  });

  it('envía las credenciales con rememberMe y navega a /dashboard', async () => {
    const user = userEvent.setup();
    const login = vi.fn(async (_credentials: LoginCredentialsDto) => validUser);
    renderLoginPage(login);

    await fillCredentials(user);
    await user.click(screen.getByRole('checkbox', { name: /recordarme/i }));
    await submitLogin(user);

    await waitFor(() => expect(login).toHaveBeenCalledTimes(1));
    expect(login).toHaveBeenCalledWith({
      email: 'ana@example.com',
      password: 'Abcdef12!',
      rememberMe: true,
    });
    expect(
      await screen.findByRole('heading', { name: /panel de administración/i }),
    ).toBeVisible();
  });

  it('envía rememberMe=false cuando la casilla no está marcada', async () => {
    const user = userEvent.setup();
    const login = vi.fn(async (_credentials: LoginCredentialsDto) => validUser);
    renderLoginPage(login);

    await fillCredentials(user);
    await submitLogin(user);

    await waitFor(() => expect(login).toHaveBeenCalledTimes(1));
    expect(login).toHaveBeenCalledWith({
      email: 'ana@example.com',
      password: 'Abcdef12!',
      rememberMe: false,
    });
  });

  it('respeta un redirect interno seguro tras el login', async () => {
    const user = userEvent.setup();
    const login = vi.fn(async (_credentials: LoginCredentialsDto) => validUser);
    renderLoginPage(login, '/login?redirect=%2Fregister');

    await fillCredentials(user);
    await submitLogin(user);

    expect(
      await screen.findByRole('heading', { name: /crear cuenta/i }),
    ).toBeVisible();
  });

  it.each([
    ['una URL absoluta', 'https%3A%2F%2Fevil.example'],
    ['una ruta protocol-relative', '%2F%2Fevil.example'],
  ])(
    'ignora %s en ?redirect y vuelve a /dashboard',
    async (_description, redirect) => {
      const user = userEvent.setup();
      const login = vi.fn(
        async (_credentials: LoginCredentialsDto) => validUser,
      );
      renderLoginPage(login, `/login?redirect=${redirect}`);

      await fillCredentials(user);
      await submitLogin(user);

      expect(
        await screen.findByRole('heading', {
          name: /panel de administración/i,
        }),
      ).toBeVisible();
    },
  );

  it('rechaza un correo con formato inválido sin llamar al puerto', async () => {
    const user = userEvent.setup();
    const login = vi.fn<LoginHandler>();
    renderLoginPage(login);

    await fillCredentials(user, 'ana@', 'Abcdef12!');
    await submitLogin(user);

    expect(
      await screen.findByText(/correo electrónico válido/i),
    ).toBeVisible();
    expect(login).not.toHaveBeenCalled();
  });

  it('exige introducir la contraseña antes de llamar al puerto', async () => {
    const user = userEvent.setup();
    const login = vi.fn<LoginHandler>();
    renderLoginPage(login);

    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'ana@example.com',
    );
    await submitLogin(user);

    expect(
      await screen.findByText(/introduce tu contraseña/i),
    ).toBeVisible();
    expect(login).not.toHaveBeenCalled();
  });

  it('deshabilita el botón y anuncia la carga mientras espera al puerto', async () => {
    const user = userEvent.setup();
    let resolveLogin!: (user: UserDto) => void;
    const login = vi.fn(
      (_credentials: LoginCredentialsDto) =>
        new Promise<UserDto>((resolve) => {
          resolveLogin = resolve;
        }),
    );
    renderLoginPage(login);

    await fillCredentials(user);
    await submitLogin(user);

    expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled();

    resolveLogin(validUser);

    expect(
      await screen.findByRole('heading', { name: /panel de administración/i }),
    ).toBeVisible();
  });
});

describe('[PBI-005][CA-04] login-invalid-credentials', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el error 401 en una alerta accesible y conserva el correo', async () => {
    const user = userEvent.setup();
    const login = vi.fn(
      async (_credentials: LoginCredentialsDto): Promise<UserDto> => {
        throw new ApiError({
          status: 401,
          code: 'INVALID_CREDENTIALS',
          message: 'Las credenciales no son correctas.',
        });
      },
    );
    renderLoginPage(login);

    await fillCredentials(user);
    await submitLogin(user);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/credenciales/i);
    expect(screen.getByLabelText(/correo electrónico/i)).toHaveValue(
      'ana@example.com',
    );
    expect(
      screen.queryByRole('heading', { name: /panel de administración/i }),
    ).not.toBeInTheDocument();
  });
});
