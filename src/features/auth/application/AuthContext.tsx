import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AuthApiPort,
  LoginCredentialsDto,
  RegisterUserDto,
  UserDto,
} from '../../../domain/ports';
import type { AuthStatus } from '../domain/AuthStatus';

export interface AuthContextValue {
  readonly status: AuthStatus;
  readonly user: UserDto | null;
  readonly login: (credentials: LoginCredentialsDto) => Promise<UserDto>;
  readonly register: (data: RegisterUserDto) => Promise<UserDto>;
  readonly logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  readonly authApi: AuthApiPort;
  readonly children: ReactNode;
}

interface AuthState {
  readonly status: AuthStatus;
  readonly user: UserDto | null;
}

const INITIAL_STATE: AuthState = { status: 'Loading', user: null };

export function AuthProvider({ authApi, children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);

  useEffect(() => {
    let active = true;

    authApi.me().then(
      (user) => {
        if (active) {
          setState({ status: 'Authenticated', user });
        }
      },
      () => {
        if (active) {
          setState({ status: 'Guest', user: null });
        }
      },
    );

    return () => {
      active = false;
    };
  }, [authApi]);

  const login = useCallback(
    async (credentials: LoginCredentialsDto): Promise<UserDto> => {
      const response = await authApi.login(credentials);
      setState({ status: 'Authenticated', user: response.user });
      return response.user;
    },
    [authApi],
  );

  const register = useCallback(
    async (data: RegisterUserDto): Promise<UserDto> => {
      const response = await authApi.register(data);
      setState({ status: 'Authenticated', user: response.user });
      return response.user;
    },
    [authApi],
  );

  const logout = useCallback(async (): Promise<void> => {
    await authApi.logout();
    setState({ status: 'Guest', user: null });
  }, [authApi]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status: state.status,
      user: state.user,
      login,
      register,
      logout,
    }),
    [state.status, state.user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
