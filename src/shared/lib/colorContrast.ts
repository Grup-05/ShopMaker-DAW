/**
 * Utilidad matemática para el cálculo de luminancia relativa y ratio de contraste
 * según las pautas de accesibilidad WCAG 2.1 (W3C).
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Convierte un color hexadecimal (#RGB o #RRGGBB) a RGB.
 */
export function hexToRgb(hex: string): RGB {
  let cleaned = hex.trim().replace(/^#/, '');

  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((char) => char + char)
      .join('');
  }

  if (cleaned.length !== 6) {
    throw new Error(`Color hexadecimal inválido: ${hex}`);
  }

  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Calcula la luminancia relativa de un color RGB según WCAG 2.1.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function getRelativeLuminance({ r, g, b }: RGB): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    const sRGB = val / 255;
    return sRGB <= 0.04045 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calcula el ratio de contraste entre dos colores (hexadecimales).
 * Devuelve un número de la forma X (por ejemplo 4.5 para ratio 4.5:1).
 */
export function getContrastRatio(colorA: string, colorB: string): number {
  const lumA = getRelativeLuminance(hexToRgb(colorA));
  const lumB = getRelativeLuminance(hexToRgb(colorB));

  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}
