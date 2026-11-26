import {
  ApiError,
  type ApiErrorStatus,
  type AuthApiPort,
  type AuthResponseDto,
  type CreateSiteDto,
  type LoginCredentialsDto,
  type ModuleDto,
  type ModulesApiPort,
  type RegisterUserDto,
  type SiteDto,
  type SitesApiPort,
  type UserDto,
} from '../../../domain/ports';
import { slugify } from '../../../shared/lib/slugify';
import {
  DEFAULT_MOCK_STORAGE_KEY,
  createInitialMockState,
  type MockDatabaseState,
} from './mockFixtures';
import { resolveDefaultStorage, type StorageLike } from './storage';

export interface MockApiAdapterOptions {
  readonly storage?: StorageLike;
  readonly storageKey?: string;
  readonly minLatencyMs?: number;
  readonly maxLatencyMs?: number;
}

const DEFAULT_MIN_LATENCY_MS = 200;
const DEFAULT_MAX_LATENCY_MS = 500;
const SUBDOMAIN_SUFFIX = '.shopmaker.local';

function normalizeSubdomain(rawInput: string): string {
  const withoutSuffix = rawInput.trim().toLowerCase().endsWith(SUBDOMAIN_SUFFIX)
    ? rawInput.trim().slice(0, -SUBDOMAIN_SUFFIX.length)
    : rawInput;
  const slug = slugify(withoutSuffix);
  return slug ? `${slug}${SUBDOMAIN_SUFFIX}` : '';
}

function isValidPersistedState(value: unknown): value is MockDatabaseState {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    Array.isArray(candidate.users) &&
    Array.isArray(candidate.sites) &&
    Array.isArray(candidate.modules) &&
    typeof candidate.installedModulesBySite === 'object' &&
    candidate.installedModulesBySite !== null
  );
}

/**
 * Adaptador Mock Persistente que implementa AuthApiPort, SitesApiPort y ModulesApiPort.
 * Almacena el estado en localStorage (o StorageLike inyectado), simula latencia de red
 * configurable (200-500 ms por defecto) y errores HTTP deterministas.
 */
export class LocalStorageMockApiAdapter
  implements AuthApiPort, SitesApiPort, ModulesApiPort
{
  private readonly storage: StorageLike;
  private readonly storageKey: string;
  private minLatencyMs: number;
  private maxLatencyMs: number;
  private nextForcedErrorStatus: ApiErrorStatus | null = null;

  constructor(options: MockApiAdapterOptions = {}) {
    this.storage = options.storage ?? resolveDefaultStorage();
    this.storageKey = options.storageKey ?? DEFAULT_MOCK_STORAGE_KEY;
    this.minLatencyMs = options.minLatencyMs ?? DEFAULT_MIN_LATENCY_MS;
    this.maxLatencyMs = options.maxLatencyMs ?? DEFAULT_MAX_LATENCY_MS;
    this.readState();
  }

  setLatencyRange(minLatencyMs: number, maxLatencyMs: number): void {
    this.minLatencyMs = Math.max(0, minLatencyMs);
    this.maxLatencyMs = Math.max(this.minLatencyMs, maxLatencyMs);
  }

  simulateNextError(status: ApiErrorStatus | null): void {
    this.nextForcedErrorStatus = status;
  }

  resetState(): void {
    this.writeState(createInitialMockState());
  }

  async login(credentials: LoginCredentialsDto): Promise<AuthResponseDto> {
    await this.simulateNetworkBoundary();

    const normalizedEmail = credentials.email.trim().toLowerCase();
    const state = this.readState();
    const matched = state.users.find(
      (entry) =>
        entry.user.email.toLowerCase() === normalizedEmail &&
        entry.password === credentials.password,
    );

    if (!matched) {
      throw new ApiError({
        status: 401,
        code: 'INVALID_CREDENTIALS',
        message: 'Las credenciales introducidas no son válidas.',
      });
    }

    const token = `mock-session-${matched.user.id}-${Date.now()}`;
    this.writeState({
      ...state,
      activeUserId: matched.user.id,
      activeToken: token,
    });

    return {
      user: { ...matched.user },
      token,
    };
  }

  async register(userData: RegisterUserDto): Promise<AuthResponseDto> {
    await this.simulateNetworkBoundary();

    const normalizedEmail = userData.email.trim().toLowerCase();
    const trimmedName = userData.name.trim();

    if (!trimmedName || !normalizedEmail || !userData.password || !userData.acceptTerms) {
      throw new ApiError({
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Todos los campos obligatorios y la aceptación de términos son requeridos.',
      });
    }

    const state = this.readState();
    const exists = state.users.some(
      (entry) => entry.user.email.toLowerCase() === normalizedEmail,
    );

    if (exists) {
      throw new ApiError({
        status: 409,
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Ya existe una cuenta registrada con este correo electrónico.',
      });
    }

    const newUser: UserDto = {
      id: `user-${state.users.length + 1}-${Date.now()}`,
      name: trimmedName,
      email: normalizedEmail,
    };
    const token = `mock-session-${newUser.id}-${Date.now()}`;

    this.writeState({
      ...state,
      users: [...state.users, { user: newUser, password: userData.password }],
      activeUserId: newUser.id,
      activeToken: token,
    });

    return {
      user: { ...newUser },
      token,
    };
  }

  async me(): Promise<UserDto> {
    await this.simulateNetworkBoundary();

    const state = this.readState();
    if (!state.activeUserId) {
      throw new ApiError({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'No existe una sesión activa.',
      });
    }

    const found = state.users.find(
      (entry) => entry.user.id === state.activeUserId,
    );
    if (!found) {
      throw new ApiError({
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'La sesión activa ya no es válida.',
      });
    }

    return { ...found.user };
  }

  async recoverPassword(email: string): Promise<void> {
    await this.simulateNetworkBoundary();

    if (!email.trim()) {
      throw new ApiError({
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Debe proporcionar un correo electrónico válido.',
      });
    }
  }

  async logout(): Promise<void> {
    await this.simulateNetworkBoundary();

    const state = this.readState();
    this.writeState({
      ...state,
      activeUserId: null,
      activeToken: null,
    });
  }

  async getUserSites(): Promise<readonly SiteDto[]> {
    await this.simulateNetworkBoundary();

    const state = this.readState();
    return state.sites.map((site) => ({ ...site }));
  }

  async createSite(dto: CreateSiteDto): Promise<SiteDto> {
    await this.simulateNetworkBoundary();

    const trimmedName = dto.name.trim();
    const subdomain = normalizeSubdomain(dto.subdomain ?? trimmedName);

    if (!trimmedName || !subdomain) {
      throw new ApiError({
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'El nombre y el subdominio del sitio son obligatorios.',
      });
    }

    const state = this.readState();
    const duplicate = state.sites.some(
      (site) => site.subdomain.toLowerCase() === subdomain.toLowerCase(),
    );

    if (duplicate) {
      throw new ApiError({
        status: 409,
        code: 'SUBDOMAIN_ALREADY_EXISTS',
        message: `El subdominio ${subdomain} ya está en uso.`,
      });
    }

    const nowIso = new Date().toISOString();
    const newSite: SiteDto = {
      id: `site-${state.sites.length + 1}-${Date.now()}`,
      name: trimmedName,
      subdomain,
      status: 'draft',
      ...(dto.category ? { category: dto.category } : {}),
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    this.writeState({
      ...state,
      sites: [...state.sites, newSite],
    });

    return { ...newSite };
  }

  async deleteSite(id: string): Promise<void> {
    await this.simulateNetworkBoundary();

    const state = this.readState();
    const exists = state.sites.some((site) => site.id === id);

    if (!exists) {
      throw new ApiError({
        status: 404,
        code: 'NOT_FOUND',
        message: `No se encontró el sitio con identificador ${id}.`,
      });
    }

    const remainingInstalled = { ...state.installedModulesBySite };
    delete remainingInstalled[id];

    this.writeState({
      ...state,
      sites: state.sites.filter((site) => site.id !== id),
      installedModulesBySite: remainingInstalled,
    });
  }

  async publishSite(id: string): Promise<SiteDto> {
    await this.simulateNetworkBoundary();

    const state = this.readState();
    const target = state.sites.find((site) => site.id === id);

    if (!target) {
      throw new ApiError({
        status: 404,
        code: 'NOT_FOUND',
        message: `No se encontró el sitio con identificador ${id}.`,
      });
    }

    const updatedSite: SiteDto = {
      ...target,
      status: 'published',
      updatedAt: new Date().toISOString(),
    };

    this.writeState({
      ...state,
      sites: state.sites.map((site) => (site.id === id ? updatedSite : site)),
    });

    return { ...updatedSite };
  }

  async getCatalog(): Promise<readonly ModuleDto[]> {
    await this.simulateNetworkBoundary();

    const state = this.readState();
    return state.modules.map((mod) => ({ ...mod }));
  }

  async installModule(siteId: string, moduleId: string): Promise<void> {
    await this.simulateNetworkBoundary();

    const state = this.readState();
    const siteExists = state.sites.some((site) => site.id === siteId);
    const targetModule = state.modules.find((mod) => mod.id === moduleId);

    if (!siteExists || !targetModule) {
      throw new ApiError({
        status: 404,
        code: 'NOT_FOUND',
        message: 'El sitio o el módulo solicitado no existe.',
      });
    }

    const updatedModules = state.modules.map((mod) =>
      mod.id === moduleId ? { ...mod, status: 'installed' as const } : mod,
    );

    const currentForSite = state.installedModulesBySite[siteId] ?? [];
    const nextForSite = currentForSite.includes(moduleId)
      ? currentForSite
      : [...currentForSite, moduleId];

    this.writeState({
      ...state,
      modules: updatedModules,
      installedModulesBySite: {
        ...state.installedModulesBySite,
        [siteId]: nextForSite,
      },
    });
  }

  private async simulateNetworkBoundary(): Promise<void> {
    const span = Math.max(0, this.maxLatencyMs - this.minLatencyMs);
    const delayMs =
      this.minLatencyMs + (span > 0 ? Math.floor(Math.random() * (span + 1)) : 0);

    if (delayMs > 0) {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, delayMs);
      });
    }

    if (this.nextForcedErrorStatus !== null) {
      const forcedStatus = this.nextForcedErrorStatus;
      this.nextForcedErrorStatus = null;
      throw this.createForcedApiError(forcedStatus);
    }
  }

  private createForcedApiError(status: ApiErrorStatus): ApiError {
    switch (status) {
      case 400:
        return new ApiError({
          status: 400,
          code: 'VALIDATION_ERROR',
          message: 'Error de validación simulado en la petición.',
        });
      case 401:
        return new ApiError({
          status: 401,
          code: 'UNAUTHORIZED',
          message: 'Error de autorización simulado.',
        });
      case 404:
        return new ApiError({
          status: 404,
          code: 'NOT_FOUND',
          message: 'Recurso no encontrado (error simulado).',
        });
      case 409:
        return new ApiError({
          status: 409,
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Conflicto de recurso duplicado (error simulado).',
        });
      case 500:
      default:
        return new ApiError({
          status: 500,
          code: 'NETWORK_ERROR',
          message: 'Fallo de red o del servidor simulado. Inténtelo de nuevo.',
        });
    }
  }

  private readState(): MockDatabaseState {
    try {
      const raw = this.storage.getItem(this.storageKey);
      if (!raw) {
        const initial = createInitialMockState();
        this.writeState(initial);
        return initial;
      }

      const parsed: unknown = JSON.parse(raw);
      if (!isValidPersistedState(parsed)) {
        const initial = createInitialMockState();
        this.writeState(initial);
        return initial;
      }

      return parsed;
    } catch {
      const initial = createInitialMockState();
      this.writeState(initial);
      return initial;
    }
  }

  private writeState(state: MockDatabaseState): void {
    this.storage.setItem(this.storageKey, JSON.stringify(state));
  }
}

export function createMockApiAdapter(
  options: MockApiAdapterOptions = {},
): LocalStorageMockApiAdapter {
  return new LocalStorageMockApiAdapter(options);
}
