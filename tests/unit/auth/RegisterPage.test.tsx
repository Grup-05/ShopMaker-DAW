import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../../src/domain/ports/ApiError';
import type {
  RegisterUserDto,
  UserDto,
} from '../../../src/domain/ports/AuthApiPort';
import { RegisterPage } from '../../../src/features/auth/presentation/RegisterPage';

type RegisterHandler = (data: RegisterUserDto) => Promise<UserDto>;

const validUser: UserDto = {
  id: 'user-1',
  name: 'Ana Pérez',
  email: 'ana@example.com',
};

function renderRegisterPage(
  register: RegisterHandler,
  initialEntry = '/register',
) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/register" element={<RegisterPage register={register} />} />
        <Route path="/dashboard" element={<h1>Panel de administración</h1>} />
        <Route path="/login" element={<h1>Iniciar sesión</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/nombre completo/i), 'Ana Pérez');
  await user.type(
    screen.getByLabelText(/correo electrónico/i),
    'ana@example.com',
  );
  await user.type(screen.getByLabelText(/^contraseña$/i), 'Abcdef12!');
  await user.type(
    screen.getByLabelText(/^confirmar contraseña$/i),
    'Abcdef12!',
  );
  await user.click(
    screen.getByRole('checkbox', { name: /acepto los términos y condiciones/i }),
  );
}

async function submitForm(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /^crear cuenta$/i }));
}

describe('[PBI-005][CA-01] register-form-submission', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza los campos obligatorios, el medidor y las ayudas de autocompletado', () => {
    renderRegisterPage(vi.fn());

    expect(
      screen.getByRole('heading', { name: /crear cuenta|registro/i }),
    ).toBeVisible();

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^contraseña$/i);
    const confirmInput = screen.getByLabelText(/^confirmar contraseña$/i);

    expect(nameInput).toHaveAttribute('autocomplete', 'name');
    expect(emailInput).toHaveAttribute('autocomplete', 'email');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('autocomplete', 'new-password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmInput).toHaveAttribute('autocomplete', 'new-password');
    expect(confirmInput).toHaveAttribute('type', 'password');

    expect(
      screen.getByRole('checkbox', {
        name: /acepto los términos y condiciones/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: /^crear cuenta$/i }),
    ).toBeVisible();

    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuetext', 'Sin contraseña');
    expect(meter).toHaveAttribute('aria-valuenow', '0');

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveTextContent(/sin contraseña/i);
  });

  it('[PBI-005][CA-02] anuncia en vivo los niveles débil, medio y fuerte', async () => {
    const user = userEvent.setup();
    renderRegisterPage(vi.fn());

    const passwordInput = screen.getByLabelText(/^contraseña$/i);
    const liveRegion = screen.getByRole('status');

    await user.type(passwordInput, 'abc');
    expect(liveRegion).toHaveTextContent(/débil/i);
    expect(screen.getByRole('meter')).toHaveAttribute(
      'aria-valuetext',
      'Débil',
    );

    await user.clear(passwordInput);
    await user.type(passwordInput, 'Abcdef12');
    expect(liveRegion).toHaveTextContent(/media/i);
    expect(screen.getByRole('meter')).toHaveAttribute(
      'aria-valuetext',
      'Media',
    );

    await user.type(passwordInput, '!');
    expect(liveRegion).toHaveTextContent(/fuerte/i);
    expect(screen.getByRole('meter')).toHaveAttribute(
      'aria-valuetext',
      'Fuerte',
    );
  });

  it('rechaza un correo con formato inválido sin llamar al puerto', async () => {
    const user = userEvent.setup();
    const register = vi.fn<RegisterHandler>();
    renderRegisterPage(register);

    await user.type(screen.getByLabelText(/nombre completo/i), 'Ana Pérez');
    await user.type(screen.getByLabelText(/correo electrónico/i), 'ana@');
    await user.type(screen.getByLabelText(/^contraseña$/i), 'Abcdef12!');
    await user.type(
      screen.getByLabelText(/^confirmar contraseña$/i),
      'Abcdef12!',
    );
    await user.click(
      screen.getByRole('checkbox', {
        name: /acepto los términos y condiciones/i,
      }),
    );
    await submitForm(user);

    expect(
      await screen.findByText(/correo electrónico válido/i),
    ).toBeVisible();
    expect(register).not.toHaveBeenCalled();
  });

  it('exige una contraseña de al menos 8 caracteres', async () => {
    const user = userEvent.setup();
    const register = vi.fn<RegisterHandler>();
    renderRegisterPage(register);

    await user.type(screen.getByLabelText(/nombre completo/i), 'Ana Pérez');
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'ana@example.com',
    );
    await user.type(screen.getByLabelText(/^contraseña$/i), 'Ab1!');
    await user.type(screen.getByLabelText(/^confirmar contraseña$/i), 'Ab1!');
    await user.click(
      screen.getByRole('checkbox', {
        name: /acepto los términos y condiciones/i,
      }),
    );
    await submitForm(user);

    expect(await screen.findByText(/al menos 8 caracteres/i)).toBeVisible();
    expect(register).not.toHaveBeenCalled();
  });

  it('asocia el error de confirmación al campo mediante aria-describedby', async () => {
    const user = userEvent.setup();
    const register = vi.fn<RegisterHandler>();
    renderRegisterPage(register);

    await user.type(screen.getByLabelText(/nombre completo/i), 'Ana Pérez');
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'ana@example.com',
    );
    await user.type(screen.getByLabelText(/^contraseña$/i), 'Abcdef12!');
    await user.type(
      screen.getByLabelText(/^confirmar contraseña$/i),
      'Abcdef12?',
    );
    await user.click(
      screen.getByRole('checkbox', {
        name: /acepto los términos y condiciones/i,
      }),
    );
    await submitForm(user);

    expect(await screen.findByText(/no coinciden/i)).toBeVisible();

    const confirmInput = screen.getByLabelText(/^confirmar contraseña$/i);
    expect(confirmInput).toHaveAttribute('aria-invalid', 'true');

    const describedBy = confirmInput.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      /no coinciden/i,
    );
    expect(register).not.toHaveBeenCalled();
  });

  it('exige aceptar los términos y asocia el error a la casilla', async () => {
    const user = userEvent.setup();
    const register = vi.fn<RegisterHandler>();
    renderRegisterPage(register);

    await user.type(screen.getByLabelText(/nombre completo/i), 'Ana Pérez');
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'ana@example.com',
    );
    await user.type(screen.getByLabelText(/^contraseña$/i), 'Abcdef12!');
    await user.type(
      screen.getByLabelText(/^confirmar contraseña$/i),
      'Abcdef12!',
    );
    await submitForm(user);

    expect(
      await screen.findByText(/debes aceptar los términos y condiciones/i),
    ).toBeVisible();

    const terms = screen.getByRole('checkbox', {
      name: /acepto los términos y condiciones/i,
    });
    expect(terms).toHaveAttribute('aria-invalid', 'true');

    const describedBy = terms.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy as string)).toHaveTextContent(
      /debes aceptar los términos y condiciones/i,
    );
    expect(register).not.toHaveBeenCalled();
  });

  it('envía el DTO exacto al puerto y navega a /dashboard', async () => {
    const user = userEvent.setup();
    const register = vi.fn(async (_data: RegisterUserDto) => validUser);
    renderRegisterPage(register);

    await fillValidForm(user);
    await submitForm(user);

    await waitFor(() => expect(register).toHaveBeenCalledTimes(1));
    expect(register).toHaveBeenCalledWith({
      name: 'Ana Pérez',
      email: 'ana@example.com',
      password: 'Abcdef12!',
      acceptTerms: true,
    });

    const payload = register.mock.calls[0][0];
    expect(payload).not.toHaveProperty('confirmPassword');

    expect(
      await screen.findByRole('heading', { name: /panel de administración/i }),
    ).toBeVisible();
  });

  it('respeta un redirect interno seguro tras el registro', async () => {
    const user = userEvent.setup();
    const register = vi.fn(async (_data: RegisterUserDto) => validUser);
    renderRegisterPage(register, '/register?redirect=%2Flogin');

    await fillValidForm(user);
    await submitForm(user);

    expect(
      await screen.findByRole('heading', { name: /iniciar sesión/i }),
    ).toBeVisible();
  });

  it.each([
    ['una URL absoluta', 'https%3A%2F%2Fevil.example'],
    ['una ruta protocol-relative', '%2F%2Fevil.example'],
  ])(
    'ignora %s en ?redirect y vuelve a /dashboard',
    async (_description, redirect) => {
      const user = userEvent.setup();
      const register = vi.fn(async (_data: RegisterUserDto) => validUser);
      renderRegisterPage(register, `/register?redirect=${redirect}`);

      await fillValidForm(user);
      await submitForm(user);

      expect(
        await screen.findByRole('heading', {
          name: /panel de administración/i,
        }),
      ).toBeVisible();
    },
  );

  it('muestra el error 409 en una alerta accesible y conserva el correo', async () => {
    const user = userEvent.setup();
    const register = vi.fn(async (_data: RegisterUserDto): Promise<UserDto> => {
      throw new ApiError({
        status: 409,
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Ya existe una cuenta con este correo electrónico.',
      });
    });
    renderRegisterPage(register);

    await fillValidForm(user);
    await submitForm(user);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/ya existe una cuenta/i);
    expect(screen.getByLabelText(/correo electrónico/i)).toHaveValue(
      'ana@example.com',
    );
    expect(
      screen.queryByRole('heading', { name: /panel de administración/i }),
    ).not.toBeInTheDocument();
  });

  it('deshabilita el botón y anuncia la carga mientras espera al puerto', async () => {
    const user = userEvent.setup();
    let resolveRegister!: (user: UserDto) => void;
    const register = vi.fn(
      (_data: RegisterUserDto) =>
        new Promise<UserDto>((resolve) => {
          resolveRegister = resolve;
        }),
    );
    renderRegisterPage(register);

    await fillValidForm(user);
    await submitForm(user);

    const pendingButton = screen.getByRole('button', { name: /creando/i });
    expect(pendingButton).toBeDisabled();

    resolveRegister(validUser);

    expect(
      await screen.findByRole('heading', { name: /panel de administración/i }),
    ).toBeVisible();
  });
});
