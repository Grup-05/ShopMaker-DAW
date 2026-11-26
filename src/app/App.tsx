import { Route, Routes } from 'react-router-dom';
import type { AuthApiPort } from '../domain/ports';
import { LocalStorageMockApiAdapter } from '../infrastructure/api/mock/LocalStorageMockApiAdapter';
import { AuthProvider } from '../features/auth/application/AuthContext';
import { useAuth } from '../features/auth/application/useAuth';
import { GuardedRoute } from '../features/auth/presentation/GuardedRoute';
import { LoginPage } from '../features/auth/presentation/LoginPage';
import { RecoverPasswordPage } from '../features/auth/presentation/RecoverPasswordPage';
import { RegisterPage } from '../features/auth/presentation/RegisterPage';
import { DashboardPage } from '../features/dashboard/presentation/DashboardPage';
import { EditorPage } from '../features/editor/presentation/EditorPage';
import { createInMemoryPageRepository } from '../features/home/infrastructure/inMemoryPageRepository';
import { startedPages } from '../features/home/infrastructure/startedPages';
import { HomePage } from '../features/home/presentation/HomePage';

const defaultAuthApi = new LocalStorageMockApiAdapter();

export interface AppProps {
  readonly authApi?: AuthApiPort;
}

function LoginRoute() {
  const { login } = useAuth();

  return <LoginPage login={login} />;
}

function RegisterRoute() {
  const { register } = useAuth();

  return <RegisterPage register={register} />;
}

export function App({ authApi = defaultAuthApi }: AppProps = {}) {
  const repository = createInMemoryPageRepository(startedPages);

  return (
    <AuthProvider authApi={authApi}>
      <Routes>
        <Route
          path="/"
          element={<HomePage pages={repository.listStartedPages()} />}
        />
        <Route
          path="/login"
          element={
            <GuardedRoute mode="guest-only">
              <LoginRoute />
            </GuardedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuardedRoute mode="guest-only">
              <RegisterRoute />
            </GuardedRoute>
          }
        />
        <Route
          path="/recover"
          element={
            <GuardedRoute mode="guest-only">
              <RecoverPasswordPage />
            </GuardedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <GuardedRoute mode="protected">
              <DashboardPage />
            </GuardedRoute>
          }
        />
        <Route
          path="/editor/:siteId"
          element={
            <GuardedRoute mode="protected">
              <EditorPage
                sitesApi={defaultAuthApi}
                modulesApi={defaultAuthApi}
              />
            </GuardedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
