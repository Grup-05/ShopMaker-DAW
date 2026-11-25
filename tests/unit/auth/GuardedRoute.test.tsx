import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '../../../src/domain/ports/ApiError';
import type { AuthApiPort, UserDto } from '../../../src/domain/ports';
import { AuthProvider } from '../../../src/features/auth/application/AuthContext';
import { GuardedRoute } from '../../../src/features/auth/presentation/GuardedRoute';
import { createAuthApi, validUser } from './authApiFake';

function LocationProbe() {
  const location = useLocation();

  return (
    <p data-testid="location">{`${location.pathname}${location.search}`}</p>
  );
}

function guestApi(): AuthApiPort {
  return createAuthApi({
    me: vi.fn(
      async (): Promise<UserDto> => {
        throw new ApiError({
          status: 401,
          code: 'UNAUTHORIZED',
          message: 'No existe una sesión activa.',
        });
      },
    ),
  });
}

function authenticatedApi(): AuthApiPort {
  return createAuthApi({ me: vi.fn(async () => validUser) });
}

function loadingApi(): AuthApiPort {
  return createAuthApi({
    me: vi.fn(() => new Promise<UserDto>(() => {})),
  });
}

describe('[PBI-005][CA-05] guarded-route-redirect', () => {
  it('redirige a un invitado de /dashboard a /login con redirect codificado', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider authApi={guestApi()}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <GuardedRoute mode="protected">
                  <h1>Panel de administración</h1>
                </GuardedRoute>
              }
            />
            <Route path="/login" element={<LocationProbe />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText('/login?redirect=%2Fdashboard'),
    ).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: /panel de administración/i }),
    ).not.toBeInTheDocument();
  });

  it('renderiza el hijo protegido cuando la sesión está autenticada', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider authApi={authenticatedApi()}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <GuardedRoute mode="protected">
                  <h1>Panel de administración</h1>
                </GuardedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('heading', {
        name: /panel de administración/i,
      }),
    ).toBeVisible();
  });

  it('muestra un estado de carga sin redirigir mientras se comprueba la sesión', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider authApi={loadingApi()}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <GuardedRoute mode="protected">
                  <h1>Panel de administración</h1>
                </GuardedRoute>
              }
            />
            <Route path="/login" element={<LocationProbe />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      /comprobando sesión/i,
    );
    expect(screen.queryByTestId('location')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /panel de administración/i }),
    ).not.toBeInTheDocument();
  });

  it('redirige a un usuario autenticado de /login a /dashboard en modo guest-only', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider authApi={authenticatedApi()}>
          <Routes>
            <Route
              path="/login"
              element={
                <GuardedRoute mode="guest-only">
                  <h1>Iniciar sesión</h1>
                </GuardedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={<h1>Panel de administración</h1>}
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('heading', {
        name: /panel de administración/i,
      }),
    ).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: /iniciar sesión/i }),
    ).not.toBeInTheDocument();
  });

  it('permite a un invitado ver /login en modo guest-only', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider authApi={guestApi()}>
          <Routes>
            <Route
              path="/login"
              element={
                <GuardedRoute mode="guest-only">
                  <h1>Iniciar sesión</h1>
                </GuardedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('heading', { name: /iniciar sesión/i }),
    ).toBeVisible();
  });
});
