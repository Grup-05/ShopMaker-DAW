import { describe, expect, it } from 'vitest';
import { ApiError, isApiError } from '../../../src/domain/ports';
import {
  InMemoryStorage,
  createMockApiAdapter,
} from '../../../src/infrastructure/api/mock';

describe('[PBI-003][CA-03] mock-latency-simulation', () => {
  it('respeta la latencia mínima configurada en llamadas asíncronas (rango 200-500 ms)', async () => {
    const adapter = createMockApiAdapter({
      storage: new InMemoryStorage(),
      minLatencyMs: 200,
      maxLatencyMs: 250,
    });

    const start = performance.now();
    await adapter.getCatalog();
    const elapsed = performance.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(185);
  });
});

describe('[PBI-003][CA-04] mock-error-simulation', () => {
  it('rechaza con ApiError 401 cuando las credenciales de login son incorrectas o no hay sesión activa', async () => {
    const adapter = createMockApiAdapter({
      storage: new InMemoryStorage(),
      minLatencyMs: 0,
      maxLatencyMs: 0,
    });

    await expect(
      adapter.login({
        email: 'demo@shopmaker.local',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(ApiError);

    try {
      await adapter.login({
        email: 'demo@shopmaker.local',
        password: 'wrong-password',
      });
    } catch (error) {
      expect(isApiError(error)).toBe(true);
      if (isApiError(error)) {
        expect(error.status).toBe(401);
        expect(error.code).toBe('INVALID_CREDENTIALS');
      }
    }

    await adapter.logout();
    await expect(adapter.me()).rejects.toMatchObject({
      status: 401,
      code: 'UNAUTHORIZED',
    });
  });

  it('rechaza con ApiError 409 al intentar registrar un email duplicado o crear un sitio con subdominio existente', async () => {
    const adapter = createMockApiAdapter({
      storage: new InMemoryStorage(),
      minLatencyMs: 0,
      maxLatencyMs: 0,
    });

    await adapter.register({
      name: 'Usuario Uno',
      email: 'duplicado@shopmaker.local',
      password: 'Password123!',
      acceptTerms: true,
    });

    await expect(
      adapter.register({
        name: 'Usuario Dos',
        email: 'duplicado@shopmaker.local',
        password: 'Password456!',
        acceptTerms: true,
      }),
    ).rejects.toMatchObject({
      status: 409,
      code: 'EMAIL_ALREADY_EXISTS',
    });

    await adapter.createSite({
      name: 'Tienda Unica',
      subdomain: 'tienda-unica',
    });

    await expect(
      adapter.createSite({
        name: 'Otra Tienda',
        subdomain: 'tienda-unica',
      }),
    ).rejects.toMatchObject({
      status: 409,
      code: 'SUBDOMAIN_ALREADY_EXISTS',
    });
  });

  it('rechaza con ApiError 404 al intentar borrar un sitio o instalar un módulo inexistente', async () => {
    const adapter = createMockApiAdapter({
      storage: new InMemoryStorage(),
      minLatencyMs: 0,
      maxLatencyMs: 0,
    });

    await expect(adapter.deleteSite('site-inexistente')).rejects.toMatchObject({
      status: 404,
      code: 'NOT_FOUND',
    });

    const site = await adapter.createSite({ name: 'Sitio Valido' });
    await expect(
      adapter.installModule(site.id, 'modulo-inexistente'),
    ).rejects.toMatchObject({
      status: 404,
      code: 'NOT_FOUND',
    });
  });

  it('permite simular de forma determinista un fallo de red 500 y recuperarse en el siguiente reintento', async () => {
    const adapter = createMockApiAdapter({
      storage: new InMemoryStorage(),
      minLatencyMs: 0,
      maxLatencyMs: 0,
    });

    adapter.simulateNextError(500);

    await expect(adapter.getCatalog()).rejects.toMatchObject({
      status: 500,
      code: 'NETWORK_ERROR',
    });

    // El siguiente intento debe resolverse con éxito (recuperación tras reintento)
    const catalog = await adapter.getCatalog();
    expect(catalog.length).toBeGreaterThan(0);
  });
});
