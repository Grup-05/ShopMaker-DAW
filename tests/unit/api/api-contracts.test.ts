import { describe, expect, it } from 'vitest';
import {
  InMemoryStorage,
  createMockApiAdapter,
} from '../../../src/infrastructure/api/mock';

describe('[PBI-003][CA-04] api-contracts-validation', () => {
  it('valida la estructura estricta de AuthResponseDto y UserDto sin exponer contraseñas', async () => {
    const adapter = createMockApiAdapter({
      storage: new InMemoryStorage(),
      minLatencyMs: 0,
      maxLatencyMs: 0,
    });

    const response = await adapter.register({
      name: 'Ana García',
      email: 'ana@shopmaker.local',
      password: 'PasswordSegura123!',
      acceptTerms: true,
    });

    expect(response).toEqual({
      token: expect.any(String),
      user: {
        id: expect.any(String),
        name: 'Ana García',
        email: 'ana@shopmaker.local',
      },
    });
    expect(response.token.length).toBeGreaterThan(10);
    expect('password' in response.user).toBe(false);
  });

  it('valida la estructura de SiteDto con subdominio normalizado .shopmaker.local y timestamps ISO', async () => {
    const adapter = createMockApiAdapter({
      storage: new InMemoryStorage(),
      minLatencyMs: 0,
      maxLatencyMs: 0,
    });

    const created = await adapter.createSite({
      name: 'Mi Tienda Artesanal',
      category: 'ecommerce',
    });

    expect(created).toEqual({
      id: expect.any(String),
      name: 'Mi Tienda Artesanal',
      subdomain: 'mi-tienda-artesanal.shopmaker.local',
      status: 'draft',
      category: 'ecommerce',
      createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      updatedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
    });
  });

  it('valida la estructura de ModuleDto en el catálogo inicial del CMS', async () => {
    const adapter = createMockApiAdapter({
      storage: new InMemoryStorage(),
      minLatencyMs: 0,
      maxLatencyMs: 0,
    });

    const catalog = await adapter.getCatalog();

    expect(catalog.length).toBeGreaterThanOrEqual(4);
    for (const mod of catalog) {
      expect(mod).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          category: expect.any(String),
          status: expect.stringMatching(/^(available|installed|featured)$/),
          version: expect.stringMatching(/^\d+\.\d+\.\d+$/),
        }),
      );
    }
  });
});

describe('[PBI-003][CA-01] mock-implements-ports', () => {
  it('implementa el ciclo completo de AuthApiPort (register, login, me, recoverPassword y logout)', async () => {
    const adapter = createMockApiAdapter({
      storage: new InMemoryStorage(),
      minLatencyMs: 0,
      maxLatencyMs: 0,
    });

    const registered = await adapter.register({
      name: 'Carlos Ruiz',
      email: 'carlos@shopmaker.local',
      password: 'ClaveFuerte!2026',
      acceptTerms: true,
    });
    expect(registered.user.email).toBe('carlos@shopmaker.local');

    const current = await adapter.me();
    expect(current.id).toBe(registered.user.id);

    await adapter.logout();

    const relogin = await adapter.login({
      email: 'carlos@shopmaker.local',
      password: 'ClaveFuerte!2026',
      rememberMe: true,
    });
    expect(relogin.user.email).toBe('carlos@shopmaker.local');

    await expect(
      adapter.recoverPassword('carlos@shopmaker.local'),
    ).resolves.toBeUndefined();
  });

  it('implementa el ciclo completo de SitesApiPort (getUserSites, createSite y deleteSite)', async () => {
    const adapter = createMockApiAdapter({
      storage: new InMemoryStorage(),
      minLatencyMs: 0,
      maxLatencyMs: 0,
    });

    const initialSites = await adapter.getUserSites();
    const created = await adapter.createSite({
      name: 'Portfolio Creativo',
      subdomain: 'portfolio-creativo',
      category: 'portfolio',
    });

    const afterCreate = await adapter.getUserSites();
    expect(afterCreate).toHaveLength(initialSites.length + 1);
    expect(afterCreate.some((site) => site.id === created.id)).toBe(true);

    await adapter.deleteSite(created.id);
    const afterDelete = await adapter.getUserSites();
    expect(afterDelete).toHaveLength(initialSites.length);
    expect(afterDelete.some((site) => site.id === created.id)).toBe(false);
  });

  it('implementa ModulesApiPort permitiendo instalar un módulo sobre un sitio existente', async () => {
    const adapter = createMockApiAdapter({
      storage: new InMemoryStorage(),
      minLatencyMs: 0,
      maxLatencyMs: 0,
    });

    const site = await adapter.createSite({ name: 'Web Corporativa' });
    const catalogBefore = await adapter.getCatalog();
    const targetModule = catalogBefore.find((m) => m.status !== 'installed');
    expect(targetModule).toBeDefined();

    await adapter.installModule(site.id, targetModule!.id);

    const catalogAfter = await adapter.getCatalog();
    const updatedModule = catalogAfter.find((m) => m.id === targetModule!.id);
    expect(updatedModule?.status).toBe('installed');
  });
});
