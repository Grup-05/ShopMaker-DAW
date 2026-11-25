import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../application/useAuth';

export type GuardedRouteMode = 'protected' | 'guest-only';

export interface GuardedRouteProps {
  readonly mode: GuardedRouteMode;
  readonly children: ReactNode;
}

/**
 * Centraliza las dos reglas de acceso de PBI-005.
 *
 * - `protected`: un invitado va a `/login` conservando el destino original.
 * - `guest-only`: un usuario autenticado va a `/dashboard`.
 *
 * Durante `Loading` no se redirige para evitar bucles y parpadeos.
 */
export function GuardedRoute({ mode, children }: GuardedRouteProps) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'Loading') {
    return (
      <p className="guarded-route__loading" role="status">
        Comprobando sesión…
      </p>
    );
  }

  if (mode === 'protected' && status === 'Guest') {
    const redirect = encodeURIComponent(
      `${location.pathname}${location.search}`,
    );

    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (mode === 'guest-only' && status === 'Authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
