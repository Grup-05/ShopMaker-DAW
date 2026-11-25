import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from './AuthContext';

/**
 * Acceso al estado de sesión y a las operaciones de autenticación.
 *
 * Debe usarse dentro de `<AuthProvider>`; fuera de él el fallo es explícito
 * para evitar consumir un contexto vacío de forma silenciosa.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>.');
  }

  return context;
}
