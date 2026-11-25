import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getContrastRatio } from '../../../src/shared/lib/colorContrast';

const ROOT_DIR = path.resolve(__dirname, '../../..');
const TOKENS_CSS_PATH = path.join(ROOT_DIR, 'src/shared/styles/tokens.css');
const PRIMITIVES_CSS_PATH = path.join(ROOT_DIR, 'src/shared/styles/primitives.css');
const HOME_CSS_PATH = path.join(ROOT_DIR, 'src/features/home/presentation/home.css');

/**
 * Utilidad robusta para extraer variables CSS de un bloque CSS (ej: :root o [data-theme='dark'])
 */
function extractCssVariables(cssContent: string, selectorPattern: string): Record<string, string> {
  const variables: Record<string, string> = {};
  const regex = new RegExp(`${selectorPattern}\\s*\\{([^}]+)\\}`, 's');
  const match = regex.exec(cssContent);

  if (!match) return variables;

  const declarations = match[1].split(';');
  for (const decl of declarations) {
    const cleanDecl = decl.replace(/\/\*[\s\S]*?\*\//g, '').trim();
    const colonIdx = cleanDecl.indexOf(':');
    if (colonIdx !== -1) {
      const prop = cleanDecl.slice(0, colonIdx).trim();
      const val = cleanDecl.slice(colonIdx + 1).trim();
      if (prop.startsWith('--')) {
        variables[prop] = val;
      }
    }
  }

  return variables;
}

describe('[PBI-002][CA-01] tokens-contraste-aa', () => {
  it('debe existir el archivo src/shared/styles/tokens.css y src/shared/styles/primitives.css', () => {
    expect(
      fs.existsSync(TOKENS_CSS_PATH),
      'El archivo src/shared/styles/tokens.css debe existir con la definición de tokens semánticos.'
    ).toBe(true);

    expect(
      fs.existsSync(PRIMITIVES_CSS_PATH),
      'El archivo src/shared/styles/primitives.css debe existir con las paletas y escalas base.'
    ).toBe(true);
  });

  it('el tema claro debe cumplir ratio de contraste WCAG 2.1 AA (≥ 4.5:1 texto, ≥ 3:1 controles)', () => {
    if (!fs.existsSync(TOKENS_CSS_PATH)) {
      throw new Error('tokens.css no existe aún.');
    }

    const cssContent = fs.readFileSync(TOKENS_CSS_PATH, 'utf8');
    const lightTokens = extractCssVariables(cssContent, ':root');

    expect(Object.keys(lightTokens).length, 'Debe haber tokens definidos para :root').toBeGreaterThan(0);

    // Texto normal frente a fondo y superficie
    const textOnBg = getContrastRatio(lightTokens['--color-text'], lightTokens['--color-bg']);
    expect(textOnBg, `Contraste texto claro sobre fondo (${textOnBg}:1)`).toBeGreaterThanOrEqual(4.5);

    const textOnSurface = getContrastRatio(lightTokens['--color-text'], lightTokens['--color-surface']);
    expect(textOnSurface, `Contraste texto claro sobre superficie (${textOnSurface}:1)`).toBeGreaterThanOrEqual(4.5);

    // Texto atenuado (muted) ≥ 4.5:1
    const mutedOnBg = getContrastRatio(lightTokens['--color-text-muted'], lightTokens['--color-bg']);
    expect(mutedOnBg, `Contraste texto atenuado sobre fondo (${mutedOnBg}:1)`).toBeGreaterThanOrEqual(4.5);

    // Primario contraste
    const primaryContrast = getContrastRatio(lightTokens['--color-primary-contrast'], lightTokens['--color-primary']);
    expect(primaryContrast, `Contraste botón primario (${primaryContrast}:1)`).toBeGreaterThanOrEqual(4.5);

    // Foco frente a superficie
    const focusOnSurface = getContrastRatio(lightTokens['--color-focus'], lightTokens['--color-surface']);
    expect(focusOnSurface, `Contraste anillo de foco (${focusOnSurface}:1)`).toBeGreaterThanOrEqual(3.0);

    // Éxito (medidor de contraseña) frente a superficie
    const successOnSurface = getContrastRatio(lightTokens['--color-success'], lightTokens['--color-surface']);
    expect(successOnSurface, `Contraste éxito sobre superficie (${successOnSurface}:1)`).toBeGreaterThanOrEqual(4.5);
  });

  it('el tema oscuro debe cumplir ratio de contraste WCAG 2.1 AA (≥ 4.5:1 texto, ≥ 3:1 controles)', () => {
    if (!fs.existsSync(TOKENS_CSS_PATH)) {
      throw new Error('tokens.css no existe aún.');
    }

    const cssContent = fs.readFileSync(TOKENS_CSS_PATH, 'utf8');
    const darkTokens = extractCssVariables(cssContent, '\\[data-theme=[\'"]dark[\'"]\\]');

    expect(Object.keys(darkTokens).length, 'Debe haber tokens definidos para [data-theme="dark"]').toBeGreaterThan(0);

    const textOnBg = getContrastRatio(darkTokens['--color-text'], darkTokens['--color-bg']);
    expect(textOnBg, `Contraste texto oscuro sobre fondo (${textOnBg}:1)`).toBeGreaterThanOrEqual(4.5);

    const textOnSurface = getContrastRatio(darkTokens['--color-text'], darkTokens['--color-surface']);
    expect(textOnSurface, `Contraste texto oscuro sobre superficie (${textOnSurface}:1)`).toBeGreaterThanOrEqual(4.5);

    const mutedOnBg = getContrastRatio(darkTokens['--color-text-muted'], darkTokens['--color-bg']);
    expect(mutedOnBg, `Contraste texto atenuado oscuro sobre fondo (${mutedOnBg}:1)`).toBeGreaterThanOrEqual(4.5);

    const primaryContrast = getContrastRatio(darkTokens['--color-primary-contrast'], darkTokens['--color-primary']);
    expect(primaryContrast, `Contraste botón primario oscuro (${primaryContrast}:1)`).toBeGreaterThanOrEqual(4.5);

    const focusOnSurface = getContrastRatio(darkTokens['--color-focus'], darkTokens['--color-surface']);
    expect(focusOnSurface, `Contraste anillo de foco oscuro (${focusOnSurface}:1)`).toBeGreaterThanOrEqual(3.0);

    // Éxito (medidor de contraseña) frente a superficie oscura
    const successOnSurface = getContrastRatio(darkTokens['--color-success'], darkTokens['--color-surface']);
    expect(successOnSurface, `Contraste éxito oscuro sobre superficie (${successOnSurface}:1)`).toBeGreaterThanOrEqual(4.5);
  });
});

describe('[PBI-002][CA-02] sin-color-exclusivo', () => {
  it('los estilos de componentes no deben contener colores hexadecimales hardcodeados', () => {
    const homeCss = fs.readFileSync(HOME_CSS_PATH, 'utf8');
    const hexColorRegex = /#([0-9a-fA-F]{3,8})\b/g;
    const matches = homeCss.match(hexColorRegex) || [];

    expect(
      matches,
      `home.css no debe contener colores hexadecimales fijos; debe consumir tokens semánticos. Encontrados: ${matches.join(', ')}`
    ).toHaveLength(0);
  });
});
