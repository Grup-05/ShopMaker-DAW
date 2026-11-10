import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const srcRoot = resolve(process.cwd(), 'src');
const sourceExtensions = new Set(['.ts', '.tsx']);
const forbiddenModules = new Set([
  'fs',
  'path',
  'os',
  'child_process',
  'http',
  'https',
  'net',
  'tls',
  'crypto',
  'stream',
  'zlib',
  'util',
  'url',
  'worker_threads',
  'process',
]);
const secretPatterns = [
  /gh[pousr]_[A-Za-z0-9_]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
];

function collectClientFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return entry.name === 'tests' || entry.name === 'test'
        ? []
        : collectClientFiles(fullPath);
    }

    if (!sourceExtensions.has(extname(entry.name))) {
      return [];
    }

    if (/\.(test|spec)\.(ts|tsx)$/.test(entry.name)) {
      return [];
    }

    return [fullPath];
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

describe('[PBI-001][CA-03] client-browser-only', () => {
  it('encuentra código de cliente que inspeccionar', () => {
    const files = collectClientFiles(srcRoot);
    expect(files.length).toBeGreaterThan(0);
  });

  it('no usa APIs de Node ni del sistema de archivos', () => {
    for (const file of collectClientFiles(srcRoot)) {
      const source = readFileSync(file, 'utf8');

      for (const specifier of importsOf(source)) {
        if (specifier.startsWith('node:')) {
          throw new Error(`${file} importa ${specifier}`);
        }

        const rootModule = specifier.split('/')[0];
        if (forbiddenModules.has(rootModule)) {
          throw new Error(`${file} importa ${specifier}`);
        }
      }

      expect(source, `${file} usa require()`).not.toMatch(
        /\brequire\s*\(/,
      );
      expect(source, `${file} usa variables exclusivas de Node`).not.toMatch(
        /\b(__dirname|__filename|Buffer)\b/,
      );
      expect(source, `${file} usa process.env`).not.toMatch(
        /process\.env/,
      );
    }
  });

  it('no contiene secretos evidentes', () => {
    for (const file of collectClientFiles(srcRoot)) {
      const source = readFileSync(file, 'utf8');

      for (const pattern of secretPatterns) {
        expect(source, `${file} contiene un posible secreto`).not.toMatch(
          pattern,
        );
      }
    }
  });
});
