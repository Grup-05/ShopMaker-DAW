export interface UserDto {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatarUrl?: string;
}

export interface LoginCredentialsDto {
  readonly email: string;
  readonly password: string;
  readonly rememberMe?: boolean;
}

export interface RegisterUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly acceptTerms: boolean;
}

export interface AuthResponseDto {
  readonly user: UserDto;
  readonly token: string;
}

/**
 * Puerto de API de Autenticación e Identidad.
 * La UI (PBI-005) y el Mock (PBI-003) se comunican a través de este contrato.
 */
export interface AuthApiPort {
  login(credentials: LoginCredentialsDto): Promise<AuthResponseDto>;
  register(userData: RegisterUserDto): Promise<AuthResponseDto>;
  me(): Promise<UserDto>;
  recoverPassword(email: string): Promise<void>;
  logout(): Promise<void>;
}
