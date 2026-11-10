import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

const featureRoot = resolve(process.cwd(), 'src/features/home');
const layers = ['presentation', 'application', 'domain', 'infrastructure'] as const;
const sourceExtensions = new Set(['.ts', '.tsx']);

function collectSourceFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      return entry.name === 'tests' ? [] : collectSourceFiles(join(directory, entry.name));
    }

    return sourceExtensions.has(extname(entry.name))
      ? [join(directory, entry.name)]
      : [];
  });
}

function importsOf(source: string): string[] {
  const specifiers = new Set<string>();
  const staticImport = /from\s+['"]([^'"]+)['"]/g;
  const sideEffectImport = /import\s+['"]([^'"]+)['"]/g;
  const dynamicImport = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

  for (const pattern of [staticImport, sideEffectImport, dynamicImport]) {
    let match = pattern.exec(source);
    while (match) {
      specifiers.add(match[1]);
      match = pattern.exec(source);
    }
  }

  return [...specifiers];
}

function layerOf(file: string): string {
  return relative(featureRoot, file).split(sep)[0];
}

describe('[PBI-001][CA-02] layer-boundaries', () => {
  it('define las cuatro capas de la feature', () => {
    for (const layer of layers) {
      expect(
        existsSync(join(featureRoot, layer)),
        `Falta la capa ${layer}`,
      ).toBe(true);
    }
  });

  it('respeta la dirección de dependencias permitida', () => {
    const files = collectSourceFiles(featureRoot);
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const sourceLayer = layerOf(file);
      const source = readFileSync(file, 'utf8');

      for (const specifier of importsOf(source)) {
        if (!specifier.startsWith('.')) {
          if (sourceLayer === 'domain') {
            expect(
              specifier,
              `${relative(featureRoot, file)} no debe importar módulos externos`,
            ).not.toMatch(/^(react|react-dom|vite)/);
          }
          continue;
        }

        const targetLayer = layerOf(resolve(dirname(file), specifier));
        const relation = `${sourceLayer} → ${targetLayer}`;

        if (sourceLayer === 'presentation') {
          expect(relation).not.toBe('presentation → infrastructure');
        }

        if (sourceLayer === 'application') {
          expect(relation).not.toBe('application → presentation');
          expect(relation).not.toBe('application → infrastructure');
        }

        if (sourceLayer === 'domain') {
          expect(relation).not.toBe('domain → presentation');
          expect(relation).not.toBe('domain → application');
          expect(relation).not.toBe('domain → infrastructure');
        }

        if (sourceLayer === 'infrastructure') {
          expect(relation).not.toBe('infrastructure → presentation');
        }
      }
    }
  });
});
