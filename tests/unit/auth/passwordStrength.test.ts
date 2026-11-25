import { describe, expect, it } from 'vitest';
import { calculatePasswordStrength } from '../../../src/features/auth/application/passwordStrength';

describe('[PBI-005][CA-02] password-strength-live', () => {
  it('devuelve el estado vacío cuando no hay contraseña', () => {
    expect(calculatePasswordStrength('')).toEqual({
      level: 'empty',
      score: 0,
      label: 'Sin contraseña',
    });
  });

  it.each([
    ['abc', 'weak', 'Débil'],
    ['abcdefgh', 'weak', 'Débil'],
    ['Abcdef12', 'medium', 'Media'],
    ['Abcdef12!', 'strong', 'Fuerte'],
    ['Abcdef123456!', 'strong', 'Fuerte'],
  ] as const)(
    'clasifica %s como %s',
    (password, expectedLevel, expectedLabel) => {
      const result = calculatePasswordStrength(password);

      expect(result.level).toBe(expectedLevel);
      expect(result.label).toBe(expectedLabel);
    },
  );

  it('asigna la puntuación esperada según longitud, caso, dígitos y símbolos', () => {
    expect(calculatePasswordStrength('abc').score).toBe(0);
    expect(calculatePasswordStrength('abcdefgh').score).toBe(1);
    expect(calculatePasswordStrength('Abcdef12').score).toBe(3);
    expect(calculatePasswordStrength('Abcdef12!').score).toBe(4);
    expect(calculatePasswordStrength('Abcdef123456!').score).toBe(5);
  });

  it('mantiene una progresión monótona entre niveles', () => {
    const weak = calculatePasswordStrength('abcdefgh').score;
    const medium = calculatePasswordStrength('Abcdef12').score;
    const strong = calculatePasswordStrength('Abcdef12!').score;

    expect(weak).toBeLessThan(medium);
    expect(medium).toBeLessThan(strong);
  });

  it('es determinista y no muta la contraseña de entrada', () => {
    const password = 'Abcdef12!';

    expect(calculatePasswordStrength(password)).toEqual(
      calculatePasswordStrength(password),
    );
    expect(password).toBe('Abcdef12!');
  });
});
