import { describe, expect, it } from 'vitest';
import {
  InMemoryStorage,
  createMockApiAdapter,
} from '../../../src/infrastructure/api/mock';

describe('[PBI-003][CA-02] mock-local-persistence', () => {
  it('conserva usuarios registrados, sesión activa, sitios creados y módulos instalados al recargar instancia', async () => {
    const sharedStorage = new InMemoryStorage();
    const storageKey = 'shopmaker.mock.test.persistence';

    const firstInstance = createMockApiAdapter({
      storage: sharedStorage,
      storageKey,
      minLatencyMs: 0,
      maxLatencyMs: 0,
    });

    const auth = await firstInstance.register({
      name: 'Elena Nito',
      email: 'elena@shopmaker.local',
      password: 'Password123!',
      acceptTerms: true,
    });
    const createdSite = await firstInstance.createSite({
      name: 'Boutique Elena',
      category: 'ecommerce',
    });
    const catalog = await firstInstance.getCatalog();
    const moduleToInstall = catalog[0];
    await firstInstance.installModule(createdSite.id, moduleToInstall.id);

    // Simular recarga completa de navegador creando una segunda instancia sobre el mismo storage
    const reloadedInstance = createMockApiAdapter({
      storage: sharedStorage,
      storageKey,
      minLatencyMs: 0,
      maxLatencyMs: 0,
    });

    const persistedUser = await reloadedInstance.me();
    expect(persistedUser).toEqual(auth.user);

    const persistedSites = await reloadedInstance.getUserSites();
    expect(persistedSites.some((site) => site.id === createdSite.id)).toBe(
      true,
    );

    const persistedCatalog = await reloadedInstance.getCatalog();
    const persistedModule = persistedCatalog.find(
      (mod) => mod.id === moduleToInstall.id,
    );
    expect(persistedModule?.status).toBe('installed');
  });

  it('restablece los fixtures iniciales de forma segura si el JSON en localStorage está corrupto', async () => {
    const sharedStorage = new InMemoryStorage();
    const storageKey = 'shopmaker.mock.test.corrupted';
    sharedStorage.setItem(storageKey, '{corrupted-json-payload');

    const adapter = createMockApiAdapter({
      storage: sharedStorage,
      storageKey,
      minLatencyMs: 0,
      maxLatencyMs: 0,
    });

    const catalog = await adapter.getCatalog();
    expect(catalog.length).toBeGreaterThan(0);
  });
});
