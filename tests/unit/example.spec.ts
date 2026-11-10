import { describe, it, expect } from 'vitest';
import { slugify } from '@/shared/lib/slugify';

describe('[PBI-004][CA-04] Utilidad slugify (Ejemplo Demostrativo TDD)', () => {
  it('debe convertir un título con espacios y mayúsculas en un slug en minúsculas con guiones', () => {
    const input = 'Mi Primera Web';
    const expected = 'mi-primera-web';

    expect(slugify(input)).toBe(expected);
  });

  it('debe eliminar caracteres especiales y normalizar tildes', () => {
    const input = '¡Módulos & Configuración!';
    const expected = 'modulos-configuracion';

    expect(slugify(input)).toBe(expected);
  });
});
