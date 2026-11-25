import type {
  AuthApiPort,
  AuthResponseDto,
  LoginCredentialsDto,
  RegisterUserDto,
  UserDto,
} from '../../../src/domain/ports';

export const validUser: UserDto = {
  id: 'user-1',
  name: 'Ana Pérez',
  email: 'ana@example.com',
};

export const validAuthResponse: AuthResponseDto = {
  user: validUser,
  token: 'token-1',
};

/**
 * Puerto de autenticación falso para tests de sesión.
 * Por defecto simula una sesión ya iniciada; cada test puede sobrescribir
 * solo los métodos que necesita observar o forzar.
 */
export function createAuthApi(
  overrides: Partial<AuthApiPort> = {},
): AuthApiPort {
  return {
    login: async (_credentials: LoginCredentialsDto) => validAuthResponse,
    register: async (_data: RegisterUserDto) => validAuthResponse,
    me: async () => validUser,
    recoverPassword: async (_email: string) => {},
    logout: async () => {},
    ...overrides,
  };
}
