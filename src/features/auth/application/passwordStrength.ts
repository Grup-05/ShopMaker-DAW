export type PasswordStrengthLevel = 'empty' | 'weak' | 'medium' | 'strong';

export type PasswordStrengthScore = 0 | 1 | 2 | 3 | 4 | 5;

export interface PasswordStrength {
  readonly level: PasswordStrengthLevel;
  readonly score: PasswordStrengthScore;
  readonly label: string;
}

const STRENGTH_LABELS: Record<PasswordStrengthLevel, string> = {
  empty: 'Sin contraseña',
  weak: 'Débil',
  medium: 'Media',
  strong: 'Fuerte',
};

/**
 * Heurística pura y determinista para estimar la fortaleza de una contraseña.
 *
 * Puntos: longitud ≥ 8, longitud ≥ 12, mezcla de mayúsculas/minúsculas,
 * al menos un dígito y al menos un símbolo (máximo 5).
 */
export function calculatePasswordStrength(
  password: string,
): PasswordStrength {
  if (password.length === 0) {
    return {
      level: 'empty',
      score: 0,
      label: STRENGTH_LABELS.empty,
    };
  }

  let points = 0;

  if (password.length >= 8) {
    points += 1;
  }

  if (password.length >= 12) {
    points += 1;
  }

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    points += 1;
  }

  if (/\d/.test(password)) {
    points += 1;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    points += 1;
  }

  const score = Math.min(points, 5) as PasswordStrengthScore;
  const level: PasswordStrengthLevel =
    score <= 2 ? 'weak' : score === 3 ? 'medium' : 'strong';

  return {
    level,
    score,
    label: STRENGTH_LABELS[level],
  };
}
